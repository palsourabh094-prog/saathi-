/**
 * SAATHI — typed domain models.
 * All data in this prototype is synthetic demo data (fictional village).
 */

export type Role = "farmer" | "worker" | "agri";

export type ActivityType =
  | "irrigation"
  | "fertilizer"
  | "pesticide"
  | "field-work"
  | "harvest"
  | "sowing"
  | "rest";

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "SEVERE";

export type Trend = "improving" | "stable" | "declining";

export interface HouseholdMember {
  id: string;
  name: string;
  age: number;
  relation: string;
  /** Prototype stand-in for clinical vulnerability — NOT a diagnosis. */
  vulnerabilities: string[];
  workingInFarm: boolean;
}

export interface Household {
  id: string;
  headName: string;
  clusterId: string;
  village: string;
  members: HouseholdMember[];
  farm: {
    crop: string;
    acres: number;
    /** 0–100 workload pressure for the current season */
    workload: number;
  };
  consent: {
    healthSharing: boolean;
    agriSharing: boolean;
    communityAnalytics: boolean;
    lastUpdated: string;
  };
}

export interface FarmPlanItem {
  id: string;
  activity: ActivityType;
  /** 24h hour, e.g. 6, 13, 17 */
  hour: number;
  durationMin: number;
  /** Was this item repositioned by SAATHI's adaptive plan? */
  adapted: boolean;
  /** Why it was adapted (shown in the "Why?" disclosure) */
  adaptReason?: string;
  originalHour?: number;
}

export interface EnvironmentState {
  temperature: number;
  humidity: number;
  windKmh: number;
  condition: "clear" | "partly-cloudy" | "heatwave" | "rain";
  /** 24h temperature curve used for window analysis */
  hourlyTemp: Record<number, number>;
  /** 24h humidity curve */
  hourlyHumidity: Record<number, number>;
}

export type SymptomId =
  | "headache"
  | "dizziness"
  | "nausea"
  | "breathing"
  | "weakness"
  | "none";

export interface SymptomReport {
  id: string;
  householdId: string;
  symptom: SymptomId;
  note?: string;
  /** voice transcription if captured */
  transcript?: string;
  reportedAt: string;
  storedOffline: boolean;
}

export interface RiskDriver {
  key: string;
  label: string;
  /** Points contributed to the 0–100 score */
  points: number;
  detail: string;
}

export interface IndividualRiskResult {
  riskScore: number;
  riskLevel: RiskLevel;
  drivers: RiskDriver[];
  recommendedAction: string;
  recommendedWindow: { label: string; startHour: number; endHour: number };
  hour: number;
  activity: ActivityType;
  /** Transparent prototype note — NOT clinical validation */
  disclaimer: string;
}

export interface ResilienceResult {
  score: number;
  level: Trend;
  drivers: RiskDriver[];
  components: {
    health: number;
    environmental: number;
    workload: number;
    workforce: number;
  };
}

export interface ClusterSignal {
  key: string;
  label: string;
  households: number;
}

export interface CommunityClusterResult {
  clusterId: string;
  clusterName: string;
  riskLevel: RiskLevel;
  householdCount: number;
  dominantSignals: ClusterSignal[];
  recommendedAction: string;
  elevatedCount: number;
}

export interface HealthSignal {
  id: string;
  householdId: string;
  level: RiskLevel;
  title: string;
  reason: string[];
  action: string;
  createdAt: string;
  priorityRank: number;
}

export interface SyncRecord {
  id: string;
  type: "activity" | "symptom" | "advisory";
  payload: Record<string, unknown>;
  createdAt: string;
  syncedAt?: string;
}

export interface ConsentStatus {
  healthSharing: boolean;
  agriSharing: boolean;
  communityAnalytics: boolean;
  lastUpdated: string;
}

export interface WorkerProfile {
  id: string;
  name: string;
  designation: string; // "ASHA Worker" | "ANM" | "Extension Officer"
  village: string;
}

/** Interoperability adapter interface — see lib/intelligence/adapters.ts */
export interface HealthAdapter {
  name: string;
  status: "sandbox" | "mock";
  getVulnerabilitySignals(householdId: string): Promise<string[]>;
  submitSymptom(report: SymptomReport): Promise<{ accepted: boolean }>;
}

export interface AgriAdapter {
  name: string;
  status: "sandbox" | "mock";
  getFarmPlan(householdId: string): Promise<FarmPlanItem[]>;
  recordActivity(householdId: string, item: FarmPlanItem): Promise<{ accepted: boolean }>;
}

export interface WeatherAdapter {
  name: string;
  status: "sandbox" | "mock";
  getConditions(village: string): Promise<EnvironmentState>;
}
