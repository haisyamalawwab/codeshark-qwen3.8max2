import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("../", import.meta.url));
const assets = path.join(root, "src/assets/badges");
const manifest = JSON.parse(await readFile(path.join(assets, "manifest.json"), "utf8"));
const definitions = await readFile(path.join(root, "src/lib/achievements.ts"), "utf8");
const ids = [...definitions.matchAll(/^    id: "([^"]+)"/gm)].map((match) => match[1]);
assert.deepEqual(Object.keys(manifest.badges), ids, "Every achievement must have a sprite");
const occupied = new Set();
for (const [id, { column, row }] of Object.entries(manifest.badges)) {
  assert(column >= 0 && column < manifest.columns && row >= 0 && row < manifest.rows, id);
  assert(!occupied.has(`${column}:${row}`), `Duplicate sprite position: ${id}`);
  occupied.add(`${column}:${row}`);
}

const width = manifest.columns * manifest.cellSize;
const height = manifest.rows * manifest.cellSize;
const pixels = {};
for (const state of ["enabled", "disabled"]) {
  for (const format of ["png", "webp"]) {
    const image = sharp(path.join(assets, `badges-${state}.${format}`));
    const metadata = await image.metadata();
    assert.equal(metadata.width, width);
    assert.equal(metadata.height, height);
    assert.equal(metadata.hasAlpha, true, `${state}.${format} must have real alpha`);
    const data = await image.ensureAlpha().raw().toBuffer();
    if (format === "png") pixels[state] = data;
    else {
      // Lossless WebP may normalize RGB values of fully transparent pixels.
      for (let i = 0; i < data.length; i += 4) {
        assert.equal(data[i + 3], pixels[state][i + 3]);
        if (data[i + 3]) assert.deepEqual(data.subarray(i, i + 3), pixels[state].subarray(i, i + 3));
      }
    }
    for (const { column, row } of Object.values(manifest.badges)) {
      const corner = ((row * manifest.cellSize) * width + column * manifest.cellSize) * 4;
      const center = ((row * manifest.cellSize + manifest.cellSize / 2) * width + column * manifest.cellSize + manifest.cellSize / 2) * 4;
      assert.equal(data[corner + 3], 0, "Cell padding must be transparent");
      assert(data[center + 3] > 0, "Sprite must contain visible artwork");
    }
  }
}
for (let i = 0; i < pixels.disabled.length; i += 4) {
  assert.equal(pixels.disabled[i], pixels.disabled[i + 1], "Disabled artwork must be grayscale");
  assert.equal(pixels.disabled[i], pixels.disabled[i + 2]);
  assert.equal(pixels.disabled[i + 3], Math.round(pixels.enabled[i + 3] * 0.6));
}
const component = await readFile(path.join(root, "src/ui/AchievementBadgeArt.tsx"), "utf8");
assert(!/<(?:svg|canvas)\b/.test(component), "Runtime badge must not use SVG or canvas");
assert(component.includes('<source type="image/webp"'));
assert(component.includes('alt=""'), "Badge is decorative alongside named card content");
const transformed = ts.transpileModule(component, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
  .replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve("react/jsx-runtime")))
  .replace(/import (\w+) from "([^"\n]+\.(?:png|webp))";/g, (_match, name, url) => `const ${name} = ${JSON.stringify(url)};`)
  .replace(/import manifest from "[^"\n]+";/, `const manifest = ${JSON.stringify(manifest)};`);
const { default: Badge } = await import(`data:text/javascript;base64,${Buffer.from(transformed).toString("base64")}`);
for (const id of ids) {
  for (const size of [52, 96]) {
    for (const isUnlocked of [true, false]) {
      const state = isUnlocked ? "enabled" : "disabled";
      const markup = renderToStaticMarkup(createElement(Badge, { def: { id, tier: "gold" }, size, isUnlocked, showRays: true }));
      const position = manifest.badges[id];
      assert(markup.includes(`data-badge-state="${state}"`));
      assert(markup.includes(`badges-${state}.webp`));
      assert(markup.includes(`badges-${state}.png`));
      assert(markup.includes(`left:${position.column === 0 ? "0" : `${-position.column * size}px`}`));
      assert(markup.includes(`top:${position.row === 0 ? "0" : `${-position.row * size}px`}`));
      assert(!/<(?:svg|canvas)\b/.test(markup));
    }
  }
}
assert.equal(renderToStaticMarkup(createElement(Badge, { def: { id: "unknown", tier: "gold" } })), "");
console.log(`PASS: ${ids.length} sprites, two states, PNG/WebP alpha, lossless parity, manifest coverage, and raster-only renderer.`);
