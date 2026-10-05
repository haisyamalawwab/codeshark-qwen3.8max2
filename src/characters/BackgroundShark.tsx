import { forwardRef } from "react";

interface Props {
  /** ref ke lingkaran mata merah (opacity dikendalikan loop animasi latar) */
  eyeRef: React.RefObject<SVGCircleElement | null>;
}

/* Hiu 2D latar belakang: posisi/skala/opacity dikendalikan oleh Ambient
   (graphics/seaEngine) sesuai nilai ancaman. */
const BackgroundShark = forwardRef<HTMLDivElement, Props>(function BackgroundShark({ eyeRef }, ref) {
  return (
    <div ref={ref} className="absolute left-0 top-0 will-change-transform" style={{ width: 380, height: 130, opacity: 0, transformOrigin: "50% 50%" }}>
      <svg viewBox="0 0 380 130" width="100%" height="100%">
        <g transform="translate(8 65)">
          <g className="shark-wag">
            <path d="M0 0 C60 -34 170 -40 250 -16 C290 -6 320 -2 360 -30 C352 -8 350 8 362 30 C320 4 290 8 250 18 C170 42 60 36 0 0 Z" fill="#0a2c46" stroke="#1b5c82" strokeOpacity=".55" strokeWidth="2" />
            <path d="M150 -26 L190 -72 L205 -22 Z" fill="#0a2c46" stroke="#1b5c82" strokeOpacity=".55" strokeWidth="2" />
            <path d="M160 24 L150 56 L196 30 Z" fill="#0a2c46" />
            <path d="M10 6 C40 14 70 14 96 8" fill="none" stroke="#2a7aa6" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
            <path d="M30 2 l5 9 l5 -8 l5 9 l5 -8 l5 8" fill="none" stroke="#cfeaf7" strokeOpacity=".6" strokeWidth="1.4" strokeLinejoin="round" />
            <circle cx="46" cy="-6" r="4.5" fill="#050f18" />
            <circle ref={eyeRef} cx="46" cy="-6" r="7" fill="#ff6b57" style={{ opacity: 0, filter: "blur(2px)" }} />
            <circle cx="46" cy="-6" r="2.2" fill="#ff9d8f" />
          </g>
        </g>
      </svg>
    </div>
  );
});

export default BackgroundShark;
