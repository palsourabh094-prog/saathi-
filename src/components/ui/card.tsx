import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  hover = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-paper-line bg-white/80 shadow-card backdrop-blur-sm ${
        hover ? "transition-all hover:shadow-lift hover:-translate-y-0.5" : ""
      } ${className}`}
      {...props}
    />
  );
}

export function CardHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex items-start justify-between gap-3 ${className}`} {...props} />;
}

export function CardTitle({
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`font-display text-[17px] font-semibold tracking-tight text-charcoal-900 ${className}`}
      {...props}
    />
  );
}

export function CardBody({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 sm:p-6 ${className}`} {...props} />;
}
