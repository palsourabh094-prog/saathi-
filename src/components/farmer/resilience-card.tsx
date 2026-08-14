"use client";

import { FlaskConical, Thermometer, TrendingDown, TrendingUp, Wheat } from "lucide-react";
import { useFarmerData } from "@/components/farmer/use-farmer-data";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";

const DRIVER_ICONS: Record<string, React.ReactNode> = {
  heat: <Thermometer className="h-4 w-4" />,
  "workload-mid": <Wheat className="h-4 w-4" />,
  workload: <Wheat className="h-4 w-4" />,
  health: <FlaskConical className="h-4 w-4" />,
};

export function ResilienceCard() {
  const { resilience } = useFarmerData();
  const ringColor =
    resilience.score >= 70
      ? "#417052"
      : resilience.score >= 50
        ? "#b97a1f"
        : "#b0402c";

  return (
    <Card className="animate-fade-up">
      <CardBody>
        <CardHeader>
          <div>
            <CardTitle>Household Resilience</CardTitle>
            <p className="mt-0.5 text-xs text-charcoal-500">
              Health + environment + farm workload, together
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
              resilience.level === "declining"
                ? "border-amber-300 bg-amber-100 text-amber-700"
                : resilience.level === "improving"
                  ? "border-agri-200 bg-agri-100 text-agri-700"
                  : "border-charcoal-200 bg-charcoal-100 text-charcoal-600"
            }`}
          >
            {resilience.level === "declining" ? (
              <TrendingDown className="h-3.5 w-3.5" />
            ) : (
              <TrendingUp className="h-3.5 w-3.5" />
            )}
            {resilience.level.charAt(0).toUpperCase() + resilience.level.slice(1)}
          </span>
        </CardHeader>

        <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <ProgressRing value={resilience.score} color={ringColor} size={148}>
            <span className="font-display text-4xl font-bold tabular text-charcoal-900">
              {resilience.score}
            </span>
            <span className="text-[11px] font-semibold text-charcoal-400">/ 100</span>
          </ProgressRing>

          <div className="flex-1 self-stretch">
            <p className="text-sm font-semibold text-charcoal-800">
              Your household is facing{" "}
              {resilience.score < 70
                ? "higher-than-usual combined pressure today."
                : "a balanced day."}
            </p>
            <div className="mt-3 space-y-2">
              {resilience.drivers.length > 0 ? (
                resilience.drivers.map((d) => (
                  <div
                    key={d.key}
                    className="flex items-center gap-2.5 rounded-xl bg-charcoal-50 px-3 py-2 text-[13px] text-charcoal-700"
                  >
                    <span className="text-agri-700">{DRIVER_ICONS[d.key]}</span>
                    <span className="font-medium">{d.label}</span>
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-charcoal-500">
                  No major pressure drivers right now.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="mt-5 rounded-xl bg-charcoal-50 px-3.5 py-2.5 text-[12px] leading-relaxed text-charcoal-500">
          Resilience is a prototype decision-support signal — it is not a
          judgement of you or your family, and it is not medical advice.
        </p>
      </CardBody>
    </Card>
  );
}
