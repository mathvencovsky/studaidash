import { useState, useEffect, useCallback, useRef, createContext, useContext, useMemo } from "react";
import {
  Search, Flame, Clock, CheckCircle2, Target, BookOpen, Menu, X,
  Plus, TrendingUp, AlertTriangle, Award, Zap, Calendar, Filter,
  Sparkles, RotateCcw, Loader2, ChevronLeft, ChevronRight, Edit3,
  Copy, Trash2, Bookmark, BookmarkCheck, History, Play, Brain,
  Settings, BarChart3, Trophy, Shield, ArrowUpRight, ArrowDownRight,
  LayoutDashboard, GraduationCap, FolderOpen, CalendarDays, ListChecks,
  RefreshCw, Bot, Star, ChevronDown, FileText, ExternalLink, MoreVertical,
  Home, User, LogOut, HelpCircle, Download
} from "lucide-react";

// ============================================================================
// DESIGN TOKENS - Paleta StudAI
// Primária: #1A237E (hsl 234 67% 30%)
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
      <div className="fixed bottom-20 md:bottom-4 right-4 z-[100] space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="p-4 rounded-xl shadow-lg border bg-card animate-in slide-in-from-right-full"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {toast.type === "success" && <CheckCircle2 size={16} className="text-accent" />}
                {toast.type === "error" && <AlertTriangle size={16} className="text-destructive" />}
                {toast.type === "info" && <Sparkles size={16} className="text-accent" />}
                <p className="text-sm font-medium text-card-foreground">{toast.message}</p>
              </div>
              <div className="flex items-center gap-2">
                {toast.action && (
                  <button
                    onClick={() => { toast.action?.onClick(); removeToast(toast.id); }}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    {toast.action.label}
                  </button>
                )}
                <button onClick={() => removeToast(toast.id)} className="text-muted-foreground hover:text-foreground p-1">
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

type ViewId = "dashboard" | "trilhas" | "cursos" | "sessoes" | "calendario" | "metas" | "ia" | "salvos" | "config";

interface NavItem {
  id: ViewId;
  label: string;
  icon: any;
  section: "main" | "tools";
  badgeCount?: number;
}

interface Track {
  id: number;
  name: string;
  progress: number;
  status: "Em andamento" | "Concluída" | "A iniciar";
  skills: string[];
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
// STORAGE HELPERS - Centralized for future API migration
// ============================================================================

const STORAGE_KEYS = {
  sessions: "studai_sessions",
  tracks: "studai_tracks",
  goals: "studai_goals",
  streak: "studai_streak",
  searchHistory: "studai_search_history",
  bookmarks: "studai_bookmarks",
  sidebarCollapsed: "studai_sidebar_collapsed",
  planItems: "studai_plan_items",
  calendarMonth: "studai_calendar_month",
  chartRange: "studai_chart_range",
};

// TODO API: Replace localStorage with API calls
function loadState<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    const parsed = JSON.parse(stored);
    if (parsed === null || parsed === undefined) return defaultValue;
    if (Array.isArray(defaultValue) && !Array.isArray(parsed)) return defaultValue;
    if (typeof defaultValue === 'object' && !Array.isArray(defaultValue) && defaultValue !== null) {
      return { ...defaultValue, ...parsed } as T;
    }
    return parsed;
  } catch {
    return defaultValue;
  }
}

// TODO API: Replace localStorage with API calls
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
  { id: 1, name: "Matemática", progress: 72, status: "Em andamento", skills: ["Álgebra", "Cálculo", "Probabilidade"] },
  { id: 2, name: "Português", progress: 100, status: "Concluída", skills: ["Gramática", "Redação", "Interpretação"] },
  { id: 3, name: "Programação", progress: 45, status: "Em andamento", skills: ["Python", "Lógica", "Estruturas de Dados"] },
  { id: 4, name: "Inglês", progress: 15, status: "Em andamento", skills: ["Gramática", "Vocabulário", "Conversação"] },
  { id: 5, name: "Física", progress: 28, status: "Em andamento", skills: ["Mecânica", "Termodinâmica", "Eletricidade"] },
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
];

// ============================================================================
// NAVIGATION CONFIG
// ============================================================================

const NAV_SECTIONS = [
  { id: "main", label: "Menu" },
  { id: "tools", label: "Ferramentas" },
] as const;

const createNavItems = (bookmarkCount: number, planCount: number): NavItem[] => [
  { id: "dashboard", label: "Início", icon: LayoutDashboard, section: "main" },
  { id: "trilhas", label: "Trilhas", icon: GraduationCap, section: "main" },
  { id: "sessoes", label: "Sessões", icon: Clock, section: "main" },
  { id: "calendario", label: "Calendário", icon: CalendarDays, section: "main" },
  { id: "metas", label: "Metas", icon: Target, section: "main", badgeCount: planCount > 0 ? planCount : undefined },
  { id: "cursos", label: "Conteúdos", icon: FolderOpen, section: "tools" },
  { id: "ia", label: "Busca IA", icon: Bot, section: "tools" },
  { id: "salvos", label: "Salvos", icon: Star, section: "tools", badgeCount: bookmarkCount > 0 ? bookmarkCount : undefined },
  { id: "config", label: "Configurações", icon: Settings, section: "tools" },
];

// Bottom nav for mobile
const BOTTOM_NAV_ITEMS: { id: ViewId; icon: any; label: string }[] = [
  { id: "dashboard", icon: Home, label: "Início" },
  { id: "trilhas", icon: GraduationCap, label: "Trilhas" },
  { id: "sessoes", icon: Clock, label: "Sessões" },
  { id: "ia", icon: Bot, label: "IA" },
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
  
  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push(d);
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  const endPadding = 42 - days.length;
  for (let i = 1; i <= endPadding; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
}

// Safe quiz parsing
function parseQuizResult(result: string): { correct: number; total: number } | null {
  if (!result) return null;
  const match = result.match(/(\d+)\s*\/\s*(\d+)/);
  if (match) {
    return { correct: parseInt(match[1]), total: parseInt(match[2]) };
  }
  return null;
}

// Seeded random for consistent demo data
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
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
  
  (tracks || []).forEach((t) => {
    if (t.name.toLowerCase().includes(q) || (t.skills || []).some((s) => s.toLowerCase().includes(q))) {
      results.push({ type: "track", id: t.id, title: t.name, subtitle: `${t.progress}% concluído`, viewId: "trilhas" });
    }
  });
  
  (sessions || []).slice(0, 20).forEach((s) => {
    if (s.theme.toLowerCase().includes(q)) {
      results.push({ type: "session", id: s.id, title: s.theme, subtitle: `${formatDateBR(s.date)} • ${s.duration}min`, viewId: "sessoes" });
    }
  });
  
  contents.forEach((c) => {
    if (c.title.toLowerCase().includes(q) || c.tags.some((t) => t.includes(q))) {
      results.push({ type: "content", id: c.id, title: c.title, subtitle: c.track, viewId: "cursos" });
    }
  });
  
  return results.slice(0, 8);
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
  <div className={`animate-pulse bg-muted rounded-lg ${className}`} />
);

const EmptyState = ({ icon: Icon, title, description, action }: { icon: any; title: string; description: string; action?: { label: string; onClick: () => void } }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
      <Icon className="text-muted-foreground" size={28} />
    </div>
    <h3 className="font-semibold text-card-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-xs mb-4">{description}</p>
    {action && (
      <button onClick={action.onClick} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90">
        {action.label}
      </button>
    )}
  </div>
);

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "accent" | "muted" | "outline" | "count" }) => {
  const styles = {
    default: "bg-accent/10 text-accent",
    accent: "bg-accent text-accent-foreground",
    muted: "bg-muted text-muted-foreground",
    outline: "border border-border text-muted-foreground bg-transparent",
    count: "bg-accent text-accent-foreground min-w-[18px] h-[18px] text-[10px] flex items-center justify-center rounded-full px-1",
  };
  return <span className={`px-2 py-0.5 text-xs rounded-md font-medium inline-flex items-center ${styles[variant]}`}>{children}</span>;
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-card rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto border`}>
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-card z-10">
          <h2 className="font-semibold text-lg text-card-foreground">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
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
  <div className="bg-card rounded-2xl border p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend.positive ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
          {trend.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend.value)}%
        </div>
      )}
    </div>
    <p className="text-2xl font-bold text-card-foreground mb-1">{value}</p>
    <p className="text-sm font-medium text-card-foreground">{label}</p>
    <p className="text-xs text-muted-foreground">{sublabel}</p>
  </div>
);

const Dropdown = ({ trigger, children, align = "right" }: { trigger: React.ReactNode; children: React.ReactNode; align?: "left" | "right" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className={`absolute top-full mt-2 ${align === "right" ? "right-0" : "left-0"} bg-card border rounded-xl shadow-lg py-1 min-w-[180px] z-50`}>
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ icon: Icon, label, onClick, danger }: { icon?: any; label: string; onClick: () => void; danger?: boolean }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors ${danger ? "text-destructive" : "text-card-foreground"}`}
  >
    {Icon && <Icon size={16} />}
    {label}
  </button>
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
  const [chartRange, setChartRange] = usePersistedState<number>(STORAGE_KEYS.chartRange, 7);

  // UI state
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
  const [deleteConfirmSession, setDeleteConfirmSession] = useState<Session | null>(null);

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

  // Session filters
  const [sessionFilters, setSessionFilters] = useState({ track: "all", type: "all", search: "" });

  // Profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);

  // Sorted sessions
  const sortedSessions = useMemo(() => sortSessions(sessions || []), [sessions]);

  // Nav items with badge counts
  const navItems = useMemo(() => 
    createNavItems((bookmarks || []).length, (planItems || []).filter((p) => !p.completed).length),
    [bookmarks, planItems]
  );

  // Global search results
  const searchResults = useMemo(() => 
    globalSearch(globalSearchQuery, tracks || [], sortedSessions || [], contentDatabase),
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
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Computed values
  const userData = { name: "João Silva", level: 12, plan: "Pro" };
  
  const totalWeeklyMinutes = useMemo(() => {
    return (sortedSessions || [])
      .filter((s) => {
        const d = new Date(s.date);
        const now = new Date();
        const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      })
      .reduce((acc, s) => acc + s.duration, 0);
  }, [sortedSessions]);

  // Chart data with real dates
  const chartData = useMemo(() => {
    const data: { date: string; label: string; minutes: number }[] = [];
    const today = new Date();
    
    for (let i = chartRange - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayMinutes = (sortedSessions || [])
        .filter((s) => s.date === dateStr)
        .reduce((acc, s) => acc + s.duration, 0);
      data.push({
        date: dateStr,
        label: formatDateBR(dateStr),
        minutes: dayMinutes,
      });
    }
    return data;
  }, [sortedSessions, chartRange]);

  const chartStats = useMemo(() => {
    const total = chartData.reduce((a, d) => a + d.minutes, 0);
    const avg = Math.round(total / chartData.length);
    const best = chartData.reduce((max, d) => d.minutes > max.minutes ? d : max, chartData[0]);
    return { total, avg, best };
  }, [chartData]);

  const maxChartValue = Math.max(...chartData.map((d) => d.minutes), goals.dailyGoal);

  // Calendar data
  const [calendarYear, calendarMonthNum] = calendarMonth.split("-").map(Number);
  const calendarDays = useMemo(() => getMonthDays(calendarYear, calendarMonthNum - 1), [calendarYear, calendarMonthNum]);
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, Session[]>();
    (sortedSessions || []).forEach((s) => {
      const list = map.get(s.date) || [];
      list.push(s);
      map.set(s.date, list);
    });
    return map;
  }, [sortedSessions]);

  // Filtered sessions for Sessões view
  const filteredSessions = useMemo(() => {
    let results = sortedSessions;
    if (sessionFilters.track !== "all") {
      results = results.filter((s) => s.trackId === parseInt(sessionFilters.track));
    }
    if (sessionFilters.type !== "all") {
      results = results.filter((s) => s.type === sessionFilters.type);
    }
    if (sessionFilters.search.trim()) {
      const q = sessionFilters.search.toLowerCase();
      results = results.filter((s) => s.theme.toLowerCase().includes(q));
    }
    return results;
  }, [sortedSessions, sessionFilters]);

  // ============ ACTIONS ============

  const navigate = (viewId: ViewId) => {
    setActiveView(viewId);
    setMobileSidebarOpen(false);
  };

  const handleGlobalSearchSelect = (result: SearchResult) => {
    navigate(result.viewId);
    setGlobalSearchQuery("");
    setGlobalSearchOpen(false);
  };

  const resetDemo = () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setSessions(defaultSessions);
    setTracks(defaultTracks);
    setGoals(defaultGoals);
    setStreak(12);
    setBookmarks([]);
    setPlanItems([]);
    addToast({ message: "Dados restaurados", type: "success" });
  };

  const generateDemoData = () => {
    const random = seededRandom(42);
    const newSessions: Session[] = [];
    const themes = ["Álgebra", "Cálculo", "Gramática", "Redação", "Python", "Inglês", "Física", "Funções", "Vetores", "Probabilidade"];
    const types: Session["type"][] = ["Estudo", "Revisão", "Simulado"];
    
    for (let i = 0; i < 60; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const shouldHaveSession = random() > 0.3;
      if (shouldHaveSession) {
        const sessionsToday = Math.floor(random() * 2) + 1;
        for (let j = 0; j < sessionsToday; j++) {
          newSessions.push({
            id: `demo_${i}_${j}`,
            date: d.toISOString().split("T")[0],
            createdAt: d.getTime() - j * 3600000,
            theme: themes[Math.floor(random() * themes.length)],
            trackId: Math.floor(random() * 5) + 1,
            duration: Math.floor(random() * 60) + 15,
            type: types[Math.floor(random() * types.length)],
            result: random() > 0.5 ? `Quiz ${Math.floor(random() * 4) + 6}/10` : "",
            notes: "",
          });
        }
      }
    }
    setSessions(sortSessions(newSessions));
    addToast({ message: "60 dias de dados gerados", type: "success" });
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

  const openEditSessionModal = (session: Session) => {
    setEditingSession(session);
    setSessionForm({
      trackId: session.trackId.toString(),
      theme: session.theme,
      duration: session.duration.toString(),
      type: session.type,
      result: session.result,
      notes: session.notes,
      date: session.date,
    });
    setFormErrors({});
    setSessionModalOpen(true);
  };

  const validateSessionForm = () => {
    const errors: Record<string, string> = {};
    if (!sessionForm.trackId) errors.trackId = "Selecione uma disciplina";
    if (!sessionForm.theme.trim()) errors.theme = "Digite o tema";
    if (!sessionForm.duration || parseInt(sessionForm.duration) < 1) errors.duration = "Duração inválida";
    if (!sessionForm.date) errors.date = "Selecione a data";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveSession = () => {
    if (!validateSessionForm()) return;

    const trackId = parseInt(sessionForm.trackId);
    const duration = parseInt(sessionForm.duration);
    const today = new Date().toISOString().split("T")[0];

    if (editingSession) {
      setSessions((prev) => sortSessions((prev || []).map((s) => s.id === editingSession.id ? { ...s, ...sessionForm, trackId, duration } : s)));
      addToast({ message: "Sessão atualizada", type: "success" });
    } else {
      const newSession: Session = {
        id: Date.now().toString(), date: sessionForm.date, createdAt: Date.now(),
        theme: sessionForm.theme, trackId, duration, type: sessionForm.type, result: sessionForm.result, notes: sessionForm.notes,
      };
      setSessions((prev) => sortSessions([newSession, ...(prev || [])]));
      
      // Update track progress
      setTracks((prev) => (prev || []).map((t) => {
        if (t.id === trackId) {
          const newProgress = Math.min(100, t.progress + 2);
          return { ...t, progress: newProgress, status: newProgress === 100 ? "Concluída" : "Em andamento" };
        }
        return t;
      }));

      // Update goals if today
      if (sessionForm.date === today) {
        setGoals((prev) => ({ ...prev, completed: Math.min(prev.dailyGoal, prev.completed + duration) }));
      }

      addToast({ message: "Sessão registrada", type: "success" });
    }

    setSessionModalOpen(false);
    setEditingSession(null);
  };

  const handleDeleteSession = (session: Session) => {
    const deletedSession = session;
    setSessions((prev) => (prev || []).filter((s) => s.id !== session.id));
    setDeleteConfirmSession(null);
    
    addToast({
      message: "Sessão removida",
      type: "info",
      action: {
        label: "Desfazer",
        onClick: () => {
          setSessions((prev) => sortSessions([deletedSession, ...(prev || [])]));
        },
      },
    });
  };

  const toggleBookmark = (content: ContentItem) => {
    setBookmarks((prev) => {
      const exists = (prev || []).find((b) => b.id === content.id);
      if (exists) {
        addToast({ message: "Removido dos salvos", type: "info" });
        return (prev || []).filter((b) => b.id !== content.id);
      } else {
        addToast({ message: "Salvo", type: "success" });
        return [...(prev || []), { id: content.id, content, savedAt: Date.now() }];
      }
    });
  };

  const addToPlan = (content: ContentItem) => {
    if ((planItems || []).some((p) => p.contentId === content.id)) {
      addToast({ message: "Já está no plano", type: "info" });
      return;
    }
    setPlanItems((prev) => [...(prev || []), { id: Date.now().toString(), contentId: content.id, addedAt: Date.now(), completed: false }]);
    addToast({ message: "Adicionado ao plano", type: "success" });
  };

  const removePlanItem = (id: string) => {
    setPlanItems((prev) => (prev || []).filter((p) => p.id !== id));
  };

  const togglePlanComplete = (id: string) => {
    setPlanItems((prev) => (prev || []).map((p) => p.id === id ? { ...p, completed: !p.completed } : p));
  };

  const isBookmarked = (id: number) => (bookmarks || []).some((b) => b.id === id);
  const isInPlan = (id: number) => (planItems || []).some((p) => p.contentId === id);

  // AI Search
  const handleAiSearch = useCallback(async () => {
    setAiLoading(true);
    if (aiQuery.trim()) {
      setSearchHistory((prev) => {
        const filtered = (prev || []).filter((h) => h.query !== aiQuery);
        return [{ id: Date.now().toString(), query: aiQuery, timestamp: Date.now() }, ...filtered].slice(0, 8);
      });
    }
    // TODO API: Replace with real AI search
    await new Promise((r) => setTimeout(r, 300));
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Brain size={24} className="text-white" />
          </div>
          <Loader2 size={24} className="animate-spin text-accent" />
        </div>
      </div>
    );
  }

  // ============ RENDER ============

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* ============ LEFT SIDEBAR (Desktop) ============ */}
      <aside
        className={`
          hidden lg:flex fixed top-0 left-0 h-screen z-40 bg-card border-r flex-col
          transition-all duration-200 ease-in-out
          ${sidebarCollapsed ? "w-[72px]" : "w-64"}
        `}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center h-16 px-4 border-b ${sidebarCollapsed ? "justify-center" : "justify-between"}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Brain size={20} className="text-white" />
              </div>
              <span className="font-bold text-lg text-card-foreground">StudAI</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV_SECTIONS.map((section, sectionIdx) => (
            <div key={section.id} className={sectionIdx > 0 ? "mt-6" : ""}>
              {!sidebarCollapsed && (
                <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {navItems.filter((item) => item.section === section.id).map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative
                        ${isActive 
                          ? "text-accent bg-accent/10" 
                          : "text-muted-foreground hover:text-card-foreground hover:bg-muted"
                        }
                        ${sidebarCollapsed ? "justify-center px-0" : ""}
                      `}
                      aria-label={item.label}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {isActive && !sidebarCollapsed && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-r-full" />}
                      <item.icon size={20} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badgeCount && <Badge variant="count">{item.badgeCount}</Badge>}
                        </>
                      )}
                      {sidebarCollapsed && item.badgeCount && (
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t p-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-xl transition-colors"
            aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!sidebarCollapsed && <span>Recolher</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 z-50 bg-card border-r flex flex-col lg:hidden
          transition-transform duration-200 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-card-foreground">StudAI</span>
          </div>
          <button onClick={() => setMobileSidebarOpen(false)} className="p-2 hover:bg-muted rounded-xl" aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV_SECTIONS.map((section, sectionIdx) => (
            <div key={section.id} className={sectionIdx > 0 ? "mt-6" : ""}>
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </p>
              <div className="space-y-1">
                {navItems.filter((item) => item.section === section.id).map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all
                        ${isActive ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-card-foreground hover:bg-muted"}
                      `}
                    >
                      <item.icon size={20} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badgeCount && <Badge variant="count">{item.badgeCount}</Badge>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* ============ MAIN AREA ============ */}
      <div className={`flex-1 flex flex-col min-w-0 ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-64"}`}>
        {/* ============ TOPBAR ============ */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b h-16 flex items-center px-4 lg:px-6">
          <div className="flex items-center gap-4 w-full">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Abrir menu"
            >
              <Menu size={22} />
            </button>

            {/* Global Search */}
            <div className="relative flex-1 max-w-xl" ref={globalSearchRef}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Buscar trilhas, sessões, conteúdos..."
                value={globalSearchQuery}
                onChange={(e) => { setGlobalSearchQuery(e.target.value); setGlobalSearchOpen(true); }}
                onFocus={() => setGlobalSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              {/* Search Dropdown */}
              {globalSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-xl shadow-lg overflow-hidden z-50">
                  {["track", "session", "content"].map((type) => {
                    const typeResults = searchResults.filter((r) => r.type === type);
                    if (typeResults.length === 0) return null;
                    return (
                      <div key={type}>
                        <p className="px-4 py-2 text-[11px] font-semibold uppercase text-muted-foreground bg-muted/50">
                          {type === "track" ? "Trilhas" : type === "session" ? "Sessões" : "Conteúdos"}
                        </p>
                        {typeResults.map((result) => (
                          <button
                            key={`${result.type}-${result.id}`}
                            onClick={() => handleGlobalSearchSelect(result)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted text-left transition-colors"
                          >
                            {result.type === "track" && <GraduationCap size={16} className="text-muted-foreground" />}
                            {result.type === "session" && <Clock size={16} className="text-muted-foreground" />}
                            {result.type === "content" && <FileText size={16} className="text-muted-foreground" />}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-card-foreground truncate">{result.title}</p>
                              <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => openNewSessionModal()}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
              >
                <Plus size={18} />
                Nova sessão
              </button>
            </div>

            {/* Profile */}
            <Dropdown
              trigger={
                <button className="flex items-center gap-3 p-1.5 hover:bg-muted rounded-xl transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                    {userData.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-card-foreground">{userData.name}</p>
                    <p className="text-xs text-muted-foreground">{userData.plan}</p>
                  </div>
                  <ChevronDown size={16} className="hidden lg:block text-muted-foreground" />
                </button>
              }
            >
              <div className="px-4 py-3 border-b">
                <p className="font-medium text-card-foreground">{userData.name}</p>
                <p className="text-xs text-muted-foreground">Nível {userData.level} • {userData.plan}</p>
              </div>
              <DropdownItem icon={User} label="Perfil" onClick={() => navigate("config")} />
              <DropdownItem icon={Settings} label="Configurações" onClick={() => navigate("config")} />
              <DropdownItem icon={HelpCircle} label="Ajuda" onClick={() => {}} />
              <div className="border-t my-1" />
              <DropdownItem icon={LogOut} label="Sair" onClick={() => {}} />
            </Dropdown>
          </div>
        </header>

        {/* ============ CONTENT ============ */}
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 overflow-y-auto">
          {/* ====== DASHBOARD VIEW ====== */}
          {activeView === "dashboard" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Olá, {userData.name.split(" ")[0]}</h1>
                <p className="text-muted-foreground">Continue de onde parou</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  icon={<Flame size={20} className="text-accent" />} 
                  value={`${streak}`} 
                  label="Dias de streak" 
                  sublabel={`Meta: ${goals?.dailyGoal || 60}min/dia`} 
                />
                <StatCard 
                  icon={<Clock size={20} className="text-primary" />} 
                  value={`${Math.round(totalWeeklyMinutes / 60)}h`} 
                  label="Esta semana" 
                  sublabel={`${Math.round((totalWeeklyMinutes / (goals?.weeklyGoal || 300)) * 100)}% da meta`} 
                  trend={{ value: 12, positive: true }}
                />
                <StatCard 
                  icon={<CheckCircle2 size={20} className="text-accent" />} 
                  value={(tracks || []).filter((t) => t.status === "Concluída").length.toString()} 
                  label="Trilhas concluídas" 
                  sublabel={`de ${(tracks || []).length}`} 
                />
                <StatCard 
                  icon={<BookOpen size={20} className="text-primary" />} 
                  value={(sortedSessions || []).length.toString()} 
                  label="Sessões" 
                  sublabel="registradas" 
                />
              </div>

              {/* Chart + Quick Links */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-card border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <h2 className="font-semibold text-card-foreground">Minutos estudados</h2>
                      <p className="text-sm text-muted-foreground">
                        Total: {chartStats.total}min • Média: {chartStats.avg}min/dia
                      </p>
                    </div>
                    <div className="flex gap-1 bg-muted rounded-lg p-1">
                      {[7, 30].map((days) => (
                        <button
                          key={days}
                          onClick={() => setChartRange(days)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${chartRange === days ? "bg-card shadow-sm text-card-foreground" : "text-muted-foreground hover:text-card-foreground"}`}
                        >
                          {days}d
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Simple bar chart */}
                  <div className="flex items-end gap-1 h-40">
                    {chartData.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center group">
                        <div className="w-full relative flex flex-col justify-end h-32">
                          {/* Goal line */}
                          {goals?.dailyGoal && (
                            <div 
                              className="absolute left-0 right-0 border-t-2 border-dashed border-accent/30"
                              style={{ bottom: `${(goals.dailyGoal / maxChartValue) * 100}%` }}
                            />
                          )}
                          {/* Bar */}
                          <div 
                            className={`w-full rounded-t-md transition-all ${d.minutes > 0 ? "bg-accent" : "bg-muted"} ${d.minutes >= (goals?.dailyGoal || 60) ? "bg-accent" : "bg-accent/60"}`}
                            style={{ height: `${Math.max(2, (d.minutes / maxChartValue) * 100)}%` }}
                          />
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="bg-card border shadow-lg rounded-lg px-3 py-2 text-xs whitespace-nowrap">
                              <p className="font-medium text-card-foreground">{d.minutes}min</p>
                              <p className="text-muted-foreground">{formatFullDateBR(d.date)}</p>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-2">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                  <div className="bg-card border rounded-2xl p-5">
                    <h3 className="font-semibold text-card-foreground mb-4">Ações rápidas</h3>
                    <div className="space-y-2">
                      {[
                        { icon: Plus, label: "Nova sessão", onClick: () => openNewSessionModal() },
                        { icon: GraduationCap, label: "Ver trilhas", onClick: () => navigate("trilhas") },
                        { icon: Bot, label: "Buscar com IA", onClick: () => navigate("ia") },
                      ].map((action, i) => (
                        <button
                          key={i}
                          onClick={action.onClick}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
                        >
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <action.icon size={18} className="text-accent" />
                          </div>
                          <span className="font-medium text-card-foreground">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Daily goal */}
                  <div className="bg-card border rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-card-foreground">Meta de hoje</h3>
                      <span className="text-sm font-medium text-accent">{goals?.completed || 0}/{goals?.dailyGoal || 60}min</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${Math.min(100, ((goals?.completed || 0) / (goals?.dailyGoal || 60)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Sessions */}
              <div className="bg-card border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-card-foreground">Atividade recente</h2>
                  <button onClick={() => navigate("sessoes")} className="text-sm font-medium text-accent hover:underline">Ver todas</button>
                </div>
                {(sortedSessions || []).length === 0 ? (
                  <EmptyState 
                    icon={Clock} 
                    title="Nenhuma sessão registrada" 
                    description="Comece registrando sua primeira sessão de estudo"
                    action={{ label: "Criar sessão", onClick: () => openNewSessionModal() }}
                  />
                ) : (
                  <div className="space-y-2">
                    {(sortedSessions || []).slice(0, 5).map((s) => {
                      const track = (tracks || []).find((t) => t.id === s.trackId);
                      return (
                        <div key={s.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <BookOpen size={18} className="text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-card-foreground truncate">{s.theme}</p>
                            <p className="text-xs text-muted-foreground">{track?.name} • {s.duration}min • {s.type}</p>
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
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Trilhas de aprendizado</h1>
                <p className="text-muted-foreground">Acompanhe seu progresso em cada área</p>
              </div>
              
              <div className="space-y-4">
                {(tracks || []).map((track) => (
                  <div key={track.id} className="bg-card border rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <BookOpen className="text-accent" size={20} />
                          </div>
                          <div>
                            <span className="font-semibold text-card-foreground">{track.name}</span>
                            <Badge variant={track.status === "Concluída" ? "accent" : "muted"}>{track.status}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-xs">
                            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${track.progress}%` }} />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">{track.progress}%</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(track.skills || []).map((skill) => <Badge key={skill} variant="outline">{skill}</Badge>)}
                        </div>
                      </div>
                      <button 
                        onClick={() => openNewSessionModal()}
                        className="px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                      >
                        Estudar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====== SESSÕES VIEW ====== */}
          {activeView === "sessoes" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">Sessões de estudo</h1>
                  <p className="text-muted-foreground">{(filteredSessions || []).length} sessões encontradas</p>
                </div>
                <button
                  onClick={() => openNewSessionModal()}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90"
                >
                  <Plus size={18} />
                  Nova sessão
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 p-4 bg-card border rounded-2xl">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar por tema..."
                    value={sessionFilters.search}
                    onChange={(e) => setSessionFilters((f) => ({ ...f, search: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2.5 bg-secondary border-0 rounded-xl text-sm"
                  />
                </div>
                <select
                  value={sessionFilters.track}
                  onChange={(e) => setSessionFilters((f) => ({ ...f, track: e.target.value }))}
                  className="px-3 py-2.5 bg-secondary border-0 rounded-xl text-sm min-w-[140px]"
                >
                  <option value="all">Todas trilhas</option>
                  {(tracks || []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select
                  value={sessionFilters.type}
                  onChange={(e) => setSessionFilters((f) => ({ ...f, type: e.target.value }))}
                  className="px-3 py-2.5 bg-secondary border-0 rounded-xl text-sm min-w-[120px]"
                >
                  <option value="all">Todos tipos</option>
                  <option value="Estudo">Estudo</option>
                  <option value="Revisão">Revisão</option>
                  <option value="Simulado">Simulado</option>
                </select>
              </div>

              {(filteredSessions || []).length === 0 ? (
                <EmptyState 
                  icon={Clock} 
                  title="Nenhuma sessão encontrada" 
                  description="Ajuste os filtros ou crie uma nova sessão"
                  action={{ label: "Criar sessão", onClick: () => openNewSessionModal() }}
                />
              ) : (
                <div className="space-y-3">
                  {(filteredSessions || []).map((session) => {
                    const track = (tracks || []).find((t) => t.id === session.trackId);
                    return (
                      <div key={session.id} className="bg-card border rounded-2xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                              {session.type === "Estudo" && <BookOpen size={20} className="text-accent" />}
                              {session.type === "Revisão" && <RefreshCw size={20} className="text-accent" />}
                              {session.type === "Simulado" && <Target size={20} className="text-accent" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-card-foreground">{session.theme}</p>
                              <p className="text-sm text-muted-foreground">{track?.name} • {session.type} • {session.duration}min</p>
                              {session.result && (
                                <div className="mt-2">
                                  <Badge>{session.result}</Badge>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right mr-2">
                              <p className="text-sm font-medium text-card-foreground">{formatDateBR(session.date)}</p>
                              <p className="text-xs text-muted-foreground">{formatFullDateBR(session.date)}</p>
                            </div>
                            <Dropdown
                              trigger={
                                <button className="p-2 hover:bg-muted rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Mais opções">
                                  <MoreVertical size={18} className="text-muted-foreground" />
                                </button>
                              }
                            >
                              <DropdownItem icon={Edit3} label="Editar" onClick={() => openEditSessionModal(session)} />
                              <DropdownItem icon={Copy} label="Duplicar" onClick={() => {
                                const newSession = { ...session, id: Date.now().toString(), createdAt: Date.now() };
                                setSessions((prev) => sortSessions([newSession, ...(prev || [])]));
                                addToast({ message: "Sessão duplicada", type: "success" });
                              }} />
                              <div className="border-t my-1" />
                              <DropdownItem icon={Trash2} label="Excluir" onClick={() => setDeleteConfirmSession(session)} danger />
                            </Dropdown>
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
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">Calendário</h1>
                  <p className="text-muted-foreground">Visualize suas sessões por dia</p>
                </div>
                <div className="flex items-center gap-2 bg-card border rounded-xl p-1">
                  <button
                    onClick={() => {
                      const d = new Date(calendarYear, calendarMonthNum - 2, 1);
                      setCalendarMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
                    }}
                    className="p-2 hover:bg-muted rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Mês anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="font-medium text-card-foreground min-w-[140px] text-center capitalize">
                    {new Date(calendarYear, calendarMonthNum - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                  </span>
                  <button
                    onClick={() => {
                      const d = new Date(calendarYear, calendarMonthNum, 1);
                      setCalendarMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
                    }}
                    className="p-2 hover:bg-muted rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Próximo mês"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="bg-card border rounded-2xl p-5">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-3">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
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
                    const isSelected = selectedCalendarDay === dateStr;

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedCalendarDay(dateStr)}
                        className={`
                          aspect-square p-1 rounded-xl text-sm relative flex flex-col items-center justify-center transition-all min-h-[44px]
                          ${!isCurrentMonth ? "text-muted-foreground/50" : "text-card-foreground"}
                          ${isToday ? "ring-2 ring-accent" : ""}
                          ${isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted"}
                        `}
                      >
                        <span className={`font-medium ${isSelected ? "" : ""}`}>{day.getDate()}</span>
                        {hasSession && !isSelected && (
                          <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Day Details */}
              {selectedCalendarDay && (
                <div className="bg-card border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-card-foreground">{formatFullDateBR(selectedCalendarDay)}</h3>
                    <button
                      onClick={() => openNewSessionModal(selectedCalendarDay)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl"
                    >
                      <Plus size={16} />
                      Adicionar
                    </button>
                  </div>
                  {(sessionsByDate.get(selectedCalendarDay) || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma sessão neste dia</p>
                  ) : (
                    <div className="space-y-2">
                      {(sessionsByDate.get(selectedCalendarDay) || []).map((s) => {
                        const track = (tracks || []).find((t) => t.id === s.trackId);
                        return (
                          <div key={s.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
                            <div className="flex-1">
                              <p className="font-medium text-card-foreground">{s.theme}</p>
                              <p className="text-xs text-muted-foreground">{track?.name} • {s.duration}min</p>
                            </div>
                            {s.result && <Badge>{s.result}</Badge>}
                          </div>
                        );
                      })}
                      <p className="text-xs text-muted-foreground pt-2 text-center">
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
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Metas e plano</h1>
                <p className="text-muted-foreground">Configure suas metas de estudo</p>
              </div>

              {/* Goals Config */}
              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Configurar metas</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">Meta diária</label>
                    <select
                      value={goals?.dailyGoal || 60}
                      onChange={(e) => setGoals((g) => ({ ...g, dailyGoal: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2.5 bg-secondary border-0 rounded-xl"
                    >
                      {[30, 45, 60, 90, 120].map((v) => <option key={v} value={v}>{v} minutos</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">Meta semanal</label>
                    <select
                      value={goals?.weeklyGoal || 300}
                      onChange={(e) => setGoals((g) => ({ ...g, weeklyGoal: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2.5 bg-secondary border-0 rounded-xl"
                    >
                      {[180, 300, 420, 600].map((v) => <option key={v} value={v}>{v / 60} horas</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Weekly Plan */}
              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Plano da semana</h2>
                <div className="grid grid-cols-7 gap-2">
                  {(goals?.weeklyPlan || defaultGoals.weeklyPlan).map((day, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">{day.day}</p>
                      <div className="h-20 bg-muted rounded-xl relative overflow-hidden">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-accent/60 transition-all"
                          style={{ height: `${day.target > 0 ? Math.min(100, (day.completed / day.target) * 100) : 0}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-medium text-card-foreground">{day.completed}/{day.target}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan Items */}
              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Meu plano de estudo ({(planItems || []).length})</h2>
                {(planItems || []).length === 0 ? (
                  <EmptyState 
                    icon={ListChecks} 
                    title="Plano vazio" 
                    description="Adicione conteúdos ao seu plano na aba Conteúdos"
                    action={{ label: "Ver conteúdos", onClick: () => navigate("cursos") }}
                  />
                ) : (
                  <div className="space-y-2">
                    {(planItems || []).map((item) => {
                      const content = contentDatabase.find((c) => c.id === item.contentId);
                      if (!content) return null;
                      return (
                        <div key={item.id} className={`flex items-center gap-4 p-4 rounded-xl ${item.completed ? "bg-muted/50" : "bg-accent/5"}`}>
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => togglePlanComplete(item.id)}
                            className="w-5 h-5 rounded-md accent-accent"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${item.completed ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                              {content.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{content.track}</p>
                          </div>
                          <button onClick={() => removePlanItem(item.id)} className="p-2 hover:bg-muted rounded-lg" aria-label="Remover do plano">
                            <X size={16} className="text-muted-foreground" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====== CONTEÚDOS VIEW ====== */}
          {activeView === "cursos" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Conteúdos</h1>
                <p className="text-muted-foreground">Explore materiais de estudo</p>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-3 p-4 bg-card border rounded-2xl">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={contentFilters.search}
                    onChange={(e) => setContentFilters((f) => ({ ...f, search: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2.5 bg-secondary border-0 rounded-xl text-sm"
                  />
                </div>
                <select
                  value={contentFilters.track}
                  onChange={(e) => setContentFilters((f) => ({ ...f, track: e.target.value }))}
                  className="px-3 py-2.5 bg-secondary border-0 rounded-xl text-sm"
                >
                  <option value="all">Todas trilhas</option>
                  {(tracks || []).map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                <select
                  value={contentFilters.difficulty}
                  onChange={(e) => setContentFilters((f) => ({ ...f, difficulty: e.target.value }))}
                  className="px-3 py-2.5 bg-secondary border-0 rounded-xl text-sm"
                >
                  <option value="all">Dificuldade</option>
                  <option value="Fácil">Fácil</option>
                  <option value="Médio">Médio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>

              {/* Content List */}
              {filteredContent.length === 0 ? (
                <EmptyState icon={FolderOpen} title="Nenhum conteúdo encontrado" description="Ajuste os filtros de busca" />
              ) : (
                <div className="grid gap-4">
                  {filteredContent.map((content) => (
                    <div key={content.id} className="bg-card border rounded-2xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                          <FileText size={20} className="text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-card-foreground mb-1">{content.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{content.summary}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge>{content.track}</Badge>
                            <Badge variant="outline">{content.difficulty}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => addToPlan(content)}
                            disabled={isInPlan(content.id)}
                            className="px-3 py-2 text-sm font-medium bg-secondary rounded-xl disabled:opacity-50 hover:bg-muted transition-colors"
                          >
                            {isInPlan(content.id) ? "No plano" : "+ Plano"}
                          </button>
                          <button
                            onClick={() => toggleBookmark(content)}
                            className="p-2 hover:bg-muted rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label={isBookmarked(content.id) ? "Remover dos salvos" : "Salvar"}
                          >
                            {isBookmarked(content.id) ? <BookmarkCheck size={18} className="text-accent" /> : <Bookmark size={18} className="text-muted-foreground" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====== IA VIEW ====== */}
          {activeView === "ia" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Sparkles size={20} className="text-accent" />
                  </div>
                  Busca inteligente
                </h1>
                <p className="text-muted-foreground mt-1">Encontre conteúdos com ajuda da IA</p>
              </div>

              {/* Search */}
              <div className="bg-card border rounded-2xl p-5">
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      placeholder="Pergunte ou busque um tema..."
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                      className="w-full pl-10 pr-4 py-3 bg-secondary border-0 rounded-xl"
                    />
                  </div>
                  <button
                    onClick={handleAiSearch}
                    disabled={aiLoading}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50 min-w-[100px]"
                  >
                    {aiLoading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Buscar"}
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  <select
                    value={aiFilters.track}
                    onChange={(e) => setAiFilters((f) => ({ ...f, track: e.target.value }))}
                    className="px-3 py-2 bg-secondary border-0 rounded-xl text-sm"
                  >
                    <option value="all">Todas trilhas</option>
                    {(tracks || []).map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                  <select
                    value={aiFilters.difficulty}
                    onChange={(e) => setAiFilters((f) => ({ ...f, difficulty: e.target.value }))}
                    className="px-3 py-2 bg-secondary border-0 rounded-xl text-sm"
                  >
                    <option value="all">Dificuldade</option>
                    <option value="Fácil">Fácil</option>
                    <option value="Médio">Médio</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>

                {/* History */}
                {(searchHistory || []).length > 0 && !aiQuery && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                      <History size={12} />
                      Buscas recentes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(searchHistory || []).slice(0, 5).map((h) => (
                        <button key={h.id} onClick={() => setAiQuery(h.query)} className="px-3 py-1.5 text-xs bg-muted rounded-lg hover:bg-secondary transition-colors">
                          {h.query}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Results */}
              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">{aiResults.length} resultados</h2>
                {aiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={24} className="animate-spin text-accent" />
                  </div>
                ) : aiResults.length === 0 ? (
                  <EmptyState icon={Search} title="Nenhum resultado" description="Tente outros termos de busca" />
                ) : (
                  <div className="space-y-3">
                    {aiResults.map((content) => (
                      <div key={content.id} className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-card-foreground mb-1">{content.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{content.summary}</p>
                          <div className="flex gap-2">
                            <Badge>{content.track}</Badge>
                            <Badge variant="outline">{content.difficulty}</Badge>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleBookmark(content)} 
                          className="p-2 hover:bg-card rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label={isBookmarked(content.id) ? "Remover dos salvos" : "Salvar"}
                        >
                          {isBookmarked(content.id) ? <BookmarkCheck size={18} className="text-accent" /> : <Bookmark size={18} className="text-muted-foreground" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====== SALVOS VIEW ====== */}
          {activeView === "salvos" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Salvos</h1>
                <p className="text-muted-foreground">{(bookmarks || []).length} itens salvos</p>
              </div>

              {(bookmarks || []).length === 0 ? (
                <EmptyState 
                  icon={Bookmark} 
                  title="Nada salvo ainda" 
                  description="Salve conteúdos para acessar depois"
                  action={{ label: "Explorar conteúdos", onClick: () => navigate("cursos") }}
                />
              ) : (
                <div className="grid gap-4">
                  {(bookmarks || []).map((b) => (
                    <div key={b.id} className="bg-card border rounded-2xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                          <FileText size={20} className="text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-card-foreground mb-1">{b.content.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{b.content.summary}</p>
                          <div className="flex gap-2">
                            <Badge>{b.content.track}</Badge>
                            <Badge variant="outline">{b.content.difficulty}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => addToPlan(b.content)}
                            disabled={isInPlan(b.id)}
                            className="px-3 py-2 text-sm font-medium bg-secondary rounded-xl disabled:opacity-50"
                          >
                            + Plano
                          </button>
                          <button 
                            onClick={() => toggleBookmark(b.content)} 
                            className="p-2 hover:bg-muted rounded-xl"
                            aria-label="Remover dos salvos"
                          >
                            <Trash2 size={16} className="text-muted-foreground" />
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
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Configurações</h1>
                <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
              </div>

              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Perfil</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                    {userData.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{userData.name}</p>
                    <p className="text-sm text-muted-foreground">Nível {userData.level} • Plano {userData.plan}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Dados de demonstração</h2>
                <p className="text-sm text-muted-foreground mb-4">Use estas opções para testar o dashboard com diferentes cenários</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={generateDemoData}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-colors"
                  >
                    <Download size={16} />
                    Gerar 60 dias de dados
                  </button>
                  <button
                    onClick={resetDemo}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-muted text-muted-foreground rounded-xl hover:bg-secondary transition-colors"
                  >
                    <RotateCcw size={16} />
                    Restaurar dados padrão
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ============ MOBILE BOTTOM NAV ============ */}
        <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-card border-t z-30 safe-area-bottom">
          <div className="flex items-center justify-around h-16">
            {BOTTOM_NAV_ITEMS.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[64px] min-h-[44px] ${isActive ? "text-accent" : "text-muted-foreground"}`}
                >
                  <item.icon size={22} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* ============ MODALS ============ */}

      {/* Session Modal */}
      <Modal
        open={sessionModalOpen}
        onClose={() => { setSessionModalOpen(false); setEditingSession(null); }}
        title={editingSession ? "Editar sessão" : "Nova sessão"}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="session-date" className="block text-sm font-medium text-card-foreground mb-2">Data</label>
            <input
              id="session-date"
              type="date"
              value={sessionForm.date}
              onChange={(e) => setSessionForm((f) => ({ ...f, date: e.target.value }))}
              className={`w-full px-3 py-2.5 bg-secondary border-0 rounded-xl ${formErrors.date ? "ring-2 ring-destructive" : ""}`}
            />
            {formErrors.date && <p className="text-xs text-destructive mt-1">{formErrors.date}</p>}
          </div>

          <div>
            <label htmlFor="session-track" className="block text-sm font-medium text-card-foreground mb-2">Disciplina</label>
            <select
              id="session-track"
              value={sessionForm.trackId}
              onChange={(e) => setSessionForm((f) => ({ ...f, trackId: e.target.value }))}
              className={`w-full px-3 py-2.5 bg-secondary border-0 rounded-xl ${formErrors.trackId ? "ring-2 ring-destructive" : ""}`}
            >
              <option value="">Selecione...</option>
              {(tracks || []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {formErrors.trackId && <p className="text-xs text-destructive mt-1">{formErrors.trackId}</p>}
          </div>

          <div>
            <label htmlFor="session-theme" className="block text-sm font-medium text-card-foreground mb-2">Tema</label>
            <input
              id="session-theme"
              type="text"
              value={sessionForm.theme}
              onChange={(e) => setSessionForm((f) => ({ ...f, theme: e.target.value }))}
              placeholder="Ex: Álgebra Linear"
              className={`w-full px-3 py-2.5 bg-secondary border-0 rounded-xl ${formErrors.theme ? "ring-2 ring-destructive" : ""}`}
            />
            {formErrors.theme && <p className="text-xs text-destructive mt-1">{formErrors.theme}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="session-duration" className="block text-sm font-medium text-card-foreground mb-2">Duração (min)</label>
              <input
                id="session-duration"
                type="number"
                value={sessionForm.duration}
                onChange={(e) => setSessionForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="30"
                min="1"
                className={`w-full px-3 py-2.5 bg-secondary border-0 rounded-xl ${formErrors.duration ? "ring-2 ring-destructive" : ""}`}
              />
              {formErrors.duration && <p className="text-xs text-destructive mt-1">{formErrors.duration}</p>}
            </div>
            <div>
              <label htmlFor="session-type" className="block text-sm font-medium text-card-foreground mb-2">Tipo</label>
              <select
                id="session-type"
                value={sessionForm.type}
                onChange={(e) => setSessionForm((f) => ({ ...f, type: e.target.value as Session["type"] }))}
                className="w-full px-3 py-2.5 bg-secondary border-0 rounded-xl"
              >
                <option value="Estudo">Estudo</option>
                <option value="Revisão">Revisão</option>
                <option value="Simulado">Simulado</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="session-result" className="block text-sm font-medium text-card-foreground mb-2">Resultado (opcional)</label>
            <input
              id="session-result"
              type="text"
              value={sessionForm.result}
              onChange={(e) => setSessionForm((f) => ({ ...f, result: e.target.value }))}
              placeholder="Ex: Quiz 8/10"
              className="w-full px-3 py-2.5 bg-secondary border-0 rounded-xl"
            />
          </div>

          <div>
            <label htmlFor="session-notes" className="block text-sm font-medium text-card-foreground mb-2">Notas (opcional)</label>
            <textarea
              id="session-notes"
              value={sessionForm.notes}
              onChange={(e) => setSessionForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Anotações..."
              rows={2}
              className="w-full px-3 py-2.5 bg-secondary border-0 rounded-xl resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => { setSessionModalOpen(false); setEditingSession(null); }} className="flex-1 px-4 py-3 text-sm font-medium border rounded-xl hover:bg-muted transition-colors">
              Cancelar
            </button>
            <button onClick={handleSaveSession} className="flex-1 px-4 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
              {editingSession ? "Atualizar" : "Salvar"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={!!deleteConfirmSession}
        onClose={() => setDeleteConfirmSession(null)}
        title="Excluir sessão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Tem certeza que deseja excluir a sessão "{deleteConfirmSession?.theme}"? Esta ação pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteConfirmSession(null)} className="flex-1 px-4 py-3 text-sm font-medium border rounded-xl hover:bg-muted">
              Cancelar
            </button>
            <button 
              onClick={() => deleteConfirmSession && handleDeleteSession(deleteConfirmSession)} 
              className="flex-1 px-4 py-3 text-sm font-medium bg-destructive text-destructive-foreground rounded-xl hover:opacity-90"
            >
              Excluir
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
            <div className="p-6 bg-muted rounded-xl text-center text-muted-foreground">
              <FileText size={32} className="mx-auto mb-2" />
              <p className="text-sm">Conteúdo completo disponível em breve</p>
              <p className="text-xs mt-1">// TODO API: Carregar conteúdo do servidor</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { addToPlan(contentDetailModal); setContentDetailModal(null); }}
                disabled={isInPlan(contentDetailModal.id)}
                className="flex-1 px-4 py-3 text-sm font-medium bg-secondary rounded-xl disabled:opacity-50"
              >
                {isInPlan(contentDetailModal.id) ? "Já no plano" : "Adicionar ao plano"}
              </button>
              <button
                onClick={() => { toggleBookmark(contentDetailModal); setContentDetailModal(null); }}
                className="flex-1 px-4 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-xl"
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
