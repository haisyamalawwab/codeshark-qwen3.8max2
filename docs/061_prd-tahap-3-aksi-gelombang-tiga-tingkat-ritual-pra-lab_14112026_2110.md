# 061 — PRD: Tahap 3 – Aksi, Gelombang Tiga Tingkat & Ritual Pra-Lab

> Disimpan: 14-11-2026 21:10 WIB (+07).
> Branch kerja: `arena/49b4581b-codeshark-qwen3-8max2` (dari `main` @ `79a66c6`).
> Status: **usulan; belum ada kode yang dibangun dan belum ada keputusan pemilik
> proyek.** Semua pilihan di dokumen ini adalah usulan bawaan sampai bagian 10
> dijawab.
> Sumber: naskah modul di `docs/060_…` §2 dan penyesuaiannya di `docs/060_…` §4.
> Dokumen pasangan: `docs/062_…` (Requirement), `docs/063_…` (Design),
> `docs/064_…` (Tasklist). Tahap 1: `docs/056_…`–`docs/059_…`.

---

## 1. Ringkasan

Tahap 3 – Aksi menambahkan mode latihan baru ke CodeShark: **gelombang tiga
tingkat** yang menyesuaikan diri dengan tiap mahasiswa, dijalankan sebagai
**ritual 10 menit** di awal sesi laboratorium.

| Tingkat | Yang dikerjakan mahasiswa | Yang diukur |
|---|---|---|
| 1 — Cetak Motorik | Mengetik blok kode utuh yang dipilih karena memuat transisi simbol yang masih lambat baginya | Selang antar-tombol pada tiap transisi simbol |
| 2 — Perancah Memudar | Mengetik pola yang sama saat simbolnya, lalu seluruh teksnya, tidak lagi ditampilkan | Berhasil atau tidaknya menulis tanpa melihat |
| 3 — Hiu Boss | Mengetik versi benar dari sebaris kode yang cacat | Disalin atau diperbaiki |

Nama naskahnya, "3-Tier Neuro-Semantic Wave & Dynamic Scaffolding Protocol",
tetap dipakai sebagai nama modul. Nama di layar memakai bahasa Indonesia.

## 2. Masalah

Arena ketik sekarang melatih kecepatan **menyalin**:

- kode selalu tampil utuh, jadi mata cukup memindahkan huruf ke jari;
- salah tombol tidak masuk ke teks, jadi mahasiswa tidak pernah melihat akibat
  salah ketiknya;
- semua mahasiswa mendapat baris yang sama, tidak peduli simbol mana yang
  membuatnya tersendat;
- tidak ada latihan yang meminta mahasiswa menilai apakah kode di depannya benar.

Tahap 1 menunjukkan jarak itu kepada mahasiswa. Tahap 3 adalah latihan untuk
menutupnya.

## 3. Tujuan dan bukan tujuan

**Tujuan**

1. Latihan mengikuti transisi simbol yang masih lambat pada tiap mahasiswa,
   berdasarkan pengukuran, bukan urutan tetap.
2. Petunjuk di layar berkurang seiring kelancaran, sampai pola ditulis tanpa
   dilihat.
3. Mahasiswa berlatih menolak kode cacat dan langsung menulis perbaikannya.
4. Semuanya muat dalam 10 menit dan menghasilkan bukti yang bisa diperiksa
   pengajar.
5. Kemajuan bisa ditunjukkan dengan angka milik mahasiswa itu sendiri.

**Bukan tujuan**

- Menjalankan kode atau menilai program buatan mahasiswa.
- Mengunci atau mendeteksi IDE di komputer lab.
- Menggantikan Quest, Drill, dan Juggling. Level pertemuan tidak berubah.
- Mengukur emosi, "memori jangka panjang", atau "muscle memory". Aplikasi
  hanya mengukur ketikan.
- Mekanik yang mendorong bermain tanpa henti. Ritual punya akhir.
- Papan peringkat antar-mahasiswa.

## 4. Pengguna

| Pengguna | Kebutuhan | Perlakuan (usulan) |
|---|---|---|
| Mahasiswa / umum (Academy) | Berlatih tepat di titik lemahnya, dalam waktu singkat | Ritual 10 menit di awal lab; boleh mengulang di luar lab |
| Senior Diver | Boleh mencoba | Tersedia lewat kartu Dashboard, tidak diwajibkan |
| Kadet dan Ranger (10–15 tahun) | — | Tidak tampil; arena mereka tidak berubah dan ketikannya tidak direkam untuk modul ini |
| Pengajar | Memastikan ritual dikerjakan; melihat titik lemah kelas | Layar bukti per mahasiswa; rekap kelas menyusul |
| Pemilik proyek | Bahan untuk proposal dan evaluasi | Angka sebelum dan sesudah per mahasiswa |

Perangkat tanpa keyboard fisik tidak ditawari modul ini, sama seperti Tahap 1.

## 5. Pengalaman produk

**Ritual 10 menit (jalur utama)**

| Menit | Layar | Isi |
|---|---|---|
| 0:00 | Pembuka | Tiga transisi simbol yang akan dilatih hari ini dan angkanya, kartu yang jatuh tempo, lalu hitung mundur |
| 0:00–4:00 | Tingkat 1 | Blok kode utuh yang padat dengan transisi sasaran |
| 4:00–8:00 | Tingkat 2 | Kartu pola: sebagian tanpa simbol, sebagian hanya label petunjuk |
| 8:00–10:00 | Hiu Boss | Baris cacat; mengetik persis yang tampil mengurangi nyawa |
| 10:00 | Bukti | Nama, tanggal, durasi, ringkasan tiga tingkat, dan pembongkaran tiap cacat boss |

Jam terus berjalan selama 10 menit. Dalam ritual tidak ada "game over": nyawa
yang hilang dicatat, lalu latihan berlanjut, supaya mahasiswa yang paling
lemah tetap berlatih penuh 10 menit.

**Di luar ritual.** Tiap tingkat bisa dimainkan sendiri dari kartu Dashboard.
Sesuai naskah, "Boss bahasa" (semua baris boss satu bahasa) terbuka setelah
pertemuan terakhir bahasa itu mencapai Perak. Di dalam ritual, baris boss
terbuka per pertemuan, supaya ritual punya tiga tingkat sejak pertemuan awal
dan bukan baru setelah pertemuan 8.

**Pengatur ritme.** Hiu mempercepat bila ketikan bersih dan memperlambat bila
salah tekan beruntun, dalam rentang terbatas. Setelah tiga salah beruntun,
tombol berikutnya disorot pada keyboard layar.

**Blok Bersih.** Satu baris tanpa salah tekan dan tanpa Backspace mendapat
pengali skor 5×.

## 6. Prinsip produk

Empat yang pertama dibawa dari Tahap 1 (`docs/056_…` §6).

1. **Hanya hasil ukur.** Teks di layar tidak menyebut otak, memori, atau
   kebiasaan generasi. Yang disebut: milidetik, persen, jumlah.
2. **Jebakan dibuka.** Baris boss ditulis tim CodeShark, bukan keluaran AI;
   layar bukti mengatakannya dan menjelaskan tiap cacat.
3. **Tanpa papan peringkat.** Perbandingan hanya dengan diri sendiri.
4. **Diakhiri dengan arah tindakan.** Layar bukti menyebut apa yang dilatih
   pada ritual berikutnya.
5. **Adil terhadap jawaban yang benar.** Tidak ada baris yang menghukum
   bentuk sah yang belum pernah diajarkan.
6. **Lulus tidak bergantung pada ritme.** Pengatur ritme mengubah tempo, bukan
   syarat.
7. **Ada akhirnya.** Sepuluh menit, satu ritual yang dihitung per hari.
8. **Agregat, bukan aliran ketikan.** Yang disimpan adalah ringkasan per
   transisi.

## 7. Cakupan rilis

| Rilis | Isi | Fase |
|---|---|---|
| A — Pengukuran | Arena yang ada merekam selang antar-tombol untuk kelompok sasaran; ambang 250 ms diperiksa terhadap data | W1 |
| B — MVP | Tingkat 1 adaptif, Tingkat 2 tanpa simbol, Hiu Boss, ritual 10 menit dan layar bukti | W2, W3.1–W3.2, W4, W6 |
| C — Lengkap | Label petunjuk logika, penjadwalan berjarak, pengatur ritme, Blok Bersih | W3.3–W3.4, W5 |
| D — Kelas | Uji coba di lab, kalibrasi, rekap kelas | W7 |

Rilis A berdiri sendiri dan tidak mengubah apa pun yang terlihat mahasiswa.
Rincian fase ada di `docs/064_…`.

## 8. Ukuran keberhasilan

Belum ada data dasar. Target angka baru bisa ditetapkan setelah Rilis A
mengumpulkan data dan uji coba pertama selesai.

| Ukuran | Cara mengukur | Yang diharapkan |
|---|---|---|
| Latensi transisi yang dilatih | Median per transisi, ritual pertama dibanding ritual ke-5 | Turun |
| Transisi berstatus lancar | Jumlah per mahasiswa dari waktu ke waktu | Bertambah |
| Kartu tanpa bantuan | Kartu yang lulus level "tanpa simbol" tanpa bantuan | Bertambah |
| Baris boss disalin | Proporsi disalin, kemunculan pertama dibanding berikutnya | Turun |
| Ritual selesai | Ritual per mahasiswa per minggu kuliah | Sesuai jadwal lab |
| Sebelum dan sesudah | Tombol lumpuh dan cacat diperbaiki saat simulasi Tahap 1 diulang setelah beberapa minggu | Membaik |

Baris terakhir adalah satu-satunya pembanding lintas tahap yang sah: data
ketik Tahap 1 dan Tahap 3 diukur dengan cara berbeda dan tidak bisa
dibandingkan langsung (`docs/058_…` §14).

## 9. Penyesuaian terhadap naskah

Sembilan penyesuaian dijelaskan di `docs/060_…` §4. Ringkasnya:

| Naskah | Yang dirancang | Alasan |
|---|---|---|
| HTML, CSS, JS, Python, Dart | HTML, CSS, JS | Hanya itu yang ada di aplikasi dan silabus |
| Personalisasi dari heatmap Tahap 1 & 2 | Arena mengukur sendiri; Tahap 1 hanya benih | Data Tahap 1 per tombol dan tipis; naskah Tahap 2 tidak ada |
| Ambang < 250 ms, akurasi > 95% | Nilai awal, dihitung dari 10 kemunculan terakhir, diperiksa dulu | 250 ms setara 48 kata per menit; belum ada data |
| Kode baru dirakit dinamis | Dipilih dari bank blok yang ditulis tangan | Rakitan mesin mudah tidak bermakna; tanpa layanan AI |
| Petunjuk logika `[ASYNC_FETCH_JS: url]` | Hanya untuk kartu yang bentuk bakunya sudah dilatih | Jawaban sah bisa lebih dari satu |
| Mengetik persis = hiu meledak | Aturan pasti di titik cacat; beberapa perbaikan sah diterima | Supaya adil dan bisa diuji |
| Frustration/Boredom Index | "Pengatur ritme" dari salah tekan dan tempo | Emosi tidak diukur |
| Zero-Backspace | Blok Bersih: tanpa salah tekan dan tanpa Backspace | Di mesin sekarang salah tombol tidak masuk teks |
| Dilarang membuka IDE sebelum selesai | Sesi berbatas waktu + layar bukti; pengajar yang menahan | Aplikasi web tidak bisa mengunci IDE |

Empat temuan tambahan saat menyusun dokumen ini, semuanya dari percobaan atas
kode yang ada:

- **Bank yang ada tipis untuk JS dan CSS.** Dari 161 baris drill hanya 37 baris
  JS dan 49 baris CSS. Di baris JS itu `=>` muncul 1 kali; `({`, `};`, `[`,
  `]`, dan `${` tidak muncul sama sekali.
- **Baris tunggal tidak bisa diperiksa satu per satu.** 64 dari 161 baris drill
  dianggap rusak oleh pemeriksa struktur bila berdiri sendiri (`<ul>` tanpa
  `</ul>`). Bank harus disusun dan diperiksa per blok.
- **Dua contoh cacat yang umum ternyata bukan cacat.** Titik koma yang hilang
  di akhir pernyataan JS dan di deklarasi CSS terakhir adalah kode yang sah.
  Baris boss tidak boleh memakainya.
- **Pemeriksa yang ada tidak melihat semua cacat.** `if (x = 5)` dan titik
  koma yang hilang di antara dua deklarasi CSS sebaris lolos pemeriksa
  struktur. Baris boss seperti itu harus ditinjau manusia.

## 10. Keputusan yang menunggu pemilik proyek

| # | Pertanyaan | Usulan bawaan | Menahan |
|---|---|---|---|
| K1 | Bahasa: HTML/CSS/JS saja, atau Python dan Dart dihidupkan lagi? | HTML/CSS/JS | W2, W4 |
| K2 | Siapa yang mendapat Tahap 3? | Academy lewat ritual; Senior opsional; Kadet dan Ranger tidak | W1.3, W6 |
| K3 | Ambang kelancaran 250 ms: tetap, atau dari data? | Nilai awal 250 ms; diputuskan setelah W1 | W2 |
| K4 | Satu bentuk baku per kartu pola? | Ya | W3 |
| K5 | "Zero-Backspace": Blok Bersih, atau mesin diubah jadi ketik bebas? | Blok Bersih | W5 |
| K6 | Mode baru, atau menggantikan Drill dan Juggling? | Mode baru | W2 |
| K7 | Isi Tahap 2 dan apakah menghasilkan data ketik | Tahap 3 tidak bergantung padanya | — |
| K8 | Bukti ritual: layar saja, atau dicatat ke server dengan kode kelas? | Layar saja untuk MVP | W6 |
| K9 | XP dan streak untuk ritual | 40 XP sekali per hari berapa pun hasilnya; ritual dihitung sebagai aktivitas harian; tanpa koin | W6 |
| K10 | Ritual tanpa "game over"? | Ya: nyawa yang hilang dicatat, latihan berlanjut | W6 |
| K11 | Persetujuan perekaman pola ketik (lanjutan O1 di `docs/056_…`) | Diungkapkan di kartu dan pembuka; persetujuan eksplisit bila data dipakai untuk penelitian | W1.3 |
| K12 | Boss di dalam ritual: per pertemuan, atau baru setelah bahasanya tamat? | Per pertemuan di ritual; "Boss bahasa" tetap di akhir bahasa | W4.5 |

K9–K12 baru muncul saat rancangan dirinci; tidak ada di `docs/060_…`.

## 11. Risiko

| Risiko | Penanganan |
|---|---|
| Ambang terlalu tinggi dan mahasiswa tertahan di Tingkat 1 | Rilis A memeriksa ambang lebih dulu; jalur naik lewat akurasi bila ambang direvisi |
| Bank kecil sehingga blok dihafal | Templat dengan nama berganti; blok yang baru dimainkan dihindari; bank ditulis sebelum generator |
| Tingkat 2 terasa menghukum | Bantuan setelah 3 salah; turun satu level saja |
| Aturan boss membingungkan | Pengarahan sebelum boss pertama; pembongkaran sesudahnya |
| Pengatur ritme membuat hasil tidak sebanding | Pengali dicatat per sesi; syarat lulus tidak bergantung padanya |
| Arena lama rusak karena perubahan | Arena baru terpisah; arena lama hanya ditambah pencatatan |
| Pola ketik adalah data perilaku per orang | Hanya agregat; hanya kelompok sasaran; K11 |
| Sepuluh menit tidak cukup atau terlalu lama | Pembagian waktu di satu tempat; dikalibrasi di uji coba |
| Bukti ritual ditiru | Diakui: layar bukti bukan pengaman; K8 menyediakan jalan lebih kuat |
| Klaim proposal melampaui yang terukur | Prinsip 1; bagian 8 hanya memuat ukuran yang benar-benar direkam |

## 12. Ketergantungan

- Dari Tahap 1 (`docs/059_…`): T2.1 (vonis tidak bisa dipalsukan), T3.1
  (percobaan pertama tidak terbuang), T3.9 (fungsi benih), T5.6 (keyboard layar
  yang bisa menyorot), T2.3 (uji alur browser di repo).
- Mahasiswa memakai laptop dengan keyboard fisik, tata letak QWERTY-US.
- Tanpa backend baru untuk Rilis A–C.
- Uji coba di lab membutuhkan pemilik proyek atau pengajar.
