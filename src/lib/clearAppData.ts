import { clearSpeechCache } from "@/lib/speech";

/**
 * Wipe client-side app data on this device. Does not touch server-side progress
 * (including email-linked saves in Convex). Safe to call after signOut().
 */
export async function clearClientAppData(): Promise<void> {
  clearSpeechCache();

  try {
    localStorage.clear();
  } catch {
    /* private browsing or blocked storage */
  }

  try {
    sessionStorage.clear();
  } catch {
    /* ignore */
  }

  if (typeof indexedDB !== "undefined" && "databases" in indexedDB) {
    try {
      const databases = await indexedDB.databases();
      await Promise.all(
        databases.map(
          (db) =>
            new Promise<void>((resolve) => {
              if (!db.name) {
                resolve();
                return;
              }
              const request = indexedDB.deleteDatabase(db.name);
              request.onsuccess = () => resolve();
              request.onerror = () => resolve();
              request.onblocked = () => resolve();
            }),
        ),
      );
    } catch {
      /* ignore */
    }
  }

  if (typeof caches !== "undefined") {
    try {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    } catch {
      /* ignore */
    }
  }

  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    } catch {
      /* ignore */
    }
  }
}
