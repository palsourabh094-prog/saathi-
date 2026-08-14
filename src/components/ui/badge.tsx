import type { HTMLAttributes } from "react";
import { riskColor, riskDot } from "@/lib/format";
import type { RiskLevel } from "@/lib/types";

export function Badge({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function RiskBadge({ level, className = "" }: { level: RiskLevel; className?: string }) {
  return (
    <Badge className={`${riskColor(level)} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${riskDot(level)}`} />
      {level === "SEVERE" ? "SEVERE" : level.charAt(0) + level.slice(1).toLowerCase()}
    </Badge>
  );
}
