import { useSyncExternalStore } from "react";

type ClosedMap = Record<string, { closedAt: number }>;

const KEY = "karsa-closed-campaigns";
const listeners = new Set<() => void>();
let state: ClosedMap = load();
const EMPTY_CLOSED_MAP: ClosedMap = {};

function load(): ClosedMap {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ClosedMap) : {};
  } catch { return {}; }
}
function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }
function emit() { listeners.forEach((l) => l()); }
function subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb); }

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) { state = load(); emit(); }
  });
}

export function closeCampaignLocal(campaignId: string) {
  if (state[campaignId]) return;
  state = { ...state, [campaignId]: { closedAt: Date.now() } };
  persist();
  emit();
}

export function useCampaignClosed(campaignId: string): { closedAt: number } | null {
  return useSyncExternalStore(
    subscribe,
    () => state[campaignId] ?? null,
    () => null,
  );
}

export function useClosedMap(): ClosedMap {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY_CLOSED_MAP,
  );
}
