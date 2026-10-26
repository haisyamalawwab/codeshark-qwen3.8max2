# 041 — Pengarsipan & Pelepasan Modul Cross Platform

> Pengarsipan: 26-10-2026 20:07 WIB (+07); catatan dilengkapi setelah verifikasi pada hari yang sama.
> Branch kerja: `arena/b6418061-codeshark-qwen3-8max2`.
> Basis kode: `a075d08` (merge PR #22).
> Status saat catatan ditulis: perubahan berada di working tree dan belum di-commit atau diajukan sebagai PR.

---

## 1. Permintaan dan cakupan

Modul **Cross Platform / CrossPlatform Studio — MK Sistem Aplikasi Lintas Platform (React Native & Expo)** diminta untuk:

1. disembunyikan dari aplikasi;
2. diarsipkan dalam ZIP;
3. dilepas dari aplikasi beserta seluruh material di dalamnya;
4. dihapus juga dari seluruh navigasi aplikasi.

Cakupan “navigasi” diterapkan menyeluruh, meliputi kartu dan tautan header hub, pemilih arena Dashboard/App, tab dalam layar game, label entry terkunci, parameter `?subgame=crossplatform`, entry mandiri `/crossplatform/`, rewrite hosting, PWA fallback, dan service worker subpath.

Sesudah pekerjaan ini, sub-game aktif hanya **Coding Tower (`tower`)** dan **CodeShark (`shark`)**.

---

## 2. Arsip ZIP

Arsip dibuat dan diverifikasi sebelum satu pun file modul dihapus:

```text
arsip/cross-platform_26102026_2007.zip
```

Properti arsip:

- 42 file entries;
- ukuran terkompresi sekitar 153 KB;
- total ukuran tidak terkompresi 497.473 byte;
- SHA-256: `f105f8f867b479c9e239f14b2bdae6185aed3f04a5eb4981d62dd18059de6d77`;
- uji integritas ZIP: tidak ada file rusak;
- 41 file sumber/snapshot terbukti byte-identik dengan file aslinya sebelum pelepasan; file ke-42 adalah `README-ARSIP.md` yang disiapkan khusus di dalam paket.

| Kelompok | Jumlah | Isi |
|---|---:|---|
| Modul inti | 24 | Entry HTML/React, lab, simulator HP, HUD, kurikulum, loader Markdown, katalog figur SVG, dan 16 materi `content/crossplatform` |
| Snapshot integrasi/navigasi | 17 | App, Hub, registry sub-game, registry figur, artwork, icons, admin settings, settings bersama, PWA register, meta, Vite, Vercel, Netlify, smoke-test browser, dan test settings sebelum pelepasan |
| Manifes | 1 | `README-ARSIP.md` berisi isi arsip, kompatibilitas data, dan prosedur restore |

Folder `arsip/` tidak termasuk entry Vite/PWA, sehingga ZIP tidak masuk ke bundle aplikasi.

---

## 3. File modul yang dilepas

Sebanyak 24 file inti dihapus dari working tree:

- `crossplatform/index.html`
- `src/crossplatform/main.tsx`
- `src/games/crossplatform/CrossPlatformLab.tsx`
- `src/games/crossplatform/CrossPlatformPhoneSimulator.tsx`
- `src/ui/CrossPlatformHud.tsx`
- `src/data/crossPlatformCurriculum.ts`
- `src/data/materiCrossPlatform.ts`
- `src/lib/crossPlatformFigures.tsx`
- `content/crossplatform/01-...` sampai `16-...` (16 file materi)

Folder berikut tidak lagi ada:

- `crossplatform/`
- `src/crossplatform/`
- `src/games/crossplatform/`
- `content/crossplatform/`

Isi `content/` yang tersisa hanya materi `html`.

---

## 4. Navigasi dan integrasi yang dibersihkan

Perubahan integrasi diterapkan pada 17 file:

| File | Pelepasan |
|---|---|
| `src/data/subgames.ts` | Id/mode/katalog/urutan/whitelist `crossplatform` dihapus; `SubGameId` menjadi `tower | shark` |
| `src/App.tsx` | Import HUD/lab, parameter `?subgame=crossplatform`, cabang dashboard HUD, cabang game lab, label entry terkunci, dan tab CrossPlatform dihapus |
| `src/hub/HubApp.tsx` | Kartu CrossPlatform Studio, tautan header “React Native”, dan chip hero React Native & Expo dihapus |
| `src/lib/figures.tsx` | Katalog `CROSS_PLATFORM_FIGURES` dilepas; `getFigure()` hanya membaca katalog web |
| `src/ui/SubGameArtwork.tsx` | ID dan artwork HP/atom React Native dihapus |
| `src/ui/icons.tsx` | `IconMobile` yang tidak lagi mempunyai pemakai dihapus |
| `src/admin/AdminSettings.tsx` | Label toggle CrossPlatform Studio dihapus |
| `shared/site-settings.mjs` | `GAME_IDS` menjadi `tower/shark`; `crossplatform` ditambahkan ke `RETIRED_GAME_IDS` |
| `shared/site-settings.d.mts` | Tipe `GameId` dipersempit menjadi `tower | shark` |
| `src/pwa-register.ts` | Subpath `crossplatform` dihapus dari deteksi folder sub-game |
| `vite.config.ts` | Entry build `crossplatform/index.html` dan PWA fallback `/crossplatform/` dihapus |
| `vercel.json` | Rewrite `/crossplatform/(.*)` dihapus |
| `netlify.toml` | Redirect SPA `/crossplatform/*` dihapus |
| `index.html` | Meta description dan OG description tidak lagi menyebut CrossPlatform Studio |
| `metadata.json` | Deskripsi agregat diperbarui hanya untuk Coding Tower dan CodeShark |
| `scripts/test-settings-browser.mjs` | Skenario direct-entry nonaktif dipindah dari `/crossplatform/` ke `/codingshark/`, lalu Shark diaktifkan kembali untuk skenario berikutnya |
| `tests/site-settings.test.mjs` | Ekspektasi game aktif/pensiun dan fixture migrasi diperbarui |

Dashboard tidak memerlukan patch langsung karena kartu arena dihasilkan dari `SUBGAME_ORDER`/`SUBGAMES`; begitu registry dipersempit, navigasi Cross Platform hilang dari Dashboard secara otomatis.

Kelas CSS `.phone-frame`, `.phone-bar`, `.phone-url`, dan `.phone-cap` di `src/ui/ui.css` **dipertahankan** karena dipakai pratinjau halaman Coding Tower, bukan simulator Cross Platform.

---

## 5. Kompatibilitas settings dan data pemain

Skema settings memakai validasi exact-key. Untuk mencegah dokumen lama yang masih mengandung `games.crossplatform` gagal dimuat:

- `crossplatform` ditambahkan ke `RETIRED_GAME_IDS`, sehingga daftar pensiun menjadi `ci_backend`, `py_backend`, dan `crossplatform`;
- `migrateSettings()` yang sudah terpasang pada jalur baca server, lokal, dan cloud membuang kunci pensiun dari salinan dokumen sebelum `validateSettings()` berjalan;
- jalur tulis admin tetap ketat dan tidak dapat menulis kembali id pensiun;
- test lama diperluas agar membuktikan ketiga id pensiun dimigrasi dan `GAME_IDS` final hanya `tower`/`shark`.

Data pemain tidak dibersihkan secara destruktif:

- kunci progres `crossplatform:<no>` pada `save.modules` menjadi yatim dan tidak memengaruhi XP, koin, streak, atau progres Tower/Shark;
- nilai localStorage sub-game terakhir `crossplatform` tidak lagi lolos whitelist, sehingga App jatuh ke fallback Tower/Shark sesuai perangkat;
- URL lama `?subgame=crossplatform` diabaikan oleh whitelist App;
- path lama `/crossplatform/` tidak lagi dibangun atau diberikan rewrite khusus, sehingga mengikuti fallback hosting umum yang berlaku.

Apabila modul dipasang kembali, `crossplatform` harus dikeluarkan dari `RETIRED_GAME_IDS` sebelum ditambahkan lagi ke `GAME_IDS`. Nilai toggle pada dokumen settings yang sudah termigrasi tidak dapat dipulihkan dari dokumen tersebut.

---

## 6. Referensi yang sengaja tersisa

Audit kode runtime/konfigurasi sesudah pelepasan hanya menemukan penyebutan berikut:

- komentar penunjuk arsip di `src/data/subgames.ts`;
- komentar dan konstanta `RETIRED_GAME_IDS` di `shared/site-settings.mjs`;
- assertion/fixture migrasi di `tests/site-settings.test.mjs`;
- dokumen historis di `docs/` dan isi ZIP di `arsip/`.

Tidak ditemukan registry, rute, entry build, navigasi, artwork, materi, atau simbol Cross Platform aktif lainnya. Audit `dist/` juga memastikan tidak ada `dist/crossplatform/index.html`, file/chunk bernama CrossPlatform, atau simbol `CrossPlatformLab`/`CROSS_PLATFORM_MEETINGS`.

---

## 7. Restore ringkas

Prosedur lengkap terdapat dalam `README-ARSIP.md` di dalam ZIP. Ringkasnya:

1. Kembalikan 24 file inti ke path aslinya.
2. Gunakan 17 snapshot `integrasi-sebelum-dilepas/` untuk memasang registry, App/Hub navigation, figur, artwork/ikon, settings, meta, entry Vite, PWA, rewrite hosting, dan test.
3. Keluarkan `crossplatform` dari `RETIRED_GAME_IDS` sebelum mengembalikannya ke `GAME_IDS`.
4. Jalankan lint, seluruh test, dan build.

Versi sebelum pelepasan juga tersedia di riwayat Git commit `a075d08`.

---

## 8. Verifikasi

Perintah yang dijalankan:

```bash
npm ci --no-audit --no-fund
npm run lint
node --test tests/site-settings.test.mjs
node --test tests/*.test.mjs
npm run build
git diff --check
```

Hasil:

- pemasangan dependensi bersih: 512 paket;
- TypeScript/lint: **lolos** setelah satu kurung penutup berlebih dari pemotongan cabang Cross Platform di `App.tsx` diperbaiki;
- test site-settings: **12/12 lolos**;
- seluruh test Node: **96/96 lolos**;
- production build Vite/PWA: **lolos**;
- entry HTML hasil build hanya hub, admin, `codingshark`, dan `codingtower`;
- audit `dist/`: tidak ada file/simbol Cross Platform;
- `git diff --check`: **lolos**;
- integritas ZIP: **lolos**, 42 file, 41 salinan byte-identik.

Tidak ada klaim pengujian visual browser pada catatan ini; bukti berasal dari audit kode/artefak, test otomatis, lint, dan build.
