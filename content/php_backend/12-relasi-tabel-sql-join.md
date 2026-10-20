# Pertemuan 12 — Relasi Tabel One-to-Many (1:N) & Query SQL JOIN di PHP

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 12 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu mengimplementasikan relasi antar tabel (1:N) dan menggabungkan data menggunakan INNER JOIN / LEFT JOIN (C3)

---

## 1. Problem Statement (PBL)
> *"Di tabel `buku`, kita hanya menyimpan angka `kategori_id` seperti angka 1, 2, atau 3. Bagaimana cara menampilkan nama asli kategorinya (misal: 'Teknologi Informasi') di tabel katalog tanpa harus melakukan query berulang kali (N+1 query problem)?"*

---

## 2. Konsep Relasi Database One-to-Many (1:N)
Satu kategori dapat memiliki **banyak** buku (*One-to-Many*), namun satu buku hanya terdaftar dalam **satu** kategori induk.
- **Tabel Induk (Parent):** `kategori` (`id` sebagai Primary Key).
- **Tabel Anak (Child):** `buku` (`kategori_id` sebagai Foreign Key).

### Jenis-Jenis SQL JOIN
1. **`INNER JOIN`:** Hanya mengembalikan baris jika ada kecocokan di kedua tabel.
2. **`LEFT JOIN`:** Mengembalikan **semua** baris dari tabel kiri (`buku`), meskipun belum ada relasi kategori yang cocok di tabel kanan (menghasilkan nilai `NULL` tanpa menghilangkan buku dari katalog).

---

## 3. Query JOIN di PHP
```sql
SELECT 
    b.id,
    b.judul,
    b.pengarang,
    b.penerbit,
    b.tahun_terbit,
    b.stok,
    k.nama_kategori,
    k.keterangan AS kategori_keterangan
FROM buku b
LEFT JOIN kategori k ON b.kategori_id = k.id
ORDER BY b.id DESC;
```

---

## 4. Modul Manajemen Kategori: `kategori.php`
Agar kategori bisa dikelola secara dinamis oleh pengguna, buat berkas `kategori.php`:
```php
<?php
// kategori.php - Manajemen Kategori Buku
$judul_halaman = "Kelola Kategori - SIMPUS Mini";
require_once "config/koneksi.php";
require_once "config/helpers.php";

$pesan = "";

// Tambah Kategori Baru via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama = clean_input($_POST['nama_kategori'] ?? '');
    $ket  = clean_input($_POST['keterangan'] ?? '');

    if (!empty($nama)) {
        $stmt = mysqli_prepare($conn, "INSERT INTO kategori (nama_kategori, keterangan) VALUES (?, ?)");
        mysqli_stmt_bind_param($stmt, "ss", $nama, $ket);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
        $pesan = "Kategori '$nama' berhasil ditambahkan!";
    }
}

// Ambil Kategori beserta jumlah buku yang ada di dalamnya
$sql = "SELECT k.*, COUNT(b.id) AS total_buku 
        FROM kategori k 
        LEFT JOIN buku b ON k.id = b.kategori_id 
        GROUP BY k.id 
        ORDER BY k.nama_kategori ASC";
$kategori_list = mysqli_query($conn, $sql);

require_once "templates/header.php";
?>

<h2>Manajemen Kategori Buku</h2>

<?php if (!empty($pesan)): ?>
    <div style="padding: 10px; background: #dcfce7; color: #166534; border-radius: 6px; margin-bottom: 1rem;">
        <?= esc($pesan) ?>
    </div>
<?php endif; ?>

<div style="display: flex; gap: 2rem; flex-wrap: wrap;">
    <!-- Form Tambah Kategori -->
    <div style="flex: 1; min-width: 280px; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h3>+ Tambah Kategori</h3>
        <form action="kategori.php" method="POST">
            <div style="margin-bottom: 1rem;">
                <label style="display: block; font-weight: bold; margin-bottom: 4px;">Nama Kategori:</label>
                <input type="text" name="nama_kategori" required placeholder="Contoh: Kedokteran & Kesehatan" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; font-weight: bold; margin-bottom: 4px;">Keterangan:</label>
                <textarea name="keterangan" rows="3" placeholder="Deskripsi singkat kategori..." style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;"></textarea>
            </div>
            <button type="submit" style="background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">Simpan Kategori</button>
        </form>
    </div>

    <!-- Tabel Daftar Kategori -->
    <div style="flex: 2; min-width: 350px;">
        <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; background: white;">
            <thead>
                <tr style="background: #f1f5f9;">
                    <th>ID</th>
                    <th>Nama Kategori</th>
                    <th>Keterangan</th>
                    <th>Jumlah Buku Terdaftar</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($kat = mysqli_fetch_assoc($kategori_list)): ?>
                <tr>
                    <td><?= $kat['id'] ?></td>
                    <td><strong><?= esc($kat['nama_kategori']) ?></strong></td>
                    <td><?= esc($kat['keterangan'] ?? '-') ?></td>
                    <td style="text-align: center;">
                        <span style="background: #f1f5f9; padding: 3px 8px; border-radius: 12px; font-weight: bold;">
                            <?= $kat['total_buku'] ?> buku
                        </span>
                    </td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
</div>

<?php
mysqli_free_result($kategori_list);
require_once "templates/footer.php";
?>
```

---

## 5. Tugas Praktikum (RTM-12)
1. Buat file `kategori.php` dan tambahkan menu navigasi "Kategori" di `templates/header.php`.
2. Tambahkan kategori baru, misalnya "Ilmu Sosial & Politik".
3. Buka `tambah.php` dan pastikan kategori baru tersebut langsung muncul di opsi dropdown pilihan kategori buku.
