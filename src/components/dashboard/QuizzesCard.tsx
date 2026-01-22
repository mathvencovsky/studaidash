import { HelpCircle, CheckCircle2, Play, RotateCcw, ChevronRight, Clock } from "lucide-react";
import type { Quiz } from "@/types/studai";

interface QuizzesCardProps {
  quizzes: Quiz[];
  onStartQuiz: (quizId: string) => void;
  onViewAll: () => void;
}

export function QuizzesCard({ quizzes, onStartQuiz, onViewAll }: QuizzesCardProps) {
  const statusConfig = {
    not_started: {
      label: "Iniciar",
      icon: Play,
      bg: "bg-accent",
      text: "text-accent-foreground",
    },
    in_progress: {
      label: "Continuar",
      icon: Play,
      bg: "bg-warning",
      text: "text-warning-foreground",
    },
    completed: {
      label: "Refazer",
      icon: RotateCcw,
      bg: "bg-secondary",
      text: "text-card-foreground",
    },
  };

  // Show only first 4 quizzes
  const displayQuizzes = quizzes.slice(0, 4);

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <HelpCircle size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Avaliações</h2>
            <p className="text-xs text-muted-foreground">Quizzes CFA-Style por módulo</p>
          </div>
        </div>
        <button 
          onClick={onViewAll}
          className="text-xs text-accent font-medium hover:underline flex items-center gap-1"
        >
          Ver todos
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Quiz List */}
      <div className="space-y-3">
        {displayQuizzes.map((quiz) => {
          const config = statusConfig[quiz.status];
          const Icon = config.icon;

          return (
            <div 
              key={quiz.id}
              className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              {/* Status indicator */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                quiz.status === "completed" 
                  ? "bg-status-success text-status-success-text" 
                  : quiz.status === "in_progress"
                    ? "bg-warning/20 text-warning"
                    : "bg-muted text-muted-foreground"
              }`}>
                {quiz.status === "completed" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <HelpCircle size={18} />
                )}
              </div>

              {/* Quiz Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-card-foreground truncate">
                  Quiz: {quiz.moduleName}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {quiz.totalQuestions} questões
                  </span>
                  {quiz.lastScore !== undefined && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className={`text-xs font-semibold ${
                        quiz.lastScore >= 70 ? "text-status-success-text" : "text-warning"
                      }`}>
                        Última nota: {quiz.lastScore}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onStartQuiz(quiz.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shrink-0 transition-opacity hover:opacity-90 ${config.bg} ${config.text}`}
              >
                <Icon size={14} />
                {config.label}
              </button>
            </div>
          );
        })}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-8">
          <HelpCircle size={32} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Complete módulos para desbloquear quizzes
          </p>
        </div>
      )}
    </div>
  );
}
