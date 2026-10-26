import { handleTidbSync, createTidbSyncHandler } from "../server/tidb-sync.mjs";
import { isLocalMode, sendCloudDisabled } from "../server/local-mode.mjs";
import { pickCloudProvider, aivenKind, aivenUrl, getAivenMysqlPool } from "../server/aiven.mjs";

// Serverless function: POST /api/sync-progress
// Vercel Node handler; Netlify adapter: netlify/functions/sync-progress.mjs.
// MODE DATA (DATA_MODE):
// - local      → 503 mode-lokal, tanpa koneksi apa pun.
// - auto/cloud → provider dipilih dari konfigurasi yang tersedia
//   (pickCloudProvider: DB_PROVIDER memaksa prioritas, default TiDB
//   lalu Aiven). Keputusan cloud-vs-lokal di klien berasal dari tes
//   koneksi awal /api/database-status — handler ini tinggal melayani
//   provider terpilih dan gagal aman (503) bila DB tak terjangkau,
//   agar outbox klien tidak dibuang.

let aivenHandler;
async function getAivenHandler(env) {
  if (!aivenHandler) {
    if (aivenKind(aivenUrl(env)) === "mysql") {
      // Aiven for MySQL memakai skema cs_* + handler yang sama dengan TiDB.
      aivenHandler = createTidbSyncHandler({ pool: () => getAivenMysqlPool(env), env });
    } else {
      const { createAivenSyncHandler } = await import("../server/aiven-sync.mjs");
      aivenHandler = createAivenSyncHandler({ env });
    }
  }
  return aivenHandler;
}

export default async function handler(req, res) {
  if (isLocalMode()) return sendCloudDisabled(req, res);
  const provider = pickCloudProvider(process.env);
  if (provider === "tidb") return handleTidbSync(req, res);
  if (provider === "aiven") return (await getAivenHandler(process.env))(req, res);
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  // Fail closed: do not acknowledge data that has not been persisted.
  return res.status(503).json({ ok: false, error: "Cloud database is not configured" });
}
