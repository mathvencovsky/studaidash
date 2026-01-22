import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, BookOpen, Clock } from "lucide-react";
import type { ProgramCalculations } from "@/data/program-data";
import { formatMinutes } from "@/data/program-data";

interface TrailProgressCardProps {
  calculations: ProgramCalculations;
}

export function TrailProgressStatsCard({ calculations }: TrailProgressCardProps) {
  const {
    totalEstimatedMinutes,
    totalCompletedMinutes,
    remainingMinutes,
    totalContents,
    completedContents,
  } = calculations;

  const progressPct = totalEstimatedMinutes > 0 
    ? Math.round((totalCompletedMinutes / totalEstimatedMinutes) * 100)
    : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-[#1A237E] flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Progresso do Programa
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Conteúdo estudado</span>
            <span className="font-bold text-[#1A237E]">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-3" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Clock className="w-4 h-4 text-[#255FF1]" />
              <span className="text-xl font-bold">{formatMinutes(totalCompletedMinutes)}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              de {formatMinutes(totalEstimatedMinutes)} total
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xl font-bold">{completedContents}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              de {totalContents} conteúdos
            </p>
          </div>
        </div>

        {/* Remaining */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Tempo restante</p>
              <p className="text-xs text-muted-foreground">para concluir a trilha</p>
            </div>
          </div>
          <span className="text-xl font-bold text-[#1A237E]">{formatMinutes(remainingMinutes)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
