import { Calendar, Clock, TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { TrailCalculations } from "@/data/trail-planning-data";
import { formatHoursMinutes, formatDateBR, formatMinutesToHoursMinutes } from "@/data/trail-planning-data";

interface TrailOverviewCardProps {
  trailName: string;
  startDate: string;
  targetDate: string;
  calculations: TrailCalculations;
  totalHours: number;
  completedHours: number;
}

export function TrailOverviewCard({
  trailName,
  startDate,
  targetDate,
  calculations,
  totalHours,
  completedHours,
}: TrailOverviewCardProps) {
  const {
    progressPercent,
    remainingHours,
    daysUntilTarget,
    requiredMinutesPerDay,
    currentDailyAvgMinutes,
    paceRatio,
    onTrack,
    estimatedFinishDate,
  } = calculations;

  const delta = requiredMinutesPerDay - currentDailyAvgMinutes;

  const getStatusConfig = () => {
    if (paceRatio >= 1) {
      return {
        icon: CheckCircle2,
        label: "No ritmo",
        color: "text-green-600",
        bg: "bg-green-50 dark:bg-green-950/30",
        message: "Você está no caminho certo para concluir no prazo!"
      };
    } else if (paceRatio >= 0.7) {
      return {
        icon: AlertTriangle,
        label: "Atenção",
        color: "text-amber-600",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        message: `Estude +${Math.round(delta)}min/dia para voltar ao ritmo`
      };
    } else {
      return {
        icon: TrendingDown,
        label: "Risco",
        color: "text-red-600",
        bg: "bg-red-50 dark:bg-red-950/30",
        message: "Aumente significativamente seu ritmo de estudo"
      };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Visão Geral da Trilha
          </CardTitle>
          <Badge className={`${status.bg} ${status.color} border-0 text-xs`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">{trailName}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="text-center">
            <Calendar className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="font-medium">{formatDateBR(startDate)}</p>
            <p className="text-muted-foreground text-[10px]">Início</p>
          </div>
          <div className="flex-1 mx-4 relative">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-white shadow"
              style={{ left: `${Math.min(progressPercent, 95)}%` }}
            />
          </div>
          <div className="text-center">
            <Target className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="font-medium">{formatDateBR(targetDate)}</p>
            <p className="text-muted-foreground text-[10px]">Meta</p>
          </div>
        </div>

        {/* Key metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-lg sm:text-xl font-bold">{progressPercent}%</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Concluído</p>
          </div>
          <div className="p-2 sm:p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-lg sm:text-xl font-bold">{formatHoursMinutes(remainingHours)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Restantes</p>
          </div>
          <div className="p-2 sm:p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-lg sm:text-xl font-bold">{daysUntilTarget}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Dias p/ meta</p>
          </div>
          <div className="p-2 sm:p-3 bg-muted/50 rounded-lg text-center">
            <p className="text-lg sm:text-xl font-bold">{formatHoursMinutes(totalHours)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total trilha</p>
          </div>
        </div>

        {/* Pace comparison */}
        <div className={`p-3 sm:p-4 rounded-lg ${status.bg}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium">Ritmo necessário vs. atual</span>
            <span className={`text-xs font-semibold ${status.color}`}>
              {paceRatio >= 1 ? "✓ Adequado" : `${Math.round((1 - paceRatio) * 100)}% abaixo`}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-xl sm:text-2xl font-bold">{formatMinutesToHoursMinutes(requiredMinutesPerDay)}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Necessário/dia</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{formatMinutesToHoursMinutes(currentDailyAvgMinutes)}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Média atual/dia</p>
            </div>
          </div>
        </div>

        {/* Projection */}
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
          <TrendingUp className="w-4 h-4 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-xs sm:text-sm">
              <span className="font-medium">Projeção ajustada pela IA:</span>{" "}
              {onTrack 
                ? `Conclusão em ${formatDateBR(estimatedFinishDate)} mantendo ritmo atual`
                : `Conclusão em ${formatDateBR(estimatedFinishDate)} — ${status.message}`
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
