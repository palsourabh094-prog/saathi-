"use client";

import { FarmPlanTimeline } from "@/components/farmer/farm-plan-timeline";
import { RiskCurveCard } from "@/components/farmer/risk-curve-card";
import { SafeWindowCard } from "@/components/farmer/safe-window-card";
import { Card, CardBody } from "@/components/ui/card";
import { CloudSun } from "lucide-react";

export default function FarmPlanPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-3xl">
          Today&apos;s farm plan
        </h1>
        <p className="mt-1 text-sm text-charcoal-500">
          SAATHI doesn&apos;t just warn you — it helps redesign the work around
          your wellbeing.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <FarmPlanTimeline />
          <RiskCurveCard />
        </div>
        <div className="space-y-5 lg:col-span-2">
          <SafeWindowCard />
          <Card>
            <CardBody>
              <div className="flex items-center gap-2.5 text-charcoal-700">
                <CloudSun className="h-5 w-5 text-amber-600" />
                <p className="text-sm font-bold">Planning tips for today</p>
              </div>
              <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-charcoal-600">
                <li>· Start with irrigation before the heat builds.</li>
                <li>· Keep pesticide handling inside the recommended window.</li>
                <li>· Take a shaded rest every 60–90 minutes.</li>
                <li>· Carry water — conditions are warm today.</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
