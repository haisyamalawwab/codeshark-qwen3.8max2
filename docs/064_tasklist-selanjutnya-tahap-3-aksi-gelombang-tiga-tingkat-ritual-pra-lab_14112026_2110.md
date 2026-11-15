# 064 — Tasklist Selanjutnya: Tahap 3 – Aksi, Gelombang Tiga Tingkat & Ritual Pra-Lab

> Disimpan: 14-11-2026 21:10 WIB (+07).
> Branch kerja: `arena/49b4581b-codeshark-qwen3-8max2` (dari `main` @ `79a66c6`).
> Status: **belum ada tugas yang dikerjakan.** Menggantikan `docs/060_…` §9
> sebagai tasklist yang berlaku.
> Dokumen pasangan: `docs/061_…` (PRD), `docs/062_…` (Requirement), `docs/063_…` (Design).
> Tasklist Tahap 1: `docs/059_…`.

---

## 1. Cara membaca

- `[x]` selesai, `[ ]` belum.
- **Ukuran:** S = kurang dari setengah hari, M = sekitar satu hari, L = beberapa
  hari. Perkiraan kasar, bukan janji.
- **Siapa:** `kode` = bisa dikerjakan di repo; `pemilik` = butuh keputusan atau
  orang nyata; `keduanya` = kode siap lebih dulu, lalu pemilik.
- **Req** merujuk `docs/062_…`; **Desain** merujuk bagian `docs/063_…`.
- ID fase `W0`–`W7` sama dengan `docs/060_…`. Tugas yang baru ditambahkan
  ditandai "baru" di bagian 11.
- W-52 (tanpa dependensi baru, tanpa layanan AI) dan W-58 (teks antarmuka)
  berlaku untuk semua tugas dan diperiksa saat tiap tugas ditinjau.

---

## 2. Sudah selesai

| | Pekerjaan | Bukti |
|---|---|---|
| [x] | Naskah modul dan penyesuaiannya | `docs/060_…` |
| [x] | Kaitan dengan Tahap 1 dicatat | `docs/056_…` §13, `docs/057_…` §3.5, `docs/058_…` §14, `docs/059_…` §5.3 |
| [x] | Percobaan kelayakan: cakupan bank, pemeriksaan per baris dan per blok, aturan titik cacat | Hasil di `docs/061_…` §9 dan `docs/063_…` §6, §8 |
| [x] | PRD, Requirement, Design, Tasklist Tahap 3 | `docs/061_…`–`docs/064_…` |

Belum ada kode Tahap 3 di repo.

---

## 3. W0 — keputusan

| | ID | Pekerjaan | Siapa | Selesai bila |
|---|---|---|---|---|
| [ ] | W0.1 | Jawab K2 dan K11 (siapa yang direkam, bentuk persetujuan) | pemilik | Tertulis; menahan W1.2 |
| [ ] | W0.2 | Jawab K1 dan K6 (bahasa, mode baru atau pengganti) | pemilik | Tertulis; menahan W2 |
| [ ] | W0.3 | Jawab K4, K5, K8, K9, K10, K12 | pemilik | Tertulis; menahan W3.3, W4.5, W5.3, W6 |
| [ ] | W0.4 | Jelaskan Tahap 2 (K7) | pemilik | Tertulis; tidak menahan apa pun |

K3 (ambang) sengaja tidak ada di sini: ia diputuskan di W1.4 dengan data.

Bila W0 belum dijawab, pekerjaan tetap bisa berjalan dengan usulan bawaan di
`docs/061_…` §10. Yang mahal untuk dibalik: K1 (menambah bahasa berarti
penyorot, pemeriksa, dan bank baru) dan K5 pilihan B (mesin ketik bebas).

---

## 4. W1 — pengukuran (Rilis A)

Tidak mengubah apa pun yang terlihat mahasiswa selain satu kalimat
pengungkapan.

| | ID | Pekerjaan | Req | Desain | Ukuran | Siapa | Selesai bila |
|---|---|---|---|---|---|---|---|
| [ ] | W1.1 | `waveConfig.ts` dan `waveStats.ts`: kunci transisi, aturan sampel, status; `tests/wave.test.mjs` dan skrip `test:wave` | W-01, W-03, W-06, W-51, W-54 | §5, §12 | M | kode | `npm run test:wave` lulus |
| [ ] | W1.2 | Irisan `SaveData.wave`, `normalizeWave()`, uji save lama dan uji ukuran | W-04, W-53 | §4 | S | kode | Save tanpa `wave` dan dengan `wave` rusak dimuat tanpa galat; 100 sesi tiruan < 50 kB |
| [ ] | W1.3 | Pencatat transisi dan pasangan tertukar di `TypingGame`; digabung di `finishPractice` hanya untuk kelompok sasaran; kalimat pengungkapan | W-01, W-02, W-05, W-07 | §5.3 | M | kode | Setelah satu sesi Drill, `save.wave.trans` terisi untuk profil Academy dan kosong untuk Kadet; uji yang ada tetap lulus |
| [ ] | W1.4 | Tampilan ringkas data transisi milik sendiri, dengan tombol salin sebagai teks | W-13 | — | S | kode | Sepuluh transisi paling lambat tampil dengan median dan jumlah sampel |
| [ ] | W1.5 | Kumpulkan data dari beberapa orang; putuskan ambang (K3) | W-03 | §5.4 | S | keduanya | Ambang dipertahankan atau diubah, dengan alasan tertulis di `docs/063_…` §12 |

W1.4 ada supaya W1.5 bisa dilakukan: data hanya ada di peramban tiap orang,
jadi perlu cara melihat dan menyalinnya.

---

## 5. W2 — Tingkat 1 dan arena baru (Rilis B)

| | ID | Pekerjaan | Req | Desain | Ukuran | Siapa | Selesai bila |
|---|---|---|---|---|---|---|---|
| [ ] | W2.1 | Bank blok HTML, CSS, JS dengan templat nama; indeks kunci transisi; uji bank | W-11, W-14, W-16 | §6.1, §6.2 | L | kode | Tiap blok dan varian lolos pemeriksa; tiap kunci sasaran punya ≥ 6 blok |
| [ ] | W2.2 | Generator Tingkat 1: sasaran, pemilihan berbobot, hindari blok terakhir, benih Tahap 1 | W-10, W-12, W-15, W-17 | §6.3, §6.4 | M | kode | Uji generator berbenih lulus |
| [ ] | W2.3 | `waveEngine`: reducer untuk blok, dengan efek sampel dan percobaan | W-01, W-51 | §3.3 | M | kode | Uji urutan tombol → efek lulus di Node |
| [ ] | W2.4 | `WaveGame` Tingkat 1, `WaveResults`, layar `wave` di `App`, `recordWave()` | W-13, W-50, W-55, W-57 | §2, §11 | L | kode | Satu sesi Tingkat 1 bisa dimainkan; hasil menunjukkan transisi sasaran sebelum dan sesudah |
| [ ] | W2.5 | `WaveCard` di Dashboard; aturan audiens dan perangkat | W-05, W-56, W-60 | §11 | S | kode | Tampil untuk Academy dan Senior berkeyboard; tidak tampil untuk Kadet dan Ranger |

W2.1 sebagian besar pekerjaan menulis, bukan memrogram. Saya perkirakan
40–60 blok JS dan 20–40 blok masing-masing untuk CSS dan HTML supaya tiap
kunci sasaran di `docs/063_…` §6.2 punya enam; ini perkiraan kasar, belum
dihitung dari bank sungguhan.

---

## 6. W3 — Tingkat 2

| | ID | Pekerjaan | Req | Desain | Ukuran | Siapa | Selesai bila | Rilis |
|---|---|---|---|---|---|---|---|---|
| [ ] | W3.1 | Kartu pola; tampilan level 0 dan 1 termasuk pratinjau baris mendatang | W-20, W-26, W-27 | §7.1, §7.2 | M | kode | `<div class="card">` tampil sebagai `_div class__card__` di level 1 | B |
| [ ] | W3.2 | Naik-turun level 0 ↔ 1 dan bantuan setelah 3 salah | W-21, W-22, W-25 | §7.3, §7.4 | M | kode | Uji naik, turun, dan dibantu lulus | B |
| [ ] | W3.3 | Level 2 (label petunjuk) dan syarat dua hari | W-20, W-24 | §7.2, §7.3 | M | kode | Kartu mencapai level 2 hanya setelah lulus level 1 pada dua tanggal | C |
| [ ] | W3.4 | Jadwal lima kotak | W-23 | §7.5 | S | kode | Uji jadwal lulus dengan tanggal palsu | C |

Di Rilis B, kartu "jatuh tempo" berarti semua kartu yang sudah di level 1,
yang paling lama tidak muncul lebih dulu.

---

## 7. W4 — Hiu Boss (Rilis B)

| | ID | Pekerjaan | Req | Desain | Ukuran | Siapa | Selesai bila |
|---|---|---|---|---|---|---|---|
| [ ] | W4.1 | Bank baris boss (≥ 8 per bahasa) dan uji bank: titik cacat, tanda `mesin`/`manusia`, daftar tinjauan | W-30, W-35, W-38 | §8.1, §8.3 | M | kode | Uji bank lulus; baris bertanda `manusia` terdaftar |
| [ ] | W4.2 | Aturan boss di `waveEngine`: menyalin, beberapa jawaban, Enter | W-31, W-32, W-36 | §8.2 | M | kode | Uji: `==` dan `===` sama-sama menjinakkan; karakter yang tampil di titik cacat = menyalin |
| [ ] | W4.3 | Tampilan boss, pengarahan pertama, pembongkaran | W-33, W-37 | §8.4 | M | kode | Pengarahan muncul sekali; pembongkaran menampilkan tiap baris |
| [ ] | W4.4 | Tinjau baris bertanda `manusia` dan teks penjelasan | W-35 | §8.3 | S | pemilik | Daftar disetujui |
| [ ] | W4.5 | Syarat buka: "Boss bahasa" per bahasa, baris boss ritual per pertemuan | W-34 | §10.1 | S | kode | Boss bahasa JS tidak muncul sebelum P16 Perak; ritual hanya memakai baris dari pertemuan yang sudah Perak |

W4.1 dan W4.2 tidak bergantung pada W2.1 dan W2.2, hanya pada reducer W2.3.

---

## 8. W6 — ritual (Rilis B)

| | ID | Pekerjaan | Req | Desain | Ukuran | Siapa | Selesai bila |
|---|---|---|---|---|---|---|---|
| [ ] | W6.1 | Sesi ritual: pembuka, tiga segmen menurut jam, tanpa jeda, tanpa "game over", pengalihan waktu | W-43, W-48, W-49 | §10.1, §10.2 | M | kode | Dengan jam palsu: berakhir pada 10:00; jam tidak berhenti saat jendela ditinggalkan |
| [ ] | W6.2 | Layar bukti, `ritual.last`, latihan berikutnya | W-44, W-62 | §10.3 | M | kode | Bukti bisa dibuka lagi pada hari yang sama |
| [ ] | W6.3 | Imbalan dan hitungan harian; status ritual di kartu Dashboard | W-45, W-60, W-61 | §10.4 | S | kode | Ritual kedua di hari yang sama tidak menambah XP, hitungan, atau streak |

---

## 9. W5 dan W7 — Rilis C dan D

### 9.1 W5 — ritme dan skor (Rilis C)

| | ID | Pekerjaan | Req | Desain | Ukuran | Siapa | Selesai bila |
|---|---|---|---|---|---|---|---|
| [ ] | W5.1 | `wavePacing` dan pencatatan pengali per sesi | W-40, W-46, W-47 | §9.1 | M | kode | Uji: pengali tidak keluar dari 0,7–1,4; hasil lulus sama pada pengali berbeda |
| [ ] | W5.2 | Sorotan tombol setelah 3 salah beruntun | W-41 | §9.1 | S | kode | Butuh `docs/059_…` T5.6; baris Tingkat 2 yang disorot ditandai dibantu |
| [ ] | W5.3 | Bonus Blok Bersih | W-42 | §9.2 | S | kode | Sesuai keputusan K5 |

### 9.2 W7 — validasi dan kelas (Rilis D)

| | ID | Pekerjaan | Req | Desain | Ukuran | Siapa | Selesai bila |
|---|---|---|---|---|---|---|---|
| [ ] | W7.1 | Uji alur browser: ritual dengan jam palsu, menyalin baris boss, kartu tanpa simbol, audiens, perangkat | W-50 | §13 | M | kode | Ikut skrip uji alur (`docs/059_…` T2.3) |
| [ ] | W7.2 | Uji regresi arena lama: skor dan akurasi sama untuk urutan tombol yang sama | W-07, W-50 | §13 | S | kode | Sebaiknya ditulis sebelum W1.3 diubah |
| [ ] | W7.3 | Uji coba di satu sesi lab | — | §15 | M | pemilik | Catatan: ambang, pembagian waktu, blok yang membingungkan |
| [ ] | W7.4 | Kalibrasi `WAVE_CFG` dari hasil uji coba | W-54 | §12 | S | keduanya | Perubahan angka tercatat dengan alasannya |
| [ ] | W7.5 | Rekap kelas untuk data Tahap 3 | — | — | M | kode | Setelah `docs/059_…` T4.3 |
| [ ] | W7.6 | Bukti ritual tercatat ke server | W-63 | §10.3 | L | kode | Hanya bila K8 memutuskan demikian |
| [ ] | W7.7 | Dokumen implementasi dan bagian README | — | — | S | kode | Tiap rilis punya catatan apa yang dibangun dan apa yang diuji |

---

## 10. Urutan dan ketergantungan

```
Rilis A   W7.2 ─► W1.1 ─► W1.2 ─► W1.3 ─► W1.4 ─► W1.5 (ambang diputuskan)

Rilis B   W2.3 (mesin) ─┬─► W4.1 ─► W4.2 ─► W4.3 ─► W4.5 ──────────────┐
                        ├─► W2.1 ─► W2.2 ─► W2.4 ─► W2.5 ──────────────┤
                        └─► W3.1 ─► W3.2 ──────────────────────────────┴─► W6.1 ─► W6.2 ─► W6.3

Rilis C   W3.3 · W3.4 · W5.1 ─► W5.2 · W5.3

Rilis D   W7.1 · W7.3 ─► W7.4 · W7.5 · W7.6 · W7.7
```

W2.2 dan W3.2 membaca status transisi, jadi keduanya menunggu W1.1. W2.3
tidak bergantung pada W1.3 dan bisa dikerjakan sejajar dengan Rilis A.

| Tugas Tahap 3 | Butuh dari Tahap 1 (`docs/059_…`) | Sebab |
|---|---|---|
| W2.2 | T3.9, dan sebelumnya T3.1 | Benih memakai percobaan pertama yang tidak boleh tertimpa |
| W5.2 | T5.6 | Keyboard layar yang bisa menyorot satu tombol |
| W7.1 | T2.3 | Skrip uji alur di repo |
| W7.5 | T4.3 | Rekap kelas Tahap 1 |
| Ukuran "sebelum dan sesudah" di `docs/061_…` §8 | T2.1 | Selama V-09 terbuka, hasil simulasi Tahap 1 bisa dipalsukan |

**Langkah pertama yang tidak butuh keputusan:** W7.2 lalu W1.1 dan W1.2.
W1.3 mulai merekam, jadi sebaiknya menunggu W0.1.

**Tiga irisan yang bisa digabung satu per satu:**

1. Rilis A (W1.1–W1.4): kecil, tidak terlihat, memberi data.
2. Boss sendirian (W2.3, W4.1–W4.3, dengan versi minimal W2.4 dan W2.5):
   bisa dimainkan tanpa generator dan tanpa bank blok.
3. Ritual (sisanya dari Rilis B).

---

## 11. Perubahan dari `docs/060_…` §9

| Di 060 | Di sini | Alasan |
|---|---|---|
| W0 satu baris | W0.1–W0.4 | Tidak semua keputusan menahan fase yang sama |
| W1.1–W1.3 | W1.1–W1.5 | Baru: irisan save dan uji ukuran (W1.2), tampilan data (W1.4) supaya ambang bisa diperiksa |
| W2.1 "bank baris" | W2.1 "bank blok" + uji bank | Baris tunggal tidak bisa diperiksa |
| — | W2.3 `waveEngine` | Aturan ketik dipisah dari tampilan supaya bisa diuji |
| W2.3 | W2.4 dan W2.5 | Arena dan kartu Dashboard dipisah |
| W3.1–W3.2 | W3.1–W3.4 | Level 2 dan jadwal dipindah ke Rilis C |
| W4.1–W4.2 | W4.1–W4.5 | Baru: tanda `mesin`/`manusia`, tinjauan orang, pengarahan, buka per pertemuan di ritual |
| W5.1–W5.2 | W5.1–W5.3 | Sorotan tombol dipisah karena bergantung pada T5.6 |
| W6.1 | W6.1–W6.3 | Bukti dan imbalan dipisah |
| W7.1–W7.3 | W7.1–W7.7 | Baru: uji regresi arena lama, kalibrasi, bukti ke server, dokumentasi |

---

## 12. Daftar periksa manual untuk uji coba lab

Dikerjakan orang, di laptop lab, sebelum W7.3 dianggap selesai.

- [ ] Ritual berjalan 10 menit penuh dan berhenti sendiri.
- [ ] Jam tetap berjalan saat pindah tab lalu kembali.
- [ ] Blok Tingkat 1 terasa seperti kode, bukan deretan simbol.
- [ ] Baris tanpa simbol masih bisa dikenali polanya.
- [ ] Aturan boss dipahami setelah pengarahan, tanpa penjelasan pengajar.
- [ ] Layar bukti terbaca dari jarak pengajar berdiri.
- [ ] Mahasiswa yang paling lambat tetap mengetik sampai menit ke-10.
- [ ] Tidak ada mahasiswa yang tertahan di Tingkat 1 sepanjang tiga ritual.
- [ ] Laptop dengan tata letak selain QWERTY-US: catat apa yang terjadi.
- [ ] Chrome, Edge, dan Firefox di komputer lab.

---

## 13. Yang menahan pekerjaan

| Hal | Menahan |
|---|---|
| K2, K11 | W1.3 (mulai merekam) |
| K1, K6 | W2.1, W2.5, W4.1 |
| K4 | W3.3 |
| K5 | W5.3 |
| K8, K9, K10 | W6.1–W6.3, W7.6 |
| K12 | W4.5 |
| K3 | Diputuskan di W1.5; menahan W2.2 dan W3.2 |
| V-09 Tahap 1 (`docs/059_…` T2.1) | Ukuran "sebelum dan sesudah" |
| Tinjauan baris bertanda `manusia` (W4.4) | Rilis B ke mahasiswa |
| Sesi lab dan pengajar | W7.3 |
