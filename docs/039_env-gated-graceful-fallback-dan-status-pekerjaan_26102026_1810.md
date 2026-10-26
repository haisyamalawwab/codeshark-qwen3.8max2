# 039 — Env-Gated Graceful Fallback & Status Pekerjaan Tersimpan

> Disimpan: 26-10-2026 18:10 WIB (+07).
> Branch kerja: `arena/5ef8fc4b-codeshark-qwen3-8max2` (aktif).
> HEAD saat catatan dibuat: `0eac572` — Merge pull request #1.
> Status: checkpoint working tree; **belum commit, belum push, belum ada PR baru** untuk perubahan setelah PR #1.

---

## 1. Tujuan catatan

Dokumen ini adalah checkpoint atas pekerjaan yang sudah dilakukan sampai 26-10-2026 18:10 WIB, sekaligus pencatatan keputusan arsitektur terbaru tentang perilaku aplikasi bila variabel environment suatu fungsi tidak terdeteksi.

Catatan ini melanjutkan:

- `docs/034_better-auth-layerbase_26102026_0819.md` — Better Auth + Layerbase MariaDB.
- `docs/036_mode-lokal_26102026_0819.md` — mode data `auto | local | cloud`.
- `docs/038_loading-aplikasi-kapten-shark-dan-serialisasi-dokumentasi_26102026_1600.md` — splash loading Kapten Shark dan serialisasi dokumentasi 001–038.

Dokumen ini menjadi serial **039**, sehingga dokumentasi proyek tingkat atas di `docs/` kini berurutan **001–039**.

Prinsip penulisan catatan ini: **evidence-based, tanpa overclaim**. Yang hanya terbukti dari kode/test dicatat sebagai bukti kode/test. Koneksi hosted live tidak diklaim berhasil bila kredensial live tidak tersedia di workspace.

---

## 2. Status repository saat checkpoint dibuat

Hasil pemeriksaan sebelum dokumen 039 ini ditambahkan:

- Branch aktif: `arena/5ef8fc4b-codeshark-qwen3-8max2`.
- HEAD: `0eac572` (merge PR #1).
- `git status --porcelain` teragregasi: **37 deleted, 20 modified, 40 untracked**.
  - 37 *deleted* adalah path dokumen lama yang direname pada serialisasi dokumentasi.
  - 40 *untracked* adalah 38 dokumen serial baru di `docs/001…038`, ditambah `src/ui/BootLoading.tsx` dan `tests/boot-loading.test.mjs`.
  - 20 *modified* meliputi antara lain `.env.example`, `README.md`, `api/admin-settings.mjs`, `api/admin-setup.mjs`, `api/database-status.mjs`, `api/site-settings.mjs`, `certs/README.md`, `cleanup-git.ps1`, `cleanup-git.sh`, `db/sqlite-schema.sql`, `netlify.toml`, `package.json`, `scripts/test-settings-browser.mjs`, `server/database-status.mjs`, `server/local-mode.mjs`, `src/admin/AdminDiagnostics.tsx`, `src/lib/featureFlags.ts`, `src/lib/siteSettings.tsx`, `src/ui/ui.css`, dan `tests/admin-setup.test.mjs`.
- Markdown di root hanya `README.md`.
- Folder `content/` tidak diubah oleh pekerjaan serialisasi.
- Pemeriksaan `ls .env` pada sandbox menghasilkan **tidak ada file `.env`**. Karena itu tidak ada kredensial Layerbase/TiDB/Aiven/Supabase live yang dapat dipakai untuk membuktikan koneksi hosted pada saat checkpoint ini dibuat.

Setelah dokumen ini ditambahkan, jumlah file untracked bertambah satu (dokumen 039 ini sendiri).

---

## 3. Pekerjaan yang sudah dilakukan dan tersimpan di working tree

### 3.1 Splash loading aplikasi Kapten Shark

Sudah diterapkan di working tree (detail lengkap di dokumen 038):

- Komponen baru `src/ui/BootLoading.tsx` menampilkan Kapten Shark, teks generik “Memuat aplikasi…”, subteks penyiapan pengalaman belajar, ring, dan progress bar. Istilah teknis database tidak ditampilkan ke pemain.
- `src/ui/ui.css` memberi animasi rotasi penuh Kapten Shark 8 detik (`bootSpin`), ring luar 5,5 detik, animasi titik/progres, clipping lingkaran agar latar hitam persegi aset tidak terlihat berputar, dan dukungan `prefers-reduced-motion: reduce`.
- `src/lib/siteSettings.tsx` menampilkan `<BootLoading />` selama `settings`, `modeInfo`, atau ambang tampil minimum 650 ms (`BOOT_MIN_DISPLAY_MS`) belum siap. Konten anak tidak dirender sebelum mode efektif dan konfigurasi awal selesai ditentukan.
- Error paksa-cloud yang nyata dan status maintenance tetap ditampilkan eksplisit lewat `Unavailable`; retry kembali melewati splash.
- Re-probe berkala 60 detik dan saat fokus jendela tidak mengosongkan aplikasi yang sudah termuat.
- Test baru `tests/boot-loading.test.mjs` dan script `npm run test:boot-loading` ditambahkan.

Hasil verifikasi yang sudah dicatat pada dokumen 038 (sebelum checkpoint ini): lint lolos, `test:boot-loading` 3/3, `test:admin-setup` 7/7, seluruh test Node 95/95, production build lolos, `git diff --check` lolos. Hasil tersebut perlu dijalankan ulang sebelum commit karena working tree harus diverifikasi kembali pada keadaan final.

### 3.2 Serialisasi dokumentasi proyek

Sudah diterapkan di working tree (peta rename lengkap di dokumen 038):

- Format nama final: `docs/NNN_slug_DDMMYYYY_HHMM.md`.
- 37 dokumen lama (25 dari root, 12 dari `docs/`) diurut ulang secara global menjadi serial 001–037 berdasarkan datetime pembuatan dari metadata internal/filename lama/riwayat Git; dokumen loading menjadi 038; dokumen ini menjadi 039.
- Root hanya menyisakan `README.md`.
- README kanonis subfolder tidak direname.
- Referensi path/basename lama di luar `content/` diperbarui.
- `content/` tidak disentuh.

### 3.3 Audit Better Auth via Layerbase Cloud

Audit kode terhadap snippet Better Auth + Layerbase yang diberikan pengguna sudah dilakukan. Kesimpulan bukti kode:

- `package.json` memuat `better-auth@^1.7.13`, `mysql2`, dan script `auth:verify`, `auth:generate`, `auth:migrate`, `auth:check`, `auth:create-admin`, serta `test:better-auth`.
- `server/better-auth.mjs` memakai `betterAuth()` dengan pool `mysql2/promise`, email/password aktif, plugin `admin()`, base path `/api/auth`, dan prioritas URL database `AUTH_DATABASE_URL → BETTER_AUTH_DATABASE_URL → DATABASE_URL`.
- `src/lib/auth-client.ts` memakai `createAuthClient` dari `better-auth/react` dengan `adminClient()`. Default same-origin ke `/api/auth/*`; `VITE_BETTER_AUTH_URL` hanya bila API auth sengaja di origin lain. Pemakaian React client ini disengaja agar `useSession` tersedia; perilaku `signUp.email`/`signIn.email` sama dengan snippet.
- Route tersedia untuk Vercel (`api/auth/[...all].mjs`), Netlify (`netlify/functions/auth.mjs`), dan dev API lokal.
- Bila konfigurasi Better Auth tidak lengkap, `server/better-auth.mjs` mengembalikan null dari pembuat instance dan handler menjawab 503 aman (`better_auth_not_configured`) tanpa membocorkan detail kredensial.

Batasan bukti yang wajib dipertahankan:

- Endpoint HTTPS Layerbase `POST https://sage.cloud.layerbase.dev/v1/databases/fec43538-d0fa-4fd0-a08e-f4f541d10a2e/query` adalah API query Layerbase, **bukan** connection string `mysql://` untuk `mysql2`/Better Auth. Endpoint itu tidak boleh dimasukkan ke `DATABASE_URL`.
- Runtime aplikasi saat ini tidak mengonsumsi `LAYERBASE_API_URL`, `LAYERBASE_API_KEY`, atau `LAYERBASE_DATABASE_ID` untuk Better Auth.
- Better Auth tetap membutuhkan connection string MariaDB dari panel Connect Layerbase sebagai `DATABASE_URL` atau yang diutamakan `AUTH_DATABASE_URL`, ditambah `BETTER_AUTH_SECRET` dan `BETTER_AUTH_URL`.
- Karena workspace tidak memiliki `.env`, koneksi live Layerbase, migrasi skema hosted, sign-up live, dan sign-in live **belum terbukti**. Tidak ada file yang diubah pada audit terakhir tersebut.
- Secret/token tidak boleh dikirim lewat chat; isi hanya di `.env` lokal atau secret environment Netlify/Vercel.

### 3.4 Eksplorasi gamifikasi per-MK (masih jeda, belum implementasi)

Permintaan gamifikasi berdasarkan `docs/011_master-prompt-gamifikasi-edukasi_13102026_1954.md` untuk MK Lintas Platform, RPL, dan Pemrograman Web sudah dieksplorasi, tetapi **belum diimplementasikan**. Temuan eksplorasi:

- `ci_backend` dan `py_backend` adalah pola acuan MK Sistem Aplikasi Web Backend Dasar.
- `crossplatform` adalah MK Sistem Aplikasi Lintas Platform.
- `tower` dan `shark` adalah mode latihan yang memakai kurikulum web 16 pertemuan.
- Belum ada MK/halaman/konten RPL di repository.
- Achievement saat ini masih global (`src/lib/achievements.ts` membaca metrik global `SaveData`; klaim tersimpan di `save.claimedAchievements`), sehingga isolasi per-MK membutuhkan desain identitas/progres/definisi/klaim per-MK, bukan sekadar mengganti label.

Bagian ini dicatat agar tidak hilang; bukan klaim pekerjaan selesai.

---

## 4. Keputusan arsitektur terbaru: nama mekanisme

Mekanisme yang diminta pengguna diberi nama:

### **Env-Gated Capability Detection with Graceful Fallback**

Nama internal singkat: **Env-Gated Graceful Fallback**.

Terjemahan kerja: *Deteksi Kapabilitas Berbasis Environment dengan Fallback yang Anggun*.

Mekanisme ini terdiri dari tiga bagian:

1. **Env-Gated Feature** — setiap fungsi hanya boleh aktif bila environment variable yang menjadi syaratnya terdeteksi dan valid.
2. **Runtime Capability Probing** — pada fase loading, sistem mengecek keberadaan env, koneksi database, kesiapan skema, dan kesiapan authentication sebelum fungsi terkait diaktifkan.
3. **Graceful Degradation / Fail-Soft Fallback** — bila env tidak ada atau koneksi gagal, fungsi tersebut dilewati/nonaktif tanpa memblokir aplikasi; aplikasi turun ke fallback lokal.

Istilah ini lebih tepat daripada sekadar *feature flag*, karena status fungsi tidak ditentukan oleh saklar manual, melainkan diturunkan dari keberadaan env dan hasil probe kesiapan layanan. Mekanisme ini juga bukan *circuit breaker* murni; circuit breaker dapat menjadi pelengkap di kemudian hari untuk kegagalan berulang saat runtime.

Aturan keputusan yang disepakati:

- Env tidak terdeteksi untuk fungsi tertentu ⇒ fungsi itu **diskip**, berstatus tidak terkonfigurasi/nonaktif, dan tidak boleh melempar error yang menghentikan boot.
- Pengecekan env, database, dan authentication terjadi pada fase loading di balik splash generik Kapten Shark.
- Konten utama dirender setelah kapabilitas awal diputuskan.
- Fallback akhir adalah mode lokal: `localStorage` sebagai penyimpanan utama runtime lokal, backup/ekspor SQLite (sql.js), dan profil tamu untuk identitas.

---

## 5. Matriks env-gating per fungsi

Status pada kolom terakhir membedakan kondisi kode saat checkpoint dibuat. Baris bertanda **perlu pengetatan** adalah pekerjaan lanjutan, bukan kondisi selesai.

| Fungsi | Env penentu | Bila tidak terdeteksi / tidak valid | Fallback | Bukti/status kode saat ini |
|---|---|---|---|---|
| Database game TiDB | `TIDB_HOST`, `TIDB_USER`, `TIDB_PASSWORD`, `TIDB_DATABASE` (opsional `TIDB_PORT`, CA) | Provider TiDB dilewati; tidak membuka koneksi | Coba Aiven; bila tidak siap juga, mode lokal | **Sudah ada**: `inspectTidb()` di `server/database-status.mjs` mengembalikan `disabled`/`env_incomplete` sebelum pool dipakai |
| Database game Aiven | `AIVEN_DATABASE_URL` / `GAME_DATABASE_URL` / `NETLIFY_DATABASE_URL` | Provider Aiven tidak dianggap siap | Coba TiDB; bila tidak siap juga, mode lokal | **Sudah ada pada jalur probe**: URL dibaca di `server/aiven.mjs`; hasil probe digabungkan di `server/database-status.mjs`. `DATABASE_URL` MySQL/MariaDB milik Better Auth tidak dipakai sebagai Aiven MySQL |
| Better Auth (server) | `AUTH_DATABASE_URL`/`BETTER_AUTH_DATABASE_URL`/`DATABASE_URL` berawalan `mysql://`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | Instance auth tidak dibuat; `/api/auth/*` menjawab 503 aman | Profil tamu/lokal | **Sudah ada**: `isBetterAuthConfigured()`/`betterAuthMissingConfig()` di `server/better-auth.mjs`; laporan publik membawa `auth.betterAuthConfigured` dari `server/database-status.mjs` |
| Better Auth (browser) | Hasil `betterAuthConfigured` dari probe loading; opsional `VITE_BETTER_AUTH_URL` | `getSession`, `signIn`, `signUp`, `signOut` Better Auth tidak dipanggil; UI login email nonaktif/tersembunyi | Profil tamu/lokal | **Perlu pengetatan**: `isBetterAuthEnabled()` di `src/lib/featureFlags.ts` saat ini hanya memeriksa `CONFIGURED_MODE !== "local"`, sehingga pada mode `auto` klien masih dapat dimuat dan `currentBetterAuthUser()` masih memanggil `getSession()` sebelum kapabilitas server diketahui. Keputusan probe harus diteruskan ke flag browser |
| Supabase Google Auth (legacy) | `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`/`VITE_SUPABASE_ANON_KEY` | SDK Supabase tidak dimuat; login Google nonaktif | Profil tamu/lokal atau Better Auth bila siap | **Sudah ada**: `getSupabase()` di `src/lib/supabaseClient.ts` mengembalikan `null` bila auth cloud nonaktif atau `authConfig(..., 'VITE_')` kosong |
| Redis cache | `UPSTASH_REDIS_REST_URL`+`UPSTASH_REDIS_REST_TOKEN` atau `REDIS_URL`/`AIVEN_REDIS_URL`/`VALKEY_URL` | Cache dilewati; bukan kegagalan aplikasi | Jalur database/lokal langsung | **Sudah ada**: probe Redis di `server/redis.mjs` mengembalikan `not_configured` bila konfigurasi kosong |
| Sinkronisasi progres cloud | Database game siap **dan** identitas siap | Sinkronisasi tidak dipaksa | Progres tetap lokal | **Sebagian besar sudah digerbang** oleh mode efektif (`isCloudSyncEnabled()` mengikuti mode cloud) dan `syncPrerequisitesReady` pada laporan status; tetap verifikasi ulang saat pengetatan browser auth |
| Halaman admin diagnostik | Build paksa cloud dan tidak dimatikan (`VITE_DATA_MODE=cloud`, `VITE_ADMIN_ENABLED` bukan `false`) | Entry admin nonaktif/tidak dibangun | Aplikasi pemain normal | **Sudah ada**: konstanta `ADMIN_ENABLED` di `src/lib/featureFlags.ts` |
| Paksa lokal server | `DATA_MODE=local` | Endpoint cloud menjawab 503 mode lokal tanpa meraba kredensial | Mode lokal penuh | **Sudah ada**: `server/local-mode.mjs` (`serverMode()`, `cloudDisabledBody()`) |

Catatan tambahan yang harus dijaga:

- Laporan `/api/database-status` hanya membawa status konfigurasi aman (nama env dan status `set/missing/optional/default/invalid`), bukan nilai secret.
- Perbedaan “env tidak ada” dan “env ada tetapi koneksi/skema gagal” tetap dipertahankan pada status provider (`disabled`/`env_incomplete`/`config_invalid` vs `connection_failed`/`schema_missing`/`timeout`), tetapi pada mode `auto` keduanya berujung fallback lokal.
- Perilaku paksa-cloud saat ini masih memperlakukan kegagalan membaca konfigurasi cloud sebagai error eksplisit (`src/lib/siteSettings.tsx` menetapkan cloud TiDB lalu membaca settings cloud tanpa fallback). Bila aturan “env tidak ada ⇒ fungsi diskip dan fallback” hendak diterapkan juga pada mode paksa-cloud, cabang ini harus ditinjau dan diubah secara eksplisit; pada checkpoint ini perubahan itu **belum dilakukan**.

---

## 6. Alur loading yang disepakati

Alur target pada fase boot:

1. Tampilkan splash generik Kapten Shark (`BootLoading`).
2. Bila `VITE_DATA_MODE=local`: lewati seluruh probe cloud/auth; tetapkan lokal + tamu.
3. Bila mode `auto`: panggil `/api/database-status`; server memeriksa per fungsi:
   - env TiDB lengkap? bila tidak, TiDB diskip; bila ya, tes koneksi + skema;
   - env Aiven ada? bila tidak, Aiven diskip; bila ya, tes koneksi + skema;
   - env Better Auth lengkap? tentukan `betterAuthConfigured`;
   - env Supabase server lengkap? tentukan `supabaseConfigured`;
   - Redis hanya cache opsional dan tidak menentukan hidup/matinya aplikasi.
4. Provider database pertama yang benar-benar `connected` dan skemanya siap memenangkan mode cloud. Bila tidak ada, keputusan menjadi lokal.
5. Kapabilitas auth browser ditetapkan dari hasil probe sebelum komponen akun dirender/dipakai, sehingga fungsi auth yang tidak terkonfigurasi tidak dipanggil sama sekali.
6. Render konten setelah mode efektif, settings, dan kapabilitas auth diputuskan. Re-probe 60 detik/fokus hanya memperbarui kapabilitas tanpa mengosongkan aplikasi yang sudah terbuka.

Langkah 5 adalah pengetatan lanjutan yang tercatat pada Bagian 5; langkah 1–4 dan 6 sesuai struktur provider yang sudah ada, dengan catatan paksa-cloud pada Bagian 5.

---

## 7. Yang belum dilakukan / belum terbukti

Daftar berikut sengaja eksplisit agar checkpoint tidak dibaca sebagai klaim selesai:

1. **Pengetatan Better Auth browser** berdasarkan `auth.betterAuthConfigured` dari laporan loading: meneruskan kapabilitas ke `featureFlags`, mencegah dynamic import/`getSession`/`signIn`/`signUp` bila tidak terkonfigurasi, dan menyesuaikan UI onboarding/akun.
2. **Keputusan akhir paksa-cloud** bila env fungsi tidak ada: tetap error eksplisit seperti sekarang, atau ikut fallback sesuai aturan Env-Gated Graceful Fallback. Belum diubah pada checkpoint ini.
3. **Koneksi live Layerbase**: belum ada `.env`, sehingga `npm run auth:check`, migrasi hosted, `npm run auth:verify`, dan uji sign-up/sign-in/banned-user live belum dijalankan terhadap database Layerbase nyata.
4. **Gamifikasi per-MK**: baru eksplorasi. RPL belum ada; achievement/progres masih global.
5. **Verifikasi ulang final**: lint, seluruh test, build, dan `git diff --check` perlu dijalankan ulang pada keadaan working tree final sebelum commit.
6. **Git**: belum staging, commit, push, atau PR baru untuk perubahan setelah PR #1.

---

## 8. Langkah berikutnya yang disarankan

Urutan kerja lanjutan dari checkpoint ini:

1. Terapkan pengetatan kapabilitas Better Auth browser dari hasil probe loading, termasuk test regresi bahwa tidak ada pemanggilan sesi Better Auth saat `betterAuthConfigured=false`.
2. Putuskan dan terapkan perilaku paksa-cloud terhadap env yang hilang, lalu sesuaikan test data-mode.
3. Jalankan ulang lint, test terarah (`test:boot-loading`, `test:data-mode`, `test:better-auth`, `test:admin-setup`), seluruh test Node, build, dan `git diff --check`.
4. Untuk pembuktian live Layerbase di lingkungan pemilik kredensial: isi env server secara lokal/hosting (bukan lewat chat), jalankan `npm run auth:check`; bila skema belum Apply/migrasi, jalankan migrasi Better Auth; lalu `npm run auth:verify` dan uji sign-up/sign-in nyata melalui web + dev API/hosting.
5. Tinjau diff secara sadar, staging file yang memang dimaksudkan, commit pada branch aktif yang sama, push ke `arena/5ef8fc4b-codeshark-qwen3-8max2`, lalu buka PR ke `main` dan verifikasi dengan `gh pr view`.
6. Lanjutkan gamifikasi per-MK sebagai pekerjaan terpisah setelah desain isolasi progres/achievement per-MK dan kebutuhan MK RPL diputuskan.

---

## 9. File kunci untuk melanjutkan pekerjaan

| File | Peran |
|---|---|
| `src/ui/BootLoading.tsx` | Splash loading generik Kapten Shark |
| `src/lib/siteSettings.tsx` | Gerbang boot, probe awal/re-probe, keputusan mode efektif, minimum tampil splash |
| `src/lib/featureFlags.ts` | Mode terkonfigurasi/efektif dan gerbang `isBetterAuthEnabled()` yang perlu diketatkan |
| `src/lib/databaseStatus.ts` | Tipe laporan status browser, termasuk `auth.betterAuthConfigured` |
| `server/database-status.mjs` | Probe per-provider dan keputusan `cloudReady`/provider efektif |
| `server/better-auth.mjs` | Konfigurasi, pool mysql2, instance, dan handler Better Auth server |
| `src/lib/auth.ts` | Fasade auth browser; jalur `currentBetterAuthUser()`/`signIn`/`signUp` |
| `src/lib/auth-client.ts` | `createAuthClient` + `adminClient()` |
| `src/lib/supabaseClient.ts` | Lazy-load Supabase hanya bila mode/env memungkinkan |
| `server/redis.mjs` | Cache opsional; `not_configured` bila env Redis kosong |
| `server/local-mode.mjs` | Gerbang paksa lokal server `DATA_MODE` |
| `docs/034_better-auth-layerbase_26102026_0819.md` | Panduan Better Auth + Layerbase |
| `docs/036_mode-lokal_26102026_0819.md` | Dokumentasi mode data |
| `docs/038_loading-aplikasi-kapten-shark-dan-serialisasi-dokumentasi_26102026_1600.md` | Detail loading dan peta rename serialisasi |
