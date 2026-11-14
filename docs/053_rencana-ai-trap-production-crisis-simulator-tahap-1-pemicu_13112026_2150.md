# 053 — Rencana: The AI-Trap & Production Crisis Simulator (Tahap 1 – Pemicu, versi dikuatkan)

> Disimpan: 13-11-2026 21:50 WIB (+07).
> Branch kerja: `arena/25443d5c-codeshark-qwen3-8max2` (dari `main` @ `a3d2d87`).
> Status: **sudah diimplementasikan sebagai MVP** — lihat `docs/054_…` untuk yang
> benar-benar dibangun dan perbedaannya dari rencana ini.
> Dokumen ini **menggantikan** rencana 052 (Blind Live-Coding Challenge). Bagian
> 052 yang masih berlaku sudah disalin ke sini, sehingga 053 bisa dibaca sendiri.

---

## 1. Ringkasan

Pemicu berubah dari "menulis dari halaman kosong" menjadi skenario dua babak
berdurasi 5–7 menit:

- **Babak 1 — Jebakan (3 menit).** Mahasiswa menerima kode pendek yang disebut
  hasil AI untuk memperbaiki fitur yang "sedang down di produksi". Kode itu
  berisi 4 cacat tersembunyi. Mahasiswa menjalankan, membaca pesan error asli,
  dan memperbaikinya tanpa autocomplete dan tanpa tempel.
- **Babak 2 — Cermin (2–3 menit).** Diagnosis "AI-Dependency & Cognitive Debt":
  putar ulang ketikan, peta panas keyboard, kalkulator perbandingan dengan AI,
  lalu pembongkaran jebakan.

Bagian 2 berisi lima penyesuaian terhadap naskah modul, dan bagian 3 berisi
keputusan yang masih terbuka.

---

## 2. Penyesuaian terhadap naskah modul

Lima hal di naskah tidak bisa dibangun persis seperti tertulis, atau akan
menghasilkan angka yang tidak sahih. Usulan penggantinya ada di tiap butir.

### 2.1 Python dan Dart tidak bisa dieksekusi di aplikasi ini

Aplikasi hanya mengenal HTML, CSS, dan JS (`Lang` di `src/lib/highlight.ts`).
Modul backend Python dan modul lintas platform sudah dilepas dan diarsipkan
(dokumen 040 dan 041). Menjalankan Python di browser butuh *runtime* berukuran
megabita, dan Dart tidak punya jalur eksekusi di browser tanpa kompilasi.

**Usulan:** MVP memakai skenario **JavaScript** yang benar-benar dieksekusi.
Jebakan khas Python dan Dart (indentasi campur tab-spasi, `await` yang hilang)
dicatat sebagai fase lanjutan dengan pemeriksaan statis, tanpa eksekusi.

### 2.2 Tugas memperbaiki menghasilkan terlalu sedikit ketikan

Memperbaiki 3–4 cacat hanya butuh sekitar 10–40 ketukan. Itu tidak cukup untuk
putar ulang "backspace spam saat menulis `addEventListener('click', () => {})`"
maupun peta panas keyboard yang bermakna.

**Usulan:** satu dari empat jebakan berupa **baris yang terpotong saat disalin**
dan harus ditulis ulang utuh. Baris itu sengaja padat simbol. Dengan begitu
unsur "menulis sendiri" dari rencana 052 tetap ada di dalam Babak 1.

### 2.3 Jeda saat memperbaiki mencampur "mata" dan "jari"

Pada tugas perbaikan, jeda sebelum mengetik `}` bisa berarti mahasiswa sedang
mencari baris yang rusak, bukan mencari tombol. Bila semua jeda dimasukkan ke
peta panas, peta itu mengukur hal yang salah.

**Usulan:** dua ukuran dipisah.

- **Jeda pindai (mata):** waktu dari pesan error muncul sampai suntingan
  pertama, dan apakah suntingan itu mendarat di baris yang benar.
- **Jeda motorik (jari):** jeda sebelum sebuah tombol **di tengah rangkaian
  mengetik** pada posisi kursor yang bersambung. Hanya ini yang masuk peta panas.

### 2.4 Angka dan klaim di kalkulator harus bisa dipertanggungjawabkan

Naskah memuat tiga pernyataan yang bukan hasil pengukuran:

- "AI: 0,8 detik, Rp 5". Angka ini tidak bisa saya verifikasi dari lingkungan
  kerja ini, dan tarif API berubah-ubah.
- "Nilai ekonomis Anda Rp 0". Ini retorika, bukan perhitungan.
- "Membuktikan secara ilmiah" soal *working memory*. Peta jeda **konsisten
  dengan** beban kognitif, tetapi tidak membuktikannya.

**Usulan:** angka mahasiswa selalu angka terukur miliknya sendiri. Angka AI
diambil dari satu berkas konfigurasi, dan asumsinya (model, jumlah token,
tarif, tanggal) ditampilkan di layar. Kalimat keras hanya muncul bila hasilnya
memang gagal. Mahasiswa yang berhasil memperbaiki keempat jebakan mendapat
kalimat yang sesuai hasilnya. Pilihan tingkat ketajaman ada di K2.

### 2.5 "Kode buatan AI" sebenarnya kode yang sengaja dirusak

Skenario ini memakai pengelabuan: kode disebut hasil AI, padahal cacatnya
ditanam. Selain itu, AI masa kini jarang lupa menutup kurung; cacat seperti itu
lebih sering muncul karena potongan kode **terpotong saat disalin**.

**Usulan:**

- Babak 2 ditutup dengan **pembongkaran jebakan**: keempat cacat ditunjukkan
  satu per satu, disertai pernyataan bahwa cacat itu ditanam.
- Cacat sintaks dibingkai sebagai "terpotong saat disalin". Cacat semantik
  (nama variabel hampir mirip, logika keliru) dibingkai sebagai kekeliruan AI
  yang lolos karena tidak dibaca.
- Bila data dipakai untuk penelitian, layar pengantar perlu memuat persetujuan
  perekaman. Kebutuhan izin etik adalah keputusan pemilik proyek.

---

## 3. Keputusan yang perlu dikonfirmasi

| # | Keputusan | Bawaan yang diusulkan |
|---|---|---|
| K1 | Bahasa skenario | MVP: JavaScript yang dieksekusi, dua varian skenario. Python/Dart sebagai fase lanjutan tanpa eksekusi (2.1). |
| K2 | Ketajaman kalimat diagnosis | **Tajam-faktual**: semua angka terukur, kalimat keras hanya saat gagal, tanpa "Rp 0". Alternatif **keras**: naskah asli termasuk "Rp 0", diberi label provokasi, tetap hanya saat gagal. |
| K3 | Angka pembanding AI | Pemilik proyek memasok model, tarif, dan tanggal acuan. Sebelum itu ada, kalkulator hanya menampilkan waktu, tanpa rupiah. |
| K4 | Pembongkaran jebakan di akhir | Wajib tampil (2.5). |
| K5 | Penyimpanan rekaman ketikan | Rekaman mentah hanya untuk percobaan terakhir, di perangkat saja, tidak ikut sinkron. Agregat ikut sinkron. |

Keputusan 052 yang belum dijawab tetap memakai bawaannya:

- Wajib untuk kelompok `academy`, opsional untuk `senior`, tidak tampil untuk
  `junior` dan `teen`. Naskah baru lebih keras, jadi pembatasan usia ini makin
  penting.
- Wajib satu kali sebelum latihan pertama, termasuk untuk pengguna lama.
- Di perangkat sentuh ditunda; Coding Tower tetap terbuka.
- Hasil tidak memengaruhi nilai, rank, atau koin. Hadiah tetap 30 XP sekali.
- Pertanyaan keyakinan diri 1–5 sebelum mulai tetap ada. Dalam naskah baru ia
  menjadi "babak ilusi" yang dibandingkan dengan hasil di Babak 2.

---

## 4. Alur dan pembagian waktu

| Langkah | Durasi | Isi |
|---|---|---|
| Pengarahan | ±30 detik | Narasi "produksi down", aturan, apa yang direkam, pertanyaan keyakinan diri. |
| Babak 1 | 180 detik | Editor berisi kode beracun, tombol **Jalankan**, panel konsol. Timer tidak bisa dijeda. |
| Babak 2 | 2–3 menit | Putar ulang → peta panas → kalkulator → pembongkaran jebakan → tombol **Mulai latihan reguler**. |

Gerbang dipasang di `enterPractice()` pada `src/App.tsx`, satu-satunya pintu
masuk semua latihan. Materi bacaan tidak dikunci.

---

## 5. Babak 1 — Jebakan

### 5.1 Contoh skenario "Tombol Tambah ke Keranjang macet"

```js
const hargaSatuan = 15000;
let jumlahBarang = 0;
const tombol = document.querySelector('#tambah');
const label = document.querySelector('#total);        // jebakan 1

function hitungTotal(jumlah) {
  return jumlah * hargaSatuaan;                        // jebakan 2
}

// (baris pemasangan klik terpotong saat disalin)      // jebakan 3
  jumlahBarang += 1;
  label.textContent = hitungTotal(jumlahBarang);
                                                       // jebakan 4
```

| # | Jebakan | Jenis | Gejala di konsol |
|---|---|---|---|
| 1 | Tanda kutip tidak ditutup | Sintaks | `SyntaxError` di baris itu |
| 2 | `hargaSatuaan` alih-alih `hargaSatuan` | Semantik | `ReferenceError` baru muncul setelah sintaks beres |
| 3 | Baris `tombol.addEventListener('click', () => {` hilang, harus ditulis utuh | Sintaks + motorik | Pesan error menunjuk baris lain |
| 4 | Penutup `});` hilang | Sintaks | "Unexpected end of input" di baris terakhir, bukan di lokasi cacat |

Efek domino tidak perlu direkayasa. Mesin JavaScript hanya melaporkan satu
*syntax error* setiap kali dijalankan, sehingga memperbaiki satu cacat
memunculkan pesan berikutnya. Varian kedua memakai pola yang sama dengan cerita
berbeda, dan percobaan ulang tidak memakai varian yang sama.

### 5.2 Menjalankan kode

- Tombol **Jalankan** mengeksekusi kode di **Web Worker** dengan DOM tiruan
  kecil (`querySelector`, `addEventListener`, `textContent`, `click`).
- Worker dipilih karena bisa dimatikan paksa. Kode yang macet dihentikan
  setelah 1,5 detik tanpa membekukan halaman.
- Pesan error ditampilkan apa adanya dari mesin, lengkap dengan nomor baris
  (`ErrorEvent.lineno`).
- Bila kode lolos, penguji otomatis mensimulasikan dua klik dan memeriksa
  label bernilai `30000`. Status "PRODUKSI PULIH" hanya muncul bila uji ini lulus.
- Jumlah klik **Jalankan** tidak dibatasi dan ikut dicatat.

### 5.3 Aturan editor

Berlaku aturan dari rencana 052:

- `<textarea>` polos: tanpa autocomplete, koreksi otomatis, penutup kurung
  otomatis, maupun pewarnaan sintaks.
- Tempel, seret-lepas, klik kanan, sisipan pengganti, dan ketikan sintetis
  ditolak dan dihitung.
- Pindah tab tidak menghentikan timer; jumlah dan lamanya dicatat.
- Browser tidak bisa mencegah penggunaan AI di perangkat kedua. Fitur ini alat
  penyadaran, bukan ujian terawasi.

---

## 6. Babak 2 — Cermin

### 6.1 Putar ulang ketikan (*Keystroke Ghost Replay*)

- Rekaman 180 detik diputar dalam ±10 detik (18×).
- Pada kecepatan itu, kursor yang beku 5 detik hanya tampil 0,3 detik. Karena
  itu setiap beku ditandai kursor merah berdenyut dan label durasi aslinya
  ("membeku 7 dtk").
- Rentetan `Backspace` ditandai merah dan dihitung di sudut layar.
- Tombol putar ulang tersedia; pemutaran menghormati `prefers-reduced-motion`.

### 6.2 Kalkulator perbandingan dengan AI (*Employability Shock Metric*)

Baris yang ditampilkan:

- Waktu mahasiswa, jumlah jebakan yang diperbaiki dari 4, dan status uji.
- Kerusakan baru yang ia timbulkan sendiri (6.4).
- Waktu dan biaya AI untuk tugas setara, dengan asumsi tertulis (K3).
- Keyakinan diri sebelum mulai, disandingkan dengan hasilnya.
- Kalimat kesimpulan sesuai hasil dan tingkat ketajaman (K2).

### 6.3 Peta panas kelumpuhan motorik (*Motoric Paralysis Heatmap*)

- Gambar keyboard di layar (SVG), tata letak US.
- Tombol menyala merah bila jeda motorik sebelum tombol itu **lebih dari
  2 detik**, sesuai naskah. Kepekatan warna mengikuti jeda terlama.
- `=>` dan `()` dipetakan ke tombol fisiknya: `=`, `>`, `(`, `)`.
- Simbol yang memakai Shift (`{`, `}`, `:`, `_`, `(`, `)`) ditampilkan sebagai
  separuh atas tombolnya, terpisah dari karakter tanpa Shift.
- Tombol yang tidak pernah ditekan diberi warna netral, bukan hijau, supaya
  tidak terbaca sebagai "lancar".
- Keterangan memakai rumusan "jeda ini konsisten dengan perhatian yang tersedot
  ke pencarian tombol" (2.4).

### 6.4 Metrik yang dihitung

| Metrik | Definisi |
|---|---|
| Jebakan diperbaiki | Dari 4, diperiksa per jebakan pada kode akhir. |
| Produksi pulih | Uji otomatis lulus atau tidak. |
| Jeda pindai | Waktu dari pesan error muncul sampai suntingan pertama. |
| Salah sasaran | Suntingan pada baris yang tidak bercacat. |
| **Efek domino** | Jumlah temuan pemeriksa sintaks yang **bukan** bagian dari 4 jebakan awal, dihitung setiap kali **Jalankan** ditekan. |
| Jeda motorik per tombol | Lihat 2.3; ambang 2 detik. |
| Beku | Selang tanpa ketikan ≥ 5 detik. |
| Koreksi | Jumlah `Backspace`/`Delete` dan rentetan terpanjangnya. |
| Jumlah Jalankan | Berapa kali kode dieksekusi. |
| Integritas | Upaya tempel, sisipan ditolak, keluar fokus. |

Pemeriksa sintaks tetap dibuat sendiri tanpa dependensi (pasangan kurung dan
kutip), dan kini hanya dipakai untuk menghitung efek domino. Pesan error yang
dilihat mahasiswa berasal dari mesin JavaScript.

---

## 7. Data dan penyimpanan

- `SaveData` mendapat irisan opsional `aiTrap`: maksimal 10 percobaan berisi
  agregat bagian 6.4, peta jeda per tombol, keyakinan diri, id skenario, dan
  kode akhir (maksimal 4.000 karakter).
- `parseSave()` sudah menyalin kunci tak dikenal, dan `validatePayload()` di
  server hanya memeriksa `modules`, `stats`, `xp`, `coins`. Irisan baru ikut
  tersinkron sebagai `save_data` **tanpa migrasi skema**.
- Rekaman ketikan mentah disimpan di kunci `localStorage` terpisah, hanya untuk
  percobaan terakhir, tidak ikut sinkron (K5). Akibatnya putar ulang hanya
  tersedia di perangkat tempat percobaan dikerjakan.
- Percobaan tidak dicatat ke `history.ts` / `cs_attempts`, karena bentuk
  `AttemptRecord` tidak cocok dan akan mengotori Riwayat Misi.

---

## 8. Perubahan berkas

| Berkas | Perubahan |
|---|---|
| `src/data/aiTrapScenarios.ts` (baru) | Dua skenario: kode beracun, daftar jebakan, uji otomatis, narasi. |
| `src/data/aiBenchmark.ts` (baru) | Angka pembanding AI beserta asumsi dan tanggal (K3). |
| `src/lib/trapRunner.ts` (baru) | Eksekusi di Web Worker, DOM tiruan, batas waktu, pemetaan nomor baris. |
| `src/lib/trapMetrics.ts` (baru) | Fungsi murni: rekaman ketikan → metrik, peta jeda, data putar ulang. |
| `src/lib/trapLint.ts` (baru) | Pemeriksa pasangan kurung dan kutip untuk efek domino. |
| `src/ui/AiTrapChallenge.tsx` (baru, *lazy chunk*) | Pengarahan dan Babak 1. |
| `src/ui/AiTrapDiagnostic.tsx` (baru) | Babak 2: putar ulang, kalkulator, pembongkaran jebakan. |
| `src/ui/KeyboardHeatmap.tsx` (baru) | Keyboard SVG. |
| `src/App.tsx` | Layar `trap` dan `trap-diagnostic`; gerbang di `enterPractice()`. |
| `src/lib/storage.ts` | Tipe dan penormal irisan `aiTrap`. |
| `src/ui/Dashboard.tsx` | Kartu diagnosis: lihat lagi, ulangi, atau "Kerjakan di laptop". |
| `src/ui/ui.css` | Gaya editor, konsol, putar ulang, peta panas. |
| `tests/trap-metrics.test.mjs`, `tests/trap-lint.test.mjs` (baru) | Uji unit, pola `tests/boot-loading.test.mjs`. |
| `package.json` | Skrip `test:trap`. |
| `README.md`, dokumen `docs/054_…` | Fitur dan catatan implementasi. |

---

## 9. Tahapan kerja

| Fase | Isi | Selesai bila |
|---|---|---|
| F1 | `trapMetrics`, `trapLint`, `trapRunner`, skenario, uji unit | `npm run test:trap` lulus |
| F2 | Babak 1: pengarahan, editor, Jalankan, konsol, timer, pemblokiran | Empat jebakan bisa diperbaiki dan "PRODUKSI PULIH" muncul |
| F3 | Babak 2: putar ulang, peta panas, kalkulator, pembongkaran | Diagnosis benar untuk kasus gagal, sebagian, dan berhasil |
| F4 | Gerbang, penyimpanan, kartu Dashboard, penundaan di HP | Pengguna baru dan lama melewati gerbang tepat satu kali |
| F5 | `npm run lint`, `npm run build`, uji manual, README, dokumen 054 | Semua pemeriksaan lulus |
| Lanjutan | Varian Python/Dart tanpa eksekusi, rekap kelas untuk dosen, ekspor CSV, sakelar admin | Di luar MVP |

---

## 10. Pengujian dan kriteria terima

Uji unit:

- Jeda 3 detik sebelum `{` di tengah rangkaian mengetik masuk peta panas; jeda
  yang sama setelah pindah kursor tidak masuk.
- Jeda 1,9 detik tidak menyalakan tombol; 2,1 detik menyalakan.
- Efek domino: kode awal bernilai 0, menambah satu kurung tak berpasangan
  bernilai 1.
- Tiap jebakan terdeteksi "diperbaiki" hanya bila perbaikannya benar.
- Save lama tanpa irisan `aiTrap` terbaca tanpa galat.

Uji manual di peramban:

- Kode awal menghasilkan `SyntaxError`; memperbaiki satu jebakan memunculkan
  pesan berikutnya.
- Kode dengan `while (true) {}` dihentikan dalam 1,5 detik dan halaman tetap
  responsif.
- Tempel dan seret-lepas ditolak dan terhitung.
- Pindah tab 10 detik mengurangi timer 10 detik.
- Putar ulang selesai dalam ±10 detik dan menampilkan label beku.
- Mahasiswa yang memperbaiki keempat jebakan tidak menerima kalimat gagal.
- Pembongkaran jebakan selalu tampil sebelum tombol lanjut.
- Profil `junior` dan `teen` tidak pernah melihat modul ini.
- `/codingshark/` dan `/codingtower/` berperilaku sama dengan entri utama.

---

## 11. Risiko

| Risiko | Penanganan |
|---|---|
| Rasa malu membuat mahasiswa berhenti, bukan berefleksi | Hasil tidak memengaruhi nilai; diagnosis selalu ditutup dengan arah tindakan; ketajaman bisa dipilih (K2). |
| Diagnosis ditayangkan di proyektor kelas | Tidak ada papan peringkat; diagnosis hanya tampil di layar mahasiswa sendiri. |
| Mahasiswa merasa ditipu soal "kode AI" | Pembongkaran jebakan wajib tampil (K4). |
| Angka AI usang atau dipersoalkan | Satu berkas konfigurasi dengan asumsi dan tanggal yang ditampilkan (K3). |
| Peta panas kosong karena mahasiswa hampir tidak mengetik | Jebakan 3 memaksa menulis satu baris utuh; bila data tetap kurang, peta menampilkan "data tidak cukup". |
| Pesan error berbeda antar-peramban | Diterima sebagai kondisi nyata; deteksi jebakan tidak bergantung pada teks pesan. |
| Mahasiswa yang mahir tidak mengalami dilema | Diagnosis mengakui hasilnya dan mengarahkannya ke latihan kecepatan. |
| Kebutuhan aksesibilitas | Tautan "Saya tidak bisa mengerjakan ini" di pengarahan: menunda tanpa diagnosis. |

---

## 12. Di luar cakupan

- Tahap 2 dan seterusnya dari modul transformatif.
- Eksekusi Python dan Dart.
- Tabel TiDB khusus dan dasbor dosen.
- Pengawasan ujian (kamera, layar penuh paksa, kunci peramban).
