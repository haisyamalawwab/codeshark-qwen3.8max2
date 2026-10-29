# 048 — Kesiapan Database Layerbase & TiDB Cloud: Profil, Membership, Gamifikasi

Tanggal: 2026-10-28 23:45 WIB
Status: implementasi selesai & teruji secara lokal pada branch
`arena/9b3e765a-codeshark-qwen3-8max2` (belum commit/push saat dokumen
ditulis). **Bukti live ke Layerbase/TiDB masih pending** — workspace ini
tidak memuat `.env` kredensial dan egress sandbox tidak menjangkau kedua
database; langkah pembuktiannya ada di bagian Runbook.

## Permintaan

Memastikan database **Layerbase** dan **TiDB Cloud** siap, terutama
implementasi **halaman profil** dan **membership**, termasuk menyimpan
**hasil gamifikasi**, mekanisme **badge & atensi**, dan **achievement**.

## Temuan audit awal

1. TiDB baru punya skema `001` (`cs_profiles`, `cs_saves` blob,
   `cs_attempts`). Hasil gamifikasi/badge/achievement/atensi hanya ada
   di dalam blob `save_data` — tidak bisa ditanyakan halaman profil.
2. **Membership belum ada sama sekali** (baru usulan `cohorts`/
   `memberships` di doc 027: akses kelas + peran guru/peserta).
3. **Halaman profil khusus belum ada** — profil hanya kartu hero di
   Dashboard; tidak ada tempat melihat membership, badge terklaim,
   atensi, dan status sinkronisasi sekaligus.
4. `/api/database-status` belum memprobe skema auth Layerbase maupun
   kesiapan fitur (hanya konfigurasi + skema inti 001).

## Yang diimplementasikan

### 1. TiDB: migrasi `002_gamification_profile_membership`

`db/tidb-schema.sql` (idempoten, berlaku juga untuk Aiven for MySQL yang
memakai skema `cs_*` sama) menambah lima tabel:

| Tabel | Isi |
|---|---|
| `cs_memberships` | `plan` (`free`/`kelas`/`pro`), `role`, `cohort_code` (kode kelas), `status`, masa berlaku |
| `cs_gamification` | snapshot ternormalisasi: XP, koin, rank, statistik, streak & login streak, tier/pengali streak, tantangan harian, modul tuntas |
| `cs_achievements` | progres/target per achievement, `unlocked_at`/`claimed_at`, reward — klaim pertama dipertahankan (`COALESCE`) |
| `cs_badges` | badge permanen lintas sumber: `achievement:*`, `streak:tier-*`, `rank:*` (`awarded_at` pertama tidak ditimpa) |
| `cs_attention_days` | atensi harian: jumlah misi, sesi unik, XP/koin per hari — dihitung ulang dari `cs_attempts` sehingga idempoten |

`scripts/tidb-db.mjs check` kini mewajibkan 9 tabel + dua baris migrasi.

### 2. Server: derivasi & penulisan saat sync

- `server/gamification.mjs` — derivasi murni dari snapshot save (rank,
  tier streak, 17 achievement, badge) menyalin definisi klien
  (`storage.ts`, `streakMultiplier.ts`, `achievements.ts`), penulis SQL
  terparameterisasi, aturan membership, dan `withGamificationSavepoint`.
- `server/tidb-sync.mjs` — di dalam transaksi sync yang sama: snapshot
  segar menulis `cs_gamification`/`cs_achievements`/`cs_badges` +
  memastikan baris membership; attempts memicu hitung ulang
  `cs_attention_days`. **Bila skema 002 belum dimigrasi, savepoint
  menggulung hanya blok fitur** — sync inti tetap berhasil
  (Env-Gated Graceful Fallback per-fitur).
- `server/profile.mjs` + `api/profile.mjs` + `api/membership.mjs` +
  adapter `netlify/functions/{profile,membership}.mjs` + rute
  `server/dev-api.mjs` + redirect `netlify.toml` (Docker meneruskan
  `/api/*` secara utuh):
  - `GET /api/profile` — profil, membership, snapshot gamifikasi,
    achievement, badge, atensi 30 hari. Identitas dari sesi Better
    Auth (Layerbase) atau JWT legacy; tamu → 401.
  - `GET/POST /api/membership` — gabung/keluar kelas via kode cohort
    dan pilih plan `free`/`kelas`. **Plan `pro` dan role tidak bisa
    diubah sendiri** (403; pemberian admin).
  - Provider Aiven PostgreSQL (skema legacy) → 503
    `provider_unsupported`; skema 002 hilang → 503 `schema_missing`;
    keduanya membuat klien memakai data lokal.

### 3. Layerbase: probe kesiapan skema auth

`probeBetterAuthSchema()` (di atas probe admin `probeBetterAuthDatabase`
yang memeriksa tabel + kolom `user/session/account/verification` via
information_schema) kini dilaporkan `/api/database-status` sebagai
`features.authSchema` (`ready|missing|connection_failed|timeout|
not_configured`) bersama `features.gamificationSchema` dan boolean
`features.profile/membership`. Bidang `auth` lama tidak berubah; state
inti tidak terpengaruh kegagalan probe fitur. Ringkasan yang sama
ditampilkan di halaman admin diagnostik.

### 4. Klien: halaman Profil & Membership

- `src/ui/ProfilePage.tsx` (layar `profile` di `App.tsx`, dibuka dari
  tombol **Profil** di header Dashboard dan chip **Membership** di kartu
  hero): identitas akun (email/role/provider Better Auth bila login),
  edit nama & kelompok usia, kartu membership (plan, role, gabung/keluar
  kelas), **Hasil Gamifikasi** (XP/koin/statistik + bukti snapshot
  cloud), **Badge & Achievement** (ringkasan, badge terklaim terakhir,
  badge tier streak), **Atensi & Konsistensi** (grafik 14 hari dari
  cloud atau riwayat perangkat), dan panel **Kesiapan Database**.
- `src/lib/profileApi.ts` — klien API yang tidak pernah melempar;
  kegagalan cloud = fallback lokal dengan pesan jujur di UI.
- `SaveData.membership` — slice lokal aditif sebagai cache/fallback;
  save lama tetap terbaca (default `free/peserta`).

## Validasi yang dijalankan

- Tes baru `tests/profile-membership.test.mjs` (**13/13**): derivasi
  snapshot/achievement/badge, save kosong aman, penulis SQL
  terparameterisasi, savepoint hanya menelan `ER_NO_SUCH_TABLE`,
  agregasi atensi, aturan membership (pro ditolak, cohort divalidasi),
  handler profil (401 tamu, 503 `schema_missing` tanpa bocor, shaping
  camelCase), handler membership, sync menulis 002 hanya pada snapshot
  segar, sync inti tetap sukses tanpa skema 002, probe Layerbase.
- Regresi: `test:tidb` 12/12, `test:database-status` 15/15 (dua tes
  diperbarui: jumlah query probe 5→11 & stub `authSchemaProbe`),
  `test:better-auth` 12/12, `test:data-mode` 28/28, `test:settings`
  12/12, `test:boot-loading` 3/3, `test:netlify` 7/7,
  `test:diagnostics` 9/9, `test:auth` 10/10, `test:badges` PASS.
- `npm run lint` bersih; `npm run build` sukses.
- Smoke test dev (Vite + dev-api, **tanpa kredensial**):
  `/api/database-status` → `decision: local`,
  `features: {gamificationSchema: not_checked, authSchema:
  not_configured, profile: false, membership: false}`;
  `/api/profile` & `/api/membership` → HTTP 503 `provider_unsupported`;
  modul `ProfilePage` ter-serve 200. Aplikasi tetap berjalan lokal —
  sesuai Env-Gated Graceful Fallback.

## Runbook bukti live (operator)

1. Isi env deploy (Netlify/Vercel secret store — jangan di repo/chat):
   `TIDB_HOST/TIDB_USER/TIDB_PASSWORD/TIDB_DATABASE` (+`TIDB_PORT`,
   salah satu `TIDB_CA_CERT`/`TIDB_CA_PATH`) dan `LAYERBASE_*` +
   `BETTER_AUTH_SECRET` + `BETTER_AUTH_URL`.
2. Skema auth Layerbase: tombol **Apply** Better Auth di Layerbase
   *atau* `npm run auth:migrate` dari jaringan yang menjangkau DB;
   verifikasi `npm run auth:check`.
3. Skema game TiDB: `npm run db:tidb:init` lalu `npm run db:tidb:check`
   (harus menampilkan 9 tabel `cs_*` + migrasi `001` & `002`).
4. Redeploy, buka `/api/database-status`: harapkan `decision: cloud`,
   `features.gamificationSchema: ready`, `features.authSchema: ready`,
   `features.profile/membership: true`.
5. Daftar/masuk akun email sungguhan → mainkan 1 misi → Dashboard →
   **Profil**: garis "Snapshot tersimpan di database cloud" muncul;
   uji gabung kelas dengan kode cohort; periksa baris
   `cs_gamification`, `cs_achievements`, `cs_badges`,
   `cs_attention_days`, `cs_memberships` untuk `owner_id = user:<id>`.

## Batasan yang disadari

- Nilai attempts tetap dilaporkan klien (model kepercayaan lama);
  verifikasi skor server & `reward_ledger` (doc 027) adalah pekerjaan
  lanjutan terpisah — tidak diklaim selesai di sini.
- Jalur Aiven PostgreSQL tidak menulis tabel 002 (endpoint menjawab
  503 `provider_unsupported`, profil lokal tetap jalan).
- UI admin untuk memberi plan `pro`/role guru dan mengelola cohort
  belum ada; saat ini lewat SQL/`role` Better Auth admin.
- Atensi mencatat misi/sesi/XP per hari; durasi fokus (menit) belum
  diinstrumentasi.
