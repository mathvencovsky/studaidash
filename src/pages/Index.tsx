import { useState, useEffect, useCallback } from "react";
import {
  Search, Flame, Clock, CheckCircle2, Target, BookOpen, Menu, X,
  Plus, TrendingUp, AlertTriangle, Award, Zap, Calendar, Filter,
  Sparkles, RotateCcw, Loader2
} from "lucide-react";

// ============================================================================
// DATA LAYER - Mock data & localStorage persistence
// Replace these with API calls when connecting to backend
// ============================================================================

const STORAGE_KEYS = {
  sessions: "studai_sessions",
  tracks: "studai_tracks",
  checklist: "studai_checklist",
  goals: "studai_goals",
  period: "studai_period",
  lastSessionDate: "studai_last_session",
  streak: "studai_streak",
};

const defaultTracks: Track[] = [
  { id: 1, name: "Matemática", progress: 72, status: "Em andamento" },
  { id: 2, name: "Português", progress: 100, status: "Concluída" },
  { id: 3, name: "Programação", progress: 45, status: "Em andamento" },
  { id: 4, name: "Inglês", progress: 0, status: "A iniciar" },
  { id: 5, name: "Física", progress: 28, status: "Em andamento" },
];

const defaultSessions: Session[] = [
  { id: "1", date: "2025-01-17", theme: "Álgebra Linear", trackId: 1, duration: 45, type: "Estudo", result: "Quiz 9/10", notes: "" },
  { id: "2", date: "2025-01-16", theme: "Gramática", trackId: 2, duration: 30, type: "Revisão", result: "", notes: "" },
  { id: "3", date: "2025-01-15", theme: "Python Básico", trackId: 3, duration: 60, type: "Estudo", result: "Quiz 8/10", notes: "" },
  { id: "4", date: "2025-01-14", theme: "Trigonometria", trackId: 1, duration: 40, type: "Simulado", result: "Quiz 7/10", notes: "" },
  { id: "5", date: "2025-01-13", theme: "Mecânica", trackId: 5, duration: 35, type: "Estudo", result: "Quiz 6/10", notes: "" },
  { id: "6", date: "2025-01-12", theme: "Redação", trackId: 2, duration: 50, type: "Estudo", result: "", notes: "" },
];

const defaultChecklist: ChecklistItem[] = [
  { id: 1, text: "Revisar fórmulas de física", checked: false },
  { id: 2, text: "Fazer quiz de matemática", checked: true },
  { id: 3, text: "Ler capítulo de gramática", checked: false },
];

const defaultGoals = { dailyGoal: 60, completed: 35 };

// Mock content database for AI search
const contentDatabase: ContentItem[] = [
  { id: 1, title: "Introdução à Álgebra Linear", summary: "Conceitos fundamentais de vetores, matrizes e transformações lineares.", tags: ["matemática", "álgebra", "vetores"], track: "Matemática", difficulty: "Médio" },
  { id: 2, title: "Derivadas e Integrais", summary: "Fundamentos do cálculo diferencial e integral com aplicações práticas.", tags: ["matemática", "cálculo", "derivadas"], track: "Matemática", difficulty: "Difícil" },
  { id: 3, title: "Gramática: Concordância Verbal", summary: "Regras de concordância verbal em português com exercícios.", tags: ["português", "gramática", "concordância"], track: "Português", difficulty: "Fácil" },
  { id: 4, title: "Redação ENEM: Estrutura", summary: "Como estruturar uma redação nota 1000 no ENEM.", tags: ["português", "redação", "enem"], track: "Português", difficulty: "Médio" },
  { id: 5, title: "Python: Variáveis e Tipos", summary: "Introdução a variáveis, tipos de dados e operadores em Python.", tags: ["programação", "python", "iniciante"], track: "Programação", difficulty: "Fácil" },
  { id: 6, title: "Python: Funções e Módulos", summary: "Criação de funções, parâmetros e importação de módulos.", tags: ["programação", "python", "funções"], track: "Programação", difficulty: "Médio" },
  { id: 7, title: "Estruturas de Dados em Python", summary: "Listas, dicionários, tuplas e conjuntos com exemplos práticos.", tags: ["programação", "python", "estruturas"], track: "Programação", difficulty: "Médio" },
  { id: 8, title: "English: Present Perfect", summary: "Usage and formation of present perfect tense with examples.", tags: ["inglês", "gramática", "tempos verbais"], track: "Inglês", difficulty: "Médio" },
  { id: 9, title: "English: Phrasal Verbs", summary: "Common phrasal verbs and their meanings in context.", tags: ["inglês", "vocabulário", "phrasal verbs"], track: "Inglês", difficulty: "Difícil" },
  { id: 10, title: "Física: Leis de Newton", summary: "As três leis de Newton e aplicações em mecânica.", tags: ["física", "mecânica", "newton"], track: "Física", difficulty: "Médio" },
  { id: 11, title: "Física: Cinemática", summary: "Movimento retilíneo uniforme e uniformemente variado.", tags: ["física", "cinemática", "movimento"], track: "Física", difficulty: "Fácil" },
  { id: 12, title: "Física: Energia e Trabalho", summary: "Conceitos de energia cinética, potencial e conservação.", tags: ["física", "energia", "trabalho"], track: "Física", difficulty: "Médio" },
  { id: 13, title: "Equações do 2º Grau", summary: "Resolução de equações quadráticas pela fórmula de Bhaskara.", tags: ["matemática", "equações", "bhaskara"], track: "Matemática", difficulty: "Fácil" },
  { id: 14, title: "Probabilidade e Estatística", summary: "Conceitos básicos de probabilidade e análise estatística.", tags: ["matemática", "probabilidade", "estatística"], track: "Matemática", difficulty: "Médio" },
  { id: 15, title: "Interpretação de Texto", summary: "Técnicas para melhorar a compreensão e interpretação textual.", tags: ["português", "interpretação", "leitura"], track: "Português", difficulty: "Fácil" },
];

// ============================================================================
// TYPES
// ============================================================================

interface Track {
  id: number;
  name: string;
  progress: number;
  status: "Em andamento" | "Concluída" | "A iniciar";
}

interface Session {
  id: string;
  date: string;
  theme: string;
  trackId: number;
  duration: number;
  type: "Estudo" | "Revisão" | "Simulado";
  result: string;
  notes: string;
}

interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}

interface ContentItem {
  id: number;
  title: string;
  summary: string;
  tags: string[];
  track: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
}

interface SearchFilters {
  track: string;
  difficulty: string;
  sortBy: "relevance" | "recent";
}

// ============================================================================
// ACTIONS - Business logic functions
// Replace internal logic with API calls when connecting to backend
// ============================================================================

// AI Search function - isolated for easy API replacement
async function searchStudAI(
  query: string,
  filters: SearchFilters
): Promise<ContentItem[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 500));

  // TODO: Replace with actual API call
  // return await fetch('/api/search', { body: JSON.stringify({ query, filters }) })

  let results = contentDatabase;

  // Filter by query (title, summary, tags)
  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.includes(q))
    );
  }

  // Filter by track
  if (filters.track && filters.track !== "all") {
    results = results.filter((item) => item.track === filters.track);
  }

  // Filter by difficulty
  if (filters.difficulty && filters.difficulty !== "all") {
    results = results.filter((item) => item.difficulty === filters.difficulty);
  }

  // Sort
  if (filters.sortBy === "recent") {
    results = [...results].reverse(); // Simulate recent first
  }

  return results;
}

function computeInsights(sessions: Session[], tracks: Track[]) {
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  });

  const activeDays = new Set(
    sessions.filter((s) => last7Days.includes(s.date)).map((s) => s.date)
  ).size;

  const bestTrack = tracks
    .filter((t) => t.status !== "A iniciar")
    .sort((a, b) => b.progress - a.progress)[0];

  const lastSessionDate = sessions.length > 0 ? sessions[0].date : null;
  const daysSinceLastSession = lastSessionDate
    ? Math.floor(
        (today.getTime() - new Date(lastSessionDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 999;

  const atRisk = daysSinceLastSession >= 2;

  // Projection: days to complete main track at current pace
  const mainTrack = tracks.find((t) => t.status === "Em andamento");
  let daysToComplete = null;
  if (mainTrack && sessions.length > 0) {
    const trackSessions = sessions.filter((s) => s.trackId === mainTrack.id);
    const avgProgressPerSession = 2; // 2% per session assumption
    const remaining = 100 - mainTrack.progress;
    const sessionsNeeded = Math.ceil(remaining / avgProgressPerSession);
    const avgSessionsPerWeek = Math.max(1, trackSessions.length / 4);
    daysToComplete = Math.ceil((sessionsNeeded / avgSessionsPerWeek) * 7);
  }

  return { activeDays, bestTrack, atRisk, daysSinceLastSession, daysToComplete, mainTrack };
}

function computeWeeklyMinutes(sessions: Session[], days: number) {
  const today = new Date();
  const result: { day: string; minutes: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("pt-BR", { weekday: "short" }).slice(0, 3);

    const dayMinutes = sessions
      .filter((s) => s.date === dateStr)
      .reduce((acc, s) => acc + s.duration, 0);

    result.push({ day: days <= 7 ? dayLabel : `S${Math.ceil((days - i) / 7)}`, minutes: dayMinutes });
  }

  return result;
}

// ============================================================================
// HOOKS - State management with localStorage
// ============================================================================

function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
);

const EmptyState = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Icon className="text-muted-foreground mb-4" size={48} />
    <h3 className="font-semibold text-card-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <AlertTriangle className="text-destructive mb-4" size={40} />
    <p className="text-sm text-destructive mb-3">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="px-4 py-2 text-sm bg-secondary rounded-lg hover:bg-muted">
        Tentar novamente
      </button>
    )}
  </div>
);

const StatCard = ({ icon, value, label, sublabel, highlight }: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
  highlight?: boolean;
}) => (
  <div className={`rounded-xl border p-4 ${highlight ? "bg-accent/10 border-accent" : "bg-card"}`}>
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <span className="text-xl font-bold text-card-foreground">{value}</span>
    </div>
    <p className="text-sm font-medium text-card-foreground">{label}</p>
    <p className="text-xs text-muted-foreground">{sublabel}</p>
  </div>
);

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "warning" | "success" }) => {
  const styles = {
    default: "bg-accent/10 text-accent",
    warning: "bg-warning/10 text-warning",
    success: "bg-success/10 text-success",
  };
  return <span className={`px-2 py-0.5 text-xs rounded-md font-medium ${styles[variant]}`}>{children}</span>;
};

const Modal = ({ open, onClose, title, children }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-card-foreground">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Index = () => {
  // Persisted state
  const [sessions, setSessions] = usePersistedState<Session[]>(STORAGE_KEYS.sessions, defaultSessions);
  const [tracks, setTracks] = usePersistedState<Track[]>(STORAGE_KEYS.tracks, defaultTracks);
  const [checklist, setChecklist] = usePersistedState<ChecklistItem[]>(STORAGE_KEYS.checklist, defaultChecklist);
  const [goals, setGoals] = usePersistedState(STORAGE_KEYS.goals, defaultGoals);
  const [period, setPeriod] = usePersistedState<"7" | "30">(STORAGE_KEYS.period, "7");
  const [streak, setStreak] = usePersistedState<number>(STORAGE_KEYS.streak, 12);

  // UI state
  const [activeTab, setActiveTab] = useState<"dashboard" | "trilhas" | "sessoes" | "ia">("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(true);

  // Modal state
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    trackId: "",
    theme: "",
    duration: "",
    type: "Estudo" as Session["type"],
    result: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  // AI Search state
  const [aiQuery, setAiQuery] = useState("");
  const [aiResults, setAiResults] = useState<ContentItem[]>([]);
  const [aiFilters, setAiFilters] = useState<SearchFilters>({ track: "all", difficulty: "all", sortBy: "relevance" });
  const [aiLoading, setAiLoading] = useState(false);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Computed values
  const userData = { name: "João Silva", plan: "Premium", level: 12, xp: 2450, xpNext: 3000 };
  const chartData = computeWeeklyMinutes(sessions, period === "7" ? 7 : 30);
  const maxMinutes = Math.max(...chartData.map((d) => d.minutes), 1);
  const totalWeeklyMinutes = sessions
    .filter((s) => {
      const d = new Date(s.date);
      const now = new Date();
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    })
    .reduce((acc, s) => acc + s.duration, 0);
  const totalWeeklyHours = (totalWeeklyMinutes / 60).toFixed(1);
  const tasksCompleted = tracks.filter((t) => t.status === "Concluída").length;
  const quizSessions = sessions.filter((s) => s.result.includes("/"));
  const quizAccuracy = quizSessions.length > 0
    ? Math.round(
        quizSessions.reduce((acc, s) => {
          const [correct, total] = s.result.replace("Quiz ", "").split("/").map(Number);
          return acc + (correct / total) * 100;
        }, 0) / quizSessions.length
      )
    : 0;

  const insights = computeInsights(sessions, tracks);
  const filteredTracks = tracks.filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Actions
  const resetDemo = () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setSessions(defaultSessions);
    setTracks(defaultTracks);
    setChecklist(defaultChecklist);
    setGoals(defaultGoals);
    setPeriod("7");
    setStreak(12);
  };

  const toggleCheck = (id: number) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const handleContinue = (name: string) => {
    alert(`Continuando: ${name}`);
  };

  const validateSessionForm = () => {
    const errors: Record<string, string> = {};
    if (!sessionForm.trackId) errors.trackId = "Selecione uma disciplina";
    if (!sessionForm.theme.trim()) errors.theme = "Informe o tema";
    if (!sessionForm.duration || parseInt(sessionForm.duration) <= 0) errors.duration = "Informe a duração";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveSession = () => {
    if (!validateSessionForm()) return;

    setSaveError(null);

    // Simulate occasional save error for demo
    if (Math.random() < 0.05) {
      setSaveError("Erro ao salvar sessão. Tente novamente.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const trackId = parseInt(sessionForm.trackId);
    const duration = parseInt(sessionForm.duration);

    // Create new session
    const newSession: Session = {
      id: Date.now().toString(),
      date: today,
      theme: sessionForm.theme,
      trackId,
      duration,
      type: sessionForm.type,
      result: sessionForm.result,
      notes: sessionForm.notes,
    };

    // Update sessions (add to beginning)
    setSessions((prev) => [newSession, ...prev]);

    // Update track progress (+2%, max 100%)
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const newProgress = Math.min(100, t.progress + 2);
          return {
            ...t,
            progress: newProgress,
            status: newProgress === 100 ? "Concluída" : "Em andamento",
          };
        }
        return t;
      })
    );

    // Update daily goal
    setGoals((prev) => ({
      ...prev,
      completed: Math.min(prev.dailyGoal, prev.completed + duration),
    }));

    // Update streak
    const lastSession = localStorage.getItem(STORAGE_KEYS.lastSessionDate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastSession !== today) {
      if (lastSession === yesterdayStr || !lastSession) {
        setStreak((prev) => prev + 1);
      }
      localStorage.setItem(STORAGE_KEYS.lastSessionDate, today);
    }

    // Reset form and close modal
    setSessionForm({ trackId: "", theme: "", duration: "", type: "Estudo", result: "", notes: "" });
    setSessionModalOpen(false);
  };

  const handleAiSearch = useCallback(async () => {
    setAiLoading(true);
    try {
      const results = await searchStudAI(aiQuery, aiFilters);
      setAiResults(results);
    } catch {
      setAiResults([]);
    } finally {
      setAiLoading(false);
    }
  }, [aiQuery, aiFilters]);

  useEffect(() => {
    if (activeTab === "ia" && aiResults.length === 0 && !aiQuery) {
      handleAiSearch();
    }
  }, [activeTab]);

  const getStatusColor = (status: string) => {
    if (status === "Concluída") return "text-success";
    if (status === "Em andamento") return "text-accent";
    return "text-muted-foreground";
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === "Fácil") return "success";
    if (diff === "Difícil") return "warning";
    return "default";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[hsl(260,80%,20%)] to-[hsl(222,89%,55%)] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="text-xl font-bold tracking-tight">StudAI</h1>
              {demoMode && <Badge>Demo</Badge>}
            </div>

            {/* User info + XP */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{userData.name}</p>
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <Zap size={12} />
                  <span>Nível {userData.level}</span>
                  <span>•</span>
                  <span>{userData.xp}/{userData.xpNext} XP</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {userData.name.charAt(0)}
              </div>
            </div>

            <button
              onClick={() => setSessionModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nova sessão</span>
            </button>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 mt-3 overflow-x-auto pb-1">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "trilhas", label: "Trilhas" },
              { id: "sessoes", label: "Sessões" },
              { id: "ia", label: "IA" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* ============ DASHBOARD TAB ============ */}
            {activeTab === "dashboard" && (
              <>
                {/* Insights Block */}
                <div className="bg-card rounded-xl border p-5">
                  <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-accent" />
                    Insights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Calendar size={14} />
                        Consistência
                      </div>
                      <p className="text-lg font-bold text-card-foreground">
                        {insights.activeDays}/7 dias
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Award size={14} />
                        Melhor trilha
                      </div>
                      <p className="text-lg font-bold text-card-foreground">
                        {insights.bestTrack?.name || "—"}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${insights.atRisk ? "bg-destructive/10" : "bg-success/10"}`}>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        {insights.atRisk ? <AlertTriangle size={14} className="text-destructive" /> : <TrendingUp size={14} className="text-success" />}
                        Status
                      </div>
                      <p className={`text-lg font-bold ${insights.atRisk ? "text-destructive" : "text-success"}`}>
                        {insights.atRisk ? `${insights.daysSinceLastSession}d sem estudar` : "Em dia!"}
                      </p>
                    </div>
                  </div>
                  {insights.daysToComplete && insights.mainTrack && (
                    <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/20">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-card-foreground">Projeção:</strong> Se mantiver o ritmo atual, você conclui{" "}
                        <strong className="text-accent">{insights.mainTrack.name}</strong> em aproximadamente{" "}
                        <strong className="text-accent">{insights.daysToComplete} dias</strong>.
                      </p>
                    </div>
                  )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    icon={<Flame className="text-warning" size={24} />}
                    value={`${streak} dias`}
                    label="Streak"
                    sublabel={`Meta: ${goals.dailyGoal} min/dia`}
                  />
                  <StatCard
                    icon={<Clock className="text-accent" size={24} />}
                    value={`${totalWeeklyHours}h`}
                    label="Tempo estudado"
                    sublabel="Esta semana"
                  />
                  <StatCard
                    icon={<CheckCircle2 className="text-success" size={24} />}
                    value={tasksCompleted.toString()}
                    label="Trilhas concluídas"
                    sublabel={`de ${tracks.length} trilhas`}
                  />
                  <StatCard
                    icon={<Target className="text-primary" size={24} />}
                    value={`${quizAccuracy}%`}
                    label="Precisão"
                    sublabel="Em quizzes"
                  />
                </div>

                {/* Chart */}
                <div className="bg-card rounded-xl border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-card-foreground">Minutos estudados</h3>
                    <div className="flex gap-2">
                      {(["7", "30"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPeriod(p)}
                          className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                            period === p
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-muted"
                          }`}
                        >
                          {p} dias
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-40">
                    {chartData.map((item, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex justify-center">
                          <div
                            className="w-full max-w-[40px] bg-accent rounded-t-md transition-all duration-300"
                            style={{ height: `${Math.max(4, (item.minutes / maxMinutes) * 120)}px` }}
                            title={`${item.minutes} min`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-card rounded-xl border p-5 overflow-x-auto">
                  <h3 className="font-semibold text-card-foreground mb-4">Atividade recente</h3>
                  {sessions.length === 0 ? (
                    <EmptyState
                      icon={BookOpen}
                      title="Nenhuma sessão registrada"
                      description="Clique em 'Nova sessão' para começar a registrar seus estudos."
                    />
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-2 font-medium text-muted-foreground">Data</th>
                          <th className="pb-2 font-medium text-muted-foreground">Tema</th>
                          <th className="pb-2 font-medium text-muted-foreground">Tipo</th>
                          <th className="pb-2 font-medium text-muted-foreground">Duração</th>
                          <th className="pb-2 font-medium text-muted-foreground">Resultado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.slice(0, 6).map((session) => (
                          <tr key={session.id} className="border-b last:border-0">
                            <td className="py-3 text-card-foreground">
                              {new Date(session.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                            </td>
                            <td className="py-3 text-card-foreground">{session.theme}</td>
                            <td className="py-3">
                              <Badge>{session.type}</Badge>
                            </td>
                            <td className="py-3 text-muted-foreground">{session.duration} min</td>
                            <td className="py-3">
                              {session.result ? <Badge variant="success">{session.result}</Badge> : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}

            {/* ============ TRILHAS TAB ============ */}
            {activeTab === "trilhas" && (
              <div className="bg-card rounded-xl border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-card-foreground">Trilhas / Disciplinas</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      placeholder="Filtrar trilhas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  {filteredTracks.length === 0 ? (
                    <EmptyState
                      icon={BookOpen}
                      title="Nenhuma trilha encontrada"
                      description="Tente outro termo de busca."
                    />
                  ) : (
                    filteredTracks.map((track) => (
                      <div key={track.id} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
                        <BookOpen className="text-primary shrink-0" size={24} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-medium text-card-foreground">{track.name}</span>
                            <span className={`text-xs font-medium ${getStatusColor(track.status)}`}>
                              {track.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent rounded-full transition-all"
                                style={{ width: `${track.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                              {track.progress}%
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleContinue(track.name)}
                          className="shrink-0 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Continuar
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ============ SESSÕES TAB ============ */}
            {activeTab === "sessoes" && (
              <div className="bg-card rounded-xl border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-card-foreground">Histórico de Sessões</h3>
                  <button
                    onClick={() => setSessionModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg"
                  >
                    <Plus size={16} />
                    Nova
                  </button>
                </div>
                {sessions.length === 0 ? (
                  <EmptyState
                    icon={Clock}
                    title="Nenhuma sessão ainda"
                    description="Registre sua primeira sessão de estudo!"
                  />
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => {
                      const track = tracks.find((t) => t.id === session.trackId);
                      return (
                        <div key={session.id} className="p-4 bg-secondary/50 rounded-lg">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium text-card-foreground">{session.theme}</p>
                              <p className="text-sm text-muted-foreground">
                                {track?.name} • {session.type} • {session.duration} min
                              </p>
                              {session.notes && (
                                <p className="text-sm text-muted-foreground mt-1 italic">"{session.notes}"</p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm text-muted-foreground">
                                {new Date(session.date).toLocaleDateString("pt-BR")}
                              </p>
                              {session.result && <Badge variant="success">{session.result}</Badge>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ============ IA TAB ============ */}
            {activeTab === "ia" && (
              <div className="space-y-4">
                <div className="bg-card rounded-xl border p-5">
                  <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-accent" />
                    Busca Inteligente
                  </h3>

                  {/* Search input */}
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input
                        type="text"
                        placeholder="Pergunte ou busque um tema..."
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                        className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <button
                      onClick={handleAiSearch}
                      disabled={aiLoading}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {aiLoading ? <Loader2 size={18} className="animate-spin" /> : "Buscar"}
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Filter size={14} className="text-muted-foreground" />
                      <select
                        value={aiFilters.track}
                        onChange={(e) => setAiFilters((f) => ({ ...f, track: e.target.value }))}
                        className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm focus:outline-none"
                      >
                        <option value="all">Todas trilhas</option>
                        {tracks.map((t) => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <select
                      value={aiFilters.difficulty}
                      onChange={(e) => setAiFilters((f) => ({ ...f, difficulty: e.target.value }))}
                      className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm focus:outline-none"
                    >
                      <option value="all">Dificuldade</option>
                      <option value="Fácil">Fácil</option>
                      <option value="Médio">Médio</option>
                      <option value="Difícil">Difícil</option>
                    </select>
                    <select
                      value={aiFilters.sortBy}
                      onChange={(e) => setAiFilters((f) => ({ ...f, sortBy: e.target.value as SearchFilters["sortBy"] }))}
                      className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm focus:outline-none"
                    >
                      <option value="relevance">Relevância</option>
                      <option value="recent">Mais recente</option>
                    </select>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-card rounded-xl border p-5">
                  <h4 className="font-medium text-card-foreground mb-4">
                    {aiResults.length} resultados encontrados
                  </h4>
                  {aiLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
                    </div>
                  ) : aiResults.length === 0 ? (
                    <EmptyState
                      icon={Search}
                      title="Nenhum resultado"
                      description="Tente outros termos ou filtros."
                    />
                  ) : (
                    <div className="grid gap-3">
                      {aiResults.map((item) => (
                        <div key={item.id} className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h5 className="font-medium text-card-foreground mb-1">{item.title}</h5>
                              <p className="text-sm text-muted-foreground mb-2">{item.summary}</p>
                              <div className="flex flex-wrap gap-2">
                                <Badge>{item.track}</Badge>
                                <Badge variant={getDifficultyColor(item.difficulty) as any}>{item.difficulty}</Badge>
                                {item.tags.slice(0, 2).map((tag) => (
                                  <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
                                ))}
                              </div>
                            </div>
                            <button className="shrink-0 px-3 py-1.5 text-sm bg-accent text-accent-foreground rounded-lg">
                              Estudar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside
            className={`
              lg:w-72 shrink-0 space-y-4
              fixed lg:static inset-0 top-[125px] z-40 bg-background lg:bg-transparent
              transform transition-transform lg:transform-none
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              p-4 lg:p-0 overflow-y-auto
            `}
          >
            {/* Demo Mode */}
            {demoMode && (
              <div className="bg-card rounded-xl border p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-card-foreground">Demo Mode</span>
                  <button
                    onClick={() => setDemoMode(false)}
                    className="text-xs text-muted-foreground hover:text-card-foreground"
                  >
                    Ocultar
                  </button>
                </div>
                <button
                  onClick={resetDemo}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                >
                  <RotateCcw size={14} />
                  Resetar dados
                </button>
              </div>
            )}

            {/* Daily Goal */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-semibold text-card-foreground mb-3">Meta de hoje</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-primary">
                  {goals.completed}/{goals.dailyGoal}
                </span>
                <span className="text-sm text-muted-foreground">min</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[hsl(260,80%,20%)] to-[hsl(222,89%,55%)] rounded-full transition-all"
                  style={{ width: `${Math.min(100, (goals.completed / goals.dailyGoal) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {goals.completed >= goals.dailyGoal
                  ? "🎉 Meta batida! Parabéns!"
                  : `Faltam ${goals.dailyGoal - goals.completed} min para bater a meta!`}
              </p>
            </div>

            {/* Recommendation */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-semibold text-card-foreground mb-3">Próxima recomendação</h3>
              <div className="p-3 bg-accent/10 rounded-lg">
                <p className="font-medium text-card-foreground text-sm">Quiz: Derivadas e Integrais</p>
                <p className="text-xs text-muted-foreground mt-1">15 questões • ~20 min</p>
                <button className="mt-3 w-full py-2 text-sm font-medium bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Iniciar
                </button>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-semibold text-card-foreground mb-3">Checklist rápido</h3>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleCheck(item.id)}
                      className="mt-0.5 w-4 h-4 rounded border-2 border-muted-foreground checked:bg-success checked:border-success accent-success"
                    />
                    <span className={`text-sm ${item.checked ? "text-muted-foreground line-through" : "text-card-foreground"}`}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* New Session Modal */}
      <Modal open={sessionModalOpen} onClose={() => setSessionModalOpen(false)} title="Nova Sessão de Estudo">
        <div className="space-y-4">
          {saveError && <ErrorState message={saveError} onRetry={() => setSaveError(null)} />}

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Disciplina *</label>
            <select
              value={sessionForm.trackId}
              onChange={(e) => setSessionForm((f) => ({ ...f, trackId: e.target.value }))}
              className={`w-full px-3 py-2 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                formErrors.trackId ? "border-destructive" : "border-border"
              }`}
            >
              <option value="">Selecione...</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {formErrors.trackId && <p className="text-xs text-destructive mt-1">{formErrors.trackId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Tema *</label>
            <input
              type="text"
              value={sessionForm.theme}
              onChange={(e) => setSessionForm((f) => ({ ...f, theme: e.target.value }))}
              placeholder="Ex: Álgebra Linear, Verbos Irregulares..."
              className={`w-full px-3 py-2 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                formErrors.theme ? "border-destructive" : "border-border"
              }`}
            />
            {formErrors.theme && <p className="text-xs text-destructive mt-1">{formErrors.theme}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Duração (min) *</label>
              <input
                type="number"
                value={sessionForm.duration}
                onChange={(e) => setSessionForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="30"
                min="1"
                className={`w-full px-3 py-2 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  formErrors.duration ? "border-destructive" : "border-border"
                }`}
              />
              {formErrors.duration && <p className="text-xs text-destructive mt-1">{formErrors.duration}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Tipo</label>
              <select
                value={sessionForm.type}
                onChange={(e) => setSessionForm((f) => ({ ...f, type: e.target.value as Session["type"] }))}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Estudo">Estudo</option>
                <option value="Revisão">Revisão</option>
                <option value="Simulado">Simulado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Resultado (opcional)</label>
            <input
              type="text"
              value={sessionForm.result}
              onChange={(e) => setSessionForm((f) => ({ ...f, result: e.target.value }))}
              placeholder="Ex: Quiz 8/10"
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Notas (opcional)</label>
            <textarea
              value={sessionForm.notes}
              onChange={(e) => setSessionForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Anotações sobre a sessão..."
              rows={3}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setSessionModalOpen(false)}
              className="flex-1 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveSession}
              className="flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Salvar sessão
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Index;
