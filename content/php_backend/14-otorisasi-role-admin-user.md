# Pertemuan 14 — Otorisasi & Hak Akses: Role Admin vs Anggota & Proteksi Halaman

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 14 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK3:** Mahasiswa mampu membatasi hak akses halaman berdasarkan status login dan role pengguna (C3)  
> **ASESMEN FORMATIF 2 (Bobot 20%):** Progres Proyek Lengkap (CRUD + Relasi + Autentikasi Role)

---

## 1. Problem Statement (PBL)
> *"Bagaimana jika ada pengunjung umum yang langsung mengetikkan URL `http://localhost/simpus-mini/tambah.php` atau `hapus.php?id=1` di address bar browser tanpa login terlebih dahulu? Bagaimana PHP memblokir akses ilegal tersebut dan membedakan antara fitur staf Admin (bisa hapus buku) vs Anggota umum (hanya bisa melihat katalog)?"*

---

## 2. Autentikasi vs Otorisasi
- **Autentikasi (Authentication):** Menjawab pertanyaan *"Siapa Anda?"* (Proses verifikasi username dan password).
- **Otorisasi (Authorization):** Menjawab pertanyaan *"Apa yang boleh Anda lakukan?"* (Pemeriksaan apakah pengguna memiliki wewenang/role yang cukup untuk mengakses fitur tertentu).

---

## 3. Middleware Sederhana PHP: `config/auth_check.php`
Untuk melindungi halaman dari akses liar, kita buat skrip pengecekan terpusat:

```php
<?php
// config/auth_check.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Memastikan pengguna sudah login
 */
function require_login() {
    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        header("Location: login.php?pesan=" . urlencode("Silakan login terlebih dahulu untuk mengakses menu ini."));
        exit;
    }
}

/**
 * Memastikan pengguna memiliki role Admin
 */
function require_admin() {
    require_login();
    if ($_SESSION['role'] !== 'admin') {
        die("<div style='max-width:500px; margin:3rem auto; font-family:sans-serif; text-align:center;'>
                <h2 style='color:#dc2626;'>Akses Ditolak (403 Forbidden)</h2>
                <p>Hanya staf berstatus <strong>Administrator</strong> yang berhak melakukan tindakan ini.</p>
                <a href='index.php'>&larr; Kembali ke Beranda</a>
             </div>");
    }
}
?>
```

---

## 4. Memasang Proteksi pada Halaman Penting

### Proteksi pada `tambah.php`, `edit.php`, dan `hapus.php`
Di baris paling atas berkas:
```php
<?php
require_once "config/koneksi.php";
require_once "config/auth_check.php";

// Kunci halaman ini: Hanya Admin yang boleh masuk!
require_admin();
?>
```

### Menyesuaikan Tampilan Navigasi di `templates/header.php`
```php
<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<nav>
    <a href="index.php">Katalog Buku</a> |
    <a href="kategori.php">Kategori</a>
    
    <?php if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true): ?>
        <?php if ($_SESSION['role'] === 'admin'): ?>
            | <a href="tambah.php" style="color: #0284c7; font-weight: bold;">+ Tambah Buku</a>
        <?php endif; ?>
        | <span>Halo, <strong><?= htmlspecialchars($_SESSION['nama_lengkap']) ?></strong> (<?= $_SESSION['role'] ?>)</span>
        | <a href="logout.php" style="color: #ef4444;">Logout</a>
    <?php else: ?>
        | <a href="login.php" style="font-weight: bold;">Login Masuk</a>
    <?php endif; ?>
</nav>
```

---

## 5. Tugas Praktikum & Asesmen Formatif 2 (Bobot 20%)
1. Buat berkas `config/auth_check.php`.
2. Pasang fungsi `require_admin()` pada `tambah.php`, `edit.php`, dan `hapus.php`.
3. Buat satu user baru dengan role `user` (anggota biasa).
4. Login menggunakan akun `user` biasa, lalu coba akses `http://localhost/simpus-mini/tambah.php` secara manual lewat URL. Pastikan sistem menolak dengan pesan *"Akses Ditolak (403 Forbidden)"*.
