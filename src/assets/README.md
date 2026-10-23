# src/assets — Aset Live (dibundel Vite)

Hanya file di sini yang ikut `npm run build` → `dist/assets/img/`.
Setiap gambar wajib WebP + PNG fallback (atau SVG untuk latar).

```
src/assets/
  characters/  shark-captain.{webp,png}  shark-cyber.{webp,png}
  hud/         hud-checkpoint.*  hud-station-uas.*  hud-concept.{jpg,webp}
               hud-sprite-isolated.* (KANONIK 4×3)  hud-sprite-wide.*  hud-atlas-cs.*
  stations/    dome-gold.*  dome-crystal.*  coral-cluster.*  lab-station.*  shark-side.*
  sea/         sea-far.svg  sea-mid.svg  sea-near.svg
  badges/      badges-enabled.{webp,png}  badges-disabled.{webp,png}
               manifest.json (17 badge × 2 status; sel 256px)
```

Aturan:
1. Jangan taruh mentahan AI di sini — ke `docs/reference-images/`.
2. Jangan duplikat file (cek SHA256). Kanonik sprite: `hud-sprite-isolated`.
3. Import via TS (`import x from "@/assets/...`" atau relatif), bukan path string.
4. `assetsInlineLimit: 0` — semua tetap file terpisah (lihat `vite.config.ts`).
