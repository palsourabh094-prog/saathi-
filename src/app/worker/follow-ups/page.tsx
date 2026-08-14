"use client";

import { useState } from "react";
import { CheckCircle2, Circle, MapPin } from "lucide-react";
import { useWorkerData } from "@/components/worker/use-worker-data";
import { Card, CardBody } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";

export default function FollowUpsPage() {
  const { priorityCases } = useWorkerData();
  const [done, setDone] = useState<Set<string>>(new Set());

  const toggle = (id: string, name: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (!done.has(id)) toast("success", `Follow-up with ${name} marked complete.`);
  };

  const cases = priorityCases.filter((c) => c.householdId !== "hh-ramesh").slice(0, 6);
  const scheduled = [
    ...cases.map((c, i) => ({
      id: c.householdId,
      name: c.headName,
      detail: `${c.crop} farm · risk signal follow-up`,
      when: i % 2 === 0 ? "Today, 4:00 PM" : "Tomorrow, 9:30 AM",
      level: c.riskLevel,
      cluster: c.clusterId,
    })),
    {
      id: "hh-ramesh",
      name: "Ramesh Kumar",
      detail: "Reported symptom — priority follow-up",
      when: "Today, as soon as possible",
      level: "HIGH" as const,
      cluster: "north-field",
    },
  ].slice(0, 5);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-3xl">
          Follow-ups
        </h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Scheduled check-ins with households that need attention.
        </p>
      </div>

      <Card className="animate-fade-up">
        <CardBody>
          <div className="space-y-2">
            {scheduled.map((f) => {
              const isDone = done.has(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => toggle(f.id, f.name)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                    isDone
                      ? "border-agri-200 bg-agri-50 opacity-80"
                      : "border-paper-line bg-white hover:border-charcoal-300"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-agri-600" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-charcoal-300" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`truncate text-[13.5px] font-bold ${isDone ? "text-charcoal-400 line-through" : "text-charcoal-800"}`}>
                          {f.name}
                        </p>
                        <RiskBadge level={f.level} />
                      </div>
                      <p className="mt-0.5 truncate text-[11.5px] text-charcoal-500">{f.detail}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11.5px] font-bold text-charcoal-700">{f.when}</p>
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-[10.5px] text-charcoal-400">
                      <MapPin className="h-3 w-3" />
                      {f.cluster === "north-field" ? "North Field" : f.cluster === "east-well" ? "East Well" : f.cluster === "riverside" ? "Riverside" : "Market Road"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
