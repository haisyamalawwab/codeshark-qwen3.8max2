# 🦈 CodeShark Academy

**Belajar HTML, CSS, dan JavaScript sambil main game mengetik kode.**

CodeShark adalah aplikasi web edukasi (*typing game* front-end) bergaya bawah laut/HUD penyelam. Loop belajarnya: **baca teori → ketik ulang kode persis → lihat preview hidup dari hasil ketikanmu**. Progres (XP, koin, rank, lencana) tersimpan otomatis di `localStorage`.

Silabusnya dirancang untuk **16 pertemuan latihan**: HTML 6 pertemuan, UTS 1, CSS 4, jembatan 1, JS 3, UAS 1 — setiap pertemuan punya materi konsep tersendiri plus ajang gladi ketik.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| ⌨️ **Game Ketik Kode** | Arena mengetik dengan HP, combo, overdrive (skor ×2), damage float, dan feedback suara WebAudio. Preview iframe menjalankan kode hasil ketikan (`sandbox="allow-scripts"`). |
| 📚 **Materi HTML berbasis `.md`** | Enam dokumen markdown per pertemuan (`content/html/*.md`) dirender dengan parser markdown ringan buatan sendiri — heading, list, tabel pipe, blok kode, dan callout bergaya HUD. |
| 🗺️ **Peta Pertemuan 16×** | Modal silabus lengkap (`src/ui/Pertemuan.tsx`): tujuan pembelajaran, slide konsep, kuis, dan potongan kode latihan per pertemuan. |
| 🧠 **Ruang Materi interaktif** | Slide teori + kuis per modul HTML/CSS/JS (`src/data/modules.ts`). |
| 👤 **Profil adaptif usia** | 4 kelompok usia — Kadet Samudra (10–13), Ranger Laut (13–15), Senior Diver, Academy — mengatur tempo ancaman, penalti salah ketik, petunjuk karakter, dan aksen warna. |
| 🏆 **Gamifikasi penuh** | XP, koin, level (kurva 150·n), rank S/A/B/C, bintang, statistik keystroke, dan anti-farm (hanya delta skor terbaik yang dihitung). |
| 🔊 **SFX tanpa aset** | Semua efek suara disintesis langsung via WebAudio API — nol berkas audio. |
| 🎨 **Tema HUD Selam** | Design system token CSS (`src/styles/theme.css`): palet deep-navy/teal/cyan/amber/koral, font Baloo 2 + Nunito + JetBrains Mono, latar parallax laut berlapis. |

## 🛠️ Teknologi

- **React 19** + **TypeScript 5.9**
- **Vite 7** (build tool, `base: "./"` agar bisa ditaruh di sub-folder, mis. Laragon)
- **Tailwind CSS 4** via plugin `@tailwindcss/vite`
- Tanpa state-management eksternal — `useState` + `localStorage` namespace `codeshark:save:v1`
- Parser markdown & syntax highlighter sendiri (tanpa dependensi) di `src/lib/`

## 📁 Struktur Proyek

```
├── content/html/            # 6 dokumen materi HTML (.md) per pertemuan P1–P6
├── src/
│   ├── App.tsx              # Router layar: dash → materi → materi-html → game → result
│   ├── characters/          # Maskot hiu kapten, divers, avatar (SVG/CSS anim)
│   ├── graphics/            # Mesin latar laut: seaEngine, Ambient, layer parallax SVG
│   ├── data/
│   │   ├── modules.ts       # Definisi modul HTML/CSS/JS + konfigurasi kelompok usia
│   │   ├── curriculum.ts    # Silabus Lesson 16 pertemuan (tipe Lesson, PHASE_COLOR)
│   │   └── materiHtml.ts    # Pipeline muat ?raw .md → HTML_DOCS
│   ├── lib/
│   │   ├── markdown.ts      # Parser markdown ringan (heading/list/tabel/quote/kode)
│   │   ├── highlight.ts     # Tokenizer sintaks html/css/js
│   │   ├── audio.ts         # Synth SFX WebAudio
│   │   └── storage.ts       # Save/load profil, XP, progres modul, statistik
│   ├── ui/
│   │   ├── Dashboard.tsx    # Home HUD + kartu akses cepat P1–P6 + CodePanel
│   │   ├── MateriHtml.tsx   # Penampil materi HTML .md + navigasi antar dokumen
│   │   ├── Materi.tsx       # Ruang materi slide + kuis per modul
│   │   ├── Pertemuan.tsx    # Peta pertemuan 16× (modal silabus)
│   │   ├── TypingGame.tsx   # Arena ketik inti
│   │   ├── Results.tsx      # Layar hasil, rank, XP, koin
│   │   └── Onboarding.tsx   # Pembuatan profil & pemilihan usia
│   └── styles/theme.css     # Token warna, font, reset global
├── netlify.toml / vercel.json  # Config deploy SPA (fallback routing + cache header)
└── vite.config.ts           # Pemisahan chunk vendor/asset js/css/img
```

## 🚀 Menjalankan

Prasyarat: **Node.js ≥ 20**.

```bash
# 1. Instal dependensi
npm install

# 2. Mode pengembangan (http://localhost:5173)
npm run dev

# 3. Build produksi → folder dist/
npm run build

# 4. Pratinjau hasil build
npm run preview
```

Hasil build memakai path relatif, sehingga `dist/` juga bisa disalin langsung ke sub-folder server lokal (mis. `htdocs/CODESHARK/dist/` di Laragon/XAMPP) tanpa konfigurasi tambahan.

## 📖 Alur Kurikulum 16 Pertemuan

| Pertemuan | Tahap | Fokus |
|---|---|---|
| 1–6 | **HTML** | Dasar web & alat → anatomi dokumen → teks & daftar → media & navigasi → formulir & semantik → mini project gladi UTS |
| 7 | **UTS** | Ujian lingkup HTML (pertemuan 1–6) |
| 8–11 | **CSS** | Selektor & box model → tipografi/warna → layout (flex/grid) → responsif |
| 12 | Jembatan | Review HTML+CSS + pengantar DOM |
| 13–15 | **JavaScript** | Variabel & tipe → percabangan & loop → fungsi & event |
| 16 | **UAS** | Gladi DOM/event + aplikasi interaktif |

Setiap pertemuan = baca materi konsep → kerjakan kuis → **gladi ketik kode** di arena (skor masuk ke progres profil). Materi tahap HTML ditulis sebagai dokumen markdown di `content/html/` sehingga guru dapat menyunting konten tanpa menyentuh kode React.

## 🎮 Sistem Skor (ringkas)

- Skor/karakter: `10 × (1 + 0.5 × min(4, ⌊combo/12⌋))` → pengali x1–x3
- Milestone combo 25/50/75/100/150 → bonus bertingkat; baris sempurna +80 & +2 HP
- Overdrive penuh → skor ×2 selama 8 detik
- Rank: **S** (akurasi ≥97% & HP ≥70) · A ≥92% · B ≥84% · C sisanya
- XP akhir: skor sesi dikonversi dengan pengali rank; hanya delta terhadap skor terbaik yang masuk ke progres (anti-farm). Tingkat kesulitan mengikuti kelompok usia pemain (Kadet–Academy)

## ☁️ Deploy

Siap pakai untuk dua platform (konfigurasi sudah ada di repo):

- **Netlify** — `netlify.toml`: build `npm run build`, publish `dist`, SPA fallback `/* → /index.html`, cache immutable untuk `/assets/*`.
- **Vercel** — `vercel.json`: framework `vite`, rewrites serupa.

Alternatif statis: jalankan `npm run build` lalu unggah isi `dist/` ke hosting apa pun.

## 📄 Lisensi & Credit

Proyek privat (`"private": true`). Aset visual tema (maskot hiu, HUD) dibuat khusus untuk CodeShark Academy. Detail desain & analisis mekanik permainan: lihat [`ANALISIS.md`](./ANALISIS.md) dan [`SPESIFIKASI-UIUX-v0.3.md`](./SPESIFIKASI-UIUX-v0.3.md).
