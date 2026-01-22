import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, TrendingUp, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ProgramCalculations } from "@/data/program-data";
import { formatDateBrazil, formatMinutes } from "@/data/program-data";

interface TrailTimelineCardProps {
  programName: string;
  calculations: ProgramCalculations;
  onEditDates?: () => void;
}

export function TrailTimelineCard({ 
  programName, 
  calculations,
  onEditDates 
}: TrailTimelineCardProps) {
  const {
    startDate,
    targetEndDate,
    timelineProgressPct,
    elapsedDays,
    totalDays,
    remainingDays,
    projectedEndDate,
    status,
  } = calculations;

  const statusConfig = {
    completed: { 
      color: "bg-green-500", 
      bgLight: "bg-green-50",
      text: "text-green-700",
      icon: CheckCircle2,
      label: "Concluída"
    },
    on_track: { 
      color: "bg-green-500", 
      bgLight: "bg-green-50",
      text: "text-green-700",
      icon: CheckCircle2,
      label: "No ritmo"
    },
    attention: { 
      color: "bg-amber-500", 
      bgLight: "bg-amber-50",
      text: "text-amber-700",
      icon: AlertTriangle,
      label: "Atenção"
    },
    at_risk: { 
      color: "bg-red-500", 
      bgLight: "bg-red-50",
      text: "text-red-700",
      icon: AlertTriangle,
      label: "Risco"
    },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  // Calculate week markers for progress bar
  const weekMarkers = [];
  const weeksTotal = Math.ceil(totalDays / 7);
  for (let i = 1; i < weeksTotal && i <= 12; i++) {
    const pct = (i * 7 / totalDays) * 100;
    if (pct < 100) weekMarkers.push(pct);
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg sm:text-xl font-bold text-[#1A237E] flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Linha do Tempo
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{programName}</p>
          </div>
          <Badge 
            variant="secondary" 
            className={`${currentStatus.bgLight} ${currentStatus.text} border-0 shrink-0`}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {currentStatus.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main progress bar with week markers */}
        <div className="relative">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span className="font-medium">{formatDateBrazil(startDate)}</span>
            <span className="font-medium">{formatDateBrazil(targetEndDate)}</span>
          </div>
          
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            {/* Week tick marks */}
            {weekMarkers.map((pct, i) => (
              <div 
                key={i}
                className="absolute top-0 bottom-0 w-px bg-background/50"
                style={{ left: `${pct}%` }}
              />
            ))}
            
            {/* Progress fill */}
            <div 
              className={`absolute top-0 left-0 h-full transition-all duration-500 ${currentStatus.color}`}
              style={{ width: `${Math.min(timelineProgressPct, 100)}%` }}
            />
            
            {/* Today marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-[#1A237E]"
              style={{ left: `${Math.min(timelineProgressPct, 100)}%` }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#1A237E] border-2 border-white" />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs mt-2">
            <span className="text-muted-foreground">Início</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-semibold text-[#1A237E] cursor-help">
                    Dia {elapsedDays} de {totalDays}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{timelineProgressPct}% do tempo decorrido</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-muted-foreground">Meta</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-[#1A237E]">{remainingDays}</p>
            <p className="text-[11px] text-muted-foreground">dias restantes</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">{timelineProgressPct}%</p>
            <p className="text-[11px] text-muted-foreground">tempo decorrido</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">{Math.ceil(totalDays / 7)}</p>
            <p className="text-[11px] text-muted-foreground">semanas totais</p>
          </div>
        </div>

        {/* Projection */}
        {projectedEndDate && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${currentStatus.bgLight} border border-${status === "on_track" || status === "completed" ? "green" : status === "attention" ? "amber" : "red"}-200`}>
            <TrendingUp className={`w-4 h-4 ${currentStatus.text}`} />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Projeção ajustada pela IA
              </p>
              <p className={`text-xs ${currentStatus.text}`}>
                Conclusão em {formatDateBrazil(projectedEndDate)} mantendo ritmo atual
              </p>
            </div>
          </div>
        )}

        {/* Edit button */}
        {onEditDates && (
          <button 
            onClick={onEditDates}
            className="w-full text-sm text-[#255FF1] hover:text-[#1A237E] font-medium py-2 transition-colors"
          >
            Editar datas →
          </button>
        )}
      </CardContent>
    </Card>
  );
}
