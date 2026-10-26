import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

test('boot splash renders generic application loading with Captain Shark', async () => {
  const { build } = await import('esbuild');
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  await mkdir('.cache', { recursive: true });
  const folder = await mkdtemp('.cache/boot-loading-render-');
  try {
    const outfile = `${folder}/boot-loading.mjs`;
    await build({
      entryPoints: ['src/ui/BootLoading.tsx'],
      outfile,
      bundle: true,
      packages: 'external',
      platform: 'node',
      format: 'esm',
      jsx: 'automatic',
      loader: { '.webp': 'file', '.png': 'file' },
      logLevel: 'silent',
    });
    const { default: BootLoading } = await import(pathToFileURL(`${process.cwd()}/${outfile}`).href);
    const html = renderToStaticMarkup(createElement(BootLoading));

    assert(html.includes('Memuat aplikasi'));
    assert(html.includes('Menyiapkan pengalaman belajarmu.'));
    assert(html.includes('boot-loading__captain'));
    assert(html.includes('shark-captain'));
    for (const technicalText of ['database', 'TiDB', 'Aiven', 'belum tersedia', '<button']) {
      assert(!html.includes(technicalText), `boot splash must not expose: ${technicalText}`);
    }
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test('initial provider gate uses the boot splash until mode and settings are ready', async () => {
  const source = await readFile(new URL('../src/lib/siteSettings.tsx', import.meta.url), 'utf8');

  assert(source.includes("import BootLoading from '../ui/BootLoading';"));
  assert(source.includes('const BOOT_MIN_DISPLAY_MS = 650;'));
  assert(source.includes('if (!settings || !modeInfo || !bootReady) return <BootLoading />;'));
  assert(!source.includes('Memeriksa koneksi database cloud'));
  assert(!source.includes('Memuat konfigurasi website…'));

  const errorGate = source.indexOf('if (error) return <Unavailable');
  const bootGate = source.indexOf('if (!settings || !modeInfo || !bootReady)');
  const childrenGate = source.indexOf('<DataModeContext.Provider value={modeInfo}>');
  assert(errorGate >= 0 && errorGate < bootGate, 'real forced-cloud errors must remain explicit');
  assert(bootGate < childrenGate, 'application children must remain hidden until boot resolves');
});

test('Captain Shark uses a slow full rotation and honors reduced motion', async () => {
  const css = await readFile(new URL('../src/ui/ui.css', import.meta.url), 'utf8');
  const captainRule = css.match(/\.boot-loading__captain\s*\{([^}]+)\}/)?.[1] ?? '';
  const reducedMotion = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';

  assert(captainRule.includes('animation: bootSpin 8s linear infinite;'));
  assert(css.includes('@keyframes bootSpin'));
  assert(css.includes('transform: rotate(360deg);'));
  assert(reducedMotion.includes('.boot-loading__captain'));
  assert(reducedMotion.includes('animation: none !important;'));
});
