# Pertemuan 1 — Pengantar Arsitektur Web & HTTP Request-Response

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 1 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK1:** Mahasiswa mampu menjelaskan konsep dasar arsitektur web client-server dan alur kerja backend (C2)

---

## 1. Problem Statement (PBL)
> *"Saat kamu membuka marketplace online di HP dan menekan tombol 'Beli', siapa yang sebenarnya memproses pesanan dan memotong stok barang di balik layar? Bagaimana data produk bisa muncul di layar setelah kamu mengklik sebuah menu?"*

---

## 2. Arsitektur Client-Server & Siklus Request-Response
Aplikasi web modern beroperasi dengan model **Client-Server**:
1. **Client (Frontend):** Berjalan di perangkat pengguna (browser Chrome, Firefox, Safari). Bertanggung jawab menampilkan antarmuka (HTML/CSS) dan menangkap input pengguna.
2. **Server (Backend):** Komputer server yang aman tempat aplikasi web (PHP & CodeIgniter 4) dan basis data (MySQL) berjalan.

### Diagram Alur Request-Response
```
[Browser Client]
       │
       │  1. HTTP Request (GET /katalog)
       ▼
[Web Server Apache (Port 80/8080)]
       │
       │  2. Meneruskan ke public/index.php
       ▼
[CodeIgniter 4 Router -> Controller Buku::index()]
       │
       │  3. Query data ke Database
       ▼
[MySQL Database (Port 3306)]
       │
       │  4. Mengembalikan baris data tabel buku
       ▼
[Controller merender View buku/index.php]
       │
       │  5. HTTP Response (Status 200 OK + HTML Tampilan)
       ▼
[Browser merender tampilan katalog ke pengguna]
```

---

## 3. HTTP Methods Dasar: GET vs POST
| Karakteristik | HTTP GET | HTTP POST |
|---|---|---|
| **Tujuan Utama** | Mengambil / membaca data dari server | Mengirimkan data baru untuk diproses server |
| **Lokasi Data** | Di URL (query string: `/buku?search=php`) | Di dalam Request Body (tersembunyi dari URL) |
| **Keamanan Data** | Tidak aman untuk password / data sensitif | Lebih aman, wajib untuk form login & create |
| **Idempotency** | Idempotent (diulang tidak mengubah state server) | Non-idempotent (diulang bisa membuat data ganda) |

---

## 4. Gambaran Proyek Akhir (PjBL): SIMPUS-Mini
Pada mata kuliah ini, Anda akan membangun **SIMPUS-Mini (Sistem Informasi Perpustakaan Mini)**:
- **Tabel Utama:** `kategori`, `buku`, `users`, `peminjaman`
- **Fitur Wajib:** CRUD Buku & Kategori, Validasi Form, Relasi One-to-Many JOIN, Session-Based Login & Role Admin vs Anggota, serta Live Deployment ke cPanel Web Hosting!
