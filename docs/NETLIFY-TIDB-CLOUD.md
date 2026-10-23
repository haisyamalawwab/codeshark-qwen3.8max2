# Koneksi TiDB Cloud melalui Netlify Functions

## Arsitektur

```text
Browser → POST /api/sync-progress
        → Netlify Function sync-progress (Node.js)
        → verifikasi identitas pengguna
        → mysql2 + TLS → TiDB Cloud:4000
```

Database tidak diakses langsung dari browser. Function Netlify memakai adapter TiDB langsung, bukan driver Neon/PostgreSQL lama. Tidak ada password di `netlify.toml` atau bundle Vite.

**Status:** konfigurasi repository siap; secret dashboard, deploy aktual, dan koneksi cluster belum diterapkan/diverifikasi dari sesi ini. `.env` lokal tidak otomatis tersedia di Netlify.

## 1. Konfigurasi repository

`netlify.toml` menetapkan:

- Build `npm run build`, publish `dist`, Node build versi 22.
- Direktori function `netlify/functions` dan bundler esbuild.
- `mysql2` sebagai external Node dependency yang dikemas untuk function.
- `certs/tidb-ca-rozanhaisyam.pem` masuk bundle function melalui `included_files` jika file sudah ditambahkan lewat GitHub.
- Rewrite paksa `/api/sync-progress` ke `/.netlify/functions/sync-progress` **sebelum** SPA fallback.
- `VITE_SYNC_ENDPOINT=/api/sync-progress`: alamat publik API saja, bukan koneksi database.

Tidak ada perintah inisialisasi skema di build. Deployment/rebuild tidak boleh membuat atau mengubah tabel produksi secara diam-diam.

## 2. Buat database aplikasi

Sebelumnya konfigurasi lokal meminta database `sys`. Jangan menjalankan skema aplikasi di database sistem tersebut. Buat database aplikasi, misalnya:

```sql
CREATE DATABASE IF NOT EXISTS codeshark
  CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
```

Jalankan `db/tidb-schema.sql` pada `codeshark` melalui SQL Editor TiDB Cloud, atau gunakan `npm run db:tidb:init` dengan environment migrasi yang benar. Nama database di Netlify dan tempat tabel dibuat harus sama.

Gunakan akun migrasi untuk membuat tabel. Untuk function runtime, gunakan user dengan izin minimum `SELECT`, `INSERT`, `UPDATE` pada database aplikasi. Username `.root` yang disediakan dapat dipakai saat bootstrap, tetapi sebaiknya tidak menjadi akun aplikasi publik jangka panjang.

## 3. Isi environment di dashboard Netlify

Buka situs Netlify terkait → **Project/Site configuration → Environment variables**. Nama menu dapat berbeda menurut versi dashboard. Tambahkan variabel berikut untuk **Functions runtime**, dengan context **Production**. Jika ingin menguji branch deploy/deploy preview, atur context tersebut secara terpisah pada deployment tepercaya.

| Variabel | Nilai/tujuan |
|---|---|
| `DB_PROVIDER` | `tidb` untuk konsistensi konfigurasi lokal/Vercel; function Netlify ini selalu memakai TiDB |
| `TIDB_HOST` | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` tanpa `http://` |
| `TIDB_PORT` | `4000` |
| `TIDB_USER` | `4SVd5YwHs8hxfc5.root` saat bootstrap, lalu ganti user runtime berizin minimum |
| `TIDB_PASSWORD` | Password asli, isi langsung di dashboard dan tandai sebagai secret bila tersedia |
| `TIDB_DATABASE` | `codeshark` setelah database dibuat; **bukan `sys`** |
| `TIDB_CA_PATH` | `certs/tidb-ca-rozanhaisyam.pem` setelah CA resmi ditambahkan melalui GitHub |
| `TIDB_CA_CERT` | Kosongkan saat memakai file CA; alternatif berupa konten PEM environment |
| `SUPABASE_URL` | URL project penyedia identitas yang digunakan aplikasi |
| `SUPABASE_ANON_KEY` | Anon key project yang sama untuk verifikasi token server |
| `TIDB_ALLOW_GUEST_SYNC` | `false`; function juga memaksa aturan produksi meskipun salah konfigurasi menjadi `true` |

Jangan menyalin placeholder `<PASSWORD>` atau `<CA_PATH>` sebagai nilai nyata. Tidak perlu connection string `mysql://...` karena adapter membaca field `TIDB_*` secara terpisah; password yang mengandung simbol tidak perlu URL-encoding pada field environment ini.

### Scope build versus function

- Kredensial `TIDB_*` cukup di Functions scope; tidak perlu tersedia untuk browser build.
- `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`, jika fitur login dipakai, adalah konfigurasi publik **Builds** untuk frontend. Nilainya harus cocok dengan verifier server.
- `SUPABASE_SERVICE_ROLE_KEY` tidak diperlukan untuk jalur sinkronisasi ini.
- `VITE_SYNC_ENDPOINT` sudah memiliki default publik di `netlify.toml`.
- Jangan membuat `VITE_TIDB_PASSWORD`, `VITE_DATABASE_URL`, atau variabel secret lain berprefix `VITE_`.
- Jangan memberikan secrets produksi kepada deploy preview dari kontribusi/PR yang tidak tepercaya.

Setelah environment berubah, lakukan deploy baru agar konfigurasi runtime dan frontend yang relevan dipakai oleh deployment tersebut. Periksa versi runtime function pada dashboard/log; `NODE_VERSION=22` di repo menetapkan toolchain build, bukan bukti runtime sudah diverifikasi di akun Anda.

## 4. TLS dan sertifikat CA

Pilihan utama: biarkan `TIDB_CA_CERT` dan `TIDB_CA_PATH` kosong sehingga Node memakai trusted public CA store. Verifikasi hostname dan sertifikat tetap aktif (`rejectUnauthorized: true`, minimum TLS 1.2).

### Opsi pilihan: CA diunggah melalui GitHub

1. Ambil **CA publik resmi** yang direkomendasikan halaman Connect TiDB Cloud.
2. Di repository GitHub, pilih **Add file → Upload files** dan tempatkan file pada **`certs/tidb-ca-rozanhaisyam.pem`**. Jangan unggah client private key atau file `.env`.
3. Commit perubahan melalui branch/PR sesuai alur repository.
4. Di Netlify, set **`TIDB_CA_PATH=certs/tidb-ca-rozanhaisyam.pem`** untuk scope **Functions** dan context deploy yang dipakai.
5. Hapus/kosongkan `TIDB_CA_CERT`; dua sumber CA tidak boleh aktif bersamaan.
6. Deploy ulang commit yang berisi file CA. `netlify.toml` otomatis menyertakannya dalam bundle function, bukan `dist` frontend.
7. Uji koneksi database pada deployment tersebut. Upload file tanpa deploy ulang belum mengubah function yang sudah berjalan.

CA publik dari unggahan GitHub sudah tersedia di [`certs/tidb-ca-rozanhaisyam.pem`](../certs/tidb-ca-rozanhaisyam.pem), dengan petunjuk di [`certs/README.md`](../certs/README.md). Path CA lokal telah disiapkan; environment Netlify tetap harus diisi melalui dashboard dan diikuti deploy ulang. File yang hilang atau PEM tidak valid akan menggagalkan koneksi; verifikasi sertifikat tidak dinonaktifkan. Koneksi ke cluster TiDB asli belum diuji.

File harus berisi certificate PEM, bukan private key:

```text
-----BEGIN CERTIFICATE-----
...konten CA resmi dari TiDB Cloud...
-----END CERTIFICATE-----
```

Ini hanya contoh format; jangan menyimpannya sebagai file CA sungguhan. Adapter menolak PEM yang memuat blok private key, termasuk file gabungan certificate/key. Jangan mengandalkan pemeriksaan runtime ini untuk menjaga riwayat GitHub: secret tidak boleh di-commit sejak awal.

### Alternatif: PEM dari environment

Jika tidak ingin mengunggah CA publik ke GitHub, isi `TIDB_CA_CERT` dengan konten PEM dan kosongkan `TIDB_CA_PATH`. Nilai dapat berupa multiline atau literal `\n`; adapter menormalkannya. Jangan isi dua opsi sekaligus.

Path laptop seperti `C:\certs\ca.pem` atau `/home/user/ca.pem` tidak tersedia otomatis di Netlify. Gunakan path repository yang dibundel di atas, atau file runtime yang benar-benar ada. Jangan menonaktifkan TLS untuk mengatasi error sertifikat.

## 5. Identitas pengguna

Jalur produksi mensyaratkan bearer token valid. Server memverifikasi token ke penyedia identitas, lalu menentukan pemilik dari user ID hasil verifikasi. `userId` dalam body tidak dipercaya sebagai identitas.

- GET API tanpa body → `405`, membuktikan route mencapai function, **bukan** membuktikan koneksi DB.
- POST valid tanpa token → `401`, sesuai kebijakan produksi.
- Token tersedia tetapi verifier belum dikonfigurasi → `503`.
- DB/TLS/schema bermasalah → `503` tanpa membocorkan SQL/password.
- Sukses → `200` dengan `ok: true` dan `acceptedIds` setelah commit.

Function memaksa `NODE_ENV=production` untuk aturan identitas pada semua context Netlify, termasuk deploy preview. Guest sync hanya untuk server pengembangan lokal, bukan bypass autentikasi function.

**Prasyarat login:** abstraksi OAuth di baseline belum membuktikan login frontend sudah berfungsi di deployment. Pastikan SDK autentikasi dibundel dengan benar, Google OAuth aktif, dan redirect URL situs Netlify didaftarkan sebelum mengharapkan sinkronisasi produksi. Ini konfigurasi koneksi DB, bukan implementasi ulang login atau penyedia identitas baru.

## 6. Jaringan dan region

TiDB host yang diberikan berada di region `ap-southeast-1`. Pilih region function yang dekat jika tersedia pada paket/pengaturan Netlify, dan verifikasi pilihan pada dashboard; jangan mengasumsikan function otomatis ditempatkan di Singapura hanya dari hostname DB.

- Izinkan akses jaringan dari backend Netlify sesuai kebijakan TiDB Cloud.
- Outbound IP function dapat berubah. Jika cluster memerlukan IP allowlist tetap, gunakan fasilitas egress/IP tetap yang sesuai atau backend dengan IP tetap; jangan mengasumsikan satu IP deploy selalu berlaku.
- Jangan membuka akses global tanpa menilai kebutuhan dan kontrol keamanan. TLS serta kredensial tetap wajib.
- Pool tiga koneksi adalah per instance. Autoscaling dapat menambah total koneksi; sesuaikan concurrency/kapasitas cluster.

## 7. Deploy dan verifikasi

1. Isi environment Functions pada situs Netlify.
2. Inisialisasi skema di database aplikasi, terpisah dari build.
3. Deploy branch yang berisi konfigurasi ini lewat alur Netlify biasa.
4. Pastikan function `sync-progress` muncul di dashboard Functions.
5. Uji routing:

```bash
curl -i https://SITUS-ANDA.netlify.app/api/sync-progress
```

Harus berupa respons JSON `405` dengan header `Allow: POST`, bukan HTML SPA. Ini tes route saja.

6. Masuk aplikasi menggunakan **akun uji khusus** dengan token valid, selesaikan satu sesi, lalu periksa request POST pada Network panel.
7. Pastikan respons mempunyai `acceptedIds` dan record benar-benar muncul di `cs_profiles`, `cs_saves`, serta `cs_attempts`.
8. Ulangi pengiriman ID attempt yang sama; jangan sampai jumlah row bertambah dua.
9. Periksa snapshot JSON berisi badge/streak/daily, bukan hanya saldo XP/koin.
10. Uji gangguan DB: request gagal dan outbox tetap tersimpan.

Jangan mengirim snapshot kosong memakai akun asli untuk smoke test karena snapshot tersebut dapat mengganti save cloud. Tidak disediakan endpoint health publik yang membocorkan konfigurasi atau melakukan migrasi.

### Verifikasi lokal sebelum deploy

```bash
npm ci
npm run test:tidb
npm run test:netlify
npm run lint
npm run build
```

`test:netlify` memakai dependency tiruan untuk menguji parsing event Netlify, header bearer, base64, batas ukuran, aturan produksi, commit acknowledgement, dan kegagalan koneksi. Unit test serta build sukses tidak menggantikan tes koneksi cloud aktual.

## Indikator dan pemeriksaan koneksi

Hub/dashboard kini menyediakan status koneksi dan checklist environment yang bersumber dari `GET /api/database-status`. Endpoint memakai probe read-only dengan cache internal 30 detik, tanpa nilai secret atau data peserta. Status database terhubung tidak membuktikan login/penulisan sukses. Lihat [panduan verifikasi](VERIFIKASI-KONEKSI-DATABASE.md) untuk arti status, CLI, environment, dan batas keamanan.

## 8. Batasan yang tetap berlaku

- Ini backup/sinkronisasi **tulis**, belum alur restore save saat login atau sinkronisasi multi-perangkat lengkap.
- Skor berasal dari klien dan belum layak sebagai leaderboard terverifikasi.
- Outbox legacy belum sepenuhnya di-namespace per akun; hindari akun berganti-ganti di perangkat bersama sebelum migrasi terkait.
- TLS, verifikasi identitas, dan SQL parameterized tidak menggantikan rate limiting serta pengelolaan retensi.
- `.env` lokal tetap lokal dan diabaikan Git. Perubahan dokumen/config tidak otomatis memperbarui dashboard Netlify.

Lihat [panduan TiDB lengkap](TIDB-CLOUD-MYSQL.md) untuk skema, izin database, snapshot timestamp, migrasi dan troubleshooting tambahan.
