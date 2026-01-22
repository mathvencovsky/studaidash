import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { QuizResult } from "@/components/quiz/QuizResult";
import { CFA_QUIZZES } from "@/data/cfa-mock-data";
import { createQuizSession, type QuizSession as QuizSessionType, type QuizResult as QuizResultType } from "@/data/quiz-questions-data";
import { Loader2 } from "lucide-react";

type ViewState = "loading" | "playing" | "result";

export default function QuizSession() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [session, setSession] = useState<QuizSessionType | null>(null);
  const [result, setResult] = useState<QuizResultType | null>(null);

  useEffect(() => {
    if (!quizId) {
      navigate("/quizzes");
      return;
    }

    const quiz = CFA_QUIZZES.find(q => q.id === quizId);
    if (!quiz) {
      navigate("/quizzes");
      return;
    }

    // Create session
    const newSession = createQuizSession(quiz);
    if (newSession.questions.length === 0) {
      // No questions available for this quiz
      navigate("/quizzes");
      return;
    }

    setSession(newSession);
    setViewState("playing");
  }, [quizId, navigate]);

  const handleAnswer = useCallback((questionIndex: number, answerIndex: number) => {
    setSession(prev => {
      if (!prev) return prev;
      const newAnswers = [...prev.answers];
      newAnswers[questionIndex] = answerIndex;
      return { ...prev, answers: newAnswers };
    });
  }, []);

  const handleNextQuestion = useCallback(() => {
    setSession(prev => {
      if (!prev) return prev;
      if (prev.currentIndex < prev.questions.length - 1) {
        return { ...prev, currentIndex: prev.currentIndex + 1 };
      }
      return prev;
    });
  }, []);

  const handleComplete = useCallback((quizResult: QuizResultType) => {
    setResult(quizResult);
    setViewState("result");
  }, []);

  const handleRetry = useCallback(() => {
    if (!quizId) return;
    
    const quiz = CFA_QUIZZES.find(q => q.id === quizId);
    if (!quiz) return;

    const newSession = createQuizSession(quiz);
    setSession(newSession);
    setResult(null);
    setViewState("playing");
  }, [quizId]);

  const handleExit = useCallback(() => {
    navigate("/quizzes");
  }, [navigate]);

  if (viewState === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando quiz...</p>
        </div>
      </div>
    );
  }

  if (viewState === "result" && result) {
    return (
      <QuizResult
        result={result}
        onRetry={handleRetry}
        onExit={handleExit}
      />
    );
  }

  return (
    <QuizPlayer
      session={session}
      onAnswer={(questionIndex, answerIndex) => {
        handleAnswer(questionIndex, answerIndex);
      }}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
}
