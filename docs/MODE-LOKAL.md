# 🔀 Mode Data Otomatis — Tes Koneksi Awal: Cloud Bila Terhubung, Lokal Bila Tidak

> **Status: MODE OTOMATIS (`auto`) AKTIF sebagai default.**
> Saat aplikasi dibuka, sistem **mengetes dulu apakah koneksi ke cloud DB
> (TiDB Cloud dan/atau Aiven) dapat dilakukan**. Bila tes awal menyatakan
> **ya → gunakan cloud DB**. Bila **tidak → gunakan mode lokal
> SQLite/localStorage**. Halaman admin (`/admin/`) kini berfungsi sebagai
> **diagnostik & tes koneksi khusus admin** — lihat bagian di bawah.

---

## Alur keputusan (tes koneksi awal)

```
Aplikasi dibuka
   │
   ├─ VITE_DATA_MODE=local ───────────────► LOKAL (tanpa tes)
   ├─ VITE_DATA_MODE=cloud ───────────────► CLOUD (tanpa fallback)
   └─ VITE_DATA_MODE=auto (default)
          │  GET /api/database-status  (timeout 7 dtk di klien)
          │  Server mengetes SECARA READ-ONLY:
          │    1. TiDB Cloud  — sambung TLS + cek tabel cs_* & migrasi
          │    2. Aiven       — sambung (pg/mysql2) + cek tabel aplikasi
          ▼
   cloudReady=true ? ── ya ──► CLOUD — provider pemenang tes
          │                     (prioritas: DB_PROVIDER, lalu TiDB→Aiven)
          └─ tidak/offline/timeout ──► LOKAL (SQLite/localStorage)

Tes diulang tiap 60 detik & saat jendela kembali fokus:
mode naik ke cloud sendiri bila DB kembali terjangkau, dan turun
ke lokal bila koneksi putus. Server meng-cache hasil probe 30 dtk.
```

Respons probe (bidang keputusan; tanpa kredensial/nilai env):

```json
{
  "state": "connected", "mode": "auto",
  "cloudReady": true, "effectiveProvider": "tidb", "decision": "cloud",
  "providers": {
    "tidb":  { "configured": true,  "state": "connected",      "schema": "ready" },
    "aiven": { "configured": false, "state": "not_configured", "schema": "not_checked", "kind": null }
  }
}
```

## Arti tiap mode efektif

| Aspek | Efektif CLOUD (tes = ya) | Efektif LOKAL (tes = tidak) |
|---|---|---|
| Penyimpanan runtime | Tetap local-first di `localStorage` (sumber kebenaran UI), **ditambah** sinkron ke provider pemenang | `localStorage` + backup SQLite (sql.js) saja |
| Sinkron progres | `POST /api/sync-progress` → TiDB (MySQL `cs_*`) / Aiven MySQL (`cs_*`) / Aiven PostgreSQL (`profiles/saves/attempts`, driver `pg`) | Nonaktif; attempt menumpuk di outbox lokal (maks. 200) dan tersinkron saat mode naik ke cloud |
| Konfigurasi website | Dibaca dari TiDB **hanya bila provider TiDB**; provider Aiven → konfigurasi bawaan lokal | Bawaan lokal (`defaultSettings`, semua sub-game/modul aktif) + override perangkat `codeshark:siteSettings:v1` |
| Login akun | Better Auth email/password (MariaDB Layerbase) dapat dipakai sebagai identitas opsional; Google/Supabase legacy aktif bila terkonfigurasi | Pada `auto`, login Better Auth tetap layanan identitas terpisah; progres tetap lokal. Hanya paksa `DATA_MODE=local` yang mematikan semua cloud |
| Kartu status di hub/dashboard | Status cloud (provider aktif + hasil tes kedua provider) | Kartu *Penyimpanan lokal* + alasan hasil tes (`TiDB: … · Aiven: …`) + tombol Backup SQLite/JSON |
| Halaman admin `/admin/` | Diagnostik & tes koneksi (hanya melihat/mengetes; tidak mengubah aplikasi) | Sama |

> Catatan jujur soal arsitektur: aplikasi ini **local-first** — progres selalu
> ditulis ke `localStorage` lebih dulu. "Memakai cloud DB" berarti lapisan
> sinkron + konfigurasi + login cloud diaktifkan; permainan tidak pernah
> diblokir menunggu database.

## Konfigurasi provider

Isi di `.env` (atau env Netlify/Vercel) — cukup provider yang dipakai:

| Provider | Variabel | Skema |
|---|---|---|
| TiDB Cloud | `TIDB_HOST`, `TIDB_USER`, `TIDB_PASSWORD`, `TIDB_DATABASE` (+ `TIDB_PORT`/CA opsional) | `db/tidb-schema.sql` (`npm run db:tidb:init`) |
| Aiven PostgreSQL | `AIVEN_DATABASE_URL=postgres://…aivencloud.com:port/db?sslmode=require` (+ `AIVEN_CA_CERT` disarankan) | `db/schema.sql` |
| Aiven MySQL | `AIVEN_DATABASE_URL=mysql://…aivencloud.com:port/db` | `db/tidb-schema.sql` |

- `DATABASE_URL` MySQL/MariaDB kini dicadangkan untuk **Better Auth
  Layerbase** (atau gunakan nama khusus `AUTH_DATABASE_URL`). Database game
  Aiven harus memakai `AIVEN_DATABASE_URL`/`GAME_DATABASE_URL`;
  `NETLIFY_DATABASE_URL` legacy dan `DATABASE_URL` PostgreSQL lama masih
  dikenali sebagai cadangan game.
- `DB_PROVIDER=tidb|aiven` memaksa **prioritas**; kosong = otomatis (TiDB dahulu).
  Provider prioritas yang gagal tes akan dilewati ke provider berikutnya yang terhubung.
- Tes mensyaratkan **terhubung + skema siap**; sekadar TCP nyambung tetapi tabel
  belum dibuat = `schema_missing` = dianggap belum siap → lokal.
- Tanpa `AIVEN_CA_CERT`, TLS Aiven terenkripsi tetapi tidak terverifikasi penuh
  (CA proyek Aiven tidak ada di trust store Node) — isi CA-nya untuk produksi.
- Sinkron cloud produksi tetap menuntut identitas terverifikasi: cookie
  sesi Better Auth atau JWT Supabase lama. Akun Better Auth yang `banned`
  aktif ditolak. Tamu sync hanya untuk dev dengan
  `TIDB_ALLOW_GUEST_SYNC=true` di luar produksi.

## Saklar mode

| Variabel | `auto` (default) | `local` | `cloud` |
|---|---|---|---|
| `VITE_DATA_MODE` (browser) | Tes awal menentukan | Paksa lokal, nol jaringan | Paksa cloud, error bila DB mati |
| `DATA_MODE` (server) | Endpoint cloud melayani (termasuk probe) | Semua endpoint 503 mode-lokal, driver tidak dimuat | Endpoint melayani |

Kedua sisi sebaiknya sama. `DATA_MODE=local` di server membuat probe
menjawab 503 mode-lokal → frontend `auto` menafsirkannya sebagai "tes = tidak" → lokal.

## Memaksa lokal penuh (perilaku sebelumnya)

Set `VITE_DATA_MODE=local` + `DATA_MODE=local`, build/deploy ulang.
Tidak ada satu pun panggilan `/api/*`; ini juga cara mematikan cloud
sepenuhnya tanpa menghapus kredensial. Verifikasi: `npm run test:data-mode`.

## Halaman admin: diagnostik & tes koneksi (di sini + backend serverless)

Halaman `/admin/` adalah halaman **khusus admin** untuk **melihat status dan
mengetes koneksi** — ia **tidak memengaruhi jalannya aplikasi** pemain dan
tidak lagi mengubah konfigurasi website (editor settings lama
`src/admin/AdminSettings.tsx` disimpan tetapi tidak dipakai).

Pembagian tugasnya:

- **Di sini (frontend, entry terpisah `dist/admin/`)**: antarmuka — kartu
  TiDB/Aiven/Better Auth MariaDB/Redis, tombol tes, form login/token. Aman dideploy bersama
  situs statis; keberadaan halamannya bukan celah keamanan.
- **Backend khusus (serverless, repo yang sama)**: seluruh pengujian —
  `GET /api/database-status` (publik, status saja, untuk tes awal aplikasi)
  dan `GET /api/admin-diagnostics` (wajib Better Auth role admin/allowlist,
  login admin legacy, **atau** header `x-admin-token` = `ADMIN_TEST_TOKEN`;
  selalu *fresh* tanpa
  cache; memuat host/latensi; read-only). Browser tidak pernah bisa/belum
  boleh membuka koneksi MySQL/Redis langsung, jadi backend terpisah sebagai
  **layanan lain tidak diperlukan** — fungsi Netlify/Vercel adalah backend-nya.

### Redis caching (opsional)

Bisa. Redis dipakai sebagai **cache bersama antar-instance serverless**
(hasil tes koneksi + dokumen site-settings, TTL 30 dtk) melalui
**Upstash REST** (`UPSTASH_REDIS_REST_URL/TOKEN`, disarankan) atau
**TCP** `REDIS_URL` (mis. Aiven for Valkey, driver ioredis). Tanpa Redis,
cache in-memory per-instance yang dipakai. Redis **bukan** pengganti
TiDB/Aiven. Tesnya ada di halaman admin (PING + tulis/baca kunci
diagnostik). Panduan deploy lengkap: [`DEPLOY-NETLIFY-VERCEL.md`](DEPLOY-NETLIFY-VERCEL.md).

## Berkas kunci

| Berkas | Peran |
|---|---|
| `src/lib/featureFlags.ts` | Mode terkonfigurasi + mode efektif runtime (getter `isCloud*()`) |
| `src/lib/siteSettings.tsx` | Menjalankan tes awal, menetapkan mode efektif, re-tes berkala, konteks `useEffectiveDataMode()` |
| `src/lib/databaseStatus.ts` | Klien probe + `probeDecision()` |
| `server/local-mode.mjs` | `serverMode()` auto/local/cloud + gerbang paksa-lokal |
| `server/database-status.mjs` | Probe TiDB + Aiven → `cloudReady/effectiveProvider/decision` |
| `server/aiven.mjs` | Deteksi & probe Aiven (pg/mysql), `pickCloudProvider()` |
| `server/aiven-sync.mjs` | Sync Aiven PostgreSQL |
| `src/ui/LocalStorageStatus.tsx` / `src/ui/DatabaseConnectionStatus.tsx` | Kartu status lokal/cloud |
| `server/redis.mjs`, `server/admin-diagnostics.mjs`, `src/admin/AdminDiagnostics.tsx` | Cache Redis opsional + endpoint & halaman tes koneksi admin |
| `tests/aiven.test.mjs`, `tests/local-mode.test.mjs`, `tests/database-status.test.mjs`, `tests/redis.test.mjs`, `tests/admin-diagnostics.test.mjs` | Bukti perilaku (`npm run test:data-mode`, `npm run test:diagnostics`) |

## Data pemain

- Beralih mode tidak menghapus apa pun: save lokal tetap, outbox tetap,
  data yang sudah di cloud tetap.
- Selama efektif lokal, membersihkan data situs/browser = progres hilang —
  gunakan **Backup SQLite/JSON** pada kartu Penyimpanan lokal secara berkala.
