import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { QuizResult } from "@/components/quiz/QuizResult";
import { CFA_QUIZZES, CFA_SIMULADOS } from "@/data/cfa-mock-data";
import { 
  createQuizSession, 
  createSimuladoSession,
  getQuizQuestions,
  type QuizSession as QuizSessionType, 
  type QuizResult as QuizResultType 
} from "@/data/quiz-questions-data";
import { Loader2 } from "lucide-react";
import type { Simulado } from "@/types/studai";

type ViewState = "loading" | "playing" | "result";

interface LocationState {
  isSimulado?: boolean;
  simulado?: Simulado;
}

export default function QuizSession() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [session, setSession] = useState<QuizSessionType | null>(null);
  const [result, setResult] = useState<QuizResultType | null>(null);
  const [isSimulado, setIsSimulado] = useState(false);

  useEffect(() => {
    if (!quizId) {
      navigate("/quizzes");
      return;
    }

    // Check if it's a simulado
    if (state?.isSimulado && state?.simulado) {
      setIsSimulado(true);
      const questions = getQuizQuestions(quizId);
      if (questions.length === 0) {
        navigate("/");
        return;
      }
      const newSession = createSimuladoSession(state.simulado);
      setSession(newSession);
      setViewState("playing");
      return;
    }

    // Check if it's a simulado by ID
    const simulado = CFA_SIMULADOS.find(s => s.id === quizId);
    if (simulado) {
      setIsSimulado(true);
      const questions = getQuizQuestions(quizId);
      if (questions.length === 0) {
        navigate("/");
        return;
      }
      const newSession = createSimuladoSession(simulado);
      setSession(newSession);
      setViewState("playing");
      return;
    }

    // Regular quiz
    const quiz = CFA_QUIZZES.find(q => q.id === quizId);
    if (!quiz) {
      navigate("/quizzes");
      return;
    }

    const newSession = createQuizSession(quiz);
    if (newSession.questions.length === 0) {
      navigate("/quizzes");
      return;
    }

    setSession(newSession);
    setViewState("playing");
  }, [quizId, navigate, state]);

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
    
    // Check if simulado
    const simulado = CFA_SIMULADOS.find(s => s.id === quizId);
    if (simulado) {
      const newSession = createSimuladoSession(simulado);
      setSession(newSession);
      setResult(null);
      setViewState("playing");
      return;
    }

    const quiz = CFA_QUIZZES.find(q => q.id === quizId);
    if (!quiz) return;

    const newSession = createQuizSession(quiz);
    setSession(newSession);
    setResult(null);
    setViewState("playing");
  }, [quizId]);

  const handleExit = useCallback(() => {
    if (isSimulado) {
      navigate("/");
    } else {
      navigate("/quizzes");
    }
  }, [navigate, isSimulado]);

  if (viewState === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            {isSimulado ? "Carregando simulado..." : "Carregando quiz..."}
          </p>
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
