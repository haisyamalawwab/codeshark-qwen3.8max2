/* ============ PROGRES PEMBELAJARAN PER PERTEMUAN ============
   Aturan (sumber tunggal — dipakai App, Pertemuan, MateriHtml, Dashboard):
   • sesi LULUS  = menyelesaikan kode (won) DAN akurasi ≥ Session.passAcc
   • PERUNGGU    = quest pertemuan lulus
   • PERAK       = quest + drill lulus            → membuka pertemuan berikutnya
   • EMAS        = quest + drill + juggling lulus
   • XP/koin     = hanya selisih di atas hasil terbaik sesi (anti-farm)            */

import type { ModProg, SaveData } from "./storage";
import type { Session } from "../data/quests";
import { questId } from "../data/quests";
import { CURRICULUM } from "../data/curriculum";

export type Level = 0 | 1 | 2 | 3;
export const LEVEL_NAME = ["Belum", "Perunggu", "Perak", "Emas"] as const;

export const prog = (save: SaveData, id: string): ModProg | undefined => save.modules[id];

export const sessionPassed = (save: SaveData, id: string): boolean => !!prog(save, id)?.passed;

export function meetingLevel(save: SaveData, no: number): Level {
  const q = sessionPassed(save, questId(no, "quest"));
  const d = sessionPassed(save, questId(no, "drill"));
  const j = sessionPassed(save, questId(no, "juggle"));
  if (q && d && j) return 3;
  if (q && d) return 2;
  if (q) return 1;
  return 0;
}

/** pertemuan 1 selalu terbuka; lainnya terbuka bila pertemuan sebelumnya minimal PERAK */
export function meetingUnlocked(save: SaveData, no: number): boolean {
  if (no <= 1) return true;
  return meetingLevel(save, no - 1) >= 2;
}

export const totalMeetings = (): number => CURRICULUM.length;

/** hitung ulang progres sesi setelah satu percobaan (tanpa mengubah state di sini) */
export function applyAttempt(
  prev: ModProg | undefined,
  s: Session,
  r: { won: boolean; accuracy: number; stars: number; score: number; wpm: number },
  xpSession: number,
  coinsSession: number,
) {
  const p: ModProg = prev ?? { materiDone: true, quizXp: 0, completions: 0 };
  const passed = r.won && r.accuracy >= s.passAcc;
  const xpBest = p.xpBest ?? 0;
  const coinsBest = p.coinsBest ?? 0;
  const xpAward = Math.max(0, xpSession - xpBest);
  const coinsAward = Math.max(0, coinsSession - coinsBest);
  const better =
    !p.best || r.stars > p.best.stars || (r.stars === p.best.stars && r.score > p.best.score);
  const next: ModProg = {
    ...p,
    completions: p.completions + (r.won ? 1 : 0),
    passed: !!p.passed || passed,
    xpBest: Math.max(xpBest, xpSession),
    coinsBest: Math.max(coinsBest, coinsSession),
    best: better ? { stars: r.stars, score: r.score, accuracy: r.accuracy, wpm: r.wpm } : p.best,
  };
  return { next, passed, xpAward, coinsAward };
}
