"use client";

import { useState } from "react";
import { Check, HeartPulse, Mic } from "lucide-react";
import { useSaathi, useOffline } from "@/lib/store";
import { Card, CardBody } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import type { SymptomId } from "@/lib/types";

const OPTIONS: Array<{ id: SymptomId; label: string; emoji: string }> = [
  { id: "headache", label: "Headache", emoji: "🤕" },
  { id: "dizziness", label: "Dizziness", emoji: "🌀" },
  { id: "nausea", label: "Nausea", emoji: "🤢" },
  { id: "breathing", label: "Breathing difficulty", emoji: "🫁" },
  { id: "weakness", label: "Weakness", emoji: "🪫" },
  { id: "none", label: "No symptoms", emoji: "😊" },
];

export function SymptomCheckin() {
  const reportSymptom = useSaathi((s) => s.reportSymptom);
  const offline = useOffline();
  const [selected, setSelected] = useState<SymptomId | null>(null);

  const choose = (id: SymptomId) => {
    setSelected(id);
    reportSymptom(id);
    toast("info", id === "none" ? "Recorded — no symptoms today." : "Signal recorded. SAATHI never diagnoses — it only flags risk.");
  };

  return (
    <Card className="animate-fade-up">
      <CardBody>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-agri-100 text-agri-700">
            <HeartPulse className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-[17px] font-semibold tracking-tight text-charcoal-900">
              How are you feeling?
            </h3>
            <p className="text-xs text-charcoal-500">
              One tap is enough. SAATHI never diagnoses — it only flags risk.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => choose(o.id)}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-[13px] font-semibold transition-all hover:-translate-y-0.5 ${
                selected === o.id
                  ? "border-agri-600 bg-agri-700 text-white shadow-sm"
                  : "border-paper-line bg-white text-charcoal-700 hover:border-charcoal-300"
              }`}
            >
              <span className="text-base">{o.emoji}</span>
              {o.label}
              {selected === o.id && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>

        <button
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-charcoal-300 px-3 py-2.5 text-[12.5px] font-semibold text-charcoal-500 hover:border-charcoal-400 hover:text-charcoal-700"
          onClick={() =>
            toast("info", "Voice symptom reporting works on supported browsers — try Ask SAATHI.")
          }
        >
          <Mic className="h-4 w-4" />
          Report by voice (हिंदी में बोलें)
        </button>

        {offline && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11.5px] font-medium text-amber-700">
            Offline — your report is stored on this device and will sync when
            the network returns.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
