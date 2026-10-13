/* Helper murni untuk mode Susun Menara (tanpa keyboard fisik).
   Kode sesi dipecah per baris non-kosong → diacak → pemain mengetuk sesuai urutan. */

/** Pecah kode menjadi blok susun: baris non-kosong (indentasi asli dipertahankan). */
export function toBlocks(code: string): string[] {
  return code.split("\n").filter((ln) => ln.trim().length > 0);
}

/** Acak Fisher–Yates; pastikan urutan hasil ≠ urutan asli bila blok > 1. */
export function shuffled<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.length > 1 && a.every((v, i) => v === arr[i])) {
    // putar satu posisi agar tidak langsung tersusun
    const first = a.shift()!;
    a.push(first);
  }
  return a;
}

/** Lebar lantai menara (0–100%) — lantai bawah lebih lebar, menyempit ke atas. */
export function floorWidth(idx: number, total: number): number {
  if (total <= 1) return 100;
  const t = idx / Math.max(1, total - 1); // 0 = dasar, 1 = puncak
  return Math.round(100 - t * 28);
}
