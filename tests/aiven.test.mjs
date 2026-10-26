// Aiven sebagai provider cloud kedua: deteksi konfigurasi, tes koneksi
// awal (probe), pemilihan provider, dan handler sync PostgreSQL.
// Semua koneksi memakai klien palsu yang disuntikkan — tidak ada
// jaringan/kredensial asli yang disentuh.
import test from "node:test";
import assert from "node:assert/strict";
import {
  aivenUrl, aivenKind, aivenConfigured, tidbConfigured, pickCloudProvider, probeAiven,
} from "../server/aiven.mjs";
import { createAivenSyncHandler } from "../server/aiven-sync.mjs";

const pgEnv = { AIVEN_DATABASE_URL: "postgres://user:secret-pass@pg.example.aivencloud.com:12345/defaultdb?sslmode=require" };
const mysqlEnv = { AIVEN_DATABASE_URL: "mysql://user:secret-pass@mysql.example.aivencloud.com:12346/defaultdb" };
const tidbEnv = { TIDB_HOST: "h", TIDB_USER: "u", TIDB_PASSWORD: "p", TIDB_DATABASE: "codeshark" };

test("Aiven memakai env DB game khusus; DATABASE_URL MySQL dicadangkan untuk Better Auth", () => {
  assert.equal(aivenUrl(pgEnv), pgEnv.AIVEN_DATABASE_URL);
  assert.equal(aivenUrl(mysqlEnv), mysqlEnv.AIVEN_DATABASE_URL);
  assert.equal(aivenUrl({ GAME_DATABASE_URL: "mysql://game" }), "mysql://game");
  assert.equal(aivenUrl({ NETLIFY_DATABASE_URL: "postgres://x" }), "postgres://x");
  // PostgreSQL legacy tetap kompatibel, tetapi MySQL/MariaDB di DATABASE_URL
  // adalah Layerbase Auth Server dan tidak boleh diprobe sebagai DB game.
  assert.equal(aivenUrl({ DATABASE_URL: "postgres://legacy" }), "postgres://legacy");
  assert.equal(aivenUrl({ DATABASE_URL: "mysql://layerbase-auth" }), "");
  assert.equal(aivenKind(pgEnv.AIVEN_DATABASE_URL), "postgres");
  assert.equal(aivenKind("postgresql://x"), "postgres");
  assert.equal(aivenKind(mysqlEnv.AIVEN_DATABASE_URL), "mysql");
  assert.equal(aivenKind("redis://x"), null);
  assert.equal(aivenConfigured({}), false);
  assert.equal(tidbConfigured(tidbEnv), true);
  assert.equal(tidbConfigured({ TIDB_HOST: "h" }), false);
});

test("pickCloudProvider: default TiDB dahulu, DB_PROVIDER memaksa prioritas", () => {
  assert.equal(pickCloudProvider({}), null);
  assert.equal(pickCloudProvider(tidbEnv), "tidb");
  assert.equal(pickCloudProvider(pgEnv), "aiven");
  assert.equal(pickCloudProvider({ ...tidbEnv, ...pgEnv }), "tidb");
  assert.equal(pickCloudProvider({ ...tidbEnv, ...pgEnv, DB_PROVIDER: "aiven" }), "aiven");
  assert.equal(pickCloudProvider({ ...tidbEnv, DB_PROVIDER: "aiven" }), "tidb"); // aiven tak terkonfigurasi → fallback tidb
});

test("probeAiven postgres: terhubung + skema siap, tanpa membocorkan URL/kredensial", async () => {
  let seenUrl;
  const report = await probeAiven(pgEnv, {
    connectPostgres: async (url) => {
      seenUrl = url;
      return {
        async query() { return { rows: [{ table_name: "profiles" }, { table_name: "saves" }, { table_name: "attempts" }] }; },
        async end() {},
      };
    },
  });
  assert.equal(seenUrl, pgEnv.AIVEN_DATABASE_URL);
  assert.deepEqual(report, { configured: true, kind: "postgres", state: "connected", schema: "ready" });
  assert(!JSON.stringify(report).includes("secret-pass"));
});

test("probeAiven: skema belum ada, koneksi gagal, URL tak dikenal, dan belum dikonfigurasi", async () => {
  const missing = await probeAiven(pgEnv, {
    connectPostgres: async () => ({ async query() { return { rows: [] }; }, async end() {} }),
  });
  assert.equal(missing.state, "schema_missing");
  assert.equal(missing.schema, "missing");

  const failed = await probeAiven(pgEnv, {
    connectPostgres: async () => { throw new Error("connection refused by secret host"); },
  });
  assert.equal(failed.state, "connection_failed");
  assert(!JSON.stringify(failed).includes("secret"));

  assert.equal((await probeAiven({ AIVEN_DATABASE_URL: "redis://x" })).state, "config_invalid");
  assert.deepEqual(await probeAiven({}), { configured: false, kind: null, state: "not_configured", schema: "not_checked" });
});

test("probeAiven mysql: tabel cs_* lengkap → connected", async () => {
  const report = await probeAiven(mysqlEnv, {
    connectMysql: async () => ({
      async query() {
        return [[
          { "Tables_in_defaultdb (cs\\_%)": "cs_profiles" },
          { "Tables_in_defaultdb (cs\\_%)": "cs_saves" },
          { "Tables_in_defaultdb (cs\\_%)": "cs_attempts" },
          { "Tables_in_defaultdb (cs\\_%)": "cs_schema_migrations" },
        ]];
      },
      async end() {},
    }),
  });
  assert.equal(report.state, "connected");
  assert.equal(report.kind, "mysql");
});

const payload = () => ({
  deviceId: "device-test", profileName: "Kadet", sentAt: 1800000000000,
  save: { xp: 100, coins: 20, modules: {}, stats: {}, profile: { age: "teen" } },
  attempts: [{ id: "attempt-1", sessionId: "q:1:quest", won: true, passed: true, stars: 3, score: 1000, accuracy: 99, wpm: 40, maxCombo: 10, xpAward: 100, coinsAward: 20, at: 1800000000000 }],
});
function fakePgPool({ fail = false } = {}) {
  const calls = [];
  return {
    calls,
    async connect() {
      return {
        async query(text, params) {
          calls.push({ text, params });
          if (fail && text.includes("attempts")) throw new Error("private driver error with secret");
          return { rows: [] };
        },
        release() {},
      };
    },
  };
}
function resStub() {
  return { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, json(v) { this.body = v; return this; } };
}

test("sync Aiven PostgreSQL: tamu dev menulis dalam transaksi dan mengembalikan acceptedIds", async () => {
  const pool = fakePgPool();
  const handler = createAivenSyncHandler({
    env: { NODE_ENV: "development", TIDB_ALLOW_GUEST_SYNC: "true" },
    getPool: async () => pool,
  });
  const res = resStub();
  await handler({ method: "POST", headers: {}, body: payload() }, res);
  assert.equal(res.code, 200);
  assert.deepEqual(res.body.acceptedIds, ["attempt-1"]);
  const texts = pool.calls.map((c) => c.text);
  assert(texts[0] === "BEGIN" && texts.at(-1) === "COMMIT");
  assert(texts.some((sql) => sql.includes("INSERT INTO profiles")));
  assert(texts.some((sql) => sql.includes("INSERT INTO attempts") && sql.includes("ON CONFLICT (id) DO NOTHING")));
  // Parameterized: tidak ada interpolasi nilai payload ke teks SQL.
  assert(!texts.join(" ").includes("Kadet"));
});

test("sync Aiven: produksi tanpa token ditolak; kegagalan DB tidak membocorkan error driver", async () => {
  const prod = createAivenSyncHandler({ env: { NODE_ENV: "production" }, getPool: async () => fakePgPool() });
  const denied = resStub();
  await prod({ method: "POST", headers: {}, body: payload() }, denied);
  assert.equal(denied.code, 401);

  const broken = createAivenSyncHandler({
    env: { NODE_ENV: "development", TIDB_ALLOW_GUEST_SYNC: "true" },
    getPool: async () => fakePgPool({ fail: true }),
  });
  const failed = resStub();
  await broken({ method: "POST", headers: {}, body: payload() }, failed);
  assert.equal(failed.code, 503);
  assert(!JSON.stringify(failed.body).includes("private driver error"));
});
