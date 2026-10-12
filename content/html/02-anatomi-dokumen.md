# Pertemuan 2 — Anatomi Dokumen HTML

> **Tahap:** HTML (Pertemuan 2 dari 6) · **Fase latihan:** kerangka lengkap dengan atribut `lang` dan `meta charset`.

Setiap halaman HTML modern dibangun dari empat pilar: `<!DOCTYPE html>`, `<html>`, `<head>`, dan `<body>`. Kalau salah satu hilang atau tidak ditutup, browser tetap mencoba menebak — tapi hasilnya sering tidak seperti yang kamu mau.

## Empat Pilar Kerangka Halaman

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <title>Judul Tab</title>
  </head>
  <body>
    <h1>Halo Dunia!</h1>
  </body>
</html>
```

| Bagian | Fungsi | Terlihat pengunjung? |
|---|---|---|
| `<!DOCTYPE html>` | Menyatakan ini HTML modern | Tidak |
| `<html lang="id">` | Pembungkus + petunjuk bahasa | Tidak |
| `<head>` | Judul tab, charset, link CSS | Tidak |
| `<body>` | Semua konten di layar | ✅ Ya |

> 💡 **charset UTF-8.** Tanpa `<meta charset="UTF-8" />`, huruf unik seperti é atau emoji bisa tampil aneh.

## Head vs Body: Mana Tempatmu?

Kesalahan pemula klasik: menaruh konten di dalam `<head>`. Ingat aturan praktisnya — kalau pengunjung harus **MELIHAT**-nya, taruh di `<body>`. Kalau hanya informasi *tentang* halaman (judul tab, deskripsi mesin pencari), taruh di `<head>`.

```html
<head>
  <title>Toko Ikan Hiu</title> <!-- hanya terlihat di tab -->
</head>
<body>
  <h1>Selamat datang!</h1> <!-- terlihat di halaman -->
</body>
```

> ⚠️ **Tag tak tertutup.** Satu `</p>` atau `</div>` yang hilang bisa membuat seluruh tata letak berantakan. Biasakan menulis pasangan tag sekaligus, baru isi tengahnya.

**Cek paham:** di mana seharusnya teks paragraf yang dibaca pengunjung ditaruh? Di dalam `<body>` — semua konten yang tampil di layar hidup di sana.
