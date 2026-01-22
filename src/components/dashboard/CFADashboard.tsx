import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { DailyMissionCard } from "./DailyMissionCard";
import { TrailProgressCard } from "./TrailProgressCard";
import { GamificationCard } from "./GamificationCard";
import { QuizzesCard } from "./QuizzesCard";
import { SimuladosCard } from "./SimuladosCard";
import { SmartFeedbackCard } from "./SmartFeedbackCard";
import { AIStudyCTACard } from "./AIStudyCTACard";
import { TrailOverviewCard } from "./TrailOverviewCard";
import { TrailSelectorCard } from "./TrailSelectorCard";
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
  const handleStartMission = useCallback(() => {
    setMission(prev => ({
      ...prev,
      status: prev.status === "not_started" ? "in_progress" : prev.status,
    }));
    addToast("Missão iniciada! Boa sorte! 🚀", "success");
  }, [addToast]);

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

      // Award XP if task completed
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
    addToast("Abrindo módulo...", "info");
    // TODO API: Navigate to module detail view
  }, [addToast]);

  const handleViewAllBadges = useCallback(() => {
    addToast("Ver todas as conquistas", "info");
    // TODO API: Open badges modal
  }, [addToast]);

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
    addToast(`Iniciando: ${simulado?.name || "Simulado"}`, "info");
    // TODO API: Start simulado session
  }, [addToast, simulados]);

  const handleFeedbackAction = useCallback(() => {
    addToast("Redirecionando para prática...", "info");
    // TODO API: Navigate to practice module
  }, [addToast]);

  const handleSelectTrail = useCallback((trailId: string) => {
    const trail = AVAILABLE_TRAILS.find(t => t.id === trailId);
    if (trail) {
      addToast(`Trilha "${trail.shortName}" selecionada! 🎯`, "success");
      // TODO API: Load trail data from backend
    }
  }, [addToast]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 max-w-7xl mx-auto">
      {/* Welcome + Tagline */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">
          Olá, João! 👋
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-0.5 sm:mt-1">
          O StudAI usa IA para adaptar seus estudos ao seu objetivo e ritmo.
        </p>
      </div>

      {/* CTA Principal - Estudar com IA */}
      <div className="mb-5 sm:mb-6">
        <AIStudyCTACard 
          recommendation={aiRecommendation}
          onStartWithAI={() => navigate("/estudar")}
          onViewTrail={() => navigate("/trilha")}
        />
      </div>

      {/* Trail Selector + Overview Grid - Equal columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-4 sm:gap-5 lg:gap-6 mb-5 sm:mb-6">
        {/* Trail Selector */}
        <TrailSelectorCard 
          activeTrail={activeTrail}
          availableTrails={AVAILABLE_TRAILS}
          onSelectTrail={handleSelectTrail}
        />
        
        {/* Visão Geral da Trilha */}
        <TrailOverviewCard 
          trailName={activeTrail.name}
          startDate={activeTrail.startDate}
          targetDate={activeTrail.targetDate}
          calculations={trailCalculations}
          totalHours={activeTrail.totalEstimatedHours}
          completedHours={activeTrail.completedHours}
        />
      </div>

      {/* Main Grid Layout - Equal 6/6 columns for balance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        {/* Left Column - Primary Actions */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* 1. DAILY MISSION - Most Important */}
          <DailyMissionCard
            mission={mission}
            onStartMission={handleStartMission}
            onToggleTask={handleToggleTask}
          />

          {/* Smart Feedback */}
          <SmartFeedbackCard
            feedback={feedback}
            onActionClick={handleFeedbackAction}
          />

          {/* Quizzes */}
          <QuizzesCard
            quizzes={quizzes}
            onStartQuiz={handleStartQuiz}
            onViewAll={handleViewAllQuizzes}
          />
        </div>

        {/* Right Column - Supporting Info */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* 2. Trail Progress */}
          <TrailProgressCard
            modules={modules}
            overallProgress={overallProgress}
            onModuleClick={handleModuleClick}
          />

          {/* 3. Gamification */}
          <GamificationCard
            progress={userProgress}
            onViewAllBadges={handleViewAllBadges}
          />

          {/* 4. Simulados */}
          <SimuladosCard
            simulados={simulados}
            onStartSimulado={handleStartSimulado}
          />
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
