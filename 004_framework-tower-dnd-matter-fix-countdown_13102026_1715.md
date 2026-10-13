# 004 — Keputusan Framework, Dnd-kit + Matter.js, & Fix Countdown Nyangkut

> **Tanggal:** 13-10-2026 17:15 +0700 · **Repo:** CodeShark Academy (`qwen3.8max2`, Vite 7 + React 19 + TS 5.9 + Tailwind 4)
> **Tujuan file:** memori konteks untuk agentic-AI lain / proses selanjutnya. Melanjutkan
> `003_konteks-tower-subgame_13102026_1714.md` (WS-1–WS-4) — file ini mencatat diskusi framework,
> keputusan final user, eksekusi instalasi, scaffold yang sudah dibuat, dan bugfix countdown.
> Baca kedua file (003 + 004) untuk konteks penuh.

---

## 1. Diskusi framework gaming browser (Q&A, ringkas)

**Pertanyaan user:** jadikan CodeShark framework gaming browser sendiri? Pakai Phaser 2D atau lainnya? Perlu framework existing?

**Keputusan yang disepakati:**

1. **JANGAN jadikan CodeShark framework generik sekarang.** Ini game edukasi + edtech app (DOM: input keyboard, iframe preview, markdown), bukan engine. Mengekstrak framework prematur = maintenance mahal.
2. **JANGAN pakai Phaser untuk core typing/tower.** Core di `src/ui/TypingGame.tsx` / `src/ui/TowerPuzzle.tsx` adalah DOM + keyboard + `src/lib/*`, bukan sprite/physics/particle. Phaser menambah ~1MB bundle, merusak aksesibilitas input teks, dan memaksa bridge React HUD ↔ canvas.
3. **Hybrid bila butuh arcade:** React tetap shell (HUD, XP, save, SFX); canvas engine hanya di satu route mini-game (`new Phaser.Game()` + `destroy()` saat unmount).
4. **Kalau mau reusable-kit nanti,** ekstrak yang sudah ada jadi paket, bukan tulis engine baru:
   `save ← src/lib/storage.ts`, `audio ← src/lib/audio.ts`, `typing ← src/ui/lib/typing.ts`,
   `xp ← src/lib/progress.ts`, `sea ← src/graphics/`.

**Matriks kapan pakai apa:**

| Kebutuhan | Rekomendasi |
|---|---|
| Typing / kuis / materi `.md` / susun blok edukasi | Tetap React DOM, tanpa framework game |
| Mini-game arcade real-time (runner, shooter) | Phaser 3 khusus di layar itu saja |
| Efek visual / particle laut berat | PixiJS (renderer saja, UI tetap React) |
| 3D bawah laut | Three.js |
| Prototipe cepat untuk anak SD, API simpel | Kaboom.js |

**Tower builder puzzle HTML (dua tipe, solusi beda):**

- **Tipe A — susun blok tag HTML edukasi (`<div>+<p>+<img>` jadi menara):** puzzle logika + drag-drop. TIDAK perlu game engine. React + CSS + `dnd-kit`.
- **Tipe B — fisika susun-balok jatuh (Tower Bloxx / Stack):** perlu physics. Urutan ringan→berat: (1) **Matter.js + Canvas 2D native ±87KB (pilihan utama)**, (2) Phaser 3 + Matter bawaan bila butuh scene/level/particle (±1MB), (3) LittleJS <100KB alternatif loop murni. Jangan Three.js/Babylon untuk ini.

**Keputusan final user:** ✅ *tetap React tanpa framework baru, tambah `dnd-kit` dan `matter-js` canvas 2D native.*

---

## 2. Eksekusi sesi ini (yang sudah dilakukan)

### 2.1 Instalasi dependensi (sudah ter-commit, `9d90c6c`)

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities matter-js
npm install -D @types/matter-js
```

`package.json` sekarang memuat: `@dnd-kit/core ^6.3.1`, `@dnd-kit/sortable ^10.0.0`,
`@dnd-kit/utilities ^3.2.2`, `matter-js ^0.20.0`, `@types/matter-js ^0.20.2` (dev).

### 2.2 Scaffold baru: `src/games/tower/TowerPhysicsCanvas.tsx` (untracked saat 004 ditulis — WAJIB commit)

- Visual fisika menara, **bukan pengganti logika puzzle**: `floors = placed.length`, `threat 0–100` menggoyang menara via `engine.gravity.x` berosilasi.
- Matter.js `Engine` + **custom draw Canvas 2D native** (sengaja TIDAK pakai `Matter.Render` agar gaya HUD Tailwind tetap).
- Sinkron jumlah body dengan `floors` (tambah dari bawah / buang dari atas), ground + dinding statis, cleanup `Engine.clear` + `cancelAnimationFrame` saat unmount.
- Props: `{ floors: number; threat: number; height?: number }` (default 132).
- **Status: file jadi, tapi BELUM dirender di `TowerPuzzle.tsx`.** Agen berikutnya tinggal import + pasang di atas `.tower-shaft`.

### 2.3 Scaffolding Dnd di `src/ui/TowerPuzzle.tsx` (ter-commit sebagian — BELUM dipakai di JSX)

Yang sudah ditambah (kode ada, belum di-wire ke render):

- Import: `DndContext, PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors` + tipe `DragEndEvent` + `TowerPhysicsCanvas`.
- Komponen `DragBlock` (draggable bank + fallback ketuk via `onTap`) dan `ShaftDrop` (droppable `id="shaft"`).
- `sensors` (mouse jarak 6px; sentuh tahan 180ms/toleransi 8 agar scroll tetap enak) dan handler `onDragEnd` (drop di shaft → `tap(item)`).
- Import tipe `CSSProperties, ReactNode` (perbaikan agar tidak bergantung namespace global `React`).

**PERINGATAN untuk agen berikutnya:** `sensors`, `onDragEnd`, `DragBlock`, `ShaftDrop`, `TowerPhysicsCanvas` saat ini **unused di JSX** (sengaja dibiarkan non-aktif agar tidak mengganggu bugfix countdown). Jangan hapus — lanjutkan wiring: bungkus grid bank dengan `<DndContext sensors={sensors} onDragEnd={onDragEnd}>`, render tiap item via `<DragBlock>`, bungkus `.tower-shaft` dengan `<ShaftDrop>`, tambah `<TowerPhysicsCanvas floors={placed.length} threat={threat} />` di atas shaft. `npm run build` tetap lolos dalam kondisi ini (Vite tidak gagal karena unused vars).

### 2.4 Bugfix: overlay nyangkut setelah hitungan 3-2-1 (ter-commit, `e54244c`)

- **Gejala (laporan user + screenshot):** setelah countdown Tower Lv1 selesai, overlay gelap (`TOWER LV1 • TAHAP 1 / Susun 10 blok dalam 2 tahap`) tidak hilang; game tidak bisa dimainkan.
- **Akar masalah** (`TowerPuzzle.tsx` effect countdown lama): timer penyembunyi GO (`setShowGo(false)` 850ms) dibuat di dalam effect yang sama dengan countdown. Saat `count === 0` → `setStatus("play")` → render ulang → **cleanup effect menjalankan `clearTimeout` dan membunuh timer GO** → `showGo` tetap `true` selamanya → kondisi overlay `(status === "count" || showGo)` selalu benar.
- **Perbaikan:** pisah jadi dua effect — (1) countdown 3→0 (saat 0: set `startAt`, `status play`, `sfx.go()`, `setShowGo(true)`, return tanpa timer); (2) effect khusus `showGo` yang menyembunyikan setelah 850ms. Pola yang sama diterapkan ke `src/ui/TypingGame.tsx` (efek countdown `MULAI!`) sebagai pencegahan.
- **Tambahan:** `startFromBrief` dan `retry` di TowerPuzzle kini me-reset `setShowGo(false)` sebelum mulai hitungan baru.
- **File diubah:** `src/ui/TowerPuzzle.tsx` (+20/-5), `src/ui/TypingGame.tsx` (+11/-3) pada commit `e54244c`.

### 2.5 Verifikasi

- `npm run build` (Vite 7.3.2) → **OK**, 80 modul, `dist/` ter-generate (`index-DljDN6gV.js` 217KB, vendor 200KB).
- `git log` relevan: `020ffe8` tower mode → `5d6797f` arena hub → `07fba96` level tower → `9d90c6c` deps dnd/matter → `e54244c` fix GO timer → `180e583` rebuild dist.
- Manual test yang diminta ke user: refresh dev server, main Tower Lv1, pastikan 3-2-1 → `SUSUN!` ±0.8 dtk → masuk `play`. (Belum ada automated test di repo.)

---

## 3. TODO untuk agen / proses selanjutnya

- [ ] **Commit `src/games/tower/TowerPhysicsCanvas.tsx`** (masih untracked) + file 004 ini.
- [ ] Wire Dnd + canvas fisika ke JSX `TowerPuzzle` seperti §2.3; pastikan tap tetap jalan (fallback) dan drag 6px / long-press 180ms tidak merusak scroll bank di HP.
- [ ] Uji regresi countdown di kedua arena (Tower `SUSUN!`, Typer `MULAI!`) termasuk path `retry` dan `startFromBrief`.
- [ ] Pertimbangkan `touch-action: manipulation` / `overscroll-behavior` pada bank agar drag vs scroll tidak konflik.
- [ ] Lanjutan dari 003 §5 (roboh-berdiri animation, potong cerdas P6–P7 30+ lantai, preview pasangan CSS/JS, haptik `navigator.vibrate`, sinkron `PlayMode` vs `SubGameId`, kontras `mod.color` di briefing putih, analitik Tower vs Typer).

---

## 4. Konvensi wajib (diwarisi 003 + tambahan sesi ini)

1. Satu pintu hasil: semua mode → `GameResult` → `App.finishPractice` → `applyAttempt`. Dilarang jalur XP kedua.
2. Jangan pecah progres/XP per arena.
3. Tema gelap = CodeShark, terang = Tower (scope `.tower-light`).
4. Bank blok pakai `tokenizeLine`; cocokkan blok duplikat per teks.
5. `dnd-kit` hanya untuk interaksi bank→shaft; logika benar/salah tetap `tap()`. Matter.js hanya visual; kebenaran tetap state `placed`.
6. Setiap perubahan: `npm run build` (wajib lolos); `npx tsc --noEmit` bila menyentuh tipe.
