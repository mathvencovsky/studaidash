import { Clock, Calendar, TrendingUp, BookOpen } from "lucide-react";

const recentSessions = [
  {
    id: "1",
    date: "Hoje",
    duration: "45min",
    topic: "Probability Concepts",
    tasksCompleted: 3,
  },
  {
    id: "2",
    date: "Ontem",
    duration: "1h 20min",
    topic: "Time Value of Money",
    tasksCompleted: 5,
  },
  {
    id: "3",
    date: "20/01/2026",
    duration: "30min",
    topic: "Distribuição Normal",
    tasksCompleted: 2,
  },
  {
    id: "4",
    date: "19/01/2026",
    duration: "55min",
    topic: "Organizing Data",
    tasksCompleted: 4,
  },
];

const stats = [
  { label: "Total", value: "24", sublabel: "sessões" },
  { label: "Tempo", value: "18h 30min", sublabel: "acumulado" },
  { label: "Média", value: "46min", sublabel: "por sessão" },
  { label: "Semana", value: "5", sublabel: "sessões" },
];

export default function Sessoes() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">Sessões</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Histórico de estudo.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 border rounded-lg p-4 bg-card">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-base font-semibold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Recent Sessions */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium text-foreground">Sessões recentes</h2>
        </div>
        <div className="divide-y">
          {recentSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{session.topic}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {session.date} · {session.duration}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {session.tasksCompleted} tarefas
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
