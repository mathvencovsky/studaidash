import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { calculateStudyAnalytics, calculateStudyROI } from "@/data/ai-study-data";
import { formatMinutesToHoursMinutes } from "@/data/trail-planning-data";

export default function Relatorios() {
  const analytics = calculateStudyAnalytics();
  const roi = calculateStudyROI();

  const formatDistTotal = Object.values(analytics.formatDistribution).reduce((a, b) => a + b, 0);
  
  const formatDistPercent = (key: keyof typeof analytics.formatDistribution) => {
    return formatDistTotal > 0 
      ? Math.round((analytics.formatDistribution[key] / formatDistTotal) * 100) 
      : 0;
  };

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const maxHeatmap = Math.max(...analytics.weeklyHeatmap, 1);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">Relatórios</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Dados de estudo.
        </p>
      </div>

      <Tabs defaultValue="tempo" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tempo">Tempo</TabsTrigger>
          <TabsTrigger value="roi">Eficiência</TabsTrigger>
          <TabsTrigger value="engajamento">Atividade</TabsTrigger>
        </TabsList>

        {/* Tempo Tab */}
        <TabsContent value="tempo" className="space-y-4">
          <div className="grid grid-cols-4 gap-3 border rounded-lg p-4 bg-card">
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{formatMinutesToHoursMinutes(analytics.totalMinutes7d)}</p>
              <p className="text-[10px] text-muted-foreground">7 dias</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{formatMinutesToHoursMinutes(analytics.totalMinutes30d)}</p>
              <p className="text-[10px] text-muted-foreground">30 dias</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{analytics.activeDays30d}</p>
              <p className="text-[10px] text-muted-foreground">Dias ativos</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{analytics.averageMinutesPerDay}min</p>
              <p className="text-[10px] text-muted-foreground">Média/dia</p>
            </div>
          </div>

          {/* Format Distribution */}
          <section className="border rounded-lg bg-card p-4 space-y-3">
            <h3 className="font-medium text-foreground text-sm">Distribuição</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Sessões</span>
                  <span className="text-foreground">{formatDistPercent("ai_session")}%</span>
                </div>
                <Progress value={formatDistPercent("ai_session")} className="h-1" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Quizzes</span>
                  <span className="text-foreground">{formatDistPercent("quiz")}%</span>
                </div>
                <Progress value={formatDistPercent("quiz")} className="h-1" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Revisões</span>
                  <span className="text-foreground">{formatDistPercent("review")}%</span>
                </div>
                <Progress value={formatDistPercent("review")} className="h-1" />
              </div>
            </div>
          </section>

          {/* Heatmap */}
          <section className="border rounded-lg bg-card p-4">
            <h3 className="font-medium text-foreground text-sm mb-3">Atividade semanal</h3>
            <div className="flex justify-between gap-2">
              {weekDays.map((day, index) => {
                const intensity = analytics.weeklyHeatmap[index] / maxHeatmap;
                return (
                  <div key={day} className="flex-1 text-center">
                    <div 
                      className="w-full aspect-square rounded mb-1"
                      style={{
                        backgroundColor: `hsl(var(--primary) / ${Math.max(intensity * 0.8, 0.1)})`,
                      }}
                    />
                    <p className="text-[10px] text-muted-foreground">{day}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </TabsContent>

        {/* ROI Tab */}
        <TabsContent value="roi" className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <section className="border rounded-lg bg-card p-4">
              <p className="text-xs text-muted-foreground mb-2">Eficiência</p>
              <p className="text-2xl font-semibold text-foreground">{roi.minutesPerProgressPercent}min</p>
              <p className="text-xs text-muted-foreground">por % de progresso</p>
            </section>

            <section className="border rounded-lg bg-card p-4">
              <p className="text-xs text-muted-foreground mb-2">Velocidade</p>
              <p className="text-2xl font-semibold text-foreground">{roi.weeklyProgressRate}%</p>
              <p className="text-xs text-muted-foreground">progresso por semana</p>
            </section>
          </div>

          <section className="border rounded-lg bg-card p-4">
            <p className="text-xs text-muted-foreground mb-2">Projeção</p>
            <p className="text-sm text-foreground">
              Conclusão estimada em {roi.projectedCompletionWeeks} semanas mantendo o ritmo atual.
            </p>
          </section>
        </TabsContent>

        {/* Engajamento Tab */}
        <TabsContent value="engajamento" className="space-y-4">
          <div className="grid grid-cols-4 gap-3 border rounded-lg p-4 bg-card">
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">85%</p>
              <p className="text-[10px] text-muted-foreground">DAU/MAU</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{analytics.streakCurrent}</p>
              <p className="text-[10px] text-muted-foreground">Streak</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">72%</p>
              <p className="text-[10px] text-muted-foreground">Retenção D7</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">58%</p>
              <p className="text-[10px] text-muted-foreground">Retenção D30</p>
            </div>
          </div>

          <section className="border rounded-lg bg-card p-4">
            <p className="text-xs text-muted-foreground mb-3">Métricas de produto</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-xs text-muted-foreground">Sessões/semana</p>
                <p className="text-lg font-semibold text-foreground">4.2</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-xs text-muted-foreground">Tempo médio</p>
                <p className="text-lg font-semibold text-foreground">23min</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-xs text-muted-foreground">Conclusão</p>
                <p className="text-lg font-semibold text-foreground">67%</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-xs text-muted-foreground">NPS</p>
                <p className="text-lg font-semibold text-foreground">+72</p>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
