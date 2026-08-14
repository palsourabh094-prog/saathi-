export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function todayLabel(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function riskColor(level: "LOW" | "MODERATE" | "HIGH" | "SEVERE"): string {
  switch (level) {
    case "LOW":
      return "text-agri-600 bg-agri-100 border-agri-200";
    case "MODERATE":
      return "text-amber-700 bg-amber-100 border-amber-300";
    case "HIGH":
      return "text-red-700 bg-red-100 border-red-100";
    case "SEVERE":
      return "text-white bg-red-700 border-red-700";
  }
}

export function riskDot(level: "LOW" | "MODERATE" | "HIGH" | "SEVERE"): string {
  switch (level) {
    case "LOW":
      return "bg-agri-500";
    case "MODERATE":
      return "bg-amber-500";
    case "HIGH":
      return "bg-red-600";
    case "SEVERE":
      return "bg-red-800";
  }
}

export const SYMPTOM_LABELS: Record<string, string> = {
  headache: "Headache",
  dizziness: "Dizziness",
  nausea: "Nausea",
  breathing: "Breathing difficulty",
  weakness: "Weakness",
  none: "No symptoms",
};

export const ACTIVITY_LABELS: Record<string, string> = {
  irrigation: "Irrigation",
  fertilizer: "Fertiliser",
  pesticide: "Pesticide spraying",
  "field-work": "Field work",
  harvest: "Harvest",
  sowing: "Sowing",
  rest: "Rest",
};

export const ACTIVITY_ICON: Record<string, string> = {
  irrigation: "droplets",
  fertilizer: "flask",
  pesticide: "spray",
  "field-work": "shovel",
  harvest: "wheat",
  sowing: "sprout",
  rest: "coffee",
};
