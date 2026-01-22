import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Clock,
  BookOpen,
  Lightbulb,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import type { AIStudySession, AISessionStep } from "@/data/ai-study-data";
import { saveCurrentSession } from "@/data/ai-study-data";

interface AIStudySessionViewProps {
  session: AIStudySession;
  onUpdateSession: (session: AIStudySession) => void;
  onComplete: (confidenceRating: number) => void;
  onExit: () => void;
}

export function AIStudySessionView({ 
  session, 
  onUpdateSession, 
  onComplete, 
  onExit 
}: AIStudySessionViewProps) {
  const currentStep = session.steps[session.currentStepIndex];
  const progress = ((session.currentStepIndex + 1) / session.steps.length) * 100;
  const isLastStep = session.currentStepIndex === session.steps.length - 1;
  const [confidenceRating, setConfidenceRating] = useState<number>(0);

  const stepIcons = {
    intro: Sparkles,
    content: BookOpen,
    example: Lightbulb,
    exercise: HelpCircle,
    quiz: HelpCircle,
    feedback: Star,
  };

  const StepIcon = stepIcons[currentStep.type];

  const handleNext = useCallback(() => {
    if (isLastStep) {
      if (confidenceRating > 0) {
        onComplete(confidenceRating);
      }
      return;
    }

    const updatedSteps = session.steps.map((step, index) => 
      index === session.currentStepIndex ? { ...step, completed: true } : step
    );
    
    const updatedSession = {
      ...session,
      steps: updatedSteps,
      currentStepIndex: session.currentStepIndex + 1,
      xpEarned: session.xpEarned + 15,
    };
    
    onUpdateSession(updatedSession);
    saveCurrentSession(updatedSession);
  }, [session, isLastStep, confidenceRating, onComplete, onUpdateSession]);

  const handlePrevious = useCallback(() => {
    if (session.currentStepIndex > 0) {
      const updatedSession = {
        ...session,
        currentStepIndex: session.currentStepIndex - 1,
      };
      onUpdateSession(updatedSession);
      saveCurrentSession(updatedSession);
    }
  }, [session, onUpdateSession]);

  const formatTime = (startedAt: number) => {
    const elapsed = Math.round((Date.now() - startedAt) / 1000 / 60);
    return `${elapsed}min`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={onExit}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium hidden sm:inline">Sair da sessão</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock size={14} />
              <span>{formatTime(session.startedAt)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
              <Sparkles size={14} />
              <span>+{session.xpEarned} XP</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-card-foreground">
              {currentStep.title}
            </span>
            <span className="text-muted-foreground">
              {session.currentStepIndex + 1} de {session.steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 pb-32">
        <div className="max-w-3xl mx-auto">
          {/* Module info */}
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <StepIcon size={16} className="text-primary" />
            <span>{session.moduleName}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>{session.competency}</span>
          </div>

          {/* Step content */}
          <Card className="mb-6">
            <CardContent className="p-4 sm:p-6">
              {currentStep.type === "feedback" ? (
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Como você se sente sobre este tema?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Sua avaliação nos ajuda a personalizar seu aprendizado
                  </p>
                  
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setConfidenceRating(rating)}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-semibold transition-all ${
                          confidenceRating === rating
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-muted-foreground/30 hover:border-primary/50"
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-3 px-2">
                    <span>Preciso revisar</span>
                    <span>Dominei!</span>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{currentStep.content}</ReactMarkdown>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estimated time for step */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock size={14} />
            <span>~{currentStep.estimatedMinutes}min para este passo</span>
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 sm:p-6">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={session.currentStepIndex === 0}
            className="h-12"
          >
            <ArrowLeft size={18} className="mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isLastStep && confidenceRating === 0}
            className="flex-1 h-12"
          >
            {isLastStep ? (
              <>
                <CheckCircle2 size={18} className="mr-2" />
                Finalizar Sessão
              </>
            ) : (
              <>
                Próximo
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
