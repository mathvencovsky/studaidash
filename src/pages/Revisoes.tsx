import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Brain, Clock, CheckCircle2 } from "lucide-react";

const pendingReviews = [
  {
    id: "1",
    topic: "Distribuição Normal",
    module: "Probability Concepts",
    lastStudied: "3 dias atrás",
    retention: 72,
    priority: "alta" as const,
  },
  {
    id: "2",
    topic: "Z-Score Calculations",
    module: "Probability Concepts",
    lastStudied: "5 dias atrás",
    retention: 58,
    priority: "alta" as const,
  },
  {
    id: "3",
    topic: "Present Value",
    module: "Time Value of Money",
    lastStudied: "1 semana atrás",
    retention: 45,
    priority: "média" as const,
  },
  {
    id: "4",
    topic: "Future Value",
    module: "Time Value of Money",
    lastStudied: "2 semanas atrás",
    retention: 30,
    priority: "baixa" as const,
  },
];

const completedToday = [
  { id: "1", topic: "Histogramas", score: 95 },
  { id: "2", topic: "Média e Mediana", score: 88 },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "alta": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "média": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "baixa": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    default: return "";
  }
};

export default function Revisoes() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">
          Revisões
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Sistema de repetição espaçada para retenção máxima
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <RefreshCw size={20} className="text-primary" />
            <div>
              <p className="text-lg font-bold">{pendingReviews.length}</p>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-green-500" />
            <div>
              <p className="text-lg font-bold">{completedToday.length}</p>
              <p className="text-xs text-muted-foreground">Hoje</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Brain size={20} className="text-accent" />
            <div>
              <p className="text-lg font-bold">78%</p>
              <p className="text-xs text-muted-foreground">Retenção Média</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock size={20} className="text-muted-foreground" />
            <div>
              <p className="text-lg font-bold">~25min</p>
              <p className="text-xs text-muted-foreground">Tempo Estimado</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Revisões Pendentes</CardTitle>
          <Button size="sm">Iniciar Revisão</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingReviews.map((review) => (
            <div
              key={review.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{review.topic}</p>
                  <Badge className={`text-xs ${getPriorityColor(review.priority)}`}>
                    {review.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {review.module} • {review.lastStudied}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{review.retention}%</p>
                <Progress value={review.retention} className="h-1.5 w-16 mt-1" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Completed Today */}
      {completedToday.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              Concluídas Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completedToday.map((review) => (
              <div
                key={review.id}
                className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20"
              >
                <span className="text-sm">{review.topic}</span>
                <Badge variant="outline" className="text-xs">
                  {review.score}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
