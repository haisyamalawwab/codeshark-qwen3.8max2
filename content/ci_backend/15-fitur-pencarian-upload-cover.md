# Pertemuan 15 — Fitur Pelengkap (Pencarian & Upload Cover Buku) & Pengenalan Hosting cPanel

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Hosting & Deploy (Pertemuan 15 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK3 & CPMK4:** Mahasiswa mampu menambahkan fitur pencarian dinamis, menangani upload file multipart di PHP, serta memahami konsep web hosting (C3)

---

## 1. Problem Statement (PBL)
> *"Koleksi perpustakaan semakin berkembang hingga ratusan buku. Pengunjung kesulitan mencari buku jika harus memeriksa tabel satu demi satu. Selain itu, buku lebih menarik jika dilengkapi gambar sampul (cover). Bagaimana cara menambahkan form pencarian cepat dan menangani berkas gambar yang diunggah pengguna ke server?"*

---

## 2. Fitur Pencarian Dinamis dengan Operator `LIKE`
Pada `index.php`, kita dapat menambahkan form pencarian metode GET:
```php
<?php
// Ambil kata kunci dari URL
$cari = trim($_GET['q'] ?? '');

if (!empty($cari)) {
    // Siapkan query dengan parameter wildcard
    $stmt = mysqli_prepare($conn, "SELECT b.*, k.nama_kategori 
                                   FROM buku b 
                                   LEFT JOIN kategori k ON b.kategori_id = k.id 
                                   WHERE b.judul LIKE ? OR b.pengarang LIKE ? OR k.nama_kategori LIKE ?
                                   ORDER BY b.id DESC");
    $param_cari = "%" . $cari . "%";
    mysqli_stmt_bind_param($stmt, "sss", $param_cari, $param_cari, $param_cari);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
} else {
    $result = mysqli_query($conn, "SELECT b.*, k.nama_kategori FROM buku b LEFT JOIN kategori k ON b.kategori_id = k.id ORDER BY b.id DESC");
}
?>
```

---

## 3. Menangani Unggah Berkas Cover di PHP: `$_FILES`
Saat mengunggah berkas, form HTML **wajib** memiliki atribut:
`enctype="multipart/form-data"`

### Contoh Kode Pemrosesan Upload:
```php
<?php
$cover_nama = "default-cover.jpg";

if (isset($_FILES['cover']) && $_FILES['cover']['error'] === UPLOAD_ERR_OK) {
    $file_tmp  = $_FILES['cover']['tmp_name'];
    $file_name = $_FILES['cover']['name'];
    $file_size = $_FILES['cover']['size'];
    
    // Ambil ekstensi
    $ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $allowed_ext = ['jpg', 'jpeg', 'png', 'webp'];

    // Validasi ekstensi & ukuran (maks 2MB)
    if (in_array($ext, $allowed_ext) && $file_size <= 2 * 1024 * 1024) {
        // Buat nama acak unik agar tidak menimpa file lain
        $cover_nama = "cover_" . time() . "_" . bin2hex(random_bytes(4)) . "." . $ext;
        $tujuan = "assets/img/" . $cover_nama;
        move_uploaded_file($file_tmp, $tujuan);
    }
}
?>
```

---

## 4. Pengenalan Web Hosting & cPanel
- **Localhost vs Web Hosting:** Localhost hanya hidup di laptop pribadi. Agar website bisa dibuka oleh orang lain lewat internet 24 jam, website harus diunggah ke server **Web Hosting**.
- **Fitur Kunci cPanel untuk PHP Native:**
  1. **File Manager:** Mengunggah berkas PHP ke folder `public_html/`.
  2. **MySQL Database Wizard:** Membuat nama database, user DB, dan password di server hosting.
  3. **phpMyAdmin:** Mengimpor file backup `.sql` dari komputer lokal.
  4. **Select PHP Version:** Memilih versi PHP (PHP 8.1 / 8.2) dan mengaktifkan ekstensi yang diperlukan.

---

## 5. Tugas Praktikum (RTM-15)
1. Pasang form input pencarian di atas tabel `index.php`.
2. Uji coba mencari buku berdasarkan sebagian nama judul atau pengarang.
3. Siapkan akun hosting cPanel gratis / kampus dan siapkan file ekspor `simpus_mini.sql` untuk persiapan deployment final di pertemuan 16.
