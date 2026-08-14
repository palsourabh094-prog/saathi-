"use client";

import { CloudSun } from "lucide-react";
import { useAgriData } from "@/components/agri/use-agri-data";
import { Card, CardBody, CardTitle } from "@/components/ui/card";

const CROP_EMOJI: Record<string, string> = {
  Cotton: "🌱",
  Sugarcane: "🎋",
  Paddy: "🌾",
  Wheat: "🌿",
  Mustard: "🌼",
  Vegetables: "🥬",
};

export default function AgriHome() {
  const { byCrop, env, heatwaveActive } = useAgriData();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-3xl">
          Farms — Dharampura
        </h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Agricultural intelligence with one eye on the people doing the work.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 animate-fade-up">
        <div className="rounded-2xl border border-agri-200 bg-agri-50 px-4 py-4 text-center">
          <p className="font-display text-3xl font-bold text-agri-800">{byCrop.length}</p>
          <p className="mt-0.5 text-[10.5px] font-bold tracking-wide text-agri-700 uppercase">Crops</p>
        </div>
        <div className="rounded-2xl border border-paper-line bg-white px-4 py-4 text-center">
          <p className="font-display text-3xl font-bold text-charcoal-900">40</p>
          <p className="mt-0.5 text-[10.5px] font-bold tracking-wide text-charcoal-400 uppercase">Households</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-center">
          <p className="font-display text-3xl font-bold text-amber-800">{env.temperature}°</p>
          <p className="mt-0.5 text-[10.5px] font-bold tracking-wide text-amber-700 uppercase">
            {heatwaveActive ? "Heatwave" : "Clear"}
          </p>
        </div>
      </div>

      <Card className="animate-fade-up">
        <CardBody>
          <CardTitle>Crop activity</CardTitle>
          <p className="mt-0.5 text-xs text-charcoal-500">
            Households by primary crop — the workload map for the season.
          </p>
          <div className="mt-4 space-y-2.5">
            {byCrop.map(([crop, count]) => {
              const max = byCrop[0][1];
              return (
                <div key={crop}>
                  <div className="mb-1 flex items-center justify-between text-[13px]">
                    <span className="flex items-center gap-1.5 font-semibold text-charcoal-700">
                      <span className="text-base">{CROP_EMOJI[crop] ?? "🌿"}</span>
                      {crop}
                    </span>
                    <span className="font-bold tabular text-charcoal-500">{count} farms</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-charcoal-100">
                    <div
                      className="h-full rounded-full bg-agri-600 transition-all duration-700"
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card className="animate-fade-up">
        <CardBody>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-agri-100 text-agri-700">
              <CloudSun className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-charcoal-800">
                SAATHI watches the people behind the crops
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-charcoal-600">
                The same weather that shapes your season also shapes exposure
                risk for farmers. When pesticide season meets a heatwave,
                SAATHI flags it to both the farm plan and the health worker —
                that is the cross-domain intelligence layer.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
