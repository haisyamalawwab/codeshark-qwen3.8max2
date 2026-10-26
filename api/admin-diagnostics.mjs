// Diagnostik admin (tes koneksi mendalam). DATA_MODE=local memaksa
// 503 mode-lokal; auto/cloud memuat handler (otorisasi admin di dalamnya).
import { isLocalMode, sendCloudDisabled } from "../server/local-mode.mjs";

let cloudHandler;
export default async function handler(req, res) {
  if (isLocalMode()) return sendCloudDisabled(req, res);
  cloudHandler ??= (await import("../server/admin-diagnostics.mjs")).createAdminDiagnosticsHandler();
  return cloudHandler(req, res);
}
