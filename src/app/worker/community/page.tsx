"use client";

import { CommunityRadar } from "@/components/worker/community-radar";

export default function CommunityPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-3xl">
          Community risk radar
        </h1>
        <p className="mt-1 max-w-xl text-sm text-charcoal-500">
          Individual signals become household pressures, and household pressures
          become village patterns — early enough to act.
        </p>
      </div>
      <CommunityRadar />
    </div>
  );
}
