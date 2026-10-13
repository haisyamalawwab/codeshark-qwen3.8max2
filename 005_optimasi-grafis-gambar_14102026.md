# Optimasi Grafis & Gambar — CodeShark

**Tanggal:** 14 Oktober 2026  
**Ruang lingkup:** aset gambar karakter, referensi HUD, engine latar laut (`seaEngine` + `Ambient`), atribut loading anti-CLS.

---

## Ringkasan perubahan

1. **Kompresi aset produksi** (PNG + WebP karakter hiu)
2. **Referensi HUD / konsep** dikonversi ke WebP ringan (dari JFIF 1.7–2.5 MB)
3. **Engine laut** memakai `cappedDPR` + deteksi low-end + `imageSmoothingQuality: "high"`
4. **Bubble & plankton** dikurangi otomatis di perangkat low-end
5. **Komponen maskot** mendapat `width`/`height` intrinsik + prop `loading`

Semua perubahan murni visual/performa; tidak mengubah logika gameplay.

---

## 1. Ukuran aset sebelum → sesudah

| Aset | Sebelum | Sesudah | Δ |
|------|---------|---------|---|
| `src/characters/shark-cyber.png` | 273 KB | **99 KB** | −64 % |
| `src/characters/shark-cyber.webp` | 67 KB | **69 KB** | ~sama (quality 82) |
| `src/characters/shark-captain.png` | 114 KB | **41 KB** | −64 % |
| `src/characters/shark-captain.webp` | 32 KB | **34 KB** | ~sama |
| `home_hud_small.png` (referensi) | 951 KB | **220 KB** | −77 % |
| `home_hud_small.webp` (baru) | — | **45 KB** | — |
| `home_hud.jfif` → `.webp` | 1.98 MB | **145 KB** | −93 % |
| `dashboard_hud.jfif` → `.webp` | 1.71 MB | **104 KB** | −94 % |
| `Gemini_*.jfif` → `gemini_concept.webp` | 2.46 MB | **180 KB** | −93 % |
| `captainshark.png` / `cybershark.png` (root) | 38/86 KB | **41/99 KB** | selaras dengan src |

Total hemat di tree produksi (karakter saja) ≈ **250 KB** tanpa loss visual yang berarti.

---

## 2. `seaEngine.ts`

- Import `cappedDPR`, `isLowEnd`, `prefersReducedMotion` dari `src/lib/perf.ts`.
- Context 2D: `imageSmoothingEnabled = true`, `imageSmoothingQuality = "high"`.
- DPR: `cappedDPR(lowEnd ? 1.25 : 1.75)` (sebelumnya hard-coded 1.5).
- Dense schools (4 kawanan) **hanya** bila bukan low-end.
- Plankton: max 40 (low-end) / 90 (normal); density lebih jarang di low-end.

---

## 3. `Ambient.tsx`

- Jumlah bubble: 8 (low-end) / 18 (normal) — mengurangi CSS animation cost di mobile kentang.

---

## 4. Komponen karakter

- `SharkMascot` & `CaptainAvatar`: prop `loading` (default `"lazy"`), `width`/`height` intrinsik untuk mencegah CLS, komentar ukuran terbaru.

---

## 5. File baru / referensi

- `home_hud.webp`, `dashboard_hud.webp`, `gemini_concept.webp`, `home_hud_small.webp` — siap dipakai di README / dokumen desain.
- JFIF asli tetap ada (jika masih dibutuhkan sebagai master); bisa dihapus dari repo bila ingin tree lebih ramping.

---

## Verifikasi yang disarankan

```bash
npm run build
# Cek ukuran chunk di dist/assets
# Buka DevTools → Network → filter Img: pastikan .webp dilayani
# Throttle CPU 4× + device memory low → pastikan bubble/ikan berkurang
```

---

## Sengaja tidak disentuh

- SVG lapisan laut (`sea-*.svg`) sudah ringan (<17 KB) dan animasi internal sudah hormati `prefers-reduced-motion`.
- Ikon PWA sudah kecil.
- Tidak menambahkan dependensi image pipeline (sharp hanya dipakai offline untuk optimasi ini).
