import type { AttemptRecord } from "./history";
import { accessToken } from "./auth";

export interface SyncPayload {
  deviceId: string;
  userId?: string | null;
  profileName: string | null;
  save: unknown;
  attempts: AttemptRecord[];
  sentAt: number;
}

const OUTBOX_KEY = "codeshark:outbox:v1";
const SYNC_KEY = "codeshark:lastSync:v1";
const MAX_OUTBOX = 200;

export function loadOutbox(): AttemptRecord[] {
  try {
    const raw = localStorage.getItem(OUTBOX_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as AttemptRecord[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function enqueueAttempt(rec: AttemptRecord) {
  try {
    const q = loadOutbox();
    q.push(rec);
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(q.slice(-MAX_OUTBOX)));
  } catch {
    /* abaikan */
  }
}

export function replaceOutbox(items: AttemptRecord[]) {
  try {
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(items.slice(-MAX_OUTBOX)));
  } catch {
    /* abaikan */
  }
}

export function lastSyncAt(): number {
  try {
    return Number(localStorage.getItem(SYNC_KEY) || 0) || 0;
  } catch {
    return 0;
  }
}

function markSynced() {
  try {
    localStorage.setItem(SYNC_KEY, String(Date.now()));
  } catch {
    /* abaikan */
  }
}

export function syncEndpoint(): string {
  return import.meta.env.VITE_SYNC_ENDPOINT || "/api/sync-progress";
}

export async function pushOutbox(deviceId: string, profileName: string | null, save: unknown, userId?: string | null): Promise<{ sent: number; ok: boolean }> {
  const pending = loadOutbox();
  if (!pending.length) return { sent: 0, ok: true };
  /* import statis: ./auth sudah ada di chunk utama via App.tsx, dynamic import
     tidak bisa memisah chunk dan hanya memicu warning reporter Vite. */
  const token = await accessToken().catch(() => null);
  const payload: SyncPayload = { deviceId, userId: userId ?? null, profileName, save, attempts: pending, sentAt: Date.now() };
  const res = await fetch(syncEndpoint(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`sync ${res.status}`);
  const result = await res.json();
  if (result.ok !== true || result.mock || result.warning || !Array.isArray(result.acceptedIds)) {
    throw new Error("sync was not durably acknowledged");
  }
  const pendingIds = new Set(pending.map((item) => item.id));
  const accepted = new Set<string>(result.acceptedIds.filter(
    (id: unknown): id is string => typeof id === "string" && pendingIds.has(id),
  ));
  // Preserve items queued while the request was in flight and partial failures.
  replaceOutbox(loadOutbox().filter((item) => !accepted.has(item.id)));
  if (accepted.size) markSynced();
  return { sent: accepted.size, ok: accepted.size === pending.length };
}
