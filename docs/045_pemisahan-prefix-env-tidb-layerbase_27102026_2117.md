# 045 — Pemisahan prefix env TiDB dan Layerbase

Tanggal: 2026-10-27 21:17 WIB
Status: perubahan lokal siap diajukan melalui pull request.

## Tujuan

Memastikan environment TiDB Cloud dan Layerbase tidak tumpang tindih:

- `TIDB_*` hanya untuk database game TiDB Cloud.
- `LAYERBASE_*` hanya untuk database autentikasi Better Auth di Layerbase MariaDB.
- `BETTER_AUTH_*` hanya untuk konfigurasi aplikasi Better Auth, seperti secret dan base URL.

Dokumen ini melengkapi dokumen 044. Format field generik pada dokumen 044
tetap dipertahankan sebagai fallback kompatibilitas lama, tetapi setup baru
harus memakai namespace `LAYERBASE_*`.

## Konfigurasi kanonis

Pilih satu format Layerbase:

```dotenv
# Format A — field terpisah
LAYERBASE_HOST=
LAYERBASE_USERNAME=root
LAYERBASE_DATABASE=
LAYERBASE_PORT=
LAYERBASE_PASSWORD=

# Format B — connection string utuh
LAYERBASE_DATABASE_URL=
```

`LAYERBASE_PORT` kosong berarti `3306`. `LAYERBASE_HOST` berisi hostname
saja, tanpa `mysql://` dan tanpa `:port`.

Prioritas resolver Better Auth:

1. `LAYERBASE_DATABASE_URL`.
2. Grup `LAYERBASE_HOST`, `LAYERBASE_USERNAME`, `LAYERBASE_DATABASE`,
   `LAYERBASE_PORT`, dan `LAYERBASE_PASSWORD` sebagai satu grup.
3. URL legacy `AUTH_DATABASE_URL`, `BETTER_AUTH_DATABASE_URL`, lalu
   `DATABASE_URL`, hanya bila grup `LAYERBASE_*` belum mulai diisi.
4. Grup legacy `HOST`, `username`, `database`, `PORT`, dan `password`, hanya
   sebagai kompatibilitas lama.

Bila salah satu field `LAYERBASE_*` mulai diisi, konfigurasi parsial
dilaporkan sebagai kekurangan grup `LAYERBASE_*`; resolver tidak mengambil
field dari TiDB, URL legacy, atau grup legacy untuk melengkapinya.

## Perubahan

- `.env.example`: blok TiDB diberi label namespace `TIDB_*`; blok Better
  Auth/Layerbase memakai lima field `LAYERBASE_*` dan
  `LAYERBASE_DATABASE_URL` sebagai konfigurasi kanonis.
- `server/better-auth.mjs`: resolver diskrit diparameterisasi berdasarkan
  nama key, memilih grup sebagai satu kesatuan, melaporkan source/kind, dan
  memakai label kanonis pada pesan konfigurasi yang kurang.
- `scripts/better-auth-cli.mjs`: guard sebelum `auth:<perintah>` mengikuti
  prioritas yang sama, sehingga CLI menerima grup `LAYERBASE_*` lengkap dan
  menolak grup parsial tanpa berpindah ke `DATABASE_URL` legacy.
- `server/database-status.mjs`, `src/lib/databaseStatus.ts`, dan
  `src/admin/setupStatus.ts`: inventaris status setup kini menampilkan enam
  nama `LAYERBASE_*` dengan status kehadiran saja, bukan nilai env.
- `server/admin-diagnostics.mjs`: presence admin kini mencakup enam nama
  `LAYERBASE_*` dalam bentuk boolean.
- `docs/034_better-auth-layerbase_26102026_0819.md`: namespace, prioritas,
  contoh deployment, dan troubleshooting diperbarui ke format kanonis.
- `tests/better-auth.test.mjs` dan `tests/database-status.test.mjs`: cakupan
  ditambah untuk prioritas URL kanonis, grup diskrit kanonis, fallback
  legacy, grup parsial yang tidak dicampur, port default/validasi, status
  lingkungan, dan redaksi rahasia.
- `package.json` dan `package-lock.json`: `@better-auth/infra@^0.4.23`
  terpasang atas permintaan lanjutan. Paket ini belum diimpor atau
  diintegrasikan ke runtime aplikasi pada perubahan ini.

## Kredensial workspace

Tidak ada nilai kredensial asli yang diterima, ditulis ke source code,
`.env.example`, dokumentasi, atau test pada pekerjaan ini.

Sebuah skeleton `.env` lokal berplaceholder kosong disiapkan khusus untuk
workspace ini dengan mode `600`. File tersebut terdaftar pada `.gitignore`
dan tidak muncul pada `git status`. Nilai asli harus diisi langsung pada:

1. `.env` lokal untuk workspace/development; atau
2. secret manager deployment untuk produksi.

Jangan mengirim password, connection string berisi password, atau
`BETTER_AUTH_SECRET` melalui chat, commit, atau pull request.

## Validasi lokal

Hasil yang telah dijalankan tanpa kredensial hosted asli:

- `npm run test:better-auth` — 12/12 lolos.
- `npm run test:data-mode` — 28/28 lolos.
- `npm run lint` — lolos (`tsc --noEmit`).
- Validasi test/lint diulang setelah instalasi `@better-auth/infra@0.4.23`;
  `npm ls @better-auth/infra --depth=0` mengonfirmasi paket terpasang.
- Fake `npx` membuktikan guard CLI menerima grup `LAYERBASE_*` lengkap dan
  meneruskan `auth@1.7.13 check --config auth.ts`.
- Fake `npx` tidak dipanggil saat grup `LAYERBASE_*` parsial meskipun
  `DATABASE_URL` legacy terisi; wrapper keluar dengan status 1.

Tes tersebut membuktikan pemilihan konfigurasi dan redaksi, bukan koneksi
hosted. Bukti live tetap membutuhkan env yang diisi pemilik, skema Better
Auth yang diterapkan, `npm run auth:check`, probe diagnostik, sign-up,
sign-in, sesi, serta verifikasi sinkronisasi TiDB.
