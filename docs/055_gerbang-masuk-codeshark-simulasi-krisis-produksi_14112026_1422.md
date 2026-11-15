# 055 — Gerbang Masuk CodeShark: Simulasi Krisis Produksi dijalankan sebelum Dashboard

> Disimpan: 14-11-2026 14:22 WIB (+07).
> Branch kerja: `arena/2b16f04b-codeshark-qwen3-8max2` (dari `main` @ `11c10c1`).
> Status: **selesai dan sudah digabung ke `main`** lewat PR #16 (commit `9ba40d9`, gabung `c6bc695`).
> Diperbarui 14-11-2026 18:17 WIB: baris status ini. Rencana lanjutan: `docs/056_…`–`docs/059_…`.
> Melanjutkan `docs/053_…` (rancangan) dan `docs/054_…` (implementasi MVP).

---

## 1. Yang diminta

"Terapkan dan implementasikan 052, 053, 054 sebelum user masuk ke CodingShark."

Modulnya sendiri sudah ada di `main` sejak PR #15. Yang berubah di sini adalah
**letak gerbangnya**: dari "sebelum latihan pertama" menjadi "sebelum masuk
CodeShark".

Catatan tentang 052: rencana itu (editor kosong, Blind Live-Coding Challenge)
sudah digantikan oleh 053 atas naskah yang dikuatkan, dan isinya yang masih
berlaku sudah dilebur ke 053. Jadi yang dijalankan di gerbang adalah simulasi
dua babak dari 053/054, bukan dua modul terpisah.

## 2. Perilaku sebelum dan sesudah

| | Sebelum (054) | Sesudah (055) |
|---|---|---|
| Kapan simulasi muncul | Saat murid menekan latihan pertama | Saat murid masuk `/codingshark/`, sebelum Dashboard tampil |
| Yang sempat dilihat murid | Dashboard, materi, peta | Tidak ada; layar pertama adalah insiden |
| Pengguna baru | Onboarding → Dashboard → (latihan) → simulasi | Onboarding → simulasi → Dashboard |
| Tombol di akhir diagnosis | "Mulai latihan reguler" | "Masuk ke CodeShark" |
| Coding Tower | Digerbang di latihan pertama | Tidak berubah |

Gerbang berlaku di semua jalur menuju Dashboard CodeShark: membuka URL langsung,
kartu CodeShark di hub, tautan dari Coding Tower, selesai membuat profil, masuk
akun, dan mengganti kelompok usia menjadi Academy.

## 3. Yang tidak berubah

- **Siapa yang digerbang:** hanya kelompok Academy (Master Palung). Senior Diver
  tetap opsional lewat kartu Dashboard; Kadet dan Ranger tidak melihat modul ini.
- **Sekali saja.** Setelah satu percobaan tersimpan, CodeShark terbuka seperti biasa.
- **Perangkat tanpa keyboard fisik** (HP/tablet) tidak digerbang.
- **Penangguhan aksesibilitas** tetap ada dan langsung membuka CodeShark.
- Nilai, rank, koin, dan 30 XP partisipasi sama seperti 054.

## 4. Cara kerjanya

- `needsTrapEntryGate(save, noKeyboard, subGame)` di
  `src/data/aiTrapScenarios.ts`: `true` hanya untuk arena `shark` dan hanya
  bila `needsTrapGate` terpenuhi.
- `src/App.tsx`: selama gerbang aktif dan layar yang dituju adalah Dashboard,
  layar diturunkan menjadi simulasi **saat render**, sehingga Dashboard tidak
  pernah ter-mount. Layout effect lalu menetapkannya ke state, supaya layar
  diagnosis tidak hilang begitu percobaan tersimpan (saat itu syarat gerbang
  sudah tidak terpenuhi).
- `src/ui/AiTrapModule.tsx`: prop `gate` (`entry` atau `practice`) mengatur
  teks pengarahan, dan `hubHref` menampilkan tautan "Kembali ke hub".

**Kenapa Coding Tower tidak ikut digerbang di pintu masuk:** permintaannya
menyebut CodeShark, dan Coding Tower adalah arena susun tanpa mengetik. Di sana
gerbang lama (latihan pertama) dibiarkan apa adanya.

## 5. Verifikasi

Dijalankan pada 14-11-2026 14:22 WIB:

| Pemeriksaan | Hasil |
|---|---|
| `npm run lint` | bersih |
| `npm run test:trap` | 27 lulus (1 uji baru untuk gerbang masuk) |
| `npm run build` | berhasil |
| `test:local-mode`, `test:profile`, `test:boot-loading` | 6, 13, 3 lulus |

Uji di Chromium headless (dev server). "Dashboard ter-mount" dipantau dengan
MutationObserver sejak halaman dibuat:

| Skenario | Hasil |
|---|---|
| Academy lama membuka `/codingshark/` | langsung simulasi; Dashboard tidak pernah ter-mount |
| Muat ulang di tengah arena | kembali ke pengarahan; belum ada percobaan tersimpan |
| Menyelesaikan satu percobaan | diagnosis tetap tampil; "Masuk ke CodeShark" membuka Dashboard |
| Muat ulang setelah itu | langsung Dashboard; XP 30 |
| Pengguna baru memilih Master Palung | onboarding → simulasi; Dashboard tidak ter-mount |
| Tautan penangguhan | Dashboard; tetap terbuka setelah muat ulang |
| Dari hub, klik kartu CodeShark | simulasi; "Kembali ke hub" membawa ke `/` |
| Academy di `/codingtower/` | Dashboard |
| Senior, Ranger, Kadet di `/codingshark/` | Dashboard |
| Academy di HP | Dashboard |
| Academy yang sudah pernah mengerjakan | Dashboard |

**Belum diverifikasi:** masuk lewat akun (Better Auth / Google) dan penggantian
kelompok usia di halaman profil. Keduanya melewati jalur kode yang sama (layar
Dashboard + syarat gerbang), tetapi tidak dijalankan di browser. Catatan "belum
diverifikasi" di 054 bagian 7 juga masih berlaku.

## 6. Hal yang perlu diketahui pengajar

- Murid Academy yang sudah punya progres tetapi belum pernah mengerjakan simulasi
  akan disambut insiden ini pada kunjungan berikutnya.
- Muat ulang di tengah arena tidak meloloskan murid, tetapi memberinya 3 menit
  yang baru (skenarionya dipilih ulang secara acak). Percobaan yang ditinggalkan
  tidak tercatat.
- Menekan "Akhiri" tanpa mengetik apa pun tetap dihitung satu percobaan dan
  membuka CodeShark. Diagnosisnya akan menunjukkan nol suntingan.
