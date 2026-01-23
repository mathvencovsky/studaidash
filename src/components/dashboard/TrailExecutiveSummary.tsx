import { Calendar, Clock, TrendingUp, Target, CheckCircle2, AlertTriangle, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TrailCalculations } from "@/data/trail-planning-data";
import { formatHoursMinutes, formatDateBR, formatMinutesToHoursMinutes } from "@/data/trail-planning-data";

interface TrailExecutiveSummaryProps {
  trailName: string;
  startDate: string;
  targetDate: string;
  calculations: TrailCalculations;
  totalHours: number;
  completedHours: number;
  streak?: number;
  onViewDetails?: () => void;
}

export function TrailExecutiveSummary({
  trailName,
  startDate,
  targetDate,
  calculations,
  totalHours,
  completedHours,
  streak = 0,
  onViewDetails,
}: TrailExecutiveSummaryProps) {
  const {
    progressPercent,
    remainingHours,
    daysUntilTarget,
    requiredMinutesPerDay,
    paceRatio,
    onTrack,
    estimatedFinishDate,
  } = calculations;

  const getStatusConfig = () => {
    if (paceRatio >= 1) {
      return {
        icon: CheckCircle2,
        label: "No ritmo",
        color: "text-status-success-text",
        bg: "bg-status-success/50",
        message: "Mantendo esse ritmo, você conclui no prazo!"
      };
    } else if (paceRatio >= 0.7) {
      return {
        icon: AlertTriangle,
        label: "Atenção",
        color: "text-status-warning",
        bg: "bg-status-warning/20",
        message: "Aumente um pouco o ritmo para garantir a meta"
      };
    } else {
      return {
        icon: AlertTriangle,
        label: "Atrasado",
        color: "text-destructive",
        bg: "bg-destructive/10",
        message: "Ritmo abaixo do necessário para a meta"
      };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  return (
    <section className="bg-card border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Visão da Trilha</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{trailName}</p>
            </div>
          </div>
          
          <Badge className={`${status.bg} ${status.color} border-0 shrink-0`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="p-4 sm:p-5 border-b bg-muted/20">
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Início:</span>
            <span className="font-medium">{formatDateBR(startDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Meta:</span>
            <span className="font-medium">{formatDateBR(targetDate)}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md"
            style={{ left: `calc(${Math.min(progressPercent, 96)}% - 8px)` }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">
            {formatHoursMinutes(completedHours)} concluídas
          </span>
          <span className="text-xs font-semibold text-foreground">
            {progressPercent}% completo
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0">
        <div className="p-3 sm:p-4 text-center">
          <p className="text-lg sm:text-xl font-bold text-foreground">{formatHoursMinutes(remainingHours)}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Restantes</p>
        </div>
        <div className="p-3 sm:p-4 text-center">
          <p className="text-lg sm:text-xl font-bold text-foreground">{daysUntilTarget}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Dias p/ meta</p>
        </div>
        <div className="p-3 sm:p-4 text-center">
          <p className="text-lg sm:text-xl font-bold text-foreground">{formatMinutesToHoursMinutes(requiredMinutesPerDay)}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Necessário/dia</p>
        </div>
        <div className="p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-warning" />
            <p className="text-lg sm:text-xl font-bold text-foreground">{streak}</p>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Dias seguidos</p>
        </div>
      </div>

      {/* AI Projection */}
      <div className="p-4 border-t bg-primary/5">
        <div className="flex items-start gap-2">
          <TrendingUp className={`w-4 h-4 mt-0.5 shrink-0 ${status.color}`} />
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-foreground">
              <span className="font-medium">Projeção da IA:</span>{" "}
              {onTrack 
                ? `Conclusão em ${formatDateBR(estimatedFinishDate)} mantendo o ritmo atual`
                : status.message
              }
            </p>
          </div>
        </div>
      </div>

      {/* View Details Link */}
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full p-3 text-center text-sm font-medium text-primary hover:bg-muted/50 transition-colors border-t"
        >
          Ver trilha completa →
        </button>
      )}
    </section>
  );
}
