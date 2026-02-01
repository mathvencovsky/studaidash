import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionVariant = "plain" | "tint" | "gradient" | "split" | "dark";

interface SectionWrapperProps {
  children: ReactNode;
  variant?: SectionVariant;
  compact?: boolean;
  id?: string;
  className?: string;
  tabIndex?: number;
  withNoise?: boolean;
}

const variantStyles: Record<SectionVariant, string> = {
  plain: "bg-background",
  tint: "bg-muted/50",
  gradient: "bg-gradient-to-br from-primary/5 via-background to-accent-warm/5",
  split: "bg-card border-y-2 border-border",
  dark: "bg-foreground text-background",
};

export function SectionWrapper({
  children,
  variant = "plain",
  compact = false,
  id,
  className,
  tabIndex,
  withNoise = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      tabIndex={tabIndex}
      className={cn(
        variantStyles[variant],
        // Mobile-first spacing: py-10 mobile, py-12/14 desktop
        compact ? "py-8 md:py-10" : "py-10 md:py-12 lg:py-14",
        "outline-none relative overflow-hidden",
        withNoise && "noise-bg",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </div>
    </section>
  );
}
