# Pengaturan website khusus admin

## Halaman dan kemampuan

Buka `/admin/` (entry build tersendiri). Panel admin tetap dapat dibuka ketika website maintenance atau konfigurasi publik gagal dimuat.

- Nama website, deskripsi dan pengumuman publik.
- Mode maintenance dengan konfirmasi sebelum disimpan.
- Aktivasi lima subgame: Backend PHP/CI, Backend Python, CrossPlatform, Coding Tower, CodeShark.
- Aktivasi HTML, CSS, JavaScript pada track CodeShark / Tower; track backend/mobile mengikuti sakelar subgame.
- Tombol simpan/muat ulang, indikator perubahan belum disimpan, revisi, waktu penyimpanan, dan indikator database.
- Tidak ada tombol yang menghapus progres, reward, badge atau outbox pemain.

## Setup operator (wajib sebelum penggunaan live)

1. Isi konfigurasi TiDB server dalam `.env` atau dashboard environment deployment. Gunakan database aplikasi `codeshark`, bukan `sys`. Pastikan password asli terisi, TLS tetap diverifikasi dan CA yang benar tersedia.
2. Isi `SUPABASE_URL` dan `SUPABASE_PUBLISHABLE_KEY` untuk verifikasi token server. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` untuk login browser; variabel `VITE_` harus tersedia saat build. SDK autentikasi sekarang merupakan dependensi dan dibundel secara lazy.
3. Aktifkan Google OAuth pada penyedia autentikasi. Izinkan redirect ke origin website + `/admin/`; untuk login pemain, izinkan juga origin root. Gunakan URL deployment/preview sebenarnya, bukan localhost di browser pengguna.
4. Masukkan ID user autentikasi yang sudah diverifikasi (bukan email atau nama) ke environment **server-only** `ADMIN_USER_IDS`. Beberapa ID dipisahkan koma. Tidak ada default admin dan tidak ada pendaftaran admin dari browser. Restart runtime setelah mengubah environment; rebuild jika variabel `VITE_` berubah.
5. Jalankan migrasi secara eksplisit setelah kredensial dan izin database tersedia:

   ```sh
   npm run db:settings:init
   ```

   Migrasi membuat `cs_site_settings` dan `cs_site_settings_audit` secara idempoten tanpa menimpa konfigurasi lama. Migrasi ini terpisah dari `db:tidb:init` untuk progres pemain. Tidak dijalankan otomatis pada request atau saat build.
6. Login Google di `/admin/`, muat konfigurasi, ubah nilai, lalu **Simpan ke database**. Konfigurasi awal belum tersimpan memiliki revisi `0`; penyimpanan pertama menghasilkan revisi `1`.

Jangan menaruh password database, service role key atau allowlist admin di variabel `VITE_`, source frontend, dokumen pengaturan, atau chat. File `.env` tetap diabaikan Git.

## Penyimpanan dan keamanan

- `GET /api/site-settings`: proyeksi publik whitelist, tanpa identitas admin atau audit. Tidak pernah menulis database. Jika tabel tersedia tetapi belum ada baris, mengembalikan konfigurasi bawaan revisi 0.
- `GET /api/admin-settings` dan `PUT /api/admin-settings`: wajib Bearer token yang diverifikasi terhadap JWKS project (atau endpoint identitas online untuk konfigurasi legacy); ID hasil verifikasi harus masuk `ADMIN_USER_IDS`.
- Klaim role dari request, `user_metadata`, guest lokal, maupun `TIDB_ALLOW_GUEST_SYNC=true` tidak memberi hak admin.
- PUT hanya menerima `{ settings, revision }`, dengan daftar key, boolean, batas panjang dan ID game/modul yang tervalidasi ketat. Credential tidak menjadi bagian schema pengaturan.
- Update dan snapshot audit disimpan dalam satu transaksi; kunci baris dan pemeriksaan revisi mencegah lost update. Konflik menghasilkan HTTP 409; admin harus memuat ulang dan menerapkan kembali perubahan. Error tidak ditampilkan sebagai berhasil tersimpan.
- Respons menggunakan `Cache-Control: no-store`; konfigurasi tidak disimpan ke localStorage dan API tidak masuk runtime cache PWA.
- Endpoint tersedia melalui dev API + proxy Vite, adapter Node/Vercel, dan dua function Netlify dengan redirect sebelum SPA fallback.

## Efek untuk pemain

Hub membaca nama/deskripsi dan status aktif dari API. Tombol/kartu subgame dinonaktifkan bila admin menonaktifkannya. URL langsung dan layar subgame yang dipulihkan juga diperiksa. Modul dasar dinonaktifkan di daftar misi serta ditolak saat materi/permainan/pertemuan dibuka. Maintenance menutup halaman pemain tetapi bukan panel admin.

Konfigurasi diperiksa saat halaman dimuat, setiap 60 detik, dan saat tab kembali fokus. Perubahan tidak push real-time; pemain dapat memuat ulang untuk langsung menerapkannya. Jika API/database tidak tersedia, halaman pemain menunjukkan status tidak tersedia + coba lagi (fail closed), bukan diam-diam mengaktifkan semua game. **Ini berarti database dan migrasi settings diperlukan untuk membuka halaman pemain setelah fitur diaktifkan.**

Sakelar ini adalah pengendalian konten pada aplikasi, bukan DRM atau verifikasi skor server. Bundle konten statis yang sudah diunduh/offline tidak dapat ditarik kembali dari perangkat. Mekanisme progres/outbox lama tidak diubah agar hasil bermain yang belum terkirim tidak hilang.

## Pengujian

```sh
npm run test:settings
npm run test:database-status
npm run test:tidb
npm run test:netlify
npm run test:badges
npm run lint
npm run build
```

Tes settings menggunakan pool/layanan identitas tiruan untuk validasi, penolakan guest/non-admin, default read-only, commit + audit, konflik revisi, rollback, redaksi error dan adapter Netlify. Ini bukan bukti koneksi TiDB atau OAuth live.

Pada workspace ini password database, konfigurasi login dan ID admin masih kosong. Migrasi produksi tidak dijalankan dan penyimpanan cloud/OAuth belum dapat diverifikasi. Setelah environment siap, lakukan uji live: admin simpan → refresh tab kedua → nonaktifkan game/modul → cek hub/URL langsung → aktifkan kembali; cek akun non-admin mendapatkan 403 dan maintenance tidak mengunci admin.

### Hasil pengujian implementasi lokal (23 Oktober 2026)

- 11 tes settings + 25 tes status/TiDB/sync/Netlify lulus (**36/36**).
- Badge raster transparan 17 sprite, TypeScript, build lima entry (termasuk admin), dan bundling dua function settings lulus.
- **13 HTTP checks nyata** pada port 3000/3001: admin entry 200, konfigurasi tanpa DB 503, admin tanpa sesi 401, method tidak diizinkan 405, JSON rusak 400.
- **12 browser checks** Chromium/Playwright lulus dengan **fixture API/auth**, bukan cloud: penolakan panel tanpa login, error login tanpa environment, identitas/pengumuman dari konfigurasi, kartu nonaktif, URL langsung nonaktif, maintenance + akses admin, penyaringan modul, kegagalan API, edit/simpan/reload admin, dan konflik revisi.
- Tes browser opsional: jalankan Vite + dev API, lalu `CHROMIUM_PATH=/path/to/chromium npm run test:settings:browser`. Browser tidak menjadi dependensi produksi. Tes menggunakan import modul Vite sehingga ditujukan ke dev server.
- Tidak ada migrasi atau write database live yang dijalankan. Password TiDB, konfigurasi layanan identitas dan ID admin harus diisi sebelum uji cloud.

Autentikasi terbaru memakai publishable key; nama `SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY` masih didukung sebagai fallback legacy. Backend JWKS dan panduan lengkap: [Supabase Auth](SUPABASE-AUTH.md).

## Checklist setup yang belum selesai

Halaman `/admin/` kini selalu menampilkan **Setup yang perlu diselesaikan**, terpisah dari form pengaturan yang memerlukan login. Checklist tetap tersedia jika login belum bisa dipakai, allowlist admin belum diisi, atau pembacaan konfigurasi database gagal.

- Konfigurasi Auth browser (`VITE_*`) diperiksa di browser tanpa menampilkan nilainya.
- `/api/admin-setup` memberikan status redacted untuk environment TiDB/Auth, keberadaan allowlist admin, koneksi database, dan struktur dua tabel settings/audit. Endpoint bootstrap ini tidak memerlukan login supaya kesalahan konfigurasi Auth sendiri bisa terlihat; tidak pernah mengembalikan ID admin, credential, row, atau error SQL.
- Pemeriksaan skema hanya SELECT/LIMIT 0, menggunakan timeout dan cache/singleflight 30 detik. Tidak melakukan migrasi, menulis database, atau membuktikan izin tulis.
- Setiap item menampilkan petunjuk perbaikan. Klik **Periksa ulang setup** setelah memperbaiki konfigurasi; restart server atau rebuild bila environment berubah.
- `Terisi · belum diuji` berbeda dari `Terverifikasi`. Google provider dan daftar redirect dashboard tidak diaudit otomatis: tetap ditandai perlu verifikasi, bukan dianggap selesai karena key terisi atau sesi lokal tersedia.
- Sesi/akses admin hanya ditandai terverifikasi setelah API pengaturan berhasil dimuat. Konfigurasi revisi 0 menampilkan pengingat penyimpanan pertama.
- Secret/service-role key tidak dihitung sebagai blocker untuk login pengguna. Nilai credential tidak ditampilkan dan tidak dapat diedit dari checklist ini.
- Panel status database yang sudah ada juga dipindahkan keluar form login sehingga kegagalan setup tidak menyembunyikan diagnostik.

Endpoint tersedia untuk dev API, Node/Vercel, dan Netlify. Tes: `npm run test:admin-setup` (API/bootstrap/redaksi/read-only/cache, validasi frontend dan rendering admin sebelum login).
