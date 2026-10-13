# 002 — Improvement Home HUD UI/UX sesuai referensi `home_hud.jfif`

> Disimpan: 06-10-2026 18:09. Mencakup seluruh pekerjaan sesi redesign layar home (onboarding).

---

## 1. Konteks awal

Pengguna meminta improvement UI/UX layar home (onboarding) agar menyerupai gambar referensi `home_hud.jfif` (mockup 900×502) yang menampilkan:

- **Kolom kiri**: badge brand pill kecil, judul besar ("sambil **berburu skor**" dengan aksen amber bergaris bawah), paragraf deskripsi, 3 kartu fitur glassmorphism (ikon dalam tile cyan), dan maskot hiu penyelam/robot berkacamata selam cyan di kiri bawah.
- **Kolom kanan**: panel onboarding bergaya **bingkai HUD sci-fi** — border cyan menyala, bracket sudut, notch diagonal — berisi label "NAMA PANGGILAN", input neon, "LEVEL TANTANGAN" grid 2×2 (kartu terpilih ber-border amber + glow + radio), baris toggle "Efek suara game", CTA gradien cyan bersudut terpotong, dan caption localStorage.
- **Latar**: berkas cahaya (god rays) dari permukaan laut, rumput laut, gelembung, ikan kecil.

Kondisi kode sebelumnya: `Onboarding.tsx` sudah punya struktur dua kolom dan konten yang sama, tetapi panel kanan masih pakai `.panel` polos (rounded rect tanpa aksen HUD), input & toggle bergaya datar, CTA rounded biasa (`.btn-primary`), maskot masih bermata polos, dan kelas `.ray` di `graphics.css` **tidak pernah dirender** oleh `Ambient.tsx`.

## 2. Perubahan yang diterapkan

| Berkas | Perubahan |
|---|---|
| `src/ui/ui.css` | Blok gaya HUD baru: `.hud-panel` (bracket L di 4 sudut via 8 `background-image` gradien + notch diagonal pojok kanan-atas via `::after` + glow border), `.hud-tick` (dua tick dekoratif tepi atas), `.hud-input` (neon: border cyan, inner glow, glow lebih kuat saat fokus), `.radio`/`.radio-dot` (radio bulat ber-glow `currentColor`), `.hud-toggle` (switch gradasi teal + knob animasi), `.btn-hud` (CTA clip-path polygon sudut kiri-atas & kanan-bawah terpotong 16px, gradien cyan→teal, glow via `filter: drop-shadow` karena clip-path memotong box-shadow) |
| `src/ui/Onboarding.tsx` | Panel kanan diubah ke `.hud-panel` + 2 `.hud-tick`; judul panel diberi penanda wajah HUD (belah ketupat teal menyala); input pakai `.hud-input` + counter `n/16` + `Enter` untuk submit + `autoFocus` + `autoComplete`/`spellCheck` off + `htmlFor`/`id`; grid level jadi `role="radiogroup"` dengan tombol `role="radio"` + `aria-checked`, radio `.radio`/`.radio-dot`, kartu terpilih diberi `boxShadow` glow warna aksen grup usia; baris suara: ikon dalam tile rounded (teal saat on, redup saat off) + `.hud-toggle` dengan `role="switch"` + `aria-label`; CTA memakai `btn btn-hud`; brand header diubah jadi chip pill kecil (ikonsirip + titik teal `glow-pulse`) sesuai badge referensi; spacing diringkas agar muat viewport 768px: `py-10→py-6`, `mt-7→mt-6`, maskot `w-56 md:w-72 → w-52 md:w-64`, padding panel `md:p-8→md:p-7`, margin label/toggle/CTA `-4px`, caption `mt-3→mt-2`; kartu fitur kiri diberi hover lift (`hover:-translate-y-px`) |
| `src/characters/SharkMascot.tsx` | Mata polos diganti **kacamata selam**: tali band gelap `M38 61 C56 54 74 54 90 60 L90 76 C74 81 56 81 38 75 Z` (dipastikan di dalam siluet badan — di x=38 tepi atas badan berada di y≈59–60 menurut kurva bezier badan), frame lensa r=17 + kaca gradien `gGoggle` (#8ff2ff→#1596c4) + kilau elips putih + titik pantul; ditambah 3 baut vent robot di badan bawah; gradien `gGoggle` ditambahkan ke `<defs>` |
| `src/graphics/Ambient.tsx` | Merender 4 berkas cahaya (kelas `.ray` yang selama ini ada di CSS tapi tak pernah dipakai) di atas lapisan jauh, sebelum hiu: posisi `left` 10%/32%/56%/79%, lebar 90–190px, durasi 10–14s, delay negatif agar acak sejak frame pertama |
| `src/graphics/graphics.css` | `.ray` dipertajam: gradien `rgba(140,228,255,0.2)` (dari 0.13), tinggi `85vh` (dari 80vh), blur 8px (dari 6px) |

## 3. Catatan teknis penting

- **Glow di tombol ter-clip-path**: `clip-path` memotong `box-shadow`, jadi `.btn-hud` memakai `filter: drop-shadow(...)` yang bekerja setelah clipping. Hover menaikkan brightness + drop-shadow.
- **Bracket 4 sudut tanpa elemen ekstra**: `.hud-panel` menyusun 8 gradien `linear-gradient` (2 per sudut) di atas gradien body panel melalui `background-image/size/position` — bracket harus didaftar *sebelum* gradien body agar tampil di atasnya.
- **Interaksi toggle & radio memakai semantik ARIA**: `role="switch"`/`aria-checked` untuk suara, `role="radiogroup"`+`role="radio"` untuk level — nama grup dirujuk via `aria-labelledby="hud-level-label"`.
- **Warna aksen kartu level tetap dari `AGE_GROUPS[id].accent`** (junior=amber, teen=teal, senior=cyan, academy=mint), konsisten dengan token `--accent` per kelas `age-*` di `theme.css`.

## 4. Verifikasi

- `npm run build` lolos (final: CSS 54.59 kB, JS app 96.16 kB, vendor 192.35 kB).
- Diuji visual & fungsional di Chrome (dev server port 5199, viewport 1366×638):
  - State awal: bingkai HUD, bracket, notch, tick, rays, chip brand, input neon dengan karet fokus — sesuai referensi.
  - Klik "Kadet Samudra" → kartu ber-border amber + glow + radio amber (persis referensi); isi nama "Raka" → CTA menyala penuh bersudut terpotong.
  - Enter di input → masuk dashboard "PETA MISI • RANGER LAUT / Kapten Raka" (alur `createProfile` utuh).
  - Mobile 390px: satu kolom, panel HUD tetap utuh.
- Setelah pengujian: `localStorage.clear()`, file screenshot sementara dihapus, dev server dimatikan, build produksi dijalankan ulang.
- Tinggi halaman turun 822px → 761px sehingga muat tanpa scroll di layar 768px.

## 5. Sengaja tidak dikerjakan / tindak lanjut

- **`dashboard_hud.jfif`** — tampak sebagai referensi redesign Dashboard (HUD "SCORE / LEVEL / LIVES / WPM"); belum disentuh, menunggu permintaan.
- Scanline halus di dalam panel HUD dipertimbangkan lalu di-skip (risiko ramai; bracket + tick + glow sudah cukup).
- Antena/kabel robot tambahan pada maskot di-skip agar SVG tetap bersih.
- Gambar `Gemini_Generated_Image_sv4x6xsv4x6xsv4x.jfif` di root ternyata konsep scene game (bukan aset home) dan tidak dipakai.
