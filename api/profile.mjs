import { createDispatchedProfileHandler } from "../server/profile.mjs";

// Serverless function: GET /api/profile
// Profil + membership + gamifikasi + achievement + badge + atensi milik
// pengguna terautentikasi (sesi Better Auth/Layerbase atau JWT legacy).
// Provider: TiDB Cloud / Aiven for MySQL (skema cs_* 002). Mode lokal /
// provider tak didukung → 503 agar klien memakai profil lokal.

const handler = createDispatchedProfileHandler();
export default handler;
