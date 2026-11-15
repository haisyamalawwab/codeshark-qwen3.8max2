import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

/* Metrik Blind Live-Coding Challenge (docs/052 bagian 6, 7, 8, dan 11). */

let lib;
let folder;

before(async () => {
  const { build } = await import('esbuild');
  await mkdir('.cache', { recursive: true });
  folder = await mkdtemp('.cache/blind-metrics-');
  const outfile = `${folder}/blind-metrics.mjs`;
  await build({
    stdin: {
      contents: `
        export * from './src/lib/blindMetrics.ts';
        export { buildBlindAttempt } from './src/lib/blindAttempt.ts';
        export { BLIND_BRIEFS, getBlindBrief } from './src/data/blindChallenges.ts';
        export { loadSaveFor, persistFor } from './src/lib/storage.ts';
      `,
      resolveDir: process.cwd(),
      loader: 'ts',
    },
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    logLevel: 'silent',
  });
  lib = await import(pathToFileURL(`${process.cwd()}/${outfile}`).href);
});

after(async () => {
  if (folder) await rm(folder, { recursive: true, force: true });
});

/** ketik `text` berurutan mulai t0 dengan selang `gap` ms; `pauses` = { indeks: selang khusus } */
function type(text, { t0 = 1000, gap = 200, pos0 = 0, pauses = {} } = {}) {
  const events = [];
  let t = t0;
  [...text].forEach((ch, i) => {
    if (i > 0) t += pauses[i] ?? gap;
    events.push(['e', t, pos0 + i, 0, ch]);
  });
  return { events, end: t };
}

test('jeda 3 detik sebelum `{` terhitung satu jeda kurung kurawal', () => {
  const text = 'function tambah() {';
  const { events, end } = type(text, { pauses: { [text.length - 1]: 3000 } });
  const m = lib.computeBlindMetrics(events, end + 500);
  assert.equal(m.braceHesitations, 1);
  assert.equal(m.semicolonHesitations, 0);
  assert.equal(m.otherSymbolHesitations, 0);
  assert.equal(m.longestBracePauseMs, 3000);
  assert.equal(m.longestSymbolPauseMs, 3000);
  assert.equal(m.baselineMs, 200);
  assert.deepEqual(m.pauseMarks, [[end / 1000, 3000, '{']]);
});

test('jeda 3 detik sebelum huruf tidak terhitung', () => {
  const text = 'function tambah';
  const { events, end } = type(text, { pauses: { 9: 3000 } });
  const m = lib.computeBlindMetrics(events, end + 500);
  assert.equal(m.braceHesitations + m.semicolonHesitations + m.otherSymbolHesitations, 0);
  assert.equal(m.freezes, 0, '3 detik belum mencapai ambang beku');
});

test('jeda sebelum `;` dan sebelum simbol lain masuk kelompoknya masing-masing', () => {
  const text = 'let angka = 0;';
  const { events, end } = type(text, { pauses: { 10: 2500, 13: 4000 } });
  const m = lib.computeBlindMetrics(events, end + 500);
  assert.equal(m.otherSymbolHesitations, 1, '`=`');
  assert.equal(m.semicolonHesitations, 1);
  assert.equal(m.longestSemicolonPauseMs, 4000);
  assert.equal(m.braceHesitations, 0);
});

test('pengetik lambat merata (selang 900 ms) tidak menghasilkan jeda simbol', () => {
  const { events, end } = type('let n = 0; function a() { n += 1; }', { gap: 900 });
  const m = lib.computeBlindMetrics(events, end + 500);
  assert.equal(m.braceHesitations + m.semicolonHesitations + m.otherSymbolHesitations, 0);
  assert.equal(m.baselineMs, 900);
});

test('ambang relatif: 1,6 detik sebelum `{` bukan jeda panjang bagi pengetik berjeda dasar 600 ms', () => {
  const text = 'function tambah() {';
  const last = text.length - 1;
  const slow = type(text, { gap: 600, pauses: { [last]: 1600 } });
  assert.equal(lib.computeBlindMetrics(slow.events, slow.end + 500).braceHesitations, 0, '1600 < 4 × 600');
  const fast = type(text, { gap: 150, pauses: { [last]: 1600 } });
  assert.equal(lib.computeBlindMetrics(fast.events, fast.end + 500).braceHesitations, 1, '1600 ≥ 1500 dan ≥ 4 × 150');
  const under = type(text, { gap: 150, pauses: { [last]: 1400 } });
  assert.equal(lib.computeBlindMetrics(under.events, under.end + 500).braceHesitations, 0, 'di bawah 1,5 detik');
});

test('pindah kursor atau keluar jendela memutus rangkaian: jedanya bukan jeda simbol', () => {
  const a = type('let n', { gap: 200 });
  const nav = [...a.events, ['n', a.end + 100], ['e', a.end + 3000, 5, 0, ';']];
  assert.equal(lib.computeBlindMetrics(nav, a.end + 3500).semicolonHesitations, 0);
  const blur = [...a.events, ['b', a.end + 100, 2500], ['e', a.end + 3000, 5, 0, ';']];
  const m = lib.computeBlindMetrics(blur, a.end + 3500);
  assert.equal(m.semicolonHesitations, 0);
  assert.equal(m.blurCount, 1);
  assert.equal(m.blurMs, 2500);
});

test('`[` lalu hapus lalu `{` terhitung satu salah tombol simbol', () => {
  const a = type('function a() ', { gap: 200 });
  const p = 13;
  const events = [...a.events, ['e', a.end + 200, p, 0, '['], ['e', a.end + 400, p, 1, ''], ['e', a.end + 600, p, 0, '{']];
  const m = lib.computeBlindMetrics(events, a.end + 1000);
  assert.equal(m.symbolFumbles, 1);
  assert.equal(m.corrections, 1);
});

test('bukan salah tombol simbol: simbol yang sama diketik ulang, atau diganti huruf', () => {
  const a = type('ab', { gap: 200 });
  const same = [...a.events, ['e', a.end + 200, 2, 0, '{'], ['e', a.end + 400, 2, 1, ''], ['e', a.end + 600, 2, 0, '{']];
  assert.equal(lib.computeBlindMetrics(same, a.end + 1000).symbolFumbles, 0);
  const letter = [...a.events, ['e', a.end + 200, 2, 0, '{'], ['e', a.end + 400, 2, 1, ''], ['e', a.end + 600, 2, 0, 'x']];
  assert.equal(lib.computeBlindMetrics(letter, a.end + 1000).symbolFumbles, 0);
  const late = [...a.events, ['e', a.end + 200, 2, 0, '['], ['e', a.end + 400, 3, 0, 'x'], ['e', a.end + 600, 3, 1, ''], ['e', a.end + 800, 2, 1, ''], ['e', a.end + 1000, 2, 0, '{']];
  assert.equal(lib.computeBlindMetrics(late, a.end + 1500).symbolFumbles, 0, 'lebih dari dua ketukan');
});

test('beku: selang ≥ 5 detik; latensi awal dilaporkan terpisah', () => {
  const text = 'abcdef';
  const { events, end } = type(text, { t0: 20_000, pauses: { 3: 7000 } });
  const m = lib.computeBlindMetrics(events, end + 1000);
  assert.equal(m.firstKeyMs, 20_000);
  assert.equal(m.freezes, 1, 'membaca soal 20 detik bukan beku');
  assert.equal(m.frozenMs, 7000);
  assert.deepEqual(m.freezeSpans, [[20.4, 27.4]]);
});

test('beku yang diikuti simbol dihitung sebagai jeda simbol, tidak dua kali', () => {
  const text = 'function a() {';
  const { events, end } = type(text, { pauses: { [text.length - 1]: 8000 } });
  const m = lib.computeBlindMetrics(events, end + 500);
  assert.equal(m.braceHesitations, 1);
  assert.equal(m.freezes, 0);
  assert.equal(m.frozenMs, 0);
});

test('diam di akhir sesi dihitung beku; sesi tanpa ketikan beku seluruhnya', () => {
  const { events, end } = type('abc');
  const m = lib.computeBlindMetrics(events, end + 60_000);
  assert.equal(m.freezes, 1);
  assert.equal(m.frozenMs, 60_000);
  const empty = lib.computeBlindMetrics([], 180_000);
  assert.equal(empty.firstKeyMs, null);
  assert.equal(empty.frozenMs, 180_000);
  assert.equal(empty.baselineMs, null);
  assert.equal(empty.charsTyped, 0);
});

test('garis waktu: 36 ember × 5 detik berisi jumlah karakter', () => {
  const a = type('abcd', { t0: 1000, gap: 100 });
  const b = type('xy', { t0: 12_000, gap: 100, pos0: 4 });
  const m = lib.computeBlindMetrics([...a.events, ...b.events, ['e', 179_900, 6, 0, 'z']], 180_000);
  assert.equal(m.timeline.length, 36);
  assert.equal(m.timeline[0], 4);
  assert.equal(m.timeline[2], 2);
  assert.equal(m.timeline[35], 1);
  assert.equal(m.timeline.reduce((s, n) => s + n, 0), 7);
});

test('integritas: tempel, seret, dan sisipan ditolak dihitung terpisah', () => {
  const m = lib.computeBlindMetrics([['x', 100, 'paste'], ['x', 200, 'drop'], ['x', 300, 'replace'], ['x', 400, 'synthetic']], 5000);
  assert.equal(m.pasteAttempts, 2);
  assert.equal(m.rejectedInserts, 2);
});

test('Tab (dua spasi sekaligus) tidak dihitung sebagai ketukan untuk jeda', () => {
  const a = type('ab', { gap: 200 });
  const events = [...a.events, ['e', a.end + 3000, 2, 0, '  '], ['e', a.end + 3200, 4, 0, '{']];
  const m = lib.computeBlindMetrics(events, a.end + 4000);
  assert.equal(m.braceHesitations, 0, 'selang sebelum `{` hanya 200 ms');
  assert.equal(m.charsTyped, 5);
  assert.equal(m.lastEditPos, 5);
});

test('tingkat: aturan docs/052 bagian 7', () => {
  const base = { syntaxErrors: 0, symbolHesitations: 0, frozenMs: 0, durationMs: 180_000, chars: 200 };
  assert.equal(lib.blindLevel(base), 'lancar');
  assert.equal(lib.blindLevel({ ...base, symbolHesitations: 1 }), 'lancar');
  assert.equal(lib.blindLevel({ ...base, symbolHesitations: 2 }), 'tersendat');
  assert.equal(lib.blindLevel({ ...base, syntaxErrors: 1 }), 'tersendat');
  assert.equal(lib.blindLevel({ ...base, frozenMs: 0.15 * 180_000 }), 'tersendat', 'beku 15% bukan lancar');
  assert.equal(lib.blindLevel({ ...base, syntaxErrors: 3 }), 'gagap-berat');
  assert.equal(lib.blindLevel({ ...base, symbolHesitations: 5 }), 'gagap-berat');
  assert.equal(lib.blindLevel({ ...base, frozenMs: 0.4 * 180_000 }), 'gagap-berat');
  assert.equal(lib.blindLevel({ ...base, syntaxErrors: 2, symbolHesitations: 4, frozenMs: 0.39 * 180_000 }), 'tersendat');
});

test('tingkat: kode yang hampir kosong tidak pernah "lancar"', () => {
  assert.equal(lib.blindLevel({ syntaxErrors: 0, symbolHesitations: 0, frozenMs: 0, durationMs: 4000, chars: 0 }), 'gagap-berat');
  assert.equal(lib.blindLevel({ syntaxErrors: 0, symbolHesitations: 0, frozenMs: 0, durationMs: 60_000, chars: 39 }), 'gagap-berat');
});

test('kecepatan menulis: 5 karakter = 1 kata', () => {
  assert.equal(lib.writingWpm(200, 60_000), 40);
  assert.equal(lib.writingWpm(200, 180_000), 13);
  assert.equal(lib.writingWpm(0, 180_000), 0);
});

/* ------------------------------------------------------------ penyimpanan */

const attempt = (id) => ({
  id, at: 1, briefId: 'penghitung', durationSec: 180, limitSec: 180, endedBy: 'timeout', chars: 0, baselineMs: null,
  braceHesitations: 0, semicolonHesitations: 0, otherSymbolHesitations: 0, longestBracePauseMs: 0,
  longestSemicolonPauseMs: 0, longestSymbolPauseMs: 0, symbolFumbles: 0, freezes: 1, frozenMs: 180000, firstKeyMs: null,
  corrections: 0, syntaxErrors: [], missingJsSemicolons: 0, specPassed: 0, specTotal: 4, specMet: [], pasteAttempts: 0,
  rejectedInserts: 0, blurCount: 0, blurMs: 0, wpm: 0, level: 'gagap-berat', timeline: [], pauseMarks: [], freezeSpans: [],
  code: '',
});

test('save lama tanpa irisan `blind` terbaca tanpa galat', () => {
  assert.equal(lib.normalizeBlind(undefined), undefined);
  assert.equal(lib.normalizeBlind(null), undefined);
  assert.equal(lib.normalizeBlind('rusak'), undefined);
  assert.equal(lib.normalizeBlind([]), undefined);
});

test('irisan `blind` yang rusak dibersihkan, bukan menggagalkan muat', () => {
  const broken = [
    { id: 5 }, null, 'x',
    { ...attempt('b'), code: 7 },
    { ...attempt('c'), level: 'hebat' },
    { ...attempt('d'), braceHesitations: undefined },
    { ...attempt('e'), syntaxErrors: [{ line: 'satu' }] },
    { ...attempt('f'), frozenMs: null },
  ];
  const n = lib.normalizeBlind({ attempts: [attempt('a'), ...broken], deferred: 'ya', lastBriefId: 9 });
  assert.deepEqual(n, { attempts: [attempt('a')] }, 'rapor separuh rusak dibuang utuh; kunci tak sahih tidak ikut');
  assert.deepEqual(lib.normalizeBlind({ attempts: 'bukan-array', deferred: true, lastBriefId: 'tugas' }), { attempts: [], deferred: true, lastBriefId: 'tugas' });
});

test('paling banyak 10 percobaan; baseline (percobaan pertama) tidak pernah dibuang', () => {
  const list = Array.from({ length: 14 }, (_, i) => attempt(`p${i}`));
  const kept = lib.trimBlindAttempts(list);
  assert.equal(kept.length, 10);
  assert.equal(kept[0].id, 'p0');
  assert.deepEqual(kept.slice(1).map((a) => a.id), ['p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13']);
  assert.equal(lib.trimBlindAttempts(list.slice(0, 10)).length, 10);
});

/* ------------------------------------------------- rapor utuh (blindAttempt) */

/** ketik satu dokumen utuh; `pauses` = { 'teks sebelum titik jeda': ms } */
function typeDoc(text, { gap = 180, pauses = {} } = {}) {
  const at = {};
  for (const [before, ms] of Object.entries(pauses)) at[text.indexOf(before) + before.length] = ms;
  return type(text, { gap, pauses: at });
}

test('rapor utuh: jawaban acuan yang diketik lancar → Lancar, semua tuntutan terpenuhi', () => {
  for (const brief of lib.BLIND_BRIEFS) {
    const { events, end } = typeDoc(brief.reference);
    const a = lib.buildBlindAttempt({ brief, code: brief.reference, events, durationMs: end + 300, endedBy: 'manual', confidence: 4, id: 'x', at: 1 });
    assert.equal(a.level, 'lancar', brief.id);
    assert.equal(a.specPassed, 4);
    assert.deepEqual(a.syntaxErrors, []);
    assert.equal(a.confidence, 4);
    assert.equal(a.chars, brief.reference.trim().length);
    assert.equal(a.endedBy, 'manual');
    assert.equal(a.limitSec, 180);
  }
});

test('rapor utuh: lima jeda panjang sebelum simbol → Gagap berat walau kodenya benar', () => {
  const brief = lib.getBlindBrief('penghitung');
  const { events, end } = typeDoc(brief.reference, {
    pauses: { 'style>\nbutton ': 2500, 'padding: 8px': 2500, 'color: white': 2500, 'let n = 0': 2500, 'function tambah() ': 2500 },
  });
  const a = lib.buildBlindAttempt({ brief, code: brief.reference, events, durationMs: end + 300, endedBy: 'manual', id: 'x', at: 1 });
  assert.equal(a.braceHesitations, 2);
  assert.equal(a.semicolonHesitations, 3);
  assert.equal(a.level, 'gagap-berat');
  assert.equal(a.specPassed, 4);
  assert.equal(a.confidence, undefined);
});

test('rapor utuh: blok terbuka saat waktu habis tidak menaikkan tingkat', () => {
  const brief = lib.getBlindBrief('penghitung');
  const code = brief.reference.slice(0, brief.reference.indexOf('n = n + 1;') + 10);
  const { events, end } = typeDoc(code, { gap: 900 });
  const a = lib.buildBlindAttempt({ brief, code, events, durationMs: end + 300, endedBy: 'timeout', id: 'x', at: 1 });
  assert.ok(a.syntaxErrors.length >= 2);
  assert.ok(a.syntaxErrors.every((e) => e.unfinished));
  assert.equal(a.level, 'lancar', 'pengetik lambat merata, tanpa kesalahan pada bagian yang sudah selesai');
  const manual = lib.buildBlindAttempt({ brief, code, events, durationMs: end + 300, endedBy: 'manual', id: 'x', at: 1 });
  assert.ok(manual.syntaxErrors.every((e) => !e.unfinished));
  assert.equal(manual.level, 'tersendat');
});

test('rapor utuh: log ketikan mentah tidak ikut tersimpan; kode dipotong 4.000 karakter', () => {
  const brief = lib.getBlindBrief('sapaan');
  const { events, end } = typeDoc(brief.reference);
  const a = lib.buildBlindAttempt({ brief, code: brief.reference, events, durationMs: end, endedBy: 'manual', id: 'x', at: 1 });
  assert.equal(Object.values(a).includes(events), false);
  assert.equal(JSON.stringify(a).includes('["e",'), false);
  assert.ok(JSON.stringify(a).length < 4000, `ukuran rapor ${JSON.stringify(a).length} byte`);
  const long = 'x'.repeat(5000);
  const b = lib.buildBlindAttempt({ brief, code: long, events: [], durationMs: 180_000, endedBy: 'timeout', id: 'y', at: 1 });
  assert.equal(b.code.length, lib.MAX_BLIND_CODE_CHARS);
});

test('rapor utuh bertahan lewat JSON dan penormal', () => {
  const brief = lib.getBlindBrief('tugas');
  const { events, end } = typeDoc(brief.reference, { pauses: { 'li ': 3000 } });
  const a = lib.buildBlindAttempt({ brief, code: brief.reference, events, durationMs: end, endedBy: 'manual', confidence: 2, id: 'x', at: 1 });
  const back = lib.normalizeBlind(JSON.parse(JSON.stringify({ attempts: [a], lastBriefId: 'tugas' })));
  assert.deepEqual(back, { attempts: [a], lastBriefId: 'tugas' });
});

/* ------------------------------------------------------- storage.ts (save) */

function withStorage(initial, fn) {
  const store = new Map(Object.entries(initial));
  const prev = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
  };
  try { return fn(store); } finally { globalThis.localStorage = prev; }
}

const OLD_SAVE = {
  profile: { name: 'Lama', age: 'academy', sound: true, createdAt: 1 },
  xp: 1234, coins: 50, modules: { html: { materiDone: true, quizXp: 10 } },
  stats: { games: 9, wins: 7, bestWpm: 42, bestCombo: 30, keystrokes: 900, correct: 850, linesTyped: 80 },
  deviceId: 'lama', updatedAt: 5,
};

test('save lama tanpa `blind` termuat utuh; progres tidak berubah', () => {
  withStorage({ 'codeshark:save:v1': JSON.stringify(OLD_SAVE) }, () => {
    const s = lib.loadSaveFor(null);
    assert.equal(s.blind, undefined);
    assert.equal(s.xp, 1234);
    assert.equal(s.profile.age, 'academy');
    assert.equal(s.stats.bestWpm, 42);
  });
});

test('save dengan irisan `blind` rusak tetap termuat', () => {
  withStorage({ 'codeshark:save:v1': JSON.stringify({ ...OLD_SAVE, blind: { attempts: [{ id: 1 }, 'x'], deferred: 1 } }) }, () => {
    const s = lib.loadSaveFor(null);
    assert.deepEqual(s.blind, { attempts: [] });
    assert.equal(s.xp, 1234);
  });
});

test('irisan `blind` bertahan lewat simpan lalu muat', () => {
  withStorage({}, (store) => {
    const brief = lib.getBlindBrief('penghitung');
    const { events, end } = typeDoc(brief.reference);
    const a = lib.buildBlindAttempt({ brief, code: brief.reference, events, durationMs: end, endedBy: 'manual', confidence: 5, id: 'x', at: 1 });
    lib.persistFor({ ...OLD_SAVE, blind: { attempts: [a], deferred: true, lastBriefId: 'penghitung' } }, null);
    assert.ok([...store.keys()].includes('codeshark:save:v1'));
    const s = lib.loadSaveFor(null);
    assert.deepEqual(s.blind, { attempts: [a], deferred: true, lastBriefId: 'penghitung' });
  });
});
