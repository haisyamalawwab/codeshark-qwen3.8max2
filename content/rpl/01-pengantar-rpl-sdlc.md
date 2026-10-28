# Pertemuan 1 — Pengantar Rekayasa Perangkat Lunak & SDLC

> **Tahap:** RPL (Pertemuan 1 dari 6) · **Fondasi:** perangkat lunak yang baik dibangun dengan rekayasa, bukan dengan sulap dan begadang.

**Tujuan pertemuan ini:** kamu mampu (1) menjelaskan apa itu perangkat lunak dan rekayasa perangkat lunak, (2) menyebutkan fase-fase SDLC beserta hasil tiap fase, dan (3) memetakan sebuah contoh aplikasi ke fase SDLC.

Pernah mendengar aplikasi yang *error* tepat saat dipakai banyak orang? Atau proyek aplikasi yang janjinya selesai 3 bulan tetapi molor sampai setahun? Masalah seperti itu jarang disebabkan programmer yang tidak bisa mengetik kode — penyebabnya hampir selalu **kurangnya rekayasa**: kebutuhan tidak jelas, desain tidak dipikirkan, dan pengujian dilakukan seadanya. Di tahap RPL ini kamu belajar cara membangun perangkat lunak secara sistematis, seperti insinyur membangun jembatan.

%%IMG:rpl-p1-pabrik-pl%%

## Apa Itu Perangkat Lunak?

**Perangkat lunak (PL)** bukan hanya kode program. PL terdiri dari tiga unsur:

- **Program** — instruksi/kode yang dijalankan komputer.
- **Dokumentasi** — dokumen kebutuhan, desain, dan panduan pengguna yang menjelaskan program.
- **Data konfigurasi** — berkas/pengaturan yang membuat program berjalan benar di lingkungannya.

PL punya sifat yang berbeda dari produk fisik:

| Sifat | Artinya |
|---|---|
| Tidak berwujud | Tidak bisa dilihat/dipegang; kemajuan sulit diukur dari luar |
| Tidak aus, tetapi memburuk | PL tidak rusak karena dipakai, tetapi kualitasnya turun bila terus diubah tanpa desain yang rapi |
| Fleksibel sekaligus rapuh | Mudah diubah, tetapi satu perubahan kecil bisa merusak bagian lain |
| Dibangun, bukan dipabrikasi | Setiap PL dirancang khusus; tidak ada jalur perakitan massal |

## Mengapa Perlu Rekayasa Perangkat Lunak?

Pada akhir 1960-an muncul istilah **krisis perangkat lunak**: proyek PL kerap terlambat, melebihi anggaran, penuh cacat, dan tidak sesuai kebutuhan pengguna. **Rekayasa Perangkat Lunak (RPL)** adalah penerapan pendekatan yang sistematis, disiplin, dan terukur pada pengembangan, pengoperasian, dan pemeliharaan PL — supaya hasilnya **benar, tepat waktu, sesuai anggaran, dan mudah dirawat**.

Bayangkan bedanya membangun gubuk dan gedung bertingkat. Gubuk bisa dibangun berbekal pengalaman saja. Gedung bertingkat butuh gambar arsitek, hitungan struktur, jadwal, dan inspeksi. Aplikasi kecil untuk diri sendiri mungkin cukup "langsung kode", tetapi aplikasi yang dipakai ribuan orang dan dirawat bertahun-tahun wajib direkayasa.

> 💡 **Kunci ingatan.** Menulis kode itu hanya *salah satu* aktivitas membangun PL — dalam proyek nyata porsinya sering hanya sekitar sepertiga dari seluruh usaha. Sisanya: memahami kebutuhan, merancang, menguji, dan merawat.

## SDLC: Siklus Hidup Pengembangan Perangkat Lunak

**SDLC** (*Software Development Life Cycle*) adalah kerangka fase yang dilalui PL sejak ide sampai pensiun. Enam fase yang umum dipakai:

| Fase | Pertanyaan kunci | Hasil utama |
|---|---|---|
| 1. Perencanaan | Layakkah dibangun? Berapa biaya & jadwalnya? | Proposal, estimasi, jadwal proyek |
| 2. Analisis kebutuhan | Sistem harus bisa *apa*? | Dokumen kebutuhan (SRS), daftar fitur |
| 3. Desain | *Bagaimana* sistem dibangun? | Arsitektur, diagram UML, desain basis data & antarmuka |
| 4. Implementasi | Bangun sesuai desain | Kode program yang berjalan |
| 5. Pengujian | Apakah sesuai kebutuhan & bebas cacat penting? | Laporan uji, daftar perbaikan |
| 6. Deployment & pemeliharaan | Bagaimana dirilis dan dirawat? | Sistem live, pembaruan & perbaikan berkala |

%%IMG:rpl-sdlc-fase%%

Perhatikan polanya: dua fase pertama menjawab "**apa**", fase desain menjawab "**bagaimana**", dan fase berikutnya membuktikan hasilnya. Kesalahan pada fase awal adalah yang paling mahal — salah memahami kebutuhan yang baru ketahuan setelah aplikasi jadi bisa berarti membangun ulang.

> ⚠️ **Jebakan pemula.** Langsung membuka editor dan menulis kode tanpa analisis terasa cepat di hari pertama, tetapi hampir selalu berujung bongkar-pasang di akhir. Dalam RPL: *berpikir dan menggambar dulu, baru mengetik*.

## Siapa Saja di Dalam Tim?

| Peran | Tanggung jawab utama |
|---|---|
| Manajer proyek | Jadwal, biaya, risiko, koordinasi tim |
| Analis sistem | Menggali & menuliskan kebutuhan pengguna |
| Desainer (arsitek/UI-UX) | Rancangan sistem dan pengalaman pengguna |
| Programmer | Menulis & mengintegrasikan kode |
| Penguji (QA/tester) | Merancang dan menjalankan pengujian |
| Pengguna/klien | Sumber kebutuhan & pemberi persetujuan akhir |

Di proyek kecil satu orang bisa merangkap banyak peran — tetapi *aktivitasnya* tetap harus dilakukan semua.

%%IMG:rpl-p1-siklus-hidup%%

## Studi Kasus Mini: Aplikasi Peminjaman Buku Perpustakaan

Perpustakaan kampus ingin mengganti buku catatan peminjaman dengan aplikasi. Pemetaannya ke SDLC:

| Fase | Contoh nyata di proyek ini |
|---|---|
| Perencanaan | Disepakati proyek 6 minggu, tim 4 mahasiswa, fitur inti saja |
| Analisis | Wawancara pustakawan: mahasiswa meminjam maks. 3 buku, denda Rp1.000/hari |
| Desain | Diagram use case & class (dibahas Pertemuan 4–5), rancangan tabel buku/anggota/transaksi |
| Implementasi | Membangun aplikasi web sesuai rancangan |
| Pengujian | Uji skenario pinjam, kembali, denda, dan stok habis |
| Deployment & pemeliharaan | Dipasang di komputer perpus; semester berikut ditambah fitur reservasi online |

Studi kasus perpustakaan ini akan terus dipakai sampai Pertemuan 6, jadi ingat baik-baik.

**Cek paham 1:** Fase apa yang menghasilkan dokumen SRS, dan fase apa yang menjawabnya dengan diagram UML?
*Jawab:* Analisis kebutuhan menghasilkan SRS ("apa"), fase desain menjawabnya dengan rancangan seperti diagram UML ("bagaimana").

**Cek paham 2:** Mengapa kesalahan memahami kebutuhan lebih mahal daripada kesalahan mengetik kode?
*Jawab:* Karena semua fase sesudahnya berdiri di atas kebutuhan itu; memperbaikinya berarti mengulang desain, kode, dan pengujian — bukan sekadar memperbaiki satu baris.

## Latihan Mini

1. Pilih satu aplikasi yang kamu pakai setiap hari. Tulis dugaanmu: siapa penggunanya, dan tiga kebutuhan utamanya.
2. Untuk aplikasi perpustakaan di atas, tuliskan satu contoh kegiatan untuk fase pengujian dan satu untuk pemeliharaan.

## Rangkuman

- PL = program + dokumentasi + data konfigurasi; sifatnya tidak berwujud dan memburuk bila diubah tanpa rekayasa.
- RPL menerapkan pendekatan sistematis agar PL benar, tepat waktu, sesuai anggaran, dan mudah dirawat.
- SDLC punya enam fase: perencanaan → analisis → desain → implementasi → pengujian → deployment & pemeliharaan.
- Menulis kode hanyalah satu fase; fase awal yang lemah membuat fase akhir mahal.

Pertemuan berikutnya: fase-fase SDLC ini bisa dirangkai dengan berbagai **model proses** — dari Waterfall yang kaku sampai Agile yang lincah.
