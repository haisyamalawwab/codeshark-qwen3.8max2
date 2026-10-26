// Only public, non-secret settings belong here. Never store credentials in this document.
export const GAME_IDS = ['crossplatform', 'tower', 'shark'];
// Sub-game pensiun (MK Sistem Aplikasi Web — Backend Dasar, diarsipkan &
// dilepas dari aplikasi 26-10-2026; lihat arsip/ + docs/040). Id-id ini
// HANYA dipakai migrateSettings() untuk membersihkan dokumen settings lama
// saat dibaca, supaya validasi ketat tidak menolak konfigurasi historis.
export const RETIRED_GAME_IDS = ['ci_backend', 'py_backend'];
export const MODULE_IDS = ['html', 'css', 'js'];
export const defaultSettings = () => ({
  siteName: 'latihan.my.id',
  description: 'Belajar koding sambil main game.',
  announcement: '',
  maintenance: false,
  games: Object.fromEntries(GAME_IDS.map(id => [id, true])),
  modules: Object.fromEntries(MODULE_IDS.map(id => [id, true])),
});
/**
 * Migrasi baca-saja dokumen settings historis: buang kunci games milik
 * sub-game pensiun, lalu biarkan validateSettings() tetap ketat terhadap
 * sisanya. Nilai yang bukan record dikembalikan apa adanya agar
 * validateSettings() yang menolaknya dengan pesan yang semestinya.
 */
export function migrateSettings(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const games = value.games;
  if (!games || typeof games !== 'object' || Array.isArray(games)) return value;
  if (!RETIRED_GAME_IDS.some(id => Object.hasOwn(games, id))) return value;
  const nextGames = { ...games };
  for (const id of RETIRED_GAME_IDS) delete nextGames[id];
  return { ...value, games: nextGames };
}
const record = value => value && typeof value === 'object' && !Array.isArray(value);
const exact = (value, keys) => record(value) && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
export function validateSettings(value) {
  if (!exact(value, ['siteName', 'description', 'announcement', 'maintenance', 'games', 'modules'])) throw new Error('Struktur konfigurasi tidak valid.');
  for (const [key, max, min] of [['siteName', 80, 1], ['description', 500, 0], ['announcement', 1000, 0]]) {
    if (typeof value[key] !== 'string' || value[key].length > max || value[key].trim().length < min || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value[key])) throw new Error(`Nilai ${key} tidak valid.`);
  }
  if (typeof value.maintenance !== 'boolean') throw new Error('Maintenance harus boolean.');
  for (const [key, ids] of [['games', GAME_IDS], ['modules', MODULE_IDS]]) {
    if (!exact(value[key], ids) || ids.some(id => typeof value[key][id] !== 'boolean')) throw new Error(`Daftar ${key} tidak valid.`);
  }
  return structuredClone(value);
}
