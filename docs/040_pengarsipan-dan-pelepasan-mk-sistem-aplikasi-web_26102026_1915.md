# 040 — Pengarsipan & Pelepasan MK Sistem Aplikasi Web

> Pengarsipan: 26-10-2026 19:15 WIB (+07); catatan dilengkapi setelah verifikasi pada hari yang sama.
> Branch kerja: `arena/4612e910-codeshark-qwen3-8max2`.
> Basis kode: `4d6c28d` (merge PR #2).
> Status saat catatan ditulis: perubahan berada di working tree untuk ditinjau, di-commit, lalu diajukan sebagai PR.

---

## 1. Permintaan dan keputusan cakupan

Permintaan awal adalah menyembunyikan modul **Sistem Aplikasi Web — Backend Dasar (CodeIgniter)**, mengarsipkannya dalam ZIP, kemudian melepaskannya dari aplikasi beserta seluruh material terkait.

Karena aplikasi mempunyai dua jalur pada MK yang sama, cakupan diklarifikasi dan keputusan yang diterapkan adalah:

- **Seluruh MK Sistem Aplikasi Web — Backend Dasar** dilepas:
  - Jalur A: CodeIgniter/PHP (`ci_backend`);
  - Jalur B: Python Django/Flask (`py_backend`).
- ZIP disimpan **di dalam repository** pada folder `arsip/`, tetapi tidak menjadi entry Vite/PWA sehingga tidak ikut ter-bundle ke aplikasi.
- Setelah ZIP dibuat dan diverifikasi, file modul dan seluruh titik integrasinya dihapus dari kode aplikasi.

Setelah pekerjaan ini, sub-game aktif hanya `crossplatform`, `tower`, dan `shark`.

---

## 2. Arsip ZIP

Arsip dibuat sebelum file apa pun dihapus:

```text
arsip/sistem-aplikasi-web-backend-dasar_26102026_1915.zip
```

Properti arsip:

- 52 file entries;
- ukuran terkompresi sekitar 199 KB;
- total ukuran tidak terkompresi 603.143 byte;
- SHA-256: `0eb527c74ff46007718aa1f68c6398cd1f4ea373546ea59350d9ab41a5a398f9`;
- uji integritas ZIP: tidak ada file rusak (`testzip()` mengembalikan `None`);
- 51 file sumber/snapshot di dalam ZIP terbukti byte-identik dengan file aslinya sebelum pelepasan; satu file sisanya adalah `README-ARSIP.md` yang dibuat khusus untuk paket arsip.

Struktur isi:

| Kelompok | Jumlah | Isi |
|---|---:|---|
| Modul inti | 40 | 4 lab/simulator, 4 kurikulum/materi tersemat, 16 file `content/ci_backend`, dan 16 file `content/php_backend` |
| Snapshot integrasi | 11 | Versi utuh App, Hub, registry sub-game, settings bersama, admin settings, HUD, artwork, icons, meta HTML, dan smoke-test browser sebelum modul dilepas |
| Manifes | 1 | `README-ARSIP.md` berisi daftar isi, alasan arsip, batas kompatibilitas settings, dan langkah restore |

`content/php_backend/` terbukti **duplikat identik** dari `content/ci_backend/` melalui `diff -rq`, dan tidak dirujuk kode mana pun. Duplikat itu tetap diarsipkan apa adanya sebelum dihapus.

---

## 3. File modul yang dilepas dari aplikasi

Sebanyak 40 file inti dihapus dari working tree:

### Komponen lab dan simulator

- `src/games/backend/CiBackendLab.tsx`
- `src/games/backend/CiBackendSimulator.tsx`
- `src/games/backend/PyBackendLab.tsx`
- `src/games/backend/PyBackendSimulator.tsx`

Folder `src/games/backend/` tidak lagi ada.

### Kurikulum dan materi tersemat

- `src/data/ciBackendCurriculum.ts`
- `src/data/pyBackendCurriculum.ts`
- `src/data/materiBackendCi.ts`
- `src/data/materiBackendPy.ts`

### Materi pertemuan

- `content/ci_backend/01-...` sampai `16-...` (16 file)
- `content/php_backend/01-...` sampai `16-...` (16 file duplikat)

Folder `content/` kini hanya berisi materi `crossplatform` dan `html`.

---

## 4. Titik integrasi yang dibersihkan

Perubahan integrasi diterapkan pada 14 file:

| File | Pelepasan yang dilakukan |
|---|---|
| `src/data/subgames.ts` | `ci_backend`/`py_backend`, mode `backend_ci`/`backend_py`, entri katalog, urutan, dan whitelist sub-game tersimpan dihapus |
| `src/App.tsx` | Lazy import kedua lab, whitelist `?subgame=`, cabang render dashboard/game, label arena, dan tab backend dihapus |
| `src/hub/HubApp.tsx` | Dua kartu MK, state `activeLab`, handler `openBackendLab`, tombol header, chip hero PHP/Python, dan cabang CTA backend dihapus |
| `shared/site-settings.mjs` | `GAME_IDS` menjadi `crossplatform/tower/shark`; ditambah shim baca `RETIRED_GAME_IDS` + `migrateSettings()` |
| `shared/site-settings.d.mts` | Tipe `GameId` diperbarui dan deklarasi shim migrasi ditambah |
| `server/site-settings.mjs` | Dokumen settings dari database dimigrasi pada jalur baca sebelum validasi |
| `src/lib/siteSettings.tsx` | Settings lokal dan respons settings cloud dimigrasi pada jalur baca sebelum validasi |
| `src/admin/AdminSettings.tsx` | Label toggle Backend PHP/CodeIgniter dan Backend Python dihapus |
| `src/ui/CrossPlatformHud.tsx` | Tombol footer CI4/Python dan import ikon terkait dihapus |
| `src/ui/SubGameArtwork.tsx` | Union ID serta artwork SVG CodeIgniter dan Python dihapus |
| `src/ui/icons.tsx` | Definisi `IconServer`, `IconPhp`, dan `IconPython` yang tidak lagi mempunyai pemakai dihapus; `IconDatabase` dipertahankan karena masih digunakan komponen status database/lokal |
| `index.html` | Meta description dan OG description tidak lagi menyebut backend CodeIgniter/Python |
| `scripts/test-settings-browser.mjs` | Skenario direct-entry game nonaktif dipindah dari `ci_backend` ke entry `crossplatform` |
| `tests/site-settings.test.mjs` | Ditambah test regresi migrasi dokumen settings lama |

URL atau pilihan tersimpan lama yang masih menyebut `ci_backend`/`py_backend` tidak lagi diterima sebagai sub-game valid; aplikasi memakai fallback arena yang tersedia.

---

## 5. Kompatibilitas settings dan data pemain

Skema settings aplikasi bersifat ketat: kunci `games` harus tepat sama dengan `GAME_IDS`. Agar pelepasan sub-game tidak membuat dokumen settings historis gagal dimuat, ditambahkan migrasi khusus baca:

- `RETIRED_GAME_IDS = ['ci_backend', 'py_backend']`;
- `migrateSettings()` membuang hanya kedua kunci pensiun itu dari `games` pada salinan dokumen, tanpa memutasi objek asal;
- migrasi dipasang pada pembacaan settings database server, settings lokal browser, dan respons settings cloud;
- jalur tulis/admin tetap memakai `validateSettings()` ketat tanpa migrasi, sehingga id pensiun tidak dapat ditulis kembali.

Data progres pemain tidak dihapus. Kunci sesi lama seperti `ci_backend:<no>` atau `py_backend:<no>` di `save.modules` menjadi yatim dan tidak dipakai, tetapi tidak mengganggu XP, koin, streak, atau progres sub-game lain. Bila modul dipasang kembali di masa depan, kunci yang masih ada berpotensi terbaca lagi sesuai logika lab hasil restore.

Catatan restore settings: bila kedua id ingin dihidupkan kembali, hapus id tersebut dari `RETIRED_GAME_IDS` sebelum menambahkannya lagi ke `GAME_IDS`. Nilai toggle lama pada dokumen yang sudah termigrasi tidak tersimpan lagi dan harus diatur ulang melalui mekanisme settings yang berlaku saat restore.

---

## 6. Referensi teks yang sengaja tersisa

Audit runtime setelah pelepasan hanya menemukan sebutan lama pada konteks non-material berikut:

- komentar arsip singkat di `src/data/subgames.ts` yang menunjukkan lokasi ZIP dan dokumen ini;
- konstanta `RETIRED_GAME_IDS` di `shared/site-settings.mjs`;
- fixture/assertion test migrasi di `tests/site-settings.test.mjs`;
- dokumen historis di `docs/` dan isi folder `arsip/`.

Itu adalah penanda migrasi/arsip, bukan registry, routing, UI, atau materi modul yang masih aktif. Audit `dist/` tidak menemukan chunk/file backend maupun simbol `CiBackendLab`, `PyBackendLab`, `CI_BACKEND_MEETINGS`, atau `PY_BACKEND_MEETINGS`.

---

## 7. Cara restore ringkas

Panduan lengkap berada pada `README-ARSIP.md` di dalam ZIP. Ringkasnya:

1. Ekstrak ZIP dan kembalikan 40 file inti ke path aslinya.
2. Gunakan folder `integrasi-sebelum-dilepas/` untuk menyisipkan kembali registry, routing, kartu hub, artwork, ikon, settings, label admin, meta, dan skenario smoke test.
3. Sesuaikan shim settings seperti dijelaskan pada Bagian 5.
4. Jalankan lint, seluruh test Node, dan build.

Alternatifnya, versi sebelum pelepasan tetap tersedia pada riwayat Git commit `4d6c28d`.

---

## 8. Verifikasi

Perintah yang dijalankan pada keadaan setelah pelepasan ikon:

```bash
npm run lint
node --test tests/site-settings.test.mjs
node --test tests/*.test.mjs
npm run build
git diff --check
```

Hasil:

- TypeScript/lint: **lolos**;
- test site-settings: **12/12 lolos**, termasuk test migrasi id pensiun;
- seluruh test Node: **96/96 lolos**;
- production build Vite/PWA: **lolos**;
- audit `dist/`: tidak ada chunk backend atau simbol lab/kurikulum backend;
- `git diff --check`: **lolos** setelah normalisasi newline akhir `src/ui/icons.tsx`;
- integritas ZIP: **lolos**, 52 file entries.

Tidak ada klaim pengujian browser visual pada catatan ini; bukti yang dicatat adalah pemeriksaan kode, test otomatis, build, dan audit artefak.
