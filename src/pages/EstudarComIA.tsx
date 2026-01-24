import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AIStudySessionView } from "@/components/ai/AIStudySessionView";
import { 
  getNextAIStudyAction, 
  createAIStudySession, 
  getCurrentSession, 
  saveCurrentSession,
  saveSessionHistory,
  getSessionHistory,
  type AIStudySession,
  type StudySessionHistory
} from "@/data/ai-study-data";
import { markTaskCompleted } from "@/hooks/use-daily-plan";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EstudarComIA() {
  const navigate = useNavigate();
  const [session, setSession] = useState<AIStudySession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session or create new one
    const existingSession = getCurrentSession();
    
    if (existingSession) {
      setSession(existingSession);
    } else {
      // Create new session based on AI recommendation
      const recommendation = getNextAIStudyAction();
      const newSession = createAIStudySession(recommendation);
      setSession(newSession);
      saveCurrentSession(newSession);
    }
    
    setLoading(false);
  }, []);

  const handleUpdateSession = useCallback((updatedSession: AIStudySession) => {
    setSession(updatedSession);
  }, []);

  const handleComplete = useCallback((confidenceRating: number) => {
    if (!session) return;

    // Calculate XP earned
    const totalXP = session.xpEarned + (confidenceRating * 10);
    
    // Save to session history
    const historyEntry: StudySessionHistory = {
      id: session.id,
      moduleId: session.moduleId,
      competency: session.competency,
      date: new Date().toISOString().split("T")[0],
      durationMinutes: Math.round((Date.now() - session.startedAt) / 1000 / 60),
      type: "ai_session",
      score: confidenceRating * 20, // Convert 1-5 to 20-100
    };
    
    const history = getSessionHistory();
    saveSessionHistory([...history, historyEntry]);
    
    // Clear current session
    saveCurrentSession(null);
    
    // Mark daily plan tasks as completed based on session content
    // Study sessions complete reading and practice tasks
    markTaskCompleted("reading");
    markTaskCompleted("practice");
    
    // Show completion toast
    toast.success(`Sessão concluída! +${totalXP} XP`, {
      description: `Você estudou "${session.moduleName}" com a IA`,
    });
    
    // Navigate back to dashboard
    navigate("/");
  }, [session, navigate]);

  const handleExit = useCallback(() => {
    // Session is auto-saved, just navigate away
    navigate("/");
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Preparando sua sessão de estudo...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Erro ao carregar sessão</p>
        </div>
      </div>
    );
  }

  return (
    <AIStudySessionView
      session={session}
      onUpdateSession={handleUpdateSession}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
}
