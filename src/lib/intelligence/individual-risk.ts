import type {
  ActivityType,
  EnvironmentState,
  IndividualRiskResult,
  RiskDriver,
  RiskLevel,
} from "@/lib/types";

/**
 * INDIVIDUAL OCCUPATIONAL-RISK ENGINE
 * ---------------------------------------------------------------
 * Deterministic, transparent prototype scoring — NOT a clinically
 * validated model. Every point is attributable to a labelled driver
 * so the UI can explain "why" without pretending to be medical truth.
 *
 * Risk (0–100) ≈ heat + humidity + activity-exposure + duration + time-of-day + vulnerability
 */

export const ACTIVITY_EXPOSURE: Record<ActivityType, { label: string; points: number }> = {
  pesticide: { label: "Pesticide exposure", points: 24 },
  fertilizer: { label: "Fertilizer handling", points: 14 },
  "field-work": { label: "Field work", points: 10 },
  harvest: { label: "Harvest labour", points: 12 },
  irrigation: { label: "Irrigation work", points: 6 },
  sowing: { label: "Sowing", points: 8 },
  rest: { label: "Rest", points: 0 },
};

/** Heat contribution. 0 below 28°C, scaling up, capped at 45. */
export function heatPoints(temp: number): number {
  if (temp <= 28) return 0;
  if (temp <= 40) return Math.min(40, Math.round((temp - 28) * 2.7));
  return Math.min(45, 40 + Math.round((temp - 40) * 2));
}

/** Humidity contribution above 55%, capped at 30. */
export function humidityPoints(humidity: number): number {
  if (humidity <= 55) return 0;
  return Math.min(30, Math.round((humidity - 55) * 0.85));
}

/** Sustained work beyond 90 minutes adds fatigue risk. */
export function durationPoints(minutes: number): number {
  if (minutes <= 90) return 0;
  return Math.min(20, Math.round((minutes - 90) * 0.2));
}

/** Peak heat hours 12:00–16:00. */
export function timeOfDayPoints(hour: number): number {
  return hour >= 12 && hour <= 16 ? 5 : 0;
}

/** Prototype stand-in for clinical vulnerability signals (age, pre-existing conditions). */
export function vulnerabilityPoints(signals: string[]): number {
  let points = 0;
  if (signals.includes("age-over-55")) points += 8;
  if (signals.includes("hypertension")) points += 7;
  if (signals.includes("diabetes")) points += 6;
  if (signals.includes("respiratory")) points += 7;
  if (signals.includes("pregnancy")) points += 8;
  if (signals.includes("recent-illness")) points += 5;
  return Math.min(30, points);
}

export function riskLevelFor(score: number): RiskLevel {
  if (score < 40) return "LOW";
  if (score < 65) return "MODERATE";
  if (score < 90) return "HIGH";
  return "SEVERE";
}

export interface RiskInput {
  activity: ActivityType;
  hour: number;
  durationMin: number;
  temperature: number;
  humidity: number;
  vulnerabilitySignals?: string[];
  /** optional 24h curves — used to compare candidate work windows */
  hourlyTemp?: Record<number, number>;
  hourlyHumidity?: Record<number, number>;
}

const HOUR_AT = (h: number) =>
  h === 0 ? "12:00 AM" : h === 12 ? "12:00 PM" : h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`;

/** Pure score computation — used by evaluateRisk and recommendedWindowFor. */
function rawRiskScore(input: RiskInput): {
  score: number;
  vulnerability: string[];
  heat: number;
  humidity: number;
  exposure: number;
  duration: number;
  timeOfDay: number;
  vuln: number;
} {
  const vulnerability = input.vulnerabilitySignals ?? [];
  const heat = heatPoints(input.temperature);
  const humidity = humidityPoints(input.humidity);
  const exposure = ACTIVITY_EXPOSURE[input.activity].points;
  const duration = durationPoints(input.durationMin);
  const timeOfDay = timeOfDayPoints(input.hour);
  const vuln = vulnerabilityPoints(vulnerability);
  return {
    score: Math.min(100, heat + humidity + exposure + duration + timeOfDay + vuln),
    vulnerability,
    heat,
    humidity,
    exposure,
    duration,
    timeOfDay,
    vuln,
  };
}

/** Evaluate risk for one activity at one hour. Pure and testable. */
export function evaluateRisk(input: RiskInput): IndividualRiskResult {
  const parts = rawRiskScore(input);
  const { vulnerability } = parts;
  const drivers: RiskDriver[] = [];

  if (parts.heat > 0)
    drivers.push({
      key: "heat",
      label: "Heat",
      points: parts.heat,
      detail: `${input.temperature}°C at this hour`,
    });

  if (parts.humidity > 0)
    drivers.push({
      key: "humidity",
      label: "Humidity",
      points: parts.humidity,
      detail: `${input.humidity}% relative humidity`,
    });

  if (parts.exposure > 0)
    drivers.push({
      key: "exposure",
      label: ACTIVITY_EXPOSURE[input.activity].label,
      points: parts.exposure,
      detail: "Chemical / physical exposure during the activity",
    });

  if (parts.duration > 0)
    drivers.push({
      key: "duration",
      label: "Work duration",
      points: parts.duration,
      detail: `${input.durationMin} minutes of sustained work`,
    });

  if (parts.timeOfDay > 0)
    drivers.push({
      key: "time-of-day",
      label: "Afternoon heat",
      points: parts.timeOfDay,
      detail: "Peak solar hours (12 PM – 4 PM)",
    });

  if (parts.vuln > 0)
    drivers.push({
      key: "vulnerability",
      label: "Personal health factors",
      points: parts.vuln,
      detail: vulnerability.join(", "),
    });

  const riskScore = parts.score;

  return {
    riskScore,
    riskLevel: riskLevelFor(riskScore),
    drivers,
    recommendedAction: actionFor(riskScore, input.activity),
    recommendedWindow: recommendedWindowFor(input, vulnerability),
    hour: input.hour,
    activity: input.activity,
    disclaimer:
      "Estimated occupational-risk signal for planning only. Not a medical diagnosis or clinically validated score.",
  };
}

function actionFor(score: number, activity: ActivityType): string {
  if (activity === "rest") return "Rest period — stay hydrated.";
  if (score >= 85)
    return "Delay this activity. Conditions create elevated exposure risk — shift to the recommended window.";
  if (score >= 65)
    return "Consider shifting this activity to the recommended window and follow product-label safety instructions.";
  if (score >= 40)
    return "Proceed with care — hydrate, take shade breaks, and follow product-label instructions.";
  return "Safe to proceed as planned.";
}

export interface WorkWindow {
  label: string;
  startHour: number;
  endHour: number;
}

/**
 * Candidate work windows with representative hours.
 * For each window we average risk across its hours and pick the
 * lowest-risk window that starts at or after the current hour.
 */
export const CANDIDATE_WINDOWS: WorkWindow[] = [
  { label: "6:00 AM – 10:00 AM", startHour: 6, endHour: 10 },
  { label: "10:00 AM – 1:00 PM", startHour: 10, endHour: 13 },
  { label: "1:00 PM – 4:00 PM", startHour: 13, endHour: 16 },
  { label: "5:00 PM – 7:30 PM", startHour: 17, endHour: 19.5 },
];

export function recommendedWindowFor(
  input: RiskInput,
  vulnerabilitySignals: string[] = [],
): WorkWindow {
  const riskAt = (hour: number) => {
    const envHour = Math.round(hour);
    return rawRiskScore({
      ...input,
      hour,
      temperature: input.hourlyTemp?.[envHour] ?? input.temperature,
      humidity: input.hourlyHumidity?.[envHour] ?? input.humidity,
      vulnerabilitySignals,
    }).score;
  };

  // Representative evaluation hours inside each window.
  const evalHours = (w: WorkWindow) =>
    w.startHour === 17
      ? [17, 19]
      : [w.startHour, Math.min(w.startHour + 2, w.endHour)];

  let best = CANDIDATE_WINDOWS[0];
  let bestScore = Infinity;
  for (const window of CANDIDATE_WINDOWS) {
    if (window.endHour <= input.hour + 0.5) continue; // must be in the future
    const hours = evalHours(window);
    const avg =
      hours.reduce((sum, h) => sum + riskAt(h), 0) / hours.length;
    if (avg < bestScore) {
      bestScore = avg;
      best = window;
    }
  }
  return best;
}

/** Hourly risk curve for a given activity across a day, used for charts/timelines. */
export function hourlyRiskCurve(
  activity: ActivityType,
  env: EnvironmentState,
  durationMin: number,
  vulnerabilitySignals: string[] = [],
): Array<{ hour: number; label: string; score: number; level: RiskLevel }> {
  const hours = [5, 7, 9, 11, 13, 15, 17, 19, 21];
  return hours.map((h) => {
    const r = evaluateRisk({
      activity,
      hour: h,
      durationMin,
      temperature: env.hourlyTemp[Math.round(h)] ?? env.temperature,
      humidity: env.hourlyHumidity[Math.round(h)] ?? env.humidity,
      vulnerabilitySignals,
    });
    return { hour: h, label: HOUR_AT(h), score: r.riskScore, level: r.riskLevel };
  });
}
