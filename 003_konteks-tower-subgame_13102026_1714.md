# 003 — Konteks Sesi: Tower Puzzle Mobile, Hub Sub-Game & Light Theme

> **Tanggal:** 13-10-2026 17:14 (UTC) · **Repo:** CodeShark Academy (`qwen3.8max2`, Vite + React 19 + TS + Tailwind 4)
> **Tujuan file:** memori konteks untuk agentic-AI lain / proses selanjutnya. Berisi arsitektur,
> semua perubahan sesi ini, keputusan desain, dan TODO lanjutan.

---

## 1. Gambaran Proyek (state awal sesi)

- **CodeShark Academy v0.1 (MVP)** — belajar HTML/CSS/JS lewat gamifikasi. Progres di `localStorage`
  (`codeshark:save:v1`), XP/koin anti-farm via selisih hasil terbaik (`lib/progress.applyAttempt`).
- **Satu-satunya gameplay:** `TypingGame` (ketik kode persis, butuh keyboard fisik) — menyiksa di HP.
- **Kurikulum:** 16 pertemuan (`data/curriculum.ts`), tiap pertemuan 3 sesi ketik
  (`data/quests.ts`: `quest` ≥90% · `drill` ≥90% · `juggle` ≥85%).
  Level pertemuan: Perunggu (quest) → Perak (quest+drill, buka P berikutnya) → Emas (+juggle).
- **Satu pintu hasil:** semua mode game wajib menghasilkan `GameResult` (tipe di `ui/TypingGame.tsx`)
  lalu lewat `App.finishPractice` → `applyAttempt`. **Jangan bikin jalur XP kedua.**

---

## 2. Pekerjaan Sesi Ini (4 workstream, semua ter-build)

### WS-1 — Mode Susun Menara untuk mobile (tanpa keyboard)
- **File baru:** `src/lib/device.ts` (`isTouchDevice()`, `PlayMode`, `defaultMode()`),
  `src/lib/puzzle.ts` (`toBlocks`, `shuffled`, `floorWidth`), `src/ui/TowerPuzzle.tsx`.
- **Keputusan:** TIDAK perlu halaman/route baru — satu layar `game`, dua mode (otomatis per perangkat + toggle manual).
- `TowerPuzzle` meniru sistem `TypingGame`: nyawa 3, bar ancaman hiu, kombo, skor, bintang 85/95%,
  WPM diestimasi dari karakter tersusun (sebanding mode ketik). Blok duplikat dicocokkan per **teks**.
- **Diubah:** `App.tsx` (switch mode), `Pertemuan.tsx` (hint mode HP), `Dashboard.tsx` (copy HP/PC),
  `Results.tsx` ("ketikan benar" → "aksi benar"), `icons.tsx` (+`IconTower`), `ui.css` (style tower/puzzle).

### WS-2 — Hub dua sub-game (Dashboard = pemilih arena)
- **File baru:** `src/data/subgames.ts` — katalog `tower` (Coding Tower, mode susun) & `shark`
  (CodeShark/Shark Typer, mode ketik) + persistensi `codeshark:subgame:v1`.
- **Keputusan:** halaman utama BUKAN langsung game, melainkan hub "Pilih Sub-Game" (badge Aktif +
  "Disarankan di HP" untuk Tower). Satu kurikulum dipakai bersama — progres/XP/bintang/gating
  tetap satu pintu, tidak terpecah per arena.
- **Diubah:** `App.tsx` (`playMode` → state `subGame` persisten; banner game jadi pemilih arena),
  `Dashboard.tsx` (seksi hub + copy peta/misi mengikuti arena + label tombol Susun/Ketik),
  `Pertemuan.tsx` (prop `subGame`; tombol sesi Susun/Ketik; header nama arena), `ui.css` (`.arena-card`).

### WS-3 — Improvement Coding Tower HTML: tower builder + puzzle berpasangan, level bertingkat
- **File baru:** `src/data/towerLevels.ts` — ladder P1–P7 + level generik non-HTML:
  `stageSize`, `decoyCount`, `threat`, `hintLimit`/`hintCost`, `decoys` (kesalahan khas tiap pertemuan),
  helper `buildStages`, `decoysPerStage` (round-robin), `extractTag`, `tagColor`.
- `TowerPuzzle.tsx` ditulis ulang: **briefing level** (status `brief`) → countdown → main per **tahap**;
  **tab berpasangan** 🧱 Menara / 🌐 Hasil (live preview `iframe` dari `placed.join("\n")` via
  `mod.preview`, khusus `lang==="html"`); chip tag per blok & lantai; ghost lantai-berikutnya
  **bentuk tag saja** (bukan teks penuh); pengecoh ikut dihitung salah; undo lintas tahap.
- Ancaman tower: `cfg.threatRate × level.threat` (drill ×0.8, juggle ×1.25).
- `Pertemuan.tsx` SessionCard menampilkan meta tower saat arena aktif
  (`Lv X • Y lantai • Z tahap • W pengecoh`).

### WS-4 — Light theme Tower (dominan putih, aksen orange, elemen indigo)
- **Keputusan:** tema terang **hanya scope Tower** (`.tower-light` di root `TowerPuzzle`) —
  tema gelap CodeShark Typer tidak berubah.
- `ui.css`: blok `CODING TOWER LIGHT THEME` — override var (`--ink/--dim` slate,
  `--accent` orange `#f97316`, `--amber` `#d97706`, `--teal`/`--cyan`/`--coral` versi pekat),
  header/panel/chip/btn putih, `tower-floor` putih + badge nomor gradasi orange,
  `puzzle-block` border indigo-200 (hover orange), highlight sintaks `tok-*` versi terang,
  panel laut jadi gradasi langit terang (`.tower-sea`), style baru untuk
  `tower-tabs/tab-btn/stage-dots/tag-chip/ghost-next/phone-frame` (sebelumnya tanpa CSS).
- `towerLevels.ts` `tagColor()` diganti palet pekat (orange/indigo family) agar terbaca di putih.
- `TowerPuzzle.tsx`: root `tower-light`, track progres/ancaman terang, hati kosong slate-200,
  toast orange, shadow lantai via CSS, teks briefing gelap, judul menang `#5eead4` (backdrop gelap).

---

## 3. Peta File Penting (untuk agen berikutnya)

| Area | File |
|---|---|
| Entry + routing layar | `src/App.tsx` (Screen: dash/peta/materi/materi-html/game/result) |
| Hub arena | `src/ui/Dashboard.tsx`, `src/data/subgames.ts` |
| Peta 16 pertemuan | `src/ui/Pertemuan.tsx` |
| Mode ketik (gelap) | `src/ui/TypingGame.tsx` |
| Mode susun (terang) | `src/ui/TowerPuzzle.tsx` |
| Level tower HTML | `src/data/towerLevels.ts` |
| Sesi/kurikulum | `src/data/quests.ts`, `src/data/curriculum.ts`, `src/data/modules.ts` |
| Aturan progres/XP | `src/lib/progress.ts`, `src/lib/storage.ts` |
| Perangkat/mode | `src/lib/device.ts` (`PlayMode` lawas; arena aktif = `SubGameId`) |
| Syntax highlight | `src/lib/highlight.ts` (`tokenizeLine` dipakai bank blok) |
| Tema | `src/styles/theme.css` (token global), `src/ui/ui.css` (komponen + `.tower-light`) |
| SFX WebAudio | `src/lib/audio.ts` |

---

## 4. Konvensi / Batasan Wajib

1. **GameResult satu pintu** — mode baru wajib lewat `App.finishPractice`; dilarang menambah jalur XP.
2. **Jangan pecah progres per arena** (keputusan produk sesi ini).
3. **Tema gelap = CodeShark, terang = Tower** — style tower selalu dalam scope `.tower-light`.
4. Bank blok memakai `tokenizeLine` (bukan `tokenize`); blok duplikat dicocokkan per teks.
5. Verifikasi tiap perubahan: `npx tsc --noEmit` lalu `npm run build` (keduanya lolos di akhir sesi).
6. Target mobile: tombol ≥48px, `touch-action: manipulation`, tanpa keyboard fisik di Tower.

---

## 5. TODO / Ide Lanjutan (belum dikerjakan)

- [ ] Paginasi/animasi menara roboh-berdiri; efek susun per tahap lebih meriah.
- [ ] P6–P7: 30+ lantai — pertimbangkan potong cerdas (fokus semantik) selain `stageSize`.
- [ ] Mode Tower untuk CSS/JS: preview pasangan khusus (CSS → render komponen; JS → konsol mini).
- [ ] Haptik `navigator.vibrate` saat salah/benar di HP.
- [ ] Sinkronisasi `PlayMode` lawas di `device.ts` bila tak dipakai lagi (hapus atau alias `SubGameId`).
- [ ] Label fase `mod.color` (terang) kontras rendah di kartu briefing putih — gelapkan atau tambah outline.
- [ ] Analitik: rasio Tower vs Typer per pertemuan untuk tuning `towerLevels`.

---

## 6. Riwayat Verifikasi Sesi Ini

- `npx tsc --noEmit` → OK (sempat ada error `computeResult` tak terpakai & `tokenize` vs `tokenizeLine`, sudah diperbaiki).
- `npm run build` (Vite 7.3.2) → OK, `dist/` ter-generate (76 modul).
