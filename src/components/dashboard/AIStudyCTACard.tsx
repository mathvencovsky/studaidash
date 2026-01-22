import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Clock, BookOpen, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AIStudyRecommendation } from "@/data/ai-study-data";

interface AIStudyCTACardProps {
  recommendation: AIStudyRecommendation;
  onStartWithAI: () => void;
  onViewTrail: () => void;
}

export function AIStudyCTACard({ recommendation, onStartWithAI, onViewTrail }: AIStudyCTACardProps) {
  const typeLabels = {
    continue: "Continuar",
    new: "Novo módulo",
    review: "Revisão",
    quiz: "Quiz",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-4 sm:p-6 text-primary-foreground shadow-xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                Estudar com IA
                <Badge variant="secondary" className="bg-white/20 text-white text-[10px] sm:text-xs">
                  {typeLabels[recommendation.type]}
                </Badge>
              </h2>
              <p className="text-xs sm:text-sm opacity-80">Recomendado pela IA</p>
            </div>
          </div>
          <Zap className="w-5 h-5 opacity-60 animate-pulse" />
        </div>

        {/* Recommendation content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 mb-4">
          <p className="font-semibold text-sm sm:text-base mb-1">{recommendation.moduleName}</p>
          <p className="text-xs sm:text-sm opacity-80 mb-2">{recommendation.competency}</p>
          <p className="text-xs opacity-70 leading-relaxed line-clamp-2">
            {recommendation.aiMessage}
          </p>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-3 mb-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>~{recommendation.estimatedMinutes}min</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{recommendation.reason}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            onClick={onStartWithAI}
            size="lg"
            className="flex-1 bg-white text-primary hover:bg-white/90 font-semibold shadow-lg h-12 sm:h-14 text-sm sm:text-base"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Começar com IA
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            onClick={onViewTrail}
            variant="outline"
            size="lg"
            className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10 h-12 sm:h-14 text-sm sm:text-base"
          >
            Ver trilha completa
          </Button>
        </div>
      </div>
    </div>
  );
}
