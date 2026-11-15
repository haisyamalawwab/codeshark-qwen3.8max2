# 057 — Requirement: Tahap 1 – Pemicu, Simulasi Krisis Produksi

> Disimpan: 14-11-2026 18:17 WIB (+07).
> Branch kerja: `arena/49b4581b-codeshark-qwen3-8max2` (dari `main` @ `79a66c6`).
> Status: **berlaku.** Bagian 2 mencatat kebutuhan yang sudah dipenuhi di `main`;
> bagian 3 adalah kebutuhan baru untuk rilis berikutnya.
> Dokumen pasangan: `docs/056_…` (PRD), `docs/058_…` (Design), `docs/059_…` (Tasklist).
> Diperbarui 14-11-2026 20:15 WIB: bagian 3.5 (kebutuhan dari Tahap 3) dan bagian 6.
> Kebutuhan Tahap 3 sendiri (W-01 dst.) ada di `docs/062_…` (diperbarui 14-11-2026 21:10 WIB; sebelumnya `docs/060_…` §7).

---

## 1. Cara membaca

**Status**

| Tanda | Arti |
|---|---|
| ✅ | Dibangun dan diuji (uji unit atau uji alur di Chromium headless) |
| ◐ | Dibangun, tetapi ada jalur yang belum diuji; celahnya disebut di kolom catatan |
| ☐ | Belum dibangun |

**Prioritas** untuk kebutuhan baru: **P0** = harus ada sebelum dipakai di kelas,
**P1** = rilis berikutnya, **P2** = setelah itu.

Kolom "Asal" menunjuk ke bagian dokumen sumber: `052 §x`, `053 §x`, `054 §x`,
`055 §x`, atau "naskah" untuk naskah modul dari pemilik proyek.

---

## 2. Kebutuhan yang sudah dipenuhi (R1 dan R1.1)

### 2.1 Audiens dan gerbang

| ID | Kebutuhan | Status | Asal | Catatan |
|---|---|---|---|---|
| G-01 | Profil Academy dengan keyboard fisik, tanpa percobaan dan tanpa penangguhan, melihat simulasi saat membuka `/codingshark/`; Dashboard tidak sempat tampil. | ◐ | 055 §2 | Belum diuji: masuk lewat akun dan ganti kelompok usia di halaman profil |
| G-02 | Pengguna baru yang memilih Academy: onboarding → simulasi → Dashboard. | ✅ | 055 §2 | |
| G-03 | Gerbang berlaku satu kali. Setelah satu percobaan tersimpan, CodeShark terbuka seperti biasa. | ✅ | 052 D3 | |
| G-04 | Senior Diver tidak digerbang; simulasi tersedia lewat kartu Dashboard. | ✅ | 052 D1 | |
| G-05 | Kadet dan Ranger tidak melihat modul ini di mana pun. | ✅ | 052 D1 | |
| G-06 | Perangkat tanpa keyboard fisik tidak digerbang; kartu Dashboard menampilkan "Kerjakan di laptop" tanpa tombol mulai. Laptop berlayar sentuh tetap digerbang. | ✅ | 052 §5.4, 054 §3 | |
| G-07 | Di Coding Tower, gerbang ada di latihan pertama, bukan di pintu masuk. | ◐ | 055 §4 | Diuji sebelum perombakan `App.tsx` di PR #16; setelahnya hanya "Dashboard tampil" yang diuji |
| G-08 | Tautan penangguhan aksesibilitas di pengarahan membuka CodeShark tanpa diagnosis dan bertahan setelah muat ulang. | ✅ | 053 §11 | |
| G-09 | Pengarahan gerbang masuk menyediakan tautan "Kembali ke hub". | ✅ | 055 §4 | |
| G-10 | Muat ulang di tengah arena tidak meloloskan mahasiswa; percobaan yang ditinggalkan tidak tercatat. | ✅ | 055 §6 | Skenario dipilih ulang dan waktu kembali 3 menit |

### 2.2 Pengarahan

| ID | Kebutuhan | Status | Asal |
|---|---|---|---|
| B-01 | Pengarahan menampilkan cerita insiden, empat aturan, dan target pemulihan. | ✅ | 053 §4 |
| B-02 | Tombol mulai nonaktif sampai mahasiswa memilih keyakinan diri 1–5. | ✅ | 052 D6 |
| B-03 | Pengarahan menyebut apa yang direkam, di mana disimpan, dan bahwa hasil tidak memengaruhi nilai, rank, atau koin. | ✅ | 052 §8.3 |
| B-04 | Hitung mundur singkat sebelum arena. | ✅ | 053 §4 |

### 2.3 Babak 1 — arena

| ID | Kebutuhan | Status | Asal | Catatan |
|---|---|---|---|---|
| A-01 | Tiap skenario adalah satu berkas HTML + CSS + JS dengan 4 cacat: kutip atribut HTML, satu cacat CSS, nama variabel JS yang nyaris sama, dan satu baris JS terpotong yang harus ditulis ulang. | ✅ | Keputusan pemilik; 053 §2.2 | |
| A-02 | Batas waktu 180 detik, dihitung dari jam monotonik; pindah tab tidak menghentikan waktu. | ◐ | Naskah; 052 §5.3 | Uji "pindah tab 10 detik mengurangi 10 detik" belum dijalankan terpisah |
| A-03 | Editor polos: tanpa pewarnaan bantuan, autocomplete, koreksi otomatis, atau pemeriksa ejaan. Tab menyisipkan dua spasi. | ✅ | 053 §5.3 | |
| A-04 | Tempel, seret-lepas, teks pengganti, dan sisipan dari skrip ditolak serta dihitung. | ✅ | 052 §5.3, 054 §6 | Pagar kelas, bukan pengawas: bisa dilewati lewat DevTools |
| A-05 | Tombol Jalankan dan Ctrl/⌘+Enter mengeksekusi kode dan menampilkan pesan error asli dari browser beserta nomor baris yang cocok dengan editor. | ✅ | 053 §5.2 | |
| A-06 | Tiga pemeriksaan produksi per skenario tampil dengan status lulus atau gagal. | ✅ | 053 §5.2 | |
| A-07 | Arena selesai dengan tiga cara: waktu habis, diakhiri mahasiswa, atau otomatis saat produksi pulih. | ✅ | 054 §7 | |
| A-08 | Kode mahasiswa tidak bisa membaca halaman induk, penyimpanan, atau cookie, dan tidak bisa membuat halaman macet. | ✅ | 053 §5.2 | Kode yang memuat perulangan tidak dijalankan; batas tunggu 2,5 detik. Isolasi ini tidak mencegah pemalsuan laporan hasil (V-09) |
| A-09 | Latar beranimasi dimatikan selama arena supaya tidak mencemari pengukuran jeda. | ✅ | 054 §6 | |

### 2.4 Babak 2 — diagnosis

| ID | Kebutuhan | Status | Asal |
|---|---|---|---|
| D-01 | Vonis mengikuti hasil: `PRODUKSI PULIH`, `PRODUKSI MASIH DOWN` (≥ separuh cacat diperbaiki), `PRODUKSI TETAP DOWN`. Kalimat terkeras hanya pada hasil terakhir. | ◐ | Keputusan pemilik; 052 D4 |
| D-02 | Keyakinan diri disandingkan dengan hasil. | ✅ | 052 D6 |
| D-03 | Cermin 1: putar ulang ketikan, dengan label durasi asli pada tiap beku dan penanda rentetan hapus. Menghormati `prefers-reduced-motion`. | ✅ | 053 §6.1 |
| D-04 | Cermin 2: mahasiswa dan AI berdampingan; angka AI selalu tampil bersama asumsinya. | ✅ | 053 §6.2 |
| D-05 | Cermin 3: peta panas keyboard. Hanya jeda di tengah rangkaian mengetik yang dihitung; tombol menyala bila jedanya > 2 detik; bila ketukan bersambung < 8, peta menyatakan data tidak cukup. | ✅ | 053 §2.3, §6.3 |
| D-06 | Cermin 4: angka pendukung (waktu baca awal, jeda setelah error, beku, hapus, jumlah Jalankan, suntingan di baris yang tidak rusak) dan catatan integritas. | ✅ | 053 §6.4 |
| D-07 | Cermin 5: pembongkaran keempat cacat (sebelum, sesudah, penjelasan, diperbaiki atau tidak) dan pernyataan bahwa kode itu bukan keluaran AI sungguhan. Selalu tampil sebelum tombol lanjut. | ✅ | 053 §2.5, K4 |
| D-08 | Efek domino = temuan pemeriksa sintaks yang baru muncul dibanding snapshot sebelumnya, dibandingkan per identitas temuan. | ✅ | 054 §3 |
| D-09 | Teks tentang jeda memakai rumusan "konsisten dengan", bukan diagnosis. | ✅ | 053 §2.4 |
| D-10 | Diagnosis ditutup dengan arah tindakan dan pernyataan bahwa hasil tidak memengaruhi nilai. | ✅ | 052 §7 |

Catatan D-01: vonis `PRODUKSI PULIH` bisa dipalsukan dari dalam kode mahasiswa.
Cacat ini ditemukan saat menyusun dokumen ini dan sudah direproduksi; lihat V-09.

### 2.5 Riwayat dan data

| ID | Kebutuhan | Status | Asal | Catatan |
|---|---|---|---|---|
| T-01 | Menyimpan paling banyak 10 percobaan; log ketikan mentah untuk 5 terbaru; ≤ 1.500 peristiwa per log; kode akhir ≤ 4.000 karakter. | ✅ | Keputusan pemilik | |
| T-02 | Data tersimpan di irisan `aiTrap` pada save dan ikut sinkron cloud tanpa perubahan skema. | ◐ | 052 §8.2 | Sinkron ke server sungguhan belum pernah dijalankan |
| T-03 | Save lama tanpa irisan `aiTrap` terbaca tanpa galat. | ✅ | 053 §10 | |
| T-04 | Riwayat menampilkan semua percobaan; tiap diagnosis bisa dibuka lagi. | ✅ | 054 §7 | |
| T-05 | Tombol "Unduh telemetri (JSON)" mengekspor seluruh riwayat. | ✅ | Keputusan pemilik | Berkas memuat nama profil dan id perangkat |
| T-06 | Mengulang simulasi memberi skenario yang berbeda dari percobaan terakhir. | ✅ | 054 §7 | |
| T-07 | 30 XP pada percobaan pertama saja, berapa pun hasilnya. Tanpa pengaruh ke rank atau koin. | ✅ | 052 §5.4 | |
| T-08 | Percobaan tidak masuk Riwayat Misi dan statistik latihan reguler. | ✅ | 052 §8.2 | |

---

## 3. Kebutuhan baru

### 3.1 R2 — Validasi dan kalibrasi

| ID | Prio | Kebutuhan | Kriteria terima | Asal |
|---|---|---|---|---|
| V-01 | P0 | Jalur yang berstatus ◐ di bagian 2 diuji. | G-01 (masuk akun, ganti usia), G-07 (gerbang Coding Tower dan ulangi dari sana), A-02 (pindah tab), dan T-02 (sinkron) punya hasil uji tertulis. | 054 §7, 055 §5 |
| V-02 | P0 | Uji alur browser bisa dijalankan ulang dari repo. | Satu perintah npm menjalankan skenario: perbaikan penuh, perbaikan sebagian, waktu habis, dan aturan gerbang; skrip ada di repo, bukan di `/tmp`. | — |
| V-03 | P0 | Modul berjalan di Firefox dan Safari. | Daftar periksa manual 12 butir (bagian 6 `docs/059_…`) lulus di kedua browser, atau cacatnya tercatat. | 054 §9 |
| V-04 | P0 | Versi yang tayang memuat modul ini. | Situs produksi menampilkan gerbang untuk profil Academy baru. | — |
| V-05 | P0 | Uji coba dengan 3–5 mahasiswa. | Berkas telemetri tiap peserta terkumpul; catatan pengamatan berisi durasi total, butir yang membingungkan, dan reaksi terhadap nada. | 054 §9 |
| V-06 | P1 | Ambang dan batas waktu dikalibrasi dari data uji coba. | Nilai `SLOW_MS`, `FREEZE_MS`, `MIN_HEATMAP_KEYS`, dan `TRAP_LIMIT_MS` dipertahankan atau diubah, dengan alasan tertulis yang menunjuk ke data. | 052 §6 |
| V-07 | P1 | Angka pembanding AI punya tanggal acuan. | `AI_BENCHMARK` memuat tanggal dan tanggal itu tampil di layar bersama asumsinya. | 053 K3, §11 |
| V-08 | P1 | Status dokumen 054 dan 055 sesuai keadaan. | Baris status menyebut PR dan commit gabung. **Dikerjakan bersama dokumen ini.** | — |
| V-09 | P0 | Vonis tidak bisa dipalsukan oleh kode mahasiswa. | Kode yang mengirim laporan hasil sendiri dari dalam sandbox, tanpa memperbaiki cacat, tidak menghasilkan `PRODUKSI PULIH` dan tidak mengakhiri arena. Ada uji yang menjaganya. Rancangan: `docs/058_…` §8. | Temuan baru |

### 3.2 R3 — Konten dan diagnosis

| ID | Prio | Kebutuhan | Kriteria terima | Asal |
|---|---|---|---|---|
| C-01 | P1 | Skenario ke-3 dan ke-4 dengan pola 4 cacat yang sama. | Tiap skenario lulus uji yang sudah ada untuk skenario: kode awal gagal, kode acuan pulih, tiap cacat terdeteksi hanya bila perbaikannya benar, `checks` bisa dipadatkan satu baris. | 054 §9 |
| C-02 | P1 | Diagnosis percobaan ulang menyandingkan hasil dengan percobaan pertama. | Pada percobaan ke-2 dan seterusnya tampil blok "dibanding percobaan pertamamu" untuk cacat diperbaiki, tombol lumpuh, waktu beku, dan efek domino. Tidak tampil pada percobaan pertama. | PRD §3 tujuan 3 |
| C-03 | P1 | Daftar temuan sintaks pada kode akhir, dengan nomor baris dan kalimat manusia. | Bila kode akhir masih punya temuan, daftar tampil di Cermin 4; bila tidak ada, bagian itu tidak tampil. | 052 §7 butir 3 |
| C-04 | P2 | Metrik "salah tombol simbol": simbol diketik, dihapus, lalu diganti simbol lain dalam dua ketukan. | Terhitung dari log; punya uji unit; tampil di Cermin 4. | 052 §6 |
| C-05 | P2 | Ambang jeda relatif terhadap jeda dasar pribadi. | Hanya dikerjakan bila V-06 menunjukkan ambang tetap 2 detik keliru mengecap pengetik lambat. | 052 §6; PRD O3 |
| C-06 | P2 | Kecepatan menulis dibanding kecepatan menyalin (`stats.bestWpm`). | Tampil hanya bila mahasiswa sudah punya data latihan reguler. | 052 §6 |

### 3.3 R4 — Alat pengajar dan kontrol

| ID | Prio | Kebutuhan | Kriteria terima | Asal |
|---|---|---|---|---|
| P-01 | P1 | Rekap kelas anonim dari berkas telemetri. | Pengajar memilih banyak berkas JSON; halaman menampilkan sebaran hasil, cacat yang paling sering lolos, tombol lumpuh terbanyak, dan median waktu beku. Nama profil dan id perangkat di berkas tidak ditampilkan; tidak ada unggah ke server. | 054 §9; 053 §9 |
| P-02 | P1 | Ekspor CSV. | Satu baris per percobaan; kolomnya terdokumentasi; terbuka benar di aplikasi lembar kerja. | 053 §9 |
| P-03 | P1 | Persetujuan perekaman yang eksplisit. | Bentuknya bergantung pada keputusan O1 di PRD. Bila data dipakai untuk penelitian: kotak centang wajib di pengarahan dan pilihan "ikut tanpa menyimpan log mentah". | 052 §8.3; PRD O1 |
| P-04 | P2 | Sakelar admin untuk menyalakan atau mematikan modul. | Admin bisa mematikan modul; dokumen pengaturan lama tetap terbaca. Butuh migrasi pengaturan karena `validateSettings()` memeriksa daftar kunci secara persis. | 052 §10 |
| P-05 | P2 | Panduan fasilitasi satu halaman untuk pengajar. | Berisi urutan 5–7 menit, batasan modul (054 §8, 055 §6), dan pertanyaan pembuka diskusi. | Naskah |
| P-06 | P2 | Hapus data simulasi dari perangkat. | Tombol di riwayat menghapus semua percobaan dan log; penanda "sudah mengerjakan" tetap ada supaya gerbang tidak muncul lagi. | PRD O1 |

### 3.4 R5 — Pengerasan

| ID | Prio | Kebutuhan | Kriteria terima | Asal |
|---|---|---|---|---|
| H-01 | P2 | Peta panas menyatakan tata letak yang dipakai. | Keterangan "tata letak QWERTY-US" tampil; bila tata letak lain terdeteksi, peta menampilkan peringatan. | 054 §7 |
| H-02 | P2 | Diagnosis terbaca pembaca layar. | Vonis, lima Cermin, dan peta panas punya alternatif teks; diuji dengan satu pembaca layar. | 054 §7 |
| H-03 | P2 | Jembatan ke Tahap 2. | Setelah diagnosis, mahasiswa bisa menulis satu refleksi singkat yang tersimpan bersama percobaan. Cakupan Tahap 2 sendiri di luar dokumen ini. | Naskah |
| H-04 | P2 | Varian Python/Dart tanpa eksekusi. | Ditunda sampai O7 di PRD diputuskan. | 053 §2.1 |

### 3.5 Kebutuhan dari Tahap 3 – Aksi

Tahap 3 (`docs/060_…`) memakai hasil Tahap 1. Tiga kebutuhan di bawah ini
adalah pekerjaan di sisi Tahap 1.

| ID | Prio | Kebutuhan | Kriteria terima | Asal |
|---|---|---|---|---|
| X-01 | P1 | Tombol lumpuh Tahap 1 bisa dibaca sebagai benih personalisasi. | Satu fungsi murni mengembalikan daftar tombol lumpuh dari percobaan pertama, atau daftar kosong bila tidak ada data atau ketukan bersambung < 8. Datanya sudah tersimpan (`metrics.keys`, `slowKeys`); fungsinya belum ada. | 060 §4.2, W-12 |
| X-02 | P1 | Simulasi Tahap 1 bisa diulang sebagai pembanding setelah ritual Tahap 3. | Bergantung pada C-02: blok perbandingan dengan percobaan pertama tampil, dan percobaan pertama tidak terbuang. | 060 §6 |
| X-03 | P2 | Keyboard layar bisa menyorot satu tombol. | `KeyboardHeatmap` (atau komponen tata letak yang dipisah darinya) menerima tombol yang disorot, tanpa data jeda. Dipakai sorotan tombol Tahap 3. | 060 §4.7, W-41 |

---

## 4. Kebutuhan non-fungsional

| ID | Kebutuhan | Status | Catatan |
|---|---|---|---|
| N-01 | Modul dimuat malas; tidak menambah beban halaman bagi profil yang tidak melihatnya. | ✅ | Chunk `AiTrapModule` ±40 kB (±13,5 kB gzip) saat PR #15 |
| N-02 | Tanpa dependensi baru. | ✅ | Pemeriksa sintaks dan keyboard dibuat sendiri |
| N-03 | Pengukuran jeda tidak tercemar render. | ✅ | ±50 fps di Chromium tanpa GPU setelah perbaikan 054 §6 |
| N-04 | Kode mahasiswa terisolasi dari data aplikasi. | ✅ | iframe `sandbox="allow-scripts"` tanpa `allow-same-origin` |
| N-05 | Ukuran data kecil dibanding batas sinkron 1 MB. | ✅ | ±11 kB per percobaan dengan log |
| N-06 | Fungsi metrik murni dan teruji di Node. | ✅ | `npm run test:trap` |
| N-07 | Bekerja di Chrome, Firefox, Safari versi terbaru. | ◐ | Hanya Chromium yang diuji (V-03) |
| N-08 | Semua teks antarmuka berbahasa Indonesia. | ✅ | |
| N-09 | Menghormati `prefers-reduced-motion`. | ◐ | Putar ulang ya; hitung mundur dan animasi lain belum diperiksa |

---

## 5. Kebutuhan dari rencana yang sengaja diubah atau tidak dipenuhi

| Rencana | Yang dibangun | Alasan |
|---|---|---|
| 052: editor kosong, "Rapor Kegagapan Sintaksis", berkas `blind*` | Tidak dibangun | Digantikan 053 atas naskah yang dikuatkan |
| 053 K1: hanya JavaScript | HTML + CSS + JS | Keputusan pemilik proyek |
| 053 §5.2: eksekusi di Web Worker dengan DOM tiruan | iframe ter-sandbox | Skenario butuh DOM sungguhan |
| 053 §10: `while (true) {}` dihentikan dalam 1,5 detik | Kode berisi perulangan tidak dijalankan; batas tunggu 2,5 detik | Skenario tidak membutuhkan perulangan |
| 053 K3: tanpa rupiah sampai pemilik memasok angka | Rentang "di bawah Rp 100" dengan asumsi | Diserahkan ke pelaksana |
| 053 K5: log mentah hanya percobaan terakhir, di perangkat saja | Log 5 percobaan terbaru, di dalam save, ikut sinkron | Keputusan pemilik: simpan log, rekaman, dan riwayat |
| 053 §6.4: efek domino = temuan di luar 4 jebakan awal | Temuan baru per identitas dibanding snapshot sebelumnya | Hitungan jumlah meluputkan kerusakan nyata (054 §3) |
| 052 D3: gerbang sebelum latihan pertama | Sebelum masuk CodeShark | Permintaan pemilik proyek (055) |

## 6. Di luar cakupan

- Tahap 2 dari modul transformatif, selain jembatan H-03. Tahap 3 punya
  dokumennya sendiri (`docs/060_…`).
- Eksekusi Python dan Dart.
- Tabel basis data khusus dan dasbor pengajar yang tersambung server.
- Pengawasan ujian: kamera, layar penuh paksa, kunci browser.
- Papan peringkat hasil simulasi.
