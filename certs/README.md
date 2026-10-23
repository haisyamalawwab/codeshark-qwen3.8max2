# Sertifikat CA publik TiDB Cloud

Tambahkan CA resmi yang disediakan/rekomendasikan halaman Connect TiDB Cloud melalui GitHub dengan nama:

```text
certs/tidb-ca-rozanhaisyam.pem
```

CA publik yang diunggah melalui GitHub sudah dipindahkan ke path di atas. Pemeriksaan lokal menunjukkan sertifikat **ISRG Root X1**, `CA:TRUE`, berlaku sampai 4 Juni 2035, tanpa blok private key. Ini memvalidasi struktur sertifikat, bukan membuktikan koneksi ke cluster TiDB telah berhasil. Jangan menggantinya dengan file placeholder atau sertifikat acak.

## Deploy Netlify

`netlify.toml` sudah menyertakan `certs/tidb-ca-rozanhaisyam.pem` sebagai `included_files` pada bundle Functions, bukan aset frontend. Setelah file ditambahkan dan di-commit melalui GitHub:

1. Pada environment **Functions** untuk context deployment terkait, set `TIDB_CA_PATH=certs/tidb-ca-rozanhaisyam.pem`.
2. Hapus/kosongkan `TIDB_CA_CERT` agar tidak terjadi konflik dua sumber CA.
3. Deploy ulang revision GitHub yang berisi file tersebut.
4. Uji koneksi dan penulisan data memakai akun uji terotorisasi.

Path relatif dibaca dari working directory runtime Node. Bila memakai file mount/path khusus di platform berbeda, gunakan path absolut yang benar-benar tersedia di runtime.

## Keamanan

- Hanya **sertifikat CA publik** (`BEGIN CERTIFICATE`) yang boleh di-commit.
- Jangan unggah private key (`BEGIN PRIVATE KEY`, `BEGIN RSA PRIVATE KEY`, dan sejenisnya), client-key, password, `.env`, file `.p12`, atau `.pfx`.
- File gabungan certificate + private key akan ditolak oleh adapter koneksi, tetapi itu tidak menghapus secret yang sudah telanjur diunggah ke GitHub. Jika terjadi, cabut/rotasi kredensial dan lakukan penanganan riwayat repository.
- Jangan letakkan CA di `public/`, `src/assets/`, atau `dist/`; file ini hanya untuk function server.
- Jika CA belum ada, jangan set path file yang tidak tersedia. Kosongkan kedua opsi CA untuk memakai trust store Node dengan verifikasi TLS tetap aktif.
- CA yang hilang/tidak valid menyebabkan koneksi gagal; tidak ada fallback ke koneksi TLS tidak terverifikasi.

Panduan lengkap: [Netlify + TiDB Cloud](../docs/NETLIFY-TIDB-CLOUD.md).
