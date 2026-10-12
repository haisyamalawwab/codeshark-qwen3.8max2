# Pertemuan 1 — Mengenal HTML & Alat Perangnya

> **Tahap:** HTML (Pertemuan 1 dari 6) · **Fase latihan:** gladi ketik simbol `< >` dan pasangan tag.

Saat kamu membuka sebuah situs, **browser** mengirim permintaan ke **server**, dan server mengirimkan balik sebuah dokumen HTML. Browser lalu membaca dokumen itu dan menggambar halamannya. HTML adalah bahasa yang dipakai server dan browser untuk saling bicara.

## Web Bekerja: Browser, Server, HTML

- **HTML** = *HyperText Markup Language* — bahasa penanda (*markup*), bukan bahasa pemrograman.
- **Markup**: tag-tag yang menandai bagian teks, bukan menghitung atau mengulang seperti JavaScript.
- Satu halaman web = satu berkas HTML, biasanya bernama `index.html`.

Dua baris HTML saja sudah menjadi sebuah halaman:

```html
<h1>Halo, aku Raka!</h1>
<p>Aku sedang belajar HTML.</p>
```

> 💡 **Trio web.** HTML itu tulang dan kerangka, CSS pakaian, JavaScript perilaku. Ketiganya selalu bekerja bersama — dan di CodeShark, kamu melatih ketiganya lewat ajang latihan mengetik tiap pertemuan.

## Berkas Pertama & Cara Membukanya

Kamu tidak butuh aplikasi mahal untuk membuat HTML — cukup teks editor (VS Code, Notepad, bahkan TextEdit). Simpan berkas dengan akhiran `.html`, lalu klik dua kali: browser akan langsung merendernya.

1. Buat folder baru, misalnya `latihan-html/`.
2. Buat berkas `index.html` di dalamnya.
3. Tulis `<h1>Uji Coba</h1>`, simpan, buka di browser.
4. Ubah teksnya, simpan, lalu tekan **F5** (reload) di browser.

| Alat | Fungsi | Wajib? |
|---|---|---|
| Teks editor | Menulis kode HTML | ✅ Ya |
| Browser modern | Melihat hasil render | ✅ Ya |
| VS Code | Editor + preview instan | Dianjurkan |
| Kerangka kerja | Proyek besar nanti | Belum |

> ⚠️ **Simbol paling sering salah.** Kurung sudut `< >` dan kutip `"` adalah tombol yang sama yang bikin pemula gagal akurasi. Pertemuan 1 memang dirancang sebagai gladi otot jari untuk simbol ini.

**Cek paham:** apa yang harus kamu lakukan agar perubahan pada berkas HTML terlihat di browser? Tekan reload (F5) — browser membaca ulang berkas setiap kali halaman dimuat ulang.
