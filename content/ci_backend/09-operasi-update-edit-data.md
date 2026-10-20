# Pertemuan 9 — Operasi UPDATE: Mengambil Data Berdasarkan ID & Memperbarui Record

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 9 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK2:** Mahasiswa mampu mengimplementasikan operasi Update pada basis data MySQL dengan validasi parameter ID (C3)

---

## 1. Problem Statement (PBL)
> *"Jika staf perpustakaan salah mengetik nama pengarang atau ingin menambah stok buku yang baru datang, apakah buku lama harus dihapus lalu dibuat ulang dari awal? Bagaimana skrip PHP mengambil data lama buku tertentu, menampilkannya di dalam form edit, dan memperbaruinya di MySQL tanpa mengubah ID buku?"*

---

## 2. Alur Kerja Operasi UPDATE di PHP
Operasi update memiliki dua tahapan:
1. **Mengambil Data Lama (Pre-fill Form):**
   - Menerima parameter ID lewat URL: `edit.php?id=3`.
   - Menjalankan query `SELECT * FROM buku WHERE id = ?`.
   - Mengisi nilai atribut `value="..."` pada tag `<input>` form dengan data yang ditemukan.
2. **Memproses Perubahan (Submit Form):**
   - Pengguna menekan tombol "Simpan Perubahan" (metode POST).
   - Menjalankan query `UPDATE buku SET ... WHERE id = ?`.
   - Mengalihkan halaman kembali ke `index.php`.

---

## 3. Implementasi Lengkap: `edit.php`
```php
<?php
// edit.php - Mengedit Data Buku Berdasarkan ID
$judul_halaman = "Edit Buku - SIMPUS Mini";
require_once "config/koneksi.php";

// 1. Validasi parameter ID dari URL GET
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    header("Location: index.php?pesan=" . urlencode("ID buku tidak valid!"));
    exit;
}

$error = "";

// 2. Proses pengiriman form UPDATE (Metode POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $kategori_id  = (int)($_POST['kategori_id'] ?? 1);
    $judul        = trim($_POST['judul'] ?? '');
    $pengarang    = trim($_POST['pengarang'] ?? '');
    $penerbit     = trim($_POST['penerbit'] ?? '');
    $tahun_terbit = (int)($_POST['tahun_terbit'] ?? date('Y'));
    $stok         = (int)($_POST['stok'] ?? 0);

    if (empty($judul) || empty($pengarang)) {
        $error = "Judul buku dan nama pengarang tidak boleh kosong!";
    } else {
        $stmt = mysqli_prepare($conn, "UPDATE buku SET kategori_id=?, judul=?, pengarang=?, penerbit=?, tahun_terbit=?, stok=? WHERE id=?");
        mysqli_stmt_bind_param($stmt, "isssiii", $kategori_id, $judul, $pengarang, $penerbit, $tahun_terbit, $stok, $id);

        if (mysqli_stmt_execute($stmt)) {
            mysqli_stmt_close($stmt);
            header("Location: index.php?pesan=" . urlencode("Data buku berhasil diperbarui!"));
            exit;
        } else {
            $error = "Gagal memperbarui data: " . mysqli_error($conn);
        }
    }
}

// 3. Ambil data buku saat ini untuk mengisi nilai awal form
$stmt_get = mysqli_prepare($conn, "SELECT * FROM buku WHERE id = ?");
mysqli_stmt_bind_param($stmt_get, "i", $id);
mysqli_stmt_execute($stmt_get);
$result = mysqli_stmt_get_result($stmt_get);
$buku = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt_get);

if (!$buku) {
    header("Location: index.php?pesan=" . urlencode("Data buku tidak ditemukan di sistem!"));
    exit;
}

// Ambil daftar kategori untuk dropdown
$kategori_res = mysqli_query($conn, "SELECT * FROM kategori ORDER BY nama_kategori ASC");

require_once "templates/header.php";
?>

<div style="max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h2>Edit Data Buku</h2>
    <p style="color: #64748b; margin-bottom: 1.5rem;">Perbarui rincian buku ID #<?= $id ?>.</p>

    <?php if (!empty($error)): ?>
        <div style="padding: 10px; background: #fee2e2; color: #991b1b; border: 1px solid #f87171; border-radius: 6px; margin-bottom: 1rem;">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <form action="edit.php?id=<?= $id ?>" method="POST">
        <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: bold; margin-bottom: 4px;">Kategori Buku:</label>
            <select name="kategori_id" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;" required>
                <?php while ($kat = mysqli_fetch_assoc($kategori_res)): ?>
                    <option value="<?= $kat['id'] ?>" <?= ($kat['id'] == $buku['kategori_id']) ? 'selected' : '' ?>>
                        <?= htmlspecialchars($kat['nama_kategori']) ?>
                    </option>
                <?php endwhile; ?>
            </select>
        </div>

        <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: bold; margin-bottom: 4px;">Judul Buku:</label>
            <input type="text" name="judul" value="<?= htmlspecialchars($buku['judul']) ?>" required style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
        </div>

        <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: bold; margin-bottom: 4px;">Pengarang:</label>
            <input type="text" name="pengarang" value="<?= htmlspecialchars($buku['pengarang']) ?>" required style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
        </div>

        <div style="margin-bottom: 1rem;">
            <label style="display: block; font-weight: bold; margin-bottom: 4px;">Penerbit:</label>
            <input type="text" name="penerbit" value="<?= htmlspecialchars($buku['penerbit']) ?>" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
        </div>

        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="flex: 1;">
                <label style="display: block; font-weight: bold; margin-bottom: 4px;">Tahun Terbit:</label>
                <input type="number" name="tahun_terbit" value="<?= (int)$buku['tahun_terbit'] ?>" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
            </div>
            <div style="flex: 1;">
                <label style="display: block; font-weight: bold; margin-bottom: 4px;">Jumlah Stok:</label>
                <input type="number" name="stok" value="<?= (int)$buku['stok'] ?>" min="0" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;">
            </div>
        </div>

        <div style="display: flex; gap: 10px;">
            <button type="submit" style="background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">Simpan Perubahan</button>
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

## 4. Tugas Praktikum (RTM-9)
1. Terapkan berkas `edit.php` pada folder `simpus-mini`.
2. Klik tombol "Edit" pada salah satu buku di `index.php`.
3. Ubah stok buku dari 5 menjadi 25 dan ganti nama penerbitnya. Simpan perubahan dan verifikasi bahwa data di tabel utama sudah langsung terupdate.
