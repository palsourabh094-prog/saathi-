"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, HeartPulse, Leaf, RadioTower, UserRound } from "lucide-react";
import { useSaathi } from "@/lib/store";
import { Brand } from "@/components/layout/brand";
import type { Role } from "@/lib/types";

const ROLES: Array<{
  role: Role;
  title: string;
  subtitle: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
  highlight?: boolean;
}> = [
  {
    role: "farmer",
    title: "Farmer",
    subtitle: "Ramesh · 2-acre cotton",
    name: "Enter as Ramesh",
    desc: "See how safe your work is today, get an adaptive farm plan and ask SAATHI anything in Hindi or English.",
    icon: <UserRound className="h-5 w-5" />,
    highlight: true,
  },
  {
    role: "worker",
    title: "Health Worker",
    subtitle: "Anjali · ASHA",
    name: "Enter as Anjali",
    desc: "Village health overview, priority cases and the community risk radar — the village-wide picture.",
    icon: <HeartPulse className="h-5 w-5" />,
  },
  {
    role: "agri",
    title: "Agricultural Worker",
    subtitle: "Vikram · Extension",
    name: "Enter as Vikram",
    desc: "Crop activity, upcoming farm work and risk-aware recommendations for the season.",
    icon: <Leaf className="h-5 w-5" />,
  },
];

export default function RoleSelect() {
  const router = useRouter();
  const role = useSaathi((s) => s.role);
  const setRole = useSaathi((s) => s.setRole);

  useEffect(() => {
    if (role) router.replace("/" + role);
  }, [role, router]);

  const enter = (r: Role) => {
    setRole(r);
    router.push("/" + r);
  };

  return (
    <div className="grain relative min-h-screen bg-paper">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <Brand />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-agri-200 bg-agri-50 px-3 py-1.5 text-[11px] font-bold text-agri-700">
            <RadioTower className="h-3.5 w-3.5" />
            Hackathon prototype · synthetic data
          </span>
        </div>

        <div className="mx-auto mt-16 w-full max-w-3xl text-center animate-fade-up">
          <p className="text-[12px] font-bold tracking-[0.22em] text-agri-700 uppercase">
            Rural Resilience &amp; Care Intelligence
          </p>
          <h1 className="font-display mt-4 text-5xl font-semibold tracking-tight text-charcoal-900 sm:text-6xl">
            SAATHI
          </h1>
          <p className="font-display mt-3 text-xl text-charcoal-600 sm:text-2xl">
            Predict. Prevent. Plan. Protect.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-charcoal-500">
            SAATHI connects the health of the household with the health of the
            farm. <span className="font-semibold text-charcoal-700">A farmer shouldn&apos;t have to
            choose between protecting his livelihood and protecting himself.</span>
          </p>
        </div>

        <div className="mx-auto mt-12 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {ROLES.map((r) => (
            <button
              key={r.role}
              onClick={() => enter(r.role)}
              className={`group flex flex-col rounded-2xl border p-6 text-left transition-all hover:-translate-y-1 hover:shadow-lift ${
                r.highlight
                  ? "border-agri-700 bg-agri-700 text-paper shadow-card"
                  : "border-paper-line bg-white/85 text-charcoal-900 shadow-card hover:border-charcoal-300"
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  r.highlight ? "bg-white/15 text-paper" : "bg-charcoal-100 text-charcoal-700"
                }`}
              >
                {r.icon}
              </span>
              <p
                className={`mt-4 text-[11px] font-bold tracking-[0.14em] uppercase ${
                  r.highlight ? "text-agri-200" : "text-charcoal-400"
                }`}
              >
                {r.title}
              </p>
              <p className={`mt-0.5 text-sm font-semibold ${r.highlight ? "text-agri-100" : "text-charcoal-600"}`}>
                {r.subtitle}
              </p>
              <p
                className={`mt-3 flex-1 text-[12.5px] leading-relaxed ${
                  r.highlight ? "text-agri-100/90" : "text-charcoal-500"
                }`}
              >
                {r.desc}
              </p>
              <span
                className={`mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-bold ${
                  r.highlight ? "text-paper" : "text-agri-700"
                }`}
              >
                {r.name}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-12 w-full max-w-3xl rounded-2xl border border-paper-line bg-white/70 px-6 py-4">
          <p className="text-center text-[12.5px] leading-relaxed text-charcoal-500">
            <span className="font-bold text-charcoal-700">Demo tip:</span> enter as
            Ramesh, switch on <span className="font-bold text-charcoal-700">DEMO MODE</span> in the
            top bar, and run the full story — heatwave → symptom → community
            cluster → offline → sync — in under 5 minutes.
          </p>
        </div>

        <footer className="mt-auto pt-10 pb-2 text-center text-[11px] text-charcoal-400">
          SAATHI · STPI × Techniche, IIT Guwahati · Integrated Rural Life-Support prototype ·
          All data is fictional and simulated
        </footer>
      </div>
    </div>
  );
}
