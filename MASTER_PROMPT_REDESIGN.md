# Master Prompt — Redesign MatchingShark Landing Page & Game HUD

Anda bertindak sebagai Senior Product Designer, UX Researcher, Game HUD Designer, Learning Experience Designer, dan Frontend Engineer. Tugas Anda adalah mendesain ulang dan mengimplementasikan MatchingShark: pengalaman belajar Software Engineering berbasis permainan dengan dunia bawah laut dan karakter hiu.

Jangan berhenti pada rekomendasi, wireframe, atau deskripsi desain. Hasil akhir harus berupa antarmuka HTML, CSS, dan JavaScript yang berfungsi, responsif, aksesibel, serta dapat dijalankan dan diuji.

## 1. Konteks dan diagnosis

Gunakan screenshot MatchingShark yang diberikan sebagai referensi identitas, bukan template untuk disalin.

Identitas yang harus dipertahankan:
- Dunia bawah laut, karakter hiu, eksplorasi pulau, dan nuansa teknologi.
- Bahasa Indonesia yang natural, suportif, dan tidak menggurui.
- Software Engineering sebagai proses memahami masalah, membuat keputusan, menguji, dan mengevaluasi trade-off—bukan sekadar coding.

Masalah yang harus diselesaikan:
- Halaman terasa seperti brosur panjang, bukan pintu masuk permainan.
- Terlalu banyak penjelasan sebelum aksi pertama.
- Panel padat, teks kecil, dan efek neon dapat melemahkan hierarki.
- Ilustrasi lebih dominan daripada tujuan, keputusan, dan hasil belajar.
- Progres berisiko sekadar mengukur aktivitas, bukan kompetensi.

Prinsip arah baru: dari “baca mengapa belajar itu menarik” menjadi “alami bahwa kamu bisa menyelesaikan masalah.”

Jangan menganggap semua Gen Z menyukai kompetisi, warna ramai, bahasa gaul, atau animasi cepat. Dukung motivasi yang beragam: rasa mampu, otonomi, eksplorasi, relevansi, dan koneksi sosial.

## 2. Cara bekerja

1. Audit struktur repository, teknologi, halaman, komponen, aset, scripts, dan pengujian yang tersedia.
2. Jika aplikasi sudah ada, pertahankan stack, package manager, konvensi, dan fungsi penting yang relevan. Jangan mengganti seluruh arsitektur tanpa kebutuhan.
3. Jika repository kosong, gunakan HTML semantik, CSS, dan JavaScript modular tanpa framework yang tidak diperlukan.
4. Susun rencana singkat, kemudian implementasikan. Jangan menunggu persetujuan untuk keputusan desain yang dapat dibalik.
5. Jangan mengklaim hasil riset, testimoni, angka pengguna, atau peningkatan konversi yang tidak tersedia.
6. Jika backend tidak tersedia, bangun prototipe lokal yang jujur. Jangan menyamarkan simulasi sebagai layanan sungguhan.
7. Setelah implementasi, jalankan pemeriksaan yang tersedia dan laporkan apa yang benar-benar diuji.

## 3. Sasaran pengalaman

Pengguna baru harus dapat:
- Memahami konsep produk tanpa membaca seluruh halaman.
- Memulai mini-misi tanpa harus membuat akun.
- Mengerti tujuan, aksi berikutnya, dan dampak keputusan.
- Mendapat feedback yang mengajarkan alasan, bukan hanya benar/salah.
- Melihat hubungan permainan dengan kemampuan Software Engineering nyata.
- Melanjutkan progres lokal setelah kembali, jika penyimpanan browser tersedia.

Target desain, bukan klaim hasil: aksi bermakna pertama dapat dicapai dalam sekitar satu menit. Validasi melalui pengujian pengguna, bukan asumsi.

## 4. Arsitektur pengalaman

Bangun dua pengalaman yang terhubung:

A. Landing page ringkas dengan mini-misi interaktif sebagai fokus.
B. Arena permainan dengan HUD yang berfokus pada keputusan dan konsekuensi.

Gunakan routing atau pola navigasi yang sesuai stack. Tombol kembali, refresh, dan navigasi keyboard harus tetap masuk akal. Hindari membuat dua aplikasi terpisah yang tidak konsisten.

## 5. Landing page

### 5.1 Navigasi
- Logo MatchingShark, tautan Cara Main, Peta Belajar, dan FAQ.
- CTA utama: “Mulai Misi”.
- Menu mobile dapat dibuka dan ditutup, mendukung Escape, dan memiliki label aksesibel.
- Navigasi tidak menutup konten atau mengambil tinggi layar berlebihan.

### 5.2 Hero

Contoh copy yang boleh disempurnakan:

Eyebrow: BELAJAR SOFTWARE ENGINEERING LEWAT KEPUTUSAN
Judul: “Kota bawah laut kehilangan sinyal. Kamu engineer yang dibutuhkan.”
Deskripsi: “Selidiki masalah, pilih solusi, dan lihat dampaknya. Belajar Software Engineering lewat misi singkat—bukan hafalan.”
CTA utama: “Mainkan misi pertama”
CTA sekunder: “Lihat cara bermain”
Microcopy: “Demo ±3 menit · Tanpa instalasi · Tanpa akun”

Hanya gunakan microcopy tersebut jika implementasi mendukungnya. Waktu adalah estimasi, bukan timer wajib.

Pada desktop, pasangkan hero dengan mini-misi yang benar-benar dapat dimainkan. Pada mobile, pertahankan urutan baca judul → penjelasan → CTA → misi.

### 5.3 Mini-misi hero

Judul: “Misi 01 — Alarm yang Salah”.
Brief: “Alarm kota berbunyi setiap kali ada ikan lewat, padahal penjaga hanya perlu tahu saat kapal mendekat.”
Pertanyaan: “Apa yang perlu kamu klarifikasi terlebih dahulu?”
Pilihan:
A. Warna lampu alarm.
B. Kejadian apa yang seharusnya memicu alarm.
C. Framework yang akan digunakan.

Jangan langsung menampilkan jawaban benar sebelum pemain mencoba. Setelah pilihan dikirim:
- Tampilkan feedback spesifik sesuai pilihan.
- Jelaskan bahwa klarifikasi kebutuhan mendahului keputusan implementasi.
- Pilihan kurang tepat tidak menghapus progres atau mempermalukan pemain.
- Beri kesempatan mencoba kembali dan melihat petunjuk.
- Keberhasilan membuka CTA “Lanjutkan investigasi”.

### 5.4 Cara bermain

Tiga langkah dengan contoh konkret:
1. Selidiki masalah: baca brief dan bukti.
2. Ambil keputusan: pertimbangkan pilihan dan trade-off.
3. Uji dampaknya: lihat hasil, refleksikan, dan perbaiki.

Hindari paragraf pemasaran panjang dan kartu berulang tanpa fungsi.

### 5.5 Peta belajar

Tampilkan enam wilayah sebagai perjalanan yang jelas:
- Pelabuhan Kebutuhan: klarifikasi requirement dan acceptance criteria.
- Terumbu Desain: komponen, interface, dan trade-off arsitektur.
- Bengkel Implementasi: perubahan kecil yang memenuhi kebutuhan.
- Palung Pengujian: test case, boundary, dan bug.
- Menara Rilis: validasi, deployment, dan observability dasar.
- Laboratorium Kualitas: evaluasi, refactoring, dan maintainability.

Untuk tiap wilayah tampilkan aktivitas, kompetensi, dan artefak hasil. Jangan membuat seluruh kurikulum palsu: hanya misi pertama wajib benar-benar playable. Wilayah lain boleh menyediakan preview yang jelas berlabel “Pratinjau”, bukan tombol mati atau klaim fitur siap.

### 5.6 Bukti kompetensi

Gunakan contoh artefak yang berlabel “Contoh hasil misi”, bukan testimoni fiktif:
- Requirement yang sudah diklarifikasi.
- Acceptance criteria yang bisa diuji.
- Test case dan alasan pemilihannya.
- Catatan keputusan serta trade-off.

### 5.7 FAQ dan penutup

FAQ minimum:
- Perlu bisa coding dahulu?
- Apakah harus membuat akun?
- Apa yang dipelajari selain coding?
- Bagaimana progres disimpan?
- Apakah bisa dimainkan lewat ponsel?

Jawaban harus sesuai implementasi. Gunakan accordion aksesibel. Akhiri dengan satu CTA utama menuju misi, bukan deretan tombol bersaing.

## 6. Arena dan HUD

### 6.1 Hierarki

HUD harus menjawab:
1. Apa tujuan saya?
2. Apa yang dapat saya lakukan sekarang?
3. Apa akibat keputusan saya?

Desktop:
- Header: kembali, nama misi, tahap saat ini, tombol bantuan.
- Panel kiri: brief dan bukti yang relevan.
- Area tengah: pertanyaan atau keputusan utama.
- Panel kanan: dampak simulasi dan progres kompetensi.
- Feedback dekat dengan aksi yang memicunya.

Mobile:
- Satu kolom, bukan tiga kolom yang diperkecil.
- Alur Brief → Bukti → Keputusan → Hasil.
- CTA utama mudah dijangkau dan tidak menutupi pilihan atau feedback.
- Informasi pendukung dapat dilipat tanpa menyembunyikan informasi penting.

### 6.2 Aturan interaksi
- Satu CTA utama per tahap.
- Tidak ada countdown wajib.
- Tidak ada penalti lives/energi yang menghalangi belajar.
- Hint kontekstual dengan penjelasan, bukan langsung membuka semua jawaban.
- Pemilihan opsi dan pengiriman jawaban adalah dua aksi berbeda agar tidak terjadi submit tidak sengaja.
- Jika CTA belum dapat digunakan, tampilkan alasan dekat kontrol.
- Setelah perpindahan tahap, pindahkan fokus secara wajar ke judul tahap atau feedback.
- Aksi reset progres membutuhkan konfirmasi.

## 7. Misi playable end-to-end

Implementasikan satu misi utuh dengan empat tahap, bukan demo satu klik.

### Tahap 1 — Klarifikasi kebutuhan
Gunakan kasus Alarm yang Salah. Pemain memilih pertanyaan klarifikasi. Feedback harus menjelaskan kekurangan setiap opsi.

### Tahap 2 — Periksa bukti
Tampilkan tiga bukti singkat: permintaan penjaga, log deteksi, dan batasan sensor. Minta pemain memilih pernyataan kebutuhan yang paling didukung bukti.

Contoh bukti:
- Penjaga hanya membutuhkan alarm ketika kapal memasuki zona pelabuhan.
- Log menunjukkan ikan kecil juga memicu alarm.
- Sensor menyediakan kategori objek dan posisi, tetapi klasifikasi dapat keliru.

Jangan menyatakan teknologi otomatis sempurna. Bedakan kebutuhan pengguna dari asumsi implementasi.

### Tahap 3 — Susun acceptance criteria
Berikan beberapa kriteria yang bisa dipilih, termasuk distraktor. Contoh kriteria valid:
- Kapal terdeteksi di dalam zona pelabuhan memicu alarm.
- Ikan yang terdeteksi tidak memicu alarm.
- Objek di luar zona tidak memicu alarm.

Tegaskan bahwa kasus klasifikasi tidak pasti perlu keputusan lanjutan; jangan mengklaim tiga kriteria ini menutup seluruh risiko sistem nyata.

### Tahap 4 — Uji dan refleksi
Jalankan simulasi deterministik dengan skenario kapal di dalam zona, ikan di dalam zona, dan kapal di luar zona. Tampilkan hasil yang dapat ditelusuri ke pilihan pemain.

Jika ada kegagalan:
- Tampilkan expected vs actual dan alasan.
- Sediakan “Perbaiki kriteriaku”.

Jika lolos:
- Tampilkan ringkasan kemampuan yang dipraktikkan.
- Beri satu pertanyaan transfer singkat dengan konteks baru, misalnya notifikasi pesanan ganda.
- Hindari menyebut pemain “menguasai Software Engineering” hanya karena menyelesaikan satu misi.

Artefak akhir dapat diunduh sebagai teks atau JSON: requirement, acceptance criteria, hasil tes, dan catatan refleksi. Unduhan harus benar-benar berfungsi.

## 8. Model progres dan feedback

Pisahkan:
- Progres petualangan: misi dan tahap selesai.
- Bukti kompetensi: perilaku atau keputusan yang berhasil ditunjukkan.

Gunakan label seperti “Mulai dipraktikkan” atau “Teramati pada misi ini”, bukan sertifikasi atau klaim penguasaan.

Jika menggunakan XP, posisikan sebagai penanda aktivitas sekunder. Jangan memberi insentif mengulang klik demi poin. Jangan jadikan leaderboard global sebagai pusat pengalaman.

Contoh feedback:
“Pilihanmu memperjelas pemicu alarm. Sekarang kita perlu memastikan objek di luar zona tidak menghasilkan notifikasi.”

Bukan:
“Salah! Kamu kehilangan 1 nyawa.”

Tidak ada streak yang menghukum, scarcity palsu, atau paywall yang menyamar sebagai kegagalan belajar.

## 9. Arah visual

Karakter: ekspedisi laut futuristik yang hangat, taktis, dan terasa dapat dimainkan. Hindari hasil generik berupa tumpukan kartu SaaS dengan glow berlebihan.

Gunakan palet awal sebagai tokens yang boleh disesuaikan setelah pemeriksaan kontras:
- Ocean background: #06131F.
- Surface: #0C2132.
- Elevated surface: #133147.
- Primary text: #F2F7FA.
- Secondary text: #ADC2D0.
- Cyan action: #48E0D0.
- Purple progression: #B39AFF.
- Amber caution: #F4C76A.
- Error: #FF8691.

Warna token bukan jaminan lolos aksesibilitas pada semua pasangan. Periksa setiap kombinasi aktual.

Ketentuan:
- Cyan untuk aksi utama, ungu untuk progres, amber untuk perhatian.
- Warna tidak menjadi satu-satunya pembawa arti.
- Glow dibatasi untuk aksen, tidak pada paragraf atau teks kecil.
- Body sekitar 16–18 px dengan line-height nyaman; label kecil tetap terbaca.
- Judul responsif memakai clamp() dan panjang baris terkontrol.
- Spacing konsisten, misalnya skala 4/8 px.
- Gunakan border, elevasi, dan ruang kosong untuk hirarki, bukan semua panel sama menonjol.
- Karakter hiu menjadi pemandu kontekstual, bukan dekorasi yang menutup konten.
- Gunakan aset lokal yang tersedia; jika tidak ada, buat ilustrasi SVG orisinal yang ringan. Jangan mengambil aset tanpa memperhatikan lisensi.
- Teks UI tetap HTML, bukan tertanam dalam gambar.
- Animasi singkat untuk perubahan state; jangan memakai partikel berat, autoplay suara, atau parallax yang mengganggu pembacaan.

## 10. Aksesibilitas dan responsivitas

Targetkan praktik WCAG 2.2 AA, tanpa mengklaim sertifikasi hanya dari pemeriksaan otomatis.

Wajib:
- HTML semantik, heading berurutan, landmark, dan skip link.
- Semua aksi dapat dilakukan melalui keyboard.
- Focus-visible dengan kontras jelas.
- Fieldset/legend dan radio/checkbox native untuk pilihan misi bila sesuai.
- Feedback dinamis diumumkan lewat aria-live secara tidak berlebihan.
- Dialog memiliki nama, pengelolaan fokus, Escape, dan pengembalian fokus.
- Kontras teks normal minimal 4.5:1 dan teks besar 3:1.
- Target sentuh nyaman, idealnya minimal 44 × 44 CSS px.
- Dukungan prefers-reduced-motion.
- Konten tetap dapat digunakan pada zoom dan ukuran teks lebih besar.
- Tidak ada informasi yang hanya muncul saat hover.
- Tidak ada horizontal overflow pada viewport sempit.
- Uji lebar 360, 390, 768, 1024, dan 1440 px serta reflow sekitar 320 CSS px.

## 11. Implementasi teknis

- Gunakan CSS custom properties untuk token warna, spacing, radius, typography, dan motion.
- Pisahkan data misi, state, rendering, serta event handling secara wajar sesuai stack.
- Gunakan state machine atau transisi tahap eksplisit; jangan membiarkan tahap terkunci dilewati melalui kontrol UI.
- Simpan progres lokal dengan schema version, parsing defensif, dan fallback jika localStorage gagal atau diblokir.
- Jelaskan bahwa progres lokal tidak otomatis tersinkron antarperangkat.
- Jangan menyimpan data sensitif atau menambahkan tracking pihak ketiga tanpa persetujuan.
- Hindari memasukkan input pengguna melalui innerHTML tanpa sanitasi; gunakan textContent untuk refleksi dan jawaban bebas.
- Tampilkan state kosong, disabled, error, dan success yang benar-benar relevan.
- Jangan membuat spinner palsu untuk aksi sinkron.
- Gambar memiliki ukuran/aspect ratio untuk mengurangi layout shift. Lazy-load aset nonkritis.
- Tidak ada tautan # tanpa tujuan, tombol kosmetik tanpa aksi, error console, atau resource penting yang gagal dimuat.
- Jika lingkungan membutuhkan live preview, bind dev server ke 0.0.0.0, izinkan host preview, dan gunakan URL relatif untuk request browser.

Bila tidak ada stack, struktur awal yang disarankan:

```text
index.html
css/styles.css
js/app.js
js/mission-data.js
js/mission-state.js
js/storage.js
assets/
README.md
```

Sesuaikan dengan kompleksitas nyata; jangan memecah file hanya demi terlihat enterprise.

## 12. Pengujian dan acceptance criteria

Implementasi dianggap selesai ketika:

### Alur produk
- CTA hero benar-benar memulai misi tanpa akun.
- Mini-misi menampilkan feedback yang sesuai tiap pilihan.
- Empat tahap misi dapat diselesaikan dari awal sampai akhir.
- Pemain dapat memperbaiki jawaban yang kurang tepat.
- Simulasi menghasilkan output konsisten dengan pilihan/kriteria pemain.
- Ringkasan akhir dan unduhan artefak bekerja.
- Progres dapat dimuat kembali, atau fallback storage dijelaskan dengan benar.
- Reset mengembalikan state awal setelah konfirmasi.
- Preview wilayah lain tidak menyamar sebagai misi lengkap.

### Kualitas UI
- Landing dan arena konsisten tetapi memiliki prioritas informasi berbeda.
- Tidak ada overflow, overlap, atau CTA yang menutup konten di mobile.
- Keyboard dapat menyelesaikan seluruh misi.
- Reduced motion dihormati.
- Tidak ada informasi penting yang disampaikan hanya melalui warna.

### Pengujian teknis
- Jalankan lint, build, dan tests yang tersedia.
- Tambahkan unit test logika evaluasi, transisi tahap, reset, dan pemulihan storage bila infrastruktur memungkinkan.
- Uji alur benar, alur salah lalu diperbaiki, refresh, serta storage tidak tersedia.
- Lakukan smoke test browser jika alat tersedia; jangan mengklaim visual test dilakukan bila hanya memeriksa kode.
- Laporkan batasan aksesibilitas yang masih memerlukan pengujian manual.

## 13. Evaluasi produk tanpa metrik palsu

Dokumentasikan event yang dapat digunakan kelak, tanpa wajib memasang analytics:
- mission_started.
- stage_completed.
- hint_used.
- answer_revised.
- mission_completed.
- artifact_downloaded.

Pisahkan rencana instrumentasi dari analytics yang benar-benar aktif. Jangan menganggap durasi bermain tinggi selalu berarti keberhasilan. Evaluasi juga kebingungan, kualitas alasan, dan kemampuan menerapkan konsep pada konteks baru.

## 14. Bentuk hasil akhir

Serahkan:
1. Implementasi yang dapat dijalankan, bukan hanya gambar atau spesifikasi.
2. Ringkasan keputusan desain utama.
3. Daftar file penting yang diubah.
4. Cara menjalankan dan menguji aplikasi.
5. Daftar pemeriksaan yang benar-benar dijalankan dan hasilnya.
6. Batasan prototipe dan langkah lanjutan yang realistis.

Jangan menyatakan semua fitur selesai jika masih berupa placeholder. Prioritaskan kualitas satu misi end-to-end dibanding banyak fitur dangkal.

## 15. Kriteria wajib: responsive, intuitive, immersive, dan interactive

Kriteria berikut adalah bagian dari definisi selesai, bukan dekorasi opsional. Terapkan pada landing page dan arena tanpa mengorbankan pembelajaran, aksesibilitas, atau performa.

### 15.1 Responsive dan adaptif
- Gunakan pendekatan mobile-first, fluid layout, CSS Grid/Flexbox, dan breakpoint berdasarkan kebutuhan konten, bukan merek perangkat.
- Desktop dapat memakai panel simultan; mobile menggunakan alur bertahap dan disclosure. Jangan hanya mengecilkan HUD desktop.
- Pastikan portrait dan landscape tetap dapat dipakai, termasuk ketika keyboard virtual terbuka.
- Gunakan safe-area inset untuk kontrol sticky pada perangkat berponi. Jangan mengandalkan tinggi 100vh yang memotong konten pada browser mobile; gunakan unit viewport modern dengan fallback yang sesuai.
- Batasi lebar konten pada layar besar agar teks tidak melebar tanpa batas. Hindari tinggi kartu tetap yang memotong teks.
- Semua informasi dan aksi penting tersedia pada touch, mouse, dan keyboard. Hover hanya menjadi pengayaan.

### 15.2 Intuitive: pengguna memahami tanpa tutorial panjang
- Gunakan label aksi spesifik seperti “Periksa bukti”, “Uji kriteriaku”, dan “Perbaiki jawaban”, bukan label abstrak tanpa konteks.
- Pertahankan posisi, istilah, dan tampilan kontrol yang konsisten antar-tahap.
- Tampilkan status saat ini, langkah berikutnya, dan alasan suatu aksi belum tersedia.
- Perkenalkan mekanik lewat tindakan pertama dan petunjuk singkat kontekstual; hindari tur modal panjang.
- Bedakan state idle, hover, focus, pressed, selected, disabled, success, dan error melalui kombinasi visual dan semantik.
- Tindakan berisiko dapat dibatalkan atau dikonfirmasi; kesalahan belajar selalu memiliki jalan pemulihan yang jelas.

### 15.3 Immersive tanpa mengganggu konsentrasi
- Hubungkan cerita, ilustrasi, HUD, dan respons dunia dengan keputusan pemain. Contoh: status alarm dan aktivitas pelabuhan berubah setelah hasil simulasi, dengan penjelasan tekstual yang setara.
- Gunakan kedalaman visual melalui lapisan latar yang tenang, landmark, dan pencahayaan terarah. Jangan menempatkan animasi atau tekstur ramai di belakang teks penting.
- Karakter hiu memberi respons singkat sesuai konteks; tidak mengambil alih layar atau berulang kali menginterupsi.
- Suara bukan syarat memahami permainan. Jika ditambahkan, harus opt-in, dapat dimatikan, dan tidak autoplay.
- Animasi ambient dapat dijeda/dimatikan. Hindari flashing dan gerakan terus-menerus yang mengganggu membaca.

### 15.4 Interactive dan micro-interaction yang bermakna

Implementasikan respons nyata, bukan efek kosmetik yang menyamarkan kontrol mati:

| Pemicu | Respons | Tujuan |
|---|---|---|
| Fokus/hover CTA | Perubahan border atau elevasi ringan; indikator fokus tetap jelas | Menunjukkan affordance |
| Tombol ditekan | Umpan balik pressed singkat tanpa menggeser layout | Mengonfirmasi input |
| Opsi dipilih | Border, ikon, dan status checked berubah | Memastikan pilihan terbaca |
| Bukti dibuka | Panel berkembang dan indikator expanded diperbarui | Mempertahankan orientasi |
| Jawaban dikirim | Feedback spesifik muncul dekat aksi dan diumumkan secara aksesibel | Menjelaskan konsekuensi |
| Tahap selesai | Indikator langkah diperbarui dengan transisi ringan | Memperlihatkan progres |
| Simulasi dijalankan | Skenario dan hasil aktual diperlihatkan secara deterministik | Menghubungkan keputusan dengan hasil |
| Artefak diunduh | Status singkat “Unduhan disiapkan” atau konfirmasi yang benar-benar dapat diketahui aplikasi | Mengonfirmasi aksi tanpa klaim palsu |

Jangan menjadikan animasi satu-satunya feedback. Jangan mengklaim file tersimpan di perangkat jika aplikasi hanya mengetahui proses unduh dimulai.

### 15.5 Efek transisi dinamis, terarah, dan ringan
- Tetapkan motion tokens, misalnya fast 120–160 ms, standard 180–240 ms, dan scene 280–360 ms. Angka ini pedoman, bukan kewajiban untuk setiap komponen.
- Gunakan opacity dan transform untuk transisi utama; hindari animasi properti layout besar atau blur/filter berat di seluruh viewport.
- Terapkan transisi masuk/keluar yang halus pada pergantian tahap, feedback, accordion, dan dialog. Jangan memberi transition: all pada setiap elemen.
- Arah gerak harus membantu menjelaskan hubungan: tahap berikut maju secara halus, kembali tetap terasa sebagai navigasi balik. Gerak tidak boleh mengubah urutan baca atau fokus.
- Hindari penundaan buatan, scroll hijacking, animasi pembuka yang memblokir CTA, dan animasi per huruf yang menghambat pembacaan.
- Cegah double-submit dan race condition selama transisi; hormati input cepat tanpa membuat antarmuka terkunci lama.
- Pada prefers-reduced-motion, hilangkan pergeseran, parallax, dan animasi ambient; pertahankan perubahan state yang langsung atau fade minimal bila sesuai.

### 15.6 Keterbacaan tinggi di mobile maupun desktop
- Utamakan teks body 16–18 px dengan line-height sekitar 1.5–1.7, disesuaikan dengan font dan kepadatan konten. Jangan mengecilkan teks utama untuk memaksakan semua HUD terlihat sekaligus.
- Batasi paragraf panjang sekitar 45–75 karakter per baris pada ruang yang memungkinkan; mobile mengikuti lebar nyaman dengan padding memadai.
- Gunakan hierarki heading, subheading, body, dan label yang jelas. Hindari terlalu banyak uppercase, teks tipis, dan huruf berjarak lebar pada informasi penting.
- Letakkan teks pada permukaan stabil dengan kontras teruji. Jika berada di atas ilustrasi, gunakan lapisan pelindung yang tetap efektif di semua breakpoint.
- Jangan memotong instruksi, feedback, atau label aksi penting dengan ellipsis. Konten harus tetap terbaca saat zoom dan pembesaran teks.
- Gunakan kalimat pendek, istilah konsisten, serta penjelasan singkat untuk jargon Software Engineering.

### 15.7 Checklist verifikasi tambahan

Sebelum menyatakan selesai, verifikasi dan laporkan:
- [ ] Layout landing dan HUD telah diperiksa pada viewport sempit, tablet, dan desktop; sebutkan ukuran yang benar-benar diuji.
- [ ] Tidak ada teks penting terpotong, horizontal overflow, atau kontrol tertutup keyboard virtual/sticky CTA pada lingkungan yang diuji.
- [ ] Seluruh interaksi utama bekerja tanpa hover dan dapat dioperasikan dengan keyboard.
- [ ] State selected, disabled, success, dan error dapat dibedakan tanpa bergantung pada warna.
- [ ] Micro-interaction mendukung aksi nyata dan tidak menyebabkan layout shift yang mengganggu.
- [ ] Pergantian tahap tetap benar saat klik cepat, kembali, reset, dan refresh.
- [ ] Reduced motion telah diperiksa, bukan hanya dideklarasikan dalam CSS.
- [ ] Keterbacaan, zoom, fokus, dan kontras aktual diperiksa; catat hal yang belum dapat diverifikasi.
- [ ] Animasi tidak menghambat input atau menutupi feedback; periksa performa dengan alat browser jika tersedia dan laporkan kondisi pengujiannya.

Jangan mengklaim FPS stabil, kompatibilitas semua perangkat, atau kelulusan aksesibilitas menyeluruh tanpa pengujian yang mendukung.

## Instruksi penutup

Mulai dengan audit repository dan rencana singkat, lalu langsung implementasikan. Pertahankan identitas MatchingShark, tetapi berani menyederhanakan struktur dan mengurangi dekorasi. Setiap keputusan visual harus membantu orientasi, aksi, pemahaman, atau feedback.

Ukuran keberhasilan desain bukan seberapa terlihat seperti game, melainkan seberapa jelas pemain mengalami proses berpikir seorang software engineer.
