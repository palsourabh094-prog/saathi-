"use client";

import { CalendarClock } from "lucide-react";
import { useAgriData } from "@/components/agri/use-agri-data";
import { Card, CardBody } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";

export default function ActivitiesPage() {
  const { upcoming } = useAgriData();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-3xl">
          Upcoming activities
        </h1>
        <p className="mt-1 text-sm text-charcoal-500">
          The season&apos;s calendar, with exposure risk priced in.
        </p>
      </div>

      <div className="space-y-2.5">
        {upcoming.map((a) => (
          <Card key={a.activity} className="animate-fade-up">
            <CardBody className="flex items-center justify-between gap-4 py-4">
              <div className="flex min-w-0 items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-charcoal-900 text-paper">
                  <CalendarClock className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14.5px] font-bold text-charcoal-800">{a.label}</p>
                    <RiskBadge level={a.riskLevel} />
                  </div>
                  <p className="mt-0.5 text-xs text-charcoal-500">{a.when}</p>
                </div>
              </div>
              <div className="hidden max-w-[46%] shrink-0 sm:block">
                <p className="text-right text-[12px] leading-snug text-charcoal-600">{a.note}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
