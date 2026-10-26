// ============================================================
// AIVEN — provider cloud kedua (selain TiDB Cloud).
// Konfigurasi lewat SATU connection string khusus database GAME:
//   AIVEN_DATABASE_URL / GAME_DATABASE_URL  (diutamakan)
//   NETLIFY_DATABASE_URL                    (legacy)
// `DATABASE_URL` sekarang dicadangkan untuk Better Auth/Layerbase
// (server/better-auth.mjs) dan TIDAK lagi dianggap Aiven MySQL.
// Pengecualian kompatibilitas: DATABASE_URL PostgreSQL lama masih
// dikenali sebagai DB game karena Auth Server proyek ini MariaDB.
// Jenis layanan dikenali dari skema URL:
//   postgres:// | postgresql://  → Aiven for PostgreSQL (driver `pg`,
//                                   skema legacy db/schema.sql)
//   mysql://                     → Aiven for MySQL (driver `mysql2`,
//                                   skema cs_* sama seperti TiDB)
// CA opsional: AIVEN_CA_CERT (PEM). Tanpa CA, TLS Aiven tidak dapat
// diverifikasi terhadap trust store Node (CA proyek Aiven), jadi
// rejectUnauthorized=false — SANGAT disarankan mengisi AIVEN_CA_CERT.
// Laporan probe TIDAK pernah memuat URL/kredensial/pesan driver.
// ============================================================

import mysql from "mysql2/promise";

const trimmed = (value) => (typeof value === "string" ? value.trim() : "");

export function aivenUrl(env = process.env) {
  const explicit =
    trimmed(env.AIVEN_DATABASE_URL) ||
    trimmed(env.GAME_DATABASE_URL) ||
    trimmed(env.NETLIFY_DATABASE_URL);
  if (explicit) return explicit;
  const legacy = trimmed(env.DATABASE_URL);
  // MySQL/MariaDB di DATABASE_URL milik Better Auth — jangan probe sebagai
  // database game. PostgreSQL legacy (Neon/Aiven lama) tetap kompatibel.
  return /^postgres(ql)?:\/\//i.test(legacy) ? legacy : "";
}

export function aivenKind(url) {
  if (/^postgres(ql)?:\/\//i.test(url)) return "postgres";
  if (/^mysql:\/\//i.test(url)) return "mysql";
  return null;
}

export function aivenConfigured(env = process.env) {
  return aivenUrl(env) !== "";
}

export function tidbConfigured(env = process.env) {
  return ["TIDB_HOST", "TIDB_USER", "TIDB_PASSWORD", "TIDB_DATABASE"].every((key) => trimmed(env[key]) !== "");
}

/**
 * Provider cloud yang dipakai untuk SYNC, berdasarkan konfigurasi.
 * DB_PROVIDER=tidb|aiven memaksa urutan prioritas; selain itu TiDB
 * didahulukan. Mengembalikan null bila tidak ada yang terkonfigurasi.
 * (Keputusan runtime cloud-vs-lokal tetap dari hasil probe koneksi.)
 */
export function pickCloudProvider(env = process.env) {
  const forced = trimmed(env.DB_PROVIDER).toLowerCase();
  const order = forced === "aiven" ? ["aiven", "tidb"] : ["tidb", "aiven"];
  for (const provider of order) {
    if (provider === "tidb" && tidbConfigured(env)) return "tidb";
    if (provider === "aiven" && aivenConfigured(env)) return "aiven";
  }
  return null;
}

/** Opsi SSL Aiven; undefined = tanpa SSL (hanya bila URL meminta sslmode=disable). */
export function aivenSsl(env, url) {
  let parsed;
  try { parsed = new URL(url); } catch { return undefined; }
  const sslmode = (parsed.searchParams.get("sslmode") || parsed.searchParams.get("ssl-mode") || "").toLowerCase();
  if (sslmode === "disable" || sslmode === "disabled") return undefined;
  const ca = trimmed(env.AIVEN_CA_CERT).replace(/\\n/g, "\n");
  if (ca) {
    if (/PRIVATE KEY/.test(ca) || !/-----BEGIN CERTIFICATE-----[\s\S]+-----END CERTIFICATE-----/.test(ca)) {
      throw new Error("AIVEN_CA_CERT harus berupa sertifikat PEM (bukan private key)");
    }
    return { ca, rejectUnauthorized: true };
  }
  // CA proyek Aiven tidak ada di trust store Node — tanpa AIVEN_CA_CERT
  // verifikasi terpaksa dimatikan (tetap terenkripsi TLS). Isi CA!
  return { rejectUnauthorized: false };
}

async function defaultConnectPostgres(url, ssl, timeoutMs) {
  const { Client } = await import("pg");
  const client = new Client({ connectionString: url, ssl, connectionTimeoutMillis: timeoutMs });
  await client.connect();
  return client; // { query(text) -> {rows}, end() }
}

async function defaultConnectMysql(url, ssl, timeoutMs) {
  const parsed = new URL(url);
  return mysql.createConnection({
    host: parsed.hostname,
    port: Number(parsed.port || 3306),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: decodeURIComponent(parsed.pathname.replace(/^\//, "")),
    ssl,
    connectTimeout: timeoutMs,
    multipleStatements: false,
  }); // { query(sql) -> [rows], end() }
}

const PG_TABLES_SQL =
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles','saves','attempts')";

/**
 * Tes koneksi Aiven (read-only): sambung → cek tabel aplikasi.
 * State: not_configured | config_invalid | connection_failed |
 *        schema_missing | connected | timeout
 */
export async function probeAiven(
  env = process.env,
  { connectPostgres = defaultConnectPostgres, connectMysql = defaultConnectMysql, timeoutMs = 6000 } = {},
) {
  const url = aivenUrl(env);
  const base = { configured: url !== "", kind: aivenKind(url), state: "not_configured", schema: "not_checked" };
  if (!url) return base;
  if (!base.kind) return { ...base, state: "config_invalid" };

  let ssl;
  try { ssl = aivenSsl(env, url); } catch { return { ...base, state: "config_invalid" }; }

  let client;
  let timedOut = false;
  const work = (async () => {
    if (base.kind === "postgres") {
      client = await connectPostgres(url, ssl, timeoutMs);
      const result = await client.query(PG_TABLES_SQL);
      const names = new Set((result.rows || []).map((row) => row.table_name));
      const ready = ["profiles", "saves", "attempts"].every((name) => names.has(name));
      return { ...base, state: ready ? "connected" : "schema_missing", schema: ready ? "ready" : "missing" };
    }
    client = await connectMysql(url, ssl, timeoutMs);
    const [rows] = await client.query("SHOW TABLES LIKE 'cs\\_%'");
    const names = new Set(rows.map((row) => Object.values(row)[0]));
    const ready = ["cs_profiles", "cs_saves", "cs_attempts", "cs_schema_migrations"].every((name) => names.has(name));
    return { ...base, state: ready ? "connected" : "schema_missing", schema: ready ? "ready" : "missing" };
  })();

  try {
    return await Promise.race([
      work,
      new Promise((resolve) => setTimeout(() => { timedOut = true; resolve({ ...base, state: "timeout" }); }, timeoutMs)),
    ]);
  } catch (error) {
    const timeout = ["ETIMEDOUT", "ECONNABORTED"].includes(error?.code) || /timeout/i.test(error?.message || "");
    return { ...base, state: timeout ? "timeout" : "connection_failed" };
  } finally {
    if (client) {
      try { if (timedOut && typeof client.destroy === "function") client.destroy(); else await client.end?.(); }
      catch { /* abaikan */ }
    }
  }
}

/* ---------- Pool Aiven for MySQL (dipakai handler sync cs_*) ---------- */

let mysqlPool;
/** Sinkron (pool mysql2 malas menyambung) agar cocok dengan factory handler TiDB. */
export function getAivenMysqlPool(env = process.env) {
  if (!mysqlPool) {
    const url = aivenUrl(env);
    const parsed = new URL(url);
    mysqlPool = mysql.createPool({
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: decodeURIComponent(parsed.pathname.replace(/^\//, "")),
      ssl: aivenSsl(env, url),
      charset: "utf8mb4",
      timezone: "Z",
      connectionLimit: 3,
      waitForConnections: true,
      queueLimit: 20,
      connectTimeout: 10000,
      multipleStatements: false,
    });
  }
  return mysqlPool;
}

export async function closeAivenMysqlPool() {
  if (mysqlPool) await mysqlPool.end();
  mysqlPool = undefined;
}
