import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AIStudyRecommendation } from "@/data/ai-study-data";

interface AICopilotCTAProps {
  recommendation: AIStudyRecommendation;
  onStart: () => void;
}

const typeLabels: Record<string, string> = {
  continue: "Continuar",
  new: "Próximo",
  review: "Revisão",
  quiz: "Avaliação",
};

export function AICopilotCTA({ recommendation, onStart }: AICopilotCTAProps) {
  return (
    <section className="border rounded-lg p-4 sm:p-5 bg-card">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Próxima ação
          </p>
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            {recommendation.moduleName}
          </h2>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {recommendation.estimatedMinutes} min
            </span>
            <span>·</span>
            <span>{typeLabels[recommendation.type] || recommendation.type}</span>
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={onStart}
          className="w-full sm:w-auto shrink-0"
        >
          Continuar
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      
      {/* Subtle AI note */}
      <p className="text-xs text-muted-foreground/70 mt-3 pt-3 border-t">
        Plano ajustado com base no seu progresso.
      </p>
    </section>
  );
}
