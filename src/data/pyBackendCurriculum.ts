/* ==========================================================================
   KURIKULUM SISTEM APLIKASI WEB - BACKEND DASAR (PYTHON FLASK / DJANGO)
   3 SKS (1 Teori + 2 Praktikum) | Semester 3 (SI/TI) & 5 (TI) | Level Pemula
   Fokus Utama: Database MySQL, Arsitektur Web Python, Templating & WSGI Hosting
   Standard DIKTI / BAN-PT berbasis Outcome Based Education (OBE)
   ========================================================================== */

import type { BackendMeeting } from "./ciBackendCurriculum";

export const PY_CPMK_LIST = [
  { id: "CPMK1", desc: "Mampu menjelaskan konsep arsitektur web berbasis Python (WSGI, Request-Response) dan alur kerja backend (C2)" },
  { id: "CPMK2", desc: "Mampu merancang & mengimplementasikan basis data MySQL serta operasi CRUD dengan Python (Flask/Django) (C3)" },
  { id: "CPMK3", desc: "Mampu mengimplementasikan autentikasi session-based login/register dan otorisasi role decorator (C3)" },
  { id: "CPMK4", desc: "Mampu men-deploy aplikasi web Python dan database MySQL ke web hosting cPanel (Passenger WSGI) serta menyusun dokumentasi (C3)" },
  { id: "CPMK5", desc: "Mampu menyelesaikan proyek aplikasi backend Python sederhana secara mandiri/tim sesuai standar industri dasar (C4)" },
];

export const PY_BACKEND_MEETINGS: BackendMeeting[] = [
  {
    no: 1,
    phase: "Fase 1: Setup & Dasar",
    title: "Pengantar Arsitektur Web Python & Siklus HTTP",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK1: Menjelaskan konsep dasar arsitektur web Python (C2)",
    subCpmk: "Mahasiswa mampu menjelaskan konsep arsitektur client-server, cara kerja WSGI di Python, dan siklus HTTP request-response.",
    indikator: [
      "Dapat menjelaskan bagaimana Python memproses permintaan web melalui Web Server Gateway Interface (WSGI)",
      "Dapat membedakan peran frontend (browser) dan backend Python (Flask/Django + MySQL)",
      "Memahami HTTP method GET dan POST pada aplikasi web Python",
    ],
    problemStatement: "Python terkenal sebagai bahasa pemrograman untuk AI dan data, tapi bagaimana Python digunakan untuk melayani jutaan permintaan web di Instagram dan Pinterest?",
    goal: "Memahami konsep web server di Python, peran WSGI, siklus request-response, dan perbandingan framework ramah pemula (Flask vs Django).",
    outputPraktikum: "Bagan pemahaman alur WSGI Python dan pemilihan tema proyek PjBL Toko Mini/SIMPUS",
    projectMilestone: "Pembentukan tim & pemilihan tema proyek aplikasi backend Python",
    tools: ["Browser", "Python 3.10+", "VS Code"],
    alokasiWaktu: "150 Menit (50 menit konsep teori WSGI + 100 menit studi kasus & project brief)",
    teori: [
      {
        title: "Konsep WSGI (Web Server Gateway Interface) di Python",
        points: [
          "Web Server (Apache/Nginx): Menerima HTTP request mentah dari internet.",
          "WSGI Server (Gunicorn/Passenger/Werkzeug): Jembatan penghubung yang menerjemahkan request web menjadi objek Python yang dipahami aplikasi.",
          "Web Framework (Flask/Django): Memetakan URL, mengeksekusi fungsi Python, berinteraksi dengan database MySQL, dan merender template HTML.",
        ],
        explanation: "WSGI adalah standar resmi PEP 3333 di dunia Python agar aplikasi web Python dapat berjalan di berbagai jenis web server tanpa menulis ulang kode server dari nol.",
      },
      {
        title: "Flask vs Django untuk Pemula",
        points: [
          "Flask: Micro-framework minimalis, fleksibel, sangat mudah dipahami baris per baris oleh pemula (hanya butuh 5 baris kode untuk membuat server web pertama).",
          "Django: Full-stack framework dengan filosofi 'Batteries-Included' (sudah ada admin panel, ORM, auth bawaan), cocok untuk proyek berskala menengah ke atas.",
          "Pada mata kuliah ini, mahasiswa belajar konsep inti menggunakan Flask yang transparan, lalu melihat analoginya di Django.",
        ],
        explanation: "Belajar Flask terlebih dahulu membantu pemula memahami apa yang sebenarnya terjadi di balik layar sebelum menggunakan framework yang lebih besar seperti Django.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Memeriksa Instalasi Python & Pip",
        desc: "Buka Terminal/CMD dan jalankan `python --version` serta `pip --version`.",
      },
      {
        step: 2,
        title: "Membedah Alur WSGI Request-Response",
        desc: "Pelajari bagaimana browser mengirim GET / dan WSGI meneruskannya ke fungsi Python `@app.route('/')`.",
      },
    ],
    files: [
      {
        name: "arsitektur_wsgi.txt",
        lang: "bash",
        code: `[Browser Pengguna]
       │
       │ 1. HTTP GET /katalog
       ▼
[Web Server (Nginx / Apache / Passenger)]
       │
       │ 2. WSGI Protocol (environ dictionary)
       ▼
[Python Web App (Flask: app.py / Django: wsgi.py)]
       │
       │ 3. Eksekusi Fungsi View def katalog():
       ▼
[MySQL Database Server (Port 3306)]
       │
       │ 4. Kembalikan data record buku / produk
       ▼
[Jinja2 / Django Template Renderer]
       │
       │ 5. HTTP Response (200 OK, Content-Type: text/html)
       ▼
[Browser merender tampilan web]`,
        description: "Bagan alur request-response aplikasi Python melalui standar WSGI hingga MySQL",
      },
    ],
    simId: "p1-py-arsitektur-client-server",
    quiz: {
      question: "Apakah fungsi utama dari WSGI (Web Server Gateway Interface) dalam ekosistem pengembangan web berbasis Python?",
      options: [
        "Sebagai protokol jembatan standar yang menghubungkan web server (seperti Nginx/Apache) dengan aplikasi web Python",
        "Sebagai pengganti kabel LAN di laboratorium komputer",
        "Untuk menghapus virus di sistem operasi Linux",
        "Sebagai perangkat keras kartu grafis (GPU)",
      ],
      answer: 0,
      explanation: "WSGI adalah spesifikasi standar di Python (PEP 3333) yang memastikan web server umum dapat berkomunikasi dengan framework Python seperti Flask dan Django secara konsisten.",
    },
    tugas: {
      title: "RTM-1: Analisis Ekosistem Web Python",
      description: "Jelaskan dengan kata-katamu sendiri apa itu WSGI, bandingkan kelebihan Flask (micro-framework) dengan Django (full-stack), dan tentukan topik proyek aplikasi backend Python kelompokmu.",
      rubrik: [
        { criteria: "Ketepatan penjelasan konsep WSGI di Python", bobot: "50%" },
        { criteria: "Pemahaman perbedaan Flask vs Django", bobot: "30%" },
        { criteria: "Kerapian ringkasan topik proyek PjBL", bobot: "20%" },
      ],
    },
  },
  {
    no: 2,
    phase: "Fase 1: Setup & Dasar",
    title: "Environment Setup: Virtualenv, Pip & 'Hello World' Pertama",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Setup & Konfigurasi Lingkungan Python (C3)",
    subCpmk: "Mahasiswa mampu membuat dan mengaktifkan Virtual Environment (venv), menginstal dependensi dengan pip, dan membuat aplikasi 'Hello World' pertama.",
    indikator: [
      "Mampu membuat lingkungan virtual terisolasi menggunakan perintah `python -m venv venv`",
      "Mampu mengaktifkan virtual environment di Windows (Scripts/activate) atau Mac/Linux (bin/activate)",
      "Mampu menginstal paket Flask menggunakan pip dan membekukannya di `requirements.txt`",
      "Berhasil menjalankan server lokal di `http://127.0.0.1:5000`",
    ],
    problemStatement: "Jika kita menginstal semua pustaka Python secara global di komputer, proyek A yang butuh versi lama akan bentrok dengan proyek B yang butuh versi baru. Bagaimana cara mengisolasi paket untuk setiap proyek backend?",
    goal: "Menguasai teknik isolasi lingkungan proyek Python dengan virtual environment (venv) dan menjalankan server lokal backend pertama.",
    outputPraktikum: "Aplikasi Flask berjalan di `http://127.0.0.1:5000` dengan virtualenv aktif",
    projectMilestone: "Inisialisasi workspace proyek backend Python dan berkas `requirements.txt`",
    tools: ["Python 3.10+", "VS Code", "Terminal"],
    alokasiWaktu: "150 Menit (30 menit teori virtualenv + 120 menit praktik instalasi & konfigurasi)",
    teori: [
      {
        title: "Pentingnya Virtual Environment (venv)",
        points: [
          "Virtual Environment menciptakan kotak pasir (sandbox) independen khusus untuk satu proyek tertentu.",
          "Pustaka yang diinstal tidak akan mengotori sistem Python utama di laptop.",
          "Mempermudah migrasi ke server hosting: tinggal menjalankan `pip install -r requirements.txt` di server.",
        ],
        explanation: "Tidak menggunakan venv pada proyek Python adalah kesalahan fatal yang sering menimbulkan 'Dependency Hell' saat proyek di-deploy.",
      },
      {
        title: "Anatomi Berkas app.py Minimal",
        points: [
          "`from flask import Flask`: Mengimpor class aplikasi Flask.",
          "`app = Flask(__name__)`: Menginisialisasi instance aplikasi.",
          "`@app.route('/')`: Decorator yang mengikat URL '/' ke fungsi di bawahnya.",
          "`app.run(debug=True)`: Menjalankan server lokal dengan mode auto-reload.",
        ],
        explanation: "Mode debug=True secara otomatis memuat ulang server saat kode disimpan dan menampilkan traceback error jika terjadi kekeliruan sintaks.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Folder Proyek & Virtual Environment",
        command: "mkdir simpus-python && cd simpus-python && python -m venv venv",
        desc: "Perintah ini membuat folder venv yang berisi salinan Python interpreter dan pip tersendiri.",
      },
      {
        step: 2,
        title: "Mengaktifkan Virtual Environment",
        command: "venv\\Scripts\\activate (Windows) atau source venv/bin/activate (Mac/Linux)",
        desc: "Tanda kurung (venv) akan muncul di awal baris terminal menandakan lingkungan aktif.",
      },
      {
        step: 3,
        title: "Menginstal Flask & Membuat requirements.txt",
        command: "pip install Flask pymysql cryptography && pip freeze > requirements.txt",
        desc: "Mengunduh paket Flask dan driver MySQL PyMySQL lalu mencatat versinya di requirements.txt.",
      },
      {
        step: 4,
        title: "Membuat Berkas app.py dan Menjalankannya",
        command: "python app.py",
        desc: "Buka browser ke http://127.0.0.1:5000.",
      },
    ],
    files: [
      {
        name: "app.py",
        lang: "bash",
        code: `from flask import Flask

app = Flask(__name__)

@app.route('/')
def beranda():
    return """
    <h1>Selamat Datang di SIMPUS-Mini Python!</h1>
    <p>Server Backend Flask berhasil berjalan di Virtual Environment.</p>
    <a href="/tentang">Tentang Sistem</a>
    """

@app.route('/tentang')
def tentang():
    return "<h3>SIMPUS-Mini v1.0 - Backend Dasar dengan Python Flask & MySQL</h3>"

if __name__ == '__main__':
    # debug=True mengaktifkan live reload saat kode diubah
    app.run(host='127.0.0.1', port=5000, debug=True)`,
        description: "Berkas dasar aplikasi web Python Flask dengan dua route sederhana",
      },
      {
        name: "requirements.txt",
        lang: "bash",
        code: `Flask==3.0.2
Werkzeug==3.0.1
Jinja2==3.1.3
PyMySQL==1.1.0
cryptography==42.0.5`,
        description: "Daftar pustaka dependensi proyek Python yang dapat diinstal otomatis di server hosting",
      },
    ],
    simId: "p2-py-setup-venv-hello",
    quiz: {
      question: "Mengapa setiap proyek aplikasi web Python disarankan memiliki virtual environment (venv) tersendiri?",
      options: [
        "Agar pustaka dan versi paket proyek terisolasi dan tidak bertabrakan dengan proyek lain atau sistem operasi global",
        "Agar browser dapat mengunduh video lebih cepat",
        "Karena Python tidak bisa berjalan jika tidak ada folder venv",
        "Untuk mengenkripsi keyboard pengguna",
      ],
      answer: 0,
      explanation: "Virtual Environment memisahkan paket dependensi tiap proyek sehingga upgrade library di satu proyek tidak akan merusak proyek lain yang ada di laptop.",
    },
    tugas: {
      title: "RTM-2: Setup Virtualenv & Hello World Server Python",
      description: "Buat virtual environment, aktifkan di terminal, install Flask, simpan requirements.txt, dan jalankan server lokal Flask di port 5000.",
      rubrik: [
        { criteria: "Virtual environment berhasil dibuat dan aktif", bobot: "40%" },
        { criteria: "Berkas requirements.txt terisi paket yang dibutuhkan", bobot: "30%" },
        { criteria: "Halaman web lokal berhasil diakses di browser", bobot: "30%" },
      ],
    },
  },
  {
    no: 3,
    phase: "Fase 1: Setup & Dasar",
    title: "Routing Dinamis, Template Engine (Jinja2) & Passing Data",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK1: Routing & Templating Jinja2 (C3)",
    subCpmk: "Mahasiswa mampu membuat routing dinamis dengan parameter URL, menggunakan template engine Jinja2, dan melakukan passing data dictionary dari Python ke template HTML.",
    indikator: [
      "Mampu menggunakan fungsi `render_template()` dari Flask",
      "Mampu membuat struktur folder `templates/` dan `static/`",
      "Mampu mencetak variabel menggunakan `{{ variabel }}` dan perulangan `{% for %}` di Jinja2",
      "Mampu menangani parameter dinamis pada route (misal: `<int:id>`)",
    ],
    problemStatement: "Menulis kode HTML panjang di dalam string Python di file app.py sangat berantakan dan sulit dibaca. Bagaimana cara memisahkan kode tampilan HTML ke file terpisah dan mengirimkan data dari Python ke sana?",
    goal: "Menguasai pemisahan tampilan dengan Template Engine Jinja2 (analogi Blade di Laravel), inheritance template (`base.html`), dan passing data.",
    outputPraktikum: "Halaman web beranda dan katalog perpustakaan berbasis template Jinja2",
    projectMilestone: "Layout template utama SIMPUS-Mini Python selesai",
    tools: ["VS Code", "Browser"],
    alokasiWaktu: "150 Menit (30 menit teori Jinja2 + 120 menit praktik membuat template)",
    teori: [
      {
        title: "Peran Template Engine Jinja2 di Python",
        points: [
          "`render_template('katalog.html', daftar_buku=data)`: Membaca file di folder `templates/` dan menyisipkan data variabel Python.",
          "Sintaks Cetak Variabel: `{{ nama_variabel }}` (otomatis melakukan HTML-escaping untuk mencegah serangan XSS).",
          "Sintaks Kontrol Logika: `{% for b in daftar_buku %} ... {% endfor %}` dan `{% if kondisi %} ... {% endif %}`.",
          "Template Inheritance: Menggunakan `{% extends 'base.html' %}` dan `{% block content %}` agar header dan footer tidak perlu di-copy paste di setiap halaman.",
        ],
        explanation: "Jinja2 memisahkan logika backend dari antarmuka pengguna, membuat proyek rapi dan mudah dirawat.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Struktur Folder templates/ dan static/",
        command: "mkdir templates static",
        desc: "Flask secara default mencari file HTML di dalam folder templates/ dan file CSS/gambar di static/.",
      },
      {
        step: 2,
        title: "Membuat Template Induk templates/base.html",
        desc: "Buat kerangka HTML umum dengan navigasi dan blok konten dinamis.",
        filePath: "templates/base.html",
      },
      {
        step: 3,
        title: "Membuat Template Turunan templates/katalog.html",
        desc: "Gunakan extends base.html dan lakukan perulangan data buku dengan for loop Jinja2.",
        filePath: "templates/katalog.html",
      },
      {
        step: 4,
        title: "Mengirim Data dari Controller Python di app.py",
        desc: "Panggil render_template dengan menyertakan variabel data.",
        filePath: "app.py",
      },
    ],
    files: [
      {
        name: "templates/base.html",
        lang: "bash",
        code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{% block title %}SIMPUS-Mini Python{% endblock %}</title>
    <style>
        body { font-family: sans-serif; margin: 0; background: #f8fafc; color: #1e293b; }
        nav { background: #0f172a; padding: 1rem 2rem; display: flex; gap: 1rem; align-items: center; }
        nav a { color: #38bdf8; text-decoration: none; font-weight: bold; font-size: 14px; }
        nav a:hover { color: #e0f2fe; }
        .container { max-width: 900px; margin: 2rem auto; padding: 1.5rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.06); }
    </style>
</head>
<body>
    <nav>
        <span style="color: white; font-weight: 800; margin-right: 1rem;">🐍 SIMPUS-Mini</span>
        <a href="/">Beranda</a>
        <a href="/katalog">Katalog Buku</a>
        <a href="/tentang">Tentang</a>
    </nav>

    <div class="container">
        {% block content %}{% endblock %}
    </div>
</body>
</html>`,
        description: "Template dasar (base.html) yang diwariskan ke seluruh halaman aplikasi menggunakan Jinja2",
      },
      {
        name: "templates/katalog.html",
        lang: "bash",
        code: `{% extends "base.html" %}

{% block title %}Daftar Buku - SIMPUS-Mini{% endblock %}

{% block content %}
    <h2>Katalog Buku Perpustakaan</h2>
    <p>Total Buku Tersedia: <strong>{{ buku_list|length }}</strong> judul</p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
        <thead>
            <tr style="background: #0284c7; color: white;">
                <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">No</th>
                <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Judul Buku</th>
                <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Pengarang</th>
                <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: center;">Sisa Stok</th>
            </tr>
        </thead>
        <tbody>
            {% for b in buku_list %}
            <tr>
                <td style="padding: 8px; border: 1px solid #cbd5e1;">{{ loop.index }}</td>
                <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>{{ b.judul }}</strong></td>
                <td style="padding: 8px; border: 1px solid #cbd5e1;">{{ b.pengarang }}</td>
                <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: #16a34a; font-weight: bold;">{{ b.stok }}</td>
            </tr>
            {% else %}
            <tr>
                <td colspan="4" style="text-align: center; padding: 1rem; color: #64748b;">Belum ada buku terdaftar.</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
{% endblock %}`,
        description: "Template katalog buku yang mewarisi base.html dan melakukan looping data list of dictionaries",
      },
    ],
    simId: "p3-py-routing-jinja2",
    quiz: {
      question: "Di dalam template Jinja2 pada Python Flask, bagaimanakah cara mencetak nilai variabel `nama_user` secara aman?",
      options: [
        "Menggunakan sintaks kurung kurawal ganda: {{ nama_user }}",
        "Menggunakan print(nama_user) di dalam tag HTML",
        "Menggunakan sintaks dolar: $nama_user",
        "Menggunakan SELECT nama_user FROM python",
      ],
      answer: 0,
      explanation: "Sintaks `{{ nama_variabel }}` di Jinja2 digunakan untuk mencetak ekspresi variabel ke HTML dengan fitur auto-escaping XSS aktif secara otomatis.",
    },
    tugas: {
      title: "RTM-3: Implementasi Template Jinja2 & Routing Dinamis",
      description: "Buat template base.html, halaman beranda, dan halaman katalog yang merender data list of dictionaries dari fungsi route Python menggunakan loop {% for %}.",
      rubrik: [
        { criteria: "Penggunaan template inheritance base.html berfungsi", bobot: "35%" },
        { criteria: "Perulangan Jinja2 {% for %} berhasil merender data", bobot: "35%" },
        { criteria: "Tampilan rapi dan bebas dari error template", bobot: "30%" },
      ],
    },
  },
  {
    no: 4,
    phase: "Fase 2: MySQL & CRUD",
    title: "Koneksi Database MySQL dengan Python & Driver PyMySQL",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Merancang Database MySQL & Koneksi Python (C3)",
    subCpmk: "Mahasiswa mampu membuat database & tabel di MySQL, menghubungkan aplikasi Python menggunakan driver PyMySQL/mysqlclient, dan menguji koneksi basis data.",
    indikator: [
      "Mampu merancang database `simpus_py` dan tabel `kategori` serta `buku` di MySQL",
      "Mampu membuat modul koneksi database Python (`db.py`) menggunakan PyMySQL dengan `DictCursor`",
      "Mampu mengamankan kredensial database menggunakan environment variable / konfigurasi terpusat",
      "Lolos uji coba pengambilan data tabel buku dari MySQL ke terminal / browser",
    ],
    problemStatement: "Data buku di aplikasi kita saat ini masih berupa data statis di dalam kode Python. Bagaimana cara menghubungkan Python ke server basis data MySQL agar data tersimpan permanen di phpMyAdmin?",
    goal: "Memahami cara kerja library database driver di Python, membuat koneksi MySQL yang aman, dan menjalankan query SELECT pertama melalui Python Cursor.",
    outputPraktikum: "Modul koneksi database Python teruji dan berhasil mengambil data dari MySQL",
    projectMilestone: "Skema database MySQL SIMPUS-Python aktif & terkoneksi",
    tools: ["MySQL (phpMyAdmin / XAMPP)", "PyMySQL", "VS Code"],
    alokasiWaktu: "150 Menit (40 menit konsep database driver & cursor + 110 menit praktik koneksi)",
    teori: [
      {
        title: "Bagaimana Python Berkomunikasi dengan MySQL?",
        points: [
          "Python membutuhkan driver database untuk berbicara protokol MySQL (contoh: `PyMySQL` atau `mysql-connector-python`).",
          "Connection: Objek pipa yang membuka sesi komunikasi ke server MySQL di port 3306.",
          "Cursor: Objek penunjuk yang digunakan untuk mengeksekusi query SQL (`cursor.execute()`) dan mengambil baris hasil (`cursor.fetchall()`).",
          "`DictCursor`: Mengembalikan data baris dalam bentuk Python dictionary (`{'judul': '...', 'stok': 5}`) sehingga sangat mudah diakses di Jinja2.",
        ],
        explanation: "Selalu tutup cursor dan connection setelah selesai digunakan, atau gunakan context manager `with connection.cursor() as cursor:` agar memori tidak bocor.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Database simpus_py di phpMyAdmin",
        desc: "Buka http://localhost/phpmyadmin -> Buat database baru simpus_py -> Eksekusi DDL tabel.",
      },
      {
        step: 2,
        title: "Membuat Modul Helper db.py",
        desc: "Buat fungsi get_db_connection() yang mengembalikan objek koneksi PyMySQL.",
        filePath: "db.py",
      },
      {
        step: 3,
        title: "Menguji Koneksi dari app.py",
        desc: "Panggil fungsi koneksi di route /katalog untuk mengambil data nyata dari tabel buku di MySQL.",
      },
    ],
    files: [
      {
        name: "db.py",
        lang: "bash",
        code: `import pymysql
from pymysql.cursors import DictCursor

def get_db():
    """Membuka koneksi ke database MySQL lokal"""
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        database='simpus_py',
        port=3306,
        cursorclass=DictCursor,
        autocommit=True
    )
    return connection`,
        description: "Modul penyedia koneksi MySQL menggunakan PyMySQL dengan DictCursor",
      },
    ],
    simId: "p4-py-mysql-koneksi",
    asesmenTerkait: {
      nama: "Asesmen Formatif 1 (Pra-UTS)",
      bobot: "20%",
      tipe: "formatif",
    },
    quiz: {
      question: "Mengapa penggunaan `cursorclass=DictCursor` pada PyMySQL sangat dianjurkan saat membuat aplikasi web backend pemula?",
      options: [
        "Karena mengembalikan baris hasil query sebagai dictionary dengan nama kolom sebagai kuncinya (contoh: baris['judul']), bukan tuple angka indeks",
        "Karena otomatis menghapus virus di database",
        "Supaya query SQL berjalan tanpa koneksi internet",
        "Karena DictCursor menggantikan kebutuhan server Apache",
      ],
      answer: 0,
      explanation: "DictCursor memetakan setiap kolom ke key dictionary berdasarkan nama kolom di MySQL, memudahkan pengembang mengakses data di template Jinja2 tanpa harus mengingat urutan indeks angka.",
    },
    tugas: {
      title: "ASESMEN FORMATIF 1 (Bobot 20%): Setup DB MySQL & Koneksi Python",
      description: "Buat database simpus_py dan tabel buku di MySQL, buat modul db.py, lalu tampilkan minimal 3 data buku dari database ke halaman web /katalog via route Flask.",
      rubrik: [
        { criteria: "Database dan tabel buku dibuat sesuai spesifikasi", bobot: "30%" },
        { criteria: "Modul db.py terkonfigurasi dengan benar", bobot: "35%" },
        { criteria: "Data dari tabel MySQL berhasil tampil di browser", bobot: "35%" },
      ],
    },
  },
  {
    no: 5,
    phase: "Fase 2: MySQL & CRUD",
    title: "CRUD - CREATE: Form Input POST & Simpan Data ke MySQL",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Implementasi Create Data di Python & MySQL (C3)",
    subCpmk: "Mahasiswa mampu membuat form input HTML, menangani request method POST di Flask, dan mengeksekusi query INSERT INTO menggunakan parameter binding.",
    indikator: [
      "Mampu membuat route dengan method `methods=['GET', 'POST']`",
      "Mampu mengambil data input form dari objek `request.form['field']`",
      "Mampu mengeksekusi query SQL parameterized `INSERT INTO ... VALUES (%s, %s, ...)` untuk mencegah SQL Injection",
      "Mampu melakukan pengalihan halaman menggunakan `redirect(url_for('...'))`",
    ],
    problemStatement: "Bagaimana cara aplikasi web Python menerima kiriman data dari form HTML dan menyimpannya secara aman ke dalam tabel database MySQL tanpa celah keamanan SQL Injection?",
    goal: "Menguasai penanganan form POST di Python, pembacaan request.form, dan eksekusi query parameterized INSERT INTO di MySQL.",
    outputPraktikum: "Form 'Tambah Buku' yang sukses menyimpan data baru ke database MySQL",
    projectMilestone: "Fitur Tambah Buku (Create) SIMPUS-Python berfungsi",
    tools: ["VS Code", "Browser", "phpMyAdmin"],
    alokasiWaktu: "150 Menit (30 menit konsep request POST & SQL Injection + 120 menit praktik)",
    teori: [
      {
        title: "Bahaya SQL Injection & Solusi Parameter Binding (%s)",
        points: [
          "SQL Injection: Serangan di mana pengguna memasukkan kode SQL berbahaya (misal: `' OR '1'='1`) ke input form.",
          "FATAL: Jangan pernah menyambung string query secara manual seperti `f\"INSERT INTO buku VALUES ('{judul}')\"`!",
          "Gunakan Parameter Binding: `cursor.execute('INSERT INTO buku (judul) VALUES (%s)', (judul,))`.",
          "PyMySQL secara otomatis meng-escape karakter berbahaya sehingga aman 100% dari SQL Injection.",
        ],
        explanation: "Parameter binding memisahkan antara struktur perintah SQL dengan data teks yang diisi pengguna.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Route /buku/tambah dengan Method GET dan POST",
        desc: "Jika method GET tampilkan form, jika POST ambil data dan jalankan query INSERT.",
        filePath: "app.py",
      },
      {
        step: 2,
        title: "Membuat Template templates/tambah_buku.html",
        desc: "Sediakan tag form dengan method='post' dan input judul, pengarang, penerbit, tahun, stok.",
        filePath: "templates/tambah_buku.html",
      },
      {
        step: 3,
        title: "Redirect ke Halaman Katalog Setelah Sukses",
        desc: "Gunakan return redirect(url_for('katalog')) agar tidak terjadi resubmit saat refresh browser.",
      },
    ],
    files: [
      {
        name: "contoh_create_route.py",
        lang: "bash",
        code: `from flask import render_template, request, redirect, url_for
from db import get_db

@app.route('/buku/tambah', methods=['GET', 'POST'])
def tambah_buku():
    if request.method == 'POST':
        # Ambil isian dari form
        judul        = request.form['judul']
        pengarang    = request.form['pengarang']
        penerbit     = request.form['penerbit']
        tahun_terbit = request.form['tahun_terbit']
        stok         = request.form['stok']

        # Simpan ke MySQL dengan parameterized query (Aman dari SQL Injection)
        db = get_db()
        with db.cursor() as cursor:
            sql = """INSERT INTO buku (judul, pengarang, penerbit, tahun_terbit, stok)
                     VALUES (%s, %s, %s, %s, %s)"""
            cursor.execute(sql, (judul, pengarang, penerbit, tahun_terbit, stok))
        db.close()

        return redirect(url_for('katalog'))

    # Jika method GET, tampilkan form
    return render_template('tambah_buku.html')`,
        description: "Fungsi route Flask menangani tampilan form (GET) dan penyimpanan data ke MySQL (POST)",
      },
    ],
    simId: "p5-py-crud-create",
    quiz: {
      question: "Mengapa dalam mengeksekusi perintah SQL di Python kita wajib menggunakan sintaks parameterized query `cursor.execute(sql, (param1, param2))` daripada menyambung string secara langsung?",
      options: [
        "Untuk mencegah serangan SQL Injection, di mana input jahat pengguna bisa merusak atau mencuri isi database",
        "Karena Python tidak mendukung tanda petik dua",
        "Agar komputer server menggunakan daya listrik lebih hemat",
        "Supaya file HTML otomatis berubah warna",
      ],
      answer: 0,
      explanation: "Parameterized query memastikan driver database memperlakukan isian form murni sebagai nilai data (bukan bagian dari perintah SQL), sehingga perintah injeksi SQL berbahaya otomatis dinetralkan.",
    },
    tugas: {
      title: "RTM-4A: Form Create Buku di Python Flask",
      description: "Buat form Tambah Buku di templates/tambah_buku.html dan buat route di app.py yang menyimpan data ke MySQL menggunakan parameterized query. Uji coba dengan menambahkan 3 buku baru.",
      rubrik: [
        { criteria: "Form input HTML dibuat lengkap dengan method POST", bobot: "30%" },
        { criteria: "Query INSERT menggunakan parameter binding (%s)", bobot: "40%" },
        { criteria: "Data baru tersimpan di database MySQL", bobot: "30%" },
      ],
    },
  },
  {
    no: 6,
    phase: "Fase 2: MySQL & CRUD",
    title: "CRUD - READ: Menampilkan List Data & Halaman Detail per ID",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Implementasi Read List & Detail di Python (C3)",
    subCpmk: "Mahasiswa mampu membuat query SELECT untuk daftar data dan detail data spesifik berdasarkan parameter `<int:id>` pada URL di Flask.",
    indikator: [
      "Mampu mengambil seluruh data buku dari MySQL menggunakan `cursor.fetchall()`",
      "Mampu membuat route detail dengan konverter tipe data integer `@app.route('/buku/<int:id>')`",
      "Mampu mengambil tepat satu baris data buku menggunakan `cursor.fetchone()`",
      "Mampu menangani error 404 jika ID buku yang dicari tidak ditemukan di database",
    ],
    problemStatement: "Pengunjung ingin melihat ringkasan seluruh buku di halaman katalog, lalu mengklik satu buku untuk membaca informasi detailnya secara lengkap. Bagaimana cara membuat rute dinamis per ID di Python?",
    goal: "Menguasai pengambilan data list dan detail dengan `fetchall()` & `fetchone()`, serta passing parameter integer pada decorator route Flask.",
    outputPraktikum: "Halaman Katalog Buku dan Halaman Detail Buku interaktif",
    projectMilestone: "Fitur Read List & Detail SIMPUS-Python berfungsi",
    tools: ["VS Code", "Browser"],
    alokasiWaktu: "150 Menit (20 menit konsep fetchone vs fetchall + 130 menit praktik coding)",
    teori: [
      {
        title: "Perbedaan fetchall() vs fetchone() di PyMySQL",
        points: [
          "`cursor.fetchall()`: Mengembalikan list of dictionaries yang berisi seluruh baris hasil query (cocok untuk tabel katalog).",
          "`cursor.fetchone()`: Mengembalikan satu dictionary baris pertama atau `None` jika data tidak ditemukan (cocok untuk halaman detail per ID).",
          "URL Parameter Converter: `@app.route('/buku/<int:id>')` memastikan parameter `id` yang diterima fungsi Python sudah berjenis angka integer.",
        ],
        explanation: "Jika data `None`, kita dapat memanggil fungsi `abort(404)` agar server merespons dengan status HTTP 404 Not Found standar.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Route /katalog dengan fetchall()",
        desc: "Jalankan SELECT * FROM buku ORDER BY id DESC dan kirimkan hasilnya ke template katalog.html.",
      },
      {
        step: 2,
        title: "Membuat Route /buku/<int:id> dengan fetchone()",
        desc: "Jalankan SELECT * FROM buku WHERE id = %s dengan parameter ID.",
      },
      {
        step: 3,
        title: "Membuat Template templates/detail_buku.html",
        desc: "Tampilkan informasi detail buku secara lengkap beserta tombol kembali.",
      },
    ],
    files: [
      {
        name: "contoh_detail_route.py",
        lang: "bash",
        code: `from flask import abort

@app.route('/buku/<int:id>')
def detail_buku(id):
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT * FROM buku WHERE id = %s", (id,))
        buku = cursor.fetchone()
    db.close()

    # Jika ID tidak ditemukan di MySQL
    if buku is None:
        abort(404, description="Buku dengan ID tersebut tidak ditemukan.")

    return render_template('detail_buku.html', buku=buku)`,
        description: "Fungsi route detail buku menggunakan converter int:id dan cursor.fetchone()",
      },
    ],
    simId: "p6-py-crud-read",
    quiz: {
      question: "Apakah nilai yang dikembalikan oleh method `cursor.fetchone()` di PyMySQL jika query `SELECT * FROM buku WHERE id = %s` tidak menemukan baris yang cocok?",
      options: [
        "None",
        "Array kosong []",
        "Error fatal yang mematikan server",
        "Angka 0",
      ],
      answer: 0,
      explanation: "Jika tidak ada baris yang sesuai kriteria query, cursor.fetchone() akan mengembalikan nilai objek `None` di Python sehingga mudah diperiksa dengan `if buku is None:`.",
    },
    tugas: {
      title: "RTM-4B: Halaman List & Detail Buku Python",
      description: "Implementasikan halaman katalog daftar buku dengan link menuju halaman detail buku masing-masing. Tangani kasus ID tidak ditemukan dengan halaman error 404.",
      rubrik: [
        { criteria: "Daftar buku dari MySQL tampil dengan loop Jinja2", bobot: "50%" },
        { criteria: "Route detail <int:id> berhasil mengambil satu data", bobot: "30%" },
        { criteria: "Penanganan kasus data tidak ditemukan (404)", bobot: "20%" },
      ],
    },
  },
  {
    no: 7,
    phase: "Fase 2: MySQL & CRUD",
    title: "CRUD - UPDATE & DELETE: Mengubah & Menghapus Data di MySQL",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Implementasi Update dan Delete di Python (C3)",
    subCpmk: "Mahasiswa mampu membuat form edit berisi data lama, memperbarui baris data di MySQL, dan menghapus baris data dengan konfirmasi.",
    indikator: [
      "Mampu membuat route `/buku/edit/<int:id>` yang mengambil data lama dan menampilkannya di atribut `value` form",
      "Mampu mengeksekusi query `UPDATE buku SET ... WHERE id = %s` saat form disubmit via POST",
      "Mampu membuat route `/buku/hapus/<int:id>` dengan eksekusi query `DELETE FROM buku WHERE id = %s`",
      "Menerapkan konfirmasi JavaScript sebelum penghapusan data",
    ],
    problemStatement: "Jika admin keliru menginput jumlah stok buku atau ada buku yang rusak dan ingin dihapus, bagaimana sistem memperbarui baris data lama dan menghapusnya dari tabel MySQL?",
    goal: "Menguasai alur lengkap operasi UPDATE dan DELETE di Python Flask dan MySQL, serta review persiapan UTS.",
    outputPraktikum: "Modul CRUD Buku di Python LENGKAP (Create, Read, Update, Delete) berfungsi 100%",
    projectMilestone: "CRUD Buku SIMPUS-Python selesai sempurna (Checkpoint Pra-UTS)",
    tools: ["VS Code", "Browser", "phpMyAdmin"],
    alokasiWaktu: "150 Menit (30 menit teori update/delete + 90 menit praktik + 30 menit review UTS)",
    teori: [
      {
        title: "Alur Eksekusi UPDATE & DELETE di Backend Python",
        points: [
          "UPDATE membutuhkan 2 tahap: 1) GET untuk menampilkan form edit dengan data awal (`value=\"{{ buku.judul }}\"`), 2) POST untuk mengeksekusi query UPDATE.",
          "DELETE mengeksekusi query `DELETE FROM buku WHERE id = %s`.",
          "Jangan lupa `db.commit()` jika tidak mengaktifkan autocommit pada koneksi database.",
        ],
        explanation: "Selalu sertakan `WHERE id = %s` agar operasi update dan delete hanya menyasar satu rekaman yang tepat.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Route /buku/edit/<int:id>",
        desc: "Tangani method GET untuk merender form edit, dan method POST untuk menjalankan query UPDATE.",
      },
      {
        step: 2,
        title: "Membuat Template templates/edit_buku.html",
        desc: "Sediakan input dengan nilai default terisi data lama buku.",
      },
      {
        step: 3,
        title: "Membuat Route /buku/hapus/<int:id>",
        desc: "Eksekusi DELETE FROM buku WHERE id = %s lalu redirect ke katalog.",
      },
    ],
    files: [
      {
        name: "contoh_update_delete.py",
        lang: "bash",
        code: `@app.route('/buku/edit/<int:id>', methods=['GET', 'POST'])
def edit_buku(id):
    db = get_db()
    with db.cursor() as cursor:
        if request.method == 'POST':
            judul        = request.form['judul']
            pengarang    = request.form['pengarang']
            penerbit     = request.form['penerbit']
            tahun_terbit = request.form['tahun_terbit']
            stok         = request.form['stok']

            sql = """UPDATE buku 
                     SET judul=%s, pengarang=%s, penerbit=%s, tahun_terbit=%s, stok=%s 
                     WHERE id=%s"""
            cursor.execute(sql, (judul, pengarang, penerbit, tahun_terbit, stok, id))
            db.close()
            return redirect(url_for('katalog'))

        # Jika method GET: ambil data lama
        cursor.execute("SELECT * FROM buku WHERE id = %s", (id,))
        buku = cursor.fetchone()
    db.close()
    return render_template('edit_buku.html', buku=buku)

@app.route('/buku/hapus/<int:id>', methods=['POST', 'GET'])
def hapus_buku(id):
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("DELETE FROM buku WHERE id = %s", (id,))
    db.close()
    return redirect(url_for('katalog'))`,
        description: "Implementasi fungsi route update dan delete data buku di Python Flask",
      },
    ],
    simId: "p7-py-crud-update-delete",
    quiz: {
      question: "Apa fungsi dari menyertakan parameter `id` pada klausul `WHERE id = %s` saat menjalankan perintah SQL UPDATE di Python?",
      options: [
        "Memastikan pembaruan data hanya menyasar 1 baris buku yang sedang diedit, bukan seluruh buku di tabel",
        "Menghapus seluruh kolom di database",
        "Mengganti password administrator secara otomatis",
        "Supaya browser me-refresh otomatis",
      ],
      answer: 0,
      explanation: "Tanpa klausul `WHERE id = %s`, perintah SQL UPDATE akan menimpa seluruh baris buku di dalam tabel dengan data yang sama persis.",
    },
    tugas: {
      title: "RTM-4C: Pengujian CRUD Lengkap Python",
      description: "Lengkapi fitur Edit dan Hapus pada modul Buku Python. Lakukan pengujian menyeluruh: Tambah buku, lihat di daftar, ubah data, dan hapus.",
      rubrik: [
        { criteria: "Form edit terisi data awal dari database MySQL", bobot: "35%" },
        { criteria: "Query UPDATE berhasil memperbarui baris data", bobot: "35%" },
        { criteria: "Query DELETE berhasil menghapus data dari MySQL", bobot: "30%" },
      ],
    },
  },
  {
    no: 8,
    phase: "UTS",
    title: "UJIAN TENGAH SEMESTER (UTS): Praktik CRUD Python Mandiri",
    sks: "3 SKS (Praktik Mandiri 150 Menit)",
    cpmk: "CPMK2 & CPMK5: Membangun Aplikasi CRUD Python Mandiri (C3)",
    subCpmk: "Mahasiswa mampu membangun aplikasi web CRUD sederhana menggunakan Python Flask & MySQL untuk studi kasus baru dalam waktu terbatas.",
    indikator: [
      "Mampu merancang database & tabel MySQL baru secara mandiri",
      "Mampu mengonfigurasi koneksi PyMySQL",
      "Mampu membuat seluruh fitur CRUD (Create, Read, Update, Delete) berjalan fungsional di browser",
      "Struktur kode rapi dengan template Jinja2 tanpa error fatal",
    ],
    problemStatement: "Sebuah toko komputer membutuhkan aplikasi web backend sederhana untuk mengelola stok perangkat keras (hardware). Bangun aplikasi CRUD lengkap dalam 150 menit!",
    goal: "Menguji kemandirian mahasiswa dalam merancang database MySQL dan membangun backend CRUD lengkap dengan Python.",
    outputPraktikum: "Proyek mini CRUD Python mandiri fungsional",
    projectMilestone: "Evaluasi kompetensi tengah semester (UTS)",
    tools: ["Python 3", "VS Code", "MySQL / phpMyAdmin", "Browser"],
    alokasiWaktu: "150 Menit (Praktik Langsung / Live Coding)",
    teori: [
      {
        title: "Ketentuan Ujian Tengah Semester",
        points: [
          "Boleh membuka dokumentasi resmi Flask dan W3Schools Python.",
          "Dilarang menyalin pekerjaan mahasiswa lain (plagiarisme = pembatalan ujian).",
          "Prioritas: Semua operasi CRUD (Create, Read, Update, Delete) berjalan di browser.",
        ],
        explanation: "Fokus utama adalah membuktikan pemahaman logika koneksi database, routing, form POST, dan rendering template.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membaca Soal Studi Kasus UTS",
        desc: "Kasus: Sistem Manajemen Produk Toko Komputer (id, kode, nama, merk, harga, stok).",
      },
      {
        step: 2,
        title: "Membuat Database & Tabel di MySQL",
        desc: "Buat database db_toko_komputer dan tabel produk.",
      },
      {
        step: 3,
        title: "Menulis Kode Python & Template Jinja2",
        desc: "Tuliskan rute CRUD di app.py dan buat template form serta tabel.",
      },
      {
        step: 4,
        title: "Pengujian & Pengumpulan Berkas",
        desc: "Uji coba semua fitur lalu kumpulkan file proyek dalam format ZIP.",
      },
    ],
    files: [
      {
        name: "soal_uts_toko.sql",
        lang: "sql",
        code: `CREATE DATABASE IF NOT EXISTS \`db_toko_komputer\`;
USE \`db_toko_komputer\`;

CREATE TABLE \`produk\` (
    \`id\` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    \`kode_produk\` VARCHAR(30) NOT NULL UNIQUE,
    \`nama_produk\` VARCHAR(150) NOT NULL,
    \`merk\` VARCHAR(100) NOT NULL,
    \`harga\` INT(11) NOT NULL,
    \`stok\` INT(11) NOT NULL,
    \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
);`,
        description: "Skema basis data MySQL untuk studi kasus inventaris toko pada UTS Python",
      },
    ],
    simId: "p8-py-uts-mini-crud",
    asesmenTerkait: {
      nama: "Asesmen Sumatif 1 (UTS)",
      bobot: "25%",
      tipe: "sumatif",
    },
    quiz: {
      question: "Apa urutan langkah kerja paling terstruktur saat membangun aplikasi CRUD backend berbasis Python dari nol?",
      options: [
        "Desain Tabel MySQL -> Buat Koneksi Database (db.py) -> Buat Rute & Query (app.py) -> Buat Template Tampilan (Jinja2)",
        "Membuat CSS sebelum memikirkan database",
        "Menulis HTML tanpa menghubungkannya ke Python",
        "Langsung upload ke server hosting sebelum kode diuji di laptop",
      ],
      answer: 0,
      explanation: "Memulai dari struktur data (MySQL), menghubungkannya ke backend (db.py), menyusun rute logika, lalu merender ke antarmuka (Jinja2) adalah alur paling sistematis dan minim error.",
    },
    tugas: {
      title: "ASESMEN SUMATIF 1 (UTS - Bobot 25%): Praktik CRUD Python Mandiri",
      description: "Kerjakan studi kasus manajemen produk toko komputer. Buat database, rute CRUD lengkap, dan template Jinja2. Kumpulkan file proyek ZIP beserta file export SQL.",
      rubrik: [
        { criteria: "Fungsi Create berfungsi dengan parameterized query", bobot: "25%" },
        { criteria: "Fungsi Read (tabel list dan detail) tampil rapi", bobot: "25%" },
        { criteria: "Fungsi Update berhasil memperbarui data di MySQL", bobot: "25%" },
        { criteria: "Fungsi Delete berfungsi dengan konfirmasi", bobot: "25%" },
      ],
    },
  },
  {
    no: 9,
    phase: "Fase 3: Fitur Menengah",
    title: "Validasi Form Input & Flash Messages di Flask",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Validasi Form & Error Feedback di Python (C3)",
    subCpmk: "Mahasiswa mampu memvalidasi data form input di sisi server Python dan menampilkan pesan notifikasi menggunakan fitur `flash()` di Flask.",
    indikator: [
      "Mampu memeriksa kekosongan data dan format angka di sisi server",
      "Mampu mengonfigurasi `app.secret_key` untuk mengaktifkan fitur flash session",
      "Mampu mengirim pesan notifikasi menggunakan `flash('Pesan sukses/error', 'kategori')`",
      "Mampu merender pesan flash di template Jinja2 menggunakan `get_flashed_messages()`",
    ],
    problemStatement: "Bagaimana jika pengguna mengosongkan judul buku atau memasukkan huruf pada kolom stok? Server Python harus menolak dan memunculkan kotak pesan peringatan merah di layar!",
    goal: "Menguasai validasi input data sisi server di Python dan memberikan umpan balik pengguna menggunakan Flash Messages.",
    outputPraktikum: "Form buku dengan validasi server-side dan notifikasi alert sukses/gagal",
    projectMilestone: "Semua form input SIMPUS-Python memiliki validasi dan notifikasi flash",
    tools: ["VS Code", "Browser"],
    alokasiWaktu: "150 Menit (30 menit konsep secret_key & flash + 120 menit praktik)",
    teori: [
      {
        title: "Peran app.secret_key dan flash() di Flask",
        points: [
          "`app.secret_key = 'kunci-rahasia-acak'`: Diperlukan oleh Flask untuk menandatangani cookie session secara kriptografis agar tidak bisa dipalsukan pengguna.",
          "`flash('Data berhasil disimpan!', 'success')`: Menyimpan pesan sementara di dalam session.",
          "`get_flashed_messages(with_categories=true)`: Fungsi pembantu di Jinja2 untuk mengambil semua pesan dan menampilkannya sebagai kotak alert.",
        ],
        explanation: "Pesan flash otomatis hilang setelah ditampilkan satu kali (one-time message), sehingga tidak terus muncul saat halaman di-refresh.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Menyetel secret_key di app.py",
        desc: "Tambahkan app.secret_key = 'kunci_rahasia_simpus_123' sebelum route.",
      },
      {
        step: 2,
        title: "Menulis Aturan Validasi di Fungsi Tambah Buku",
        desc: "Periksa if not judul or len(judul) < 3, lalu panggil flash('Judul minimal 3 karakter', 'danger').",
      },
      {
        step: 3,
        title: "Menambahkan Komponen Alert di base.html",
        desc: "Gunakan loop get_flashed_messages() tepat di atas block content.",
      },
    ],
    files: [
      {
        name: "contoh_flash_validation.py",
        lang: "bash",
        code: `from flask import flash

app.secret_key = 'kunci_super_rahasia_simpus_2024'

@app.route('/buku/simpan', methods=['POST'])
def simpan_buku():
    judul = request.form.get('judul', '').strip()
    stok  = request.form.get('stok', '').strip()

    # Validasi Server-Side
    if not judul or len(judul) < 3:
        flash('Judul buku wajib diisi minimal 3 karakter!', 'danger')
        return redirect(url_for('tambah_buku'))

    try:
        stok_angka = int(stok)
        if stok_angka < 0:
            raise ValueError()
    except ValueError:
        flash('Jumlah stok harus berupa angka bulat positif!', 'danger')
        return redirect(url_for('tambah_buku'))

    # Simpan ke MySQL jika lolos validasi
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("INSERT INTO buku (judul, stok) VALUES (%s, %s)", (judul, stok_angka))
    db.close()

    flash('Buku baru berhasil disimpan ke sistem!', 'success')
    return redirect(url_for('katalog'))`,
        description: "Contoh validasi input server-side dan pemanggilan pesan flash() di Flask",
      },
    ],
    simId: "p9-py-validasi-form",
    quiz: {
      question: "Mengapa sebelum menggunakan fitur `flash()` atau `session` pada Flask kita wajib menyetel konfigurasi `app.secret_key`?",
      options: [
        "Karena Flask menggunakan secret key untuk menandatangani (sign) data session secara kriptografis agar tidak dapat dimanipulasi oleh pengguna di browser",
        "Untuk menghubungkan Python ke satelit internet",
        "Karena MySQL tidak mengizinkan penulisan teks tanpa secret key",
        "Agar file gambar terkompres otomatis",
      ],
      answer: 0,
      explanation: "Flask menyimpan data session di cookie yang ditandatangani secara kriptografis menggunakan `app.secret_key`. Tanpa secret key, fitur session dan flash akan menghasilkan error runtime.",
    },
    tugas: {
      title: "RTM-5: Validasi Input & Flash Message di Flask",
      description: "Terapkan validasi input pada form buku di Python. Tampilkan alert sukses jika input benar, dan alert merah jika ada kolom yang kosong atau tidak valid.",
      rubrik: [
        { criteria: "app.secret_key terkonfigurasi dengan benar", bobot: "25%" },
        { criteria: "Validasi server-side mendeteksi input salah", bobot: "40%" },
        { criteria: "Pesan flash muncul rapi di template Jinja2", bobot: "35%" },
      ],
    },
  },
  {
    no: 10,
    phase: "Fase 3: Fitur Menengah",
    title: "Relasi One-to-Many & Query JOIN MySQL di Python",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK2: Relasi One-to-Many & Query JOIN di Python (C3)",
    subCpmk: "Mahasiswa mampu merancang Foreign Key `kategori_id` pada tabel `buku`, membuat dropdown pilihan kategori, dan menampilkan nama kategori menggunakan query SQL JOIN.",
    indikator: [
      "Mampu membuat relasi Foreign Key antara tabel `kategori` dan `buku` di MySQL",
      "Mampu mengambil daftar kategori dari database untuk ditampilkan pada elemen `<select>` form input",
      "Mampu mengeksekusi query `SELECT buku.*, kategori.nama_kategori FROM buku JOIN kategori ...`",
      "Mampu menampilkan nama kategori buku pada tabel katalog di template Jinja2",
    ],
    problemStatement: "Bagaimana cara menghubungkan tabel kategori buku dengan tabel buku di Python, sehingga admin cukup memilih kategori dari dropdown dan nama kategori langsung muncul di tabel katalog?",
    goal: "Menguasai relasi One-to-Many di MySQL dan implementasi query JOIN di Python Flask.",
    outputPraktikum: "Tabel katalog buku yang menampilkan Nama Kategori dari relasi tabel MySQL",
    projectMilestone: "Relasi Kategori-Buku aktif di SIMPUS-Python",
    tools: ["phpMyAdmin", "VS Code", "Browser"],
    alokasiWaktu: "150 Menit (40 menit teori relasi & JOIN + 110 menit praktik query JOIN di Python)",
    teori: [
      {
        title: "Relasi One-to-Many & Eksekusi JOIN di Python",
        points: [
          "Tabel `kategori` (id, nama_kategori).",
          "Tabel `buku` memiliki Foreign Key `kategori_id` yang merujuk ke `kategori.id`.",
          "Query SQL JOIN: `SELECT b.*, k.nama_kategori FROM buku b LEFT JOIN kategori k ON b.kategori_id = k.id ORDER BY b.id DESC`.",
          "PyMySQL DictCursor akan otomatis memasukkan key `'nama_kategori'` ke dalam dictionary setiap buku.",
        ],
        explanation: "Relasi database mencegah kesalahan pengetikan dan menjaga kebersihan data.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Tabel kategori dan Mengisi Data Awal",
        desc: "Eksekusi CREATE TABLE kategori (id INT AUTO_INCREMENT PRIMARY KEY, nama_kategori VARCHAR(100)).",
      },
      {
        step: 2,
        title: "Mengirim Data Kategori ke Form Tambah Buku",
        desc: "Jalankan SELECT * FROM kategori lalu kirimkan ke render_template('tambah_buku.html', kategori_list=kategori_list).",
      },
      {
        step: 3,
        title: "Mengubah Query Katalog Menjadi Query JOIN",
        desc: "Gunakan LEFT JOIN kategori ON buku.kategori_id = kategori.id agar nama kategori dapat dicetak via {{ b.nama_kategori }}.",
      },
    ],
    files: [
      {
        name: "contoh_join_python.py",
        lang: "bash",
        code: `@app.route('/katalog')
def katalog():
    db = get_db()
    with db.cursor() as cursor:
        sql = """SELECT b.*, k.nama_kategori 
                 FROM buku b 
                 LEFT JOIN kategori k ON b.kategori_id = k.id 
                 ORDER BY b.id DESC"""
        cursor.execute(sql)
        buku_list = cursor.fetchall()
    db.close()
    return render_template('katalog.html', buku_list=buku_list)`,
        description: "Query LEFT JOIN antara tabel buku dan kategori menggunakan PyMySQL",
      },
    ],
    simId: "p10-py-relasi-join",
    quiz: {
      question: "Mengapa kita menggunakan `LEFT JOIN` dan bukan `INNER JOIN` saat menggabungkan tabel buku dengan tabel kategori pada katalog perpustakaan?",
      options: [
        "Agar buku yang belum memiliki kategori (kategori_id bernilai NULL) tetap tampil di daftar buku tanpa hilang dari layar",
        "Karena LEFT JOIN berjalan di sebelah kiri monitor",
        "Agar MySQL menghapus buku yang tidak punya kategori",
        "Karena Python tidak mendukung INNER JOIN",
      ],
      answer: 0,
      explanation: "LEFT JOIN memastikan seluruh baris dari tabel sisi kiri (tabel buku) tetap ditampilkan meskipun buku tersebut belum memiliki kategori atau nilai kategorinya kosong (NULL).",
    },
    tugas: {
      title: "RTM-6: Relasi One-to-Many & JOIN di Python",
      description: "Sediakan dropdown pilihan Kategori pada form tambah buku, simpan kategori_id ke database, dan tampilkan nama kategori tersebut di tabel katalog menggunakan query SQL JOIN.",
      rubrik: [
        { criteria: "Dropdown kategori di form mengambil data dinamis dari MySQL", bobot: "35%" },
        { criteria: "Query JOIN di Python mengambil nama_kategori", bobot: "35%" },
        { criteria: "Nama kategori tampil rapi di tabel katalog Jinja2", bobot: "30%" },
      ],
    },
  },
  {
    no: 11,
    phase: "Fase 3: Fitur Menengah",
    title: "Autentikasi Sederhana: Session-Based Login & Register di Python",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK3: Implementasi Autentikasi Session di Python (C3)",
    subCpmk: "Mahasiswa mampu membuat form registrasi dengan hashing password (`generate_password_hash`) dan sistem login berbasis `flask.session`.",
    indikator: [
      "Mampu membuat tabel `users` dengan kolom password",
      "Mampu melakukan hashing password menggunakan `werkzeug.security.generate_password_hash`",
      "Mampu memverifikasi login menggunakan `check_password_hash`",
      "Mampu menyimpan status login di objek `session['logged_in'] = True` dan menghapusnya saat logout via `session.clear()`",
    ],
    problemStatement: "Bagaimana cara server Python membedakan pengunjung anonim dengan pengguna yang sudah resmi terdaftar dan masuk ke sistem?",
    goal: "Menguasai konsep autentikasi berbasis session di Python, hashing password dengan Werkzeug, dan siklus login/logout.",
    outputPraktikum: "Modul Register, Login, dan Logout berbasis Session berfungsi",
    projectMilestone: "Sistem autentikasi SIMPUS-Python aktif",
    tools: ["VS Code", "Browser", "Werkzeug Security"],
    alokasiWaktu: "150 Menit (30 menit teori session & hashing + 120 menit praktik coding Auth)",
    teori: [
      {
        title: "Hashing Password di Python dengan Werkzeug",
        points: [
          "`from werkzeug.security import generate_password_hash, check_password_hash`",
          "`generate_password_hash(password_polos)`: Menghasilkan string hash acak yang aman (pbkdf2 / scrypt).",
          "`check_password_hash(password_hash_db, password_input)`: Mengembalikan True jika password cocok.",
        ],
        explanation: "Pustaka Werkzeug sudah terinstal otomatis bersama Flask dan merupakan standar keamanan industri di dunia Python.",
      },
      {
        title: "Objek session di Flask",
        points: [
          "Import: `from flask import session`",
          "Simpan data login: `session['user_id'] = user['id']`, `session['role'] = user['role']`, `session['logged_in'] = True`.",
          "Logout: `session.clear()` menghapus seluruh data login pengguna dari session.",
        ],
        explanation: "Session memungkinkan aplikasi mengenali pengguna di berbagai halaman berbeda tanpa meminta login ulang setiap kali mengklik menu.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Tabel users di MySQL",
        desc: "Buat tabel users: id, nama, email, password VARCHAR(255), role VARCHAR(20).",
      },
      {
        step: 2,
        title: "Membuat Route /register dengan generate_password_hash",
        desc: "Ambil password dari form, hash password, lalu simpan ke database.",
      },
      {
        step: 3,
        title: "Membuat Route /login dengan check_password_hash",
        desc: "Cek email di MySQL, periksa password dengan check_password_hash, jika benar set session.",
      },
      {
        step: 4,
        title: "Membuat Route /logout",
        desc: "Panggil session.clear() lalu redirect ke halaman login.",
      },
    ],
    files: [
      {
        name: "contoh_auth_python.py",
        lang: "bash",
        code: `from flask import session
from werkzeug.security import generate_password_hash, check_password_hash

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        nama     = request.form['nama']
        email    = request.form['email']
        password = request.form['password']
        role     = request.form.get('role', 'user')

        # Hash password sebelum disimpan
        hashed_password = generate_password_hash(password)

        db = get_db()
        with db.cursor() as cursor:
            cursor.execute("INSERT INTO users (nama, email, password, role) VALUES (%s, %s, %s, %s)",
                           (nama, email, hashed_password, role))
        db.close()

        flash('Pendaftaran berhasil! Silakan login.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email    = request.form['email']
        password = request.form['password']

        db = get_db()
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
        db.close()

        if user and check_password_hash(user['password'], password):
            # Login sukses: set session
            session['logged_in'] = True
            session['user_id']   = user['id']
            session['nama']      = user['nama']
            session['role']      = user['role']

            flash(f"Selamat datang, {user['nama']}!", 'success')
            return redirect(url_for('katalog'))

        flash('Email atau password salah!', 'danger')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Anda telah logout dari sistem.', 'info')
    return redirect(url_for('login'))`,
        description: "Implementasi lengkap fitur register, login session, dan logout di Python Flask",
      },
    ],
    simId: "p11-py-auth-session",
    quiz: {
      question: "Fungsi apakah dari pustaka `werkzeug.security` yang digunakan untuk memverifikasi kecocokan antara password teks yang diketik pengguna saat login dengan password hash yang ada di MySQL?",
      options: [
        "check_password_hash(password_hash_db, password_input)",
        "password == password_hash",
        "verify_sql_password()",
        "decrypt_password()",
      ],
      answer: 0,
      explanation: "Fungsi `check_password_hash()` memverifikasi kecocokan password dengan string hash secara aman tanpa pernah mendekripsi hash tersebut (karena hash bersifat satu arah).",
    },
    tugas: {
      title: "RTM-7: Implementasi Fitur Register & Login Python",
      description: "Buat form register dan form login di Python Flask. Pastikan password disimpan dalam bentuk hash di tabel MySQL dan session berhasil tersimpan saat login.",
      rubrik: [
        { criteria: "Password tersimpan dalam bentuk hash di MySQL", bobot: "35%" },
        { criteria: "Proses verifikasi login dan set session berfungsi", bobot: "35%" },
        { criteria: "Fungsi logout berhasil membersihkan session", bobot: "30%" },
      ],
    },
  },
  {
    no: 12,
    phase: "Fase 3: Fitur Menengah",
    title: "Otorisasi Dasar: Role Sederhana (Admin vs User) & Python Decorator",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK3: Otorisasi Role & Custom Decorator di Python (C3)",
    subCpmk: "Mahasiswa mampu membuat custom decorator `@login_required` dan `@admin_required` untuk membatasi hak akses halaman berdasarkan role di Python.",
    indikator: [
      "Mampu memahami konsep decorator fungsi di Python (`@functools.wraps`)",
      "Mampu membuat decorator `@login_required` untuk mencegah akses anonim",
      "Mampu membuat decorator `@admin_required` untuk mengunci fitur tambah/edit/hapus hanya bagi role Admin",
      "Mampu mempresentasikan kemajuan proyek SIMPUS-Python",
    ],
    problemStatement: "Bagaimana cara Python mengunci route `/buku/hapus/<id>` agar hanya bisa diakses oleh akun Admin, sementara anggota biasa langsung ditolak dengan pesan 'Akses Ditolak'?",
    goal: "Menguasai konsep Python Decorator untuk proteksi hak akses rute (otorisasi) dan evaluasi kemajuan proyek sebelum UAS.",
    outputPraktikum: "Rute administrasi terkunci rapi menggunakan decorator Python; anggota biasa tidak bisa mengubah data",
    projectMilestone: "Sistem autentikasi & otorisasi SIMPUS-Python selesai (Checkpoint Pra-UAS)",
    tools: ["VS Code", "Browser"],
    alokasiWaktu: "150 Menit (30 menit teori decorator + 90 menit praktik + 30 menit presentasi progress)",
    teori: [
      {
        title: "Konsep Custom Decorator di Python",
        points: [
          "Decorator: Fungsi Python yang membungkus fungsi lain untuk menambahkan logika sebelum fungsi utama dijalankan.",
          "Analogi: Seperti satpam di pintu masuk ruangan VIP yang memeriksa kartu identitas pengunjung.",
          "Gunakan `from functools import wraps` agar metadata nama fungsi asli tidak hilang.",
        ],
        explanation: "Dengan decorator, kita cukup menulis `@admin_required` di atas rute tanpa perlu menulis kode `if session.get('role') != 'admin':` berulang-ulang di setiap fungsi.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuat Custom Decorator di auth_helpers.py",
        desc: "Buat fungsi login_required dan admin_required menggunakan wraps.",
        filePath: "auth_helpers.py",
      },
      {
        step: 2,
        title: "Memasang Decorator pada Route Tambah, Edit, Hapus",
        desc: "Tambahkan @login_required dan @admin_required tepat di bawah @app.route.",
        filePath: "app.py",
      },
      {
        step: 3,
        title: "Kondisional Tampilan Tombol di Template Jinja2",
        desc: "Bungkus tombol Edit dan Hapus dengan {% if session.get('role') == 'admin' %}.",
      },
    ],
    files: [
      {
        name: "auth_helpers.py",
        lang: "bash",
        code: `from functools import wraps
from flask import session, redirect, url_for, flash

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            flash('Silakan login terlebih dahulu untuk mengakses halaman ini.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            flash('Silakan login terlebih dahulu.', 'warning')
            return redirect(url_for('login'))
        if session.get('role') != 'admin':
            flash('Akses Ditolak: Fitur ini hanya untuk Administrator!', 'danger')
            return redirect(url_for('katalog'))
        return f(*args, **kwargs)
    return decorated_function`,
        description: "Modul helper custom decorator untuk proteksi rute login dan otorisasi role admin di Python",
      },
    ],
    simId: "p12-py-role-decorator",
    asesmenTerkait: {
      nama: "Asesmen Formatif 2 (Pra-UAS)",
      bobot: "20%",
      tipe: "formatif",
    },
    quiz: {
      question: "Apakah fungsi dari baris kode `@admin_required` yang diletakkan di atas sebuah fungsi route `@app.route('/buku/hapus/<int:id>')` di Python Flask?",
      options: [
        "Mengeksekusi pemeriksaan peran pengguna terlebih dahulu; jika bukan admin, request langsung dibatalkan sebelum kode penghapusan sempat dijalankan",
        "Menghapus seluruh database buku secara otomatis",
        "Mengirim email ke seluruh pengguna",
        "Membuat akun admin baru di MySQL",
      ],
      answer: 0,
      explanation: "Decorator bertindak sebagai gerbang pengaman (middleware) yang mengevaluasi hak akses sebelum meneruskan eksekusi ke fungsi inti di bawahnya.",
    },
    tugas: {
      title: "ASESMEN FORMATIF 2 (Bobot 20%): Progress Project (Login+Role) + Presentasi",
      description: "Terapkan decorator @login_required dan @admin_required pada aplikasi SIMPUS-Python. Uji coba dengan akun Admin dan Anggota, lalu presentasikan kemajuan aplikasi di depan kelas.",
      rubrik: [
        { criteria: "Fitur register & login dengan password hashing berfungsi", bobot: "30%" },
        { criteria: "Decorator proteksi role Admin vs User aktif", bobot: "35%" },
        { criteria: "Kelancaran presentasi progress & tanya jawab", bobot: "35%" },
      ],
    },
  },
  {
    no: 13,
    phase: "Fase 4: Hosting & Deploy",
    title: "Pengenalan Web Hosting Python, WSGI Server & cPanel 'Setup Python App'",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK4: Pengenalan Infrastruktur Web Hosting Python & WSGI (C2)",
    subCpmk: "Mahasiswa mampu menjelaskan cara kerja hosting aplikasi Python pada cPanel menggunakan fitur 'Setup Python App' (Passenger WSGI) dan mempersiapkan database MySQL online.",
    indikator: [
      "Mampu menjelaskan perbedaan hosting PHP (mod_php) vs hosting Python (Passenger WSGI)",
      "Mengenal fitur 'Setup Python App' di cPanel untuk memilih versi Python dan virtualenv server",
      "Memahami peran berkas startup `passenger_wsgi.py`",
      "Mampu membuat database dan user MySQL online di cPanel",
    ],
    problemStatement: "Berbeda dengan PHP yang langsung jalan saat file ditaruh di `public_html`, aplikasi Python membutuhkan proses WSGI application server yang terus berjalan. Bagaimana cara menjalankan Python di shared hosting cPanel?",
    goal: "Memahami infrastruktur web hosting Python, modul Phusion Passenger, dan konfigurasi cPanel 'Setup Python App'.",
    outputPraktikum: "Aplikasi Python virtualenv dan database MySQL siap di cPanel hosting",
    projectMilestone: "Infrastruktur server hosting Python siap",
    tools: ["Browser", "cPanel Hosting Python", "phpMyAdmin Hosting"],
    alokasiWaktu: "150 Menit (60 menit teori Passenger WSGI + 90 menit eksplorasi cPanel Python App)",
    teori: [
      {
        title: "Cara Kerja Phusion Passenger untuk Python di cPanel",
        points: [
          "Phusion Passenger: Modul server yang menjalankan aplikasi Python sebagai proses daemon WSGI di balik web server Apache/Nginx.",
          "Fitur 'Setup Python App' di cPanel: Menyediakan antarmuka grafis untuk memilih versi Python (misal: 3.10 / 3.11), lokasi folder aplikasi, dan otomatis membuat virtualenv di server.",
          "File `passenger_wsgi.py`: Titik masuk (entry point) wajib di server yang mengekspor variabel `application` dari objek Flask (`from app import app as application`).",
        ],
        explanation: "Dengan cPanel Setup Python App, pengembang tidak perlu menyewa VPS mahal untuk menjalankan aplikasi web Python secara online.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Buka Menu 'Setup Python App' di cPanel",
        desc: "Klik menu 'Setup Python App' -> Klik tombol 'Create Application'.",
      },
      {
        step: 2,
        title: "Konfigurasi Proyek Python di cPanel",
        desc: "Pilih Python Version: 3.10/3.11. Application Root: /home/user/simpus_py. Application URL: pilih subdomain/domain Anda. Klik 'Create'.",
      },
      {
        step: 3,
        title: "Membuat Database MySQL di cPanel",
        desc: "Buka MySQL Database Wizard -> Buat database u1234_simpus_py dan user database dengan hak ALL PRIVILEGES.",
      },
    ],
    files: [
      {
        name: "passenger_wsgi.py",
        lang: "bash",
        code: `import sys, os

# Tambahkan direktori aplikasi ke sys.path Python
sys.path.insert(0, os.path.dirname(__file__))

# Impor objek aplikasi Flask dan beri alias 'application' (standar WSGI)
from app import app as application`,
        description: "Berkas startup WSGI (passenger_wsgi.py) wajib untuk shared hosting cPanel Python",
      },
    ],
    simId: "p13-py-cpanel-python-app",
    quiz: {
      question: "Pada shared hosting cPanel yang menggunakan modul Phusion Passenger untuk menjalankan aplikasi web Python, apakah nama berkas startup standar yang bertugas mengekspor variabel `application`?",
      options: [
        "passenger_wsgi.py",
        "index.html",
        "server.exe",
        "config.php",
      ],
      answer: 0,
      explanation: "`passenger_wsgi.py` adalah berkas startup default yang dicari oleh modul Passenger di cPanel untuk menghubungkan server web Apache dengan objek aplikasi WSGI Flask/Django.",
    },
    tugas: {
      title: "RTM-8A: Konfigurasi Python App di cPanel",
      description: "Buat aplikasi Python baru via menu 'Setup Python App' di cPanel, buat database MySQL online, dan catat path virtual environment server.",
      rubrik: [
        { criteria: "Aplikasi Python cPanel terbuat dengan status 'Running'", bobot: "40%" },
        { criteria: "Database MySQL online siap di cPanel", bobot: "30%" },
        { criteria: "Kredensial database tersimpan rapi", bobot: "30%" },
      ],
    },
  },
  {
    no: 14,
    phase: "Fase 4: Hosting & Deploy",
    title: "Praktik Deployment Python: Upload File, Install Requirements & Database Live",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK4: Deployment Aplikasi Python ke Hosting (C3)",
    subCpmk: "Mahasiswa mampu mengunggah kode aplikasi Python, menginstal dependensi via `pip install -r requirements.txt` di server, mengimpor database, dan mengonfigurasi koneksi MySQL live.",
    indikator: [
      "Mampu mengunggah berkas kode aplikasi Python ke direktori application root cPanel",
      "Mampu menginstal paket dependensi menggunakan pip pada virtualenv cPanel",
      "Mampu mengimpor file `simpus_py.sql` ke phpMyAdmin hosting",
      "Mampu mengonfigurasi koneksi MySQL di berkas `db.py` server",
      "Aplikasi Python berhasil dibuka secara publik melalui URL domain aktif",
    ],
    problemStatement: "Bagaimana cara memindahkan seluruh kode aplikasi Python kita dari laptop ke server hosting cPanel, menginstal pustaka Flask & PyMySQL di server, dan menghubungkan database online-nya?",
    goal: "Mahasiswa berhasil men-deploy aplikasi web Python Flask dan database MySQL hingga live di internet.",
    outputPraktikum: "Aplikasi SIMPUS-Python BERHASIL ONLINE di internet dan dapat diakses publik",
    projectMilestone: "Aplikasi SIMPUS-Python resmi LIVE di Web Hosting!",
    tools: ["cPanel File Manager", "phpMyAdmin Hosting", "Browser"],
    alokasiWaktu: "150 Menit (20 menit panduan deployment + 130 menit live deployment & troubleshooting bersama)",
    teori: [
      {
        title: "Langkah Kunci Deployment Python di cPanel",
        points: [
          "1. Export database dari phpMyAdmin lokal -> Import ke phpMyAdmin hosting.",
          "2. Upload file kode proyek (kecuali folder venv lokal!) ke Application Root cPanel.",
          "3. Masuk ke menu Setup Python App -> Salin perintah aktivasi virtualenv server (contoh: `source /home/user/virtualenv/simpus_py/3.10/bin/activate`).",
          "4. Buka Terminal cPanel -> Jalankan perintah aktivasi tadi -> Jalankan `pip install -r requirements.txt`.",
          "5. Buat file `passenger_wsgi.py` di Application Root.",
          "6. Sesuaikan user & password database di `db.py` server.",
          "7. Klik tombol 'Restart' pada antarmuka Setup Python App di cPanel.",
        ],
        explanation: "Tombol 'Restart' di cPanel wajib ditekan setiap kali ada perubahan file kode Python agar Passenger memuat ulang proses worker.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Export Database MySQL Lokal",
        desc: "Export database simpus_py menjadi file simpus_py.sql.",
      },
      {
        step: 2,
        title: "Import Database ke phpMyAdmin Hosting",
        desc: "Buka phpMyAdmin cPanel dan import simpus_py.sql ke database hosting.",
      },
      {
        step: 3,
        title: "Upload File Kode ke cPanel File Manager",
        desc: "Upload ZIP kode (app.py, db.py, templates/, static/, requirements.txt) lalu ekstrak.",
      },
      {
        step: 4,
        title: "Instal Dependensi via Terminal / Menu cPanel",
        desc: "Jalankan pip install -r requirements.txt pada virtual environment server.",
      },
      {
        step: 5,
        title: "Konfigurasi db.py & Restart Aplikasi",
        desc: "Ubah kredensial database di db.py dengan user cPanel lalu klik tombol 'Restart' Python App.",
      },
    ],
    files: [
      {
        name: "db_production.py",
        lang: "bash",
        code: `import pymysql
from pymysql.cursors import DictCursor

def get_db():
    """Koneksi database MySQL untuk Server Hosting cPanel"""
    connection = pymysql.connect(
        host='localhost',
        user='u1234567_admin',            # Username cPanel Anda
        password='PasswordKuatHosting2024!', # Password user database cPanel
        database='u1234567_simpus_py',     # Nama database cPanel Anda
        port=3306,
        cursorclass=DictCursor,
        autocommit=True
    )
    return connection`,
        description: "Contoh konfigurasi koneksi MySQL produksi pada web hosting cPanel",
      },
    ],
    simId: "p14-py-deployment-wsgi-mysql",
    quiz: {
      question: "Mengapa folder `venv` yang ada di komputer laptop lokal TIDAK BOLEH ikut di-upload ke server hosting Linux saat melakukan deployment aplikasi Python?",
      options: [
        "Karena virtual environment lokal berisi binary interpreter khusus sistem operasi laptop Anda (misal Windows), sehingga tidak kompatibel dengan server Linux dan harus diinstal ulang di server via requirements.txt",
        "Karena folder venv hanya berisi gambar",
        "Supaya kuota internet habis lebih cepat",
        "Karena cPanel menolak nama folder yang terdiri dari 4 huruf",
      ],
      answer: 0,
      explanation: "Binary file executable pada folder venv terikat pada arsitektur sistem operasi lokal (misal Windows x64). Di server Linux hosting, paket harus diinstal ulang ke virtualenv Linux menggunakan `pip install -r requirements.txt`.",
    },
    tugas: {
      title: "RTM-8B: Deployment Aplikasi Python ke Hosting",
      description: "Upload aplikasi Python Anda ke cPanel, install dependensi di server, import database ke MySQL hosting, dan pastikan aplikasi live dapat diakses tanpa error 500.",
      rubrik: [
        { criteria: "Database berhasil di-import ke MySQL hosting", bobot: "30%" },
        { criteria: "Dependensi pip terinstal di virtualenv server", bobot: "35%" },
        { criteria: "Aplikasi live online dan fitur CRUD berfungsi normal", bobot: "35%" },
      ],
    },
  },
  {
    no: 15,
    phase: "Fase 4: Hosting & Deploy",
    title: "Finalisasi Proyek Python, Live Debugging & Dokumentasi Sederhana",
    sks: "3 SKS (1 Teori + 2 Praktikum)",
    cpmk: "CPMK4 & CPMK5: Debugging Server & Dokumentasi Proyek (C3/C4)",
    subCpmk: "Mahasiswa mampu mendiagnosis error Passenger WSGI dan menyusun dokumen panduan penggunaan aplikasi sederhana.",
    indikator: [
      "Mampu membaca file error log Passenger WSGI di cPanel (`stderr.log`)",
      "Mampu mengatasi error umum koneksi database MySQL di server",
      "Menyusun file README.md (panduan penggunaan dan akun demo pengujian)",
      "Menyiapkan slide presentasi singkat untuk Ujian Akhir Semester (UAS)",
    ],
    problemStatement: "Bagaimana jika saat aplikasi Python dibuka muncul pesan 'Incomplete response received from application'? Di mana letak log error-nya dan bagaimana cara memperbaikinya?",
    goal: "Klinik debugging bersama dosen, pemecahan masalah deployment, dan penyusunan dokumentasi proyek yang rapi.",
    outputPraktikum: "Dokumentasi README.md dan Aplikasi Python stabil siap uji untuk UAS",
    projectMilestone: "Aplikasi SIMPUS-Python 100% selesai, online, stabil, dan terdokumentasi",
    tools: ["VS Code", "Word / Markdown", "Browser"],
    alokasiWaktu: "150 Menit (Full praktik klinik debugging & review dokumentasi)",
    teori: [
      {
        title: "Membaca Error Log Passenger WSGI",
        points: [
          "Jika muncul layar putih atau error 500: Jangan panik! Buka File Manager cPanel.",
          "Cari file `stderr.log` di dalam direktori proyek Anda.",
          "File tersebut mencatat traceback persis di baris mana kode Python mengalami error.",
        ],
        explanation: "Membaca error log adalah keterampilan wajib bagi seorang software engineer untuk mendiagnosis masalah dengan cepat.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Pengecekan Log Error di stderr.log",
        desc: "Periksa file stderr.log untuk memastikan tidak ada import error atau database connection error.",
      },
      {
        step: 2,
        title: "Uji Coba Skenario Penuh di Browser",
        desc: "Uji alur pendaftaran -> login Admin -> tambah buku -> edit -> hapus -> login Anggota.",
      },
      {
        step: 3,
        title: "Menulis Dokumentasi README.md",
        desc: "Tuliskan deskripsi aplikasi, link live URL, dan tabel akun demo untuk dosen penguji.",
      },
    ],
    files: [
      {
        name: "README.md",
        lang: "bash",
        code: `# SIMPUS-Mini Python (Sistem Informasi Perpustakaan Mini)
Aplikasi Web Backend Dasar berbasis Python 3 & Flask dengan Database MySQL.

## 🌐 Live URL
- URL Hosting: https://simpus-python.mhs.latihan.my.id/

## 🔑 Akun Demo Pengujian
| Role | Email | Password |
|---|---|---|
| **Admin** | admin@simpus.local | admin123 |
| **Anggota** | siti@gmail.com | user123 |

## 🚀 Fitur Utama
1. WSGI & Routing: Flask App dengan Template Engine Jinja2 (Base Inheritance).
2. Database MySQL: Terhubung via PyMySQL dengan query aman parameterized.
3. CRUD Buku: Create, Read (List & Detail), Update, Delete dengan konfirmasi.
4. Validasi Form: Server-side validation dan Flash Messages alert.
5. Relasi MySQL: Relasi One-to-Many tabel kategori & buku dengan query LEFT JOIN.
6. Autentikasi & Otorisasi: Password Hashing (Werkzeug), Session Login, dan Custom Decorator @admin_required.
7. Deployment: Terpasang online di cPanel Hosting via Phusion Passenger WSGI.`,
        description: "Contoh format dokumentasi README.md untuk proyek backend Python",
      },
    ],
    simId: "p15-py-finalisasi-project",
    quiz: {
      question: "Di manakah lokasi berkas log yang mencatat pesan error atau traceback Python saat terjadi kegagalan eksekusi aplikasi di shared hosting cPanel Passenger?",
      options: [
        "Berkas `stderr.log` di direktori proyek aplikasi",
        "Di dalam file CSS",
        "Di memori RAM monitor laptop",
        "Tidak ada log sama sekali di server",
      ],
      answer: 0,
      explanation: "Phusion Passenger secara default mengalihkan keluaran error standar Python (sys.stderr) ke berkas `stderr.log` yang terletak di direktori root aplikasi di cPanel.",
    },
    tugas: {
      title: "RTM-9: Laporan & Dokumentasi Proyek Python",
      description: "Tuliskan laporan penggunaan aplikasi SIMPUS-Python, sertakan akun demo pengujian dan URL live hosting, serta tangkapan layar fitur-fitur utama.",
      rubrik: [
        { criteria: "Kelengkapan informasi akun demo & URL live", bobot: "40%" },
        { criteria: "Kerapian petunjuk penggunaan dan tangkapan layar", bobot: "30%" },
        { criteria: "Aplikasi bebas dari bug fatal", bobot: "30%" },
      ],
    },
  },
  {
    no: 16,
    phase: "UAS",
    title: "UJIAN AKHIR SEMESTER (UAS): Demo Aplikasi Live di Hosting & Presentasi",
    sks: "3 SKS (Presentasi & Demo Live)",
    cpmk: "CPMK4 & CPMK5: Presentasi & Demo Aplikasi Live Python di Web Hosting (C4)",
    subCpmk: "Mahasiswa mampu mendemonstrasikan aplikasi web backend Python hasil karya sendiri secara live di internet, menjelaskan logika kode program, dan menjawab pertanyaan teknis dosen.",
    indikator: [
      "Aplikasi Python berhasil diakses secara online via URL domain hosting aktif tanpa error",
      "Fitur wajib (CRUD, Validasi, Relasi One-to-Many, Session Auth, Role Admin-User via Decorator) berjalan lancar saat didemokan langsung",
      "Mampu menjelaskan alur kerja kode Python (WSGI, Query PyMySQL, Decorator, Template Jinja2)",
      "Laporan akhir dan dokumentasi README terkumpul rapi tepat waktu",
    ],
    problemStatement: "Hari penentuan! Buktikan bahwa kamu telah menguasai keahlian software engineering backend web: aplikasi web berbasis Python dan database MySQL yang kamu bangun kini telah online dan bermanfaat secara nyata!",
    goal: "Mahasiswa membuktikan pencapaian seluruh Capaian Pembelajaran Mata Kuliah (CPMK 1-5) melalui demonstrasi live dan ujian lisan.",
    outputPraktikum: "Nilai Akhir Kelulusan Mata Kuliah Sistem Aplikasi Web (Backend Dasar)",
    projectMilestone: "Penyelesaian 100% Mata Kuliah Sistem Aplikasi Web (Backend Dasar)",
    tools: ["Browser Laptop/HP", "Proyektor / Screen Share", "Laporan Akhir"],
    alokasiWaktu: "150 Menit (Presentasi, demo live, dan tanya jawab teknis)",
    teori: [
      {
        title: "Rubrik Evaluasi Ujian Akhir Semester Python (Bobot 35%)",
        points: [
          "1. Keberhasilan Akses Live di Hosting (25%): Aplikasi dapat dibuka lancar via domain hosting.",
          "2. Kelengkapan Fitur (35%): CRUD, Relasi JOIN, Validasi, Session Login & Role Decorator berjalan 100%.",
          "3. Penguasaan Konsep & Tanya Jawab (25%): Mahasiswa dapat menjelaskan alasan dan alur kode Python mereka.",
          "4. Kualitas Dokumentasi & Kerapian Kode (15%): Laporan rapi, penamaan variabel konsisten, struktur folder bersih.",
        ],
        explanation: "Penilaian berorientasi pada fungsionalitas dan pemahaman logika kerja backend Python.",
      },
    ],
    steps: [
      {
        step: 1,
        title: "Membuka URL Live Aplikasi Python di Depan Penguji",
        desc: "Akses https://simpus-python.mhs.latihan.my.id di browser.",
      },
      {
        step: 2,
        title: "Mendemonstrasikan Alur Fitur Lengkap",
        desc: "Demonstrasikan pendaftaran akun -> login session -> tambah buku baru -> perlihatkan query JOIN kategori -> tunjukkan proteksi decorator @admin_required.",
      },
      {
        step: 3,
        title: "Menjawab Pertanyaan Teknis Dosen Penguji",
        desc: "Jelaskan bagaimana PyMySQL berkomunikasi dengan basis data dan cara kerja decorator @login_required.",
      },
    ],
    files: [
      {
        name: "lembar_penilaian_uas_python.txt",
        lang: "bash",
        code: `LEMBAR PENILAIAN ASESMEN SUMATIF 2 (UAS - BOBOT 35%):
-------------------------------------------------------------------------
Nama Mahasiswa : _______________________
NIM            : _______________________
Live URL       : https://______________________

KOMPONEN PENILAIAN:
[ ] 1. Keberhasilan Akses Live Python di Hosting (Skor: 0 - 25)
[ ] 2. Kelengkapan Fitur CRUD + Relasi + Auth + Role (Skor: 0 - 35)
[ ] 3. Pemahaman Konsep saat Tanya Jawab Lisan (Skor: 0 - 25)
[ ] 4. Kualitas Dokumentasi / Laporan Akhir (Skor: 0 - 15)

TOTAL SKOR UAS : ______ / 100
Catatan Dosen  : Mahasiswa berhasil menyelesaikan proyek backend Python pemula sesuai standar OBE.`,
        description: "Format lembar rubrik penilaian dosen untuk ujian akhir semester backend Python",
      },
    ],
    simId: "p16-py-uas-showcase-live",
    asesmenTerkait: {
      nama: "Asesmen Sumatif 2 (UAS)",
      bobot: "35%",
      tipe: "sumatif",
    },
    quiz: {
      question: "Apakah target akhir paling esensial dari pembelajaran mata kuliah Sistem Aplikasi Web - Backend Dasar (Python)?",
      options: [
        "Mampu merancang basis data MySQL, membangun aplikasi CRUD lengkap dengan autentikasi session & role berbasis Python, serta berhasil men-deploy-nya hingga online di web hosting",
        "Hanya menjalankan kode di laptop tanpa pernah men-deploy ke server",
        "Menghafal sintaks tanpa memahami alur kerja client-server",
        "Menulis kode HTML tanpa interaksi dengan basis data",
      ],
      answer: 0,
      explanation: "Kompetensi puncak yang diharapkan dari lulusan mata kuliah ini adalah kemampuan mandiri membangun aplikasi backend fungsional dari tahap rancangan basis data hingga berhasil beroperasi secara langsung di internet.",
    },
    tugas: {
      title: "ASESMEN SUMATIF 2 (UAS - Bobot 35%): Demo Live + Laporan + Tanya Jawab",
      description: "Demonstrasikan aplikasi web backend Python Anda yang sudah live di hosting, jawab pertanyaan teknis penguji seputar alur WSGI dan query database, serta kumpulkan laporan akhir lengkap.",
      rubrik: [
        { criteria: "Aplikasi live di hosting dapat diakses lancar", bobot: "25%" },
        { criteria: "Kelengkapan seluruh fitur wajib (CRUD+Relasi+Auth+Role)", bobot: "35%" },
        { criteria: "Penguasaan konsep dan kemampuan menjawab tanya jawab", bobot: "25%" },
        { criteria: "Kualitas dokumen laporan akhir", bobot: "15%" },
      ],
    },
  },
];
