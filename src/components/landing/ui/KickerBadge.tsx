import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface KickerBadgeProps {
  children: ReactNode;
  variant?: "warm" | "primary" | "cool";
  className?: string;
}

const variantStyles = {
  warm: "border-accent-warm/40 bg-accent-warm/10 text-accent-warm shadow-sm",
  primary: "border-primary/40 bg-primary/10 text-primary shadow-sm",
  cool: "border-accent-cool/40 bg-accent-cool/10 text-accent-cool shadow-sm",
};

export function KickerBadge({ children, variant = "warm", className }: KickerBadgeProps) {
  return (
    <span
      className={cn(
        // Allow wrapping on very small screens to prevent horizontal overflow
        "inline-flex flex-wrap items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border-2 tracking-wide uppercase leading-tight max-w-full min-w-0",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
