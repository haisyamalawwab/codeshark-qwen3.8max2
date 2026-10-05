/* Bus ringan antara game dan latar (Ambient).
   Dimutasi langsung (tanpa React state) agar tidak memicu re-render;
   Ambient membacanya di loop requestAnimationFrame. */
export const scene = {
  /** 0–100, ancaman hiu dari TypingGame */
  threat: 0,
  /** 0–1, progres ketikan misi */
  progress: 0,
  /** true selama layar game aktif */
  active: false,
};
