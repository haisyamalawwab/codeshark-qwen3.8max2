# Sprite Isolated HUD Map — CodeShark

**Tanggal:** 15 Oktober 2026
**Sumber:** `buat_white_isolated_background_sprite_20261014205159.png` (1376×768, RGBA, grid 4×3 = 12 sel)
**Ruang lingkup:** aset sprite HUD, `hud-map.css`, `HudMap.tsx`. Murni visual; tidak mengubah logika gameplay/progress.

---

## 1. Peta sel sprite (kolom × baris, `background-size: 400% 300%`)

| Sel | Posisi | Isi | Kelas semantik |
|-----|--------|-----|----------------|
| A1 | `0% 0%` | Kubah emas (MISI 01) | `.spr-iso-dome-gold` |
| B1 | `33.333% 0%` | Kubah neon (UTS) | `.spr-iso-dome-neon` |
| C1 | `66.666% 0%` | Stasiun teknologi (UAS) | `.spr-iso-station` |
| D1 | `100% 0%` | Hiu | `.spr-iso-shark` |
| A2 | `0% 50%` | Gembok pink | `.spr-iso-lock` |
| B2 | `33.333% 50%` | Badge `1` | `.spr-iso-badge-1` |
| C2 | `66.666% 50%` | Badge `12` terkunci | `.spr-iso-badge-12` |
| D2 | `100% 50%` | Badge `16` terkunci | `.spr-iso-badge-16` |
| A3 | `0% 100%` | Badge `8` UTS | `.spr-iso-badge-8` |
| B3 | `33.333% 100%` | Logo Codeshark Academy | `.spr-iso-logo` |
| C3 | `66.666% 100%` | Tombol Main Shark Typer | `.spr-iso-btn-shark` |
| D3 | `100% 100%` | Tombol Main Tower | `.spr-iso-btn-tower` |

Sel asli 344×256 px (rasio 4/3) — semua kontainer memakai `aspect-ratio: 4 / 3` agar tidak melar.

---

## 2. Aset (`src/assets/hud/`)

| File | Ukuran | Keterangan |
|------|--------|------------|
| `hud-sprite-isolated.png` | 174.314 B (1376×768) | Salinan master 1:1 dari sumber |
| `hud-sprite-isolated.webp` | 156.358 B | Hasil `sharp` `{ quality: 82, effort: 6 }` |
| `hud-sprite-icons.png` / `.webp` | sama dengan di atas | Di-upgrade dari 1024×572 ke master baru (alias fallback, layout sel identik) |

Pemakaian 1 request HTTP per sheet via `image-set(webp, png)`.

---

## 3. CSS (`src/ui/hud-map.css`)

- Blok baru `.spr-iso` + 12 kelas posisi (`.spr-iso-a1`…`.spr-iso-d3`) + 12 alias semantik (tabel §1).
- Varian tampilan: `.building`, `.badge`, `.btn-art`, `.logo-chip` (58 px), `.lock-chip` (26 px), `.hudmap-iso-row` (flex + gap 8 px).
- Legacy `.spr-shark` / `.spr-lock` / `.spr-logo` dialihkan ke `hud-sprite-isolated.*` (lebih tajam, backward-compatible).

---

## 4. Pemakaian di `src/ui/HudMap.tsx`

- **MISI 01:** `spr-iso-dome-gold` (ganti `spr-dome-gold` sheet lama) + strip `badge-1` & `shark`.
- **MISI 02 · UTS:** cutout dipertahankan + strip `dome-neon` & `badge-8`.
- **UAS:** tag `🔒` → `spr-iso-lock lock-chip` + strip `station` & `badge-16`.
- **Node terkunci (1–16):** emoji `🔒` → `<span class="spr spr-lock sm">`.
- **Kartu arena:** header CodeShark + `logo-chip`; header Tower + `badge-12`; visual `btn-shark` / `btn-tower` dari sprite di atas tombol aksesibel (teks tombol tetap untuk a11y/i18n).
- Paragraf `.hudmap-ref` diperbarui menunjuk sheet kanonik + dimensi.

---

## 5. Verifikasi

```bash
npm run build   # ✓ built in ~10 dtk, PWA precache OK
```

- `dist/assets/img/hud-sprite-isolated-*.png` (170,2 KB) + `.webp` (152,7 KB) ter-emit; CSS hasil bundle memuat seluruh kelas `.spr-iso-*`.
- `hud-sprite-icons.*` tidak lagi dibundel (CSS tidak merujuknya) — tetap ada di `src` sebagai fallback/cache lama.

---

## 6. Catatan

- Trek paralel di repo yang sama (`hud-atlas-cs`, `AtlasSprite.tsx`, emblem `TypingGame.tsx`) tidak disentuh; build lolos bersama.
- File sumber di root (`buat_white_isolated_background_sprite_*.png`) tetap ada sebagai master; boleh dipindah ke arsip bila ingin tree ramping.
