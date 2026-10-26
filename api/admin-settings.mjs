// DATA_MODE=local memaksa 503 mode-lokal;
// auto/cloud memuat handler admin settings (TiDB) (docs/MODE-LOKAL.md).
import { isLocalMode, sendCloudDisabled } from "../server/local-mode.mjs";

let cloudHandler;
export default async function handler(req, res) {
  if (isLocalMode()) return sendCloudDisabled(req, res);
  cloudHandler ??= (await import("../server/site-settings.mjs")).createSettingsHandler({ admin: true });
  return cloudHandler(req, res);
}
