import type { AchievementDef, AchievementTier } from "../lib/achievements";
import enabledWebp from "../assets/badges/badges-enabled.webp";
import enabledPng from "../assets/badges/badges-enabled.png";
import disabledWebp from "../assets/badges/badges-disabled.webp";
import disabledPng from "../assets/badges/badges-disabled.png";
import manifest from "../assets/badges/manifest.json";

interface Props {
  def: AchievementDef;
  tier?: AchievementTier;
  size?: number;
  isUnlocked?: boolean;
  className?: string;
  showRays?: boolean;
}

const GLOW: Record<AchievementTier, string> = {
  bronze: "rgba(245,158,11,0.4)",
  silver: "rgba(148,163,184,0.45)",
  gold: "rgba(251,191,36,0.55)",
  diamond: "rgba(56,189,248,0.65)",
};

/** Raster sprite only: no canvas, inline SVG, or runtime artwork generation.
 * The surrounding achievement card supplies the accessible name and state. */
export default function AchievementBadgeArt({
  def,
  tier = def.tier,
  size = 56,
  isUnlocked = true,
  className = "",
  showRays = false,
}: Props) {
  const sprite = manifest.badges[def.id as keyof typeof manifest.badges];
  if (!sprite) return null;

  return (
    <span
      className={`relative inline-block shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
      data-badge-id={def.id}
      data-badge-state={isUnlocked ? "enabled" : "disabled"}
    >
      {showRays && isUnlocked && (
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${GLOW[tier]}, transparent 70%)`, transform: "scale(1.4)" }}
        />
      )}
      <span className="relative block overflow-hidden" style={{ width: size, height: size }}>
        <picture>
          <source type="image/webp" srcSet={isUnlocked ? enabledWebp : disabledWebp} />
          <img
            src={isUnlocked ? enabledPng : disabledPng}
            alt=""
            draggable={false}
            decoding="async"
            width={manifest.columns * size}
            height={manifest.rows * size}
            className="absolute block pointer-events-none"
            style={{
              width: manifest.columns * size,
              height: manifest.rows * size,
              maxWidth: "none",
              left: -sprite.column * size,
              top: -sprite.row * size,
            }}
          />
        </picture>
      </span>
    </span>
  );
}
