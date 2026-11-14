/* ============ ANGKA PEMBANDING AI (Babak 2 — kalkulator) ============
   SATU-SATUNYA tempat angka tentang AI. Ini PERKIRAAN ORDE BESARAN, bukan
   kutipan tarif resmi mana pun:

     ±500 token (masukan + keluaran) untuk satu permintaan kode sekecil ini
     × tarif API publik sampai ±US$10 per satu juta token
     = ±US$0,005  →  di bawah Rp 100 pada kurs ±Rp 16.500 per US$.

   Model yang lebih murah berada jauh di bawah angka itu. Tarif dan kurs
   berubah; bila dosen ingin angka yang lebih spesifik, cukup ubah berkas ini.
   Asumsi di `basis` SELALU ditampilkan di layar bersama angkanya. */

export const AI_BENCHMARK = {
  /** waktu AI menghasilkan kode sekecil ini */
  timeLabel: "hitungan detik",
  /** batas atas biaya per permintaan (rupiah) */
  costCeilingRp: 100,
  costLabel: "di bawah Rp 100",
  basis:
    "Perkiraan kasar: ±500 token per permintaan pada tarif API publik hingga ±US$10 per juta token, kurs ±Rp 16.500. " +
    "Bukan kutipan tarif resmi; tarif dan kurs berubah.",
} as const;
