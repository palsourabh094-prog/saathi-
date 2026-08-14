"use client";

import { AlertTriangle, CloudSun, Droplets, Thermometer } from "lucide-react";
import { greeting, todayLabel } from "@/lib/format";
import { useFarmerData } from "@/components/farmer/use-farmer-data";

export function HomeHero() {
  const { env, heatwaveActive } = useFarmerData();

  return (
    <div className="animate-fade-up">
      <p className="text-sm font-semibold tracking-wide text-charcoal-500 uppercase">
        {todayLabel()} · Dharampura
      </p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-charcoal-900 sm:text-4xl">
          {greeting()}, Ramesh
        </h1>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-paper-line bg-white/80 px-3 py-1.5 text-sm font-semibold text-charcoal-800">
            <Thermometer className="h-4 w-4 text-amber-600" />
            {env.temperature}°C
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-paper-line bg-white/80 px-3 py-1.5 text-sm font-semibold text-charcoal-800">
            <Droplets className="h-4 w-4 text-agri-500" />
            {env.humidity}%
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-paper-line bg-white/80 px-3 py-1.5 text-sm font-semibold text-charcoal-800">
            <CloudSun className="h-4 w-4 text-earth-500" />
            {env.condition === "heatwave" ? "Heatwave" : "Clear"}
          </span>
        </div>
      </div>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-charcoal-500">
        How safe is your work today? SAATHI watches the field, the weather and
        your wellbeing together.
      </p>

      {heatwaveActive && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 animate-fade-up">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
            <AlertTriangle className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-sm font-bold text-red-800">Heatwave conditions today</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-red-700">
              Elevated heat and humidity create higher occupational-exposure risk.
              Your farm plan has been adjusted to a safer window.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
