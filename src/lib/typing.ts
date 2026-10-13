/* Helper murni untuk mesin ketik (dipisah agar bisa diuji tanpa React). */

/** lompati baris kosong (mis. jeda antarblok kode) agar tidak ada baris yang tak bisa diselesaikan */
export function skipBlank<T>(lines: T[][], idx: number): number {
  let i = idx;
  while (i < lines.length && lines[i].length === 0) i += 1;
  return i;
}

/** tombol pintasan browser (Ctrl/⌘/Alt) — bukan ketikan kode; tidak dihitung salah */
export function isShortcut(e: Pick<KeyboardEvent, "ctrlKey" | "metaKey" | "altKey" | "getModifierState">): boolean {
  const altGr = typeof e.getModifierState === "function" && e.getModifierState("AltGraph");
  return (e.ctrlKey || e.metaKey || e.altKey) && !altGr;
}
