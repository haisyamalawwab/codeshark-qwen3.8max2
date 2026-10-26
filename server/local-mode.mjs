// ============================================================
// MODE DATA SERVER: auto | local | cloud  (env DATA_MODE)
// ------------------------------------------------------------
// - "auto"  (DEFAULT): handler cloud BOLEH jalan; keputusan
//   cloud-vs-lokal diambil dari TES KONEKSI AWAL
//   (/api/database-status mengetes TiDB Cloud + Aiven).
//   Terhubung → cloud, gagal/tidak terkonfigurasi → klien
//   memakai mode lokal (SQLite/localStorage).
// - "local" : paksa lokal — semua endpoint cloud menjawab 503
//   mode-lokal tanpa membuka koneksi/meraba kredensial.
// - "cloud" : paksa cloud — handler selalu jalan; kegagalan
//   koneksi dilaporkan sebagai error (tanpa fallback).
//
// isLocalMode() di sini berarti "dipaksa lokal" (forced local)
// dan dipakai sebagai gerbang oleh api/ + netlify/functions/ +
// server/dev-api.mjs + skrip CLI.
// ============================================================

export const CLOUD_DISABLED_MESSAGE =
  "Koneksi cloud (TiDB Cloud/Aiven/Better Auth) dinonaktifkan (DATA_MODE=local) — aplikasi berjalan dalam mode lokal (SQLite/localStorage).";

/** Mode terkonfigurasi server: "auto" (default) | "local" | "cloud". */
export function serverMode(env = process.env) {
  const raw = String(env.DATA_MODE ?? "auto").trim().toLowerCase();
  return raw === "local" || raw === "cloud" ? raw : "auto";
}

/** True HANYA bila dipaksa lokal (DATA_MODE=local). */
export function isLocalMode(env = process.env) {
  return serverMode(env) === "local";
}

export function isAutoMode(env = process.env) {
  return serverMode(env) === "auto";
}

/** Cloud boleh dicoba (auto atau cloud paksa). */
export function isCloudEnabled(env = process.env) {
  return !isLocalMode(env);
}

export function cloudDisabledBody() {
  return { ok: false, mode: "local", error: CLOUD_DISABLED_MESSAGE };
}

/** Balas 503 mode-lokal untuk handler Node bergaya (req, res) — Vercel + dev-api. */
export function sendCloudDisabled(_req, res) {
  if (typeof res.setHeader === "function") {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
  }
  return res.status(503).json(cloudDisabledBody());
}

/** Balas 503 mode-lokal untuk handler Netlify (event → response). */
export function cloudDisabledResponse() {
  return {
    statusCode: 503,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
    body: JSON.stringify(cloudDisabledBody()),
  };
}

/** Untuk skrip CLI cloud (db:tidb:*, db:verify, auth:verify, db:settings:init). */
export function exitIfLocalMode(scriptName, env = process.env) {
  if (!isLocalMode(env)) return;
  console.log(
    `[mode lokal] ${scriptName} dilewati — DATA_MODE=local memaksa mode lokal. ` +
      "Set DATA_MODE=auto/cloud (dan lengkapi env cloud) untuk menjalankannya. Lihat docs/036_mode-lokal_26102026_0819.md.",
  );
  process.exit(0);
}
