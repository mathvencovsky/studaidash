import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

const pendingReviews = [
  {
    id: "1",
    topic: "Distribuição Normal",
    module: "Probability Concepts",
    lastStudied: "3 dias atrás",
    retention: 72,
    priority: "alta",
  },
  {
    id: "2",
    topic: "Z-Score Calculations",
    module: "Probability Concepts",
    lastStudied: "5 dias atrás",
    retention: 58,
    priority: "alta",
  },
  {
    id: "3",
    topic: "Present Value",
    module: "Time Value of Money",
    lastStudied: "1 semana atrás",
    retention: 45,
    priority: "média",
  },
  {
    id: "4",
    topic: "Future Value",
    module: "Time Value of Money",
    lastStudied: "2 semanas atrás",
    retention: 30,
    priority: "baixa",
  },
];

const completedToday = [
  { id: "1", topic: "Histogramas", score: 95 },
  { id: "2", topic: "Média e Mediana", score: 88 },
];

export default function Revisoes() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">Revisões</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Repetição espaçada para retenção.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 border rounded-lg p-4 bg-card">
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">{pendingReviews.length}</p>
          <p className="text-[10px] text-muted-foreground">Pendentes</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">{completedToday.length}</p>
          <p className="text-[10px] text-muted-foreground">Hoje</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">78%</p>
          <p className="text-[10px] text-muted-foreground">Retenção</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">~25min</p>
          <p className="text-[10px] text-muted-foreground">Estimado</p>
        </div>
      </div>

      {/* Pending Reviews */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-medium text-foreground">Pendentes</h2>
          <Button size="sm" className="h-7 text-xs">Iniciar revisão</Button>
        </div>
        <div className="divide-y">
          {pendingReviews.map((review) => (
            <div
              key={review.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{review.topic}</p>
                  <span className="text-[10px] text-muted-foreground capitalize">
                    {review.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {review.module} · {review.lastStudied}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-foreground">{review.retention}%</p>
                <Progress value={review.retention} className="h-1 w-12 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Completed Today */}
      {completedToday.length > 0 && (
        <section className="border rounded-lg bg-card overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-medium text-foreground flex items-center gap-2">
              <Check size={16} className="text-primary" />
              Concluídas hoje
            </h2>
          </div>
          <div className="divide-y">
            {completedToday.map((review) => (
              <div
                key={review.id}
                className="flex items-center justify-between p-4"
              >
                <span className="text-sm text-foreground">{review.topic}</span>
                <span className="text-xs text-muted-foreground">{review.score}%</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
