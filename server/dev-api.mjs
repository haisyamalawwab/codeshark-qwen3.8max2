import { createServer } from "node:http";
import { isLocalMode, sendCloudDisabled } from "./local-mode.mjs";

// ============================================================
// DATA_MODE=local: dev-api TIDAK memuat handler cloud sama sekali
// dan semua /api/* menjawab 503 mode-lokal. Pada mode auto server
// ini melayani tes koneksi awal; bila ia tidak berjalan, frontend
// otomatis jatuh ke mode lokal — `npm run dev` (Vite) saja cukup
// untuk bermain lokal.
// Handler cloud diimpor dinamis pada mode auto/cloud (termasuk
// endpoint tes koneksi /api/database-status untuk TiDB + Aiven).
// ============================================================

const port = Number(process.env.API_PORT || 3001);
const localMode = isLocalMode();

let cloudRoutes;
async function loadCloudRoutes() {
  if (!cloudRoutes) {
    const [
      { default: handler },
      { default: databaseStatus },
      { default: siteSettings },
      { default: adminSetup },
      { default: adminSettings },
      { default: adminDiagnostics },
      { default: betterAuth },
    ] = await Promise.all([
      import("../api/sync-progress.mjs"),
      import("../api/database-status.mjs"),
      import("../api/site-settings.mjs"),
      import("../api/admin-setup.mjs"),
      import("../api/admin-settings.mjs"),
      import("../api/admin-diagnostics.mjs"),
      import("../api/auth/[...all].mjs"),
    ]);
    cloudRoutes = { handler, databaseStatus, siteSettings, adminSetup, adminSettings, adminDiagnostics, betterAuth };
  }
  return cloudRoutes;
}

createServer(async (req, res) => {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (value) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(value)); return res; };
  if (localMode) return sendCloudDisabled(req, res);

  const { handler, databaseStatus, siteSettings, adminSetup, adminSettings, adminDiagnostics, betterAuth } =
    await loadCloudRoutes();
  // Better Auth membaca body mentah sendiri — jangan lewatkan parser JSON di bawah.
  if (req.url?.split("?")[0].startsWith("/api/auth/") || req.url?.split("?")[0] === "/api/auth") {
    return betterAuth(req, res);
  }
  if (req.url?.split("?")[0] === "/api/admin-setup") return adminSetup(req, res);
  if (req.url?.split("?")[0] === "/api/admin-diagnostics") return adminDiagnostics(req, res);
  if (req.url === "/api/database-status") return databaseStatus(req, res);
  const routes = { "/api/sync-progress": handler, "/api/site-settings": siteSettings, "/api/admin-settings": adminSettings };
  const route = routes[req.url?.split("?")[0]];
  if (!route) return res.status(404).json({ ok: false });
  try {
    let size = 0;
    const chunks = [];
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 1024 * 1024) return res.status(413).json({ ok: false, error: "Payload too large" });
      chunks.push(chunk);
    }
    req.body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
    await route(req, res);
  } catch {
    if (!res.writableEnded) res.status(400).json({ ok: false, error: "Invalid JSON request" });
  }
}).listen(port, "0.0.0.0", () =>
  console.log(
    localMode
      ? `CodeShark API (DATA_MODE=local — semua /api menjawab 503 mode-lokal) listening on port ${port}`
      : `CodeShark API listening on port ${port}`,
  ),
);
