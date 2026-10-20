# Pertemuan 7 — Form HTML, Metode POST & Operasi CREATE (INSERT Data ke MySQL)

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 7 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu menangani input form HTML menggunakan metode POST dan menyimpan data baru ke database (C3)

---

## 1. Problem Statement (PBL)
> *"Ketika seorang staf perpustakaan membeli buku baru, mereka tidak mungkin membuka phpMyAdmin untuk mengetikkan query SQL manual secara mentah. Bagaimana kita membuat form antarmuka web yang mudah digunakan, menangkap inputnya di PHP, dan menyimpannya secara aman ke tabel MySQL?"*

---

## 2. Alur Kerja Operasi CREATE di PHP
Operasi pembuatan data baru melibatkan dua tahap penting:
1. **Menampilkan Form Input:** Menggunakan tag `<form action="tambah.php" method="POST">`.
2. **Memproses Data Input:** Memeriksa apakah request bertipe POST via `$_SERVER['REQUEST_METHOD'] === 'POST'`.
3. **Mengambil Nilai Input:** Melalui array superglobal `$_POST['nama_field']`.
4. **Menjalankan Query INSERT:** Menyimpan record ke tabel MySQL.
5. **Redirect Header:** Memindahkan browser kembali ke `index.php` untuk menghindari pengiriman ulang form ganda (*Form Resubmission Bug*).

---

## 3. Implementasi Lengkap: `tambah.php`
```php
<?php
// tambah.php - Form Input & Pemrosesan Data Buku Baru
$judul_halaman = "Tambah Buku Baru - SIMPUS Mini";
require_once "config/koneksi.php";

$error = "";

// 1. Cek apakah ada kiriman form metode POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $judul        = trim($_POST['judul'] ?? '');
    $kategori_id  = (int)($_POST['kategori_id'] ?? 1);
    $pengarang    = trim($_POST['pengarang'] ?? '');
    $penerbit     = trim($_POST['penerbit'] ?? '');
    $tahun_terbit = (int)($_POST['tahun_terbit'] ?? date('Y'));
    $stok         = (int)($_POST['stok'] ?? 0);

    // Validasi sederhana: judul dan pengarang tidak boleh kosong
    if (empty($judul) || empty($pengarang)) {
        $error = "Judul buku dan nama pengarang wajib diisi!";
    } else {
        // 2. Siapkan Query INSERT menggunakan Prepared Statement demi keamanan
        $stmt = mysqli_prepare($conn, "INSERT INTO buku (kategori_id, judul, pengarang, penerbit, tahun_terbit, stok) VALUES (?, ?, ?, ?, ?, ?)");
        mysqli_stmt_bind_param($stmt, "isssii", $kategori_id, $judul, $pengarang, $penerbit, $tahun_terbit, $stok);

        if (mysqli_stmt_execute($stmt)) {
            mysqli_stmt_close($stmt);
            // 3. Redirect kembali ke index.php dengan notifikasi
            header("Location: index.php?pesan=" . urlencode("Buku baru berhasil ditambahkan!"));
            exit;
        } else {
            $error = "Gagal menyimpan data buku: " . mysqli_error($conn);
        }
    }
}

// Ambil daftar kategori dari database untuk pilihan dropdown <select>
$kategori_res = mysqli_query($conn, "SELECT * FROM kategori ORDER BY nama_kategori ASC");

require_once "templates/header.php";
?>

<div style="max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h2>Tambah Koleksi Buku Baru</h2>
    <p style="color: #64748b; margin-bottom: 1.5rem;">Isi formulir di bawah ini untuk mendaftarkan buku ke sistem.</p>

    <?php if (!empty($error)): ?>
        <div style="padding: 10px; background: #fee2e2; color: #991b1b; border: 1px solid #f87171; border-radius: 6px; margin-bottom: 1rem;">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <form action="tambah.php" method="POST">
        <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: bold; margin-bottom: 4px;">Kategori Buku:</label>
            <select name="kategori_id" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;" required>
                <?php while ($kat = mysqli_fetch_assoc($kategori_res)): ?>
                    <option value="<?= $kat['id'] ?>"><?= htmlspecialchars($kat['nama_kategori']) ?></option>
                <?php endwhile; ?>
            </select>
        </div>

        <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: bold; margin-bottom: 4px;">Judul Buku:</label>
            <input type="text" name="judul" required placeholder="Contoh: Belajar PHP 8 Native" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
        </div>

        <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: bold; margin-bottom: 4px;">Pengarang:</label>
            <input type="text" name="pengarang" required placeholder="Nama penulis" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
        </div>

        <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: bold; margin-bottom: 4px;">Penerbit:</label>
            <input type="text" name="penerbit" placeholder="Nama penerbit" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
        </div>

        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="flex: 1;">
                <label style="display: block; font-weight: bold; margin-bottom: 4px;">Tahun Terbit:</label>
                <input type="number" name="tahun_terbit" value="<?= date('Y') ?>" min="1900" max="2099" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
            </div>
            <div style="flex: 1;">
                <label style="display: block; font-weight: bold; margin-bottom: 4px;">Jumlah Stok:</label>
                <input type="number" name="stok" value="1" min="0" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
            </div>
        </div>

        <div style="display: flex; gap: 10px;">
            <button type="submit" style="background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">Simpan Buku</button>
            <a href="index.php" style="background: #e2e8f0; color: #334155; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold;">Batal</a>
        </div>
    </form>
</div>

<?php
mysqli_free_result($kategori_res);
require_once "templates/footer.php";
?>
```

---

## 4. Tugas Praktikum (RTM-7)
1. Buat berkas `tambah.php` di proyek `simpus-mini`.
2. Uji coba menambahkan 2 buku baru melalui formulir web di browser.
3. Pastikan setelah tombol "Simpan Buku" ditekan, browser otomatis teralihkan ke `index.php` dan buku baru langsung tampil di urutan teratas.
