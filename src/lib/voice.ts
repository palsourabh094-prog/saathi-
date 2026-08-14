import type { EnvironmentState, FarmPlanItem } from "@/lib/types";
import { evaluateRisk } from "@/lib/intelligence/individual-risk";
import { formatHour } from "@/lib/intelligence/adaptive-plan";

/**
 * VOICE EXPERIENCE
 * ---------------------------------------------------------------
 * Uses the browser Web Speech API when available (speechSynthesis +
 * SpeechRecognition). When it is not, the same advisory engine powers
 * a polished typed interaction — the architecture (ask → advisory →
 * speak) is identical, so a real ASR/TTS API can drop in later.
 */

export interface AdvisoryContext {
  env: EnvironmentState;
  plan: FarmPlanItem[];
  symptomsCount: number;
  userName: string;
  heatwave: boolean;
}

export interface Advisory {
  hi: string;
  en: string;
}

function riskSummary(ctx: AdvisoryContext): { hi: string; en: string } {
  const pesticide = ctx.plan.find((p) => p.activity === "pesticide");
  if (!pesticide) return { hi: "", en: "" };
  const r = evaluateRisk({
    activity: "pesticide",
    hour: pesticide.hour,
    durationMin: pesticide.durationMin,
    temperature: ctx.env.hourlyTemp[pesticide.hour] ?? ctx.env.temperature,
    humidity: ctx.env.hourlyHumidity[pesticide.hour] ?? ctx.env.humidity,
    hourlyTemp: ctx.env.hourlyTemp,
    hourlyHumidity: ctx.env.hourlyHumidity,
  });
  return {
    hi: `Aaj garmi zyada hai. Pesticide spraying dopahar mein avoid karein. Aapke liye shaam ka recommended window ${r.recommendedWindow.label} hai.`,
    en: `It is very hot today. Avoid pesticide spraying during the afternoon. Your recommended work window is ${r.recommendedWindow.label}.`,
  };
}

/** Rule-based, deterministic advisory generator — transparent, not a black box. */
export function advisoryFor(question: string, ctx: AdvisoryContext): Advisory {
  const q = question.toLowerCase();
  const risk = riskSummary(ctx);

  if (q.includes("kya karna") || q.includes("what should") || q.includes("aaj")) {
    if (ctx.heatwave) {
      return {
        hi: `${risk.hi} Aaj paani zyada piyein aur baar-baar aaram karein.`,
        en: `${risk.en} Drink plenty of water today and take frequent rest breaks.`,
      };
    }
    return {
      hi: "Aaj ka plan sahi hai. Subah irrigation aur fertilizer karein. Dopahar mein garmi hai, shaam ko kaam karna behtar rahega.",
      en: "Today's plan looks good. Do irrigation and fertiliser in the morning. The afternoon is hot, so evening work is better.",
    };
  }

  if (q.includes("pesticide") || q.includes("chidakav") || q.includes("spray")) {
    return {
      hi: risk.hi,
      en: risk.en,
    };
  }

  if (q.includes("mausam") || q.includes("weather") || q.includes("garmi")) {
    return {
      hi: `Abhi ${ctx.env.temperature} degree Celsius hai aur humidity ${ctx.env.humidity} pratishat hai. ${ctx.heatwave ? "Heatwave ki vajah se garmi bahut zyada hai." : "Mausam saamanya hai."}`,
      en: `It is currently ${ctx.env.temperature}°C with ${ctx.env.humidity}% humidity. ${ctx.heatwave ? "A heatwave is making conditions severe." : "Conditions are normal."}`,
    };
  }

  if (q.includes("health") || q.includes("sehat") || q.includes("tbiyat") || q.includes("chakkar")) {
    if (ctx.symptomsCount > 0) {
      return {
        hi: "Aapki tabiyat theek nahi lag rahi. Aaram karein, paani piyein aur apni health worker se sampark karein.",
        en: "Your reported symptoms create an elevated health signal. Rest, hydrate, and consider contacting your health worker.",
      };
    }
    return {
      hi: "Aapki tabiyat abhi sahi lag rahi hai. Aaj kaam ke beech mein aaram zaroor karein.",
      en: "You seem okay right now. Be sure to rest between work sessions today.",
    };
  }

  if (q.includes("family") || q.includes("parivaar") || q.includes("household")) {
    return {
      hi: "Aapke parivaar ki resilience score aaj ${ctx.heatwave ? 'kam ho rahi hai' : 'theek hai'}.",
      en: `Your household resilience is ${ctx.heatwave ? "under pressure today" : "healthy today"}.`,
    };
  }

  return {
    hi: "Main SAATHI hoon. Aap apne aaj ke farm plan, mausam, ya tabiyat ke baare mein poochh sakte hain.",
    en: "I am SAATHI. You can ask me about today's farm plan, the weather, or how you are feeling.",
  };
}

/** Text-to-speech with a preference for Hindi (hi-IN) voice. */
export function speak(text: string, lang: "hi-IN" | "en-IN" = "hi-IN"): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95;
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find((v) => v.lang.replace("_", "-").toLowerCase() === lang.toLowerCase());
  if (match) utterance.voice = match;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/** Speech recognition if available — otherwise null (typed fallback used). */
export function speechRecognitionAvailable(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as { webkitSpeechRecognition?: unknown; SpeechRecognition?: unknown };
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export interface SpeechRecognizer {
  start: () => void;
  stop: () => void;
  onResult: (fn: (text: string) => void) => void;
  onEnd: (fn: () => void) => void;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SpeechRecognitionResultListEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionResultListEventLike {
  results?: Array<Array<{ transcript?: string }>>;
}

/** Browser SpeechRecognition wrapper — null when unsupported. */
export function createRecognizer(): SpeechRecognizer | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = "hi-IN";
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  let onResult: (text: string) => void = () => {};
  let onEnd: () => void = () => {};
  rec.onresult = (e) => {
    const text = e.results?.[0]?.[0]?.transcript ?? "";
    if (text) onResult(text);
  };
  rec.onend = () => onEnd();
  rec.onerror = () => onEnd();

  return {
    start: () => rec.start(),
    stop: () => rec.stop(),
    onResult: (fn) => {
      onResult = fn;
    },
    onEnd: (fn) => {
      onEnd = fn;
    },
  };
}

export { formatHour };
