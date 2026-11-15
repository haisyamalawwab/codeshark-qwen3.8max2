# 059 — Tasklist Selanjutnya: Tahap 1 – Pemicu, Simulasi Krisis Produksi

> Disimpan: 14-11-2026 18:17 WIB (+07).
> Branch kerja: `arena/49b4581b-codeshark-qwen3-8max2` (dari `main` @ `79a66c6`).
> Status: **rencana kerja.** Bagian 2 sudah selesai; bagian 3–5 belum dikerjakan.
> Dokumen pasangan: `docs/056_…` (PRD), `docs/057_…` (Requirement), `docs/058_…` (Design).
> Diperbarui 14-11-2026 20:15 WIB: bagian 2, 4, 5.3, dan 7 untuk Tahap 3. Diperbarui lagi 14-11-2026 21:10 WIB: bagian 5.3 dan 7 mengikuti `docs/064_…`. Tasklist Tahap 3 sendiri: `docs/064_…`.

---

## 1. Cara membaca

- `[x]` selesai, `[ ]` belum.
- **Req** menunjuk ke ID di `docs/057_…`; **Desain** ke bagian `docs/058_…`.
- **Ukuran**: S = kurang dari setengah hari, M = sekitar satu hari, L = beberapa hari.
  Ini perkiraan kasar, bukan komitmen.
- **Siapa**: `kode` = bisa dikerjakan di repo; `pemilik` = butuh pemilik proyek
  atau pengajar; `keduanya` = kode menyiapkan, pemilik menjalankan.

---

## 2. Sudah selesai

| | Pekerjaan | Bukti |
|---|---|---|
| [x] | Rencana 052 (digantikan) dan 053 | `docs/052_…`, `docs/053_…` |
| [x] | F1 — pemeriksa sintaks, metrik, eksekutor, dua skenario, uji unit | PR #15 |
| [x] | F2 — Babak 1: pengarahan, editor, Jalankan, konsol, batas waktu, penolakan tempel | PR #15 |
| [x] | F3 — Babak 2: putar ulang, peta panas, perbandingan AI, pembongkaran | PR #15 |
| [x] | F4 — gerbang, penyimpanan, kartu Dashboard, penundaan di ponsel | PR #15 |
| [x] | F5 — lint, build, uji alur, README, `docs/054_…` | PR #15, gabung `11c10c1` |
| [x] | Gerbang masuk CodeShark, `docs/055_…` | PR #16, gabung `c6bc695` |
| [x] | Verifikasi ulang pada `main` @ `79a66c6`: lint bersih, 27 uji lulus, build berhasil, empat skenario alur di Chromium headless | Sesi ini |
| [x] | PRD, Requirement, Design, Tasklist | `docs/056_…`–`docs/059_…` |
| [x] | T2.8 — status di `docs/054_…` dan `docs/055_…` diperbarui | Sesi ini |
| [x] | Naskah dan rencana modul Tahap 3 – Aksi | `docs/060_…` |

---

## 3. R2 — validasi dan kalibrasi

Urutan di bawah adalah urutan kerja yang disarankan.

| | ID | Pekerjaan | Req | Desain | Ukuran | Siapa | Selesai bila |
|---|---|---|---|---|---|---|---|
| [ ] | T2.1 | Perbaiki pemalsuan vonis: `pulih` mensyaratkan pemeriksa statis setuju; token pemantau tidak terbaca | V-09 | §8.1 | S | kode | Skrip pemalsu tidak menghasilkan `PRODUKSI PULIH`; uji unit dan uji browser menjaganya |
| [ ] | T2.2 | Uji tiap skenario dengan bentuk perbaikan lain yang sah; longgarkan `fixed()` bila ada yang tertolak | V-09 | §8.1 | S | kode | Tiap bentuk sah menghasilkan `pulih` |
| [ ] | T2.3 | Pindahkan uji alur browser ke `scripts/test-trap-browser.mjs` + skrip `test:trap:browser` | V-02 | §8.2 | M | kode | Satu perintah menjalankan semua skenario alur |
| [ ] | T2.4 | Uji jalur yang belum diuji: gerbang Coding Tower dan ulangi dari sana; pindah tab mengurangi waktu; ganti usia ke Academy di halaman profil | V-01 | §8.2 | S | kode | Hasil tertulis untuk tiap jalur; cacat yang ditemukan diperbaiki |
| [ ] | T2.5 | Uji masuk lewat akun dan sinkron cloud dengan data `aiTrap` | V-01 | §7 | M | keduanya | Percobaan muncul di perangkat kedua setelah masuk akun. Butuh server dan kredensial |
| [ ] | T2.6 | Periksa situs produksi memuat modul ini | V-04 | — | S | pemilik | Profil Academy baru di situs tayang disambut simulasi |
| [ ] | T2.7 | Uji manual di Firefox dan Safari dengan daftar periksa bagian 6 | V-03 | §12 | S | pemilik | 12 butir lulus atau cacatnya tercatat |
| [x] | T2.8 | Perbarui status `docs/054_…` dan `docs/055_…` | V-08 | — | S | kode | Selesai |
| [ ] | T2.9 | Tambah tanggal acuan ke `AI_BENCHMARK` dan tampilkan | V-07 | §8.4 | S | keduanya | Tanggal tampil di Cermin 2. Menunggu O2 |
| [ ] | T2.10 | Simpan ambang yang dipakai di tiap percobaan | V-06 | §8.3 | S | kode | Percobaan baru memuat `thresholds`; percobaan lama tetap terbaca |
| [ ] | T2.11 | Uji coba dengan 3–5 mahasiswa; kumpulkan berkas telemetri dan catatan pengamatan | V-05 | §8.3 | M | pemilik | Berkas dan catatan terkumpul |
| [ ] | T2.12 | Kalibrasi ambang dan batas waktu dari data; catat keputusan di dokumen baru | V-06 | §8.3 | S | keduanya | Tiap konstanta dipertahankan atau diubah dengan alasan tertulis |

**Ketergantungan:** T2.1 → T2.2. T2.3 sebelum T2.4. T2.1, T2.6, dan T2.7
sebelum T2.11. T2.10 sebelum T2.11 supaya data uji coba memuat ambangnya.
T2.11 → T2.12.

**Gerbang rilis R2:** T2.1–T2.7 selesai sebelum modul dipakai di satu kelas.

---

## 4. R3 — konten dan diagnosis

| | ID | Pekerjaan | Req | Desain | Ukuran | Siapa | Selesai bila |
|---|---|---|---|---|---|---|---|
| [ ] | T3.1 | Simpan `baseline` (percobaan pertama tanpa log) di luar daftar 10 percobaan | C-02 | §9.2 | S | kode | Percobaan pertama tetap ada setelah percobaan ke-11; data lama dimigrasi saat dibaca |
| [ ] | T3.2 | Blok "dibanding percobaan pertamamu" di diagnosis | C-02 | §9.2 | M | kode | Tampil pada percobaan ulang saja; menyebut bila skenarionya berbeda |
| [ ] | T3.3 | Skenario ke-3 | C-01 | §9.1 | M | kode | Lulus semua uji skenario dan satu putaran alur di browser |
| [ ] | T3.4 | Skenario ke-4 | C-01 | §9.1 | M | kode | Sama |
| [ ] | T3.5 | Daftar temuan sintaks pada kode akhir di Cermin 4 | C-03 | §9.3 | S | kode | Tampil bila ada temuan; tidak tampil bila bersih |
| [ ] | T3.6 | Metrik salah tombol simbol | C-04 | §9.4 | M | kode | Uji unit lulus; angka tampil di Cermin 4 |
| [ ] | T3.7 | Ambang relatif terhadap jeda dasar pribadi | C-05 | — | M | kode | Hanya dikerjakan bila T2.12 memutuskan perlu |
| [ ] | T3.8 | Kecepatan menulis dibanding kecepatan menyalin | C-06 | — | S | kode | Tampil hanya bila `stats.bestWpm` ada |
| [ ] | T3.9 | Fungsi benih `trapSeedKeys()` untuk Tahap 3 + uji unit | X-01 | §14 | S | kode | Mengembalikan tombol lumpuh percobaan pertama, atau daftar kosong bila data kurang |

**Ketergantungan:** T3.1 → T3.2. T3.3 dan T3.4 sebaiknya setelah T2.11, supaya
tingkat kesulitannya mengikuti temuan uji coba. T3.7 menunggu T2.12. T3.9
sebaiknya setelah T3.1 dan dibutuhkan `docs/064_…` W2.2.

---

## 5. R4 dan R5

### 5.1 R4 — alat pengajar dan kontrol

| | ID | Pekerjaan | Req | Desain | Ukuran | Siapa | Selesai bila |
|---|---|---|---|---|---|---|---|
| [ ] | T4.1 | Putuskan O1: apakah data dipakai untuk penelitian | P-03 | §10.2 | — | pemilik | Keputusan tertulis |
| [ ] | T4.2 | Fungsi agregasi rekap (`src/lib/trapRecap.ts`) + uji unit | P-01 | §10.1 | M | kode | Agregat benar untuk berkas contoh; nama dan id perangkat dibuang |
| [ ] | T4.3 | Halaman rekap kelas: pilih banyak berkas, tampilkan sebaran | P-01 | §10.1 | L | kode | Pengajar bisa memuat berkas dari T2.11 dan membaca rekapnya |
| [ ] | T4.4 | Ekspor CSV dari halaman rekap | P-02 | §10.1 | S | kode | Berkas terbuka benar di aplikasi lembar kerja |
| [ ] | T4.5 | Persetujuan perekaman di pengarahan | P-03 | §10.2 | M | kode | Sesuai keputusan T4.1 |
| [ ] | T4.6 | Hapus data simulasi; pindahkan pemberian XP ke penanda tersendiri | P-06 | §10.4 | S | kode | Data terhapus; gerbang tidak muncul lagi; XP tidak diberikan dua kali |
| [ ] | T4.7 | Sakelar admin dengan migrasi pengaturan | P-04 | §10.3 | M | kode | Dokumen pengaturan lama terbaca; `test:settings` lulus |
| [ ] | T4.8 | Panduan fasilitasi satu halaman | P-05 | — | S | keduanya | Dokumen bernomor baru; ditinjau pengajar |

**Ketergantungan:** T4.1 → T4.5. T4.2 → T4.3 → T4.4. T4.3 paling berguna
setelah T2.11 menghasilkan berkas sungguhan.

### 5.2 R5 — pengerasan

| | ID | Pekerjaan | Req | Desain | Ukuran | Siapa | Selesai bila |
|---|---|---|---|---|---|---|---|
| [ ] | T5.1 | Keterangan tata letak QWERTY-US di peta panas; peringatan bila tata letak lain terdeteksi | H-01 | §11 | S | kode | Keterangan tampil |
| [ ] | T5.2 | Alternatif teks untuk peta panas dan putar ulang; uji dengan pembaca layar | H-02 | §11 | M | keduanya | Diagnosis terbaca tanpa melihat layar |
| [ ] | T5.3 | Periksa hitung mundur dan animasi arena terhadap `prefers-reduced-motion` | N-09 | — | S | kode | Tanpa animasi bergerak saat pengaturan itu aktif |
| [ ] | T5.4 | Kolom refleksi singkat di akhir diagnosis | H-03 | §11 | M | kode | Teks tersimpan bersama percobaan |
| [ ] | T5.5 | Varian Python/Dart tanpa eksekusi | H-04 | — | L | kode | Menunggu O7 |

### 5.3 Tahap 3 – Aksi

Tugas Tahap 3 dirinci di `docs/064_…` (sebelumnya `docs/060_…` §9). Ringkasannya:

| Fase | Isi | Rilis | Bergantung pada |
|---|---|---|---|
| W0 | Keputusan K1–K12 | — | Pemilik proyek |
| W1 | Rekam latensi transisi simbol di arena yang ada; periksa ambang 250 ms | A | — |
| W2 | Mesin arena baru, bank blok, generator Tingkat 1, kartu Dashboard | B | W1, T3.9 |
| W3 | Tingkat 2: kartu pola tanpa simbol (B); label petunjuk dan jadwal (C) | B, C | W2 |
| W4 | Tingkat 3: baris boss, pengarahan, pembongkaran | B | Mesin arena baru (W2.3) |
| W5 | Pengatur ritme, sorotan tombol, bonus Blok Bersih | C | W2, T5.6 |
| W6 | Ritual 10 menit, layar bukti, imbalan | B | W2, W3, W4 |
| W7 | Uji regresi arena lama, uji alur, uji coba di lab, rekap kelas | D | T2.3, T4.3 |

Satu tugas di sisi Tahap 1 untuk W5:

| | ID | Pekerjaan | Req | Desain | Ukuran | Siapa | Selesai bila |
|---|---|---|---|---|---|---|---|
| [ ] | T5.6 | Pisahkan tata letak keyboard dari `KeyboardHeatmap` supaya bisa menyorot satu tombol | X-03 | §14 | S | kode | Peta panas Tahap 1 tampil sama seperti sebelumnya; komponen baru menerima tombol sorotan |

**Urutan lintas tahap yang disarankan:** T2.1 → T2.3 → W1 → T3.1 → T3.9 → W2.
W1 hanya menambah pencatatan dan bisa berjalan sejajar dengan R2. Uji regresi
arena lama (`docs/064_…` W7.2) sebaiknya ditulis sebelum W1 menyentuh
`TypingGame`.

---

## 6. Daftar periksa manual lintas browser

Dipakai untuk T2.7. Jalankan dengan profil Master Palung baru di laptop.

1. Membuka `/codingshark/` langsung menampilkan insiden, bukan Dashboard.
2. Tombol mulai nonaktif sampai keyakinan diri dipilih.
3. Hitung mundur lalu arena tampil; kode awal memunculkan pesan error di konsol.
4. Nomor baris di pesan error cocok dengan baris di editor.
5. Tempel (Ctrl/⌘+V) ditolak dan penghitungnya bertambah.
6. Seret-lepas teks ke editor ditolak.
7. Tab menyisipkan dua spasi; Ctrl/⌘+Enter menjalankan kode.
8. Memperbaiki keempat cacat lalu Jalankan mengakhiri arena dengan `PRODUKSI PULIH`.
9. Putar ulang berjalan dan menampilkan label beku bila ada jeda ≥ 5 detik.
10. Peta panas tampil; tombol yang sengaja ditahan > 2 detik menyala.
11. "Masuk ke CodeShark" membuka Dashboard; setelah muat ulang tetap Dashboard.
12. Riwayat menampilkan percobaan; "Unduh telemetri (JSON)" menghasilkan berkas.

Catat browser, versi, sistem operasi, dan butir yang gagal.

---

## 7. Keputusan yang menahan pekerjaan

| Keputusan (PRD §10) | Menahan |
|---|---|
| O1 — data untuk penelitian? | T4.1, T4.5 |
| O2 — model, tarif, tanggal acuan angka AI | T2.9 |
| O3 — ambang tetap atau relatif | T2.12, T3.7 |
| O7 — varian Python/Dart | T5.5 |
| K1–K12 di `docs/061_…` §10 | Fase W1.3–W6 Tahap 3 (rincian di `docs/064_…` §13) |

Pekerjaan yang bisa langsung dimulai tanpa menunggu siapa pun: **T2.1, T2.2,
T2.3, T2.4, T2.10**, lalu T3.1 dan T3.5. Dari Tahap 3: **W7.2, W1.1, dan W1.2** (`docs/064_…`).
