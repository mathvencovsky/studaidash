import { useState, useCallback, useMemo, useEffect } from "react";
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Trophy, 
  HelpCircle,
  FileText,
  Settings,
  User,
  Bell,
  Search,
  Sparkles,
  ChevronDown,
  LogOut
} from "lucide-react";
import { DailyMissionCard } from "./DailyMissionCard";
import { TrailProgressCard } from "./TrailProgressCard";
import { GamificationCard } from "./GamificationCard";
import { QuizzesCard } from "./QuizzesCard";
import { SimuladosCard } from "./SimuladosCard";
import { SmartFeedbackCard } from "./SmartFeedbackCard";
import type { DailyMission, CFAModule, UserProgress, Quiz, Simulado, SmartFeedback } from "@/types/studai";
import { 
  CFA_MODULES, 
  DEFAULT_USER_PROGRESS, 
  getTodayMission, 
  CFA_QUIZZES, 
  CFA_SIMULADOS, 
  getSmartFeedback,
  calculateTrailProgress 
} from "@/data/cfa-mock-data";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Calculate overall progress
  const overallProgress = useMemo(() => calculateTrailProgress(modules), [modules]);

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
    const quiz = quizzes.find(q => q.id === quizId);
    addToast(`Iniciando quiz: ${quiz?.moduleName || "Quiz"}`, "info");
    // TODO API: Start quiz session
  }, [addToast, quizzes]);

  const handleViewAllQuizzes = useCallback(() => {
    addToast("Ver todas as avaliações", "info");
    // TODO API: Navigate to quizzes page
  }, [addToast]);

  const handleStartSimulado = useCallback((simuladoId: string) => {
    const simulado = simulados.find(s => s.id === simuladoId);
    addToast(`Iniciando: ${simulado?.name || "Simulado"}`, "info");
    // TODO API: Start simulado session
  }, [addToast, simulados]);

  const handleFeedbackAction = useCallback(() => {
    addToast("Redirecionando para prática...", "info");
    // TODO API: Navigate to practice module
  }, [addToast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-primary">StudAI</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <button className="px-4 py-2 text-sm font-medium text-primary bg-accent/10 rounded-lg">
                <Home size={16} className="inline mr-2" />
                Dashboard
              </button>
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-card-foreground hover:bg-secondary rounded-lg transition-colors">
                <BookOpen size={16} className="inline mr-2" />
                Trilha
              </button>
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-card-foreground hover:bg-secondary rounded-lg transition-colors">
                <Trophy size={16} className="inline mr-2" />
                Conquistas
              </button>
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-card-foreground hover:bg-secondary rounded-lg transition-colors">
                <HelpCircle size={16} className="inline mr-2" />
                Avaliações
              </button>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Search - Desktop */}
              <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-secondary rounded-lg hover:bg-muted transition-colors">
                <Search size={16} />
                <span>Buscar...</span>
              </button>

              {/* Notifications */}
              <button className="p-2 text-muted-foreground hover:text-card-foreground hover:bg-secondary rounded-lg transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </button>

              {/* Profile */}
              <button className="hidden md:flex items-center gap-2 p-1.5 pr-3 bg-secondary rounded-full hover:bg-muted transition-colors">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  JS
                </div>
                <span className="text-sm font-medium text-card-foreground">João</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-card-foreground hover:bg-secondary rounded-lg"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-card">
            <nav className="p-4 space-y-2">
              <button className="w-full px-4 py-3 text-sm font-medium text-primary bg-accent/10 rounded-lg text-left flex items-center gap-3">
                <Home size={18} />
                Dashboard
              </button>
              <button className="w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg text-left flex items-center gap-3 transition-colors">
                <BookOpen size={18} />
                Trilha
              </button>
              <button className="w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg text-left flex items-center gap-3 transition-colors">
                <Trophy size={18} />
                Conquistas
              </button>
              <button className="w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg text-left flex items-center gap-3 transition-colors">
                <HelpCircle size={18} />
                Avaliações
              </button>
              <button className="w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg text-left flex items-center gap-3 transition-colors">
                <FileText size={18} />
                Simulados
              </button>
              <div className="border-t my-2" />
              <button className="w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg text-left flex items-center gap-3 transition-colors">
                <Settings size={18} />
                Configurações
              </button>
              <button className="w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg text-left flex items-center gap-3 transition-colors">
                <User size={18} />
                Meu Perfil
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 md:pb-8">
        {/* Welcome Message */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">
            Olá, João! 👋
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-0.5 sm:mt-1">
            Continue de onde parou. Sua missão está esperando!
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column - Primary Actions */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
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
          </div>

          {/* Right Column - Supporting Info */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
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

            {/* 4. Quizzes */}
            <QuizzesCard
              quizzes={quizzes}
              onStartQuiz={handleStartQuiz}
              onViewAll={handleViewAllQuizzes}
            />

            {/* 5. Simulados */}
            <SimuladosCard
              simulados={simulados}
              onStartSimulado={handleStartSimulado}
            />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 safe-area-bottom">
        <div className="flex items-center justify-around py-1.5 pb-safe">
          <button className="flex flex-col items-center gap-0.5 p-2 text-primary min-w-[60px] active:opacity-70 transition-opacity">
            <Home size={22} />
            <span className="text-[9px] font-medium">Início</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 p-2 text-muted-foreground min-w-[60px] active:opacity-70 transition-opacity">
            <BookOpen size={22} />
            <span className="text-[9px] font-medium">Trilha</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 p-2 text-muted-foreground min-w-[60px] active:opacity-70 transition-opacity">
            <HelpCircle size={22} />
            <span className="text-[9px] font-medium">Quizzes</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 p-2 text-muted-foreground min-w-[60px] active:opacity-70 transition-opacity">
            <Trophy size={22} />
            <span className="text-[9px] font-medium">Ranking</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 p-2 text-muted-foreground min-w-[60px] active:opacity-70 transition-opacity">
            <User size={22} />
            <span className="text-[9px] font-medium">Perfil</span>
          </button>
        </div>
      </nav>

      {/* Toast Notifications */}
      <div className="fixed bottom-16 sm:bottom-20 md:bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-[100] space-y-2 max-w-sm mx-auto sm:mx-0">
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
