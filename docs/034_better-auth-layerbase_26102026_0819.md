# Better Auth + Layerbase MariaDB — Panduan Setup

Dokumen ini menjelaskan integrasi login **email/password Better Auth** yang
databasenya berjalan di **MariaDB Layerbase (Auth Server)**.

## 1. Arsitektur: database auth dan database game terpisah

```text
Browser
  ├─ /api/auth/*            → Better Auth → MariaDB Layerbase
  │                                             user/session/account/verification
  ├─ /api/database-status   → tes awal TiDB Cloud / Aiven (database game)
  └─ /api/sync-progress     → progres game ke TiDB/Aiven bila tes awal cloud
                               (owner diverifikasi dari cookie Better Auth
                                atau JWT Supabase lama)
```

Konsekuensinya:

- Login email adalah **layanan identitas terpisah** dari database game.
- Keputusan progres **cloud vs lokal** tetap dari tes awal TiDB/Aiven:
  terhubung → cloud; gagal → SQLite/localStorage.
- Pemain tetap bisa bermain sebagai **tamu lokal** tanpa akun.
- File kunci:
  - `auth.ts` — pintu masuk Better Auth CLI.
  - `server/better-auth.mjs` — konfigurasi server, pool `mysql2/promise`,
    plugin `admin()`, handler, sesi, dan probe skema.
  - `src/lib/auth-client.ts` — `createAuthClient()` dari
    `better-auth/react` + `adminClient()`.
  - `api/auth/[...all].mjs` — catch-all Vercel.
  - `netlify/functions/auth.mjs` — catch-all Netlify.
  - `server/dev-api.mjs` — route yang sama untuk pengembangan lokal.

## 2. Isi environment

Salin connection string dari **Layerbase dashboard → Connect**. Nama standar
Layerbase adalah `DATABASE_URL`; proyek ini juga menerima nama khusus
`AUTH_DATABASE_URL` dan **mengutamakannya** agar tidak tertukar dengan
database game.

```dotenv
# Pilih salah satu: nama khusus (disarankan) ...
AUTH_DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE

# ... atau nama standar Layerbase.
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE

BETTER_AUTH_SECRET=hasil-openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:3000
```

Generate secret:

```bash
openssl rand -base64 32
```

### Penting: migrasi nama `DATABASE_URL`

`DATABASE_URL` ber-skema MySQL/MariaDB sekarang **dicadangkan untuk Better
Auth**, bukan Aiven game. Bila sebelumnya Aiven MySQL disimpan di
`DATABASE_URL`, pindahkan ke:

```dotenv
AIVEN_DATABASE_URL=mysql://...aivencloud.com.../defaultdb
```

Compat lama: `DATABASE_URL` PostgreSQL masih dapat dikenali sebagai database
game bila tidak ada `AIVEN_DATABASE_URL`/`GAME_DATABASE_URL`, karena Auth
Server proyek ini MariaDB. Tetap disarankan memakai nama eksplisit.

### `BETTER_AUTH_URL`

Isi dengan origin aplikasi **tanpa** `/api/auth`:

| Lingkungan | Contoh |
| --- | --- |
| Lokal | `http://localhost:3000` |
| Produksi | `https://latihan.my.id` |
| Preview dinamis | isi fallback produksi + `BETTER_AUTH_ALLOWED_HOSTS=*.vercel.app,latihan.my.id` |

`VITE_BETTER_AUTH_URL` boleh kosong bila UI dan `/api/auth` satu domain —
itulah konfigurasi Netlify/Vercel yang disarankan. Jangan pernah memberi
prefix `VITE_` pada URL database atau secret.

## 3. Buat skema Better Auth

Pilih **salah satu** cara berikut. Jangan membuat tabel auth kustom di luar
skema Better Auth.

### Cara A — tombol Layerbase (paling langsung)

Di dashboard Layerbase, jalankan **“Set up the Better Auth schema”** pada
database Auth Server. Pastikan tabel berikut ada:

- `user`
- `session`
- `account`
- `verification`

Kolom plugin admin juga harus ada:

- `user.role`, `user.banned`, `user.banReason`, `user.banExpires`
- `session.impersonatedBy`

### Cara B — migrasi Better Auth CLI

Setelah `.env` terisi:

```bash
npm run auth:migrate
npm run auth:check
```

Script npm tersebut memuat `.env` dan menjalankan paket CLI `auth` dengan
versi **sama persis** dengan dependensi `better-auth` terpasang (saat ini
`1.7.13`). Bentuk generik perintah setara:

```bash
npx auth@1.7.13 migrate --config auth.ts
```

### Cara C — SQL fallback

Jalankan `db/better-auth-mariadb.sql` dari klien MariaDB **ke database auth
Layerbase saja**. File itu adalah SQL Better Auth + admin plugin dari
Layerbase dengan tanda kurung yang dinormalisasi agar valid ditempel ke
MariaDB. Jangan jalankan ke TiDB/Aiven game.

## 4. Jalankan dan uji lokal

Terminal 1:

```bash
npm run dev:api
```

Terminal 2:

```bash
npm run dev
```

Lalu buka aplikasi dan gunakan panel **Akun email (opsional)** di onboarding:
Daftar → sesi aktif → pilih level → Mulai Petualangan. Pada kunjungan
berikutnya gunakan Masuk.

Tes cepat HTTP (opsional):

```bash
curl -i http://localhost:3000/api/auth/get-session
```

Hasil sehat tanpa sesi adalah respons Better Auth bernilai `null`/sesi
kosong, **bukan** `better_auth_not_configured`.

Contoh daftar via API:

```bash
curl -i -c cookies.txt \
  -H 'content-type: application/json' \
  -H 'origin: http://localhost:3000' \
  -X POST http://localhost:3000/api/auth/sign-up/email \
  -d '{"name":"Rani","email":"rani@example.com","password":"password-aman-123"}'
```

Contoh masuk:

```bash
curl -i -c cookies.txt \
  -H 'content-type: application/json' \
  -H 'origin: http://localhost:3000' \
  -X POST http://localhost:3000/api/auth/sign-in/email \
  -d '{"email":"rani@example.com","password":"password-aman-123"}'
```

## 5. Membuat admin pertama

Pilihan interaktif dari CLI:

```bash
npm run auth:create-admin -- --email admin@example.com --name "Admin CodeShark"
```

Atau daftar seperti user biasa, lalu set role dari Layerbase/SQL:

```sql
UPDATE `user`
SET `role` = 'admin'
WHERE `email` = 'admin@example.com';
```

Admin Better Auth dapat membuka tes mendalam di `/admin/` bila:

- `user.role` mengandung `admin`, **atau**
- ID user terdaftar di env server `ADMIN_USER_IDS`.

User dengan `banned = 1` dan masa ban aktif ditolak saat sign-in oleh plugin
admin; lapisan sync/admin aplikasi juga menolaknya dengan HTTP 403. Inilah
mengapa `admin()` di server dan `adminClient()` di klien **wajib** dipasang.

## 6. Deploy Netlify / Vercel

Setel env server berikut di dashboard platform (bukan di Git):

```dotenv
AUTH_DATABASE_URL=mysql://...        # atau DATABASE_URL=...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://domain-produksi
```

Opsional:

```dotenv
BETTER_AUTH_ALLOWED_HOSTS=*.vercel.app,domain-produksi
BETTER_AUTH_TRUSTED_ORIGINS=https://domain-produksi
AUTH_DB_CA_CERT=-----BEGIN CERTIFICATE-----...
```

Routing sudah disiapkan:

- **Vercel:** filesystem route `api/auth/[...all].mjs`.
- **Netlify:** redirect `/api/auth/*` ke `netlify/functions/auth.mjs`, dengan
  `better-auth` sebagai external Node module.

Setelah deploy, login sebagai admin di `/admin/` dan jalankan **Tes Koneksi
Sekarang**. Kartu **Better Auth (MariaDB)** memeriksa koneksi serta empat
tabel + kolom admin secara read-only, tanpa menampilkan connection string.

## 7. Troubleshooting

| Gejala | Penyebab paling umum | Perbaikan |
| --- | --- | --- |
| `503 better_auth_not_configured` | URL auth/secret kosong | Isi `AUTH_DATABASE_URL`/`DATABASE_URL` + `BETTER_AUTH_SECRET`, redeploy/restart API |
| Login ditolak karena origin tidak tepercaya | `BETTER_AUTH_URL` tidak sama dengan domain halaman | Samakan origin; tambah allowed hosts untuk preview |
| Kartu admin `schema_missing` | Skema belum dibuat/kolom admin hilang | Jalankan setup Layerbase, `npm run auth:migrate`, atau SQL fallback |
| Kartu admin `connection_failed` | Connection string/host/TLS/izin jaringan Layerbase salah | Salin ulang dari Connect; cek CA/akses database |
| `401` saat sync | Cookie sesi tidak ada/kedaluwarsa | Login email ulang; pastikan UI/API satu domain |
| `403` akun dinonaktifkan | `banned` aktif di MariaDB | Periksa `banned`, `banReason`, `banExpires` di Layerbase |
| Aiven MySQL tiba-tiba tidak terbaca | URL game masih di `DATABASE_URL` | Pindahkan ke `AIVEN_DATABASE_URL` |

## 8. Package manager

Panduan generik Layerbase menyebut:

```bash
pnpm add better-auth mysql2
```

Repo ini memakai **npm `package-lock.json`**, jadi pada lingkungan ini
`better-auth@1.7.13` dipasang dengan npm dan `mysql2` sudah menjadi
dependensi proyek. Jangan mencampur lockfile pnpm ke repo tanpa migrasi
package manager yang disengaja.

Referensi adapter: <https://www.better-auth.com/docs/adapters/mysql>
