import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/sync.ts", import.meta.url), "utf8");

/* Bangun modul sync.ts dengan mode data tertentu.
   - "cloud": perilaku sinkron lama (fetch /api/sync-progress).
   - "local": MODE LOKAL sementara — pushOutbox tidak boleh fetch. */
async function buildSync(mode) {
  const js = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText
    .replace(/import \{ accessToken \} from "\.\/auth";/, "const accessToken = async () => null;")
    .replace(
      /import \{ isCloudSyncEnabled \} from "\.\/featureFlags";/,
      `const isCloudSyncEnabled = () => ${mode === "cloud" ? "true" : "false"};`,
    )
    .replaceAll("import.meta.env", "({})");
  return import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
}

const sync = await buildSync("cloud");

test("outbox acknowledges only durable IDs, preserves concurrent items, and rejects mock/error responses", async () => {
  const originalStorage = globalThis.localStorage;
  const originalFetch = globalThis.fetch;
  const memory = new Map();
  globalThis.localStorage = { getItem: (key) => memory.get(key) || null, setItem: (key, value) => memory.set(key, value) };
  try {
    for (const result of [{ ok: true, mock: true, acceptedIds: ["a"] }, { ok: true, warning: "failed", acceptedIds: ["a"] }, { ok: false }, { ok: true, synced: 1 }]) {
      sync.replaceOutbox([{ id: "a" }]);
      globalThis.fetch = async () => ({ ok: true, json: async () => result });
      await assert.rejects(sync.pushOutbox("device", null, {}));
      assert.equal(sync.loadOutbox().length, 1);
    }
    sync.replaceOutbox([{ id: "a" }, { id: "b" }]);
    globalThis.fetch = async () => {
      sync.enqueueAttempt({ id: "c" });
      return { ok: true, json: async () => ({ ok: true, acceptedIds: ["a", "unknown", "a"] }) };
    };
    assert.deepEqual(await sync.pushOutbox("device", null, {}), { sent: 1, ok: false });
    assert.deepEqual(sync.loadOutbox().map((a) => a.id), ["b", "c"]);
    globalThis.fetch = async () => ({ ok: false, status: 503 });
    await assert.rejects(sync.pushOutbox("device", null, {}), /503/);
    assert.equal(sync.loadOutbox().length, 2);
  } finally {
    globalThis.localStorage = originalStorage;
    globalThis.fetch = originalFetch;
  }
});

test("MODE LOKAL: pushOutbox tidak pernah fetch dan outbox dipertahankan untuk sinkron nanti", async () => {
  const local = await buildSync("local");
  const originalStorage = globalThis.localStorage;
  const originalFetch = globalThis.fetch;
  const memory = new Map();
  globalThis.localStorage = { getItem: (key) => memory.get(key) || null, setItem: (key, value) => memory.set(key, value) };
  let fetchCalls = 0;
  globalThis.fetch = async () => { fetchCalls++; throw new Error("jaringan tidak boleh disentuh di mode lokal"); };
  try {
    local.replaceOutbox([{ id: "a" }]);
    assert.deepEqual(await local.pushOutbox("device", null, {}), { sent: 0, ok: true });
    assert.equal(fetchCalls, 0);
    assert.deepEqual(local.loadOutbox().map((a) => a.id), ["a"]);
  } finally {
    globalThis.localStorage = originalStorage;
    globalThis.fetch = originalFetch;
  }
});
