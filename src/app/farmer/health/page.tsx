"use client";

import { SymptomCheckin } from "@/components/farmer/symptom-checkin";
import { HealthSignals } from "@/components/farmer/health-signals";
import { Card, CardBody } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function HealthPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-3xl">
          Your health, in context
        </h1>
        <p className="mt-1 max-w-xl text-sm text-charcoal-500">
          SAATHI combines how you feel with what you were doing and the
          conditions around you — it never diagnoses.
        </p>
      </div>

      <SymptomCheckin />
      <HealthSignals />

      <Card>
        <CardBody>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-agri-100 text-agri-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-charcoal-800">
                What happens after you report a symptom?
              </p>
              <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-charcoal-600">
                <li>
                  1. A risk signal is generated using your activity, exposure
                  context and the environment.
                </li>
                <li>
                  2. With your consent, your health worker sees a priority
                  flag — nothing more than needed.
                </li>
                <li>
                  3. If several households nearby report similar signals, a
                  community-level pattern may be raised.
                </li>
              </ul>
              <p className="mt-3 text-[11.5px] text-charcoal-400">
                Health data is only shared with your consent. See Profile →
                Privacy for details.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
