import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionVariant = "plain" | "tint" | "gradient" | "split";

interface SectionWrapperProps {
  children: ReactNode;
  variant?: SectionVariant;
  compact?: boolean;
  id?: string;
  className?: string;
  tabIndex?: number;
}

const variantStyles: Record<SectionVariant, string> = {
  plain: "bg-background",
  tint: "bg-muted/40",
  gradient: "bg-gradient-to-br from-primary/5 via-background to-accent/5",
  split: "bg-card border-y border-border",
};

export function SectionWrapper({
  children,
  variant = "plain",
  compact = false,
  id,
  className,
  tabIndex,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      tabIndex={tabIndex}
      className={cn(
        variantStyles[variant],
        compact ? "py-10 md:py-12" : "py-12 md:py-16",
        "outline-none",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
