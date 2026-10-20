# Pertemuan 8 — UJIAN TENGAH SEMESTER (UTS): Evaluasi Proyek Praktik CRUD Dasar

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Evaluasi Tengah Semester (Pertemuan 8 dari 16)  
> **Bobot:** 25% (Asesmen Sumatif 1)  
> **Format:** Ujian Praktikum Terjadwal + Demonstrasi Program Mandiri  
> **CPMK1 & CPMK2:** Menguji pemahaman arsitektur web, desain database MySQL, koneksi PHP, serta implementasi operasi Read & Create (C3)

---

## 1. Capaian Pembelajaran yang Diuji
Pada Ujian Tengah Semester ini, mahasiswa diuji kemampuannya dalam:
1. **Perancangan Database Relasional (Bobot 25%):** Membuat database, tabel relasi, tipe data yang tepat, dan primary/foreign key.
2. **Koneksi & Error Handling PHP (Bobot 20%):** Membangun skrip koneksi terpusat dengan penanganan eksepsi yang aman.
3. **Operasi Read Data Dinamis (Bobot 25%):** Menampilkan daftar data dari tabel MySQL ke dalam tabel HTML yang rapi beserta status stok.
4. **Operasi Create dengan Validasi (Bobot 30%):** Menangani form input metode POST, validasi field kosong di sisi server, dan menyimpan data baru tanpa bug resubmission.

---

## 2. Soal Kasus Ujian Praktik Mandiri
Setiap mahasiswa diminta mengembangkan modul **SIMPUS-Mini** dengan skenario:
1. Sebuah perpustakaan membutuhkan sistem pencatatan buku yang terhubung ke database `simpus_mini`.
2. Pengguna harus dapat:
   - Melihat daftar seluruh koleksi buku secara terurut (buku terbaru di atas).
   - Menambahkan buku baru lengkap dengan pilihan kategori dari database.
   - Melihat pesan umpan balik (notifikasi hijau) ketika buku berhasil disimpan.
   - Melihat peringatan merah jika judul buku atau pengarang dikosongkan.

---

## 3. Rubrik Penilaian Standar OBE (Outcome-Based Education)
| No | Kriteria Penilaian | Indikator Skor Maksimal (100) | Bobot |
|---|---|---|---|
| 1 | **Struktur Basis Data** | Tabel `kategori` dan `buku` terbentuk rapi di MySQL dengan foreign key aktif | 25% |
| 2 | **Koneksi & Modularitas** | File `koneksi.php`, `header.php`, dan `footer.php` dipisahkan secara modular | 20% |
| 3 | **Implementasi READ** | Query SELECT berhasil mengeksekusi LEFT JOIN untuk menampilkan nama kategori | 25% |
| 4 | **Implementasi CREATE** | Form POST bekerja sempurna dan data tersimpan ke MySQL via Prepared Statement | 30% |

---

## 4. Instruksi Pengumpulan Berkas UTS
1. Ekspor database MySQL proyek Anda ke berkas `simpus_mini_uts.sql`.
2. Kompres folder proyek `simpus-mini` Anda menjadi format `.zip`.
3. Demonstrasikan jalannya aplikasi secara langsung di depan dosen / asisten praktikum.
