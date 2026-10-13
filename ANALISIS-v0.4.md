# Analisis Kritis CodeShark — v0.4

Dasar: pembacaan kode di branch `arena/74f6c760-codeshark-qwen3-8max2` (basis `af187d7`). Setiap temuan menyebut bukti (file/baris atau perilaku yang diverifikasi). Bagian "Status" menjelaskan apakah temuan sudah diperbaiki di perubahan ini.

## 1. Pemetaan kondisi awal

| Area | Kondisi sebelum v0.4 | Bukti |
|---|---|---|
| Misi ketik | 3 misi: `html`, `css`, `js` (`MODULES`) | `src/data/modules.ts` |
| Silabus | 17 entri (dinomori ulang `.map`), UI & README menulis 16 | `curriculum.ts` akhir file; `README.md` baris 7 |
| Materi HTML | 6 dokumen `.md` (P1–P6), dirender parser sendiri | `content/html/*.md`, `src/data/materiHtml.ts` |
| Peta pertemuan | `Pertemuan.tsx` **tidak di-import** oleh siapa pun | `grep` impor: hanya `App.tsx` → `MateriHtml`, tidak ada `Pertemuan` |
| Latihan per pertemuan | Pertemuan dipetakan ke misi `html/css/js` (kartu nama, dll.) | `MateriHtml.tsx` `PracticeCard` → `getModule(modId).code` |
| Progres | `modules[id]` (materi, best, completions) + XP/koin | `src/lib/storage.ts` |
| Test otomatis | Tidak ada (`package.json` tanpa script test) | `package.json` |
| Dependensi di Git | `node_modules/` (2.634 berkas) & `dist/` (7 berkas) ter-track; `.gitignore` hanya `dist/` | `git ls-files` |

## 2. Temuan kritis

### P0 — Harus diperbaiki

**2.1 Misi JS tidak bisa diselesaikan (engine macet di baris kosong).**
- Bukti: `jsCode` di `modules.ts` memiliki baris kosong (indeks 3 dan 9). `tokenize()` menghasilkan `[]` untuk baris kosong. Di `TypingGame` lama, `const tok = line[gg.charIdx]` lalu `tok.ch` → `TypeError` setiap tombol ditekan ketika `lineIdx` berada di baris kosong. Penyelesaian baris hanya terjadi saat tombol cocok, jadi baris kosong tidak pernah terlewati.
- Dampak: 1 dari 3 misi tidak bisa tamat; mahasiswa kehilangan nyawa dan melihat "HIU MENYERANG" berulang tanpa penjelasan.
- Status: **Diperbaiki.** `skipBlank()` (`src/lib/typing.ts`) melompati baris kosong setelah setiap baris selesai dan saat hitung mundur berakhir. Diuji: simulasi ketik sempurna untuk semua sesi (lihat §5).

**2.2 Latihan "per pertemuan" tidak mengetik kode pertemuan itu.**
- Bukti: `MateriHtml.PracticeCard` memanggil `onPractice(modId)` dengan `modId` = `html/css/js`. `App.enterPractice` → `getModule(id).code`. Kode `l.practice.code` hanya ditampilkan sebagai teks pengantar, tidak pernah diketik. Pernyataan UI "Mesin ketik dipakai dengan potongan kode pertemuan ini" tidak benar.
- Dampak: materi dan latihan terpisah; target pembelajaran per pertemuan tidak terukur.
- Status: **Diperbaiki.** Setiap pertemuan kini punya sesi `q:<no>:quest` yang mengetik `practice.code` pertemuan itu (`src/data/quests.ts`).

**2.3 Anti-farm XP tidak diimplementasikan.**
- Bukti: `finishPractice` (versi lama) menjumlahkan `xpGained` pada setiap percobaan tanpa perbandingan dengan rekor. README (`README.md` lama baris 20 & 101) dan `ANALISIS.md` menyatakan "hanya delta terhadap skor terbaik".
- Dampak: satu misi bisa diulang tanpa batas untuk XP dan koin.
- Status: **Diperbaiki.** `applyAttempt()` (`src/lib/progress.ts`) hanya memberi selisih di atas `xpBest`/`coinsBest` yang tersimpan. Diuji: replay identik = 0 XP; peningkatan = selisih saja.

**2.4 Silabus tidak konsisten: 17 entri vs 16 pertemuan.**
- Bukti: `CURRICULUM` berisi 17 entri (HTML 6, UTS 1, CSS 4, jembatan 1, JS 4 termasuk DOM, UAS 1). README dan judul UI menulis 16. Pada satu semester 16 minggu, UAS di minggu 17 berada di luar jadwal.
- Status: **Diperbaiki (keputusan dapat dibalik).** Panduan UAS digabung ke pertemuan 16 "DOM, Event & Mini App (Gladi UAS)". Fase final: HTML 1–6 · UTS 7 · CSS 8–11 · Jembatan 12 · JS 13–15 · UAS/DOM 16.

### P1 — Perbaikan penting

**2.5 Kode "Peta Pertemuan" mati dan akan crash bila diaktifkan.** `Pertemuan.tsx` lama memakai `companion()` → `h0`, `c0`, `j0`, `h5`, `j3`, yang tidak ada di `MODULES` (hanya `html`, `css`, `js`). `MODULES.find(...)!` akan menghasilkan `undefined` lalu `mod.lang` melempar error.
- Status: **Ditulis ulang dan disambungkan** ke tombol "Peta Pertemuan 16×" di Dashboard.

**2.6 Tombol pintasan dihitung sebagai ketikan salah.** Handler `keydown` lama memanggil `preventDefault()` untuk setiap `e.key` berpanjang 1, termasuk Ctrl+R/Ctrl+C/⌘+T. Efeknya: pintasan browser terblokir dan kesalahan bertambah.
- Status: **Diperbaiki.** `isShortcut()` (`src/lib/typing.ts`) mengabaikan Ctrl/⌘/Alt, kecuali AltGr.

**2.7 Statistik palsu di Dashboard.** `save.stats.bestWpm || 20`, `bestCombo || 40`, akurasi kosong = `100%`, dan fallback `4453 poin` / `20 WPM` pada kartu misi. Pemain baru melihat angka yang tidak pernah dicapai.
- Status: **Diperbaiki.** Nilai kosong ditampilkan sebagai `—`; fallback 0.

**2.8 README mengklaim fitur yang tidak ada.** "Rank S/A/B/C (akurasi ≥97% & HP ≥70)" tidak ada di kode; rumus skor di README (`combo/12`) tidak sama dengan kode (`0.02 × combo`). Kode yang ada: bintang ★ berdasarkan akurasi dan pangkat XP (`RANKS`).
- Status: **README disinkronkan dengan kode.**

**2.9 Kuis di peta hanya placeholder.** `QuizBlock` lama berisi teks "Soal lengkap ada di Ruang Materi" dan tombol tanpa fungsi.
- Status: **Diperbaiki.** Kuis kini interaktif (pilih, lihat benar/salah, penjelasan).

**2.10 Dev server ditolak host preview (HTTP 403).** Vite memblokir `*.e2b.app`.
- Status: **Diperbaiki (khusus dev).** `server.allowedHosts` di `vite.config.ts`; build tidak berubah.

### P2 — Catatan / rekomendasi (belum dikerjakan)

**2.11 `node_modules/` dan `dist/` ter-track di Git.** `git ls-files` menunjukkan 2.634 berkas di `node_modules/`. Setiap `npm ci` atau `npm run build` mengubah banyak berkas dalam diff. Ini perubahan repo-wide, jadi tidak saya lakukan dalam PR ini. Rekomendasi: `git rm -r --cached node_modules dist` lalu tambahkan `node_modules/` ke `.gitignore`.

**2.12 Tidak ada test otomatis.** Verifikasi di §5 dijalankan sebagai skrip sementara. Rekomendasi: tambahkan Vitest untuk `lib/progress.ts`, `lib/typing.ts`, dan `data/quests.ts`.

**2.13 Progres hanya di `localStorage`.** Dosen tidak bisa melihat progres mahasiswa. Rekomendasi: ekspor JSON/CSV per profil (`saveData`) dan rekap level per pertemuan.

**2.14 Migrasi save lama.** Profil lama tidak memiliki `xpBest`. Replay pertama setelah update akan memberi XP penuh sekali, lalu anti-farm berlaku. Ini disengaja (tidak ada data untuk menghitung selisih).

**2.15 WPM bersifat kotor (gross).** `wpm = correct/5/menit` tanpa penalti kesalahan. Untuk pemula ini masih dapat dibaca, tetapi "WPM bersih" (benar − salah) lebih jujur sebagai ukuran kemajuan. Belum diubah agar hasil lama tidak berubah makna.

## 3. Kekuatan desain yang dipertahankan

- Loop "baca → ketik → lihat preview" sudah tepat untuk HTML/CSS/JS. Preview iframe `sandbox="allow-scripts"` menjaga kode mahasiswa tetap terisolasi.
- Ancaman hiu sebagai timer waktu-nyata memberi tekanan tanpa menghapus materi. Pengali per kelompok usia (`AGE_GROUPS`) dipertahankan.
- Materi HTML dalam `.md` memudahkan dosen menyunting tanpa menyentuh React.
- Skor/combo dan bintang berbasis akurasi (bukan kecepatan saja) sesuai untuk tahap pemula.

## 4. Perubahan v0.4 (ringkas)

| Berkas | Perubahan |
|---|---|
| `src/data/quests.ts` (baru) | Sesi per pertemuan: Quest (kode pertemuan), Drill (`DRILLS`, 16 set), Juggling (anyaman drill dengan pertemuan sebahasa sebelumnya). Target: 90/90/85%. |
| `src/lib/progress.ts` (baru) | Aturan lulus, level Perunggu/Perak/Emas, gating (Perak membuka berikutnya), XP/koin selisih terbaik. |
| `src/lib/typing.ts` (baru) | `skipBlank`, `isShortcut` (murni, dapat diuji). |
| `src/ui/TypingGame.tsx` | Lewati baris kosong; abaikan pintasan; pengali ancaman per mode; label sesi & target di header. |
| `src/ui/Results.tsx` | Status LULUS/BELUM LULUS; catatan XP jujur (0 bila tidak melampaui rekor). |
| `src/App.tsx` | Sesi dipetakan lewat `getSession`; `finishPractice` memakai `applyAttempt`; peta pertemuan dibuka dari Dashboard. |
| `src/ui/Pertemuan.tsx` | Ditulis ulang: status 16 pertemuan, tiga kartu sesi, kuis interaktif. |
| `src/ui/MateriHtml.tsx` | Kartu latihan membuka Quest/Drill/Juggling pertemuan itu, bukan misi generik. |
| `src/ui/Dashboard.tsx` | Kartu "Peta Pertemuan 16×"; placeholder statistik diganti `—`. |
| `src/data/curriculum.ts` | 16 pertemuan (P16 = DOM + UAS); latihan UTS (P7) ditambahkan. |
| `src/lib/storage.ts` | `ModProg`: `passed`, `xpBest`, `coinsBest` (opsional, kompatibel mundur). |
| `KURIKULUM-QUEST-16-PERTEMUAN.md` (baru) | Dokumen per pertemuan: quest, drill, juggling, tugas, kriteria. Drill dihasilkan dari kode. |
| `README.md` | Fitur, struktur, rumus skor, pangkat, dan aturan Quest/Drill/Juggling disinkronkan. |
| `vite.config.ts` | `server.allowedHosts` untuk preview; tidak memengaruhi build. |

Keputusan yang bisa dibalik: (a) 16 pertemuan dengan UAS digabung ke P16; (b) target 90/90/85%; (c) gating di Perak; (d) juggling dianyam dengan pertemuan sebahasa terdekat.

## 5. Verifikasi

Yang dijalankan:
- `npx tsc --noEmit` → lulus.
- `npm run build` → lulus.
- `vite` dev server: semua modul yang diubah merespons 200 (tidak ada error transform).
- SSR smoke test (render ke string) untuk Dashboard, Pertemuan (P1, P2, P3, P7, P16), MateriHtml (P4), TypingGame (quest, juggling, misi JS), dan Results (lulus/gagal). Teks status LULUS/BELUM LULUS dan kunci pertemuan muncul sesuai data.
- Skrip logika (360 asersi, lulus semua):
  - 16 pertemuan berurutan; 48 sesi (16 × 3) ada dan tidak kosong.
  - **Simulasi ketik sempurna untuk setiap sesi memakai `tokenize` + `skipBlank` asli**: tidak ada sesi yang macet.
  - Pasangan juggling dan jumlah baris anyaman.
  - Misi lama (html/css/js) tetap terbaca.
  - Pintasan Ctrl/⌘ diabaikan; AltGr tidak.
  - XP: percobaan pertama memberi XP; replay identik = 0; peningkatan = selisih; akurasi 89% tidak lulus.
  - Gating dan level: Perunggu → Perak (membuka P2) → Emas.

Yang **belum** diverifikasi:
- Interaksi nyata di browser (klik, suara WebAudio, animasi, layout HP). Tidak ada browser headless di sandbox ini. Perlu uji manual: satu sesi JS penuh (sebelumnya macet) dan satu juggling.
- Efek migrasi pada profil lama dengan data nyata.

## 6. Roadmap berikutnya

1. **Uji pilot (1–2 minggu):** 5 mahasiswa, catat tingkat tamat sesi per pertemuan. Jika Quest > 30% gagal di pertemuan tertentu, turunkan target atau pecah drill.
2. **Dasbor dosen:** ekspor CSV (nama, pertemuan, level, akurasi, WPM, waktu).
3. **Bersihkan Git:** keluarkan `node_modules/` dan `dist/` dari indeks.
4. **Vitest** untuk `progress`, `typing`, dan `quests`; jalankan di CI.
5. **Mode juggling real-time (opsional):** dua "hiu" paralel dengan kode berbeda, bukan anyaman statis.
6. **Net WPM:** `(benar − salah) / 5 / menit`, ditampilkan berdampingan dengan gross.
