"use client";

import { PhoneCall } from "lucide-react";
import { useWorkerData } from "@/components/worker/use-worker-data";
import { Card, CardBody } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";
import { ACTIVITY_LABELS } from "@/lib/format";
import { toast } from "@/components/ui/toast";

export default function PriorityPage() {
  const { priorityCases, rameshLevel, env, heatwaveActive, symptoms } = useWorkerData();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-3xl">
          Priority cases
        </h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Sorted by risk signal — the information a health worker needs, without
          exposing unnecessary health data.
        </p>
      </div>

      {/* Ramesh — the canonical demo case */}
      <Card className="border-red-100 animate-fade-up">
        <CardBody>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <PhoneCall className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-bold text-charcoal-900">Ramesh Kumar</p>
                  <RiskBadge level={rameshLevel} />
                </div>
                <p className="mt-0.5 text-xs text-charcoal-500">
                  North Field Cluster · Cotton · 2 acres
                </p>
              </div>
            </div>
            <button
              onClick={() => toast("success", "Follow-up marked. Ramesh will see a care reminder.")}
              className="rounded-xl bg-agri-700 px-4 py-2 text-[12px] font-bold text-white hover:bg-agri-800"
            >
              Mark follow-up
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-charcoal-50 px-4 py-3.5">
            <p className="text-[11px] font-bold tracking-wide text-charcoal-500 uppercase">Reason</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-charcoal-700">
              Recent agricultural exposure (pesticide) +{" "}
              {symptoms.length > 0 ? "reported dizziness" : "planned pesticide activity"} + heat
              conditions ({env.temperature}°C{heatwaveActive ? ", heatwave advisory" : ""})
            </p>
          </div>

          <div className="mt-3 rounded-xl border border-agri-200 bg-agri-50 px-4 py-3">
            <p className="text-[13px] font-semibold text-agri-800">Action</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-agri-700">
              Follow-up recommended — share heat-safety guidance and the safe work
              window for today.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Other cases */}
      <Card className="animate-fade-up">
        <CardBody>
          <h3 className="font-display text-[17px] font-semibold tracking-tight text-charcoal-900">
            Other elevated cases
          </h3>
          <div className="mt-3 space-y-2">
            {priorityCases
              .filter((c) => c.householdId !== "hh-ramesh")
              .map((c) => (
                <div
                  key={c.householdId}
                  className="flex items-center justify-between gap-3 rounded-xl border border-paper-line px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13.5px] font-bold text-charcoal-800">{c.headName}</p>
                      <RiskBadge level={c.riskLevel} />
                    </div>
                    <p className="mt-0.5 truncate text-[11.5px] text-charcoal-500">
                      {c.clusterId === "north-field" ? "North Field" : c.clusterId === "east-well" ? "East Well" : c.clusterId === "riverside" ? "Riverside" : "Market Road"} ·{" "}
                      {ACTIVITY_LABELS[c.activity]} · {c.crop}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-charcoal-100 px-2.5 py-1 text-[10.5px] font-bold text-charcoal-500">
                    risk {c.riskScore}
                  </span>
                </div>
              ))}
            {priorityCases.filter((c) => c.householdId !== "hh-ramesh").length === 0 && (
              <p className="rounded-xl bg-charcoal-50 px-4 py-5 text-center text-sm text-charcoal-500">
                No other elevated cases right now.
              </p>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
