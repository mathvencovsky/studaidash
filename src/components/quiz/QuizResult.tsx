import { CheckCircle2, XCircle, Trophy, RotateCcw, ArrowLeft, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizResult as QuizResultType } from "@/data/quiz-questions-data";

interface QuizResultProps {
  result: QuizResultType;
  onRetry: () => void;
  onExit: () => void;
}

export function QuizResult({ result, onRetry, onExit }: QuizResultProps) {
  const isPassing = result.score >= 70;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreMessage = () => {
    if (result.score >= 90) return "Excelente! Você domina esse conteúdo! 🎉";
    if (result.score >= 70) return "Muito bem! Você está no caminho certo! ✅";
    if (result.score >= 50) return "Quase lá! Revise os conceitos e tente novamente.";
    return "Continue estudando! A prática leva à perfeição. 💪";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b px-4 py-4 sm:px-6">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Voltar aos Quizzes</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Score Card */}
        <div className={`rounded-2xl p-6 sm:p-8 text-center mb-6 ${
          isPassing 
            ? "bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20" 
            : "bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20"
        }`}>
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            isPassing ? "bg-green-500/20" : "bg-amber-500/20"
          }`}>
            {isPassing ? (
              <Trophy size={40} className="text-green-600" />
            ) : (
              <Target size={40} className="text-amber-600" />
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-card-foreground">
            {result.score}%
          </h1>
          
          <p className="text-lg font-medium text-muted-foreground mb-4">
            {result.moduleName}
          </p>

          <p className={`text-base ${isPassing ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"}`}>
            {getScoreMessage()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl border p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle2 size={16} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-card-foreground">{result.correctAnswers}</p>
            <p className="text-xs text-muted-foreground">Corretas</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <XCircle size={16} className="text-red-500" />
            </div>
            <p className="text-2xl font-bold text-card-foreground">
              {result.totalQuestions - result.correctAnswers}
            </p>
            <p className="text-xs text-muted-foreground">Incorretas</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock size={16} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-card-foreground">
              {formatTime(result.timeSpentSeconds)}
            </p>
            <p className="text-xs text-muted-foreground">Tempo</p>
          </div>
        </div>

        {/* Questions Review */}
        <div className="bg-card rounded-xl border p-4 sm:p-6 mb-6">
          <h2 className="font-semibold text-card-foreground mb-4">Resumo das Questões</h2>
          <div className="flex flex-wrap gap-2">
            {result.questionResults.map((qr, index) => (
              <div
                key={qr.questionId}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                  qr.isCorrect
                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Based on Performance */}
        {!isPassing && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-card-foreground mb-2">💡 Dica de estudo</h3>
            <p className="text-sm text-muted-foreground">
              Revise o módulo "{result.moduleName}" antes de tentar novamente. 
              Foque especialmente nas questões que você errou.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onExit} className="flex-1 h-12">
            <ArrowLeft size={18} className="mr-2" />
            Voltar
          </Button>
          <Button onClick={onRetry} className="flex-1 h-12">
            <RotateCcw size={18} className="mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    </div>
  );
}
