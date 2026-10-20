# Pertemuan 4 — Perancangan Basis Data MySQL, phpMyAdmin & Desain Skema SIMPUS-Mini

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 4 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu merancang tabel relasional MySQL dan mengeksekusi DDL via phpMyAdmin (C3)

---

## 1. Problem Statement (PBL)
> *"Mengapa kita tidak menyimpan data inventaris buku perpustakaan di dalam file teks (`buku.txt`) atau file spreadsheet Excel saja? Masalah apa yang akan timbul saat 100 orang pengunjung meminjam buku secara bersamaan dalam detik yang sama?"*

---

## 2. Mengapa Menggunakan Relational DBMS (MySQL)?
1. **Integritas & Konsistensi Data:** Mendukung tipe data ketat, kunci primer (*Primary Key*), dan kunci asing (*Foreign Key*).
2. **Konkurensi Tinggi (ACID Transactions):** Mampu menangani ribuan pengguna secara simultan tanpa file korup (*race condition*).
3. **Pencarian Cepat dengan Indeks:** Mampu menyaring jutaan baris data dalam hitungan milidetik menggunakan Structured Query Language (SQL).

---

## 3. Merancang Skema Database `simpus_mini`
Sistem Informasi Perpustakaan Mini membutuhkan minimal 3 tabel awal:
1. `kategori`: Menyimpan klasifikasi buku (Teknologi, Sastra, Sains).
2. `buku`: Menyimpan informasi katalog buku dan referensi ke kategori.
3. `users`: Menyimpan kredensial login (Admin dan Anggota).

### Entity Relationship Diagram (ERD) Sederhana
```
[kategori] (1) ───────────< (N) [buku]
 id (PK)                         id (PK)
 nama_kategori                   kategori_id (FK)
 keterangan                      judul
                                 pengarang
                                 penerbit
                                 tahun_terbit
                                 stok
```

---

## 4. Script SQL DDL (Data Definition Language)
Buka menu **SQL** di phpMyAdmin (`http://localhost/phpmyadmin/`), lalu jalankan script berikut:

```sql
-- 1. Buat Database Baru
CREATE DATABASE IF NOT EXISTS simpus_mini
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE simpus_mini;

-- 2. Buat Tabel Kategori
CREATE TABLE IF NOT EXISTS kategori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    keterangan TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Buat Tabel Buku
CREATE TABLE IF NOT EXISTS buku (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kategori_id INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    pengarang VARCHAR(150) NOT NULL,
    penerbit VARCHAR(150) NOT NULL,
    tahun_terbit INT NOT NULL,
    stok INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_buku_kategori FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Buat Tabel Users (untuk modul autentikasi)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Masukkan Data Awal (Seeding)
INSERT INTO kategori (id, nama_kategori, keterangan) VALUES
(1, 'Teknologi Informasi', 'Buku koding, jaringan, dan database'),
(2, 'Sains & Matematika', 'Buku fisika, biologi, kalkulus'),
(3, 'Sastra & Fiksi', 'Novel, antologi puisi, cerpen');

INSERT INTO buku (kategori_id, judul, pengarang, penerbit, tahun_terbit, stok) VALUES
(1, 'Pemrograman Web PHP 8 & MySQL', 'Budi Santoso', 'Informatika Press', 2023, 10),
(1, 'Mastering MySQL Database Design', 'Ahmad Fauzi', 'Media Komputindo', 2022, 5),
(2, 'Fisika Dasar untuk Teknik', 'Prof. Sutrisno', 'Penerbit ITB', 2021, 8),
(3, 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2019, 12);
```

---

## 5. Tugas Praktikum (RTM-4)
1. Buat database `simpus_mini` di phpMyAdmin laptopmu.
2. Eksekusi script SQL di atas dan pastikan ketiga tabel berhasil terbuat tanpa error.
3. Buka tab **Browse** pada tabel `buku` untuk memverifikasi bahwa 4 baris data sampel telah tersimpan.
4. Lakukan **Export** database ke format berkas `simpus_mini.sql` sebagai cadangan (backup).
