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
      <span
        className={cn(
          "absolute bottom-1 left-0 right-0 h-3 -z-0 rounded-sm",
          variant === "warm" 
            ? "bg-accent-warm/20" 
            : "bg-primary/20"
        )}
        aria-hidden="true"
      />
    </span>
  );
}
