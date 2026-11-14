import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

/* Pustaka AI-Trap ditulis dalam TypeScript murni (tanpa DOM). Uji ini
   membundelnya dengan esbuild, sama seperti tests/boot-loading.test.mjs. */

let lib;
let folder;

before(async () => {
  const { build } = await import('esbuild');
  await mkdir('.cache', { recursive: true });
  folder = await mkdtemp('.cache/ai-trap-');
  const outfile = `${folder}/ai-trap.mjs`;
  await build({
    stdin: {
      contents: `
        export * from './src/lib/trapLint.ts';
        export * from './src/lib/trapMetrics.ts';
        export * from './src/lib/trapRunner.ts';
        export * from './src/data/aiTrapScenarios.ts';
        export * from './src/data/aiBenchmark.ts';
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

/* ------------------------------------------------------------------ lint */

test('lint: dokumen yang benar menghasilkan nol temuan', () => {
  const doc = `<div class="a">\n  <p>Halo<br></p>\n</div>\n<style>\n  .a { color: red; padding: 4px }\n</style>\n<script>\n  const f = (x) => { return [x, 'a}b']; };\n  // komentar dengan { kurung\n</script>\n`;
  assert.deepEqual(lib.lintDoc(doc), []);
});

test('lint JS: kurung tak ditutup, penutup berlebih, dan kutip tak ditutup', () => {
  assert.equal(lib.lintJs('function a() {\n  return 1;\n').filter((f) => f.code === 'unclosed-bracket').length, 1);
  const stray = lib.lintJs('  x += 1;\n});\n');
  assert.deepEqual(stray.map((f) => f.code), ['stray-closer', 'stray-closer']);
  assert.equal(stray[0].line, 2);
  assert.deepEqual(lib.lintJs("const a = 'abc;\nconst b = 1;\n").map((f) => f.code), ['unclosed-string']);
});

test('lint CSS: titik koma hilang, titik dua hilang, kurung tak ditutup', () => {
  assert.deepEqual(lib.lintCss('.a {\n  background: #0a7\n  color: white;\n}\n').map((f) => f.code), ['css-missing-semicolon']);
  assert.deepEqual(lib.lintCss('.a { color red; }').map((f) => f.code), ['css-missing-colon']);
  assert.deepEqual(lib.lintCss('.a {\n  color: red;\n\n.b { color: blue; }\n').map((f) => f.code), ['unclosed-bracket']);
  assert.deepEqual(lib.lintCss('.a { color: red }\n.b { margin: 0 }'), []);
});

test('lint HTML: kutip atribut, tag bersilang, penutup liar, < tanpa >', () => {
  assert.deepEqual(lib.lintHtml('<p class="a>x</p>').map((f) => f.code), ['html-attr-quote']);
  assert.deepEqual(lib.lintHtml('<div><p>x</div>').map((f) => f.code), ['html-unclosed-tag']);
  assert.deepEqual(lib.lintHtml('<p>x</p></span>').map((f) => f.code), ['html-stray-close']);
  assert.ok(lib.lintHtml('<p>x</p\n<p>y</p>').some((f) => f.code === 'html-dangling-lt'));
  assert.deepEqual(lib.lintHtml('<img src="a.png"><br><input type="text">'), []);
});

test('splitRegions mempertahankan panjang dan nomor baris', () => {
  const doc = '<p>a</p>\n<style>\n.a{}\n</style>\n<script>\nlet x;\n</script>\n';
  const r = lib.splitRegions(doc);
  for (const part of [r.html, r.css, r.js]) {
    assert.equal(part.length, doc.length);
    assert.equal(part.split('\n').length, doc.split('\n').length);
  }
  assert.ok(r.css.includes('.a{}') && !r.html.includes('.a{}'));
  assert.ok(r.js.includes('let x;') && !r.css.includes('let x;'));
});

test('hasLoop hanya melihat wilayah JS dan mengabaikan komentar', () => {
  assert.equal(lib.hasLoop('<p>for (you)</p><script>let a = 1; // while (true) {}\n</script>'), false);
  assert.equal(lib.hasLoop('<script>while (true) {}</script>'), true);
  assert.equal(lib.hasLoop('<script>for (;;) {}</script>'), true);
});

/* ------------------------------------------------------------- skenario */

test('skenario: kode beracun punya 4 jebakan, semua belum diperbaiki dan ada temuan lint', () => {
  assert.ok(lib.TRAP_SCENARIOS.length >= 2);
  for (const sc of lib.TRAP_SCENARIOS) {
    assert.equal(sc.traps.length, 4, sc.id);
    assert.deepEqual(new Set(sc.traps.map((t) => t.lang)), new Set(['html', 'css', 'js']), sc.id);
    assert.deepEqual(lib.fixedTrapIds(sc, sc.code), [], sc.id);
    assert.ok(lib.lintDoc(sc.code).length > 0, sc.id);
    for (const t of sc.traps) {
      assert.ok(sc.code.includes(t.needle), `${sc.id}/${t.id} needle`);
      assert.ok(lib.trapLine(sc, t) > 1, `${sc.id}/${t.id} baris`);
    }
    assert.equal(lib.hasLoop(sc.code), false, sc.id);
  }
});

test('skenario: kode acuan memperbaiki keempat jebakan dan bersih dari temuan lint', () => {
  for (const sc of lib.TRAP_SCENARIOS) {
    assert.notEqual(sc.solution, sc.code, sc.id);
    assert.deepEqual(lib.fixedTrapIds(sc, sc.solution), sc.traps.map((t) => t.id), sc.id);
    assert.deepEqual(lib.lintDoc(sc.solution), [], sc.id);
  }
});

test('skenario: tiap jebakan terdeteksi sendiri-sendiri', () => {
  const sc = lib.getTrapScenario('keranjang');
  const onlyHtml = sc.code.replace('class="btn>Tambah', 'class="btn">Tambah');
  assert.deepEqual(lib.fixedTrapIds(sc, onlyHtml), ['html-kutip']);
  const onlyCss = sc.code.replace('background: #0a7\n', 'background: #0a7;\n');
  assert.deepEqual(lib.fixedTrapIds(sc, onlyCss), ['css-titik-koma']);
  const wrongFix = sc.code.replace('hargaSatuaan', 'hargaSatuann');
  assert.deepEqual(lib.fixedTrapIds(sc, wrongFix), []);
  const fn = sc.code.replace('terpotong saat disalin)\n', 'terpotong saat disalin)\n  tombol.addEventListener("click", function () {\n');
  assert.deepEqual(lib.fixedTrapIds(sc, fn), ['js-baris-terpotong']);
});

test('pickTrapScenario menghindari skenario percobaan terakhir', () => {
  for (let i = 0; i < 20; i++) assert.notEqual(lib.pickTrapScenario('keranjang').id, 'keranjang');
  assert.ok(lib.pickTrapScenario(null, () => 0).id);
});

test('checks skenario aman dipadatkan menjadi satu baris', () => {
  for (const sc of lib.TRAP_SCENARIOS) {
    assert.ok(!/\/\//.test(sc.checks), `${sc.id}: tanpa komentar //`);
    assert.ok(!/<\/script/i.test(sc.checks), `${sc.id}: tanpa penutup tag skrip`);
    const doc = lib.buildSandboxDoc(sc.code, sc.checks, 'tok');
    assert.equal(doc.split('\n').length, sc.code.split('\n').length, `${sc.id}: nomor baris tidak bergeser`);
    assert.ok(doc.startsWith('<script>'));
    /* badan pemeriksaan harus sah sebagai JavaScript */
    assert.doesNotThrow(() => new Function(sc.checks.replace(/\s*\n\s*/g, ' ')), sc.id);
  }
});

/* --------------------------------------------------------------- gerbang */

test('gerbang: hanya academy, bukan perangkat sentuh, dan hanya sebelum percobaan pertama', () => {
  const profile = (age) => ({ name: 'A', age, sound: true, createdAt: 0 });
  assert.equal(lib.needsTrapGate({ profile: profile('academy') }, false), true);
  assert.equal(lib.needsTrapGate({ profile: profile('academy') }, true), false);
  assert.equal(lib.needsTrapGate({ profile: profile('academy'), aiTrap: { attempts: [], deferred: true } }, false), false);
  assert.equal(lib.needsTrapGate({ profile: profile('academy'), aiTrap: { attempts: [{ id: 'x' }] } }, false), false);
  for (const age of ['junior', 'teen', 'senior']) assert.equal(lib.needsTrapGate({ profile: profile(age) }, false), false);
  assert.equal(lib.needsTrapGate({ profile: null }, false), false);
  assert.equal(lib.trapVisibleFor('senior'), true);
  assert.equal(lib.trapVisibleFor('teen'), false);
  assert.equal(lib.trapVisibleFor('junior'), false);
});

test('gerbang masuk CodeShark: hanya arena ketik, mengikuti aturan needsTrapGate', () => {
  const profile = (age) => ({ name: 'A', age, sound: true, createdAt: 1 });
  const fresh = { profile: profile('academy') };
  assert.equal(lib.needsTrapEntryGate(fresh, false, 'shark'), true);
  assert.equal(lib.needsTrapEntryGate(fresh, false, 'tower'), false, 'Coding Tower tidak digerbang di pintu masuk');
  assert.equal(lib.needsTrapEntryGate(fresh, true, 'shark'), false, 'tanpa keyboard fisik');
  assert.equal(lib.needsTrapEntryGate({ profile: null }, false, 'shark'), false, 'belum punya profil → onboarding dulu');
  assert.equal(lib.needsTrapEntryGate({ ...fresh, aiTrap: { attempts: [{ id: 'x' }] } }, false, 'shark'), false, 'cukup satu kali');
  assert.equal(lib.needsTrapEntryGate({ ...fresh, aiTrap: { attempts: [], deferred: true } }, false, 'shark'), false);
  for (const age of ['junior', 'teen', 'senior']) assert.equal(lib.needsTrapEntryGate({ profile: profile(age) }, false, 'shark'), false);
});

/* ---------------------------------------------------------------- metrik */

const typing = (start, pos, text, gap = 150) => {
  const out = [];
  let t = start;
  for (let i = 0; i < text.length; i++) {
    out.push(['e', t, pos + i, 0, text[i]]);
    t += gap;
  }
  return out;
};

const base = { initial: 'abc\ndef\nghi\n', durationMs: 60_000, trapLines: [2] };

test('metrik: jeda > 2 detik sebelum simbol di tengah mengetik masuk peta panas', () => {
  const events = [
    ...typing(1000, 4, 'fn'),
    ['e', 1300 + 3000, 6, 0, '{'],
    ['e', 4300 + 2100, 7, 0, ';'],
    ['e', 6400 + 1900, 8, 0, '}'],
  ];
  const m = lib.computeMetrics({ ...base, events });
  assert.equal(m.keys['{'].slow, 1);
  assert.equal(m.keys['{'].maxMs, 3150);
  assert.equal(m.keys[';'].slow, 1);
  assert.equal(m.keys['}'].slow, 0, '1,9 detik tidak menyalakan tombol');
  assert.deepEqual(m.slowKeys, ['{', ';']);
  assert.equal(m.contiguousKeys, 4);
});

test('metrik: jeda setelah pindah kursor, Jalankan, atau keluar fokus tidak dihitung motorik', () => {
  for (const breaker of [['n', 2000], ['r', 2000, 0, 0, 3, ''], ['b', 2000, 500]]) {
    const events = [...typing(1000, 4, 'ab'), breaker, ['e', 6000, 6, 0, '{']];
    const m = lib.computeMetrics({ ...base, events });
    assert.equal(m.keys['{'], undefined, breaker[0]);
  }
  const jump = lib.computeMetrics({ ...base, events: [...typing(1000, 4, 'ab'), ['e', 6000, 0, 0, '{']] });
  assert.equal(jump.keys['{'], undefined, 'posisi tidak bersambung');
});

test('metrik: pengetik lambat merata tidak menghasilkan tombol lumpuh', () => {
  const m = lib.computeMetrics({ ...base, events: typing(1000, 4, 'a{b};(c)', 900) });
  assert.deepEqual(m.slowKeys, []);
});

test('metrik: koreksi, rentetan hapus, beku, dan waktu baca awal', () => {
  const events = [
    ...typing(8000, 4, 'xyz'),
    ['e', 8500, 6, 1, ''], ['e', 8700, 5, 1, ''], ['e', 8900, 4, 1, ''],
    ['e', 20_000, 4, 0, 'q'],
  ];
  const m = lib.computeMetrics({ ...base, events });
  assert.equal(m.firstActionMs, 8000);
  assert.equal(m.corrections, 3);
  assert.equal(m.longestDeleteStreak, 3);
  assert.equal(m.keys.Backspace.n, 3);
  assert.equal(m.freezes, 2, 'satu beku 11 detik + ekor 40 detik');
  assert.equal(m.longestFreezeMs, 40_000);
  assert.equal(m.charsTyped, 4);
});

const LISTENER = ["terpotong saat disalin)\n", "terpotong saat disalin)\n  tombol.addEventListener('click', () => {\n"];
const FIXES = {
  keranjang: {
    'html-kutip': ['class="btn>Tambah Barang', 'class="btn">Tambah Barang'],
    'css-titik-koma': ['background: #0a7\n', 'background: #0a7;\n'],
    'js-nama-variabel': ['hargaSatuaan', 'hargaSatuan'],
    'js-baris-terpotong': LISTENER,
  },
  suka: {
    'html-kutip': ['id="jumlah>0', 'id="jumlah">0'],
    'css-kurung': ['border-radius: 6px;\n\n', 'border-radius: 6px;\n  }\n'],
    'js-nama-variabel': ['langkha;', 'langkah;'],
    'js-baris-terpotong': LISTENER,
  },
};
function applyFix(sc, code, id) {
  const [from, to] = FIXES[sc.id][id];
  assert.ok(code.includes(from), `${sc.id}/${id}: pola perbaikan ditemukan`);
  return code.replace(from, to);
}

test('metrik: efek domino menghitung temuan BARU per identitas, bukan selisih jumlah', () => {
  const sc = lib.getTrapScenario('suka');
  const at = sc.code.indexOf('terpotong saat disalin)\n') + 'terpotong saat disalin)\n'.length;
  const input = { initial: sc.code, durationMs: 60_000, trapLines: [], lint: lib.lintKeys };
  // baris listener ditulis dengan kurung kurawal ganda: 2 temuan lama hilang, 1 temuan baru muncul
  const bad = "  tombol.addEventListener('click', () => {{\n";
  const broke = [['e', 1000, at, 0, bad], ['r', 2000, 0, 0, 3, 'x']];
  assert.ok(lib.lintDoc(lib.finalTextOf(sc.code, broke)).length <= lib.lintDoc(sc.code).length, 'jumlah temuan tidak naik');
  assert.equal(lib.computeMetrics({ ...input, events: broke }).domino, 1);
  // diperbaiki sebelum sesi berakhir: tidak ada tambahan
  const mended = [...broke, ['e', 3000, at + bad.length - 2, 1, '']];
  assert.equal(lib.computeMetrics({ ...input, events: mended }).domino, 1);
  // perbaikan yang benar tidak pernah dihitung sebagai kerusakan
  const good = [['e', 1000, at, 0, "  tombol.addEventListener('click', () => {\n"], ['r', 2000, 0, 1, 3, '']];
  assert.equal(lib.computeMetrics({ ...input, events: good }).domino, 0);
  // kerusakan yang tidak pernah di-Jalankan tetap tertangkap di kode akhir
  assert.equal(lib.computeMetrics({ ...input, events: broke.slice(0, 1) }).domino, 1);
  assert.equal(lib.computeMetrics({ ...input, events: [] }).domino, 0);
  assert.equal(lib.computeMetrics({ initial: sc.code, durationMs: 60_000, trapLines: [], events: broke }).domino, 0, 'tanpa pemeriksa → 0');
});

test('efek domino: solusi resmi tiap skenario tidak memunculkan temuan baru di langkah mana pun', () => {
  for (const sc of lib.TRAP_SCENARIOS) {
    // terapkan perbaikan satu per satu dalam setiap urutan; tiap langkah di-Jalankan
    const fixes = sc.traps.map((t) => t.id);
    const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((r) => [x, ...r])));
    for (const order of perms(fixes)) {
      let code = sc.code;
      const events = [];
      let t = 1000;
      for (const id of order) {
        // cari suntingan minimal yang membuat jebakan `id` dianggap beres: ambil dari solusi
        const next = applyFix(sc, code, id);
        const d = lib.diffEdit(code, next);
        assert.ok(d, `${sc.id}/${id} menghasilkan suntingan`);
        events.push(['e', t, d.pos, d.del, d.ins], ['r', t + 500, 0, 0, 3, '']);
        code = next;
        t += 1000;
      }
      assert.equal(code, sc.solution, `${sc.id}: semua perbaikan = solusi`);
      const m = lib.computeMetrics({ initial: sc.code, events, durationMs: 60_000, trapLines: [], lint: lib.lintKeys });
      assert.equal(m.domino, 0, `${sc.id} urutan ${order.join(' → ')}`);
    }
  }
});

test('metrik: salah sasaran mengikuti pergeseran baris jebakan', () => {
  /* jebakan di baris 2; tiap baris baru di atasnya menggeser jebakan satu baris ke bawah.
     Suntingan 1: baris 1, jebakan di 2 → tepat (±1). Suntingan 2 dan 3: baris 1, jebakan
     sudah di 3 lalu 4 → salah sasaran. Suntingan 4: baris 4 = baris jebakan → tepat. */
  const events = [
    ['e', 1000, 0, 0, '\n'], ['n', 1500],
    ['e', 2000, 0, 0, '\n'], ['n', 2500],
    ['e', 3000, 0, 0, 'z'], ['n', 3500],
    ['e', 4000, 7, 0, 'k'],
  ];
  const m = lib.computeMetrics({ ...base, events });
  assert.equal(m.editBursts, 4);
  assert.equal(m.offTargetBursts, 2);
});

test('metrik: upaya tempel dan keluar fokus terhitung', () => {
  const m = lib.computeMetrics({ ...base, events: [['x', 100, 'paste'], ['x', 200, 'drop'], ['x', 300, 'replace'], ['b', 400, 9000]] });
  assert.equal(m.pasteAttempts, 2);
  assert.equal(m.rejectedInserts, 1);
  assert.equal(m.blurCount, 1);
  assert.equal(m.blurMs, 9000);
  assert.equal(m.firstActionMs, null);
  assert.equal(m.freezes, 0);
});

test('diffEdit memakai posisi kursor pada karakter berulang', () => {
  assert.deepEqual(lib.diffEdit('aa', 'aaa', 2), { pos: 1, del: 0, ins: 'a' });
  assert.deepEqual(lib.diffEdit('aaa', 'aa', 1), { pos: 1, del: 1, ins: '' });
  assert.deepEqual(lib.diffEdit('abc', 'aXc'), { pos: 1, del: 1, ins: 'X' });
  assert.equal(lib.diffEdit('abc', 'abc'), null);
});

test('finalTextOf dan buildReplay merekonstruksi sesi', () => {
  const events = [...typing(1000, 3, '!?'), ['e', 9000, 4, 1, ''], ['r', 9500, 0, 3, 3, '']];
  assert.equal(lib.finalTextOf('abc', events), 'abc!');
  const rp = lib.buildReplay(events, 180_000);
  assert.equal(rp.frames.length, 4);
  assert.equal(rp.frames[2].freezeMs, 7850);
  assert.ok(rp.frames[2].at - rp.frames[1].at >= 700, 'beku ditahan agar terbaca');
  assert.ok(rp.totalMs >= 10_000 && rp.totalMs < 16_000);
  let text = 'abc';
  for (const f of rp.frames) if (f.kind === 'edit') text = lib.applyEdit(text, f.pos, f.del, f.ins);
  assert.equal(text, 'abc!');
});

test('buildReplay memakai definisi beku yang sama dengan computeMetrics', () => {
  // 12 dtk membaca di awal BUKAN beku; klik di detik 21 memutus jeda; ekor 9 dtk dihitung
  const events = [['e', 12000, 0, 0, 'a'], ['e', 12300, 1, 0, 'b'], ['n', 21000], ['e', 23000, 2, 0, 'c'], ['x', 30000, 'paste']];
  const rp = lib.buildReplay(events, 32_000);
  assert.deepEqual(rp.frames.map((f) => f.freezeMs), [0, 0, 8700]);
  assert.equal(rp.tailFreezeMs, 9000);
  const m = lib.computeMetrics({ initial: '', events, durationMs: 32_000, trapLines: [] });
  assert.equal(m.freezes, rp.frames.filter((f) => f.freezeMs > 0).length + (rp.tailFreezeMs > 0 ? 1 : 0));
  assert.equal(m.firstActionMs, 12000);
});

test('outcomeOf: pulih, sebagian, gagal', () => {
  assert.equal(lib.outcomeOf(4, 4, true), 'pulih');
  assert.equal(lib.outcomeOf(4, 4, false), 'sebagian');
  assert.equal(lib.outcomeOf(2, 4, false), 'sebagian');
  assert.equal(lib.outcomeOf(1, 4, false), 'gagal');
});

/* ----------------------------------------------------------- penyimpanan */

test('normalizeAiTrap: data lama/rusak aman, rekaman hanya untuk percobaan terbaru', () => {
  assert.equal(lib.normalizeAiTrap(undefined), undefined);
  assert.equal(lib.normalizeAiTrap('x'), undefined);
  assert.deepEqual(lib.normalizeAiTrap({ attempts: 'x' }), { attempts: [], deferred: undefined });
  const mk = (i) => ({ id: `a${i}`, at: i, scenarioId: 'keranjang', metrics: {}, fixed: [], log: [['n', 1]] });
  const st = lib.normalizeAiTrap({ attempts: [{ bad: true }, ...Array.from({ length: 13 }, (_, i) => mk(i))], deferred: true });
  assert.equal(st.attempts.length, lib.MAX_ATTEMPTS);
  assert.equal(st.attempts[0].id, 'a3');
  assert.equal(st.attempts.filter((a) => a.log).length, lib.MAX_LOGGED_ATTEMPTS);
  assert.ok(st.attempts.at(-1).log);
  assert.equal(st.attempts[0].log, undefined);
  assert.equal(st.deferred, true);
});

test('angka pembanding AI selalu membawa asumsinya', () => {
  assert.ok(lib.AI_BENCHMARK.basis.length > 40);
  assert.ok(lib.AI_BENCHMARK.costCeilingRp > 0);
});
