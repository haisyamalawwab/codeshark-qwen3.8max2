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
| 🗺️ **Peta Pertemuan 16×** | Silabus 16 pertemuan (`src/ui/Pertemuan.tsx`): materi slide + kuis interaktif, lalu tiga sesi per pertemuan — **Quest** (kode utuh), **Drill** (sintaks inti), **Juggling** (anyam dua materi). Status Perunggu/Perak/Emas dan gating dibahas di bawah. |
| 🧠 **Ruang Materi interaktif** | Slide teori + kuis per modul HTML/CSS/JS (`src/data/modules.ts`). |
| 👤 **Profil adaptif usia** | 4 kelompok usia — Kadet Samudra (10–13), Ranger Laut (13–15), Senior Diver, Academy — mengatur tempo ancaman, penalti salah ketik, petunjuk karakter, dan aksen warna. |
| 🏆 **Gamifikasi penuh** | XP, koin, level (kurva 150·n), rank S/A/B/C, bintang, statistik keystroke, dan anti-farm (hanya delta skor terbaik yang dihitung). |
| 🔊 **SFX tanpa aset** | Semua efek suara disintesis langsung via WebAudio API — nol berkas audio. |
| 🎨 **Tema HUD Selam** | Design system token CSS (`src/styles/theme.css`): palet deep-navy/teal/cyan/amber/koral, font Baloo 2 + Nunito + JetBrains Mono, latar parallax laut berlapis. |

## ☁️ Database TiDB Cloud MySQL

> 🔀 **Mode data otomatis:** saat dibuka, aplikasi **mengetes koneksi ke TiDB Cloud/Aiven**
> (`/api/database-status`). Terhubung → mode **cloud**; gagal/belum dikonfigurasi → mode
> **lokal** (**localStorage + backup SQLite**) dan tes diulang berkala. Panel `/admin/`
> tetap nonaktif pada mode ini. Detail: [`docs/MODE-LOKAL.md`](docs/MODE-LOKAL.md).
> Verifikasi: `npm run test:data-mode`. Paksa lokal penuh dengan `DATA_MODE=local`.

Dukungan TiDB bersifat opsional; permainan tetap local-first. Gunakan
[`docs/TIDB-CLOUD-MYSQL.md`](docs/TIDB-CLOUD-MYSQL.md) untuk setup cluster,
TLS, environment server, autentikasi, dan deployment. Untuk Netlify, ikuti
[panduan Netlify + TiDB Cloud](docs/NETLIFY-TIDB-CLOUD.md). Skema khusus MySQL:
[`db/tidb-schema.sql`](db/tidb-schema.sql), bukan skema PostgreSQL lama.

```bash
# Setelah konfigurasi TIDB_* di .env server:
npm run db:tidb:init
npm run db:tidb:check
npm run dev:api  # terminal terpisah dari npm run dev
```

Indikator koneksi dan checklist environment tersedia pada hub/dashboard.
Panduan: [verifikasi koneksi database](docs/VERIFIKASI-KONEKSI-DATABASE.md).
Gunakan `npm run db:verify` untuk pemeriksaan read-only dari server.

Cloud produksi memerlukan identitas terverifikasi (sesi Better Auth atau
token Supabase lama). Kredensial database **jangan** dimasukkan ke variabel
`VITE_*`. Koneksi cluster asli belum diuji hanya dengan menjalankan build
aplikasi.

## 🛠️ Teknologi

- **React 19** + **TypeScript 5.9**
- **Vite 7** (build tool, `base: "./"` agar bisa ditaruh di sub-folder, mis. Laragon)
- **Tailwind CSS 4** via plugin `@tailwindcss/vite`
- Tanpa state-management eksternal — `useState` + `localStorage` namespace `codeshark:save:v1`
- Parser markdown & syntax highlighter sendiri (tanpa dependensi) di `src/lib/`

## 📁 Struktur Proyek (latihan.my.id = agregat, 3 entry)

```
├── index.html               # HUB agregat latihan.my.id → src/hub/main.tsx (HubApp)
├── codingshark/index.html   # Sub-game CodeShark (typer, dikunci shark) → src/codingshark/main.tsx
├── codingtower/index.html   # Sub-game Coding Tower (susun, dikunci tower) → src/codingtower/main.tsx
├── public/
│   ├── manifest.webmanifest # PWA agregat (ikon SVG, scope ./)
│   ├── pwa-register.js      # Registrasi SW sadar sub-folder (hub ./sw.js, sub-game ../sw.js)
│   └── icons/               # icon.svg + icon-maskable.svg (TODO: generate PNG 192/512 agar install prompt penuh)
├── content/html/            # 6 dokumen materi HTML (.md) per pertemuan P1–P6
├── src/
│   ├── App.tsx              # Router layar + prop lockedSubGame (null = agregat lama, "shark"/"tower" = entry mandiri)
│   ├── hub/HubApp.tsx       # Halaman induk: kartu 2 sub-game live + 2 slot "segera hadir"
│   ├── codingshark/main.tsx # Entry shark → <App lockedSubGame="shark">
│   ├── codingtower/main.tsx # Entry tower → <App lockedSubGame="tower">
│   ├── characters/          # Maskot hiu kapten, divers, avatar (SVG/CSS anim)
│   ├── graphics/            # Mesin latar laut: seaEngine, Ambient, layer parallax SVG
│   ├── games/tower/
│   │   ├── TowerPhysicsCanvas.tsx  # Matter.js + Canvas2D native (visual, bukan logika)
│   │   ├── TowerPixiStage.tsx      # Confetti PixiJS WebGL — lazy, skip di low-end/reduced-motion
│   │   └── TowerCreativeP5.tsx     # Playground p5.js — lazy di balik <details>, opsional
│   ├── data/
│   │   ├── modules.ts       # Definisi modul HTML/CSS/JS + konfigurasi kelompok usia
│   │   ├── curriculum.ts    # Silabus Lesson 16 pertemuan (tipe Lesson, PHASE_COLOR)
│   │   └── materiHtml.ts    # Pipeline muat ?raw .md → HTML_DOCS
│   ├── lib/
│   │   ├── markdown.ts      # Parser markdown ringan (heading/list/tabel/quote/kode)
│   │   ├── highlight.ts     # Tokenizer sintaks html/css/js
│   │   ├── audio.ts         # Synth SFX WebAudio
│   │   ├── storage.ts       # Save/load profil, XP, progres modul, statistik
│   │   ├── perf.ts          # cappedDPR / isLowEnd / reduced-motion / visibility-pause (mobile)
│   │   └── anims.ts         # Helper animejs lazy (popIn/shakeX/floatUp)
│   ├── ui/
│   │   ├── Dashboard.tsx    # Home HUD + kartu akses cepat P1–P6 + CodePanel
│   │   ├── MateriHtml.tsx   # Penampil materi HTML .md + navigasi antar dokumen
│   │   ├── Materi.tsx       # Ruang materi slide + kuis per modul
│   │   ├── Pertemuan.tsx    # Peta pertemuan 16× + sesi Quest/Drill/Juggling
│   │   ├── TypingGame.tsx   # Arena ketik inti (lazy chunk)
│   │   ├── TowerPuzzle.tsx  # Arena susun: dnd-kit bank→shaft + physics + pixi + p5 (lazy chunk)
│   │   ├── Results.tsx      # Layar hasil, rank, XP, koin
│   │   └── Onboarding.tsx   # Pembuatan profil & pemilihan usia
│   │   # lib/progress.ts   — aturan lulus, level pertemuan, gating, anti-farm XP (SATU PINTU)
│   │   # lib/typing.ts     — helper mesin ketik (lewati baris kosong, abaikan pintasan)
│   │   # data/quests.ts    — sesi Quest/Drill/Juggling per pertemuan (drill: DRILLS)
│   └── styles/theme.css     # Token warna, font, reset global
├── netlify.toml / vercel.json  # Redirect per sub-game (/codingshark/*, /codingtower/*) + cache header
└── vite.config.ts           # 3 entry hub/shark/tower + chunk game-pixi/p5/matter/dnd/anime + VitePWA
```

> Keputusan framework: **PixiJS saja (bukan Konva)** untuk FX tower — WebGL batch 60fps di HP; Konva (scene-graph Canvas2D) lebih berat untuk partikel. **p5.js hanya lazy** di playground kreatif agar bundle inti tetap kecil (game-p5 688KB & game-pixi 822KB tidak ikut first-paint; hub cuma ~8KB + react). **animejs** dipakai via helper lazy `lib/anims.ts`.

## 🚀 Menjalankan

Prasyarat: **Node.js ≥ 20**.

```bash
# 1. Instal dependensi
npm install

# 2. Mode pengembangan — hub agregat di http://localhost:5173
npm run dev
#    Sub-game: buka http://localhost:5173/codingshark/ atau /codingtower/

# 3. Build produksi → dist/ (hub + 2 sub-folder + SW PWA)
npm run build

# 4. Pratinjau hasil build (cek /, /codingshark/, /codingtower/, /sw.js)
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

- Skor/karakter: `10 × (1 + 0.02 × min(combo, 100))` (pengali ×1–×3) + 3 bila WPM live ≥ 40; setiap baris selesai +40
- Milestone combo 25/50/75/100/150 → bonus bertingkat; baris sempurna +80 & +2 HP
- Overdrive penuh → skor ×2 selama 8 detik
- Bintang misi: akurasi ≥95% = ★★★ · ≥85% = ★★ · lainnya ★ (hanya bila kode selesai)
- Pangkat XP (`RANKS`): Plankton → Ikan Kecil (120) → Kuda Laut (280) → Lumba-Lumba (500) → Hiu Muda (800) → Megalodon (1200) → Legenda Samudra (1700)
- XP sesi menang: `50 + 25×bintang + akurasi/5`; sesi kalah: `skor/25`. Hanya **selisih di atas XP terbaik sesi** yang masuk ke profil (anti-farm; berlaku juga untuk koin). Tingkat kesulitan mengikuti kelompok usia pemain (Kadet–Academy)

## 🧭 Quest · Drill · Juggling (per pertemuan)

| Sesi | Isi | Target lulus | Level |
|---|---|---|---|
| **Quest** | Kode utuh pertemuan | akurasi ≥ 90% | Perunggu |
| **Drill** | Baris pendek sintaks inti (ancaman hiu lebih lambat) | akurasi ≥ 90% | Perak |
| **Juggling** | Drill pertemuan dianyam dengan drill pertemuan sebelumnya sebahasa (ancaman lebih cepat) | akurasi ≥ 85% | Emas |

- Pertemuan *n+1* terbuka setelah pertemuan *n* mencapai **Perak**.
- Lulus = menyelesaikan kode **dan** akurasi memenuhi target sesi.
- Daftar drill dan tugas tiap pertemuan: [`KURIKULUM-QUEST-16-PERTEMUAN.md`](./KURIKULUM-QUEST-16-PERTEMUAN.md). Analisis dan perubahan v0.4: [`ANALISIS-v0.4.md`](./ANALISIS-v0.4.md).

## ☁️ Deploy

Siap pakai untuk dua platform (konfigurasi sudah ada di repo):

- **Netlify** — `netlify.toml`: build `npm run build`, publish `dist`, SPA fallback `/* → /index.html`, cache immutable untuk `/assets/*`.
- **Vercel** — `vercel.json`: framework `vite`, rewrites serupa.

Alternatif statis: jalankan `npm run build` lalu unggah isi `dist/` ke hosting apa pun.

## 📄 Lisensi & Credit

Proyek privat (`"private": true`). Aset visual tema (maskot hiu, HUD) dibuat khusus untuk CodeShark Academy. Detail desain & analisis mekanik permainan: lihat [`ANALISIS.md`](./ANALISIS.md) dan [`SPESIFIKASI-UIUX-v0.3.md`](./SPESIFIKASI-UIUX-v0.3.md).

### Halaman admin: diagnostik & tes koneksi

Halaman `/admin/` bersifat **khusus admin** dan **tidak memengaruhi jalannya aplikasi**: fungsinya hanya melihat status dan mengetes koneksi **TiDB Cloud MySQL, Aiven (MySQL/PostgreSQL), Better Auth MariaDB, dan Redis cache** — termasuk latensi dan checklist environment. Antarmukanya berada di repo ini (entry terpisah `dist/admin/`), sedangkan pengujian dijalankan **backend serverless** (`/api/database-status` publik untuk tes awal, `/api/admin-diagnostics` terotorisasi admin/token untuk tes mendalam) — tidak perlu server backend terpisah. Editor pengaturan website lama tidak lagi ditautkan dari halaman ini. Panduan deploy Netlify/Vercel + Redis: [`docs/DEPLOY-NETLIFY-VERCEL.md`](docs/DEPLOY-NETLIFY-VERCEL.md); mode data: [`docs/MODE-LOKAL.md`](docs/MODE-LOKAL.md).

### Better Auth (utama) + Supabase Authentication (legacy)

> 🔐 **Login email/password sekarang memakai Better Auth** dengan database
> MariaDB Layerbase yang terpisah dari TiDB/Aiven. Akun bersifat opsional:
> tamu lokal tetap didukung, sedangkan progres cloud tetap mengikuti tes
> awal database game. Panduan lengkap env, skema `user/session/account/
> verification`, plugin admin, migrasi, dan deploy: [`docs/BETTER-AUTH-LAYERBASE.md`](docs/BETTER-AUTH-LAYERBASE.md).

Supabase Google OAuth dipertahankan sebagai jalur legacy bila mode efektif
cloud dan `VITE_SUPABASE_*` terkonfigurasi. Backend masih menerima JWT
Supabase lama di samping cookie sesi Better Auth. Detail jalur lama:
[Supabase Auth](docs/SUPABASE-AUTH.md).
