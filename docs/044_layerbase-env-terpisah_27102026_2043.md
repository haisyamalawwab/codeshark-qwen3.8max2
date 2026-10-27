# 044 — Konfigurasi Layerbase dengan Field Env Terpisah

- Tanggal: 27 Oktober 2026
- Branch: `arena/1d341d62-codeshark-qwen3-8max2`
- Tujuan: `.env.example` menyediakan field koneksi Layerbase sesuai label panel, dan server Better Auth benar-benar dapat membaca field tersebut dari `.env`.

## Field yang ditambahkan

Pada bagian **Better Auth (Layerbase MariaDB "Auth Server")** di `.env.example`, field berikut tersedia berurutan:

```dotenv
HOST=
username=root
database=
PORT=
password=
```

Aturan pengisian:

- Isi nilai asli hanya pada `.env` lokal yang diabaikan Git atau secret environment deployment.
- Jangan menaruh password asli di `.env.example`, dokumentasi, commit, atau chat.
- `PORT` kosong berarti `3306`.
- `HOST` hanya hostname; jangan menambahkan `mysql://` atau `:port`.
- Field wajib untuk format ini adalah `HOST`, `username`, `database`, dan `password`.
- `BETTER_AUTH_SECRET` dan `BETTER_AUTH_URL` tetap dikonfigurasi terpisah.

## Perilaku server

Prioritas koneksi database auth sekarang:

1. `AUTH_DATABASE_URL`
2. `BETTER_AUTH_DATABASE_URL`
3. `DATABASE_URL`
4. Field terpisah `HOST/username/database/PORT/password`

Bila tidak ada URL eksplisit dan field terpisah lengkap, `server/better-auth.mjs` menyusun URL `mysql://` internal dengan username, password, dan database yang di-encode secara aman. Laporan publik/diagnostik hanya menampilkan host, nama database, dan sumber konfigurasi—bukan username atau password.

Format terpisah ini dipakai oleh:

- pool Better Auth `mysql2/promise`;
- probe read-only skema Better Auth;
- handler `/api/auth/*` Vercel, Netlify, dan API lokal/Docker;
- gerbang konfigurasi pada wrapper CLI `auth:generate`, `auth:migrate`, `auth:check`, dan `auth:create-admin`.

Konfigurasi parsial gagal tertutup. Contohnya, bila hanya `HOST` dan `username` yang terisi, laporan `missing` menyebut `database` dan `password`; server tidak menebak kredensial dan tidak membuka koneksi.

## File yang diubah

| File | Perubahan |
|---|---|
| `.env.example` | Field Layerbase terpisah dan penjelasan prioritas |
| `server/better-auth.mjs` | Parser/penyusun URL dari field terpisah, validasi host/port, prioritas env, dan pesan konfigurasi |
| `scripts/better-auth-cli.mjs` | Gerbang CLI menerima format terpisah |
| `tests/better-auth.test.mjs` | Tes penyusunan URL, karakter khusus password, port bawaan, prioritas URL, konfigurasi parsial, dan redaksi laporan |
| `docs/034_better-auth-layerbase_26102026_0819.md` | Panduan setup format terpisah |
| `src/admin/setupStatus.ts`, `src/lib/auth.ts` | Teks bantuan/pesan yang menyebut alternatif field Layerbase |

## Validasi

- Pemeriksaan teks `.env.example`: lima field tersedia tepat satu kali, berurutan, dan berdekatan.
- `npm run test:better-auth` — **12/12 lulus**.
- `npm run test:data-mode` — **27/27 lulus**.
- `npm run lint` — lulus.
- Wrapper CLI diuji dengan executable `npx` palsu: env terpisah lolos gerbang dan meneruskan `auth@1.7.13 check --config auth.ts` tanpa koneksi database.
- `git diff --check` — lulus pada pemeriksaan sebelum doc ini ditambahkan.

## Batas bukti

Workspace tidak memiliki `.env` berisi kredensial Layerbase asli. Perubahan ini membuktikan parsing, prioritas, validasi, penyusunan URL, dan gerbang CLI dengan test terinjeksi; perubahan ini **bukan** bukti koneksi live, migrasi skema hosted, sign-up, atau sign-in terhadap database Layerbase nyata. Bukti live tetap memerlukan pengisian env oleh pemilik kredensial lalu `auth:check`, penerapan skema, dan uji sign-up/sign-in nyata.
