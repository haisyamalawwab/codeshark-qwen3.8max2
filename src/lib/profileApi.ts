/* Klien /api/profile & /api/membership (TiDB Cloud via server).
   Env-Gated Graceful Fallback: endpoint tidak siap (mode lokal, skema
   002 belum dimigrasi, belum login, offline) → fungsi mengembalikan
   null dan UI memakai data lokal (localStorage). Tidak pernah melempar. */

import { accessToken } from "./auth";
import type { MembershipState } from "./storage";

export interface CloudMembership {
  plan: string;
  role: string;
  cohortCode: string | null;
  status: string;
  startedAt: string | null;
  expiresAt: string | null;
  updatedAt: string | null;
}

export interface CloudGamification {
  xp: number;
  coins: number;
  rankName: string;
  games: number;
  wins: number;
  bestWpm: number;
  bestCombo: number;
  keystrokes: number;
  correctKeys: number;
  linesTyped: number;
  streakCurrent: number;
  streakBest: number;
  loginStreakCurrent: number;
  loginStreakBest: number;
  streakTier: number;
  streakMultiplier: number;
  dailyCompleted: number;
  achievementsClaimed: number;
  modulesCompleted: number;
  lastActiveDate: string | null;
  updatedAt: string | null;
}

export interface CloudAchievement {
  id: string;
  progress: number;
  target: number;
  unlockedAt: string | null;
  claimedAt: string | null;
  rewardXp: number;
  rewardCoins: number;
}

export interface CloudBadge {
  id: string;
  source: string;
  tier: string;
  awardedAt: string | null;
}

export interface CloudAttentionDay {
  date: string | null;
  attempts: number;
  sessions: number;
  xpEarned: number;
  coinsEarned: number;
  firstAt: string | null;
  lastAt: string | null;
}

export interface CloudProfile {
  profile: {
    name: string | null;
    ageGroup: string | null;
    email: string | null;
    role: string | null;
    provider: string;
    createdAt: string | null;
    updatedAt: string | null;
  };
  membership: CloudMembership;
  gamification: CloudGamification | null;
  achievements: CloudAchievement[];
  badges: CloudBadge[];
  attention: CloudAttentionDay[];
}

async function authHeaders(): Promise<Record<string, string>> {
  // Sesi Better Auth berjalan via cookie same-origin; token Supabase
  // legacy (login Google lama) dikirim sebagai Bearer bila tersedia.
  const token = await accessToken().catch(() => null);
  return token ? { authorization: `Bearer ${token}` } : {};
}

/** Ambil profil cloud. Null = fitur cloud belum siap → pakai lokal. */
export async function fetchCloudProfile(signal?: AbortSignal): Promise<CloudProfile | null> {
  try {
    const res = await fetch("/api/profile", {
      method: "GET",
      credentials: "include",
      headers: { accept: "application/json", ...(await authHeaders()) },
      signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean } & CloudProfile;
    if (data?.ok !== true || !data.profile || !data.membership) return null;
    return data;
  } catch {
    return null;
  }
}

export type MembershipUpdateResult =
  | { ok: true; membership: CloudMembership }
  | { ok: false; error: string; unavailable?: boolean };

/** Perbarui membership di server. unavailable=true berarti endpoint
 *  cloud belum siap (UI boleh menyimpan pilihan secara lokal). */
export async function updateCloudMembership(input: {
  plan?: string;
  cohortCode?: string | null;
}): Promise<MembershipUpdateResult> {
  try {
    const res = await fetch("/api/membership", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json", accept: "application/json", ...(await authHeaders()) },
      body: JSON.stringify(input),
    });
    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; membership?: CloudMembership; error?: string }
      | null;
    if (res.ok && data?.ok === true && data.membership) {
      return { ok: true, membership: data.membership };
    }
    if (res.status >= 500 || res.status === 404) {
      return { ok: false, error: data?.error ?? "Server membership belum siap.", unavailable: true };
    }
    return { ok: false, error: data?.error ?? `Permintaan ditolak (${res.status}).` };
  } catch {
    return { ok: false, error: "Tidak dapat menghubungi server.", unavailable: true };
  }
}

/** Ubah membership cloud menjadi slice lokal SaveData. */
export function toLocalMembership(m: CloudMembership): MembershipState {
  return {
    plan: m.plan === "kelas" || m.plan === "pro" ? m.plan : "free",
    role: m.role || "peserta",
    cohortCode: m.cohortCode ?? null,
    status: m.status || "active",
    startedAt: m.startedAt ?? null,
    syncedAt: Date.now(),
  };
}

export const PLAN_INFO: Record<string, { label: string; desc: string }> = {
  free: {
    label: "Penjelajah Bebas",
    desc: "Plan bawaan semua kapten: semua misi belajar, XP, badge, dan streak aktif.",
  },
  kelas: {
    label: "Peserta Kelas",
    desc: "Bergabung dengan kode kelas (cohort) dari guru/dosen agar progresmu terbaca sebagai anggota kelas.",
  },
  pro: {
    label: "Kapten Pro",
    desc: "Plan khusus yang diberikan admin/guru. Tidak bisa dipilih sendiri.",
  },
};
