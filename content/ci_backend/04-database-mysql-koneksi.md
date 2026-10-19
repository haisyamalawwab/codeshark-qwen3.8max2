# Pertemuan 4 — Database MySQL, phpMyAdmin & Koneksi Aplikasi

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 4 dari 16)  
> **CPMK2:** Mahasiswa mampu merancang tabel MySQL dan menghubungkannya via .env (C3)  
> **ASESMEN FORMATIF 1 (Bobot 20%):** Kuis Konsep DB + Tugas Koneksi MySQL

---

## 1. Konsep RDBMS & Primary Key
- **Primary Key (PK):** Kolom penanda unik setiap baris data (wajib unik, tidak boleh null, biasanya integer auto increment).
- **Tipe Data:** `INT`, `VARCHAR(n)`, `TEXT`, `DATETIME`.

---

## 2. Script DDL Database simpus_mini
```sql
CREATE DATABASE IF NOT EXISTS `simpus_mini`;
USE `simpus_mini`;

CREATE TABLE `kategori` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `nama_kategori` VARCHAR(100) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `buku` (
    `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `kategori_id` INT(11) UNSIGNED NULL,
    `judul` VARCHAR(255) NOT NULL,
    `pengarang` VARCHAR(150) NOT NULL,
    `penerbit` VARCHAR(100) NOT NULL,
    `tahun_terbit` INT(4) NOT NULL,
    `stok` INT(11) NOT NULL DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Konfigurasi Koneksi di Berkas .env
```ini
database.default.hostname = localhost
database.default.database = simpus_mini
database.default.username = root
database.default.password = 
database.default.DBDriver = MySQLi
database.default.port = 3306
```
