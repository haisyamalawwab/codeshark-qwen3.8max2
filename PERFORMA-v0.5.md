# PERFORMA v0.5 — efisiensi build, runtime, dan akses

Dokumen ini mencatat perubahan performa dan bukti ukurannya. Semua angka berasal dari `npm run build` (Vite 7.3.2) pada baseline `553c442` dan pada cabang kerja. Angka gzip dihitung oleh Vite.

## Batasan pengukuran

- **FPS dan waktu frame belum diukur.** Lingkungan ini tidak punya browser, jadi efek seaEngine dan TypingGame hanya diverifikasi lewat kode, bukan profil runtime.
- **Pengujian interaktif manual** (klik, audio, layout HP, sensasi kelancaran) dilakukan pengguna.
- **Tes baru** (`npm test`) berisi 232 pemeriksaan logika murni. Angka ini **tidak sebanding** dengan 360 pemeriksaan di v0.4, karena skrip lama di `/tmp/verify/` sudah tidak ada.

## 1. Ukuran bundle awal (JS yang diunduh sebelum layar pertama)

| Berkas | Sebelum | Sesudah | Perubahan |
|---|---|---|---|
| `index-*.js` (app utama) | 188.26 kB (gzip 60.38) | 105.54 kB (gzip 36.54) | −44% / gzip −40% |
| `vendor-*.js` (React) | 192.35 kB (gzip 60.29) | 192.35 kB (gzip 60.29) | tidak berubah |
| **Total JS awal** | **380.61 kB (gzip 120.67)** | **297.89 kB (gzip 96.83)** | **−22% / gzip −20%** |
| CSS | 64.02 kB (gzip 12.61) | 64.02 kB (gzip 12.61) | tidak berubah |

Penyebab: layar Materi, MateriHtml, TypingGame, Results, dan Pertemuan dimuat dengan `React.lazy` + `Suspense` (`src/App.tsx`). Dashboard tetap di bundle utama.

Chunk yang dimuat sesuai kebutuhan:

| Chunk | Ukuran | gzip |
|---|---|---|
| MateriHtml | 39.03 kB | 13.10 kB |
| TypingGame | 15.78 kB | 5.36 kB |
| Pertemuan | 12.26 kB | 3.91 kB |
| Results | 10.16 kB | 3.48 kB |
| Materi | 6.53 kB | 2.44 kB |
| highlight (shared) | 1.47 kB | 0.73 kB |
| CodePanel (shared) | 1.44 kB | 0.64 kB |

## 2. Aset gambar karakter

| Berkas | Sebelum | Sesudah | Ukuran tampil |
|---|---|---|---|
| `shark-cyber` | PNG 779×406, 279.15 kB | WebP 512×267, 51.71 kB | Onboarding `w-64` = 256 px CSS × 2 DPR = 512 px |
| `shark-captain` | PNG 317×337, 114.21 kB | WebP 317×337, 34.00 kB | 124 px CSS × 2 DPR = 248 px (dimensi asli dipertahankan) |
| **Total** | **393.36 kB** | **85.71 kB (−78%)** | |

Impor di `SharkMascot.tsx` dan `CaptainAvatar.tsx` sudah diarahkan ke WebP. PNG sumber dihapus dari working tree dan masih ada di riwayat Git.

## 3. Runtime (perubahan kode, belum diukur di browser)

| Area | Sebelum | Sesudah | Catatan |
|---|---|---|---|
| Canvas DPR | `min(1.5, dpr)` | sama | Sudah ada sebelumnya. Tidak diubah. |
| Penulisan DOM parallax & hiu | tulis `transform`/`opacity`/`filter` tiap frame | hanya saat string berubah (`putStyle`) | Mengurangi style recalc bila nilai tidak berubah. |
| Blur hiu | `toFixed(2)` tiap frame | dikuantisasi 0.1 px | Perubahan kecil tidak memicu repaint filter. |
| Frame di layar non-game | 60 fps | maks. 30 fps saat `scene.active` false | Dashboard dan layar lain. |
| Baris kode mendatang di TypingGame | dirender ulang tiap tik 100 ms | komponen `UpcomingLine` ber-`memo` | Referensi token stabil dari `useMemo`. |
| `tokenize` | dihitung ulang setiap render | cache Map ≤64 entri, kunci lang+kode | Hasil dianggap read-only. |

Catatan: `TypingGame` masih memanggil `force()` tiap 100 ms karena timer ancaman. Komponen induknya tetap dirender ulang. Yang dihemat adalah render subtree baris mendatang dan penulisan DOM di seaEngine.

## 4. Build, workflow, dan hygiene repo

- **`node_modules/` tidak lagi di-track Git.** Sebelumnya 2634 file ter-track dan tidak lengkap (tidak ada `vite`, sehingga `npm run build` gagal dari clone). Sekarang `npm ci` membangun ulang dependensi. `node_modules/` sudah ditambahkan ke `.gitignore`.
- **Skrip baru:** `npm test` (bundel tes dengan esbuild lalu jalankan di Node) dan `npm run typecheck`. Tes ada di `tests/`. `tests` masuk ke `tsconfig.json`.
- **esbuild** ditambahkan sebagai devDependency dengan versi tepat `0.27.7` (sama dengan yang sudah terpasang lewat Vite).
- Build: 1.24–1.42 s (tidak ada regresi).

## 5. Ditunda: keputusan `dist/`

`dist/` masih ter-track di Git (7 berkas, termasuk `dist/assets/img/*.png` lama). `.gitignore` sudah memuat `dist/`, tetapi berkas yang sudah ter-track tetap diikuti Git. Hasil build tidak di-commit. Pengguna perlu memutuskan: (a) untrack `dist/` seperti `node_modules/`, atau (b) tetap dibangun dan di-commit sebagai artefak deploy.

## 6. Yang belum dikerjakan

- **Google Fonts** di `index.html` masih `<link>` render-blocking dengan `display=swap`. Tidak bisa di-self-host karena `fonts.googleapis.com` tidak ada di daftar host yang diizinkan sandbox. Perlu diunduh dan di-host sendiri jika ingin menghilangkan render-blocking.
- **Gambar referensi di root repo** (banyak PNG dan `.zcode-shot-*.png`) tidak dipakai build, hanya dirujuk di komentar. Ini hygiene, bukan performa bundle. Belum dibersihkan.
- **Uji FPS dan sensasi di HP** perlu dilakukan pengguna di browser nyata (DevTools → Performance, Rendering → Frame rendering stats).
