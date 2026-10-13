/* Helper animasi UI berbasis animejs — dipakai lintas sub-game.
   Di-load dinamis agar bundle inti tetap kecil (mobile first). */
export async function popIn(el: HTMLElement | null): Promise<void> {
  if (!el) return;
  try {
    const { animate } = await import("animejs");
    animate(el, {
      scale: [0.92, 1],
      opacity: [0, 1],
      duration: 320,
      ease: "outBack",
    });
  } catch {
    /* anime gagal dimuat — abaikan, tanpa animasi */
  }
}

export async function shakeX(el: HTMLElement | null): Promise<void> {
  if (!el) return;
  try {
    const { animate } = await import("animejs");
    animate(el, {
      x: [0, -8, 8, -5, 5, 0],
      duration: 320,
      ease: "outQuad",
    });
  } catch {
    /* abaikan */
  }
}

export async function floatUp(el: HTMLElement | null): Promise<void> {
  if (!el) return;
  try {
    const { animate } = await import("animejs");
    animate(el, {
      y: [8, -6],
      opacity: [0, 1],
      duration: 420,
      ease: "outCubic",
    });
  } catch {
    /* abaikan */
  }
}
