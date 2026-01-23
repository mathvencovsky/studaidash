import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";

const ENGAGEMENT_METRICS = {
  dau: 847,
  wau: 2340,
  mau: 5120,
  dauMauRatio: 16.5,
  d1Retention: 68,
  d7Retention: 42,
  d30Retention: 28,
  avgSessionsPerDay: 2.3,
  avgSessionDuration: 18,
  avgTimePerWeek: 4.2,
  aiSessionsPercent: 78,
  quizCompletionRate: 65,
  trailCompletionRate: 34,
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
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">Atividade</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Métricas de engajamento.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-3 border rounded-lg p-4 bg-card">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{ENGAGEMENT_METRICS.dau.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">DAU</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{ENGAGEMENT_METRICS.mau.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">MAU</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{ENGAGEMENT_METRICS.dauMauRatio}%</p>
          <p className="text-[10px] text-muted-foreground">Stickiness</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">+{ENGAGEMENT_METRICS.npsScore}</p>
          <p className="text-[10px] text-muted-foreground">NPS</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Retention */}
        <section className="border rounded-lg bg-card p-4 space-y-4">
          <h3 className="font-medium text-foreground text-sm">Retenção</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">D1</span>
                <span className="text-foreground">{ENGAGEMENT_METRICS.d1Retention}%</span>
              </div>
              <Progress value={ENGAGEMENT_METRICS.d1Retention} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">D7</span>
                <span className="text-foreground">{ENGAGEMENT_METRICS.d7Retention}%</span>
              </div>
              <Progress value={ENGAGEMENT_METRICS.d7Retention} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">D30</span>
                <span className="text-foreground">{ENGAGEMENT_METRICS.d30Retention}%</span>
              </div>
              <Progress value={ENGAGEMENT_METRICS.d30Retention} className="h-2" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Benchmark EdTech: D1 ~50%, D7 ~25%, D30 ~15%
          </p>
        </section>

        {/* Sessions */}
        <section className="border rounded-lg bg-card p-4 space-y-3">
          <h3 className="font-medium text-foreground text-sm">Sessões</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-muted/30 rounded-md text-center">
              <p className="text-lg font-semibold text-foreground">{ENGAGEMENT_METRICS.avgSessionsPerDay}</p>
              <p className="text-[10px] text-muted-foreground">Por dia</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-md text-center">
              <p className="text-lg font-semibold text-foreground">{ENGAGEMENT_METRICS.avgSessionDuration}min</p>
              <p className="text-[10px] text-muted-foreground">Duração</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-md text-center">
              <p className="text-lg font-semibold text-foreground">{ENGAGEMENT_METRICS.avgTimePerWeek}h</p>
              <p className="text-[10px] text-muted-foreground">Semana</p>
            </div>
          </div>
        </section>
      </div>

      {/* Feature Adoption */}
      <section className="border rounded-lg bg-card p-4 space-y-3">
        <h3 className="font-medium text-foreground text-sm">Adoção</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Sessões guiadas</span>
              <span className="text-foreground">{ENGAGEMENT_METRICS.aiSessionsPercent}%</span>
            </div>
            <Progress value={ENGAGEMENT_METRICS.aiSessionsPercent} className="h-1" />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Quizzes concluídos</span>
              <span className="text-foreground">{ENGAGEMENT_METRICS.quizCompletionRate}%</span>
            </div>
            <Progress value={ENGAGEMENT_METRICS.quizCompletionRate} className="h-1" />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Trilhas concluídas</span>
              <span className="text-foreground">{ENGAGEMENT_METRICS.trailCompletionRate}%</span>
            </div>
            <Progress value={ENGAGEMENT_METRICS.trailCompletionRate} className="h-1" />
          </div>
        </div>
      </section>

      {/* Weekly Trend */}
      <section className="border rounded-lg bg-card p-4">
        <h3 className="font-medium text-foreground text-sm mb-3">Tendência semanal</h3>
        <div className="flex items-end gap-2 h-24">
          {WEEKLY_TREND.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-primary rounded"
                style={{ height: `${(day.sessions / maxSessions) * 60}px` }}
              />
              <span className="text-[10px] text-muted-foreground">{day.day}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
