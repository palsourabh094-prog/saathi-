"use client";

import { useFarmerData } from "@/components/farmer/use-farmer-data";
import { Card, CardBody } from "@/components/ui/card";
import { Sparkline } from "@/components/ui/sparkline";

export function RiskCurveCard() {
  const { curve, currentRisk } = useFarmerData();

  return (
    <Card className="animate-fade-up">
      <CardBody>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-[17px] font-semibold tracking-tight text-charcoal-900">
              Risk across the day
            </h3>
            <p className="text-xs text-charcoal-500">
              Estimated exposure for pesticide work · 5 AM – 9 PM
            </p>
          </div>
          <span className="rounded-full bg-charcoal-100 px-2.5 py-1 text-[10px] font-bold text-charcoal-500">
            Safer: {currentRisk.recommendedWindow.label}
          </span>
        </div>

        <div className="mt-4">
          <Sparkline points={curve.map((c) => c.score)} />
        </div>

        <div className="mt-2 grid grid-cols-9 gap-1">
          {curve.map((c) => (
            <div key={c.hour} className="text-center">
              <div className="mx-auto h-2 w-2 rounded-full" style={{ background: dotColor(c.level) }} />
              <p className="mt-1 text-[9.5px] font-semibold text-charcoal-400">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 text-[11px] font-semibold text-charcoal-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-agri-500" /> Low
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Moderate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-600" /> High
          </span>
          <span className="ml-auto">Prototype risk model — not clinical data</span>
        </div>
      </CardBody>
    </Card>
  );
}

function dotColor(level: string) {
  switch (level) {
    case "LOW":
      return "#528563";
    case "MODERATE":
      return "#d6933a";
    case "HIGH":
      return "#b0402c";
    default:
      return "#7d2a1d";
  }
}
