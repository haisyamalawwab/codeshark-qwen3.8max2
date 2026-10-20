/* ==========================================================================
   KURIKULUM SISTEM APLIKASI WEB - BACKEND DASAR (PHP & MYSQL NATIVE)
   3 SKS (1 Teori + 2 Praktikum) | Semester 3 (SI/TI) & 5 (TI) | Level Pemula
   Fokus Utama: PHP 8 Native, Database MySQL, phpMyAdmin & Web Hosting cPanel
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
  { id: "CPMK1", desc: "Mampu menjelaskan konsep dasar arsitektur web client-server dan siklus HTTP request-response dengan runtime PHP (C2)" },
  { id: "CPMK2", desc: "Mampu merancang basis data relasional MySQL dan mengimplementasikan operasi CRUD lengkap dengan PHP 8 Native (C3)" },
  { id: "CPMK3", desc: "Mampu mengimplementasikan keamanan form, validasi server-side, sanitasi XSS/SQLi, dan autentikasi session PHP (C3)" },
  { id: "CPMK4", desc: "Mampu men-deploy aplikasi web PHP dan database MySQL ke layanan shared hosting cPanel serta mengonfigurasi domain (C3)" },
  { id: "CPMK5", desc: "Mampu menyelesaikan proyek aplikasi backend mandiri (SIMPUS-Mini) sesuai standar industri dasar (C4)" },
];

export const CI_BACKEND_MEETINGS: BackendMeeting[] = [
  {
    no: 1,
    phase: "Fase 1: Setup & Dasar",
    title: "Pengantar Arsitektur Web & HTTP Request-Response",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK1: Menjelaskan konsep dasar arsitektur aplikasi web (C2)",
    subCpmk: "Mahasiswa mampu menjelaskan konsep arsitektur client-server dan siklus HTTP request-response pada aplikasi web PHP.",
    indikator: [
      "Dapat menggambarkan bagan alur HTTP request-response antara browser, Apache, PHP, dan MySQL",
      "Dapat membedakan peran frontend (tampilan di browser) dan backend (eksekusi di server)",
      "Memahami HTTP method dasar (GET untuk membaca, POST untuk mengirim data sensitif/form)",
    ],
    problemStatement: "Saat kamu membuka website perpustakaan di laptop dan mengklik tombol 'Cari Buku', siapa yang memproses permintaan tersebut dan mengirimkan hasilnya kembali?",
    goal: "Memahami konsep client-server, cara browser berkomunikasi dengan web server Apache & PHP, serta gambaran proyek akhir SIMPUS-Mini.",
    outputPraktikum: "Diagram alur request-response dan rancangan ide proyek PjBL SIMPUS-Mini",
    projectMilestone: "Pemahaman arsitektur dan inisialisasi brief proyek SIMPUS-Mini",
    tools: ["Browser Chrome/Firefox", "Diagram Arsitektur", "VS Code"],
    alokasiWaktu: "150 Menit (50 menit teori + 100 menit studi kasus & diskusi)",
    teori: [
      {
        title: "Arsitektur Client-Server & Alur PHP",
        points: [
          "Client (Browser): Mengirim HTTP Request (URL, Headers, Data) ke server.",
          "Web Server (Apache Port 80): Menerima request dan meneruskannya ke PHP Interpreter.",
          "PHP Script: Mengeksekusi logika bisnis, memeriksa session, dan mengeksekusi query database.",
          "MySQL Database (Port 3306): Menyimpan dan mengambil record tabel secara terstruktur.",
          "HTTP Response: Server mengirimkan kembali status code (200 OK) beserta markup HTML murni.",
        ],
        explanation: "Kode PHP dieksekusi 100% di server. Pengunjung di browser hanya menerima hasil render HTML-nya saja, sehingga kode sumber dan password database aman.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Inspeksi Jaringan Browser (Network Tab)",
        desc: "Buka DevTools Chrome (F12) -> Tab Network -> Akses halaman web apa pun. Amati Request Method, Status Code, dan Response Headers.",
      },
      {
        step: 2,
        title: "Mempelajari Perbedaan GET vs POST",
        desc: "GET menaruh parameter di URL (cocok untuk search/paging), sedangkan POST menaruh data di body (wajib untuk form login & tambah data).",
      },
    ],
    files: [
      {
        name: "arsitektur_alur_php.txt",
        lang: "bash",
        code: `[Browser Client]
     │
     │ 1. HTTP GET /katalog.php?search=php
     ▼
[Web Server Apache (Port 80)]
     │
     │ 2. Parsing skrip PHP
     ▼
[PHP Engine: katalog.php]
     │
     │ 3. Query SELECT data
     ▼
[MySQL Server (Port 3306)]
     │
     │ 4. Mengembalikan baris data
     ▼
[PHP merender HTML dinamis]
     │
     │ 5. HTTP Response 200 OK + HTML
     ▼
[Browser merender tampilan web]`,
        description: "Alur siklus 5 tahap pemrosesan PHP dan MySQL",
      },
    ],
    simId: "p1-arsitektur-client-server",
    quiz: {
      question: "Di manakah kode PHP dieksekusi ketika seorang pengguna membuka halaman website?",
      options: [
        "Dieksekusi di komputer server oleh PHP interpreter sebelum dikirimkan sebagai HTML ke browser",
        "Dieksekusi di browser pengguna bersama JavaScript",
        "Dieksekusi di dalam harddisk pengguna oleh sistem operasi Windows",
        "PHP tidak perlu dieksekusi karena langsung dibaca oleh CSS",
      ],
      answer: 0,
      explanation: "PHP adalah bahasa server-side yang seluruh baris kodenya diterjemahkan di server, lalu hasilnya dikirimkan berupa dokumen HTML biasa ke browser klien.",
    },
    tugas: {
      title: "RTM-1: Analisis Alur Request-Response & Identitas Proyek SIMPUS-Mini",
      description: "Tuliskan ringkasan alur request-response saat pengguna melakukan login ke web PHP. Gambarkan apa yang dikirim oleh form, apa yang diperiksa skrip PHP, dan response apa yang dikirimkan.",
      rubrik: [
        { criteria: "Ketepatan penjelasan alur HTTP Request dan Response", bobot: "50%" },
        { criteria: "Pemahaman perbedaan data di URL (GET) vs Body (POST)", bobot: "30%" },
        { criteria: "Kerapian ringkasan identitas proyek PjBL", bobot: "20%" },
      ],
    },
  },
  {
    no: 2,
    phase: "Fase 1: Setup & Dasar",
    title: "Instalasi Environment PHP 8 & Web Server XAMPP",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK1: Setup & Konfigurasi Lingkungan Server Lokal (C3)",
    subCpmk: "Mahasiswa mampu melakukan instalasi dan konfigurasi XAMPP (Apache & MySQL) serta mengelola folder web root htdocs.",
    indikator: [
      "Berhasil menjalankan service Apache & MySQL melalui XAMPP Control Panel",
      "Memverifikasi instalasi PHP versi 8.1+ di Command Prompt / Terminal",
      "Membuat folder project di htdocs dan mengaksesnya via http://localhost/",
    ],
    problemStatement: "Mengapa berkas .php tidak bisa dibuka dengan cara klik ganda seperti membuka gambar atau file Word? Di manakah letak folder khusus tempat meletakkan skrip PHP?",
    goal: "Menguasai cara mengaktifkan web server Apache, memahami peran DocumentRoot htdocs, dan menjalankan skrip PHP pertama.",
    outputPraktikum: "Halaman pengujian info.php berjalan sukses di http://localhost/simpus-mini/",
    projectMilestone: "Inisialisasi struktur folder kerja proyek SIMPUS-Mini di htdocs",
    tools: ["XAMPP / Laragon", "PHP 8.2+", "VS Code", "Browser"],
    alokasiWaktu: "150 Menit (30 menit teori + 120 menit hands-on instalasi)",
    teori: [
      {
        title: "Peran XAMPP & Folder htdocs",
        points: [
          "Apache: Web server yang bertugas menerima dan melayani request HTTP port 80.",
          "htdocs: Satu-satunya folder yang dipublikasikan oleh Apache ke alamat http://localhost/.",
          "PHP Built-in Server: Opsi praktis menjalankan server tanpa XAMPP via perintah `php -S localhost:8000`.",
        ],
        explanation: "Setiap file yang diletakkan di luar folder htdocs tidak akan bisa diakses melalui URL web browser.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Cek Versi PHP di Terminal",
        command: "php -v",
        desc: "Pastikan PHP versi 8.1 ke atas sudah terdeteksi di sistem.",
      },
      {
        step: 2,
        title: "Membuat Folder Proyek di htdocs",
        command: "mkdir C:\\xampp\\htdocs\\simpus-mini",
        desc: "Buat folder kerja proyek simpus-mini di dalam direktori web root htdocs.",
      },
      {
        step: 3,
        title: "Menjalankan PHP Server Alternatif (CLI)",
        command: "php -S localhost:8000",
        desc: "Jalankan built-in development server PHP jika ingin menguji proyek tanpa XAMPP penuh.",
      },
    ],
    files: [
      {
        name: "index.php",
        lang: "php",
        code: `<?php
// Pengujian server lokal PHP
echo "<h1>SIMPUS-Mini - Server PHP Siap!</h1>";
echo "<p>Versi PHP: " . phpversion() . "</p>";
echo "<p>Waktu Server: " . date('Y-m-d H:i:s') . "</p>";
?>`,
        description: "Skrip pengujian perdana konektivitas web server PHP",
      },
    ],
    simId: "p2-setup-php-xampp",
    quiz: {
      question: "Pada paket instalasi XAMPP di Windows, di folder manakah berkas website PHP harus diletakkan agar bisa dibuka lewat http://localhost/?",
      options: [
        "C:\\xampp\\htdocs\\",
        "C:\\xampp\\php\\",
        "C:\\Windows\\System32\\",
        "C:\\Program Files\\Apache\\",
      ],
      answer: 0,
      explanation: "Folder htdocs (HyperText Documents) adalah DocumentRoot standar Apache pada XAMPP tempat seluruh berkas web dieksekusi.",
    },
    tugas: {
      title: "RTM-2: Setup Server XAMPP & Berkas info.php",
      description: "Nyalakan Apache di XAMPP, buat folder simpus-mini di htdocs, buat file info.php dan capture tangkapan layar browser yang menampilkan info PHP.",
      rubrik: [
        { criteria: "Apache menyala sukses di port 80/8080", bobot: "50%" },
        { criteria: "Skrip PHP dieksekusi sempurna di browser", bobot: "30%" },
        { criteria: "Tangkapan layar rapi dan jelas", bobot: "20%" },
      ],
    },
  },
  {
    no: 3,
    phase: "Fase 1: Setup & Dasar",
    title: "Dasar Sintaks PHP: Variabel, Array Associative & Modularitas",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK1: Memahami sintaks dasar PHP dan modularisasi kode (C3)",
    subCpmk: "Mahasiswa mampu menggunakan variabel, tipe data, array associative, perulangan, dan pemecahan file header/footer dengan require_once.",
    indikator: [
      "Mampu mendeklarasikan variabel dan array associative di PHP 8",
      "Mampu melakukan looping foreach untuk menampilkan data ke tabel HTML",
      "Mampu memecah layout website menjadi header.php dan footer.php menggunakan require_once",
    ],
    problemStatement: "Bagaimana cara membuat tampilan web yang konsisten di semua halaman tanpa harus menulis ulang kode navbar dan footer berulang-ulang?",
    goal: "Menguasai sintaks PHP dasar, array associative (penampung data record), dan konsep modularitas include/require.",
    outputPraktikum: "Struktur layout modular (header, konten, footer) dengan data tabel dinamis",
    projectMilestone: "Pembuatan kerangka template antarmuka dasar SIMPUS-Mini",
    tools: ["VS Code", "Browser", "PHP 8"],
    alokasiWaktu: "150 Menit (30 menit teori + 120 menit praktik penulisan kode)",
    teori: [
      {
        title: "Modularisasi Menggunakan require_once",
        points: [
          "require_once memastikan file template (header/footer) hanya dimuat satu kali dan memunculkan fatal error jika file tidak ditemukan.",
          "Mempermudah perawatan: jika logo atau menu navigasi berubah, kita cukup mengubah satu file header.php.",
        ],
        explanation: "Konsep DRY (Don't Repeat Yourself) adalah prinsip utama rekayasa perangkat lunak backend.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Folder templates/",
        desc: "Buat subfolder templates/ di dalam simpus-mini untuk menampung komponen antarmuka yang dipakai berulang.",
      },
      {
        step: 2,
        title: "Membuat templates/header.php dan footer.php",
        desc: "Pisahkan bagian pembuka HTML (header) dan penutup HTML (footer).",
      },
      {
        step: 3,
        title: "Menggabungkan Template di index.php",
        desc: "Gunakan sintaks require_once 'templates/header.php' di awal file dan footer di akhir file.",
      },
    ],
    files: [
      {
        name: "templates/header.php",
        lang: "php",
        code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title><?= $judul_halaman ?? 'SIMPUS-Mini' ?></title>
    <style>
        body { font-family: sans-serif; margin: 2rem; background: #f8fafc; }
        header { border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 20px; }
        nav a { margin-right: 15px; text-decoration: none; font-weight: bold; color: #0284c7; }
    </style>
</head>
<body>
    <header>
        <h2>📚 SIMPUS-Mini Kampus</h2>
        <nav>
            <a href="index.php">Katalog Buku</a>
            <a href="tambah.php">+ Tambah Buku</a>
            <a href="kategori.php">Kategori</a>
            <a href="login.php">Login</a>
        </nav>
    </header>
    <main>`,
        description: "Template header modular pembuka dokumen HTML",
      },
      {
        name: "templates/footer.php",
        lang: "php",
        code: `    </main>
    <footer style="margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px; color: #64748b;">
        <p>&copy; <?= date('Y') ?> SIMPUS-Mini - Sistem Informasi Perpustakaan Berbasis PHP Native & MySQL.</p>
    </footer>
</body>
</html>`,
        description: "Template footer modular penutup dokumen HTML",
      },
    ],
    simId: "p3-sintaks-array-modular",
    quiz: {
      question: "Apa fungsi utama dari perintah `require_once 'templates/header.php'` dalam pemrograman PHP?",
      options: [
        "Menyisipkan isi file header.php ke halaman saat ini dan memastikan file tersebut hanya dimuat satu kali",
        "Menghapus file header.php dari server setelah dibaca",
        "Mengunggah file header.php ke database MySQL",
        "Mengeksekusi JavaScript di komputer klien",
      ],
      answer: 0,
      explanation: "require_once menyisipkan berkas eksternal dan mencegah kesalahan duplikasi deklarasi fungsi jika file terpanggil lebih dari satu kali.",
    },
    tugas: {
      title: "RTM-3: Desain Template Modular & Data Array Dinamis",
      description: "Buat header.php, footer.php, dan tampilkan array buku berisi 4 judul menggunakan foreach di index.php.",
      rubrik: [
        { criteria: "Template modular terpisah dengan benar", bobot: "40%" },
        { criteria: "Array associative berhasil dirender ke tabel HTML", bobot: "40%" },
        { criteria: "Kerapian styling CSS dasar", bobot: "20%" },
      ],
    },
  },
  {
    no: 4,
    phase: "Fase 1: Setup & Dasar",
    title: "Perancangan Basis Data MySQL, phpMyAdmin & Skema SIMPUS-Mini",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Merancang Basis Data Relasional MySQL (C3)",
    subCpmk: "Mahasiswa mampu merancang tabel relasional, tipe data SQL, primary key, foreign key, dan mengeksekusi DDL via phpMyAdmin.",
    indikator: [
      "Memahami tipe data SQL: INT, VARCHAR, TEXT, ENUM, TIMESTAMP",
      "Mampu membuat database simpus_mini dan tabel kategori, buku, users",
      "Membuat relasi Foreign Key antara tabel buku dan kategori",
    ],
    problemStatement: "Mengapa sistem perpustakaan membutuhkan basis data relasional dan tidak cukup hanya disimpan dalam file teks biasa?",
    goal: "Mampu menyusun skema tabel normalisasi 1:N dan mengeksekusi script SQL DDL melalui antarmuka phpMyAdmin.",
    outputPraktikum: "Database simpus_mini aktif di phpMyAdmin dengan 3 tabel relasional",
    projectMilestone: "Pembuatan skema database relasional proyek SIMPUS-Mini",
    tools: ["phpMyAdmin", "MySQL Server", "SQL DDL"],
    alokasiWaktu: "150 Menit (40 menit teori ERD + 110 menit eksekusi SQL di phpMyAdmin)",
    teori: [
      {
        title: "Konsep Relasi Tabel One-to-Many (1:N)",
        points: [
          "Satu kategori dapat menaungi banyak buku (One-to-Many).",
          "Tabel induk: `kategori` (Primary Key: id).",
          "Tabel anak: `buku` (Foreign Key: kategori_id).",
        ],
        explanation: "Foreign key menjamin konsistensi data (integritas referensial), mencegah buku memiliki ID kategori fiktif yang tidak terdaftar.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Buka phpMyAdmin di Browser",
        desc: "Ketik URL http://localhost/phpmyadmin/ dan buka tab SQL.",
      },
      {
        step: 2,
        title: "Eksekusi Script DDL",
        desc: "Salin dan jalankan script SQL pembuatan database dan tabel simpus_mini.",
      },
    ],
    files: [
      {
        name: "simpus_mini_schema.sql",
        lang: "sql",
        code: `CREATE DATABASE IF NOT EXISTS simpus_mini;
USE simpus_mini;

CREATE TABLE IF NOT EXISTS kategori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    keterangan TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buku (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kategori_id INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    pengarang VARCHAR(150) NOT NULL,
    penerbit VARCHAR(150) NOT NULL,
    tahun_terbit INT NOT NULL,
    stok INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO kategori (id, nama_kategori, keterangan) VALUES
(1, 'Teknologi Informasi', 'Buku pemrograman dan komputer'),
(2, 'Sains & Alam', 'Buku sains dan fisika');

INSERT INTO buku (kategori_id, judul, pengarang, penerbit, tahun_terbit, stok) VALUES
(1, 'Pemrograman PHP 8 & MySQL', 'Budi Santoso', 'Informatika', 2023, 10),
(2, 'Fisika Dasar Terapan', 'Ahmad Fauzi', 'Media Ilmu', 2022, 5);`,
        description: "Script DDL lengkap skema database SIMPUS-Mini",
      },
    ],
    simId: "p4-desain-mysql-schema",
    quiz: {
      question: "Mengapa kolom `kategori_id` pada tabel `buku` dijadikan sebagai Foreign Key ke kolom `id` pada tabel `kategori`?",
      options: [
        "Untuk menjaga integritas referensial agar buku tidak bisa merujuk ke kategori yang tidak ada di tabel kategori",
        "Agar buku otomatis terhapus setiap 24 jam",
        "Untuk mempercepat loading CSS di browser",
        "Karena MySQL mewajibkan semua kolom bernilai angka menjadi Foreign Key",
      ],
      answer: 0,
      explanation: "Foreign Key menjamin integritas relasional antar tabel sehingga data buku selalu terhubung dengan kategori yang valid.",
    },
    tugas: {
      title: "RTM-4: Pembuatan Database & Seeding Awal",
      description: "Eksekusi script DDL di phpMyAdmin lokal, tambahkan 2 data buku baru, dan ekspor database ke simpus_mini.sql.",
      rubrik: [
        { criteria: "Ketiga tabel berhasil dibuat dengan foreign key", bobot: "50%" },
        { criteria: "Data sampel tersimpan dengan benar", bobot: "30%" },
        { criteria: "File ekspor sql tersimpan rapi", bobot: "20%" },
      ],
    },
  },
  {
    no: 5,
    phase: "Fase 2: MySQL & CRUD",
    title: "Koneksi Database PHP ke MySQL (mysqli & Error Handling)",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Membuat Skrip Koneksi Database PHP (C3)",
    subCpmk: "Mahasiswa mampu menghubungkan skrip PHP ke MySQL menggunakan fungsi mysqli_connect dengan penanganan error try-catch.",
    indikator: [
      "Mampu membuat skrip terpusat config/koneksi.php",
      "Menangani eksepsi koneksi gagal dengan mysqli_report dan try-catch",
      "Mengamankan kredensial database agar pesan error tidak membocorkan password",
    ],
    problemStatement: "Bagaimana cara skrip PHP berbicara ke server MySQL port 3306 secara aman tanpa menyebabkan website hang ketika database sedang offline?",
    goal: "Membangun skrip koneksi database terpusat yang tangguh terhadap kegagalan jaringan.",
    outputPraktikum: "File config/koneksi.php yang siap diimpor oleh seluruh modul aplikasi",
    projectMilestone: "Integrasi layer koneksi database PHP ke MySQL",
    tools: ["VS Code", "PHP 8", "MySQL Server"],
    alokasiWaktu: "150 Menit (30 menit teori + 120 menit praktik)",
    teori: [
      {
        title: "Pustaka mysqli vs PDO di PHP",
        points: [
          "mysqli: Pustaka resmi khusus database MySQL/MariaDB, mendukung gaya prosedural yang mudah dipahami pemula.",
          "mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT): Memaksa mysqli melempar Exception jika query atau koneksi gagal.",
        ],
        explanation: "Dengan menangani error secara terstruktur, pengguna disajikan pesan ramah dan detail error teknis disimpan aman di log server.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Folder config/",
        desc: "Buat folder config/ di dalam simpus-mini untuk menyimpan koneksi dan helper sistem.",
      },
      {
        step: 2,
        title: "Menulis Skrip config/koneksi.php",
        desc: "Tulis kode koneksi dengan penanganan try-catch.",
      },
    ],
    files: [
      {
        name: "config/koneksi.php",
        lang: "php",
        code: `<?php
// config/koneksi.php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "simpus_mini";
$port = 3306;

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = mysqli_connect($host, $user, $pass, $db, $port);
    mysqli_set_charset($conn, "utf8mb4");
} catch (mysqli_sql_exception $e) {
    error_log("Database Error: " . $e->getMessage());
    die("<div style='color:red; font-family:sans-serif;'>
            <h3>Gagal Terhubung ke Database MySQL</h3>
            <p>Pastikan MySQL di XAMPP sudah menyala dan database 'simpus_mini' sudah dibuat.</p>
         </div>");
}
?>`,
        description: "Berkas koneksi database terpusat dengan error handling",
      },
    ],
    simId: "p5-koneksi-mysql-php",
    quiz: {
      question: "Mengapa kredensial koneksi database sebaiknya dikumpulkan di satu file terpisah (misal: config/koneksi.php)?",
      options: [
        "Agar jika ada perubahan password atau server database, kita hanya perlu mengubah satu file saja dan tidak perlu mengedit puluhan file lainnya",
        "Supaya file PHP lain otomatis terhapus",
        "Karena browser tidak bisa membaca file PHP tanpa folder config",
        "Agar MySQL tidak membutuhkan username dan password",
      ],
      answer: 0,
      explanation: "Prinsip sentralisasi konfigurasi memudahkan pemeliharaan dan persiapan deployment ke server hosting di kemudian hari.",
    },
    tugas: {
      title: "RTM-5: Konfigurasi Koneksi & Uji Penanganan Error",
      description: "Buat config/koneksi.php dan buat file uji coba. Coba sengaja salah ketik nama database untuk menguji blok catch.",
      rubrik: [
        { criteria: "Koneksi berhasil terhubung saat parameter benar", bobot: "50%" },
        { criteria: "Penanganan error catch bekerja ramah", bobot: "30%" },
        { criteria: "Kerapian struktur folder", bobot: "20%" },
      ],
    },
  },
  {
    no: 6,
    phase: "Fase 2: MySQL & CRUD",
    title: "Operasi READ: Menampilkan Data MySQL ke Tabel HTML Dinamis",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Mengambil dan Menampilkan Data MySQL (C3)",
    subCpmk: "Mahasiswa mampu mengeksekusi query SELECT, mengambil baris record dengan mysqli_fetch_assoc, dan merendernya ke tabel HTML.",
    indikator: [
      "Mampu menjalankan query SELECT dengan LEFT JOIN",
      "Melakukan iterasi data menggunakan perulangan while ($row = mysqli_fetch_assoc($result))",
      "Menampilkan notifikasi feedback jika data kosong atau ada pesan status",
    ],
    problemStatement: "Bagaimana cara menghubungkan tabel buku di MySQL ke halaman web utama sehingga daftar buku yang tampil selalu diperbarui secara realtime?",
    goal: "Menguasai operasi READ (Retrieve) penuh dari query database hingga tabel antarmuka pengguna.",
    outputPraktikum: "Halaman katalog utama index.php yang merender data tabel buku secara dinamis",
    projectMilestone: "Penyelesaian modul Read pada SIMPUS-Mini",
    tools: ["VS Code", "Browser", "PHP 8 & MySQL"],
    alokasiWaktu: "150 Menit (30 menit konsep query + 120 menit praktik)",
    teori: [
      {
        title: "Perulangan while dan mysqli_fetch_assoc",
        points: [
          "mysqli_query() mengembalikan objek mysqli_result berisi kumpulan baris data.",
          "mysqli_fetch_assoc() mengambil satu baris data sebagai array associative key-value.",
          "Loop while terus berjalan hingga baris data terakhir habis (mengembalikan null/false).",
        ],
        explanation: "mysqli_fetch_assoc adalah cara paling efisien dan mudah dibaca untuk memetakan nama kolom SQL ke array PHP.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Mengimpor Koneksi di index.php",
        desc: "Sertakan config/koneksi.php dan templates/header.php.",
      },
      {
        step: 2,
        title: "Mengeksekusi Query SELECT",
        desc: "Jalankan kueri SQL dan tampilkan baris buku menggunakan loop while.",
      },
    ],
    files: [
      {
        name: "index.php",
        lang: "php",
        code: `<?php
$judul_halaman = "Daftar Koleksi Buku - SIMPUS Mini";
require_once "config/koneksi.php";
require_once "templates/header.php";

$sql = "SELECT b.*, k.nama_kategori 
        FROM buku b 
        LEFT JOIN kategori k ON b.kategori_id = k.id 
        ORDER BY b.id DESC";
$result = mysqli_query($conn, $sql);
$total = mysqli_num_rows($result);
?>

<h2>Katalog Buku Perpustakaan (<?= $total ?> Koleksi)</h2>

<table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
    <tr style="background: #e2e8f0;">
        <th>No</th>
        <th>Judul Buku</th>
        <th>Kategori</th>
        <th>Pengarang</th>
        <th>Stok</th>
        <th>Aksi</th>
    </tr>
    <?php $no = 1; while ($row = mysqli_fetch_assoc($result)): ?>
    <tr>
        <td><?= $no++ ?></td>
        <td><strong><?= htmlspecialchars($row['judul']) ?></strong></td>
        <td><?= htmlspecialchars($row['nama_kategori'] ?? 'Umum') ?></td>
        <td><?= htmlspecialchars($row['pengarang']) ?></td>
        <td><?= $row['stok'] ?> eks</td>
        <td>
            <a href="edit.php?id=<?= $row['id'] ?>">Edit</a> | 
            <a href="hapus.php?id=<?= $row['id'] ?>" onclick="return confirm('Hapus buku ini?')">Hapus</a>
        </td>
    </tr>
    <?php endwhile; ?>
</table>

<?php
mysqli_free_result($result);
require_once "templates/footer.php";
?>`,
        description: "Halaman katalog utama yang merender data dinamis dari MySQL",
      },
    ],
    simId: "p6-operasi-read-mysql",
    quiz: {
      question: "Fungsi manakah dalam pustaka mysqli PHP yang digunakan untuk mengambil satu baris hasil query database sebagai array associative?",
      options: [
        "mysqli_fetch_assoc()",
        "mysqli_fetch_css()",
        "mysqli_table_open()",
        "mysqli_print_row()",
      ],
      answer: 0,
      explanation: "mysqli_fetch_assoc() mengembalikan baris record dalam format array asosiatif dengan nama kolom sebagai kuncinya.",
    },
    tugas: {
      title: "RTM-6: Halaman Katalog Buku Dinamis",
      description: "Sempurnakan index.php agar menampilkan nama kategori buku melalui LEFT JOIN.",
      rubrik: [
        { criteria: "Query SELECT LEFT JOIN berhasil berjalan", bobot: "50%" },
        { criteria: "Data tampil dinamis di tabel HTML", bobot: "30%" },
        { criteria: "Escape htmlspecialchars diterapkan", bobot: "20%" },
      ],
    },
  },
  {
    no: 7,
    phase: "Fase 2: MySQL & CRUD",
    title: "Operasi CREATE: Form HTML, Metode POST & INSERT ke Database",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Menyimpan Data Baru ke MySQL (C3)",
    subCpmk: "Mahasiswa mampu membuat formulir input HTML, menangani metode POST, dan menyimpan data baru menggunakan query INSERT.",
    indikator: [
      "Membuat form input dengan elemen text, number, dan select dropdown kategori",
      "Memeriksa request method POST dan mengambil nilai $_POST",
      "Mengeksekusi query INSERT dan melakukan redirection header Location",
    ],
    problemStatement: "Bagaimana cara staf perpustakaan mendaftarkan buku baru lewat antarmuka web tanpa harus mengotak-atik query SQL di phpMyAdmin?",
    goal: "Menguasai operasi CREATE (Insert) dari formulir HTML hingga tersimpan permanen di MySQL.",
    outputPraktikum: "Modul tambah.php yang berfungsi penuh menambah data buku",
    projectMilestone: "Penyelesaian modul Create pada SIMPUS-Mini",
    tools: ["VS Code", "Browser", "PHP 8 & MySQL"],
    alokasiWaktu: "150 Menit (30 menit konsep form + 120 menit praktik)",
    teori: [
      {
        title: "Pola Post-Redirect-Get (PRG)",
        points: [
          "Setelah mengeksekusi query INSERT, jangan biarkan halaman tetap di state POST.",
          "Gunakan `header('Location: index.php')` untuk mengalihkan browser kembali ke metode GET.",
          "Ini mencegah data terkirim ganda (*duplicate submission*) jika pengguna menekan tombol refresh (F5).",
        ],
        explanation: "Pola PRG adalah standar industri pengembangan web untuk memastikan integritas pengiriman form.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Berkas tambah.php",
        desc: "Buat form input HTML dan blok penanganan $_POST di bagian atas.",
      },
      {
        step: 2,
        title: "Menyiapkan Dropdown Kategori Dinamis",
        desc: "Ambil data kategori dari tabel kategori agar pilihan dropdown selalu mutakhir.",
      },
    ],
    files: [
      {
        name: "tambah.php",
        lang: "php",
        code: `<?php
$judul_halaman = "Tambah Buku Baru - SIMPUS Mini";
require_once "config/koneksi.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $judul        = trim($_POST['judul'] ?? '');
    $kategori_id  = (int)($_POST['kategori_id'] ?? 1);
    $pengarang    = trim($_POST['pengarang'] ?? '');
    $penerbit     = trim($_POST['penerbit'] ?? '');
    $tahun_terbit = (int)($_POST['tahun_terbit'] ?? date('Y'));
    $stok         = (int)($_POST['stok'] ?? 0);

    $stmt = mysqli_prepare($conn, "INSERT INTO buku (kategori_id, judul, pengarang, penerbit, tahun_terbit, stok) VALUES (?, ?, ?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "isssii", $kategori_id, $judul, $pengarang, $penerbit, $tahun_terbit, $stok);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    header("Location: index.php?pesan=" . urlencode("Buku baru berhasil disimpan!"));
    exit;
}

$kategori_res = mysqli_query($conn, "SELECT * FROM kategori ORDER BY nama_kategori ASC");
require_once "templates/header.php";
?>

<h2>+ Tambah Koleksi Buku Baru</h2>
<form action="tambah.php" method="POST">
    <p>
        <label>Kategori:</label><br>
        <select name="kategori_id">
            <?php while ($k = mysqli_fetch_assoc($kategori_res)): ?>
                <option value="<?= $k['id'] ?>"><?= htmlspecialchars($k['nama_kategori']) ?></option>
            <?php endwhile; ?>
        </select>
    </p>
    <p><label>Judul Buku:</label><br><input type="text" name="judul" required style="width: 300px;"></p>
    <p><label>Pengarang:</label><br><input type="text" name="pengarang" required style="width: 300px;"></p>
    <p><label>Penerbit:</label><br><input type="text" name="penerbit" style="width: 300px;"></p>
    <p><label>Tahun:</label><br><input type="number" name="tahun_terbit" value="<?= date('Y') ?>"></p>
    <p><label>Stok:</label><br><input type="number" name="stok" value="1" min="0"></p>
    <button type="submit">Simpan Buku</button>
</form>

<?php require_once "templates/footer.php"; ?>`,
        description: "Formulir input dan proses penyimpanan data buku baru",
      },
    ],
    simId: "p7-operasi-create-insert",
    quiz: {
      question: "Mengapa setelah skrip PHP berhasil mengeksekusi query INSERT, kita sebaiknya mengalihkan browser menggunakan `header('Location: index.php')`?",
      options: [
        "Untuk mencegah pengiriman data form secara ganda saat pengguna me-refresh halaman (Pola PRG)",
        "Agar database MySQL otomatis membuat backup harian",
        "Untuk menghapus riwayat pencarian browser klien",
        "Karena PHP tidak mengizinkan form dikirim lebih dari satu kali seumur hidup",
      ],
      answer: 0,
      explanation: "Pola Post-Redirect-Get (PRG) mengalihkan halaman ke metode GET sehingga refresh browser tidak memicu pengiriman ulang payload form POST.",
    },
    tugas: {
      title: "RTM-7: Formulir Tambah Buku & Dropdown Kategori",
      description: "Buat tambah.php dan uji coba menambahkan 3 buku baru melalui formulir web di browser.",
      rubrik: [
        { criteria: "Formulir POST bekerja dan data masuk ke MySQL", bobot: "50%" },
        { criteria: "Dropdown kategori dinamis dari database", bobot: "30%" },
        { criteria: "Redirection header bekerja mulus", bobot: "20%" },
      ],
    },
  },
  {
    no: 8,
    phase: "UTS",
    title: "UJIAN TENGAH SEMESTER (UTS): Evaluasi Proyek Praktik CRUD Dasar",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK1 & CPMK2: Evaluasi Penguasaan Database & Dasar CRUD (C3)",
    subCpmk: "Mahasiswa membuktikan penguasaan membuat database MySQL, koneksi PHP, serta modul Read dan Create secara mandiri.",
    indikator: [
      "Ketepatan struktur database relasional kategori dan buku",
      "Koneksi terpusat dengan penanganan error yang baik",
      "Keberhasilan menampilkan data dinamis dan menambah data via form",
    ],
    problemStatement: "Uji kompetensi paruh semester: Bangun modul katalog dan penambahan buku perpustakaan dari nol dalam waktu 120 menit.",
    goal: "Mengevaluasi kompetensi mandiri mahasiswa dalam menghubungkan PHP dan MySQL serta membangun fondasi CRUD.",
    outputPraktikum: "Proyek mini SIMPUS-Mini paruh semester (Katalog + Tambah Buku)",
    projectMilestone: "Milestone UTS - Validasi kelayakan modul dasar SIMPUS-Mini",
    tools: ["VS Code", "XAMPP", "Browser"],
    alokasiWaktu: "150 Menit (30 menit pengarahan + 120 menit pengerjaan ujian mandiri)",
    teori: [
      {
        title: "Rubrik Evaluasi Paruh Semester",
        points: [
          "Skema Basis Data & Integritas: 25%",
          "Koneksi & Modularitas: 20%",
          "Implementasi READ: 25%",
          "Implementasi CREATE & Sanitasi: 30%",
        ],
        explanation: "Asesmen sumatif 1 untuk memastikan seluruh mahasiswa telah menguasai fondasi mutlak backend sebelum masuk ke fitur update/delete.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Pengerjaan Soal Mandiri UTS",
        desc: "Selesaikan instruksi soal ujian dan pastikan seluruh fitur CRUD dasar dapat didemonstrasikan.",
      },
    ],
    files: [
      {
        name: "evaluasi_uts.txt",
        lang: "bash",
        code: `=== RUBRIK PENILAIAN UTS (Bobot 25%) ===
1. Skema Database MySQL (Tabel kategori & buku): 25 Poin
2. Modul config/koneksi.php & Penanganan Error: 20 Poin
3. Tampilan Katalog Dinamis (index.php): 25 Poin
4. Form Tambah Data & Redirection (tambah.php): 30 Poin
TOTAL: 100 Poin`,
        description: "Panduan komponen penilaian Ujian Tengah Semester",
      },
    ],
    simId: "p8-uts-evaluasi-crud",
    quiz: {
      question: "Apa tujuan utama dari dilaksanakannya Ujian Tengah Semester pada mata kuliah Backend Dasar ini?",
      options: [
        "Memverifikasi bahwa mahasiswa telah menguasai fondasi relasi database MySQL, koneksi PHP, dan operasi dasar Create & Read secara mandiri",
        "Menghapus seluruh akun mahasiswa dari database server",
        "Mengganti bahasa pemrograman PHP dengan bahasa C++",
        "Mematikan server Apache kampus",
      ],
      answer: 0,
      explanation: "UTS bertujuan mengukur capaian pembelajaran CPMK1 dan CPMK2 agar mahasiswa siap melanjutkan ke tahap update, delete, dan session auth.",
    },
    tugas: {
      title: "Asesmen Sumatif 1 (UTS): Demonstrasi Proyek Mini",
      description: "Demonstrasikan aplikasi SIMPUS-Mini paruh semester di hadapan dosen/asisten dan kumpulkan berkas zip proyek beserta file .sql.",
      rubrik: [
        { criteria: "Fungsionalitas form dan tabel berjalan 100%", bobot: "60%" },
        { criteria: "Penguasaan logika saat ditanya kode sumber", bobot: "40%" },
      ],
    },
    asesmenTerkait: {
      nama: "Ujian Tengah Semester (UTS)",
      bobot: "25%",
      tipe: "sumatif",
    },
  },
  {
    no: 9,
    phase: "Fase 3: Fitur Menengah",
    title: "Operasi UPDATE: Mengambil Data Berdasarkan ID & Memperbarui Record",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Mengimplementasikan Operasi Update Data (C3)",
    subCpmk: "Mahasiswa mampu menerima parameter ID dari URL GET, menampilkan data lama di form, dan mengeksekusi query UPDATE.",
    indikator: [
      "Mengambil parameter ID dengan $_GET['id'] dan melakukan casting integer",
      "Menjalankan query SELECT WHERE id = ? untuk mengisi nilai form (pre-fill)",
      "Mengeksekusi query UPDATE menggunakan Prepared Statements",
    ],
    problemStatement: "Jika stok buku berubah atau ada salah ketik pada nama pengarang, bagaimana membuat form edit yang otomatis terisi data lama buku tersebut?",
    goal: "Menguasai operasi UPDATE (Edit) penuh dengan validasi ID record.",
    outputPraktikum: "Modul edit.php yang dapat memperbarui informasi buku",
    projectMilestone: "Penyelesaian modul Update pada SIMPUS-Mini",
    tools: ["VS Code", "Browser", "PHP 8 & MySQL"],
    alokasiWaktu: "150 Menit (30 menit konsep + 120 menit praktik)",
    teori: [
      {
        title: "Dua Fase pada Operasi Update",
        points: [
          "Fase 1 (GET): Mengambil record lama dari database dan mengisikannya ke atribut value input form.",
          "Fase 2 (POST): Menangkap data baru dan menjalankan query UPDATE ... WHERE id = ?.",
        ],
        explanation: "Klausa WHERE id = ? mutlak wajib disertakan pada query UPDATE agar tidak mengubah seluruh baris di tabel secara tidak sengaja.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Berkas edit.php",
        desc: "Tangkap $_GET['id'] dan isi nilai form dengan data buku dari database.",
      },
      {
        step: 2,
        title: "Menangani Proses Simpan Perubahan",
        desc: "Jalankan UPDATE dan redirect kembali ke index.php.",
      },
    ],
    files: [
      {
        name: "edit.php",
        lang: "php",
        code: `<?php
$judul_halaman = "Edit Buku - SIMPUS Mini";
require_once "config/koneksi.php";

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) {
    header("Location: index.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $judul        = trim($_POST['judul'] ?? '');
    $pengarang    = trim($_POST['pengarang'] ?? '');
    $stok         = (int)($_POST['stok'] ?? 0);
    $kategori_id  = (int)($_POST['kategori_id'] ?? 1);

    $stmt = mysqli_prepare($conn, "UPDATE buku SET kategori_id=?, judul=?, pengarang=?, stok=? WHERE id=?");
    mysqli_stmt_bind_param($stmt, "issii", $kategori_id, $judul, $pengarang, $stok, $id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    header("Location: index.php?pesan=" . urlencode("Data buku berhasil diperbarui!"));
    exit;
}

$stmt = mysqli_prepare($conn, "SELECT * FROM buku WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$buku = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

require_once "templates/header.php";
?>

<h2>Edit Data Buku #<?= $id ?></h2>
<form action="edit.php?id=<?= $id ?>" method="POST">
    <p><label>Judul Buku:</label><br><input type="text" name="judul" value="<?= htmlspecialchars($buku['judul']) ?>" required style="width:300px;"></p>
    <p><label>Pengarang:</label><br><input type="text" name="pengarang" value="<?= htmlspecialchars($buku['pengarang']) ?>" required style="width:300px;"></p>
    <p><label>Stok:</label><br><input type="number" name="stok" value="<?= $buku['stok'] ?>" min="0"></p>
    <button type="submit">Simpan Perubahan</button>
</form>

<?php require_once "templates/footer.php"; ?>`,
        description: "Formulir edit data buku berdasarkan ID",
      },
    ],
    simId: "p9-operasi-update-edit",
    quiz: {
      question: "Apa akibat fatal jika seorang programmer mengeksekusi query `UPDATE buku SET stok = 10` tanpa menyertakan klausa `WHERE id = ?`?",
      options: [
        "Semua buku yang ada di tabel buku stoknya akan berubah menjadi 10 tanpa terkecuali",
        "Hanya buku pertama yang berubah",
        "Database MySQL akan otomatis mati",
        "Tidak ada perubahan karena MySQL menolak query update",
      ],
      answer: 0,
      explanation: "Klausa WHERE menentukan baris spesifik yang diupdate. Tanpa WHERE, perintah UPDATE berlaku untuk seluruh baris tabel.",
    },
    tugas: {
      title: "RTM-9: Modul Edit Data Buku",
      description: "Buat modul edit.php dan pastikan data lama tampil saat form dibuka dan tersimpan saat disubmit.",
      rubrik: [
        { criteria: "Data lama terisi otomatis di form", bobot: "40%" },
        { criteria: "Query UPDATE berhasil memperbarui record", bobot: "40%" },
        { criteria: "Validasi integer ID URL diterapkan", bobot: "20%" },
      ],
    },
  },
  {
    no: 10,
    phase: "Fase 3: Fitur Menengah",
    title: "Operasi DELETE: Menghapus Data Secara Aman & Konfirmasi JavaScript",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Mengimplementasikan Operasi Delete Aman (C3)",
    subCpmk: "Mahasiswa mampu menghapus record database berdasarkan ID dengan konfirmasi JavaScript browser untuk mencegah kecelakaan hapus.",
    indikator: [
      "Mengambil parameter ID dengan sanitasi integer casting",
      "Membuat konfirmasi dialog browser onclick='return confirm(...)'",
      "Mengeksekusi query DELETE FROM ... WHERE id = ?",
    ],
    problemStatement: "Penghapusan data di basis data bersifat permanen. Bagaimana membuat skrip penghapus yang aman dan meminta persetujuan pengguna sebelum mengeksekusi?",
    goal: "Menguasai operasi DELETE penuh dan proteksi konfirmasi tindakan pengguna.",
    outputPraktikum: "Modul hapus.php yang aman dan terintegrasi di tabel katalog",
    projectMilestone: "Penyelesaian modul Delete pada SIMPUS-Mini (CRUD Lengkap)",
    tools: ["VS Code", "Browser", "PHP 8 & MySQL"],
    alokasiWaktu: "150 Menit (30 menit konsep + 120 menit praktik)",
    teori: [
      {
        title: "Prinsip Keamanan Operasi Delete",
        points: [
          "Selalu gunakan sanitasi integer casting `(int)$_GET['id']` agar parameter URL tidak disisipi injeksi teks jahat.",
          "Tambahkan dialog konfirmasi JavaScript di tautan aksi: `onclick=\"return confirm('Apakah Anda yakin?')\"`.",
        ],
        explanation: "Jika pengguna menekan tombol Batal pada dialog confirm, browser akan membatalkan navigasi dan skrip hapus tidak akan terpanggil.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Berkas hapus.php",
        desc: "Tangkap ID, jalankan DELETE query, lalu kembalikan ke index.php.",
      },
      {
        step: 2,
        title: "Menambahkan Konfirmasi di index.php",
        desc: "Pasang atribut onclick pada tautan tombol hapus.",
      },
    ],
    files: [
      {
        name: "hapus.php",
        lang: "php",
        code: `<?php
require_once "config/koneksi.php";

$id = (int)($_GET['id'] ?? 0);

if ($id > 0) {
    $stmt = mysqli_prepare($conn, "DELETE FROM buku WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    header("Location: index.php?pesan=" . urlencode("Buku berhasil dihapus dari sistem!"));
    exit;
}

header("Location: index.php");
exit;
?>`,
        description: "Skrip pemroses penghapusan buku berdasarkan ID",
      },
    ],
    simId: "p10-operasi-delete-hapus",
    quiz: {
      question: "Apa fungsi dari penulisan kode JavaScript `onclick=\"return confirm('Yakin?')\"` pada tag `<a>` tautan hapus?",
      options: [
        "Memunculkan kotak dialog peringatan persetujuan; jika pengguna memilih 'Batal', browser membatalkan proses penghapusan",
        "Menghapus database secara otomatis",
        "Mengubah warna teks tautan menjadi merah",
        "Mengunci browser agar tidak bisa ditutup",
      ],
      answer: 0,
      explanation: "Dialog confirm() mengembalikan nilai false jika pengguna memilih Batal, sehingga browser membatalkan request ke file hapus.php.",
    },
    tugas: {
      title: "RTM-10: Modul Hapus Data & Dialog Konfirmasi",
      description: "Terapkan hapus.php dan uji coba menambahkan buku sementara lalu menghapusnya dengan konfirmasi dialog.",
      rubrik: [
        { criteria: "Buku berhasil terhapus dari MySQL", bobot: "50%" },
        { criteria: "Dialog konfirmasi browser bekerja dengan baik", bobot: "30%" },
        { criteria: "Redirection kembali ke index.php", bobot: "20%" },
      ],
    },
  },
  {
    no: 11,
    phase: "Fase 3: Fitur Menengah",
    title: "Validasi Form Server-Side, Proteksi XSS & SQL Injection",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK3: Keamanan Aplikasi Web & Validasi Input (C3)",
    subCpmk: "Mahasiswa mampu mengamankan aplikasi dari SQL Injection menggunakan Prepared Statements dan XSS menggunakan htmlspecialchars.",
    indikator: [
      "Mampu membuat fungsi sanitasi input dan validasi field kosong",
      "Mencegah celah SQL Injection dengan Parameterized Query",
      "Mencegah celah Cross-Site Scripting (XSS) dengan htmlspecialchars",
    ],
    problemStatement: "Bagaimana jika ada pengunjung usil yang memasukkan skrip JavaScript atau tanda kutip jahat ke form buku? Bagaimana PHP menolak atau menetralisir input tersebut?",
    goal: "Menguasai prinsip pertahanan web dasar: sanitasi input dan pencegahan celah keamanan OWASP Top 10.",
    outputPraktikum: "Modul helpers.php dan form input yang kebal terhadap serangan injeksi dasar",
    projectMilestone: "Penerapan standar keamanan form pada SIMPUS-Mini",
    tools: ["VS Code", "Browser", "Tools Pengujian Input"],
    alokasiWaktu: "150 Menit (40 menit teori keamanan + 110 menit praktik)",
    teori: [
      {
        title: "Prepared Statements & htmlspecialchars",
        points: [
          "Prepared Statements memisahkan antara teks perintah SQL dan nilai data pengguna, sehingga input sejahat apa pun tidak bisa dieksekusi sebagai perintah SQL.",
          "htmlspecialchars mengonversi karakter khusus seperti `<` dan `>` menjadi entitas HTML aman (`&lt;` dan `&gt;`).",
        ],
        explanation: "Validasi di sisi server (PHP) adalah lapis pertahanan mutlak, karena validasi HTML/JS di sisi klien bisa dimatikan atau dilewati oleh pengguna.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat File config/helpers.php",
        desc: "Buat fungsi esc() dan clean_input() yang dapat dipanggil di semua file.",
      },
      {
        step: 2,
        title: "Menguji Celah XSS",
        desc: "Coba input judul buku berupa tag <script> dan pastikan teks tersebut tidak memicu popup alert.",
      },
    ],
    files: [
      {
        name: "config/helpers.php",
        lang: "php",
        code: `<?php
// config/helpers.php
function esc(string $str): string {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

function clean_input(string $data): string {
    return htmlspecialchars(stripslashes(trim($data)), ENT_QUOTES, 'UTF-8');
}
?>`,
        description: "Fungsi pembantu sanitasi input dan proteksi XSS",
      },
    ],
    simId: "p11-validasi-keamanan-form",
    quiz: {
      question: "Manakah teknik yang paling efektif dalam PHP untuk mencegah serangan berbahaya SQL Injection?",
      options: [
        "Menggunakan Prepared Statements dan Parameterized Queries (mysqli_prepare & bind_param)",
        "Mengubah warna font formulir menjadi biru",
        "Hanya menggunakan JavaScript di sisi browser",
        "Menyembunyikan tombol submit form",
      ],
      answer: 0,
      explanation: "Prepared Statements memisahkan query dan parameter data secara struktural di engine database sehingga SQL Injection mustahil dieksekusi.",
    },
    tugas: {
      title: "RTM-11: Audit Keamanan Input & Pembersihan Karakter",
      description: "Pasang fungsi esc() pada semua tempat pencetakan data di antarmuka SIMPUS-Mini dan buktikan sistem kebal dari payload XSS.",
      rubrik: [
        { criteria: "Fungsi helpers.php terintegrasi sempurna", bobot: "50%" },
        { criteria: "Uji coba payload XSS berhasil dinetralisir", bobot: "30%" },
        { criteria: "Prepared statements aktif di semua file", bobot: "20%" },
      ],
    },
  },
  {
    no: 12,
    phase: "Fase 3: Fitur Menengah",
    title: "Relasi Tabel One-to-Many & Modul Kategori Buku",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Relasi Antar Tabel & Manajemen Data Terhubung (C3)",
    subCpmk: "Mahasiswa mampu membuat modul manajemen kategori (tabel induk) dan menampilkannya terhubung dengan tabel buku via query JOIN.",
    indikator: [
      "Membuat modul kategori.php untuk menambah dan melihat daftar klasifikasi buku",
      "Menghitung jumlah buku per kategori menggunakan query GROUP BY dan COUNT()",
      "Menampilkan relasi dinamis di seluruh sistem",
    ],
    problemStatement: "Bagaimana cara membuat halaman khusus agar admin perpustakaan bisa menambah kategori baru (misal: 'Sains Komputer') dan otomatis muncul di form tambah buku?",
    goal: "Menguasai manajemen tabel relasi induk (Parent-Child) dan agregasi data SQL.",
    outputPraktikum: "Modul kategori.php terintegrasi lengkap pada SIMPUS-Mini",
    projectMilestone: "Penyelesaian manajemen master data kategori",
    tools: ["VS Code", "Browser", "PHP 8 & MySQL"],
    alokasiWaktu: "150 Menit (30 menit konsep + 120 menit praktik)",
    teori: [
      {
        title: "Agregasi SQL: COUNT() dan GROUP BY",
        points: [
          "Query `SELECT k.*, COUNT(b.id) FROM kategori k LEFT JOIN buku b ON k.id = b.kategori_id GROUP BY k.id` menghitung total buku di tiap kategori.",
          "LEFT JOIN memastikan kategori yang belum memiliki koleksi buku tetap tampil dengan angka 0.",
        ],
        explanation: "Agregasi data memberikan wawasan analitik instan bagi pengelola sistem tanpa perlu menghitung baris secara manual.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Halaman kategori.php",
        desc: "Buat form tambah kategori dan tabel daftar kategori yang ada di database.",
      },
    ],
    files: [
      {
        name: "kategori.php",
        lang: "php",
        code: `<?php
$judul_halaman = "Kelola Kategori - SIMPUS Mini";
require_once "config/koneksi.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama = trim($_POST['nama_kategori'] ?? '');
    $ket  = trim($_POST['keterangan'] ?? '');
    if (!empty($nama)) {
        $stmt = mysqli_prepare($conn, "INSERT INTO kategori (nama_kategori, keterangan) VALUES (?, ?)");
        mysqli_stmt_bind_param($stmt, "ss", $nama, $ket);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
        header("Location: kategori.php?pesan=Kategori+berhasil+ditambahkan");
        exit;
    }
}

$sql = "SELECT k.*, COUNT(b.id) AS total_buku 
        FROM kategori k 
        LEFT JOIN buku b ON k.id = b.kategori_id 
        GROUP BY k.id 
        ORDER BY k.nama_kategori ASC";
$res = mysqli_query($conn, $sql);
require_once "templates/header.php";
?>

<h2>Manajemen Kategori Buku</h2>
<form action="kategori.php" method="POST" style="margin-bottom: 20px;">
    <input type="text" name="nama_kategori" required placeholder="Nama Kategori Baru">
    <input type="text" name="keterangan" placeholder="Keterangan singkat">
    <button type="submit">Tambah Kategori</button>
</form>

<table border="1" cellpadding="8" cellspacing="0">
    <tr style="background:#f1f5f9;">
        <th>ID</th>
        <th>Nama Kategori</th>
        <th>Keterangan</th>
        <th>Total Koleksi</th>
    </tr>
    <?php while ($k = mysqli_fetch_assoc($res)): ?>
    <tr>
        <td><?= $k['id'] ?></td>
        <td><strong><?= htmlspecialchars($k['nama_kategori']) ?></strong></td>
        <td><?= htmlspecialchars($k['keterangan'] ?? '-') ?></td>
        <td><?= $k['total_buku'] ?> buku</td>
    </tr>
    <?php endwhile; ?>
</table>

<?php require_once "templates/footer.php"; ?>`,
        description: "Modul manajemen kategori buku dengan agregasi total koleksi",
      },
    ],
    simId: "p12-relasi-kategori-join",
    quiz: {
      question: "Mengapa kita menggunakan LEFT JOIN dan bukan INNER JOIN saat ingin menampilkan semua kategori beserta jumlah bukunya?",
      options: [
        "Agar kategori baru yang belum memiliki buku tetap muncul di tabel dengan jumlah 0 dan tidak tersembunyi",
        "Karena LEFT JOIN mengeksekusi lebih lambat",
        "Karena INNER JOIN hanya untuk tabel yang tidak punya primary key",
        "Agar file gambar buku otomatis terunduh",
      ],
      answer: 0,
      explanation: "INNER JOIN hanya menampilkan baris yang berpasangan. Jika ada kategori baru tanpa buku, INNER JOIN akan menyembunyikannya. LEFT JOIN mempertahankan seluruh baris tabel kiri (kategori).",
    },
    tugas: {
      title: "RTM-12: Manajemen Kategori & Relasi 1:N",
      description: "Buat kategori.php, tambahkan 2 kategori baru, dan daftarkan buku ke dalam kategori tersebut.",
      rubrik: [
        { criteria: "Form tambah kategori berhasil berfungsi", bobot: "50%" },
        { criteria: "Query agregasi COUNT() akurat", bobot: "30%" },
        { criteria: "Kategori baru muncul di form tambah buku", bobot: "20%" },
      ],
    },
  },
  {
    no: 13,
    phase: "Fase 3: Fitur Menengah",
    title: "Autentikasi Pengguna: Session PHP & Password Hashing",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK3: Implementasi Autentikasi Pengguna (C3)",
    subCpmk: "Mahasiswa mampu membangun sistem login, session_start(), memverifikasi password dengan password_verify(), dan logout dengan session_destroy().",
    indikator: [
      "Menggunakan fungsi session_start() untuk inisialisasi state login",
      "Membuat password terenkripsi kuat menggunakan password_hash() BCRYPT",
      "Membuat halaman login.php dan logout.php yang aman",
    ],
    problemStatement: "Bagaimana cara server mengenali bahwa seorang staf sudah login dan menjaga hak aksesnya saat berpindah-pindah menu di website?",
    goal: "Menguasai siklus Session PHP dan keamanan password modern standar industri.",
    outputPraktikum: "Modul login.php dan logout.php berbasis session",
    projectMilestone: "Penerapan sistem autentikasi login pengguna SIMPUS-Mini",
    tools: ["VS Code", "Browser", "PHP 8 & MySQL"],
    alokasiWaktu: "150 Menit (40 menit konsep session + 110 menit praktik)",
    teori: [
      {
        title: "Session vs Cookie & Password Hash BCRYPT",
        points: [
          "Session disimpan di server secara aman, browser klien hanya memegang ID session acak (kuki PHPSESSID).",
          "password_hash() dengan BCRYPT otomatis menyertakan salt acak dan tahan terhadap serangan brute-force dictionary.",
          "Jangan pernah menggunakan MD5 atau SHA1 untuk password karena sudah terbukti rentan.",
        ],
        explanation: "password_verify() mengecek kecocokan string password input dengan hash tersimpan tanpa perlu mendekripsi hash tersebut.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat User Admin Default",
        desc: "Buat user admin di tabel users dengan password ter-hash.",
      },
      {
        step: 2,
        title: "Membuat Halaman login.php dan logout.php",
        desc: "Tulis verifikasi login dan pembersihan session.",
      },
    ],
    files: [
      {
        name: "login.php",
        lang: "php",
        code: `<?php
session_start();
require_once "config/koneksi.php";

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    header("Location: index.php");
    exit;
}

$error = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = mysqli_prepare($conn, "SELECT * FROM users WHERE username = ?");
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    $user = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['logged_in'] = true;
        $_SESSION['user_id']   = $user['id'];
        $_SESSION['username']  = $user['username'];
        $_SESSION['nama']      = $user['nama_lengkap'];
        $_SESSION['role']      = $user['role'];
        header("Location: index.php?pesan=Selamat+datang+" . urlencode($user['nama_lengkap']));
        exit;
    } else {
        $error = "Username atau password salah!";
    }
}

$judul_halaman = "Login - SIMPUS Mini";
require_once "templates/header.php";
?>

<div style="max-width:350px; margin: 2rem auto; background:white; padding:1.5rem; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <h3>Masuk ke SIMPUS-Mini</h3>
    <?php if ($error): ?><p style="color:red;"><?= $error ?></p><?php endif; ?>
    <form action="login.php" method="POST">
        <p><label>Username:</label><br><input type="text" name="username" required style="width:100%;"></p>
        <p><label>Password:</label><br><input type="password" name="password" required style="width:100%;"></p>
        <button type="submit" style="width:100%; padding:8px; background:#0284c7; color:white; border:none; font-weight:bold;">Login</button>
    </form>
</div>

<?php require_once "templates/footer.php"; ?>`,
        description: "Halaman formulir login autentikasi pengguna",
      },
    ],
    simId: "p13-autentikasi-session-login",
    quiz: {
      question: "Fungsi PHP manakah yang digunakan untuk memverifikasi kecocokan antara password teks biasa yang diketik pengguna dengan hash password yang tersimpan di MySQL?",
      options: [
        "password_verify()",
        "password_hash()",
        "md5()",
        "string_compare()",
      ],
      answer: 0,
      explanation: "password_verify() adalah fungsi standar PHP modern untuk mencocokkan password teks dengan hash BCRYPT secara aman.",
    },
    tugas: {
      title: "RTM-13: Implementasi Modul Login & Logout",
      description: "Buat login.php dan logout.php, uji login dengan username admin, lalu pastikan nama admin muncul di navbar header.",
      rubrik: [
        { criteria: "Login berhasil dengan akun valid", bobot: "50%" },
        { criteria: "Peringatan muncul jika password salah", bobot: "30%" },
        { criteria: "Logout membersihkan session dengan bersih", bobot: "20%" },
      ],
    },
  },
  {
    no: 14,
    phase: "Fase 3: Fitur Menengah",
    title: "Otorisasi & Hak Akses: Role Admin vs Anggota & Proteksi Halaman",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK3: Otorisasi & Hak Akses Berbasis Role (C3)",
    subCpmk: "Mahasiswa mampu membatasi akses halaman tambah, edit, dan hapus hanya untuk pengguna berstatus Admin.",
    indikator: [
      "Membuat middleware auth_check.php dengan fungsi require_admin()",
      "Mengunci halaman sensitif dari akses pengguna yang belum login",
      "Menyembunyikan tombol aksi manajemen dari pengguna biasa",
    ],
    problemStatement: "Bagaimana jika ada pengunjung umum yang langsung mengetik URL tambah.php atau hapus.php di address bar? Bagaimana cara menolak akses tersebut?",
    goal: "Mampu membangun sistem kontrol akses berbasis peran (Role-Based Access Control / RBAC) sederhana.",
    outputPraktikum: "Sistem proteksi halaman terpusat auth_check.php",
    projectMilestone: "Penerapan otorisasi role admin vs anggota pada SIMPUS-Mini",
    tools: ["VS Code", "Browser", "PHP 8 & MySQL"],
    alokasiWaktu: "150 Menit (30 menit konsep otorisasi + 120 menit praktik)",
    teori: [
      {
        title: "Pencegahan Akses Ilegal (Access Control Guard)",
        points: [
          "Memeriksa `$_SESSION['logged_in']` sebelum mengeksekusi konten halaman.",
          "Jika belum login -> alihkan langsung ke `login.php`.",
          "Jika sudah login tapi bukan admin -> tampilkan HTTP 403 Forbidden.",
        ],
        explanation: "Proteksi backend mutlak diperlukan karena URL file PHP di server publik bisa diakses langsung lewat browser.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat config/auth_check.php",
        desc: "Buat fungsi require_login() dan require_admin().",
      },
      {
        step: 2,
        title: "Memasang di tambah.php, edit.php, dan hapus.php",
        desc: "Panggil require_admin() di baris pertama file.",
      },
    ],
    files: [
      {
        name: "config/auth_check.php",
        lang: "php",
        code: `<?php
if (session_status() === PHP_SESSION_NONE) session_start();

function require_login() {
    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        header("Location: login.php?pesan=Silakan+login+terlebih+dahulu");
        exit;
    }
}

function require_admin() {
    require_login();
    if ($_SESSION['role'] !== 'admin') {
        die("<h2 style='color:red;'>403 Akses Ditolak: Khusus Administrator!</h2><p><a href='index.php'>Kembali</a></p>");
    }
}
?>`,
        description: "Middleware pengecekan status login dan role pengguna",
      },
    ],
    simId: "p14-otorisasi-role-guard",
    quiz: {
      question: "Apa kode status HTTP standar internasional yang menandakan bahwa pengguna dilarang mengakses sebuah halaman karena tidak memiliki izin/role yang cukup?",
      options: [
        "403 Forbidden",
        "404 Not Found",
        "200 OK",
        "500 Internal Server Error",
      ],
      answer: 0,
      explanation: "HTTP 403 Forbidden menunjukkan bahwa server mengenali pengguna tetapi menolak memberikan akses karena kurangnya hak wewenang/role.",
    },
    tugas: {
      title: "Asesmen Formatif 2 (Bobot 20%): Progres Fitur Autentikasi & RBAC",
      description: "Terapkan sistem proteksi admin pada tambah, edit, dan hapus. Uji akses dengan akun user biasa dan akun admin.",
      rubrik: [
        { criteria: "Halaman admin terkunci rapat dari pengguna umum", bobot: "50%" },
        { criteria: "Pengguna dengan role admin dapat mengelola data", bobot: "30%" },
        { criteria: "Navigasi navbar dinamis sesuai status login", bobot: "20%" },
      ],
    },
    asesmenTerkait: {
      nama: "Asesmen Formatif 2",
      bobot: "20%",
      tipe: "formatif",
    },
  },
  {
    no: 15,
    phase: "Fase 4: Hosting & Deploy",
    title: "Fitur Pencarian, Upload Berkas Cover & Pengenalan cPanel",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK3 & CPMK4: Fitur Pencarian Dinamis & Pengenalan Web Hosting (C3)",
    subCpmk: "Mahasiswa mampu menambahkan pencarian kata kunci SQL LIKE, menangani upload berkas cover buku, dan memahami struktur hosting cPanel.",
    indikator: [
      "Membuat form pencarian judul dan pengarang di index.php",
      "Memahami fungsi $_FILES dan move_uploaded_file() untuk upload berkas",
      "Memahami fitur utama cPanel: File Manager, MySQL Database Wizard, phpMyAdmin",
    ],
    problemStatement: "Bagaimana cara pengunjung mencari buku tertentu di antara ratusan koleksi dan bagaimana persiapan memindahkan website dari komputer lokal ke web hosting publik?",
    goal: "Menyempurnakan fungsionalitas SIMPUS-Mini dan memahami persiapan deployment cloud hosting.",
    outputPraktikum: "Fitur pencarian aktif dan kesiapan berkas backup SQL untuk deployment",
    projectMilestone: "Penyelesaian seluruh fitur kode & persiapan deployment final",
    tools: ["VS Code", "Browser", "cPanel Account"],
    alokasiWaktu: "150 Menit (40 menit konsep cPanel + 110 menit praktik)",
    teori: [
      {
        title: "Perbedaan Localhost vs Live cPanel Hosting",
        points: [
          "Localhost: Hanya berjalan di laptop pengembang saat Apache dinyalakan.",
          "Web Hosting cPanel: Server berbasis Linux yang menyala 24 jam dengan IP publik dan domain.",
          "public_html: Folder DocumentRoot utama pada cPanel setara dengan folder htdocs di XAMPP lokal.",
        ],
        explanation: "Website yang diunggah ke public_html di cPanel akan langsung dapat diakses oleh siapa saja di seluruh dunia.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Menambahkan Form Pencarian di index.php",
        desc: "Pasang input pencarian metode GET dan kueri SQL dengan operator LIKE.",
      },
      {
        step: 2,
        title: "Persiapan Berkas Ekspor SQL",
        desc: "Ekspor database simpus_mini melalui phpMyAdmin untuk persiapan pertemuan 16.",
      },
    ],
    files: [
      {
        name: "fitur_pencarian.php",
        lang: "php",
        code: `<?php
// Contoh potongan logika pencarian di index.php
$cari = trim($_GET['q'] ?? '');
if (!empty($cari)) {
    $stmt = mysqli_prepare($conn, "SELECT b.*, k.nama_kategori FROM buku b LEFT JOIN kategori k ON b.kategori_id = k.id WHERE b.judul LIKE ? OR b.pengarang LIKE ? ORDER BY b.id DESC");
    $wildcard = "%" . $cari . "%";
    mysqli_stmt_bind_param($stmt, "ss", $wildcard, $wildcard);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
} else {
    $result = mysqli_query($conn, "SELECT b.*, k.nama_kategori FROM buku b LEFT JOIN kategori k ON b.kategori_id = k.id ORDER BY b.id DESC");
}
?>`,
        description: "Potongan kueri pencarian dinamis dengan wildcard LIKE",
      },
    ],
    simId: "p15-pencarian-cpanel-intro",
    quiz: {
      question: "Pada server shared hosting yang menggunakan cPanel, di folder manakah berkas website PHP harus diletakkan agar bisa dibuka pengunjung lewat internet?",
      options: [
        "public_html/",
        "htdocs/xampp/",
        "system/core/",
        "backup/db/",
      ],
      answer: 0,
      explanation: "public_html adalah direktori root publik standar pada server hosting berbasis cPanel.",
    },
    tugas: {
      title: "RTM-15: Pencarian Buku & Persiapan Paket Deployment",
      description: "Pasang form pencarian di index.php, ekspor database menjadi simpus_mini_final.sql, dan kompres seluruh berkas proyek menjadi simpus_mini.zip.",
      rubrik: [
        { criteria: "Pencarian buku berhasil menyaring data", bobot: "50%" },
        { criteria: "File backup SQL lengkap dan tervalidasi", bobot: "30%" },
        { criteria: "Arsip zip proyek siap diunggah", bobot: "20%" },
      ],
    },
  },
  {
    no: 16,
    phase: "UAS",
    title: "UJIAN AKHIR SEMESTER (UAS): Deployment PHP & MySQL ke cPanel Live Hosting",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK4 & CPMK5: Deployment Live Hosting & Showcase Proyek Akhir (C4)",
    subCpmk: "Mahasiswa mampu mengunggah website ke cPanel, membuat database hosting, mengimpor data, dan mempresentasikan aplikasi yang dapat diakses publik.",
    indikator: [
      "Aplikasi SIMPUS-Mini berhasil di-deploy ke server hosting cPanel (public_html)",
      "Database MySQL terhubung sempurna via config/koneksi.php versi server",
      "Seluruh fitur CRUD, relasi, dan autentikasi admin berfungsi lancar di domain live",
    ],
    problemStatement: "Ujian pamungkas: Publikasikan website perpustakaan yang kamu buat agar bisa diakses oleh dosen dan teman-temanmu melalui link internet publik!",
    goal: "Membuktikan kompetensi penuh web developer backend: merancang, membangun, mengamankan, hingga men-deploy aplikasi ke cloud hosting.",
    outputPraktikum: "Link website SIMPUS-Mini LIVE di internet publik lengkap dengan dokumentasi",
    projectMilestone: "Milestone Akhir - Rilis Publik & Demonstrasi UAS SIMPUS-Mini",
    tools: ["cPanel Hosting", "Domain/Subdomain", "phpMyAdmin Hosting", "Browser"],
    alokasiWaktu: "150 Menit (Demonstrasi proyek live + sesi tanya jawab lisan)",
    teori: [
      {
        title: "6 Langkah Emas Deployment cPanel",
        points: [
          "1. Ekspor database lokal .sql via phpMyAdmin.",
          "2. Buat database & user baru via MySQL Database Wizard di cPanel.",
          "3. Impor file .sql ke phpMyAdmin cPanel.",
          "4. Upload & ekstrak file zip proyek ke public_html.",
          "5. Ubah config/koneksi.php dengan kredensial database cPanel.",
          "6. Uji coba domain live dan pastikan website berjalan normal tanpa error.",
        ],
        explanation: "Kelulusan mata kuliah ini dinilai langsung dari aplikasi yang hidup di internet, membuktikan kesiapan mahasiswa terjun ke dunia industri.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Upload Berkas ke public_html",
        desc: "Gunakan File Manager cPanel untuk mengunggah dan mengekstrak berkas proyek.",
      },
      {
        step: 2,
        title: "Sesuaikan Koneksi Server",
        desc: "Buka config/koneksi.php di cPanel, masukkan nama database dan user cPanel berprefix.",
      },
    ],
    files: [
      {
        name: "koneksi_hosting_example.php",
        lang: "php",
        code: `<?php
// Contoh config/koneksi.php di cPanel Hosting
$host = "localhost";
$user = "u1234_admin";          // Prefix cPanel wajib disertakan
$pass = "PasswordKuatHosting2024!";
$db   = "u1234_simpus_mini";    // Prefix cPanel wajib disertakan
$port = 3306;

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = mysqli_connect($host, $user, $pass, $db, $port);
    mysqli_set_charset($conn, "utf8mb4");
} catch (mysqli_sql_exception $e) {
    error_log("Hosting DB Error: " . $e->getMessage());
    die("Sistem dalam pemeliharaan berkala.");
}
?>`,
        description: "Contoh konfigurasi koneksi database di server hosting cPanel",
      },
    ],
    simId: "p16-uas-deployment-cpanel",
    quiz: {
      question: "Saat mengonfigurasi koneksi database MySQL di cPanel hosting, mengapa nama database dan user biasanya memiliki awalan (prefix), misalnya `u1234_simpus`?",
      options: [
        "Karena pada shared hosting, prefix akun cPanel digunakan untuk memisahkan kepemilikan database antar pengguna server yang berbeda",
        "Agar password database otomatis dibuatkan oleh cPanel",
        "Supaya database hanya bisa dibuka di malam hari",
        "Itu adalah virus yang harus segera dihapus",
      ],
      answer: 0,
      explanation: "Shared hosting menggunakan prefix username akun untuk mengisolasi dan mengidentifikasi database milik masing-masing pelanggan di satu server fisik yang sama.",
    },
    tugas: {
      title: "UJIAN AKHIR SEMESTER (UAS) - Bobot 35%",
      description: "Presentasikan aplikasi SIMPUS-Mini yang telah live di domain hosting cPanel publik. Demonstrasikan seluruh fitur CRUD, relasi kategori, login admin, dan jawab pertanyaan penguji.",
      rubrik: [
        { criteria: "Website aktif dan dapat dibuka via URL publik", bobot: "25%" },
        { criteria: "Kelengkapan fitur CRUD, relasi JOIN, dan session auth", bobot: "35%" },
        { criteria: "Kemampuan menjelaskan alur kode dan query SQL", bobot: "25%" },
        { criteria: "Kualitas dokumentasi README dan akun demo pengujian", bobot: "15%" },
      ],
    },
    asesmenTerkait: {
      nama: "Ujian Akhir Semester (UAS)",
      bobot: "35%",
      tipe: "sumatif",
    },
  },
];
