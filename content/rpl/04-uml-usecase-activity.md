# Pertemuan 4 — Pemodelan UML (1): Use Case & Activity Diagram

> **Tahap:** RPL (Pertemuan 4 dari 6) · **Fondasi:** gambar yang baik menjelaskan sistem lebih cepat daripada sepuluh halaman teks.

**Tujuan pertemuan ini:** kamu mampu (1) menggambar use case diagram dengan aktor, batas sistem, dan relasi include/extend, (2) menulis skenario use case, dan (3) menggambar activity diagram dengan keputusan dan swimlane.

**UML** (*Unified Modeling Language*) adalah bahasa gambar baku untuk memodelkan perangkat lunak. UML bukan bahasa pemrograman dan bukan metode — ia sekadar notasi. Diagramnya terbagi dua keluarga besar: **struktur** (apa saja komponen sistem, mis. class diagram) dan **perilaku** (apa yang terjadi, mis. use case, activity, sequence). Pertemuan ini membahas dua diagram perilaku yang menjembatani kebutuhan (Pertemuan 3) menuju desain.

## Use Case Diagram: Siapa Melakukan Apa

Use case diagram menjawab: **siapa** pengguna sistem dan **apa saja** yang bisa mereka lakukan — tanpa membahas cara teknis di dalamnya.

%%IMG:rpl-p4-aktor-sistem%%

| Elemen | Simbol | Makna |
|---|---|---|
| Aktor | Orang-orangan (stick figure) di **luar** sistem | Peran yang berinteraksi dengan sistem (manusia, sistem lain, perangkat) |
| Use case | Elips berisi frasa kata kerja | Satu tujuan/fungsi bernilai bagi aktor |
| Batas sistem | Persegi mengelilingi elips | Yang di dalam = tanggung jawab sistem kita |
| Asosiasi | Garis lurus | Aktor terlibat pada use case |
| Include | Panah putus-putus `<<include>>` | Perilaku yang **selalu** ikut dijalankan |
| Extend | Panah putus-putus `<<extend>>` | Perilaku **kadang-kadang** (kondisional) |
| Generalisasi | Panah segitiga kosong | Aktor/use case khusus mewarisi yang umum |

Contoh untuk aplikasi perpustakaan kita:

%%IMG:rpl-usecase-perpus%%

Perhatikan keputusannya: "Pinjam Buku" **include** "Catat Transaksi" karena pencatatan *selalu* terjadi; sedangkan "Hitung Denda" **extend** "Kembalikan Buku" karena denda *hanya* terjadi bila terlambat. Aktor digambar sebagai *peran* (Mahasiswa, Pustakawan), bukan nama orang dan bukan jabatan organisasi yang tidak menyentuh sistem.

> ⚠️ **Kesalahan paling umum.** Menulis use case berupa langkah teknis seperti "Klik Tombol Simpan" atau "Buka Form". Use case harus berupa **tujuan bernilai** bagi aktor: "Meminjam Buku", bukan gerak-gerik tombolnya.

## Skenario Use Case: Cerita di Balik Elips

Diagram saja tidak cukup; setiap use case penting dijelaskan lewat **skenario** tertulis:

| Bagian | Contoh: Meminjam Buku |
|---|---|
| Aktor utama | Mahasiswa |
| Prasyarat | Mahasiswa sudah login; status anggota aktif |
| Alur utama | 1. Mahasiswa mencari buku 2. Sistem menampilkan stok 3. Mahasiswa memilih "Pinjam" 4. Sistem memeriksa batas pinjaman 5. Sistem mencatat transaksi & menampilkan tanggal kembali |
| Alur alternatif | 2a. Stok habis → sistem menawarkan reservasi · 4a. Pinjaman sudah 3 → sistem menolak dengan pesan |
| Pasca-kondisi | Stok berkurang 1; transaksi tercatat; tenggat pengembalian tersimpan |

**Alur utama** adalah jalan mulus; **alur alternatif** menangani pengecualian. Skenario inilah yang kelak menjadi bahan kasus uji di Pertemuan 6.

## Activity Diagram: Alur Proses Langkah demi Langkah

Bila use case memetakan "siapa–apa", activity diagram menggambarkan "bagaimana alurnya" — mirip flowchart yang lebih kaya karena mendukung proses paralel dan pembagian tanggung jawab.

%%IMG:rpl-p4-alur-aktivitas%%

| Simbol | Nama | Fungsi |
|---|---|---|
| Lingkaran hitam | Awal (initial) | Titik mulai proses |
| Persegi sudut tumpul | Aktivitas | Satu langkah pekerjaan |
| Belah ketupat | Keputusan (decision) | Percabangan bersyarat [ya]/[tidak] |
| Batang tebal | Fork/join | Memecah alur menjadi paralel / menggabungkannya |
| Lingkaran hitam berbatas | Akhir (final) | Titik selesai |
| Kolom/jalur | Swimlane | Mengelompokkan aktivitas menurut penanggung jawab |

Contoh alur peminjaman dengan dua swimlane: pada jalur **Mahasiswa** — *Cari buku → Pilih buku → Ajukan pinjaman*; berpindah ke jalur **Sistem** — *Cek stok & batas pinjaman → (keputusan: boleh?) → Catat transaksi → Terbitkan bukti & tenggat*; bila tidak boleh, alur bercabang ke *Tampilkan alasan penolakan* lalu selesai. Dengan swimlane, langsung terlihat siapa mengerjakan apa dan di titik mana tanggung jawab berpindah.

**Cek paham 1:** Pada use case "Kembalikan Buku", menghitung denda memakai relasi apa — include atau extend? Mengapa?
*Jawab:* Extend, karena denda hanya dihitung **bila** pengembalian terlambat (kondisional). Include dipakai untuk perilaku yang selalu ikut, seperti mencatat transaksi.

**Cek paham 2:** Apa beda keputusan (decision) dan fork pada activity diagram?
*Jawab:* Keputusan memilih **salah satu** cabang berdasarkan syarat; fork menjalankan **semua** cabang secara paralel, lalu digabungkan kembali oleh join.

## Latihan Mini

1. Gambarlah use case diagram untuk kantin kampus daring: minimal 2 aktor, 5 use case, satu include dan satu extend.
2. Buat activity diagram "memesan makanan di kantin daring" dengan 3 swimlane (Pembeli, Sistem, Penjual) dan minimal satu keputusan.

## Rangkuman

- Use case diagram memetakan aktor ↔ tujuan bernilai di dalam batas sistem; relasi kuncinya asosiasi, include (selalu), extend (kondisional), generalisasi.
- Skenario use case merinci alur utama & alternatif — bahan baku desain dan pengujian.
- Activity diagram memodelkan alur proses dengan aktivitas, keputusan, paralel (fork/join), dan swimlane penanggung jawab.

Pertemuan berikutnya: sisi struktur dan interaksi objek — **Class Diagram & Sequence Diagram**, plus prinsip desain yang baik.
