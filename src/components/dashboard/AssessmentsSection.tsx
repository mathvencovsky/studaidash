import { FileText, Clock, CheckCircle2, Play, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  // Show only pending/in-progress items
  const activeQuizzes = quizzes.filter(q => q.status !== "completed").slice(0, 2);
  const activeSimulados = simulados.filter(s => !s.lastScore || s.lastScore < 70).slice(0, 2);

  const hasItems = activeQuizzes.length > 0 || activeSimulados.length > 0;

  if (!hasItems) {
    return null;
  }

  return (
    <section className="bg-card border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Avaliações</h3>
              <p className="text-xs text-muted-foreground">Quizzes e simulados disponíveis</p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onViewAllQuizzes} className="text-xs">
            Ver todos
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y">
        {/* Quizzes */}
        {activeQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="flex items-center gap-3 p-3 sm:p-4"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              quiz.status === "in_progress" 
                ? "bg-accent/10 text-accent" 
                : "bg-muted text-muted-foreground"
            }`}>
              <FileText className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{quiz.moduleName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{quiz.totalQuestions} questões</span>
                {quiz.lastScore !== undefined && (
                  <>
                    <span>•</span>
                    <span className={quiz.lastScore >= 70 ? "text-status-success-text" : ""}>
                      Última: {quiz.lastScore}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <Button 
              size="sm" 
              variant={quiz.status === "in_progress" ? "default" : "outline"}
              onClick={() => onStartQuiz(quiz.id)}
              className="shrink-0"
            >
              {quiz.status === "in_progress" ? "Continuar" : "Iniciar"}
            </Button>
          </div>
        ))}

        {/* Simulados */}
        {activeSimulados.map((simulado) => (
          <div
            key={simulado.id}
            className="flex items-center gap-3 p-3 sm:p-4"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">{simulado.name}</p>
                <Badge variant="secondary" className="text-[10px] shrink-0">Simulado</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{simulado.totalQuestions} questões</span>
                <span>•</span>
                <span>{simulado.durationMinutes} min</span>
              </div>
            </div>

            <Button 
              size="sm" 
              onClick={() => onStartSimulado(simulado.id)}
              className="shrink-0"
            >
              <Play className="w-3 h-3 mr-1" />
              Fazer
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
