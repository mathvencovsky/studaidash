import { cn } from "@/lib/utils";

interface SectionDividerProps {
  variant?: "wave" | "dots" | "gradient";
  className?: string;
  flip?: boolean;
}

export function SectionDivider({ 
  variant = "gradient", 
  className,
  flip = false 
}: SectionDividerProps) {
  if (variant === "wave") {
    return (
      <div className={cn("w-full overflow-hidden", flip && "rotate-180", className)}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-8 md:h-12 fill-current text-muted/30"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex justify-center gap-2 py-4", className)}>
        <span className="w-2 h-2 rounded-full bg-accent-warm/40" />
        <span className="w-2 h-2 rounded-full bg-primary/40" />
        <span className="w-2 h-2 rounded-full bg-accent-warm/40" />
      </div>
    );
  }

  // Gradient divider (default)
  return (
    <div className={cn("h-px w-full max-w-2xl mx-auto bg-gradient-to-r from-transparent via-border to-transparent", className)} />
  );
}
