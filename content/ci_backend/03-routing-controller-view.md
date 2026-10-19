# Pertemuan 3 — Routing Dasar, Controller & Passing Data ke View

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 3 dari 16)  
> **CPMK1:** Mahasiswa mampu memahami alur MVC dan memetakan URL ke Controller (C3)

---

## 1. Konsep Model-View-Controller (MVC)
- **Model:** Mengelola data dan query ke MySQL.
- **View:** Menyusun tampilan HTML untuk disajikan ke browser.
- **Controller:** Otak penghubung yang menerima input request, memanggil model, dan mengirim data ke view.

---

## 2. Mendefinisikan Rute di app/Config/Routes.php
```php
<?php
use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');
$routes->get('/katalog', 'Buku::index');
$routes->get('/tentang', 'Home::tentang');
```

---

## 3. Membuat Controller app/Controllers/Buku.php
```php
<?php
namespace App\Controllers;

class Buku extends BaseController
{
    public function index()
    {
        $data = [
            'judulHalaman' => 'Katalog Buku Perpustakaan',
            'tahun'        => date('Y'),
            'daftarBuku'   => [
                ['judul' => 'Pemrograman PHP Dasar', 'pengarang' => 'Budi Santoso', 'stok' => 10],
                ['judul' => 'Mastering MySQL Database', 'pengarang' => 'Ahmad Fauzi', 'stok' => 5],
            ]
        ];

        return view('katalog', $data);
    }
}
```

---

## 4. Menampilkan Data di app/Views/katalog.php
```html
<h1><?= esc($judulHalaman) ?></h1>
<p>Tahun: <?= esc($tahun) ?></p>

<table>
    <?php foreach ($daftarBuku as $b): ?>
    <tr>
        <td><?= esc($b['judul']) ?></td>
        <td><?= esc($b['pengarang']) ?></td>
        <td><?= $b['stok'] ?></td>
    </tr>
    <?php endforeach; ?>
</table>
```
