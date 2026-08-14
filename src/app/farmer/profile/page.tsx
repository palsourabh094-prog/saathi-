"use client";

import { useState } from "react";
import {
  Check,
  Database,
  Info,
  Languages,
  Lock,
  UserRound,
} from "lucide-react";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { RAMESH_HOUSEHOLD_ID, seedHouseholds } from "@/lib/data/seed";

const household = seedHouseholds.find((h) => h.id === RAMESH_HOUSEHOLD_ID)!;

const SHARE_ROWS = [
  {
    key: "healthSharing",
    label: "Health information",
    desc: "Shared only with your consent",
    purpose: "Care coordination with your health worker",
  },
  {
    key: "agriSharing",
    label: "Agriculture information",
    desc: "Operational sharing for farm advisories",
    purpose: "Agri-extension & weather-based planning",
  },
  {
    key: "communityAnalytics",
    label: "Community analytics",
    desc: "Aggregated / privacy-protected",
    purpose: "Village-level risk patterns (never raw records)",
  },
] as const;

export default function ProfilePage() {
  const [consent, setConsent] = useState(household.consent);

  const toggle = (key: keyof typeof consent) => {
    setConsent((c) => ({ ...c, [key]: !c[key], lastUpdated: new Date().toISOString().slice(0, 10) }));
    toast("success", "Consent preference updated.");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-3xl">
          Profile &amp; privacy
        </h1>
        <p className="mt-1 text-sm text-charcoal-500">
          You decide what SAATHI can use, and for what purpose.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-charcoal-900 text-paper">
                <UserRound className="h-5 w-5" />
              </span>
              <div>
                <CardTitle>{household.headName}</CardTitle>
                <p className="text-xs text-charcoal-500">
                  {household.village} · {household.farm.crop}, {household.farm.acres} acres
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-charcoal-50 px-3 py-2.5">
                <p className="font-display text-2xl font-bold text-charcoal-900">
                  {household.members.length}
                </p>
                <p className="text-[10.5px] font-semibold tracking-wide text-charcoal-400 uppercase">
                  Members
                </p>
              </div>
              <div className="rounded-xl bg-charcoal-50 px-3 py-2.5">
                <p className="font-display text-2xl font-bold text-charcoal-900">
                  {household.farm.workload}
                </p>
                <p className="text-[10.5px] font-semibold tracking-wide text-charcoal-400 uppercase">
                  Workload pressure
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-agri-100 text-agri-700">
                <Languages className="h-5 w-5" />
              </span>
              <div>
                <CardTitle>Language</CardTitle>
                <p className="text-xs text-charcoal-500">
                  Voice &amp; text advisories
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Hindi", "English", "हिन्दी (Hinglish voice)"].map((l, i) => (
                <Badge
                  key={l}
                  className={
                    i === 0
                      ? "border-agri-600 bg-agri-700 text-white"
                      : "border-paper-line bg-white text-charcoal-600"
                  }
                >
                  {i === 0 && <Check className="h-3 w-3" />}
                  {l}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-charcoal-400">
              Prototype supports Hindi and English today — the voice layer is
              architected for more Indian languages later.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Privacy / consent architecture — visible by design */}
      <Card className="border-agri-200">
        <CardBody>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal-900 text-paper">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <CardTitle>Data sharing &amp; consent</CardTitle>
              <p className="text-xs text-charcoal-500">
                Role-based access · purpose-bound · last updated {consent.lastUpdated}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {SHARE_ROWS.map((row) => {
              const on = consent[row.key];
              return (
                <div
                  key={row.key}
                  className="flex items-center justify-between gap-4 rounded-xl border border-paper-line bg-charcoal-50/60 px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <Database className="mt-0.5 h-4 w-4 text-charcoal-400" />
                    <div>
                      <p className="text-[13px] font-bold text-charcoal-800">{row.label}</p>
                      <p className="text-[11.5px] text-charcoal-500">
                        {row.desc} · <span className="font-medium">{row.purpose}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(row.key)}
                    role="switch"
                    aria-checked={on}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                      on ? "bg-agri-600" : "bg-charcoal-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                        on ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-agri-50 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-agri-700" />
            <p className="text-[12px] leading-relaxed text-agri-800">
              SAATHI never exposes raw medical records to agricultural workers,
              and community analytics are always aggregated and
              privacy-protected. This is a prototype — production would follow
              consent-first data governance (DPDP-style).
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
