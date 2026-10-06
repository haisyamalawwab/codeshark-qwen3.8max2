import sharkCyber from "./shark-cyber.png";

/* ============ MASKOT HIU ============
   Menggunakan aset PNG cybershark (latar hijau sudah dipotong transparan). */
export default function SharkMascot({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src={sharkCyber}
      alt=""
      draggable={false}
      className={className}
      style={style}
      aria-hidden="true"
    />
  );
}
