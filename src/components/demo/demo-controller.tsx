"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CloudSun,
  Droplets,
  MapPinned,
  RadioTower,
  RotateCcw,
  ThermometerSun,
  X,
} from "lucide-react";
import { useSaathi } from "@/lib/store";
import { toast } from "@/components/ui/toast";

const STEPS = [
  { key: 0, label: "Start", short: "Start" },
  { key: 1, label: "Simulate heatwave", short: "Heatwave" },
  { key: 2, label: "Report symptom", short: "Symptom" },
  { key: 3, label: "Community cluster", short: "Cluster" },
  { key: 4, label: "Go offline", short: "Offline" },
  { key: 5, label: "Restore network", short: "Sync" },
] as const;

export function DemoController() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [choosingSymptom, setChoosingSymptom] = useState(false);

  const demoStep = useSaathi((s) => s.demoStep);
  const heatwaveActive = useSaathi((s) => s.heatwaveActive);
  const simulatedOffline = useSaathi((s) => s.simulatedOffline);
  const syncState = useSaathi((s) => s.syncState);
  const symptoms = useSaathi((s) => s.symptoms);

  const simulateHeatwave = useSaathi((s) => s.simulateHeatwave);
  const reportSymptom = useSaathi((s) => s.reportSymptom);
  const goOffline = useSaathi((s) => s.goOffline);
  const restoreNetwork = useSaathi((s) => s.restoreNetwork);
  const resetDemo = useSaathi((s) => s.resetDemo);
  const addOfflineAction = useSaathi((s) => s.addOfflineAction);

  const stepDone = (key: number) => demoStep >= key;
  const syncDone = syncState === "complete";

  const pickSymptom = (id: "dizziness" | "headache" | "weakness") => {
    reportSymptom(id);
    setChoosingSymptom(false);
    toast("info", "Health signal created — check the Health Worker dashboard.");
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 w-[330px] max-w-[calc(100vw-2rem)] lg:bottom-6">
      {open ? (
        <div className="overflow-hidden rounded-2xl border border-charcoal-800 bg-charcoal-900 text-paper shadow-lift animate-fade-up">
          <div className="flex items-center justify-between border-b border-charcoal-700/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <RadioTower className="h-3.5 w-3.5" />
              </span>
              <p className="text-xs font-bold tracking-wide">
                DEMO MODE <span className="text-charcoal-400">· Ramesh scenario</span>
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-charcoal-400 hover:bg-charcoal-800 hover:text-paper"
              aria-label="Collapse demo panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-1 px-4 pt-3">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  stepDone(s.key) || (s.key === 5 && syncDone)
                    ? "bg-agri-500"
                    : s.key === demoStep
                      ? "bg-amber-500"
                      : "bg-charcoal-700"
                }`}
                style={{ marginRight: i < STEPS.length - 1 ? 4 : 0 }}
              />
            ))}
          </div>

          <div className="space-y-2 px-4 py-4">
            <StepRow done={stepDone(1)} active={demoStep === 1 && !heatwaveActive} label="Simulate heatwave" hint="Temp 32°C → 39°C">
              <button
                onClick={() => {
                  simulateHeatwave();
                  toast("info", "Heatwave simulated — risk engines recalculated.");
                }}
                className="demo-btn bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
              >
                <ThermometerSun className="h-4 w-4" /> SIMULATE HEATWAVE
              </button>
            </StepRow>

            <StepRow done={stepDone(2) && symptoms.length > 0} active={demoStep === 2 && symptoms.length === 0} label="Report symptom" hint="Farmer reports how they feel">
              {choosingSymptom ? (
                <div className="flex flex-wrap gap-1.5">
                  {(["dizziness", "headache", "weakness"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => pickSymptom(s)}
                      className="demo-btn bg-charcoal-700 text-paper hover:bg-charcoal-600 capitalize"
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    onClick={() => setChoosingSymptom(false)}
                    className="demo-btn bg-charcoal-800 text-charcoal-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setChoosingSymptom(true)}
                  className="demo-btn bg-red-500/15 text-red-400 hover:bg-red-500/25"
                >
                  <Droplets className="h-4 w-4" /> REPORT SYMPTOM
                </button>
              )}
            </StepRow>

            <StepRow done={stepDone(3)} active={demoStep === 3} label="Show community cluster" hint="Village risk pattern appears">
              <button
                onClick={() => router.push("/worker/community")}
                className="demo-btn bg-agri-500/15 text-agri-300 hover:bg-agri-500/25"
              >
                <MapPinned className="h-4 w-4" /> SHOW COMMUNITY CLUSTER
              </button>
            </StepRow>

            <StepRow done={simulatedOffline} active={demoStep === 4 && !simulatedOffline} label="Go offline" hint="Local operation only">
              {!simulatedOffline ? (
                <button
                  onClick={() => {
                    goOffline();
                    toast("offline", "Offline mode — data is stored locally.");
                  }}
                  className="demo-btn w-full bg-charcoal-700 text-paper hover:bg-charcoal-600"
                >
                  <CloudSun className="h-4 w-4" /> GO OFFLINE
                </button>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      addOfflineAction("Marked irrigation complete");
                      toast("success", "Recorded offline — queued for sync.");
                    }}
                    className="demo-btn bg-charcoal-700 text-paper hover:bg-charcoal-600"
                  >
                    <Check className="h-4 w-4" /> Mark irrigation done
                  </button>
                  <button
                    onClick={() => {
                      addOfflineAction("Added rest break (2 PM)");
                      toast("success", "Recorded offline — queued for sync.");
                    }}
                    className="demo-btn bg-charcoal-700 text-paper hover:bg-charcoal-600"
                  >
                    <Check className="h-4 w-4" /> Add rest break
                  </button>
                </div>
              )}
            </StepRow>

            <StepRow done={syncDone} active={demoStep === 5 && !syncDone} label="Restore network" hint="Queue flushes, then sync">
              <button
                onClick={() => restoreNetwork().then(() => toast("success", "All offline records synced."))}
                disabled={!simulatedOffline && !syncDone}
                className="demo-btn w-full bg-agri-600 text-paper hover:bg-agri-500 disabled:opacity-40"
              >
                <RadioTower className="h-4 w-4" /> {syncState === "syncing" ? "SYNCING…" : "RESTORE NETWORK"}
              </button>
            </StepRow>
          </div>

          <div className="flex items-center justify-between border-t border-charcoal-700/60 px-4 py-2.5">
            <p className="text-[10px] text-charcoal-400">
              Demo scenario · synthetic data only
            </p>
            <button
              onClick={() => {
                resetDemo();
                toast("info", "Demo reset to initial state.");
              }}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-charcoal-400 hover:bg-charcoal-800 hover:text-paper"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-charcoal-900 px-4 py-2.5 text-xs font-bold text-paper shadow-lift hover:bg-charcoal-800"
        >
          <RadioTower className="h-4 w-4 text-amber-400" />
          DEMO CONTROLS
          {demoStep > 0 && !syncDone && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-charcoal-900">
              {demoStep}
            </span>
          )}
        </button>
      )}

      <style jsx>{`
        .demo-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border-radius: 0.6rem;
          padding: 0.45rem 0.7rem;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.03em;
          transition: background 0.15s;
        }
      `}</style>
    </div>
  );
}

function StepRow({
  done,
  active,
  label,
  hint,
  children,
}: {
  done: boolean;
  active: boolean;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 transition-colors ${
        active ? "border-amber-500/50 bg-charcoal-800/70" : "border-charcoal-800 bg-charcoal-800/40"
      } ${done ? "opacity-90" : ""}`}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[9px] font-bold ${
            done ? "bg-agri-500 text-charcoal-900" : "bg-charcoal-700 text-charcoal-300"
          }`}
        >
          {done ? <Check className="h-3 w-3" /> : "·"}
        </span>
        <p className="text-[11.5px] font-bold">{label}</p>
        <p className="ml-auto hidden text-[10px] text-charcoal-500 sm:block">{hint}</p>
      </div>
      {children}
    </div>
  );
}
