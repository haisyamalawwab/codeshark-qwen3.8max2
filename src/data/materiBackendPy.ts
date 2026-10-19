/* ==========================================================================
   DOKUMEN MATERI MARKDOWN SISTEM APLIKASI WEB - BACKEND DASAR (PYTHON FLASK / DJANGO)
   16 Pertemuan Lengkap Berbasis OBE & Standar DIKTI
   ========================================================================== */

import type { BackendMdDoc } from "./materiBackendCi";

export const PY_BACKEND_MD_DOCS: Record<number, BackendMdDoc> = {
  1: {
    no: 1,
    fileName: "01-pengantar-arsitektur-web-python.md",
    title: "Pengantar Arsitektur Web Python & Protokol WSGI",
    source: `# Pertemuan 1 — Pengantar Arsitektur Web Python & Protokol WSGI

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 1 dari 16)  
> **Bobot:** 3 SKS (1 Teori + 2 Praktikum) · **Level:** Pemula / Introductory Level  
> **CPMK1:** Mahasiswa mampu menjelaskan arsitektur web berbasis Python dan protokol WSGI (C2)

---

## 1. Problem Statement (PBL)
> *"Python terkenal sebagai bahasa pemrograman untuk Data Science dan AI, tetapi bagaimana Python digunakan untuk melayani jutaan permintaan web di Instagram dan Pinterest? Siapa yang menghubungkan web server dengan kode Python?"*

---

## 2. Arsitektur Web Python: Standar WSGI (PEP 3333)
Web Server Gateway Interface (WSGI) adalah spesifikasi resmi yang menghubungkan web server umum (Nginx/Apache) dengan framework aplikasi web Python (Flask/Django).

\`\`\`
[Browser Client]
       │
       │  1. HTTP GET /katalog
       ▼
[Web Server (Nginx / Apache / Passenger)]
       │
       │  2. Meneruskan Request via WSGI (environ dict)
       ▼
[Python Framework (Flask: app.py / Django: wsgi.py)]
       │
       │  3. Eksekusi fungsi view def katalog():
       ▼
[MySQL Database Server (Port 3306)]
       │
       │  4. Mengembalikan data record buku
       ▼
[Jinja2 Template Engine Renderer]
       │
       │  5. HTTP Response (Status 200 OK + HTML Tampilan)
       ▼
[Browser merender tampilan katalog ke pengguna]
\`\`\`

---

## 3. Flask vs Django untuk Pemula
- **Flask:** Micro-framework yang sangat ringan, transparan, dan mudah dipahami langkah demi langkah oleh pemula.
- **Django:** Full-stack framework dengan admin panel bawaan dan ORM tingkat lanjut.
- Pada mata kuliah ini, mahasiswa mempelajari konsep dasar backend dengan Flask, lalu melihat padanannya di Django.`,
  },
  2: {
    no: 2,
    fileName: "02-setup-venv-pip-flask.md",
    title: "Environment Setup: Virtualenv, Pip & 'Hello World' Pertama",
    source: `# Pertemuan 2 — Environment Setup: Virtualenv, Pip & 'Hello World' Pertama

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 2 dari 16)  
> **CPMK2:** Mahasiswa mampu mengonfigurasi virtual environment dan server Flask (C3)

---

## 1. Mengapa Virtual Environment (venv) Wajib?
Setiap proyek Python harus memiliki virtual environment terpisah agar pustaka dependensi tidak saling bertubrukan (Dependency Hell) antar proyek di komputer yang sama.

---

## 2. Langkah Membuat Virtualenv & Install Flask
\`\`\`bash
# 1. Buat folder dan venv
mkdir simpus-python && cd simpus-python
python -m venv venv

# 2. Aktivasi venv
venv\\Scripts\\activate       # Windows
source venv/bin/activate     # Mac / Linux

# 3. Install Flask & PyMySQL
pip install Flask PyMySQL cryptography

# 4. Simpan daftar paket
pip freeze > requirements.txt
\`\`\`

---

## 3. Kode Server Minimal app.py
\`\`\`python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def beranda():
    return "<h1>Selamat Datang di Backend Python Flask!</h1>"

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
\`\`\``,
  },
  3: {
    no: 3,
    fileName: "03-routing-jinja2-views.md",
    title: "Routing Dinamis & Template Engine Jinja2",
    source: `# Pertemuan 3 — Routing Dinamis & Template Engine Jinja2

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Setup & Dasar (Pertemuan 3 dari 16)  
> **CPMK1:** Mahasiswa mampu merender template Jinja2 dan passing data variabel (C3)

---

## 1. Konsep Template Engine Jinja2
Jinja2 memisahkan berkas HTML ke folder \`templates/\` sehingga kode Python tetap bersih dari tag HTML.

### Sintaks Utama Jinja2:
- **Cetak Variabel:** \`{{ nama_variabel }}\`
- **Perulangan Data:** \`{% for b in buku_list %} ... {% endfor %}\`
- **Percabangan:** \`{% if kondisi %} ... {% endif %}\`
- **Inheritance:** \`{% extends "base.html" %}\`

---

## 2. Template Dasar: templates/base.html
\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{% block title %}SIMPUS-Python{% endblock %}</title>
</head>
<body>
    <nav>
        <a href="/">Beranda</a> | <a href="/katalog">Katalog</a>
    </nav>
    <div class="content">
        {% block content %}{% endblock %}
    </div>
</body>
</html>
\`\`\``,
  },
  4: {
    no: 4,
    fileName: "04-database-mysql-pymysql.md",
    title: "Koneksi Database MySQL dengan Python & Driver PyMySQL",
    source: `# Pertemuan 4 — Koneksi Database MySQL dengan Python & Driver PyMySQL

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 4 dari 16)  
> **CPMK2:** Mahasiswa mampu membuat modul koneksi database PyMySQL (C3)  
> **ASESMEN FORMATIF 1 (Bobot 20%):** Kuis Konsep DB + Tugas Koneksi MySQL

---

## 1. Modul Koneksi: db.py
\`\`\`python
import pymysql
from pymysql.cursors import DictCursor

def get_db():
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        database='simpus_py',
        port=3306,
        cursorclass=DictCursor,
        autocommit=True
    )
    return connection
\`\`\`

> **Keunggulan DictCursor:** Mengembalikan data baris dalam format dictionary Python (\`{'judul': '...', 'stok': 5}\`), bukan tuple indeks angka, sehingga sangat cocok diteruskan ke template Jinja2.`,
  },
  5: {
    no: 5,
    fileName: "05-crud-create-form.md",
    title: "CRUD - CREATE: Form Input POST & Simpan Data ke MySQL",
    source: `# Pertemuan 5 — CRUD - CREATE: Form Input POST & Simpan Data ke MySQL

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 5 dari 16)  
> **CPMK2:** Mahasiswa mampu menyimpan data baru menggunakan parameterized query (C3)

---

## 1. Mencegah SQL Injection dengan Parameter Binding (%s)
\`\`\`python
@app.route('/buku/tambah', methods=['GET', 'POST'])
def tambah_buku():
    if request.method == 'POST':
        judul = request.form['judul']
        stok  = request.form['stok']

        db = get_db()
        with db.cursor() as cursor:
            # AMAN: Menggunakan %s parameter binding
            sql = "INSERT INTO buku (judul, stok) VALUES (%s, %s)"
            cursor.execute(sql, (judul, stok))
        db.close()

        return redirect(url_for('katalog'))

    return render_template('tambah_buku.html')
\`\`\``,
  },
  6: {
    no: 6,
    fileName: "06-crud-read-tabel.md",
    title: "CRUD - READ: Menampilkan List Data & Halaman Detail per ID",
    source: `# Pertemuan 6 — CRUD - READ: Menampilkan List Data & Halaman Detail per ID

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 6 dari 16)  
> **CPMK2:** Mahasiswa mampu mengambil data list (fetchall) dan detail (fetchone) (C3)

---

## 1. Route Detail dengan Parameter Converter <int:id>
\`\`\`python
from flask import abort

@app.route('/buku/<int:id>')
def detail_buku(id):
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT * FROM buku WHERE id = %s", (id,))
        buku = cursor.fetchone()
    db.close()

    if buku is None:
        abort(404, description="Buku tidak ditemukan.")

    return render_template('detail_buku.html', buku=buku)
\`\`\``,
  },
  7: {
    no: 7,
    fileName: "07-crud-update-delete.md",
    title: "CRUD - UPDATE & DELETE: Mengubah & Menghapus Data",
    source: `# Pertemuan 7 — CRUD - UPDATE & DELETE: Mengubah & Menghapus Data

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** MySQL & CRUD (Pertemuan 7 dari 16)  
> **CPMK2:** Mahasiswa mampu mengeksekusi operasi UPDATE dan DELETE di MySQL (C3)

---

## 1. Route Edit Buku
\`\`\`python
@app.route('/buku/edit/<int:id>', methods=['GET', 'POST'])
def edit_buku(id):
    db = get_db()
    with db.cursor() as cursor:
        if request.method == 'POST':
            judul = request.form['judul']
            cursor.execute("UPDATE buku SET judul = %s WHERE id = %s", (judul, id))
            db.close()
            return redirect(url_for('katalog'))

        cursor.execute("SELECT * FROM buku WHERE id = %s", (id,))
        buku = cursor.fetchone()
    db.close()
    return render_template('edit_buku.html', buku=buku)
\`\`\`

---

## 2. Route Hapus Buku
\`\`\`python
@app.route('/buku/hapus/<int:id>', methods=['POST', 'GET'])
def hapus_buku(id):
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("DELETE FROM buku WHERE id = %s", (id,))
    db.close()
    return redirect(url_for('katalog'))
\`\`\``,
  },
  8: {
    no: 8,
    fileName: "08-uts-proyek-crud.md",
    title: "UJIAN TENGAH SEMESTER (UTS): Praktik CRUD Python Mandiri",
    source: `# Pertemuan 8 — UJIAN TENGAH SEMESTER (UTS)

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Bobot:** 25% (Asesmen Sumatif 1)  
> **Format:** Praktik Langsung / Live Coding 150 Menit (Individu)  
> **CPMK2 & CPMK5:** Mampu membangun aplikasi CRUD Python mandiri (C3)

---

## 1. Studi Kasus UTS Python
Bangunlah sistem pengelolaan data inventaris toko komputer (\`db_toko_komputer\`) dengan tabel \`produk\` (id, kode_produk, nama_produk, harga, stok):
- Gunakan Flask & PyMySQL
- Buat rute CRUD lengkap
- Tampilkan dengan template Jinja2 rapi`,
  },
  9: {
    no: 9,
    fileName: "09-validasi-form-flash-messages.md",
    title: "Validasi Form Input & Flash Messages di Flask",
    source: `# Pertemuan 9 — Validasi Form Input & Flash Messages di Flask

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 9 dari 16)  
> **CPMK2:** Mahasiswa mampu memvalidasi data dan menggunakan session flash() (C3)

---

## 1. Mengaktifkan Flash Session
\`\`\`python
app.secret_key = 'kunci_rahasia_simpus_python'

@app.route('/buku/simpan', methods=['POST'])
def simpan_buku():
    judul = request.form.get('judul', '').strip()
    if not judul:
        flash('Judul buku tidak boleh kosong!', 'danger')
        return redirect(url_for('tambah_buku'))

    flash('Buku berhasil disimpan!', 'success')
    return redirect(url_for('katalog'))
\`\`\`

---

## 2. Menampilkan Flash di base.html
\`\`\`html
{% with messages = get_flashed_messages(with_categories=true) %}
    {% if messages %}
        {% for category, message in messages %}
            <div class="alert alert-{{ category }}">{{ message }}</div>
        {% endfor %}
    {% endif %}
{% endwith %}
\`\`\``,
  },
  10: {
    no: 10,
    fileName: "10-relasi-tabel-join-mysql.md",
    title: "Relasi Antar Tabel MySQL & Query JOIN di Python",
    source: `# Pertemuan 10 — Relasi Antar Tabel MySQL & Query JOIN di Python

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 10 dari 16)  
> **CPMK2:** Mahasiswa mampu merancang Foreign Key dan query JOIN di Python (C3)

---

## 1. Query JOIN di Python
\`\`\`python
@app.route('/katalog')
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
    return render_template('katalog.html', buku_list=buku_list)
\`\`\``,
  },
  11: {
    no: 11,
    fileName: "11-autentikasi-session-login.md",
    title: "Autentikasi Sederhana: Session-Based Login & Register di Python",
    source: `# Pertemuan 11 — Autentikasi Sederhana: Session-Based Login & Register

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 11 dari 16)  
> **CPMK3:** Mahasiswa mampu menerapkan password hashing dan session login di Python (C3)

---

## 1. Hashing Password dengan Werkzeug
\`\`\`python
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session

# Saat Registrasi
hashed = generate_password_hash(password_polos)

# Saat Login
if check_password_hash(user['password'], password_input):
    session['logged_in'] = True
    session['user_id'] = user['id']
    session['role'] = user['role']
\`\`\`

---

## 2. Logout Session
\`\`\`python
@app.route('/logout')
def logout():
    session.clear()
    flash('Anda telah logout.', 'info')
    return redirect(url_for('login'))
\`\`\``,
  },
  12: {
    no: 12,
    fileName: "12-otorisasi-role-decorator.md",
    title: "Otorisasi Dasar: Role Decorator di Python",
    source: `# Pertemuan 12 — Otorisasi Dasar: Role Decorator di Python

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Fitur Menengah (Pertemuan 12 dari 16)  
> **CPMK3:** Mahasiswa mampu membuat custom decorator hak akses (C3)  
> **ASESMEN FORMATIF 2 (Bobot 20%):** Progress Proyek (Login + Role) + Presentasi

---

## 1. Membuat Decorator @admin_required
\`\`\`python
from functools import wraps
from flask import session, redirect, url_for, flash

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            flash('Silakan login terlebih dahulu.', 'warning')
            return redirect(url_for('login'))
        if session.get('role') != 'admin':
            flash('Akses Ditolak: Hanya untuk Admin!', 'danger')
            return redirect(url_for('katalog'))
        return f(*args, **kwargs)
    return decorated_function
\`\`\`

---

## 2. Menerapkan Decorator pada Route
\`\`\`python
@app.route('/buku/hapus/<int:id>', methods=['POST'])
@admin_required
def hapus_buku(id):
    # Kode hapus buku hanya berjalan jika role admin
    pass
\`\`\``,
  },
  13: {
    no: 13,
    fileName: "13-web-hosting-cpanel-wsgi.md",
    title: "Web Hosting Python: cPanel 'Setup Python App' & Passenger WSGI",
    source: `# Pertemuan 13 — Web Hosting Python: cPanel 'Setup Python App' & Passenger WSGI

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Hosting & Deploy (Pertemuan 13 dari 16)  
> **CPMK4:** Mahasiswa mampu memahami arsitektur hosting Python di cPanel (C2)

---

## 1. Phusion Passenger WSGI di cPanel
- Menjalankan Python sebagai proses daemon WSGI.
- Membaca berkas startup wajib: \`passenger_wsgi.py\`.

\`\`\`python
# passenger_wsgi.py
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app import app as application
\`\`\`

---

## 2. Fitur 'Setup Python App' di cPanel
- Memilih versi Python (3.10 / 3.11).
- Otomatis membuat virtual environment di server hosting.`,
  },
  14: {
    no: 14,
    fileName: "14-deployment-hosting-mysql.md",
    title: "Praktik Deployment Python: Upload, Pip Install & MySQL Live",
    source: `# Pertemuan 14 — Praktik Deployment Python ke Web Hosting cPanel

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Hosting & Deploy (Pertemuan 14 dari 16)  
> **CPMK4:** Mahasiswa mampu men-deploy aplikasi Python dan database ke hosting (C3)

---

## 1. Prosedur Deployment Python
1. **Export & Import Database MySQL** ke phpMyAdmin hosting.
2. **Upload Kode Proyek** ke Application Root cPanel (jangan upload folder venv lokal!).
3. **Instal Dependensi di Server:** Jalankan \`pip install -r requirements.txt\` pada virtualenv cPanel.
4. **Konfigurasi db.py Server:** Sesuaikan user dan password database cPanel.
5. **Restart Python App:** Klik tombol 'Restart' di menu Setup Python App cPanel.`,
  },
  15: {
    no: 15,
    fileName: "15-debugging-dokumentasi.md",
    title: "Finalisasi Proyek Python, Live Debugging & Dokumentasi Sederhana",
    source: `# Pertemuan 15 — Finalisasi Proyek Python, Live Debugging & Dokumentasi

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Fase:** Hosting & Deploy (Pertemuan 15 dari 16)  
> **CPMK4 & CPMK5:** Mahasiswa mampu menyelesaikan debugging stderr.log dan dokumentasi (C3/C4)

---

## 1. Memeriksa Log Error Passenger (stderr.log)
Jika aplikasi Python tidak mau terbuka, buka berkas \`stderr.log\` di direktori proyek cPanel untuk melihat traceback baris error Python.

---

## 2. Dokumentasi README.md Wajib
- Link Live URL Hosting Aktif
- Akun Demo Pengujian (Admin & Anggota)
- Panduan Singkat Penggunaan`,
  },
  16: {
    no: 16,
    fileName: "16-uas-demo-aplikasi-live.md",
    title: "UJIAN AKHIR SEMESTER (UAS): Demo Aplikasi Live Python di Hosting",
    source: `# Pertemuan 16 — UJIAN AKHIR SEMESTER (UAS)

> **Mata Kuliah:** Sistem Aplikasi Web (Backend Dasar) · **Bobot:** 35% (Asesmen Sumatif 2)  
> **Format:** Presentasi + Demo Aplikasi LIVE di Web Hosting + Tanya Jawab Lisan  
> **CPMK4 & CPMK5:** Mahasiswa mampu mendemonstrasikan aplikasi live hasil deploy (C4)

---

## 1. Komponen Penilaian UAS Python (Bobot 35%)
1. **Keberhasilan Akses Live di Hosting (25%):** Aplikasi terbuka lancar via domain publik.
2. **Kelengkapan Fitur Wajib (35%):** CRUD, Relasi JOIN, Validasi, Session Auth, dan Role Decorator.
3. **Penguasaan Konsep & Tanya Jawab (25%):** Mampu menjelaskan logika kode WSGI dan query database.
4. **Kualitas Dokumentasi & Laporan (15%):** Laporan akhir rapi disertai akun demo pengujian.

---

## 2. Kelulusan
Mahasiswa berhasil membuktikan kompetensi software engineering backend berbasis Python dan basis data MySQL secara komprehensif!`,
  },
};

export function getPyBackendMdDoc(meetingNo: number): BackendMdDoc | undefined {
  return PY_BACKEND_MD_DOCS[meetingNo];
}
