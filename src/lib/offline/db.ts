import { openDB, type IDBPDatabase } from "idb";
import type { SyncRecord } from "@/lib/types";

/**
 * OFFLINE STORAGE (IndexedDB)
 * ---------------------------------------------------------------
 * Real local persistence for offline operation:
 *  - `queue`: user actions recorded while offline (activities, symptoms)
 *  - `cache`: environment / advisory snapshot so risk still computes offline
 */

const DB_NAME = "saathi-offline";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("queue")) {
          db.createObjectStore("queue", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("cache")) {
          db.createObjectStore("cache");
        }
      },
    });
  }
  return dbPromise;
}

export async function enqueueRecord(record: SyncRecord): Promise<void> {
  const db = await getDb();
  await db.put("queue", record);
}

export async function getAllPending(): Promise<SyncRecord[]> {
  const db = await getDb();
  return db.getAll("queue");
}

export async function removeRecord(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("queue", id);
}

export async function clearQueue(): Promise<void> {
  const db = await getDb();
  await db.clear("queue");
}

export async function cachePut(key: string, value: unknown): Promise<void> {
  const db = await getDb();
  await db.put("cache", value, key);
}

export async function cacheGet<T>(key: string): Promise<T | undefined> {
  const db = await getDb();
  return db.get("cache", key);
}

export async function cacheDelete(key: string): Promise<void> {
  const db = await getDb();
  await db.delete("cache", key);
}
