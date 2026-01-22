import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Clock, Zap, HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ProgramCalculations } from "@/data/program-data";
import { formatMinutes } from "@/data/program-data";

interface TrailPaceCardProps {
  calculations: ProgramCalculations;
}

export function TrailPaceCard({ calculations }: TrailPaceCardProps) {
  const {
    requiredDailyMin,
    currentDailyAvgMin,
    deltaDailyMin,
    status,
    statusMessage,
    studiedMinutes7d,
    activeDays7d,
  } = calculations;

  const statusConfig = {
    completed: { 
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      accent: "text-green-600",
      icon: TrendingUp,
    },
    on_track: { 
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      accent: "text-green-600",
      icon: TrendingUp,
    },
    attention: { 
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      accent: "text-amber-600",
      icon: TrendingUp,
    },
    at_risk: { 
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      accent: "text-red-600",
      icon: TrendingDown,
    },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  const paceRatio = requiredDailyMin > 0 
    ? Math.round((currentDailyAvgMin / requiredDailyMin) * 100) 
    : 100;

  return (
    <Card className={`${currentStatus.bg} ${currentStatus.border} border-2`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-[#1A237E] flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Ritmo de Estudo
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  <strong>Ritmo necessário:</strong> Minutos/dia para concluir no prazo
                  <br /><br />
                  <strong>Fórmula:</strong> Minutos restantes ÷ Dias restantes
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main metric */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-4xl font-bold text-[#1A237E]">{requiredDailyMin}</span>
            <span className="text-lg text-muted-foreground">min/dia</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">necessário para concluir no prazo</p>
        </div>

        {/* Current vs Required comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-white/60 border border-white">
            <div className="flex items-center justify-center gap-1">
              <StatusIcon className={`w-4 h-4 ${currentStatus.accent}`} />
              <span className="text-xl font-bold">{currentDailyAvgMin}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">média atual/dia</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/60 border border-white">
            <span className="text-xl font-bold">{paceRatio}%</span>
            <p className="text-[10px] text-muted-foreground">do ritmo ideal</p>
          </div>
        </div>

        {/* Status message */}
        <div className={`p-3 rounded-lg bg-white/80 border ${currentStatus.border}`}>
          <div className="flex items-start gap-2">
            <StatusIcon className={`w-4 h-4 ${currentStatus.accent} shrink-0 mt-0.5`} />
            <div>
              <p className={`text-sm font-medium ${currentStatus.text}`}>
                {deltaDailyMin > 0 ? `+${deltaDailyMin} min/dia` : deltaDailyMin < 0 ? `${deltaDailyMin} min/dia de folga` : "No ritmo!"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {statusMessage}
              </p>
            </div>
          </div>
        </div>

        {/* 7-day summary */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/50">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Últimos 7 dias:</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium">{formatMinutes(studiedMinutes7d)}</span>
            <span className="text-muted-foreground">•</span>
            <span className="font-medium">{activeDays7d}/7 dias ativos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
