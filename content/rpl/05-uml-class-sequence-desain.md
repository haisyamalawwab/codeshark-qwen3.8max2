# Pertemuan 5 — Pemodelan UML (2): Class & Sequence Diagram + Dasar Desain

> **Tahap:** RPL (Pertemuan 5 dari 6) · **Fondasi:** use case menunjukkan tujuan; class diagram menunjukkan bangunannya, sequence diagram menunjukkan percakapannya.

**Tujuan pertemuan ini:** kamu mampu (1) menggambar class diagram dengan atribut, operasi, visibilitas, dan multiplisitas, (2) membedakan asosiasi, agregasi, komposisi, dan generalisasi, (3) membaca sequence diagram, dan (4) menjelaskan kohesi–kopling pada desain yang baik.

## Class Diagram: Peta Bangunan Sistem

**Kelas** adalah cetak biru objek: kumpulan data (**atribut**) dan perilaku (**operasi/metode**) yang sejenis. Class diagram menggambarkannya sebagai persegi tiga kompartemen: nama kelas, atribut, operasi.

%%IMG:rpl-p5-blok-kelas%%

Visibilitas ditulis dengan simbol:

| Simbol | Nama | Siapa yang boleh mengakses |
|---|---|---|
| `+` | public | Semua kelas |
| `-` | private | Kelas itu sendiri |
| `#` | protected | Kelas itu dan turunannya |

Contoh isi satu kelas:

```text
Buku
────────────────────────
- judul : string
- stok  : int
────────────────────────
+ pinjam() : boolean
+ kembalikan() : void
```

Atribut umumnya dibuat private dan hanya diubah lewat operasi — prinsip **enkapsulasi**: data dilindungi, akses lewat pintu resmi.

## Relasi antar Kelas

| Relasi | Garis/simbol | Makna | Contoh |
|---|---|---|---|
| Asosiasi | Garis lurus + multiplisitas | Terhubung/berelasi | Mahasiswa `1` meminjam `0..*` Buku |
| Agregasi | Belah ketupat **kosong** | "Bagian dari", bagian bisa hidup sendiri | Katalog berisi Buku |
| Komposisi | Belah ketupat **penuh** | "Bagian dari", bagian mati bersama pemiliknya | Kuis tersusun atas Soal |
| Generalisasi | Panah segitiga kosong | Pewarisan "adalah-jenis-dari" | Dosen & Mahasiswa adalah Pengguna |
| Dependensi | Panah putus-putus | Memakai sesaat | Laporan memakai Transaksi saat dicetak |

**Multiplisitas** adalah angka di ujung garis asosiasi: `1` (tepat satu), `0..1` (nol atau satu), `*` / `0..*` (banyak), `1..*` (minimal satu). Ia menjawab pertanyaan penting: "satu mahasiswa boleh punya berapa hasil kuis?"

%%IMG:rpl-class-diagram-kuis%%

Baca diagram di atas dengan suara keras — cara termudah memeriksa kebenarannya: "*Satu mahasiswa memiliki banyak hasil kuis; satu kuis tersusun atas banyak soal; bila kuis dihapus, soalnya ikut hilang (komposisi).*" Bila kalimatnya terdengar janggal, diagramnya yang perlu diperbaiki.

> ⚠️ **Uji komposisi vs agregasi.** Tanyakan: "bila pemiliknya dihapus, apakah bagiannya masih masuk akal ada?" Soal tanpa kuisnya tidak berguna → komposisi. Buku tetap ada walau katalog ditutup → agregasi.

## Sequence Diagram: Percakapan antar Objek

Class diagram itu statis. Untuk melihat objek **bekerja sama dari waktu ke waktu**, gunakan sequence diagram: objek berjajar di atas dengan garis hidup (*lifeline*) menurun, dan **pesan** digambar sebagai panah antar lifeline — dibaca dari atas ke bawah mengikuti urutan waktu.

%%IMG:rpl-p5-sinyal-urutan%%

Contoh urutan proses *login* (dibaca sebagai percakapan):

| Urutan | Dari → Ke | Pesan |
|---|---|---|
| 1 | Pengguna → HalamanLogin | masukkan email & kata sandi |
| 2 | HalamanLogin → AuthService | verifikasi(email, sandi) |
| 3 | AuthService → Database | cari pengguna berdasarkan email |
| 4 | Database → AuthService | data pengguna (balasan, garis putus-putus) |
| 5 | AuthService → HalamanLogin | sesi diterbitkan / pesan gagal |
| 6 | HalamanLogin → Pengguna | tampilkan beranda atau pesan kesalahan |

Panah penuh = panggilan (sinkron, menunggu balasan); panah putus-putus = balasan; kotak tipis pada lifeline = objek sedang aktif bekerja. Fragment berlabel `alt` menggambar percabangan (berhasil/gagal) dan `loop` untuk pengulangan.

## Dasar Desain yang Baik

Diagram hanyalah alat; tujuannya desain yang **mudah diubah**. Dua pengukur klasik:

- **Kohesi (cohesion)** — seberapa fokus tanggung jawab satu modul/kelas. Kelas `TransaksiPeminjaman` yang hanya mengurus transaksi berkohesi tinggi. Kelas "serbabisa" yang mengurus login, stok, laporan, dan pembayaran sekaligus berkohesi rendah. **Target: tinggi.**
- **Kopling (coupling)** — seberapa kuat ketergantungan antar modul. Bila mengganti cara simpan data memaksa perubahan di sepuluh kelas lain, koplingnya tinggi dan rapuh. **Target: rendah.**

Pola arsitektur sederhana yang membantu keduanya adalah **arsitektur berlapis**:

| Lapisan | Isi | Contoh perpustakaan |
|---|---|---|
| Presentasi | Antarmuka pengguna | Halaman katalog & form pinjam |
| Logika bisnis | Aturan & proses | Aturan maks. 3 pinjaman, hitung denda |
| Data | Penyimpanan | Tabel buku, anggota, transaksi |

Aturan di lapisan bisnis tidak bergantung pada tampilan — mengganti warna tombol tidak akan pernah merusak perhitungan denda.

**Cek paham 1:** "Satu dosen membimbing banyak mahasiswa; satu mahasiswa dibimbing tepat satu dosen." Bagaimana multiplisitasnya?
*Jawab:* Di sisi Dosen `1`, di sisi Mahasiswa `*` — dibaca: satu dosen berelasi dengan banyak mahasiswa, dan setiap mahasiswa berelasi dengan tepat satu dosen.

**Cek paham 2:** Kelas `SemuaHal` berisi login, cetak laporan, hitung denda, dan kirim surel. Masalah desain apa yang tampak?
*Jawab:* Kohesi rendah — tanggung jawabnya bercampur; pecah menjadi kelas-kelas fokus (AuthService, Laporan, Denda, Notifikasi) agar perubahan satu urusan tidak mengganggu yang lain.

## Latihan Mini

1. Gambar class diagram mini (4 kelas) untuk kantin daring dari Latihan Pertemuan 4, lengkap dengan multiplisitas dan satu komposisi.
2. Tulis urutan pesan (format tabel seperti contoh login) untuk proses "mengembalikan buku" yang melibatkan Mahasiswa, HalamanPengembalian, LayananSirkulasi, dan Database.

## Rangkuman

- Class diagram: tiga kompartemen, visibilitas `+ - #`, enkapsulasi, dan relasi asosiasi–agregasi–komposisi–generalisasi–dependensi dengan multiplisitas.
- Baca relasi dengan bersuara untuk memvalidasinya; komposisi berarti bagian mati bersama pemiliknya.
- Sequence diagram menunjukkan percakapan objek menurut waktu: lifeline, pesan, balasan, fragment `alt`/`loop`.
- Desain baik = kohesi tinggi + kopling rendah; arsitektur berlapis membantu mencapainya.

Pertemuan terakhir: membuktikan sistem bekerja benar lewat **pengujian**, merawatnya lewat **pemeliharaan**, dan merangkum semuanya dalam mini project.
