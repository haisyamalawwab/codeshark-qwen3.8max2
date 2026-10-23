// Server-only MySQL protocol adapter. Never import this module from src/.
import mysql from "mysql2/promise";
import { readFileSync } from "node:fs";

export function tidbOptions(env = process.env) {
  for (const key of ["TIDB_HOST", "TIDB_USER", "TIDB_PASSWORD", "TIDB_DATABASE"]) {
    if (!env[key]?.trim()) throw new Error(`Missing server environment variable: ${key}`);
  }
  if (!/^[a-zA-Z0-9_]+$/.test(env.TIDB_DATABASE)) throw new Error("Invalid TIDB_DATABASE name");
  const port = Number(env.TIDB_PORT || 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid TIDB_PORT");
  if (env.TIDB_CA_CERT?.trim() && env.TIDB_CA_PATH?.trim()) {
    throw new Error("Use only one of TIDB_CA_CERT or TIDB_CA_PATH");
  }
  // CA can come from environment PEM or a public file bundled by Netlify.
  const ca = env.TIDB_CA_CERT?.trim()
    ? env.TIDB_CA_CERT.replace(/\\n/g, "\n").trim()
    : env.TIDB_CA_PATH?.trim() ? readFileSync(env.TIDB_CA_PATH, "utf8") : undefined;
  if (ca && /-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(ca)) {
    throw new Error("CA file must not contain a private key");
  }
  if (ca && !/-----BEGIN CERTIFICATE-----[\s\S]+-----END CERTIFICATE-----/.test(ca)) {
    throw new Error("TiDB CA must be a PEM certificate");
  }
  return {
    host: env.TIDB_HOST,
    port,
    user: env.TIDB_USER,
    password: env.TIDB_PASSWORD,
    database: env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true, minVersion: "TLSv1.2", ...(ca ? { ca } : {}) },
    charset: "utf8mb4",
    timezone: "Z",
    connectionLimit: 3,
    waitForConnections: true,
    queueLimit: 20,
    connectTimeout: 10000,
    enableKeepAlive: true,
    multipleStatements: false,
  };
}

let pool;
export function getTidbPool() {
  pool ??= mysql.createPool(tidbOptions());
  return pool;
}

export async function closeTidbPool() {
  if (pool) await pool.end();
  pool = undefined;
}
