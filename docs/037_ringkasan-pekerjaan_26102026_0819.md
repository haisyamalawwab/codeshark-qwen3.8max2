# Ringkasan Pekerjaan — Mode Data, Admin Diagnostik, Redis, Deployment, dan Better Auth

Dokumen ini mencatat pekerjaan yang sudah dilakukan pada sesi pengembangan ini.
Isinya dibatasi pada hasil yang dapat ditunjuk dari kode, file, tes, build, dan
runtime lokal. Hal yang belum dibuktikan dengan kredensial/database live dicatat
secara eksplisit sebagai belum terverifikasi.

## Status workspace saat dicatat

- Tanggal pencatatan: **26 Oktober 2026**.
- Branch: `arena/71c1f4ab-codeshark-qwen3-8max2`.
- Commit dasar: `c03016a`.
- Perubahan masih berupa **worktree belum di-commit/push**.
- File `.env` lokal dibuat untuk pengembangan dan terabaikan oleh Git
  (`.gitignore` memuat `.env`). Nilai secret tidak dicatat dalam dokumen ini.

## 1. Mode data otomatis: tes awal cloud, fallback lokal

Yang sudah diimplementasikan:

- Mode terkonfigurasi `auto | local | cloud` melalui `DATA_MODE` di server dan
  `VITE_DATA_MODE` di browser. Default-nya `auto`.
- Pada mode `auto`, aplikasi memanggil `GET /api/database-status` saat dibuka.
- Server mengetes database game **TiDB Cloud** dan **Aiven**.
- Keputusan mode efektif:
  - provider terhubung **dan skema siap** → `cloud`;
  - tidak terkonfigurasi, gagal, timeout, atau skema belum siap → `local`.
- Hasil probe diulang berkala setiap 60 detik dan saat jendela kembali fokus,
  sehingga aplikasi dapat naik dari lokal ke cloud bila database kembali siap.
- `DATA_MODE=local` memaksa lokal: endpoint cloud menjawab HTTP 503 mode-lokal
  tanpa membuka koneksi database cloud.
- Runtime permainan tetap **local-first**:
  - sumber kebenaran runtime saat ini adalah `localStorage`;
  - ekspor/backup SQLite nyata tersedia melalui `sql.js`;
  - skema file SQLite disimpan di `db/sqlite-schema.sql`.
- Ini berarti SQLite pada implementasi sekarang adalah jalur backup/ekspor,
  bukan pengganti penuh `localStorage` sebagai sumber runtime utama.

File penting:

- `server/local-mode.mjs`
- `server/database-status.mjs`
- `src/lib/featureFlags.ts`
- `src/lib/siteSettings.tsx`
- `src/lib/databaseStatus.ts`
- `src/lib/gameDb.ts`
- `docs/036_mode-lokal_26102026_0819.md`

## 2. Provider database game

Dukungan kode yang ditambahkan/dipertahankan:

| Provider | Jalur kode | Skema |
| --- | --- | --- |
| TiDB Cloud MySQL | `mysql2`, handler sync TiDB | Tabel `cs_*` |
| Aiven for MySQL | `mysql2`, handler sync bergaya TiDB | Tabel `cs_*` |
| Aiven for PostgreSQL | `pg`, handler Aiven PostgreSQL | `profiles`, `saves`, `attempts` |

Keputusan lain:

- Prioritas provider default adalah TiDB lalu Aiven; `DB_PROVIDER=tidb|aiven`
  dapat memaksa prioritas.
- Site settings cloud hanya dimuat melalui jalur TiDB.
- Progress selalu ditulis lokal lebih dulu; cloud adalah lapisan sinkronisasi.
- Aiven MySQL/PostgreSQL dikenali dari skema connection string.
- Probe Aiven memeriksa keberadaan tabel aplikasi dan tidak mengembalikan
  URL, password, atau pesan driver.

File penting:

- `server/aiven.mjs`
- `server/aiven-sync.mjs`
- `server/tidb-sync.mjs`
- `api/sync-progress.mjs`
- `netlify/functions/sync-progress.mjs`
- `tests/aiven.test.mjs`
- `tests/database-status.test.mjs`

## 3. Redis sebagai cache opsional

Yang sudah diimplementasikan:

- Redis **bukan database utama**.
- Redis hanya dipakai sebagai cache bersama antar-instance serverless untuk:
  - hasil `/api/database-status`;
  - dokumen site settings publik.
- TTL cache tersebut 30 detik.
- Pilihan koneksi:
  1. Upstash Redis REST (`UPSTASH_REDIS_REST_URL` +
     `UPSTASH_REDIS_REST_TOKEN`), diprioritaskan;
  2. Redis/Valkey TCP (`REDIS_URL`, `AIVEN_REDIS_URL`, atau `VALKEY_URL`)
     melalui `ioredis`.
- Bila Redis tidak terkonfigurasi, cache in-memory per-instance tetap dipakai.
- Diagnostik admin dapat melakukan PING dan uji tulis/baca kunci sementara.

File penting:

- `server/redis.mjs`
- `server/database-status.mjs`
- `server/site-settings.mjs`
- `tests/redis.test.mjs`

## 4. Halaman admin khusus diagnostik dan tes koneksi

Yang sudah diimplementasikan:

- Entry `/admin/` dibangun terpisah sebagai `dist/admin/`.
- Halaman admin saat ini bersifat **diagnostics-only**:
  - melihat keputusan mode aplikasi;
  - memicu tes koneksi fresh;
  - tidak mengubah jalannya aplikasi pemain.
- Editor pengaturan lama `AdminSettings` masih ada di tree, tetapi tidak lagi
  ditautkan dari entry `/admin/` saat ini.
- Tes mendalam berjalan di backend serverless melalui
  `GET /api/admin-diagnostics`, bukan dari browser.
- Laporan diagnostik memuat:
  - status, skema, dan latensi TiDB;
  - status, jenis, skema, dan latensi Aiven;
  - status dan latensi Redis;
  - status Better Auth MariaDB setelah integrasi Better Auth;
  - mode/keputusan efektif;
  - checklist nama environment dan status terisi/tidak;
  - runtime/platform.
- Laporan dirancang tidak memuat password, secret, token, atau connection
  string utuh.
- Otorisasi diagnostik mendukung:
  - token tes server `ADMIN_TEST_TOKEN` melalui header `x-admin-token`;
  - sesi Better Auth dengan role admin atau allowlist;
  - JWT Supabase admin legacy + `ADMIN_USER_IDS`.
- Hub memiliki tautan ke `./admin/`.

File penting:

- `src/admin/main.tsx`
- `src/admin/AdminDiagnostics.tsx`
- `src/admin/diagnostics.ts`
- `server/admin-diagnostics.mjs`
- `api/admin-diagnostics.mjs`
- `netlify/functions/admin-diagnostics.mjs`
- `tests/admin-diagnostics.test.mjs`

## 5. Persiapan deploy Netlify dan Vercel

Yang sudah diimplementasikan:

- Netlify:
  - build Vite dan publish `dist`;
  - Functions di `netlify/functions/`;
  - redirect API ke Functions sebelum SPA fallback;
  - redirect `/api/auth/*` ke fungsi Better Auth;
  - fallback `/admin/*` ke `admin/index.html`;
  - `mysql2`, `pg`, `ioredis`, dan `better-auth` sebagai external Node modules.
- Vercel:
  - API routes di folder `api/`;
  - catch-all Better Auth di `api/auth/[...all].mjs`;
  - rewrite `/admin/(.*)` ke `/admin/index.html`.
- Pengembangan lokal:
  - Vite mem-proxy `/api` ke `server/dev-api.mjs` pada port 3001;
  - dev-api memuat route Vercel yang sama, termasuk `/api/auth/*`.
- Tidak diperlukan server backend always-on terpisah untuk arsitektur ini.

Dokumen terkait:

- `docs/035_deploy-netlify-vercel_26102026_0819.md`
- `docs/036_mode-lokal_26102026_0819.md`

## 6. Better Auth + Layerbase MariaDB

### Paket

Sudah terpasang melalui npm karena repo memakai `package-lock.json` dan `pnpm`
tidak tersedia di sandbox:

- `better-auth@^1.7.13`
- `mysql2@^3.24.6` (sudah ada sebelumnya)

### Konfigurasi server

Sudah diimplementasikan:

- `auth.ts` di root sebagai entry Better Auth CLI.
- Implementasi bersama di `server/better-auth.mjs` agar dipakai oleh Vercel,
  Netlify, CLI, dan dev-api lokal.
- Pool dibuat dengan `mysql2/promise`, timezone `Z`, dan `connectionLimit: 5`.
- `emailAndPassword: { enabled: true, minPasswordLength: 8 }`.
- Plugin server `admin()` dipasang.
- Base path ditetapkan ke `/api/auth`.
- `BETTER_AUTH_SECRET` dan `BETTER_AUTH_URL` dibaca dari environment.
- Trusted origins dan allowed hosts dinamis didukung untuk deployment/preview.
- Optional CA MariaDB didukung melalui `AUTH_DB_CA_CERT`.
- URL database dibaca dengan urutan:
  1. `AUTH_DATABASE_URL`
  2. `BETTER_AUTH_DATABASE_URL`
  3. `DATABASE_URL`

### Konfigurasi klien

Sudah diimplementasikan di `src/lib/auth-client.ts`:

- `createAuthClient()` dari `better-auth/react`;
- `adminClient()` dari `better-auth/client/plugins`;
- ekspor `signIn`, `signUp`, `signOut`, dan `useSession`.

### Route `/api/auth/*`

Sudah tersedia untuk:

- Vercel: `api/auth/[...all].mjs`;
- Netlify: `netlify/functions/auth.mjs`;
- lokal: route di `server/dev-api.mjs`.

Adapter Netlify mengubah event legacy menjadi Web `Request`, menulis ulang
path fungsi menjadi `/api/auth/*`, dan mempertahankan banyak header
`Set-Cookie` melalui `multiValueHeaders`.

### UI dan alur aplikasi

Sudah diimplementasikan:

- Panel “Akun email (opsional)” di onboarding.
- Daftar melalui `authClient.signUp.email(...)`.
- Masuk melalui `authClient.signIn.email(...)`.
- Pemulihan sesi Better Auth yang sudah ada.
- Keluar dari akun.
- Pemain tetap dapat bermain sebagai tamu lokal.
- Bila akun Better Auth dipakai membuat profil, save lokal memakai namespace
  ID akun tersebut.
- Bila akun yang masuk sudah memiliki save lokal pada perangkat yang sama,
  aplikasi mengadopsi namespace akun agar tidak menimpanya dengan save tamu
  kosong.

### Pemakaian sesi oleh backend aplikasi

Sudah diimplementasikan:

- `resolveAuthenticatedUser()` dan `resolveOwner()` menerima cookie sesi
  Better Auth.
- Owner sinkronisasi menjadi `user:<better-auth-user-id>`.
- Cookie Better Auth yang tidak valid menghasilkan HTTP 401.
- User dengan ban aktif menghasilkan HTTP 403.
- Cookie Better Auth mencegah bypass guest-sync development.
- JWT Supabase dipertahankan sebagai jalur legacy bila tidak ada cookie
  Better Auth.
- `requireAdmin()` menerima:
  - Better Auth user dengan role `admin`;
  - Better Auth/Supabase user dalam `ADMIN_USER_IDS`;
  - jalur Supabase legacy yang sudah ada.
- `/api/database-status` sekarang melaporkan Better Auth sebagai identitas
  terkonfigurasi bila URL auth MySQL/MariaDB dan secret valid.

### Skema database auth

File `db/better-auth-mariadb.sql` sudah dibuat sebagai SQL fallback untuk
MariaDB. Isinya adalah skema Better Auth dari Layerbase dengan tanda kurung
yang dinormalisasi agar valid, mencakup:

- `user`
- `session`
- `account`
- `verification`
- kolom `user.role`, `user.banned`, `user.banReason`, `user.banExpires`
- kolom `session.impersonatedBy`
- indeks `session_userId_idx`, `account_userId_idx`, dan
  `verification_identifier_idx`

Tidak ada tabel auth kustom baru yang ditambahkan.

### Script Better Auth

Sudah ditambahkan:

```bash
npm run auth:generate
npm run auth:migrate
npm run auth:check
npm run auth:create-admin
npm run test:better-auth
```

Wrapper `scripts/better-auth-cli.mjs` memuat `.env` melalui npm script dan
menjalankan paket CLI `auth` dengan versi yang sama dengan dependensi
`better-auth` terpasang.

### Environment lokal

Sudah dilakukan:

- `.env` lokal dibuat dan diabaikan Git.
- `BETTER_AUTH_SECRET` lokal dibuat dengan `openssl rand -base64 32`.
- `BETTER_AUTH_URL=http://localhost:3000` untuk pengembangan lokal.
- `VITE_BETTER_AUTH_URL` dikosongkan agar browser memakai origin yang sama.
- `DATABASE_URL` dan `AUTH_DATABASE_URL` masih kosong karena connection string
  Layerbase asli tidak disertakan dalam permintaan.

## 7. Keputusan nama environment database

Keputusan yang diterapkan untuk menghindari tabrakan:

- Database **Better Auth** menggunakan `AUTH_DATABASE_URL` atau `DATABASE_URL`
  MySQL/MariaDB dari Layerbase.
- Database **game Aiven** harus menggunakan `AIVEN_DATABASE_URL` atau
  `GAME_DATABASE_URL`.
- `DATABASE_URL` PostgreSQL lama masih dikenali sebagai fallback database game
  bila tidak ada env game eksplisit.
- `DATABASE_URL` MySQL/MariaDB tidak lagi diprobe sebagai Aiven game karena
  nama itu dicadangkan untuk Auth Server pada integrasi ini.

Template dan penjelasan tersedia di `.env.example` dan
`docs/034_better-auth-layerbase_26102026_0819.md`.

## 8. Kompatibilitas yang didukung dan tidak didukung

Ringkasan berikut hanya menyatakan dukungan kode saat ini, bukan klaim
kompatibilitas universal.

| Area | Didukung sekarang | Tidak didukung/belum ada |
| --- | --- | --- |
| Database game cloud | TiDB Cloud MySQL; Aiven MySQL; Aiven PostgreSQL | Provider database lain tanpa adapter/probe tambahan |
| Penyimpanan lokal | `localStorage` utama; SQLite `sql.js` untuk backup/ekspor | SQLite sebagai sumber runtime utama |
| Database Better Auth | MariaDB/MySQL melalui pool `mysql2` | PostgreSQL/SQLite untuk konfigurasi Better Auth saat ini |
| Backend | Vercel API; Netlify Functions; Node dev-api lokal | Backend always-on khusus belum dibuat dan tidak diperlukan oleh arsitektur saat ini |
| Cache | Upstash Redis REST; Redis/Valkey TCP | Redis sebagai database utama |
| Better Auth | Email/password; cookie sesi; plugin admin | Google/social provider melalui Better Auth belum dikonfigurasi |
| Supabase | Auth dan verifikasi JWT legacy | Supabase Database/PostgREST/RLS/Storage/Realtime sebagai backend aplikasi |
| Google Auth | Melalui Supabase Google OAuth | Melalui Better Auth Google provider |
| BaaS lain | — | Firebase, Appwrite, PocketBase, dan BaaS lain belum memiliki adapter aplikasi |

Mode identitas yang tersedia:

1. Tamu lokal.
2. Better Auth email/password.
3. Supabase Google OAuth legacy.

Tidak ada login custom langsung dari browser ke database.

## 9. Verifikasi yang sudah dijalankan

Hasil terakhir yang tercatat pada worktree ini:

- `npm run lint` — lulus.
- Seluruh tes Node di `tests/*.test.mjs` — **92 lulus, 0 gagal**.
- `npm run build` — lulus dan menghasilkan entry `dist/admin/index.html`.
- Runtime lokal melalui Vite/dev-api:
  - `/` menjawab HTTP 200;
  - `/admin/` menjawab HTTP 200;
  - `/api/auth/get-session` menjawab HTTP 503
    `better_auth_not_configured` karena URL Layerbase masih kosong;
  - `/api/database-status` memutuskan mode lokal karena TiDB/Aiven belum
    terkonfigurasi;
  - `/api/admin-diagnostics` dengan token demo lokal menjawab HTTP 200 dan
    menampilkan Better Auth `not_configured`.
- Better Auth CLI berhasil memuat `auth.ts` dan mencoba pool MySQL saat diberi
  env palsu; proses berhenti pada koneksi database palsu tersebut. Ini
  membuktikan discovery konfigurasi CLI, bukan koneksi live.

## 10. Batas bukti dan hal yang belum selesai secara live

Belum dilakukan atau belum terbukti:

- Connection string Layerbase asli belum dimasukkan karena tidak tersedia
  dalam permintaan.
- Skema Better Auth belum diterapkan ke database Layerbase live dari sesi ini.
- `npm run auth:migrate` dan `npm run auth:check` belum berhasil dijalankan
  terhadap database live.
- Sign-up/sign-in Better Auth terhadap MariaDB live belum diuji.
- User admin Better Auth live belum dibuat.
- Koneksi live TiDB Cloud/Aiven dengan kredensial asli belum diuji dalam sesi
  ini; jalur cloud dibuktikan dengan tes terinjeksi dan runtime fallback lokal.
- Login live Supabase/Google dengan project asli belum diuji dalam sesi ini.
- Base URL produksi untuk `BETTER_AUTH_URL` belum dikonfirmasi; lokal
  menggunakan `http://localhost:3000`.
- Perubahan belum di-commit, di-push, atau dibuat pull request.

## 11. Langkah live berikutnya

1. Isi salah satu variabel berikut dari Layerbase **Connect**:

   ```dotenv
   AUTH_DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE
   # atau
   DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE
   ```

2. Terapkan skema dengan salah satu cara:
   - tombol **“Set up the Better Auth schema”** di Layerbase; atau
   - `npm run auth:migrate`; atau
   - SQL fallback `db/better-auth-mariadb.sql` ke database auth saja.
3. Jalankan `npm run auth:check`.
4. Untuk produksi, set `BETTER_AUTH_URL` ke origin produksi dan set env yang
   sama di Netlify/Vercel.
5. Restart dev-api atau redeploy serverless.
6. Buat admin pertama dengan `npm run auth:create-admin` atau set
   `user.role = 'admin'` melalui Layerbase.
7. Uji sign-up, sign-in, logout, sinkronisasi cloud, dan kartu Better Auth di
   `/admin/` terhadap database live.
8. Untuk membuktikan mode cloud game, isi kredensial dan skema TiDB/Aiven lalu
   jalankan tes awal serta sinkronisasi nyata.
