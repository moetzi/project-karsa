// IndexedDB-backed text-only draft store for journal entries.
// Photos are NOT stored here — drafts are intended to be completed when back online.

const DB_NAME = "karsa-drafts";
const STORE = "journal_drafts";
const DB_VERSION = 1;

export type JournalDraft = {
  campaign_id: string; // primary key
  menu: string;
  story: string;
  mood: string | null;
  attendance: string;
  savedAt: number;
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
        db.createObjectStore(STORE, { keyPath: "campaign_id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveDraft(d: JournalDraft): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(d);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore: drafts are best-effort
  }
}

export async function getDraft(campaign_id: string): Promise<JournalDraft | null> {
  try {
    const db = await openDB();
    return await new Promise<JournalDraft | null>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(campaign_id);
      req.onsuccess = () => resolve((req.result as JournalDraft) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function deleteDraft(campaign_id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(campaign_id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}

export async function listDrafts(): Promise<JournalDraft[]> {
  try {
    const db = await openDB();
    return await new Promise<JournalDraft[]>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => {
        const all = (req.result as JournalDraft[]) ?? [];
        all.sort((a, b) => b.savedAt - a.savedAt);
        resolve(all);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}
