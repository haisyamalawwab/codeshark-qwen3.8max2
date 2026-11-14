# 054 — Catatan Implementasi MVP: The AI-Trap & Production Crisis Simulator

> Disimpan: 13-11-2026 22:50 WIB (+07).
> Branch kerja: `arena/25443d5c-codeshark-qwen3-8max2` (dari `main` @ `a3d2d87`).
> Status: **MVP selesai dan sudah diuji; belum di-commit.**
> Rancangan: `docs/053_…`. Dokumen ini mencatat apa yang benar-benar dibangun,
> keputusan yang berubah dari rancangan, dan apa yang sudah serta belum diverifikasi.

---

## 1. Ringkasan

Modul Tahap 1 – Pemicu sekarang berjalan di CodeShark sebagai **Simulasi Krisis
Produksi**: dua babak, 5–7 menit.

- **Babak 1 (3 menit).** Murid menerima satu berkas HTML + CSS + JS yang disebut
  hasil asisten AI. Berkas itu memuat 4 cacat. Murid memperbaikinya di editor
  polos, menjalankannya, dan membaca pesan error asli dari browser.
- **Babak 2.** Layar diagnosis: putar ulang ketikan, perbandingan dengan AI, peta
  panas keyboard, angka pendukung, lalu pembongkaran keempat cacat.

Wajib satu kali untuk kelompok **Academy** sebelum latihan pertama, opsional untuk
**Senior Diver** lewat kartu di Dashboard, dan tidak tampil untuk Kadet/Ranger.

## 2. Keputusan (jawaban pengguna atas butir terbuka di 053)

| Butir | Keputusan | Wujud di kode |
|---|---|---|
| Bahasa skenario | HTML, CSS, dan JS | Satu dokumen campuran per skenario; cacat tersebar di ketiga bahasa |
| Nada | Tajam-faktual, provokasi lebih kuat | Semua angka hasil ukur; kalimat paling keras hanya muncul pada hasil `gagal` |
| Angka pembanding AI | Diserahkan ke saya | Rentang, bukan angka pasti; lihat bagian 5 |
| Perekaman | Log telemetri, rekaman ketikan, riwayat | 10 percobaan tersimpan, log ketikan mentah untuk 5 terbaru, bisa diunduh |
| Pembongkaran jebakan | Wajib | Bagian "Cermin 5" di akhir diagnosis |

## 3. Yang berubah dari rancangan 053

1. **Eksekusi kode memakai iframe ter-sandbox, bukan Web Worker.** Skenario
   memuat HTML dan CSS, sehingga butuh DOM sungguhan. Iframe memakai
   `sandbox="allow-scripts"` tanpa `allow-same-origin`: kode murid tidak bisa
   membaca localStorage atau halaman induk. Batas waktu 2,5 detik; kode yang
   memuat `for/while/do` tidak dijalankan (skenario tidak membutuhkannya).
2. **`AiTrapChallenge.tsx` dilebur ke `AiTrapModule.tsx`** (pengarahan, hitung
   mundur, arena, riwayat).
3. **Efek domino dihitung per identitas temuan, bukan selisih jumlah.** Versi
   awal menjumlah kenaikan jumlah temuan sintaks. Uji browser menunjukkan
   kelemahannya: menulis `{{` menghapus dua error lama dan membuat satu error
   baru, jadi jumlahnya turun dan kerusakan baru itu tidak terhitung. Sekarang
   yang dihitung adalah temuan yang belum ada di snapshot sebelumnya
   (kode awal → tiap Jalankan → kode akhir).
4. **"Beku" di putar ulang memakai definisi yang sama dengan metrik**: diam ≥ 5
   detik setelah aksi pertama. Waktu membaca di awal tidak lagi diberi label
   "MEMBEKU".
5. **Deteksi perangkat memakai `lacksPhysicalKeyboard()`, bukan
   `isTouchDevice()`.** `isTouchDevice()` menganggap laptop berlayar sentuh
   sebagai perangkat sentuh, sehingga murid Academy dengan laptop seperti itu
   akan lolos dari simulasi. Fungsi baru hanya mengecualikan HP dan tablet tanpa
   pointer presisi.
6. **Latar laut dimatikan selama arena berjalan.** Lihat bagian 6.

## 4. Peta berkas

| Berkas | Isi |
|---|---|
| `src/data/aiTrapScenarios.ts` | 2 skenario (`keranjang`, `suka`), 4 jebakan per skenario, pemeriksaan produksi, aturan usia |
| `src/data/aiBenchmark.ts` | Satu-satunya tempat angka pembanding AI |
| `src/lib/trapLint.ts` | Pemeriksa struktur HTML/CSS/JS tanpa dependensi (dasar efek domino) |
| `src/lib/trapMetrics.ts` | Format rekaman, metrik, jadwal putar ulang, pemangkasan riwayat; murni, tanpa DOM |
| `src/lib/trapRunner.ts` | Eksekutor iframe ter-sandbox |
| `src/ui/AiTrapModule.tsx` | Pengarahan → hitung mundur → arena → diagnosis; mode riwayat |
| `src/ui/AiTrapDiagnostic.tsx` | Babak 2 (lima "Cermin") |
| `src/ui/KeyboardHeatmap.tsx` | Keyboard QWERTY di layar |
| `src/ui/AiTrapCard.tsx` | Kartu Dashboard |
| `tests/ai-trap.test.mjs` | 26 uji (`npm run test:trap`) |

Berkas lama yang disentuh: `src/App.tsx` (layar `trap`, gerbang di
`enterPractice`), `src/ui/Dashboard.tsx` (kartu), `src/lib/storage.ts`
(`SaveData.aiTrap`), `src/lib/device.ts` (`lacksPhysicalKeyboard`),
`src/graphics/Ambient.tsx` (kelas `ambient-root`), `src/ui/ui.css` (blok
`.trap-*`), `package.json` (`test:trap`).

## 5. Angka pembanding AI dan asumsinya

Disimpan di `src/data/aiBenchmark.ts` dan selalu ditampilkan bersama asumsinya:

- Waktu: **"hitungan detik"**.
- Biaya: **"di bawah Rp 100"** per permintaan.
- Dasar: ±500 token per permintaan, tarif API publik hingga ±US$10 per juta
  token, kurs ±Rp 16.500. Hasil hitungnya ±Rp 80, dibulatkan ke atas.

Ini **perkiraan kasar orde besaran, bukan kutipan tarif resmi**. Tarif dan kurs
berubah; sebelum dipakai di kelas, cocokkan dengan tarif penyedia yang berlaku
dan ubah berkas itu bila perlu. Saya sengaja memakai rentang: angka pasti seperti
"Rp 50" atau "3 detik" tidak bisa dipertanggungjawabkan.

Satu hal lagi tentang kejujuran naskah: layar pembongkaran menyatakan bahwa kode
itu **bukan keluaran AI sungguhan** dan keempat cacatnya ditanam tim CodeShark.

## 6. Temuan saat pengujian

- **Animasi mengganggu alat ukur.** Di Chromium tanpa GPU, arena hanya dirender
  ±2 frame per detik. Penyebabnya dua: latar laut beranimasi (sudah ada sejak
  dulu; Dashboard pun ±1 fps di lingkungan yang sama) dan animasi `box-shadow`
  pada titik "insiden" yang saya tambahkan. Karena modul ini mengukur jeda antar
  tombol, render yang tersendat akan mencemari hasil di laptop lemah. Perbaikan:
  latar laut disembunyikan selama arena (`html.trap-live`), dan animasi diganti
  ke `transform`/`opacity`. Hasil: ±50 fps di lingkungan yang sama.
- **`execCommand('insertText')` tidak memicu `beforeinput`**, jadi sisipan dari
  skrip atau ekstensi lolos dari pemblokiran tempel. Sekarang ditangkap di event
  `input`: sisipan lebih dari 2 karakter sekaligus dikembalikan dan dicatat.
  Undo/redo dan komposisi IME dikecualikan.

## 7. Verifikasi

Dijalankan pada 13-11-2026 22:50 WIB:

| Pemeriksaan | Hasil |
|---|---|
| `npm run lint` (`tsc --noEmit`) | bersih |
| `npm run test:trap` | 26 lulus, 0 gagal |
| `npm run build` | berhasil; chunk `AiTrapModule` 40,6 kB (13,5 kB gzip), dimuat malas |
| `test:local-mode`, `test:profile`, `test:boot-loading` | 6, 13, 3 lulus |

Uji alur di Chromium headless (dev server, 1366×820):

| Skenario | Hasil |
|---|---|
| Academy menekan tombol latihan | dialihkan ke pengarahan; tombol mulai nonaktif sampai keyakinan dipilih |
| Tempel dan sisipan skrip | ditolak dan tercatat |
| Perbaikan sebagian lalu Akhiri | `PRODUKSI MASIH DOWN`, 2/4, tombol lumpuh `{ [ ( >` sesuai jeda yang disengaja |
| Keempat cacat diperbaiki lalu Jalankan | selesai otomatis, `PRODUKSI PULIH`, 3/3 pemeriksaan |
| Tidak menyentuh apa pun sampai 180 detik (jam dipalsukan) | `PRODUKSI TETAP DOWN`, `endedBy: timeout` |
| Menulis `{{` lalu Jalankan | efek domino = 1 |
| Setelah diagnosis | lanjut ke latihan reguler; setelah muat ulang tidak digerbang lagi |
| Riwayat | daftar percobaan, unduh JSON (±11 kB per percobaan), ulangi memberi skenario lain |
| XP | 30 pada percobaan pertama, tetap 30 pada percobaan kedua |
| Senior / Ranger / Kadet | kartu tampil untuk Senior saja; tidak ada yang digerbang |
| Academy di HP | kartu tampil tanpa tombol mulai; tidak digerbang |
| Academy di laptop layar sentuh (ditiru) | digerbang seperti desktop |

**Belum diverifikasi:**

- Belum dicoba oleh murid sungguhan. Ambang 2 detik dan 5 detik, batas 3 menit,
  dan tingkat kesulitan skenario masih asumsi rancangan.
- Hanya diuji di Chromium. Firefox dan Safari belum.
- Sinkronisasi TiDB dengan data `aiTrap` belum diuji ke server sungguhan.
  Ukurannya kecil (±5 kB untuk 2 percobaan; batas payload 1 MB) dan tidak butuh
  perubahan skema, tetapi jalurnya belum dijalankan.
- Tata letak keyboard selain QWERTY-US tidak dipetakan di peta panas.
- Pembaca layar belum diuji; yang ada baru jalur penangguhan aksesibilitas.

## 8. Batasan yang perlu diketahui pengajar

- Pemblokiran tempel adalah pagar kelas, bukan pengawas ujian. Murid yang
  membuka DevTools bisa melewatinya.
- Jeda di peta panas menunjukkan **di mana** jari berhenti, bukan **mengapa**.
  Teks di layar memakai rumusan "konsisten dengan", bukan diagnosis.
- Hasil simulasi tidak memengaruhi nilai, rank, atau koin.

## 9. Lanjutan yang disarankan

1. Uji coba dengan 3–5 mahasiswa; sesuaikan ambang dan batas waktu dari datanya.
2. Tambah skenario ketiga dan keempat supaya pengulangan tidak mudah dihafal.
3. Rekap kelas untuk dosen (agregat anonim dari berkas telemetri).
4. Uji di Firefox dan Safari.
