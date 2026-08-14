"use client";

import { useState } from "react";
import { Activity, Home, Users } from "lucide-react";
import { useWorkerData } from "@/components/worker/use-worker-data";
import { Card, CardBody } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";

export function CommunityRadar() {
  const { clusters, heatwaveActive } = useWorkerData();
  const [selected, setSelected] = useState(clusters[0]?.def.id);

  const active = clusters.find((c) => c.def.id === selected) ?? clusters[0];

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      {/* Map */}
      <Card className="lg:col-span-3 animate-fade-up">
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-[17px] font-semibold tracking-tight text-charcoal-900">
                Village risk radar
              </h3>
              <p className="text-xs text-charcoal-500">
                Dharampura · synthetic demo data
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10.5px] font-bold text-charcoal-500">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-agri-500" /> Normal</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Moderate</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-600" /> High</span>
            </div>
          </div>

          <svg viewBox="0 0 400 280" className="mt-4 w-full rounded-2xl border border-paper-line bg-[#f4f0e6]" role="img" aria-label="Village risk map">
            {/* fields */}
            <rect x="18" y="14" width="360" height="252" rx="14" fill="#ede7d8" />
            {[
              [34, 30, 150, 96],
              [196, 30, 168, 96],
              [34, 138, 150, 112],
              [196, 138, 168, 112],
            ].map(([x, y, w, h], i) => (
              <rect
                key={i}
                x={x}
                y={y}
                width={w}
                height={h}
                rx="10"
                fill={i % 2 === 0 ? "#e6deca" : "#eae2d0"}
                stroke="#d8ceb6"
              />
            ))}
            {/* river */}
            <path
              d="M0 208 Q 90 180 150 214 T 320 216 T 400 200"
              fill="none"
              stroke="#b9cdd4"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.8"
            />
            <text x="16" y="238" fontSize="11" fill="#8a94a0" fontWeight="600">River</text>
            <text x="16" y="22" fontSize="11" fill="#8a94a0" fontWeight="600">North Field →</text>

            {/* clusters */}
            {clusters.map(({ def, result }) => {
              const tone =
                result.riskLevel === "HIGH" || result.riskLevel === "SEVERE"
                  ? { fill: "#b0402c", soft: "#f5e0d8" }
                  : result.riskLevel === "MODERATE"
                    ? { fill: "#b97a1f", soft: "#f8eed9" }
                    : { fill: "#417052", soft: "#e4ece4" };
              const isSel = def.id === selected;
              return (
                <g
                  key={def.id}
                  transform={`translate(${def.x * 3.6}, ${def.y * 2.5})`}
                  onClick={() => setSelected(def.id)}
                  className="cursor-pointer"
                >
                  {result.riskLevel !== "LOW" && (
                    <circle r={isSel ? 26 : 21} fill={tone.soft} opacity={isSel ? 0.9 : 0.55} />
                  )}
                  <circle
                    r={isSel ? 16 : 13}
                    fill={tone.fill}
                    stroke="#fff"
                    strokeWidth="2.5"
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fontSize="10"
                    fontWeight="800"
                    fill="#fff"
                  >
                    {result.householdCount}
                  </text>
                  <text
                    textAnchor="middle"
                    dy={isSel ? 30 : 26}
                    fontSize="9.5"
                    fontWeight="700"
                    fill="#4b483e"
                  >
                    {def.name.split(" ")[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </CardBody>
      </Card>

      {/* Cluster detail */}
      <div className="space-y-5 lg:col-span-2">
        {active && (
          <Card className="animate-fade-up">
            <CardBody>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[17px] font-semibold tracking-tight text-charcoal-900">
                  {active.result.clusterName}
                </h3>
                <RiskBadge level={active.result.riskLevel} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-charcoal-50 px-3 py-3 text-center">
                  <p className="font-display text-2xl font-bold text-charcoal-900">
                    {active.result.householdCount}
                  </p>
                  <p className="text-[10px] font-bold tracking-wide text-charcoal-400 uppercase">
                    Households
                  </p>
                </div>
                <div className="rounded-xl bg-charcoal-50 px-3 py-3 text-center">
                  <p className="font-display text-2xl font-bold text-charcoal-900">
                    {active.result.elevatedCount}
                  </p>
                  <p className="text-[10px] font-bold tracking-wide text-charcoal-400 uppercase">
                    Elevated
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[11px] font-bold tracking-wide text-charcoal-500 uppercase">
                Common signals
              </p>
              <div className="mt-2 space-y-1.5">
                {active.result.dominantSignals.length > 0 ? (
                  active.result.dominantSignals.map((s) => (
                    <div
                      key={s.key}
                      className="flex items-center justify-between rounded-xl border border-paper-line bg-white px-3.5 py-2.5"
                    >
                      <span className="text-[13px] font-semibold text-charcoal-700">
                        {s.label}
                      </span>
                      <span className="rounded-full bg-charcoal-100 px-2 py-0.5 text-[10px] font-bold text-charcoal-500">
                        {s.households} hh
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[12.5px] text-charcoal-500">
                    No shared signals detected.
                  </p>
                )}
              </div>

              <div className="mt-4 rounded-xl border border-agri-200 bg-agri-50 px-4 py-3">
                <p className="text-[13px] font-semibold text-agri-800">
                  {active.result.riskLevel === "HIGH" || active.result.riskLevel === "SEVERE"
                    ? "Elevated occupational-health risk detected"
                    : "Cluster is within normal range"}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-agri-700">
                  {active.result.recommendedAction}
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Individual → Household → Community */}
        <Card className="animate-fade-up">
          <CardBody>
            <p className="text-[11px] font-bold tracking-wide text-charcoal-500 uppercase">
              How the pattern formed
            </p>
            <div className="mt-3 space-y-2">
              <ChainStep icon={<Activity className="h-4 w-4" />} label="Individual" text="Heat + pesticide exposure raises one farmer's risk" />
              <ChainStep icon={<Home className="h-4 w-4" />} label="Household" text="Household resilience declines as pressure combines" />
              <ChainStep icon={<Users className="h-4 w-4" />} label="Community" text={heatwaveActive ? "Eight households show the same pattern — a cluster forms" : "Clusters are monitored for emerging patterns"} />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function ChainStep({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-charcoal-900 text-paper">
        {icon}
      </span>
      <div>
        <p className="text-[12px] font-bold text-charcoal-800">{label}</p>
        <p className="text-[11.5px] leading-snug text-charcoal-500">{text}</p>
      </div>
    </div>
  );
}
