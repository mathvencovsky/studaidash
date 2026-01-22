import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  PlayCircle, 
  ArrowRight, 
  Clock, 
  Zap,
  BrainCircuit,
  Target
} from "lucide-react";
import type { AIStudyRecommendation } from "@/data/ai-study-data";

interface AICopilotCardProps {
  recommendation: AIStudyRecommendation;
  onStartWithAI: () => void;
  streak?: number;
}

const TYPE_LABELS: Record<string, string> = {
  continue: "Continuar",
  review: "Revisar",
  next_module: "Novo Módulo",
  frequent: "Reforço",
  default: "Sugerido"
};

export function AICopilotCard({
  recommendation,
  onStartWithAI,
  streak = 0,
}: AICopilotCardProps) {
  const typeLabel = TYPE_LABELS[recommendation.type] || "Recomendação";

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      {/* Gradient Header - Premium AI Copilot Look */}
      <div className="bg-gradient-to-r from-[#1A237E] via-[#1e3a8a] to-[#255FF1] p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-lg sm:text-xl">Copiloto de Estudos</h2>
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <p className="text-white/70 text-sm">IA que adapta ao seu ritmo</p>
            </div>
          </div>
          {streak > 0 && (
            <Badge className="bg-white/20 text-white border-0 shrink-0">
              🔥 {streak} dias
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* AI Message */}
        <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-accent/5 border border-accent/10">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base text-foreground leading-relaxed">
              {recommendation.aiMessage}
            </p>
          </div>
        </div>

        {/* Recommendation Details */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Target className="w-3 h-3" />
            {typeLabel}
          </Badge>
          <Badge variant="outline" className="gap-1">
            {recommendation.moduleName}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            ~{recommendation.estimatedMinutes} min
          </Badge>
        </div>

        {/* Primary CTA */}
        <Button 
          onClick={onStartWithAI}
          className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold gap-2 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
        >
          <PlayCircle className="w-5 h-5" />
          Estudar com IA agora
          <ArrowRight className="w-5 h-5" />
        </Button>

        {/* Secondary Info */}
        <p className="text-xs text-center text-muted-foreground">
          <Zap className="w-3 h-3 inline mr-1" />
          A IA ajusta o conteúdo automaticamente ao seu progresso
        </p>
      </CardContent>
    </Card>
  );
}
