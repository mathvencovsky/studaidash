import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Clock, PlayCircle } from "lucide-react";
import type { ContentNode } from "@/data/program-data";
import { formatMinutes } from "@/data/program-data";

interface TrailNextStepCardProps {
  nextContent: ContentNode | null;
  onContinue: () => void;
}

export function TrailNextStepCard({ nextContent, onContinue }: TrailNextStepCardProps) {
  if (!nextContent) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-lg text-green-800 mb-1">Trilha Concluída!</h3>
          <p className="text-sm text-green-600">
            Parabéns! Você completou todo o conteúdo.
          </p>
        </CardContent>
      </Card>
    );
  }

  const remainingMinutes = nextContent.estimatedMinutes - nextContent.completedMinutes;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-[#1A237E] flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Próximo Passo
          <span className="text-xs font-normal text-muted-foreground ml-auto">
            Recomendado pela IA
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="p-3 rounded-lg bg-white/60 border border-white">
          <p className="font-semibold text-sm text-foreground">{nextContent.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{nextContent.competency}</p>
          
          <div className="flex items-center gap-3 mt-2 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatMinutes(remainingMinutes)} restantes</span>
            </div>
            {nextContent.status === "in_progress" && (
              <span className="text-[#255FF1] font-medium">
                {Math.round((nextContent.completedMinutes / nextContent.estimatedMinutes) * 100)}% concluído
              </span>
            )}
          </div>
        </div>

        <Button 
          onClick={onContinue}
          className="w-full bg-[#255FF1] hover:bg-[#1A237E] h-11 font-semibold"
        >
          <PlayCircle className="w-4 h-4 mr-2" />
          {nextContent.status === "in_progress" ? "Continuar" : "Começar"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
