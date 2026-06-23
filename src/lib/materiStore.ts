// IndexedDB-backed local store for generated materials (offline-first).
const DB_NAME = "karsa-materi";
const STORE = "materi";
const DB_VERSION = 1;

export type MateriFormat = "quiz" | "flashcard" | "slides";

export type StoredMateri = {
  id: string;
  format: MateriFormat;
  kelas: string;
  mapel: string;
  tujuan: string;
  konteks?: string;
  data: unknown;
  createdAt: number;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB tidak tersedia"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveMateri(m: Omit<StoredMateri, "id" | "createdAt">): Promise<StoredMateri> {
  const db = await openDB();
  const full: StoredMateri = {
    ...m,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add(full);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  return full;
}

export async function listMateri(): Promise<StoredMateri[]> {
  try {
    const db = await openDB();
    return await new Promise<StoredMateri[]>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => {
        const all = (req.result as StoredMateri[]) ?? [];
        all.sort((a, b) => b.createdAt - a.createdAt);
        resolve(all);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function deleteMateri(id: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getMateri(id: string): Promise<StoredMateri | null> {
  try {
    const db = await openDB();
    return await new Promise<StoredMateri | null>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(id);
      req.onsuccess = () => resolve((req.result as StoredMateri) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}
