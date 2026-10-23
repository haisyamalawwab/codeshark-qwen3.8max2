import test from "node:test";
import assert from "node:assert/strict";
import { tidbOptions } from "../server/tidb.mjs";
import { validatePayload, resolveOwner, persistTidbSync, createTidbSyncHandler } from "../server/tidb-sync.mjs";
import { handler as netlify } from "../netlify/functions/sync-progress.mjs";

const payload = () => ({
  deviceId: "device-test", profileName: "Kadet 🦈", sentAt: 1800000000000,
  save: { xp: 100, coins: 20, modules: {}, stats: {}, claimedAchievements: { "lines-50": 1 } },
  attempts: [{ id: "attempt-1", sessionId: "q:1:quest", won: true, passed: true, stars: 3, score: 1000, accuracy: 99, wpm: 40, maxCombo: 10, xpAward: 100, coinsAward: 20, at: 1800000000000 }],
});
const config = { TIDB_HOST: "example.invalid", TIDB_USER: "test", TIDB_PASSWORD: "not-a-secret", TIDB_DATABASE: "codeshark" };
function fakePool({ fail = false, previousTime } = {}) {
  const calls = [];
  const connection = {
    async beginTransaction() { calls.push("begin"); },
    async execute(sql, args) {
      calls.push({ sql, args });
      if (fail && sql.includes("cs_attempts")) throw new Error("private driver error");
      return [sql.startsWith("SELECT") ? previousTime === undefined ? [] : [{ client_sent_at: previousTime }] : {}];
    },
    async commit() { calls.push("commit"); },
    async rollback() { calls.push("rollback"); },
    release() { calls.push("release"); },
  };
  return { calls, async getConnection() { return connection; } };
}
function response() {
  return { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(data) { this.data = data; return this; } };
}

test("TLS verification, small pool, safe database names and no multi-statements", () => {
  const options = tidbOptions(config);
  assert.equal(options.ssl.rejectUnauthorized, true);
  assert.equal(options.port, 4000);
  assert.equal(options.multipleStatements, false);
  assert.equal(options.connectionLimit, 3);
  assert.throws(() => tidbOptions({}), /Missing/);
  assert.throws(() => tidbOptions({ ...config, TIDB_PORT: "abc" }), /PORT/);
  assert.throws(() => tidbOptions({ ...config, TIDB_DATABASE: "db; DROP DATABASE x" }), /DATABASE/);
});

test("validates all attempts before acquiring any DB connection", () => {
  assert.equal(validatePayload(payload()).save.coins, 20);
  for (const mutate of [
    (p) => { p.attempts[0].accuracy = 101; },
    (p) => { p.attempts[0].score = -1; },
    (p) => { p.attempts[0].stars = 4; },
    (p) => { p.attempts[0].passed = "yes"; },
    (p) => { p.attempts.push(p.attempts[0]); },
    (p) => { p.save.coins = NaN; },
    (p) => { p.sentAt = "now"; },
    (p) => { p.deviceId = ""; },
    (p) => { p.attempts = Array(201).fill(p.attempts[0]); },
  ]) {
    const p = payload(); mutate(p);
    assert.throws(() => validatePayload(p));
  }
  const large = payload(); large.save.extra = "x".repeat(1024 * 1024);
  assert.throws(() => validatePayload(large), /large/);
});

test("production never permits guest identity; userId in body is ignored", async () => {
  await assert.rejects(resolveOwner({ headers: {} }, payload(), { NODE_ENV: "production", TIDB_ALLOW_GUEST_SYNC: "true" }), { status: 401 });
  assert.equal(await resolveOwner({ headers: {} }, payload(), { NODE_ENV: "development", TIDB_ALLOW_GUEST_SYNC: "true" }), "guest:device-test");
  const p = payload(); p.userId = "forged";
  const owner = await resolveOwner({ headers: { authorization: "Bearer test-token" } }, p,
    { SUPABASE_URL: "https://example.invalid", SUPABASE_ANON_KEY: "public-key" },
    async (url, init) => {
      assert.equal(url.pathname, "/auth/v1/user");
      assert.equal(init.headers.authorization, "Bearer test-token");
      return { ok: true, json: async () => ({ id: "verified-user" }) };
    });
  assert.equal(owner, "user:verified-user");
});

test("transaction stores full snapshot, parameterizes values and acknowledges after commit", async () => {
  const pool = fakePool(); const p = payload(); p.profileName = "'; DROP TABLE cs_profiles; --";
  const ids = await persistTidbSync(pool, "user:verified", p);
  assert.deepEqual(ids, ["attempt-1"]);
  assert.equal(pool.calls[0].sql, "SET time_zone = '+00:00'");
  assert.equal(pool.calls[1], "begin");
  assert.deepEqual(pool.calls.slice(-2), ["commit", "release"]);
  const inserts = pool.calls.filter((call) => call.sql);
  assert(!inserts.some((call) => call.sql.includes(p.profileName)));
  assert.equal(inserts.find((call) => call.sql.startsWith("INSERT INTO cs_profiles")).args[2], p.profileName);
  const save = inserts.find((call) => call.sql.startsWith("INSERT INTO cs_saves"));
  assert.equal(JSON.parse(save.args[5]).claimedAchievements["lines-50"], 1);
  const attempt = inserts.find((call) => call.sql.includes("INSERT INTO cs_attempts"));
  assert(attempt.sql.includes("ON DUPLICATE KEY UPDATE id=VALUES(id)"));
});

test("failure rolls back, releases connection and never acknowledges", async () => {
  const pool = fakePool({ fail: true });
  await assert.rejects(persistTidbSync(pool, "user:test", payload()));
  assert(!pool.calls.includes("commit"));
  assert.deepEqual(pool.calls.slice(-2), ["rollback", "release"]);
});

test("older snapshots cannot overwrite newer snapshot but attempts still persist", async () => {
  const pool = fakePool({ previousTime: 1900000000000 });
  await persistTidbSync(pool, "user:test", payload());
  assert(!pool.calls.some((call) => call.sql?.startsWith("INSERT INTO cs_saves")));
  assert(pool.calls.some((call) => call.sql?.startsWith("INSERT INTO cs_attempts")));
});

test("API enforces method/auth, hides DB errors, returns durable IDs", async () => {
  const env = { NODE_ENV: "development", TIDB_ALLOW_GUEST_SYNC: "true" };
  const handler = createTidbSyncHandler({ pool: () => fakePool(), env });
  let res = response(); await handler({ method: "GET" }, res); assert.equal(res.code, 405);
  res = response(); await handler({ method: "POST", headers: {}, body: payload() }, res);
  assert.equal(res.code, 200); assert.deepEqual(res.data.acceptedIds, ["attempt-1"]);
  const broken = createTidbSyncHandler({ pool: () => fakePool({ fail: true }), env });
  res = response(); await broken({ method: "POST", headers: {}, body: payload() }, res);
  assert.equal(res.code, 503); assert(!JSON.stringify(res.data).includes("private driver error"));
  const prod = createTidbSyncHandler({ env: { NODE_ENV: "production" } });
  res = response(); await prod({ method: "POST", headers: {}, body: payload() }, res); assert.equal(res.code, 401);
});

test("Netlify adapter rejects malformed JSON and handles method response", async () => {
  assert.equal((await netlify({ httpMethod: "POST", body: "{" })).statusCode, 400);
  assert.equal((await netlify({ httpMethod: "GET", body: "{}" })).statusCode, 405);
});
