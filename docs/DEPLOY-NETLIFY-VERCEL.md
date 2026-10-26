# 🚀 Deploy Netlify / Vercel — TiDB/Aiven Game DB, Better Auth MariaDB & Redis

Arsitektur deploy **satu repo, tanpa server backend terpisah**:

```
Browser pemain ──► Static site (dist/: hub + sub-game + /admin/)
       │  tes koneksi awal & sinkron
       └────► /api/*  =  backend KHUSUS serverless
                Netlify: netlify/functions/*   Vercel: api/*
                (berbagi logika server/*.mjs)
                     ├─► TiDB Cloud (MySQL, mysql2)
                     ├─► Aiven for MySQL (mysql2) / PostgreSQL (pg)
                     ├─► Layerbase MariaDB → Better Auth email/password
                     ├─► Redis cache OPSIONAL (Upstash REST / TCP ioredis)
                     └─► Supabase Auth legacy (verifikasi JWT, opsional)
```

- **Halaman admin** (`/admin/`) adalah *entry statis terpisah* di repo ini,
  khusus admin untuk **melihat & mengetes koneksi**. Ia tidak memengaruhi
  jalannya aplikasi pemain. Pengujian koneksi **selalu dijalankan backend
  serverless** — browser tidak pernah memegang kredensial database.
- Detail mode data otomatis: [`MODE-LOKAL.md`](MODE-LOKAL.md).

## 1. Siapkan database

| Provider | Langkah |
|---|---|
| **TiDB Cloud MySQL** | Buat cluster & database `codeshark` → jalankan `db/tidb-schema.sql` (atau lokal: isi `TIDB_*` lalu `npm run db:tidb:init`) |
| **Aiven for MySQL** | Buat service MySQL → jalankan `db/tidb-schema.sql` yang sama (dialek MySQL, tabel `cs_*`) |
| Aiven for PostgreSQL (alternatif) | Jalankan `db/schema.sql` (tabel `profiles/saves/attempts`) |
| **Layerbase MariaDB (Auth Server)** | Klik “Set up the Better Auth schema”, atau isi `.env` lalu `npm run auth:migrate`; fallback `db/better-auth-mariadb.sql`. Detail: [`BETTER-AUTH-LAYERBASE.md`](BETTER-AUTH-LAYERBASE.md) |
| Redis (opsional) | Upstash Redis (REST) **atau** Aiven for Valkey/Redis (TCP `rediss://`) |

## 2. Environment variables

Isi di **Netlify: Site settings → Environment variables** (cakupan *Functions*
untuk rahasia) atau **Vercel: Settings → Environment Variables**.

### Wajib dasar
| Nama | Nilai | Sisi |
|---|---|---|
| `VITE_DATA_MODE` | `auto` | build browser |
| `DATA_MODE` | `auto` | fungsi server |
| `VITE_SYNC_ENDPOINT` | `/api/sync-progress` | build browser |

### Pilih database (salah satu / keduanya untuk fallback prioritas)
| Nama | Contoh | Catatan |
|---|---|---|
| `TIDB_HOST` `TIDB_PORT` `TIDB_USER` `TIDB_PASSWORD` `TIDB_DATABASE` | dari TiDB Cloud | server saja, JANGAN `VITE_*` |
| `TIDB_CA_PATH` / `TIDB_CA_CERT` | `certs/tidb-ca-rozanhaisyam.pem` / isi PEM | opsional (TLS) |
| `AIVEN_DATABASE_URL` | `mysql://avnadmin:…@host.aivencloud.com:port/defaultdb` | MySQL **atau** `postgres://…?sslmode=require` |
| `AIVEN_CA_CERT` | PEM CA proyek Aiven | sangat disarankan |
| `DB_PROVIDER` | *(kosong)* / `tidb` / `aiven` | kosong = prioritas otomatis TiDB→Aiven |

### Login & admin
| Nama | Catatan |
|---|---|
| `AUTH_DATABASE_URL` **atau** `DATABASE_URL` | connection string MariaDB Layerbase dari Connect; server saja. MySQL di `DATABASE_URL` khusus auth, bukan Aiven game |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32`; server saja |
| `BETTER_AUTH_URL` | origin produksi tanpa `/api/auth`; `BETTER_AUTH_ALLOWED_HOSTS` untuk preview dinamis |
| `ADMIN_USER_IDS` | allowlist ID Better Auth/Supabase; Better Auth `role=admin` juga diakui |
| `ADMIN_TEST_TOKEN` | alternatif: token rahasia untuk tombol tes di `/admin/` (header `x-admin-token`) |
| `VITE_SUPABASE_*` + `SUPABASE_*` | legacy/opsional untuk Google OAuth + JWT lama |

### Redis cache (opsional)
| Nama | Catatan |
|---|---|
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | disarankan untuk serverless |
| `REDIS_URL` | alternatif TCP, mis. Aiven for Valkey `rediss://…` |

Redis **bukan** database utama: ia hanya berbagi cache hasil tes koneksi dan
dokumen site-settings (TTL 30 dtk) antar-instance fungsi. Tanpa Redis,
cache in-memory per-instance yang bekerja — aplikasi tetap berfungsi penuh.

## 3. Pengaturan platform (sudah di repo)

### Netlify (`netlify.toml`)
- Build `npm run build`, publish `dist`, Functions `netlify/functions` (esbuild,
  `external_node_modules: mysql2, pg, ioredis, better-auth`, CA TiDB di-`included_files`).
- Redirect: `/api/*` → Functions (force, sebelum SPA), `/admin/*` →
  `/admin/index.html`, sub-game & catch-all SPA.
- **Penting:** `VITE_*` dibaca saat build — setelah mengubahnya, *deploy ulang*.

### Vercel (`vercel.json` + folder `api/`)
- Framework Vite, output `dist`; setiap `api/*.mjs` otomatis menjadi Function Node,
  termasuk catch-all Better Auth `api/auth/[...all].mjs`.
- Rewrites `/admin/*`, `/codingshark/*`, `/codingtower/*`, `/crossplatform/*`
  ke index masing-masing sebelum catch-all.
- Fungsi Vercel memakai kode `server/` yang sama persis dengan Netlify.

## 4. Verifikasi sesudah deploy

1. Buka situs → kartu status di hub menunjukkan keputusan tes awal
   (cloud via provider, atau lokal + alasannya).
2. Buka **`/admin/`** → login email Better Auth role admin, login Google
   legacy, **atau** tempel `ADMIN_TEST_TOKEN` → **“Tes Koneksi Sekarang
   (fresh)”** → periksa kartu TiDB / Aiven / Better Auth / Redis:
   status, skema, latensi. Tes ini read-only & melewati semua cache.
3. Cepat dari terminal:
   ```bash
   curl https://<domain>/api/database-status | head -c 400
   curl -i https://<domain>/api/auth/get-session | head -c 400
   curl -H "x-admin-token: <token>" https://<domain>/api/admin-diagnostics | head -c 400
   ```
4. Main satu misi → progres tersimpan; pada mode cloud outbox tersinkron
   (cek baris baru di tabel `cs_attempts`/`attempts`).

## 5. Troubleshooting keputusan "lokal"

| Gejala di `/admin/` | Penyebab umum |
|---|---|
| `not_configured` | env provider kosong / belum redeploy setelah mengubah env fungsi |
| `env_incomplete` (TiDB) | sebagian `TIDB_*` kosong |
| `config_invalid` | port/CA salah, `TIDB_DATABASE` menunjuk DB sistem, URL Aiven tak dikenal |
| `connection_failed` | kredensial salah, IP allowlist cluster, TLS/CA (isi `AIVEN_CA_CERT`) |
| `schema_missing` | terhubung tetapi skema belum dijalankan (langkah 1) |
| `timeout` | jaringan/region — pilih region fungsi dekat cluster, cek status provider |
| Redis `connection_failed` | token/URL Upstash atau `REDIS_URL` salah — non-fatal, cache jatuh ke in-memory |
| Diagnostik 401/403 | belum login admin / role Better Auth belum `admin` / `ADMIN_USER_IDS` tidak memuat ID Anda / token tes salah |
| `/api/auth/*` 503 | `AUTH_DATABASE_URL`/`DATABASE_URL` atau `BETTER_AUTH_SECRET` belum tersetel di fungsi |
| Diagnostik 503 mode-lokal | `DATA_MODE=local` masih tersetel di env fungsi |

## 6. Batasan & keamanan

- Fungsi serverless membuka koneksi MySQL per instance hangat (pool kecil: 3).
  Untuk skala besar pertimbangkan pooler bawaan TiDB Cloud/Aiven.
- `/api/database-status` publik tetapi **tanpa nilai rahasia** (hanya status);
  detail host/latensi hanya di `/api/admin-diagnostics` yang terotorisasi.
- Jangan pernah menaruh kredensial DB/Redis/token pada variabel `VITE_*`.
- Tes read-only tidak membuktikan izin tulis; bukti tulis = sinkron pertama
  yang berhasil (atau baris baru di tabel attempts).
