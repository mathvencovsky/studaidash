import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Target, 
  Sparkles,
  BarChart3,
  Activity,
  Clock,
  Award,
  Zap,
  BrainCircuit
} from "lucide-react";

// Mock engagement data for investor demo
const ENGAGEMENT_METRICS = {
  // User Metrics
  dau: 847,
  wau: 2340,
  mau: 5120,
  dauMauRatio: 16.5, // Industry standard ~10-20% is good
  
  // Retention
  d1Retention: 68,
  d7Retention: 42,
  d30Retention: 28,
  
  // Session Metrics
  avgSessionsPerDay: 2.3,
  avgSessionDuration: 18, // minutes
  avgTimePerWeek: 4.2, // hours
  
  // Feature Adoption
  aiSessionsPercent: 78,
  quizCompletionRate: 65,
  trailCompletionRate: 34,
  
  // Growth
  weeklyGrowth: 12.4,
  monthlyGrowth: 47.8,
  npsScore: 72,
};

const WEEKLY_TREND = [
  { day: "Seg", sessions: 1240, ai: 920 },
  { day: "Ter", sessions: 1380, ai: 1050 },
  { day: "Qua", sessions: 1520, ai: 1180 },
  { day: "Qui", sessions: 1450, ai: 1100 },
  { day: "Sex", sessions: 1680, ai: 1320 },
  { day: "Sáb", sessions: 890, ai: 680 },
  { day: "Dom", sessions: 720, ai: 540 },
];

export default function EngajamentoPage() {
  const maxSessions = useMemo(() => 
    Math.max(...WEEKLY_TREND.map(d => d.sessions)), 
    []
  );

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs gap-1">
              <Sparkles className="w-3 h-3" />
              Insights Demo
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A237E]">
            Métricas de Engajamento
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão executiva do comportamento dos usuários
          </p>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="w-4 h-4" />
              <span className="text-xs">DAU</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{ENGAGEMENT_METRICS.dau.toLocaleString()}</p>
            <p className="text-xs text-green-600">+{ENGAGEMENT_METRICS.weeklyGrowth}% vs semana anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">MAU</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{ENGAGEMENT_METRICS.mau.toLocaleString()}</p>
            <p className="text-xs text-green-600">+{ENGAGEMENT_METRICS.monthlyGrowth}% crescimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Target className="w-4 h-4" />
              <span className="text-xs">DAU/MAU</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{ENGAGEMENT_METRICS.dauMauRatio}%</p>
            <p className="text-xs text-muted-foreground">Stickiness ratio</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Award className="w-4 h-4" />
              <span className="text-xs">NPS</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">+{ENGAGEMENT_METRICS.npsScore}</p>
            <p className="text-xs text-muted-foreground">Net Promoter Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Retention Cohort */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Retenção por Coorte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">D1 (Dia seguinte)</span>
                <span className="font-bold">{ENGAGEMENT_METRICS.d1Retention}%</span>
              </div>
              <Progress value={ENGAGEMENT_METRICS.d1Retention} className="h-3" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">D7 (Uma semana)</span>
                <span className="font-bold">{ENGAGEMENT_METRICS.d7Retention}%</span>
              </div>
              <Progress value={ENGAGEMENT_METRICS.d7Retention} className="h-3" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">D30 (Um mês)</span>
                <span className="font-bold">{ENGAGEMENT_METRICS.d30Retention}%</span>
              </div>
              <Progress value={ENGAGEMENT_METRICS.d30Retention} className="h-3" />
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Benchmark EdTech: D1 ~50%, D7 ~25%, D30 ~15%
            </p>
          </CardContent>
        </Card>

        {/* Session Metrics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Sessões
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Sessões/dia</span>
              </div>
              <p className="text-2xl font-bold">{ENGAGEMENT_METRICS.avgSessionsPerDay}</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Duração média</span>
              </div>
              <p className="text-2xl font-bold">{ENGAGEMENT_METRICS.avgSessionDuration} min</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Tempo/semana</span>
              </div>
              <p className="text-2xl font-bold">{ENGAGEMENT_METRICS.avgTimePerWeek}h</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Adoption & Weekly Trend */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Feature Adoption */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-primary" />
              Adoção de Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Sessões com IA
                </span>
                <span className="font-bold">{ENGAGEMENT_METRICS.aiSessionsPercent}%</span>
              </div>
              <Progress value={ENGAGEMENT_METRICS.aiSessionsPercent} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Taxa de conclusão de quiz</span>
                <span className="font-bold">{ENGAGEMENT_METRICS.quizCompletionRate}%</span>
              </div>
              <Progress value={ENGAGEMENT_METRICS.quizCompletionRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Trilhas concluídas</span>
                <span className="font-bold">{ENGAGEMENT_METRICS.trailCompletionRate}%</span>
              </div>
              <Progress value={ENGAGEMENT_METRICS.trailCompletionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Tendência Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {WEEKLY_TREND.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-0.5">
                    <div 
                      className="w-full bg-accent rounded-t"
                      style={{ height: `${(day.ai / maxSessions) * 80}px` }}
                    />
                    <div 
                      className="w-full bg-muted rounded-b"
                      style={{ height: `${((day.sessions - day.ai) / maxSessions) * 80}px` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-accent" />
                <span>Com IA</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-muted" />
                <span>Outros</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
