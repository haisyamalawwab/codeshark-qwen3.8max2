/* Deteksi perangkat sentuh — dipakai untuk memilih mode permainan default.
   Aturan: coarse pointer ATAU ontouchstart ATAU UA mobile → mode Susun Menara. */

export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia?.("(pointer: coarse)").matches) return true;
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      // layar kecil + sentuh = hampir pasti HP/tablet
      if (window.matchMedia?.("(max-width: 820px)").matches) return true;
      if (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) return true;
      return true;
    }
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent ?? "");
  } catch {
    return false;
  }
}

export type PlayMode = "ketik" | "susun";

export function defaultMode(): PlayMode {
  return isTouchDevice() ? "susun" : "ketik";
}
