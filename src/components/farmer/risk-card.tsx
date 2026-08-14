"use client";

import { Plus, ShieldAlert } from "lucide-react";
import { useFarmerData } from "@/components/farmer/use-farmer-data";
import { Card, CardBody } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";

export function RiskCard() {
  const { currentRisk } = useFarmerData();
  const high = currentRisk.riskScore >= 65;

  return (
    <Card className={`animate-fade-up ${high ? "border-red-100" : ""}`}>
      <CardBody>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                high ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-[17px] font-semibold tracking-tight text-charcoal-900">
                Estimated occupational risk
              </h3>
              <p className="text-xs text-charcoal-500">
                Pesticide spraying · planned {formatTime(currentRisk.hour)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-display text-4xl font-bold tabular text-charcoal-900">
              {currentRisk.riskScore}
            </span>
            <RiskBadge level={currentRisk.riskLevel} className="ml-2 align-middle" />
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          {currentRisk.drivers.map((d) => (
            <div
              key={d.key}
              className="flex items-center justify-between rounded-xl bg-charcoal-50 px-3.5 py-2.5"
            >
              <div>
                <p className="text-[13px] font-semibold text-charcoal-800">{d.label}</p>
                <p className="text-[11px] text-charcoal-500">{d.detail}</p>
              </div>
              <span className="flex items-center gap-0.5 text-sm font-bold tabular text-charcoal-800">
                <Plus className="h-3.5 w-3.5 text-charcoal-400" />
                {d.points}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-3">
          <span className="mt-0.5 text-amber-700">🛡️</span>
          <div>
            <p className="text-[13px] font-semibold text-amber-800">{currentRisk.recommendedAction}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-700">
              {currentRisk.disclaimer}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function formatTime(hour: number) {
  const h = Math.floor(hour);
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${suffix}`;
}
