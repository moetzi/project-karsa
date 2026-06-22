import { useSyncExternalStore } from "react";

export type JournalEntry = {
  id: string;
  campaignId: string;
  campaignTitle: string;
  campaignTitleEn: string;
  school: string;
  photos: string[];
  menu: string;
  story: string;
  mood: string | null;
  attendance: string;
  createdAt: number;
};

const STORAGE_KEY = "karsa.journals.v1";

let entries: JournalEntry[] = load();
const listeners = new Set<() => void>();

function load(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* ignore */
  }
}

function emit() {
  for (const l of listeners) l();
}

export function addJournal(entry: Omit<JournalEntry, "id" | "createdAt">) {
  const full: JournalEntry = {
    ...entry,
    id: `j_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
  };
  entries = [full, ...entries];
  persist();
  emit();
  return full;
}

export function getJournalsByCampaign(campaignId: string) {
  return entries.filter((e) => e.campaignId === campaignId);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useJournals(campaignId: string) {
  return useSyncExternalStore(
    subscribe,
    () => entries.filter((e) => e.campaignId === campaignId),
    () => [] as JournalEntry[],
  );
}

export function formatRelative(ts: number, lang: "id" | "en" = "id") {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return lang === "id" ? "baru saja" : "just now";
  if (m < 60) return lang === "id" ? `${m} mnt lalu` : `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return lang === "id" ? `${h} jam lalu` : `${h}h ago`;
  const d = Math.floor(h / 24);
  return lang === "id" ? `${d} hari lalu` : `${d}d ago`;
}
