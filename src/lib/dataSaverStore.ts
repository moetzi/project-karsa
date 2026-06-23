import { useEffect, useState } from "react";

const KEY = "karsa.dataSaver";

type Listener = (v: boolean) => void;
const listeners = new Set<Listener>();

function read(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setDataSaver(v: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(v));
}

export function useDataSaver(): [boolean, (v: boolean) => void] {
  const [v, setV] = useState(false);
  useEffect(() => {
    setV(read());
    const l: Listener = (next) => setV(next);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return [v, setDataSaver];
}
