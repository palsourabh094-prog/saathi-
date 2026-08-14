import { enqueueRecord, getAllPending, removeRecord } from "@/lib/offline/db";
import type { SyncRecord } from "@/lib/types";

/**
 * SYNC ORCHESTRATOR
 * ---------------------------------------------------------------
 * When the network returns, queued offline actions are pushed to the
 * (mock) backend one by one, then marked synced. The UI shows a real
 * SYNCING → SYNC COMPLETE transition driven by this module.
 */

export async function pushToBackend(_record: SyncRecord): Promise<void> {
  // Mock backend write — in production this posts to the FHIR/AgriStack adapter.
  await new Promise((r) => setTimeout(r, 450 + Math.random() * 350));
  if (Math.random() > 0.98) {
    throw new Error("simulated transient failure");
  }
}

export async function flushSyncQueue(
  onProgress?: (done: number, total: number) => void,
): Promise<{ synced: number; failed: number }> {
  const pending = await getAllPending();
  let synced = 0;
  let failed = 0;

  for (let i = 0; i < pending.length; i++) {
    const record = pending[i];
    try {
      await pushToBackend(record);
      await removeRecord(record.id);
      synced += 1;
    } catch {
      failed += 1;
    }
    onProgress?.(i + 1, pending.length);
  }
  return { synced, failed };
}

export async function queueAction(
  type: SyncRecord["type"],
  payload: Record<string, unknown>,
): Promise<SyncRecord> {
  const record: SyncRecord = {
    id: crypto.randomUUID(),
    type,
    payload,
    createdAt: new Date().toISOString(),
  };
  await enqueueRecord(record);
  return record;
}
