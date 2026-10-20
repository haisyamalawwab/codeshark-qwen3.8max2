# Pertemuan 3 — Dasar Sintaks PHP 8: Variabel, Array Associative, & Struktur Kontrol

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 3 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK1:** Mahasiswa mampu mengimplementasikan sintaks PHP, tipe data array associative, dan perulangan untuk merender data dinamis (C3)

---

## 1. Problem Statement (PBL)
> *"Bayangkan kamu memiliki 10 halaman website berbeda: Beranda, Katalog, Kontak, Tentang Kami, dsb. Jika navigasi navbar atau footer di bagian bawah berubah nomor teleponnya, apakah kita harus mengedit 10 file tersebut satu per satu? Bagaimana PHP memecahkan masalah ini dengan konsep modularisasi (`include` / `require`)?"*

---

## 2. Sintaks Dasar PHP 8
Setiap kode PHP harus diawali dengan tag pembuka `<?php` dan (opsional) ditutup dengan `?>`.
- **Variabel:** Selalu diawali tanda dollar `$`, peka huruf besar-kecil (*case-sensitive*), tidak perlu deklarasi tipe secara eksplisit.
- **Penggabungan String (Concatenation):** Menggunakan tanda titik `.`, contoh: `$salam = "Halo, " . $nama;`.
- **Sintaks Singkat Echo:** `<?= $variabel ?>` setara dengan `<?php echo $variabel; ?>`.

---

## 3. Array Numerik & Array Associative
PHP menyediakan array fleksibel yang menjadi pondasi penampung data database:

### Array Associative (Key-Value)
```php
<?php
$buku = [
    "id"           => 1,
    "judul"        => "Pemrograman PHP 8 & MySQL",
    "pengarang"    => "Ahmad Fauzi",
    "tahun_terbit" => 2024,
    "stok"         => 8
];

echo $buku["judul"]; // Output: Pemrograman PHP 8 & MySQL
?>
```

### Array of Arrays (Simulasi Data Multi Baris)
```php
<?php
$daftar_buku = [
    ["id" => 1, "judul" => "Algoritma Pemrograman", "stok" => 5],
    ["id" => 2, "judul" => "Dasar Database Relasional", "stok" => 12],
    ["id" => 3, "judul" => "Pemrograman Web Modern", "stok" => 0]
];
?>
```

---

## 4. Modularisasi Halaman dengan `require_once`
Untuk menghindari duplikasi kode HTML di setiap halaman, kita pecah antarmuka menjadi komponen modular:

### 1. `templates/header.php`
```php
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title><?= $judul_halaman ?? "SIMPUS-Mini" ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header>
        <h2>SIMPUS-Mini Kampus</h2>
        <nav>
            <a href="index.php">Daftar Buku</a> |
            <a href="tambah.php">Tambah Buku</a> |
            <a href="login.php">Login Admin</a>
        </nav>
    </header>
    <main>
```

### 2. `templates/footer.php`
```php
    </main>
    <footer>
        <hr>
        <p>&copy; <?= date('Y') ?> SIMPUS-Mini. Dibuat dengan PHP Native & MySQL.</p>
    </footer>
</body>
</html>
```

### 3. Menggabungkan di `index.php`
```php
<?php
$judul_halaman = "Katalog Koleksi Buku";
require_once "templates/header.php";

$daftar_buku = [
    ["id" => 1, "judul" => "Pemrograman PHP 8 & MySQL", "pengarang" => "Budi Santoso", "stok" => 10],
    ["id" => 2, "judul" => "Mastering Database Query", "pengarang" => "Siti Aminah", "stok" => 4],
    ["id" => 3, "judul" => "Arsitektur Web Modern", "pengarang" => "Rian Pratama", "stok" => 0]
];
?>

<h2>Katalog Koleksi Buku</h2>
<table border="1" cellpadding="8" cellspacing="0">
    <thead>
        <tr>
            <th>No</th>
            <th>Judul Buku</th>
            <th>Pengarang</th>
            <th>Status Stok</th>
        </tr>
    </thead>
    <tbody>
        <?php $no = 1; foreach ($daftar_buku as $item): ?>
        <tr>
            <td><?= $no++ ?></td>
            <td><?= htmlspecialchars($item['judul']) ?></td>
            <td><?= htmlspecialchars($item['pengarang']) ?></td>
            <td>
                <?php if ($item['stok'] > 0): ?>
                    <span style="color: green; font-weight: bold;">Tersedia (<?= $item['stok'] ?>)</span>
                <?php else: ?>
                    <span style="color: red; font-style: italic;">Habis</span>
                <?php endif; ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<?php
require_once "templates/footer.php";
?>
```

---

## 5. Tugas Praktikum (RTM-3)
1. Buat struktur folder `templates/` di dalam project `simpus-mini`.
2. Pisahkan `header.php` dan `footer.php`.
3. Tampilkan minimal 5 data buku dummy di `index.php` menggunakan perulangan `foreach` dan logika `if/else` untuk warna status stok buku.
