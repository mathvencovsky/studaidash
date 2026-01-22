import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Calendar, 
  TrendingUp, 
  Target, 
  BarChart3, 
  PieChart,
  Users,
  Zap,
  BookOpen,
  FileQuestion,
  RotateCcw,
  Layers
} from "lucide-react";
import { calculateStudyAnalytics, calculateStudyROI } from "@/data/ai-study-data";
import { formatHoursMinutes, formatMinutesToHoursMinutes } from "@/data/trail-planning-data";

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
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          Relatórios
        </h1>
        <p className="text-muted-foreground mt-1">Analytics detalhado do seu progresso</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tempo" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tempo">Tempo de Estudo</TabsTrigger>
          <TabsTrigger value="roi">ROI de Estudo</TabsTrigger>
          <TabsTrigger value="engajamento">Engajamento</TabsTrigger>
        </TabsList>

        {/* Tempo de Estudo Tab */}
        <TabsContent value="tempo" className="space-y-4">
          {/* Time Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-xl sm:text-2xl font-bold">{formatMinutesToHoursMinutes(analytics.totalMinutes7d)}</p>
                <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-xl sm:text-2xl font-bold">{formatMinutesToHoursMinutes(analytics.totalMinutes30d)}</p>
                <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-5 h-5 mx-auto mb-2 text-green-600" />
                <p className="text-xl sm:text-2xl font-bold">{analytics.activeDays30d}</p>
                <p className="text-xs text-muted-foreground">Dias ativos/mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-2 text-amber-600" />
                <p className="text-xl sm:text-2xl font-bold">{analytics.averageMinutesPerDay}min</p>
                <p className="text-xs text-muted-foreground">Média/dia</p>
              </CardContent>
            </Card>
          </div>

          {/* Format Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="w-4 h-4 text-primary" />
                Distribuição por Formato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sessões com IA</span>
                      <span className="font-medium">{formatDistPercent("ai_session")}%</span>
                    </div>
                    <Progress value={formatDistPercent("ai_session")} className="h-2" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <FileQuestion className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Quizzes</span>
                      <span className="font-medium">{formatDistPercent("quiz")}%</span>
                    </div>
                    <Progress value={formatDistPercent("quiz")} className="h-2 [&>div]:bg-amber-500" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <RotateCcw className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Revisões</span>
                      <span className="font-medium">{formatDistPercent("review")}%</span>
                    </div>
                    <Progress value={formatDistPercent("review")} className="h-2 [&>div]:bg-green-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Heatmap */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Heatmap Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between gap-2">
                {weekDays.map((day, index) => {
                  const intensity = analytics.weeklyHeatmap[index] / maxHeatmap;
                  return (
                    <div key={day} className="flex-1 text-center">
                      <div 
                        className="w-full aspect-square rounded-lg mb-1 transition-colors"
                        style={{
                          backgroundColor: `hsl(var(--primary) / ${Math.max(intensity * 0.8, 0.1)})`,
                        }}
                      />
                      <p className="text-[10px] text-muted-foreground">{day}</p>
                      <p className="text-xs font-medium">{analytics.weeklyHeatmap[index]}m</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROI Tab */}
        <TabsContent value="roi" className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Eficiência de Estudo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Badge 
                    className={`mb-3 ${
                      roi.efficiency === "high" ? "bg-green-100 text-green-700" :
                      roi.efficiency === "medium" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}
                  >
                    {roi.efficiency === "high" ? "Alta" : roi.efficiency === "medium" ? "Média" : "Baixa"} Eficiência
                  </Badge>
                  <p className="text-3xl font-bold mb-1">{roi.minutesPerProgressPercent}min</p>
                  <p className="text-sm text-muted-foreground">por % de progresso</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Velocidade de Avanço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-3xl font-bold mb-1">{roi.weeklyProgressRate}%</p>
                  <p className="text-sm text-muted-foreground">progresso por semana</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Projeção: {roi.projectedCompletionWeeks} semanas para conclusão
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Insights da IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm">
                    💡 <strong>Dica:</strong> Você estuda em média {analytics.averageMinutesPerDay} minutos por dia. 
                    Para melhorar sua eficiência, tente sessões mais focadas de 25-30 minutos com pausas.
                  </p>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm">
                    📊 <strong>Análise:</strong> Seus dias mais produtivos são {
                      weekDays[analytics.weeklyHeatmap.indexOf(Math.max(...analytics.weeklyHeatmap))]
                    }. Considere agendar sessões importantes nesse dia.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engajamento Tab */}
        <TabsContent value="engajamento" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-xl font-bold">85%</p>
                <p className="text-xs text-muted-foreground">DAU/MAU mock</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="w-5 h-5 mx-auto mb-2 text-amber-600" />
                <p className="text-xl font-bold">{analytics.streakCurrent}</p>
                <p className="text-xs text-muted-foreground">Streak atual</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-2 text-green-600" />
                <p className="text-xl font-bold">72%</p>
                <p className="text-xs text-muted-foreground">Retenção D7 mock</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-5 h-5 mx-auto mb-2 text-purple-600" />
                <p className="text-xl font-bold">58%</p>
                <p className="text-xs text-muted-foreground">Retenção D30 mock</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Métricas de Produto (Mock)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Dados simulados para demonstração investor-ready
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Sessões por usuário/semana</p>
                  <p className="text-2xl font-bold">4.2</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Tempo médio por sessão</p>
                  <p className="text-2xl font-bold">23min</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Taxa de conclusão</p>
                  <p className="text-2xl font-bold">67%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">NPS Score</p>
                  <p className="text-2xl font-bold">+72</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
