# Pertemuan 3 — Teks & Daftar

> **Tahap:** HTML (Pertemuan 3 dari 6) · **Fase latihan:** heading bertingkat dan dua jenis daftar.

## Heading, Paragraf, Penekanan

Judul halaman memakai tingkat `<h1>` sampai `<h6>`. Gunakan **SATU** `<h1>` per halaman, lalu `<h2>` untuk sub-bab. Teks biasa dibungkus `<p>`. Untuk menekankan makna ada `<strong>` (penting — tampil tebal) dan `<em>` (penekanan — tampil miring).

%%IMG:struktur-tag%%

```html
<h1>Resep Samudra</h1>
<h2>Bahan</h2>
<p>Ambil <strong>dua</strong> mangkuk rumput laut <em>segar</em>.</p>
```

- `<h1>` judul utama — sekali saja per halaman.
- `<h2>` … `<h6>` sub-judul bertingkat, jangan melompat urutan.
- `<p>` paragraf; browser otomatis memberi jarak antar paragraf.
- `<br />` memaksa ganti baris — pakai secukupnya.

> 💡 **Mesin pencari suka struktur.** Google membaca heading untuk memahami isi halamanmu. Heading acak-acakan = halaman sulit ditemukan.

%%IMG:hierarki-heading%%

## Daftar Urut & Tak Berurut

Untuk kumpulan item, jangan pakai banyak `<p>` berawalan tanda bintang manual. Pakai daftar: `<ul>` untuk daftar bebas urutan (*bullet*), `<ol>` untuk daftar berhitung (1, 2, 3). Item-item dibungkus `<li>`.

```html
<h2>Perlengkapan Menyelam</h2>
<ul>
  <li>Masker</li>
  <li>Fin</li>
</ul>

<h2>Cara Pakai Fin</h2>
<ol>
  <li>Buka talinya</li>
  <li>Masukkan kaki</li>
  <li>Kencangkan</li>
</ol>
```

| Jenis | Tag | Kapan dipakai |
|---|---|---|
| Tak berurut | `<ul>` + `<li>` | Order tidak penting: perlengkapan, hobi |
| Berurut | `<ol>` + `<li>` | Order penting: langkah resep, tutorial |

> ⚠️ **Jangan palsu.** Membuat daftar dengan mengetik • manual di dalam `<p>` terlihat sama, tapi pembaca layar dan SEO dirugikan. Selalu pakai `<ul>`/`<ol>`.

**Cek paham:** daftar langkah resep sebaiknya memakai tag apa? `<ol>` — urutan langkah penting, dan nomornya muncul otomatis.
