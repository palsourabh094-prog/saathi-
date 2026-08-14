"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, Send, Volume2 } from "lucide-react";
import { useFarmerData } from "@/components/farmer/use-farmer-data";
import {
  advisoryFor,
  createRecognizer,
  speak,
  speechRecognitionAvailable,
  stopSpeaking,
  type Advisory,
} from "@/lib/voice";
import { Card, CardBody } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

const CHIPS = [
  "Aaj mujhe kya karna chahiye?",
  "Pesticide kab spray karein?",
  "Mausam kaisa hai?",
  "Meri tabiyat kaisi hai?",
  "Parivaar ki resilience kaisi hai?",
];

export function AskSaathi() {
  const data = useFarmerData();
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState<Advisory | null>(null);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const recognizerRef = useRef<ReturnType<typeof createRecognizer>>(null);
  const recSupported = speechRecognitionAvailable();

  useEffect(() => () => stopSpeaking(), []);

  const ask = (q: string) => {
    if (!q.trim()) return;
    setQuestion(q);
    setThinking(true);
    setReply(null);
    stopSpeaking();
    // Small pause so the thinking state is legible, then answer.
    setTimeout(() => {
      setReply(advisoryFor(q, {
        env: data.env,
        plan: data.farmPlan,
        symptomsCount: data.reportedSymptoms.length,
        userName: "Ramesh",
        heatwave: data.heatwaveActive,
      }));
      setThinking(false);
    }, 650);
  };

  const toggleMic = () => {
    if (listening) {
      recognizerRef.current?.stop();
      setListening(false);
      return;
    }
    if (!recSupported) {
      toast("info", "Speech recognition isn't available here — type your question in Hindi or English instead.");
      return;
    }
    const rec = createRecognizer();
    if (!rec) return;
    recognizerRef.current = rec;
    rec.onResult((text) => {
      setQuestion(text);
      ask(text);
    });
    rec.onEnd(() => setListening(false));
    setListening(true);
    rec.start();
  };

  const say = () => {
    if (!reply) return;
    const spoken = speak(reply.hi, "hi-IN") || speak(reply.en, "en-IN");
    if (!spoken) toast("info", "Audio isn't supported here — the advisory is shown below.");
  };

  return (
    <Card className="animate-fade-up">
      <CardBody className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-charcoal-900 text-paper shadow-lift">
          <Mic className="h-6 w-6" />
        </span>
        <h2 className="font-display mt-4 text-2xl font-semibold tracking-tight text-charcoal-900">
          Ask SAATHI
        </h2>
        <p className="mt-1 max-w-md text-sm text-charcoal-500">
          Ask in Hindi or English — about today&apos;s work, the weather, or how
          you feel.
        </p>

        <button
          onClick={toggleMic}
          className={`mt-5 flex h-20 w-20 items-center justify-center rounded-full transition-all ${
            listening
              ? "bg-red-600 text-white scale-105 shadow-lift animate-pulse-soft"
              : "bg-agri-700 text-white shadow-lift hover:bg-agri-800 hover:scale-105"
          }`}
          aria-label={listening ? "Stop listening" : "Ask SAATHI by voice"}
        >
          {listening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
        </button>
        <p className="mt-2 text-[11px] font-semibold text-charcoal-400">
          {listening ? "Listening… speak now" : "🎙️ Ask SAATHI"}
        </p>

        <div className="mt-4 flex w-full max-w-md flex-wrap justify-center gap-2">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => ask(c)}
              className="rounded-full border border-paper-line bg-white px-3 py-1.5 text-[12px] font-semibold text-charcoal-600 transition-colors hover:border-agri-400 hover:text-agri-700 font-hindi"
            >
              {c}
            </button>
          ))}
        </div>

        <form
          className="mt-4 flex w-full max-w-md gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type a question… (हिंदी में भी पूछें)"
            className="h-11 flex-1 rounded-xl border border-paper-line bg-white px-4 text-sm text-charcoal-800 placeholder:text-charcoal-400 focus:border-agri-500 focus:outline-none"
          />
          <button
            type="submit"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-charcoal-900 text-paper transition-colors hover:bg-charcoal-800"
            aria-label="Send question"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>

        {thinking && (
          <div className="mt-5 flex w-full max-w-md items-center gap-2 rounded-xl bg-charcoal-50 px-4 py-3 text-sm text-charcoal-500 animate-fade-in">
            <Loader2 className="h-4 w-4 animate-spin" />
            SAATHI is checking today&apos;s conditions…
          </div>
        )}

        {reply && !thinking && (
          <div className="mt-5 w-full max-w-md rounded-2xl border border-agri-200 bg-agri-50 p-4 text-left animate-fade-up">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold tracking-[0.12em] text-agri-700 uppercase">
                SAATHI advisory
              </p>
              <button
                onClick={say}
                className="flex items-center gap-1.5 rounded-lg bg-agri-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-agri-800"
              >
                <Volume2 className="h-3.5 w-3.5" /> Listen
              </button>
            </div>
            <p className="font-hindi mt-2.5 text-[15px] font-semibold leading-relaxed text-charcoal-800">
              {reply.hi}
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-charcoal-600">
              {reply.en}
            </p>
            <p className="mt-2.5 text-[10.5px] text-charcoal-400">
              Prototype advisory — generated by the transparent risk engine, not a
              medical opinion.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
