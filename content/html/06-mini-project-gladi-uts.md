# Pertemuan 6 — Mini Project & Gladi UTS HTML

> **Tahap:** HTML (Pertemuan 6 dari 7) · **Fase latihan:** gladi ketik proyek utuh sebagai bekal UTS (Pertemuan 8).

## Menyatukan Semuanya

Waktunya merakit: kerangka + heading + daftar + gambar + link + formulir + semantik = satu halaman utuh. Pola kerja profesional: tulis *skeleton* semantik dulu, isi kontennya, baru rapikan indentasi dan cek pasangan tag.

```html
<body>
  <header>
    <h1>Raka</h1>
    <nav><a href="#kontak">Kontak</a></nav>
  </header>
  <main>
    <section><h2>Tentang</h2><p>Siswa SMA Bahari.</p></section>
    <section id="kontak"><h2>Kontak</h2></section>
  </main>
  <footer>&copy; 2026</footer>
</body>
```

- **Checklist pra-UTS:** pasangan tag lengkap? satu `<h1>`? semua `<img>` punya `alt`? label terhubung `id`?
- **Validasi gratis:** tempel kode ke validator.w3.org — error muncul baris per baris.
- **Uji mobile:** buka di HP (DevTools → mode perangkat) — apakah masih terbaca?

%%IMG:checklist-uts%%

## Gladi Ketik: Proyek Utuh

Latihan ketik pertemuan ini adalah halaman profil gabungan — semua tag yang pernah kamu pelajari muncul. Target: WPM stabil dan akurasi ≥ 90% tanpa melihat keyboard untuk simbol `< > " /`.

> 💡 **Simbol paling sering salah.** Kurung sudut `< >` biasanya di dekat tombol M/N (layout US). Kutip ganda `"` = Shift + `'`. Latih otot jarimu sampai refleks.

> 🦈 **Ujian terdekat.** UTS pertemuan 8 menguji tahap HTML (pertemuan 1–7). Kerjakan mini project ini sampai lancar, sisanya tinggal percaya diri.

**Cek paham:** apa urutan pola kerja yang benar? Skeleton semantik → isi konten → rapikan & validasi — bukan menghias duluan.
