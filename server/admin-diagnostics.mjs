// ============================================================
// DIAGNOSTIK ADMIN — tes koneksi mendalam untuk halaman /admin/.
// Berbeda dari /api/database-status (publik, ter-cache 30 dtk,
// hanya status), endpoint ini:
//   - WAJIB terotorisasi admin (sesi Better Auth role/admin allowlist,
//     JWT Supabase + ADMIN_USER_IDS, ATAU header x-admin-token yang
//     cocok dengan ADMIN_TEST_TOKEN
//     bila env itu disetel — berguna sebelum Auth selesai disetup);
//   - selalu FRESH (melewati cache in-memory maupun Redis);
//   - mengukur latensi per provider: TiDB Cloud MySQL, Aiven
//     (MySQL/PostgreSQL), dan Redis (PING + tulis/baca kunci tes);
//   - boleh memuat host/nama database (admin tepercaya) tetapi
//     TIDAK PERNAH password, token, atau connection string utuh.
// Read-only terhadap database aplikasi (SELECT/SHOW saja).
// ============================================================
import { createHash, timingSafeEqual } from "node:crypto";
import { createDatabaseStatusService } from "./database-status.mjs";
import { probeAiven, aivenUrl, aivenKind } from "./aiven.mjs";
import { probeRedis, redisConfig } from "./redis.mjs";
import { requireAdmin } from "./site-settings.mjs";
import { hasBetterAuthSessionCookie, probeBetterAuthDatabase } from "./better-auth.mjs";
import { serverMode } from "./local-mode.mjs";

const digest = (value) => createHash("sha256").update(String(value)).digest();

/** Benar bila header x-admin-token cocok dengan ADMIN_TEST_TOKEN (konstan-waktu). */
export function adminTokenOk(req, env = process.env) {
  const expected = (env.ADMIN_TEST_TOKEN || "").trim();
  if (!expected) return false;
  const given = req.headers?.["x-admin-token"];
  if (typeof given !== "string" || !given) return false;
  return timingSafeEqual(digest(given), digest(expected));
}

async function authorize(req, env, request, verifyAdmin, authDeps = {}) {
  if (adminTokenOk(req, env)) return "token";
  if ((env.ADMIN_TEST_TOKEN || "").trim() && req.headers?.["x-admin-token"]) {
    throw Object.assign(new Error("Token admin tidak cocok."), { status: 403 });
  }
  const betterAuthCookie = hasBetterAuthSessionCookie(req);
  if (!req.headers?.authorization && !betterAuthCookie) {
    throw Object.assign(
      new Error("Login admin atau token tes (ADMIN_TEST_TOKEN) diperlukan untuk diagnostik."),
      { status: 401 },
    );
  }
  await verifyAdmin(req, env, request, authDeps);
  return betterAuthCookie ? "better-auth" : "supabase";
}

function aivenHost(env) {
  try { return new URL(aivenUrl(env)).hostname || null; } catch { return null; }
}
function aivenDatabase(env) {
  try { return decodeURIComponent(new URL(aivenUrl(env)).pathname.replace(/^\//, "")) || null; } catch { return null; }
}

export function createAdminDiagnosticsHandler(dependencies = {}) {
  const {
    env = process.env,
    request = fetch,
    now = Date.now,
    verifyAdmin = requireAdmin,
    statusService = () => createDatabaseStatusService({ env, cache: null, ttlMs: 0 }),
    aivenProbe = probeAiven,
    redisProbe = probeRedis,
    betterAuthProbe = probeBetterAuthDatabase,
    authDeps = {},
  } = dependencies;

  return async (req, res) => {
    res.setHeader?.("Cache-Control", "no-store");
    res.setHeader?.("X-Content-Type-Options", "nosniff");
    if (req.method !== "GET") {
      res.setHeader?.("Allow", "GET");
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }
    let via;
    try {
      via = await authorize(req, env, request, verifyAdmin, authDeps);
    } catch (error) {
      const status = Number.isInteger(error?.status) ? error.status : 401;
      return res.status(status).json({ ok: false, error: status === 503 ? "Otorisasi admin belum terkonfigurasi di server." : error.message || "Tidak terotorisasi." });
    }

    try {
      const started = now();
      // Probe TiDB (+ Aiven di dalam laporan status) — instance baru
      // tanpa cache apa pun agar hasil tes benar-benar saat ini.
      const report = await statusService()();
      // Ukur Aiven & Redis terpisah agar latensinya terbaca sendiri.
      const aivenStarted = now();
      const aiven = await aivenProbe(env).catch(() => ({ configured: true, kind: aivenKind(aivenUrl(env)), state: "connection_failed", schema: "not_checked" }));
      const aivenLatencyMs = aiven.state === "connected" ? Math.max(0, now() - aivenStarted) : null;
      const redis = await redisProbe(env).catch(() => ({ configured: true, kind: redisConfig(env)?.kind ?? null, state: "connection_failed", latencyMs: null }));
      const betterAuth = await betterAuthProbe(env, dependencies.betterAuthProbeDeps ?? {}).catch(() => ({
        configured: true, state: "connection_failed", schema: "not_checked", host: null, database: null, latencyMs: null,
      }));

      return res.status(200).json({
        ok: true,
        via,
        checkedAt: new Date(started).toISOString(),
        durationMs: Math.max(0, now() - started),
        mode: serverMode(env),
        decision: report.decision,
        cloudReady: report.cloudReady,
        effectiveProvider: report.effectiveProvider,
        providers: {
          tidb: {
            ...report.providers.tidb,
            host: (env.TIDB_HOST || "").trim() || null,
            database: (env.TIDB_DATABASE || "").trim() || null,
            latencyMs: report.providers.tidb.state === "connected" ? report.durationMs : null,
            tls: report.tls,
          },
          aiven: {
            ...aiven,
            host: aivenHost(env),
            database: aivenDatabase(env),
            latencyMs: aivenLatencyMs,
          },
          redis,
          betterAuth,
        },
        identityConfigured: report.identityConfigured,
        syncPrerequisitesReady: report.syncPrerequisitesReady,
        environment: report.environment,
        presence: {
          AIVEN_DATABASE_URL: Boolean((env.AIVEN_DATABASE_URL || "").trim()),
          GAME_DATABASE_URL: Boolean((env.GAME_DATABASE_URL || "").trim()),
          LAYERBASE_DATABASE_URL: Boolean((env.LAYERBASE_DATABASE_URL || "").trim()),
          LAYERBASE_HOST: Boolean((env.LAYERBASE_HOST || "").trim()),
          LAYERBASE_USERNAME: Boolean((env.LAYERBASE_USERNAME || "").trim()),
          LAYERBASE_DATABASE: Boolean((env.LAYERBASE_DATABASE || "").trim()),
          LAYERBASE_PORT: Boolean((env.LAYERBASE_PORT || "").trim()),
          LAYERBASE_PASSWORD: Boolean((env.LAYERBASE_PASSWORD || "").trim()),
          AUTH_DATABASE_URL: Boolean((env.AUTH_DATABASE_URL || "").trim()),
          DATABASE_URL: Boolean((env.DATABASE_URL || "").trim()),
          BETTER_AUTH_SECRET: Boolean((env.BETTER_AUTH_SECRET || "").trim()),
          BETTER_AUTH_URL: Boolean((env.BETTER_AUTH_URL || "").trim()),
          AIVEN_CA_CERT: Boolean((env.AIVEN_CA_CERT || "").trim()),
          REDIS_URL: Boolean((env.REDIS_URL || "").trim()),
          UPSTASH_REDIS_REST_URL: Boolean((env.UPSTASH_REDIS_REST_URL || "").trim()),
          ADMIN_USER_IDS: Boolean((env.ADMIN_USER_IDS || "").trim()),
          ADMIN_TEST_TOKEN: Boolean((env.ADMIN_TEST_TOKEN || "").trim()),
        },
        cache: { redisKind: redisConfig(env)?.kind ?? null, statusTtlSeconds: 30, fresh: true },
        runtime: {
          platform: env.NETLIFY === "true" ? "netlify" : env.VERCEL ? "vercel" : "node",
          node: process.version,
          region: env.VERCEL_REGION || env.AWS_REGION || null,
        },
      });
    } catch {
      return res.status(503).json({ ok: false, error: "Diagnostik gagal dijalankan; periksa log fungsi server." });
    }
  };
}
