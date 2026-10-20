# Pertemuan 16 — UJIAN AKHIR SEMESTER (UAS): Deployment PHP & MySQL ke cPanel Live Hosting & Showcase

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Ujian Akhir Semester (Pertemuan 16 dari 16)  
> **Bobot:** 35% (Asesmen Sumatif 2)  
> **Format:** Presentasi Proyek + Demo Aplikasi LIVE di Web Hosting Publik + Tanya Jawab Lisan  
> **CPMK4 & CPMK5:** Mahasiswa mampu melakukan deployment penuh aplikasi PHP & database MySQL ke server hosting publik dan mendemonstrasikannya (C4)

---

## 1. Tahapan Deployment PHP Native ke cPanel

### Langkah 1: Ekspor Database MySQL Lokal
1. Buka phpMyAdmin lokal (`http://localhost/phpmyadmin/`).
2. Pilih database `simpus_mini`.
3. Klik tab **Export** -> Format **SQL** -> Klik **Go** / **Export**.
4. Simpan file sebagai `simpus_mini_final.sql`.

### Langkah 2: Buat Database di cPanel Hosting
1. Login ke akun cPanel hosting Anda (`https://namadomain.com:2083`).
2. Buka menu **MySQL Database Wizard**.
3. Buat nama database baru (misal: `u1234_simpus`).
4. Buat user database baru (misal: `u1234_admin`) dan tentukan password kuat.
5. Berikan hak akses penuh: centang **ALL PRIVILEGES** -> Klik **Next Step**.

### Langkah 3: Impor Database di phpMyAdmin cPanel
1. Di cPanel, buka menu **phpMyAdmin**.
2. Klik nama database baru `u1234_simpus`.
3. Klik tab **Import** -> Pilih file `simpus_mini_final.sql` -> Klik **Go**.
4. Pastikan tabel `kategori`, `buku`, dan `users` berhasil masuk.

### Langkah 4: Kompres & Unggah File PHP
1. Di komputer lokal, pilih semua file di dalam folder `simpus-mini/`.
2. Kompres ke format `.zip` (misal: `simpus-deploy.zip`).
3. Di cPanel, buka **File Manager** -> Masuk ke folder **`public_html/`**.
4. Klik **Upload** -> Pilih file `.zip`.
5. Setelah selesai, klik kanan file `.zip` di File Manager -> Klik **Extract**.

### Langkah 5: Sesuaikan Konfigurasi `config/koneksi.php` di Server
Buka file `config/koneksi.php` di File Manager cPanel, edit kredensial sesuai database hosting:
```php
<?php
// config/koneksi.php (Versi Server Hosting)
$host = "localhost";
$user = "u1234_admin";          // User DB cPanel dengan prefix
$pass = "PasswordKuatHosting!"; // Password DB cPanel
$db   = "u1234_simpus";         // Nama DB cPanel dengan prefix
$port = 3306;

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = mysqli_connect($host, $user, $pass, $db, $port);
    mysqli_set_charset($conn, "utf8mb4");
} catch (mysqli_sql_exception $e) {
    error_log("Hosting DB Error: " . $e->getMessage());
    die("Sistem perpustakaan sedang dalam pemeliharaan berkala.");
}
?>
```

### Langkah 6: Uji Coba Domain / Subdomain Publik
Buka browser di HP atau laptop lain, ketik URL domain Anda:  
`https://simpus.namadomainmahasiswa.my.id/`  
Pastikan website terbuka tanpa peringatan error!

---

## 2. Komponen Penilaian UAS (Bobot 35%)
| No | Komponen Evaluasi | Bobot | Deskripsi |
|---|---|---|---|
| 1 | **Status Live Hosting** | 25% | Aplikasi dapat diakses via domain/subdomain internet publik dengan HTTPS aman |
| 2 | **Kelengkapan Fitur CRUD** | 35% | Fitur Create, Read, Update, Delete berjalan mulus di server hosting |
| 3 | **Relasi Database & Keamanan** | 20% | Relasi 1:N tabel Kategori-Buku, Prepared Statements, Session Login Admin |
| 4 | **Demonstrasi & Tanya Jawab** | 20% | Mahasiswa mampu menjelaskan alur skrip PHP dan kueri SQL saat diuji dosen |

---

## 3. Selamat & Capaian Akhir Semester!
Selamat! Anda telah menuntaskan kurikulum 16 pertemuan **Sistem Aplikasi Web - Backend Dasar (PHP & MySQL)**. Anda kini menguasai fondasi utama backend web developer: arsitektur client-server, bahasa PHP, manipulasi basis data relasional MySQL, keamanan aplikasi, dan deployment ke cloud hosting.
