# Achievement badge sprites

17 achievement badges × two **baked image states**. Runtime uses `AchievementBadgeArt` with a cropped `<picture>` (WebP source, PNG fallback), not inline SVG or canvas.

| File | State |
|---|---|
| `badges-enabled.webp` / `.png` | Full-colour unlocked artwork |
| `badges-disabled.webp` / `.png` | Grayscale artwork, alpha multiplied by 0.6 |
| `manifest.json` | Achievement ID → zero-based column/row |

Both atlases are 1280 × 1024, with five columns, four rows, and 256 × 256 cells. The last three cells are empty. Padding and unused cells have real transparent alpha, not a checkerboard or painted background. Lossless WebP preserves the visible PNG pixels.

## Regenerate and validate

```bash
npm run assets:badges
npm run test:badges
npm run lint
npm run build
```

Source artwork is preserved in `scripts/badges/BadgeSource.tsx`, **build-time only**. The generator reads the current `ACHIEVEMENTS` definitions, renders each design offline, and writes both atlases and the manifest. No image generation service, browser, extra runtime dependency, or canvas is needed. When adding a new achievement, add its glyph to the build-time source and regenerate. Do not import the build-time source into `src/`.

## State semantics

- `isUnlocked=true`: enabled atlas (both claimable and already-claimed achievements).
- `isUnlocked=false`: disabled atlas.
- Claim status, lock/check overlays, titles, rewards and progress remain controlled by `AchievementsSection`; this change does not modify eligibility or rewards.
- `showRays` keeps a subtle CSS radial halo for the detail modal, without rendering vector art or animating a canvas.
- The component remains decorative (`aria-hidden`, empty image alt) because the surrounding card/modal already supplies the badge name and status.
- Rank emblems are a separate component and are not changed by this achievement-badge conversion.
