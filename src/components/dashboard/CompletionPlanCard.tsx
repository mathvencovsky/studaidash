import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Edit3
} from "lucide-react";
import type { TrailPlan, TrailCalculations } from "@/data/trail-planning-data";
import { formatHoursMinutes, formatDateBR, formatMinutesToHoursMinutes } from "@/data/trail-planning-data";

interface CompletionPlanCardProps {
  trail: TrailPlan;
  calculations: TrailCalculations;
  onEditTarget?: () => void;
  loading?: boolean;
  compact?: boolean;
}

export function CompletionPlanCard({ 
  trail, 
  calculations, 
  onEditTarget,
  loading = false,
  compact = false
}: CompletionPlanCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Plano de Conclusão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-8 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const { 
    remainingHours, 
    progressPercent,
    daysUntilTarget,
    requiredMinutesPerDay,
    requiredHoursPerWeek,
    onTrack,
    paceRatio
  } = calculations;

  const getStatusConfig = () => {
    if (paceRatio >= 1) {
      return {
        icon: CheckCircle2,
        label: "No ritmo",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200"
      };
    } else if (paceRatio >= 0.7) {
      return {
        icon: AlertTriangle,
        label: "Atenção",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200"
      };
    } else {
      return {
        icon: TrendingDown,
        label: "Abaixo do ritmo",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200"
      };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  if (compact) {
    return (
      <Card className={`${status.bg} ${status.border} border overflow-hidden`}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className={`p-1.5 sm:p-2 rounded-full ${status.bg} shrink-0`}>
                <StatusIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${status.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className={`text-xs sm:text-sm font-semibold ${status.color}`}>{status.label}</span>
                  <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0">
                    {progressPercent}% concluído
                  </Badge>
                </div>
                <p className="text-[10px] sm:text-sm text-muted-foreground truncate">
                  Faltam {formatHoursMinutes(remainingHours)} • Meta: {formatDateBR(trail.targetDate)}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm sm:text-lg font-bold">{formatMinutesToHoursMinutes(requiredMinutesPerDay)}</p>
              <p className="text-[9px] sm:text-xs text-muted-foreground">por dia</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Plano de Conclusão
          </CardTitle>
          <Badge className={`${status.bg} ${status.color} border ${status.border}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Target Date */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Meta de conclusão</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatDateBR(trail.targetDate)}</span>
            {onEditTarget && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEditTarget}>
                <Edit3 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso geral</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatHoursMinutes(trail.completedHours)} estudadas</span>
            <span>{formatHoursMinutes(trail.totalEstimatedHours)} total</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="flex gap-2 sm:grid sm:grid-cols-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          <div className="p-2.5 sm:p-3 bg-muted/50 rounded-lg text-center min-w-[100px] flex-shrink-0 sm:min-w-0 sm:flex-shrink">
            <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-base sm:text-lg font-bold whitespace-nowrap">{formatHoursMinutes(remainingHours)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">restantes</p>
          </div>
          <div className="p-2.5 sm:p-3 bg-muted/50 rounded-lg text-center min-w-[100px] flex-shrink-0 sm:min-w-0 sm:flex-shrink">
            <Calendar className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-base sm:text-lg font-bold whitespace-nowrap">{daysUntilTarget}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">dias até a meta</p>
          </div>
        </div>

        {/* Required Pace */}
        <div className={`p-3 sm:p-4 rounded-lg border ${status.border} ${status.bg}`}>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">Para terminar no prazo, estude:</p>
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-4">
            <div>
              <span className="text-xl sm:text-2xl font-bold">{formatMinutesToHoursMinutes(requiredMinutesPerDay)}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">/dia</span>
            </div>
            <span className="text-muted-foreground text-sm">ou</span>
            <div>
              <span className="text-xl sm:text-2xl font-bold">{formatHoursMinutes(requiredHoursPerWeek)}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">/semana</span>
            </div>
          </div>
        </div>

        {/* Recommendation if behind */}
        {!onTrack && calculations.extraMinutesNeededToday > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              💡 <strong>Dica:</strong> Estude +{calculations.extraMinutesNeededToday}min hoje para voltar ao ritmo.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
