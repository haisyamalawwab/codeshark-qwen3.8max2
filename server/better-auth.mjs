// ============================================================
// Better Auth — email/password di MariaDB/MySQL (Layerbase "Auth Server").
//
// Database autentikasi ini TERPISAH dari database game TiDB/Aiven:
//   - Better Auth MURNI urusan identitas (user/session/account/verification).
//   - Progres game tetap local-first dan (bila mode cloud aktif) disinkronkan
//     ke TiDB/Aiven dengan owner "user:<better-auth-user-id>".
//
// Namespace env dipisahkan secara tegas:
//   - TIDB_* hanya untuk database game TiDB Cloud;
//   - LAYERBASE_* hanya untuk database auth Layerbase;
//   - BETTER_AUTH_* hanya untuk konfigurasi aplikasi Better Auth.
// Prioritas koneksi auth kanonis:
//   LAYERBASE_DATABASE_URL
//   → LAYERBASE_HOST/LAYERBASE_USERNAME/LAYERBASE_DATABASE/
//     LAYERBASE_PORT/LAYERBASE_PASSWORD.
// Nama lama AUTH_DATABASE_URL, BETTER_AUTH_DATABASE_URL, DATABASE_URL,
// dan field generik HOST/username/database/PORT/password tetap dibaca
// sebagai kompatibilitas, tetapi tidak pernah dicampur dengan grup
// LAYERBASE_* yang sudah mulai diisi.
// ============================================================
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins/admin";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { createConnection, createPool } from "mysql2/promise";

const LAYERBASE_URL_ENV_KEY = "LAYERBASE_DATABASE_URL";
const LEGACY_AUTH_URL_ENV_KEYS = ["AUTH_DATABASE_URL", "BETTER_AUTH_DATABASE_URL", "DATABASE_URL"];
const LAYERBASE_DISCRETE_KEYS = {
  host: "LAYERBASE_HOST",
  username: "LAYERBASE_USERNAME",
  database: "LAYERBASE_DATABASE",
  port: "LAYERBASE_PORT",
  password: "LAYERBASE_PASSWORD",
};
const LEGACY_LAYERBASE_DISCRETE_KEYS = {
  host: "HOST",
  username: "username",
  database: "database",
  port: "PORT",
  password: "password",
};
const LAYERBASE_DISCRETE_SOURCE = "LAYERBASE_HOST/LAYERBASE_USERNAME/LAYERBASE_DATABASE/LAYERBASE_PORT/LAYERBASE_PASSWORD";
const LEGACY_LAYERBASE_DISCRETE_SOURCE = "HOST/username/database/PORT/password (legacy)";
const SESSION_COOKIE_PATTERN = /(?:^|;\s*)(?:__Secure-)?better-auth[.-]session_token(?:\.\d+)?=/i;

export class BetterAuthNotConfiguredError extends Error {
  status = 503;
  code = "better_auth_not_configured";

  constructor(missing = []) {
    super("Better Auth belum dikonfigurasi di server.");
    this.name = "BetterAuthNotConfiguredError";
    this.missing = missing;
  }
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseCsv(value) {
  return clean(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function originOf(value) {
  const raw = clean(value);
  if (!raw) return "";
  try {
    return new URL(raw.includes("://") ? raw : `https://${raw}`).origin;
  } catch {
    return "";
  }
}

function discreteConfigForKeys(env, keys, source, kind) {
  const host = clean(env?.[keys.host]);
  const username = clean(env?.[keys.username]);
  const database = clean(env?.[keys.database]);
  const portRaw = clean(env?.[keys.port]);
  // Password tidak di-trim: spasi dapat menjadi bagian kredensial yang sah
  // dan akan di-encode saat URL internal disusun.
  const password = typeof env?.[keys.password] === "string" ? env[keys.password] : "";
  const port = portRaw ? Number(portRaw) : 3306;
  const hasAny = Boolean(host || username || database || portRaw || password);
  const missing = [];

  if (!host) missing.push(keys.host);
  if (!username) missing.push(keys.username);
  if (!database) missing.push(keys.database);
  if (!password) missing.push(keys.password);

  const bracketedIpv6 = host.startsWith("[") && host.endsWith("]");
  const hostValid = Boolean(host)
    && !host.includes("://")
    && !/[\s/@?#]/.test(host)
    && (bracketedIpv6 || !host.includes(":"));
  if (host && !hostValid) missing.push(`${keys.host} tidak valid`);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    missing.push(`${keys.port} harus berupa angka 1-65535`);
  }

  let url = "";
  if (hasAny && missing.length === 0) {
    try {
      const parsed = new URL("mysql://localhost/");
      parsed.hostname = host;
      parsed.port = String(port);
      parsed.username = username;
      parsed.password = password;
      parsed.pathname = `/${encodeURIComponent(database)}`;
      url = parsed.toString();
    } catch {
      missing.push(`${keys.host} tidak valid`);
    }
  }

  return {
    hasAny,
    complete: Boolean(url),
    missing,
    url,
    host: host || null,
    database: database || null,
    port,
    source,
    kind,
  };
}

/**
 * Field koneksi Layerbase terpisah. Grup kanonis LAYERBASE_* selalu dipilih
 * sebagai satu grup bila salah satu fieldnya mulai diisi; grup generik lama
 * hanya menjadi fallback kompatibilitas dan tidak pernah dicampur.
 * Fungsi ini tidak mengembalikan username/password secara terpisah.
 */
export function layerbaseDiscreteConfig(env = process.env) {
  const prefixed = discreteConfigForKeys(
    env,
    LAYERBASE_DISCRETE_KEYS,
    LAYERBASE_DISCRETE_SOURCE,
    "prefixed",
  );
  if (prefixed.hasAny) return prefixed;
  return discreteConfigForKeys(
    env,
    LEGACY_LAYERBASE_DISCRETE_KEYS,
    LEGACY_LAYERBASE_DISCRETE_SOURCE,
    "legacy",
  );
}

export function betterAuthDatabaseUrl(env = process.env) {
  const layerbaseUrl = clean(env?.[LAYERBASE_URL_ENV_KEY]);
  if (layerbaseUrl) return layerbaseUrl;

  const discrete = layerbaseDiscreteConfig(env);
  // Bila grup LAYERBASE_* sudah mulai diisi, jangan diam-diam berpindah ke
  // URL/field legacy. Hasil kosong akan dilaporkan sebagai konfigurasi parsial.
  if (discrete.kind === "prefixed") return discrete.url;

  for (const key of LEGACY_AUTH_URL_ENV_KEYS) {
    const value = clean(env?.[key]);
    if (value) return value;
  }
  return discrete.url;
}

export function betterAuthDatabaseUrlSource(env = process.env) {
  if (clean(env?.[LAYERBASE_URL_ENV_KEY])) return LAYERBASE_URL_ENV_KEY;

  const discrete = layerbaseDiscreteConfig(env);
  if (discrete.kind === "prefixed") {
    return discrete.complete ? discrete.source : null;
  }

  for (const key of LEGACY_AUTH_URL_ENV_KEYS) {
    if (clean(env?.[key])) return key;
  }
  return discrete.complete ? discrete.source : null;
}

export function betterAuthSecret(env = process.env) {
  return clean(env?.BETTER_AUTH_SECRET) || clean(env?.AUTH_SECRET);
}

export function betterAuthBaseUrl(env = process.env) {
  return clean(env?.BETTER_AUTH_URL) || clean(env?.AUTH_URL);
}

export function betterAuthMissingConfig(env = process.env) {
  const missing = [];
  const databaseUrl = betterAuthDatabaseUrl(env);
  if (!databaseUrl) {
    const discrete = layerbaseDiscreteConfig(env);
    if (discrete.hasAny) missing.push(...discrete.missing);
    else {
      missing.push(
        "LAYERBASE_DATABASE_URL atau "
          + "LAYERBASE_HOST/LAYERBASE_USERNAME/LAYERBASE_DATABASE/"
          + "LAYERBASE_PORT/LAYERBASE_PASSWORD",
      );
    }
  } else if (!/^mysql2?:\/\//i.test(databaseUrl) && !/^mariadb:\/\//i.test(databaseUrl)) {
    const source = betterAuthDatabaseUrlSource(env) || "URL database auth";
    missing.push(`${source} harus berawalan mysql://`);
  } else {
    const source = betterAuthDatabaseUrlSource(env) || "URL database auth";
    try {
      const parsed = new URL(databaseUrl);
      if (!parsed.hostname || !parsed.pathname.replace(/^\//, "")) {
        missing.push(`${source} harus memuat host dan nama database`);
      }
    } catch {
      missing.push(`${source} tidak valid`);
    }
  }
  if (!betterAuthSecret(env)) missing.push("BETTER_AUTH_SECRET");
  return missing;
}

export function isBetterAuthConfigured(env = process.env) {
  return betterAuthMissingConfig(env).length === 0;
}

export function betterAuthPublicConfig(env = process.env) {
  const databaseUrl = betterAuthDatabaseUrl(env);
  let databaseHost = null;
  let databaseName = null;
  if (databaseUrl) {
    try {
      const parsed = new URL(databaseUrl);
      databaseHost = parsed.hostname || null;
      databaseName = decodeURIComponent(parsed.pathname.replace(/^\//, "")) || null;
    } catch {
      // Jangan pernah mengembalikan URL mentah/kredensial ke klien.
    }
  } else {
    const discrete = layerbaseDiscreteConfig(env);
    if (discrete.hasAny) {
      databaseHost = discrete.host;
      databaseName = discrete.database;
    }
  }
  return {
    configured: isBetterAuthConfigured(env),
    databaseUrlSource: betterAuthDatabaseUrlSource(env),
    databaseHost,
    databaseName,
    secretConfigured: Boolean(betterAuthSecret(env)),
    baseUrlConfigured: Boolean(betterAuthBaseUrl(env)),
    missing: betterAuthMissingConfig(env),
  };
}

export function getBetterAuthBaseURLConfig(env = process.env) {
  const fallback = betterAuthBaseUrl(env);
  const allowedHosts = parseCsv(env?.BETTER_AUTH_ALLOWED_HOSTS);
  if (allowedHosts.length > 0) {
    return fallback ? { allowedHosts, fallback } : { allowedHosts };
  }
  return fallback || undefined;
}

export function getBetterAuthTrustedOrigins(env = process.env) {
  const origins = new Set();
  for (const value of parseCsv(env?.BETTER_AUTH_TRUSTED_ORIGINS)) {
    const origin = originOf(value);
    if (origin) origins.add(origin);
  }
  for (const value of [
    betterAuthBaseUrl(env),
    env?.URL,
    env?.DEPLOY_PRIME_URL,
    env?.DEPLOY_URL,
    env?.VERCEL_URL ? `https://${clean(env.VERCEL_URL).replace(/^https?:\/\//, "")}` : "",
    env?.VERCEL_BRANCH_URL ? `https://${clean(env.VERCEL_BRANCH_URL).replace(/^https?:\/\//, "")}` : "",
    env?.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${clean(env.VERCEL_PROJECT_PRODUCTION_URL).replace(/^https?:\/\//, "")}`
      : "",
  ]) {
    const origin = originOf(value);
    if (origin) origins.add(origin);
  }
  if (env?.NODE_ENV !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
    origins.add("http://localhost:5173");
    origins.add("http://127.0.0.1:5173");
  }
  return origins.size ? [...origins] : undefined;
}

export function createBetterAuthPool(env = process.env, deps = {}) {
  const databaseUrl = betterAuthDatabaseUrl(env);
  if (!databaseUrl) return null;
  const poolFactory = deps.createPool ?? createPool;
  const options = {
    uri: databaseUrl,
    // Adapter MySQL Better Auth merekomendasikan UTC agar expiresAt konsisten.
    timezone: "Z",
    waitForConnections: true,
    connectionLimit: 5,
    enableKeepAlive: true,
  };
  const ca = clean(env?.AUTH_DB_CA_CERT);
  if (ca) {
    options.ssl = {
      ca,
      rejectUnauthorized: clean(env?.AUTH_DB_SSL_REJECT_UNAUTHORIZED) !== "false",
    };
  }
  return poolFactory(options);
}

/* Probe kesiapan Layerbase (DB auth) untuk status PUBLIK: memetakan
 * probeBetterAuthDatabase (dipakai diagnostik admin, memeriksa tabel +
 * kolom Better Auth inti via information_schema) menjadi satu string
 * status tanpa detail host/database. Timeout lebih pendek dari probe
 * admin. Tidak pernah melempar; "Layerbase ready" harus bisa dibuktikan
 * dari /api/database-status, bukan sekadar diklaim terkonfigurasi. */
export async function probeBetterAuthSchema(env = process.env, deps = {}) {
  if (!isBetterAuthConfigured(env)) return "not_configured";
  const probe = deps.probeBetterAuthDatabase ?? probeBetterAuthDatabase;
  try {
    const result = await probe(env, { ...deps, timeoutMs: deps.timeoutMs ?? 2500 });
    if (result?.state === "connected" && result?.schema === "ready") return "ready";
    if (result?.state === "schema_missing" || result?.schema === "missing") return "missing";
    if (result?.state === "timeout") return "timeout";
    if (result?.state === "not_configured") return "not_configured";
    return "connection_failed";
  } catch {
    return "connection_failed";
  }
}

export function buildBetterAuthOptions(env = process.env, database, deps = {}) {
  const adminPlugin = deps.admin ?? admin;
  return {
    appName: clean(env?.BETTER_AUTH_APP_NAME) || "CodeShark Academy",
    database,
    secret: betterAuthSecret(env) || undefined,
    baseURL: getBetterAuthBaseURLConfig(env),
    basePath: "/api/auth",
    trustedOrigins: getBetterAuthTrustedOrigins(env),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },
    // Wajib untuk kolom role/banned/banReason/banExpires + impersonatedBy
    // yang dipakai dashboard Layerbase. Plugin ini menolak sign-in user banned.
    plugins: [adminPlugin()],
    advanced: {
      database: {
        // MariaDB/MySQL mendukung JOIN; mengurangi query session+user.
        joins: true,
      },
    },
  };
}

export function createBetterAuth(env = process.env, deps = {}) {
  if (!isBetterAuthConfigured(env)) return null;
  const database = deps.database ?? createBetterAuthPool(env, deps);
  if (!database) return null;
  const factory = deps.betterAuth ?? betterAuth;
  return factory(buildBetterAuthOptions(env, database, deps));
}

let cachedAuth;
let cachedAuthResolved = false;

export function getBetterAuth(env = process.env, deps = {}) {
  if (deps.auth) return deps.auth;
  if (deps.betterAuth || deps.createPool || deps.database || deps.admin) {
    return createBetterAuth(env, deps);
  }
  // Env kustom (tes/handler terinjeksi) tidak boleh membaca singleton yang
  // dibangun dari process.env saat modul pertama diimpor.
  if (env !== process.env) return createBetterAuth(env, deps);
  if (!cachedAuthResolved) {
    try {
      cachedAuth = createBetterAuth(env, deps);
    } catch {
      // Konfigurasi auth yang rusak tidak boleh menjatuhkan endpoint game;
      // handler auth akan menjawab 503 dan diagnostik menunjukkan masalahnya.
      cachedAuth = null;
    }
    cachedAuthResolved = true;
  }
  return cachedAuth;
}

// Diekspor untuk Better Auth CLI (`auth.ts` di root me-re-export ini).
export const auth = getBetterAuth();


const BETTER_AUTH_TABLES = ["user", "session", "account", "verification"];
const BETTER_AUTH_REQUIRED_COLUMNS = {
  user: ["id", "email", "role", "banned", "banReason", "banExpires"],
  session: ["id", "expiresAt", "token", "userId", "impersonatedBy"],
  account: ["id", "accountId", "providerId", "userId"],
  verification: ["id", "identifier", "value", "expiresAt"],
};

/**
 * Tes read-only database Better Auth untuk diagnostik admin:
 * sambung → pastikan 4 tabel Better Auth + kolom admin plugin ada.
 * Tidak pernah mengembalikan URL/kredensial/pesan driver.
 */
export async function probeBetterAuthDatabase(env = process.env, deps = {}) {
  const config = betterAuthPublicConfig(env);
  const base = {
    configured: Boolean(betterAuthDatabaseUrl(env)),
    state: "not_configured",
    schema: "not_checked",
    host: config.databaseHost,
    database: config.databaseName,
    databaseUrlSource: config.databaseUrlSource,
    latencyMs: null,
  };
  if (!base.configured) return base;
  if (!config.configured) return { ...base, state: "config_invalid" };

  const started = Date.now();
  const timeoutMs = Number.isFinite(deps.timeoutMs) ? deps.timeoutMs : 6000;
  let connection;
  let timedOut = false;
  const work = (async () => {
    const connect = deps.createConnection ?? createConnection;
    const options = {
      uri: betterAuthDatabaseUrl(env),
      timezone: "Z",
      connectTimeout: timeoutMs,
      multipleStatements: false,
    };
    const ca = clean(env?.AUTH_DB_CA_CERT);
    if (ca) {
      options.ssl = {
        ca,
        rejectUnauthorized: clean(env?.AUTH_DB_SSL_REJECT_UNAUTHORIZED) !== "false",
      };
    }
    connection = await connect(options);
    const [tableRows] = await connection.query(
      "SELECT TABLE_NAME AS tableName FROM information_schema.tables WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('user','session','account','verification')",
    );
    const tables = new Set((tableRows || []).map((row) => row.tableName));
    if (!BETTER_AUTH_TABLES.every((table) => tables.has(table))) {
      return { ...base, state: "schema_missing", schema: "missing", latencyMs: Math.max(0, Date.now() - started) };
    }
    const [columnRows] = await connection.query(
      "SELECT TABLE_NAME AS tableName, COLUMN_NAME AS columnName FROM information_schema.columns WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('user','session','account','verification')",
    );
    const columns = new Map();
    for (const row of columnRows || []) {
      if (!columns.has(row.tableName)) columns.set(row.tableName, new Set());
      columns.get(row.tableName).add(row.columnName);
    }
    const ready = Object.entries(BETTER_AUTH_REQUIRED_COLUMNS).every(([table, required]) =>
      required.every((column) => columns.get(table)?.has(column)),
    );
    return {
      ...base,
      state: ready ? "connected" : "schema_missing",
      schema: ready ? "ready" : "missing",
      latencyMs: Math.max(0, Date.now() - started),
    };
  })();

  try {
    return await Promise.race([
      work,
      new Promise((resolve) => setTimeout(() => {
        timedOut = true;
        resolve({ ...base, state: "timeout" });
      }, timeoutMs)),
    ]);
  } catch (error) {
    const timeout = ["ETIMEDOUT", "ECONNABORTED"].includes(error?.code) || /timeout/i.test(error?.message || "");
    return { ...base, state: timeout ? "timeout" : "connection_failed" };
  } finally {
    if (connection) {
      try {
        if (timedOut && typeof connection.destroy === "function") connection.destroy();
        else await connection.end?.();
      } catch {
        // abaikan
      }
    }
  }
}

export function hasBetterAuthSessionCookie(req) {
  const cookie = req?.headers?.cookie;
  const raw = Array.isArray(cookie) ? cookie.join("; ") : clean(cookie);
  return SESSION_COOKIE_PATTERN.test(raw);
}

function normalizeBoolean(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

export function isBetterAuthUserBanned(user, now = new Date()) {
  if (!normalizeBoolean(user?.banned)) return false;
  if (!user?.banExpires) return true;
  const expires = user.banExpires instanceof Date ? user.banExpires : new Date(user.banExpires);
  return Number.isNaN(expires.getTime()) || expires.getTime() > now.getTime();
}

function normalizeUser(user) {
  if (!user?.id) return null;
  return {
    id: String(user.id),
    email: typeof user.email === "string" ? user.email : "",
    name: typeof user.name === "string" ? user.name : "",
    role: typeof user.role === "string" ? user.role : "user",
    banned: normalizeBoolean(user.banned),
    banReason: typeof user.banReason === "string" ? user.banReason : null,
    banExpires: user.banExpires ?? null,
    provider: "better-auth",
  };
}

export async function getBetterAuthSession(req, env = process.env, deps = {}) {
  if (!hasBetterAuthSessionCookie(req)) return null;
  const instance = deps.auth ?? getBetterAuth(env, deps);
  if (!instance) throw new BetterAuthNotConfiguredError(betterAuthMissingConfig(env));
  const headers = deps.headers ?? fromNodeHeaders(req.headers ?? {});
  const result = await instance.api.getSession({ headers });
  const user = normalizeUser(result?.user);
  if (!user) return null;
  return {
    user,
    session: result?.session ?? null,
  };
}

export async function getBetterAuthUser(req, env = process.env, deps = {}) {
  const result = await getBetterAuthSession(req, env, deps);
  return result?.user ?? null;
}

const nodeHandlers = new WeakMap();

function nodeHandlerFor(instance, deps = {}) {
  if (deps.toNodeHandler) return deps.toNodeHandler(instance);
  let handler = nodeHandlers.get(instance);
  if (!handler) {
    handler = toNodeHandler(instance);
    nodeHandlers.set(instance, handler);
  }
  return handler;
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  if (typeof res.writeHead === "function" && typeof res.end === "function") {
    res.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(payload);
    return;
  }
  if (typeof res.status === "function" && typeof res.json === "function") {
    res.status(status).json(body);
  }
}

export async function handleBetterAuthRequest(req, res, env = process.env, deps = {}) {
  const instance = deps.auth ?? getBetterAuth(env, deps);
  if (!instance) {
    sendJson(res, 503, {
      error: "better_auth_not_configured",
      message:
        "Better Auth belum dikonfigurasi. Isi LAYERBASE_DATABASE_URL atau field LAYERBASE_HOST/LAYERBASE_USERNAME/LAYERBASE_DATABASE/LAYERBASE_PORT/LAYERBASE_PASSWORD, serta BETTER_AUTH_SECRET di server.",
      missing: betterAuthMissingConfig(env),
    });
    return false;
  }
  await nodeHandlerFor(instance, deps)(req, res);
  return true;
}

/**
 * Handler Web standar (Request → Response) untuk runtime serverless yang
 * bukan Node req/res sungguhan, misalnya Netlify Functions legacy.
 */
export async function handleBetterAuthWebRequest(request, env = process.env, deps = {}) {
  const instance = deps.auth ?? getBetterAuth(env, deps);
  if (!instance) {
    return Response.json(
      {
        error: "better_auth_not_configured",
        message:
          "Better Auth belum dikonfigurasi. Isi LAYERBASE_DATABASE_URL atau field LAYERBASE_HOST/LAYERBASE_USERNAME/LAYERBASE_DATABASE/LAYERBASE_PORT/LAYERBASE_PASSWORD, serta BETTER_AUTH_SECRET di server.",
        missing: betterAuthMissingConfig(env),
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  return instance.handler(request);
}
