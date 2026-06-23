import { useSyncExternalStore } from "react";

export type JournalEntry = {
  id: string;
  campaignId: string;
  menu: string;
  story: string;
  mood: string | null;
  attendance: number | null;
  photos: string[]; // data URLs or signed URLs
  kind: "daily" | "closing";
  createdAt: number;
};

const KEY = "karsa-journals";
const listeners = new Set<() => void>();
let entries: JournalEntry[] = load();

function load(): JournalEntry[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(entries)); } catch {}
}

function emit() { listeners.forEach((l) => l()); }

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) { entries = load(); emit(); }
  });
}

export function addJournal(j: Omit<JournalEntry, "id" | "createdAt">) {
  const entry: JournalEntry = { ...j, id: crypto.randomUUID(), createdAt: Date.now() };
  entries = [entry, ...entries];
  persist();
  emit();
  return entry;
}

const snapCache = new Map<string, { src: JournalEntry[]; out: JournalEntry[] }>();
function snap(campaignId: string): JournalEntry[] {
  const c = snapCache.get(campaignId);
  if (c && c.src === entries) return c.out;
  const out = entries.filter((e) => e.campaignId === campaignId);
  snapCache.set(campaignId, { src: entries, out });
  return out;
}

const EMPTY: JournalEntry[] = [];

export function useJournals(campaignId: string): JournalEntry[] {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => snap(campaignId),
    () => EMPTY,
  );
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
