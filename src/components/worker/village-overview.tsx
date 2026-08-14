"use client";

import { ArrowRight, HeartPulse } from "lucide-react";
import Link from "next/link";
import { useWorkerData } from "@/components/worker/use-worker-data";
import { Card, CardBody } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";
import { ACTIVITY_LABELS } from "@/lib/format";

export function VillageOverview() {
  const { stats, priorityCases, heatwaveActive } = useWorkerData();
  const high = stats.HIGH + stats.SEVERE;

  return (
    <div className="space-y-5">
      {heatwaveActive && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 animate-fade-up">
          <HeartPulse className="h-5 w-5 shrink-0 text-amber-700" />
          <p className="text-[13px] font-semibold text-amber-800">
            Heatwave advisory active — elevated occupational-exposure signals
            across the village.
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 animate-fade-up">
        <Stat value={high} label="High priority" tone="red" />
        <Stat value={stats.MODERATE} label="Moderate" tone="amber" />
        <Stat value={stats.LOW} label="Normal" tone="green" />
      </div>

      <Card className="animate-fade-up">
        <CardBody>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-[17px] font-semibold tracking-tight text-charcoal-900">
                Priority cases
              </h3>
              <p className="text-xs text-charcoal-500">
                Risk signals needing attention — nothing more than necessary is shown.
              </p>
            </div>
            <Link
              href="/worker/priority"
              className="flex items-center gap-1 text-xs font-bold text-agri-700 hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {priorityCases.length === 0 && (
              <p className="rounded-xl bg-charcoal-50 px-4 py-6 text-center text-sm text-charcoal-500">
                No elevated signals right now.
              </p>
            )}
            {priorityCases.slice(0, 5).map((c) => (
              <div
                key={c.householdId}
                className="flex items-center justify-between gap-3 rounded-xl border border-paper-line bg-charcoal-50/50 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13.5px] font-bold text-charcoal-800">
                      {c.headName}
                    </p>
                    <RiskBadge level={c.riskLevel} />
                  </div>
                  <p className="mt-0.5 truncate text-[11.5px] text-charcoal-500">
                    {ACTIVITY_LABELS[c.activity]} · {c.crop} · risk {c.riskScore}
                    {c.reportedSymptom ? " · symptom reported" : ""}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] font-bold text-agri-700">
                  {c.reportedSymptom ? "Follow-up recommended" : "Monitor"}
                </span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "red" | "amber" | "green";
}) {
  const color =
    tone === "red"
      ? "text-red-700 bg-red-50 border-red-100"
      : tone === "amber"
        ? "text-amber-700 bg-amber-50 border-amber-200"
        : "text-agri-700 bg-agri-50 border-agri-200";
  return (
    <div className={`rounded-2xl border px-4 py-4 text-center ${color}`}>
      <p className="font-display text-3xl font-bold tabular">{value}</p>
      <p className="mt-0.5 text-[11px] font-bold tracking-wide uppercase opacity-80">
        {label}
      </p>
    </div>
  );
}
