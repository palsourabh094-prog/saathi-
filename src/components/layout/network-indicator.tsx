"use client";

import { Check, WifiOff, RefreshCw } from "lucide-react";
import { useSaathi } from "@/lib/store";

export function NetworkIndicator() {
  const realOnline = useSaathi((s) => s.realOnline);
  const simulatedOffline = useSaathi((s) => s.simulatedOffline);
  const syncState = useSaathi((s) => s.syncState);

  const offline = !realOnline || simulatedOffline;

  if (syncState === "syncing") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        SYNCING
      </span>
    );
  }

  if (syncState === "complete") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-agri-200 bg-agri-100 px-2.5 py-1 text-[11px] font-semibold text-agri-700">
        <Check className="h-3.5 w-3.5" />
        SYNC COMPLETE
      </span>
    );
  }

  if (offline) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700 animate-pulse-soft">
        <WifiOff className="h-3.5 w-3.5" />
        Offline Mode
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-agri-200 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-agri-700">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-agri-500 opacity-60 animate-ping-slow" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-agri-500" />
      </span>
      Connected
    </span>
  );
}
