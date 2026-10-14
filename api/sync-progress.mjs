// Serverless function: POST /api/sync-progress
// Kompatibel Vercel Functions & Netlify Functions (node runtime).
// TANPA Prisma — pakai @neondatabase/serverless (npm i @neondatabase/serverless).
// Env: DATABASE_URL / NETLIFY_DATABASE_URL (Neon connection string).
//
// Body dari src/lib/sync.ts:
// { deviceId, userId?, profileName, save: {profile,xp,coins,modules,stats}, attempts: [...] }
// - Jalur Neon (sekarang): kunci = deviceId. userId ikut tersimpan bila ada (kolom user_id opsional).
// - Jalur Supabase (nanti): client tulis langsung dengan RLS (auth.uid = user_id),
//   function ini tidak dipakai — Bearer token sudah dikirim pushOutbox untuk siap migrasi.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL || "");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  try {
    const { deviceId, profileName, save, attempts } = req.body || {};
    if (!deviceId) return res.status(400).json({ ok: false, error: "deviceId required" });
    const s = save || {};

    await sql`
      insert into profiles (device_id, name, age)
      values (${deviceId}, ${profileName || "anon"}, ${s?.profile?.age || "teen"})
      on conflict (device_id) do update set name = excluded.name, updated_at = now()`;

    await sql`
      insert into saves (device_id, xp, coins, modules, stats)
      values (${deviceId}, ${s.xp || 0}, ${s.coins || 0}, ${JSON.stringify(s.modules || {})}, ${JSON.stringify(s.stats || {})})
      on conflict (device_id) do update set
        xp = greatest(saves.xp, excluded.xp),
        coins = greatest(saves.coins, excluded.coins),
        modules = excluded.modules, stats = excluded.stats, updated_at = now()`;

    for (const a of attempts || []) {
      await sql`
        insert into attempts (id, device_id, session_id, won, stars, score, accuracy, wpm, max_combo, xp_award, coins_award, passed, played_at)
        values (${a.id}, ${deviceId}, ${a.sessionId}, ${!!a.won}, ${a.stars || 0}, ${a.score || 0}, ${a.accuracy || 0}, ${a.wpm || 0}, ${a.maxCombo || 0}, ${a.xpAward || 0}, ${a.coinsAward || 0}, ${!!a.passed}, to_timestamp(${Math.floor((a.at || Date.now()) / 1000)}))
        on conflict (id) do nothing`;
    }
    return res.status(200).json({ ok: true, synced: (attempts || []).length });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
