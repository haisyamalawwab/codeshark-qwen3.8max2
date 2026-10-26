// MODE DATA: auto (tes koneksi awal) | local (paksa) | cloud (paksa).
// - DATA_MODE=local → semua endpoint cloud 503 mode-lokal, tanpa koneksi.
// - DATA_MODE=auto  → endpoint tes /api/database-status MENJAWAB hasil
//   probe TiDB+Aiven (di sini tanpa kredensial: cloudReady=false,
//   decision="local") — itulah sinyal bagi frontend untuk memakai
//   SQLite/localStorage. Endpoint lain gagal aman (503 generik),
//   BUKAN 503 mode-lokal.
import test from "node:test";
import assert from "node:assert/strict";
import { serverMode, isLocalMode, isAutoMode, isCloudEnabled, cloudDisabledBody } from "../server/local-mode.mjs";

test("serverMode default auto; local/cloud hanya bila eksplisit", () => {
  assert.equal(serverMode({}), "auto");
  assert.equal(serverMode({ DATA_MODE: "auto" }), "auto");
  assert.equal(serverMode({ DATA_MODE: " local " }), "local");
  assert.equal(serverMode({ DATA_MODE: "CLOUD" }), "cloud");
  assert.equal(serverMode({ DATA_MODE: "sqlite" }), "auto"); // nilai tak dikenal → auto (tes awal)
  assert.equal(isLocalMode({}), false);
  assert.equal(isLocalMode({ DATA_MODE: "local" }), true);
  assert.equal(isAutoMode({}), true);
  assert.equal(isCloudEnabled({}), true); // cloud BOLEH dicoba (keputusan dari tes awal)
  assert.equal(isCloudEnabled({ DATA_MODE: "local" }), false);
  // Kredensial yang terisi tidak mengubah mode terkonfigurasi.
  assert.equal(serverMode({ DB_PROVIDER: "tidb", TIDB_HOST: "x", DATABASE_URL: "postgres://x" }), "auto");
  assert.equal(cloudDisabledBody().mode, "local");
  assert.equal(cloudDisabledBody().ok, false);
});

function fakeRes() {
  return {
    code: 200, headers: {}, body: undefined,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.code = code; return this; },
    json(value) { this.body = value; return this; },
  };
}

async function withDataMode(mode, fn) {
  const previous = process.env.DATA_MODE;
  if (mode === undefined) delete process.env.DATA_MODE; else process.env.DATA_MODE = mode;
  try { return await fn(); }
  finally {
    if (previous === undefined) delete process.env.DATA_MODE; else process.env.DATA_MODE = previous;
  }
}

test("DATA_MODE=local: semua endpoint Vercel (api/*.mjs) 503 mode-lokal tanpa koneksi", async () => {
  await withDataMode("local", async () => {
    const endpoints = ["site-settings", "admin-settings", "admin-setup", "admin-diagnostics", "database-status", "sync-progress"];
    for (const name of endpoints) {
      const { default: handler } = await import(new URL(`../api/${name}.mjs`, import.meta.url));
      const res = fakeRes();
      await handler({ method: "POST", headers: {}, body: {} }, res);
      assert.equal(res.code, 503, name);
      assert.equal(res.body.ok, false, name);
      assert.equal(res.body.mode, "local", name);
    }
  });
});

test("DATA_MODE=local: semua fungsi Netlify 503 mode-lokal tanpa koneksi", async () => {
  await withDataMode("local", async () => {
    const functions = ["site-settings", "admin-settings", "admin-setup", "admin-diagnostics", "database-status", "sync-progress"];
    for (const name of functions) {
      const { handler } = await import(new URL(`../netlify/functions/${name}.mjs`, import.meta.url));
      const result = await handler({ httpMethod: "POST", headers: {}, body: "{}" });
      assert.equal(result.statusCode, 503, name);
      const body = JSON.parse(result.body);
      assert.equal(body.ok, false, name);
      assert.equal(body.mode, "local", name);
      assert.equal(result.headers["Cache-Control"], "no-store", name);
    }
  });
});

test("DATA_MODE=auto (default): tes awal /api/database-status menjawab keputusan lokal bila cloud belum terkonfigurasi", async () => {
  await withDataMode(undefined, async () => {
    // Pastikan tidak ada kredensial cloud warisan dari environment test.
    const saved = {};
    for (const key of ["TIDB_HOST", "TIDB_USER", "TIDB_PASSWORD", "TIDB_DATABASE", "DATABASE_URL", "AIVEN_DATABASE_URL", "DB_PROVIDER"]) {
      saved[key] = process.env[key];
      delete process.env[key];
    }
    try {
      const { default: handler } = await import(new URL(`../api/database-status.mjs`, import.meta.url));
      const res = fakeRes();
      await handler({ method: "GET", headers: {} }, res);
      assert.equal(res.code, 503); // belum ada provider siap → 503 berisi LAPORAN probe
      assert.equal(res.body.mode, "auto");
      assert.equal(res.body.cloudReady, false);
      assert.equal(res.body.effectiveProvider, null);
      assert.equal(res.body.decision, "local"); // ← frontend memakai SQLite/localStorage
      assert.equal(res.body.providers.tidb.state, "disabled");
      assert.equal(res.body.providers.aiven.state, "not_configured");
    } finally {
      for (const [key, value] of Object.entries(saved)) {
        if (value === undefined) delete process.env[key]; else process.env[key] = value;
      }
    }
  });
});
