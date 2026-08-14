"use client";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useAgriData } from "@/components/agri/use-agri-data";
import { Card, CardBody } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";

export default function RiskPage() {
  const { recommendation, upcoming } = useAgriData();
  const high = recommendation.tone === "high";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-3xl">
          Risk-aware recommendations
        </h1>
        <p className="mt-1 max-w-xl text-sm text-charcoal-500">
          Advice your teams can act on — the same signals the farmer and the
          health worker see.
        </p>
      </div>

      <Card className={`animate-fade-up ${high ? "border-amber-200" : "border-agri-200"}`}>
        <CardBody>
          <div className="flex items-start gap-3">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                high ? "bg-amber-100 text-amber-700" : "bg-agri-100 text-agri-700"
              }`}
            >
              {high ? <ShieldAlert className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </span>
            <div>
              <p className="text-[15px] font-bold text-charcoal-900">{recommendation.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-charcoal-600">
                {recommendation.body}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="animate-fade-up">
        <CardBody>
          <p className="text-[11px] font-bold tracking-wide text-charcoal-500 uppercase">
            Activity-level risk today
          </p>
          <div className="mt-3 space-y-2">
            {upcoming.map((a) => (
              <div key={a.activity} className="flex items-center justify-between rounded-xl border border-paper-line px-4 py-3">
                <span className="text-[13px] font-semibold text-charcoal-700">{a.label}</span>
                <span className="flex items-center gap-2">
                  <span className="font-bold tabular text-charcoal-500">{a.riskScore}</span>
                  <RiskBadge level={a.riskLevel} />
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] text-charcoal-400">
            Prototype risk model — deterministic, transparent and testable, not
            clinically validated.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
