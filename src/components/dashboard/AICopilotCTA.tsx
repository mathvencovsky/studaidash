import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AIStudyRecommendation } from "@/data/ai-study-data";

interface AICopilotCTAProps {
  recommendation: AIStudyRecommendation;
  onStart: () => void;
}

export function AICopilotCTA({ recommendation, onStart }: AICopilotCTAProps) {
  return (
    <section className="border rounded-lg p-4 bg-card">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">
            Próxima sessão recomendada
          </p>
          <h2 className="text-base font-medium text-foreground">
            {recommendation.moduleName}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {recommendation.estimatedMinutes} min
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={onStart}
          className="w-full sm:w-auto shrink-0"
        >
          Continuar estudo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      
      {/* Subtle note */}
      <p className="text-xs text-muted-foreground/60 mt-3 pt-3 border-t">
        Retomar do último ponto.
      </p>
    </section>
  );
}
