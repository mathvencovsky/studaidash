import { Sparkles, ArrowRight, Clock, Play, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AIStudyRecommendation } from "@/data/ai-study-data";

interface AICopilotCTAProps {
  recommendation: AIStudyRecommendation;
  onStart: () => void;
}

const typeLabels: Record<string, string> = {
  continue: "Continuar de onde parou",
  new: "Próximo módulo",
  review: "Revisão recomendada",
  quiz: "Avaliação disponível",
};

export function AICopilotCTA({ recommendation, onStart }: AICopilotCTAProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-5 sm:p-8 text-primary-foreground shadow-2xl">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium mb-4">
          <Zap className="w-3 h-3" />
          {typeLabels[recommendation.type] || "Recomendação da IA"}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
          {/* Left: Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">
                Estudar com IA agora
              </h2>
              <p className="text-sm sm:text-base opacity-80 font-medium">
                {recommendation.moduleName}
              </p>
            </div>
            
            <p className="text-sm opacity-70 leading-relaxed max-w-lg line-clamp-2">
              {recommendation.aiMessage}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 opacity-60" />
                <span>~{recommendation.estimatedMinutes} min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 opacity-60" />
                <span className="opacity-80">{recommendation.reason}</span>
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col gap-2 lg:min-w-[200px]">
            <Button
              onClick={onStart}
              size="lg"
              className="w-full bg-white text-primary hover:bg-white/90 font-bold shadow-xl h-14 text-base group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Começar agora
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-[11px] text-center opacity-60">
              A IA ajustou seu plano com base no seu progresso
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
