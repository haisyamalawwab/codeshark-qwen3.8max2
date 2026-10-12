/* ============ SILABUS PERTEMUAN (16x) & MATERI LATIHAN PER TAHAP ============
   Struktur kurikulum: HTML 6 pertemuan, CSS 4, JS 4, UTS 1, UAS 1 = 16.
   Setiap pertemuan punya materi konsep tersendiri + latihan ketik bertingkat
   yang dipakai sebagai ajang praktik pada sesi pertemuan tersebut. */

import type { Block, Slide } from "./modules";
import type { Lang } from "../lib/highlight";

export interface Lesson {
  no: number; // nomor pertemuan (1-16)
  phase: "HTML" | "CSS" | "JS" | "UTS" | "UAS";
  title: string;
  goal: string; // tujuan pembelajaran pertemuan itu
  slides: Slide[];
  /** latihan ketik pertemuan ini; undefined = tanpa praktik ketik */
  practice?: { intro: string; code: string };
}

const L = (
  no: number, phase: Lesson["phase"], title: string, goal: string,
  slides: Slide[], practice?: Lesson["practice"],
): Lesson => ({ no, phase, title, goal, slides, practice });

const p = (text: string): Block => ({ t: "p", text });
const li = (...items: string[]): Block => ({ t: "list", items });
const code = (lang: Lang, c: string, caption?: string): Block => ({ t: "code", lang, code: c, caption });
const tip = (title: string, text: string): Block => ({ t: "callout", tone: "tip", title, text });
const warn = (title: string, text: string): Block => ({ t: "callout", tone: "warn", title, text });
const fun = (title: string, text: string): Block => ({ t: "callout", tone: "fun", title, text });
const quiz = (q: string, options: string[], answer: number, explain: string): Block =>
  ({ t: "quiz", q, options, answer, explain });

/* ---------- TAHAP 1: HTML — Pertemuan 1-6 ---------- */
const htmlLessons: Lesson[] = [
  L(1, "HTML", "Mengenal HTML & Alat Perangnya",
    "Memahami peran HTML di dunia web dan menyiapkan berkas halaman pertama.",
    [
      { kicker: "Pertemuan 1 • Konsep", title: "Web Bekerja: Browser, Server, HTML", blocks: [
        p("Saat kamu membuka sebuah situs, browser mengirim permintaan ke server, dan server mengirimkan balik sebuah dokumen HTML. Browser lalu membaca dokumen itu dan menggambar halamannya. HTML adalah bahasa yang dipakai server dan browser untuk saling bicara."),
        li("HTML = HyperText Markup Language — bahasa penanda (markup), bukan bahasa pemrograman.",
           "Markup: tag-tag yang menandai bagian teks, bukan menghitung atau mengulang seperti JS.",
           "Satu halaman web = satu berkas HTML, biasanya bernama index.html."),
        code("html", `<h1>Halo, aku Raka!</h1>\n<p>Aku sedang belajar HTML.</p>`, "Dua baris HTML saja sudah jadi halaman"),
        fun("Trio web", "HTML itu tulang dan kerangka, CSS pakaian, JavaScript perilaku. Ketiganya selalu bekerja bersama."),
      ]},
      { kicker: "Pertemuan 1 • Praktik", title: "Berkas Pertama & Cara Membukanya", blocks: [
        p("Kamu tidak butuh aplikasi mahal untuk membuat HTML — cukup teks editor (VS Code, Notepad, bahkan TextEdit). Simpan berkas dengan akhiran .html, lalu klik dua kali berkasnya: browser akan langsung merendernya."),
        li("Buat folder baru, misalnya latihan-html/.",
           "Buat berkas index.html di dalamnya.",
           "Tulis <h1>Uji Coba</h1>, simpan, buka di browser.",
           "Ubah teksnya, simpan, lalu tekan F5 (reload) di browser."),
        tip("Mulai kebiasaan baik", "Simpan dengan nama index.html — berkas ini otomatis disajikan saat orang membuka sebuah folder website."),
        quiz("Apa yang harus kamu lakukan agar perubahan pada berkas HTML terlihat di browser?", ["Menyalakan ulang komputer", "Tekan reload (F5)", "Menutup semua tab", "Menghapus folder"], 1, "Browser membaca ulang berkas setiap kali kamu me-reload halaman."),
      ]},
    ],
    { intro: "Pertemuan 1 — ketik kerangka halaman HTML paling sederhana. Fokus: kurung sudut dan pasangan tag.",
      code: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Halaman Pertamaku</title>\n  </head>\n  <body>\n    <h1>Halo, Dunia!</h1>\n    <p>Ini halaman HTML pertamaku.</p>\n  </body>\n</html>` }),

  L(2, "HTML", "Anatomi Dokumen HTML",
    "Menguasai kerangka wajib dokumen HTML dan fungsi head vs body.",
    [
      { kicker: "Pertemuan 2 • Konsep", title: "Empat Pilar Kerangka Halaman", blocks: [
        p("Setiap halaman HTML modern dibangun dari empat pilar: <!DOCTYPE html>, <html>, <head>, dan <body>. Kalau salah satu hilang atau tidak ditutup, browser tetap mencoba menebak — tapi hasilnya sering tidak seperti yang kamu mau."),
        code("html", `<!DOCTYPE html>\n<html lang="id">\n  <head>\n    <meta charset="UTF-8" />\n    <title>Judul Tab</title>\n  </head>\n  <body>\n    <h1>Halo Dunia!</h1>\n  </body>\n</html>`, "Kerangka wajib — hafal bentuknya, bukan kata per katanya"),
        li("<!DOCTYPE html> → memberi tahu browser: ini HTML versi modern.",
           "<html lang=\"id\"> → elemen pembungkus sekaligus petunjuk bahasa.",
           "<head> → info tersembunyi: judul tab, charset, link CSS.",
           "<body> → semua yang terlihat pengunjung."),
        tip("charset UTF-8", "Tanpa <meta charset=\"UTF-8\" />, huruf unik seperti é atau emoji bisa tampil aneh."),
      ]},
      { kicker: "Pertemuan 2 • Latihan", title: "Head vs Body: Mana Tempatmu?", blocks: [
        p("Kesalahan pemula klasik: menaruh konten di dalam <head>. Ingat aturan praktisnya — kalau pengunjung harus MELIHAT-nya, taruh di <body>. Kalau hanya informasi tentang halaman (judul tab, deskripsi mesin pencari), taruh di <head>."),
        code("html", `<head>\n  <title>Toko Ikan Hiu</title> <!-- hanya terlihat di tab -->\n</head>\n<body>\n  <h1>Selamat datang!</h1> <!-- terlihat di halaman -->\n</body>`),
        warn("Tag tak tertutup", "Satu </p> atau </div> yang hilang bisa membuat seluruh tata letak berantakan. Biasakan menulis pasangan tag sekaligus, baru isi tengahnya."),
        quiz("Di mana seharusnya teks paragraf yang dibaca pengunjung ditaruh?", ["Di dalam <head>", "Di dalam <title>", "Di dalam <body>", "Di luar <html>"], 2, "Semua konten yang tampil di layar hidup di dalam <body>."),
      ]},
    ],
    { intro: "Pertemuan 2 — kerangka lengkap dengan atribut lang dan meta charset. Perhatikan tanda kutip atribut!",
      code: `<!DOCTYPE html>\n<html lang="id">\n  <head>\n    <meta charset="UTF-8" />\n    <title>Kartu Nama Digital</title>\n  </head>\n  <body>\n    <h1>Nadia Si Penyelam</h1>\n    <p>Hobi: snorkeling dan coding.</p>\n  </body>\n</html>` }),

  L(3, "HTML", "Teks & Daftar",
    "Menyusun konten teks bertingkat: heading, paragraf, penekanan, dan daftar.",
    [
      { kicker: "Pertemuan 3 • Konsep", title: "Heading, Paragraf, Penekanan", blocks: [
        p("Judul halaman memakai tingkat <h1> sampai <h6>. Gunakan SATU <h1> per halaman, lalu <h2> untuk sub-bab. Teks biasa dibungkus <p>. Untuk menekankan makna ada <strong> (penting — tampil tebal) dan <em> (penekanan — tampil miring)."),
        code("html", `<h1>Resep Samudra</h1>\n<h2>Bahan</h2>\n<p>Ambil <strong>dua</strong> mangkuk rumput laut <em>segar</em>.</p>`, "Heading membentuk outline — seperti kerangka karangan"),
        li("<h1> judul utama — sekali saja per halaman.",
           "<h2> … <h6> sub-judul bertingkat, jangan melompat urutan.",
           "<p> paragraf; browser otomatis memberi jarak antar paragraf.",
           "<br /> memaksa ganti baris — pakai secukupnya."),
        tip("Mesin pencari suka struktur", "Google membaca heading untuk memahami isi halamanmu. Heading acak-acakan = halaman sulit ditemukan."),
      ]},
      { kicker: "Pertemuan 3 • Latihan", title: "Daftar Urut & Tak Berurut", blocks: [
        p("Untuk kumpulan item, jangan pakai banyak <p> berawalan tanda bintang manual. Pakai daftar: <ul> untuk daftar bebas urutan (bullet), <ol> untuk daftar berhitung (1, 2, 3). Item-item dibungkus <li>."),
        code("html", `<h2>Perlengkapan Menyelam</h2>\n<ul>\n  <li>Masker</li>\n  <li>Fin</li>\n</ul>\n<h2>Cara Pakai Fin</h2>\n<ol>\n  <li>Buka talinya</li>\n  <li>Masukkan kaki</li>\n  <li>Kencangkan</li>\n</ol>`, "<ol> otomatis bernomor — tidak perlu mengetik angka"),
        warn("Jangan palsu", "Membuat daftar dengan mengetik • manual di dalam <p> terlihat sama, tapi pembaca layar dan SEO dirugikan. Selalu pakai <ul>/<ol>."),
        quiz("Daftar langkah resep sebaiknya memakai tag…", ["<ul>", "<ol>", "<dl>", "<li> saja"], 1, "Urutan langkah penting — <ol> (ordered list) menampilkan angka 1, 2, 3 otomatis."),
      ]},
    ],
    { intro: "Pertemuan 3 — halaman profil dengan heading bertingkat dan dua jenis daftar. Perhatikan indentasi <li>!",
      code: `<h1>Profil Kadet</h1>\n<h2>Data Diri</h2>\n<ul>\n  <li>Nama: Raka</li>\n  <li>Sekolah: SMA Bahari</li>\n</ul>\n<h2>Target Minggu Ini</h2>\n<ol>\n  <li>Hafal kerangka HTML</li>\n  <li>Pahami 10 tag teks</li>\n  <li>Bikin 1 halaman utuh</li>\n</ol>` }),

  L(4, "HTML", "Media & Navigasi",
    "Menampilkan gambar dan membuat link antar halaman.",
    [
      { kicker: "Pertemuan 4 • Konsep", title: "Gambar: src, alt, dan Ukuran", blocks: [
        p("Gambar dipasang dengan tag tunggal <img> — tidak punya pasangan penutup. Dua atribut wajib dipahami: src (alamat berkas) dan alt (teks alternatif untuk pembaca layar dan saat gambar gagal dimuat)."),
        code("html", `<img src="img/hiu.jpg" alt="Ilustrasi hiu berenang" width="320" />`, "src relatif: dihitung dari lokasi berkas HTML"),
        li("Folder umum: img/ atau assets/ di samping berkas HTML.",
           "Format web: .jpg (foto), .png (grafik transparan), .svg (ikon vektor).",
           "width/height membantu browser menyiapkan ruang sebelum gambar selesai diunduh.",
           "Gambar besar = halaman lambat. Kompres dulu!"),
        tip("alt bukan hiasan", "Tulis alt yang menjelaskan ISI gambar: 'Hiu putih di terumbu karang', bukan sekadar 'gambar hiu'."),
      ]},
      { kicker: "Pertemuan 4 • Latihan", title: "Link: Internal, Eksternal, Anchor", blocks: [
        p("Link dibuat dengan <a href=\"...\">teks link</a>. Ada tiga arah: ke situs lain (eksternal, alamat lengkap https://), ke berkas tetangga (internal, mis. about.html), dan ke bagian dalam halaman yang sama (anchor, mis. #kontak yang menunjuk id=\"kontak\")."),
        code("html", `<a href="https://developer.mozilla.org">Dokumentasi MDN</a>\n<a href="about.html">Tentang Kami</a>\n<a href="#kontak">Ke bagian kontak</a>\n\n<h2 id="kontak">Kontak</h2>`, "Tiga jenis tujuan link dalam satu halaman"),
        warn("href kosong", '<a href="#"> adalah jebakan: terlihat berfungsi tapi hanya melompat ke atas halaman. Pastikan href benar-benar menunjuk sesuatu.'),
        quiz("Atribut apa yang menentukan ke mana link pergi?", ["src", "link", "href", "to"], 2, "<a> memakai href; <img> memakai src — jangan tertukar!"),
      ]},
    ],
    { intro: "Pertemuan 4 — gabungkan navigasi, gambar, dan teks penekanan. Perhatikan atribut yang berisi spasi!",
      code: `<h1>Blog Selam Raka</h1>\n<nav>\n  <a href="index.html">Beranda</a>\n  <a href="about.html">Tentang</a>\n</nav>\n<img src="img/terumbu.jpg" alt="Terumbu karang warna-warni" width="400" />\n<p><strong>Catatan:</strong> hari ini jarak pandang <em>sangat</em> jernih.</p>` }),

  L(5, "HTML", "Formulir & Elemen Semantik",
    "Membangun formulir yang aksesibel dan mengganti div generik dengan tag semantik.",
    [
      { kicker: "Pertemuan 5 • Konsep", title: "Formulir: input, label, button", blocks: [
        p("<form> membungkus isian. <input> adalah kolom isian yang jenisnya diatur atribut type: text, email, password, number, checkbox, radio, date. <label for=\"...\"> memasangkan keterangan dengan kolom lewat id yang sama — kunci aksesibilitas."),
        code("html", `<form>\n  <label for="nama">Nama:</label>\n  <input id="nama" type="text" placeholder="Tulis namamu" required />\n  <label for="email">Email:</label>\n  <input id="email" type="email" />\n  <button type="submit">Kirim</button>\n</form>`, 'type="email" + required = validasi gratis dari browser'),
        li("checkbox → boleh pilih banyak; radio → hanya satu dalam satu grup (name sama).",
           "<textarea> untuk pesan multi-baris.",
           "<select> + <option> untuk daftar dropdown.",
           "required memaksa pengisian sebelum form bisa dikirim."),
        warn("Tanpa label = jebakan", "Kolom tanpa <label> sulit diklik dan tak terbaca pembaca layar. Anggap label dan input selalu sepaket."),
      ]},
      { kicker: "Pertemuan 5 • Latihan", title: "Semantik: Div Bukan Segalanya", blocks: [
        p("Sebelum HTML5, semua dibungkus <div>. Sekarang ada tag yang menjelaskan MAKNA wilayah halaman: <header> bagian atas, <nav> menu, <main> konten inti, <section> bab, <article> pos mandiri, <footer> bagian bawah. Mesin pencari dan alat bantu teknologi membacanya."),
        code("html", `<body>\n  <header>\n    <h1>Warung Hiu</h1>\n    <nav><a href="#menu">Menu</a></nav>\n  </header>\n  <main>\n    <section id="menu"><h2>Menu Hari Ini</h2></section>\n  </main>\n  <footer>&copy; 2026 Warung Hiu</footer>\n</body>`, "Skeleton semantik halaman modern"),
        tip("Aturan praktis", "Kalau wadah hanya untuk mengatur tampilan visual, <div> wajar. Kalau mewakili bagian halaman (header/menu/artikel/footer), pakai tag semantik."),
        quiz("Tag mana paling tepat untuk blok menu tautan navigasi?", ['<div class="menu">', "<nav>", "<links>", "<toolbar>"], 1, "<nav> secara khusus menandai blok navigasi sehingga mudah dikenali browser dan screen reader."),
      ]},
    ],
    { intro: "Pertemuan 5 — formulir pendaftaran dengan label, jenis input berbeda, dan tombol kirim. Teliti pasangan id/for!",
      code: `<form>\n  <label for="nama">Nama:</label>\n  <input id="nama" type="text" required />\n  <label for="email">Email:</label>\n  <input id="email" type="email" required />\n  <label for="pas">Kata sandi:</label>\n  <input id="pas" type="password" minlength="8" />\n  <button type="submit">Daftar</button>\n</form>` }),

  L(6, "HTML", "Mini Project: Halaman Profil & Review",
    "Menggabungkan semua materi HTML menjadi satu proyek utuh sebagai bekal UTS.",
    [
      { kicker: "Pertemuan 6 • Konsep", title: "Menyatukan Semuanya", blocks: [
        p("Waktunya merakit: kerangka + heading + daftar + gambar + link + formulir + semantik = satu halaman utuh. Pola kerja profesional: tulis skeleton semantik dulu, isi kontennya, baru rapikan indentasi dan cek pasangan tag."),
        code("html", `<body>\n  <header>\n    <h1>Raka</h1>\n    <nav><a href="#kontak">Kontak</a></nav>\n  </header>\n  <main>\n    <section><h2>Tentang</h2><p>Siswa SMA Bahari.</p></section>\n    <section id="kontak"><h2>Kontak</h2></section>\n  </main>\n  <footer>&copy; 2026</footer>\n</body>`, "Contoh kerangka halaman profil ringkas"),
        li("Checklist pra-UTS: pasangan tag lengkap? satu <h1>? semua <img> punya alt? label terhubung id?",
           "Validasi gratis: tempel kode ke validator.w3.org — error muncul baris per baris.",
           "Buka di HP (DevTools → mode perangkat) — apakah masih terbaca?"),
        fun("Ujian terdekat", "UTS pertemuan 7 menguji tahap HTML (pertemuan 1-6). Kerjakan mini project ini sampai lancar, sisanya tinggal percaya diri."),
      ]},
      { kicker: "Pertemuan 6 • Latihan", title: "Gladi Ketik: Proyek Utuh", blocks: [
        p("Latihan ketik di bawah adalah halaman profil gabungan — semua tag yang pernah kamu pelajari muncul. Target: WPM stabil dan akurasi ≥ 90% tanpa melihat keyboard untuk simbol < > \" / ."),
        tip("Simbol paling sering salah", "Kurung sudut < > biasanya di dekat tombol M/N (layout US). Kutip ganda \" = Shift + '. Latih otot jarimu sampai refleks."),
      ]},
    ],
    { intro: "Pertemuan 6 — gladi UTS: halaman profil lengkap lintas semua topik HTML. Simbol < > \" / adalah kunci!",
      code: `<!DOCTYPE html>\n<html lang="id">\n  <head>\n    <meta charset="UTF-8" />\n    <title>Profil Raka</title>\n  </head>\n  <body>\n    <header>\n      <h1>Raka Pratama</h1>\n      <nav><a href="#kontak">Kontak</a></nav>\n    </header>\n    <main>\n      <section>\n        <h2>Tentang Saya</h2>\n        <p>Siswa yang suka <strong>laut</strong> dan kode.</p>\n        <img src="foto.jpg" alt="Foto Raka" width="120" />\n      </section>\n      <section>\n        <h2>Keahlian</h2>\n        <ul>\n          <li>HTML dasar</li>\n          <li>Mengetik 40 WPM</li>\n        </ul>\n      </section>\n      <section id="kontak">\n        <h2>Kontak</h2>\n        <label for="pesan">Pesan:</label>\n        <textarea id="pesan"></textarea>\n        <button type="submit">Kirim</button>\n      </section>\n    </main>\n    <footer>&copy; 2026 Raka</footer>\n  </body>\n</html>` }),
];

/* ---------- TAHAP 2: CSS — Pertemuan 8-11 ---------- */
const cssLessons: Lesson[] = [
  L(8, "CSS", "Cara Kerja CSS & Selektor Dasar",
    "Memahami cascade, tiga cara memasang CSS, dan selektor elemen.",
    [
      { kicker: "Pertemuan 8 • Konsep", title: "Cascade: Gaya Mengalir", blocks: [
        p("CSS = Cascading Style Sheets. Aturan ditulis: selector { properti: nilai; }. Ada tiga cara memasangnya: inline (atribut style), internal (<style> di head), dan eksternal (berkas .css lewat <link>). Proyek serius selalu memakai eksternal supaya satu gaya dipakai banyak halaman."),
        code("css", `h1 {\n  color: #ffc247;\n  font-size: 32px;\n}`, "Selector → blok kurung kurawal → deklarasi berakhiran titik koma"),
        li('Inline: <h1 style="color:red"> — hindari, susah dirawat.',
           "Internal: <style> di <head> — oke untuk eksperimen satu halaman.",
           'Eksternal: <link rel="stylesheet" href="gaya.css" /> — standar industri.',
           "'Cascading': aturan yang lebih spesifik atau menyusul menang atas yang umum."),
        tip("Urutan beban", "Taruh <link> CSS di dalam <head> agar gaya siap sebelum halaman digambar — tidak ada kedip tanpa gaya."),
      ]},
      { kicker: "Pertemuan 8 • Latihan", title: "Selektor Elemen & Grup", blocks: [
        p("Selektor paling sederhana adalah nama tag: p { } mengenai SEMUA paragraf. Beberapa selektor bisa digabung dengan koma: h1, h2, h3 { } berlaku untuk semuanya sekaligus."),
        code("css", `body {\n  background: #072a3f;\n  color: #eaf6ff;\n  font-family: sans-serif;\n}\nh1, h2, h3 {\n  color: #ffc247;\n}`, "Grup selektor menghindari pengulangan kode"),
        warn("Titik koma hilang", "Satu deklarasi tanpa ; membuat deklarasi berikutnya ikut diabaikan browser. Kesalahan CSS paling senyap dan paling sering."),
        quiz("Cara memasang CSS yang dianjurkan untuk proyek nyata?", ["Inline style", "<style> di head", "Berkas .css eksternal via <link>", "Memakai JavaScript"], 2, "Eksternal: satu berkas gaya untuk banyak halaman, mudah dirawat dan di-cache browser."),
      ]},
    ],
    { intro: "Pertemuan 8 — blok CSS pertama: tubuh halaman, grup heading, dan satu tombol. Titik koma adalah sahabatmu.",
      code: `body {\n  background: #072a3f;\n  color: #eaf6ff;\n  font-family: sans-serif;\n}\nh1, h2 {\n  color: #ffc247;\n}\nbutton {\n  border-radius: 10px;\n}` }),

  L(9, "CSS", "Class, ID, Warna & Tipografi",
    "Membedakan class vs id, membaca kode warna, dan mengatur huruf.",
    [
      { kicker: "Pertemuan 9 • Konsep", title: "Class vs ID", blocks: [
        p('<p class="card"> dipanggil CSS dengan .card — bisa dipakai banyak elemen. <div id="hero"> dipanggil dengan #hero — hanya boleh SATU di halaman. Kombinasi keduanya: p.card memilih hanya <p> yang ber-class card.'),
        code("html", `<p class="catatan">Paragraf biasa</p>\n<p class="catatan">Boleh berulang</p>\n<h1 id="judul-besar">Hanya satu</h1>`),
        code("css", `.catatan {\n  color: #9ad7f5;\n}\n#judul-besar {\n  letter-spacing: 2px;\n}`, "Titik = class, pagar = id"),
        li("class → gaya berulang & penanda kelompok.",
           "id → target unik: anchor link (#kontak) dan sasaran JavaScript.",
           'Satu elemen boleh punya banyak class: class="tombol besar".'),
        tip("Penamaan konsisten", "Pakai kebab-case (judul-besar) — pilih satu gaya penamaan dan jangan campur."),
      ]},
      { kicker: "Pertemuan 9 • Latihan", title: "Warna HEX & Tipografi", blocks: [
        p("Warna CSS: nama (red), HEX (#ff6b57 = RR GG BB), atau rgb()/hsl(). Tipografi diatur font-family (keluarga huruf), font-size (ukuran px/rem), font-weight (tebal 400/700), line-height (jarak baris), text-align (posisi)."),
        code("css", `h1 {\n  color: #ffc247;\n  font-size: 2rem;\n  font-weight: 800;\n}\np {\n  line-height: 1.6;\n  text-align: center;\n}`, "rem mengikuti ukuran dasar browser — ramah aksesibilitas"),
        warn("Kontras rendah", "Teks abu tipis di latar gelap sulit dibaca. Uji kontras: kalau kamu pusing membacanya, pengguna lain juga."),
        quiz("Pada #ff6b57, pasangan huruf pertama (ff) mengatur…", ["Komponen merah", "Komponen hijau", "Komponen biru", "Ketajaman"], 0, "HEX dibaca per pasangan: ff=255 merah, 6b=107 hijau, 57=87 biru."),
      ]},
    ],
    { intro: "Pertemuan 9 — gaya berbasis class dan id dengan warna HEX. Cermati #, ., titik dua, dan titik koma!",
      code: `.kartu {\n  background: #0c3350;\n  color: #eaf6ff;\n  padding: 16px;\n}\n.judul {\n  color: #ffc247;\n  font-size: 1.5rem;\n  font-weight: 700;\n}\n#hero {\n  text-align: center;\n  line-height: 1.6;\n}` }),

  L(10, "CSS", "Box Model: Kotak di Balik Semua Hal",
    "Memahami margin, border, padding, dan ukuran kotak elemen.",
    [
      { kicker: "Pertemuan 10 • Konsep", title: "Empat Lapisan Kotak", blocks: [
        p("Setiap elemen HTML adalah kotak bersarang: ISI (content) → PADDING (jarak dalam) → BORDER (garis tepi) → MARGIN (jarak luar ke tetangga). Menggeser satu lapisan mengubah seluruh tampilan."),
        code("css", `button {\n  padding: 10px 20px; /* atas-bawah kiri-kanan */\n  border: 2px solid #2ee6c8;\n  border-radius: 12px;\n  margin: 8px;\n}`, "padding = napas di dalam, margin = jarak di luar"),
        li("padding: 10px → keempat sisi; 10px 20px → vertikal/horizontal.",
           "border: none menghilangkan garis bawaan elemen.",
           "border-radius membuat sudut melengkung; 50% = lingkaran.",
           "box-sizing: border-box → width mencakup padding & border."),
        tip("Reset penyelamat", "Tulis * { box-sizing: border-box; } di awal stylesheet — perhitungan lebar langsung masuk akal."),
      ]},
      { kicker: "Pertemuan 10 • Latihan", title: "Jarak Antar Elemen", blocks: [
        p("Margin vertikal bertumpuk (collapsing): dua margin 10px bersebelahan hanya menghasilkan 10px, bukan 20px. margin: 16px auto membuat elemen melebar penuh lalu terpusat horizontal."),
        code("css", `body {\n  margin: 0; /* hilangkan jarak bawaan browser */\n}\n.kartu {\n  padding: 20px;\n  margin-bottom: 16px;\n  border-left: 4px solid #45c6ff;\n}`, "margin: 0 pada body adalah ritual awal setiap stylesheet"),
        warn("Lebar total menjengkelkan", "div { width: 100%; padding: 20px } tanpa border-box akan LEBAR dari layar dan memicu scroll horizontal. Itu ulah box model default."),
        quiz("Lapisan mana yang berada PALING LUAR?", ["padding", "border", "margin", "content"], 2, "Urutan dari dalam: content → padding → border → margin."),
      ]},
    ],
    { intro: "Pertemuan 10 — kartu dengan empat lapisan box model. Perhatikan urutan nilai shorthand padding!",
      code: `* {\n  box-sizing: border-box;\n}\nbody {\n  margin: 0;\n  background: #072a3f;\n}\n.kartu {\n  width: 320px;\n  padding: 20px 24px;\n  margin: 16px auto;\n  border: 2px solid #2ee6c8;\n  border-radius: 14px;\n}` }),

  L(11, "CSS", "Layout: Flexbox & Responsif",
    "Menyusun posisi elemen dengan display:flex dan menyesuaikan layout di HP.",
    [
      { kicker: "Pertemuan 11 • Konsep", title: "Flexbox Satu Dimensi", blocks: [
        p("display: flex mengubah wadah menjadi baris fleksibel: anak-anaknya disejajarkan menurut sumbu utama. justify-content mengatur sepanjang baris, align-items menyilangnya, gap memberi jarak antar anak tanpa margin ribet."),
        code("css", `.bar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}`, "Navbar klasik: logo kiri, menu kanan, sejajar tengah"),
        li("flex-direction: column → tumpuk vertikal.",
           "justify-content: center | space-between | space-around.",
           "align-items: center → rata tengah silang.",
           "flex-wrap: wrap → item turun baris bila tak muat."),
        fun("Bayangkan", "Flexbox itu nampan pramusaji: ia menata gelas-gelas (item) di satu baris, mengatur jarak, dan pusat gravitasi."),
      ]},
      { kicker: "Pertemuan 11 • Latihan", title: "Responsif dengan Media Query", blocks: [
        p("Halaman harus enak di HP dan desktop. Dua senjata: meta viewport di HTML, dan @media di CSS — aturan yang aktif hanya bila kondisi terpenuhi (mis. lebar ≤ 600px). Unit relatif (%, rem, vw) membantu menyesuaikan diri."),
        code("html", `<meta name="viewport" content="width=device-width, initial-scale=1" />`),
        code("css", `.sidebar {\n  width: 240px;\n}\n@media (max-width: 600px) {\n  .sidebar {\n    width: 100%;\n  }\n}`, "Di layar kecil, sidebar melebar penuh"),
        warn("Lupa viewport", "Tanpa meta viewport, HP berpura-pura jadi monitor 980px lalu mengecilkan semuanya — teks jadi seupil."),
        quiz("Properti flex mana mengatur jarak ANTAR item?", ["letter-spacing", "gap", "grid-space", "word-gap"], 1, "gap khusus untuk flex/grid; memberi jarak bersih tanpa margin bertumpuk."),
      ]},
    ],
    { intro: "Pertemuan 11 — navbar flex + media query responsif. Kurung kurawal @media wajib teliti!",
      code: `.bar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 20px;\n  background: #0c3350;\n}\n.link {\n  color: #9ad7f5;\n  text-decoration: none;\n}\n@media (max-width: 600px) {\n  .bar {\n    flex-direction: column;\n  }\n}` }),
];

/* ---------- TAHAP 3: JAVASCRIPT — Pertemuan 13-15 (+ 12 review) ---------- */
const jsLessons: Lesson[] = [
  L(13, "JS", "Variabel, Tipe Data & Operator",
    "Menyimpan data dengan const/let dan mengenal tipe serta operator.",
    [
      { kicker: "Pertemuan 13 • Konsep", title: "Kotak Bernama: Variabel", blocks: [
        p("Variabel adalah nama yang menunjuk suatu nilai. Deklarasikan dengan const (tak bisa diisi ulang) atau let (bisa berubah). Hindari var warisan lama. Tipe data dasar: string \"teks\", number 42, boolean true/false."),
        code("js", `const nama = "Raka";\nlet skor = 0;\nskor = skor + 10;\nconsole.log(nama, skor);`, "console.log mencetak lebih dari satu nilai, dipisah koma"),
        li("String → diapit kutip: \"hai\" atau 'hai'.",
           "Number → tanpa kutip: 7, -2, 3.14.",
           "Boolean → true / false, hasil perbandingan.",
           "Template literal: `Halo ${nama}!` — backtick + ${}."),
        tip("Pilih const duluan", "Mulai semua variabel dengan const; ganti ke let hanya ketika benar-benar perlu mengisi ulang. Kode lebih aman."),
      ]},
      { kicker: "Pertemuan 13 • Latihan", title: "Operator & console.log", blocks: [
        p("Operator aritmatika: + - * / % (sisa bagi). Operator + pada string menggabungkan (konkatenasi). Perbandingan (===, !==, <, >) menghasilkan boolean. console.log adalah jendela pikiran programmu."),
        code("js", `const harga = 15000;\nconst jumlah = 3;\nconst total = harga * jumlah;\nconsole.log("Total: " + total);\nconsole.log(total === 45000);`, '"Total: " + angka → angka dilebur jadi teks'),
        warn("== vs ===", "== melakukan konversi diam-diam ('1' == 1 → true). === memeriksa tipe juga. Disiplin pakai === selalu."),
        quiz("Hasil dari 7 % 3 ?", ["1", "2", "2.33", "0"], 0, "% mengambil sisa bagi: 7 = 3×2 + 1, jadi hasilnya 1."),
      ]},
    ],
    { intro: "Pertemuan 13 — variabel, template literal, dan aritmatika. Backtick ` sering jadi jebakan!",
      code: `const nama = "Kadet Raka";\nlet xp = 120;\nconst bonus = 50;\nxp = xp + bonus;\nconsole.log("Halo, " + nama);\nconsole.log("XP total:", xp);` }),

  L(14, "JS", "Logika Percabangan",
    "Membuat keputusan dengan if/else, else if, dan operator logika.",
    [
      { kicker: "Pertemuan 14 • Konsep", title: "if / else if / else", blocks: [
        p("Program memilih jalur: jika kondisi true jalankan blok A, selain itu blok B. Rantai else if menangani banyak kemungkinan; else menangkap sisanya. Kondisi biasanya hasil perbandingan (>, ===, !==)."),
        code("js", `const nilai = 82;\n\nif (nilai >= 90) {\n  console.log("Grade A");\n} else if (nilai >= 75) {\n  console.log("Grade B");\n} else {\n  console.log("Perbaiki lagi!");\n}`, "Hanya satu cabang yang berjalan"),
        li("&& (dan) → kedua syarat harus benar.",
           "|| (or) → cukup salah satu benar.",
           "! (not) → membalik boolean.",
           "Nilai falsy (0, '', null, undefined) dianggap false sebagai kondisi."),
        tip("Kurung kurawal meski satu baris", "Selalu bungkus badan if dengan { } — mencegah bug saat statements bertambah kemudian."),
      ]},
      { kicker: "Pertemuan 14 • Latihan", title: "Operator Logika & Ternary", blocks: [
        p("Gabungkan syarat dengan && dan ||. Bentuk ringkas kondisi dua jalur: ternary — kondisi ? bilaTrue : bilaFalse — cocok untuk menghasilkan nilai singkat seperti status sapaan."),
        code("js", `const umur = 14;\nconst izin = umur >= 13 && umur <= 19;\nconst status = izin ? "boleh ikut" : "terlalu muda";\nconsole.log(status);`, "Ternary = if/else satu baris penghasil nilai"),
        warn("Titik koma & kurung", "JS sensitif: if tanpa kurung kondisi, atau kurawal tak seimbang, langsung SyntaxError. Baca pesan error konsol — ia jujur."),
        quiz("Hasil true && false ?", ["true", "false", "undefined", "error"], 1, "&& menuntut KEDUA sisi true; satu false saja → seluruhnya false."),
      ]},
    ],
    { intro: "Pertemuan 14 — percabangan grade nilai dengan rantai if/else if. Perhatikan kurung dan kurawal bersarang!",
      code: `const nilai = 82;\n\nif (nilai >= 90) {\n  console.log("Grade A");\n} else if (nilai >= 75) {\n  console.log("Grade B");\n} else if (nilai >= 60) {\n  console.log("Grade C");\n} else {\n  console.log("Belum tuntas");\n}` }),

  L(15, "JS", "Perulangan & Fungsi",
    "Mengulang tugas dengan loop dan membereskan logika dengan fungsi.",
    [
      { kicker: "Pertemuan 15 • Konsep", title: "for & while", blocks: [
        p("Perulangan menjalankan blok berkali-kali. for paling umum: init; syarat; langkah — dalam satu baris kepala. while mengulang selama kondisi true. Hati-hati: syarat yang tak pernah jadi false = loop tak berujung (browser hang!)."),
        code("js", `for (let i = 1; i <= 5; i++) {\n  console.log("Baris ke-" + i);\n}`, "i++ menaikkan i satu tiap putaran"),
        li("for → tahu berapa kali (berdasarkan counter).",
           "while → selama kondisi terpenuhi.",
           "break keluar paksa; continue lewati satu putaran.",
           "Array bisa diulang satu per satu dengan for (pengantar forEach)."),
        warn("Off-by-one", "i <= 5 mulai 1 berjalan 5 kali; i < 5 mulai 0 juga 5 kali. Tentukan batas dengan sadar, jangan tebak."),
      ]},
      { kicker: "Pertemuan 15 • Latihan", title: "Fungsi: Resep yang Dipanggil", blocks: [
        p("Fungsi menyimpan resep sekali, dipakai berkali-kali. function nama(param) { ... } lalu panggil nama(isi). return mengirim hasil keluar; tanpa return nilainya undefined. Panah (=>) adalah bentuk ringkas favorit modern."),
        code("js", `function sapa(nama) {\n  return "Halo, " + nama + "!";\n}\n\nconst total = (a, b) => a + b;\nconsole.log(sapa("Raka"));\nconsole.log(total(4, 6));`, "return ≠ console.log: return menghasilkan nilai, log hanya mencetak"),
        tip("Nama fungsi = kata kerja", "hitungTotal, tampilkanPesan, ambilData. Pembaca kode (termasuk kamu bulan depan) berterima kasih."),
        quiz("Apa nilai kembali fungsi tanpa statement return?", ["0", 'string ""', "undefined", "null"], 2, "Fungsi selalu mengembalikan sesuatu; tanpa return eksplisit → undefined."),
      ]},
    ],
    { intro: "Pertemuan 15 — loop plus fungsi dengan parameter dan return. Teliti i++, panah =>, dan titik koma!",
      code: `function jumlahkan(dari, sampai) {\n  let total = 0;\n  for (let i = dari; i <= sampai; i++) {\n    total = total + i;\n  }\n  return total;\n}\n\nconsole.log(jumlahkan(1, 5));\nconsole.log(jumlahkan(10, 12));` }),

  L(16, "JS", "DOM, Event & Mini App Interaktif",
    "Menghubungkan JS dengan halaman: memilih elemen, merespons klik, merangkai mini app.",
    [
      { kicker: "Pertemuan 16 • Konsep", title: "DOM: Jembatan JS ↔ HTML", blocks: [
        p("DOM (Document Object Model) adalah representasi halaman yang bisa diubah JS. document.querySelector(\"#id\") mencari SATU elemen; addEventListener(\"click\", fn) memasang reaksi. textContent, value, classList adalah tuas pengaturannya."),
        code("js", `const tombol = document.querySelector("button");\nconst pesan = document.querySelector("#pesan");\nlet jumlah = 0;\n\ntombol.addEventListener("click", function () {\n  jumlah = jumlah + 1;\n  pesan.textContent = "Diklik " + jumlah + " kali!";\n});`, "Pola counter — latihan wajib menuju UAS"),
        li("querySelector('.kelas') pakai titik; '#id' pakai pagar.",
           "addEventListener TIDAK menimpa listener lain (beda dengan onclick).",
           "input.value = baca isian; el.textContent = ganti teks.",
           "classList.toggle('aktif') menyalakan/mematikan class."),
        tip("Skrip di mana?", "Pasang <script defer src=\"app.js\"></script> di head, atau skrip sebelum </body> — pastikan DOM terbentuk dulu."),
      ]},
      { kicker: "Pertemuan 16 • Latihan", title: "Merangkai Mini App", blocks: [
        p("Mini app interaktif = HTML (struktur) + CSS (gaya) + JS (perilaku) dalam satu berkas. Latihan ketik berikut adalah pola counter lengkap — hafal bentuk rangkaiannya karena polanya keluar terus di UAS."),
        fun("Ambisi UAS", "Kalau pola ini sudah mengalir di jarimu, UAS tinggal menambah logika (if/loop/fungsi) dan input formulir di dalam event handler."),
      ]},
    ],
    { intro: "Pertemuan 16 — gladi UAS: pola counter klik lengkap. Kurung fungsi callback dan konkatenasi string rawan salah!",
      code: `const tombol = document.querySelector("button");\nconst pesan = document.querySelector("#pesan");\nlet jumlah = 0;\n\ntombol.addEventListener("click", function () {\n  jumlah = jumlah + 1;\n  pesan.textContent = "Tombol diklik " + jumlah + " kali!";\n  console.log("Klik ke-" + jumlah);\n});` }),
];

/* ---------- UTS (Pertemuan 7) & UAS (Pertemuan 17*) ---------- */
const utsLesson = L(7, "UTS", "Panduan UTS: Halaman HTML + CSS",
  "Strategi mengerjakan UTS: lingkup, format, dan checklist pengerjaan.",
  [
    { kicker: "Pertemuan 7 • UTS", title: "Apa yang Diujikan", blocks: [
      p("UTS digelar pada pertemuan ke-7, menguji tahap HTML (pertemuan 1-6) dan awal CSS. Format: praktik membangun satu halaman berisi kerangka, teks & daftar, gambar & link, formulir, lalu dihias gaya CSS dasar."),
      li("Bobot terbesar: struktur semantik + formulir ber-label.",
         "Soal konsep: pilihan ganda singkat (tag, atribut, head vs body).",
         "Dokumen dinilai rapi: indentasi konsisten, tag tertutup, alt terisi.",
         "Alokasi: 10 menit soal konsep, 40 menit praktik halaman."),
      warn("Kesalahan fatal ujian", "Melupakan </body></html> atau lupa MENYIMPAN berkas sebelum dikumpulkan. Cek dua-duanya sebelum angkat tangan."),
    ]},
    { kicker: "Pertemuan 7 • Strategi", title: "Checklist Sebelum Submit", blocks: [
      li("Ada <!DOCTYPE html>, <html lang>, <meta charset>, <title>?",
         "Satu <h1>, heading bertingkat tanpa lompat?",
         "Semua <img> punya alt, semua <a> punya href valid?",
         "Setiap <input> punya <label for> yang cocok dengan id?",
         "CSS: selector benar, semua deklarasi ber-titik-koma?"),
      tip("Validasi cepat", "Reload halaman, buka DevTools (F12) → Console. Tidak ada error = poin aman, baru poles tampilan."),
    ]},
  ]);

const uasLesson = L(17, "UAS", "Panduan UAS: Aplikasi Mini Interaktif",
  "Strategi UAS: aplikasi HTML+CSS+JS satu berkas dengan logika dan event.",
  [
    { kicker: "UAS • Lingkup", title: "Lingkup & Format", blocks: [
      p("UAS menguji seluruh rangkaian: HTML (6 sesi), CSS (4), JS (4). Soal berupa satu aplikasi mini — misalnya konverter nilai, daftar tugas, atau kuis sederhana — yang wajib punya input formulir, tampilan bergaya CSS, dan logika JS (variabel, percabangan, fungsi, event klik)."),
      li("Struktur: skeleton semantik + form + area hasil.",
         "Gaya: minimal class-based styling, layout flex, warna kontras.",
         "Logika: querySelector + addEventListener + if/loop/fungsi.",
         "Bonus nilai: fitur tambahan seperti reset, validasi, atau dark-mode toggle."),
      fun("Kenapa typing matters", "Seluruh soal dikerjakan dengan mengetik kode. WPM tinggi + akurasi bersih = waktu berpikir logika jauh lebih banyak."),
    ]},
    { kicker: "UAS • Resep Pengerjaan", title: "Alur 50 Menit", blocks: [
      li("Menit 0-5: tulis kerangka HTML + form + <script> kosong.",
         "Menit 5-15: lengkapi struktur & semantik, beri id/class penting.",
         "Menit 15-30: bangun logika JS — handler, kondisi, update textContent.",
         "Menit 30-40: hias CSS sampai rapi dibaca.",
         "Menit 40-50: uji kasus tepi (input kosong, angka negatif) & rapikan."),
      warn("Debug alih-alih panik", "Pesan merah di Console justru peta: baca nama error, cari barisnya, perbaiki. Jangan menebak-nebak menghapus kode."),
      tip("Simpan berkala", "Ctrl+S tiap beberapa menit. Berkas belum disimpan = jawaban hilang."),
    ]},
  ]);

/** 16 pertemuan efektif: HTML P1-6, UTS P7, CSS P8-11, jeda review P12, JS P13-16. */
export const CURRICULUM: Lesson[] = [
  ...htmlLessons, utsLesson, ...cssLessons,
  /* P12 = pertemuan review/konsolidasi CSS→JS */
  L(12, "JS", "Jembatan: Menyuntik Logika ke Halaman",
    "Review CSS melalui latihan ketik gabungan, lalu kenalan dengan cara JS menyentuh halaman.",
    [
      { kicker: "Pertemuan 12 • Review", title: "Gabungan HTML + CSS", blocks: [
        p("Sebelum masuk JS, kita latih kombinasi HTML+CSS: halaman dengan class, box model, dan flex sekaligus. Latihan ketik pertemuan ini mencampur kedua bahasa — perhatikan perpindahan blok <style> ke aturan CSS."),
        code("html", `<style>\n  .btn { background: #2ee6c8; }\n</style>\n<button class="btn">Kirim</button>`, "CSS internal: <style> hidup di <head>"),
        tip("Tanda kamu siap ke JS", "Kalau kurung kurawal CSS dan titik koma sudah jadi refleks, logika JS tinggal menumpang pada kebiasaan mengetik itu."),
      ]},
      { kicker: "Pertemuan 12 • Introspeksi", title: "JS Menyentuh DOM", blocks: [
        p("Cicipan minggu depan: JS bisa memanggil elemen lewat document.querySelector, lalu mengubah teksnya dengan textContent. Perhatikan titik (.) yang menghubungkan objek, sifat, dan metode — sintaks yang sama dipakai di seluruh JS."),
        code("js", `const judul = document.querySelector("h1");\njudul.textContent = "Diganti oleh JS!";`, "Baris 1 ambil elemennya, baris 2 ubah isinya"),
        quiz("Symbol apa yang menghubungkan objek dan anggotanya di JS (document.querySelector)?", ["->", "::", ".", "#"], 2, "Dot notation: document.querySelector — titik adalah sambungan kepemilikan di JS."),
      ]},
    ],
    { intro: "Pertemuan 12 — review gabungan: HTML + CSS internal dalam satu latihan ketik.",
      code: `<!DOCTYPE html>\n<html lang="id">\n  <head>\n    <style>\n      body {\n        background: #072a3f;\n        color: #eaf6ff;\n      }\n      .btn {\n        padding: 10px 20px;\n        border-radius: 10px;\n      }\n    </style>\n  </head>\n  <body>\n    <h1>Review Gabungan</h1>\n    <button class="btn">Kirim</button>\n  </body>\n</html>` }),
  ...jsLessons, uasLesson,
].map((l, i) => ({ ...l, no: i + 1 }));

export const getLesson = (no: number): Lesson =>
  CURRICULUM.find((l) => l.no === no) ?? CURRICULUM[0];

export const PHASE_COLOR: Record<Lesson["phase"], string> = {
  HTML: "#4dd9c0",
  CSS: "#ffc247",
  JS: "#45c6ff",
  UTS: "#ff6b57",
  UAS: "#ff6b57",
};
