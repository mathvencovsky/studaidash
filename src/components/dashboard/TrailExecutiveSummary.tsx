import { ChevronRight } from "lucide-react";
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

  const getStatusLabel = () => {
    if (paceRatio >= 1) return "No ritmo";
    if (paceRatio >= 0.7) return "Atenção";
    return "Atrasado";
  };

  const getStatusColor = () => {
    if (paceRatio >= 1) return "text-foreground";
    if (paceRatio >= 0.7) return "text-muted-foreground";
    return "text-destructive";
  };

  return (
    <section className="border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Status da trilha</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{trailName}</p>
          </div>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{formatDateBR(startDate)}</span>
          <span>Meta: {formatDateBR(targetDate)}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">
            {formatHoursMinutes(completedHours)} estudadas
          </span>
          <span className="text-sm font-medium text-foreground">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 divide-x">
        <div className="p-3 text-center">
          <p className="text-base font-semibold text-foreground">{formatHoursMinutes(remainingHours)}</p>
          <p className="text-[10px] text-muted-foreground">Restantes</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-base font-semibold text-foreground">{daysUntilTarget}</p>
          <p className="text-[10px] text-muted-foreground">Dias</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-base font-semibold text-foreground">{formatMinutesToHoursMinutes(requiredMinutesPerDay)}</p>
          <p className="text-[10px] text-muted-foreground">/dia</p>
        </div>
      </div>

      {/* Projection */}
      <div className="p-3 border-t text-xs text-muted-foreground">
        {onTrack 
          ? `Projeção: ${formatDateBR(estimatedFinishDate)}`
          : `Ritmo atual: ${Math.round(paceRatio * 100)}% do necessário`
        }
      </div>

      {/* View Details */}
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full p-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-t flex items-center justify-center gap-1"
        >
          Ver detalhes
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </section>
  );
}
