# 009 — Re-organisasi Aset Gambar

**Tanggal:** 15-10-2026 21:09
**Build:** ✅ 10.61s, precache 55 entries (4885.54 KiB) — turun dari 57 / 5164.79 KiB

## Struktur Baru

```
src/assets/               # LIVE — dibundel Vite → dist/assets/img/
  characters/  shark-captain.{webp,png}  shark-cyber.{webp,png}
  hud/         hud-checkpoint.*  hud-station-uas.*  hud-concept.{jpg,webp}
               hud-sprite-isolated.* (KANONIK)  hud-sprite-wide.*  hud-atlas-cs.*
  stations/    dome-gold.*  dome-crystal.*  coral-cluster.*  lab-station.*  shark-side.*
  sea/         sea-far.svg  sea-mid.svg  sea-near.svg
  README.md
docs/reference-images/    # ARSIP — tidak dibundel
  buat_*.png (3)  Gemini_*.{jpg,png,jfif} (4)  upscale_*.png (2)
  home_hud* (3)  dashboard_hud.jfif  captainshark/cybershark/mascot (3)
  .zcode-shot-*.png (2)  sea-habitat-bg.svg (orphan)  README.md
```

## Dihapus / Dipindah

- Duplikat SHA256 sama: `hud-sprite-icons.*` == `hud-sprite-isolated.*` == `buat_...05159.png` → sisakan kanonik isolated.
- Mati: `hud-sprite-main.*` + CSS `.spr-dome-gold` (tak dipakai, HudMap pakai `spr-iso-*`). Hemat ±285KB source, −279KB precache.
- Orphan: `sea-habitat-bg.svg` (Ambient hanya far/mid/near) → arsip.
- Root 0 file gambar (was 19, ±9MB) → `docs/reference-images/`.
- `src/graphics/assets/` dihapus (kosong). `src/characters/*.png|webp` dipindah ke `src/assets/characters/`.

## Import Diperbarui

- `characters/CaptainAvatar.tsx`, `SharkMascot.tsx`: `./shark-*` → `../assets/characters/shark-*`
- `graphics/stations.tsx`: `./assets/stations/*` → `../assets/stations/*`
- `graphics/Ambient.tsx`: `./assets/sea-*` → `../assets/sea/sea-*`
- `ui/hud-map.css`: header didokumentasi ulang, blok `.spr-dome-gold` dihapus
- `ui/HudMap.tsx`: komentar header disingkat

## Verifikasi

- [x] Root bebas gambar loose
- [x] `src/assets` 29 gambar + 1 README (30 file)
- [x] Tidak ada referensi `hud-sprite-main|hud-sprite-icons` di TS/CSS
- [x] `npm run build` lolos, dist bebas sprite-main/icons
