import { createDispatchedMembershipHandler } from "../server/profile.mjs";

// Serverless function: GET/POST /api/membership
// Membership pengguna sendiri (plan free/kelas + kode cohort kelas).
// Plan pro & role hanya diubah admin di luar endpoint ini.

const handler = createDispatchedMembershipHandler();
export default handler;
