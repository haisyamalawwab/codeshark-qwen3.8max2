# Pertemuan 6 — Pengujian, Pemeliharaan & Mini Project Gladi UTS

> **Tahap:** RPL (Pertemuan 6 dari 6) · **Fondasi:** perangkat lunak belum selesai saat "bisa jalan di laptopku" — ia selesai saat terbukti benar dan siap dirawat.

**Tujuan pertemuan ini:** kamu mampu (1) membedakan level pengujian unit–integrasi–sistem–penerimaan, (2) merancang kasus uji dengan partisi ekivalen dan nilai batas, (3) menjelaskan empat jenis pemeliharaan, dan (4) menyusun paket rancangan mini project dari kebutuhan sampai kasus uji.

Ada tiga istilah yang wajib dibedakan. **Error** adalah kekeliruan manusia (salah paham, salah ketik logika). Error menghasilkan **defect/fault (cacat)** di dalam kode/dokumen. Saat cacat tereksekusi, terjadilah **failure (kegagalan)** yang dilihat pengguna. Pengujian adalah aktivitas *mencari kegagalan sedini mungkin* — bukan membuktikan tidak ada cacat, karena pengujian hanya bisa menunjukkan adanya cacat, bukan ketiadaannya.

## Empat Level Pengujian

%%IMG:rpl-level-pengujian%%

| Level | Yang diuji | Pelaku | Contoh pada perpustakaan |
|---|---|---|---|
| Unit | Fungsi/kelas terkecil secara terpisah | Programmer | Fungsi `hitungDenda(3 hari)` mengembalikan 3000 |
| Integrasi | Gabungan modul yang saling berhubungan | Programmer/QA | Layanan sirkulasi benar mengurangi stok di basis data |
| Sistem | Sistem utuh terhadap SRS | QA | Seluruh alur pinjam–kembali–denda sesuai kebutuhan |
| Penerimaan (UAT) | Kesesuaian dengan kebutuhan nyata pengguna | Pengguna/klien | Pustakawan mencoba & menyetujui sistem layak dipakai |

Semakin ke atas, cakupannya semakin luas tetapi jumlah pengujiannya lebih sedikit dan biayanya lebih besar per kasus. Cacat yang lolos ke level atas — apalagi ke tangan pengguna — jauh lebih mahal diperbaiki.

## Merancang Kasus Uji: Black-Box

**Black-box testing** merancang uji dari spesifikasi tanpa melihat kode. Dua teknik andalannya:

**Partisi ekivalen (equivalence partitioning):** bagi masukan ke kelompok yang diperlakukan sama, uji satu wakil per kelompok. Untuk aturan "umur anggota 17–60 tahun":

| Partisi | Wakil uji | Harapan |
|---|---|---|
| Terlalu muda (< 17) | 10 | Ditolak |
| Valid (17–60) | 25 | Diterima |
| Terlalu tua (> 60) | 75 | Ditolak |
| Bukan angka | "abc" | Ditolak dengan pesan |

**Analisis nilai batas (boundary value):** cacat gemar bersembunyi di tepi. Uji persis di batas dan sekitarnya: 16, **17**, 18 dan 59, **60**, 61.

%%IMG:rpl-p6-inspeksi-bug%%

Kebalikannya, **white-box testing** merancang uji dari struktur kode (mis. memastikan setiap cabang `if` pernah dilewati). Setelah perbaikan apa pun, jalankan **uji regresi**: mengulang uji lama untuk memastikan perbaikan tidak merusak bagian lain.

Kasus uji ditulis sistematis agar bisa diulang siapa pun:

| ID | Skenario | Langkah & data | Hasil yang diharapkan |
|---|---|---|---|
| TC-01 | Pinjam buku tersedia | Login, cari buku stok 2, klik Pinjam | Transaksi tercatat, stok menjadi 1, tampil tenggat |
| TC-02 | Pinjam saat stok habis | Cari buku stok 0, klik Pinjam | Ditolak; ditawari reservasi |
| TC-03 | Kembali terlambat 3 hari | Kembalikan buku lewat tenggat 3 hari | Denda Rp3.000 tercatat |

Perhatikan: TC-01..03 lahir langsung dari skenario use case Pertemuan 4 — inilah gunanya **keterlacakan** dari kebutuhan sampai uji.

## Pemeliharaan: Hidup Sesudah Rilis

Sistem yang dirilis justru memasuki fase terpanjangnya. **Pemeliharaan** terbagi empat jenis:

| Jenis | Maksud | Contoh |
|---|---|---|
| Korektif | Memperbaiki cacat yang ditemukan | Perbaiki denda yang salah hitung saat hari libur |
| Adaptif | Menyesuaikan dengan lingkungan baru | Berpindah server / versi basis data baru |
| Perfektif | Menambah/menyempurnakan fitur | Tambah reservasi online & notifikasi |
| Preventif | Mencegah masalah masa depan | Merapikan kode (refactor), memperbarui dokumentasi |

%%IMG:rpl-p6-pemeliharaan%%

Kunci pemeliharaan yang sehat adalah hal-hal yang sudah kamu pelajari: kebutuhan yang terlacak, desain berkohesi tinggi–berkopling rendah, dokumentasi yang hidup, dan manajemen versi agar setiap perubahan tahu riwayatnya.

> 💡 **Perspektif biaya.** Pada banyak sistem berumur panjang, biaya pemeliharaan jauh melampaui biaya pembangunan awalnya. Merancang agar mudah dirawat bukanlah kemewahan — itulah sebagian besar pekerjaannya.

## Mini Project & Gladi UTS

Sebagai penutup tahap, kerjakan berkelompok (3–4 orang) sebuah **paket rancangan** untuk aplikasi sederhana pilihanmu (kantin daring, peminjaman alat lab, antrean klinik kampus, dsb.):

| No | Luaran | Dari pertemuan |
|---|---|---|
| 1 | Latar masalah + daftar pemangku kepentingan | 1 & 3 |
| 2 | Pilihan model proses + alasannya; backlog MoSCoW | 2 & 3 |
| 3 | 5 user story + kriteria penerimaan, 3 kebutuhan non-fungsional terukur | 3 |
| 4 | Use case diagram + 2 skenario use case | 4 |
| 5 | Activity diagram 1 proses utama (dengan swimlane) | 4 |
| 6 | Class diagram (≥5 kelas, ada komposisi) + 1 urutan pesan sequence | 5 |
| 7 | 10 kasus uji black-box (ada partisi & nilai batas) yang terlacak ke kebutuhan | 6 |

**Checklist gladi sebelum mengumpulkan:**

- Setiap user story bisa dilacak ke use case, kelas, dan kasus ujinya.
- Semua diagram dibaca bersuara dan terdengar masuk akal.
- Tidak ada kebutuhan kabur ("cepat", "mudah") tanpa ukuran.
- Nama aktor adalah peran; use case adalah tujuan bernilai, bukan klik tombol.
- Multiplisitas, include/extend, dan komposisi/agregasi sudah diuji dengan pertanyaan pembeda di Pertemuan 4–5.

**Cek paham 1:** Untuk aturan "pinjaman maks. 3 buku", sebutkan nilai batas yang wajib diuji.
*Jawab:* 2 (boleh menambah), 3 (tepat batas, pinjaman ke-3 diterima), dan 4 (pinjaman ke-4 ditolak) — tepi 3 adalah titik paling rawan cacat.

**Cek paham 2:** Menambahkan fitur pembayaran QRIS setahun setelah rilis termasuk pemeliharaan jenis apa?
*Jawab:* Perfektif — penyempurnaan/penambahan kemampuan atas permintaan pengguna, bukan perbaikan cacat.

## Rangkuman Akhir Tahap RPL

- RPL membangun PL secara sistematis melalui fase SDLC (P1), dirangkai dengan model proses yang sesuai situasi — Waterfall sampai Agile/Scrum (P2).
- Kebutuhan digali dan ditulis terukur, dalam SRS maupun user story (P3), lalu dimodelkan dengan use case & activity (P4) serta class & sequence (P5) di atas prinsip kohesi tinggi–kopling rendah.
- Pengujian berlapis (unit→penerimaan) dengan teknik black-box partisi & nilai batas membuktikan kebenaran; pemeliharaan korektif–adaptif–perfektif–preventif menjaga sistem tetap hidup (P6).

Satu kalimat untuk dibawa pulang: **perangkat lunak yang baik lahir dari kebutuhan yang jelas, desain yang digambar, dan bukti pengujian — kode hanyalah perwujudannya.**
