# 018 — Perbaikan Build Warning (PWA Register, Chunk Auth, Anotasi Zod)

> **Tanggal:** 15-10-2026 · **Repo:** latihan.my.id (`qwen3.8max2`, Vite 7 + React 19 + TS)
> **Tujuan file:** memori konteks untuk agentic-AI lain / proses selanjutnya. Mencatat tiga warning
> build, akar masalah, perbaikan, dan hasil verifikasi. Baca bersama `008_*`, `009_*`, `010_*`.

---

## 1. `pwa-register.js can't be bundled without type="module"` (×3)

- **Gejala:** tiap entry (`/`, `/codingshark/`, `/codingtower/`) memicu warning ini.
- **Akar masalah:** `public/pwa-register.js` dirujuk sebagai script klasik (`<script src>` tanpa
  `type="module"`). Vite hanya mem-bundle script modul — berkas di `public/` dilewati apa adanya.
  Fungsional baik-baik saja (URL relatif cocok dengan hasil copy `public/` → `dist/`), tapi berisik
  dan rawan 404 bila struktur berubah.
- **Perbaikan:**
  - Pindah ke **`src/pwa-register.ts`** (modul TypeScript, logika identik — path SW dihitung dari
    `location.pathname`, jadi tetap benar di sub-folder apa pun lokasi chunk output).
  - Ketiga `index.html` → `<script type="module" src="/src/pwa-register.ts">`.
  - Hapus `public/pwa-register.js`.
- **Verifikasi browser (Playwright, `vite preview`):** SW terdaftar di ketiga entry (`sw=true`),
  nol request gagal/4xx, tidak ada referensi basi `pwa-register.js` di `dist/`.

---

## 2. `auth.ts is dynamically imported by sync.ts but also statically imported by App.tsx`

- **Gejala:** `[plugin vite:reporter]` — dynamic import tidak memindahkan modul ke chunk lain.
- **Akar masalah:** `src/lib/sync.ts` memakai `await import("./auth")`, padahal `src/App.tsx`
  sudah mengimpor `./lib/auth` secara statis (`guestUser`, `signInWithGoogle`). Split mustahil.
- **Perbaikan:** ubah ke **import statis** di `sync.ts` (+ komentar penjelas). Perilaku identik,
  warning hilang.
- **⚠️ Catatan kepemilikan:** `sync.ts`/`auth.ts` milik tim paralel. Bila lazy-load auth/supabase
  memang disengaja, kembalikan satu baris ini — dan yang wajib diubah adalah import statis di
  `App.tsx`, bukan di `sync.ts`.

---

## 3. `zod ... annotation that Rollup cannot interpret` (util.js, regexes.js)

- **Sumber:** `zod@4` — dependensi transitif dari **`p5`** (`npm ls zod` membuktikan).
- **Sifat:** 100% jinak — Rollup otomatis membuang komentar anotasi, build selalu sukses.
  Tidak ada yang perlu diperbaiki di kode aplikasi.
- **Perbaikan:** filter `onwarn` di `vite.config.ts` (`rollupOptions`) yang hanya membuang kode
  `INVALID_ANNOTATION`. Warning lain tetap tampil normal.

---

## 4. Status akhir

- `npx tsc --noEmit` → bersih. `npm run build` → lolos, log bebas ketiga warning di atas.
- Tersisa satu baris advisory chunk >500KB (`game-pixi`, `game-p5`) — informasional untuk chunk
  lazy; first-paint tidak memuatnya (terbukti di browser test v0.9).
- Insiden sampingan sesi ini: file paralel `src/lib/gameDb.ts` butuh `sql.js` → dipasang
  (`sql.js` + `@types/sql.js`); sempat ada error `RANKS` tak terpakai di `Dashboard.tsx` yang
  ternyata race dengan penulis paralel — `tsc` ulang langsung bersih.
