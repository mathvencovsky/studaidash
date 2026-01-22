import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Flame, 
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import type { TrailCalculations, UserStudyData } from "@/data/trail-planning-data";
import { formatDateBR, formatMinutesToHoursMinutes, formatHoursMinutes } from "@/data/trail-planning-data";

interface CurrentPaceCardProps {
  calculations: TrailCalculations;
  studyData: UserStudyData;
  loading?: boolean;
}

export function CurrentPaceCard({ 
  calculations, 
  studyData,
  loading = false 
}: CurrentPaceCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Ritmo Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            <div className="h-12 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const { 
    currentDailyAvgMinutes,
    currentWeeklyHours,
    studyDaysLast7,
    onTrack,
    paceRatio,
    estimatedFinishDate,
    daysToFinishAtCurrentPace,
    requiredMinutesPerDay
  } = calculations;

  const hasStudyData = studyData.studyLog.some(entry => entry.minutesStudied > 0);

  // Empty state
  if (!hasStudyData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Ritmo Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Clock className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">Nenhum estudo registrado ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Complete sua primeira missão para ver seu ritmo
            </p>
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
            <TrendingUp className="w-5 h-5 text-primary" />
            Ritmo Atual
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-semibold">{studyData.streak} dias</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Pace Stats */}
        <div className="flex gap-2 sm:grid sm:grid-cols-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          <div className="p-2.5 sm:p-3 bg-muted/50 rounded-lg text-center min-w-[120px] flex-shrink-0 sm:min-w-0 sm:flex-shrink">
            <p className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
              {formatMinutesToHoursMinutes(currentDailyAvgMinutes)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">média/dia (7 dias)</p>
          </div>
          <div className="p-2.5 sm:p-3 bg-muted/50 rounded-lg text-center min-w-[100px] flex-shrink-0 sm:min-w-0 sm:flex-shrink">
            <p className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
              {studyDaysLast7}/7
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">dias estudados</p>
          </div>
        </div>

        {/* Pace Comparison */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Seu ritmo vs necessário</span>
            <Badge variant={onTrack ? "default" : "secondary"} className={onTrack ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
              {Math.round(paceRatio * 100)}%
            </Badge>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`absolute left-0 top-0 h-full rounded-full transition-all ${onTrack ? "bg-green-500" : "bg-amber-500"}`}
              style={{ width: `${Math.min(paceRatio * 100, 100)}%` }}
            />
            {/* Target line */}
            <div className="absolute left-[100%] top-0 h-full w-0.5 bg-primary transform -translate-x-1/2" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Atual: {formatMinutesToHoursMinutes(currentDailyAvgMinutes)}/dia</span>
            <span>Meta: {formatMinutesToHoursMinutes(requiredMinutesPerDay)}/dia</span>
          </div>
        </div>

        {/* Projection */}
        <div className={`p-4 rounded-lg border ${onTrack ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <div className="flex items-start gap-3">
            {onTrack ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${onTrack ? "text-green-800" : "text-amber-800"}`}>
                {onTrack ? "Você está no ritmo! ✨" : "Atenção ao ritmo"}
              </p>
              <p className={`text-sm mt-1 ${onTrack ? "text-green-700" : "text-amber-700"}`}>
                Mantendo esse ritmo, você termina em{" "}
                <strong>{formatDateBR(estimatedFinishDate)}</strong>
                {" "}({daysToFinishAtCurrentPace} dias)
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="flex items-center justify-between text-sm p-3 bg-muted/30 rounded-lg">
          <span className="text-muted-foreground">Esta semana:</span>
          <span className="font-semibold">{formatHoursMinutes(currentWeeklyHours)} estudadas</span>
        </div>
      </CardContent>
    </Card>
  );
}
