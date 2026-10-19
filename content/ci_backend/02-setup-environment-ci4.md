# Pertemuan 2 — Instalasi Environment XAMPP, Composer & CodeIgniter 4

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 2 dari 16)  
> **CPMK2:** Mahasiswa mampu mengonfigurasi environment kerja PHP 8, Composer, dan CodeIgniter 4 (C3)

---

## 1. Piranti Wajib Backend PHP
1. **XAMPP / Laragon:** Paket bundel Apache, MySQL, dan PHP 8.2+.
2. **Composer:** Dependency manager resmi ekosistem PHP.
3. **VS Code:** Editor kode dengan ekstensi *PHP Intelephense*.

---

## 2. Struktur Direktori CodeIgniter 4
```
simpus-mini/
├── app/                  -> Logika inti aplikasi (MVC)
│   ├── Config/           -> Konfigurasi rute, filter, database
│   ├── Controllers/      -> Pengendali alur logika request
│   ├── Models/           -> Berinteraksi dengan tabel MySQL
│   └── Views/            -> Template antarmuka HTML/PHP
├── public/               -> Web Root (index.php, css, js, gambar)
├── writable/             -> Cache, log error, file upload
├── .env                  -> Konfigurasi rahasia lingkungan lokal
└── composer.json         -> Daftar pustaka dependensi
```

> **Keamanan Web Root:** Folder `public/` adalah satu-satunya folder yang diarahkan ke web server. Folder `app/` dan berkas `.env` berada di luar web root sehingga tidak dapat diunduh langsung oleh pihak asing.

---

## 3. Menjalankan Server Lokal via Spark
Buka Terminal di folder proyek lalu jalankan:
```bash
# Salin template env menjadi .env
cp env .env

# Jalankan server lokal CodeIgniter
php spark serve
```
Buka browser ke: `http://localhost:8080`
