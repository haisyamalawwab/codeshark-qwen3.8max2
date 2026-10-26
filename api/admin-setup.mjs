// DATA_MODE=local memaksa 503 mode-lokal;
// auto/cloud menjalankan diagnostik setup (docs/036_mode-lokal_26102026_0819.md).
import { isLocalMode, sendCloudDisabled } from "../server/local-mode.mjs";

let cloudHandler;
export default async function handler(req, res) {
  if (isLocalMode()) return sendCloudDisabled(req, res);
  cloudHandler ??= (await import("../server/admin-setup.mjs")).createAdminSetupHandler();
  return cloudHandler(req, res);
}
