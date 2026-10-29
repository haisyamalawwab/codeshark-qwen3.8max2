# 049 — Halaman Khusus MatchingShark untuk MK Rekayasa Perangkat Lunak

Tanggal: 2026-10-29 08:16 WIB
Status: selesai secara lokal pada branch
`arena/4d55ecf3-codeshark-qwen3-8max2`; belum commit/push saat dokumen
ini ditulis. Branch berangkat dari `main` setelah PR #9 (materi/aset
RPL) dan PR #10 (kesiapan database, profil, dan membership) digabungkan.

## Permintaan

Melanjutkan pembuatan **halaman khusus MatchingShark** untuk
**MK Rekayasa Perangkat Lunak (Software Engineering)**, mengikuti arah
yang telah disepakati sebelumnya: game berbasis **semantic matching
artefak engineering** dan **simulasi Agile Scrum**, bukan halaman
materi pasif dan bukan game mengetik istilah.

## Keputusan ruang lingkup

Halaman ini adalah **campaign konsep + demo mini**, bukan implementasi
game penuh:

- URL `/matchingshark/` disiapkan sebagai rumah jangka panjang
  MatchingShark mengikuti pola `/codingshark/` dan `/codingtower/`.
- MatchingShark **belum didaftarkan sebagai sub-game live** pada
  `src/data/subgames.ts` atau site settings, sehingga tidak dihitung
  sebagai arena aktif dan tidak dapat dinonaktifkan/diaktifkan seolah
  sudah playable.
- Demo tidak menulis localStorage/database dan tidak mengubah XP,
  koin, badge, achievement, streak, membership, atau progres
  CodeShark/Coding Tower.
- Rancangan game penuh tetap memakai scope terpisah
  `rpl:matching-shark`, agar fokus pada MK RPL tidak tercampur dengan
  achievement MK/game lain.

## Yang dibuat

### Entry khusus `/matchingshark/`

- `matchingshark/index.html` — metadata Bahasa Indonesia untuk
  MatchingShark, MK RPL, SDLC, Scrum, UML, dan pengujian.
- `src/matchingshark/main.tsx` — entry React mandiri.
- `src/matchingshark/MatchingSharkPage.tsx` — halaman lengkap:
  - hero dengan key visual Kapten Hiu dan papan Scrum artefak;
  - penjelasan **“MatchingShark untuk apa?”**: melatih keputusan
    Software Engineering dengan menghubungkan kebutuhan, model,
    desain, Sprint, dan pengujian;
  - nilai untuk mahasiswa, dosen/asisten, dan pembelajar mandiri;
  - **demo interaktif empat pasangan** (rekayasa kebutuhan, use case,
    boundary value analysis, Sprint Planning) dengan hint, percobaan,
    XP demo visual, reset, dan penjelasan alasan pada setiap pasangan;
  - loop Sprint lima tahap: Planning → Daily Scrum → Build/Model/Test
    → Review → Retrospective;
  - ilustrasi meter konsep Trust, Quality, Capacity, dan Tech Debt;
  - peta **enam pulau P1–P6** sesuai enam pertemuan `content/rpl/`;
  - posisi materi sebagai Codex/micro-briefing;
  - rencana gamifikasi khusus RPL (XP delta-above-best, badge artefak,
    token terpisah yang namanya belum difinalkan);
  - FAQ status dan CTA ke Hub/CodeShark/Coding Tower.

### Navigasi utama Hub

`src/hub/HubApp.tsx` kini memiliki:

- chip header **Matching** → `./matchingshark/`;
- tautan konsep "Matching Artefak RPL" pada hero;
- banner campaign besar MatchingShark dengan gambar utama, penjelasan
  singkat, CTA Jelajahi MatchingShark, dan CTA langsung ke
  `./matchingshark/#demo`;
- daftar arsitektur/rute yang menyertakan `/matchingshark/`;
- status jujur **Segera hadir** dan catatan bahwa banner ini bukan
  sub-game live.

### Aset visual

Dua key visual baru dibuat mengikuti identitas bawah laut CodeShark
lalu dioptimalkan dengan Sharp:

| Aset | Format yang dilayani halaman | Ukuran |
|---|---|---:|
| `src/assets/matchingshark/matching-hero.jpg` | JPG fallback | 273 KiB |
| `src/assets/matchingshark/matching-hero.webp` | WebP utama dalam `<picture>` | 157 KiB |
| `src/assets/matchingshark/matching-cast.png` | PNG fallback | 304 KiB |
| `src/assets/matchingshark/matching-cast.webp` | WebP utama dalam `<picture>` | 84 KiB |

Seluruh **12 ilustrasi JPG materi RPL** yang sudah digabungkan melalui
PR #9 dipakai ulang: enam sebagai gambar utama pulau P1–P6 dan enam
sebagai strip Codex. Gambar di bawah hero memakai lazy loading.

### Routing dan build

- `vite.config.ts`: entry `matchingshark` + allowlist fallback PWA.
- `netlify.toml`: redirect `/matchingshark/*` ke
  `/matchingshark/index.html`.
- `vercel.json`: rewrite setara sebelum catch-all.
- `docker/nginx/default.conf.template`: `location /matchingshark/`.

## Validasi yang dijalankan

- `npm run lint` — lolos setelah membersihkan tiga ikon tak terpakai.
- `npm run build` — lolos; menghasilkan `dist/matchingshark/index.html`,
  chunk `matchingshark-*.js`, aset `matching-*`, dan 12 aset `rpl-*`.
- `npm run test:settings` — 12/12.
- `npm run test:netlify` — 7/7.
- `npm run test:boot-loading` — 3/3.
- Dev server Vite pada `0.0.0.0:3000`: `GET /`, `/matchingshark/`,
  `/matchingshark/index.html`, `/codingshark/`, dan `/codingtower/`
  seluruhnya HTTP 200; modul `MatchingSharkPage.tsx` ter-transform
  tanpa error dan memuat bagian konsep/demo/Sprint/pulau.
- Dua key visual baru diperiksa secara visual. Hero masih memuat
  dekorasi pseudo-biner kecil khas hasil generatif, tetapi tidak ada
  teks promosi yang dimaksudkan untuk dibaca sebagai copy halaman.

## Batas dan langkah berikut

Game penuh belum dimulai. Keputusan desain yang masih perlu difinalkan
sebelum implementasi gameplay/progres:

1. nama token khusus RPL;
2. tangga rank dan katalog badge final;
3. model hint dan hukuman percobaan;
4. jumlah misi authored per pulau untuk MVP P1–P3;
5. skema penyimpanan scoped `rpl:matching-shark` dan cara
   menghubungkannya ke profil/membership tanpa mencampur progres MK
   lain.

Setelah keputusan tersebut, tahap berikutnya adalah PRD/SRS/design/task
terbaru pada lineage dokumen saat ini, lalu implementasi board matching
React DOM dengan data misi tervalidasi.
