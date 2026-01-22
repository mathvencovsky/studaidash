import { useState, useCallback } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { QuizSession, QuizResult } from "@/data/quiz-questions-data";
import { calculateQuizResult } from "@/data/quiz-questions-data";

interface QuizPlayerProps {
  session: QuizSession;
  onAnswer: (questionIndex: number, answerIndex: number) => void;
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
}

export function QuizPlayer({ session, onAnswer, onComplete, onExit }: QuizPlayerProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(
    session.answers[session.currentIndex]
  );
  const [isAnswered, setIsAnswered] = useState(
    session.answers[session.currentIndex] !== null
  );

  const currentQuestion = session.questions[session.currentIndex];
  const progress = ((session.currentIndex + 1) / session.questions.length) * 100;
  const isLastQuestion = session.currentIndex === session.questions.length - 1;

  const handleSelectAnswer = useCallback((index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  }, [isAnswered]);

  const handleConfirmAnswer = useCallback(() => {
    if (selectedAnswer === null) return;
    onAnswer(session.currentIndex, selectedAnswer);
    setIsAnswered(true);
    setShowExplanation(true);
  }, [selectedAnswer, session.currentIndex, onAnswer]);

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      const result = calculateQuizResult({
        ...session,
        answers: session.answers.map((a, i) => 
          i === session.currentIndex ? selectedAnswer : a
        )
      });
      onComplete(result);
    } else {
      // Reset state for next question
      setShowExplanation(false);
      setSelectedAnswer(session.answers[session.currentIndex + 1]);
      setIsAnswered(session.answers[session.currentIndex + 1] !== null);
    }
  }, [isLastQuestion, session, selectedAnswer, onComplete]);

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index
        ? "border-primary bg-primary/10 ring-2 ring-primary"
        : "border-border hover:border-primary/50 hover:bg-secondary/50";
    }
    
    if (index === currentQuestion.correctIndex) {
      return "border-green-500 bg-green-50 dark:bg-green-950/30";
    }
    
    if (selectedAnswer === index && index !== currentQuestion.correctIndex) {
      return "border-red-500 bg-red-50 dark:bg-red-950/30";
    }
    
    return "border-border opacity-50";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer effect
  useState(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.round((Date.now() - session.startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={onExit}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium hidden sm:inline">Sair</span>
          </button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={16} />
            <span className="font-mono">{formatTime(elapsedSeconds)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-card-foreground">
              Questão {session.currentIndex + 1} de {session.questions.length}
            </span>
            <span className="text-muted-foreground">{session.moduleName}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 sm:py-8 pb-32">
        {/* Question */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <HelpCircle size={18} className="text-primary" />
            </div>
            <h2 className="text-base sm:text-lg font-medium text-card-foreground leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${getOptionStyle(index)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm font-semibold ${
                  isAnswered
                    ? index === currentQuestion.correctIndex
                      ? "bg-green-500 text-white"
                      : selectedAnswer === index
                        ? "bg-red-500 text-white"
                        : "bg-muted text-muted-foreground"
                    : selectedAnswer === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}>
                  {isAnswered ? (
                    index === currentQuestion.correctIndex ? (
                      <CheckCircle2 size={16} />
                    ) : selectedAnswer === index ? (
                      <XCircle size={16} />
                    ) : (
                      String.fromCharCode(65 + index)
                    )
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </div>
                <span className="text-sm sm:text-base text-card-foreground">
                  {option}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={18} className="text-primary" />
              <span className="font-semibold text-primary">Explicação</span>
            </div>
            <p className="text-sm text-card-foreground leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 sm:p-6">
        <div className="max-w-3xl mx-auto flex gap-3">
          {!isAnswered ? (
            <Button
              onClick={handleConfirmAnswer}
              disabled={selectedAnswer === null}
              className="flex-1 h-12"
            >
              Confirmar Resposta
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1 h-12 gap-2"
            >
              {isLastQuestion ? "Ver Resultado" : "Próxima Questão"}
              <ArrowRight size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
