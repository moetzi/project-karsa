import { useSyncExternalStore } from "react";

// Real reach tracking: per-campaign views/shares/boosts persisted in localStorage.
// Display layer adds these to the baseline numbers shown on the card.

type ReachMap = Record<string, { views: number; shares: number; boosts: number }>;
const KEY = "karsa-reach";
const SESSION_VIEW_KEY = "karsa-reach-viewed"; // per-session de-dupe

const listeners = new Set<() => void>();
let data: ReachMap = load();

function load(): ReachMap {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function persist() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} }
function emit() { listeners.forEach((l) => l()); }

function ensure(id: string) {
  if (!data[id]) data[id] = { views: 0, shares: 0, boosts: 0 };
}

export function trackView(id: string) {
  try {
    const seen: string[] = JSON.parse(sessionStorage.getItem(SESSION_VIEW_KEY) || "[]");
    if (seen.includes(id)) return;
    seen.push(id);
    sessionStorage.setItem(SESSION_VIEW_KEY, JSON.stringify(seen));
  } catch {}
  ensure(id);
  data = { ...data, [id]: { ...data[id], views: data[id].views + 1 } };
  persist(); emit();
}

export function trackShare(id: string) {
  ensure(id);
  data = { ...data, [id]: { ...data[id], shares: data[id].shares + 1 } };
  persist(); emit();
}

export function toggleBoost(id: string, on: boolean) {
  ensure(id);
  const cur = data[id].boosts;
  data = { ...data, [id]: { ...data[id], boosts: Math.max(0, cur + (on ? 1 : -1)) } };
  persist(); emit();
}

const EMPTY = { views: 0, shares: 0, boosts: 0 };
const cache = new Map<string, { src: ReachMap; out: typeof EMPTY }>();
function snap(id: string) {
  const c = cache.get(id);
  if (c && c.src === data) return c.out;
  const out = data[id] || EMPTY;
  cache.set(id, { src: data, out });
  return out;
}

export function useReach(id: string) {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => snap(id),
    () => EMPTY,
  );
}
