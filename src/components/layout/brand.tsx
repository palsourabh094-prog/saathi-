import { Sprout } from "lucide-react";

export function Brand({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          light ? "bg-agri-500/20 text-agri-300" : "bg-agri-700 text-paper"
        }`}
      >
        <Sprout className="h-5 w-5" strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="leading-none">
          <span
            className={`font-display block text-[19px] font-bold tracking-tight ${
              light ? "text-paper" : "text-charcoal-900"
            }`}
          >
            SAATHI
          </span>
          {!light && (
            <span className="mt-0.5 block text-[10px] font-medium tracking-[0.08em] text-charcoal-500 uppercase">
              Rural Resilience &amp; Care
            </span>
          )}
        </span>
      )}
    </div>
  );
}
