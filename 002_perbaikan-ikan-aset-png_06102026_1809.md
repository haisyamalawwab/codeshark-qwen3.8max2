# Perbaikan Ikan Dinamis & Integrasi Aset PNG

**Tanggal:** 6 Oktober 2026, 18:09
**Ruang lingkup:** Grafis latar laut (`src/graphics/seaEngine.ts`) dan karakter hiu (`src/characters/`)

---

## Ringkasan

Dua pekerjaan besar sesi ini:

1. **Perbaikan pergerakan ikan** di kanvas latar laut — ikan kini memiliki ekor bercabang yang berayun, mata berpupil yang melirik, sirip yang mengepak, serta gerakan individu yang dinamis dan realistis.
2. **Integrasi aset PNG karakter** (`captainshark.png` dan `cybershark.png` di root proyek) — latar hijau solid dipotong transparan, lalu dipasang menggantikan maskot SVG.

Semua perubahan lolos `tsc --noEmit`, build produksi Vite, dan verifikasi visual di browser.

---

## 1. Perbaikan Ikan Dinamis — `src/graphics/seaEngine.ts`

### Anatomi ikan baru (`drawFish`)

Sebelumnya ikan hanya ellipse + ekor segitiga kaku, **tanpa mata**. Sekarang:

| Bagian | Detail |
|---|---|
| Ekor | Dua helai bercabang (quad curve) yang **berayun dari pangkalnya** dengan sudut `tail * 0.9` rad |
| Badan | Ellipse dengan sway halus berlawanan arah ekor (`-tail * s * 0.05`) |
| Gradien | Punggung gelap → perut terang (`schoolGradient`), ikut bergeser ke warna bahaya (coral) saat ancaman naik |
| Sirip punggung | Kurva quad di atas badan |
| Sirip dada | Mengepak dengan `sin(finT) * 0.38` rad, alpha 0.75 |
| Garis insang | Arc stroke di belakang mata |
| Mata | Sclera putih + pupil gelap yang **melirik ke arah acak** tiap 0.9–3.7 detik (condong ke depan) + kilau untuk ikan s > 8px |

### Pergerakan dinamis (loop `frame`)

- **Goyangan individu**: tiap ikan punya fase `wob`, frekuensi `w1/w2`, amplitudo `a1/a2` sendiri — tidak ada dua ikan yang sinkron.
- **Dart (melesat mendadak)**: tiap 3–11 detik ikan melesat dengan boost `dartV = 0.3–0.8` yang meluruh (half-life ±0.6 detik), lebih sering saat panik (threat tinggi).
- **Menghindar dari kursor**: radius `FLEE_R = 110px`, impuls berpegas kembali ke formasi (damping 0.028/frame, cap simpangan 60px).
- **Pitch badan**: kemiringan dihitung dari kecepatan sesungguhnya antar-frame (`atan2(vy*dir, |vx|+2)`, clamp ±0.55 rad, smoothing 0.18) — ikan miring naik/turun mengikuti arah renang.
- **Kibasan ekor mengikuti kecepatan**: `speedNorm` dari kecepatan kawanan + dart → frekuensi 0.16–0.47 rad/frame (±1.5–4.5 Hz) dan amplitudo membesar saat ngebut.
- **Kawanan**: pulse kruis–burst (`sin(now/5300 + speedPh)`), drift vertikal `vy0` yang memantul di batas 12%–84% tinggi layar, bob kolektif ±18px.
- **Gradien di-cache** per kawanan dan hanya dibangun ulang saat `threat` bergeser > 0.04 (hemat performa).
- Tracking kursor ditambahkan ke objek `mouse` (`px`, `py`, `touched`) — awalnya di tengah layar agar ikan tidak kabur dari (0,0).

### Hasil verifikasi

- Zoom langsung ke backing-store kanvas (crop via `drawImage` + `toDataURL` di halaman): ekor bercabang dengan sudut berbeda tiap ikan, mata putih berpupil gelap, gradien badan, variasi ukuran, dan pitch terlihat jelas.
- Dua frame berjarak 5 detik: kawanan berpindah posisi dengan formasi berubah (bukan translasi kaku) — gerakan terbukti dinamis.

> **Catatan lingkungan:** saat pengujian, jendela host minimized membuat Chromium membekukan `requestAnimationFrame` (artefak oklusi, bukan bug). Terbukti dari `rAF` yang tidak menyala meski `document.visibilityState === "visible"`. Di penggunaan normal animasi berjalan 60fps; `prefers-reduced-motion` tetap mematikan animasi seperti semula.

---

## 2. Integrasi Aset PNG Karakter

### Sumber

| File | Isi | Latar |
|---|---|---|
| `captainshark.png` (37 KB) | Hiu kapten (topi + headset + seragam navy + cincin teal) | Hijau solid |
| `cybershark.png` (85 KB) | Hiu cyber full-body berkacamata cyan | Hijau solid |

### Proses chroma-key

Dikerjakan lewat canvas di browser (halaman `about:blank`, gambar dimuat via data URL):

1. Estimasi warna latar dari rata-rata piksel tepi gambar.
2. Tiap piksel diberi alpha berdasarkan jarak Euclidean ke warna latar: `dist ≤ 42` → transparan penuh; `42–95` → alpha gradasi (anti-alias tepi).
3. Piksel semi-transparan di-*unmix* (`fg = (px - (1-α)·bg) / α`) agar tidak ada residu hijau.
4. Hasil diekspor `toDataURL("image/png")` dan disimpan via Node.

Output:
- `src/characters/shark-captain.png` (±149 KB)
- `src/characters/shark-cyber.png`

### Integrasi komponen

| Komponen | Sebelum | Sesudah | Terdampak di |
|---|---|---|---|
| `SharkMascot.tsx` | SVG hiu flat | `<img src={sharkCyber}>` | Onboarding (maskot besar), TypingGame (panel pangkalan + layar hasil) |
| `CaptainAvatar.tsx` | SVG avatar (160×160) | `<img src={sharkCaptain}>`, prop `size` tetap kompatibel | Dashboard (avatar "Kapten …") |

API kedua komponen tidak berubah (default export, `className`/`style`/`size`), sehingga semua pemakaian lama otomatis terpasang. **`BackgroundShark`** (hiu siluet ancaman di laut) sengaja tidak diubah — desainnya berbeda dan sudah terikat engine ancaman.

---

## Verifikasi

- `npx tsc --noEmit` — lolos.
- `npm run build` — lolos; aset ter-bundle (`shark-captain-*.png` 114 KB, `shark-cyber-*.png` 279 KB).
- Visual browser: maskot cyber shark di Onboarding, avatar kapten di Dashboard, hiu cyber di HUD arena ketik — semua tepi bersih tanpa latar hijau; kawanan ikan tetap berenang normal.

---

## Catatan & Status Lingkungan

- Proyek ternyata sudah direstrukturisasi (`src/components/` → `src/ui/`, `src/graphics/`, `src/characters/`); snapshot git status awal sesi sudah usang. File ikan yang live adalah `src/graphics/seaEngine.ts` (diimpor `App.tsx`).
- Profil uji **"Kapten Tester" (Ranger Laut)** tersimpan di localStorage selama verifikasi — dapat direset lewat tombol "Ganti Profil".
- Dev server verifikasi terakhir berjalan di port 5176 (`npm run dev` manual bila perlu; 5173–5175 terpakai sesi lain).
- Kursor ikan menghindar memakai koordinat `pointermove` dalam px CSS (konsisten dengan transform dpr kanvas).
