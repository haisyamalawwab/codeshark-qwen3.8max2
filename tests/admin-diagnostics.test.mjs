// Diagnostik admin (/api/admin-diagnostics): wajib otorisasi,
// selalu fresh, memuat hasil tes TiDB/Aiven/Redis + latensi,
// dan TIDAK pernah membocorkan password/token/connection string.
import test from "node:test";
import assert from "node:assert/strict";
import { createAdminDiagnosticsHandler, adminTokenOk } from "../server/admin-diagnostics.mjs";
import { createNetlifyAdminDiagnosticsHandler } from "../netlify/functions/admin-diagnostics.mjs";

const env = {
  DATA_MODE: "auto",
  TIDB_HOST: "gateway.tidbcloud.example", TIDB_USER: "u.root", TIDB_PASSWORD: "tidb-secret-pass", TIDB_DATABASE: "codeshark",
  AIVEN_DATABASE_URL: "mysql://avnadmin:aiven-secret-pass@mysql-x.aivencloud.com:12345/defaultdb",
  ADMIN_TEST_TOKEN: "token-tes-rahasia",
  ADMIN_USER_IDS: "admin-id",
};

const fakeStatusService = () => async () => ({
  state: "connected", checkedAt: new Date().toISOString(), durationMs: 42,
  database: "connected", schema: "ready", tls: "verified",
  identityConfigured: true, syncPrerequisitesReady: true,
  environment: [{ name: "TIDB_HOST", required: true, status: "set" }],
  mode: "auto", cloudReady: true, effectiveProvider: "tidb", decision: "cloud",
  providers: {
    tidb: { configured: true, state: "connected", schema: "ready" },
    aiven: { configured: true, kind: "mysql", state: "connected", schema: "ready" },
  },
});
const fakeAivenProbe = async () => ({ configured: true, kind: "mysql", state: "connected", schema: "ready" });
const fakeRedisProbe = async () => ({ configured: true, kind: "tcp", state: "connected", latencyMs: 7 });

function resStub() {
  return { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, json(v) { this.body = v; return this; } };
}
const makeHandler = (deps = {}) => createAdminDiagnosticsHandler({
  env, statusService: fakeStatusService, aivenProbe: fakeAivenProbe, redisProbe: fakeRedisProbe, ...deps,
});

test("adminTokenOk: hanya token persis yang diterima; tanpa env token selalu salah", () => {
  assert.equal(adminTokenOk({ headers: { "x-admin-token": "token-tes-rahasia" } }, env), true);
  assert.equal(adminTokenOk({ headers: { "x-admin-token": "salah" } }, env), false);
  assert.equal(adminTokenOk({ headers: {} }, env), false);
  assert.equal(adminTokenOk({ headers: { "x-admin-token": "x" } }, {}), false);
});

test("tanpa otorisasi → 401; token salah → 403; metode salah → 405", async () => {
  const handler = makeHandler();
  let res = resStub(); await handler({ method: "GET", headers: {} }, res);
  assert.equal(res.code, 401);
  res = resStub(); await handler({ method: "GET", headers: { "x-admin-token": "ngawur" } }, res);
  assert.equal(res.code, 403);
  res = resStub(); await handler({ method: "POST", headers: { "x-admin-token": "token-tes-rahasia" } }, res);
  assert.equal(res.code, 405);
});

test("dengan token tes: laporan lengkap TiDB/Aiven/Redis tanpa rahasia", async () => {
  const handler = makeHandler();
  const res = resStub();
  await handler({ method: "GET", headers: { "x-admin-token": "token-tes-rahasia" } }, res);
  assert.equal(res.code, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.via, "token");
  assert.equal(res.body.decision, "cloud");
  assert.equal(res.body.providers.tidb.host, "gateway.tidbcloud.example");
  assert.equal(res.body.providers.tidb.database, "codeshark");
  assert.equal(res.body.providers.tidb.latencyMs, 42);
  assert.equal(res.body.providers.aiven.host, "mysql-x.aivencloud.com");
  assert.equal(res.body.providers.aiven.database, "defaultdb");
  assert.equal(res.body.providers.redis.state, "connected");
  assert.equal(res.body.cache.fresh, true);
  const raw = JSON.stringify(res.body);
  for (const secret of ["tidb-secret-pass", "aiven-secret-pass", "token-tes-rahasia", "avnadmin"]) {
    assert(!raw.includes(secret), `kebocoran: ${secret}`);
  }
});

test("jalur JWT Supabase: verifyAdmin terinjeksi dipakai bila ada Authorization", async () => {
  let verified = false;
  const handler = makeHandler({ verifyAdmin: async () => { verified = true; return "user:admin-id"; } });
  const res = resStub();
  await handler({ method: "GET", headers: { authorization: "Bearer jwt" } }, res);
  assert.equal(verified, true);
  assert.equal(res.code, 200);
  assert.equal(res.body.via, "supabase");

  const denied = makeHandler({ verifyAdmin: async () => { throw Object.assign(new Error("Akses khusus admin."), { status: 403 }); } });
  const res2 = resStub();
  await denied({ method: "GET", headers: { authorization: "Bearer jwt" } }, res2);
  assert.equal(res2.code, 403);
});

test("adapter Netlify meneruskan header otorisasi dan membalas JSON", async () => {
  const handler = createNetlifyAdminDiagnosticsHandler({
    env, statusService: fakeStatusService, aivenProbe: fakeAivenProbe, redisProbe: fakeRedisProbe,
  });
  const result = await handler({ httpMethod: "GET", headers: { "X-Admin-Token": "token-tes-rahasia" } });
  assert.equal(result.statusCode, 200);
  assert.equal(JSON.parse(result.body).ok, true);
  const denied = await handler({ httpMethod: "GET", headers: {} });
  assert.equal(denied.statusCode, 401);
});
