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
    <div className={`rounded-2xl p-5 border-2 ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg}`}>
          <Icon size={24} className={config.iconColor} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Recomendação da IA
            </span>
          </div>
          
          <h3 className="font-semibold text-card-foreground mb-2">
            {feedback.title}
          </h3>
          
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {feedback.message}
          </p>

          {feedback.actionLabel && (
            <button
              onClick={onActionClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {feedback.actionLabel}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
