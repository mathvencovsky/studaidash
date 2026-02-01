import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface HeadlineHighlightProps {
  children: ReactNode;
  variant?: "warm" | "primary";
  className?: string;
}

export function HeadlineHighlight({ 
  children, 
  variant = "warm", 
  className 
}: HeadlineHighlightProps) {
  return (
    <span
      className={cn(
        "relative inline-block",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      {/* Organic marker/highlighter effect */}
      <span
        className={cn(
          "absolute -bottom-0.5 left-0 right-0 h-[0.35em] -z-0 rounded-sm transform -rotate-[0.5deg]",
          variant === "warm" 
            ? "bg-accent-warm/25" 
            : "bg-primary/20"
        )}
        aria-hidden="true"
      />
    </span>
  );
}
