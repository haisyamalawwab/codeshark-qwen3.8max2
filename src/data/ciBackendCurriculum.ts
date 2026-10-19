/* ==========================================================================
   KURIKULUM SISTEM APLIKASI WEB - BACKEND DASAR (CODEIGNITER 4 & PHP)
   3 SKS (1 Teori + 2 Praktikum) | Semester 3 (SI/TI) & 5 (TI) | Level Pemula
   Fokus Utama: Database MySQL, MVC Architecture & Web Hosting cPanel
   Standard DIKTI / BAN-PT berbasis Outcome Based Education (OBE)
   ========================================================================== */

export interface BackendMeeting {
  no: number;
  phase: "Fase 1: Setup & Dasar" | "Fase 2: MySQL & CRUD" | "UTS" | "Fase 3: Fitur Menengah" | "Fase 4: Hosting & Deploy" | "UAS";
  title: string;
  sks: string;
  cpmk: string;
  subCpmk: string;
  indikator: string[];
  problemStatement: string;
  goal: string;
  outputPraktikum: string;
  projectMilestone: string;
  tools: string[];
  alokasiWaktu: string;
  teori: {
    title: string;
    points: string[];
    explanation: string;
  }[];
  steps: {
    step: number;
    title: string;
    command?: string;
    desc: string;
    codeSnippet?: string;
    filePath?: string;
  }[];
  files: {
    name: string;
    lang: "php" | "sql" | "bash" | "env";
    code: string;
    description: string;
  }[];
  simId: string;
  quiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
  tugas: {
    title: string;
    description: string;
    rubrik: { criteria: string; bobot: string }[];
  };
  asesmenTerkait?: {
    nama: string;
    bobot: string;
    tipe: "formatif" | "sumatif";
  };
}

export const CI_CPMK_LIST = [
  { id: "CPMK1", desc: "Mampu menjelaskan konsep dasar arsitektur web client-server dan cara kerja backend (C2)" },
  { id: "CPMK2", desc: "Mampu merancang & mengimplementasikan basis data MySQL serta operasi CRUD dengan MVC CodeIgniter 4 (C3)" },
  { id: "CPMK3", desc: "Mampu mengimplementasikan autentikasi session-based login/register dan otorisasi role admin-user (C3)" },
  { id: "CPMK4", desc: "Mampu men-deploy aplikasi web dan database MySQL ke layanan shared hosting cPanel serta menyusun dokumentasi (C3)" },
  { id: "CPMK5", desc: "Mampu menyelesaikan proyek aplikasi backend sederhana secara mandiri/tim sesuai standar dasar industri (C4)" },
];

export const CI_BACKEND_MEETINGS: BackendMeeting[] = [
  {
    no: 1,
    phase: "Fase 1: Setup & Dasar",
    title: "Pengantar Arsitektur Web & Backend",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK1: Menjelaskan konsep dasar arsitektur aplikasi web (C2)",
    subCpmk: "Mahasiswa mampu menjelaskan konsep arsitektur client-server dan siklus HTTP request-response pada aplikasi web.",
    indikator: [
      "Dapat menggambarkan bagan alur HTTP request-response antara browser dan server",
      "Dapat membedakan peran frontend (tampilan/browser) dan backend (logika/database)",
      "Memahami HTTP method dasar (GET untuk membaca, POST untuk mengirim data)",
    ],
    problemStatement: "Saat kamu membuka marketplace online di HP dan menekan tombol 'Beli', siapa yang sebenarnya memproses pesanan dan memotong stok barang di balik layar?",
    goal: "Memahami konsep client-server, perbedaan frontend vs backend, cara browser berkomunikasi dengan web server, dan project brief PjBL SIMPUS-Mini.",
    outputPraktikum: "Diagram alur request-response dan rancangan ide proyek PjBL SIMPUS-Mini",
    projectMilestone: "Pembentukan tim & pemilihan tema proyek aplikasi backend CRUD (SIMPUS-Mini)",
    tools: ["Browser Chrome/Firefox", "Diagram Arsitektur", "VS Code"],
    alokasiWaktu: "150 Menit (50 menit konsep teori + 100 menit diskusi studi kasus & pengenalan brief proyek)",
    teori: [
      {
        title: "Arsitektur Client-Server & Siklus Request-Response",
        points: [
          "Client (Browser/Mobile App): Mengirim HTTP Request ke server melalui jaringan internet.",
          "Web Server (Apache/Nginx): Menerima request, meneruskannya ke runtime PHP/Framework.",
          "Backend Application (CodeIgniter 4): Menjalankan logika bisnis, memeriksa input, dan memproses session.",
          "Database Server (MySQL): Menyimpan data permanen (tabel users, buku, peminjaman).",
          "HTTP Response: Server mengirimkan kembali status code (200 OK, 302 Redirect, 404 Not Found) beserta konten HTML/JSON ke browser.",
        ],
        explanation: "Backend adalah 'dapur restoran' tempat pesanan diracik dan bahan diambil dari gudang (database), sedangkan frontend adalah pelayan yang menyajikan menu dan membawa makanan ke meja pelanggan.",
      },
      {
        title: "Perbedaan Frontend vs Backend",
        points: [
          "Frontend berjalan di lingkungan client (mesin pengguna), fokus pada estetika UI, interaktivitas, dan responsivitas.",
          "Backend berjalan di server yang aman, fokus pada integritas data, validasi keamanan, hak akses, dan interaksi database.",
        ],
        explanation: "Data rahasia seperti password, query database, dan kunci API tidak boleh berada di frontend karena dapat dimodifikasi oleh pengguna di browser.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Uji Coba Inspect Jaringan (Network Tab) di Browser",
        desc: "Buka DevTools Chrome (F12) -> Tab Network -> Kunjungi halaman web apa pun. Amati Request Method (GET), Status Code (200 OK), dan Response Header.",
      },
      {
        step: 2,
        title: "Mempelajari Perbedaan HTTP GET vs POST",
        desc: "GET menaruh parameter di URL (query string), cocok untuk mencari dan membaca data. POST menyembunyikan parameter di Request Body, wajib untuk form login, create, update, dan data sensitif.",
      },
    ],
    files: [
      {
        name: "alur_request_response.txt",
        lang: "bash",
        code: `[Browser Client] 
     │
     │  1. HTTP GET /katalog-buku
     ▼
[Web Server Apache (Port 80)]
     │
     │  2. Meneruskan ke public/index.php
     ▼
[CodeIgniter 4 Router -> Controller Buku::index()]
     │
     │  3. Query ke Database
     ▼
[MySQL Database (Port 3306)]
     │
     │  4. Mengembalikan baris data tabel buku
     ▼
[Controller merender View buku/index.php]
     │
     │  5. HTTP 200 OK + HTML Tampilan
     ▼
[Browser merender halaman katalog ke pengguna]`,
        description: "Bagan visual 5 langkah siklus request-response dari browser hingga MySQL",
      },
    ],
    simId: "p1-arsitektur-client-server",
    quiz: {
      question: "Manakah pernyataan yang paling tepat mengenai perbedaan antara HTTP GET dan POST dalam aplikasi backend pemula?",
      options: [
        "GET digunakan untuk membaca data dan parameternya tampak di URL, sedangkan POST digunakan untuk mengirim data form melalui request body",
        "GET digunakan untuk menghapus database, sedangkan POST hanya untuk mengunggah gambar",
        "GET dieksekusi di database MySQL, sedangkan POST dieksekusi di CSS browser",
        "GET tidak memerlukan server backend sama sekali",
      ],
      answer: 0,
      explanation: "HTTP GET mengirim parameter melalui query string URL untuk operasi idempotent (membaca data), sedangkan POST membungkus data di dalam body request untuk form input seperti pendaftaran dan pembuatan data baru.",
    },
    tugas: {
      title: "RTM-1: Analisis Alur Request-Response & Identitas Proyek SIMPUS-Mini",
      description: "Tuliskan ringkasan alur request-response saat seorang pengguna melakukan login ke sebuah situs web. Gambarkan apa yang dikirim oleh form, apa yang diperiksa backend, dan response apa yang diterima jika login berhasil atau gagal.",
      rubrik: [
        { criteria: "Ketepatan penjelasan alur HTTP Request dan Response", bobot: "50%" },
        { criteria: "Pemahaman perbedaan data di URL vs Body", bobot: "30%" },
        { criteria: "Kerapian ringkasan identitas proyek PjBL", bobot: "20%" },
      ],
    },
  },
  {
    no: 2,
    phase: "Fase 1: Setup & Dasar",
    title: "Instalasi Environment & Setup CodeIgniter 4",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Setup & Konfigurasi Framework Backend (C3)",
    subCpmk: "Mahasiswa mampu melakukan instalasi dan konfigurasi environment XAMPP, PHP 8, Composer, dan CodeIgniter 4.",
    indikator: [
      "Berhasil menjalankan Apache & MySQL melalui Control Panel XAMPP",
      "Memverifikasi versi PHP >= 8.1 dan extension php-intl, php-mbstring aktif",
      "Membuat project CodeIgniter 4 baru via Composer dan menjalankannya via spark",
    ],
    problemStatement: "Sebelum mendirikan sebuah rumah makan, kita perlu lahan, kompor, dan perlengkapan memasak. Apa saja piranti wajib yang harus diinstal untuk mulai coding backend PHP modern?",
    goal: "Mahasiswa berhasil mengonfigurasi XAMPP, Composer, membuat proyek CodeIgniter 4 baru, memahami struktur folder MVC, dan mengakses halaman default di localhost:8080.",
    outputPraktikum: "Proyek CodeIgniter 4 berjalan di http://localhost:8080 via `php spark serve`",
    projectMilestone: "Inisialisasi repositori proyek SIMPUS-Mini dengan CodeIgniter 4",
    tools: ["XAMPP / Laragon", "PHP 8.2+", "Composer", "VS Code", "Terminal"],
    alokasiWaktu: "150 Menit (30 menit teori struktur MVC + 120 menit hands-on instalasi & troubleshooting)",
    teori: [
      {
        title: "Peran XAMPP & Composer dalam Backend PHP",
        points: [
          "XAMPP: Paket bundel yang berisi Apache (web server), MySQL (database), dan PHP interpreter.",
          "Composer: Dependency manager untuk PHP yang mengunduh framework dan pustaka pendukung secara otomatis.",
          "php spark serve: Built-in development server bawaan CodeIgniter 4 yang memudahkan pengujian tanpa konfigurasi virtual host rumit.",
        ],
        explanation: "Dengan `php spark serve`, web root secara otomatis diarahkan ke folder `public/`, yang mengamankan kode backend di folder `app/` agar tidak bisa diakses langsung lewat URL browser.",
      },
      {
        title: "Struktur Folder Utama CodeIgniter 4",
        points: [
          "app/Controllers: Tempat menulis logika pemrosesan request dan alur data.",
          "app/Models: Tempat berinteraksi dengan tabel database MySQL.",
          "app/Views: Tempat menulis template tampilan antarmuka (HTML + PHP).",
          "app/Config: Konfigurasi sistem, routing, dan filter keamanan.",
          "public: Satu-satunya folder yang terbuka untuk publik (index.php, css, js, gambar).",
          ".env: Tempat konfigurasi rahasia lokal (koneksi database, mode development/production).",
        ],
        explanation: "Pemisahan MVC (Model-View-Controller) membuat kode teratur: tidak ada lagi query SQL bercampur aduk di dalam tag HTML tampilan.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Cek Versi PHP & Ekstensi di Terminal",
        command: "php -v && composer -V",
        desc: "Pastikan PHP versi 8.1 ke atas sudah terdeteksi di PATH terminal.",
      },
      {
        step: 2,
        title: "Membuat Project CodeIgniter 4 Baru",
        command: "composer create-project codeigniter4/appstarter simpus-mini",
        desc: "Composer akan mengunduh skeleton project CodeIgniter 4 versi stabil terbaru.",
      },
      {
        step: 3,
        title: "Mengaktifkan Mode Development (.env)",
        command: "cp env .env",
        desc: "Salin file env menjadi .env lalu ubah CI_ENVIRONMENT = development agar pesan error ditampilkan jelas saat debugging.",
      },
      {
        step: 4,
        title: "Menjalankan Local Development Server",
        command: "php spark serve",
        desc: "Buka browser ke http://localhost:8080 untuk melihat halaman sambutan resmi CodeIgniter 4.",
      },
    ],
    files: [
      {
        name: ".env",
        lang: "env",
        code: `# Konfigurasi Lingkungan CodeIgniter 4
CI_ENVIRONMENT = development

# URL Aplikasi Lokal
app.baseURL = 'http://localhost:8080/'

# Database Konfigurasi (MySQL Lokal XAMPP)
database.default.hostname = localhost
database.default.database = simpus_mini
database.default.username = root
database.default.password = 
database.default.DBDriver = MySQLi
database.default.port = 3306`,
        description: "Berkas konfigurasi lingkungan lokal untuk menyalakan mode development dan database MySQL",
      },
    ],
    simId: "p2-setup-ci4-spark",
    quiz: {
      question: "Mengapa pada CodeIgniter 4 berkas publik seperti index.php, css, dan gambar diletakkan di dalam folder 'public/' terpisah dari folder 'app/'?",
      options: [
        "Demi keamanan, agar pengguna luar tidak bisa mengunduh file kode sumber PHP, Model, dan konfigurasi sensitif secara langsung lewat URL browser",
        "Agar browser tidak memerlukan CSS dan JavaScript",
        "Karena MySQL hanya bisa membaca data dari folder public",
        "Supaya file PHP tidak perlu dikompilasi oleh Apache",
      ],
      answer: 0,
      explanation: "Meletakkan DocumentRoot di folder public/ adalah standar keamanan web modern agar berkas logika inti di folder app/ dan file konfigurasi rahasia seperti .env tidak dapat diakses langsung oleh pengunjung website.",
    },
    tugas: {
      title: "RTM-2: Setup Environment & Halaman Welcome Lokal",
      description: "Jalankan server CodeIgniter 4 di laptopmu, salin file env menjadi .env, aktifkan CI_ENVIRONMENT = development, dan capture tangkapan layar terminal dan browser.",
      rubrik: [
        { criteria: "Aplikasi CI4 berjalan sukses di port 8080", bobot: "50%" },
        { criteria: "Pengaturan .env development berhasil aktif", bobot: "30%" },
        { criteria: "Dokumentasi tangkapan layar jelas", bobot: "20%" },
      ],
    },
  },
  {
    no: 3,
    phase: "Fase 1: Setup & Dasar",
    title: "Routing Dasar, Controller & Passing Data ke View",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK1: Memahami alur MVC dan Routing (C3)",
    subCpmk: "Mahasiswa mampu membuat routing dasar (GET & POST), Controller, dan melakukan passing data variabel ke View.",
    indikator: [
      "Mampu mendefinisikan route GET di file `app/Config/Routes.php`",
      "Mampu membuat Controller baru dengan method index() dan passing array data",
      "Mampu menampilkan variabel PHP di dalam file View menggunakan sintaks <?= $nama ?>",
    ],
    problemStatement: "Bagaimana cara website menampilkan halaman yang berbeda saat pengunjung mengklik menu 'Beranda', 'Katalog Buku', atau 'Tentang Kami'?",
    goal: "Menguasai cara mendefinisikan rute URL di Routes.php, menghubungkannya ke Controller, dan mengirimkan data array untuk dirender rapi di View.",
    outputPraktikum: "Halaman Beranda & Profil Perpustakaan Mini dengan data dinamis dari Controller",
    projectMilestone: "Pembuatan layout dasar antarmuka (Header, Navigasi, Footer) SIMPUS-Mini",
    tools: ["VS Code", "Browser", "Terminal"],
    alokasiWaktu: "150 Menit (30 menit konsep alur MVC + 120 menit praktik membuat Controller & View)",
    teori: [
      {
        title: "Peran Router dan Controller dalam MVC",
        points: [
          "Router (app/Config/Routes.php): Polisi lalu lintas yang memetakan URL (misal: /buku) ke method Controller yang bertugas.",
          "Controller (app/Controllers/): Manajer yang menerima input request, memanggil model jika butuh data, lalu mengirimkan data ke View.",
          "View (app/Views/): Pekerja visual yang menyusun HTML dan mencetak variabel data yang dikirim oleh Controller.",
        ],
        explanation: "Controller tidak boleh berisi kode HTML panjang, dan View tidak boleh berisi query SQL. Tugas mereka terpisah secara rapi.",
      },
      {
        title: "Cara Mengirim Data (Passing Data) dari Controller ke View",
        points: [
          "Data dikirim dalam bentuk associative array: $data['judul'] = 'Katalog Perpustakaan';",
          "Di dalam View, key array otomatis berubah menjadi variabel PHP: <?= $judul; ?>",
        ],
        explanation: "Sintaks short-echo `<?= $variabel ?>` adalah cara ringkas dan aman di PHP untuk menggantikan `<?php echo $variabel; ?>`.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Menambahkan Route di app/Config/Routes.php",
        desc: "Daftarkan route GET untuk halaman beranda dan katalog buku.",
        codeSnippet: `$routes->get('/', 'Home::index');
$routes->get('/katalog', 'Buku::index');
$routes->get('/tentang', 'Home::tentang');`,
        filePath: "app/Config/Routes.php",
      },
      {
        step: 2,
        title: "Membuat Controller app/Controllers/Buku.php",
        desc: "Buat class Controller Buku yang mewarisi BaseController dan siapkan method index() dengan data array.",
        filePath: "app/Controllers/Buku.php",
      },
      {
        step: 3,
        title: "Membuat File View app/Views/katalog.php",
        desc: "Buat file tampilan HTML sederhana untuk merender judul dan data daftar buku menggunakan loop foreach.",
        filePath: "app/Views/katalog.php",
      },
    ],
    files: [
      {
        name: "app/Config/Routes.php",
        lang: "php",
        code: `<?php

use CodeIgniter\\Router\\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('/katalog', 'Buku::index');
$routes->get('/tentang', 'Home::tentang');`,
        description: "Pemetaan route URL ke method Controller yang bersangkutan",
      },
      {
        name: "app/Controllers/Buku.php",
        lang: "php",
        code: `<?php

namespace App\\Controllers;

class Buku extends BaseController
{
    public function index()
    {
        $data = [
            'namaPerpus' => 'SIMPUS-Mini Kampus Merdeka',
            'tahun'      => date('Y'),
            'daftarBuku' => [
                ['judul' => 'Pemrograman PHP Dasar', 'pengarang' => 'Ahmad Fauzi', 'stok' => 5],
                ['judul' => 'Membangun Web Modern dengan CI4', 'pengarang' => 'Siti Nurhaliza', 'stok' => 3],
                ['judul' => 'Database MySQL untuk Pemula', 'pengarang' => 'Budi Santoso', 'stok' => 7],
            ]
        ];

        return view('katalog', $data);
    }
}`,
        description: "Controller Buku mengirimkan associative array data ke file view katalog.php",
      },
      {
        name: "app/Views/katalog.php",
        lang: "php",
        code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title><?= esc($namaPerpus) ?></title>
    <style>
        body { font-family: sans-serif; margin: 2rem; background: #f8fafc; }
        .card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
        th { background: #0284c7; color: white; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Katalog Buku - <?= esc($namaPerpus) ?></h1>
        <p>Tahun Akademik: <strong><?= esc($tahun) ?></strong></p>
        
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Judul Buku</th>
                    <th>Pengarang</th>
                    <th>Sisa Stok</th>
                </tr>
            </thead>
            <tbody>
                <?php $no = 1; foreach ($daftarBuku as $buku): ?>
                <tr>
                    <td><?= $no++ ?></td>
                    <td><?= esc($buku['judul']) ?></td>
                    <td><?= esc($buku['pengarang']) ?></td>
                    <td><span style="color: green; font-weight: bold;"><?= $buku['stok'] ?></span></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>
</html>`,
        description: "View menerima array data dan merendernya dalam tabel dengan perulangan foreach",
      },
    ],
    simId: "p3-routing-passing-view",
    quiz: {
      question: "Di dalam Controller CodeIgniter 4, jika kita mengirimkan array `['namaWeb' => 'Perpustakaan Mini']` ke view('beranda', $data), bagaimana cara mencetak nilai tersebut di dalam file View?",
      options: [
        "Menggunakan <?= esc($namaWeb) ?> atau <?php echo $namaWeb; ?>",
        "Menggunakan $data['namaWeb'] secara langsung tanpa echo",
        "Menggunakan SELECT namaWeb FROM database",
        "Variabel tidak bisa dicetak di View karena terkunci di Controller",
      ],
      answer: 0,
      explanation: "CodeIgniter secara otomatis mengekstrak key array associative menjadi variabel mandiri di dalam View, sehingga key 'namaWeb' diakses sebagai variabel $namaWeb.",
    },
    tugas: {
      title: "RTM-3: Routing Halaman Profil & Katalog Statis",
      description: "Buat controller Profil dengan method index() yang menampilkan data nama perpustakaan, alamat, visi misi, dan jam operasional yang dikirimkan via array $data ke view.",
      rubrik: [
        { criteria: "Route terdaftar dengan benar di Routes.php", bobot: "30%" },
        { criteria: "Controller berhasil menyusun array data dinamis", bobot: "40%" },
        { criteria: "View menampilkan data rapi menggunakan escaping esc()", bobot: "30%" },
      ],
    },
  },
  {
    no: 4,
    phase: "Fase 2: MySQL & CRUD",
    title: "Database MySQL, phpMyAdmin & Koneksi Aplikasi",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Merancang Database MySQL & Koneksi (C3)",
    subCpmk: "Mahasiswa mampu merancang tabel MySQL di phpMyAdmin, menentukan Primary Key, dan mengonfigurasi koneksi database di CodeIgniter 4.",
    indikator: [
      "Mampu membuat database baru `simpus_mini` melalui phpMyAdmin / SQL query",
      "Mampu merancang struktur tabel `kategori` dan `buku` dengan tipe data yang tepat (INT, VARCHAR, TEXT)",
      "Mampu menghubungkan aplikasi CodeIgniter 4 ke database MySQL via berkas `.env`",
      "Lolos uji coba query koneksi database tanpa error 'Database connection failed'",
    ],
    problemStatement: "Selama ini data buku disimpan di buku catatan fisik atau array statis di controller. Jika server di-restart, data hilang! Bagaimana cara menyimpan data secara permanen dan terstruktur di database MySQL?",
    goal: "Memahami konsep basis data relasional MySQL, tabel, kolom, primary key (auto increment), dan berhasil mengonfigurasi koneksi MySQL ke CodeIgniter 4.",
    outputPraktikum: "Database `simpus_mini` berisi tabel `kategori` dan `buku` berhasil terkoneksi ke CodeIgniter 4",
    projectMilestone: "Skema database MySQL SIMPUS-Mini aktif & terhubung",
    tools: ["XAMPP phpMyAdmin (localhost/phpmyadmin)", "MySQL 8 / MariaDB", "VS Code (.env)"],
    alokasiWaktu: "150 Menit (40 menit teori konsep database & primary key + 110 menit praktik phpMyAdmin & koneksi)",
    teori: [
      {
        title: "Konsep Dasar Relational Database Management System (RDBMS) MySQL",
        points: [
          "Database: Wadah besar yang menampung sekumpulan tabel terstruktur.",
          "Tabel: Kumpulan baris (records) dan kolom (fields) yang merepresentasikan satu entitas (misal: buku, kategori).",
          "Primary Key: Kolom penanda unik untuk setiap baris data (wajib unik, tidak boleh null, biasanya integer AUTO_INCREMENT).",
          "Tipe Data Penting: INT (angka bulat), VARCHAR(n) (teks pendek berbatas), TEXT (teks panjang), DATETIME (waktu).",
        ],
        explanation: "Tanpa Primary Key, kita tidak bisa membedakan dua buku yang memiliki judul yang sama persis.",
      },
      {
        title: "Konfigurasi Koneksi Database di CodeIgniter 4",
        points: [
          "Hostname: localhost (server database berjalan di komputer yang sama)",
          "Database Name: simpus_mini",
          "Username: root (default XAMPP tanpa password)",
          "Password: kosong secara default pada instalasi XAMPP",
          "DBDriver: MySQLi (driver PHP standar untuk berkomunikasi dengan MySQL)",
        ],
        explanation: "Selalu lakukan konfigurasi di file `.env` bukan langsung mengedit `app/Config/Database.php` agar kredensial lokal tidak tertimpa saat proyek dipindah.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Buka phpMyAdmin dan Buat Database",
        desc: "Kunjungi http://localhost/phpmyadmin -> Klik menu 'Databases' -> Ketik nama database: simpus_mini -> Collation: utf8mb4_general_ci -> Klik 'Create'.",
      },
      {
        step: 2,
        title: "Eksekusi Script SQL Pembuatan Tabel",
        desc: "Buka tab 'SQL' di phpMyAdmin lalu jalankan query DDL untuk membuat tabel kategori dan buku.",
        filePath: "database.sql",
      },
      {
        step: 3,
        title: "Ubah Konfigurasi Database di .env",
        desc: "Buka file .env dan aktifkan konfigurasi database.default.* dengan nama database simpus_mini.",
        filePath: ".env",
      },
      {
        step: 4,
        title: "Uji Koneksi dengan Controller Test",
        desc: "Jalankan method sederhana di controller untuk menguji $db = \\Config\\Database::connect();",
      },
    ],
    files: [
      {
        name: "database.sql",
        lang: "sql",
        code: `-- Buat Database
CREATE DATABASE IF NOT EXISTS \`simpus_mini\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE \`simpus_mini\`;

-- 1. Tabel Kategori Buku
CREATE TABLE IF NOT EXISTS \`kategori\` (
    \`id\` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    \`nama_kategori\` VARCHAR(100) NOT NULL,
    \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabel Buku
CREATE TABLE IF NOT EXISTS \`buku\` (
    \`id\` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    \`kategori_id\` INT(11) UNSIGNED NULL,
    \`judul\` VARCHAR(255) NOT NULL,
    \`pengarang\` VARCHAR(150) NOT NULL,
    \`penerbit\` VARCHAR(100) NOT NULL,
    \`tahun_terbit\` INT(4) NOT NULL,
    \`stok\` INT(11) NOT NULL DEFAULT 1,
    \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Data Dummy Awal
INSERT INTO \`kategori\` (\`id\`, \`nama_kategori\`) VALUES 
(1, 'Teknologi Informasi'),
(2, 'Sains & Matematika'),
(3, 'Sastra & Fiksi');

INSERT INTO \`buku\` (\`kategori_id\`, \`judul\`, \`pengarang\`, \`penerbit\`, \`tahun_terbit\`, \`stok\`) VALUES
(1, 'Pemrograman Web PHP & CI4', 'Budi Santoso', 'Informatika Press', 2023, 10),
(1, 'Mastering MySQL Database', 'Ahmad Fauzi', 'Media Komputindo', 2022, 5),
(3, 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2008, 4);`,
        description: "Script DDL dan data dummy awal untuk tabel kategori dan buku di MySQL",
      },
    ],
    simId: "p4-mysql-phpmyadmin-koneksi",
    asesmenTerkait: {
      nama: "Asesmen Formatif 1 (Pra-UTS)",
      bobot: "20%",
      tipe: "formatif",
    },
    quiz: {
      question: "Apa fungsi utama dari properti PRIMARY KEY dengan AUTO_INCREMENT pada kolom 'id' di tabel MySQL?",
      options: [
        "Menjamin setiap baris data memiliki nomor identitas unik yang otomatis bertambah 1 setiap ada insert baru",
        "Menghapus data buku yang sudah terlalu lama tidak dipinjam",
        "Mengenkripsi judul buku agar tidak bisa dibaca pengguna lain",
        "Menghubungkan komputer laptop langsung ke satelit internet",
      ],
      answer: 0,
      explanation: "PRIMARY KEY menjamin keunikan identitas tiap baris data sehingga operasi update dan delete dapat menyasar data yang tepat tanpa salah sasaran, dan AUTO_INCREMENT memudahkan pengisian id otomatis oleh mesin database.",
    },
    tugas: {
      title: "ASESMEN FORMATIF 1 (Bobot 20%): Kuis Konsep DB & Tugas Koneksi MySQL",
      description: "Buat database simpus_mini di phpMyAdmin, buat tabel kategori dan buku sesuai skema, hubungkan dengan CodeIgniter 4 via file .env, dan pastikan aplikasi tidak menampilkan error koneksi saat diakses di browser.",
      rubrik: [
        { criteria: "Pemahaman konsep database (tabel, PK, tipe data)", bobot: "30%" },
        { criteria: "Struktur tabel kategori & buku sesuai rancangan", bobot: "35%" },
        { criteria: "Koneksi aplikasi ke database via .env berjalan mulus tanpa error", bobot: "35%" },
      ],
    },
  },
  {
    no: 5,
    phase: "Fase 2: MySQL & CRUD",
    title: "CRUD - CREATE: Form Input & Simpan Data ke MySQL",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Implementasi Operasi Create ke Basis Data (C3)",
    subCpmk: "Mahasiswa mampu membuat form input HTML, Model CodeIgniter 4, dan method Controller untuk menyimpan data baru ke database MySQL.",
    indikator: [
      "Mampu membuat Model `BukuModel` yang mewarisi `CodeIgniter\\Model` dengan `$allowedFields`",
      "Mampu membuat form input dengan method POST dan token CSRF `csrf_field()`",
      "Mampu mengambil input form di controller menggunakan `$this->request->getPost()`",
      "Mampu menyimpan data ke database dengan method `$model->save()` / `$model->insert()`",
    ],
    problemStatement: "Admin perpustakaan ingin menambahkan buku baru yang baru saja dibeli. Bagaimana alur sistem menerima isian dari form web dan menyimpannya secara aman ke dalam tabel MySQL?",
    goal: "Menguasai pembuatan Model Eloquent/Active Record di CI4, form input POST, keamanan CSRF, dan eksekusi insert data ke tabel MySQL.",
    outputPraktikum: "Form 'Tambah Buku Baru' yang berhasil menyimpan data ke tabel `buku` di MySQL",
    projectMilestone: "Fitur Tambah Buku (Create) SIMPUS-Mini berfungsi",
    tools: ["VS Code", "Browser", "phpMyAdmin"],
    alokasiWaktu: "150 Menit (30 menit teori form handling & CSRF + 120 menit praktik coding Create)",
    teori: [
      {
        title: "Alur Operasi CREATE dalam Arsitektur MVC",
        points: [
          "1. Browser meminta halaman form: GET /buku/tambah -> Controller Buku::tambah() -> view('buku/tambah').",
          "2. Pengguna mengisi form dan klik tombol 'Simpan'.",
          "3. Browser mengirim data form: POST /buku/simpan -> Controller Buku::simpan().",
          "4. Controller mengambil data dengan $this->request->getPost().",
          "5. Controller memanggil Model: $bukuModel->save($data).",
          "6. Model mengeksekusi query SQL: INSERT INTO buku (...) VALUES (...).",
          "7. Controller mengalihkan (redirect) pengguna kembali ke daftar buku dengan pesan sukses.",
        ],
        explanation: "Pemisahan antara method GET untuk menampilkan form dan method POST untuk memproses penyimpanan adalah best practice standar industri.",
      },
      {
        title: "Pentingnya Keamanan CSRF Token (csrf_field)",
        points: [
          "CSRF (Cross-Site Request Forgery): Serangan di mana situs jahat memaksa browser pengguna mengirim request palsu ke aplikasi kita.",
          "CodeIgniter 4 menyediakan fungsi `<?= csrf_field() ?>` yang menyisipkan token acak tersembunyi ke dalam form.",
          "Server akan menolak request POST jika token tersebut tidak cocok.",
        ],
        explanation: "Selalu sertakan `<?= csrf_field() ?>` di setiap tag `<form method='post'>` pada aplikasi CodeIgniter 4.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Model app/Models/BukuModel.php",
        desc: "Definisikan nama tabel dan daftar kolom yang diizinkan untuk diisi massal ($allowedFields).",
        filePath: "app/Models/BukuModel.php",
      },
      {
        step: 2,
        title: "Menambahkan Route Tambah & Simpan",
        desc: "Daftarkan route GET untuk menampilkan form dan route POST untuk memproses simpan.",
        filePath: "app/Config/Routes.php",
      },
      {
        step: 3,
        title: "Membuat Method tambah() & simpan() di Controller",
        desc: "Ambil data post lalu teruskan ke method save() milik BukuModel.",
        filePath: "app/Controllers/Buku.php",
      },
      {
        step: 4,
        title: "Membuat Form Input di app/Views/buku/tambah.php",
        desc: "Sediakan input judul, pengarang, penerbit, tahun, dan stok dengan csrf_field().",
        filePath: "app/Views/buku/tambah.php",
      },
    ],
    files: [
      {
        name: "app/Models/BukuModel.php",
        lang: "php",
        code: `<?php

namespace App\\Models;

use CodeIgniter\\Model;

class BukuModel extends Model
{
    protected $table            = 'buku';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = [
        'kategori_id',
        'judul',
        'pengarang',
        'penerbit',
        'tahun_terbit',
        'stok'
    ];

    // Aktifkan timestamp otomatis
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}`,
        description: "Model Buku mendefinisikan tabel target dan kolom yang boleh diisi ($allowedFields)",
      },
      {
        name: "app/Views/buku/tambah.php",
        lang: "php",
        code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Tambah Buku Baru - SIMPUS-Mini</title>
    <style>
        body { font-family: sans-serif; margin: 2rem; background: #f1f5f9; }
        .form-box { max-width: 500px; margin: auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 1rem; }
        label { display: block; font-weight: bold; margin-bottom: 0.4rem; font-size: 13px; }
        input, select { width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; }
        button { background: #0284c7; color: white; padding: 10px 18px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
        button:hover { background: #0369a1; }
        .btn-back { margin-left: 8px; color: #64748b; text-decoration: none; font-size: 13px; }
    </style>
</head>
<body>
    <div class="form-box">
        <h2>Tambah Data Buku</h2>
        
        <form action="/buku/simpan" method="post">
            <?= csrf_field() ?>

            <div class="form-group">
                <label for="judul">Judul Buku *</label>
                <input type="text" id="judul" name="judul" required placeholder="Contoh: Belajar PHP Modern">
            </div>

            <div class="form-group">
                <label for="pengarang">Pengarang *</label>
                <input type="text" id="pengarang" name="pengarang" required placeholder="Nama lengkap pengarang">
            </div>

            <div class="form-group">
                <label for="penerbit">Penerbit *</label>
                <input type="text" id="penerbit" name="penerbit" required placeholder="Nama penerbit buku">
            </div>

            <div class="form-group">
                <label for="tahun_terbit">Tahun Terbit *</label>
                <input type="number" id="tahun_terbit" name="tahun_terbit" required min="1900" max="2099" value="2023">
            </div>

            <div class="form-group">
                <label for="stok">Jumlah Stok *</label>
                <input type="number" id="stok" name="stok" required min="1" value="5">
            </div>

            <button type="submit">💾 Simpan Buku</button>
            <a href="/buku" class="btn-back">Batal</a>
        </form>
    </div>
</body>
</html>`,
        description: "Form input tambah buku dengan CSRF token dan validasi atribut required HTML5",
      },
    ],
    simId: "p5-crud-create-form",
    quiz: {
      question: "Mengapa properti `$allowedFields` di Model CodeIgniter 4 wajib diisi dengan nama kolom yang diperbolehkan?",
      options: [
        "Untuk mencegah serangan Mass Assignment, di mana pengguna nakal menyusupkan input ilegal ke kolom yang tidak seharusnya diubah",
        "Supaya MySQL otomatis menghapus tabel jika kolom tidak terdaftar",
        "Karena browser tidak bisa merender tag input tanpa allowedFields",
        "Agar file gambar otomatis terunggah ke server",
      ],
      answer: 0,
      explanation: "$allowedFields melindungi aplikasi dari Mass Assignment Vulnerability sehingga hanya field-field yang terdaftar secara eksplisit yang dapat disimpan melalui method save() atau insert().",
    },
    tugas: {
      title: "RTM-4A: Implementasi Form Create Data Buku",
      description: "Buat form Tambah Buku lengkap dengan CSRF token dan method simpan di BukuModel. Ujilah dengan menambahkan 3 buku baru melalui form dan periksa keberhasilannya di tabel phpMyAdmin.",
      rubrik: [
        { criteria: "Model Buku dibuat dengan $allowedFields tepat", bobot: "30%" },
        { criteria: "Form input menggunakan method POST & csrf_field()", bobot: "35%" },
        { criteria: "Data baru berhasil masuk ke database MySQL", bobot: "35%" },
      ],
    },
  },
  {
    no: 6,
    phase: "Fase 2: MySQL & CRUD",
    title: "CRUD - READ: Menampilkan Daftar Data & Detail Buku",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Implementasi Operasi Read dari Basis Data (C3)",
    subCpmk: "Mahasiswa mampu mengambil data dari MySQL menggunakan Model (`findAll()`, `find($id)`) dan menampilkannya dalam tabel list dan halaman detail.",
    indikator: [
      "Mampu menggunakan method `$model->findAll()` untuk mengambil seluruh baris data",
      "Mampu menggunakan method `$model->find($id)` untuk mengambil satu baris data berdasarkan Primary Key",
      "Mampu merender daftar buku dalam tabel HTML dengan tombol aksi (Detail, Edit, Hapus)",
      "Mampu menangani kondisi saat data buku tidak ditemukan (404 PageNotFound)",
    ],
    problemStatement: "Setelah data tersimpan di database, bagaimana cara menampilkannya kembali ke layar pengguna dalam bentuk daftar tabel yang rapi dan halaman detail per buku?",
    goal: "Menguasai query SELECT dasar melalui Model CI4, menampilkan tabel dinamis di View, dan membuat routing dinamis dengan parameter slug/ID `/buku/detail/1`.",
    outputPraktikum: "Halaman Daftar Buku lengkap dengan link ke Halaman Detail Buku",
    projectMilestone: "Fitur Tampil Data (Read List & Detail) SIMPUS-Mini berfungsi",
    tools: ["VS Code", "Browser", "phpMyAdmin"],
    alokasiWaktu: "150 Menit (20 menit teori query SELECT + 130 menit praktik coding Read List & Detail)",
    teori: [
      {
        title: "Perbedaan Operasi Read: List vs Detail",
        points: [
          "List (Daftar): Mengambil banyak baris sekaligus dengan `findAll()`. Query setara: `SELECT * FROM buku ORDER BY id DESC`.",
          "Detail (Spesifik): Mengambil tepat satu baris berdasarkan ID dengan `find($id)`. Query setara: `SELECT * FROM buku WHERE id = 1 LIMIT 1`.",
          "Pengecekan Data: Jika hasil `find($id)` bernilai null, lempar exception `throw new \\CodeIgniter\\Exceptions\\PageNotFoundException(...)` agar pengguna tahu data tidak ada.",
        ],
        explanation: "Halaman detail memberikan ruang yang cukup untuk menampilkan informasi lengkap buku tanpa membuat tabel katalog utama menjadi sesak.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Menambahkan Method index() & detail($id) di Controller",
        desc: "Panggil findAll() untuk halaman list dan find($id) untuk halaman detail.",
        filePath: "app/Controllers/Buku.php",
      },
      {
        step: 2,
        title: "Membuat Route Dinamis di Routes.php",
        desc: "Gunakan placeholder (:num) untuk menangkap parameter ID angka pada URL.",
        codeSnippet: `$routes->get('/buku', 'Buku::index');
$routes->get('/buku/detail/(:num)', 'Buku::detail/$1');`,
        filePath: "app/Config/Routes.php",
      },
      {
        step: 3,
        title: "Membuat View app/Views/buku/index.php & detail.php",
        desc: "Buat tabel katalog buku dengan tombol 'Lihat Detail' yang mengarah ke /buku/detail/ID.",
      },
    ],
    files: [
      {
        name: "app/Views/buku/index.php",
        lang: "php",
        code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Daftar Buku - SIMPUS-Mini</title>
    <style>
        body { font-family: sans-serif; margin: 2rem; background: #f8fafc; }
        .container { max-width: 900px; margin: auto; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); }
        .header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .btn-add { background: #16a34a; color: white; padding: 8px 14px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 13px; }
        th { background: #0284c7; color: white; }
        .btn-detail { background: #0284c7; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 11px; font-weight: bold; }
        .btn-edit { background: #d97706; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 11px; font-weight: bold; margin-left: 4px; }
        .btn-delete { background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 11px; font-weight: bold; margin-left: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header-bar">
            <h2>Katalog Buku Perpustakaan</h2>
            <a href="/buku/tambah" class="btn-add">➕ Tambah Buku Baru</a>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 40px;">No</th>
                    <th>Judul Buku</th>
                    <th>Pengarang</th>
                    <th>Tahun</th>
                    <th>Stok</th>
                    <th style="width: 170px;">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($daftarBuku)): ?>
                    <tr><td colspan="6" style="text-align: center; color: #64748b;">Belum ada data buku.</td></tr>
                <?php else: ?>
                    <?php $no = 1; foreach ($daftarBuku as $b): ?>
                    <tr>
                        <td><?= $no++ ?></td>
                        <td><strong><?= esc($b['judul']) ?></strong></td>
                        <td><?= esc($b['pengarang']) ?></td>
                        <td><?= esc($b['tahun_terbit']) ?></td>
                        <td><span style="color: #16a34a; font-weight: bold;"><?= $b['stok'] ?></span></td>
                        <td>
                            <a href="/buku/detail/<?= $b['id'] ?>" class="btn-detail">Detail</a>
                            <a href="/buku/edit/<?= $b['id'] ?>" class="btn-edit">Edit</a>
                            <a href="/buku/hapus/<?= $b['id'] ?>" class="btn-delete" onclick="return confirm('Yakin ingin menghapus buku ini?')">Hapus</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</body>
</html>`,
        description: "View daftar buku dengan tombol aksi Detail, Edit, dan Hapus",
      },
    ],
    simId: "p6-crud-read-tabel",
    quiz: {
      question: "Bagaimana cara mendefinisikan rute di CodeIgniter 4 agar URL `/buku/detail/5` dapat menangkap angka '5' sebagai parameter ID ke method Controller?",
      options: [
        "$routes->get('/buku/detail/(:num)', 'Buku::detail/$1');",
        "$routes->get('/buku/detail/5', 'Buku::detail');",
        "$routes->post('/buku/detail', 'Buku::detail');",
        "$routes->get('/buku/detail/*', 'Buku::all');",
      ],
      answer: 0,
      explanation: "Placeholder (:num) di Routes.php menangkap parameter numerik dan meneruskannya sebagai argumen pertama ($1) ke method controller tujuan (function detail($id)).",
    },
    tugas: {
      title: "RTM-4B: Implementasi Halaman List & Detail Buku",
      description: "Buat halaman index() untuk menampilkan seluruh katalog buku dari database MySQL, serta halaman detail($id) yang menampilkan informasi lengkap buku beserta status ketersediaan stok.",
      rubrik: [
        { criteria: "Data dari tabel MySQL tampil lengkap di tabel HTML", bobot: "50%" },
        { criteria: "Halaman detail berhasil mengambil 1 data per ID", bobot: "30%" },
        { criteria: "Penanganan data kosong / ID tidak ditemukan", bobot: "20%" },
      ],
    },
  },
  {
    no: 7,
    phase: "Fase 2: MySQL & CRUD",
    title: "CRUD - UPDATE & DELETE: Mengubah & Menghapus Data",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Implementasi Operasi Update dan Delete (C3)",
    subCpmk: "Mahasiswa mampu membuat form edit dengan nilai awal (prefilled data), memperbarui data di MySQL, dan menghapus baris data dengan konfirmasi.",
    indikator: [
      "Mampu membuat form edit yang terisi data lama berdasarkan ID",
      "Mampu memproses update data ke MySQL menggunakan method `$model->update($id, $data)`",
      "Mampu menghapus data dari MySQL menggunakan method `$model->delete($id)`",
      "Menerapkan konfirmasi JavaScript sebelum penghapusan (`onclick=\"return confirm('...')\"`)",
    ],
    problemStatement: "Admin salah mengetik tahun terbit buku atau ada buku yang hilang sehingga harus dihapus dari sistem. Bagaimana alur sistem memperbarui baris data tanpa merusak data lain, dan menghapus data secara aman?",
    goal: "Menguasai alur UPDATE (ambil data lama -> tampilkan di form -> kirim POST -> simpan perubahan) dan DELETE (tangkap ID -> validasi -> eksekusi delete di MySQL).",
    outputPraktikum: "Operasi CRUD Buku LENGKAP (Create, Read, Update, Delete) berfungsi 100%",
    projectMilestone: "Modul CRUD Buku SIMPUS-Mini selesai sempurna (Checkpoint Pra-UTS)",
    tools: ["VS Code", "Browser", "phpMyAdmin"],
    alokasiWaktu: "150 Menit (30 menit teori update/delete + 90 menit praktik + 30 menit review persiapan UTS)",
    teori: [
      {
        title: "Alur Kerja Operasi UPDATE",
        points: [
          "1. Pengguna mengklik tombol 'Edit' pada baris buku ID=3: GET /buku/edit/3.",
          "2. Controller mengambil data buku ID=3 dari model: $buku = $model->find(3).",
          "3. Controller mengirimkan data tersebut ke form edit sebagai nilai awal atribut `value=\"<?= esc($buku['judul']) ?>\"`.",
          "4. Pengguna mengubah data lalu submit form: POST /buku/perbarui/3.",
          "5. Controller memanggil `$model->update(3, $dataBaru)`.",
          "6. Query yang dieksekusi: `UPDATE buku SET judul='...', tahun_terbit=... WHERE id = 3`.",
        ],
        explanation: "Klausa WHERE id = 3 sangat vital! Tanpa klausul WHERE spesifik pada query UPDATE/DELETE, seluruh baris tabel di database bisa terhapus atau tertimpa secara tidak sengaja.",
      },
      {
        title: "Keamanan Operasi DELETE",
        points: [
          "Data yang sudah terhapus permanen dari MySQL sulit dikembalikan jika tidak ada backup.",
          "Selalu beri dialog konfirmasi JavaScript sebelum mengirim request hapus.",
          "Gunakan HTTP method POST atau simulasikan DELETE saat memungkinkan.",
        ],
        explanation: "Konfirmasi mencegah kecelakaan 'salah klik' yang sering terjadi pada pengguna pemula.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Method edit($id) & perbarui($id) di Controller",
        desc: "Method edit mengambil data lama untuk form, method perbarui memanggil $model->update().",
        filePath: "app/Controllers/Buku.php",
      },
      {
        step: 2,
        title: "Membuat View app/Views/buku/edit.php",
        desc: "Form edit mirip dengan form tambah, namun setiap input diberi atribut value dari data buku lama.",
        filePath: "app/Views/buku/edit.php",
      },
      {
        step: 3,
        title: "Membuat Method hapus($id) di Controller",
        desc: "Panggil $model->delete($id) lalu redirect kembali ke /buku.",
        filePath: "app/Controllers/Buku.php",
      },
    ],
    files: [
      {
        name: "app/Views/buku/edit.php",
        lang: "php",
        code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Edit Buku - SIMPUS-Mini</title>
    <style>
        body { font-family: sans-serif; margin: 2rem; background: #f1f5f9; }
        .form-box { max-width: 500px; margin: auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 1rem; }
        label { display: block; font-weight: bold; margin-bottom: 0.4rem; font-size: 13px; }
        input { width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; }
        button { background: #d97706; color: white; padding: 10px 18px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
        button:hover { background: #b45309; }
        .btn-back { margin-left: 8px; color: #64748b; text-decoration: none; font-size: 13px; }
    </style>
</head>
<body>
    <div class="form-box">
        <h2>Ubah Data Buku #<?= $buku['id'] ?></h2>
        
        <form action="/buku/perbarui/<?= $buku['id'] ?>" method="post">
            <?= csrf_field() ?>

            <div class="form-group">
                <label for="judul">Judul Buku *</label>
                <input type="text" id="judul" name="judul" required value="<?= esc($buku['judul']) ?>">
            </div>

            <div class="form-group">
                <label for="pengarang">Pengarang *</label>
                <input type="text" id="pengarang" name="pengarang" required value="<?= esc($buku['pengarang']) ?>">
            </div>

            <div class="form-group">
                <label for="penerbit">Penerbit *</label>
                <input type="text" id="penerbit" name="penerbit" required value="<?= esc($buku['penerbit']) ?>">
            </div>

            <div class="form-group">
                <label for="tahun_terbit">Tahun Terbit *</label>
                <input type="number" id="tahun_terbit" name="tahun_terbit" required value="<?= esc($buku['tahun_terbit']) ?>">
            </div>

            <div class="form-group">
                <label for="stok">Jumlah Stok *</label>
                <input type="number" id="stok" name="stok" required value="<?= esc($buku['stok']) ?>">
            </div>

            <button type="submit">💾 Perbarui Data</button>
            <a href="/buku" class="btn-back">Batal</a>
        </form>
    </div>
</body>
</html>`,
        description: "Form edit buku dengan pengisian nilai awal (prefilled value) dari database",
      },
    ],
    simId: "p7-crud-update-delete",
    quiz: {
      question: "Mengapa pada perintah SQL UPDATE dan DELETE wajib menyertakan klausa `WHERE id = ...`?",
      options: [
        "Agar perubahan atau penghapusan hanya berdampak pada 1 baris rekaman spesifik, bukan seluruh isi tabel di database",
        "Agar query dijalankan lebih lambat oleh CPU",
        "Karena klausa WHERE wajib ada di semua sintaks PHP",
        "Untuk mengubah nama database MySQL",
      ],
      answer: 0,
      explanation: "Jika kita mengeksekusi `DELETE FROM buku;` tanpa klausul `WHERE id = 1`, seluruh baris buku di tabel akan terhapus seketika tanpa bisa di-undo.",
    },
    tugas: {
      title: "RTM-4C: Review & Uji Coba CRUD Lengkap",
      description: "Lengkapi fitur Edit dan Hapus pada modul Buku. Lakukan testing menyeluruh: Tambah 1 buku baru, periksa di daftar, ubah judulnya, dan hapus. Pastikan semua fitur CRUD berjalan lancar.",
      rubrik: [
        { criteria: "Form edit menampilkan nilai lama buku secara tepat", bobot: "35%" },
        { criteria: "Operasi update berhasil memperbarui data di MySQL", bobot: "35%" },
        { criteria: "Operasi delete berhasil menghapus data dengan konfirmasi", bobot: "30%" },
      ],
    },
  },
  {
    no: 8,
    phase: "UTS",
    title: "UJIAN TENGAH SEMESTER (UTS): Praktik CRUD Mandiri",
    sks: "3 SKS (Praktik Mandiri 150 Menit)",
    cpmk: "CPMK2 & CPMK5: Membangun Aplikasi CRUD Sederhana secara Mandiri (C3)",
    subCpmk: "Mahasiswa mampu membangun aplikasi web CRUD sederhana dari nol untuk studi kasus baru dalam waktu terbatas secara mandiri.",
    indikator: [
      "Mampu membuat database & tabel MySQL baru secara mandiri",
      "Mampu mengonfigurasi koneksi CodeIgniter 4 (.env)",
      "Mampu mengimplementasikan fitur Create, Read, Update, Delete berjalan fungsional",
      "Struktur kode rapi mengikuti kaidah MVC tanpa error fatal",
    ],
    problemStatement: "Sebuah unit bisnis kecil membutuhkan sistem pencatatan data inventaris barang sederhana. Buatkan aplikasi CRUD lengkap dalam waktu 150 menit!",
    goal: "Menguji kemandirian mahasiswa dalam merancang basis data dan membangun fitur CRUD lengkap menggunakan framework CodeIgniter 4.",
    outputPraktikum: "Proyek mini CRUD mandiri fungsional yang dikumpulkan via repositori / berkas ZIP",
    projectMilestone: "Evaluasi kompetensi tengah semester (UTS)",
    tools: ["VS Code", "XAMPP (Apache & MySQL)", "phpMyAdmin", "Browser"],
    alokasiWaktu: "150 Menit (Praktik Langsung / Live Coding)",
    teori: [
      {
        title: "Panduan Teknis Ujian Tengah Semester",
        points: [
          "Boleh membuka dokumentasi resmi (codeigniter.com/user_guide) dan w3schools.",
          "Dilarang saling menyalin kode sumber dengan teman lain (plagiarisme = gugur).",
          "Prioritas penilaian: Apakah fitur Create, Read, Update, Delete berfungsi di browser.",
        ],
        explanation: "Fokus utama UTS pemula adalah fungsionalitas: sistem dapat menyimpan, menampilkan, mengedit, dan menghapus data tanpa error fatal 500.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membaca Soal Kasus UTS",
        desc: "Studi kasus: Sistem Inventaris Barang Toko (id, kode_barang, nama_barang, kategori, harga, stok).",
      },
      {
        step: 2,
        title: "Membuat Database & Tabel di phpMyAdmin",
        desc: "Buat database db_inventaris dan tabel barang.",
      },
      {
        step: 3,
        title: "Mengembangkan Model, Controller & Views",
        desc: "Buat rute /barang, /barang/tambah, /barang/edit/(:num), /barang/hapus/(:num).",
      },
      {
        step: 4,
        title: "Pengujian & Pengumpulan",
        desc: "Uji seluruh fitur CRUD di browser lalu arsipkan ke format ZIP / push ke GitHub.",
      },
    ],
    files: [
      {
        name: "soal_uts_inventaris.sql",
        lang: "sql",
        code: `CREATE DATABASE IF NOT EXISTS \`db_inventaris\`;
USE \`db_inventaris\`;

CREATE TABLE \`barang\` (
    \`id\` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    \`kode_barang\` VARCHAR(20) NOT NULL UNIQUE,
    \`nama_barang\` VARCHAR(150) NOT NULL,
    \`kategori\` VARCHAR(50) NOT NULL,
    \`harga\` INT(11) NOT NULL,
    \`stok\` INT(11) NOT NULL,
    \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
);`,
        description: "Skema basis data untuk studi kasus inventaris barang pada Ujian Tengah Semester",
      },
    ],
    simId: "p8-uts-crud-live",
    asesmenTerkait: {
      nama: "Asesmen Sumatif 1 (UTS)",
      bobot: "25%",
      tipe: "sumatif",
    },
    quiz: {
      question: "Dalam implementasi CRUD MVC, apa urutan pengerjaan yang paling efektif dan sistematis bagi pemula?",
      options: [
        "Database & Tabel -> Konfigurasi .env -> Model -> Routes -> Controller -> Views",
        "Views -> CSS -> baru memikirkan database di akhir semester",
        "Langsung mengunggah ke hosting sebelum membuat tabel",
        "Menulis HTML tanpa Model dan Controller",
      ],
      answer: 0,
      explanation: "Urutan dari fondasi data (Database/Model) menuju alur logika (Routes/Controller) lalu ke antarmuka (View) adalah cara paling terstruktur dan minim bug.",
    },
    tugas: {
      title: "ASESMEN SUMATIF 1 (UTS - Bobot 25%): Praktik CRUD Mandiri",
      description: "Kerjakan studi kasus pembuatan CRUD inventaris barang toko sesuai lembar soal. Kumpulkan berkas proyek (zip) dan file export SQL database.",
      rubrik: [
        { criteria: "Fungsi Create berfungsi dengan validasi dasar", bobot: "25%" },
        { criteria: "Fungsi Read (tabel list dan detail) tampil rapi", bobot: "25%" },
        { criteria: "Fungsi Update berfungsi memperbarui data di MySQL", bobot: "25%" },
        { criteria: "Fungsi Delete berfungsi dengan dialog konfirmasi", bobot: "25%" },
      ],
    },
  },
  {
    no: 9,
    phase: "Fase 3: Fitur Menengah",
    title: "Validasi Form Input & Flash Messages",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Validasi Form & Error Handling Dasar (C3)",
    subCpmk: "Mahasiswa mampu menerapkan validasi data pada form input (required, numeric, min_length) dan menampilkan pesan error serta flash message sukses.",
    indikator: [
      "Mampu mendefinisikan aturan validasi `$this->validate()` di Controller",
      "Mampu menampilkan pesan peringatan error spesifik per input form jika data tidak valid",
      "Mampu mempertahankan isian data lama menggunakan helper `old('field')`",
      "Mampu menampilkan notifikasi sukses menggunakan flashdata session",
    ],
    problemStatement: "Bagaimana jika admin lupa mengisi judul buku atau keliru mengisikan teks pada kolom stok yang seharusnya angka? Sistem tidak boleh crash dan harus memberi tahu apa yang salah!",
    goal: "Mencegah data kotor masuk ke database dengan aturan validasi server-side dan memberikan umpan balik (feedback) ramah bagi pengguna.",
    outputPraktikum: "Form buku yang memiliki validasi input otomatis dan notifikasi alert sukses/gagal",
    projectMilestone: "Semua form input SIMPUS-Mini memiliki validasi server-side dan flash message",
    tools: ["VS Code", "Browser"],
    alokasiWaktu: "150 Menit (30 menit teori validasi & session flashdata + 120 menit praktik)",
    teori: [
      {
        title: "Mengapa Validasi Sisi Server (Backend) Itu Wajib?",
        points: [
          "Validasi HTML5 di browser (atribut required) mudah dibobol atau dimatikan oleh pengguna lewat Inspect Element.",
          "Validasi Backend adalah garis pertahanan terakhir sebelum data kotor dieksekusi ke database MySQL.",
          "Aturan dasar umum: `required` (wajib isi), `min_length[3]` (minimal 3 karakter), `numeric` (wajib angka), `is_unique[tabel.kolom]` (data tidak boleh kembar).",
        ],
        explanation: "Jangan pernah percaya pada input yang dikirim dari browser (Never trust user input). Selalu validasi di sisi server.",
      },
      {
        title: "Helper old() dan Session Flashdata",
        points: [
          "old('nama_field'): Menjaga agar form tidak kosong kembali saat validasi gagal, sehingga pengguna tidak perlu mengetik ulang dari awal.",
          "Flashdata: Data session sementara yang hanya bertahan selama 1 request (sangat cocok untuk pesan 'Data berhasil disimpan!').",
        ],
        explanation: "Kombinasi old() dan pesan error membuat aplikasi terasa profesional dan ramah pengguna.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Menambahkan Aturan Validasi di Method simpan()",
        desc: "Gunakan method $this->validate() dengan rules array.",
        filePath: "app/Controllers/Buku.php",
      },
      {
        step: 2,
        title: "Menampilkan Pesan Error di Form",
        desc: "Gunakan session()->getFlashdata('errors') atau service('validation') di view.",
        filePath: "app/Views/buku/tambah.php",
      },
      {
        step: 3,
        title: "Menerapkan old() pada Atribut Value Input",
        desc: "Contoh: value=\"<?= old('judul') ?>\".",
      },
    ],
    files: [
      {
        name: "contoh_validasi_controller.php",
        lang: "php",
        code: `public function simpan()
{
    // Aturan validasi input
    $rules = [
        'judul'        => 'required|min_length[3]|max_length[255]',
        'pengarang'    => 'required|min_length[3]',
        'tahun_terbit' => 'required|numeric|exact_length[4]',
        'stok'         => 'required|numeric|greater_than_equal_to[1]',
    ];

    $messages = [
        'judul' => [
            'required'   => 'Judul buku wajib diisi.',
            'min_length' => 'Judul buku minimal terdiri dari 3 karakter.',
        ],
        'stok' => [
            'required' => 'Jumlah stok harus ditentukan.',
            'numeric'  => 'Stok harus berupa angka positif.',
        ]
    ];

    if (! $this->validate($rules, $messages)) {
        // Validasi gagal: kembalikan ke form dengan input lama dan pesan error
        return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
    }

    // Jika validasi lolos: simpan ke database
    $this->bukuModel->save([
        'judul'        => $this->request->getPost('judul'),
        'pengarang'    => $this->request->getPost('pengarang'),
        'penerbit'     => $this->request->getPost('penerbit'),
        'tahun_terbit' => $this->request->getPost('tahun_terbit'),
        'stok'         => $this->request->getPost('stok'),
    ]);

    // Berikan pesan sukses via flashdata
    return redirect()->to('/buku')->with('pesan', 'Buku baru berhasil ditambahkan!');
}`,
        description: "Contoh implementasi validasi server-side dan pesan flashdata di Controller",
      },
    ],
    simId: "p9-validasi-flash-message",
    quiz: {
      question: "Apa kegunaan dari fungsi `old('judul')` saat ditampilkan di atribut value `<input name='judul' ...>` ketika validasi form gagal?",
      options: [
        "Menampilkan kembali teks judul yang tadi sempat diketik oleh pengguna sehingga mereka tidak perlu mengetik ulang dari awal",
        "Menghapus seluruh database buku yang sudah tua",
        "Menghitung umur buku secara otomatis dari tahun terbit",
        "Menonaktifkan keamanan CSRF",
      ],
      answer: 0,
      explanation: "Fungsi old('field') mengambil nilai input yang dikirim pada request sebelumnya dari session, sehingga jika validasi gagal, form tidak menjadi kosong melompong.",
    },
    tugas: {
      title: "RTM-5: Penerapan Validasi & Flash Message",
      description: "Tambahkan validasi pada form Tambah Buku dan Edit Buku. Tampilkan pesan alert hijau jika sukses menyimpan, dan pesan merah jika ada input yang tidak sesuai aturan.",
      rubrik: [
        { criteria: "Aturan validasi server-side berjalan aktif", bobot: "40%" },
        { criteria: "Helper old() berfungsi mempertahankan isian form", bobot: "30%" },
        { criteria: "Flash message sukses/error muncul dengan jelas", bobot: "30%" },
      ],
    },
  },
  {
    no: 10,
    phase: "Fase 3: Fitur Menengah",
    title: "Relasi Antar Tabel MySQL & Query JOIN Dasar",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Merancang Relasi One-to-Many & JOIN (C3)",
    subCpmk: "Mahasiswa mampu merancang relasi One-to-Many antara tabel `kategori` dan `buku` menggunakan Foreign Key serta menampilkan datanya dengan query JOIN.",
    indikator: [
      "Mampu menjelaskan konsep relasi One-to-Many (Satu kategori memiliki banyak buku)",
      "Mampu menambahkan kolom Foreign Key `kategori_id` pada tabel `buku`",
      "Mampu membuat query SQL JOIN antara tabel `buku` dan `kategori`",
      "Mampu menampilkan nama kategori buku pada tabel daftar katalog di View",
    ],
    problemStatement: "Bagaimana aplikasi perpustakaan tahu buku 'Pemrograman PHP' masuk kategori 'Teknologi Informasi' tanpa admin harus mengetik ulang kata 'Teknologi Informasi' berkali-kali di setiap judul buku?",
    goal: "Menguasai konsep normalisasi data dasar, relasi One-to-Many, Foreign Key, dan query SQL JOIN untuk menggabungkan dua tabel di CodeIgniter 4.",
    outputPraktikum: "Daftar buku yang menampilkan kolom Nama Kategori yang diambil dari tabel `kategori` via JOIN",
    projectMilestone: "Relasi Kategori-Buku aktif dan dropdown pilihan kategori tersedia di form buku",
    tools: ["phpMyAdmin", "VS Code", "Browser"],
    alokasiWaktu: "150 Menit (40 menit teori relasi & JOIN + 110 menit praktik query JOIN di Model)",
    teori: [
      {
        title: "Konsep Relasi One-to-Many (1:N)",
        points: [
          "Satu kategori bisa memiliki banyak buku (One-to-Many).",
          "Setiap satu buku hanya terdaftar dalam satu kategori utama.",
          "Foreign Key (Kunci Tamu): Kolom `kategori_id` di tabel `buku` yang nilainya merujuk pada nilai `id` di tabel `kategori`.",
          "Keuntungan: Jika nama kategori diubah (misal dari 'IT' menjadi 'Teknologi Informasi'), kita hanya perlu mengubah 1 baris di tabel kategori, bukan ribuan baris buku.",
        ],
        explanation: "Relasi mencegah redundansi (duplikasi) data dan menjaga konsistensi database (Data Integrity).",
      },
      {
        title: "Query SQL INNER JOIN Dasar",
        points: [
          "Sintaks SQL: `SELECT buku.*, kategori.nama_kategori FROM buku JOIN kategori ON buku.kategori_id = kategori.id`",
          "Di CodeIgniter 4 Query Builder: `$this->select('buku.*, kategori.nama_kategori')->join('kategori', 'kategori.id = buku.kategori_id')`",
        ],
        explanation: "JOIN menggabungkan kolom dari dua tabel yang berbeda berdasarkan kecocokan kunci Primary Key dan Foreign Key.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Relasi di phpMyAdmin",
        desc: "Pastikan tabel kategori terisi data dan kolom buku.kategori_id bertipe INT UNSIGNED sama seperti kategori.id.",
      },
      {
        step: 2,
        title: "Menambahkan Method getBukuDenganKategori() di BukuModel",
        desc: "Gunakan Query Builder CodeIgniter 4 untuk melakukan join ke tabel kategori.",
        filePath: "app/Models/BukuModel.php",
      },
      {
        step: 3,
        title: "Membuat Dropdown Kategori di Form Tambah Buku",
        desc: "Kirim daftar kategori dari KategoriModel ke view tambah.php lalu buat elemen <select>.",
        filePath: "app/Views/buku/tambah.php",
      },
    ],
    files: [
      {
        name: "contoh_join_model.php",
        lang: "php",
        code: `// Di dalam app/Models/BukuModel.php

public function getBukuDenganKategori()
{
    return $this->select('buku.*, kategori.nama_kategori')
                ->join('kategori', 'kategori.id = buku.kategori_id', 'left')
                ->orderBy('buku.id', 'DESC')
                ->findAll();
}`,
        description: "Method model yang menggabungkan tabel buku dan kategori menggunakan LEFT JOIN",
      },
    ],
    simId: "p10-relasi-join-mysql",
    quiz: {
      question: "Pada relasi One-to-Many antara tabel 'kategori' dan tabel 'buku', di manakah kolom Foreign Key diletakkan?",
      options: [
        "Di tabel 'buku' sebagai kolom 'kategori_id'",
        "Di tabel 'kategori' sebagai kolom 'buku_id'",
        "Di dalam file CSS aplikasi",
        "Di server Apache XAMPP",
      ],
      answer: 0,
      explanation: "Pada relasi One-to-Many (1:N), Foreign Key selalu diletakkan pada tabel sisi 'Many' (banyak), yaitu tabel buku, untuk menyimpan referensi ID dari kategori induknya.",
    },
    tugas: {
      title: "RTM-6: Implementasi Relasi One-to-Many & JOIN",
      description: "Tambahkan dropdown pilihan Kategori pada form tambah buku, simpan kategori_id ke MySQL, dan tampilkan nama kategori tersebut di tabel daftar buku menggunakan query JOIN.",
      rubrik: [
        { criteria: "Dropdown kategori di form mengambil data dinamis dari tabel kategori", bobot: "35%" },
        { criteria: "Query JOIN di model berjalan mengambil nama_kategori", bobot: "35%" },
        { criteria: "Nama kategori berhasil tampil di tabel daftar buku", bobot: "30%" },
      ],
    },
  },
  {
    no: 11,
    phase: "Fase 3: Fitur Menengah",
    title: "Autentikasi Sederhana: Session-Based Login & Register",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK3: Implementasi Autentikasi Session Sederhana (C3)",
    subCpmk: "Mahasiswa mampu membuat fitur pendaftaran (register) dengan hashing password dan sistem login berbasis session di CodeIgniter 4.",
    indikator: [
      "Mampu membuat tabel `users` dengan kolom password yang di-hash menggunakan `password_hash()`",
      "Mampu membuat form register dan menyimpan akun baru ke MySQL",
      "Mampu memverifikasi login menggunakan `password_verify()`",
      "Mampu menyimpan status login di `session()->set()` dan menghapusnya saat logout",
    ],
    problemStatement: "Bagaimana sistem mengenali siapa yang sedang membuka website, sehingga data peminjaman buku tidak tertukar dengan anggota lain?",
    goal: "Menguasai konsep autentikasi berbasis session, keamanan hashing password satu arah (bcrypt), alur login/register, dan logout.",
    outputPraktikum: "Modul Register, Login, dan Logout berbasis Session berfungsi",
    projectMilestone: "Sistem login pengguna SIMPUS-Mini aktif",
    tools: ["VS Code", "Browser", "phpMyAdmin"],
    alokasiWaktu: "150 Menit (30 menit konsep session & hashing + 120 menit praktik coding Auth)",
    teori: [
      {
        title: "Perbedaan Autentikasi vs Otorisasi",
        points: [
          "Autentikasi (Authentication): 'Siapa kamu?' -> Pembuktian identitas pengguna via username/email & password.",
          "Otorisasi (Authorization): 'Apa yang boleh kamu lakukan?' -> Pembatasan hak akses berdasarkan role (misal: Admin boleh hapus buku, Anggota hanya boleh membaca/meminjam).",
        ],
        explanation: "Seseorang harus terautentikasi (login) terlebih dahulu sebelum sistem dapat mengotorisasi hak aksesnya.",
      },
      {
        title: "Keamanan Password Hashing (password_hash vs Plaintext)",
        points: [
          "FATAL: DILARANG KERAS menyimpan password dalam bentuk teks polos (plaintext) di database!",
          "Gunakan fungsi bawaan PHP: `password_hash($password, PASSWORD_DEFAULT)` yang menghasilkan hash bcrypt acak dengan salt unik.",
          "Verifikasi saat login menggunakan `password_verify($passwordInput, $passwordHashDiDB)`.",
        ],
        explanation: "Hashing adalah fungsi satu arah: jika database bocor, penyerang tidak bisa melihat kata sandi asli pengguna.",
      },
      {
        title: "Cara Kerja Session di Sisi Server",
        points: [
          "Saat login berhasil, server menyimpan data pengguna di memori server: `session()->set(['logged_in' => true, 'user_id' => $user['id'], 'role' => $user['role']])`.",
          "Server mengirimkan cookie kecil `ci_session` yang berisi ID acak ke browser pengguna.",
          "Di setiap request berikutnya, browser mengirimkan cookie tersebut sehingga server tahu pengguna sudah login.",
        ],
        explanation: "Session membuat protokol HTTP yang stateless menjadi stateful (mengingat status pengguna antar halaman).",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Tabel users di phpMyAdmin",
        desc: "Buat tabel users: id, nama, email, password (VARCHAR 255), role (ENUM 'admin', 'user').",
      },
      {
        step: 2,
        title: "Membuat Controller Auth.php",
        desc: "Siapkan method login(), prosesLogin(), register(), prosesRegister(), dan logout().",
        filePath: "app/Controllers/Auth.php",
      },
      {
        step: 3,
        title: "Membuat Form Login & Register",
        desc: "Buat view login.php dan register.php dengan CSRF token.",
        filePath: "app/Views/auth/login.php",
      },
    ],
    files: [
      {
        name: "app/Controllers/Auth.php",
        lang: "php",
        code: `<?php

namespace App\\Controllers;

use App\\Models\\UserModel;

class Auth extends BaseController
{
    public function login()
    {
        return view('auth/login');
    }

    public function prosesLogin()
    {
        $email    = $this->request->getPost('email');
        $password = $this->request->getPost('password');

        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        if ($user) {
            // Verifikasi password hash
            if (password_verify($password, $user['password'])) {
                // Set data session
                session()->set([
                    'logged_in' => true,
                    'user_id'   => $user['id'],
                    'nama'      => $user['nama'],
                    'email'     => $user['email'],
                    'role'      => $user['role'],
                ]);

                return redirect()->to('/buku')->with('pesan', 'Selamat datang kembali, ' . $user['nama'] . '!');
            }
        }

        return redirect()->back()->with('error', 'Email atau password salah!');
    }

    public function logout()
    {
        session()->destroy();
        return redirect()->to('/login')->with('pesan', 'Anda berhasil keluar dari sistem.');
    }
}`,
        description: "Controller Auth untuk login, verifikasi password hash, set session, dan logout",
      },
    ],
    simId: "p11-auth-session-login",
    quiz: {
      question: "Mengapa menyimpan kata sandi pengguna dalam bentuk teks biasa (plaintext) di tabel MySQL dianggap sebagai kesalahan fatal?",
      options: [
        "Karena jika database bocor atau diakses pihak ketiga, kata sandi seluruh pengguna langsung terbongkar tanpa perlindungan",
        "Karena MySQL akan menolak menyimpan huruf vokal pada password",
        "Karena browser tidak bisa merender halaman web jika password tidak di-hash",
        "Karena ukuran database menjadi 10 kali lipat lebih besar",
      ],
      answer: 0,
      explanation: "Password wajib di-hash menggunakan algoritma satu arah yang kuat (seperti bcrypt via password_hash) sehingga teks asli kata sandi tidak pernah disimpan di database.",
    },
    tugas: {
      title: "RTM-7: Implementasi Fitur Register & Login",
      description: "Buat tabel users, buat form register dengan password_hash(), dan buat form login yang menyimpan session login. Ujilah login dengan akun admin dan anggota.",
      rubrik: [
        { criteria: "Password tersimpan dalam bentuk hash di database MySQL", bobot: "35%" },
        { criteria: "Proses verifikasi login dan set session berfungsi", bobot: "35%" },
        { criteria: "Fungsi logout berhasil membersihkan session", bobot: "30%" },
      ],
    },
  },
  {
    no: 12,
    phase: "Fase 3: Fitur Menengah",
    title: "Otorisasi Dasar: Role Sederhana (Admin vs User) & Filter Proteksi",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK3: Implementasi Otorisasi Role & Filter Keamanan (C3)",
    subCpmk: "Mahasiswa mampu membatasi hak akses halaman berdasarkan role (Admin vs Anggota) menggunakan Filter/Middleware di CodeIgniter 4.",
    indikator: [
      "Mampu membuat Filter `AuthFilter` untuk mencegat pengunjung yang belum login",
      "Mampu membuat pengecekan role: Hanya Admin yang boleh mengakses form Tambah, Edit, dan Hapus Buku",
      "Mampu menyembunyikan tombol aksi Admin di View bagi pengguna dengan role Anggota",
      "Mampu mempresentasikan kemajuan proyek SIMPUS-Mini",
    ],
    problemStatement: "Bagaimana sistem mencegah anggota biasa membuka URL `/buku/hapus/1` dan menghapus data buku sesuka hati? Halaman manajemen harus dikunci hanya untuk role Admin!",
    goal: "Menguasai konsep otorisasi, pembuatan Filter di CodeIgniter 4, proteksi rute, dan penyembunyian elemen UI berdasarkan role.",
    outputPraktikum: "Halaman admin terproteksi aman; anggota biasa tidak bisa menambah/mengubah/menghapus data",
    projectMilestone: "Sistem autentikasi & otorisasi SIMPUS-Mini selesai (Checkpoint Pra-UAS)",
    tools: ["VS Code", "Browser"],
    alokasiWaktu: "150 Menit (30 menit teori filter/middleware + 90 menit praktik + 30 menit presentasi progress)",
    teori: [
      {
        title: "Konsep Filter / Middleware di CodeIgniter 4",
        points: [
          "Filter bertindak sebagai satpam sebelum request mencapai Controller (before filter).",
          "Jika session `logged_in` belum ada, filter langsung mengalihkan (redirect) pengguna ke halaman login dengan pesan 'Silakan login terlebih dahulu'.",
          "Jika pengguna mencoba mengakses fitur admin padahal rolenya 'user', filter dapat menolak dengan error 403 Forbidden atau redirect dengan pesan error.",
        ],
        explanation: "Filter diletakkan secara terpusat di `app/Config/Filters.php` sehingga kita tidak perlu menulis kode pengecekan session manual berulang-ulang di setiap controller.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Filter app/Filters/AuthFilter.php",
        desc: "Periksa apakah session logged_in bernilai true di dalam method before().",
        filePath: "app/Filters/AuthFilter.php",
      },
      {
        step: 2,
        title: "Mendaftarkan Filter di app/Config/Filters.php",
        desc: "Beri alias 'auth' untuk AuthFilter agar siap dipasang pada routes.",
        filePath: "app/Config/Filters.php",
      },
      {
        step: 3,
        title: "Menerapkan Filter pada Grup Route",
        desc: "Pasang ['filter' => 'auth'] pada rute /buku/tambah, /buku/edit, dan /buku/hapus.",
        filePath: "app/Config/Routes.php",
      },
      {
        step: 4,
        title: "Kondisional Tampilan Tombol di View Berdasarkan Role",
        desc: "Tampilkan tombol Tambah/Edit/Hapus hanya jika session()->get('role') === 'admin'.",
      },
    ],
    files: [
      {
        name: "app/Filters/AuthFilter.php",
        lang: "php",
        code: `<?php

namespace App\\Filters;

use CodeIgniter\\Filters\\FilterInterface;
use CodeIgniter\\HTTP\\RequestInterface;
use CodeIgniter\\HTTP\\ResponseInterface;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // Jika belum login, alihkan ke login
        if (! session()->get('logged_in')) {
            return redirect()->to('/login')->with('error', 'Silakan login terlebih dahulu untuk mengakses halaman ini.');
        }

        // Jika rute membutuhkan role admin
        if ($arguments && in_array('admin', $arguments)) {
            if (session()->get('role') !== 'admin') {
                return redirect()->to('/buku')->with('error', 'Akses ditolak: Anda bukan Admin!');
            }
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Kosong
    }
}`,
        description: "Filter keamanan untuk memeriksa status login dan otorisasi role pengguna",
      },
    ],
    simId: "p12-otorisasi-role-admin",
    asesmenTerkait: {
      nama: "Asesmen Formatif 2 (Pra-UAS)",
      bobot: "20%",
      tipe: "formatif",
    },
    quiz: {
      question: "Mengapa proteksi halaman berdasarkan role TIDAK CUKUP hanya dengan menyembunyikan tombol 'Hapus' di tampilan View?",
      options: [
        "Karena pengguna yang tahu URL langsung (misal: /buku/hapus/5) tetap bisa mengeksekusi aksi tersebut jika controller/filter di backend tidak memeriksa hak akses",
        "Karena tombol di view tidak bisa diubah warnanya",
        "Karena MySQL tidak mendukung tag HTML",
        "Supaya tampilan website lebih menarik",
      ],
      answer: 0,
      explanation: "Menyembunyikan tombol hanyalah kosmetik UI. Keamanan sejati wajib ditegakkan di sisi backend (via Filter atau pengecekan controller) untuk menggagalkan akses langsung melalui URL.",
    },
    tugas: {
      title: "ASESMEN FORMATIF 2 (Bobot 20%): Progress Project (Login+Role) + Presentasi",
      description: "Terapkan otorisasi role Admin vs Anggota pada aplikasi SIMPUS-Mini. Demonstrasikan bahwa anggota biasa tidak bisa mengakses URL tambah/edit/hapus, dan presentasikan progress proyek di depan kelas.",
      rubrik: [
        { criteria: "Fitur register & login dengan password hashing berfungsi", bobot: "30%" },
        { criteria: "Proteksi role (Admin vs User) aktif via Filter", bobot: "35%" },
        { criteria: "Kelancaran presentasi progress & tanya jawab", bobot: "35%" },
      ],
    },
  },
  {
    no: 13,
    phase: "Fase 4: Hosting & Deploy",
    title: "Pengenalan Web Hosting, Domain & Kontrol Panel (cPanel)",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK4: Pengenalan Infrastruktur Web Hosting & cPanel (C2)",
    subCpmk: "Mahasiswa mampu menjelaskan konsep web hosting, domain, nameserver, serta mengoperasikan fitur-fitur dasar cPanel (File Manager, MySQL Databases).",
    indikator: [
      "Dapat menjelaskan perbedaan antara Localhost vs Shared Hosting vs VPS",
      "Memahami fungsi Domain dan DNS (Domain Name System)",
      "Mampu mengidentifikasi direktori root web di cPanel (`public_html/`)",
      "Mampu membuat database baru dan database user di cPanel 'MySQL Databases'",
    ],
    problemStatement: "Aplikasi yang selama ini kita buat hanya berjalan di laptop sendiri (`http://localhost:8080`). Teman di tempat lain tidak bisa membukanya! Bagaimana cara membuat aplikasi bisa diakses di internet oleh siapa saja?",
    goal: "Memahami cara kerja hosting, domain, control panel cPanel, dan mempersiapkan akun hosting untuk proses deployment.",
    outputPraktikum: "Akun hosting siap pakai dengan database MySQL yang telah dibuat di cPanel",
    projectMilestone: "Infrastruktur server hosting & database online siap",
    tools: ["Browser", "cPanel Demo / Shared Hosting", "phpMyAdmin Hosting"],
    alokasiWaktu: "150 Menit (60 menit teori hosting & DNS + 90 menit eksplorasi cPanel)",
    teori: [
      {
        title: "Localhost vs Web Hosting",
        points: [
          "Localhost (127.0.0.1): Server hanya berjalan di laptop pribadi, mati saat laptop dimatikan, tidak bisa diakses publik.",
          "Web Hosting: Komputer server di data center yang menyala 24 jam nonstop dengan IP publik dan koneksi internet berkecepatan tinggi.",
          "Shared Hosting: Satu server fisik digunakan bersama oleh ratusan website, hemat biaya, dan dikelola lewat antarmuka grafis ramah pemula (cPanel).",
        ],
        explanation: "Shared hosting adalah pintu masuk terbaik bagi mahasiswa pemula untuk belajar online-kan aplikasi tanpa harus mengkonfigurasi Linux server tingkat tinggi.",
      },
      {
        title: "Peran Domain dan DNS",
        points: [
          "IP Address: Alamat numerik komputer server (misal: 103.24.56.78).",
          "Domain: Nama mudah diingat yang menggantikan IP (misal: perpustakaan-mini.my.id).",
          "DNS (Domain Name System): 'Buku telepon internet' yang menerjemahkan nama domain menjadi IP address server hosting.",
        ],
        explanation: "Domain membuat aplikasi mudah diakses dan diingat oleh dosen penguji maupun pengguna umum.",
      },
      {
        title: "Fitur Wajib cPanel untuk Backend Developer",
        points: [
          "File Manager: Mengunggah, mengekstrak file ZIP, dan mengelola struktur folder di `public_html/`.",
          "MySQL Database Wizard: Membuat database, membuat user database, dan memberikan hak akses (ALL PRIVILEGES).",
          "phpMyAdmin Hosting: Mengimpor file backup `.sql` dari localhost ke server.",
        ],
        explanation: "Ketiga fitur ini adalah kunci utama proses deployment aplikasi PHP MySQL ke shared hosting.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Login ke Dashboard cPanel",
        desc: "Akses url hosting (misal: https://cpanel.domain-anda.com) dengan username dan password yang diberikan.",
      },
      {
        step: 2,
        title: "Mengenal Struktur Direktori File Manager",
        desc: "Buka menu 'File Manager' -> Perhatikan folder `public_html/`. Semua file yang ingin dilihat pengunjung ditaruh di sini.",
      },
      {
        step: 3,
        title: "Membuat Database & User via 'MySQL Database Wizard'",
        desc: "Langkah 1: Beri nama database (contoh: u1234_simpus). Langkah 2: Buat username & password. Langkah 3: Centang 'ALL PRIVILEGES' lalu klik Next Step.",
      },
    ],
    files: [
      {
        name: "ringkasan_cpanel.txt",
        lang: "bash",
        code: `PANDUAN LOKASI BERKAS DI CPANEL:
--------------------------------------------------------
/home/username/                 -> Folder privat server (Aman, tidak bisa diakses publik)
/home/username/public_html/     -> Web Root (Hanya file publik CI4 yang ditaruh di sini)
/home/username/ci4_app/         -> Folder kode inti app/ (Direkomendasikan di luar public_html)

KREDENSIAL DATABASE CPANEL:
--------------------------------------------------------
DB Name: u1234567_simpus
DB User: u1234567_admin
DB Pass: Rahasia123!@#
Host   : localhost (Tetap localhost karena MySQL berada di mesin yang sama dengan Apache)`,
        description: "Catatan struktur folder server cPanel dan format kredensial database hosting",
      },
    ],
    simId: "p13-hosting-cpanel-intro",
    quiz: {
      question: "Pada server web hosting cPanel standar, folder manakah yang secara default menjadi Document Root yang isinya dapat diakses langsung oleh pengunjung website lewat browser?",
      options: [
        "public_html/",
        "etc/",
        "mail/",
        "ssl/",
      ],
      answer: 0,
      explanation: "Folder `public_html/` adalah web root utama pada cPanel; semua file yang diletakkan di dalamnya dapat diakses publik melalui URL domain.",
    },
    tugas: {
      title: "RTM-8A: Eksplorasi cPanel & Pembuatan Database Server",
      description: "Login ke akun cPanel latihan, buat database dan user baru via MySQL Database Wizard, simpan kredensialnya, dan ambil tangkapan layar dashboard cPanel Anda.",
      rubrik: [
        { criteria: "Berhasil login ke cPanel", bobot: "30%" },
        { criteria: "Database dan user MySQL berhasil dibuat di cPanel", bobot: "40%" },
        { criteria: "Hak akses ALL PRIVILEGES berhasil diberikan", bobot: "30%" },
      ],
    },
  },
  {
    no: 14,
    phase: "Fase 4: Hosting & Deploy",
    title: "Praktik Deployment: Upload File, Import Database & Konfigurasi Server",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK4: Melakukan Deployment Aplikasi & Database ke Hosting (C3)",
    subCpmk: "Mahasiswa mampu mengekspor database lokal, mengimpor ke server hosting, mengunggah kode aplikasi, dan mengonfigurasi koneksi database di file `.env` server.",
    indikator: [
      "Mampu melakukan export database `simpus_mini.sql` dari phpMyAdmin lokal",
      "Mampu mengimpor file `.sql` ke phpMyAdmin hosting tanpa error",
      "Mampu mengunggah file ZIP proyek dan mengekstraknya di cPanel File Manager",
      "Mampu memperbarui konfigurasi `app.baseURL` dan kredensial database di `.env` server",
      "Aplikasi berhasil dibuka secara publik melalui URL domain asli",
    ],
    problemStatement: "Setelah database dan akun hosting siap, bagaimana memindahkan seluruh kode aplikasi dari laptop ke server dan menghubungkan database online-nya agar tidak muncul '500 Server Error'?",
    goal: "Mahasiswa berhasil men-deploy aplikasi CodeIgniter 4 dan database MySQL ke web hosting hingga aplikasi dapat diakses secara online (live URL).",
    outputPraktikum: "Aplikasi SIMPUS-Mini BERHASIL ONLINE di internet dan bisa diakses dosen/teman",
    projectMilestone: "Aplikasi SIMPUS-Mini resmi LIVE di Web Hosting!",
    tools: ["phpMyAdmin Lokal & Hosting", "cPanel File Manager", "Browser"],
    alokasiWaktu: "150 Menit (20 menit panduan deployment + 130 menit live deployment & troubleshooting bersama)",
    teori: [
      {
        title: "Trik Penataan Folder CodeIgniter 4 di Shared Hosting (cPanel)",
        points: [
          "Opsi 1 (Paling Aman): Letakkan folder `app/`, `vendor/`, `writable/`, `system/` di `/home/username/ci_project/`, dan pindahkan isi folder `public/*` ke dalam `/home/username/public_html/`.",
          "Opsi 2 (.htaccess Redirect): Seluruh folder proyek ditaruh di `public_html/` dengan file `.htaccess` yang meneruskan request ke folder `public/`.",
          "Perbarui path `index.php` di public_html agar merujuk ke lokasi folder `app` yang tepat.",
        ],
        explanation: "Pemisahan folder menjamin keamanan kode sumber agar file konfigurasi .env tidak bisa diunduh oleh pengunjung luar.",
      },
      {
        title: "Langkah Penyesuaian Berkas .env di Server",
        points: [
          "Ubah `CI_ENVIRONMENT = production` (agar pesan error sistem tidak mengekspos username database ke publik jika ada error).",
          "Ubah `app.baseURL = 'https://namadomain-anda.my.id/'` (gunakan protokol HTTPS).",
          "Isi `database.default.database`, `username`, dan `password` sesuai kredensial yang tadi dibuat di cPanel MySQL Wizard.",
        ],
        explanation: "Koneksi database lokal berbeda dengan hosting: username biasanya memiliki prefix akun cPanel (contoh: u1234_admin).",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Export Database MySQL Lokal",
        desc: "Buka phpMyAdmin lokal -> Pilih database simpus_mini -> Klik tab 'Export' -> Pilih Quick -> Klik Export (download file .sql).",
      },
      {
        step: 2,
        title: "Import Database ke phpMyAdmin Hosting",
        desc: "Buka phpMyAdmin di cPanel -> Pilih database hosting yang tadi dibuat -> Klik tab 'Import' -> Pilih file .sql -> Klik Import.",
      },
      {
        step: 3,
        title: "Kompres Proyek Lokal ke ZIP (Kecuali folder vendor jika internet lambat)",
        desc: "Di laptop, kompres folder simpus-mini menjadi simpus-mini.zip.",
      },
      {
        step: 4,
        title: "Upload & Ekstrak di cPanel File Manager",
        desc: "Upload simpus-mini.zip ke cPanel File Manager -> Klik kanan file ZIP -> Pilih 'Extract'.",
      },
      {
        step: 5,
        title: "Edit Konfigurasi .env di Server",
        desc: "Buka file .env di cPanel File Manager -> Klik 'Edit' -> Sesuaikan baseURL dan nama database hosting.",
      },
      {
        step: 6,
        title: "Uji Coba Live URL di Browser HP / Teman",
        desc: "Buka alamat web di browser, coba lakukan login dan tambah buku baru secara online.",
      },
    ],
    files: [
      {
        name: ".env.production",
        lang: "env",
        code: `# Konfigurasi Server Produksi cPanel
CI_ENVIRONMENT = production

# URL Domain Live
app.baseURL = 'https://simpus-mini.mhs.latihan.my.id/'

# Database Server Hosting (Gunakan kredensial cPanel Anda)
database.default.hostname = localhost
database.default.database = u1234567_simpus
database.default.username = u1234567_admin
database.default.password = PasswordSuperAman2024!
database.default.DBDriver = MySQLi
database.default.port = 3306`,
        description: "Contoh konfigurasi .env production pada web hosting cPanel",
      },
    ],
    simId: "p14-deployment-upload-mysql",
    quiz: {
      question: "Mengapa di server hosting live (produksi), nilai `CI_ENVIRONMENT` pada berkas `.env` wajib diset ke `production` dan bukan `development`?",
      options: [
        "Agar jika terjadi error, detail kredensial database dan baris kode sensitif tidak ditampilkan secara terbuka kepada pengunjung asing di internet",
        "Supaya warna tampilan website menjadi lebih terang",
        "Karena server hosting tidak mendukung PHP",
        "Agar Apache otomatis mematikan komputer server",
      ],
      answer: 0,
      explanation: "Mode development menampilkan Whoops/Debug page yang membocorkan path server, variabel env, dan query database. Di lingkungan publik wajib menggunakan mode production demi keamanan informasi.",
    },
    tugas: {
      title: "RTM-8B: Deployment Proyek ke Web Hosting",
      description: "Upload aplikasi SIMPUS-Mini dan import database ke hosting. Pastikan aplikasi dapat dibuka secara publik melalui URL hosting dan fitur CRUD berfungsi normal.",
      rubrik: [
        { criteria: "Database berhasil di-import ke MySQL server hosting", bobot: "30%" },
        { criteria: "Aplikasi berhasil online tanpa HTTP 500 error", bobot: "40%" },
        { criteria: "Fitur CRUD dan Login berfungsi normal di server online", bobot: "30%" },
      ],
    },
  },
  {
    no: 15,
    phase: "Fase 4: Hosting & Deploy",
    title: "Finalisasi Proyek, Live Debugging & Dokumentasi Sederhana",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK4 & CPMK5: Debugging & Penyusunan Dokumentasi (C3/C4)",
    subCpmk: "Mahasiswa mampu melakukan debugging terhadap error umum deployment dan menyusun dokumen panduan penggunaan aplikasi sederhana.",
    indikator: [
      "Mampu mendiagnosis dan menyelesaikan error umum (HTTP 500, Database Access Denied, 404 Route Not Found)",
      "Mampu menyusun dokumen README sederhana (panduan instalasi, akun demo admin & user)",
      "Memastikan seluruh data dummy pengujian bersih dan siap dinilai",
      "Menyiapkan slide presentasi singkat untuk Ujian Akhir Semester (UAS)",
    ],
    problemStatement: "Bagaimana cara orang lain (seperti dosen penguji) bisa memahami dan menggunakan aplikasi yang kamu buat tanpa perlu kamu dampingi sepanjang waktu?",
    goal: "Melakukan klinik debugging bersama dosen, merapikan kode, dan menyusun laporan/dokumentasi sederhana penggunaan aplikasi.",
    outputPraktikum: "Dokumen README/Laporan Penggunaan dan Aplikasi siap uji untuk UAS",
    projectMilestone: "Aplikasi 100% selesai, online, stabil, dan terdokumentasi",
    tools: ["VS Code", "Word / Google Docs / Markdown", "Browser"],
    alokasiWaktu: "150 Menit (Full praktik klinik debugging & review dokumentasi)",
    teori: [
      {
        title: "Checklist Troubleshooting Error Umum Hosting",
        points: [
          "HTTP 500 Internal Server Error: Periksa permission folder `writable/` (wajib 755 atau 777), cek error log di cPanel File Manager.",
          "Access Denied for user 'root'@'localhost': Lupa mengganti username database lokal di file `.env` hosting.",
          "404 Not Found pada Rute selain Beranda: Module `mod_rewrite` Apache belum aktif atau file `.htaccess` tidak ikut terunggah.",
        ],
        explanation: "Penyebab error di hosting 90% berasal dari salah kredensial database di .env atau file .htaccess yang lupa disalin.",
      },
      {
        title: "Struktur Dokumentasi Sederhana Ramah Dosen/Pengguna",
        points: [
          "1. Judul Aplikasi & Deskripsi Singkat.",
          "2. Live URL Publik & Akun Pengujian (Email & Password Admin dan User).",
          "3. Fitur Utama Aplikasi (CRUD, Validasi, Relasi, Role).",
          "4. Petunjuk Instalasi Lokal (jika ingin dijalankan di laptop penguji).",
          "5. Tangkapan Layar (Screenshot) setiap halaman fitur utama.",
        ],
        explanation: "Dokumentasi yang rapi menunjukkan profesionalitas dan mempermudah dosen memberikan nilai maksimal.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Pengecekan Folder writable/ Permission",
        desc: "Pastikan folder writable/cache, writable/logs, dan writable/session dapat ditulis oleh server (Permission 755/775).",
      },
      {
        step: 2,
        title: "Uji Skenario Pengguna (End-to-End Test)",
        desc: "1. Login sebagai Admin -> Tambah buku baru -> Edit -> Hapus. 2. Login sebagai Anggota -> Pastikan tidak ada tombol edit/hapus.",
      },
      {
        step: 3,
        title: "Menulis File README.md",
        desc: "Tuliskan panduan singkat penggunaan dan cantumkan akun demo.",
        filePath: "README.md",
      },
    ],
    files: [
      {
        name: "README.md",
        lang: "bash",
        code: `# SIMPUS-Mini (Sistem Informasi Perpustakaan Mini)
Aplikasi Web Backend Dasar berbasis PHP 8 & CodeIgniter 4 dengan Database MySQL.

## 🌐 Live URL
- Link Aplikasi: https://simpus-mini.mhs.latihan.my.id/

## 🔑 Akun Demo Pengujian
| Role | Email | Password |
|---|---|---|
| **Admin** | admin@simpus.local | admin123 |
| **Anggota** | budi@gmail.com | user123 |

## 🚀 Fitur Utama
1. Autentikasi: Register & Session-based Login (Password Hashing bcrypt).
2. Otorisasi: Role Admin (Kelola Buku & Kategori) vs User (Katalog & Detail).
3. CRUD Buku: Tambah, Lihat Daftar, Detail, Edit, Hapus (dengan konfirmasi).
4. Validasi Form: Server-side validation dan Flash Messages sukses/gagal.
5. Relasi MySQL: Relasi One-to-Many tabel kategori dan buku dengan query JOIN.
6. Deployment: Terpasang online di cPanel Shared Hosting dengan MySQL live.`,
        description: "Contoh format dokumentasi sederhana README.md yang wajib disertakan untuk penilaian",
      },
    ],
    simId: "p15-debugging-dokumentasi",
    quiz: {
      question: "Jika setelah mengunggah aplikasi CodeIgniter 4 ke hosting halaman beranda bisa terbuka, namun saat mengklik link `/buku` muncul error 404 Not Found, apa penyebab paling umum?",
      options: [
        "File `.htaccess` di folder public/ tidak ikut terunggah atau tersembunyi (hidden file) sehingga fitur rewrite URL Apache tidak bekerja",
        "Monitor laptop pengguna rusak",
        "MySQL kehabisan RAM",
        "CSS belum dikompilasi",
      ],
      answer: 0,
      explanation: "Berkas yang diawali dengan titik seperti `.htaccess` sering tersembunyi (hidden file) di sistem operasi, sehingga saat dikompres tidak terbawa. Tanpa `.htaccess`, Apache tidak bisa mengarahkan URL rute ke `index.php`.",
    },
    tugas: {
      title: "RTM-9: Penyusunan Laporan & Dokumentasi Proyek",
      description: "Tuliskan laporan ringkas penggunaan aplikasi beserta akun demo pengujian, tautan live URL, dan tangkapan layar fitur-fitur utama sebagai persiapan sidang UAS.",
      rubrik: [
        { criteria: "Kelengkapan informasi akun demo & URL live", bobot: "40%" },
        { criteria: "Kerapian petunjuk penggunaan dan screenshot", bobot: "30%" },
        { criteria: "Aplikasi bebas dari bug fatal", bobot: "30%" },
      ],
    },
  },
  {
    no: 16,
    phase: "UAS",
    title: "UJIAN AKHIR SEMESTER (UAS): Demo Aplikasi Live di Hosting & Presentasi",
    sks: "3 SKS (Presentasi & Demo Live)",
    cpmk: "CPMK4 & CPMK5: Presentasi & Demo Aplikasi Live di Web Hosting (C4)",
    subCpmk: "Mahasiswa mampu mendemonstrasikan aplikasi web backend hasil karya sendiri secara live di internet, menjelaskan logika kode program, dan menjawab pertanyaan teknis.",
    indikator: [
      "Aplikasi berhasil dibuka secara publik melalui URL web hosting aktif tanpa error",
      "Fitur wajib (CRUD, Validasi, Relasi One-to-Many, Session Auth, Role Admin-User) berjalan lancar saat didemokan langsung",
      "Mampu menjelaskan alur kerja kode (MVC, Query SQL, Controller, Route) saat sesi tanya jawab",
      "Laporan akhir dan repositori kode terkumpul rapi tepat waktu",
    ],
    problemStatement: "Momen pembuktian! Tunjukkan karyamu kepada dunia: aplikasi web backend yang kamu bangun dari nol kini telah online dan berfungsi secara nyata di internet!",
    goal: "Mahasiswa membuktikan pencapaian seluruh Capaian Pembelajaran Mata Kuliah (CPMK 1-5) melalui demonstrasi langsung dan ujian lisan.",
    outputPraktikum: "Nilai Akhir Kelulusan Mata Kuliah Sistem Aplikasi Web (Backend Dasar)",
    projectMilestone: "Penyelesaian 100% Mata Kuliah Sistem Aplikasi Web (Backend Dasar)",
    tools: ["Browser Laptop/HP", "Proyektor / Screen Share", "Laporan Akhir"],
    alokasiWaktu: "150 Menit (Presentasi kelompok/individu, demo live, dan tanya jawab teknis)",
    teori: [
      {
        title: "Rubrik Evaluasi Ujian Akhir Semester (Bobot 35%)",
        points: [
          "1. Keberhasilan Akses Live (25%): Aplikasi dapat dibuka lancar via domain hosting.",
          "2. Kelengkapan Fitur (35%): CRUD, Relasi JOIN, Validasi, Session Login & Role Admin berjalan 100%.",
          "3. Penguasaan Konsep & Tanya Jawab (25%): Mahasiswa dapat menjelaskan alasan dan alur kode yang mereka tulis.",
          "4. Kualitas Dokumentasi & Kerapian Kode (15%): Laporan rapi, penamaan variabel konsisten, struktur folder sesuai standar.",
        ],
        explanation: "Penilaian berorientasi pada fungsionalitas dan pemahaman logika kerja backend, bukan pada kerumitan animasi grafis.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuka URL Live di Browser",
        desc: "Ketik URL hosting aplikasi di depan penguji (misal: https://simpus-mini.mhs.latihan.my.id).",
      },
      {
        step: 2,
        title: "Mendemonstrasikan Skenario Lengkap",
        desc: "1. Tunjukkan halaman landing page. 2. Lakukan pendaftaran akun baru. 3. Login sebagai Admin dan tambahkan buku baru. 4. Buka phpMyAdmin hosting untuk memperlihatkan data tersimpan di MySQL. 5. Logout dan login sebagai User untuk memperlihatkan pembatasan role.",
      },
      {
        step: 3,
        title: "Menjawab Pertanyaan Teknis Dosen",
        desc: "Jelaskan bagaimana Controller berinteraksi dengan Model dan mengapa query JOIN dibutuhkan.",
      },
    ],
    files: [
      {
        name: "lembar_penilaian_uas.txt",
        lang: "bash",
        code: `LEMBAR PENILAIAN ASESMEN SUMATIF 2 (UAS - BOBOT 35%):
-------------------------------------------------------------------------
Nama Mahasiswa : _______________________
NIM            : _______________________
Live URL       : https://______________________

KOMPONEN PENILAIAN:
[ ] 1. Keberhasilan Akses Live di Hosting (Skor: 0 - 25)
[ ] 2. Kelengkapan Fitur CRUD + Relasi + Auth + Role (Skor: 0 - 35)
[ ] 3. Pemahaman Konsep saat Tanya Jawab Lisan (Skor: 0 - 25)
[ ] 4. Kualitas Dokumentasi / Laporan Akhir (Skor: 0 - 15)

TOTAL SKOR UAS : ______ / 100
Catatan Dosen  : Mahasiswa berhasil menyelesaikan proyek backend pemula sesuai standar OBE.`,
        description: "Format lembar rubrik penilaian dosen untuk ujian akhir semester",
      },
    ],
    simId: "p16-uas-demo-hosting",
    asesmenTerkait: {
      nama: "Asesmen Sumatif 2 (UAS)",
      bobot: "35%",
      tipe: "sumatif",
    },
    quiz: {
      question: "Apa kriteria paling esensial yang membuktikan bahwa mahasiswa telah menguasai kompetensi dasar backend web pada mata kuliah ini?",
      options: [
        "Mampu membangun aplikasi CRUD lengkap dengan basis data MySQL, menerapkan login session & role sederhana, serta berhasil men-deploy-nya hingga online di web hosting",
        "Mampu menghafal seluruh kode tanpa memahami fungsinya",
        "Hanya membuat tampilan CSS tanpa menghubungkannya ke database",
        "Membeli template website siap pakai tanpa mengetahui cara kerja backend",
      ],
      answer: 0,
      explanation: "Target akhir OBE mata kuliah ini adalah mahasiswa mampu secara mandiri merancang database MySQL, membangun operasi CRUD dan login session, serta men-deploy aplikasinya ke web hosting hingga dapat diakses di internet.",
    },
    tugas: {
      title: "ASESMEN SUMATIF 2 (UAS - Bobot 35%): Demo Live + Laporan + Tanya Jawab",
      description: "Demonstrasikan aplikasi web backend Anda yang sudah live di hosting, jawab pertanyaan teknis penguji seputar alur kode MVC dan query database, serta kumpulkan laporan akhir lengkap.",
      rubrik: [
        { criteria: "Aplikasi live di hosting dapat diakses lancar", bobot: "25%" },
        { criteria: "Kelengkapan seluruh fitur wajib (CRUD+Relasi+Auth+Role)", bobot: "35%" },
        { criteria: "Penguasaan konsep dan kemampuan menjawab tanya jawab", bobot: "25%" },
        { criteria: "Kualitas dokumen laporan akhir", bobot: "15%" },
      ],
    },
  },
];
