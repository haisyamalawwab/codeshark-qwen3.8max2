import test from "node:test";
import assert from "node:assert/strict";
import { rootCertificates } from "node:tls";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createNetlifyHandler } from "../netlify/functions/sync-progress.mjs";
import { tidbOptions } from "../server/tidb.mjs";

const config = { TIDB_HOST: "example.invalid", TIDB_USER: "test", TIDB_PASSWORD: "test-only", TIDB_DATABASE: "codeshark" };
const payload = () => ({
  deviceId: "test-device", profileName: "Kadet", sentAt: 1800000000000,
  save: { xp: 10, coins: 5, modules: {}, stats: {} },
  attempts: [{ id: "netlify-1", sessionId: "q:1:quest", won: true, passed: true, stars: 3, score: 100, accuracy: 99, wpm: 30, maxCombo: 20, xpAward: 10, coinsAward: 5, at: 1800000000000 }],
});
const identityEnv = { SUPABASE_URL: "https://identity.invalid", SUPABASE_ANON_KEY: "test-public-key" };
function event(body = payload()) {
  return { httpMethod: "POST", headers: { Authorization: "Bearer test-token" }, body: JSON.stringify(body) };
}
function poolMock() {
  const calls = [];
  return {
    calls,
    async getConnection() {
      return {
        async execute(sql, args) { calls.push({ sql, args }); return [[]]; },
        async beginTransaction() { calls.push("begin"); },
        async commit() { calls.push("commit"); },
        async rollback() { calls.push("rollback"); },
        release() { calls.push("release"); },
      };
    },
  };
}

test("CA content supports Netlify multiline and escaped-newline env without disabling TLS", () => {
  const pem = rootCertificates[0];
  for (const value of [pem, pem.replaceAll("\n", "\\n")]) {
    const { ssl } = tidbOptions({ ...config, TIDB_CA_CERT: value });
    assert.equal(ssl.ca, pem.trim());
    assert.equal(ssl.rejectUnauthorized, true);
    assert.equal(ssl.minVersion, "TLSv1.2");
  }
  assert.equal(tidbOptions(config).ssl.ca, undefined);
  assert.throws(() => tidbOptions({ ...config, TIDB_CA_CERT: "<CA_PATH>" }), /PEM/);
  assert.throws(() => tidbOptions({ ...config, TIDB_CA_CERT: pem, TIDB_CA_PATH: "/unused" }), /only one/);
});

test("Netlify decodes base64 JSON, normalizes bearer headers and acknowledges committed IDs", async () => {
  const pool = poolMock();
  const handler = createNetlifyHandler({ env: identityEnv, pool: () => pool, request: async (_url, init) => {
    assert.equal(init.headers.authorization, "Bearer test-token");
    return { ok: true, json: async () => ({ id: "verified-id" }) };
  } });
  const req = event(); req.isBase64Encoded = true; req.body = Buffer.from(req.body).toString("base64");
  const result = await handler(req);
  assert.equal(result.statusCode, 200);
  assert.equal(result.headers["Cache-Control"], "no-store");
  assert.deepEqual(JSON.parse(result.body).acceptedIds, ["netlify-1"]);
  assert(pool.calls.includes("commit"));
  assert.equal(pool.calls.find((call) => call.sql?.includes("INSERT INTO cs_profiles")).args[0], "user:verified-id");
});

test("Netlify refuses guest mode even with development env and explicit opt-in", async () => {
  let accessed = false;
  const handler = createNetlifyHandler({
    env: { NODE_ENV: "development", TIDB_ALLOW_GUEST_SYNC: "true" },
    pool: () => { accessed = true; throw new Error("Should not reach DB"); },
  });
  const req = event(); req.headers = {};
  assert.equal((await handler(req)).statusCode, 401);
  assert.equal(accessed, false);
});

test("Netlify rejects invalid token and missing verifier configuration without DB access", async () => {
  const noDb = () => { throw new Error("Should not reach DB"); };
  const missing = createNetlifyHandler({ env: {}, pool: noDb });
  assert.equal((await missing(event())).statusCode, 503);
  const rejected = createNetlifyHandler({ env: identityEnv, pool: noDb, request: async () => ({ ok: false, status: 401 }) });
  assert.equal((await rejected(event())).statusCode, 401);
});

test("Netlify enforces methods, malformed JSON and payload size before identity or SQL", async () => {
  const handler = createNetlifyHandler({ env: {} });
  const method = await handler({ httpMethod: "GET", body: "not JSON" });
  assert.equal(method.statusCode, 405);
  assert.equal(method.headers.Allow, "POST");
  assert.equal((await handler({ ...event(), body: "{" })).statusCode, 400);
  assert.equal((await handler({ ...event(), body: "x".repeat(1024 * 1024 + 1) })).statusCode, 413);
});

test("Netlify reports DB failure without false acknowledgement or private details", async () => {
  const handler = createNetlifyHandler({
    env: identityEnv,
    request: async () => ({ ok: true, json: async () => ({ id: "verified-id" }) }),
    pool: () => { throw new Error("password=private-test-value"); },
  });
  const result = await handler(event());
  assert.equal(result.statusCode, 503);
  assert.equal(JSON.parse(result.body).ok, false);
  assert(!result.body.includes("private-test-value"));
  assert(!result.body.includes("acceptedIds"));
});


test("bundled-file CA reads PEM, fails closed on missing files, and rejects private keys", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "codeshark-ca-"));
  const caPath = path.join(directory, "tidb-ca-rozanhaisyam.pem");
  try {
    await writeFile(caPath, rootCertificates[0]);
    const options = tidbOptions({ ...config, TIDB_CA_PATH: caPath });
    assert.equal(options.ssl.ca, rootCertificates[0]);
    assert.equal(options.ssl.rejectUnauthorized, true);
    await writeFile(caPath, rootCertificates[0] + "\n-----BEGIN RSA PRIVATE KEY-----\nnot-a-real-key\n-----END RSA PRIVATE KEY-----");
    assert.throws(() => tidbOptions({ ...config, TIDB_CA_PATH: caPath }), /private key/);
    assert.throws(() => tidbOptions({ ...config, TIDB_CA_CERT: rootCertificates[0] + "\n-----BEGIN PRIVATE KEY-----\nnot-a-real-key\n-----END PRIVATE KEY-----" }), /private key/);
    assert.throws(() => tidbOptions({ ...config, TIDB_CA_PATH: path.join(directory, "missing.pem") }), /ENOENT/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
