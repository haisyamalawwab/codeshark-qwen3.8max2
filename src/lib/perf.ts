/* Util performa mobile — dipakai semua sub-game.
   - DPR dibatasi (max 2, 1.5 bila low-end / hemat baterai)
   - Deteksi reduced-motion & low-end (hardwareConcurrency / deviceMemory)
   - Helper pause saat tab hidden (hemat CPU/baterai) */

export function cappedDPR(max = 2): number {
  try {
    const dpr = window.devicePixelRatio || 1;
    const lowEnd =
      (navigator.hardwareConcurrency ?? 8) <= 4 ||
      ((navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8) <= 4;
    return Math.min(dpr, lowEnd ? 1.5 : max);
  } catch {
    return 1;
  }
}

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** true bila perangkat kentang — matikan partikel berat / blur / shadow */
export function isLowEnd(): boolean {
  try {
    const cores = navigator.hardwareConcurrency ?? 8;
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;
    return cores <= 4 || mem <= 4;
  } catch {
    return false;
  }
}

/** pause callback saat tab hidden; resume saat visible. Kembalikan cleanup. */
export function onVisibilityPause(pause: () => void, resume: () => void): () => void {
  const handler = () => {
    if (document.hidden) pause();
    else resume();
  };
  document.addEventListener("visibilitychange", handler);
  return () => document.removeEventListener("visibilitychange", handler);
}
