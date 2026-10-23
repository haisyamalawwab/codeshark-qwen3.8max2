import { authKeyName, authUrl, publicAuthKey } from "../shared/supabase-config.mjs";
// Public readiness endpoint: fixed env names/statuses only, never values or rows.
import { tidbOptions, getTidbPool } from "./tidb.mjs";

const REQUIRED = ["TIDB_HOST", "TIDB_USER", "TIDB_PASSWORD", "TIDB_DATABASE"];
const SYSTEM_DATABASES = new Set(["sys", "mysql", "information_schema", "performance_schema"]);
const QUERIES = [
  "SELECT owner_id, device_id, name, age_group FROM cs_profiles LIMIT 0",
  "SELECT owner_id, xp, coins, modules, stats, save_data, client_sent_at FROM cs_saves LIMIT 0",
  "SELECT owner_id, id, device_id, session_id, won, stars, score, accuracy, wpm, max_combo, xp_award, coins_award, passed, played_at FROM cs_attempts LIMIT 0",
  "SELECT version FROM cs_schema_migrations WHERE version = '001_initial_tidb' LIMIT 1",
];
const isTimeout = (error) => ["ETIMEDOUT", "PROTOCOL_SEQUENCE_TIMEOUT"].includes(error?.code);
const configured = (value) => typeof value === "string" && value.trim() !== "" && !["<PASSWORD>", "<CA_PATH>", "&lt;PASSWORD&gt;", "&lt;CA_PATH&gt;"].includes(value.trim());

export function environmentReport(env) {
  const fields = [
    { name: "DB_PROVIDER", required: true, status: env.DB_PROVIDER === "tidb" ? "set" : configured(env.DB_PROVIDER) ? "invalid" : "missing" },
    ...REQUIRED.map((name) => ({ name, required: true, status: configured(env[name]) ? "set" : "missing" })),
    { name: "TIDB_PORT", required: false, status: configured(env.TIDB_PORT) ? "set" : "default" },
    { name: "TIDB_CA_PATH", required: false, status: configured(env.TIDB_CA_PATH) ? "set" : "optional" },
    { name: "TIDB_CA_CERT", required: false, status: configured(env.TIDB_CA_CERT) ? "set" : "optional" },
    { name: "SUPABASE_JWKS_URL", required: false, status: configured(env.SUPABASE_JWKS_URL) ? "set" : "default" },
    ...["SUPABASE_URL", authKeyName(env)].map((name) => ({ name, required: true, status: configured(env[name]) ? "set" : "missing" })),
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

export function createDatabaseStatusService({ env = process.env, pool = getTidbPool, options = tidbOptions, now = Date.now, ttlMs = 30000, timeoutMs = 8000, queries = QUERIES } = {}) {
  let cached;
  let expiresAt = 0;
  let inFlight;

  async function inspect() {
    const started = now();
    const environment = environmentReport(env);
    const identityConfigured = environment.filter((f) => f.name.startsWith("SUPABASE_")).every((f) => f.status === "set" || (!f.required && f.status === "default"));
    const report = {
      state: "env_incomplete", checkedAt: new Date(started).toISOString(), durationMs: 0,
      database: "not_checked", schema: "not_checked", tls: "not_checked",
      identityConfigured, syncPrerequisitesReady: false, environment,
    };
    const done = (state) => ({ ...report, state, durationMs: Math.max(0, now() - started) });
    if (env.DB_PROVIDER !== "tidb") return done("disabled");
    if (environment.some((f) => REQUIRED.includes(f.name) && f.status === "missing")) return done("env_incomplete");
    try {
      if (SYSTEM_DATABASES.has(env.TIDB_DATABASE.toLowerCase())) throw new Error("Application database required");
      options(env); // Includes CA file existence, PEM form, port and TLS checks.
    } catch { return done("config_invalid"); }

    let connection;
    let timedOut = false;
    let unusable = false;
    let timer;
    const probe = (async () => {
      try {
        connection = await pool().getConnection();
        if (timedOut) return done("timeout");
        await connection.query({ sql: "SELECT 1 AS healthy", timeout: 3000 });
        report.database = "connected";
        report.tls = "verified"; // The production pool requires verified TLS.
        try {
          for (const sql of queries) {
            if (timedOut) return done("timeout");
            const [rows] = await connection.query({ sql, timeout: 3000 });
            if (sql.includes("cs_schema_migrations") && !rows.length) {
              report.schema = "missing";
              return done("schema_missing");
            }
          }
          report.schema = "ready";
          report.syncPrerequisitesReady = identityConfigured;
          return done("connected");
        } catch (error) {
          if (isTimeout(error)) { unusable = true; return done("timeout"); }
          report.schema = "missing";
          return done("schema_missing");
        }
      } catch (error) {
        unusable = isTimeout(error);
        return done(unusable ? "timeout" : "connection_failed");
      }
      finally {
        if (connection) {
          if (timedOut || unusable) connection.destroy();
          else connection.release();
        }
      }
    })();
    try {
      return await Promise.race([
        probe,
        new Promise((resolve) => { timer = setTimeout(() => { timedOut = true; resolve(done("timeout")); }, timeoutMs); }),
      ]);
    } finally { clearTimeout(timer); }
  }

  return async () => {
    if (cached && now() < expiresAt) return cached;
    if (!inFlight) {
      inFlight = inspect().then((report) => {
        cached = report;
        expiresAt = now() + ttlMs;
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
    return res.status(report.state === "connected" ? 200 : 503).json({ ...report, cacheSeconds: 30 });
  };
}
