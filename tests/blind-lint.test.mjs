import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

/* Pemeriksa sintaks Blind Live-Coding Challenge (docs/052 bagian 6.1 dan 11).
   TypeScript murni tanpa DOM; dibundel dengan esbuild seperti tests/ai-trap.test.mjs. */

let lib;
let folder;

before(async () => {
  const { build } = await import('esbuild');
  await mkdir('.cache', { recursive: true });
  folder = await mkdtemp('.cache/blind-lint-');
  const outfile = `${folder}/blind-lint.mjs`;
  await build({
    stdin: {
      contents: `
        export * from './src/lib/blindLint.ts';
        export * from './src/data/blindChallenges.ts';
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

const codes = (r) => r.errors.map((e) => e.code);

test('kode yang benar menghasilkan nol temuan dan nol titik koma terlewat', () => {
  const doc = `<button id="btn">Klik</button>\n<style>\nbutton { padding: 8px; color: white; }\n</style>\n<script>\nlet n = 0;\nfunction tambah() {\n  n += 1;\n}\n</script>\n`;
  const r = lib.lintBlind(doc);
  assert.deepEqual(r.errors, []);
  assert.equal(r.missingJsSemicolons, 0);
});

test('kode kosong: tidak ada temuan', () => {
  assert.deepEqual(lib.lintBlind(''), { errors: [], missingJsSemicolons: 0 });
});

test('`{` tak ditutup dan `}` berlebih', () => {
  assert.deepEqual(codes(lib.lintBlind('<script>\nfunction a() {\n  return 1;\n</script>')), ['unclosed-bracket']);
  assert.deepEqual(codes(lib.lintBlind('<script>\nlet a = 1;\n}\n</script>')), ['stray-closer']);
});

test('tag bersilang dan tag tanpa pembuka', () => {
  const crossed = lib.lintBlind('<div><p>Halo</div></p>');
  assert.ok(codes(crossed).includes('html-unclosed-tag'));
  assert.ok(codes(crossed).includes('html-stray-close'));
  assert.deepEqual(codes(lib.lintBlind('<p>Halo</p></div>')), ['html-stray-close']);
});

test('`<` tanpa `>`', () => {
  assert.deepEqual(codes(lib.lintBlind('<p id="a"\n')), ['html-dangling-lt']);
});

test('CSS: deklarasi tanpa `;` di antara dua deklarasi, tanpa `:`, dan aturan tanpa selektor', () => {
  assert.deepEqual(codes(lib.lintBlind('<style>\nbutton {\n  padding: 8px\n  color: white;\n}\n</style>')), ['css-missing-semicolon']);
  assert.deepEqual(codes(lib.lintBlind('<style>\nbutton { padding 8px; }\n</style>')), ['css-missing-colon']);
  const noSel = lib.lintBlind('<style>\n{ color: red; }\n</style>');
  assert.deepEqual(codes(noSel), ['css-no-selector']);
  assert.equal(noSel.errors[0].line, 2);
  /* deklarasi TERAKHIR tanpa `;` sah di CSS */
  assert.deepEqual(codes(lib.lintBlind('<style>\nbutton { padding: 8px; color: white }\n</style>')), []);
});

test('kutip tak ditutup', () => {
  assert.deepEqual(codes(lib.lintBlind('<script>\nconst a = "abc;\n</script>')), ['unclosed-string']);
  assert.deepEqual(codes(lib.lintBlind('<p id="a>Halo</p>')), ['html-attr-quote']);
});

test('`;` hilang di JS masuk "titik koma terlewat", bukan syntax error', () => {
  const r = lib.lintBlind('<script>\nlet n = 0\nfunction tambah() {\n  n += 1\n}\n</script>');
  assert.deepEqual(r.errors, []);
  assert.equal(r.missingJsSemicolons, 2);
});

test('titik koma terlewat: kepala blok, baris lanjutan, dan isi string tidak dihitung', () => {
  assert.equal(lib.countMissingJsSemicolons('if (n > 0)\n{\n  n = 1;\n}\n'), 0);
  assert.equal(lib.countMissingJsSemicolons('const a = [\n  1,\n  2\n];\n'), 0);
  assert.equal(lib.countMissingJsSemicolons('const s = teks\n  .trim();\n'), 0);
  assert.equal(lib.countMissingJsSemicolons('const s = "a\\nb";\n// komentar tanpa titik koma\n'), 0);
  assert.equal(lib.countMissingJsSemicolons('n++\nreturn n\n'), 2);
});

test('pemeriksa akhir JS menangkap kode yang lolos pindaian tetapi tidak bisa diurai', () => {
  const r = lib.lintBlind('<script>\nlet n = ;\n</script>');
  assert.deepEqual(codes(r), ['js-parse']);
  assert.equal(r.errors[0].line, 2);
  assert.equal(r.errors[0].region, 'js');
  /* tidak menggandakan temuan bila pindaian sendiri sudah melihat masalah di JS */
  assert.deepEqual(codes(lib.lintBlind('<script>\nfunction a() {\n</script>')), ['unclosed-bracket']);
  assert.equal(lib.jsParseError(''), null);
  assert.equal(lib.jsParseError('let a = 1;'), null);
});

test('pemeriksa akhir JS tidak menjalankan kode', () => {
  globalThis.__blindRan = false;
  lib.lintBlind('<script>\nglobalThis.__blindRan = true;\n</script>');
  assert.equal(globalThis.__blindRan, false);
  delete globalThis.__blindRan;
});

test('blok yang sedang ditulis saat waktu habis ditandai "belum ditutup"', () => {
  const code = '<p id="a">0</p>\n<script>\nlet n = 0;\nfunction tambah() {\n  n += 1;';
  const timed = lib.lintBlind(code, { timedOut: true, lastEditPos: code.length });
  assert.ok(timed.errors.length >= 2);
  assert.ok(timed.errors.every((e) => e.unfinished === true), JSON.stringify(timed.errors));
  /* sesi diakhiri sendiri: kesalahan biasa */
  const manual = lib.lintBlind(code, { timedOut: false, lastEditPos: code.length });
  assert.ok(manual.errors.every((e) => !e.unfinished));
});

test('kesalahan di bagian yang sudah ditinggalkan tidak ikut ditandai "belum ditutup"', () => {
  const code = '<p id="a">0\n<style>\nbutton { padding: 8px;\n</style>\n<script>\nfunction tambah() {\n  n += 1;';
  const r = lib.lintBlind(code, { timedOut: true, lastEditPos: code.length });
  const by = (c, region) => r.errors.find((e) => e.code === c && e.region === region);
  assert.equal(by('unclosed-bracket', 'js').unfinished, true);
  assert.ok(!by('unclosed-bracket', 'css').unfinished, 'kurung CSS ditinggalkan');
  const p = r.errors.find((e) => e.code === 'html-unclosed-tag' && e.message.includes('<p>'));
  assert.ok(p && !p.unfinished, '<p> ditinggalkan');
  const script = r.errors.find((e) => e.code === 'html-unclosed-tag' && e.message.includes('<script>'));
  assert.equal(script.unfinished, true);
});

/* ------------------------------------------------------------------ soal */

test('tiga soal; tiap jawaban acuan 170–250 karakter, bebas temuan, dan memenuhi semua tuntutan', () => {
  assert.equal(lib.BLIND_BRIEFS.length, 3);
  for (const b of lib.BLIND_BRIEFS) {
    const len = b.reference.trim().length;
    assert.ok(len >= 170 && len <= 250, `${b.id}: ${len} karakter`);
    assert.deepEqual(lib.lintBlind(b.reference), { errors: [], missingJsSemicolons: 0 }, b.id);
    assert.deepEqual(lib.checkBlindSpec(b, b.reference), b.demands.map((d) => d.id), b.id);
    assert.equal(b.demands.length, 4);
  }
});

test('tiap soal memunculkan < > { } dan ; sekaligus', () => {
  for (const b of lib.BLIND_BRIEFS) for (const ch of '<>{};') assert.ok(b.reference.includes(ch), `${b.id} tanpa ${ch}`);
});

test('kode kosong atau jawaban soal lain tidak memenuhi tuntutan', () => {
  const [a, b] = lib.BLIND_BRIEFS;
  assert.deepEqual(lib.checkBlindSpec(a, ''), []);
  assert.deepEqual(lib.checkBlindSpec(a, b.reference), []);
});

test('cek spesifikasi menerima bentuk yang setara', () => {
  const b = lib.getBlindBrief('penghitung');
  const alt = `<BUTTON id='btn'> Klik </BUTTON>\n<p id=angka>0</p>\n<style>\n#btn{color:#FFF;padding:8px}\n</style>\n<script>\nvar n=0\nconst tambah = () => n++\n</script>`;
  assert.deepEqual(lib.checkBlindSpec(b, alt), ['tombol', 'angka', 'gaya', 'fungsi']);
  const expr = `<script>\nlet n = 0;\nconst tambah = function () { n = n + 1; };\n</script>`;
  assert.deepEqual(lib.checkBlindSpec(b, expr), ['fungsi']);
});

test('cek spesifikasi menolak yang hampir benar', () => {
  const b = lib.getBlindBrief('penghitung');
  const wrong = `<button id="tombol">Klik</button>\n<p id="angka">1</p>\n<style>\nbutton { padding: 8px; }\n</style>\n<script>\nlet n = 0;\nfunction tambah() { n -= 1; }\n</script>`;
  assert.deepEqual(lib.checkBlindSpec(b, wrong), []);
  /* fungsi yang hanya disebut di komentar atau string tidak dihitung */
  const fake = `<script>\nlet n = 0;\n// function tambah() { n += 1; }\n</script>`;
  assert.deepEqual(lib.checkBlindSpec(b, fake), []);
});

test('soal Kartu Sapaan dan Daftar Tugas Mini: bentuk setara diterima', () => {
  const s = lib.getBlindBrief('sapaan');
  const sAlt = `<div class="kartu besar"><h2>Halo</h2></div><p id="nama">Tamu</p>\n<style>.kartu{background-color:#000;padding:12px}</style>\n<script>let salam='Hai';const sapa = n => n + salam;</script>`;
  assert.deepEqual(lib.checkBlindSpec(s, sAlt), ['kartu', 'nama', 'gaya', 'fungsi']);
  const t = lib.getBlindBrief('tugas');
  const tAlt = `<ul id="daftar"><li>Latihan</li><li>Belajar</li></ul><button id="selesai">Selesai</button>\n<style>ul li{color:green;margin:4px}</style>\n<script>let sisa = 2;function kurangi(){ sisa--; }</script>`;
  assert.deepEqual(lib.checkBlindSpec(t, tAlt), ['daftar', 'tombol', 'gaya', 'fungsi']);
});

test('pemilihan soal: tidak mengulang varian sesi sebelumnya', () => {
  for (const b of lib.BLIND_BRIEFS) {
    for (const r of [0, 0.34, 0.67, 0.999]) assert.notEqual(lib.pickBlindBrief(b.id, () => r).id, b.id);
  }
  assert.ok(lib.pickBlindBrief(null, () => 0));
  assert.ok(lib.pickBlindBrief('tidak-ada', () => 0.999));
});

/* ---------------------------------------------------------------- gerbang */

test('gerbang: wajib sekali untuk Mahasiswa/Umum di perangkat berkeyboard', () => {
  const save = (age, blind) => ({ profile: { name: 'A', age, sound: true, createdAt: 0 }, blind });
  assert.equal(lib.needsBlindGate(save('academy'), false), true);
  assert.equal(lib.needsBlindGate(save('academy'), true), false, 'tanpa keyboard fisik: ditunda');
  assert.equal(lib.needsBlindGate(save('academy', { attempts: [], deferred: true }), false), false);
  assert.equal(lib.needsBlindGate(save('academy', { attempts: [{}] }), false), false, 'sudah punya rapor');
  for (const age of ['junior', 'teen', 'senior']) assert.equal(lib.needsBlindGate(save(age), false), false, age);
  assert.equal(lib.needsBlindGate({ profile: null }, false), false);
});

test('kartu Dashboard: Mahasiswa/Umum dan 16–19 tahun saja', () => {
  assert.equal(lib.blindVisibleFor('academy'), true);
  assert.equal(lib.blindVisibleFor('senior'), true);
  assert.equal(lib.blindVisibleFor('junior'), false);
  assert.equal(lib.blindVisibleFor('teen'), false);
  assert.equal(lib.blindVisibleFor(undefined), false);
});
