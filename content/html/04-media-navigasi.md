# Pertemuan 4 — Media & Navigasi

> **Tahap:** HTML (Pertemuan 4 dari 6) · **Fase latihan:** atribut yang berisi spasi, `src`/`href`, dan navigasi.

## Gambar: src, alt, dan Ukuran

Gambar dipasang dengan tag tunggal `<img>` — tidak punya pasangan penutup. Dua atribut wajib dipahami: `src` (alamat berkas) dan `alt` (teks alternatif untuk pembaca layar dan saat gambar gagal dimuat).

%%IMG:media-link%%

```html
<img src="img/hiu.jpg" alt="Ilustrasi hiu berenang" width="320" />
```

- Folder umum: `img/` atau `assets/` di samping berkas HTML.
- Format web: `.jpg` (foto), `.png` (grafik transparan), `.svg` (ikon vektor).
- `width`/`height` membantu browser menyiapkan ruang sebelum gambar selesai diunduh.
- Gambar besar = halaman lambat. Kompres dulu!

> 💡 **alt bukan hiasan.** Tulis alt yang menjelaskan ISI gambar: "Hiu putih di terumbu karang", bukan sekadar "gambar hiu".

## Link: Internal, Eksternal, Anchor

Link dibuat dengan `<a href="...">teks link</a>`. Ada tiga arah: ke situs lain (eksternal, alamat lengkap `https://`), ke berkas tetangga (internal, mis. `about.html`), dan ke bagian dalam halaman yang sama (anchor, mis. `#kontak` yang menunjuk `id="kontak"`).

```html
<a href="https://developer.mozilla.org">Dokumentasi MDN</a>
<a href="about.html">Tentang Kami</a>
<a href="#kontak">Ke bagian kontak</a>

<h2 id="kontak">Kontak</h2>
```

| Jenis tujuan | Contoh href | Catatan |
|---|---|---|
| Eksternal | `https://…` | Alamat lengkap + protokol |
| Internal | `about.html` | Relatif dari lokasi berkas |
| Anchor | `#kontak` | Menuju `id` di halaman sama |

> ⚠️ **href kosong.** `<a href="#">` adalah jebakan: terlihat berfungsi tapi hanya melompat ke atas halaman. Pastikan href benar-benar menunjuk sesuatu.

**Cek paham:** atribut apa yang menentukan ke mana link pergi? `href` pada `<a>` — jangan tertukar dengan `src` milik `<img>`.
