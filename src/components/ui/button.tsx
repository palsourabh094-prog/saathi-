import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus-visible:outline-2 disabled:opacity-45 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-agri-700 text-paper hover:bg-agri-800 active:scale-[0.98] shadow-sm",
  secondary:
    "bg-charcoal-900 text-paper hover:bg-charcoal-800 active:scale-[0.98] shadow-sm",
  outline:
    "border border-charcoal-300 bg-white/60 text-charcoal-800 hover:bg-white hover:border-charcoal-400",
  ghost: "text-charcoal-700 hover:bg-charcoal-100/70",
  danger: "bg-red-700 text-white hover:bg-red-800 active:scale-[0.98] shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-lg",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 rounded-lg",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  ),
);
Button.displayName = "Button";
