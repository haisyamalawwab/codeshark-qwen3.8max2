// Redis cache OPSIONAL: deteksi konfigurasi, klien REST Upstash
// (fetch palsu), probe PING+tulis/baca, dan pemakaiannya sebagai
// cache bersama hasil tes koneksi antar-instance serverless.
// Tanpa konfigurasi Redis, tidak ada jaringan yang disentuh.
import test from "node:test";
import assert from "node:assert/strict";
import { redisConfig, redisConfigured, createRedisCache, probeRedis } from "../server/redis.mjs";
import { createDatabaseStatusService } from "../server/database-status.mjs";

test("redisConfig: Upstash REST didahulukan, lalu TCP, selain itu null", () => {
  assert.equal(redisConfig({}), null);
  assert.equal(redisConfigured({}), false);
  assert.deepEqual(
    redisConfig({ UPSTASH_REDIS_REST_URL: "https://x.upstash.io", UPSTASH_REDIS_REST_TOKEN: "tok" }),
    { kind: "upstash-rest", url: "https://x.upstash.io", token: "tok" },
  );
  assert.equal(redisConfig({ REDIS_URL: "rediss://u:p@host:6379" }).kind, "tcp");
  assert.equal(redisConfig({ UPSTASH_REDIS_REST_URL: "https://x" }), null); // token wajib
  assert.equal(createRedisCache({}), null);
});

function restFetch(store = new Map()) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, auth: init.headers.Authorization, args: JSON.parse(init.body) });
    const [cmd, key, value] = JSON.parse(init.body);
    let result = null;
    if (cmd === "PING") result = "PONG";
    if (cmd === "SET") { store.set(key, value); result = "OK"; }
    if (cmd === "GET") result = store.get(key) ?? null;
    if (cmd === "DEL") { result = store.delete(key) ? 1 : 0; }
    return { ok: true, json: async () => ({ result }) };
  };
  return { fetchImpl, calls, store };
}

test("klien Upstash REST: get/set/del/ping dengan header Authorization", async () => {
  const { fetchImpl, calls } = restFetch();
  const cache = createRedisCache(
    { UPSTASH_REDIS_REST_URL: "https://x.upstash.io", UPSTASH_REDIS_REST_TOKEN: "tok-rahasia" },
    { fetchImpl },
  );
  assert.equal(cache.kind, "upstash-rest");
  await cache.set("k1", "v1", 30);
  assert.equal(await cache.get("k1"), "v1");
  assert.equal(await cache.ping(), "PONG");
  await cache.del("k1");
  assert.equal(await cache.get("k1"), null);
  assert(calls.every((c) => c.auth === "Bearer tok-rahasia"));
  assert.deepEqual(calls[0].args, ["SET", "k1", "v1", "EX", 30]);
});

test("probeRedis: PING + tulis/baca kunci diagnostik; gagal tidak membocorkan token", async () => {
  const ok = await probeRedis(
    { UPSTASH_REDIS_REST_URL: "https://x.upstash.io", UPSTASH_REDIS_REST_TOKEN: "tok" },
    { fetchImpl: restFetch().fetchImpl },
  );
  assert.equal(ok.state, "connected");
  assert.equal(typeof ok.latencyMs, "number");

  const bad = await probeRedis(
    { UPSTASH_REDIS_REST_URL: "https://x.upstash.io", UPSTASH_REDIS_REST_TOKEN: "tok-super-rahasia" },
    { fetchImpl: async () => { throw new Error("connect ECONNREFUSED with tok-super-rahasia"); } },
  );
  assert.equal(bad.state, "connection_failed");
  assert(!JSON.stringify(bad).includes("tok-super-rahasia"));

  assert.deepEqual(await probeRedis({}), { configured: false, kind: null, state: "not_configured", latencyMs: null });
});

test("database-status memakai Redis sebagai cache bersama antar-instance (probe DB hanya sekali)", async () => {
  const store = new Map();
  const fakeCache = {
    kind: "upstash-rest",
    async get(key) { return store.get(key) ?? null; },
    async set(key, value) { store.set(key, value); },
    async del(key) { store.delete(key); },
    async ping() { return "PONG"; },
  };
  let acquisitions = 0;
  const fakeDb = {
    async getConnection() {
      acquisitions++;
      return {
        async query({ sql }) { return [sql.includes("cs_schema_migrations") ? [{ version: "001_initial_tidb" }] : []]; },
        release() {}, destroy() {},
      };
    },
  };
  const env = {
    DB_PROVIDER: "tidb", TIDB_HOST: "h.invalid", TIDB_USER: "u", TIDB_PASSWORD: "p", TIDB_DATABASE: "codeshark",
    SUPABASE_URL: "https://auth.invalid", SUPABASE_ANON_KEY: "pub",
  };
  const makeService = () => createDatabaseStatusService({ env, options: () => {}, pool: () => fakeDb, cache: fakeCache });
  const first = await makeService()();
  const second = await makeService()(); // instance "serverless" lain
  assert.equal(first.state, "connected");
  assert.equal(second.state, "connected");
  assert.equal(acquisitions, 1); // instance kedua membaca dari Redis, bukan DB

  // cache: null eksplisit (tes admin fresh) selalu mem-probe ulang.
  const fresh = createDatabaseStatusService({ env, options: () => {}, pool: () => fakeDb, cache: null, ttlMs: 0 });
  await fresh();
  assert.equal(acquisitions, 2);
});
