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
    <div className="bg-card border rounded-2xl p-3 sm:p-6 shadow-sm w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <HelpCircle size={16} className="sm:w-5 sm:h-5 text-accent" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-lg font-semibold text-card-foreground">Avaliações</h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Quizzes CFA-Style</p>
          </div>
        </div>
        <button 
          onClick={onViewAll}
          className="text-[10px] sm:text-xs text-accent font-medium hover:underline flex items-center gap-0.5 sm:gap-1 shrink-0"
        >
          Ver todos
          <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Quiz List */}
      <div className="space-y-2 sm:space-y-3">
        {displayQuizzes.map((quiz) => {
          const config = statusConfig[quiz.status];
          const Icon = config.icon;

          return (
            <div 
              key={quiz.id}
              className="flex items-center gap-2 sm:gap-4 p-2.5 sm:p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              {/* Status indicator */}
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                quiz.status === "completed" 
                  ? "bg-status-success text-status-success-text" 
                  : quiz.status === "in_progress"
                    ? "bg-warning/20 text-warning"
                    : "bg-muted text-muted-foreground"
              }`}>
                {quiz.status === "completed" ? (
                  <CheckCircle2 size={14} className="sm:w-[18px] sm:h-[18px]" />
                ) : (
                  <HelpCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
                )}
              </div>

              {/* Quiz Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[11px] sm:text-sm text-card-foreground line-clamp-1">
                  {quiz.moduleName}
                </p>
                <div className="flex items-center gap-1.5 sm:gap-3 mt-0.5">
                  <span className="text-[9px] sm:text-xs text-muted-foreground whitespace-nowrap">
                    {quiz.totalQuestions} questões
                  </span>
                  {quiz.lastScore !== undefined && (
                    <span className={`text-[9px] sm:text-xs font-semibold ${
                      quiz.lastScore >= 70 ? "text-status-success-text" : "text-warning"
                    }`}>
                      {quiz.lastScore}%
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onStartQuiz(quiz.id)}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[9px] sm:text-sm font-medium flex items-center gap-1 sm:gap-2 shrink-0 transition-opacity hover:opacity-90 active:scale-95 touch-manipulation min-h-[32px] sm:min-h-[36px] ${config.bg} ${config.text}`}
              >
                <Icon size={10} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">{config.label}</span>
              </button>
            </div>
          );
        })}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-6 sm:py-8">
          <HelpCircle size={28} className="sm:w-8 sm:h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-xs sm:text-sm text-muted-foreground">
            Complete módulos para desbloquear quizzes
          </p>
        </div>
      )}
    </div>
  );
}
