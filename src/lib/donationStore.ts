import { useSyncExternalStore } from "react";

export type Donation = {
  id: string;
  campaignId: string;
  campaignTitle: string;
  name: string;
  anonymous: boolean;
  amount: number;
  method: string;
  message?: string;
  createdAt: number;
};

const KEY = "karsa-donations";
const listeners = new Set<() => void>();
let entries: Donation[] = load();

function load(): Donation[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Donation[]) : [];
  } catch {
    return [];
  }
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(entries)); } catch {}
}

function emit() { listeners.forEach((l) => l()); }

export function addDonation(d: Omit<Donation, "id" | "createdAt">) {
  const entry: Donation = { ...d, id: crypto.randomUUID(), createdAt: Date.now() };
  entries = [entry, ...entries];
  persist();
  emit();
  return entry;
}

const snapCache = new Map<string, { src: Donation[]; out: Donation[] }>();
function snap(campaignId: string): Donation[] {
  const c = snapCache.get(campaignId);
  if (c && c.src === entries) return c.out;
  const out = entries.filter((e) => e.campaignId === campaignId);
  snapCache.set(campaignId, { src: entries, out });
  return out;
}

const EMPTY: Donation[] = [];

export function useDonations(campaignId: string): Donation[] {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => snap(campaignId),
    () => EMPTY,
  );
}

export function formatRelative(ts: number, lang: "id" | "en"): string {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60_000);
  if (m < 1) return lang === "en" ? "just now" : "baru saja";
  if (m < 60) return lang === "en" ? `${m} min ago` : `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return lang === "en" ? `${h} hr ago` : `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return lang === "en" ? `${d} d ago` : `${d} hr lalu`;
}
