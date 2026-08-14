"use client";

import { VillageOverview } from "@/components/worker/village-overview";

export default function WorkerHome() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-3xl">
          Village health overview
        </h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Dharampura · priority, context and action — nothing more.
        </p>
      </div>
      <VillageOverview />
    </div>
  );
}
