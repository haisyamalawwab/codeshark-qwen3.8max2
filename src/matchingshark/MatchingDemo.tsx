/* Demo interaktif MatchingShark — arena kartu versus.

   Model UX-nya mengikuti konsep "Sonar Link Arena":
   - deck situasi di kiri dan deck artefak/keputusan di kanan;
   - kartu terpilih tampil besar dan saling berhadapan di arena tengah;
   - panah kiri -> kanan menunjukkan hipotesis hubungan RPL;
   - pemain menekan tombol kunci untuk menilai pasangan;
   - klik/ketuk adalah fallback penuh dari drag @dnd-kit.

   Seluruh state hanya hidup di komponen ini. Demo tidak menulis XP,
   localStorage, database, badge, achievement, membership, atau progres
   pemain. */

import {
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  IconArrowR,
  IconBolt,
  IconBook,
  IconCalendar,
  IconCheck,
  IconCode,
  IconEye,
  IconFin,
  IconFlame,
  IconInfo,
  IconLock,
  IconMap,
  IconRetry,
  IconSparkles,
  IconTarget,
  IconTrophy,
  IconX,
} from "../ui/icons";
import matchingCastWebp from "../assets/matchingshark/matching-cast.webp";
import matchingDuelPng from "../assets/matchingshark/concepts/matching-card-duel.png";
import matchingDuelWebp from "../assets/matchingshark/concepts/matching-card-duel.webp";
import "./matchingDemo.css";

const VIOLET = "#a78bfa";
const VIOLET_DIM = "#c4b5fd";
const PANEL = "rgba(10, 28, 46, 0.84)";
const LINE = "rgba(126, 196, 236, 0.2)";
const DIM = "#9db8cb";
const FAINT = "#7393a9";
const CYAN = "#7ee4ff";
const CORAL = "#ff8a75";

type CardSide = "situation" | "choice";
type Resolution = "idle" | "success" | "error";
type ArenaStatus = "waiting" | "partial" | "ready" | "success" | "error" | "complete";
type DemoIcon = typeof IconBook;

interface DemoPair {
  id: string;
  category: string;
  situationTitle: string;
  situation: string;
  answerTitle: string;
  answer: string;
  linkVerb: string;
  level: 1 | 2 | 3;
  situationIcon: DemoIcon;
  answerIcon: DemoIcon;
  rationale: string;
  hint: string;
}

const DEMO_PAIRS: DemoPair[] = [
  {
    id: "kebutuhan",
    category: "Rekayasa kebutuhan",
    situationTitle: "Kebutuhan masih kabur",
    situation: "\u201CSistem harus cepat dan mudah dipakai\u201D masih terlalu kabur untuk dibangun dan diuji.",
    answerTitle: "Kebutuhan terukur",
    answer: "Ubah menjadi kebutuhan terukur + acceptance criteria",
    linkVerb: "diklarifikasi menjadi",
    level: 1,
    situationIcon: IconBook,
    answerIcon: IconTarget,
    rationale:
      "Betul. Kebutuhan yang baik harus bisa diverifikasi: misalnya halaman tampil < 2 detik dan pengguna baru dapat menyelesaikan tugas utama dalam 3 langkah.",
    hint: "Cari kartu yang membuat kata \u201Ccepat\u201D dan \u201Cmudah\u201D dapat diukur, bukan langsung melompat ke diagram.",
  },
  {
    id: "uml",
    category: "UML use case",
    situationTitle: "Aktor memproses pinjaman",
    situation: "Pustakawan memproses peminjaman buku untuk anggota di sistem perpustakaan.",
    answerTitle: "Relasi use case",
    answer: "Aktor: Pustakawan → Use case: Memproses Peminjaman",
    linkVerb: "dimodelkan sebagai",
    level: 2,
    situationIcon: IconMap,
    answerIcon: IconCode,
    rationale:
      "Tepat. Aktor adalah pihak di luar sistem yang berinteraksi dengannya; elips use case menyatakan tujuan yang ingin dicapai aktor.",
    hint: "Pisahkan siapa yang berada di luar sistem dari tujuan/fungsi yang ia jalankan di dalam sistem.",
  },
  {
    id: "testing",
    category: "Pengujian black-box",
    situationTitle: "Uji tepi interval umur",
    situation: "Form hanya menerima umur 17–60 tahun. Nilai mana yang paling wajib diuji pada batasnya?",
    answerTitle: "Boundary value analysis",
    answer: "16, 17, 60, dan 61 — boundary value analysis",
    linkVerb: "divalidasi dengan",
    level: 2,
    situationIcon: IconEye,
    answerIcon: IconCheck,
    rationale:
      "Benar. Kesalahan paling sering muncul tepat di tepi interval: satu nilai sebelum batas, pada batas, dan satu nilai sesudah batas.",
    hint: "Jangan hanya memilih nilai tengah yang aman. Uji persis di sekitar angka 17 dan 60.",
  },
  {
    id: "scrum",
    category: "Sprint Planning",
    situationTitle: "Backlog melewati kapasitas",
    situation: "Kapasitas Sprint dua minggu adalah 40 poin, tetapi backlog prioritas berjumlah 55 poin.",
    answerTitle: "Sprint Backlog 40 poin",
    answer: "Ambil 40 poin teratas; sisanya tetap di Product Backlog",
    linkVerb: "direncanakan menjadi",
    level: 3,
    situationIcon: IconCalendar,
    answerIcon: IconFlame,
    rationale:
      "Betul. Sprint direncanakan berdasarkan kapasitas nyata tim. Memaksa 55 poin hanya menukar komitmen yang jelas dengan kualitas dan kepercayaan yang turun.",
    hint: "Kapasitas adalah batas rencana. Prioritas teratas masuk Sprint, bukan seluruh backlog dipadatkan.",
  },
];

const DEMO_CHOICE_ORDER = ["testing", "scrum", "kebutuhan", "uml"];

/* Portrait diambil dari gambar cast yang sama. Pemetaan memakai urutan
   tampil deck, bukan id pasangan, agar gambar tidak menjadi petunjuk
   jawaban yang bisa dicocokkan tanpa membaca makna kartu. */
const CARD_PORTRAITS = [
  { name: "Kapten Sprint", position: "21% center" },
  { name: "Analis Kebutuhan", position: "50% center" },
  { name: "Penguji Kualitas", position: "82% center" },
  { name: "Kapten Sprint", position: "21% center" },
];

type FeedbackKind = "idle" | "success" | "error" | "hint" | "complete";

interface Feedback {
  kind: FeedbackKind;
  title: string;
  text: string;
}

function parseDragId(id: string | null): { side: CardSide; pairId: string } | null {
  if (!id) return null;
  const [side, pairId] = id.split(":");
  if ((side === "situation" || side === "choice") && pairId) return { side, pairId };
  return null;
}

function GemRow({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`Level misi ${level} dari 3`}>
      {[1, 2, 3].map((gem) => (
        <span key={gem} className="ms-gem" data-active={gem <= level} aria-hidden="true" />
      ))}
    </span>
  );
}

interface DraggableDemoCardProps {
  dragId: string;
  side: CardSide;
  disabled: boolean;
  selected: boolean;
  onClick: () => void;
  style: CSSProperties;
  children: ReactNode;
}

function DraggableDemoCard({
  dragId,
  side,
  disabled,
  selected,
  onClick,
  style,
  children,
}: DraggableDemoCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: dragId,
    disabled,
  });

  const dragStyle: CSSProperties = {
    ...style,
    ...(transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.025)`,
          transition: "none",
          zIndex: 70,
          opacity: 0.97,
        }
      : null),
  };

  return (
    <button
      ref={setNodeRef}
      type="button"
      disabled={disabled}
      className={`ms-rail-card ms-rail-card--${side} relative w-full min-h-[132px] rounded-[1.25rem] border p-2.5 text-left ${isDragging ? "shadow-2xl" : ""}`}
      style={dragStyle}
      {...listeners}
      {...attributes}
      onClick={onClick}
      aria-pressed={selected}
      data-selected={selected}
    >
      {children}
    </button>
  );
}

interface DroppableVersusSlotProps {
  id: string;
  side: CardSide;
  activeSide: CardSide | null;
  children: ReactNode;
}

function DroppableVersusSlot({ id, side, activeSide, children }: DroppableVersusSlotProps) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const valid = activeSide === side;
  return (
    <div
      ref={setNodeRef}
      className={`ms-versus-slot min-w-0 ${isOver && valid ? "ms-versus-slot--over" : ""} ${isOver && activeSide && !valid ? "ms-versus-slot--invalid" : ""}`}
    >
      {children}
    </div>
  );
}

interface VersusCardProps {
  side: CardSide;
  pair: DemoPair | null;
  portraitIndex: number;
  resolution: Resolution;
  isPreview: boolean;
}

function VersusCard({ side, pair, portraitIndex, resolution, isPreview }: VersusCardProps) {
  const isLeft = side === "situation";
  const portrait = CARD_PORTRAITS[Math.max(0, portraitIndex) % CARD_PORTRAITS.length];
  const statusClass = resolution === "error" ? "ms-faceoff-card--error" : resolution === "success" ? "ms-faceoff-card--success" : "";
  const frameStyle: CSSProperties = {
    borderColor:
      resolution === "success"
        ? "rgba(46,230,200,0.72)"
        : resolution === "error"
          ? "rgba(255,107,87,0.72)"
          : isLeft
            ? "rgba(103,232,249,0.55)"
            : "rgba(167,139,250,0.62)",
    background:
      resolution === "success"
        ? "linear-gradient(165deg, rgba(13,84,76,0.92), rgba(4,22,39,0.96) 62%)"
        : resolution === "error"
          ? "linear-gradient(165deg, rgba(101,42,39,0.9), rgba(26,16,38,0.96) 62%)"
          : isLeft
            ? "linear-gradient(165deg, rgba(8,77,105,0.94), rgba(4,20,39,0.97) 62%)"
            : "linear-gradient(165deg, rgba(76,29,149,0.92), rgba(17,17,43,0.97) 62%)",
    boxShadow:
      resolution === "success"
        ? "0 24px 58px rgba(0,0,0,0.36), 0 0 34px rgba(46,230,200,0.2)"
        : resolution === "error"
          ? "0 24px 58px rgba(0,0,0,0.36), 0 0 28px rgba(255,107,87,0.18)"
          : "0 24px 58px rgba(0,0,0,0.38), 0 0 26px rgba(69,198,255,0.12)",
  };

  if (!pair) {
    return (
      <article
        className={`ms-faceoff-card ${isLeft ? "ms-faceoff-card--left" : "ms-faceoff-card--right"} ms-card-back relative min-h-[310px] sm:min-h-[350px] rounded-[1.45rem] border border-dashed p-4 overflow-hidden`}
        style={{ borderColor: isLeft ? "rgba(103,232,249,0.42)" : "rgba(167,139,250,0.5)" }}
        aria-label={isLeft ? "Slot kartu situasi masih kosong" : "Slot kartu keputusan masih kosong"}
      >
        <div className="relative h-full min-h-[278px] sm:min-h-[318px] rounded-[1.1rem] border flex flex-col items-center justify-center text-center px-4" style={{ borderColor: "rgba(126,196,236,0.2)", background: "rgba(3,13,28,0.42)" }}>
          <span className="w-16 h-16 rounded-full grid place-items-center" style={{ color: isLeft ? CYAN : VIOLET_DIM, background: "rgba(7,24,42,0.72)", border: `1px solid ${LINE}` }}>
            <IconFin size={31} />
          </span>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] mt-4" style={{ color: isLeft ? CYAN : VIOLET_DIM }}>
            {isLeft ? "Slot situasi" : "Slot keputusan"}
          </p>
          <h4 className="font-display font-extrabold text-lg text-white mt-1">Kartu belum masuk arena</h4>
          <p className="text-xs leading-relaxed mt-2" style={{ color: DIM }}>
            {isLeft ? "Ketuk atau seret kartu dari deck kiri." : "Ketuk atau seret kartu dari deck kanan."}
          </p>
        </div>
      </article>
    );
  }

  const Icon = isLeft ? pair.situationIcon : pair.answerIcon;
  const title = isLeft ? pair.situationTitle : pair.answerTitle;
  const body = isLeft ? pair.situation : pair.answer;
  const eyebrow = isLeft ? pair.category : "Artefak / keputusan";

  return (
    <article
      key={`${side}-${pair.id}`}
      className={`ms-faceoff-card ${isLeft ? "ms-faceoff-card--left" : "ms-faceoff-card--right"} ${statusClass} anim-pop relative min-h-[310px] sm:min-h-[350px] rounded-[1.45rem] border p-2.5`}
      style={frameStyle}
      aria-label={`${isLeft ? "Kartu situasi" : "Kartu keputusan"}: ${title}`}
    >
      <div className="ms-card-shine relative h-full min-h-[288px] sm:min-h-[328px] rounded-[1.15rem] overflow-hidden flex flex-col" style={{ background: "rgba(3,14,29,0.72)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="relative h-[118px] sm:h-[132px] shrink-0 overflow-hidden">
          <img
            src={matchingCastWebp}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover ${isLeft ? "" : "-scale-x-100"}`}
            style={{ objectPosition: portrait.position }}
          />
          <div className="absolute inset-0" style={{ background: isLeft ? "linear-gradient(90deg, rgba(3,20,39,0.18), rgba(3,20,39,0.66)), linear-gradient(180deg, transparent 32%, rgba(3,14,29,0.96))" : "linear-gradient(270deg, rgba(24,10,48,0.16), rgba(24,10,48,0.68)), linear-gradient(180deg, transparent 32%, rgba(3,14,29,0.96))" }} />
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.16em]" style={{ color: isLeft ? "#a5f3fc" : "#ddd6fe", background: "rgba(3,13,28,0.76)", border: `1px solid ${isLeft ? "rgba(103,232,249,0.42)" : "rgba(167,139,250,0.5)"}` }}>
            <Icon size={13} /> {isLeft ? "Situasi" : "Keputusan"}
          </span>
          {isPreview ? (
            <span className="absolute top-3 right-3 rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.16em]" style={{ color: "#160b2e", background: VIOLET }}>
              Pratinjau
            </span>
          ) : null}
          <span className="absolute bottom-3 left-3 text-[10px] font-extrabold uppercase tracking-[0.18em]" style={{ color: isLeft ? "#a5f3fc" : "#ddd6fe" }}>
            {portrait.name}
          </span>
        </div>

        <div className="relative flex flex-1 flex-col p-4">
          <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: isLeft ? CYAN : VIOLET_DIM }}>
            {eyebrow}
          </p>
          <h4 className="font-display font-extrabold text-base sm:text-xl leading-tight text-white mt-1.5">{title}</h4>
          <p className="text-[11px] sm:text-sm font-semibold leading-relaxed mt-2 line-clamp-5" style={{ color: "#d7eaf6" }}>
            {body}
          </p>
          <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t" style={{ borderColor: "rgba(126,196,236,0.16)" }}>
            {isLeft ? (
              <>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.16em]" style={{ color: FAINT }}>Level misi</span>
                <GemRow level={pair.level} />
              </>
            ) : (
              <>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.16em]" style={{ color: FAINT }}>Daya link</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold" style={{ color: "var(--teal)" }}>
                  <IconBolt size={13} /> +25 XP
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <span
        className={`absolute top-1/2 z-20 grid h-8 w-8 sm:h-10 sm:w-10 -translate-y-1/2 place-items-center rounded-full border ${isLeft ? "-right-3 sm:-right-4" : "-left-3 sm:-left-4"}`}
        style={{
          color: resolution === "success" ? "#052e2b" : resolution === "error" ? "#fff" : isLeft ? "#082f49" : "#2e1065",
          background: resolution === "success" ? "var(--teal)" : resolution === "error" ? "#ff6b57" : isLeft ? CYAN : VIOLET,
          borderColor: "rgba(255,255,255,0.5)",
          boxShadow: "0 10px 26px rgba(0,0,0,0.34)",
        }}
        aria-hidden="true"
      >
        {resolution === "success" ? <IconCheck size={19} /> : resolution === "error" ? <IconX size={18} /> : <IconBolt size={18} />}
      </span>
    </article>
  );
}

function ArenaArrow({ status }: { status: ArenaStatus }) {
  const colors: Record<ArenaStatus, string> = {
    waiting: "rgba(126,196,236,0.48)",
    partial: VIOLET,
    ready: "#67e8f9",
    success: "#2ee6c8",
    error: "#ff6b57",
    complete: "#2ee6c8",
  };
  const color = colors[status];
  const isSolid = status === "success" || status === "complete";

  return (
    <div className="relative flex min-h-[310px] sm:min-h-[350px] items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 140 48" className="w-full max-w-[132px] overflow-visible" role="presentation">
        {status === "error" ? (
          <>
            <path d="M2 24 H48" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray="8 7" />
            <path d="M92 24 H116" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray="8 7" />
            <polygon points="116,13 138,24 116,35" fill={color} opacity="0.72" />
          </>
        ) : (
          <>
            <path
              d="M2 24 H116"
              fill="none"
              stroke={color}
              strokeWidth={isSolid ? 6 : 5}
              strokeLinecap="round"
              strokeDasharray={isSolid ? undefined : "9 8"}
              className={isSolid ? undefined : "ms-arrow-dash"}
              style={{ filter: `drop-shadow(0 0 7px ${color})` }}
            />
            <polygon points="116,12 138,24 116,36" fill={color} style={{ filter: `drop-shadow(0 0 7px ${color})` }} />
          </>
        )}
      </svg>
      <span
        className="ms-arrow-medallion absolute left-1/2 top-1/2 grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full border font-display text-sm font-extrabold"
        style={{
          color: status === "error" ? "#fff" : status === "success" || status === "complete" ? "#052e2b" : "#160b2e",
          background:
            status === "error"
              ? "#ff6b57"
              : status === "success" || status === "complete"
                ? "var(--teal)"
                : status === "ready"
                  ? "#67e8f9"
                  : VIOLET,
          borderColor: "rgba(255,255,255,0.55)",
          boxShadow: `0 16px 36px rgba(0,0,0,0.38), 0 0 24px ${color}`,
        }}
      >
        {status === "success" || status === "complete" ? <IconCheck size={23} /> : status === "error" ? <IconX size={22} /> : status === "ready" ? <IconBolt size={22} /> : "VS"}
      </span>
      <span className="absolute left-1/2 top-[calc(50%+2.6rem)] -translate-x-1/2 whitespace-nowrap text-[9px] font-extrabold uppercase tracking-[0.18em]" style={{ color }}>
        Sonar link
      </span>
    </div>
  );
}

export default function MatchingDemo() {
  const [selectedSituationId, setSelectedSituationId] = useState<string | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [hintIds, setHintIds] = useState<string[]>([]);
  const [lastWrongChoice, setLastWrongChoice] = useState<string | null>(null);
  const [resolution, setResolution] = useState<Resolution>("idle");
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>({
    kind: "idle",
    title: "Masukkan dua kartu ke arena versus.",
    text: "Pilih kartu situasi dan kartu keputusan, periksa arah panah sonar, lalu kunci pasangan untuk melihat alasan engineering-nya.",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
  );

  const choices = useMemo(
    () => DEMO_CHOICE_ORDER.map((id) => DEMO_PAIRS.find((pair) => pair.id === id)!),
    [],
  );
  const matchedCount = Object.keys(matches).length;
  const completed = matchedCount === DEMO_PAIRS.length;
  const demoXp = Math.max(0, matchedCount * 25 - wrongAttempts * 3 - hintIds.length * 5);

  const selectedSituation = DEMO_PAIRS.find((pair) => pair.id === selectedSituationId) ?? null;
  const selectedChoice = DEMO_PAIRS.find((pair) => pair.id === selectedChoiceId) ?? null;
  const activeDrag = parseDragId(activeDragId);
  const draggedPair = activeDrag ? DEMO_PAIRS.find((pair) => pair.id === activeDrag.pairId) ?? null : null;
  const effectiveSituation = activeDrag?.side === "situation" ? draggedPair : selectedSituation;
  const effectiveChoice = activeDrag?.side === "choice" ? draggedPair : selectedChoice;
  const effectiveSituationIndex = effectiveSituation ? DEMO_PAIRS.findIndex((pair) => pair.id === effectiveSituation.id) : 0;
  const effectiveChoiceIndex = effectiveChoice ? choices.findIndex((pair) => pair.id === effectiveChoice.id) : 0;
  const displayResolution: Resolution = activeDrag ? "idle" : resolution;
  const bothSelected = Boolean(selectedSituation && selectedChoice);
  const canLock = bothSelected && resolution === "idle" && !activeDrag && !completed;
  const arenaStatus: ArenaStatus =
    completed && resolution === "success"
      ? "complete"
      : displayResolution !== "idle"
        ? displayResolution
        : effectiveSituation && effectiveChoice
          ? "ready"
          : effectiveSituation || effectiveChoice
            ? "partial"
            : "waiting";

  const arenaStatusLabel: Record<ArenaStatus, string> = {
    waiting: "Menunggu kartu",
    partial: "Satu slot terisi",
    ready: "Siap dikunci",
    success: "Link terverifikasi",
    error: "Link putus",
    complete: "Arena selesai",
  };

  const clearSelections = () => {
    setSelectedSituationId(null);
    setSelectedChoiceId(null);
    setResolution("idle");
    setLastWrongChoice(null);
    setActiveDragId(null);
  };

  const placeSituation = (pair: DemoPair, fromDrag = false) => {
    if (matches[pair.id] || resolution === "success") return;

    if (!fromDrag && selectedSituationId === pair.id) {
      setSelectedSituationId(null);
      setResolution("idle");
      setLastWrongChoice(null);
      setFeedback({
        kind: "idle",
        title: "Kartu situasi ditarik dari arena.",
        text: selectedChoice
          ? "Kartu keputusan masih berada di slot kanan. Pilih situasi lain untuk menguji hipotesis baru."
          : "Pilih kartu situasi untuk memulai duel berikutnya.",
      });
      return;
    }

    setSelectedSituationId(pair.id);
    setResolution("idle");
    setLastWrongChoice(null);
    setFeedback(
      selectedChoice
        ? {
            kind: "idle",
            title: "Dua kartu sudah saling berhadapan.",
            text: `Periksa hipotesisnya: ${pair.situationTitle.toLowerCase()} ${pair.linkVerb} ${selectedChoice.answerTitle.toLowerCase()}. Tekan Kunci Panah Sonar bila maknanya tepat.`,
          }
        : {
            kind: "idle",
            title: `${pair.category} masuk arena.`,
            text: "Sekarang pilih kartu artefak/keputusan yang paling tepat dari deck kanan.",
          },
    );
  };

  const placeChoice = (choice: DemoPair, fromDrag = false) => {
    if (Object.values(matches).includes(choice.id) || resolution === "success") return;

    if (!fromDrag && selectedChoiceId === choice.id) {
      setSelectedChoiceId(null);
      setResolution("idle");
      setLastWrongChoice(null);
      setFeedback({
        kind: "idle",
        title: "Kartu keputusan ditarik dari arena.",
        text: selectedSituation
          ? "Kartu situasi tetap di slot kiri. Pilih keputusan lain untuk dibandingkan maknanya."
          : "Pilih dua kartu dari deck kiri dan kanan untuk memulai duel.",
      });
      return;
    }

    setSelectedChoiceId(choice.id);
    setResolution("idle");
    setLastWrongChoice(null);
    setFeedback(
      selectedSituation
        ? {
            kind: "idle",
            title: "Pasangan siap diuji.",
            text: `Hipotesis link: ${selectedSituation.situationTitle.toLowerCase()} ${selectedSituation.linkVerb} ${choice.answerTitle.toLowerCase()}. Panah masih putus-putus sampai kamu menguncinya.`,
          }
        : {
            kind: "idle",
            title: "Kartu keputusan masuk arena.",
            text: "Sekarang pilih kartu situasi yang paling masuk akal untuk menghadapinya.",
          },
    );
  };

  const lockPair = () => {
    if (!selectedSituation || !selectedChoice || resolution !== "idle") return;

    setAttempts((value) => value + 1);
    if (selectedChoice.id === selectedSituation.id) {
      const nextMatches = { ...matches, [selectedSituation.id]: selectedChoice.id };
      const isComplete = Object.keys(nextMatches).length === DEMO_PAIRS.length;
      setMatches(nextMatches);
      setResolution("success");
      setLastWrongChoice(null);
      setFeedback(
        isComplete
          ? {
              kind: "complete",
              title: "Sprint demo selesai — semua link terkunci!",
              text: `${selectedSituation.rationale} Kamu menyelesaikan 4/4 pasangan dengan ${attempts + 1} kali penguncian.`,
            }
          : {
              kind: "success",
              title: "Sonar link terverifikasi.",
              text: selectedSituation.rationale,
            },
      );
      return;
    }

    setWrongAttempts((value) => value + 1);
    setLastWrongChoice(selectedChoice.id);
    setResolution("error");
    setFeedback({
      kind: "error",
      title: "Panah sonar putus — maknanya belum cocok.",
      text: `Kartu \u201C${selectedChoice.answer}\u201D milik konteks ${selectedChoice.category.toLowerCase()}, bukan untuk situasi ${selectedSituation.category.toLowerCase()} ini. Ganti salah satu kartu, lalu kunci lagi.`,
    });
  };

  const nextDuel = () => {
    if (resolution !== "success" || completed) return;
    clearSelections();
    setFeedback({
      kind: "idle",
      title: "Arena dibersihkan untuk duel berikutnya.",
      text: "Link yang benar tetap tersimpan sebagai tampilan dock demo. Pilih dua kartu berikutnya.",
    });
  };

  const cancelDuel = () => {
    if (resolution === "success" || (!selectedSituation && !selectedChoice)) return;
    clearSelections();
    setFeedback({
      kind: "idle",
      title: "Duel dibatalkan.",
      text: "Tidak ada penalti percobaan untuk membatalkan hipotesis sebelum panah dikunci.",
    });
  };

  const showHint = () => {
    if (!selectedSituation || resolution === "success") {
      setFeedback({
        kind: "hint",
        title: "Hint butuh kartu situasi aktif.",
        text: "Masukkan satu situasi yang belum berpasangan ke slot kiri, lalu buka hint untuk kartu tersebut.",
      });
      return;
    }
    if (!hintIds.includes(selectedSituation.id)) setHintIds((items) => [...items, selectedSituation.id]);
    setFeedback({ kind: "hint", title: `Sonar hint — ${selectedSituation.category}`, text: selectedSituation.hint });
  };

  const reset = () => {
    clearSelections();
    setMatches({});
    setAttempts(0);
    setWrongAttempts(0);
    setHintIds([]);
    setFeedback({
      kind: "idle",
      title: "Arena versus diatur ulang.",
      text: "Masukkan kartu situasi dan keputusan ke arena, lalu kunci panah sonar untuk menilai maknanya.",
    });
  };

  const onDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  };

  const onDragEnd = (event: DragEndEvent) => {
    const dragged = parseDragId(String(event.active.id));
    const overId = event.over ? String(event.over.id) : null;
    setActiveDragId(null);
    if (!dragged || !overId) return;

    const pair = DEMO_PAIRS.find((item) => item.id === dragged.pairId);
    if (!pair) return;

    if (dragged.side === "situation" && overId === "slot-situation") {
      placeSituation(pair, true);
      return;
    }
    if (dragged.side === "choice" && overId === "slot-choice") {
      placeChoice(pair, true);
      return;
    }
    if (overId === "slot-situation" || overId === "slot-choice") {
      setFeedback({
        kind: "hint",
        title: "Slotnya tidak menerima jenis kartu itu.",
        text:
          dragged.side === "situation"
            ? "Kartu situasi hanya masuk slot kiri arena agar arah panah selalu dibaca dari konteks menuju keputusan."
            : "Kartu artefak/keputusan hanya masuk slot kanan arena sebagai tujuan panah sonar.",
      });
    }
  };

  const onDemoKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") cancelDuel();
  };

  const situationStyle = (pair: DemoPair): CSSProperties => {
    const matched = Boolean(matches[pair.id]);
    const selected = selectedSituationId === pair.id;
    return {
      background: matched
        ? "linear-gradient(150deg, rgba(13,84,76,0.88), rgba(5,25,43,0.94))"
        : selected
          ? "linear-gradient(150deg, rgba(14,94,126,0.95), rgba(30,27,75,0.94))"
          : "linear-gradient(150deg, rgba(8,47,73,0.88), rgba(5,20,38,0.94))",
      borderColor: matched ? "rgba(46,230,200,0.62)" : selected ? "#67e8f9" : "rgba(103,232,249,0.24)",
      boxShadow: selected ? "0 18px 42px rgba(0,0,0,0.3), 0 0 24px rgba(103,232,249,0.18)" : "0 14px 32px rgba(0,0,0,0.2)",
      opacity: matched ? 0.9 : 1,
    };
  };

  const choiceStyle = (choice: DemoPair): CSSProperties => {
    const matched = Object.values(matches).includes(choice.id);
    const selected = selectedChoiceId === choice.id;
    const wrong = lastWrongChoice === choice.id && resolution === "error";
    return {
      background: matched
        ? "linear-gradient(210deg, rgba(13,84,76,0.88), rgba(5,25,43,0.94))"
        : wrong
          ? "linear-gradient(210deg, rgba(110,43,39,0.9), rgba(29,18,43,0.95))"
          : selected
            ? "linear-gradient(210deg, rgba(91,33,182,0.92), rgba(12,34,64,0.95))"
            : "linear-gradient(210deg, rgba(49,29,95,0.9), rgba(5,20,38,0.94))",
      borderColor: matched ? "rgba(46,230,200,0.62)" : wrong ? "rgba(255,107,87,0.72)" : selected ? VIOLET : "rgba(167,139,250,0.28)",
      boxShadow: selected ? "0 18px 42px rgba(0,0,0,0.3), 0 0 24px rgba(167,139,250,0.2)" : "0 14px 32px rgba(0,0,0,0.2)",
      opacity: matched ? 0.9 : 1,
    };
  };

  const steps = [
    { label: "Isi slot situasi", done: Boolean(effectiveSituation), active: !effectiveSituation },
    { label: "Isi slot keputusan", done: Boolean(effectiveChoice), active: Boolean(effectiveSituation && !effectiveChoice) },
    { label: "Kunci panah sonar", done: resolution === "success", active: Boolean(effectiveSituation && effectiveChoice && resolution === "idle") },
  ];

  const arenaHint =
    resolution === "success"
      ? completed
        ? "Semua pasangan sudah masuk dock link terverifikasi."
        : "Link ini sudah terkunci. Lanjut ke duel berikutnya untuk membuka slot arena."
      : resolution === "error"
        ? "Link putus. Ganti kartu situasi atau keputusan, lalu kunci lagi."
        : effectiveSituation && effectiveChoice
          ? `Hipotesis: ${effectiveSituation.situationTitle.toLowerCase()} ${effectiveSituation.linkVerb} ${effectiveChoice.answerTitle.toLowerCase()}.`
          : effectiveSituation || effectiveChoice
            ? "Satu kartu sudah menunggu lawan duelnya di arena."
            : "Kartu terpilih akan membesar dan saling berhadapan di arena ini.";

  return (
    <div
      className="rounded-[1.7rem] overflow-hidden"
      style={{ background: PANEL, border: `1px solid ${LINE}`, boxShadow: "0 28px 80px rgba(0,0,0,0.28)" }}
      onKeyDown={onDemoKeyDown}
    >
      <div
        className="px-5 py-5 md:px-7 flex flex-col lg:flex-row lg:items-center gap-5"
        style={{ background: "linear-gradient(120deg, rgba(88,28,135,0.46), rgba(8,47,73,0.62) 55%, rgba(13,84,76,0.42))", borderBottom: `1px solid ${LINE}` }}
      >
        <div className="flex-1">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em]" style={{ color: VIOLET_DIM }}>
            Demo card versus · Sonar Link Arena
          </p>
          <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white mt-1">Adu makna: situasi melawan keputusan engineering</h3>
          <p className="text-xs md:text-sm leading-relaxed mt-1.5 max-w-2xl" style={{ color: DIM }}>
            Ketuk atau seret dua kartu ke arena. Keduanya akan berhadapan, lalu panah sonar menilai apakah hubungan maknanya benar.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Klik / seret kartu", "Panah konteks → keputusan", "Feedback beralasan"].map((chip) => (
              <span key={chip} className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold" style={{ color: "#d7eaf6", borderColor: "rgba(126,196,236,0.26)", background: "rgba(4,18,31,0.42)" }}>
                <IconSparkles size={12} /> {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center min-w-60 lg:min-w-72">
          <div className="rounded-2xl px-3 py-2.5" style={{ background: "rgba(4,18,31,0.58)", border: "1px solid rgba(126,196,236,0.14)" }}>
            <div className="font-display font-extrabold text-xl text-white tabular-nums">{matchedCount}/4</div>
            <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: FAINT }}>Link terkunci</div>
          </div>
          <div className="rounded-2xl px-3 py-2.5" style={{ background: "rgba(4,18,31,0.58)", border: "1px solid rgba(126,196,236,0.14)" }}>
            <div className="font-display font-extrabold text-xl text-white tabular-nums">{demoXp}</div>
            <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: FAINT }}>XP demo</div>
          </div>
          <div className="rounded-2xl px-3 py-2.5" style={{ background: "rgba(4,18,31,0.58)", border: "1px solid rgba(126,196,236,0.14)" }}>
            <div className="font-display font-extrabold text-xl text-white tabular-nums">{attempts}</div>
            <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: FAINT }}>Penguncian</div>
          </div>
        </div>
      </div>

      <div className="h-2" style={{ background: "rgba(126,196,236,0.12)" }} aria-hidden="true">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${(matchedCount / DEMO_PAIRS.length) * 100}%`, background: `linear-gradient(90deg, ${VIOLET}, #67e8f9, var(--teal))` }}
        />
      </div>

      <ol className="grid grid-cols-3 gap-2 px-5 pt-4 md:px-7" aria-label="Langkah memainkan arena versus">
        {steps.map((step, index) => (
          <li
            key={step.label}
            className="flex items-center gap-2 rounded-2xl border px-3 py-2.5"
            style={{
              borderColor: step.done ? "rgba(46,230,200,0.45)" : step.active ? "rgba(167,139,250,0.55)" : LINE,
              background: step.done ? "rgba(46,230,200,0.08)" : step.active ? "rgba(167,139,250,0.1)" : "rgba(5,20,38,0.42)",
              color: step.done ? "#a7f3ea" : step.active ? "#ede9fe" : FAINT,
            }}
            aria-current={step.active ? "step" : undefined}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-display text-xs font-extrabold" style={{ background: step.done ? "rgba(46,230,200,0.16)" : "rgba(126,196,236,0.1)", color: step.done ? "var(--teal)" : "inherit" }}>
              {step.done ? <IconCheck size={14} /> : index + 1}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold leading-tight">{step.label}</span>
          </li>
        ))}
      </ol>

      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setActiveDragId(null)}>
        <div className="grid gap-5 p-5 md:p-7 xl:grid-cols-[300px_minmax(0,1fr)_300px] xl:items-start">
          <section className="order-2 xl:order-1 min-w-0" aria-labelledby="deck-situasi-title">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em]" style={{ color: CYAN }}>Deck kiri</p>
                <h4 id="deck-situasi-title" className="font-display font-extrabold text-lg text-white mt-0.5">Kartu situasi</h4>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: FAINT }}>Konteks proyek</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {DEMO_PAIRS.map((pair, index) => {
                const matched = Boolean(matches[pair.id]);
                const selected = selectedSituationId === pair.id;
                const disabled = matched || resolution === "success";
                const SituationIcon = pair.situationIcon;
                return (
                  <DraggableDemoCard
                    key={pair.id}
                    dragId={`situation:${pair.id}`}
                    side="situation"
                    disabled={disabled}
                    selected={selected}
                    onClick={() => placeSituation(pair)}
                    style={situationStyle(pair)}
                  >
                    <span className="ms-card-shine flex min-h-[112px] gap-3 rounded-[1rem]">
                      <span className="relative w-[74px] shrink-0 self-stretch overflow-hidden rounded-[0.95rem]" style={{ border: "1px solid rgba(103,232,249,0.26)" }}>
                        <img src={matchingCastWebp} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: CARD_PORTRAITS[index].position }} />
                        <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 42%, rgba(3,14,29,0.72))" }} />
                        <span className="absolute bottom-1.5 left-1.5 grid h-7 w-7 place-items-center rounded-lg" style={{ color: "#a5f3fc", background: "rgba(3,13,28,0.8)", border: "1px solid rgba(103,232,249,0.34)" }}>
                          <SituationIcon size={15} />
                        </span>
                      </span>
                      <span className="min-w-0 flex-1 py-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="block text-[9px] font-extrabold uppercase tracking-[0.17em]" style={{ color: CYAN }}>{pair.category}</span>
                          <GemRow level={pair.level} />
                        </span>
                        <span className="block font-display text-[15px] font-extrabold leading-tight text-white mt-1">{pair.situationTitle}</span>
                        <span className="block text-xs font-semibold leading-snug mt-1 line-clamp-3" style={{ color: "#c8dfef" }}>{pair.situation}</span>
                        <span className="block text-[10px] font-extrabold mt-2" style={{ color: matched ? "var(--teal)" : selected ? "#a5f3fc" : FAINT }}>
                          {matched ? "Sudah terkunci di dock" : resolution === "success" ? "Tunggu duel berikutnya" : selected ? "Sedang tampil di arena" : "Ketuk / seret ke slot kiri"}
                        </span>
                      </span>
                    </span>
                    <span className="absolute -right-2 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border" style={{ color: matched ? "#052e2b" : "#082f49", background: matched ? "var(--teal)" : CYAN, borderColor: "rgba(255,255,255,0.45)" }} aria-hidden="true">
                      {matched ? <IconCheck size={16} /> : <IconBolt size={15} />}
                    </span>
                  </DraggableDemoCard>
                );
              })}
            </div>
          </section>

          <section className="order-1 xl:order-2 relative min-w-0 overflow-hidden rounded-[1.55rem] border" style={{ borderColor: "rgba(103,232,249,0.26)", background: "linear-gradient(160deg, rgba(8,47,73,0.72), rgba(30,20,68,0.78) 56%, rgba(6,35,48,0.82))" }} aria-labelledby="arena-versus-title">
            <picture className="pointer-events-none absolute inset-0 opacity-[0.15]" aria-hidden="true">
              <source srcSet={matchingDuelWebp} type="image/webp" />
              <img src={matchingDuelPng} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-center" />
            </picture>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(3,12,27,0.46), rgba(3,12,27,0.72) 62%, rgba(3,12,27,0.9))" }} />
            <div className="ms-sonar-ring h-56 w-56 sm:h-72 sm:w-72" aria-hidden="true" />
            <div className="ms-sonar-ring h-72 w-72 sm:h-96 sm:w-96" style={{ animationDelay: "1.25s" }} aria-hidden="true" />

            <div className="relative p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.24em]" style={{ color: CYAN }}>Arena versus</p>
                  <h4 id="arena-versus-title" className="font-display font-extrabold text-xl sm:text-2xl text-white mt-0.5">Kartu saling berhadapan</h4>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.13em]"
                  style={{
                    color: arenaStatus === "error" ? "#ffd2c9" : arenaStatus === "success" || arenaStatus === "complete" ? "#a7f3ea" : "#e0e7ff",
                    borderColor: arenaStatus === "error" ? "rgba(255,107,87,0.5)" : arenaStatus === "success" || arenaStatus === "complete" ? "rgba(46,230,200,0.5)" : "rgba(167,139,250,0.48)",
                    background: "rgba(3,13,28,0.66)",
                  }}
                  aria-live="polite"
                >
                  {arenaStatus === "success" || arenaStatus === "complete" ? <IconCheck size={13} /> : arenaStatus === "error" ? <IconX size={13} /> : <IconBolt size={13} />}
                  {arenaStatusLabel[arenaStatus]}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-[minmax(0,1fr)_3.4rem_minmax(0,1fr)] items-center gap-1.5 sm:grid-cols-[minmax(0,1fr)_5.5rem_minmax(0,1fr)] sm:gap-2 lg:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)]">
                <DroppableVersusSlot id="slot-situation" side="situation" activeSide={activeDrag?.side ?? null}>
                  <VersusCard
                    side="situation"
                    pair={effectiveSituation}
                    portraitIndex={effectiveSituationIndex}
                    resolution={displayResolution}
                    isPreview={Boolean(activeDrag?.side === "situation" && effectiveSituation && effectiveSituation.id !== selectedSituationId)}
                  />
                </DroppableVersusSlot>

                <ArenaArrow status={arenaStatus} />

                <DroppableVersusSlot id="slot-choice" side="choice" activeSide={activeDrag?.side ?? null}>
                  <VersusCard
                    side="choice"
                    pair={effectiveChoice}
                    portraitIndex={effectiveChoiceIndex}
                    resolution={displayResolution}
                    isPreview={Boolean(activeDrag?.side === "choice" && effectiveChoice && effectiveChoice.id !== selectedChoiceId)}
                  />
                </DroppableVersusSlot>
              </div>

              <p className="mx-auto mt-4 max-w-xl text-center text-xs sm:text-sm font-semibold leading-relaxed" style={{ color: "#d7eaf6" }}>
                {arenaHint}
              </p>

              <div className="mt-4 flex flex-col items-center gap-2">
                {resolution === "success" ? (
                  completed ? (
                    <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-extrabold transition hover:-translate-y-0.5" style={{ background: "linear-gradient(90deg, var(--teal), #67e8f9)", color: "#052e36", boxShadow: "0 18px 42px rgba(46,230,200,0.22)" }}>
                      <IconRetry size={17} /> Ulangi arena versus
                    </button>
                  ) : (
                    <button type="button" onClick={nextDuel} className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-extrabold transition hover:-translate-y-0.5" style={{ background: "linear-gradient(90deg, var(--teal), #67e8f9)", color: "#052e36", boxShadow: "0 18px 42px rgba(46,230,200,0.22)" }}>
                      Duel berikutnya <IconArrowR size={17} />
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={lockPair}
                    disabled={!canLock}
                    className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-extrabold transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
                    style={{ background: "linear-gradient(90deg, #a78bfa, #67e8f9)", color: "#160b2e", boxShadow: canLock ? "0 18px 42px rgba(103,232,249,0.22)" : undefined }}
                  >
                    <IconLock size={17} />
                    {resolution === "error" ? "Link putus — ganti kartu" : bothSelected ? "Kunci panah sonar" : "Pilih dua kartu dulu"}
                  </button>
                )}
                <p className="text-[10px] font-semibold" style={{ color: FAINT }}>
                  Seret kartu ke slot berwarna sama, atau cukup ketuk. Tekan Esc untuk membatalkan duel yang belum dikunci.
                </p>
              </div>
            </div>
          </section>

          <section className="order-3 min-w-0" aria-labelledby="deck-keputusan-title">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em]" style={{ color: VIOLET_DIM }}>Deck kanan</p>
                <h4 id="deck-keputusan-title" className="font-display font-extrabold text-lg text-white mt-0.5">Kartu keputusan</h4>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: FAINT }}>Artefak / aksi</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {choices.map((choice, index) => {
                const matched = Object.values(matches).includes(choice.id);
                const selected = selectedChoiceId === choice.id;
                const wrong = lastWrongChoice === choice.id && resolution === "error";
                const disabled = matched || resolution === "success";
                const AnswerIcon = choice.answerIcon;
                return (
                  <DraggableDemoCard
                    key={choice.id}
                    dragId={`choice:${choice.id}`}
                    side="choice"
                    disabled={disabled}
                    selected={selected}
                    onClick={() => placeChoice(choice)}
                    style={choiceStyle(choice)}
                  >
                    <span className="ms-card-shine flex min-h-[112px] gap-3 rounded-[1rem]">
                      <span className="relative w-[74px] shrink-0 self-stretch overflow-hidden rounded-[0.95rem]" style={{ border: "1px solid rgba(167,139,250,0.3)" }}>
                        <img src={matchingCastWebp} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full -scale-x-100 object-cover" style={{ objectPosition: CARD_PORTRAITS[index].position }} />
                        <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 42%, rgba(17,10,38,0.74))" }} />
                        <span className="absolute bottom-1.5 left-1.5 grid h-7 w-7 place-items-center rounded-lg" style={{ color: "#ddd6fe", background: "rgba(17,10,38,0.82)", border: "1px solid rgba(167,139,250,0.38)" }}>
                          <AnswerIcon size={15} />
                        </span>
                      </span>
                      <span className="min-w-0 flex-1 py-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="block text-[9px] font-extrabold uppercase tracking-[0.17em]" style={{ color: wrong ? CORAL : VIOLET_DIM }}>
                            Keputusan {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[10px] font-extrabold" style={{ color: "var(--teal)" }}>+25 XP</span>
                        </span>
                        <span className="block font-display text-[15px] font-extrabold leading-tight text-white mt-1">{choice.answerTitle}</span>
                        <span className="block text-xs font-semibold leading-snug mt-1 line-clamp-3" style={{ color: "#d9e2f3" }}>{choice.answer}</span>
                        <span className="block text-[10px] font-extrabold mt-2" style={{ color: matched ? "var(--teal)" : wrong ? CORAL : selected ? "#ddd6fe" : FAINT }}>
                          {matched ? "Sudah terkunci di dock" : wrong ? "Baru saja gagal terhubung" : resolution === "success" ? "Tunggu duel berikutnya" : selected ? "Sedang tampil di arena" : "Ketuk / seret ke slot kanan"}
                        </span>
                      </span>
                    </span>
                    <span className="absolute -left-2 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border" style={{ color: matched ? "#052e2b" : wrong ? "#fff" : "#2e1065", background: matched ? "var(--teal)" : wrong ? "#ff6b57" : VIOLET, borderColor: "rgba(255,255,255,0.45)" }} aria-hidden="true">
                      {matched ? <IconCheck size={16} /> : wrong ? <IconX size={15} /> : <IconBolt size={15} />}
                    </span>
                  </DraggableDemoCard>
                );
              })}
            </div>
          </section>
        </div>
      </DndContext>

      <section className="px-5 md:px-7" aria-labelledby="dock-link-title">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 id="dock-link-title" className="font-display font-extrabold text-base text-white flex items-center gap-2">
            <IconTarget size={18} /> Dock link terverifikasi
          </h4>
          <span className="text-[11px] font-extrabold" style={{ color: FAINT }}>{matchedCount}/4 pasangan terkunci</span>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-3">
          {DEMO_PAIRS.map((pair) => {
            const matched = Boolean(matches[pair.id]);
            return (
              <div
                key={pair.id}
                className="min-h-[92px] rounded-2xl border p-3.5"
                style={{
                  borderColor: matched ? "rgba(46,230,200,0.42)" : "rgba(126,196,236,0.16)",
                  borderStyle: matched ? "solid" : "dashed",
                  background: matched ? "rgba(46,230,200,0.07)" : "rgba(5,20,38,0.38)",
                }}
              >
                {matched ? (
                  <>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.18em]" style={{ color: "var(--teal)" }}>{pair.category}</p>
                    <p className="mt-1.5 text-xs font-extrabold leading-relaxed text-white">
                      {pair.situationTitle} <IconArrowR size={13} /> {pair.answerTitle}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold capitalize" style={{ color: DIM }}>{pair.linkVerb}</p>
                  </>
                ) : (
                  <div className="flex h-full min-h-[62px] flex-col items-center justify-center text-center">
                    <IconLock size={17} />
                    <p className="mt-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em]" style={{ color: FAINT }}>Link belum terkunci</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="px-5 pb-5 pt-5 md:px-7 md:pb-7">
        <div
          aria-live="polite"
          className="flex gap-3 rounded-[1.35rem] border p-4 md:p-5"
          style={{
            background:
              feedback.kind === "success" || feedback.kind === "complete"
                ? "rgba(46,230,200,0.09)"
                : feedback.kind === "error"
                  ? "rgba(255,107,87,0.09)"
                  : feedback.kind === "hint"
                    ? "rgba(255,194,71,0.09)"
                    : "rgba(69,198,255,0.07)",
            borderColor:
              feedback.kind === "success" || feedback.kind === "complete"
                ? "rgba(46,230,200,0.4)"
                : feedback.kind === "error"
                  ? "rgba(255,107,87,0.4)"
                  : feedback.kind === "hint"
                    ? "rgba(255,194,71,0.4)"
                    : LINE,
          }}
        >
          <span className="relative hidden h-14 w-14 shrink-0 overflow-hidden rounded-2xl border sm:block" style={{ borderColor: "rgba(103,232,249,0.3)" }} aria-hidden="true">
            <img src={matchingCastWebp} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "21% center" }} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: VIOLET_DIM }}>Kapten Hiu</p>
            <p className="font-display font-extrabold text-white flex items-center gap-2 mt-0.5">
              {feedback.kind === "complete" ? <IconTrophy size={18} /> : feedback.kind === "success" ? <IconCheck size={18} /> : feedback.kind === "error" ? <IconX size={18} /> : <IconInfo size={18} />}
              {feedback.title}
            </p>
            <p className="text-sm leading-relaxed mt-1" style={{ color: "#d5e9f5" }}>{feedback.text}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 mt-4">
          <button
            type="button"
            onClick={showHint}
            disabled={completed || resolution === "success"}
            className="btn btn-ghost inline-flex items-center gap-2 !px-4 !py-2.5 text-sm font-extrabold disabled:opacity-50"
          >
            <IconEye size={16} /> Sonar hint {hintIds.length ? `(${hintIds.length})` : ""}
          </button>
          <button
            type="button"
            onClick={resolution === "success" && !completed ? nextDuel : cancelDuel}
            disabled={resolution !== "success" && !selectedSituation && !selectedChoice}
            className="btn btn-ghost inline-flex items-center gap-2 !px-4 !py-2.5 text-sm font-extrabold disabled:opacity-50"
          >
            <IconX size={16} /> {resolution === "success" && !completed ? "Duel berikutnya" : "Batalkan duel"}
          </button>
          <button type="button" onClick={reset} className="btn btn-ghost inline-flex items-center gap-2 !px-4 !py-2.5 text-sm font-extrabold">
            <IconRetry size={16} /> Ulangi demo
          </button>
          <p className="text-[11px] font-semibold md:ml-auto" style={{ color: FAINT }}>
            XP hanya angka demo di layar ini — tidak disimpan dan tidak mengubah progres game lain.
          </p>
        </div>
      </div>
    </div>
  );
}
