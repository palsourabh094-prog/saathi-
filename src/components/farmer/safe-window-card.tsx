"use client";

import { CloudRain, Droplets, Sun, Timer } from "lucide-react";
import { useFarmerData } from "@/components/farmer/use-farmer-data";
import { Card, CardBody } from "@/components/ui/card";

export function SafeWindowCard() {
  const { currentRisk, env } = useFarmerData();
  const w = currentRisk.recommendedWindow;

  return (
    <Card className="overflow-hidden animate-fade-up">
      <div className="h-1.5 bg-gradient-to-r from-agri-700 via-agri-500 to-amber-500" />
      <CardBody>
        <div className="flex items-center gap-2 text-agri-700">
          <Timer className="h-4 w-4" />
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase">
            Recommended safe work window
          </p>
        </div>

        <p className="font-display mt-3 text-4xl font-semibold tracking-tight text-charcoal-900 sm:text-5xl">
          {w.label}
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-charcoal-600">
          Current environmental conditions create elevated exposure risk during
          the afternoon. Consider shifting outdoor chemical-related work to the
          recommended window and follow product-label safety instructions.
        </p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          <Reason
            icon={<Sun className="h-4 w-4" />}
            label="Temperature"
            value={`${env.hourlyTemp[13] ?? env.temperature}°C at 1 PM → ${env.hourlyTemp[17] ?? env.temperature}°C at 5 PM`}
          />
          <Reason
            icon={<Droplets className="h-4 w-4" />}
            label="Humidity"
            value={`${env.hourlyHumidity[13] ?? env.humidity}% → ${env.hourlyHumidity[17] ?? env.humidity}%`}
          />
          <Reason
            icon={<CloudRain className="h-4 w-4" />}
            label="Weather"
            value={env.condition === "heatwave" ? "Heatwave advisory active" : "Clear skies"}
          />
        </div>
      </CardBody>
    </Card>
  );
}

function Reason({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-paper-line bg-charcoal-50 px-3.5 py-3">
      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-charcoal-500 uppercase">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-[12.5px] font-semibold leading-snug text-charcoal-800">{value}</p>
    </div>
  );
}
