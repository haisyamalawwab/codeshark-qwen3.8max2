/* ==========================================================================
   DOKUMEN MATERI MARKDOWN SISTEM APLIKASI WEB - BACKEND DASAR (CODEIGNITER 4)
   16 Pertemuan Lengkap Berbasis OBE & Standar DIKTI
   ========================================================================== */

export interface BackendMdDoc {
  no: number;
  fileName: string;
  title: string;
  source: string;
}

export const CI_BACKEND_MD_DOCS: Record<number, BackendMdDoc> = {
  1: {
    no: 1,
    fileName: "01-pengantar-arsitektur-web-ci4.md",
    title: "Pengantar Arsitektur Web & HTTP Request-Response",
    source: `# Pertemuan 1 — Pengantar Arsitektur Web & HTTP Request-Response

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
\`\`\`
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
\`\`\`

---

## 3. HTTP Methods Dasar: GET vs POST
| Karakteristik | HTTP GET | HTTP POST |
|---|---|---|
| **Tujuan Utama** | Mengambil / membaca data dari server | Mengirimkan data baru untuk diproses server |
| **Lokasi Data** | Di URL (query string: \`/buku?search=php\`) | Di dalam Request Body (tersembunyi dari URL) |
| **Keamanan Data** | Tidak aman untuk password / data sensitif | Lebih aman, wajib untuk form login & create |
| **Idempotency** | Idempotent (diulang tidak mengubah state server) | Non-idempotent (diulang bisa membuat data ganda) |

---

## 4. Gambaran Proyek Akhir (PjBL): SIMPUS-Mini
Pada mata kuliah ini, Anda akan membangun **SIMPUS-Mini (Sistem Informasi Perpustakaan Mini)**:
- **Tabel Utama:** \`kategori\`, \`buku\`, \`users\`, \`peminjaman\`
- **Fitur Wajib:** CRUD Buku & Kategori, Validasi Form, Relasi One-to-Many JOIN, Session Login & Role Admin vs Anggota, serta Live Deployment ke cPanel Web Hosting!`,
  },
  2: {
    no: 2,
    fileName: "02-setup-environment-ci4.md",
    title: "Instalasi Environment XAMPP, Composer & CodeIgniter 4",
    source: `# Pertemuan 2 — Instalasi Environment XAMPP, Composer & CodeIgniter 4

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 2 dari 16)  
> **CPMK2:** Mahasiswa mampu mengonfigurasi environment kerja PHP 8, Composer, dan CodeIgniter 4 (C3)

---

## 1. Piranti Wajib Backend PHP
1. **XAMPP / Laragon:** Paket bundel Apache, MySQL, dan PHP 8.2+.
2. **Composer:** Dependency manager resmi ekosistem PHP.
3. **VS Code:** Editor kode dengan ekstensi *PHP Intelephense*.

---

## 2. Struktur Direktori CodeIgniter 4
\`\`\`
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
\`\`\`

> **Keamanan Web Root:** Folder \`public/\` adalah satu-satunya folder yang diarahkan ke web server. Folder \`app/\` dan berkas \`.env\` berada di luar web root sehingga tidak dapat diunduh langsung oleh pihak asing.

---

## 3. Menjalankan Server Lokal via Spark
Buka Terminal di folder proyek lalu jalankan:
\`\`\`bash
# Salin template env menjadi .env
cp env .env

# Jalankan server lokal CodeIgniter
php spark serve
\`\`\`
Buka browser ke: \`http://localhost:8080\``,
  },
  3: {
    no: 3,
    fileName: "03-routing-controller-view.md",
    title: "Routing Dasar, Controller & Passing Data ke View",
    source: `# Pertemuan 3 — Routing Dasar, Controller & Passing Data ke View

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 3 dari 16)  
> **CPMK1:** Mahasiswa mampu memahami alur MVC dan memetakan URL ke Controller (C3)

---

## 1. Konsep Model-View-Controller (MVC)
- **Model:** Mengelola data dan query ke MySQL.
- **View:** Menyusun tampilan HTML untuk disajikan ke browser.
- **Controller:** Otak penghubung yang menerima input request, memanggil model, dan mengirim data ke view.

---

## 2. Mendefinisikan Rute di app/Config/Routes.php
\`\`\`php
<?php
use CodeIgniter\\Router\\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');
$routes->get('/katalog', 'Buku::index');
$routes->get('/tentang', 'Home::tentang');
\`\`\`

---

## 3. Membuat Controller app/Controllers/Buku.php
\`\`\`php
<?php
namespace App\\Controllers;

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
\`\`\`

---

## 4. Menampilkan Data di app/Views/katalog.php
\`\`\`html
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
\`\`\``,
  },
  4: {
    no: 4,
    fileName: "04-database-mysql-koneksi.md",
    title: "Database MySQL, phpMyAdmin & Koneksi Aplikasi .env",
    source: `# Pertemuan 4 — Database MySQL, phpMyAdmin & Koneksi Aplikasi

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 4 dari 16)  
> **CPMK2:** Mahasiswa mampu merancang tabel MySQL dan menghubungkannya via .env (C3)  
> **ASESMEN FORMATIF 1 (Bobot 20%):** Kuis Konsep DB + Tugas Koneksi MySQL

---

## 1. Konsep RDBMS & Primary Key
- **Primary Key (PK):** Kolom penanda unik setiap baris data (wajib unik, tidak boleh null, biasanya integer auto increment).
- **Tipe Data:** \`INT\`, \`VARCHAR(n)\`, \`TEXT\`, \`DATETIME\`.

---

## 2. Script DDL Database simpus_mini
\`\`\`sql
CREATE DATABASE IF NOT EXISTS \`simpus_mini\`;
USE \`simpus_mini\`;

CREATE TABLE \`kategori\` (
    \`id\` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    \`nama_kategori\` VARCHAR(100) NOT NULL,
    \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE \`buku\` (
    \`id\` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    \`kategori_id\` INT(11) UNSIGNED NULL,
    \`judul\` VARCHAR(255) NOT NULL,
    \`pengarang\` VARCHAR(150) NOT NULL,
    \`penerbit\` VARCHAR(100) NOT NULL,
    \`tahun_terbit\` INT(4) NOT NULL,
    \`stok\` INT(11) NOT NULL DEFAULT 1,
    \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

---

## 3. Konfigurasi Koneksi di Berkas .env
\`\`\`ini
database.default.hostname = localhost
database.default.database = simpus_mini
database.default.username = root
database.default.password = 
database.default.DBDriver = MySQLi
database.default.port = 3306
\`\`\``,
  },
  5: {
    no: 5,
    fileName: "05-crud-create-form.md",
    title: "CRUD - CREATE: Form Input & Simpan Data ke MySQL",
    source: `# Pertemuan 5 — CRUD - CREATE: Form Input & Simpan Data ke MySQL

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 5 dari 16)  
> **CPMK2:** Mahasiswa mampu mengimplementasikan operasi penyimpanan data baru ke MySQL (C3)

---

## 1. Alur Operasi CREATE
1. **GET \`/buku/tambah\`:** Menampilkan form input HTML ke pengguna.
2. **Pengguna Mengisi Form:** Mengisi judul, pengarang, penerbit, tahun, stok.
3. **POST \`/buku/simpan\`:** Mengirimkan data via Request Body bersama CSRF Token.
4. **Controller:** Membaca input dengan \`$this->request->getPost()\`.
5. **Model:** Mengeksekusi query \`INSERT INTO buku (...) VALUES (...)\`.
6. **Redirect:** Mengalihkan browser kembali ke daftar katalog dengan pesan sukses.

---

## 2. Model CodeIgniter 4: app/Models/BukuModel.php
\`\`\`php
<?php
namespace App\\Models;
use CodeIgniter\\Model;

class BukuModel extends Model
{
    protected $table         = 'buku';
    protected $primaryKey    = 'id';
    protected $allowedFields = ['kategori_id', 'judul', 'pengarang', 'penerbit', 'tahun_terbit', 'stok'];
    protected $useTimestamps = true;
}
\`\`\`

---

## 3. Keamanan CSRF Token di Form
\`\`\`html
<form action="/buku/simpan" method="post">
    <?= csrf_field() ?>
    <input type="text" name="judul" required placeholder="Judul Buku">
    <button type="submit">Simpan</button>
</form>
\`\`\``,
  },
  6: {
    no: 6,
    fileName: "06-crud-read-tabel.md",
    title: "CRUD - READ: Menampilkan List Data & Halaman Detail",
    source: `# Pertemuan 6 — CRUD - READ: Menampilkan List Data & Halaman Detail

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 6 dari 16)  
> **CPMK2:** Mahasiswa mampu mengambil data dari MySQL dan menampilkannya di View (C3)

---

## 1. Perbedaan Read List vs Read Detail
- **List (\`findAll()\`):** Menampilkan banyak data dalam bentuk tabel katalog. Setara \`SELECT * FROM buku\`.
- **Detail (\`find($id)\`):** Menampilkan informasi lengkap satu buku berdasarkan Primary Key ID. Setara \`SELECT * FROM buku WHERE id = 1 LIMIT 1\`.

---

## 2. Controller Buku::detail($id)
\`\`\`php
public function detail($id)
{
    $buku = $this->bukuModel->find($id);

    if (empty($buku)) {
        throw new \\CodeIgniter\\Exceptions\\PageNotFoundException('Buku #' . $id . ' tidak ditemukan.');
    }

    $data = [
        'buku' => $buku
    ];

    return view('buku/detail', $data);
}
\`\`\`

---

## 3. Rute Dinamis dengan Placeholder (:num)
\`\`\`php
$routes->get('/buku', 'Buku::index');
$routes->get('/buku/detail/(:num)', 'Buku::detail/$1');
\`\`\``,
  },
  7: {
    no: 7,
    fileName: "07-crud-update-delete.md",
    title: "CRUD - UPDATE & DELETE: Mengubah & Menghapus Data",
    source: `# Pertemuan 7 — CRUD - UPDATE & DELETE: Mengubah & Menghapus Data

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 7 dari 16)  
> **CPMK2:** Mahasiswa mampu memperbarui dan menghapus baris data di MySQL (C3)

---

## 1. Operasi UPDATE (2 Langkah)
1. **GET \`/buku/edit/3\`:** Mengambil data buku ID=3 dari database dan menampilkannya di form sebagai nilai awal (\`value="<?= esc($buku['judul']) ?>"\`).
2. **POST \`/buku/perbarui/3\`:** Mengambil input baru dan mengeksekusi \`$model->update(3, $dataBaru)\`.

---

## 2. Operasi DELETE & Konfirmasi JavaScript
\`\`\`php
public function hapus($id)
{
    $this->bukuModel->delete($id);
    return redirect()->to('/buku')->with('pesan', 'Buku berhasil dihapus dari database.');
}
\`\`\`
Tombol di View:
\`\`\`html
<a href="/buku/hapus/<?= $b['id'] ?>" onclick="return confirm('Yakin ingin menghapus buku ini?')">Hapus</a>
\`\`\``,
  },
  8: {
    no: 8,
    fileName: "08-uts-proyek-crud.md",
    title: "UJIAN TENGAH SEMESTER (UTS): Praktik CRUD Mandiri",
    source: `# Pertemuan 8 — UJIAN TENGAH SEMESTER (UTS)

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Bobot:** 25% (Asesmen Sumatif 1)  
> **Format:** Praktik Langsung / Live Coding 150 Menit (Individu)  
> **CPMK2 & CPMK5:** Mampu membangun aplikasi CRUD sederhana secara mandiri (C3)

---

## 1. Lembar Tugas UTS
Bangunlah aplikasi CRUD sederhana untuk studi kasus baru: **Sistem Inventaris Barang Toko**:
1. Buat database \`db_inventaris\` dan tabel \`barang\` (id, kode_barang, nama_barang, kategori, harga, stok).
2. Konfigurasikan koneksi di file \`.env\`.
3. Buat fitur CRUD lengkap: Tambah Barang (Create), Tampil Daftar & Detail (Read), Edit Barang (Update), Hapus Barang (Delete).
4. Struktur kode rapi mengikuti arsitektur MVC CodeIgniter 4.

---

## 2. Rubrik Penilaian UTS (Bobot 25%)
- **Create:** Berfungsi + validasi dasar (25%)
- **Read:** Tabel list dan detail tampil rapi (25%)
- **Update:** Mengubah data di MySQL secara tepat (25%)
- **Delete:** Menghapus data dengan konfirmasi (25%)`,
  },
  9: {
    no: 9,
    fileName: "09-validasi-form-flash-data.md",
    title: "Validasi Form Input & Flash Messages di CodeIgniter 4",
    source: `# Pertemuan 9 — Validasi Form Input & Flash Messages

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 9 dari 16)  
> **CPMK2:** Mahasiswa mampu menerapkan validasi data dan flash message sukses/error (C3)

---

## 1. Aturan Validasi Sisi Server
\`\`\`php
$rules = [
    'judul'        => 'required|min_length[3]|max_length[255]',
    'pengarang'    => 'required|min_length[3]',
    'tahun_terbit' => 'required|numeric|exact_length[4]',
    'stok'         => 'required|numeric|greater_than_equal_to[1]',
];

if (! $this->validate($rules)) {
    return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
}
\`\`\`

---

## 2. Menjaga Isian Form dengan old()
\`\`\`html
<input type="text" name="judul" value="<?= old('judul') ?>">
\`\`\`

---

## 3. Notifikasi Flashdata Session
\`\`\`php
// Set pesan sukses
return redirect()->to('/buku')->with('pesan', 'Buku baru berhasil ditambahkan!');

// Di view
<?php if (session()->getFlashdata('pesan')): ?>
    <div class="alert alert-success"><?= session()->getFlashdata('pesan') ?></div>
<?php endif; ?>
\`\`\``,
  },
  10: {
    no: 10,
    fileName: "10-relasi-tabel-join-mysql.md",
    title: "Relasi Antar Tabel MySQL & Query JOIN Dasar",
    source: `# Pertemuan 10 — Relasi Antar Tabel MySQL & Query JOIN Dasar

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 10 dari 16)  
> **CPMK2:** Mahasiswa mampu merancang relasi One-to-Many dan query JOIN (C3)

---

## 1. Relasi One-to-Many (1:N)
- Satu Kategori memiliki Banyak Buku.
- Kolom \`kategori_id\` di tabel \`buku\` adalah **Foreign Key** yang merujuk ke kolom \`id\` di tabel \`kategori\`.

---

## 2. Query SQL JOIN di BukuModel.php
\`\`\`php
public function getBukuDenganKategori()
{
    return $this->select('buku.*, kategori.nama_kategori')
                ->join('kategori', 'kategori.id = buku.kategori_id', 'left')
                ->orderBy('buku.id', 'DESC')
                ->findAll();
}
\`\`\`

---

## 3. Dropdown Kategori di Form Tambah Buku
\`\`\`html
<select name="kategori_id" required>
    <option value="">-- Pilih Kategori --</option>
    <?php foreach ($daftarKategori as $k): ?>
        <option value="<?= $k['id'] ?>"><?= esc($k['nama_kategori']) ?></option>
    <?php endforeach; ?>
</select>
\`\`\``,
  },
  11: {
    no: 11,
    fileName: "11-autentikasi-session-login.md",
    title: "Autentikasi Sederhana: Session-Based Login & Register",
    source: `# Pertemuan 11 — Autentikasi Sederhana: Session-Based Login & Register

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 11 dari 16)  
> **CPMK3:** Mahasiswa mampu mengimplementasikan register dengan hashing dan session login (C3)

---

## 1. Hashing Password Wajib (bcrypt)
\`\`\`php
// Saat Register
$hashPassword = password_hash($passwordPolos, PASSWORD_DEFAULT);

// Saat Login
if (password_verify($passwordInput, $user['password'])) {
    // Password cocok! Set session
    session()->set([
        'logged_in' => true,
        'user_id'   => $user['id'],
        'nama'      => $user['nama'],
        'role'      => $user['role'],
    ]);
}
\`\`\`

---

## 2. Logout Menghapus Session
\`\`\`php
public function logout()
{
    session()->destroy();
    return redirect()->to('/login')->with('pesan', 'Anda berhasil logout.');
}
\`\`\``,
  },
  12: {
    no: 12,
    fileName: "12-otorisasi-role-admin-user.md",
    title: "Otorisasi Dasar: Role Admin vs User & Filter Proteksi",
    source: `# Pertemuan 12 — Otorisasi Dasar: Role Admin vs User & Filter Proteksi

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 12 dari 16)  
> **CPMK3:** Mahasiswa mampu membatasi hak akses dengan Filter CodeIgniter 4 (C3)  
> **ASESMEN FORMATIF 2 (Bobot 20%):** Progress Proyek (Login + Role) + Presentasi

---

## 1. Membuat Filter: app/Filters/AuthFilter.php
\`\`\`php
public function before(RequestInterface $request, $arguments = null)
{
    if (! session()->get('logged_in')) {
        return redirect()->to('/login')->with('error', 'Silakan login terlebih dahulu.');
    }

    if ($arguments && in_array('admin', $arguments)) {
        if (session()->get('role') !== 'admin') {
            return redirect()->to('/buku')->with('error', 'Akses Ditolak: Hanya Admin!');
        }
    }
}
\`\`\`

---

## 2. Memasang Filter pada Routes
\`\`\`php
$routes->group('buku', ['filter' => 'auth:admin'], function($routes) {
    $routes->get('tambah', 'Buku::tambah');
    $routes->post('simpan', 'Buku::simpan');
    $routes->get('edit/(:num)', 'Buku::edit/$1');
    $routes->get('hapus/(:num)', 'Buku::hapus/$1');
});
\`\`\``,
  },
  13: {
    no: 13,
    fileName: "13-web-hosting-cpanel-dasar.md",
    title: "Pengenalan Web Hosting, Domain & cPanel Dasar",
    source: `# Pertemuan 13 — Pengenalan Web Hosting, Domain & cPanel Dasar

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Hosting & Deploy (Pertemuan 13 dari 16)  
> **CPMK4:** Mahasiswa mampu menjelaskan konsep web hosting dan mengoperasikan cPanel (C2)

---

## 1. Localhost vs Shared Hosting
- **Localhost:** Hanya hidup di komputer lokal, tidak bisa diakses orang lain.
- **Shared Hosting:** Server menyala 24 jam di data center, memiliki IP publik dan nama domain.

---

## 2. Fitur Kunci cPanel untuk Backend
1. **File Manager:** Mengelola berkas server di \`/home/user/public_html/\`.
2. **MySQL Database Wizard:** Membuat nama database, user database, dan mengatur hak akses \`ALL PRIVILEGES\`.
3. **phpMyAdmin Hosting:** Mengimpor data backup database \`.sql\` dari localhost.`,
  },
  14: {
    no: 14,
    fileName: "14-deployment-hosting-mysql.md",
    title: "Praktik Deployment: Upload File, Import Database & Konfigurasi Server",
    source: `# Pertemuan 14 — Praktik Deployment ke Web Hosting cPanel

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Hosting & Deploy (Pertemuan 14 dari 16)  
> **CPMK4:** Mahasiswa mampu melakukan deployment aplikasi & database ke hosting (C3)

---

## 1. Langkah Deployment Bertahap
1. **Export Database:** Buka phpMyAdmin lokal -> Export \`simpus_mini.sql\`.
2. **Import Database:** Buka phpMyAdmin cPanel -> Import file \`simpus_mini.sql\`.
3. **Upload File:** Kompres proyek ke format ZIP -> Upload dan ekstrak di cPanel.
4. **Konfigurasi .env Server:**
\`\`\`ini
CI_ENVIRONMENT = production
app.baseURL = 'https://simpus-mini.mhs.latihan.my.id/'

database.default.hostname = localhost
database.default.database = u1234_simpus
database.default.username = u1234_admin
database.default.password = PasswordKuat2024!
\`\`\`
5. **Uji Coba Live URL:** Akses website di browser HP atau perangkat teman.`,
  },
  15: {
    no: 15,
    fileName: "15-debugging-dokumentasi.md",
    title: "Finalisasi Proyek, Live Debugging & Dokumentasi Sederhana",
    source: `# Pertemuan 15 — Finalisasi Proyek, Live Debugging & Dokumentasi

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Hosting & Deploy (Pertemuan 15 dari 16)  
> **CPMK4 & CPMK5:** Mahasiswa mampu menyelesaikan debugging server dan menyusun README (C3/C4)

---

## 1. Diagnosis Error Umum Hosting
- **HTTP 500 Error:** Periksa izin tulis (permission) folder \`writable/\` (set 755/777) dan cek error log.
- **Database Connection Failed:** Periksa prefix nama database dan password di \`.env\` server.
- **404 Route Not Found:** Pastikan berkas \`.htaccess\` ikut terunggah di folder web root.

---

## 2. Struktur Dokumentasi README.md
1. Judul Aplikasi & Deskripsi Singkat.
2. Link Live URL Hosting Aktif.
3. Tabel Akun Demo (Admin & Anggota).
4. Daftar Fitur Utama & Petunjuk Penggunaan.`,
  },
  16: {
    no: 16,
    fileName: "16-uas-demo-aplikasi-live.md",
    title: "UJIAN AKHIR SEMESTER (UAS): Demo Aplikasi Live di Hosting",
    source: `# Pertemuan 16 — UJIAN AKHIR SEMESTER (UAS)

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Bobot:** 35% (Asesmen Sumatif 2)  
> **Format:** Presentasi + Demo Aplikasi LIVE di Web Hosting + Tanya Jawab Lisan  
> **CPMK4 & CPMK5:** Mahasiswa mampu mendemonstrasikan aplikasi live hasil deploy (C4)

---

## 1. Komponen Penilaian UAS (Bobot 35%)
1. **Keberhasilan Akses Live di Hosting (25%):** Aplikasi terbuka lancar via domain publik.
2. **Kelengkapan Fitur Wajib (35%):** CRUD, Relasi JOIN, Validasi, Session Auth, dan Role Admin.
3. **Penguasaan Konsep & Tanya Jawab (25%):** Mampu menjelaskan logika kode dan query database.
4. **Kualitas Dokumentasi & Laporan (15%):** Laporan akhir rapi disertai akun demo pengujian.

---

## 2. Target Capaian Kelulusan
Mahasiswa dinyatakan LULUS mata kuliah ini jika berhasil membuktikan kompetensi membangun aplikasi backend dari rancangan database MySQL hingga terpasang online di web hosting!`,
  },
};

export function getCiBackendMdDoc(meetingNo: number): BackendMdDoc | undefined {
  return CI_BACKEND_MD_DOCS[meetingNo];
}
