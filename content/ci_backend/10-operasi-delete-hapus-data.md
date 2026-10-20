# Pertemuan 10 — Operasi DELETE: Menghapus Data Secara Aman & Konfirmasi JavaScript

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 10 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu mengimplementasikan operasi Delete dengan penanganan konfirmasi dan sanitasi ID (C3)

---

## 1. Problem Statement (PBL)
> *"Penghapusan data di basis data bersifat permanen (irreversible). Jika seorang staf secara tidak sengaja mengklik tautan 'Hapus', data bisa hilang selamanya. Bagaimana cara membuat skrip penghapusan yang aman, meminta konfirmasi pop-up dari pengguna sebelum bertindak, dan menolak permintaan jika ID tidak valid?"*

---

## 2. Alur Kerja Operasi DELETE di PHP
1. **Pemicu Aksi:** Pengguna mengklik tautan `<a href="hapus.php?id=3" onclick="return confirm('Yakin ingin menghapus?')">`.
2. **Validasi ID:** Skrip `hapus.php` memeriksa apakah parameter `$_GET['id']` adalah bilangan bulat positif.
3. **Cek Keberadaan Record:** Memeriksa apakah data dengan ID tersebut benar-benar ada di database.
4. **Eksekusi Query DELETE:** Menjalankan `DELETE FROM buku WHERE id = ?`.
5. **Redirection dengan Feedback:** Mengembalikan pengguna ke `index.php` disertai pesan status sukses atau gagal.

---

## 3. Implementasi Lengkap: `hapus.php`
```php
<?php
// hapus.php - Skrip Pemroses Penghapusan Data Buku
require_once "config/koneksi.php";

// 1. Ambil dan sanitasi parameter ID
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    header("Location: index.php?pesan=" . urlencode("ID buku tidak valid untuk dihapus."));
    exit;
}

// 2. Periksa apakah buku ada di database sebelum menghapus
$stmt_check = mysqli_prepare($conn, "SELECT judul FROM buku WHERE id = ?");
mysqli_stmt_bind_param($stmt_check, "i", $id);
mysqli_stmt_execute($stmt_check);
$result = mysqli_stmt_get_result($stmt_check);
$buku = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt_check);

if (!$buku) {
    header("Location: index.php?pesan=" . urlencode("Data buku tidak ditemukan, tidak ada yang dihapus."));
    exit;
}

$judul_buku = $buku['judul'];

// 3. Eksekusi query DELETE menggunakan Prepared Statement
$stmt_del = mysqli_prepare($conn, "DELETE FROM buku WHERE id = ?");
mysqli_stmt_bind_param($stmt_del, "i", $id);

if (mysqli_stmt_execute($stmt_del)) {
    mysqli_stmt_close($stmt_del);
    header("Location: index.php?pesan=" . urlencode("Buku '$judul_buku' berhasil dihapus dari sistem."));
    exit;
} else {
    $error = mysqli_error($conn);
    mysqli_stmt_close($stmt_del);
    header("Location: index.php?pesan=" . urlencode("Gagal menghapus buku: $error"));
    exit;
}
?>
```

---

## 4. Keamanan Lanjutan: Konfirmasi JavaScript di Sisi Klien
Di dalam berkas `index.php`:
```html
<a href="hapus.php?id=<?= $buku['id'] ?>" 
   onclick="return confirm('Peringatan: Apakah Anda yakin ingin menghapus buku \'<?= htmlspecialchars(addslashes($buku['judul'])) ?>\' secara permanen?')" 
   style="color: #ef4444; font-weight: bold;">
   Hapus
</a>
```

---

## 5. Tugas Praktikum (RTM-10)
1. Buat berkas `hapus.php` di proyek Anda.
2. Tambahkan 1 data buku percobaan melalui form tambah buku.
3. Klik tombol "Hapus" pada buku percobaan tersebut. Saat muncul dialog konfirmasi browser, klik "Batal" dan pastikan data tidak terhapus.
4. Klik tombol "Hapus" lagi, kali ini klik "OK". Pastikan buku tersebut terhapus dan notifikasi hijau muncul di `index.php`.
