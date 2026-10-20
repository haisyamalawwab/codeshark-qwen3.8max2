# Pertemuan 6 — Operasi READ: Mengambil Data MySQL & Merender ke Tabel HTML Dinamis

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 6 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu mengeksekusi query SELECT dan menampilkan data ke antarmuka web (C3)

---

## 1. Problem Statement (PBL)
> *"Di pertemuan 3 kita menampilkan data buku dari array statis di file PHP. Setiap ada buku baru, kita harus mengedit kode sumber PHP. Bagaimana cara mengganti array statis tersebut dengan query langsung ke tabel `buku` di MySQL sehingga saat database bertambah, tampilan web otomatis diperbarui secara realtime?"*

---

## 2. Alur Kerja Operasi READ di PHP
1. **Sertakan file koneksi:** `require_once 'config/koneksi.php';`
2. **Siapkan teks Query SQL:** `$query = "SELECT * FROM buku ORDER BY id DESC";`
3. **Eksekusi Query:** `$result = mysqli_query($conn, $query);`
4. **Iterasi Data (Looping):** Menggunakan `while ($row = mysqli_fetch_assoc($result))` untuk mengonversi setiap baris data menjadi array associative.
5. **Render ke HTML:** Menggunakan `htmlspecialchars()` untuk melindungi dari celah XSS.
6. **Bebaskan Memori:** `mysqli_free_result($result);`

---

## 3. Implementasi Lengkap: `index.php`
```php
<?php
// index.php - Halaman Utama Daftar Buku SIMPUS-Mini
$judul_halaman = "Daftar Koleksi Buku - SIMPUS Mini";
require_once "config/koneksi.php";
require_once "templates/header.php";

// 1. Eksekusi Query SELECT
$sql = "SELECT b.*, k.nama_kategori 
        FROM buku b 
        LEFT JOIN kategori k ON b.kategori_id = k.id 
        ORDER BY b.id DESC";
$result = mysqli_query($conn, $sql);

// Menghitung total data
$total_buku = mysqli_num_rows($result);
?>

<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
    <h2>Koleksi Buku Perpustakaan (<?= $total_buku ?> Judul)</h2>
    <a href="tambah.php" style="background: #0284c7; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold;">+ Tambah Buku Baru</a>
</div>

<?php if (isset($_GET['pesan'])): ?>
    <div style="padding: 10px; background: #dcfce7; color: #166534; border: 1px solid #86efac; border-radius: 6px; margin-bottom: 1rem;">
        <?= htmlspecialchars($_GET['pesan']) ?>
    </div>
<?php endif; ?>

<table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse; background: white;">
    <thead>
        <tr style="background: #f1f5f9; text-align: left;">
            <th>No</th>
            <th>Judul Buku</th>
            <th>Kategori</th>
            <th>Pengarang</th>
            <th>Penerbit</th>
            <th>Tahun</th>
            <th>Stok</th>
            <th>Aksi</th>
        </tr>
    </thead>
    <tbody>
        <?php if ($total_buku > 0): ?>
            <?php $no = 1; while ($buku = mysqli_fetch_assoc($result)): ?>
            <tr>
                <td><?= $no++ ?></td>
                <td><strong><?= htmlspecialchars($buku['judul']) ?></strong></td>
                <td><span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 0.85em;"><?= htmlspecialchars($buku['nama_kategori'] ?? 'Umum') ?></span></td>
                <td><?= htmlspecialchars($buku['pengarang']) ?></td>
                <td><?= htmlspecialchars($buku['penerbit']) ?></td>
                <td><?= (int)$buku['tahun_terbit'] ?></td>
                <td>
                    <?php if ($buku['stok'] > 0): ?>
                        <span style="color: green; font-weight: bold;"><?= $buku['stok'] ?> eks</span>
                    <?php else: ?>
                        <span style="color: red; font-style: italic;">Kosong</span>
                    <?php endif; ?>
                </td>
                <td>
                    <a href="edit.php?id=<?= $buku['id'] ?>" style="color: #0284c7; text-decoration: none;">Edit</a> |
                    <a href="hapus.php?id=<?= $buku['id'] ?>" onclick="return confirm('Apakah Anda yakin ingin menghapus buku ini?')" style="color: #ef4444; text-decoration: none;">Hapus</a>
                </td>
            </tr>
            <?php endwhile; ?>
        <?php else: ?>
            <tr>
                <td colspan="8" style="text-align: center; color: #64748b; padding: 20px;">
                    Belum ada data buku yang tersimpan. Silakan klik tombol Tambah Buku Baru di atas.
                </td>
            </tr>
        <?php endif; ?>
    </tbody>
</table>

<?php
// Bebaskan hasil memori query
mysqli_free_result($result);
require_once "templates/footer.php";
?>
```

---

## 4. Tugas Praktikum (RTM-6)
1. Terapkan kode `index.php` di atas di folder proyek `simpus-mini`.
2. Pastikan data yang tampil persis sesuai dengan data yang Anda inputkan di phpMyAdmin pada Pertemuan 4.
3. Tambahkan 1 baris data baru langsung di phpMyAdmin, kemudian refresh halaman `index.php` di browser. Amati bagaimana data langsung sinkron secara otomatis.
