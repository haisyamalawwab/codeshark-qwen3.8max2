# 038 — Loading Aplikasi Kapten Shark & Serialisasi Dokumentasi Proyek

> Disimpan: 26-10-2026 16:00 WIB (+07).
> Branch kerja: `arena/5ef8fc4b-codeshark-qwen3-8max2`.
> Status saat catatan dibuat: perubahan tersimpan di working tree; belum commit dan belum dibuat PR baru.

---

## 1. Permintaan dan keputusan cakupan

Dua pekerjaan dicatat dalam dokumen ini:

1. Menyamarkan fase pengecekan koneksi database pada awal aplikasi menjadi layar loading aplikasi yang umum, dengan ikon utama Kapten Shark berputar pelan.
2. Menyimpan catatan pekerjaan dalam format nama:

   ```text
   NNN_namafile_DDMMYYYY_HHMM.md
   ```

   lalu memeriksa dokumentasi proyek yang belum mempunyai nomor seri dan datetime, memberi nama berdasarkan datetime pembuatan, dan menyesuaikannya ke format tersebut.

Keputusan cakupan serialisasi yang diterapkan:

- Seluruh dokumentasi proyek di root dipindah ke `docs/`, **kecuali** `README.md` root yang tetap di root agar tetap menjadi README utama repositori.
- Dokumentasi proyek yang sebelumnya sudah berada di `docs/*.md` ikut diserialisasi.
- Nomor seri **diurut ulang secara global** berdasarkan datetime pembuatan.
- `content/` tidak diubah sama sekali.
- README kanonis subfolder tidak direname:
  - `certs/README.md`
  - `docs/reference-images/README.md`
  - `src/assets/README.md`
  - `src/assets/badges/README.md`
- `certs/README.md` hanya diperbarui tautannya ke nama dokumen baru; nama file-nya tetap.

---

## 2. Pekerjaan loading aplikasi Kapten Shark

### 2.1 Komponen splash baru

Menambah `src/ui/BootLoading.tsx` sebagai layar loading awal aplikasi. Layar ini menampilkan:

- ikon utama Kapten Shark dari `CaptainAvatar`;
- ring loading;
- teks generik **“Memuat aplikasi…”**;
- subteks **“Menyiapkan pengalaman belajarmu.”**;
- bilah progres indeterminate.

Detail teknis seperti pengecekan TiDB Cloud/Aiven tidak ditampilkan pada splash pemain.

### 2.2 Animasi

Di `src/ui/ui.css` ditambahkan gaya `.boot-loading*`, termasuk:

- Kapten Shark berputar penuh 360° secara pelan dengan `animation: bootSpin 8s linear infinite`;
- ring luar berputar 5,5 detik per putaran;
- animasi titik dan progress bar;
- dukungan `prefers-reduced-motion: reduce` untuk mematikan animasi putaran/progres.

### 2.3 Gerbang boot aplikasi

`src/lib/siteSettings.tsx` diubah agar cabang sebelum `settings` dan `modeInfo` siap menampilkan `<BootLoading />`, bukan layar “Website / konten belum tersedia” dengan pesan teknis database.

Perilaku yang dijaga:

- konten aplikasi tidak dirender sebelum mode efektif dan konfigurasi awal selesai ditentukan;
- splash tampil minimum 650 ms pada boot non-lokal agar tidak berkedip;
- re-probe berkala 60 detik/fokus tidak mengosongkan aplikasi yang sudah terbuka;
- error paksa-cloud yang nyata tetap ditampilkan eksplisit melalui `Unavailable`;
- mode maintenance tetap ditampilkan eksplisit;
- tombol retry untuk error/maintenance kembali melewati splash loading.

Dokumentasi mode data yang relevan kini berada di `docs/036_mode-lokal_26102026_0819.md`.

### 2.4 Test loading

Menambah `tests/boot-loading.test.mjs` dan script:

```bash
npm run test:boot-loading
```

Test memastikan:

- splash memuat teks loading generik dan Kapten Shark;
- splash tidak mengekspos kata `database`, `TiDB`, `Aiven`, atau `belum tersedia`;
- provider memakai splash sampai mode/settings siap;
- pesan teknis lama sudah hilang dari provider;
- animasi Kapten Shark adalah rotasi penuh 8 detik;
- `prefers-reduced-motion` mematikan animasi tersebut.

Harness lama `tests/admin-setup.test.mjs` juga diberi loader `.webp`/`.png` karena rantai modul `siteSettings` sekarang sah memuat aset Kapten Shark melalui komponen splash. Perilaku admin tidak diubah.

---

## 3. Metode serialisasi dokumentasi

Format final:

```text
docs/NNN_slug_DDMMYYYY_HHMM.md
```

Sebanyak **37 dokumen lama** diproses:

- 25 dokumen dari root;
- 12 dokumen yang sebelumnya sudah berada di `docs/`.

Setelah dokumen ini ditambahkan, dokumentasi proyek tingkat atas di `docs/` menjadi serial **001–038**.

### 3.1 Sumber datetime

Datetime dipilih dengan hierarki bukti berikut:

1. Datetime yang sudah tertulis pada filename lama dan/atau metadata “Disimpan/Tanggal” di isi dokumen dipertahankan.
2. Bila isi dokumen mempunyai tanggal/jam eksplisit, nilai itu dipakai.
3. Bila filename lama hanya mempunyai tanggal, jam dilengkapi dari waktu commit Git pertama yang menambahkan file tersebut.
4. Bila tidak ada metadata internal yang cukup, dipakai author datetime commit Git pertama (`--follow --diff-filter=A`) yang dikonversi ke Asia/Bangkok/WIB.
5. Untuk dua dokumen tertua yang hanya mencatat tanggal 05-10-2026 tanpa jam, bagian jam ditulis `0000`. Nilai ini berarti **jam tidak tercatat**, bukan klaim pasti bahwa file dibuat tepat tengah malam.

Serial diberikan setelah seluruh dokumen dalam cakupan diurutkan berdasarkan datetime tersebut. Untuk datetime yang sama, urutan slug alfabetis dipakai sebagai tie-breaker deterministik.

### 3.2 Integritas rename

Rename dilakukan dua tahap melalui nama sementara unik untuk menghindari tabrakan nama. SHA-256 setiap file cocok tepat sebelum dan sesudah tahap rename. Setelah itu, sebagian isi memang sengaja diperbarui untuk memperbaiki referensi dan nomor serial judul.

### 3.3 Pemeliharaan referensi

Referensi nama/path lama diperbarui di luar `content/`:

- 39 file teks diperbarui;
- 31 referensi path penuh `docs/...` diganti;
- 91 referensi basename diganti;
- 4 tautan `../<dokumen-root-lama>` dari dokumen di `docs/` diperbaiki menjadi tautan dalam folder yang sama;
- 9 judul H1 yang memuat serial lama disesuaikan ke serial baru;
- 4 referensi pola serial lama diperbarui secara terarah.

Contoh area yang diperbarui: `README.md`, komentar kode/API/server, `.env.example`, `netlify.toml`, skrip cleanup Git, dokumen antardokumen, dan tautan dari `certs/README.md`.

Sebelum catatan 038 ini dibuat, pemindaian exact-string untuk seluruh path/basename lama di luar `content/`, `.cache/`, `dist/`, dan `node_modules/` menghasilkan **0 hit**. Nama lama yang muncul pada tabel pemetaan di bawah adalah pencatatan migrasi yang disengaja.

---

## 4. Peta rename dokumentasi lama

| Serial baru | Nama/path lama | Nama/path baru |
|---:|---|---|
| 001 | `ANALISIS.md` | `docs/001_analisis_05102026_0000.md` |
| 002 | `SPESIFIKASI-UIUX-v0.3.md` | `docs/002_spesifikasi-uiux-v0-3_05102026_0000.md` |
| 003 | `001_analisis-relevansi-md_06102026_0627.md` | `docs/003_analisis-relevansi-md_06102026_0627.md` |
| 004 | `002_improvement-home-hud_06102026_1809.md` | `docs/004_improvement-home-hud_06102026_1809.md` |
| 005 | `002_perbaikan-ikan-aset-png_06102026_1809.md` | `docs/005_perbaikan-ikan-aset-png_06102026_1809.md` |
| 006 | `ANALISIS-v0.4.md` | `docs/006_analisis-v0-4_13102026_1343.md` |
| 007 | `KURIKULUM-QUEST-16-PERTEMUAN.md` | `docs/007_kurikulum-quest-16-pertemuan_13102026_1343.md` |
| 008 | `003_konteks-memory_13102026_1714.md` | `docs/008_konteks-memory_13102026_1714.md` |
| 009 | `003_konteks-tower-subgame_13102026_1714.md` | `docs/009_konteks-tower-subgame_13102026_1714.md` |
| 010 | `004_framework-tower-dnd-matter-fix-countdown_13102026_1715.md` | `docs/010_framework-tower-dnd-matter-fix-countdown_13102026_1715.md` |
| 011 | `MASTER-PROMPT-GAMIFIKASI-EDUKASI.md` | `docs/011_master-prompt-gamifikasi-edukasi_13102026_1954.md` |
| 012 | `009_gitignore-fix_13102026_2115.md` | `docs/012_gitignore-fix_13102026_2115.md` |
| 013 | `010_fix-error-4058_13102026_2120.md` | `docs/013_fix-error-4058_13102026_2120.md` |
| 014 | `SESSION-SUMMARY-13102026.md` | `docs/014_session-summary_13102026_2130.md` |
| 015 | `011_install-recharts-fix-build_13102026_2145.md` | `docs/015_install-recharts-fix-build_13102026_2145.md` |
| 016 | `005_optimasi-grafis-gambar_14102026.md` | `docs/016_optimasi-grafis-gambar_14102026_0654.md` |
| 017 | `PETA-PERTEMUAN-16.md` | `docs/017_peta-pertemuan-16_14102026_1917.md` |
| 018 | `005_build-warning-pwa-chunk_15102026.md` | `docs/018_build-warning-pwa-chunk_15102026_2027.md` |
| 019 | `006_sprite-isolated-hud-map_15102026.md` | `docs/019_sprite-isolated-hud-map_15102026_2038.md` |
| 020 | `007_analisis-hud-uiux_15102026_2042.md` | `docs/020_analisis-hud-uiux_15102026_2042.md` |
| 021 | `008_revisi-hud-uiux_15102026_2056.md` | `docs/021_revisi-hud-uiux_15102026_2056.md` |
| 022 | `009_reorganisasi-aset-gambar_15102026_2109.md` | `docs/022_reorganisasi-aset-gambar_15102026_2109.md` |
| 023 | `PANDUAN-SHARKTYPER.md` | `docs/023_panduan-sharktyper_15102026_2126.md` |
| 024 | `.gitignore-README.md` | `docs/024_gitignore-readme_16102026_1039.md` |
| 025 | `TECH-STACK.md` | `docs/025_tech-stack_17102026_2214.md` |
| 026 | `docs/ANALISIS-SURVEI-MATERI-HTML-CSS-JS.md` | `docs/026_analisis-survei-materi-html-css-js_22102026_0656.md` |
| 027 | `docs/MASTER-PROMPT-PEMBELAJARAN-HTML-CSS-JS-GAMIFIKASI.md` | `docs/027_master-prompt-pembelajaran-html-css-js-gamifikasi_22102026_0725.md` |
| 028 | `docs/NETLIFY-TIDB-CLOUD.md` | `docs/028_netlify-tidb-cloud_23102026_1913.md` |
| 029 | `docs/TIDB-CLOUD-MYSQL.md` | `docs/029_tidb-cloud-mysql_23102026_1913.md` |
| 030 | `docs/ADMIN-SETTINGS.md` | `docs/030_admin-settings_23102026_2016.md` |
| 031 | `docs/HASIL-TEST-KONEKSI-WORKSPACE-2026-10-23.md` | `docs/031_hasil-test-koneksi-workspace_23102026_2016.md` |
| 032 | `docs/VERIFIKASI-KONEKSI-DATABASE.md` | `docs/032_verifikasi-koneksi-database_23102026_2016.md` |
| 033 | `docs/SUPABASE-AUTH.md` | `docs/033_supabase-auth_23102026_2042.md` |
| 034 | `docs/BETTER-AUTH-LAYERBASE.md` | `docs/034_better-auth-layerbase_26102026_0819.md` |
| 035 | `docs/DEPLOY-NETLIFY-VERCEL.md` | `docs/035_deploy-netlify-vercel_26102026_0819.md` |
| 036 | `docs/MODE-LOKAL.md` | `docs/036_mode-lokal_26102026_0819.md` |
| 037 | `docs/RINGKASAN-PEKERJAAN.md` | `docs/037_ringkasan-pekerjaan_26102026_0819.md` |
| 038 | — | `docs/038_loading-aplikasi-kapten-shark-dan-serialisasi-dokumentasi_26102026_1600.md` |

---

## 5. Kondisi akhir struktur Markdown dalam cakupan

- Markdown di root sekarang hanya `README.md`.
- Seluruh `docs/*.md` tingkat atas mengikuti pola `NNN_slug_DDMMYYYY_HHMM.md` dan berurutan 001–038.
- `docs/reference-images/README.md` tetap dipertahankan sebagai README folder.
- Tidak ada perubahan Git pada `content/`; ke-54 file materi dan import aplikasinya tidak disentuh oleh pekerjaan serialisasi ini.
- File non-Markdown tidak direname karena cakupan yang diklarifikasi adalah dokumentasi proyek.

---

## 6. Verifikasi

Verifikasi pascarename dan pascaimplementasi loading dijalankan sebelum catatan ini ditambahkan:

```bash
npm run lint
npm run test:boot-loading
npm run test:admin-setup
node --test tests/*.test.mjs
npm run build
git diff --check
```

Hasil:

- TypeScript/lint: **lolos**;
- test boot loading: **3/3 lolos**;
- test admin setup: **7/7 lolos**;
- seluruh test Node: **95/95 lolos**;
- production build Vite/PWA: **lolos**;
- `git diff --check`: **lolos**;
- audit nama: tidak ada `docs/*.md` tingkat atas yang menyimpang dari pola serial.

Batasan bukti runtime yang tetap berlaku:

- tidak ada screenshot browser karena Chromium tidak tersedia di sandbox;
- workspace tidak mempunyai kredensial cloud live untuk membuktikan koneksi TiDB/Aiven/Layerbase secara langsung;
- pemeriksaan runtime lokal sebelumnya menghasilkan keputusan mode lokal karena environment cloud tidak terkonfigurasi. Hasil test/build tidak boleh dibaca sebagai bukti koneksi hosted live.

---

## 7. Status lanjutan

Pekerjaan pada catatan ini belum di-commit dan belum dibuat pull request baru. Langkah Git berikutnya, bila diminta, adalah meninjau diff rename/referensi, commit pada branch aktif yang sama, lalu membuka PR dari branch tersebut.
