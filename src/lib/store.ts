"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  EnvironmentState,
  FarmPlanItem,
  Role,
  SymptomId,
  SymptomReport,
} from "@/lib/types";
import { seedFarmPlan } from "@/lib/data/seed";
import { queueAction } from "@/lib/offline/sync";
import { cachePut } from "@/lib/offline/db";

/**
 * SAATHI CLIENT STORE
 * ---------------------------------------------------------------
 * Single source of truth for the prototype demo: role, environment,
 * farm plan, symptom reports, and offline/sync lifecycle. Persisted to
 * localStorage so a refresh keeps the demo state.
 */

export const DEFAULT_ENV: EnvironmentState = {
  temperature: 32,
  humidity: 62,
  windKmh: 9,
  condition: "clear",
  hourlyTemp: {
    5: 26, 6: 27, 7: 28, 8: 30, 9: 31, 10: 32, 11: 33, 12: 33, 13: 33, 14: 34,
    15: 34, 16: 33, 17: 32, 18: 31, 19: 29, 20: 28, 21: 28,
  },
  hourlyHumidity: {
    5: 90, 6: 88, 7: 85, 8: 82, 9: 78, 10: 75, 11: 72, 12: 68, 13: 66, 14: 65,
    15: 64, 16: 66, 17: 68, 18: 70, 19: 72, 20: 75, 21: 78,
  },
};

export const HEATWAVE_ENV: EnvironmentState = {
  temperature: 39,
  humidity: 74,
  windKmh: 4,
  condition: "heatwave",
  hourlyTemp: {
    5: 28, 6: 29, 7: 30, 8: 31.5, 9: 33, 10: 34, 11: 36, 12: 37, 13: 39, 14: 39,
    15: 39, 16: 37, 17: 34, 18: 32, 19: 31, 20: 30, 21: 29,
  },
  hourlyHumidity: {
    5: 88, 6: 85, 7: 82, 8: 80, 9: 74, 10: 74, 11: 72, 12: 70, 13: 74, 14: 73,
    15: 72, 16: 69, 17: 66, 18: 67, 19: 68, 20: 70, 21: 74,
  },
};

export type SyncState = "idle" | "offline" | "syncing" | "complete";

interface SaathiState {
  role: Role | null;
  setRole: (role: Role | null) => void;

  demoMode: boolean;
  toggleDemoMode: () => void;
  demoStep: number;
  setDemoStep: (step: number) => void;

  env: EnvironmentState;
  heatwaveActive: boolean;
  simulateHeatwave: () => void;
  clearHeatwave: () => void;

  farmPlan: FarmPlanItem[];
  setFarmPlan: (plan: FarmPlanItem[]) => void;

  symptoms: SymptomReport[];
  reportSymptom: (symptom: SymptomId, note?: string, transcript?: string) => void;
  resetSymptoms: () => void;

  /** locally-recorded actions pending sync (activities recorded offline) */
  offlineActions: Array<{ id: string; label: string; at: string }>;
  addOfflineAction: (label: string) => void;

  /** real navigator online status + demo-forced offline */
  realOnline: boolean;
  setRealOnline: (online: boolean) => void;
  simulatedOffline: boolean;
  goOffline: () => void;

  syncState: SyncState;
  syncProgress: number;
  syncTotal: number;
  restoreNetwork: () => Promise<void>;
  resetSync: () => void;

  resetDemo: () => void;
}

export const useSaathi = create<SaathiState>()(
  persist(
    (set, get) => ({
      role: null,
      setRole: (role) => set({ role }),

      demoMode: false,
      toggleDemoMode: () => set((s) => ({ demoMode: !s.demoMode })),
      demoStep: 0,
      setDemoStep: (demoStep) => set({ demoStep }),

      env: DEFAULT_ENV,
      heatwaveActive: false,
      simulateHeatwave: () => {
        set({ env: HEATWAVE_ENV, heatwaveActive: true, demoStep: Math.max(get().demoStep, 1) });
        cachePut("env", HEATWAVE_ENV).catch(() => {});
      },
      clearHeatwave: () =>
        set({ env: DEFAULT_ENV, heatwaveActive: false, demoStep: Math.max(get().demoStep, 0) }),

      farmPlan: seedFarmPlan.map((i) => ({ ...i })),
      setFarmPlan: (farmPlan) => set({ farmPlan }),

      symptoms: [],
      reportSymptom: (symptom, note, transcript) => {
        const offline = !get().realOnline || get().simulatedOffline;
        const report: SymptomReport = {
          id: crypto.randomUUID(),
          householdId: "hh-ramesh",
          symptom,
          note,
          transcript,
          reportedAt: new Date().toISOString(),
          storedOffline: offline,
        };
        set((s) => ({ symptoms: [report, ...s.symptoms], demoStep: Math.max(s.demoStep, 2) }));
        if (offline) {
          queueAction("symptom", report as unknown as Record<string, unknown>).catch(() => {});
        }
      },
      resetSymptoms: () => set({ symptoms: [] }),

      offlineActions: [],
      addOfflineAction: (label) => {
        const action = { id: crypto.randomUUID(), label, at: new Date().toISOString() };
        set((s) => ({ offlineActions: [...s.offlineActions, action] }));
        queueAction("activity", action).catch(() => {});
      },

      realOnline: true,
      setRealOnline: (realOnline) => {
        const wasOffline = !realOnline;
        set({ realOnline });
        if (wasOffline && !get().simulatedOffline && get().syncState !== "syncing") {
          get().restoreNetwork();
        }
        if (!realOnline && get().syncState === "complete") {
          set({ syncState: "idle" });
        }
      },

      simulatedOffline: false,
      goOffline: () => {
        set({
          simulatedOffline: true,
          syncState: "offline",
          demoStep: Math.max(get().demoStep, 4),
        });
      },

      syncState: "idle",
      syncProgress: 0,
      syncTotal: 0,
      restoreNetwork: async () => {
        if (get().syncState === "syncing") return;
        const { flushSyncQueue } = await import("@/lib/offline/sync");
        const { getAllPending } = await import("@/lib/offline/db");
        const pending = await getAllPending();
        set({ simulatedOffline: false });
        // Nothing queued → nothing to sync (e.g. first page load).
        if (pending.length === 0) {
          set({ syncState: "idle", syncProgress: 0, syncTotal: 0 });
          return;
        }
        set({
          syncState: "syncing",
          demoStep: Math.max(get().demoStep, 5),
          syncProgress: 0,
          syncTotal: pending.length,
        });
        const { synced } = await flushSyncQueue((done) => {
          set({ syncProgress: done });
        });
        // brief hold so the "SYNC COMPLETE" state is visible
        await new Promise((r) => setTimeout(r, 900));
        set({ syncState: "complete", syncProgress: synced, syncTotal: pending.length });
      },
      resetSync: () => set({ syncState: "idle", syncProgress: 0, syncTotal: 0 }),

      resetDemo: () =>
        set({
          demoStep: 0,
          heatwaveActive: false,
          env: DEFAULT_ENV,
          farmPlan: seedFarmPlan.map((i) => ({ ...i })),
          symptoms: [],
          offlineActions: [],
          simulatedOffline: false,
          syncState: "idle",
          syncProgress: 0,
          syncTotal: 0,
        }),
    }),
    {
      name: "saathi-store",
      partialize: (s) => ({
        role: s.role,
        demoMode: s.demoMode,
        demoStep: s.demoStep,
        env: s.env,
        heatwaveActive: s.heatwaveActive,
        farmPlan: s.farmPlan,
        symptoms: s.symptoms,
        simulatedOffline: s.simulatedOffline,
        syncState: s.syncState,
      }),
    },
  ),
);

/** Effective connectivity: real network status AND demo-forced offline. */
export function useOffline() {
  return useSaathi((s) => !s.realOnline || s.simulatedOffline);
}

export function useSyncLabel() {
  return useSaathi((s) => s.syncState);
}

export const isOfflineState = (s: {
  realOnline: boolean;
  simulatedOffline: boolean;
}) => !s.realOnline || s.simulatedOffline;
