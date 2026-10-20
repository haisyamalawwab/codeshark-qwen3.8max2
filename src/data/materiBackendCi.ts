/* ==========================================================================
   DOKUMEN MATERI MARKDOWN SISTEM APLIKASI WEB - BACKEND DASAR (PHP & MYSQL)
   16 Pertemuan Lengkap Berbasis OBE & Standar DIKTI (PHP Native & cPanel)
   ========================================================================== */

export interface BackendMdDoc {
  no: number;
  fileName: string;
  title: string;
  source: string;
}

export const CI_BACKEND_MD_DOCS: Record<number, BackendMdDoc> = {
  1: {
    no: 1,
    fileName: "01-pengantar-arsitektur-web.md",
    title: "Pengantar Arsitektur Web & HTTP Request-Response (PHP & Apache)",
    source: `# Pertemuan 1 — Pengantar Arsitektur Web & HTTP Request-Response (PHP & Apache)

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 1 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK1:** Mahasiswa mampu menjelaskan konsep dasar arsitektur web client-server dan alur kerja backend (C2)

---

## 1. Problem Statement (PBL)
> *"Saat kamu membuka website perpustakaan atau marketplace online di laptop dan mengklik tombol 'Cari Buku', apa yang sebenarnya terjadi di balik layar? Bagaimana data teks dan gambar bisa sampai ke browsermu, dan siapa yang memproses permintaan tersebut?"*

---

## 2. Arsitektur Client-Server & Siklus Request-Response
Aplikasi web berbasis PHP beroperasi menggunakan model **Client-Server**:
1. **Client (Browser):** Berjalan di perangkat pengguna (Google Chrome, Firefox, Safari). Berfungsi merender HTML/CSS/JavaScript dan menangkap input form.
2. **Web Server (Apache):** Perangkat lunak server yang mendengarkan permintaan jaringan (HTTP Port 80/8080).
3. **PHP Preprocessor (Interpreter):** Mesin penerjemah kode PHP yang mengeksekusi logika server-side, memproses input form, dan berinteraksi dengan database.
4. **Database Server (MySQL / MariaDB):** Tempat penyimpanan data relasional terstruktur (Port 3306).

### Diagram Alur Request-Response PHP
\`\`\`
[Browser Client]
       │
       │  1. HTTP Request (GET /katalog.php?search=php)
       ▼
[Web Server Apache (Port 80)]
       │
       │  2. Meneruskan ke PHP Preprocessor Engine
       ▼
[PHP Script: katalog.php]
       │
       │  3. Query data: SELECT * FROM buku WHERE judul LIKE '%php%'
       ▼
[MySQL Database (Port 3306)]
       │
       │  4. Mengembalikan recordset baris data buku
       ▼
[PHP Script memproses data & merender HTML dinamis]
       │
       │  5. HTTP Response (Status 200 OK + Payload HTML murni)
       ▼
[Browser merender tampilan web ke pengguna]
\`\`\`

---

## 3. Perbedaan Frontend vs Backend
| Aspek | Frontend (Client-Side) | Backend (Server-Side) |
|---|---|---|
| **Tempat Eksekusi** | Browser pengguna (komputer/HP) | Komputer server (aman) |
| **Teknologi Utama** | HTML5, CSS3, JavaScript | PHP 8, MySQL, Apache |
| **Akses Kode** | Terbuka (bisa di-inspect via F12) | Tertutup (pengguna hanya menerima output HTML) |
| **Keamanan** | Tidak boleh menyimpan password/kunci database | Mengamankan data, validasi, otorisasi pengguna |
| **Penyimpanan Data** | Sementara (LocalStorage/Cookie) | Permanen di Database MySQL |

---

## 4. HTTP Methods Dasar: GET vs POST
1. **HTTP GET:** Membaca data dari server, parameter terlihat di URL (query string). Cocok untuk pencarian, paging, dan navigasi.
2. **HTTP POST:** Mengirimkan data baru ke server di dalam Request Body. Wajib digunakan untuk login, pendaftaran, dan penginputan data sensitif.`,
  },
  2: {
    no: 2,
    fileName: "02-setup-environment-php-xampp.md",
    title: "Setup Lingkungan PHP 8 & Web Server XAMPP / Apache Lokal",
    source: `# Pertemuan 2 — Setup Environment PHP 8 & Web Server XAMPP / Apache Lokal

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 2 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK1:** Mahasiswa mampu menyiapkan lingkungan kerja PHP 8, Apache, dan MySQL (C3)

---

## 1. Problem Statement (PBL)
> *"Ketika kamu mengetikkan index.html, browser bisa langsung membukanya tanpa server. Namun saat kamu membuka index.php secara langsung (klik dua kali file), mengapa kodenya malah muncul sebagai teks mentah atau diminta unduh? Apa fungsi sebenarnya dari web server Apache dan runtime PHP?"*

---

## 2. Mengenal XAMPP & PHP Development Environment
PHP adalah bahasa pemrograman **Server-Side**. Browser tidak bisa mengeksekusi kode PHP secara langsung tanpa bantuan interpreter PHP di server web:
- **Apache:** Web Server penangan protokol HTTP (port 80).
- **MySQL:** Database server relasional (port 3306).
- **htdocs:** Folder root web Apache tempat meletakkan seluruh berkas proyek PHP.

---

## 3. Struktur Folder Proyek SIMPUS-Mini (PHP Native)
\`\`\`
simpus-mini/
├── assets/          # Berkas statis publik (css, js, gambar)
│   ├── css/style.css
│   └── img/
├── config/          # Pengaturan sistem & database
│   ├── koneksi.php
│   └── helpers.php
├── templates/       # Komponen tampilan modular
│   ├── header.php
│   └── footer.php
├── index.php        # Halaman utama (Daftar katalog buku)
├── tambah.php       # Form & pemroses tambah buku
├── edit.php         # Form & pemroses edit buku
├── hapus.php        # Script penghapusan buku
├── kategori.php     # Manajemen kategori buku
├── login.php        # Form autentikasi admin
└── logout.php       # Pembersih session
\`\`\`

---

## 4. Menjalankan PHP Server di Terminal
\`\`\`bash
# Menguji versi PHP
php -v

# Menjalankan PHP Built-in Server alternatif
cd simpus-mini
php -S localhost:8000
\`\`\``,
  },
  3: {
    no: 3,
    fileName: "03-dasar-sintaks-php-struktur-kontrol.md",
    title: "Dasar Sintaks PHP 8: Variabel, Array Associative & Modular Header/Footer",
    source: `# Pertemuan 3 — Dasar Sintaks PHP 8: Variabel, Array Associative, & Struktur Kontrol

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 3 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK1:** Mahasiswa mampu mengimplementasikan sintaks PHP, tipe data array associative, dan modularisasi include/require (C3)

---

## 1. Variabel & Array Associative di PHP
\`\`\`php
<?php
// Deklarasi variabel
$nama_perpus = "SIMPUS-Mini Kampus";

// Array Associative (Key-Value)
$buku = [
    "id"        => 1,
    "judul"     => "Pemrograman PHP 8 & MySQL",
    "pengarang" => "Budi Santoso",
    "stok"      => 10
];

echo $buku["judul"]; // Output: Pemrograman PHP 8 & MySQL
?>
\`\`\`

---

## 2. Modularisasi Tampilan dengan require_once
Memecah halaman menjadi komponen yang dapat digunakan ulang (*reusable*):
- \`templates/header.php\` (tag \`<html>\`, \`<head>\`, navigasi navbar).
- \`templates/footer.php\` (informasi hak cipta, tag penutup \`</body></html>\`).
- Halaman konten hanya memanggil:
\`\`\`php
<?php
$judul_halaman = "Katalog Buku";
require_once "templates/header.php";
?>
<h2>Daftar Buku</h2>
<!-- Konten spesifik -->
<?php require_once "templates/footer.php"; ?>
\`\`\``,
  },
  4: {
    no: 4,
    fileName: "04-database-mysql-phpmyadmin.md",
    title: "Perancangan Basis Data MySQL, phpMyAdmin & Desain Skema SIMPUS-Mini",
    source: `# Pertemuan 4 — Perancangan Basis Data MySQL, phpMyAdmin & Desain Skema SIMPUS-Mini

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 4 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu merancang tabel relasional MySQL dan mengeksekusi DDL via phpMyAdmin (C3)

---

## 1. Skema Basis Data Relasional
Tiga tabel utama pada SIMPUS-Mini:
1. \`kategori\` (id, nama_kategori, keterangan).
2. \`buku\` (id, kategori_id, judul, pengarang, penerbit, tahun_terbit, stok).
3. \`users\` (id, username, password, nama_lengkap, role).

---

## 2. Script DDL SQL
\`\`\`sql
CREATE DATABASE IF NOT EXISTS simpus_mini;
USE simpus_mini;

CREATE TABLE IF NOT EXISTS kategori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    keterangan TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buku (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kategori_id INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    pengarang VARCHAR(150) NOT NULL,
    penerbit VARCHAR(150) NOT NULL,
    tahun_terbit INT NOT NULL,
    stok INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\``,
  },
  5: {
    no: 5,
    fileName: "05-koneksi-database-php-mysql.md",
    title: "Koneksi Database PHP ke MySQL (mysqli & PDO) & Error Handling",
    source: `# Pertemuan 5 — Koneksi Database PHP ke MySQL (mysqli & PDO) & Error Handling

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 5 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu membuat skrip koneksi PHP ke database MySQL dengan teknik error handling (C3)

---

## 1. Berkas Koneksi: config/koneksi.php
\`\`\`php
<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "simpus_mini";
$port = 3306;

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = mysqli_connect($host, $user, $pass, $db, $port);
    mysqli_set_charset($conn, "utf8mb4");
} catch (mysqli_sql_exception $e) {
    error_log("Database error: " . $e->getMessage());
    die("Koneksi basis data gagal. Silakan hubungi administrator.");
}
?>
\`\`\``,
  },
  6: {
    no: 6,
    fileName: "06-operasi-read-tampil-data.md",
    title: "Operasi READ: Mengambil Data MySQL & Merender ke Tabel HTML Dinamis",
    source: `# Pertemuan 6 — Operasi READ: Mengambil Data MySQL & Merender ke Tabel HTML Dinamis

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 6 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu mengeksekusi query SELECT dan menampilkan data ke antarmuka web (C3)

---

## 1. Menampilkan Data Dinamis dengan mysqli_fetch_assoc
\`\`\`php
<?php
require_once "config/koneksi.php";

$sql = "SELECT b.*, k.nama_kategori 
        FROM buku b 
        LEFT JOIN kategori k ON b.kategori_id = k.id 
        ORDER BY b.id DESC";
$result = mysqli_query($conn, $sql);
?>

<table border="1">
    <thead>
        <tr>
            <th>No</th>
            <th>Judul Buku</th>
            <th>Kategori</th>
            <th>Pengarang</th>
            <th>Stok</th>
        </tr>
    </thead>
    <tbody>
        <?php $no = 1; while ($row = mysqli_fetch_assoc($result)): ?>
        <tr>
            <td><?= $no++ ?></td>
            <td><?= htmlspecialchars($row['judul']) ?></td>
            <td><?= htmlspecialchars($row['nama_kategori']) ?></td>
            <td><?= htmlspecialchars($row['pengarang']) ?></td>
            <td><?= $row['stok'] ?></td>
        </tr>
        <?php endwhile; ?>
    </tbody>
</table>
\`\`\``,
  },
  7: {
    no: 7,
    fileName: "07-form-html-create-insert.md",
    title: "Form HTML, Metode POST & Operasi CREATE (INSERT Data ke MySQL)",
    source: `# Pertemuan 7 — Form HTML, Metode POST & Operasi CREATE (INSERT Data ke MySQL)

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 7 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu menangani input form HTML menggunakan metode POST dan menyimpan data baru ke database (C3)

---

## 1. Alur Pemrosesan Form POST di tambah.php
\`\`\`php
<?php
require_once "config/koneksi.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $judul        = trim($_POST['judul'] ?? '');
    $kategori_id  = (int)($_POST['kategori_id'] ?? 1);
    $pengarang    = trim($_POST['pengarang'] ?? '');
    $penerbit     = trim($_POST['penerbit'] ?? '');
    $tahun_terbit = (int)($_POST['tahun_terbit'] ?? date('Y'));
    $stok         = (int)($_POST['stok'] ?? 0);

    // Simpan data dengan Prepared Statement
    $stmt = mysqli_prepare($conn, "INSERT INTO buku (kategori_id, judul, pengarang, penerbit, tahun_terbit, stok) VALUES (?, ?, ?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "isssii", $kategori_id, $judul, $pengarang, $penerbit, $tahun_terbit, $stok);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    // Redirect untuk menghindari form resubmission
    header("Location: index.php?pesan=" . urlencode("Buku berhasil ditambahkan!"));
    exit;
}
?>
\`\`\``,
  },
  8: {
    no: 8,
    fileName: "08-uts-proyek-crud-dasar.md",
    title: "UJIAN TENGAH SEMESTER (UTS): Evaluasi Proyek Praktik CRUD Dasar",
    source: `# Pertemuan 8 — UJIAN TENGAH SEMESTER (UTS): Evaluasi Proyek Praktik CRUD Dasar

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Evaluasi Tengah Semester (Pertemuan 8 dari 16)  
> **Bobot:** 25% (Asesmen Sumatif 1)  
> **CPMK1 & CPMK2:** Menguji pemahaman arsitektur web, desain database MySQL, koneksi PHP, serta implementasi operasi Read & Create (C3)

---

## Rubrik Penilaian Standar OBE
1. **Desain Database (25%):** Skema tabel relasional MySQL dengan primary & foreign key.
2. **Koneksi & Modularitas (20%):** File koneksi.php dan template header/footer modular.
3. **Fitur READ (25%):** Query SELECT JOIN menampilkan data dinamis secara rapi.
4. **Fitur CREATE (30%):** Form input POST menyimpan data dengan prepared statements tanpa bug resubmission.`,
  },
  9: {
    no: 9,
    fileName: "09-operasi-update-edit-data.md",
    title: "Operasi UPDATE: Mengambil Data Berdasarkan ID & Memperbarui Record",
    source: `# Pertemuan 9 — Operasi UPDATE: Mengambil Data Berdasarkan ID & Memperbarui Record

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 9 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu mengimplementasikan operasi Update pada basis data MySQL dengan validasi parameter ID (C3)

---

## 1. Alur Operasi Update di edit.php
\`\`\`php
<?php
require_once "config/koneksi.php";

$id = (int)($_GET['id'] ?? 0);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $judul = $_POST['judul'];
    $stok  = (int)$_POST['stok'];

    $stmt = mysqli_prepare($conn, "UPDATE buku SET judul = ?, stok = ? WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "sii", $judul, $stok, $id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    header("Location: index.php?pesan=" . urlencode("Data berhasil diperbarui!"));
    exit;
}

// Ambil data buku saat ini untuk mengisi form
$stmt = mysqli_prepare($conn, "SELECT * FROM buku WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$buku = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
?>
\`\`\``,
  },
  10: {
    no: 10,
    fileName: "10-operasi-delete-hapus-data.md",
    title: "Operasi DELETE: Menghapus Data Secara Aman & Konfirmasi JavaScript",
    source: `# Pertemuan 10 — Operasi DELETE: Menghapus Data Secara Aman & Konfirmasi JavaScript

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 10 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu mengimplementasikan operasi Delete dengan penanganan konfirmasi dan sanitasi ID (C3)

---

## 1. Skrip Hapus Data: hapus.php
\`\`\`php
<?php
require_once "config/koneksi.php";

$id = (int)($_GET['id'] ?? 0);

if ($id > 0) {
    $stmt = mysqli_prepare($conn, "DELETE FROM buku WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    header("Location: index.php?pesan=" . urlencode("Buku berhasil dihapus!"));
    exit;
}

header("Location: index.php");
exit;
?>
\`\`\``,
  },
  11: {
    no: 11,
    fileName: "11-validasi-form-keamanan-web.md",
    title: "Validasi Input Server-Side, Proteksi XSS & Pencegahan SQL Injection",
    source: `# Pertemuan 11 — Validasi Input Server-Side, Proteksi XSS & Pencegahan SQL Injection

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 11 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2 & CPMK3:** Mahasiswa mampu mengamankan aplikasi web dari serangan umum SQL Injection dan Cross-Site Scripting (XSS) (C3)

---

## 1. Pencegahan SQL Injection
Selalu gunakan **Prepared Statements**:
\`\`\`php
// AMAN DARI SQL INJECTION:
$stmt = mysqli_prepare($conn, "SELECT * FROM users WHERE username = ?");
mysqli_stmt_bind_param($stmt, "s", $username);
mysqli_stmt_execute($stmt);
\`\`\`

---

## 2. Pencegahan Cross-Site Scripting (XSS)
Selalu gunakan **htmlspecialchars()**:
\`\`\`php
// AMAN DARI XSS:
echo htmlspecialchars($data['judul'], ENT_QUOTES, 'UTF-8');
\`\`\``,
  },
  12: {
    no: 12,
    fileName: "12-relasi-tabel-sql-join.md",
    title: "Relasi Tabel One-to-Many (1:N) & Query SQL JOIN di PHP",
    source: `# Pertemuan 12 — Relasi Tabel One-to-Many (1:N) & Query SQL JOIN di PHP

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 12 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu mengimplementasikan relasi antar tabel (1:N) dan menggabungkan data menggunakan INNER JOIN / LEFT JOIN (C3)

---

## 1. Query JOIN Antara Kategori dan Buku
\`\`\`sql
SELECT 
    b.id,
    b.judul,
    b.pengarang,
    b.stok,
    k.nama_kategori
FROM buku b
LEFT JOIN kategori k ON b.kategori_id = k.id
ORDER BY b.id DESC;
\`\`\``,
  },
  13: {
    no: 13,
    fileName: "13-autentikasi-session-login.md",
    title: "Autentikasi Pengguna: Session PHP, Registrasi & Password Hashing",
    source: `# Pertemuan 13 — Autentikasi Pengguna: Session PHP, Registrasi & Password Hashing

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 13 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK3:** Mahasiswa mampu mengimplementasikan sistem login, session management, dan enkripsi password hash (C3)

---

## 1. Password Hashing Modern
\`\`\`php
// Membuat hash saat register
$hash = password_hash($password_input, PASSWORD_BCRYPT);

// Memverifikasi saat login
if (password_verify($password_input, $user['password'])) {
    session_start();
    $_SESSION['logged_in'] = true;
    $_SESSION['user_id']   = $user['id'];
    $_SESSION['role']      = $user['role'];
}
\`\`\``,
  },
  14: {
    no: 14,
    fileName: "14-otorisasi-role-admin-user.md",
    title: "Otorisasi & Hak Akses: Role Admin vs Anggota & Proteksi Halaman",
    source: `# Pertemuan 14 — Otorisasi & Hak Akses: Role Admin vs Anggota & Proteksi Halaman

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 14 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK3:** Mahasiswa mampu membatasi hak akses halaman berdasarkan status login dan role pengguna (C3)  
> **ASESMEN FORMATIF 2 (Bobot 20%):** Progres Proyek Lengkap (CRUD + Relasi + Autentikasi Role)

---

## 1. Middleware Proteksi: config/auth_check.php
\`\`\`php
<?php
if (session_status() === PHP_SESSION_NONE) session_start();

function require_login() {
    if (!isset($_SESSION['logged_in'])) {
        header("Location: login.php");
        exit;
    }
}

function require_admin() {
    require_login();
    if ($_SESSION['role'] !== 'admin') {
        die("Akses Ditolak: Fitur ini khusus Admin.");
    }
}
?>
\`\`\``,
  },
  15: {
    no: 15,
    fileName: "15-fitur-pencarian-upload-cover.md",
    title: "Fitur Pelengkap (Pencarian & Upload Cover Buku) & Pengenalan Hosting cPanel",
    source: `# Pertemuan 15 — Fitur Pelengkap (Pencarian & Upload Cover Buku) & Pengenalan Hosting cPanel

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Hosting & Deploy (Pertemuan 15 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK3 & CPMK4:** Mahasiswa mampu menambahkan fitur pencarian dinamis, menangani upload file multipart di PHP, serta memahami konsep web hosting (C3)

---

## 1. Upload Berkas dengan $_FILES
\`\`\`php
if (isset($_FILES['cover']) && $_FILES['cover']['error'] === UPLOAD_ERR_OK) {
    $tujuan = "assets/img/" . time() . "_" . $_FILES['cover']['name'];
    move_uploaded_file($_FILES['cover']['tmp_name'], $tujuan);
}
\`\`\`

---

## 2. Fitur cPanel untuk PHP Native
- **File Manager:** Mengunggah berkas PHP ke folder \`public_html/\`.
- **MySQL Database Wizard:** Membuat basis data dan user database.
- **phpMyAdmin:** Mengimpor file backup \`simpus_mini.sql\`.`,
  },
  16: {
    no: 16,
    fileName: "16-uas-deployment-cpanel-hosting.md",
    title: "UJIAN AKHIR SEMESTER (UAS): Deployment PHP & MySQL ke cPanel Live Hosting & Showcase",
    source: `# Pertemuan 16 — UJIAN AKHIR SEMESTER (UAS): Deployment PHP & MySQL ke cPanel Live Hosting & Showcase

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Ujian Akhir Semester (Pertemuan 16 dari 16)  
> **Bobot:** 35% (Asesmen Sumatif 2)  
> **Format:** Presentasi Proyek + Demo Aplikasi LIVE di Web Hosting Publik + Tanya Jawab Lisan  
> **CPMK4 & CPMK5:** Mahasiswa mampu melakukan deployment penuh aplikasi PHP & database MySQL ke server hosting publik dan mendemonstrasikannya (C4)

---

## 1. 6 Langkah Deployment ke cPanel
1. Ekspor database MySQL lokal ke berkas \`simpus_mini_final.sql\`.
2. Buat database baru dan user database via **MySQL Database Wizard** di cPanel.
3. Impor berkas \`simpus_mini_final.sql\` melalui **phpMyAdmin** cPanel.
4. Unggah berkas proyek ZIP ke folder **\`public_html/\`** File Manager dan ekstrak.
5. Sesuaikan kredensial server di berkas \`config/koneksi.php\`.
6. Buka domain publik dan uji coba seluruh fitur CRUD serta login admin!`,
  },
};

export function getCiBackendMdDoc(meetingNo: number): BackendMdDoc | undefined {
  return CI_BACKEND_MD_DOCS[meetingNo];
}
