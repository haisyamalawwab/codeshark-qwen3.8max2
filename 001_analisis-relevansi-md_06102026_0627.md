# 001 — Analisis Relevansi ANALISIS.md & SPESIFIKASI-UIUX-v0.3.md terhadap `qwen3.8max2`

> Disimpan: 06-10-2026 06:27. Mencakup seluruh diskusi dari awal sampai respons terakhir.

---

## 1. Konteks awal

Pengguna menjalankan `npm install` (sukses, 93 paket, 5 vulnerability), `npm build start` (gagal — perintah salah, seharusnya `npm run build`), dan `npm run build` (sukses, `dist/index.html` ±310 kB single-file). `npm run dev` sedang berjalan.

## 2. Permintaan #1 — Periksa apakah `ANALISIS.md` dan `spek*.md` relevan untuk folder ini

### Temuan
Isi folder: `ANALISIS.md`, `SPESIFIKASI-UIUX-v0.3.md`, `src/` (App, Ambient, Dashboard, Materi, Onboarding, Results, TypingGame, icons; data/modules.ts; lib/audio, highlight, storage; utils/cn), `vite.config.ts`, `package.json` (nama masih `react-vite-tailwind`).

**`ANALISIS.md` (v0.2) — kurang relevan.** Dokumen mendeskripsikan versi lain (`qwen3.8max`):
- Tidak ada `api/index.php`, `database/codeshark.sql`, `src/lib/api`; progres hanya di localStorage (`lib/storage.ts`).
- `vite.config.ts` tidak punya proxy `/api`.
- Lampiran masih menunjuk `qwen3.8max`.
- Fitur grafis yang diklaim (`.ch-wrong`, vignette HP) tidak ditemukan.
- `Dashboard.tsx` menyebut "v0.1 (MVP) … localStorage".
- Sistem yang dianalisis (HP, Overdrive, rank S/A/B/C, mode Santai/Standar/Hiu Galak, level 7 tingkat) tidak ada di kode ini.

**`SPESIFIKASI-UIUX-v0.3.md` — relevan dengan catatan.**
- Mengaku sebagai pendamping `ANALISIS.md` dan belum membaca kode (nama file di §1 adalah asumsi).
- Struktur folder cukup dekat (Onboarding, Results, Dashboard, TypingGame).
- Bagian bergantung MySQL (§10 statistik DB, §14 instrumentasi) tidak berlaku.

## 3. Permintaan #2 — Periksa folder, ambil bagian relevan, lakukan improvement

### Kondisi nyata game di folder ini
- Mekanik: bar **Ancaman Hiu** (naik per 100 ms oleh `threatRate`, turun saat baris selesai via `relief`, naik saat salah via `missPenalty`), **3 nyawa**, combo, skor `10 × (1 + combo×0.02)` + 40/baris.
- **Backspace diizinkan** (jadi usulan "tanpa backspace" tidak relevan).
- Bintang: ≥95% akurasi = 3, ≥85% = 2, selain itu 1. XP: `50 + bintang×25 + akurasi/5`.
- Ada mode terbimbing (`cfg.hints`) dengan keycap karakter berikutnya.
- Ada pause (Esc), tetapi tidak ada auto-pause.
- WPM dihitung dengan lantai waktu 5 detik.

### Improvement yang diterapkan

| Berkas | Perubahan | Sumber ide |
|---|---|---|
| `src/components/TypingGame.tsx` | **Ghost karakter salah**: tombol yang salah ditekan tampil merah 320 ms di posisi kursor | ANALISIS §5.1 |
| | **Auto-pause** saat `blur` / `visibilitychange` | ANALISIS §4.9, SPEK #9 |
| | **Danger vignette** saat 1 nyawa atau ancaman > 78% | ANALISIS §5.3 |
| | **Chip akurasi live** di HUD (teal ≥95, amber ≥85, coral di bawah) + tooltip syarat bintang | SPEK #1 (rank trajectory), ANALISIS §4.3 |
| | **Bonus kecepatan** +3/karakter saat live-WPM ≥ 40 (`SPEED_BONUS_WPM`) | ANALISIS §4.1 |
| | Pelacakan `missed` (karakter → jumlah salah) dan dimasukkan ke `GameResult` | ANALISIS §3 / SPEK #12 |
| `src/components/Results.tsx` | Panel **Syarat bintang** (checklist) dan **Karakter tersulit** (4 teratas) | ANALISIS §4.3, SPEK #2/#12 |
| `src/index.css` | Gaya `.caret-char.ch-wrong`, `.danger-vignette`; `prefers-reduced-motion` diperluas (shake, flash-red, float-p, count-pop, star-pop, danger-vignette, caret-char) | ANALISIS §5.6 |

### Verifikasi
`npx tsc --noEmit` dan `npm run build` lolos (`dist/index.html` 315 kB, gzip 93 kB). Belum diuji manual di browser.

### Sengaja tidak dikerjakan
- Pembagian skor per sumber (waterfall).
- Pembatasan HUD ke lima elemen.
- Tata letak mobile + hidden input.
- Statistik dashboard dari riwayat.
- Riwayat MySQL / `api/` (butuh backend yang belum ada).
- Rank S/A/B, Overdrive, mode HP, perfect-line — tidak ada padanan di mekanik ini.

## 4. Tindak lanjut yang disarankan
1. Sesuaikan `ANALISIS.md` agar menggambarkan versi `qwen3.8max2` (mekanik ancaman + nyawa).
2. Audit sisa spesifikasi (baris 121–1001) per bagian terhadap kode.
3. Kerjakan item mobile (hidden input / badge keyboard) dan statistik dashboard.
4. Ubah nama package dari `react-vite-tailwind` dan teks versi di `Dashboard.tsx`.
5. Uji manual di browser: ghost char, auto-pause, vignette, panel hasil.
