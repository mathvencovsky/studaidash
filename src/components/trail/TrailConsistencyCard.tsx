import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Calendar } from "lucide-react";
import type { WeeklyStudyData } from "@/data/program-data";

interface TrailConsistencyCardProps {
  weeklyData: WeeklyStudyData[];
  streak: number;
  activeDays7d: number;
}

const dayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];

export function TrailConsistencyCard({ 
  weeklyData, 
  streak,
  activeDays7d 
}: TrailConsistencyCardProps) {
  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes), 60);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-[#1A237E] flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Consistência
          </CardTitle>
          <div className="flex items-center gap-1.5 text-amber-600">
            <Flame className="w-4 h-4" />
            <span className="font-bold">{streak}</span>
            <span className="text-xs text-muted-foreground">dias</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Weekly bar chart */}
        <div className="flex items-end justify-between gap-1.5 h-20">
          {weeklyData.map((day, i) => {
            const heightPct = day.minutes > 0 
              ? Math.max(15, (day.minutes / maxMinutes) * 100)
              : 8;
            const isActive = day.minutes > 0;
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className={`w-full rounded-t transition-all duration-300 ${
                    isActive 
                      ? "bg-[#255FF1]" 
                      : "bg-muted"
                  }`}
                  style={{ height: `${heightPct}%` }}
                  title={`${day.minutes} min`}
                />
                <span className={`text-[10px] ${isActive ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {dayLabels[day.dayOfWeek]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div>
            <p className="text-sm font-medium">Dias ativos esta semana</p>
            <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#1A237E]">{activeDays7d}</span>
            <span className="text-sm text-muted-foreground">/7</span>
          </div>
        </div>

        {/* Consistency message */}
        <div className={`p-3 rounded-lg text-center ${
          activeDays7d >= 5 
            ? "bg-green-50 text-green-700"
            : activeDays7d >= 3
              ? "bg-amber-50 text-amber-700"
              : "bg-red-50 text-red-700"
        }`}>
          <p className="text-sm font-medium">
            {activeDays7d >= 5 
              ? "🎯 Excelente consistência!"
              : activeDays7d >= 3
                ? "📈 Bom progresso, mantenha o ritmo"
                : "💪 Aumente a frequência de estudos"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
