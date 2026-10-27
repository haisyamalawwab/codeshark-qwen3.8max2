# 046 — Penerimaan kredensial workspace, tes koneksi, dan secret Netlify

Tanggal: 2026-10-28 06:50 WIB
Status: perubahan lokal siap diajukan melalui pull request.
Melengkapi: dokumen 045 (pemisahan prefix env TiDB–Layerbase).

Dokumen ini mencatat pekerjaan **setelah** dokumen 045 yang belum tercatat
di markdown lain. Sesuai aturan keamanan proyek, dokumen ini **sengaja tidak
memuat nilai kredensial apa pun** (password, connection string berisi
password, `BETTER_AUTH_SECRET`, username/host spesifik instans). Hanya nama
variable, path file, perintah, dan hasil status yang dicatat.

## 1. PR #7 digabungkan ke `main`

Dokumen 045 berhenti pada status "siap diajukan melalui pull request".
Kelanjutannya:

- PR: **#7** — `feat: pisahkan prefix env TiDB-Layerbase dan tambah @better-auth/infra`
- Base `main`, head `arena/93791475-codeshark-qwen3-8max2`
- Commit fitur: `dd995c751bfeebefacf50da2f1a63e745898763c`
- Merge commit: `938bb318f9a903825904e73acf259787c7e3cc7c`
- Digabungkan: `2026-10-27T14:53:09Z`, 13 berkas, +508/−116
- Check Netlify pada PR berstatus sukses/netral sebelum merge.

Dengan itu namespace kanonis `TIDB_*` (database game) dan `LAYERBASE_*`
(database Better Auth) resmi berada di `main`.

## 2. Kredensial diterima dan disimpan khusus workspace

Pemilik memberikan kredensial Layerbase, lalu kredensial TiDB Cloud.
Penanganan yang dilakukan:

- Nilai hanya ditulis ke **`.env` lokal workspace** (terdaftar di
  `.gitignore`, mode `600`). `git status` bersih; tidak ada nilai yang
  masuk source code, `.env.example`, test, dokumen, commit, atau PR.
- Normalisasi nama: `LAYERBASE_USER` dari pemilik disimpan sebagai
  **`LAYERBASE_USERNAME`** (nama kanonis yang dibaca resolver dokumen 045).
- Host dibersihkan dari format link markdown menjadi hostname murni;
  nama database memakai koreksi terakhir pemilik.
- `BETTER_AUTH_SECRET` dihasilkan lokal dengan `openssl rand -base64 32`
  langsung ke `.env` dan tidak pernah ditampilkan.
- Endpoint HTTPS `query` Layerbase dicatat sebagai jalur API terpisah;
  aplikasi tidak memakainya sebagai DB URL (endpoint itu memerlukan API
  key Bearer tersendiri, berbeda dari password database). Better
  Auth/mysql2 memakai koneksi MariaDB langsung dari grup `LAYERBASE_*`.

⚠️ Kedua password sempat terkirim melalui chat. Rotasi password di panel
TiDB Cloud dan Layerbase **sudah disarankan kuat**; setelah rotasi, nilai
baru harus diperbarui langsung di `.env`/secret deployment — bukan lewat
chat. Status rotasi belum terkonfirmasi saat dokumen ini ditulis.

## 3. Tes koneksi TiDB Cloud dan Layerbase dari sandbox

Perintah/probe yang dijalankan dengan `.env` workspace terisi:

| Pemeriksaan | Hasil konfigurasi | Hasil koneksi |
|---|---|---|
| `environmentReport` (status env) | `TIDB_*` dan `LAYERBASE_*` semua `set` | — |
| `betterAuthPublicConfig` | `configured: true`, `missing: []`, sumber grup `LAYERBASE_*` | — |
| `npm run db:verify` (TiDB) | `configured: true` | `connection_failed`, keputusan `local` |
| `probeBetterAuthDatabase` (Layerbase) | `configured: true` | `connection_failed`, skema `not_checked` |
| Koneksi `mysql2` langsung (plain & TLS) | — | `PROTOCOL_CONNECTION_LOST` |
| TCP mentah ke gateway TiDB & host Layerbase | DNS ter-resolve | diterima 2–18 ms lalu diputus sebelum handshake MySQL |
| HTTPS ke API Layerbase | — | TLS dibatalkan (`SSL_ERROR_SYSCALL`) |

Kesimpulan berbasis bukti: sandbox ini hanya mengizinkan egress ke
GitHub/npm/PyPI; proxy egress menerima TCP lalu memutus aliran data ke
host database. Jadi kegagalan di atas **bukan** bukti kredensial salah dan
juga **bukan** bukti koneksi berhasil. Konfigurasi terbukti dikenali penuh
oleh kode; bukti hosted live tetap tertunda (lihat bagian 7).

## 4. Secret file Netlify disiapkan: `.env.netlify.local`

Atas permintaan pemilik, disiapkan file env khusus Netlify yang siap
disalin manual ke dashboard (tidak ditempel di chat, ditampilkan lewat
viewer berkas):

- Lokasi: `.env.netlify.local` di root workspace; ter-ignored Git lewat
  pola `.env.*.local` (`.gitignore:68`), mode `600`, `git status` bersih.
- Isi: 27 variable aktif — mode data `auto`, `TIDB_*`, `LAYERBASE_*`,
  `BETTER_AUTH_*`, variable publik `VITE_*`, dan opsi kosong lain —
  diambil dari `.env` workspace tanpa mencetak nilainya.
- **`TIDB_CA_CERT` diisi dari isi `certs/tidb-ca-rozanhaisyam.pem`** dalam
  format PEM satu-baris ber-`\n` (1.968 karakter) sebagai pengganti
  `TIDB_CA_PATH`; `TIDB_CA_PATH` dikosongkan.
- `BETTER_AUTH_URL=https://latihan.my.id` beserta allowed hosts/trusted
  origins (perlu disesuaikan bila domain produksi berbeda).
- `VITE_ADMIN_ENABLED=false` sebagai default aman.
- Validasi tanpa menampilkan nilai: `tidbOptions` membaca file ini dengan
  `ssl.rejectUnauthorized: true` dan CA terisi; `betterAuthPublicConfig`
  melaporkan `configured: true`, `missing: 0`.

## 5. Klarifikasi CA TiDB: `TIDB_CA_PATH` memang ada

Menjawab pertanyaan pemilik, diverifikasi di repo:

- File `certs/tidb-ca-rozanhaisyam.pem` **ter-track Git** dan publik:
  sertifikat **ISRG Root X1** (`CA:TRUE`), berlaku sampai 4 Juni 2035,
  tanpa private key. Detailnya didokumentasikan di `certs/README.md`.
- `netlify.toml` menyertakan file ini via `included_files` pada bundle
  Functions, sehingga pada Netlify tersedia dua jalur setara:
  `TIDB_CA_PATH=certs/tidb-ca-rozanhaisyam.pem` **atau** `TIDB_CA_CERT`
  berisi PEM.
- Keduanya tidak boleh terisi bersamaan — `server/tidb.mjs` menolaknya.
  Keduanya kosong berarti memakai trust store Node dengan verifikasi
  TLS tetap aktif (tidak ada fallback tidak aman).
- Keputusan mengganti secret file Netlify dari jalur `TIDB_CA_CERT` ke
  `TIDB_CA_PATH` ditawarkan, belum diputuskan pemilik.

## 6. Build Netlify gagal karena secrets scanning

Gejala yang dilaporkan pemilik: build gagal pada tahap *building site*
(exit code 2) karena Netlify secrets scanning menemukan nilai literal
`TIDB_USER` pada **`scripts/check-secrets.mjs` baris 18**, sementara
`SECRETS_SCAN_OMIT_KEYS` yang terpasang tidak mencakup `TIDB_USER`.

Catatan pemeriksaan: file `scripts/check-secrets.mjs` **tidak ada** di
branch sesi ini maupun di `main` yang ter-fetch, sehingga state yang
di-deploy berbeda dari workspace ini dan file-nya belum bisa diperbaiki
dari sini.

Rekomendasi yang diberikan dan diterapkan pada secret file:

- Tambahkan pengecualian sesempit mungkin:
  `SECRETS_SCAN_OMIT_PATHS=scripts/check-secrets.mjs` (sudah ditambahkan
  ke `.env.netlify.local`). Ini lebih aman daripada
  `SECRETS_SCAN_OMIT_KEYS=TIDB_USER` yang menonaktifkan deteksi nilai
  tersebut di semua file, dan jauh lebih aman daripada
  `SECRETS_SCAN_ENABLED=false` yang mematikan seluruh pemindaian.
- Nilai yang terdeteksi hanyalah username (bukan password), kemungkinan
  contoh/pola di dalam skrip pemeriksa itu sendiri (false positive),
  sehingga omit path dapat diterima untuk kasus ini.
- Perbaikan jangka panjang: hapus literal nilai env dari baris tersebut
  (ganti placeholder/pola regex), setelah itu omit tidak diperlukan.
- ⚠️ Ditemukan juga nama `LAYERBASE_USER` pada omit keys pemilik; nama
  yang dibaca aplikasi adalah `LAYERBASE_USERNAME`. Bila variable
  Netlify-nya juga bernama `LAYERBASE_USER`, Better Auth akan terbaca
  belum terkonfigurasi. Perlu dicek pemilik di dashboard Netlify.

## 7. Yang masih tertunda (bukti live)

Belum ada klaim koneksi hosted berhasil. Langkah pembuktian yang tersisa:

1. Salin isi `.env.netlify.local` ke Environment Variables Netlify
   (scope Functions + Builds), pastikan nama `LAYERBASE_USERNAME` benar,
   lalu redeploy.
2. Terapkan skema Better Auth di Layerbase (panel **Apply** atau
   `npm run auth:migrate` dari lingkungan yang dapat menjangkau
   database).
3. Jalankan `npm run auth:check` dari lingkungan beregress terbuka;
   periksa `/api/database-status` pada deploy (keputusan `cloud`) dan
   probe diagnostik admin bila `/admin` diaktifkan.
4. Uji sign-up, sign-in, dan sesi nyata; verifikasi baris sinkronisasi
   progres di TiDB.
5. Rotasi kedua password yang pernah terkirim via chat, lalu perbarui
   `.env`, `.env.netlify.local`, dan Netlify.
6. Putuskan jalur CA Netlify (`TIDB_CA_PATH` vs `TIDB_CA_CERT`) dan
   bersihkan literal pada `scripts/check-secrets.mjs` agar omit dapat
   dicabut.
