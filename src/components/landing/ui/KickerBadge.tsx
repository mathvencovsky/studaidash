import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface KickerBadgeProps {
  children: ReactNode;
  variant?: "warm" | "primary" | "cool";
  className?: string;
}

const variantStyles = {
  warm: "border-accent-warm/30 bg-accent-warm/10 text-accent-warm",
  primary: "border-primary/30 bg-primary/10 text-primary",
  cool: "border-accent-cool/30 bg-accent-cool/10 text-accent-cool",
};

export function KickerBadge({ children, variant = "warm", className }: KickerBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
