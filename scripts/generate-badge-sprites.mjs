import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ts from "typescript";
import sharp from "sharp";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "src/assets/badges");
const cellSize = 256;
const columns = 5;

// Transpile build-time TS/TSX in memory; no tsx runtime or generated JS required.
async function loadSource(relativePath) {
  const source = await readFile(path.join(root, relativePath), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: relativePath,
  });
  const js = outputText.replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve("react/jsx-runtime")));
  return import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
}

const { default: BadgeSource } = await loadSource("scripts/badges/BadgeSource.tsx");
const { ACHIEVEMENTS } = await loadSource("src/lib/achievements.ts");
const rows = Math.ceil(ACHIEVEMENTS.length / columns);
const width = columns * cellSize;
const height = rows * cellSize;
const enabled = [];
const disabled = [];
const badges = {};

await mkdir(output, { recursive: true });
for (const [index, def] of ACHIEVEMENTS.entries()) {
  const markup = renderToStaticMarkup(createElement(BadgeSource, { def, size: cellSize, isUnlocked: true }));
  // SVG is used only during asset generation. Effects are not baked into the
  // cell boundary, so neighbouring sprites never bleed into each other.
  let svg = markup.match(/<svg[\s\S]*<\/svg>/)?.[0];
  if (!svg) throw new Error(`Missing artwork for ${def.id}`);
  svg = svg.replace('width="100%"', `width="${cellSize}"`)
    .replace('height="100%"', `height="${cellSize}"`)
    .replace(/ style="[^"]*"/g, "");
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const muted = Buffer.from(data);
  for (let offset = 0; offset < muted.length; offset += 4) {
    const gray = Math.round(data[offset] * 0.2126 + data[offset + 1] * 0.7152 + data[offset + 2] * 0.0722);
    muted[offset] = gray;
    muted[offset + 1] = gray;
    muted[offset + 2] = gray;
    muted[offset + 3] = Math.round(data[offset + 3] * 0.6);
  }
  const disabledPng = await sharp(muted, { raw: info }).png().toBuffer();
  const column = index % columns;
  const row = Math.floor(index / columns);
  const position = { left: column * cellSize, top: row * cellSize };
  enabled.push({ input: png, ...position });
  disabled.push({ input: disabledPng, ...position });
  badges[def.id] = { column, row };
}

for (const [state, tiles] of [["enabled", enabled], ["disabled", disabled]]) {
  const atlas = sharp({ create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(tiles);
  await atlas.clone().png({ compressionLevel: 9 }).toFile(path.join(output, `badges-${state}.png`));
  await atlas.clone().webp({ lossless: true, effort: 6 }).toFile(path.join(output, `badges-${state}.webp`));
}
await writeFile(path.join(output, "manifest.json"), `${JSON.stringify({ cellSize, columns, rows, badges }, null, 2)}\n`);
console.log(`Generated ${ACHIEVEMENTS.length} badges × 2 states, ${width}×${height} atlases (PNG + lossless WebP).`);
