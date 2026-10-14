export interface AttemptRecord {
  id: string;
  sessionId: string;
  won: boolean;
  stars: number;
  score: number;
  accuracy: number;
  wpm: number;
  maxCombo: number;
  xpAward: number;
  coinsAward: number;
  passed: boolean;
  at: number;
}

const KEY = "codeshark:history:v1";
const MAX_ITEMS = 200;

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadHistory(): AttemptRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as AttemptRecord[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveAll(items: AttemptRecord[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(-MAX_ITEMS)));
  } catch {
    /* abaikan */
  }
}

export function logAttempt(r: Omit<AttemptRecord, "id" | "at"> & { at?: number }): AttemptRecord {
  const rec: AttemptRecord = { ...r, id: uid(), at: r.at ?? Date.now() };
  const items = loadHistory();
  items.push(rec);
  saveAll(items);
  return rec;
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* abaikan */
  }
}
