import { handleBetterAuthRequest } from "../../server/better-auth.mjs";
import { isLocalMode, sendCloudDisabled } from "../../server/local-mode.mjs";

// Vercel catch-all: /api/auth/* → Better Auth handler.
// Jangan membaca req.body sebelum ini — Better Auth harus membaca stream mentah.
export default async function handler(req, res) {
  if (isLocalMode()) return sendCloudDisabled(req, res);
  await handleBetterAuthRequest(req, res);
}
