# Pertemuan 5 — Koneksi Database PHP ke MySQL (mysqli & PDO) & Error Handling

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 5 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu membuat skrip koneksi PHP ke database MySQL dengan teknik error handling (C3)

---

## 1. Problem Statement (PBL)
> *"Bagaimana cara skrip PHP yang berada di Apache berbicara dengan server MySQL di port 3306? Apa yang terjadi jika nama database salah ketik atau server MySQL mati? Bagaimana sistem menampilkan pesan ramah tanpa membocorkan password database ke pengguna?"*

---

## 2. Pustaka Penghubung PHP ke MySQL: mysqli vs PDO
PHP menyediakan dua pustaka resmi modern untuk berkomunikasi dengan database:
1. **`mysqli` (MySQL Improved):**
   - Khusus untuk database MySQL / MariaDB.
   - Mendukung gaya prosedural (`mysqli_connect`) dan OOP (`new mysqli()`).
   - Sangat ringan, mudah dipelajari oleh pemula di semester awal.
2. **`PDO` (PHP Data Objects):**
   - Mendukung 12 sistem database berbeda (MySQL, PostgreSQL, SQLite, Oracle, SQL Server).
   - Selalu berbasis Object-Oriented Programming (OOP).
   - Fitur keamanan Prepared Statements sangat kuat dan seragam di semua RDBMS.

---

## 3. Menulis Berkas Koneksi: `config/koneksi.php`

### Opsi A: Menggunakan `mysqli` (Standar Praktikum Pemula)
```php
<?php
// config/koneksi.php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "simpus_mini";
$port = 3306;

// Mengaktifkan mode pelaporan error mysqli (PHP 8.1+)
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = mysqli_connect($host, $user, $pass, $db, $port);
    // Mengatur charset komunikasi agar mendukung utf8mb4
    mysqli_set_charset($conn, "utf8mb4");
} catch (mysqli_sql_exception $e) {
    // Log error asli ke server (internal), jangan tampilkan password ke publik!
    error_log("Database connection failed: " . $e->getMessage());
    die("<div style='color:red; font-family:sans-serif;'>
            <h3>Koneksi Basis Data Gagal</h3>
            <p>Terjadi kesalahan saat menghubungkan ke database MySQL. Pastikan service MySQL di XAMPP sudah menyala.</p>
         </div>");
}
?>
```

### Opsi B: Menggunakan `PDO` (Alternatif Standar Industri)
```php
<?php
// config/koneksi_pdo.php
$dsn = "mysql:host=localhost;dbname=simpus_mini;charset=utf8mb4";
$username = "root";
$password = "";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Koneksi gagal: " . $e->getMessage());
}
?>
```

---

## 4. Menguji Koneksi dari File Lain
Buat file `cek_koneksi.php`:
```php
<?php
require_once "config/koneksi.php";

echo "<h2 style='color: green;'>Selamat! PHP berhasil terhubung ke database MySQL simpus_mini.</h2>";
?>
```

---

## 5. Tugas Praktikum (RTM-5)
1. Buat folder `config/` dan simpan file `koneksi.php` di dalamnya.
2. Buat skrip pengujian koneksi. Jalankan di browser dan pastikan pesan sukses muncul.
3. Sengaja ubah nama database di `koneksi.php` menjadi `simpus_salah`. Amati blok `try-catch` menangani kesalahan dengan elegan tanpa crashing server.
