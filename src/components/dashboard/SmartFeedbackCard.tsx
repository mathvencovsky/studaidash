import { Lightbulb, ArrowRight, Target, AlertTriangle, Sparkles, Trophy } from "lucide-react";
import type { SmartFeedback } from "@/types/studai";

interface SmartFeedbackCardProps {
  feedback: SmartFeedback;
  onActionClick: () => void;
}

export function SmartFeedbackCard({ feedback, onActionClick }: SmartFeedbackCardProps) {
  const typeConfig = {
    focus: {
      icon: Target,
      bg: "bg-accent/5",
      border: "border-accent/20",
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
    weakness: {
      icon: AlertTriangle,
      bg: "bg-warning/5",
      border: "border-warning/20",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
    suggestion: {
      icon: Lightbulb,
      bg: "bg-primary/5",
      border: "border-primary/20",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    celebration: {
      icon: Trophy,
      bg: "bg-status-success",
      border: "border-status-success-text/20",
      iconBg: "bg-status-success-text/10",
      iconColor: "text-status-success-text",
    },
  };

  const config = typeConfig[feedback.type];
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl p-3 sm:p-5 border-2 w-full overflow-hidden ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-2.5 sm:gap-4">
        {/* Icon */}
        <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg}`}>
          <Icon size={18} className={`sm:w-6 sm:h-6 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <Sparkles size={10} className="sm:w-3.5 sm:h-3.5 text-accent shrink-0" />
            <span className="text-[9px] sm:text-xs font-semibold text-accent uppercase tracking-wider">
              Recomendação da IA
            </span>
          </div>
          
          <h3 className="font-semibold text-xs sm:text-base text-card-foreground mb-1 sm:mb-2 leading-tight">
            {feedback.title}
          </h3>
          
          <p className="text-[10px] sm:text-sm text-muted-foreground leading-relaxed mb-2.5 sm:mb-4 line-clamp-3 sm:line-clamp-none">
            {feedback.message}
          </p>

          {feedback.actionLabel && (
            <button
              onClick={onActionClick}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-accent text-accent-foreground rounded-xl text-[10px] sm:text-sm font-semibold hover:opacity-90 transition-all active:scale-95 touch-manipulation"
            >
              {feedback.actionLabel}
              <ArrowRight size={12} className="sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
