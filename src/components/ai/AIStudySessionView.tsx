import { useState, useCallback } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Clock,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Star,
  Target
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

const stepIcons = {
  intro: Sparkles,
  content: BookOpen,
  example: Lightbulb,
  exercise: Target,
  quiz: HelpCircle,
  feedback: Star,
};

const stepLabels = {
  intro: "Introdução",
  content: "Conteúdo",
  example: "Exemplo",
  exercise: "Exercício",
  quiz: "Quiz",
  feedback: "Avaliação",
};

// Step indicator component for visual progress
function StepIndicator({ 
  steps, 
  currentIndex 
}: { 
  steps: AISessionStep[]; 
  currentIndex: number 
}) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 py-2">
      {steps.map((step, index) => {
        const Icon = stepIcons[step.type];
        const isActive = index === currentIndex;
        const isCompleted = step.completed || index < currentIndex;
        
        return (
          <div
            key={step.id}
            className={`flex items-center justify-center transition-all duration-300 ${
              isActive 
                ? "w-8 h-8 sm:w-10 sm:h-10 bg-primary text-primary-foreground rounded-full shadow-lg scale-110" 
                : isCompleted
                  ? "w-6 h-6 sm:w-8 sm:h-8 bg-primary/20 text-primary rounded-full"
                  : "w-6 h-6 sm:w-8 sm:h-8 bg-muted text-muted-foreground rounded-full"
            }`}
            title={stepLabels[step.type]}
          >
            {isCompleted && !isActive ? (
              <CheckCircle2 size={isActive ? 16 : 12} />
            ) : (
              <Icon size={isActive ? 16 : 12} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Confidence rating component
function ConfidenceRating({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (v: number) => void 
}) {
  const labels = ["😰", "😕", "😐", "🙂", "😎"];
  const descriptions = [
    "Preciso revisar mais",
    "Ainda tenho dúvidas", 
    "Entendi parcialmente",
    "Entendi bem",
    "Dominei!"
  ];
  
  return (
    <div className="text-center py-4 sm:py-6">
      <h3 className="text-base sm:text-lg font-semibold mb-2">
        Como você se sente sobre este tema?
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
        Sua avaliação nos ajuda a personalizar seu aprendizado
      </p>
      
      <div className="flex justify-center gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center text-xl sm:text-2xl transition-all touch-manipulation active:scale-95 ${
              value === rating
                ? "bg-primary border-primary shadow-lg scale-110"
                : "bg-background border-muted-foreground/30 hover:border-primary/50 hover:scale-105"
            }`}
          >
            {labels[rating - 1]}
          </button>
        ))}
      </div>
      
      {value > 0 && (
        <p className="text-sm font-medium text-primary mt-4 animate-in fade-in">
          {descriptions[value - 1]}
        </p>
      )}
      
      <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-3 px-2 max-w-xs mx-auto">
        <span>Preciso revisar</span>
        <span>Dominei!</span>
      </div>
    </div>
  );
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
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="max-w-3xl mx-auto">
          {/* Top row: exit button and stats */}
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={onExit}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors touch-manipulation p-1 -ml-1"
            >
              <ArrowLeft size={18} />
              <span className="text-xs sm:text-sm font-medium">Sair</span>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>{formatTime(session.startedAt)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary">
                <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>+{session.xpEarned} XP</span>
              </div>
            </div>
          </div>
          
          {/* Step indicators */}
          <StepIndicator steps={session.steps} currentIndex={session.currentStepIndex} />
          
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">
                {stepLabels[currentStep.type]}
              </span>
              <span className="text-muted-foreground">
                {session.currentStepIndex + 1}/{session.steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 pb-28 sm:pb-32">
        <div className="max-w-3xl mx-auto">
          {/* Module info badge */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-1 rounded-lg">
              <StepIcon size={12} className="sm:w-4 sm:h-4" />
              <span className="font-medium">{session.moduleName}</span>
            </div>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="text-muted-foreground">{session.competency}</span>
          </div>

          {/* Content card */}
          <Card className="mb-4 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              {currentStep.type === "feedback" ? (
                <ConfidenceRating 
                  value={confidenceRating} 
                  onChange={setConfidenceRating} 
                />
              ) : (
                <div className="prose prose-sm sm:prose dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-muted prose-pre:border">
                  <ReactMarkdown>{currentStep.content}</ReactMarkdown>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step time estimate */}
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <Clock size={12} />
            <span>~{currentStep.estimatedMinutes}min para este passo</span>
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t p-3 sm:p-4">
        <div className="max-w-3xl mx-auto flex gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={session.currentStepIndex === 0}
            className="h-11 sm:h-12 px-3 sm:px-4 touch-manipulation"
          >
            <ArrowLeft size={16} className="sm:mr-2" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isLastStep && confidenceRating === 0}
            className="flex-1 h-11 sm:h-12 font-semibold touch-manipulation"
          >
            {isLastStep ? (
              <>
                <CheckCircle2 size={16} className="mr-2" />
                Finalizar Sessão
              </>
            ) : (
              <>
                Próximo
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}