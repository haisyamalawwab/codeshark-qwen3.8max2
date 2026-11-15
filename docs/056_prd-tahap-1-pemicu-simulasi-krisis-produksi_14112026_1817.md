# 056 — PRD: Tahap 1 – Pemicu, Simulasi Krisis Produksi (AI-Trap & Production Crisis Simulator)

> Disimpan: 14-11-2026 18:17 WIB (+07).
> Branch kerja: `arena/49b4581b-codeshark-qwen3-8max2` (dari `main` @ `79a66c6`).
> Status: **berlaku.** Rilis 1 dan 1.1 sudah ada di `main`; Rilis 2 belum dikerjakan.
> Sumber: naskah modul dari pemilik proyek, `docs/052_…` (rencana awal, digantikan),
> `docs/053_…` (rencana berlaku), `docs/054_…` dan `docs/055_…` (yang dibangun).
> Dokumen pasangan: `docs/057_…` (Requirement), `docs/058_…` (Design),
> `docs/059_…` (Tasklist selanjutnya).
> Diperbarui 14-11-2026 20:15 WIB: bagian 3, 7, dan 10 menunjuk ke Tahap 3; bagian 13 baru.
> Modul Tahap 3 – Aksi: `docs/060_…`; PRD-nya `docs/061_…` (diperbarui 14-11-2026 21:10 WIB).

---

## 1. Ringkasan

Simulasi Krisis Produksi adalah pembuka kelas berdurasi 5–7 menit di CodeShark.
Mahasiswa memperbaiki kode "hasil AI" yang rusak dalam 3 menit tanpa bantuan,
lalu melihat rekaman dan angka dari cara ia sendiri bekerja. Tujuannya satu:
membuat mahasiswa melihat jarak antara "merasa bisa" dan "bisa tanpa AI",
sebelum latihan reguler dimulai.

Modulnya sudah berjalan di `main`, tetapi belum pernah dipakai mahasiswa
sungguhan. PRD ini mencatat apa produknya, keputusan yang sudah diambil, dan
apa yang perlu dikerjakan berikutnya supaya angka-angkanya bisa dipercaya dan
berguna bagi pengajar.

## 2. Masalah

- Mahasiswa yang terbiasa menyalin keluaran AI sering menilai dirinya mampu,
  padahal belum pernah diuji tanpa bantuan. Selama keyakinan itu tidak
  terganggu, latihan dasar terasa tidak perlu.
- Latihan reguler CodeShark tidak bisa memunculkan kesadaran itu. Di arena
  ketik, kode acuan selalu terlihat dan tombol salah tidak masuk ke teks; yang
  terukur adalah kecepatan menyalin, bukan kemampuan membaca dan menulis sintaks.
- Naskah modul meminta pemicu (Tahap 1, *disorienting dilemma*) yang konkret,
  singkat, dan berbasis angka milik mahasiswa sendiri.

## 3. Tujuan dan bukan tujuan

**Tujuan**

1. Dalam 5–7 menit, mahasiswa mengalami sendiri tugas perbaikan tanpa AI dan
   menerima diagnosis yang seluruhnya berasal dari pengukuran atas dirinya.
2. Diagnosis membedakan tiga hal: kemampuan membaca kode, kelancaran jari pada
   simbol, dan kerusakan baru yang ditimbulkan sendiri.
3. Hasil pertama tersimpan sebagai titik awal untuk dibandingkan di tahap
   berikutnya.
4. Pengajar bisa mengambil datanya tanpa infrastruktur tambahan.

**Bukan tujuan**

- Bukan ujian dan bukan alat pengawasan. Hasil tidak memengaruhi nilai, rank,
  atau koin.
- Bukan pembuktian ilmiah. Jeda menunjukkan di mana jari berhenti, bukan mengapa.
- Bukan Tahap 2 dan seterusnya. Tahap 3 – Aksi direncanakan tersendiri di
  `docs/060_…`; kaitannya dengan dokumen ini ada di bagian 13.
- Bukan untuk anak 10–15 tahun.

## 4. Pengguna

| Pengguna | Kebutuhan | Perlakuan |
|---|---|---|
| Mahasiswa / umum (kelompok Academy) | Tahu posisi dirinya tanpa AI | Wajib satu kali, sebelum masuk CodeShark |
| Senior Diver | Boleh mencoba | Opsional lewat kartu Dashboard |
| Kadet dan Ranger (10–15 tahun) | — | Modul tidak tampil |
| Pengajar | Membuka kelas dengan pemicu, lalu membahas hasilnya | Hari ini: berkas telemetri JSON per mahasiswa. Rekap kelas belum ada |
| Pemilik proyek / admin | Mengatur siapa yang kena dan angka pembanding AI | Hari ini: lewat kode. Sakelar admin belum ada |

## 5. Pengalaman produk

1. **Gerbang.** Mahasiswa Academy membuka CodeShark dan langsung disambut
   insiden, bukan Dashboard.
2. **Pengarahan (±30 detik).** Cerita "produksi down", empat aturan, apa yang
   direkam, dan pertanyaan keyakinan diri 1–5.
3. **Babak 1 — Jebakan (3 menit).** Satu berkas HTML + CSS + JS dengan 4 cacat.
   Editor polos, tanpa autocomplete, tempel ditolak. Tombol Jalankan menampilkan
   pesan error asli dari browser dan hasil pemeriksaan produksi.
4. **Babak 2 — Cermin (2–3 menit).** Putar ulang ketikan, perbandingan dengan
   AI, peta panas keyboard, angka pendukung, lalu pembongkaran keempat cacat.
5. **Masuk.** Tombol "Masuk ke CodeShark" membuka Dashboard. Diagnosis bisa
   dibuka lagi dan simulasi bisa diulang dari kartu Dashboard.

## 6. Prinsip produk

Prinsip ini mengikat semua rilis.

1. **Setiap angka tentang mahasiswa adalah hasil ukur miliknya sendiri.**
2. **Kalimat keras mengikuti hasil.** Kalimat terkeras hanya muncul saat gagal;
   mahasiswa yang berhasil mendapat pengakuan.
3. **Angka tentang AI adalah perkiraan, dan asumsinya selalu tampil.**
4. **Pengelabuan dibuka di akhir.** Kode itu bukan keluaran AI sungguhan dan
   cacatnya ditanam; layar pembongkaran mengatakannya.
5. **Diagnosis ditutup dengan arah tindakan**, bukan hanya penilaian.
6. **Tidak ada papan peringkat.** Diagnosis hanya tampil di layar mahasiswa sendiri.

## 7. Cakupan rilis

| Rilis | Isi | Status |
|---|---|---|
| R1 — MVP | Dua babak, dua skenario, riwayat dan unduhan telemetri, kartu Dashboard | Selesai (PR #15) |
| R1.1 — Gerbang masuk | Simulasi tampil sebelum Dashboard CodeShark | Selesai (PR #16) |
| R2 — Validasi dan kalibrasi | Perbaikan pemalsuan vonis, uji coba dengan mahasiswa, uji lintas browser, uji alur yang bisa diulang, kalibrasi ambang, tanggal acuan angka AI | Belum |
| R3 — Konten dan diagnosis | Skenario ke-3 dan ke-4, perbandingan dengan titik awal, daftar temuan sintaks, metrik dari 052 yang belum diangkut | Belum |
| R4 — Alat pengajar dan kontrol | Rekap kelas, ekspor CSV, sakelar admin, persetujuan perekaman, panduan fasilitasi | Belum |
| R5 — Pengerasan | Tata letak keyboard lain, pembaca layar, jembatan ke Tahap 2 | Belum |
| Tahap 3 — Aksi | Gelombang tiga tingkat, pengatur ritme, ritual 10 menit; rilis A–D di `docs/061_…`, fase W0–W7 di `docs/064_…` | Rencana |

Rincian per butir ada di `docs/057_…`; urutan kerja ada di `docs/059_…`.

## 8. Ukuran keberhasilan

Belum ada data dasar: modul ini belum pernah dipakai mahasiswa sungguhan. Semua
target di bawah adalah **usulan** yang perlu dikonfirmasi setelah uji coba
pertama (R2).

| Ukuran | Cara mengukur | Target usulan |
|---|---|---|
| Sesi selesai tanpa penangguhan | Percobaan tersimpan dibanding penangguhan | ≥ 90% mahasiswa Academy di laptop |
| Durasi total muat di pembuka kelas | Waktu dari pengarahan sampai tombol lanjut | ≤ 7 menit untuk sebagian besar mahasiswa |
| Peta panas punya data cukup | Percobaan dengan ≥ 8 ketukan bersambung | ≥ 80% percobaan |
| Diagnosis dipercaya | Pertanyaan singkat setelah sesi: "apakah angka ini menggambarkan dirimu?" | Mayoritas menjawab ya; belum ada alat ukurnya di aplikasi |
| Perubahan pada pengulangan | Cacat diperbaiki dan tombol lumpuh, percobaan pertama dibanding terbaru | Arah membaik; besarnya belum bisa ditargetkan |
| Tanpa cacat pemblokir | Uji alur di Chrome, Firefox, Safari | 0 cacat pemblokir |

## 9. Keputusan yang sudah diambil

| Keputusan | Nilai | Sumber |
|---|---|---|
| Bentuk pemicu | Dua babak "AI-Trap", menggantikan editor kosong | Naskah yang dikuatkan; 053 |
| Bahasa skenario | HTML, CSS, dan JS dalam satu berkas | Jawaban pemilik proyek |
| Nada | Tajam-faktual dengan provokasi lebih kuat; tanpa klaim yang tidak terukur | Jawaban pemilik proyek |
| Angka pembanding AI | "Hitungan detik", "di bawah Rp 100", dengan asumsi tertulis | Diserahkan ke pelaksana; 054 §5 |
| Perekaman | Log telemetri, rekaman ketikan, dan riwayat disimpan | Jawaban pemilik proyek |
| Pembongkaran jebakan | Wajib | 053 K4 |
| Siapa yang wajib | Academy saja; Senior opsional | 052 D1, tidak diubah |
| Letak gerbang | Sebelum masuk CodeShark; di Coding Tower sebelum latihan pertama | Permintaan pemilik proyek; 055 |
| Perangkat tanpa keyboard fisik | Tidak digerbang | 052 §5.4 |
| Pengaruh ke nilai | Tidak ada; 30 XP sekali | 052 §5.4 |

## 10. Keputusan terbuka

Butir ini menahan sebagian pekerjaan R2–R5. Tiap butir punya usulan bawaan.

| # | Pertanyaan | Usulan bawaan | Menahan |
|---|---|---|---|
| O1 | Apakah data akan dipakai untuk penelitian? Bila ya, perlu persetujuan perekaman dan mungkin izin etik. | Anggap ya: tambahkan persetujuan eksplisit di pengarahan | R4 |
| O2 | Model, tarif, dan tanggal acuan untuk angka AI | Pertahankan rentang sekarang, tambahkan tanggal acuan | R2 |
| O3 | Ambang jeda: tetap 2 detik (naskah) atau relatif terhadap jeda dasar pribadi (052 §6)? | Putuskan dari data uji coba | R2, R3 |
| O4 | Apakah mode editor kosong dari 052 masih diinginkan sebagai mode kedua? | Tidak; unsur menulisnya sudah ada lewat baris yang terpotong | R3 |
| O5 | Log ketikan mentah ikut tersinkron ke cloud (rencana 053 K5 semula: di perangkat saja). Apakah itu yang diinginkan? | Biarkan seperti sekarang; tinjau lagi bila O1 = ya | R4 |
| O6 | Apakah Senior Diver ikut diwajibkan? | Tidak | — |
| O7 | Varian Python/Dart dengan pemeriksaan statis | Ditunda; aplikasi hanya mengenal HTML/CSS/JS. Pertanyaan yang sama muncul di Tahap 3 (`docs/060_…` K1) | R5 |

## 11. Risiko

| Risiko | Penanganan | Status |
|---|---|---|
| Rasa malu membuat mahasiswa berhenti, bukan berefleksi | Tidak memengaruhi nilai; nada mengikuti hasil; penutup berisi arah tindakan | Ditangani di R1; perlu dicek di uji coba |
| Mahasiswa merasa ditipu soal "kode AI" | Pembongkaran wajib | Ditangani |
| Angka AI usang atau dipersoalkan | Satu berkas, asumsi tampil | Sebagian: tanggal acuan belum ada |
| Ambang 2 detik dan 5 detik keliru mengecap | Kalibrasi dari data | Belum |
| Render tersendat mencemari pengukuran | Latar dimatikan selama arena; animasi ringan | Ditangani |
| Pemula murni menganggap gagal itu wajar | Keyakinan diri dibandingkan dengan hasil | Ditangani; perlu dicek di uji coba |
| Data mahasiswa tersimpan tanpa persetujuan eksplisit | Pengungkapan di pengarahan | Sebagian: lihat O1 |
| Hanya diuji di Chromium | Uji lintas browser | Belum |
| Vonis `PRODUKSI PULIH` bisa dipalsukan dari kode mahasiswa, sehingga prinsip 1 dilanggar dan data kelas tercemar | Perbaikan di R2 (`docs/057_…` V-09) | Belum; cacat sudah direproduksi |
| Berkas telemetri memuat nama profil dan id perangkat | Rekap kelas tidak menampilkannya; lihat O1 | Belum |

## 12. Ketergantungan dan asumsi

- Mahasiswa mengerjakan di laptop dengan keyboard fisik dan tata letak QWERTY-US.
- Penyimpanan mengikuti CodeShark: lokal lebih dulu, sinkron cloud bila tersedia.
- Tidak ada backend baru untuk R1–R3. Rekap kelas (R4) bisa dimulai tanpa
  backend dengan mengimpor berkas telemetri.
- Uji coba dengan mahasiswa membutuhkan pemilik proyek atau pengajar; tidak
  bisa dikerjakan dari sisi kode.

## 13. Kaitan dengan Tahap 3 – Aksi

| Tahap | Isi | Keadaan |
|---|---|---|
| 1 – Pemicu | Simulasi Krisis Produksi | Dibangun; dokumen ini |
| 2 | Naskahnya belum ada di repo ini | Tidak diketahui |
| 3 – Aksi | Gelombang tiga tingkat di arena ketik, ritual 10 menit pra-lab | Rencana: naskah di `docs/060_…`, PRD di `docs/061_…` |

Yang berubah bagi Tahap 1 karena Tahap 3:

- **Tahap 1 menjadi pemasok data.** Tombol lumpuh dari simulasi dipakai sebagai
  benih urutan latihan pada sesi pertama Tahap 3. Datanya per tombol dan dari
  satu sesi pendek, jadi hanya benih; Tahap 3 mengukur pasangan tombolnya
  sendiri.
- **Titik awal makin penting.** Mengulang simulasi setelah beberapa minggu
  ritual adalah cara membandingkan sebelum dan sesudah. Itu butuh percobaan
  pertama yang tidak terbuang (`docs/059_…` T3.1) dan vonis yang tidak bisa
  dipalsukan (T2.1).
- **Keputusan O1 berlaku untuk keduanya.** Tahap 3 menyimpan pola ketik per
  pasangan tombol; persetujuan perekaman perlu mencakupnya.
- **Rekap kelas** (R4) dirancang supaya bisa diperluas ke data Tahap 3.
- **Prinsip produk di bagian 6 dibawa ke Tahap 3**: hanya hasil ukur, jebakan
  dibuka, tanpa papan peringkat.
