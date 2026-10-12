# Pertemuan 5 — Formulir & Elemen Semantik

> **Tahap:** HTML (Pertemuan 5 dari 6) · **Fase latihan:** pasangan `id`/`for`, atribut panjang, tag semantik.

## Formulir: input, label, button

`<form>` membungkus isian. `<input>` adalah kolom isian yang jenisnya diatur atribut `type`: `text`, `email`, `password`, `number`, `checkbox`, `radio`, `date`. `<label for="...">` memasangkan keterangan dengan kolom lewat `id` yang sama — kunci aksesibilitas.

```html
<form>
  <label for="nama">Nama:</label>
  <input id="nama" type="text" placeholder="Tulis namamu" required />
  <label for="email">Email:</label>
  <input id="email" type="email" />
  <button type="submit">Kirim</button>
</form>
```

- `checkbox` → boleh pilih banyak; `radio` → hanya satu dalam satu grup (`name` sama).
- `<textarea>` untuk pesan multi-baris.
- `<select>` + `<option>` untuk daftar dropdown.
- `required` memaksa pengisian sebelum form bisa dikirim.

> ⚠️ **Tanpa label = jebakan.** Kolom tanpa `<label>` sulit diklik dan tak terbaca pembaca layar. Anggap label dan input selalu sepaket.

## Semantik: Div Bukan Segalanya

Sebelum HTML5, semua dibungkus `<div>`. Sekarang ada tag yang menjelaskan **MAKNA** wilayah halaman: `<header>` bagian atas, `<nav>` menu, `<main>` konten inti, `<section>` bab, `<article>` pos mandiri, `<footer>` bagian bawah. Mesin pencari dan alat bantu teknologi membacanya.

```html
<body>
  <header>
    <h1>Warung Hiu</h1>
    <nav><a href="#menu">Menu</a></nav>
  </header>
  <main>
    <section id="menu"><h2>Menu Hari Ini</h2></section>
  </main>
  <footer>&copy; 2026 Warung Hiu</footer>
</body>
```

| Tag | Makna wilayah |
|---|---|
| `<header>` | Bagian atas / identitas halaman |
| `<nav>` | Blok menu tautan |
| `<main>` | Konten inti (sekali per halaman) |
| `<section>` | Bab dengan tema sendiri |
| `<article>` | Pos mandiri (bisa dipisah) |
| `<footer>` | Bagian bawah / hak cipta |

> 💡 **Aturan praktis.** Kalau wadah hanya untuk mengatur tampilan visual, `<div>` wajar. Kalau mewakili bagian halaman (header/menu/artikel/footer), pakai tag semantik.

**Cek paham:** tag mana paling tepat untuk blok menu tautan navigasi? `<nav>` — mudah dikenali browser dan *screen reader*.
