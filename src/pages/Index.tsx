import { useState, useEffect, useCallback, useRef, createContext, useContext, useMemo } from "react";
import {
  Search, Flame, Clock, CheckCircle2, Target, BookOpen, Menu, X,
  Plus, TrendingUp, AlertTriangle, Award, Zap, Calendar, Filter,
  Sparkles, RotateCcw, Loader2, ChevronLeft, ChevronRight, Edit3,
  Copy, Trash2, Bookmark, BookmarkCheck, History, Play, Brain,
  Settings, BarChart3, Trophy, Shield, ArrowUpRight, ArrowDownRight,
  LayoutDashboard, GraduationCap, FolderOpen, CalendarDays, ListChecks,
  RefreshCw, Bot, Star, ChevronDown, FileText, ExternalLink
} from "lucide-react";

// ============================================================================
// DESIGN TOKENS - Paleta StudAI
// Primária: #1A237E (hsl 234 67% 30%)
// Gradiente: #1A1054 → #255FF1
// Accent: #255FF1 (hsl 222 89% 55%)
// ============================================================================

// ============================================================================
// TOAST CONTEXT
// ============================================================================

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  action?: { label: string; onClick: () => void };
}

const ToastContext = createContext<{
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}>({ addToast: () => {}, removeToast: () => {} });

const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg border bg-card ${
              toast.type === "error" ? "border-destructive/50" : "border-accent/30"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-card-foreground">{toast.message}</p>
              <div className="flex items-center gap-2">
                {toast.action && (
                  <button
                    onClick={() => { toast.action?.onClick(); removeToast(toast.id); }}
                    className="text-xs font-medium text-accent hover:underline"
                  >
                    {toast.action.label}
                  </button>
                )}
                <button onClick={() => removeToast(toast.id)} className="text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ============================================================================
// TYPES
// ============================================================================

type ViewId = "dashboard" | "trilhas" | "cursos" | "sessoes" | "calendario" | "metas" | "revisoes" | "ia" | "salvos" | "config";

interface NavItem {
  id: ViewId;
  label: string;
  icon: any;
  section: "learn" | "progress" | "tools";
  badgeCount?: number;
}

interface Track {
  id: number;
  name: string;
  progress: number;
  status: "Em andamento" | "Concluída" | "A iniciar";
  skills: string[];
  milestones: { percent: number; label: string; achieved: boolean }[];
}

interface Session {
  id: string;
  date: string;
  createdAt: number;
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

interface Goals {
  dailyGoal: number;
  weeklyGoal: number;
  completed: number;
  weeklyPlan: { day: string; target: number; completed: number }[];
}

interface PlanItem {
  id: string;
  contentId: number;
  addedAt: number;
  completed: boolean;
}

interface ReviewItem {
  id: string;
  theme: string;
  trackId: number;
  originalDate: string;
  reviewDates: { date: string; completed: boolean }[];
}

interface BookmarkedContent {
  id: number;
  content: ContentItem;
  savedAt: number;
}

interface SavedSearch {
  id: string;
  query: string;
  timestamp: number;
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================

const STORAGE_KEYS = {
  sessions: "studai_sessions",
  tracks: "studai_tracks",
  checklist: "studai_checklist",
  goals: "studai_goals",
  streak: "studai_streak",
  searchHistory: "studai_search_history",
  bookmarks: "studai_bookmarks",
  sidebarCollapsed: "studai_sidebar_collapsed",
  planItems: "studai_plan_items",
  reviewSchedule: "studai_review_schedule",
  calendarMonth: "studai_calendar_month",
};

function loadState<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save state:", e);
  }
}

// ============================================================================
// DEFAULT DATA
// ============================================================================

const defaultTracks: Track[] = [
  { id: 1, name: "Matemática", progress: 72, status: "Em andamento", skills: ["Álgebra", "Cálculo", "Probabilidade"], milestones: [
    { percent: 25, label: "Iniciante", achieved: true },
    { percent: 50, label: "Intermediário", achieved: true },
    { percent: 75, label: "Avançado", achieved: false },
    { percent: 100, label: "Mestre", achieved: false },
  ]},
  { id: 2, name: "Português", progress: 100, status: "Concluída", skills: ["Gramática", "Redação", "Interpretação"], milestones: [
    { percent: 25, label: "Iniciante", achieved: true },
    { percent: 50, label: "Intermediário", achieved: true },
    { percent: 75, label: "Avançado", achieved: true },
    { percent: 100, label: "Mestre", achieved: true },
  ]},
  { id: 3, name: "Programação", progress: 45, status: "Em andamento", skills: ["Python", "Lógica", "Estruturas de Dados"], milestones: [
    { percent: 25, label: "Iniciante", achieved: true },
    { percent: 50, label: "Intermediário", achieved: false },
    { percent: 75, label: "Avançado", achieved: false },
    { percent: 100, label: "Mestre", achieved: false },
  ]},
  { id: 4, name: "Inglês", progress: 15, status: "Em andamento", skills: ["Gramática", "Vocabulário", "Conversação"], milestones: [
    { percent: 25, label: "Iniciante", achieved: false },
    { percent: 50, label: "Intermediário", achieved: false },
    { percent: 75, label: "Avançado", achieved: false },
    { percent: 100, label: "Mestre", achieved: false },
  ]},
  { id: 5, name: "Física", progress: 28, status: "Em andamento", skills: ["Mecânica", "Termodinâmica", "Eletricidade"], milestones: [
    { percent: 25, label: "Iniciante", achieved: true },
    { percent: 50, label: "Intermediário", achieved: false },
    { percent: 75, label: "Avançado", achieved: false },
    { percent: 100, label: "Mestre", achieved: false },
  ]},
];

const defaultSessions: Session[] = [
  { id: "1", date: "2025-01-17", createdAt: Date.now(), theme: "Álgebra Linear", trackId: 1, duration: 45, type: "Estudo", result: "Quiz 9/10", notes: "" },
  { id: "2", date: "2025-01-16", createdAt: Date.now() - 86400000, theme: "Gramática", trackId: 2, duration: 30, type: "Revisão", result: "", notes: "" },
  { id: "3", date: "2025-01-15", createdAt: Date.now() - 172800000, theme: "Python Básico", trackId: 3, duration: 60, type: "Estudo", result: "Quiz 8/10", notes: "" },
  { id: "4", date: "2025-01-14", createdAt: Date.now() - 259200000, theme: "Trigonometria", trackId: 1, duration: 40, type: "Simulado", result: "Quiz 7/10", notes: "" },
  { id: "5", date: "2025-01-13", createdAt: Date.now() - 345600000, theme: "Mecânica", trackId: 5, duration: 35, type: "Estudo", result: "Quiz 6/10", notes: "" },
  { id: "6", date: "2025-01-12", createdAt: Date.now() - 432000000, theme: "Redação", trackId: 2, duration: 50, type: "Estudo", result: "", notes: "" },
  { id: "7", date: "2025-01-10", createdAt: Date.now() - 604800000, theme: "Present Perfect", trackId: 4, duration: 25, type: "Estudo", result: "Quiz 7/10", notes: "" },
];

const defaultGoals: Goals = {
  dailyGoal: 60,
  weeklyGoal: 300,
  completed: 35,
  weeklyPlan: [
    { day: "Seg", target: 60, completed: 45 },
    { day: "Ter", target: 60, completed: 60 },
    { day: "Qua", target: 45, completed: 30 },
    { day: "Qui", target: 60, completed: 0 },
    { day: "Sex", target: 45, completed: 0 },
    { day: "Sáb", target: 30, completed: 0 },
    { day: "Dom", target: 0, completed: 0 },
  ],
};

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
// NAVIGATION CONFIG
// ============================================================================

const NAV_SECTIONS = [
  { id: "learn", label: "Aprender" },
  { id: "progress", label: "Progresso" },
  { id: "tools", label: "Ferramentas" },
] as const;

const createNavItems = (bookmarkCount: number, reviewCount: number, planCount: number): NavItem[] => [
  { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard, section: "learn" },
  { id: "trilhas", label: "Trilhas", icon: GraduationCap, section: "learn" },
  { id: "cursos", label: "Conteúdos", icon: FolderOpen, section: "learn" },
  { id: "sessoes", label: "Sessões", icon: Clock, section: "progress" },
  { id: "calendario", label: "Calendário", icon: CalendarDays, section: "progress" },
  { id: "metas", label: "Metas", icon: Target, section: "progress", badgeCount: planCount > 0 ? planCount : undefined },
  { id: "revisoes", label: "Revisões", icon: RefreshCw, section: "progress", badgeCount: reviewCount > 0 ? reviewCount : undefined },
  { id: "ia", label: "IA", icon: Bot, section: "tools" },
  { id: "salvos", label: "Salvos", icon: Star, section: "tools", badgeCount: bookmarkCount > 0 ? bookmarkCount : undefined },
  { id: "config", label: "Configurações", icon: Settings, section: "tools" },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function sortSessions(sessions: Session[]): Session[] {
  return [...sessions].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return b.createdAt - a.createdAt;
  });
}

function formatDateBR(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  return `${day}/${month}`;
}

function formatFullDateBR(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
}

function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Add padding days from previous month
  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push(d);
  }
  
  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add padding days from next month
  const endPadding = 42 - days.length;
  for (let i = 1; i <= endPadding; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
}

function generateReviewSchedule(sessions: Session[]): ReviewItem[] {
  const reviews: ReviewItem[] = [];
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  
  // Get unique themes from last 7 days
  const recentSessions = sessions.filter((s) => {
    const diff = (today.getTime() - new Date(s.date + "T12:00:00").getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 1 && diff <= 7;
  });
  
  const uniqueThemes = new Map<string, Session>();
  recentSessions.forEach((s) => {
    if (!uniqueThemes.has(s.theme)) {
      uniqueThemes.set(s.theme, s);
    }
  });
  
  uniqueThemes.forEach((session, theme) => {
    const originalDate = new Date(session.date + "T12:00:00");
    const d1 = new Date(originalDate);
    d1.setDate(d1.getDate() + 1);
    const d3 = new Date(originalDate);
    d3.setDate(d3.getDate() + 3);
    const d7 = new Date(originalDate);
    d7.setDate(d7.getDate() + 7);
    
    reviews.push({
      id: `review_${session.id}`,
      theme,
      trackId: session.trackId,
      originalDate: session.date,
      reviewDates: [
        { date: d1.toISOString().split("T")[0], completed: d1 < today },
        { date: d3.toISOString().split("T")[0], completed: d3 < today },
        { date: d7.toISOString().split("T")[0], completed: false },
      ],
    });
  });
  
  return reviews;
}

// ============================================================================
// GLOBAL SEARCH FUNCTION
// ============================================================================

interface SearchResult {
  type: "track" | "session" | "content";
  id: number | string;
  title: string;
  subtitle: string;
  viewId: ViewId;
}

function globalSearch(query: string, tracks: Track[], sessions: Session[], contents: ContentItem[]): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];
  
  tracks.forEach((t) => {
    if (t.name.toLowerCase().includes(q) || t.skills.some((s) => s.toLowerCase().includes(q))) {
      results.push({ type: "track", id: t.id, title: t.name, subtitle: `${t.progress}% concluído`, viewId: "trilhas" });
    }
  });
  
  sessions.slice(0, 20).forEach((s) => {
    if (s.theme.toLowerCase().includes(q)) {
      results.push({ type: "session", id: s.id, title: s.theme, subtitle: formatDateBR(s.date), viewId: "sessoes" });
    }
  });
  
  contents.forEach((c) => {
    if (c.title.toLowerCase().includes(q) || c.tags.some((t) => t.includes(q))) {
      results.push({ type: "content", id: c.id, title: c.title, subtitle: c.track, viewId: "cursos" });
    }
  });
  
  return results.slice(0, 10);
}

// ============================================================================
// HOOKS
// ============================================================================

function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => loadState(key, defaultValue));

  useEffect(() => {
    saveState(key, state);
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

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "accent" | "muted" | "outline" | "count" }) => {
  const styles = {
    default: "bg-accent/10 text-accent",
    accent: "bg-accent text-accent-foreground",
    muted: "bg-muted text-muted-foreground",
    outline: "border border-border text-muted-foreground",
    count: "bg-accent text-accent-foreground min-w-[18px] h-[18px] text-[10px] flex items-center justify-center rounded-full",
  };
  return <span className={`px-2 py-0.5 text-xs rounded-md font-medium ${styles[variant]}`}>{children}</span>;
};

const Modal = ({ open, onClose, title, children, size = "md" }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) => {
  if (!open) return null;
  const sizeClasses = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-card rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-card z-10">
          <h2 className="font-semibold text-card-foreground">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg" aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, sublabel, trend }: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
  trend?: { value: number; positive: boolean };
}) => (
  <div className="bg-card rounded-xl border p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xl font-bold text-card-foreground">{value}</span>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend.positive ? "text-accent" : "text-muted-foreground"}`}>
          {trend.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend.value)}%
        </div>
      )}
    </div>
    <p className="text-sm font-medium text-card-foreground">{label}</p>
    <p className="text-xs text-muted-foreground">{sublabel}</p>
  </div>
);

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

const Dashboard = () => {
  const { addToast } = useToast();

  // Persisted state
  const [sessions, setSessions] = usePersistedState<Session[]>(STORAGE_KEYS.sessions, defaultSessions);
  const [tracks, setTracks] = usePersistedState<Track[]>(STORAGE_KEYS.tracks, defaultTracks);
  const [goals, setGoals] = usePersistedState<Goals>(STORAGE_KEYS.goals, defaultGoals);
  const [streak, setStreak] = usePersistedState<number>(STORAGE_KEYS.streak, 12);
  const [bookmarks, setBookmarks] = usePersistedState<BookmarkedContent[]>(STORAGE_KEYS.bookmarks, []);
  const [sidebarCollapsed, setSidebarCollapsed] = usePersistedState<boolean>(STORAGE_KEYS.sidebarCollapsed, false);
  const [planItems, setPlanItems] = usePersistedState<PlanItem[]>(STORAGE_KEYS.planItems, []);
  const [searchHistory, setSearchHistory] = usePersistedState<SavedSearch[]>(STORAGE_KEYS.searchHistory, []);
  const [calendarMonth, setCalendarMonth] = usePersistedState<string>(STORAGE_KEYS.calendarMonth, 
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  );

  // UI state
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(true);

  // Global search
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const globalSearchRef = useRef<HTMLDivElement>(null);

  // Session modal
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessionForm, setSessionForm] = useState({
    trackId: "", theme: "", duration: "", type: "Estudo" as Session["type"], result: "", notes: "", date: new Date().toISOString().split("T")[0],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Content detail modal
  const [contentDetailModal, setContentDetailModal] = useState<ContentItem | null>(null);

  // Calendar selected day
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string | null>(null);

  // AI search
  const [aiQuery, setAiQuery] = useState("");
  const [aiResults, setAiResults] = useState<ContentItem[]>([]);
  const [aiFilters, setAiFilters] = useState({ track: "all", difficulty: "all" });
  const [aiLoading, setAiLoading] = useState(false);

  // Content filters
  const [contentFilters, setContentFilters] = useState({ track: "all", difficulty: "all", search: "" });

  // Reviews
  const reviewSchedule = useMemo(() => generateReviewSchedule(sortSessions(sessions)), [sessions]);
  const todayReviews = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return reviewSchedule.filter((r) => r.reviewDates.some((d) => d.date === today && !d.completed));
  }, [reviewSchedule]);

  // Sorted sessions
  const sortedSessions = useMemo(() => sortSessions(sessions), [sessions]);

  // Nav items with badge counts
  const navItems = useMemo(() => 
    createNavItems(bookmarks.length, todayReviews.length, planItems.filter((p) => !p.completed).length),
    [bookmarks.length, todayReviews.length, planItems]
  );

  // Global search results
  const searchResults = useMemo(() => 
    globalSearch(globalSearchQuery, tracks, sortedSessions, contentDatabase),
    [globalSearchQuery, tracks, sortedSessions]
  );

  // Close global search on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (globalSearchRef.current && !globalSearchRef.current.contains(e.target as Node)) {
        setGlobalSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Computed values
  const userData = { name: "João Silva", level: 12, xp: 2450 };
  const totalWeeklyMinutes = sortedSessions
    .filter((s) => {
      const d = new Date(s.date);
      const now = new Date();
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    })
    .reduce((acc, s) => acc + s.duration, 0);

  // Calendar data
  const [calendarYear, calendarMonthNum] = calendarMonth.split("-").map(Number);
  const calendarDays = useMemo(() => getMonthDays(calendarYear, calendarMonthNum - 1), [calendarYear, calendarMonthNum]);
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, Session[]>();
    sortedSessions.forEach((s) => {
      const list = map.get(s.date) || [];
      list.push(s);
      map.set(s.date, list);
    });
    return map;
  }, [sortedSessions]);

  // ============ ACTIONS ============

  const navigate = (viewId: ViewId) => {
    setActiveView(viewId);
    setMobileSidebarOpen(false);
  };

  const handleGlobalSearchSelect = (result: SearchResult) => {
    navigate(result.viewId);
    setGlobalSearchQuery("");
    setGlobalSearchOpen(false);
    // TODO: Highlight selected item in view
  };

  const resetDemo = () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setSessions(defaultSessions);
    setTracks(defaultTracks);
    setGoals(defaultGoals);
    setStreak(12);
    setBookmarks([]);
    setPlanItems([]);
    addToast({ message: "Dados resetados!", type: "success" });
  };

  const openNewSessionModal = (prefilledDate?: string) => {
    setEditingSession(null);
    setSessionForm({
      trackId: "", theme: "", duration: "", type: "Estudo", result: "", notes: "",
      date: prefilledDate || new Date().toISOString().split("T")[0],
    });
    setFormErrors({});
    setSessionModalOpen(true);
  };

  const validateSessionForm = () => {
    const errors: Record<string, string> = {};
    if (!sessionForm.trackId) errors.trackId = "Selecione uma disciplina";
    if (!sessionForm.theme.trim()) errors.theme = "Informe o tema";
    if (!sessionForm.duration || parseInt(sessionForm.duration) <= 0) errors.duration = "Informe a duração";
    if (!sessionForm.date) errors.date = "Selecione uma data";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveSession = () => {
    if (!validateSessionForm()) return;

    const trackId = parseInt(sessionForm.trackId);
    const duration = parseInt(sessionForm.duration);
    const today = new Date().toISOString().split("T")[0];

    if (editingSession) {
      setSessions((prev) => sortSessions(prev.map((s) => s.id === editingSession.id ? { ...s, ...sessionForm, trackId, duration } : s)));
      addToast({ message: "Sessão atualizada!", type: "success" });
    } else {
      const newSession: Session = {
        id: Date.now().toString(), date: sessionForm.date, createdAt: Date.now(),
        theme: sessionForm.theme, trackId, duration, type: sessionForm.type, result: sessionForm.result, notes: sessionForm.notes,
      };
      setSessions((prev) => sortSessions([newSession, ...prev]));
      
      // Update track progress
      setTracks((prev) => prev.map((t) => {
        if (t.id === trackId) {
          const newProgress = Math.min(100, t.progress + 2);
          return { ...t, progress: newProgress, status: newProgress === 100 ? "Concluída" : "Em andamento",
            milestones: t.milestones.map((m) => ({ ...m, achieved: newProgress >= m.percent })),
          };
        }
        return t;
      }));

      // Update goals if today
      if (sessionForm.date === today) {
        setGoals((prev) => ({ ...prev, completed: Math.min(prev.dailyGoal, prev.completed + duration) }));
      }

      addToast({ message: "Sessão salva!", type: "success" });
    }

    setSessionModalOpen(false);
    setEditingSession(null);
  };

  const toggleBookmark = (content: ContentItem) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.id === content.id);
      if (exists) {
        addToast({ message: "Removido dos salvos", type: "info" });
        return prev.filter((b) => b.id !== content.id);
      } else {
        addToast({ message: "Salvo!", type: "success" });
        return [...prev, { id: content.id, content, savedAt: Date.now() }];
      }
    });
  };

  const addToPlan = (content: ContentItem) => {
    if (planItems.some((p) => p.contentId === content.id)) {
      addToast({ message: "Já está no plano!", type: "info" });
      return;
    }
    setPlanItems((prev) => [...prev, { id: Date.now().toString(), contentId: content.id, addedAt: Date.now(), completed: false }]);
    addToast({ message: "Adicionado ao plano!", type: "success" });
  };

  const removePlanItem = (id: string) => {
    setPlanItems((prev) => prev.filter((p) => p.id !== id));
    addToast({ message: "Removido do plano", type: "info" });
  };

  const togglePlanComplete = (id: string) => {
    setPlanItems((prev) => prev.map((p) => p.id === id ? { ...p, completed: !p.completed } : p));
  };

  const isBookmarked = (id: number) => bookmarks.some((b) => b.id === id);
  const isInPlan = (id: number) => planItems.some((p) => p.contentId === id);

  // AI Search
  const handleAiSearch = useCallback(async () => {
    setAiLoading(true);
    if (aiQuery.trim()) {
      setSearchHistory((prev) => {
        const filtered = prev.filter((h) => h.query !== aiQuery);
        return [{ id: Date.now().toString(), query: aiQuery, timestamp: Date.now() }, ...filtered].slice(0, 8);
      });
    }
    await new Promise((r) => setTimeout(r, 400));
    let results = contentDatabase;
    if (aiQuery.trim()) {
      const q = aiQuery.toLowerCase();
      results = results.filter((c) => c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q) || c.tags.some((t) => t.includes(q)));
    }
    if (aiFilters.track !== "all") results = results.filter((c) => c.track === aiFilters.track);
    if (aiFilters.difficulty !== "all") results = results.filter((c) => c.difficulty === aiFilters.difficulty);
    setAiResults(results);
    setAiLoading(false);
  }, [aiQuery, aiFilters]);

  useEffect(() => {
    if (activeView === "ia") handleAiSearch();
  }, [activeView]);

  // Filtered content for Cursos view
  const filteredContent = useMemo(() => {
    let results = contentDatabase;
    if (contentFilters.search.trim()) {
      const q = contentFilters.search.toLowerCase();
      results = results.filter((c) => c.title.toLowerCase().includes(q) || c.tags.some((t) => t.includes(q)));
    }
    if (contentFilters.track !== "all") results = results.filter((c) => c.track === contentFilters.track);
    if (contentFilters.difficulty !== "all") results = results.filter((c) => c.difficulty === contentFilters.difficulty);
    return results;
  }, [contentFilters]);

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  // ============ RENDER ============

  return (
    <div className="min-h-screen bg-background flex">
      {/* ============ LEFT SIDEBAR ============ */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50 bg-card border-r flex flex-col
          transition-all duration-200 ease-in-out
          ${sidebarCollapsed ? "lg:w-16" : "lg:w-64"}
          ${mobileSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between p-4 border-b ${sidebarCollapsed ? "lg:justify-center" : ""}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg text-card-foreground">StudAI</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 hover:bg-muted rounded-lg text-muted-foreground"
            aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 hover:bg-muted rounded-lg"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.id} className="mb-4">
              {!sidebarCollapsed && (
                <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </p>
              )}
              {navItems.filter((item) => item.section === section.id).map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors relative
                      ${isActive 
                        ? "text-accent bg-accent/10" 
                        : "text-muted-foreground hover:text-card-foreground hover:bg-muted"
                      }
                      ${sidebarCollapsed ? "justify-center px-2" : ""}
                    `}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r" />}
                    <item.icon size={20} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badgeCount && <Badge variant="count">{item.badgeCount}</Badge>}
                      </>
                    )}
                    {sidebarCollapsed && item.badgeCount && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t">
            <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={16} className="text-accent" />
                <span className="text-sm font-semibold text-card-foreground">{streak} dias</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Meta de hoje</span>
                <span>{goals.completed}/{goals.dailyGoal} min</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(100, (goals.completed / goals.dailyGoal) * 100)}%` }} />
              </div>
              <button
                onClick={() => openNewSessionModal()}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                <Plus size={14} />
                Nova sessão
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* ============ MAIN AREA ============ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ============ TOPBAR ============ */}
        <header className="sticky top-0 z-30 bg-card border-b px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>

            {/* Global Search */}
            <div className="relative flex-1 max-w-xl" ref={globalSearchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Buscar trilhas, sessões, conteúdos..."
                value={globalSearchQuery}
                onChange={(e) => { setGlobalSearchQuery(e.target.value); setGlobalSearchOpen(true); }}
                onFocus={() => setGlobalSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {/* Search Dropdown */}
              {globalSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg overflow-hidden z-50">
                  {["track", "session", "content"].map((type) => {
                    const typeResults = searchResults.filter((r) => r.type === type);
                    if (typeResults.length === 0) return null;
                    return (
                      <div key={type}>
                        <p className="px-3 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground bg-muted">
                          {type === "track" ? "Trilhas" : type === "session" ? "Sessões" : "Conteúdos"}
                        </p>
                        {typeResults.map((result) => (
                          <button
                            key={`${result.type}-${result.id}`}
                            onClick={() => handleGlobalSearchSelect(result)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted text-left"
                          >
                            {result.type === "track" && <GraduationCap size={16} className="text-muted-foreground" />}
                            {result.type === "session" && <Clock size={16} className="text-muted-foreground" />}
                            {result.type === "content" && <FileText size={16} className="text-muted-foreground" />}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-card-foreground truncate">{result.title}</p>
                              <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                            </div>
                            <ExternalLink size={14} className="text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => openNewSessionModal()}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                <Plus size={16} />
                Nova sessão
              </button>
            </div>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-card-foreground">{userData.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <Zap size={10} />
                  Nível {userData.level}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                {userData.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* ============ CONTENT ============ */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* ====== DASHBOARD VIEW ====== */}
          {activeView === "dashboard" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">Olá, {userData.name}! 👋</h1>
                  <p className="text-muted-foreground">Continue sua jornada de aprendizado</p>
                </div>
                {demoMode && (
                  <button onClick={resetDemo} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-muted rounded-lg hover:bg-secondary">
                    <RotateCcw size={12} />
                    Reset Demo
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Flame size={24} className="text-accent" />} value={`${streak}`} label="Dias de streak" sublabel={`Meta: ${goals.dailyGoal}min/dia`} />
                <StatCard icon={<Clock size={24} className="text-primary" />} value={`${Math.round(totalWeeklyMinutes / 60)}h`} label="Esta semana" sublabel={`${Math.round((totalWeeklyMinutes / goals.weeklyGoal) * 100)}% da meta`} />
                <StatCard icon={<CheckCircle2 size={24} className="text-accent" />} value={tracks.filter((t) => t.status === "Concluída").length.toString()} label="Trilhas concluídas" sublabel={`de ${tracks.length}`} />
                <StatCard icon={<BookOpen size={24} className="text-primary" />} value={sortedSessions.length.toString()} label="Sessões" sublabel="registradas" />
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: GraduationCap, label: "Trilhas", view: "trilhas" as ViewId },
                  { icon: CalendarDays, label: "Calendário", view: "calendario" as ViewId },
                  { icon: RefreshCw, label: `Revisões (${todayReviews.length})`, view: "revisoes" as ViewId },
                  { icon: Bot, label: "Busca IA", view: "ia" as ViewId },
                ].map((item) => (
                  <button
                    key={item.view}
                    onClick={() => navigate(item.view)}
                    className="flex items-center gap-3 p-4 bg-card border rounded-xl hover:border-accent/50 transition-colors"
                  >
                    <item.icon size={24} className="text-accent" />
                    <span className="font-medium text-card-foreground">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Recent Sessions */}
              <div className="bg-card border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-card-foreground">Atividade Recente</h2>
                  <button onClick={() => navigate("sessoes")} className="text-sm text-accent hover:underline">Ver todas</button>
                </div>
                {sortedSessions.length === 0 ? (
                  <EmptyState icon={Clock} title="Nenhuma sessão" description="Registre sua primeira sessão de estudo!" />
                ) : (
                  <div className="space-y-2">
                    {sortedSessions.slice(0, 5).map((s) => {
                      const track = tracks.find((t) => t.id === s.trackId);
                      return (
                        <div key={s.id} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-card-foreground">{s.theme}</p>
                            <p className="text-xs text-muted-foreground">{track?.name} • {s.duration}min</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{formatDateBR(s.date)}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====== TRILHAS VIEW ====== */}
          {activeView === "trilhas" && (
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-2xl font-bold text-card-foreground">Trilhas de Aprendizado</h1>
              <div className="space-y-4">
                {tracks.map((track) => (
                  <div key={track.id} className="bg-card border rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-3 mb-2">
                          <BookOpen className="text-primary" size={20} />
                          <span className="font-semibold text-card-foreground">{track.name}</span>
                          <Badge variant={track.status === "Concluída" ? "accent" : "muted"}>{track.status}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden max-w-xs">
                            <div className="h-full bg-accent rounded-full" style={{ width: `${track.progress}%` }} />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">{track.progress}%</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {track.skills.map((skill) => <Badge key={skill} variant="outline">{skill}</Badge>)}
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                        Continuar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====== CURSOS/CONTEÚDOS VIEW ====== */}
          {activeView === "cursos" && (
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-2xl font-bold text-card-foreground">Conteúdos</h1>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-3 p-4 bg-card border rounded-xl">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={contentFilters.search}
                    onChange={(e) => setContentFilters((f) => ({ ...f, search: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm"
                  />
                </div>
                <select
                  value={contentFilters.track}
                  onChange={(e) => setContentFilters((f) => ({ ...f, track: e.target.value }))}
                  className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                >
                  <option value="all">Todas trilhas</option>
                  {tracks.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                <select
                  value={contentFilters.difficulty}
                  onChange={(e) => setContentFilters((f) => ({ ...f, difficulty: e.target.value }))}
                  className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                >
                  <option value="all">Dificuldade</option>
                  <option value="Fácil">Fácil</option>
                  <option value="Médio">Médio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>

              {/* Content List */}
              <div className="grid gap-4">
                {filteredContent.length === 0 ? (
                  <EmptyState icon={FolderOpen} title="Nenhum conteúdo encontrado" description="Ajuste os filtros." />
                ) : (
                  filteredContent.map((content) => (
                    <div key={content.id} className="bg-card border rounded-xl p-4 hover:border-accent/30 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-card-foreground mb-1">{content.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{content.summary}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge>{content.track}</Badge>
                            <Badge variant="outline">{content.difficulty}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setContentDetailModal(content)}
                            className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg"
                          >
                            Estudar
                          </button>
                          <button
                            onClick={() => addToPlan(content)}
                            disabled={isInPlan(content.id)}
                            className="px-3 py-1.5 text-xs font-medium bg-secondary text-card-foreground rounded-lg disabled:opacity-50"
                          >
                            {isInPlan(content.id) ? "No plano" : "+ Plano"}
                          </button>
                          <button
                            onClick={() => toggleBookmark(content)}
                            className="p-1.5 hover:bg-muted rounded-lg"
                            aria-label={isBookmarked(content.id) ? "Remover" : "Salvar"}
                          >
                            {isBookmarked(content.id) ? <BookmarkCheck size={16} className="text-accent" /> : <Bookmark size={16} className="text-muted-foreground" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ====== SESSÕES VIEW ====== */}
          {activeView === "sessoes" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-card-foreground">Sessões de Estudo</h1>
                <button
                  onClick={() => openNewSessionModal()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg"
                >
                  <Plus size={16} />
                  Nova sessão
                </button>
              </div>

              {sortedSessions.length === 0 ? (
                <EmptyState icon={Clock} title="Nenhuma sessão" description="Registre sua primeira sessão!" />
              ) : (
                <div className="space-y-3">
                  {sortedSessions.map((session) => {
                    const track = tracks.find((t) => t.id === session.trackId);
                    return (
                      <div key={session.id} className="bg-card border rounded-xl p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-card-foreground">{session.theme}</p>
                            <p className="text-sm text-muted-foreground">{track?.name} • {session.type} • {session.duration}min</p>
                            {session.result && <span className="mt-2"><Badge>{session.result}</Badge></span>}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-card-foreground">{formatDateBR(session.date)}</p>
                            <p className="text-xs text-muted-foreground">{formatFullDateBR(session.date)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ====== CALENDÁRIO VIEW ====== */}
          {activeView === "calendario" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-card-foreground">Calendário</h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const d = new Date(calendarYear, calendarMonthNum - 2, 1);
                      setCalendarMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
                    }}
                    className="p-2 hover:bg-muted rounded-lg"
                    aria-label="Mês anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="font-medium text-card-foreground min-w-[120px] text-center">
                    {new Date(calendarYear, calendarMonthNum - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                  </span>
                  <button
                    onClick={() => {
                      const d = new Date(calendarYear, calendarMonthNum, 1);
                      setCalendarMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
                    }}
                    className="p-2 hover:bg-muted rounded-lg"
                    aria-label="Próximo mês"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="bg-card border rounded-xl p-4">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-2">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    const dateStr = day.toISOString().split("T")[0];
                    const isCurrentMonth = day.getMonth() === calendarMonthNum - 1;
                    const isToday = dateStr === new Date().toISOString().split("T")[0];
                    const daySessions = sessionsByDate.get(dateStr) || [];
                    const hasSession = daySessions.length > 0;

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedCalendarDay(dateStr)}
                        className={`
                          aspect-square p-1 rounded-lg text-sm relative flex flex-col items-center justify-center
                          ${isCurrentMonth ? "text-card-foreground" : "text-muted-foreground/50"}
                          ${isToday ? "ring-2 ring-accent" : ""}
                          ${selectedCalendarDay === dateStr ? "bg-accent/20" : "hover:bg-muted"}
                        `}
                      >
                        <span className="font-medium">{day.getDate()}</span>
                        {hasSession && (
                          <div className="w-1.5 h-1.5 rounded-full bg-accent absolute bottom-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected day details */}
              {selectedCalendarDay && (
                <div className="bg-card border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-card-foreground">
                      {new Date(selectedCalendarDay + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
                    </h2>
                    <button
                      onClick={() => openNewSessionModal(selectedCalendarDay)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg"
                    >
                      <Plus size={14} />
                      Adicionar sessão
                    </button>
                  </div>
                  {(sessionsByDate.get(selectedCalendarDay) || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma sessão neste dia.</p>
                  ) : (
                    <div className="space-y-2">
                      {(sessionsByDate.get(selectedCalendarDay) || []).map((s) => {
                        const track = tracks.find((t) => t.id === s.trackId);
                        return (
                          <div key={s.id} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-card-foreground">{s.theme}</p>
                              <p className="text-xs text-muted-foreground">{track?.name} • {s.duration}min</p>
                            </div>
                            {s.result && <Badge>{s.result}</Badge>}
                          </div>
                        );
                      })}
                      <p className="text-xs text-muted-foreground pt-2">
                        Total: {(sessionsByDate.get(selectedCalendarDay) || []).reduce((a, s) => a + s.duration, 0)} minutos
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ====== METAS VIEW ====== */}
          {activeView === "metas" && (
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-2xl font-bold text-card-foreground">Metas e Plano</h1>

              {/* Goals Config */}
              <div className="bg-card border rounded-xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Configurar Metas</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">Meta diária (min)</label>
                    <select
                      value={goals.dailyGoal}
                      onChange={(e) => setGoals((g) => ({ ...g, dailyGoal: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg"
                    >
                      {[30, 45, 60, 90, 120].map((v) => <option key={v} value={v}>{v} min</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">Meta semanal (horas)</label>
                    <select
                      value={goals.weeklyGoal}
                      onChange={(e) => setGoals((g) => ({ ...g, weeklyGoal: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg"
                    >
                      {[180, 300, 420, 600].map((v) => <option key={v} value={v}>{v / 60}h</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Weekly Plan */}
              <div className="bg-card border rounded-xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Plano da Semana</h2>
                <div className="grid grid-cols-7 gap-2">
                  {goals.weeklyPlan.map((day, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xs font-medium text-muted-foreground mb-2">{day.day}</p>
                      <div className="h-24 bg-muted rounded-lg relative overflow-hidden">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-accent/60 transition-all"
                          style={{ height: `${day.target > 0 ? (day.completed / day.target) * 100 : 0}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium text-card-foreground">{day.completed}/{day.target}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan Items */}
              <div className="bg-card border rounded-xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Meu Plano de Estudo ({planItems.length})</h2>
                {planItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Adicione conteúdos ao seu plano na aba Conteúdos.</p>
                ) : (
                  <div className="space-y-2">
                    {planItems.map((item) => {
                      const content = contentDatabase.find((c) => c.id === item.contentId);
                      if (!content) return null;
                      return (
                        <div key={item.id} className={`flex items-center gap-4 p-3 rounded-lg ${item.completed ? "bg-muted" : "bg-secondary/50"}`}>
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => togglePlanComplete(item.id)}
                            className="w-4 h-4 rounded"
                          />
                          <div className="flex-1">
                            <p className={`font-medium ${item.completed ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                              {content.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{content.track}</p>
                          </div>
                          <button onClick={() => removePlanItem(item.id)} className="p-1 hover:bg-muted rounded">
                            <Trash2 size={14} className="text-muted-foreground" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====== REVISÕES VIEW ====== */}
          {activeView === "revisoes" && (
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-2xl font-bold text-card-foreground">Revisões (Spaced Repetition)</h1>
              <p className="text-muted-foreground">Revisões sugeridas com base nas suas sessões recentes (D+1, D+3, D+7).</p>

              {/* Today's Reviews */}
              <div className="bg-card border rounded-xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <RefreshCw size={18} className="text-accent" />
                  Revisar Hoje ({todayReviews.length})
                </h2>
                {todayReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma revisão pendente para hoje! 🎉</p>
                ) : (
                  <div className="space-y-2">
                    {todayReviews.map((review) => {
                      const track = tracks.find((t) => t.id === review.trackId);
                      return (
                        <div key={review.id} className="flex items-center gap-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-card-foreground">{review.theme}</p>
                            <p className="text-xs text-muted-foreground">{track?.name} • Estudado em {formatDateBR(review.originalDate)}</p>
                          </div>
                          <button className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg">
                            Revisar
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* All Reviews */}
              <div className="bg-card border rounded-xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Todas as Revisões Programadas</h2>
                {reviewSchedule.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Estude mais para gerar revisões automáticas.</p>
                ) : (
                  <div className="space-y-3">
                    {reviewSchedule.slice(0, 10).map((review) => {
                      const track = tracks.find((t) => t.id === review.trackId);
                      return (
                        <div key={review.id} className="p-3 bg-secondary/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-card-foreground">{review.theme}</p>
                            <Badge variant="muted">{track?.name}</Badge>
                          </div>
                          <div className="flex gap-2">
                            {review.reviewDates.map((rd, i) => (
                              <span
                                key={i}
                                className={`text-xs px-2 py-0.5 rounded ${rd.completed ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}
                              >
                                D+{i === 0 ? 1 : i === 1 ? 3 : 7}: {formatDateBR(rd.date)}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====== IA VIEW ====== */}
          {activeView === "ia" && (
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-2xl font-bold text-card-foreground flex items-center gap-2">
                <Sparkles size={24} className="text-accent" />
                Busca Inteligente
              </h1>

              {/* Search */}
              <div className="bg-card border rounded-xl p-5">
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      placeholder="Pergunte ou busque um tema..."
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                      className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleAiSearch}
                    disabled={aiLoading}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
                  >
                    {aiLoading ? <Loader2 size={18} className="animate-spin" /> : "Buscar"}
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  <select
                    value={aiFilters.track}
                    onChange={(e) => setAiFilters((f) => ({ ...f, track: e.target.value }))}
                    className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm"
                  >
                    <option value="all">Todas trilhas</option>
                    {tracks.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                  <select
                    value={aiFilters.difficulty}
                    onChange={(e) => setAiFilters((f) => ({ ...f, difficulty: e.target.value }))}
                    className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm"
                  >
                    <option value="all">Dificuldade</option>
                    <option value="Fácil">Fácil</option>
                    <option value="Médio">Médio</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>

                {/* History */}
                {searchHistory.length > 0 && !aiQuery && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <History size={12} />
                      Buscas recentes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.slice(0, 5).map((h) => (
                        <button key={h.id} onClick={() => setAiQuery(h.query)} className="px-2 py-1 text-xs bg-muted rounded hover:bg-secondary">
                          {h.query}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Results */}
              <div className="bg-card border rounded-xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">{aiResults.length} resultados</h2>
                {aiLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-accent" />
                  </div>
                ) : aiResults.length === 0 ? (
                  <EmptyState icon={Search} title="Nenhum resultado" description="Tente outros termos." />
                ) : (
                  <div className="space-y-3">
                    {aiResults.map((content) => (
                      <div key={content.id} className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-card-foreground mb-1">{content.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{content.summary}</p>
                          <div className="flex gap-2">
                            <Badge>{content.track}</Badge>
                            <Badge variant="outline">{content.difficulty}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => toggleBookmark(content)} className="p-2 hover:bg-muted rounded-lg">
                            {isBookmarked(content.id) ? <BookmarkCheck size={16} className="text-accent" /> : <Bookmark size={16} className="text-muted-foreground" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====== SALVOS VIEW ====== */}
          {activeView === "salvos" && (
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-2xl font-bold text-card-foreground flex items-center gap-2">
                <Star size={24} className="text-accent" />
                Salvos ({bookmarks.length})
              </h1>

              {bookmarks.length === 0 ? (
                <EmptyState icon={Bookmark} title="Nada salvo ainda" description="Salve conteúdos para acessar depois." />
              ) : (
                <div className="grid gap-4">
                  {bookmarks.map((b) => (
                    <div key={b.id} className="bg-card border rounded-xl p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-card-foreground mb-1">{b.content.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{b.content.summary}</p>
                          <div className="flex gap-2">
                            <Badge>{b.content.track}</Badge>
                            <Badge variant="outline">{b.content.difficulty}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => addToPlan(b.content)}
                            disabled={isInPlan(b.id)}
                            className="px-3 py-1.5 text-xs font-medium bg-secondary rounded-lg disabled:opacity-50"
                          >
                            + Plano
                          </button>
                          <button onClick={() => toggleBookmark(b.content)} className="p-2 hover:bg-muted rounded-lg">
                            <Trash2 size={14} className="text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====== CONFIG VIEW ====== */}
          {activeView === "config" && (
            <div className="space-y-6 max-w-2xl">
              <h1 className="text-2xl font-bold text-card-foreground">Configurações</h1>

              <div className="bg-card border rounded-xl p-5 space-y-4">
                <h2 className="font-semibold text-card-foreground">Perfil</h2>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Nome</label>
                  <input
                    type="text"
                    value={userData.name}
                    disabled
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-muted-foreground"
                  />
                </div>
              </div>

              <div className="bg-card border rounded-xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Demo</h2>
                <button
                  onClick={resetDemo}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20"
                >
                  <RotateCcw size={14} />
                  Resetar todos os dados
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ============ MODALS ============ */}

      {/* Session Modal */}
      <Modal
        open={sessionModalOpen}
        onClose={() => { setSessionModalOpen(false); setEditingSession(null); }}
        title={editingSession ? "Editar Sessão" : "Nova Sessão"}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="session-date" className="block text-sm font-medium text-card-foreground mb-1">Data *</label>
            <input
              id="session-date"
              type="date"
              value={sessionForm.date}
              onChange={(e) => setSessionForm((f) => ({ ...f, date: e.target.value }))}
              className={`w-full px-3 py-2 bg-secondary border rounded-lg ${formErrors.date ? "border-destructive" : "border-border"}`}
            />
            {formErrors.date && <p className="text-xs text-destructive mt-1">{formErrors.date}</p>}
          </div>

          <div>
            <label htmlFor="session-track" className="block text-sm font-medium text-card-foreground mb-1">Disciplina *</label>
            <select
              id="session-track"
              value={sessionForm.trackId}
              onChange={(e) => setSessionForm((f) => ({ ...f, trackId: e.target.value }))}
              className={`w-full px-3 py-2 bg-secondary border rounded-lg ${formErrors.trackId ? "border-destructive" : "border-border"}`}
            >
              <option value="">Selecione...</option>
              {tracks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {formErrors.trackId && <p className="text-xs text-destructive mt-1">{formErrors.trackId}</p>}
          </div>

          <div>
            <label htmlFor="session-theme" className="block text-sm font-medium text-card-foreground mb-1">Tema *</label>
            <input
              id="session-theme"
              type="text"
              value={sessionForm.theme}
              onChange={(e) => setSessionForm((f) => ({ ...f, theme: e.target.value }))}
              placeholder="Ex: Álgebra Linear"
              className={`w-full px-3 py-2 bg-secondary border rounded-lg ${formErrors.theme ? "border-destructive" : "border-border"}`}
            />
            {formErrors.theme && <p className="text-xs text-destructive mt-1">{formErrors.theme}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="session-duration" className="block text-sm font-medium text-card-foreground mb-1">Duração (min) *</label>
              <input
                id="session-duration"
                type="number"
                value={sessionForm.duration}
                onChange={(e) => setSessionForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="30"
                min="1"
                className={`w-full px-3 py-2 bg-secondary border rounded-lg ${formErrors.duration ? "border-destructive" : "border-border"}`}
              />
              {formErrors.duration && <p className="text-xs text-destructive mt-1">{formErrors.duration}</p>}
            </div>
            <div>
              <label htmlFor="session-type" className="block text-sm font-medium text-card-foreground mb-1">Tipo</label>
              <select
                id="session-type"
                value={sessionForm.type}
                onChange={(e) => setSessionForm((f) => ({ ...f, type: e.target.value as Session["type"] }))}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg"
              >
                <option value="Estudo">Estudo</option>
                <option value="Revisão">Revisão</option>
                <option value="Simulado">Simulado</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="session-result" className="block text-sm font-medium text-card-foreground mb-1">Resultado (opcional)</label>
            <input
              id="session-result"
              type="text"
              value={sessionForm.result}
              onChange={(e) => setSessionForm((f) => ({ ...f, result: e.target.value }))}
              placeholder="Ex: Quiz 8/10"
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="session-notes" className="block text-sm font-medium text-card-foreground mb-1">Notas (opcional)</label>
            <textarea
              id="session-notes"
              value={sessionForm.notes}
              onChange={(e) => setSessionForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Anotações..."
              rows={2}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => { setSessionModalOpen(false); setEditingSession(null); }} className="flex-1 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted">
              Cancelar
            </button>
            <button onClick={handleSaveSession} className="flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90">
              {editingSession ? "Atualizar" : "Salvar"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Content Detail Modal */}
      <Modal
        open={!!contentDetailModal}
        onClose={() => setContentDetailModal(null)}
        title={contentDetailModal?.title || "Conteúdo"}
        size="lg"
      >
        {contentDetailModal && (
          <div className="space-y-4">
            <p className="text-muted-foreground">{contentDetailModal.summary}</p>
            <div className="flex flex-wrap gap-2">
              <Badge>{contentDetailModal.track}</Badge>
              <Badge variant="outline">{contentDetailModal.difficulty}</Badge>
              {contentDetailModal.tags.map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
              ))}
            </div>
            <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
              <FileText size={32} className="mx-auto mb-2" />
              <p className="text-sm">Conteúdo completo disponível na versão com backend.</p>
              <p className="text-xs mt-1">// TODO API: Carregar conteúdo do servidor</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { addToPlan(contentDetailModal); setContentDetailModal(null); }}
                disabled={isInPlan(contentDetailModal.id)}
                className="flex-1 px-4 py-2 text-sm bg-secondary rounded-lg disabled:opacity-50"
              >
                {isInPlan(contentDetailModal.id) ? "Já no plano" : "Adicionar ao plano"}
              </button>
              <button
                onClick={() => { toggleBookmark(contentDetailModal); setContentDetailModal(null); }}
                className="flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg"
              >
                {isBookmarked(contentDetailModal.id) ? "Remover dos salvos" : "Salvar"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ============================================================================
// WRAPPER
// ============================================================================

const Index = () => (
  <ToastProvider>
    <Dashboard />
  </ToastProvider>
);

export default Index;
