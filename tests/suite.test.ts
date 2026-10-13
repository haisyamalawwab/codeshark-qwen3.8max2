/* Tes logika murni: kurikulum 16 pertemuan, sistem Quest·Drill·Juggling, progres, dan highlighter.
   Dijalankan oleh `npm test` (scripts/test.mjs) — tanpa browser. */
import { CURRICULUM } from "../src/data/curriculum";
import { DRILLS, TUGAS_PERTEMUAN, PASS_ACC, LESSON_LANG, getSession, allQuestIds, juggleSource, interleave, questId } from "../src/data/quests";
import { meetingLevel, meetingUnlocked, applyAttempt, sessionPassed } from "../src/lib/progress";
import { defaultSave, type SaveData } from "../src/lib/storage";
import { tokenize, tokenizeLine } from "../src/lib/highlight";

let pass = 0;
let fail = 0;
const failures: string[] = [];
function check(name: string, cond: boolean, detail = "") {
  if (cond) pass++;
  else { fail++; failures.push(`${name}${detail ? ` — ${detail}` : ""}`); }
}

/* ---- kurikulum & sesi ---- */
check("16 pertemuan", CURRICULUM.length === 16, `got ${CURRICULUM.length}`);
check("48 sesi (quest/drill/juggle)", allQuestIds().length === 48);

for (let no = 1; no <= 16; no++) {
  check(`P${no} punya DRILLS`, Array.isArray(DRILLS[no]) && DRILLS[no].length > 0);
  check(`P${no} punya TUGAS_PERTEMUAN`, !!TUGAS_PERTEMUAN[no]?.quest && !!TUGAS_PERTEMUAN[no]?.tugas);
  check(`P${no} bahasa terdefinisi`, !!LESSON_LANG[no]);
  for (const k of ["quest", "drill", "juggle"] as const) {
    const s = getSession(questId(no, k));
    check(`P${no} ${k} tersedia`, !!s, "getSession null");
    if (!s) continue;
    check(`P${no} ${k} passAcc`, s.passAcc === PASS_ACC[k], `${s.passAcc}`);
    check(`P${no} ${k} kode tidak kosong`, s.code.trim().length > 0);
  }
  const j = getSession(questId(no, "juggle"))!;
  const expectLen = DRILLS[no].length + (juggleSource(no) !== null ? DRILLS[juggleSource(no)!].length : DRILLS[no].length);
  check(`P${no} juggling = drill dianyam`, j.code.split("\n").length === expectLen,
    `${j.code.split("\n").length} vs ${expectLen}`);
}
check("PASS_ACC sesuai aturan (90/90/85)", PASS_ACC.quest === 90 && PASS_ACC.drill === 90 && PASS_ACC.juggle === 85);
check("interleave a0,b0,a1,b1", interleave(["a0", "a1"], ["b0", "b1"]).join() === "a0,b0,a1,b1");
check("interleave sisa di akhir", interleave(["a0", "a1", "a2"], ["b0"]).join() === "a0,b0,a1,a2");
check("juggle P1 tanpa sumber → urutan balik", juggleSource(1) === null);

/* ---- progres ---- */
const withPassed = (ids: string[]): SaveData => {
  const s = defaultSave();
  for (const id of ids) s.modules[id] = { materiDone: true, quizXp: 0, completions: 1, passed: true };
  return s;
};
const Q = (n: number) => questId(n, "quest"), D = (n: number) => questId(n, "drill"), J = (n: number) => questId(n, "juggle");

check("level 0 tanpa lulus", meetingLevel(defaultSave(), 1) === 0);
check("Perunggu = quest lulus", meetingLevel(withPassed([Q(1)]), 1) === 1);
check("Perak = quest+drill lulus", meetingLevel(withPassed([Q(1), D(1)]), 1) === 2);
check("Emas = ketiganya lulus", meetingLevel(withPassed([Q(1), D(1), J(1)]), 1) === 3);
check("drill tanpa quest bukan Perak", meetingLevel(withPassed([D(1)]), 1) === 0);
check("P1 selalu terbuka", meetingUnlocked(defaultSave(), 1));
check("P2 terkunci tanpa Perak P1", !meetingUnlocked(withPassed([Q(1)]), 2));
check("P2 terbuka setelah Perak P1", meetingUnlocked(withPassed([Q(1), D(1)]), 2));
check("sessionPassed false default", !sessionPassed(defaultSave(), Q(1)));

const qSess = getSession(Q(1))!;
const ok = applyAttempt(undefined, qSess, { won: true, accuracy: 90, stars: 3, score: 100, wpm: 40 }, 50, 5);
check("lulus pada ambang 90%", ok.passed === true);
const fail89 = applyAttempt(undefined, qSess, { won: true, accuracy: 89, stars: 2, score: 80, wpm: 40 }, 50, 5);
check("gagal di bawah 90%", fail89.passed === false);
const first = applyAttempt(undefined, qSess, { won: true, accuracy: 95, stars: 3, score: 100, wpm: 40 }, 50, 5);
const again = applyAttempt(first.next, qSess, { won: true, accuracy: 95, stars: 3, score: 100, wpm: 40 }, 50, 5);
check("anti-farm XP: sesi ulang sama → 0", again.xpAward === 0, `${again.xpAward}`);
const better = applyAttempt(first.next, qSess, { won: true, accuracy: 96, stars: 3, score: 120, wpm: 40 }, 80, 5);
check("XP hanya selisih di atas terbaik", better.xpAward === 30, `${better.xpAward}`);

/* ---- highlighter ---- */
const sample = "<h1>Halo, Dunia!</h1>\n  <p class=\"x\">ok</p>";
const toks = tokenize(sample, "html");
check("tokenize: jumlah baris", toks.length === 2);
check("tokenize: teks utuh", toks.map((l) => l.map((c) => c.ch).join("")).join("\n") === sample);
check("tokenize: cache mengembalikan referensi sama", tokenize(sample, "html") === toks);
check("tokenize: lang berbeda → hasil berbeda", tokenize(sample, "css") !== toks);
const jsLine = "const x = 42; // hi";
check("tokenizeLine: js utuh", tokenizeLine(jsLine, "js").map((c) => c.ch).join("") === jsLine);

console.log(`\nTest: ${pass} lulus, ${fail} gagal`);
if (fail) {
  for (const f of failures) console.log("  ✗ " + f);
  process.exitCode = 1;
}
