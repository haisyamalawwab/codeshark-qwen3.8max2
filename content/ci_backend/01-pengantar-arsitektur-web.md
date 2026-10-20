# Pertemuan 1 — Pengantar Arsitektur Web & HTTP Request-Response (PHP & Apache)

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 1 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK1:** Mahasiswa mampu menjelaskan konsep dasar arsitektur web client-server dan alur kerja backend (C2)

---

## 1. Problem Statement (PBL)
> *"Saat kamu membuka website perpustakaan atau marketplace online di laptop dan mengklik tombol 'Cari Buku', apa yang sebenarnya terjadi di balik layar? Bagaimana data teks dan gambar bisa sampai ke browsermu, dan siapa yang memproses permintaan tersebut?"*

---

## 2. Arsitektur Client-Server & Siklus Request-Response
Aplikasi web berbasis PHP beroperasi menggunakan model **Client-Server**:
1. **Client (Browser):** Berjalan di perangkat pengguna (Google Chrome, Mozilla Firefox, Safari, Edge). Berfungsi merender HTML/CSS/JavaScript dan menangkap input form dari pengguna.
2. **Web Server (Apache):** Perangkat lunak server yang mendengarkan permintaan jaringan (HTTP Port 80 atau 8080).
3. **PHP Preprocessor (Interpreter):** Mesin penerjemah kode PHP yang mengeksekusi logika server-side, memproses input form, dan berinteraksi dengan database.
4. **Database Server (MySQL / MariaDB):** Tempat penyimpanan data relasional terstruktur (Port 3306).

### Diagram Alur Request-Response PHP
```
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
```

---

## 3. Perbedaan Frontend vs Backend
| Aspek | Frontend (Client-Side) | Backend (Server-Side) |
|---|---|---|
| **Tempat Eksekusi** | Browser pengguna (komputer/HP) | Komputer server (aman) |
| **Teknologi Utama** | HTML5, CSS3, JavaScript | PHP 8, Python, MySQL, Apache |
| **Akses Kode** | Terbuka (bisa di-inspect via F12) | Tertutup (pengguna hanya menerima output HTML) |
| **Keamanan** | Tidak boleh menyimpan password/kunci database | Mengamankan data, validasi, otorisasi pengguna |
| **Penyimpanan Data** | Sementara (LocalStorage/Cookie browser) | Permanen di Database MySQL |

---

## 4. HTTP Methods Dasar: GET vs POST
1. **HTTP GET:**
   - Digunakan untuk **membaca / mengambil data** dari server.
   - Parameter dikirimkan melalui URL (Query String): `http://localhost/buku.php?id=5&kategori=it`.
   - Terlihat oleh pengguna, dapat di-bookmark di browser, dan memiliki batasan panjang URL.
   - Jangan pernah menggunakan GET untuk password atau data sensitif!

2. **HTTP POST:**
   - Digunakan untuk **mengirim / menyimpan data baru** ke server.
   - Data dibungkus rapi di dalam **HTTP Request Body** (tidak tampak di URL).
   - Wajib digunakan untuk Form Registrasi, Login, Tambah Data, dan Unggah Berkas.

---

## 5. Ringkasan Proyek Mini PjBL: SIMPUS-Mini
Sepanjang 16 pertemuan, mahasiswa akan membangun sistem nyata bernama **SIMPUS-Mini (Sistem Informasi Perpustakaan Mini)** berbasis PHP Native & MySQL:
- **Modul 1:** Katalog & Pencarian Buku (Read).
- **Modul 2:** Manajemen Data Buku & Kategori (Create, Update, Delete).
- **Modul 3:** Relasi 1:N Antara Kategori dan Buku (JOIN Query).
- **Modul 4:** Keamanan Input & Proteksi Serangan (Sanitasi & Prepared Statements).
- **Modul 5:** Autentikasi Pengguna & Role Admin vs Anggota (Session).
- **Modul 6:** Deployment Mandiri ke Live Web Hosting cPanel.

---

## 6. Tugas / Evaluasi Mandiri (RTM-1)
1. Buka browser dan buka menu **Developer Tools (F12)** -> Tab **Network**.
2. Kunjungi sebuah halaman web, amati request pertama. Catat: Request URL, Request Method, Status Code, dan Content-Type header.
3. Jelaskan dalam 1 paragraf mengapa koneksi database dan password tidak boleh diletakkan di file JavaScript frontend!
