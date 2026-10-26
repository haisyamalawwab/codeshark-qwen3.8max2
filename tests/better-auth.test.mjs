// Better Auth (MariaDB Layerbase) — konfigurasi, sesi cookie, owner sync,
// admin role/banned, diagnostik, dan gerbang mode lokal.
// Semua DB/API memakai fake terinjeksi; tidak ada koneksi asli.
import test from "node:test";
import assert from "node:assert/strict";
import {
  betterAuthDatabaseUrl,
  betterAuthDatabaseUrlSource,
  betterAuthPublicConfig,
  buildBetterAuthOptions,
  createBetterAuth,
  getBetterAuthUser,
  handleBetterAuthRequest,
  hasBetterAuthSessionCookie,
  isBetterAuthConfigured,
  isBetterAuthUserBanned,
  probeBetterAuthDatabase,
} from "../server/better-auth.mjs";
import { resolveAuthenticatedUser, resolveOwner } from "../server/tidb-sync.mjs";
import { requireAdmin } from "../server/site-settings.mjs";
import { createAdminDiagnosticsHandler } from "../server/admin-diagnostics.mjs";
import vercelAuthHandler from "../api/auth/[...all].mjs";
import { createNetlifyBetterAuthHandler, handler as netlifyAuthHandler } from "../netlify/functions/auth.mjs";

const authEnv = {
  DATABASE_URL: "mysql://auth-user:layerbase-secret@db.layerbase.example:3306/codeshark_auth",
  BETTER_AUTH_SECRET: "test-secret-1234567890",
  BETTER_AUTH_URL: "https://latihan.my.id",
  NODE_ENV: "production",
};
const cookieReq = (cookie = "better-auth.session_token=signed-token") => ({ headers: { cookie } });
const payload = { deviceId: "device-test" };

test("URL Auth Server: AUTH_DATABASE_URL didahulukan, DATABASE_URL Layerbase didukung, laporan publik tanpa rahasia", () => {
  assert.equal(betterAuthDatabaseUrl(authEnv), authEnv.DATABASE_URL);
  assert.equal(betterAuthDatabaseUrlSource(authEnv), "DATABASE_URL");
  assert.equal(
    betterAuthDatabaseUrl({ AUTH_DATABASE_URL: "mysql://khusus", DATABASE_URL: "mysql://umum" }),
    "mysql://khusus",
  );
  assert.equal(isBetterAuthConfigured(authEnv), true);
  assert.equal(isBetterAuthConfigured({ DATABASE_URL: "postgres://bukan-mariadb", BETTER_AUTH_SECRET: "x" }), false);
  const report = betterAuthPublicConfig(authEnv);
  assert.deepEqual(report, {
    configured: true,
    databaseUrlSource: "DATABASE_URL",
    databaseHost: "db.layerbase.example",
    databaseName: "codeshark_auth",
    secretConfigured: true,
    baseUrlConfigured: true,
    missing: [],
  });
  assert(!JSON.stringify(report).includes("layerbase-secret"));
  assert(!JSON.stringify(report).includes("auth-user"));
});

test("factory Better Auth: pool mysql2 UTC + email/password + plugin admin di /api/auth", () => {
  let poolOptions;
  let receivedOptions;
  const fakePool = { kind: "pool" };
  const instance = createBetterAuth(authEnv, {
    createPool(options) { poolOptions = options; return fakePool; },
    admin() { return { id: "admin" }; },
    betterAuth(options) { receivedOptions = options; return { marker: true, options }; },
  });
  assert.equal(instance.marker, true);
  assert.equal(poolOptions.uri, authEnv.DATABASE_URL);
  assert.equal(poolOptions.timezone, "Z");
  assert.equal(poolOptions.connectionLimit, 5);
  assert.equal(receivedOptions.database, fakePool);
  assert.equal(receivedOptions.secret, authEnv.BETTER_AUTH_SECRET);
  assert.equal(receivedOptions.baseURL, "https://latihan.my.id");
  assert.equal(receivedOptions.basePath, "/api/auth");
  assert.deepEqual(receivedOptions.emailAndPassword, { enabled: true, minPasswordLength: 8 });
  assert.deepEqual(receivedOptions.plugins, [{ id: "admin" }]);
  assert.equal(receivedOptions.advanced.database.joins, true);
  assert(receivedOptions.trustedOrigins.includes("https://latihan.my.id"));

  const options = buildBetterAuthOptions({ ...authEnv, BETTER_AUTH_ALLOWED_HOSTS: "*.vercel.app,latihan.my.id" }, fakePool, {
    admin() { return { id: "admin" }; },
  });
  assert.deepEqual(options.baseURL, {
    allowedHosts: ["*.vercel.app", "latihan.my.id"],
    fallback: "https://latihan.my.id",
  });
});

test("cookie sesi dikenali (termasuk __Secure/chunk) dan user dinormalisasi", async () => {
  assert.equal(hasBetterAuthSessionCookie(cookieReq()), true);
  assert.equal(hasBetterAuthSessionCookie(cookieReq("__Secure-better-auth.session_token.0=abc")), true);
  assert.equal(hasBetterAuthSessionCookie({ headers: { cookie: "theme=dark" } }), false);

  let calls = 0;
  const fakeAuth = {
    api: {
      async getSession({ headers }) {
        calls++;
        assert(headers.get("cookie").includes("better-auth.session_token"));
        return {
          session: { id: "sess-1" },
          user: { id: "user-123", email: "rani@example.com", name: "Rani", role: "admin", banned: 0 },
        };
      },
    },
  };
  assert.equal(await getBetterAuthUser({ headers: {} }, authEnv, { auth: fakeAuth }), null);
  assert.equal(calls, 0);
  assert.deepEqual(await getBetterAuthUser(cookieReq(), authEnv, { auth: fakeAuth }), {
    id: "user-123",
    email: "rani@example.com",
    name: "Rani",
    role: "admin",
    banned: false,
    banReason: null,
    banExpires: null,
    provider: "better-auth",
  });
  assert.equal(calls, 1);
});

test("ban aktif ditolak; ban kedaluwarsa tidak lagi memblokir", () => {
  const now = new Date("2026-10-26T00:00:00Z");
  assert.equal(isBetterAuthUserBanned({ banned: true }, now), true);
  assert.equal(isBetterAuthUserBanned({ banned: 1, banExpires: "2026-10-27T00:00:00Z" }, now), true);
  assert.equal(isBetterAuthUserBanned({ banned: true, banExpires: "2026-10-25T00:00:00Z" }, now), false);
  assert.equal(isBetterAuthUserBanned({ banned: false }, now), false);
});

test("handler auth belum terkonfigurasi → 503 JSON informatif tanpa stack/rahasia", async () => {
  const res = {
    code: 0,
    body: "",
    writeHead(code) { this.code = code; },
    end(body) { this.body = body; },
  };
  const handled = await handleBetterAuthRequest({ headers: {} }, res, {});
  assert.equal(handled, false);
  assert.equal(res.code, 503);
  const body = JSON.parse(res.body);
  assert.equal(body.error, "better_auth_not_configured");
  assert(body.missing.includes("AUTH_DATABASE_URL/DATABASE_URL"));
  assert(body.missing.includes("BETTER_AUTH_SECRET"));
});

test("probe Auth DB: 4 tabel + kolom admin lengkap → connected, tanpa membocorkan kredensial", async () => {
  let ended = false;
  let seenOptions;
  const report = await probeBetterAuthDatabase(authEnv, {
    async createConnection(options) {
      seenOptions = options;
      return {
        async query(sql) {
          if (sql.includes("information_schema.tables")) {
            return [[
              { tableName: "user" }, { tableName: "session" },
              { tableName: "account" }, { tableName: "verification" },
            ]];
          }
          const columns = {
            user: ["id", "email", "role", "banned", "banReason", "banExpires"],
            session: ["id", "expiresAt", "token", "userId", "impersonatedBy"],
            account: ["id", "accountId", "providerId", "userId"],
            verification: ["id", "identifier", "value", "expiresAt"],
          };
          return [Object.entries(columns).flatMap(([tableName, names]) => names.map((columnName) => ({ tableName, columnName })))];
        },
        async end() { ended = true; },
      };
    },
  });
  assert.equal(seenOptions.uri, authEnv.DATABASE_URL);
  assert.equal(report.state, "connected");
  assert.equal(report.schema, "ready");
  assert.equal(report.host, "db.layerbase.example");
  assert.equal(report.database, "codeshark_auth");
  assert.equal(ended, true);
  assert(!JSON.stringify(report).includes("layerbase-secret"));
  assert.deepEqual(await probeBetterAuthDatabase({}), {
    configured: false,
    state: "not_configured",
    schema: "not_checked",
    host: null,
    database: null,
    databaseUrlSource: null,
    latencyMs: null,
  });
});

test("resolveOwner: cookie Better Auth menjadi owner user; invalid 401; banned 403; guest dev tidak membypass cookie", async () => {
  const depsFor = (user) => ({ getBetterAuthUser: async () => user });
  assert.equal(
    await resolveOwner(cookieReq(), payload, { NODE_ENV: "production" }, fetch, depsFor({ id: "ba-1", role: "user" })),
    "user:ba-1",
  );
  const who = await resolveAuthenticatedUser(cookieReq(), {}, fetch, depsFor({ id: "ba-2", email: "a@b.id", role: "admin" }));
  assert.equal(who.provider, "better-auth");
  assert.equal(who.role, "admin");

  await assert.rejects(
    resolveOwner(cookieReq(), payload, {}, fetch, depsFor(null)),
    { status: 401 },
  );
  await assert.rejects(
    resolveOwner(cookieReq(), payload, {}, fetch, depsFor({ id: "ba-3", banned: true })),
    { status: 403 },
  );
  assert.equal(
    await resolveOwner(cookieReq(), payload, { NODE_ENV: "development", TIDB_ALLOW_GUEST_SYNC: "true" }, fetch, depsFor({ id: "ba-4" })),
    "user:ba-4",
  );
});

test("requireAdmin: role admin Better Auth cukup; user biasa butuh allowlist; banned ditolak", async () => {
  const depsFor = (user) => ({ getBetterAuthUser: async () => user });
  assert.equal(
    await requireAdmin(cookieReq(), {}, fetch, depsFor({ id: "admin-ba", role: "admin" })),
    "user:admin-ba",
  );
  assert.equal(
    await requireAdmin(cookieReq(), { ADMIN_USER_IDS: "ba-allow" }, fetch, depsFor({ id: "ba-allow", role: "user" })),
    "user:ba-allow",
  );
  await assert.rejects(
    requireAdmin(cookieReq(), {}, fetch, depsFor({ id: "ba-user", role: "user" })),
    { status: 403 },
  );
  await assert.rejects(
    requireAdmin(cookieReq(), { ADMIN_USER_IDS: "ba-banned" }, fetch, depsFor({ id: "ba-banned", role: "admin", banned: true })),
    { status: 403 },
  );
});

test("diagnostik admin menerima cookie Better Auth dan melaporkan probe MariaDB auth", async () => {
  const fakeStatusService = () => async () => ({
    state: "connected", checkedAt: new Date().toISOString(), durationMs: 3,
    database: "connected", schema: "ready", tls: "verified",
    identityConfigured: true, syncPrerequisitesReady: true,
    environment: [], mode: "auto", cloudReady: true, effectiveProvider: "tidb", decision: "cloud",
    providers: {
      tidb: { configured: true, state: "connected", schema: "ready" },
      aiven: { configured: false, kind: null, state: "not_configured", schema: "not_checked" },
    },
  });
  let seenAuthDeps;
  const handler = createAdminDiagnosticsHandler({
    env: { ...authEnv, ADMIN_TEST_TOKEN: "" },
    statusService: fakeStatusService,
    aivenProbe: async () => ({ configured: false, kind: null, state: "not_configured", schema: "not_checked" }),
    redisProbe: async () => ({ configured: false, kind: null, state: "not_configured", latencyMs: null }),
    betterAuthProbe: async () => ({
      configured: true, state: "connected", schema: "ready",
      host: "db.layerbase.example", database: "codeshark_auth", latencyMs: 9,
    }),
    verifyAdmin: async (_req, _env, _request, authDeps) => { seenAuthDeps = authDeps; return "user:admin-ba"; },
    authDeps: { marker: true },
  });
  const res = {
    code: 200,
    setHeader() {},
    status(code) { this.code = code; return this; },
    json(value) { this.body = value; return this; },
  };
  await handler({ method: "GET", headers: cookieReq().headers }, res);
  assert.equal(res.code, 200);
  assert.equal(res.body.via, "better-auth");
  assert.equal(res.body.providers.betterAuth.state, "connected");
  assert.equal(seenAuthDeps.marker, true);
  assert(!JSON.stringify(res.body).includes("layerbase-secret"));
});

test("DATA_MODE=local mematikan route Better Auth di Vercel maupun Netlify", async () => {
  const previous = process.env.DATA_MODE;
  process.env.DATA_MODE = "local";
  try {
    const res = {
      code: 200,
      setHeader() {},
      status(code) { this.code = code; return this; },
      json(value) { this.body = value; return this; },
    };
    await vercelAuthHandler({ method: "GET", headers: {}, url: "/api/auth/get-session" }, res);
    assert.equal(res.code, 503);
    assert.equal(res.body.mode, "local");

    const result = await netlifyAuthHandler({
      httpMethod: "GET",
      path: "/api/auth/get-session",
      headers: { host: "latihan.my.id" },
      body: "",
    });
    assert.equal(result.statusCode, 503);
    assert.equal(JSON.parse(result.body).mode, "local");
  } finally {
    if (previous === undefined) delete process.env.DATA_MODE;
    else process.env.DATA_MODE = previous;
  }
});

test("adapter Netlify menulis ulang path, meneruskan body base64, dan mempertahankan banyak Set-Cookie", async () => {
  let seenRequest;
  const handler = createNetlifyBetterAuthHandler({
    env: { DATA_MODE: "auto" },
    async handle(request) {
      seenRequest = request;
      const headers = new Headers({ "content-type": "application/json" });
      headers.append("set-cookie", "better-auth.session_token=abc; Path=/; HttpOnly");
      headers.append("set-cookie", "better-auth.session_data=xyz; Path=/; HttpOnly");
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    },
  });
  const result = await handler({
    httpMethod: "POST",
    rawUrl: "https://latihan.my.id/.netlify/functions/auth/sign-in/email?next=%2Fadmin",
    headers: { host: "latihan.my.id", "content-type": "application/json" },
    isBase64Encoded: true,
    body: Buffer.from(JSON.stringify({ email: "rani@example.com", password: "password-aman" })).toString("base64"),
  });
  assert.equal(new URL(seenRequest.url).pathname, "/api/auth/sign-in/email");
  assert.equal(new URL(seenRequest.url).searchParams.get("next"), "/admin");
  assert.deepEqual(JSON.parse(await seenRequest.text()), { email: "rani@example.com", password: "password-aman" });
  assert.equal(result.statusCode, 200);
  assert.equal(JSON.parse(result.body).ok, true);
  assert.equal(result.multiValueHeaders["Set-Cookie"].length, 2);
});
