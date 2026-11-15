/* ============ PENYUSUN RAPOR BLIND ============
   Menggabungkan tiga pengukur menjadi satu BlindAttempt: metrik ketikan
   (blindMetrics), pemeriksa sintaks (blindLint), dan cek spesifikasi soal
   (data/blindChallenges). Fungsi murni: log ketikan masuk, agregat keluar.
   Log itu sendiri TIDAK ikut ke hasil (docs/052 bagian 8.3). */
import type { TrapEvent } from "./trapMetrics";
import type { BlindAttempt } from "./blindMetrics";
import { blindLevel, computeBlindMetrics, writingWpm, BLIND_LIMIT_MS, MAX_BLIND_CODE_CHARS } from "./blindMetrics";
import { lintBlind } from "./blindLint";
import type { BlindBrief } from "../data/blindChallenges";
import { checkBlindSpec } from "../data/blindChallenges";

export function buildBlindAttempt(input: {
  brief: BlindBrief; code: string; events: TrapEvent[]; durationMs: number;
  endedBy: BlindAttempt["endedBy"]; confidence?: number; id: string; at: number;
}): BlindAttempt {
  const { brief, code, events, durationMs, endedBy } = input;
  const m = computeBlindMetrics(events, durationMs);
  const lint = lintBlind(code, { timedOut: endedBy === "timeout", lastEditPos: m.lastEditPos });
  const specMet = checkBlindSpec(brief, code);
  const chars = code.trim().length;
  const confidence = input.confidence && input.confidence >= 1 && input.confidence <= 5
    ? (Math.round(input.confidence) as BlindAttempt["confidence"])
    : undefined;
  return {
    id: input.id,
    at: input.at,
    briefId: brief.id,
    durationSec: Math.round(durationMs / 100) / 10,
    limitSec: BLIND_LIMIT_MS / 1000,
    endedBy,
    chars,
    ...(confidence ? { confidence } : {}),
    baselineMs: m.baselineMs,
    braceHesitations: m.braceHesitations,
    semicolonHesitations: m.semicolonHesitations,
    otherSymbolHesitations: m.otherSymbolHesitations,
    longestBracePauseMs: m.longestBracePauseMs,
    longestSemicolonPauseMs: m.longestSemicolonPauseMs,
    longestSymbolPauseMs: m.longestSymbolPauseMs,
    symbolFumbles: m.symbolFumbles,
    freezes: m.freezes,
    frozenMs: m.frozenMs,
    firstKeyMs: m.firstKeyMs,
    corrections: m.corrections,
    syntaxErrors: lint.errors,
    missingJsSemicolons: lint.missingJsSemicolons,
    specPassed: specMet.length,
    specTotal: brief.demands.length,
    specMet,
    pasteAttempts: m.pasteAttempts,
    rejectedInserts: m.rejectedInserts,
    blurCount: m.blurCount,
    blurMs: m.blurMs,
    wpm: writingWpm(chars, durationMs),
    level: blindLevel({
      syntaxErrors: lint.errors.filter((e) => !e.unfinished).length,
      symbolHesitations: m.braceHesitations + m.semicolonHesitations + m.otherSymbolHesitations,
      frozenMs: m.frozenMs,
      durationMs,
      chars,
    }),
    timeline: m.timeline,
    pauseMarks: m.pauseMarks,
    freezeSpans: m.freezeSpans,
    code: code.slice(0, MAX_BLIND_CODE_CHARS),
  };
}
