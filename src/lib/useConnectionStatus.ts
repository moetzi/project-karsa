import { useEffect, useState } from "react";

export type ConnectionState = "online" | "offline" | "syncing";

let inflight = 0;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function beginSync() {
  inflight += 1;
  notify();
}

export function endSync() {
  inflight = Math.max(0, inflight - 1);
  notify();
}

export async function withSync<T>(fn: () => Promise<T>): Promise<T> {
  beginSync();
  try {
    return await fn();
  } finally {
    endSync();
  }
}

export function useConnectionStatus(): ConnectionState {
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [syncing, setSyncing] = useState(inflight > 0);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    const tick = () => setSyncing(inflight > 0);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    listeners.add(tick);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      listeners.delete(tick);
    };
  }, []);

  if (!online) return "offline";
  if (syncing) return "syncing";
  return "online";
}
