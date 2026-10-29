import { authKeyName, authUrl, publicAuthKey } from "../shared/supabase-config.mjs";
// Public readiness endpoint: fixed env names/statuses only, never values or rows.
// TES KONEKSI AWAL mode otomatis: mengetes TiDB Cloud DAN Aiven, lalu
// memberi keputusan — cloudReady + effectiveProvider + decision
// ("cloud" bila salah satu terhubung & skemanya siap, selain itu
// "local" → klien memakai SQLite/localStorage). Lihat docs/036_mode-lokal_26102026_0819.md.
import { tidbOptions, getTidbPool } from "./tidb.mjs";
import { probeAiven } from "./aiven.mjs";
import { serverMode } from "./local-mode.mjs";
import { getSharedCache } from "./redis.mjs";
import { isBetterAuthConfigured, probeBetterAuthSchema } from "./better-auth.mjs";

const STATUS_CACHE_KEY = "codeshark:dbstatus:v1";

const REQUIRED = ["TIDB_HOST", "TIDB_USER", "TIDB_PASSWORD", "TIDB_DATABASE"];
const SYSTEM_DATABASES = new Set(["sys", "mysql", "information_schema", "performance_schema"]);
const QUERIES = [
  "SELECT owner_id, device_id, name, age_group FROM cs_profiles LIMIT 0",
  "SELECT owner_id, xp, coins, modules, stats, save_data, client_sent_at FROM cs_saves LIMIT 0",
  "SELECT owner_id, id, device_id, session_id, won, stars, score, accuracy, wpm, max_combo, xp_award, coins_award, passed, played_at FROM cs_attempts LIMIT 0",
  "SELECT version FROM cs_schema_migrations WHERE version = '001_initial_tidb' LIMIT 1",
];
// Probe fitur 002 (Profil & Membership): kegagalan di sini TIDAK mengubah
// state inti — sync 001 tetap "connected", fitur dilaporkan terpisah di
// `features.gamificationSchema` agar operator tahu migrasi 002 belum jalan.
const GAMIFICATION_QUERIES = [
  "SELECT owner_id, plan, role, cohort_code FROM cs_memberships LIMIT 0",
  "SELECT owner_id, xp, coins, rank_name, streak_tier FROM cs_gamification LIMIT 0",
  "SELECT owner_id, achievement_id, progress, claimed_at FROM cs_achievements LIMIT 0",
  "SELECT owner_id, badge_id, source, awarded_at FROM cs_badges LIMIT 0",
  "SELECT owner_id, activity_date, attempts_count FROM cs_attention_days LIMIT 0",
  "SELECT version FROM cs_schema_migrations WHERE version = '002_gamification_profile_membership' LIMIT 1",
];
const isTimeout = (error) => ["ETIMEDOUT", "PROTOCOL_SEQUENCE_TIMEOUT"].includes(error?.code);
const configured = (value) => typeof value === "string" && value.trim() !== "" && !["<PASSWORD>", "<CA_PATH>", "&lt;PASSWORD&gt;", "&lt;CA_PATH&gt;"].includes(value.trim());

export function environmentReport(env) {
  const provider = (env.DB_PROVIDER || "").trim().toLowerCase();
  const betterAuthReady = isBetterAuthConfigured(env);
  const fields = [
    // DB_PROVIDER kini opsional: kosong = deteksi otomatis (TiDB lalu Aiven).
    { name: "DB_PROVIDER", required: false, status: ["tidb", "aiven"].includes(provider) ? "set" : configured(env.DB_PROVIDER) ? "invalid" : "default" },
    ...REQUIRED.map((name) => ({ name, required: true, status: configured(env[name]) ? "set" : "missing" })),
    { name: "TIDB_PORT", required: false, status: configured(env.TIDB_PORT) ? "set" : "default" },
    { name: "TIDB_CA_PATH", required: false, status: configured(env.TIDB_CA_PATH) ? "set" : "optional" },
    { name: "TIDB_CA_CERT", required: false, status: configured(env.TIDB_CA_CERT) ? "set" : "optional" },
    { name: "SUPABASE_JWKS_URL", required: false, status: configured(env.SUPABASE_JWKS_URL) ? "set" : "default" },
    // Supabase kini legacy: wajib hanya bila Better Auth belum siap.
    ...["SUPABASE_URL", authKeyName(env)].map((name) => ({ name, required: !betterAuthReady, status: configured(env[name]) ? "set" : "missing" })),
    { name: "LAYERBASE_DATABASE_URL", required: false, status: configured(env.LAYERBASE_DATABASE_URL) ? "set" : "optional" },
    { name: "LAYERBASE_HOST", required: false, status: configured(env.LAYERBASE_HOST) ? "set" : "optional" },
    { name: "LAYERBASE_USERNAME", required: false, status: configured(env.LAYERBASE_USERNAME) ? "set" : "optional" },
    { name: "LAYERBASE_DATABASE", required: false, status: configured(env.LAYERBASE_DATABASE) ? "set" : "optional" },
    { name: "LAYERBASE_PORT", required: false, status: configured(env.LAYERBASE_PORT) ? "set" : "default" },
    { name: "LAYERBASE_PASSWORD", required: false, status: configured(env.LAYERBASE_PASSWORD) ? "set" : "optional" },
    { name: "AUTH_DATABASE_URL", required: false, status: configured(env.AUTH_DATABASE_URL) ? "set" : "optional" },
    { name: "DATABASE_URL", required: false, status: configured(env.DATABASE_URL) ? "set" : "optional" },
    { name: "BETTER_AUTH_SECRET", required: false, status: configured(env.BETTER_AUTH_SECRET) ? "set" : "optional" },
    { name: "BETTER_AUTH_URL", required: false, status: configured(env.BETTER_AUTH_URL) ? "set" : "default" },
  ];
  if (configured(env.SUPABASE_URL)) {
    try {
      authUrl(env.SUPABASE_URL);
    } catch { fields.find((f) => f.name === "SUPABASE_URL").status = "invalid"; }
  }
  const keyField = fields.find(f => f.name === authKeyName(env));
  try { publicAuthKey(env[keyField.name]); }
  catch { keyField.status = "invalid"; }
  if (configured(env.SUPABASE_JWKS_URL)) {
    try {
      if (env.SUPABASE_JWKS_URL.trim() !== `${authUrl(env.SUPABASE_URL)}/auth/v1/.well-known/jwks.json`) throw new Error();
    } catch { fields.find(f => f.name === "SUPABASE_JWKS_URL").status = "invalid"; }
  }
  return fields;
}

export function createDatabaseStatusService(dependencies = {}) {
  const { env = process.env, pool = getTidbPool, options = tidbOptions, now = Date.now, ttlMs = 30000, timeoutMs = 8000, queries = QUERIES, gamificationQueries = GAMIFICATION_QUERIES, aivenProbe = probeAiven, authSchemaProbe = probeBetterAuthSchema } = dependencies;
  // Redis (bila terkonfigurasi) menjadi cache bersama antar-instance serverless;
  // cache: null secara eksplisit = paksa tanpa Redis (dipakai tes admin "fresh").
  const sharedCache = Object.hasOwn(dependencies, "cache") ? dependencies.cache : getSharedCache(env);
  let cached;
  let expiresAt = 0;
  let inFlight;

  /** Probe TiDB — perilaku sama seperti versi awal (state kompatibel). */
  async function inspectTidb(environment) {
    const tidb = { state: "disabled", database: "not_checked", schema: "not_checked", tls: "not_checked", gamificationSchema: "not_checked" };
    const forcedProvider = (env.DB_PROVIDER || "").trim().toLowerCase();
    const tidbConfigured = REQUIRED.every((name) => configured(env[name]));
    if (forcedProvider === "aiven") return tidb; // operator memaksa Aiven
    if (!tidbConfigured) {
      // Kompatibel lama: DB_PROVIDER=tidb tanpa kredensial = env_incomplete.
      return { ...tidb, state: forcedProvider === "tidb" ? "env_incomplete" : "disabled" };
    }
    try {
      if (SYSTEM_DATABASES.has(env.TIDB_DATABASE.toLowerCase())) throw new Error("Application database required");
      options(env); // Includes CA file existence, PEM form, port and TLS checks.
    } catch { return { ...tidb, state: "config_invalid" }; }

    let connection;
    let timedOut = false;
    let unusable = false;
    let timer;
    const probe = (async () => {
      try {
        connection = await pool().getConnection();
        if (timedOut) return { ...tidb, state: "timeout" };
        await connection.query({ sql: "SELECT 1 AS healthy", timeout: 3000 });
        tidb.database = "connected";
        tidb.tls = "verified"; // The production pool requires verified TLS.
        try {
          for (const sql of queries) {
            if (timedOut) return { ...tidb, state: "timeout" };
            const [rows] = await connection.query({ sql, timeout: 3000 });
            if (sql.includes("cs_schema_migrations") && !rows.length) {
              return { ...tidb, schema: "missing", state: "schema_missing" };
            }
          }
          // Skema inti siap. Probe fitur 002 pada koneksi yang sama;
          // kegagalannya hanya menandai fitur, bukan state inti.
          let gamificationSchema = "ready";
          try {
            for (const sql of gamificationQueries) {
              if (timedOut) return { ...tidb, schema: "ready", state: "timeout" };
              const [rows] = await connection.query({ sql, timeout: 3000 });
              if (sql.includes("002_gamification") && !rows.length) { gamificationSchema = "missing"; break; }
            }
          } catch (error) {
            if (isTimeout(error)) { unusable = true; return { ...tidb, schema: "ready", state: "timeout" }; }
            gamificationSchema = "missing";
          }
          return { ...tidb, schema: "ready", state: "connected", gamificationSchema };
        } catch (error) {
          if (isTimeout(error)) { unusable = true; return { ...tidb, state: "timeout" }; }
          return { ...tidb, schema: "missing", state: "schema_missing" };
        }
      } catch (error) {
        unusable = isTimeout(error);
        return { ...tidb, state: unusable ? "timeout" : "connection_failed" };
      } finally {
        if (connection) {
          if (timedOut || unusable) connection.destroy();
          else connection.release();
        }
      }
    })();
    try {
      return await Promise.race([
        probe,
        new Promise((resolve) => { timer = setTimeout(() => { timedOut = true; resolve({ ...tidb, state: "timeout" }); }, timeoutMs); }),
      ]);
    } finally { clearTimeout(timer); }
  }

  async function inspect() {
    const started = now();
    const environment = environmentReport(env);
    const supabaseIdentityConfigured = environment
      .filter((f) => f.name.startsWith("SUPABASE_"))
      .every((f) => f.status === "set" || f.status === "default");
    const betterAuthConfigured = isBetterAuthConfigured(env);
    const identityConfigured = betterAuthConfigured || supabaseIdentityConfigured;

    const tidb = await inspectTidb(environment);
    let aiven;
    try { aiven = await aivenProbe(env); }
    catch { aiven = { configured: true, kind: null, state: "connection_failed", schema: "not_checked" }; }

    const providers = {
      tidb: {
        configured: REQUIRED.every((name) => configured(env[name])) || (env.DB_PROVIDER || "").trim().toLowerCase() === "tidb",
        state: tidb.state,
        schema: tidb.schema,
      },
      aiven,
    };
    // Prioritas mengikuti DB_PROVIDER bila dipaksa; provider pertama
    // yang BENAR-BENAR terhubung (tes awal = "ya") memenangkan mode cloud.
    const order = (env.DB_PROVIDER || "").trim().toLowerCase() === "aiven" ? ["aiven", "tidb"] : ["tidb", "aiven"];
    const effectiveProvider = order.find((name) => providers[name].state === "connected") ?? null;
    const cloudReady = effectiveProvider !== null;

    // Kesiapan fitur: skema auth Layerbase (probe koneksi singkat, hanya
    // bila Better Auth terkonfigurasi) + skema gamifikasi 002 di TiDB.
    let authSchema = "not_configured";
    if (betterAuthConfigured) {
      try { authSchema = await authSchemaProbe(env); }
      catch { authSchema = "connection_failed"; }
    }
    const gamificationSchema = tidb.gamificationSchema ?? "not_checked";
    const profileReady = tidb.state === "connected" && gamificationSchema === "ready" && identityConfigured;

    return {
      // Bidang utama tetap mencerminkan TiDB (kompatibilitas klien/admin lama).
      state: tidb.state,
      checkedAt: new Date(started).toISOString(),
      durationMs: Math.max(0, now() - started),
      database: tidb.database,
      schema: tidb.schema,
      tls: tidb.tls,
      identityConfigured,
      auth: {
        provider: betterAuthConfigured ? "better-auth" : supabaseIdentityConfigured ? "supabase" : null,
        configured: identityConfigured,
        betterAuthConfigured,
        supabaseConfigured: supabaseIdentityConfigured,
      },
      syncPrerequisitesReady: cloudReady && identityConfigured,
      environment,
      // Keputusan mode otomatis.
      mode: serverMode(env),
      cloudReady,
      effectiveProvider,
      decision: cloudReady ? "cloud" : "local",
      providers,
      // Kesiapan per-fitur (aditif; klien lama mengabaikan bidang ini).
      features: {
        gamificationSchema,
        authSchema,
        profile: profileReady,
        membership: profileReady,
      },
    };
  }

  return async () => {
    if (cached && now() < expiresAt) return cached;
    if (sharedCache && !inFlight) {
      try {
        const raw = await sharedCache.get(STATUS_CACHE_KEY);
        if (raw) {
          cached = JSON.parse(raw);
          expiresAt = now() + ttlMs;
          return cached;
        }
      } catch { /* Redis gagal tidak boleh menggagalkan probe */ }
    }
    if (!inFlight) {
      inFlight = inspect().then(async (report) => {
        cached = report;
        expiresAt = now() + ttlMs;
        if (sharedCache) {
          try { await sharedCache.set(STATUS_CACHE_KEY, JSON.stringify(report), Math.max(1, Math.round(ttlMs / 1000))); }
          catch { /* abaikan */ }
        }
        return report;
      }).finally(() => { inFlight = undefined; });
    }
    return inFlight;
  };
}

export function createDatabaseStatusHandler(dependencies = {}) {
  const inspect = createDatabaseStatusService(dependencies);
  return async (req, res) => {
    res.setHeader?.("Cache-Control", "no-store");
    res.setHeader?.("X-Content-Type-Options", "nosniff");
    if (req.method !== "GET") {
      res.setHeader?.("Allow", "GET");
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }
    const report = await inspect();
    // 200 bila ADA provider cloud yang siap (TiDB atau Aiven).
    return res.status(report.cloudReady ? 200 : 503).json({ ...report, cacheSeconds: 30 });
  };
}
