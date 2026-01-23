import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, TrendingUp, BookOpen } from "lucide-react";

const recentSessions = [
  {
    id: "1",
    date: "Hoje",
    duration: "45min",
    topic: "Probability Concepts",
    xpEarned: 85,
    tasksCompleted: 3,
  },
  {
    id: "2",
    date: "Ontem",
    duration: "1h 20min",
    topic: "Time Value of Money",
    xpEarned: 120,
    tasksCompleted: 5,
  },
  {
    id: "3",
    date: "20/01/2026",
    duration: "30min",
    topic: "Distribuição Normal",
    xpEarned: 50,
    tasksCompleted: 2,
  },
  {
    id: "4",
    date: "19/01/2026",
    duration: "55min",
    topic: "Organizing Data",
    xpEarned: 95,
    tasksCompleted: 4,
  },
];

const stats = [
  { label: "Total de Sessões", value: "24", icon: BookOpen },
  { label: "Tempo Total", value: "18h 30min", icon: Clock },
  { label: "Média por Sessão", value: "46min", icon: TrendingUp },
  { label: "Sessões esta Semana", value: "5", icon: Calendar },
];

export default function Sessoes() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">
          Sessões de Estudo
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Histórico e estatísticas das suas sessões
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sessões Recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{session.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.date} • {session.duration}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-xs">
                  +{session.xpEarned} XP
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {session.tasksCompleted} tarefas
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
