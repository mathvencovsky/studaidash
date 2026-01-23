import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

// New Enterprise Components
import { HeroSection } from "./HeroSection";
import { AICopilotCTA } from "./AICopilotCTA";
import { TodayPlanCard } from "./TodayPlanCard";
import { TrailExecutiveSummary } from "./TrailExecutiveSummary";
import { ProgressSection } from "./ProgressSection";
import { AssessmentsSection } from "./AssessmentsSection";
import { GamificationSection } from "./GamificationSection";

// Keep existing components for backward compatibility
import { TrailSelectorCard } from "./TrailSelectorCard";
import { SmartFeedbackCard } from "./SmartFeedbackCard";

import type { DailyMission, CFAModule, UserProgress, Quiz, Simulado, SmartFeedback } from "@/types/studai";
import { getQuizQuestions } from "@/data/quiz-questions-data";
import { getNextAIStudyAction } from "@/data/ai-study-data";
import { 
  CFA_MODULES, 
  DEFAULT_USER_PROGRESS, 
  getTodayMission, 
  CFA_QUIZZES, 
  CFA_SIMULADOS, 
  getSmartFeedback,
  calculateTrailProgress 
} from "@/data/cfa-mock-data";
import { 
  MOCK_TRAIL_PLAN, 
  MOCK_STUDY_DATA, 
  AVAILABLE_TRAILS,
  calculateTrailMetrics 
} from "@/data/trail-planning-data";

// Storage keys
const STORAGE_KEYS = {
  mission: "studai_daily_mission",
  progress: "studai_user_progress",
  modules: "studai_cfa_modules",
};

// Helper to load from localStorage
function loadState<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
}

// Helper to save to localStorage
function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save state:", e);
  }
}

// Toast context
interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export function CFADashboard() {
  const navigate = useNavigate();
  
  // AI Recommendation
  const aiRecommendation = useMemo(() => getNextAIStudyAction(), []);
  
  // State
  const [mission, setMission] = useState<DailyMission>(() => 
    loadState(STORAGE_KEYS.mission, getTodayMission())
  );
  const [userProgress, setUserProgress] = useState<UserProgress>(() => 
    loadState(STORAGE_KEYS.progress, DEFAULT_USER_PROGRESS)
  );
  const [modules] = useState<CFAModule[]>(CFA_MODULES);
  const [quizzes] = useState<Quiz[]>(CFA_QUIZZES);
  const [simulados] = useState<Simulado[]>(CFA_SIMULADOS);
  const [feedback] = useState<SmartFeedback>(getSmartFeedback);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeTrail, setActiveTrail] = useState(MOCK_TRAIL_PLAN);

  // Calculate overall progress
  const overallProgress = useMemo(() => calculateTrailProgress(modules), [modules]);
  
  // Calculate trail planning metrics
  const trailCalculations = useMemo(() => 
    calculateTrailMetrics(MOCK_TRAIL_PLAN, MOCK_STUDY_DATA), 
    []
  );

  // Toast helpers
  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Persist mission changes
  useEffect(() => {
    saveState(STORAGE_KEYS.mission, mission);
  }, [mission]);

  // Persist user progress changes
  useEffect(() => {
    saveState(STORAGE_KEYS.progress, userProgress);
  }, [userProgress]);

  // Handlers
  const handleTaskClick = useCallback((task: { type: string; id: string }) => {
    setMission(prev => ({
      ...prev,
      status: prev.status === "not_started" ? "in_progress" : prev.status,
    }));

    switch (task.type) {
      case "reading":
      case "practice":
      case "summary":
        navigate("/estudar");
        break;
      case "quiz":
        navigate("/quizzes");
        break;
      default:
        navigate("/estudar");
    }
  }, [navigate]);

  const handleStartMission = useCallback(() => {
    const nextTask = mission.tasks.find(t => !t.completed);
    
    setMission(prev => ({
      ...prev,
      status: prev.status === "not_started" ? "in_progress" : prev.status,
    }));

    if (nextTask) {
      handleTaskClick(nextTask);
    } else {
      addToast("Todas as tarefas concluídas! 🎉", "success");
    }
  }, [mission.tasks, handleTaskClick, addToast]);

  const handleToggleTask = useCallback((taskId: string) => {
    setMission(prev => {
      const updatedTasks = prev.tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const newStatus = completedCount === updatedTasks.length 
        ? "completed" 
        : completedCount > 0 
          ? "in_progress" 
          : "not_started";

      const task = prev.tasks.find(t => t.id === taskId);
      if (task && !task.completed) {
        setUserProgress(p => ({
          ...p,
          xp: p.xp + 25,
          weeklyProgress: p.weeklyProgress + task.estimatedMinutes,
        }));
        addToast(`+25 XP! Tarefa concluída! 🎉`, "success");
      }

      return {
        ...prev,
        tasks: updatedTasks,
        status: newStatus,
      };
    });
  }, [addToast]);

  const handleModuleClick = useCallback((moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      addToast(`Abrindo: ${module.name}`, "info");
      navigate("/trilha", { state: { focusModuleId: moduleId } });
    }
  }, [addToast, modules, navigate]);

  const handleViewAllBadges = useCallback(() => {
    navigate("/perfil");
  }, [navigate]);

  const handleStartQuiz = useCallback((quizId: string) => {
    const questions = getQuizQuestions(quizId);
    if (questions.length > 0) {
      navigate(`/quiz/${quizId}`);
    } else {
      addToast("Quiz em desenvolvimento", "info");
    }
  }, [navigate, addToast]);

  const handleViewAllQuizzes = useCallback(() => {
    navigate("/quizzes");
  }, [navigate]);

  const handleStartSimulado = useCallback((simuladoId: string) => {
    const simulado = simulados.find(s => s.id === simuladoId);
    if (simulado) {
      addToast(`Iniciando: ${simulado.name}`, "success");
      navigate(`/quiz/${simuladoId}`, { state: { isSimulado: true, simulado } });
    }
  }, [simulados, navigate, addToast]);

  const handleFeedbackAction = useCallback(() => {
    if (feedback.actionModuleId) {
      navigate("/trilha", { state: { focusModuleId: feedback.actionModuleId } });
    } else if (feedback.type === "weakness" || feedback.type === "focus") {
      navigate("/estudar");
    } else {
      navigate("/trilha");
    }
  }, [feedback, navigate]);

  const handleSelectTrail = useCallback((trailId: string) => {
    const trail = AVAILABLE_TRAILS.find(t => t.id === trailId);
    if (trail) {
      setActiveTrail(prev => ({
        ...prev,
        id: trail.id,
        name: trail.name,
        category: trail.category,
      }));
      addToast(`Trilha "${trail.shortName}" selecionada! 🎯`, "success");
    }
  }, [addToast]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8 max-w-6xl mx-auto">
      {/* Enterprise Layout: Clean vertical flow with clear hierarchy */}
      <div className="space-y-6 sm:space-y-8">
        
        {/* 1. Hero Section - Copilot positioning */}
        <HeroSection 
          userName="João"
          progressPercent={trailCalculations.progressPercent}
          daysToGoal={trailCalculations.daysUntilTarget}
        />

        {/* 2. Primary CTA - Most dominant element */}
        <AICopilotCTA 
          recommendation={aiRecommendation}
          onStart={() => navigate("/estudar")}
        />

        {/* 3. Trail Selector (compact) */}
        <TrailSelectorCard 
          activeTrail={activeTrail}
          availableTrails={AVAILABLE_TRAILS}
          onSelectTrail={handleSelectTrail}
        />

        {/* 4. Two Column Layout for Supporting Content */}
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          
          {/* Left Column: Execution */}
          <div className="space-y-6">
            {/* Today's Plan (renamed from Daily Mission) */}
            <TodayPlanCard
              mission={mission}
              onStartMission={handleStartMission}
              onToggleTask={handleToggleTask}
              onTaskClick={handleTaskClick}
            />

            {/* Smart Feedback */}
            <SmartFeedbackCard
              feedback={feedback}
              onActionClick={handleFeedbackAction}
            />

            {/* Assessments (Quizzes + Simulados combined) */}
            <AssessmentsSection
              quizzes={quizzes}
              simulados={simulados}
              onStartQuiz={handleStartQuiz}
              onStartSimulado={handleStartSimulado}
              onViewAllQuizzes={handleViewAllQuizzes}
            />
          </div>

          {/* Right Column: Overview & Progress */}
          <div className="space-y-6">
            {/* Executive Summary of Trail */}
            <TrailExecutiveSummary 
              trailName={activeTrail.name}
              startDate={activeTrail.startDate}
              targetDate={activeTrail.targetDate}
              calculations={trailCalculations}
              totalHours={activeTrail.totalEstimatedHours}
              completedHours={activeTrail.completedHours}
              streak={MOCK_STUDY_DATA.streak}
              onViewDetails={() => navigate("/trilha")}
            />

            {/* Module Progress */}
            <ProgressSection
              modules={modules}
              overallProgress={overallProgress}
              onModuleClick={handleModuleClick}
            />

            {/* Gamification (last - not core) */}
            <GamificationSection
              progress={userProgress}
              onViewAllBadges={handleViewAllBadges}
            />
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-20 md:bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-[100] space-y-2 max-w-sm mx-auto sm:mx-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="p-3 sm:p-4 rounded-xl shadow-lg border bg-card animate-in slide-in-from-bottom-full sm:slide-in-from-right-full"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="sm:w-4 sm:h-4 text-accent shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-card-foreground">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
