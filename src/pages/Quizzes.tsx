import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CFA_QUIZZES } from "@/data/cfa-mock-data";
import { getQuizQuestions } from "@/data/quiz-questions-data";

export default function Quizzes() {
  const navigate = useNavigate();

  const handleStartQuiz = (quizId: string) => {
    const questions = getQuizQuestions(quizId);
    if (questions.length > 0) {
      navigate(`/quiz/${quizId}`);
    }
  };

  const completedQuizzes = CFA_QUIZZES.filter(q => q.status === "completed").length;
  const avgScore = CFA_QUIZZES
    .filter(q => q.lastScore !== undefined)
    .reduce((acc, q) => acc + (q.lastScore || 0), 0) / 
    CFA_QUIZZES.filter(q => q.lastScore !== undefined).length || 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">Avaliações</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Quizzes por módulo.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 bg-card">
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">{completedQuizzes}/{CFA_QUIZZES.length}</p>
          <p className="text-[10px] text-muted-foreground">Concluídos</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">{avgScore.toFixed(0)}%</p>
          <p className="text-[10px] text-muted-foreground">Média</p>
        </div>
      </div>

      {/* Quiz List */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium text-foreground">Quizzes</h2>
        </div>
        <div className="divide-y">
          {CFA_QUIZZES.map((quiz) => {
            const questions = getQuizQuestions(quiz.id);
            const hasQuestions = questions.length > 0;
            
            const getStatusLabel = () => {
              if (quiz.status === "completed") return "Concluído";
              if (quiz.status === "in_progress") return "Em andamento";
              return "Não iniciado";
            };

            const getButtonLabel = () => {
              if (!hasQuestions) return "Em breve";
              if (quiz.status === "completed") return "Refazer";
              if (quiz.status === "in_progress") return "Continuar";
              return "Iniciar quiz";
            };
            
            return (
              <div
                key={quiz.id}
                className={`flex items-center gap-3 p-4 ${!hasQuestions ? "opacity-50" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{quiz.moduleName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{hasQuestions ? `${questions.length} questões` : "Em desenvolvimento"}</span>
                    {quiz.lastScore !== undefined && (
                      <>
                        <span>·</span>
                        <span>Última: {quiz.lastScore}%</span>
                      </>
                    )}
                  </div>
                </div>

                <span className="text-xs text-muted-foreground shrink-0">
                  {getStatusLabel()}
                </span>

                <Button 
                  size="sm" 
                  variant={quiz.status === "in_progress" ? "default" : "outline"}
                  onClick={() => handleStartQuiz(quiz.id)}
                  disabled={!hasQuestions}
                  className="shrink-0 h-7 text-xs"
                >
                  {getButtonLabel()}
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
