import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import { spawnSync } from "node:child_process";
import { environmentReport, createDatabaseStatusService, createDatabaseStatusHandler } from "../server/database-status.mjs";
import { createNetlifyDatabaseStatusHandler } from "../netlify/functions/database-status.mjs";

const env = {
  DB_PROVIDER: "tidb", TIDB_HOST: "private-host.invalid", TIDB_PORT: "4000", TIDB_USER: "private-user",
  TIDB_PASSWORD: "private-password", TIDB_DATABASE: "codeshark",
  SUPABASE_URL: "https://private-project.invalid", SUPABASE_ANON_KEY: "private-key",
};
function database({ failConnection = false, failSchema = false, missingVersion = false } = {}) {
  const calls = [];
  let released = 0;
  let destroyed = 0;
  return {
    calls, get released() { return released; }, get destroyed() { return destroyed; },
    async getConnection() {
      if (failConnection) throw new Error(`password=${env.TIDB_PASSWORD}`);
      return {
        async query({ sql }) {
          calls.push(sql);
          if (failSchema && sql.includes("cs_profiles")) throw new Error("private SQL table error");
          return [sql.includes("cs_schema_migrations") && !missingVersion ? [{ version: "001_initial_tidb" }] : []];
        },
        release() { released++; }, destroy() { destroyed++; },
      };
    },
  };
}
const inspect = (options = {}) => createDatabaseStatusService({ env, options: () => {}, ...options });
function response() {
  return { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}

test("incomplete environment/disabled provider never contacts database or returns env values", async () => {
  let accessed = false;
  const pool = () => { accessed = true; throw new Error(); };
  assert.equal((await inspect({ env: { DB_PROVIDER: "tidb" }, pool })()).state, "env_incomplete");
  assert.equal((await inspect({ env: {}, pool })()).state, "disabled");
  assert.equal(accessed, false);
  const fields = environmentReport({ ...env, TIDB_PASSWORD: "<PASSWORD>" });
  assert.equal(fields.find((f) => f.name === "TIDB_PASSWORD").status, "missing");
  for (const value of Object.values(env).filter((v) => v.startsWith("private"))) assert(!JSON.stringify(fields).includes(value));
});

test("CA/config errors and system databases fail closed before opening connections", async () => {
  let accessed = false;
  const pool = () => { accessed = true; throw new Error(); };
  assert.equal((await inspect({ pool, options: () => { throw new Error("file missing"); } })()).state, "config_invalid");
  assert.equal((await inspect({ pool, env: { ...env, TIDB_DATABASE: "sys" } })()).state, "config_invalid");
  assert.equal(accessed, false);
});

test("successful probe uses read-only queries, migration marker and releases connection", async () => {
  const db = database();
  const report = await inspect({ pool: () => db })();
  assert.equal(report.state, "connected");
  assert.equal(report.tls, "verified");
  assert.equal(report.schema, "ready");
  assert.equal(report.syncPrerequisitesReady, true);
  assert.equal(db.calls.length, 5);
  assert(db.calls.every((sql) => sql.startsWith("SELECT ")));
  assert.equal(db.released, 1);
  for (const value of [env.TIDB_HOST, env.TIDB_USER, env.TIDB_PASSWORD, env.SUPABASE_URL, env.SUPABASE_ANON_KEY]) assert(!JSON.stringify(report).includes(value));
});

test("connection failure, unreadable schema, absent version and auth config are distinct", async () => {
  assert.equal((await inspect({ pool: () => database({ failConnection: true }) })()).state, "connection_failed");
  for (const flags of [{ failSchema: true }, { missingVersion: true }]) {
    const report = await inspect({ pool: () => database(flags) })();
    assert.equal(report.state, "schema_missing");
    assert.equal(report.database, "connected");
    assert.equal(report.syncPrerequisitesReady, false);
  }
  const report = await inspect({ env: { ...env, SUPABASE_URL: "http://invalid", SUPABASE_ANON_KEY: "" }, pool: () => database() })();
  assert.equal(report.state, "connected");
  assert.equal(report.identityConfigured, false);
  assert.equal(report.syncPrerequisitesReady, false);
});

test("cache and single-flight bound probes, then expire for a new check", async () => {
  let time = 1800000000000;
  let acquisitions = 0;
  const service = inspect({ now: () => time, ttlMs: 30000, pool: () => { acquisitions++; return database(); } });
  const reports = await Promise.all([service(), service(), service()]);
  assert.equal(acquisitions, 1);
  assert.deepEqual(reports[0], reports[2]);
  await service(); assert.equal(acquisitions, 1);
  time += 30001;
  await service(); assert.equal(acquisitions, 2);
});

test("timeout returns a bounded report and closes a connection acquired after deadline", async () => {
  let finish;
  let destroyed = 0;
  const pending = new Promise((resolve) => { finish = resolve; });
  const report = await inspect({ timeoutMs: 5, pool: () => ({ getConnection: () => pending }) })();
  assert.equal(report.state, "timeout");
  finish({ destroy() { destroyed++; }, release() { throw new Error("late connection must be destroyed"); } });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(destroyed, 1);
});

test("HTTP and Netlify adapters return JSON states with no-store and correct routing methods", async () => {
  const handler = createDatabaseStatusHandler({ env, options: () => {}, pool: () => database() });
  const res = response(); await handler({ method: "GET" }, res);
  assert.equal(res.code, 200); assert.equal(res.headers["Cache-Control"], "no-store");
  const method = response(); await handler({ method: "POST" }, method);
  assert.equal(method.code, 405); assert.equal(method.headers.Allow, "GET");
  const netlify = createNetlifyDatabaseStatusHandler({ env: {}, options: () => {}, pool: () => { throw new Error("must not connect"); } });
  const result = await netlify({ httpMethod: "GET" });
  assert.equal(result.statusCode, 503);
  assert.equal(result.headers["Content-Type"], "application/json");
  assert.equal(JSON.parse(result.body).state, "env_incomplete");
});

const source = await readFile(new URL("../src/lib/databaseStatus.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { fetchDatabaseStatus } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
test("client accepts 503 readiness JSON but never treats HTML, malformed JSON, or auth errors as connected", async () => {
  const original = globalThis.fetch;
  try {
    const report = await inspect({ env: { DB_PROVIDER: "tidb" } })();
    globalThis.fetch = async () => new Response(JSON.stringify(report), { status: 503, headers: { "Content-Type": "application/json" } });
    assert.equal((await fetchDatabaseStatus(new AbortController().signal)).state, "env_incomplete");
    for (const result of [
      new Response("<html>SPA fallback</html>", { headers: { "Content-Type": "text/html" } }),
      new Response(JSON.stringify({ state: "connected" }), { headers: { "Content-Type": "application/json" } }),
      new Response("Unauthorized", { status: 401 }),
    ]) {
      globalThis.fetch = async () => result;
      await assert.rejects(fetchDatabaseStatus(new AbortController().signal));
    }
  } finally { globalThis.fetch = original; }
});


test("CLI fails safely for missing env without loading workspace secrets or connecting", () => {
  const result = spawnSync(process.execPath, ["scripts/verify-database.mjs"], {
    cwd: new URL("../", import.meta.url),
    env: { DB_PROVIDER: "tidb" }, encoding: "utf8", timeout: 10000,
  });
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout);
  assert.equal(report.state, "env_incomplete");
  assert.equal(report.database, "not_checked");
  assert.equal(report.syncPrerequisitesReady, false);
});
