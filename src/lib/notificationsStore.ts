import { useSyncExternalStore } from "react";

export type AppNotification = {
  id: string;
  kind: "campaign_funded" | "info";
  title: string;
  body: string;
  campaignId?: string;
  createdAt: number;
  read: boolean;
};

const KEY = "karsa-notifications";
const listeners = new Set<() => void>();
let state: AppNotification[] = load();

function load(): AppNotification[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AppNotification[]) : [];
  } catch { return []; }
}
function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }
function emit() { listeners.forEach((l) => l()); }

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) { state = load(); emit(); }
  });
}

export function pushNotification(n: Omit<AppNotification, "createdAt" | "read">) {
  if (state.some((x) => x.id === n.id)) return;
  state = [{ ...n, createdAt: Date.now(), read: false }, ...state].slice(0, 50);
  persist();
  emit();
}

export function markAllRead() {
  if (state.every((n) => n.read)) return;
  state = state.map((n) => ({ ...n, read: true }));
  persist();
  emit();
}

export function markRead(id: string) {
  const idx = state.findIndex((n) => n.id === id);
  if (idx < 0 || state[idx].read) return;
  state = state.map((n) => (n.id === id ? { ...n, read: true } : n));
  persist();
  emit();
}

export function clearNotifications() {
  state = [];
  persist();
  emit();
}

export function useNotifications(): AppNotification[] {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
    () => [],
  );
}

export function useUnreadCount(): number {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state.filter((n) => !n.read).length,
    () => 0,
  );
}
