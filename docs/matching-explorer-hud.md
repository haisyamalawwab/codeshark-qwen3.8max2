# MatchingShark Expedition HUD

## Entry points

- `/matchingshark/`: new responsive expedition home HUD.
- `/matchingshark/?view=landing`: existing campaign page and semantic matching demo, unchanged.
- Run `npm ci` then `npm run dev`; open the MatchingShark path above.

## Scope

The home HUD uses the three user-supplied images as its visual foundation: underwater logo composition, explorer shark, and ocean object sprite sheet. Derived WebP assets live in `src/assets/matching-hud/` and are bundled with Vite URLs so nested deployments work. Objects are cropped from the sheet and dark mattes removed; the shark's edge-connected light background is removed while preserving its light belly. These are approximate cutouts, not professionally retouched transparent originals.

Implemented interactions:
- Home/map navigation, progress and guide dialogs.
- Three-decision mission “Alarm yang Salah”, with choice-specific correctness, explanatory feedback, correction, and completion.
- Versioned, defensive local completion storage under `matching-hud-v1`, isolated from existing academy saves. If storage fails, completion stays in memory and a warning appears.
- Two clearly marked region previews; they do not pretend to be playable missions.
- Replay without duplicate rewards; no XP farming, timer, audio, login, or backend requirement.
- Native modal dialog, radio inputs, focus restoration, keyboard controls, reduced-motion support, and manual motion toggle.

Mission progress in the dialog is temporary; only completion is retained after refresh. Competencies are labeled as practiced, not mastered.

## Validation

- `npm run lint`: passed (TypeScript).
- `npm run build`: passed, including PWA generation and bundled assets.
- Browser smoke testing was attempted using Playwright and a temporary Chromium installation, but the browser could not launch because system library `libnspr4.so` is unavailable. No successful visual, keyboard, contrast, or viewport browser validation is claimed.
- The temporary browser package was not added to package.json or package-lock.json.

## Manual QA checklist

1. Open the HUD at 320, 390, 768, 1024, and 1440 CSS pixels. Check overlap, overflow, readable text, and scroll behavior.
2. Complete all three decisions, first trying an incorrect option; verify correction and completion.
3. Refresh and verify the completion indicator persists. Replay should not increase counts above one completed demo and two practiced skills.
4. Open and close guide, progress, and both previews using keyboard and Escape. Check focus restoration.
5. Enable system reduced motion and the manual toggle; verify transitions and map navigation do not animate.
6. Test unavailable storage, mobile text zoom, screen-reader announcements, and actual contrast pairs before claiming accessibility conformance.
