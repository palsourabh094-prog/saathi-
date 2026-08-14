"use client";

import { ShieldAlert } from "lucide-react";
import { useFarmerData } from "@/components/farmer/use-farmer-data";
import { Card, CardBody } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";
import { SYMPTOM_LABELS } from "@/lib/format";
import { timeAgo } from "@/lib/format";

export function HealthSignals() {
  const { reportedSymptoms, heatwaveActive, env } = useFarmerData();

  if (reportedSymptoms.length === 0) {
    return (
      <Card className="animate-fade-up">
        <CardBody>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal-100 text-charcoal-500">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-[17px] font-semibold tracking-tight text-charcoal-900">
                Health signals
              </h3>
              <p className="text-xs text-charcoal-500">
                No active signals. Report how you feel and SAATHI will flag
                elevated occupational-health risk if the context warrants it.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  const latest = reportedSymptoms[0];
  const high = ["dizziness", "breathing", "weakness"].includes(latest.symptom);

  return (
    <Card className={`animate-fade-up ${high ? "border-red-100" : ""}`}>
      <CardBody>
        <div className="flex items-center justify-between gap-3">
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
                Elevated occupational-health risk signal
              </h3>
              <p className="text-xs text-charcoal-500">
                {SYMPTOM_LABELS[latest.symptom]} reported · {timeAgo(latest.reportedAt)}
                {latest.storedOffline ? " · stored offline" : ""}
              </p>
            </div>
          </div>
          <RiskBadge level={high ? "HIGH" : "MODERATE"} />
        </div>

        <div className="mt-4 rounded-xl bg-charcoal-50 px-4 py-3.5">
          <p className="text-[11px] font-bold tracking-wide text-charcoal-500 uppercase">
            Why this signal
          </p>
          <ul className="mt-2 space-y-1.5 text-[13px] text-charcoal-700">
            <li>· Recent agricultural activity (pesticide exposure context)</li>
            <li>· Environmental conditions ({env.temperature}°C, {env.humidity}% humidity{heatwaveActive ? ", heatwave advisory" : ""})</li>
            <li>· Reported symptom: {SYMPTOM_LABELS[latest.symptom]}</li>
          </ul>
        </div>

        <p className="mt-4 text-[13px] font-semibold text-charcoal-800">
          Action: consider contacting your health worker / appropriate clinical
          service.
        </p>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-charcoal-500">
          This is an estimated risk signal for planning — not a diagnosis.
          {latest.transcript && ` Voice note: “${latest.transcript}”`}
        </p>
      </CardBody>
    </Card>
  );
}
