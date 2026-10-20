# Pertemuan 2 — Setup Environment PHP 8 & Web Server XAMPP / Apache Lokal

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 2 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK1:** Mahasiswa mampu menyiapkan lingkungan kerja PHP 8, Apache, dan MySQL (C3)

---

## 1. Problem Statement (PBL)
> *"Ketika kamu mengetikkan `index.html`, browser bisa langsung membukanya tanpa server. Namun saat kamu membuka `index.php` secara langsung (klik dua kali file), mengapa kodenya malah muncul sebagai teks mentah atau diminta unduh? Apa fungsi sebenarnya dari web server Apache dan runtime PHP?"*

---

## 2. Mengenal XAMPP & PHP Development Environment
PHP adalah bahasa pemrograman **Server-Side**. Browser tidak bisa mengeksekusi kode PHP secara langsung. Kode PHP harus diproses terlebih dahulu oleh PHP Interpreter di server, lalu server mengirimkan output HTML ke browser.

Paket **XAMPP** menyediakan bundel lengkap untuk komputer pengembang:
- **X:** Cross-Platform (Windows, Linux, macOS).
- **A:** **Apache** (Web Server penangan protokol HTTP port 80/8080).
- **M:** **MariaDB / MySQL** (Database Server port 3306).
- **P:** **PHP** (Bahasa pemrograman backend interpreter).
- **P:** **Perl** (Bahasa scripting tambahan).

Alternatif lain: **Laragon** (Windows), **MAMP** (macOS), atau **PHP Built-in Server** (`php -S localhost:8000`).

---

## 3. Struktur Direktori Web Root (htdocs)
Pada Apache XAMPP, semua berkas website yang ingin diakses lewat browser harus disimpan di dalam folder **`htdocs`**:
- Lokasi di Windows: `C:\xampp\htdocs\simpus-mini\`
- URL di Browser: `http://localhost/simpus-mini/index.php`

### Struktur Folder Proyek PHP Modular yang Bersih
```
simpus-mini/
├── assets/          # Berkas statis publik (css, js, gambar)
│   ├── css/
│   │   └── style.css
│   └── img/
├── config/          # Pengaturan sistem & database
│   └── koneksi.php
├── templates/       # Komponen tampilan modular
│   ├── header.php
│   └── footer.php
├── index.php        # Halaman utama (Daftar buku)
├── tambah.php       # Form & proses tambah buku
├── edit.php         # Form & proses edit buku
├── hapus.php        # Script pemroses hapus buku
└── login.php        # Halaman autentikasi
```

---

## 4. Hands-on Praktikum

### Langkah 1: Verifikasi Instalasi PHP di Terminal
Buka Command Prompt / PowerShell / Terminal, ketikkan:
```bash
php -v
```
*Pastikan versi PHP yang aktif adalah PHP 8.1 atau 8.2 ke atas.*

### Langkah 2: Menjalankan PHP Built-in Server (Metode Cepat Tanpa XAMPP)
Jika tidak menggunakan Apache XAMPP, PHP memiliki server bawaan untuk pengujian lokal:
```bash
cd simpus-mini
php -S localhost:8000
```
Buka browser dan akses: `http://localhost:8000`

### Langkah 3: Membuat Berkas PHP Pertama `info.php`
```php
<?php
// info.php - Menampilkan konfigurasi sistem PHP
echo "<h1>Selamat Datang di Pemrograman PHP Backend!</h1>";
echo "<p>Versi PHP Server: " . phpversion() . "</p>";
phpinfo();
```

---

## 5. Ringkasan Tugas Praktikum (RTM-2)
1. Nyalakan modul Apache dan MySQL di XAMPP Control Panel (indikator hijau).
2. Buat folder baru bernama `simpus-mini` di dalam folder `htdocs`.
3. Buat file `index.php` sederhana dan pastikan berhasil dibuka melalui `http://localhost/simpus-mini/`.
4. Ambil screenshot browser yang menampilkan output PHP dan sertakan dalam catatan praktikum.
