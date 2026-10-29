/* Halaman Profil & Membership.
   Sumber data berlapis (Env-Gated Graceful Fallback):
   1) Save lokal (selalu tersedia, paling segar) — profil, XP, streak,
      achievement, dan atensi dari riwayat perangkat.
   2) Cloud (/api/profile di TiDB + sesi Better Auth/Layerbase) bila
      siap — membership resmi, snapshot gamifikasi tersimpan, badge,
      dan atensi harian dari database. Bila cloud belum siap halaman
      tetap berfungsi penuh dari data lokal. */

import { useEffect, useMemo, useState } from "react";
import type { AgeId, MembershipState, SaveData } from "../lib/storage";
import { evaluateStreak, getLocalDateString, rankOf } from "../lib/storage";
import { AGE_GROUPS, type AgeCfg } from "../data/modules";
import { getAllAchievementsWithStatus, getAchievementSummary, TIER_CONFIG } from "../lib/achievements";
import { getPermanentStreakTier, STREAK_MULTIPLIER_TIERS } from "../lib/streakMultiplier";
import { loadHistory } from "../lib/history";
import { lastSyncAt } from "../lib/sync";
import { currentBetterAuthUser, currentUser, type AuthUser } from "../lib/auth";
import { fetchDatabaseStatus, type DatabaseStatus } from "../lib/databaseStatus";
import {
  fetchCloudProfile,
  updateCloudMembership,
  toLocalMembership,
  PLAN_INFO,
  type CloudProfile,
} from "../lib/profileApi";
import { sfx } from "../lib/audio";
import { CaptainAvatar } from "../characters";
import RankEmblemArt from "./RankEmblemArt";
import {
  IconArrowL, IconAward, IconBolt, IconCalendar, IconCheck, IconCoin,
  IconDatabase, IconFlame, IconKeyboard, IconMedal, IconMute, IconSound,
  IconSparkles, IconTarget, IconTimer, IconTrophy,
} from "./icons";

interface Props {
  save: SaveData;
  cfg: AgeCfg;
  onBack: () => void;
  onUpdateProfile: (name: string, age: AgeId) => void;
  onToggleSound: () => void;
  onUpdateMembership: (membership: MembershipState) => void;
}

interface AttentionDay {
  date: string;
  attempts: number;
  xp: number;
}

const fmtDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};
const fmtDay = (date: string) => {
  const d = new Date(`${date}T00:00:00`);
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
};

/** Atensi lokal 14 hari terakhir dari riwayat attempts perangkat. */
function localAttention(): AttentionDay[] {
  const byDate = new Map<string, AttentionDay>();
  for (const rec of loadHistory()) {
    const date = getLocalDateString(rec.at);
    const row = byDate.get(date) ?? { date, attempts: 0, xp: 0 };
    row.attempts += 1;
    row.xp += rec.xpAward || 0;
    byDate.set(date, row);
  }
  const days: AttentionDay[] = [];
  for (let i = 13; i >= 0; i--) {
    const date = getLocalDateString(Date.now() - i * 86400000);
    days.push(byDate.get(date) ?? { date, attempts: 0, xp: 0 });
  }
  return days;
}

export default function ProfilePage({ save, cfg, onBack, onUpdateProfile, onToggleSound, onUpdateMembership }: Props) {
  const profile = save.profile!;
  const membership: MembershipState = save.membership ?? { plan: "free", role: "peserta", cohortCode: null, status: "active" };
  const rank = rankOf(save.xp);
  const streakStatus = evaluateStreak(save.streak);
  const multiplierTier = getPermanentStreakTier(save);
  const summary = useMemo(() => getAchievementSummary(save), [save]);
  const statuses = useMemo(() => getAllAchievementsWithStatus(save), [save]);
  const claimedBadges = useMemo(
    () => statuses.filter((s) => s.isClaimed).sort((a, b) => (b.claimedAt ?? 0) - (a.claimedAt ?? 0)).slice(0, 8),
    [statuses],
  );
  const modulesDone = useMemo(
    () => Object.values(save.modules).filter((m) => m.completions > 0).length,
    [save.modules],
  );

  const [account, setAccount] = useState<AuthUser | null>(null);
  const [cloud, setCloud] = useState<CloudProfile | null>(null);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [nameInput, setNameInput] = useState(profile.name);
  const [ageInput, setAgeInput] = useState<AgeId>(profile.age);
  const [cohortInput, setCohortInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "warn" | "error"; text: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      const user = (await currentBetterAuthUser().catch(() => null)) ?? (await currentUser().catch(() => null));
      if (!controller.signal.aborted) setAccount(user);
    })();
    void fetchCloudProfile(controller.signal).then((data) => {
      if (controller.signal.aborted || !data) return;
      setCloud(data);
      // Membership cloud adalah sumber kebenaran; segarkan cache lokal.
      onUpdateMembership(toLocalMembership(data.membership));
    });
    void fetchDatabaseStatus(controller.signal)
      .then((status) => { if (!controller.signal.aborted) setDbStatus(status); })
      .catch(() => { /* status tidak tersedia — panel memakai fallback */ });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const attention: AttentionDay[] = useMemo(() => {
    if (cloud?.attention?.length) {
      const byDate = new Map(cloud.attention.filter((d) => d.date).map((d) => [d.date as string, d]));
      const days: AttentionDay[] = [];
      for (let i = 13; i >= 0; i--) {
        const date = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
        const row = byDate.get(date);
        days.push({ date, attempts: row?.attempts ?? 0, xp: row?.xpEarned ?? 0 });
      }
      return days;
    }
    return localAttention();
  }, [cloud]);
  const attentionMax = Math.max(1, ...attention.map((d) => d.attempts));
  const activeDays = attention.filter((d) => d.attempts > 0).length;

  const applyMembershipLocally = (next: MembershipState, text: string) => {
    onUpdateMembership({ ...next, syncedAt: undefined });
    setMessage({ kind: "warn", text });
  };

  const changeMembership = async (input: { plan?: string; cohortCode?: string | null }, localNext: MembershipState) => {
    setBusy(true);
    setMessage(null);
    try {
      const result = await updateCloudMembership(input);
      if (result.ok) {
        onUpdateMembership(toLocalMembership(result.membership));
        setMessage({ kind: "ok", text: "Membership tersimpan di database cloud (TiDB)." });
        sfx.win();
      } else if (result.unavailable) {
        applyMembershipLocally(localNext, "Cloud belum siap — pilihan disimpan di perangkat ini dan akan disinkronkan saat database tersedia.");
      } else {
        setMessage({ kind: "error", text: result.error });
      }
    } finally {
      setBusy(false);
    }
  };

  const joinClass = () => {
    const code = cohortInput.trim().toUpperCase();
    if (!/^[A-Z0-9][A-Z0-9-]{3,31}$/.test(code)) {
      setMessage({ kind: "error", text: "Kode kelas tidak valid (4–32 karakter: huruf, angka, '-')." });
      return;
    }
    void changeMembership(
      { cohortCode: code },
      { ...membership, cohortCode: code, plan: membership.plan === "pro" ? "pro" : "kelas" },
    );
    setCohortInput("");
  };

  const leaveClass = () => {
    void changeMembership(
      { cohortCode: null },
      { ...membership, cohortCode: null, plan: membership.plan === "kelas" ? "free" : membership.plan },
    );
  };

  const chooseFree = () => {
    void changeMembership({ plan: "free" }, { ...membership, plan: "free" });
  };

  const saveProfileEdits = () => {
    const name = nameInput.trim();
    if (name.length < 2) {
      setMessage({ kind: "error", text: "Nama kapten minimal 2 karakter." });
      return;
    }
    onUpdateProfile(name.slice(0, 24), ageInput);
    setMessage({ kind: "ok", text: "Profil diperbarui. Nama & kelompok usia ikut tersinkron ke database pada sync berikutnya." });
    sfx.click();
  };

  const features = dbStatus?.features;
  const cloudSavedAt = cloud?.gamification?.updatedAt;
  const lastSync = lastSyncAt();

  return (
    <div className="min-h-dvh screen-in">
      <header className="max-w-6xl mx-auto px-4 pt-5 flex items-center gap-3">
        <button type="button" onClick={onBack} className="btn btn-ghost !px-3 !py-2 !rounded-xl inline-flex items-center gap-2 text-sm font-bold">
          <IconArrowL size={16} /> Dashboard
        </button>
        <h1 className="font-display font-extrabold text-xl md:text-2xl text-white">Profil & Membership</h1>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-24 mt-5 space-y-6">
        {/* ======= Identitas & Rank ======= */}
        <section className="hud-hero-card p-6 md:p-8 relative overflow-hidden" aria-labelledby="profil-identitas">
          <div className="flex flex-col md:flex-row gap-6 md:items-center relative z-10">
            <div className="relative shrink-0 mx-auto md:mx-0">
              <CaptainAvatar size={110} className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.65)]" />
              <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[rgba(6,22,38,0.95)] border border-[rgba(255,194,71,0.7)]">
                <RankEmblemArt rank={rank.cur.name} size={34} animated={false} />
              </div>
            </div>
            <div className="flex-1 min-w-0 text-center md:text-left">
              <h2 id="profil-identitas" className="font-display font-extrabold text-3xl text-white">Kapten {profile.name}</h2>
              <p className="text-sm mt-1" style={{ color: "var(--dim)" }}>
                {cfg.label} · {cfg.range} · Kapten sejak {fmtDate(new Date(profile.createdAt).toISOString())}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--dim)" }}>
                {account?.email
                  ? <>Akun: <strong className="text-white">{account.email}</strong>{account.role ? <> · role <strong className="text-white">{account.role}</strong></> : null} · via {account.provider === "email" ? "Better Auth (Layerbase)" : account.provider}</>
                  : "Akun: tamu lokal di perangkat ini (login email untuk sinkronisasi cloud)."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="chip inline-flex items-center gap-1.5"><IconBolt size={14} /> {save.xp.toLocaleString("id-ID")} XP</span>
                <span className="chip inline-flex items-center gap-1.5"><IconCoin size={14} /> {save.coins.toLocaleString("id-ID")} Koin</span>
                <span className="chip inline-flex items-center gap-1.5"><IconTrophy size={14} /> Rank {rank.cur.name}</span>
                <span className="chip inline-flex items-center gap-1.5"><IconFlame size={14} /> Streak {streakStatus.current} hari (terbaik {streakStatus.best})</span>
                <span className="chip inline-flex items-center gap-1.5"><IconSparkles size={14} /> Pengali {multiplierTier.multiplier}× · {multiplierTier.name}</span>
              </div>
              <div className="mt-4 max-w-md mx-auto md:mx-0">
                <div className="flex justify-between text-[11px] font-bold" style={{ color: "var(--dim)" }}>
                  <span>{rank.cur.name}</span>
                  <span>{rank.next ? `${rank.pct}% menuju ${rank.next.name}` : "Rank tertinggi"}</span>
                </div>
                <div className="h-2.5 rounded-full mt-1 overflow-hidden" style={{ background: "rgba(126,196,236,0.15)" }}>
                  <div className="h-full rounded-full" style={{ width: `${rank.pct}%`, background: "linear-gradient(90deg, var(--teal), var(--amber))" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* ======= Edit Profil ======= */}
          <section className="hud-panel p-6" aria-labelledby="profil-edit">
            <h3 id="profil-edit" className="font-display font-extrabold text-lg text-white flex items-center gap-2">
              <IconMedal size={18} /> Edit Profil
            </h3>
            <label className="block mt-4 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--dim)" }} htmlFor="profil-nama">Nama Kapten</label>
            <input
              id="profil-nama"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={24}
              className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white outline-none"
              style={{ background: "rgba(7,24,42,0.8)", border: "1px solid rgba(126,196,236,0.3)" }}
            />
            <label className="block mt-4 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--dim)" }} htmlFor="profil-usia">Kelompok Usia</label>
            <select
              id="profil-usia"
              value={ageInput}
              onChange={(e) => setAgeInput(e.target.value as AgeId)}
              className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white outline-none"
              style={{ background: "rgba(7,24,42,0.8)", border: "1px solid rgba(126,196,236,0.3)" }}
            >
              {Object.values(AGE_GROUPS).map((group) => (
                <option key={group.id} value={group.id}>{group.label} ({group.range})</option>
              ))}
            </select>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button type="button" onClick={saveProfileEdits} className="btn inline-flex items-center gap-2 !px-4 !py-2.5 text-sm font-extrabold" style={{ background: "var(--teal)", color: "#04222b" }}>
                <IconCheck size={15} /> Simpan Profil
              </button>
              <button type="button" onClick={onToggleSound} className="btn btn-ghost inline-flex items-center gap-2 !px-4 !py-2.5 text-sm font-bold">
                {profile.sound ? <IconSound size={15} /> : <IconMute size={15} />} Suara {profile.sound ? "Nyala" : "Mati"}
              </button>
            </div>
          </section>

          {/* ======= Membership ======= */}
          <section className="hud-panel p-6" aria-labelledby="profil-membership">
            <h3 id="profil-membership" className="font-display font-extrabold text-lg text-white flex items-center gap-2">
              <IconAward size={18} /> Membership
            </h3>
            <div className="mt-4 rounded-2xl p-4" style={{ background: "rgba(46,230,200,0.07)", border: "1px solid rgba(46,230,200,0.3)" }}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: "var(--teal)", color: "#04222b" }}>
                  {PLAN_INFO[membership.plan]?.label ?? membership.plan}
                </span>
                <span className="text-xs font-bold" style={{ color: "var(--dim)" }}>role {membership.role ?? "peserta"} · {membership.status ?? "active"}</span>
              </div>
              <p className="text-sm mt-2.5 leading-relaxed" style={{ color: "#c7e6f5" }}>{PLAN_INFO[membership.plan]?.desc}</p>
              <p className="text-xs mt-2" style={{ color: "var(--dim)" }}>
                Member sejak {fmtDate(membership.startedAt ?? (cloud?.membership.startedAt ?? null))}
                {membership.cohortCode ? <> · Kelas: <strong className="text-white">{membership.cohortCode}</strong></> : " · Belum bergabung kelas"}
                {membership.syncedAt ? <> · Tersinkron {new Date(membership.syncedAt).toLocaleString("id-ID")}</> : " · Belum tersinkron ke cloud"}
              </p>
            </div>

            {membership.cohortCode ? (
              <button type="button" disabled={busy} onClick={leaveClass} className="btn btn-ghost mt-4 !px-4 !py-2.5 text-sm font-bold disabled:opacity-50">
                Keluar dari kelas {membership.cohortCode}
              </button>
            ) : (
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: "var(--dim)" }} htmlFor="profil-kohort">
                  Gabung kelas dengan kode dari guru/dosen
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    id="profil-kohort"
                    value={cohortInput}
                    onChange={(e) => setCohortInput(e.target.value.toUpperCase())}
                    placeholder="mis. RPL-2026-A"
                    maxLength={32}
                    className="flex-1 min-w-0 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white outline-none uppercase"
                    style={{ background: "rgba(7,24,42,0.8)", border: "1px solid rgba(126,196,236,0.3)" }}
                  />
                  <button type="button" disabled={busy} onClick={joinClass} className="btn !px-4 !py-2.5 text-sm font-extrabold disabled:opacity-50" style={{ background: "var(--amber)", color: "#2a1a02" }}>
                    Gabung
                  </button>
                </div>
              </div>
            )}

            {membership.plan === "kelas" && (
              <button type="button" disabled={busy} onClick={chooseFree} className="btn btn-ghost mt-3 !px-4 !py-2.5 text-sm font-bold disabled:opacity-50">
                Kembali ke plan Penjelajah Bebas
              </button>
            )}
            <p className="text-[11px] mt-3 leading-relaxed" style={{ color: "var(--faint)" }}>
              Plan <strong>Kapten Pro</strong> dan role guru/admin diberikan oleh admin — tidak bisa dipilih sendiri demi keamanan.
            </p>
          </section>
        </div>

        {message && (
          <p
            role="status"
            className="rounded-2xl px-4 py-3 text-sm font-semibold"
            style={{
              background: message.kind === "ok" ? "rgba(46,230,200,0.1)" : message.kind === "warn" ? "rgba(255,194,71,0.1)" : "rgba(244,63,94,0.12)",
              border: `1px solid ${message.kind === "ok" ? "rgba(46,230,200,0.4)" : message.kind === "warn" ? "rgba(255,194,71,0.4)" : "rgba(244,63,94,0.45)"}`,
              color: "#e8f6ff",
            }}
          >
            {message.text}
          </p>
        )}

        {/* ======= Hasil Gamifikasi ======= */}
        <section className="hud-panel p-6" aria-labelledby="profil-gamifikasi">
          <h3 id="profil-gamifikasi" className="font-display font-extrabold text-lg text-white flex items-center gap-2">
            <IconTarget size={18} /> Hasil Gamifikasi
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              { label: "Total XP", value: save.xp.toLocaleString("id-ID"), icon: <IconBolt size={15} /> },
              { label: "Koin Samudra", value: save.coins.toLocaleString("id-ID"), icon: <IconCoin size={15} /> },
              { label: "Misi Dimainkan", value: String(save.stats.games), icon: <IconKeyboard size={15} /> },
              { label: "Kemenangan", value: String(save.stats.wins), icon: <IconTrophy size={15} /> },
              { label: "WPM Terbaik", value: String(Math.round(save.stats.bestWpm)), icon: <IconTimer size={15} /> },
              { label: "Combo Terbaik", value: `${save.stats.bestCombo}×`, icon: <IconFlame size={15} /> },
              { label: "Baris Kode Diketik", value: save.stats.linesTyped.toLocaleString("id-ID"), icon: <IconKeyboard size={15} /> },
              { label: "Modul Tuntas", value: String(modulesDone), icon: <IconCheck size={15} /> },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl p-3.5" style={{ background: "rgba(7,24,42,0.65)", border: "1px solid rgba(126,196,236,0.16)" }}>
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider" style={{ color: "var(--dim)" }}>{item.icon} {item.label}</div>
                <div className="font-display font-extrabold text-2xl text-white mt-1 tabular-nums">{item.value}</div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--dim)" }}>
            {cloud?.gamification
              ? <>Snapshot tersimpan di database cloud: <strong className="text-white">{cloud.gamification.xp.toLocaleString("id-ID")} XP</strong> · rank {cloud.gamification.rankName} · diperbarui {cloudSavedAt ? new Date(cloudSavedAt).toLocaleString("id-ID") : "—"}.</>
              : "Snapshot cloud belum terbaca (mode lokal/belum login/belum sync) — angka di atas berasal dari perangkat ini."}
            {lastSync ? <> Sync terakhir: {new Date(lastSync).toLocaleString("id-ID")}.</> : null}
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* ======= Badge & Achievement ======= */}
          <section className="hud-panel p-6" aria-labelledby="profil-badge">
            <h3 id="profil-badge" className="font-display font-extrabold text-lg text-white flex items-center gap-2">
              <IconAward size={18} /> Badge & Achievement
            </h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="font-display font-extrabold text-4xl text-white tabular-nums">{summary.unlockedCount}<span className="text-lg" style={{ color: "var(--dim)" }}>/{summary.total}</span></div>
              <div className="flex-1">
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(126,196,236,0.15)" }}>
                  <div className="h-full rounded-full" style={{ width: `${summary.unlockedPct}%`, background: "linear-gradient(90deg, var(--amber), var(--teal))" }} />
                </div>
                <p className="text-xs mt-1.5" style={{ color: "var(--dim)" }}>
                  {summary.claimedCount} badge diklaim · {summary.claimableCount} siap diklaim di Dashboard
                </p>
              </div>
            </div>
            {claimedBadges.length ? (
              <ul className="mt-4 space-y-2">
                {claimedBadges.map((s) => (
                  <li key={s.def.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: "rgba(7,24,42,0.6)", border: `1px solid ${TIER_CONFIG[s.def.tier].border}` }}>
                    <span className="text-xl" aria-hidden="true">{s.def.icon}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-bold text-white truncate">{s.def.name}</span>
                      <span className="block text-[11px]" style={{ color: TIER_CONFIG[s.def.tier].text }}>{TIER_CONFIG[s.def.tier].label} · +{s.def.rewardXp} XP · +{s.def.rewardCoins} koin</span>
                    </span>
                    <span className="text-[11px] shrink-0" style={{ color: "var(--dim)" }}>{s.claimedAt ? fmtDate(new Date(s.claimedAt).toISOString()) : ""}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm mt-4" style={{ color: "var(--dim)" }}>Belum ada badge yang diklaim. Selesaikan misi lalu klaim lencanamu di Dashboard.</p>
            )}
            <div className="mt-4">
              <p className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: "var(--dim)" }}>Badge tier streak terbuka</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {STREAK_MULTIPLIER_TIERS.filter((t) => t.tier <= multiplierTier.tier).map((t) => (
                  <span key={t.tier} className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: t.badgeBg, color: t.color, border: `1px solid ${t.color}55` }}>
                    {t.iconChar} {t.name} {t.multiplier}×
                  </span>
                ))}
              </div>
            </div>
            {cloud?.badges?.length ? (
              <p className="text-xs mt-4" style={{ color: "var(--dim)" }}>
                Database cloud mencatat <strong className="text-white">{cloud.badges.length} badge</strong> permanen milikmu (achievement, tier streak, dan rank).
              </p>
            ) : null}
          </section>

          {/* ======= Atensi / Aktivitas ======= */}
          <section className="hud-panel p-6" aria-labelledby="profil-atensi">
            <h3 id="profil-atensi" className="font-display font-extrabold text-lg text-white flex items-center gap-2">
              <IconCalendar size={18} /> Atensi & Konsistensi
            </h3>
            <p className="text-xs mt-2" style={{ color: "var(--dim)" }}>
              Aktivitas latihan 14 hari terakhir {cloud?.attention?.length ? "menurut database cloud" : "menurut perangkat ini"} —{" "}
              <strong className="text-white">{activeDays} hari aktif</strong>, streak latihan {streakStatus.current} hari, streak login {save.loginStreak?.current ?? 0} hari.
            </p>
            <div className="mt-4 flex items-end gap-1.5 h-28" role="img" aria-label={`Grafik aktivitas 14 hari: ${activeDays} hari aktif`}>
              {attention.map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1 min-w-0" title={`${fmtDay(day.date)} · ${day.attempts} misi · +${day.xp} XP`}>
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${Math.max(day.attempts ? 12 : 4, (day.attempts / attentionMax) * 100)}%`,
                      background: day.attempts ? "linear-gradient(180deg, var(--teal), rgba(69,198,255,0.55))" : "rgba(126,196,236,0.14)",
                    }}
                  />
                  <span className="text-[9px] font-bold tabular-nums" style={{ color: "var(--faint)" }}>{day.date.slice(8)}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div className="rounded-xl p-3" style={{ background: "rgba(7,24,42,0.65)" }}>
                <div className="font-display font-extrabold text-xl text-white tabular-nums">{attention.reduce((a, d) => a + d.attempts, 0)}</div>
                <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--dim)" }}>Misi / 14 hari</div>
              </div>
              <div className="rounded-xl p-3" style={{ background: "rgba(7,24,42,0.65)" }}>
                <div className="font-display font-extrabold text-xl text-white tabular-nums">+{attention.reduce((a, d) => a + d.xp, 0).toLocaleString("id-ID")}</div>
                <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--dim)" }}>XP / 14 hari</div>
              </div>
              <div className="rounded-xl p-3" style={{ background: "rgba(7,24,42,0.65)" }}>
                <div className="font-display font-extrabold text-xl text-white tabular-nums">{save.dailyChallenge.totalCompleted}</div>
                <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--dim)" }}>Tantangan Harian</div>
              </div>
            </div>
            <p className="text-[11px] mt-3 leading-relaxed" style={{ color: "var(--faint)" }}>
              Mekanisme atensi: streak harian + tantangan harian + pengali streak permanen memberi alasan kembali berlatih setiap hari; semua tercatat lokal dan tersinkron ke `cs_attention_days` saat cloud siap.
            </p>
          </section>
        </div>

        {/* ======= Kesiapan Database ======= */}
        <section className="hud-panel p-6" aria-labelledby="profil-database">
          <h3 id="profil-database" className="font-display font-extrabold text-lg text-white flex items-center gap-2">
            <IconDatabase size={18} /> Kesiapan Database
          </h3>
          {dbStatus ? (
            <>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="chip">Mode: <strong className="text-white ml-1">{dbStatus.decision === "cloud" ? `Cloud (${dbStatus.effectiveProvider ?? "—"})` : "Lokal"}</strong></span>
                <span className="chip">TiDB: <strong className="text-white ml-1">{dbStatus.state}</strong></span>
                <span className="chip">Skema gamifikasi 002: <strong className="text-white ml-1">{features?.gamificationSchema ?? "tidak diperiksa"}</strong></span>
                <span className="chip">Layerbase (auth): <strong className="text-white ml-1">{features?.authSchema ?? "tidak diperiksa"}</strong></span>
                <span className="chip">Profil cloud: <strong className="text-white ml-1">{cloud ? "terbaca" : features?.profile ? "siap" : "belum siap"}</strong></span>
                <span className="chip">Membership cloud: <strong className="text-white ml-1">{features?.membership ? "siap" : "belum siap"}</strong></span>
              </div>
              <p className="text-xs mt-3 leading-relaxed" style={{ color: "var(--dim)" }}>
                Data identitas & sesi disimpan di MariaDB Layerbase (Better Auth); hasil gamifikasi, badge, achievement,
                atensi, dan membership disimpan di TiDB Cloud (tabel `cs_*`). Bila salah satu belum siap, aplikasi
                otomatis memakai penyimpanan lokal tanpa menghalangi bermain.
              </p>
            </>
          ) : (
            <p className="text-sm mt-3" style={{ color: "var(--dim)" }}>
              Status database tidak terbaca dari perangkat ini — aplikasi berjalan dengan penyimpanan lokal.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
