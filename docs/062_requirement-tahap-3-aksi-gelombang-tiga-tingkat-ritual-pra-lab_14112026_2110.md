# 062 — Requirement: Tahap 3 – Aksi, Gelombang Tiga Tingkat & Ritual Pra-Lab

> Disimpan: 14-11-2026 21:10 WIB (+07).
> Branch kerja: `arena/49b4581b-codeshark-qwen3-8max2` (dari `main` @ `79a66c6`).
> Status: **usulan; semua kebutuhan belum dibangun.** Dokumen ini menggantikan
> `docs/060_…` §7 sebagai daftar kebutuhan yang berlaku.
> Dokumen pasangan: `docs/061_…` (PRD), `docs/063_…` (Design), `docs/064_…` (Tasklist).

---

## 1. Cara membaca

- **Prioritas:** P0 = Rilis A dan B (pengukuran dan MVP), P1 = Rilis C, P2 = Rilis D
  atau sesudahnya.
- **Asal:** `N-T1`, `N-T2`, `N-T3`, `N-Ritme`, `N-Skor`, `N-Ritual` = bagian
  naskah (Tingkat 1, 2, 3, pengatur ritme, combo, ritual); `060 §x` =
  penyesuaian di dokumen 060; `uji` = temuan percobaan atas kode yang ada,
  dicatat di `docs/061_…` §9.
- **Menunggu:** keputusan K di `docs/061_…` §10 yang bisa mengubah kebutuhan itu.
- ID `W-01`–`W-54` sama dengan di `docs/060_…`. Yang berubah isinya ditandai
  di bagian 9; ID baru memakai nomor yang belum dipakai.

Istilah:

| Istilah | Arti |
|---|---|
| Transisi | Perpindahan dari satu tombol ke tombol berikutnya, dengan sedikitnya satu di antaranya simbol |
| Kunci transisi | Nama transisi setelah huruf, angka, dan spasi digolongkan (`a`, `9`, `␣`); simbol ditulis apa adanya. `g(` dan `t(` sama-sama `a(`; `=>` tetap `=>` |
| Blok | Satu sampai empat baris yang bersama-sama membentuk kode yang utuh |
| Kartu pola | Satu baris bentuk baku yang naik level tampilan: utuh → tanpa simbol → label petunjuk |
| Baris boss | Satu baris bercacat tunggal beserta daftar perbaikan yang sah |

---

## 2. Pengukuran

| ID | Prio | Kebutuhan | Kriteria terima | Asal | Menunggu |
|---|---|---|---|---|---|
| W-01 | P0 | Arena merekam latensi tiap transisi. | Latensi = selang dua tombol benar berurutan di baris yang sama, tanpa salah tekan, Backspace, jeda, atau keluar jendela di antaranya. Selang di atas 2.000 ms tidak dicatat. | N-T1 | — |
| W-02 | P0 | Arena merekam pasangan tertukar. | Saat `[` diminta dan `{` ditekan, tercatat satu kejadian `[→{`. Hanya dicatat bila karakter yang diminta adalah simbol. | N-T1 | — |
| W-03 | P0 | Tiap kunci transisi punya status: belum cukup data, lambat, atau lancar. | Belum cukup = kurang dari 10 sampel. Lancar = median 10 sampel terakhir < ambang **dan** akurasi pada transisi itu > 95%. Selain itu lambat. | N-T1; 060 §4.3 | K3 |
| W-04 | P0 | Hanya agregat yang disimpan. | Tidak ada daftar ketikan berurutan di save. Irisan data Tahap 3 di bawah 50 kB untuk profil dengan 100 sesi tiruan. | 060 §4.10 | — |
| W-05 | P0 | Perekaman hanya untuk kelompok sasaran dan diungkapkan. | Profil Kadet dan Ranger tidak menghasilkan data transisi. Kartu Dashboard dan pembuka ritual menyebut apa yang direkam. | 061 §4 | K2, K11 |
| W-06 | P0 | Transisi digolongkan menjadi kunci transisi. | `g(` dan `t(` menambah sampel ke `a(`; `=>` ke `=>`; `) {` ke `)␣` dan `␣{`. Huruf–huruf dan huruf–spasi tidak dicatat. | uji | — |
| W-07 | P0 | Perekaman di arena lama tidak mengubah perilakunya. | Semua uji yang ada lulus; skor, akurasi, dan WPM satu sesi sama dengan sebelum perubahan untuk urutan tombol yang sama. | 060 §8.1 | — |

## 3. Tingkat 1 — Cetak Motorik

| ID | Prio | Kebutuhan | Kriteria terima | Asal | Menunggu |
|---|---|---|---|---|---|
| W-10 | P0 | Generator menyusun sesi dari blok yang memuat transisi lambat. | Dengan data uji yang menandai `=>` lambat, sedikitnya 60% blok sesi memuat `=>`. Benih acak yang sama memberi sesi yang sama. | N-T1; 060 §4.4 | — |
| W-11 | P0 | Bank blok untuk HTML, CSS, JS. | Tiap kunci transisi sasaran (daftar di `docs/063_…` §6.2) dimuat sedikitnya 6 blok. | uji | K1 |
| W-12 | P0 | Sesi pertama memakai tombol lumpuh Tahap 1 sebagai benih. | Profil dengan tombol lumpuh `{` mendapat blok ber-`{` lebih dulu. Tanpa data Tahap 1, urutan bawaan per bahasa dipakai. | N-T1; 060 §4.2 | — |
| W-13 | P0 | Layar hasil menampilkan transisi yang dilatih dan perubahannya. | Tiap transisi sasaran tampil dengan median sebelum dan sesudah sesi, dan statusnya. | N-T1 | — |
| W-14 | P0 | Bank diperiksa per blok, bukan per baris. | Uji otomatis: tiap blok lolos pemeriksa struktur sebagai satu kesatuan; blok JS juga bisa diurai mesin JavaScript. | uji | — |
| W-15 | P0 | Blok yang baru dimainkan dihindari. | Blok yang muncul di sesi sebelumnya tidak dipilih selama masih ada blok lain yang memuat transisi sasaran. | 060 §10 | — |
| W-16 | P0 | Variasi lewat templat nama. | Blok bertemplat menghasilkan sedikitnya 3 varian yang semuanya lolos W-14. | 060 §4.4 | — |
| W-17 | P0 | Bahasa sesi mengikuti pertemuan yang sudah terbuka. | Mahasiswa yang baru sampai pertemuan HTML tidak mendapat blok JS. | 061 §5 | K6 |

## 4. Tingkat 2 — Perancah Memudar

| ID | Prio | Kebutuhan | Kriteria terima | Asal | Menunggu |
|---|---|---|---|---|---|
| W-20 | P0 | Tiga level tampilan per kartu: utuh, tanpa simbol, label petunjuk. | Target ketikan sama di ketiganya. Di level 1 tiap simbol yang belum diketik tampil sebagai `_`. Di level 2 hanya label yang tampil. | N-T2 | — |
| W-21 | P0 | Kartu naik level hanya setelah lulus tanpa bantuan. | Lulus = diselesaikan dengan akurasi ≥ 95% tanpa bantuan. Kartu yang dibantu tetap di levelnya; kartu yang gagal turun satu level. | N-T2; 060 §4.5 | — |
| W-22 | P0 | Bantuan setelah 3 salah di posisi yang sama. | Karakter di posisi itu ditampilkan; kartu ditandai dibantu untuk sesi itu. | 060 §4.5 | — |
| W-23 | P1 | Penjadwalan berjarak per kartu. | Kartu yang lulus muncul lagi pada selang yang memanjang; kartu yang gagal kembali ke selang terpendek. | Naskah (Spaced Repetition) | — |
| W-24 | P0 | Label petunjuk hanya untuk kartu yang bentuk bakunya sudah dilatih. | Kartu tidak bisa mencapai level 2 sebelum lulus level 0 dan level 1. Layar menyebut bahwa yang diminta adalah bentuk baku itu. | 060 §4.5 | K4 |
| W-25 | P0 | Kartu naik dari level 0 ke 1 setelah transisinya lancar. | Semua kunci transisi sasaran di kartu itu berstatus lancar. | N-T2 | K3 |
| W-26 | P0 | Baris berikutnya ikut disamarkan. | Pratinjau baris mendatang memakai level tampilan kartunya, tidak menampilkan teks utuh. | uji | — |
| W-27 | P0 | Rilis B hanya memakai level 0 dan 1. | Label petunjuk (level 2) tidak muncul sebelum Rilis C. | 061 §7 | — |

## 5. Tingkat 3 — Hiu Boss

| ID | Prio | Kebutuhan | Kriteria terima | Asal | Menunggu |
|---|---|---|---|---|---|
| W-30 | P0 | Baris boss menampilkan kode bercacat tunggal; targetnya versi benar. | Uji otomatis: baris yang tampil dan tiap jawabannya sama sampai satu titik, dan semua jawaban punya titik yang sama. | N-T3; 060 §4.6 | — |
| W-31 | P0 | Menyalin di titik cacat mengurangi nyawa. | Menekan karakter yang tampil di titik cacat, atau Enter saat baris masih sama dengan yang tampil, mengurangi 1 nyawa dan membuka penjelasan singkat. | N-T3 | — |
| W-32 | P0 | Lebih dari satu perbaikan sah diterima. | `==` dan `===` sama-sama menjinakkan `if (x = 5)`. | 060 §4.6 | — |
| W-33 | P0 | Pembongkaran setelah boss. | Tiap cacat tampil dengan sebelum, sesudah, dan penjelasan. Layar menyebut baris itu buatan tim CodeShark, bukan keluaran AI. | 061 §6 | — |
| W-34 | P0 | "Boss bahasa" terbuka setelah pertemuan terakhir bahasa itu Perak; di ritual, baris boss terbuka per pertemuan. | Boss bahasa: HTML setelah P8, CSS setelah P12, JS setelah P16. Ritual: baris boss dipakai bila pertemuan asalnya sudah Perak. | N-T3 | K1, K12 |
| W-35 | P0 | Cacat tiap baris boss nyata, dan tercatat siapa yang memastikannya: `mesin` atau `manusia`. | `mesin`: baris yang tampil ditolak pemeriksa struktur atau mesin JavaScript, dan tiap jawaban lolos. `manusia`: pemeriksa tidak melihat cacatnya; penjelasan wajib dan barisnya ada di daftar yang ditinjau orang. | uji | — |
| W-36 | P0 | Baris boss ditutup dengan Enter. | Baris tidak selesai otomatis saat karakter terakhir diketik. | 060 §4.6 | — |
| W-37 | P0 | Pengarahan sebelum boss pertama. | Sebelum baris boss pertama seumur profil, satu layar menjelaskan aturannya dengan satu contoh. | 060 §10 | — |
| W-38 | P0 | Sedikitnya 8 baris boss per bahasa. | Bank memuat ≥ 8 baris per bahasa; paling banyak separuhnya bertanda `manusia`. | — | K1 |

## 6. Ritme dan skor

| ID | Prio | Kebutuhan | Kriteria terima | Asal | Menunggu |
|---|---|---|---|---|---|
| W-40 | P1 | Kecepatan ancaman menyesuaikan dalam rentang terbatas. | Paling banyak satu langkah per baris; pengali 0,7×–1,4× dari kecepatan dasar kelompok usia. | N-Ritme; 060 §4.7 | — |
| W-41 | P1 | Sorotan tombol setelah salah tekan beruntun. | Setelah 3 salah beruntun, tombol berikutnya disorot pada keyboard layar sampai baris itu selesai. Di Tingkat 2, baris yang disorot ditandai dibantu. | N-Ritme | — |
| W-42 | P1 | Bonus Blok Bersih 5×. | Baris tanpa salah tekan dan tanpa Backspace mendapat pengali skor 5× sebagai ganti pengali combo. | N-Skor; 060 §4.8 | K5 |
| W-46 | P1 | Syarat lulus tidak bergantung pada ritme. | Status transisi, kenaikan kartu, dan hasil boss sama untuk urutan tombol yang sama pada pengali berapa pun. | 060 §4.7 | — |
| W-47 | P1 | Ritme tiap sesi tercatat. | Ringkasan sesi memuat pengali terendah dan tertinggi. | 060 §8.7 | — |

## 7. Ritual

| ID | Prio | Kebutuhan | Kriteria terima | Asal | Menunggu |
|---|---|---|---|---|---|
| W-43 | P0 | Sesi ritual 10 menit menurut jam. | Berhenti pada 10:00 walaupun baris belum habis. Jam tetap berjalan saat sesi dijeda atau jendela ditinggalkan. | N-Ritual; 060 §4.9 | — |
| W-44 | P0 | Layar bukti di akhir ritual. | Memuat nama profil, tanggal dan jam selesai, durasi, serta ringkasan tiga tingkat. Tetap bisa dibuka lagi pada hari yang sama. | N-Ritual | K8 |
| W-45 | P0 | Satu ritual per hari yang dihitung. | Ritual kedua di hari yang sama boleh dimainkan; hitungan ritual, XP, dan streak tidak bertambah. | 061 §6 | K9 |
| W-48 | P0 | Ritual tanpa "game over". | Kehilangan nyawa dicatat dan ancaman kembali nol; sesi berlanjut sampai 10:00. | 061 §5 | K10 |
| W-49 | P0 | Pembagian waktu menyesuaikan yang tersedia. | Bila tidak ada kartu jatuh tempo atau belum ada baris boss yang terbuka, waktunya diberikan ke tingkat sebelumnya; total tetap 10 menit. | 060 §8.8 | — |
| W-60 | P0 | Kartu Dashboard "Ritual Pra-Lab". | Tampil untuk kelompok sasaran dengan keyboard fisik; menunjukkan status hari ini (belum, selesai) dan tiga transisi sasaran. | N-Ritual | K2 |
| W-61 | P0 | Imbalan ritual tetap. | 40 XP pada ritual pertama hari itu berapa pun hasilnya; ritual dihitung sebagai aktivitas harian untuk streak; tanpa koin. | 061 §10 | K9 |
| W-62 | P0 | Layar bukti menyebut latihan berikutnya. | Tiga transisi yang masih lambat dan jumlah kartu yang jatuh tempo besok. | 061 §6 | — |
| W-63 | P2 | Bukti tercatat ke server dengan kode kelas. | Hanya bila K8 memutuskan demikian. | 060 §4.9 | K8 |

## 8. Non-fungsional

| ID | Kebutuhan | Kriteria terima |
|---|---|---|
| W-50 | Sesi yang ada tidak berubah perilakunya. | Misi, Quest, Drill, Juggling, dan tantangan harian lulus uji alur yang sama sebelum dan sesudah |
| W-51 | Statistik, generator, penjadwal, aturan boss, dan pengatur ritme murni. | Semuanya diuji di Node tanpa DOM |
| W-52 | Tanpa dependensi baru dan tanpa panggilan ke layanan AI. | `package.json` tidak mendapat dependensi produksi baru |
| W-53 | Save lama terbaca; data ikut sinkron tanpa perubahan skema. | Save tanpa irisan `wave` dimuat tanpa galat; irisan yang rusak dibuang, bukan menggagalkan pemuatan |
| W-54 | Semua ambang dan pembagian waktu di satu berkas. | Tidak ada angka ambang di komponen antarmuka |
| W-55 | Menghormati `prefers-reduced-motion`. | Tanpa guncangan layar dan ledakan beranimasi saat pengaturan itu aktif |
| W-56 | Tidak ditawarkan di perangkat tanpa keyboard fisik. | Kartu menampilkan "Kerjakan di laptop", sama seperti Tahap 1 |
| W-57 | Arena baru dimuat malas. | Profil yang tidak mendapat modul ini tidak mengunduh kodenya |
| W-58 | Semua teks antarmuka berbahasa Indonesia dan mengikuti prinsip 1 PRD. | Tidak ada kata otak, memori, atau generasi di layar |

---

## 9. Perubahan dari `docs/060_…` §7

| ID | Perubahan | Alasan |
|---|---|---|
| W-01, W-03 | "Pasangan karakter" menjadi "transisi" yang digolongkan (W-06) | Pasangan persis seperti `g(` terlalu jarang berulang untuk mencapai 10 sampel |
| W-11 | "Tiap baris lolos pemeriksa struktur" menjadi pemeriksaan per blok (W-14) | 64 dari 161 baris drill dianggap rusak bila diperiksa sendirian |
| W-30 | Syarat "berbeda di tepat satu tempat" dirinci menjadi titik cacat bersama | Supaya bisa diuji otomatis |
| W-34 | Ditambah aturan ritual: baris boss terbuka per pertemuan | Dengan aturan lama, ritual tanpa boss sampai pertemuan 8 |
| W-13, W-34 | Naik dari P1 ke P0 | Dibutuhkan Rilis B |
| W-43 | Jam tetap berjalan saat jeda | Arena lama berhenti otomatis saat jendela ditinggalkan; ritual tidak |
| Baru | W-05–W-07, W-14–W-17, W-25–W-27, W-35–W-38, W-46–W-49, W-55–W-58, W-60–W-63 | Muncul saat rancangan dirinci |

## 10. Di luar cakupan

- Menjalankan kode dalam bahasa apa pun.
- Python dan Dart, kecuali K1 memutuskan lain.
- Hiu-hiu terpisah yang berenang membawa teks.
- Pembuatan blok atau baris boss oleh layanan AI.
- Mengunci atau mendeteksi IDE.
- Trigraf (tiga tombol berurutan); datanya lebih jarang lagi daripada pasangan.
- Mengubah mesin arena lama menjadi ketik bebas, kecuali K5 memutuskan lain.
- Teks proposal SATRIA.
