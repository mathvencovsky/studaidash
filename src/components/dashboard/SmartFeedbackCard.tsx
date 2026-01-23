import { ChevronRight } from "lucide-react";
import type { SmartFeedback } from "@/types/studai";

interface SmartFeedbackCardProps {
  feedback: SmartFeedback;
  onActionClick: () => void;
}

export function SmartFeedbackCard({ feedback, onActionClick }: SmartFeedbackCardProps) {
  return (
    <section className="border rounded-lg bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">Observação</p>
          <h3 className="text-sm font-medium text-foreground">
            {feedback.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {feedback.message}
          </p>
        </div>

        {feedback.actionLabel && (
          <button
            onClick={onActionClick}
            className="shrink-0 text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
          >
            Revisar módulo
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </section>
  );
}
