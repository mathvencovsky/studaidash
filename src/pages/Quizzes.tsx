import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileQuestion, CheckCircle2, Clock, RotateCcw, Play } from "lucide-react";
import { CFA_QUIZZES } from "@/data/cfa-mock-data";

export default function Quizzes() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Concluído</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Em Progresso</Badge>;
      case "not_started":
        return <Badge variant="secondary">Não Iniciado</Badge>;
      default:
        return null;
    }
  };

  const getActionButton = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Button variant="outline" size="sm" className="gap-1">
            <RotateCcw size={14} />
            Refazer
          </Button>
        );
      case "in_progress":
        return (
          <Button size="sm" className="gap-1">
            <Play size={14} />
            Continuar
          </Button>
        );
      case "not_started":
        return (
          <Button size="sm" className="gap-1">
            <Play size={14} />
            Iniciar
          </Button>
        );
      default:
        return null;
    }
  };

  const completedQuizzes = CFA_QUIZZES.filter(q => q.status === "completed").length;
  const avgScore = CFA_QUIZZES
    .filter(q => q.lastScore !== undefined)
    .reduce((acc, q) => acc + (q.lastScore || 0), 0) / 
    CFA_QUIZZES.filter(q => q.lastScore !== undefined).length || 0;

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Quizzes</h1>
        <p className="text-muted-foreground mt-1">Avaliações CFA-style por módulo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{completedQuizzes}/{CFA_QUIZZES.length}</p>
            <p className="text-xs text-muted-foreground">Quizzes Concluídos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{avgScore.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Média de Acertos</p>
          </CardContent>
        </Card>
      </div>

      {/* Quiz List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Quizzes por Módulo</h2>
        {CFA_QUIZZES.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                  <FileQuestion className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm sm:text-base truncate">{quiz.moduleName}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{quiz.totalQuestions} questões</span>
                        {quiz.attempts > 0 && (
                          <>
                            <span>•</span>
                            <span>{quiz.attempts} tentativa{quiz.attempts > 1 ? "s" : ""}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(quiz.status)}
                  </div>
                  
                  {quiz.lastScore !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Última nota: <strong>{quiz.lastScore}%</strong></span>
                      {quiz.lastAttemptDate && (
                        <span className="text-muted-foreground text-xs">
                          ({new Date(quiz.lastAttemptDate).toLocaleDateString("pt-BR")})
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end">
                    {getActionButton(quiz.status)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
