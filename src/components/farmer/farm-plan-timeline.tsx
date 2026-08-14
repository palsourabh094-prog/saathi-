"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  Coffee,
  Droplets,
  FlaskConical,
  Shovel,
  SprayCan,
  Sprout,
  Wheat,
  X,
} from "lucide-react";
import { useFarmerData } from "@/components/farmer/use-farmer-data";
import type { AdaptivePlanItem } from "@/lib/intelligence/adaptive-plan";
import { Card, CardBody } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";

const ICONS: Record<string, React.ReactNode> = {
  irrigation: <Droplets className="h-[18px] w-[18px]" />,
  fertilizer: <FlaskConical className="h-[18px] w-[18px]" />,
  pesticide: <SprayCan className="h-[18px] w-[18px]" />,
  "field-work": <Shovel className="h-[18px] w-[18px]" />,
  harvest: <Wheat className="h-[18px] w-[18px]" />,
  sowing: <Sprout className="h-[18px] w-[18px]" />,
  rest: <Coffee className="h-[18px] w-[18px]" />,
};

export function FarmPlanTimeline({ compact = false }: { compact?: boolean }) {
  const { adaptedPlan, heatwaveActive } = useFarmerData();
  const [whyOpen, setWhyOpen] = useState<string | null>(null);
  const plan = compact ? adaptedPlan.slice(0, 3) : adaptedPlan;

  return (
    <Card className="animate-fade-up">
      <CardBody className={compact ? "p-5" : ""}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-[17px] font-semibold tracking-tight text-charcoal-900">
              Today&apos;s farm plan
            </h3>
            <p className="text-xs text-charcoal-500">
              {heatwaveActive
                ? "Adapted around today's heatwave — one task moved to a safer window"
                : "Planned for today · Dharampura, 2 acres cotton"}
            </p>
          </div>
          {heatwaveActive && (
            <span className="rounded-full bg-agri-100 px-2.5 py-1 text-[10px] font-bold tracking-wide text-agri-700 uppercase">
              Adaptive
            </span>
          )}
        </div>

        <ol className="relative space-y-1">
          {plan.map((item, idx) => (
            <TimelineItem
              key={item.id}
              item={item}
              last={idx === plan.length - 1}
              whyOpen={whyOpen === item.id}
              onToggleWhy={() => setWhyOpen(whyOpen === item.id ? null : item.id)}
            />
          ))}
        </ol>

        {compact && (
          <p className="mt-3 text-center text-xs font-semibold text-charcoal-400">
            View full day in Farm Plan →
          </p>
        )}
      </CardBody>
    </Card>
  );
}

function TimelineItem({
  item,
  last,
  whyOpen,
  onToggleWhy,
}: {
  item: AdaptivePlanItem;
  last: boolean;
  whyOpen: boolean;
  onToggleWhy: () => void;
}) {
  const flagged = item.status === "flagged";
  const moved = item.status === "moved";

  return (
    <li className="relative flex gap-3.5 pb-1">
      {/* rail */}
      {!last && (
        <span
          className={`absolute top-9 left-[19px] bottom-0 w-px ${flagged ? "bg-red-200" : moved ? "bg-agri-300" : "bg-paper-line"}`}
        />
      )}

      {/* icon node */}
      <span
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
          flagged
            ? "border-red-200 bg-red-50 text-red-700"
            : moved
              ? "border-agri-200 bg-agri-100 text-agri-700"
              : "border-paper-line bg-white text-charcoal-600"
        }`}
      >
        {ICONS[item.activity]}
        {flagged && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-600 text-white">
            <X className="h-3 w-3" />
          </span>
        )}
        {moved && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-agri-600 text-white">
            <Check className="h-3 w-3" />
          </span>
        )}
      </span>

      <div className={`min-w-0 flex-1 rounded-xl px-3.5 py-2.5 ${flagged ? "bg-red-50/70" : moved ? "bg-agri-50" : ""}`}>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] font-bold tabular text-charcoal-800">
              {formatHour(item.hour)}
            </span>
            <span className="text-sm font-semibold text-charcoal-700">
              {label(item.activity)}
            </span>
            {item.originalHour !== undefined && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-charcoal-400">
                <ArrowRight className="h-3 w-3" />
                from {formatHour(item.originalHour)}
              </span>
            )}
          </div>
          {flagged && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
              HIGH RISK
            </span>
          )}
          {moved && (
            <span className="inline-flex items-center gap-1 rounded-full bg-agri-600 px-2 py-0.5 text-[10px] font-bold text-white">
              SAFER WINDOW
            </span>
          )}
          {item.status === "ok" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-agri-100 px-2 py-0.5 text-[10px] font-bold text-agri-700">
              <Check className="h-3 w-3" /> RECOMMENDED
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <RiskBadge level={item.riskLevel} />
          {item.status === "moved" && (
            <span className="text-[11px] font-semibold text-agri-700">
              {item.why?.split(".")[0]}.
            </span>
          )}
          {(flagged || moved) && (
            <button
              onClick={onToggleWhy}
              className="text-[11px] font-bold text-charcoal-500 underline-offset-2 hover:underline"
            >
              Why?
            </button>
          )}
        </div>

        {whyOpen && item.why && (
          <p className="mt-2 rounded-lg bg-white/80 px-3 py-2 text-[12px] leading-relaxed text-charcoal-600 animate-fade-in">
            {item.why}
          </p>
        )}
      </div>
    </li>
  );
}

function formatHour(hour: number) {
  const h = Math.floor(hour);
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${String(display).padStart(2, "0")}:00 ${suffix}`;
}

function label(a: string) {
  const map: Record<string, string> = {
    irrigation: "Irrigation",
    fertilizer: "Fertiliser",
    pesticide: "Pesticide spraying",
    "field-work": "Field work",
    harvest: "Harvest",
    sowing: "Sowing",
    rest: "Rest",
  };
  return map[a] ?? a;
}
