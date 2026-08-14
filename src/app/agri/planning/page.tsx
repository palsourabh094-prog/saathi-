"use client";

import { Leaf, Sun, Thermometer, Wind } from "lucide-react";
import { useAgriData } from "@/components/agri/use-agri-data";
import { Card, CardBody, CardTitle } from "@/components/ui/card";

export default function PlanningPage() {
  const { heatwaveActive } = useAgriData();

  const days = [
    { day: "Thu", icon: "☀️", note: heatwaveActive ? "Heatwave — shift chemical work to evening" : "Normal schedule" },
    { day: "Fri", icon: "🌤️", note: "Morning irrigation advised" },
    { day: "Sat", icon: "🌦️", note: "Scattered showers — hold pesticide" },
    { day: "Sun", icon: "☀️", note: "Dry — good harvest window" },
    { day: "Mon", icon: "☀️", note: "Fertiliser pass recommended" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-3xl">
          Planning
        </h1>
        <p className="mt-1 max-w-xl text-sm text-charcoal-500">
          Week-ahead advisory for Dharampura — simulated forecast for the demo,
          clearly labelled as such.
        </p>
      </div>

      <Card className="animate-fade-up">
        <CardBody>
          <CardTitle>Next 5 days</CardTitle>
          <div className="mt-4 space-y-2">
            {days.map((d) => (
              <div
                key={d.day}
                className="flex items-center justify-between rounded-xl border border-paper-line px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{d.icon}</span>
                  <span className="w-10 text-[13px] font-bold text-charcoal-800">{d.day}</span>
                </div>
                <p className="text-[12.5px] font-medium text-charcoal-600">{d.note}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-5 sm:grid-cols-3">
        <Tip icon={<Sun className="h-4 w-4" />} title="Exposure timing" text="Schedule chemical work when heat and humidity are lowest." />
        <Tip icon={<Thermometer className="h-4 w-4" />} title="Heatwave protocol" text="Share the safe work window with every farm before noon." />
        <Tip icon={<Wind className="h-4 w-4" />} title="Crew rotation" text="Rotate crews and enforce hydration breaks on high-risk days." />
      </div>

      <div className="flex items-center gap-2.5 rounded-2xl border border-paper-line bg-white/70 px-4 py-3.5">
        <Leaf className="h-4 w-4 shrink-0 text-agri-600" />
        <p className="text-[12px] leading-relaxed text-charcoal-500">
          Simulated forecast — production would pull from a weather adapter
          (the interface already exists in the codebase).
        </p>
      </div>
    </div>
  );
}

function Tip({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card className="animate-fade-up">
      <CardBody className="p-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-agri-100 text-agri-700">
          {icon}
        </span>
        <p className="mt-3 text-[13.5px] font-bold text-charcoal-800">{title}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-charcoal-500">{text}</p>
      </CardBody>
    </Card>
  );
}
