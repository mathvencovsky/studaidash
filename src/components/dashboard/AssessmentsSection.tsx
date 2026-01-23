import { Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Quiz, Simulado } from "@/types/studai";

interface AssessmentsSectionProps {
  quizzes: Quiz[];
  simulados: Simulado[];
  onStartQuiz: (quizId: string) => void;
  onStartSimulado: (simuladoId: string) => void;
  onViewAllQuizzes: () => void;
}

export function AssessmentsSection({ 
  quizzes, 
  simulados, 
  onStartQuiz, 
  onStartSimulado,
  onViewAllQuizzes 
}: AssessmentsSectionProps) {
  const activeQuizzes = quizzes.filter(q => q.status !== "completed").slice(0, 2);
  const activeSimulados = simulados.filter(s => !s.lastScore || s.lastScore < 70).slice(0, 2);

  const hasItems = activeQuizzes.length > 0 || activeSimulados.length > 0;

  if (!hasItems) {
    return null;
  }

  return (
    <section className="border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Avaliações</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Medem retenção e preparo.</p>
          </div>
          
          <button 
            onClick={onViewAllQuizzes}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
          >
            Ver todos
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y">
        {activeQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="flex items-center gap-3 p-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{quiz.moduleName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>{quiz.totalQuestions} questões</span>
                {quiz.lastScore !== undefined && (
                  <>
                    <span>·</span>
                    <span>Última tentativa: {quiz.lastScore}%</span>
                  </>
                )}
              </div>
            </div>

            <Button 
              size="sm" 
              variant={quiz.status === "in_progress" ? "default" : "outline"}
              onClick={() => onStartQuiz(quiz.id)}
              className="shrink-0 h-7 text-xs"
            >
              {quiz.status === "in_progress" ? "Continuar" : "Iniciar quiz"}
            </Button>
          </div>
        ))}

        {activeSimulados.map((simulado) => (
          <div
            key={simulado.id}
            className="flex items-center gap-3 p-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm text-foreground truncate">{simulado.name}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>{simulado.totalQuestions} questões</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {simulado.durationMinutes} min
                </span>
              </div>
            </div>

            <Button 
              size="sm"
              variant="outline" 
              onClick={() => onStartSimulado(simulado.id)}
              className="shrink-0 h-7 text-xs"
            >
              Iniciar simulado
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
