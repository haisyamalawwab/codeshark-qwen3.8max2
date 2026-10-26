// TES KONEKSI AWAL TiDB Cloud + Aiven. DATA_MODE=local memaksa
// 503 mode-lokal; auto/cloud menjalankan probe (docs/036_mode-lokal_26102026_0819.md).
import { isLocalMode, sendCloudDisabled } from "../server/local-mode.mjs";

let cloudHandler;
export default async function handler(req, res) {
  if (isLocalMode()) return sendCloudDisabled(req, res);
  cloudHandler ??= (await import("../server/database-status.mjs")).createDatabaseStatusHandler();
  return cloudHandler(req, res);
}
