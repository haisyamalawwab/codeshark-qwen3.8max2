# Verifikasi dan indikator koneksi database

> 🔀 **Mode data otomatis aktif:** koneksi TiDB Cloud/Aiven dites di awal — terhubung berarti mode cloud (isi dokumen ini berlaku), gagal berarti mode lokal SQLite/localStorage. Panel admin tetap nonaktif pada mode otomatis. Lihat [MODE-LOKAL.md](MODE-LOKAL.md).

## Fitur yang disiapkan

- Panel **TiDB Cloud · status server** pada hub utama dan dashboard game.
- Tombol **Periksa ulang**, timestamp pemeriksaan, dan checklist environment.
- Endpoint read-only `GET /api/database-status` untuk API lokal, Vercel, dan Netlify.
- CLI `npm run db:verify` untuk verifikasi dari lingkungan server dengan konfigurasi sebenarnya.

Pemeriksaan membaca **environment runtime server**, bukan isi `.env` dari browser. Nilai host, username, password, nama database, isi/path CA, anon key, SQL error, dan data peserta tidak dikirim ke browser. Endpoint hanya mengembalikan nama variabel yang telah ditentukan dalam source, status keterisiannya, serta hasil pemeriksaan generik.

## Status indikator

| Status | Arti dan langkah berikutnya |
|---|---|
| Memeriksa database | Request sedang berjalan; belum ada kesimpulan koneksi |
| Cloud belum diaktifkan | `DB_PROVIDER` belum `tidb` pada server lokal/Vercel; Netlify memaksa jalur TiDB |
| Environment belum lengkap | Satu atau beberapa kredensial wajib belum terisi atau masih placeholder |
| Konfigurasi tidak valid | Port/nama DB/CA bermasalah, CA file hilang, atau memakai database sistem seperti `sys` |
| Koneksi gagal | Database tidak dapat dihubungi/menolak koneksi; periksa kredensial, jaringan, TLS |
| Database terhubung; skema belum siap | Koneksi berhasil, tetapi struktur tabel, penanda migrasi, atau izin baca belum sesuai |
| Database terhubung | Koneksi verified TLS, SELECT, struktur kolom penting, dan penanda migrasi berhasil diperiksa |
| Timeout | Pemeriksaan belum selesai dalam delapan detik; jangan dianggap berhasil |
| Status API belum tersedia | Offline, API tidak berjalan, respons HTML SPA, respons rusak, atau request melebihi batas waktu klien |

**Indikator hijau bukan bukti sinkronisasi berhasil.** Probe tidak menulis data, tidak menguji INSERT/UPDATE, tidak memverifikasi token login tertentu, dan tidak menguji OAuth/SDK frontend. Detail panel menyebutkan batasan tersebut. Konfigurasi autentikasi dapat belum lengkap meskipun database sudah hijau.

## Environment yang diperlukan

### Server database — Functions scope di Netlify

| Variabel | Wajib? | Keterangan |
|---|---|---|
| `DB_PROVIDER` | Lokal/Vercel | `tidb`; function Netlify selalu menggunakan adapter TiDB |
| `TIDB_HOST` | Ya | Host dari halaman Connect, tanpa `http://` |
| `TIDB_USER` | Ya | Username lengkap; gunakan user runtime berizin minimum |
| `TIDB_PASSWORD` | Ya | Secret asli, bukan `<PASSWORD>` |
| `TIDB_DATABASE` | Ya | Database aplikasi seperti `codeshark`; bukan `sys`/`mysql` |
| `TIDB_PORT` | Opsional | Default `4000`; sesuaikan cluster |
| `TIDB_CA_PATH` | Opsional | Untuk CA di GitHub: `certs/tidb-ca-rozanhaisyam.pem` |
| `TIDB_CA_CERT` | Alternatif | Isi PEM environment bila tidak memakai file CA |

Pilih **salah satu** sumber CA. Kosongkan keduanya untuk menggunakan trusted CA store Node; verifikasi sertifikat tetap aktif. CA file yang tidak ada membuat status tidak valid. Jangan menaruh password pada `VITE_*` atau Git.

### Server autentikasi — diperlukan untuk sync produksi

| Variabel | Scope | Keterangan |
|---|---|---|
| `SUPABASE_URL` | Functions | URL HTTPS project verifier identitas |
| `SUPABASE_PUBLISHABLE_KEY` | Functions | Key project yang sama |

Panel hanya memeriksa keterisian dan format URL HTTPS, **bukan** memverifikasi bahwa key/endpoint identitas benar-benar berfungsi. `syncPrerequisitesReady=true` berarti prasyarat konfigurasi tersedia dan probe database berhasil, bukan jaminan login atau penulisan berhasil.

### Konfigurasi publik frontend — Builds scope

| Variabel | Keterangan |
|---|---|
| `VITE_SYNC_ENDPOINT` | `/api/sync-progress`, default dari konfigurasi aplikasi/Netlify |
| `VITE_SUPABASE_URL` | Untuk fitur login frontend |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public publishable key, bukan secret/service-role key |

Panel menampilkan kelengkapan dua variabel login frontend secara lokal tanpa mengirim nilainya ke endpoint. Perubahan environment `VITE_*` memerlukan rebuild. `.env.example` adalah template, bukan sumber otomatis environment Netlify.

## Apa yang diuji server?

1. Provider aktif, kredensial wajib terisi, dan bukan placeholder yang dikenal.
2. Konfigurasi driver, nama database aplikasi, port, serta sumber CA valid.
3. Koneksi pool dengan `rejectUnauthorized=true` dan minimum TLS 1.2.
4. Query `SELECT 1`.
5. Query `LIMIT 0` pada kolom yang digunakan sync di `cs_profiles`, `cs_saves`, dan `cs_attempts`, tanpa mengambil baris data peserta.
6. Penanda `001_initial_tidb` pada `cs_schema_migrations` tersedia.
7. Kelengkapan konfigurasi verifier login, terpisah dari koneksi DB.

Skema dibuat dengan `npm run db:tidb:init` secara terpisah. Endpoint status tidak melakukan migrasi atau membuat data percobaan.

## Menjalankan lokal

```bash
# Isi .env lokal dari .env.example terlebih dahulu.
npm run dev:api
# Terminal lain:
npm run dev
```

Vite mem-proxy `/api` ke API Node pada port 3001. Buka hub atau dashboard game, kemudian lihat panel status. Tidak ada polling otomatis terus-menerus; pemeriksaan dilakukan saat panel terpasang dan saat tombol ditekan.

Untuk pemeriksaan terminal:

```bash
npm run db:verify
```

CLI membaca `.env`, mencetak nama variabel/status tanpa nilai secret, dan menghasilkan exit code:

- `0`: koneksi/skema lolos serta konfigurasi verifier login tersedia.
- `1`: belum siap, timeout, konfigurasi hilang, atau salah satu pemeriksaan gagal.

Jika DB siap tetapi environment login belum lengkap, status DB tetap `connected`, namun `syncPrerequisitesReady=false` dan CLI exit `1`. CLI menutup pool setelah selesai.

## Netlify dan endpoint

Redirect `/api/database-status` sudah ditempatkan sebelum fallback SPA menuju `/.netlify/functions/database-status`. Function memakai konfigurasi TiDB secara langsung dan menyertakan CA berdasarkan `included_files` yang sama dengan function sync.

```bash
curl -i https://SITUS-ANDA.netlify.app/api/database-status
```

- `200` + JSON `state: connected`: probe baca berhasil.
- `503` + JSON status lain: API berjalan, tetapi database/config/skema belum siap.
- `405`: metode selain GET.
- HTML: kemungkinan function/routing belum terdeploy dengan benar; frontend tidak menganggapnya berhasil.

Endpoint tidak memerlukan login karena hanya menampilkan kesiapan generik dan checklist nama variabel yang sudah diketahui dari source. Tidak mengirim nilai konfigurasi atau data pengguna. Jika kebijakan organisasi melarang diagnostik publik, lindungi route ini di edge/gateway atau dengan autentikasi admin sebelum membuka deployment publik.

## Cache, timeout, dan batas keamanan

- Cache hasil **30 detik per instance** di server; termasuk hasil gagal.
- Request bersamaan pada instance yang sama menggunakan satu probe (single-flight).
- Respons HTTP `Cache-Control: no-store`; cache internal bukan cache CDN/browser.
- Batas keseluruhan respons probe delapan detik; setiap query diberi timeout tiga detik. Request yang menunggu akuisisi koneksi dapat selesai belakangan; koneksi yang datang setelah deadline dihancurkan, bukan dipakai sebagai hasil sukses.
- Browser membatasi request 12 detik dan tidak mempertahankan indikator hijau lama ketika pemeriksaan ulang gagal.
- Cache per instance bukan rate limiter global. Gunakan kontrol traffic/WAF platform bila perlu; autoscaling tetap dapat menghasilkan beberapa probe bersamaan pada instance berbeda.
- Tidak mengembalikan database version, nama tabel yang hilang, error driver, lokasi file CA, atau string koneksi kepada publik.
- Timestamp hasil tersedia agar pengguna tahu kapan koneksi terakhir diperiksa; perubahan konfigurasi/gangguan bisa belum terlihat sampai cache kedaluwarsa.

## Pengujian dan batas verifikasi saat pengembangan

```bash
npm run test:database-status
npm run test:tidb
npm run test:netlify
npm run lint
npm run build
```

Tes menggunakan driver/pool tiruan untuk status sukses/gagal, skema/izin, timeout, cache, response redaction, adapter HTTP/Netlify, dan respons HTML yang keliru. Itu bukan bukti koneksi cluster asli. Uji live hanya setelah environment runtime tersedia; jangan mengisi laporan tes dengan keberhasilan cloud yang belum dilakukan.

Setelah deploy, verifikasi terpisah dengan akun uji: lakukan login, selesaikan sesi, periksa acknowledgement dan baris tersimpan. Langkah ini menguji jalur **tulis** yang sengaja tidak diuji endpoint status.

Panduan terkait: [Netlify + TiDB](NETLIFY-TIDB-CLOUD.md) dan [setup database](TIDB-CLOUD-MYSQL.md).

Autentikasi terbaru memakai publishable key; nama `SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY` masih didukung sebagai fallback legacy. Backend JWKS dan panduan lengkap: [Supabase Auth](SUPABASE-AUTH.md).
