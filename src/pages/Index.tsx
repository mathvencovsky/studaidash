import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import {
  Search, Flame, Clock, CheckCircle2, Target, BookOpen, Menu, X,
  Plus, TrendingUp, AlertTriangle, Award, Zap, Calendar, Filter,
  Sparkles, RotateCcw, Loader2, ChevronLeft, ChevronRight, Edit3,
  Copy, Trash2, Bookmark, BookmarkCheck, History, Play, Brain,
  Settings, BarChart3, Trophy, Shield, ArrowUpRight, ArrowDownRight
} from "lucide-react";

// ============================================================================
// DESIGN TOKENS - Referência da paleta StudAI
// Primária: #1A237E (hsl 234 67% 30%)
// Gradiente: #1A1054 → #255FF1
// Accent: #255FF1 (hsl 222 89% 55%)
// ============================================================================

// ============================================================================
// TOAST CONTEXT - Sistema de notificações leve sem biblioteca
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
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg border animate-in slide-in-from-right ${
              toast.type === "error" ? "bg-card border-destructive/50" : "bg-card border-accent/30"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-card-foreground">{toast.message}</p>
              <div className="flex items-center gap-2">
                {toast.action && (
                  <button
                    onClick={() => {
                      toast.action?.onClick();
                      removeToast(toast.id);
                    }}
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
  date: string; // ISO YYYY-MM-DD
  createdAt: number; // timestamp para desempate
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

interface Goals {
  dailyGoal: number;
  weeklyGoal: number; // em minutos
  completed: number;
  dayOffUsed: boolean;
  dayOffAvailable: boolean;
}

interface SavedSearch {
  id: string;
  query: string;
  timestamp: number;
}

interface BookmarkedContent {
  id: number;
  content: ContentItem;
  savedAt: number;
}

// ============================================================================
// STORAGE HELPERS - Centralização de leitura/escrita localStorage
// ============================================================================

const STORAGE_KEYS = {
  sessions: "studai_sessions",
  tracks: "studai_tracks",
  checklist: "studai_checklist",
  goals: "studai_goals",
  period: "studai_period",
  lastSessionDate: "studai_last_session",
  streak: "studai_streak",
  searchHistory: "studai_search_history",
  bookmarks: "studai_bookmarks",
  chartAnchor: "studai_chart_anchor",
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
// PSEUDO-RANDOM WITH SEED - Para demo consistente
// ============================================================================

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

function generateDemoData(daysBack: number = 60): { sessions: Session[]; tracks: Track[] } {
  const random = seededRandom(42); // Seed fixa para consistência
  const tracks: Track[] = [
    { id: 1, name: "Matemática", progress: 0, status: "A iniciar", skills: ["Álgebra", "Cálculo", "Probabilidade"], milestones: [] },
    { id: 2, name: "Português", progress: 0, status: "A iniciar", skills: ["Gramática", "Redação", "Interpretação"], milestones: [] },
    { id: 3, name: "Programação", progress: 0, status: "A iniciar", skills: ["Python", "Lógica", "Estruturas de Dados"], milestones: [] },
    { id: 4, name: "Inglês", progress: 0, status: "A iniciar", skills: ["Gramática", "Vocabulário", "Conversação"], milestones: [] },
    { id: 5, name: "Física", progress: 0, status: "A iniciar", skills: ["Mecânica", "Termodinâmica", "Eletricidade"], milestones: [] },
  ];

  const themes = {
    1: ["Álgebra Linear", "Derivadas", "Integrais", "Probabilidade", "Estatística", "Matrizes"],
    2: ["Gramática", "Redação ENEM", "Interpretação", "Literatura", "Concordância"],
    3: ["Python Básico", "Funções", "POO", "Estruturas de Dados", "Algoritmos"],
    4: ["Present Perfect", "Phrasal Verbs", "Reading", "Listening", "Vocabulary"],
    5: ["Cinemática", "Dinâmica", "Energia", "Ondas", "Óptica"],
  };

  const types: Session["type"][] = ["Estudo", "Revisão", "Simulado"];
  const sessions: Session[] = [];
  const today = new Date();

  for (let i = 0; i < daysBack; i++) {
    // 70% chance de ter sessão no dia
    if (random() < 0.7) {
      const numSessions = random() < 0.3 ? 2 : 1; // 30% chance de 2 sessões
      for (let j = 0; j < numSessions; j++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const trackId = Math.floor(random() * 5) + 1;
        const trackThemes = themes[trackId as keyof typeof themes];
        const duration = Math.floor(random() * 60) + 15; // 15-75 min
        const type = types[Math.floor(random() * 3)];
        const hasQuiz = type === "Simulado" || random() < 0.4;
        const quizCorrect = hasQuiz ? Math.floor(random() * 4) + 6 : 0; // 6-10

        sessions.push({
          id: `demo_${i}_${j}`,
          date: date.toISOString().split("T")[0],
          createdAt: date.getTime() + j * 1000,
          theme: trackThemes[Math.floor(random() * trackThemes.length)],
          trackId,
          duration,
          type,
          result: hasQuiz ? `Quiz ${quizCorrect}/10` : "",
          notes: "",
        });

        // Atualizar progresso da trilha
        const track = tracks.find((t) => t.id === trackId);
        if (track) {
          track.progress = Math.min(100, track.progress + 1);
          track.status = track.progress >= 100 ? "Concluída" : "Em andamento";
        }
      }
    }
  }

  // Adicionar milestones
  tracks.forEach((track) => {
    track.milestones = [
      { percent: 25, label: "Iniciante", achieved: track.progress >= 25 },
      { percent: 50, label: "Intermediário", achieved: track.progress >= 50 },
      { percent: 75, label: "Avançado", achieved: track.progress >= 75 },
      { percent: 100, label: "Mestre", achieved: track.progress >= 100 },
    ];
  });

  return { sessions: sortSessions(sessions), tracks };
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
  { id: 4, name: "Inglês", progress: 0, status: "A iniciar", skills: ["Gramática", "Vocabulário", "Conversação"], milestones: [
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

const defaultSessions: Session[] = sortSessions([
  { id: "1", date: "2025-01-17", createdAt: Date.now(), theme: "Álgebra Linear", trackId: 1, duration: 45, type: "Estudo", result: "Quiz 9/10", notes: "" },
  { id: "2", date: "2025-01-16", createdAt: Date.now() - 86400000, theme: "Gramática", trackId: 2, duration: 30, type: "Revisão", result: "", notes: "" },
  { id: "3", date: "2025-01-15", createdAt: Date.now() - 172800000, theme: "Python Básico", trackId: 3, duration: 60, type: "Estudo", result: "Quiz 8/10", notes: "" },
  { id: "4", date: "2025-01-14", createdAt: Date.now() - 259200000, theme: "Trigonometria", trackId: 1, duration: 40, type: "Simulado", result: "Quiz 7/10", notes: "" },
  { id: "5", date: "2025-01-13", createdAt: Date.now() - 345600000, theme: "Mecânica", trackId: 5, duration: 35, type: "Estudo", result: "Quiz 6/10", notes: "" },
  { id: "6", date: "2025-01-12", createdAt: Date.now() - 432000000, theme: "Redação", trackId: 2, duration: 50, type: "Estudo", result: "", notes: "" },
]);

const defaultChecklist: ChecklistItem[] = [
  { id: 1, text: "Revisar fórmulas de física", checked: false },
  { id: 2, text: "Fazer quiz de matemática", checked: true },
  { id: 3, text: "Ler capítulo de gramática", checked: false },
];

const defaultGoals: Goals = { dailyGoal: 60, weeklyGoal: 300, completed: 35, dayOffUsed: false, dayOffAvailable: true };

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
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}`;
}

function formatFullDateBR(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
}

function getDateRange(anchor: Date, days: number): { start: Date; end: Date } {
  const end = new Date(anchor);
  const start = new Date(anchor);
  start.setDate(start.getDate() - days + 1);
  return { start, end };
}

function parseQuizResult(result: string): { correct: number; total: number } | null {
  const match = result.match(/Quiz\s*(\d+)\s*\/\s*(\d+)/i);
  if (match) {
    return { correct: parseInt(match[1]), total: parseInt(match[2]) };
  }
  return null;
}

// ============================================================================
// ACTIONS - Business logic
// ============================================================================

// AI Search function - isolated for easy API replacement
// TODO API: Substituir por chamada real ao backend/Perplexity
async function searchStudAI(
  query: string,
  filters: SearchFilters,
  signal?: AbortSignal
): Promise<ContentItem[]> {
  // Simulate network delay with abort support
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, 500);
    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

  let results = contentDatabase;

  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.includes(q))
    );
  }

  if (filters.track && filters.track !== "all") {
    results = results.filter((item) => item.track === filters.track);
  }

  if (filters.difficulty && filters.difficulty !== "all") {
    results = results.filter((item) => item.difficulty === filters.difficulty);
  }

  if (filters.sortBy === "recent") {
    results = [...results].reverse();
  }

  return results;
}

function computeInsights(sessions: Session[], tracks: Track[], goals: Goals) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  
  // Últimos 7 dias
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  });

  // Último mês
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  });

  const sessionsLast7 = sessions.filter((s) => last7Days.includes(s.date));
  const sessionsLast30 = sessions.filter((s) => last30Days.includes(s.date));

  const activeDays7 = new Set(sessionsLast7.map((s) => s.date)).size;
  const activeDays30 = new Set(sessionsLast30.map((s) => s.date)).size;

  const totalMinutes7 = sessionsLast7.reduce((acc, s) => acc + s.duration, 0);
  const totalMinutes30 = sessionsLast30.reduce((acc, s) => acc + s.duration, 0);

  const bestTrack = tracks
    .filter((t) => t.status !== "A iniciar")
    .sort((a, b) => b.progress - a.progress)[0];

  const lastSessionDate = sessions.length > 0 ? sessions[0].date : null;
  const daysSinceLastSession = lastSessionDate
    ? Math.floor((today.getTime() - new Date(lastSessionDate + "T12:00:00").getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  // Risco de queda (considerando day off)
  const effectiveDaysSince = goals.dayOffAvailable && daysSinceLastSession === 1 ? 0 : daysSinceLastSession;
  const atRisk = effectiveDaysSince >= 2;

  // Taxa de acerto média (parse robusto)
  const quizResults = sessions
    .map((s) => parseQuizResult(s.result))
    .filter((r): r is { correct: number; total: number } => r !== null);
  
  const avgAccuracy = quizResults.length > 0
    ? Math.round(quizResults.reduce((acc, r) => acc + (r.correct / r.total) * 100, 0) / quizResults.length)
    : 0;

  // Consistência (% de dias com estudo na semana)
  const consistency7 = Math.round((activeDays7 / 7) * 100);

  // Projeção: dias para concluir trilha principal
  const mainTrack = tracks.find((t) => t.status === "Em andamento");
  let daysToComplete = null;
  if (mainTrack && sessions.length > 0) {
    const avgProgressPerSession = 2;
    const remaining = 100 - mainTrack.progress;
    const sessionsNeeded = Math.ceil(remaining / avgProgressPerSession);
    const avgSessionsPerWeek = Math.max(1, sessionsLast7.length);
    daysToComplete = Math.ceil((sessionsNeeded / avgSessionsPerWeek) * 7);
  }

  // Progresso semanal (vs meta)
  const weeklyProgress = Math.round((totalMinutes7 / goals.weeklyGoal) * 100);

  // Período anterior para comparação
  const prev7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - 7 - i);
    return d.toISOString().split("T")[0];
  });
  const sessionsPrev7 = sessions.filter((s) => prev7Days.includes(s.date));
  const totalMinutesPrev7 = sessionsPrev7.reduce((acc, s) => acc + s.duration, 0);
  const deltaPercent = totalMinutesPrev7 > 0
    ? Math.round(((totalMinutes7 - totalMinutesPrev7) / totalMinutesPrev7) * 100)
    : totalMinutes7 > 0 ? 100 : 0;

  return {
    activeDays7,
    activeDays30,
    totalMinutes7,
    totalMinutes30,
    bestTrack,
    atRisk,
    daysSinceLastSession,
    avgAccuracy,
    consistency7,
    daysToComplete,
    mainTrack,
    weeklyProgress,
    deltaPercent,
  };
}

function computeChartData(sessions: Session[], anchor: Date, days: number, dailyGoal: number) {
  const { start, end } = getDateRange(anchor, days);
  const data: { date: string; label: string; fullLabel: string; minutes: number; isGoalMet: boolean }[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const dayMinutes = sessions
      .filter((s) => s.date === dateStr)
      .reduce((acc, s) => acc + s.duration, 0);

    data.push({
      date: dateStr,
      label: formatDateBR(dateStr),
      fullLabel: formatFullDateBR(dateStr),
      minutes: dayMinutes,
      isGoalMet: dayMinutes >= dailyGoal,
    });
  }

  const total = data.reduce((acc, d) => acc + d.minutes, 0);
  const avg = Math.round(total / days);
  const best = data.reduce((max, d) => (d.minutes > max.minutes ? d : max), data[0]);

  return { data, total, avg, best };
}

function generateWeeklyReport(sessions: Session[], tracks: Track[], insights: ReturnType<typeof computeInsights>) {
  const positives: string[] = [];
  const needsFocus: string[] = [];
  const suggestions: string[] = [];

  if (insights.activeDays7 >= 5) {
    positives.push("Excelente consistência: estudou em " + insights.activeDays7 + " dias esta semana!");
  } else if (insights.activeDays7 >= 3) {
    positives.push("Boa frequência de estudos: " + insights.activeDays7 + " dias ativos.");
  }

  if (insights.avgAccuracy >= 80) {
    positives.push("Taxa de acerto alta nos quizzes: " + insights.avgAccuracy + "%");
  }

  if (insights.deltaPercent > 0) {
    positives.push("Tempo de estudo " + insights.deltaPercent + "% maior que semana anterior.");
  }

  if (insights.atRisk) {
    needsFocus.push("Atenção: " + insights.daysSinceLastSession + " dias sem estudar. Retome hoje!");
  }

  if (insights.avgAccuracy > 0 && insights.avgAccuracy < 70) {
    needsFocus.push("Revisar conteúdos com taxa de acerto abaixo de 70%.");
  }

  const incompleteTrack = tracks.find((t) => t.status === "Em andamento" && t.progress < 50);
  if (incompleteTrack) {
    needsFocus.push(`Trilha "${incompleteTrack.name}" precisa de mais atenção (${incompleteTrack.progress}%).`);
  }

  if (insights.mainTrack) {
    suggestions.push(`Foque em "${insights.mainTrack.name}" para concluir em ~${insights.daysToComplete} dias.`);
  }

  if (insights.weeklyProgress < 100) {
    const remaining = Math.ceil((100 - insights.weeklyProgress) * 3); // ~3 min por %
    suggestions.push(`Estude mais ${remaining} min para bater a meta semanal.`);
  }

  return { positives, needsFocus, suggestions };
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

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "accent" | "muted" | "outline" }) => {
  const styles = {
    default: "bg-accent/10 text-accent",
    accent: "bg-accent text-accent-foreground",
    muted: "bg-muted text-muted-foreground",
    outline: "border border-border text-muted-foreground",
  };
  return <span className={`px-2 py-0.5 text-xs rounded-md font-medium ${styles[variant]}`}>{children}</span>;
};

const StatCard = ({ icon, value, label, sublabel, highlight, trend }: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
  highlight?: boolean;
  trend?: { value: number; positive: boolean };
}) => (
  <div className={`rounded-xl border p-4 transition-colors ${highlight ? "bg-accent/5 border-accent/30" : "bg-card"}`}>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-card rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-card z-10">
          <h2 className="font-semibold text-card-foreground">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg" aria-label="Fechar modal">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <p className="text-sm text-muted-foreground mb-4">{message}</p>
    <div className="flex gap-3">
      <button onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted">
        Cancelar
      </button>
      <button onClick={onConfirm} className="flex-1 px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:opacity-90">
        Confirmar
      </button>
    </div>
  </Modal>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Dashboard = () => {
  const { addToast } = useToast();

  // Persisted state
  const [sessions, setSessions] = usePersistedState<Session[]>(STORAGE_KEYS.sessions, defaultSessions);
  const [tracks, setTracks] = usePersistedState<Track[]>(STORAGE_KEYS.tracks, defaultTracks);
  const [checklist, setChecklist] = usePersistedState<ChecklistItem[]>(STORAGE_KEYS.checklist, defaultChecklist);
  const [goals, setGoals] = usePersistedState<Goals>(STORAGE_KEYS.goals, defaultGoals);
  const [period, setPeriod] = usePersistedState<"7" | "30" | "90">(STORAGE_KEYS.period, "7");
  const [streak, setStreak] = usePersistedState<number>(STORAGE_KEYS.streak, 12);
  const [searchHistory, setSearchHistory] = usePersistedState<SavedSearch[]>(STORAGE_KEYS.searchHistory, []);
  const [bookmarks, setBookmarks] = usePersistedState<BookmarkedContent[]>(STORAGE_KEYS.bookmarks, []);
  const [chartAnchor, setChartAnchor] = usePersistedState<string>(STORAGE_KEYS.chartAnchor, new Date().toISOString().split("T")[0]);

  // UI state
  const [activeTab, setActiveTab] = useState<"dashboard" | "trilhas" | "sessoes" | "ia">("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(true);

  // Modal state
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessionForm, setSessionForm] = useState({
    trackId: "",
    theme: "",
    duration: "",
    type: "Estudo" as Session["type"],
    result: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [sessionDetailModal, setSessionDetailModal] = useState<Session | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Session | null>(null);
  const [deletedSession, setDeletedSession] = useState<Session | null>(null);

  // Session filters
  const [sessionFilters, setSessionFilters] = useState({
    track: "all",
    type: "all",
    dateFrom: "",
    dateTo: "",
    search: "",
    sort: "recent" as "recent" | "oldest" | "duration",
  });

  // AI Search state
  const [aiQuery, setAiQuery] = useState("");
  const [aiResults, setAiResults] = useState<ContentItem[]>([]);
  const [aiFilters, setAiFilters] = useState<SearchFilters>({ track: "all", difficulty: "all", sortBy: "relevance" });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTab, setAiTab] = useState<"search" | "saved">("search");
  const [aiStreaming, setAiStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Goals editing
  const [editingGoals, setEditingGoals] = useState(false);
  const [tempGoals, setTempGoals] = useState(goals);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Computed values
  const userData = { name: "João Silva", plan: "Premium", level: 12, xp: 2450, xpNext: 3000 };
  const sortedSessions = sortSessions(sessions);
  const insights = computeInsights(sortedSessions, tracks, goals);
  const anchorDate = new Date(chartAnchor + "T12:00:00");
  const chartInfo = computeChartData(sortedSessions, anchorDate, parseInt(period), goals.dailyGoal);
  const weeklyReport = generateWeeklyReport(sortedSessions, tracks, insights);

  // Filtered sessions for Sessões tab
  const filteredSessions = sortedSessions
    .filter((s) => {
      if (sessionFilters.track !== "all" && s.trackId !== parseInt(sessionFilters.track)) return false;
      if (sessionFilters.type !== "all" && s.type !== sessionFilters.type) return false;
      if (sessionFilters.dateFrom && s.date < sessionFilters.dateFrom) return false;
      if (sessionFilters.dateTo && s.date > sessionFilters.dateTo) return false;
      if (sessionFilters.search && !s.theme.toLowerCase().includes(sessionFilters.search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sessionFilters.sort === "oldest") return a.date.localeCompare(b.date);
      if (sessionFilters.sort === "duration") return b.duration - a.duration;
      return b.date.localeCompare(a.date);
    });

  const filteredTracks = tracks.filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Quick suggestions for AI
  const quickSuggestions = [
    "Como resolver equações do 2º grau?",
    "Dicas para redação ENEM",
    "Explicar leis de Newton",
    "Python para iniciantes",
    "Tempos verbais em inglês",
  ];

  // Actions
  const resetDemo = () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setSessions(defaultSessions);
    setTracks(defaultTracks);
    setChecklist(defaultChecklist);
    setGoals(defaultGoals);
    setPeriod("7");
    setStreak(12);
    setSearchHistory([]);
    setBookmarks([]);
    setChartAnchor(new Date().toISOString().split("T")[0]);
    addToast({ message: "Dados resetados!", type: "success" });
  };

  const generateDemoDataHandler = () => {
    const { sessions: demoSessions, tracks: demoTracks } = generateDemoData(60);
    setSessions(demoSessions);
    setTracks(demoTracks);
    addToast({ message: "Dados demo gerados: 60 dias de sessões!", type: "success" });
  };

  const toggleCheck = (id: number) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
    addToast({ message: "Checklist atualizado", type: "info" });
  };

  const handleContinue = (name: string) => {
    addToast({ message: `Iniciando: ${name}`, type: "success" });
  };

  const openNewSessionModal = () => {
    setEditingSession(null);
    setSessionForm({
      trackId: "",
      theme: "",
      duration: "",
      type: "Estudo",
      result: "",
      notes: "",
      date: new Date().toISOString().split("T")[0],
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
    setSessionDetailModal(null);
  };

  const duplicateSession = (session: Session) => {
    const newSession: Session = {
      ...session,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      createdAt: Date.now(),
    };
    setSessions((prev) => sortSessions([newSession, ...prev]));
    addToast({ message: "Sessão duplicada!", type: "success" });
    setSessionDetailModal(null);
  };

  const deleteSession = (session: Session) => {
    setDeletedSession(session);
    setSessions((prev) => prev.filter((s) => s.id !== session.id));
    setDeleteConfirm(null);
    setSessionDetailModal(null);
    addToast({
      message: "Sessão removida",
      type: "info",
      action: {
        label: "Desfazer",
        onClick: () => {
          if (deletedSession) {
            setSessions((prev) => sortSessions([...prev, deletedSession]));
            setDeletedSession(null);
            addToast({ message: "Sessão restaurada!", type: "success" });
          }
        },
      },
    });
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
      // Update existing
      setSessions((prev) =>
        sortSessions(
          prev.map((s) =>
            s.id === editingSession.id
              ? { ...s, ...sessionForm, trackId, duration }
              : s
          )
        )
      );
      addToast({ message: "Sessão atualizada!", type: "success" });
    } else {
      // Create new
      const newSession: Session = {
        id: Date.now().toString(),
        date: sessionForm.date,
        createdAt: Date.now(),
        theme: sessionForm.theme,
        trackId,
        duration,
        type: sessionForm.type,
        result: sessionForm.result,
        notes: sessionForm.notes,
      };

      setSessions((prev) => sortSessions([newSession, ...prev]));

      // Update track progress
      setTracks((prev) =>
        prev.map((t) => {
          if (t.id === trackId) {
            const newProgress = Math.min(100, t.progress + 2);
            return {
              ...t,
              progress: newProgress,
              status: newProgress === 100 ? "Concluída" : "Em andamento",
              milestones: t.milestones.map((m) => ({
                ...m,
                achieved: newProgress >= m.percent,
              })),
            };
          }
          return t;
        })
      );

      // Update goals if session is today
      if (sessionForm.date === today) {
        setGoals((prev) => ({
          ...prev,
          completed: Math.min(prev.dailyGoal, prev.completed + duration),
        }));
      }

      // Update streak
      const lastSession = localStorage.getItem(STORAGE_KEYS.lastSessionDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (sessionForm.date === today && lastSession !== today) {
        if (lastSession === yesterdayStr || !lastSession) {
          setStreak((prev) => prev + 1);
        }
        localStorage.setItem(STORAGE_KEYS.lastSessionDate, today);
      }

      addToast({ message: "Sessão salva!", type: "success" });
    }

    setSessionModalOpen(false);
    setEditingSession(null);
  };

  const saveGoals = () => {
    setGoals(tempGoals);
    setEditingGoals(false);
    addToast({ message: "Metas atualizadas!", type: "success" });
  };

  const handleAiSearch = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setAiLoading(true);
    setAiStreaming(true);

    // Add to history
    if (aiQuery.trim()) {
      setSearchHistory((prev) => {
        const filtered = prev.filter((h) => h.query !== aiQuery);
        return [{ id: Date.now().toString(), query: aiQuery, timestamp: Date.now() }, ...filtered].slice(0, 8);
      });
    }

    try {
      // Simulate streaming delay
      await new Promise((r) => setTimeout(r, 300));
      setAiStreaming(false);

      const results = await searchStudAI(aiQuery, aiFilters, controller.signal);
      setAiResults(results);
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setAiResults([]);
      }
    } finally {
      setAiLoading(false);
      setAiStreaming(false);
    }
  }, [aiQuery, aiFilters]);

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

  const isBookmarked = (id: number) => bookmarks.some((b) => b.id === id);

  // Chart navigation
  const canNavigateNext = new Date(chartAnchor) < new Date();
  const navigateChart = (direction: "prev" | "next") => {
    const current = new Date(chartAnchor + "T12:00:00");
    const days = parseInt(period);
    if (direction === "prev") {
      current.setDate(current.getDate() - days);
    } else if (canNavigateNext) {
      current.setDate(current.getDate() + days);
      if (current > new Date()) {
        current.setTime(new Date().getTime());
      }
    }
    setChartAnchor(current.toISOString().split("T")[0]);
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
                aria-label="Toggle menu"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="text-xl font-bold tracking-tight">StudAI</h1>
              {demoMode && <Badge variant="accent">Demo</Badge>}
            </div>

            {/* Quick Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={openNewSessionModal}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                Nova sessão
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                <Play size={16} />
                Revisão
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                <Brain size={16} />
                Plano IA
              </button>
            </div>

            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{userData.name}</p>
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <Zap size={12} />
                  <span>Nível {userData.level}</span>
                  <span className="hidden md:inline">• {userData.xp}/{userData.xpNext} XP</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                {userData.name.charAt(0)}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 mt-3 overflow-x-auto pb-1 -mx-4 px-4">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "trilhas", label: "Trilhas", icon: BookOpen },
              { id: "sessoes", label: "Sessões", icon: Clock },
              { id: "ia", label: "IA", icon: Sparkles },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <main className="flex-1 space-y-6 min-w-0">
            {/* ============ DASHBOARD TAB ============ */}
            {activeTab === "dashboard" && (
              <>
                {/* Learning Path Card */}
                {insights.mainTrack && (
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-accent/20 p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Trophy size={14} className="text-accent" />
                          Trilha Principal
                        </div>
                        <h2 className="text-xl font-bold text-card-foreground mb-2">{insights.mainTrack.name}</h2>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden max-w-xs">
                            <div
                              className="h-full bg-accent rounded-full transition-all"
                              style={{ width: `${insights.mainTrack.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-card-foreground">{insights.mainTrack.progress}%</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {insights.mainTrack.skills.map((skill) => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleContinue(insights.mainTrack!.name)}
                          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                          Continuar
                        </button>
                        {insights.daysToComplete && (
                          <p className="text-xs text-muted-foreground text-center">
                            ~{insights.daysToComplete} dias para concluir
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Milestones */}
                    <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                      {insights.mainTrack.milestones.map((m, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                            m.achieved ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {m.achieved ? <CheckCircle2 size={12} /> : <Target size={12} />}
                          {m.percent}% {m.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insights */}
                <div className="bg-card rounded-xl border p-5">
                  <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-accent" />
                    Insights
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Calendar size={14} />
                        Consistência
                      </div>
                      <p className="text-lg font-bold text-card-foreground">{insights.consistency7}%</p>
                      <p className="text-xs text-muted-foreground">{insights.activeDays7}/7 dias ativos</p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Award size={14} />
                        Precisão
                      </div>
                      <p className="text-lg font-bold text-card-foreground">{insights.avgAccuracy}%</p>
                      <p className="text-xs text-muted-foreground">média em quizzes</p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Clock size={14} />
                        Este mês
                      </div>
                      <p className="text-lg font-bold text-card-foreground">{Math.round(insights.totalMinutes30 / 60)}h</p>
                      <p className="text-xs text-muted-foreground">{insights.activeDays30} dias ativos</p>
                    </div>
                    <div className={`p-3 rounded-lg ${insights.atRisk ? "bg-destructive/10" : "bg-accent/10"}`}>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        {insights.atRisk ? <AlertTriangle size={14} /> : <Shield size={14} />}
                        Status
                      </div>
                      <p className={`text-lg font-bold ${insights.atRisk ? "text-destructive" : "text-accent"}`}>
                        {insights.atRisk ? "Atenção" : "Em dia!"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {insights.atRisk
                          ? `${insights.daysSinceLastSession}d sem estudar`
                          : goals.dayOffAvailable ? "1 folga disponível" : "Folga usada"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Weekly Report */}
                <div className="bg-card rounded-xl border p-5">
                  <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                    <BarChart3 size={18} className="text-accent" />
                    Relatório da Semana
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-medium text-accent mb-2">✓ O que foi bem</p>
                      <ul className="space-y-1">
                        {weeklyReport.positives.length > 0 ? (
                          weeklyReport.positives.map((p, i) => (
                            <li key={i} className="text-sm text-muted-foreground">• {p}</li>
                          ))
                        ) : (
                          <li className="text-sm text-muted-foreground">• Continue estudando!</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">⚠ Precisa de foco</p>
                      <ul className="space-y-1">
                        {weeklyReport.needsFocus.length > 0 ? (
                          weeklyReport.needsFocus.map((n, i) => (
                            <li key={i} className="text-sm text-muted-foreground">• {n}</li>
                          ))
                        ) : (
                          <li className="text-sm text-muted-foreground">• Tudo em ordem!</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-primary mb-2">→ Próximo passo</p>
                      <ul className="space-y-1">
                        {weeklyReport.suggestions.map((s, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    icon={<Flame className="text-accent" size={24} />}
                    value={`${streak}`}
                    label="Dias de streak"
                    sublabel={`Meta: ${goals.dailyGoal} min/dia`}
                  />
                  <StatCard
                    icon={<Clock className="text-primary" size={24} />}
                    value={`${Math.round(insights.totalMinutes7 / 60)}h`}
                    label="Esta semana"
                    sublabel={`${insights.weeklyProgress}% da meta`}
                    trend={insights.deltaPercent !== 0 ? { value: insights.deltaPercent, positive: insights.deltaPercent > 0 } : undefined}
                  />
                  <StatCard
                    icon={<CheckCircle2 className="text-accent" size={24} />}
                    value={tracks.filter((t) => t.status === "Concluída").length.toString()}
                    label="Trilhas concluídas"
                    sublabel={`de ${tracks.length} trilhas`}
                  />
                  <StatCard
                    icon={<Target className="text-primary" size={24} />}
                    value={`${insights.avgAccuracy}%`}
                    label="Precisão"
                    sublabel="Em quizzes"
                  />
                </div>

                {/* Chart */}
                <div className="bg-card rounded-xl border p-5">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h3 className="font-semibold text-card-foreground">Minutos estudados</h3>
                    <div className="flex items-center gap-2">
                      {(["7", "30", "90"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => { setPeriod(p); setChartAnchor(new Date().toISOString().split("T")[0]); }}
                          className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                            period === p
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-muted"
                          }`}
                        >
                          {p}d
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart Summary */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total:</span>{" "}
                      <span className="font-medium text-card-foreground">{Math.round(chartInfo.total / 60)}h {chartInfo.total % 60}min</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Média:</span>{" "}
                      <span className="font-medium text-card-foreground">{chartInfo.avg}min/dia</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Melhor dia:</span>{" "}
                      <span className="font-medium text-card-foreground">{chartInfo.best.label} ({chartInfo.best.minutes}min)</span>
                    </div>
                    {insights.deltaPercent !== 0 && (
                      <div className={`flex items-center gap-1 ${insights.deltaPercent > 0 ? "text-accent" : "text-muted-foreground"}`}>
                        {insights.deltaPercent > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(insights.deltaPercent)}% vs anterior
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => navigateChart("prev")}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-card-foreground hover:bg-muted rounded"
                    >
                      <ChevronLeft size={14} />
                      Anterior
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {chartInfo.data[0]?.label} - {chartInfo.data[chartInfo.data.length - 1]?.label}
                    </span>
                    <button
                      onClick={() => navigateChart("next")}
                      disabled={!canNavigateNext}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-card-foreground hover:bg-muted rounded disabled:opacity-50"
                    >
                      Próximo
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Chart */}
                  <div className="relative">
                    {/* Goal line */}
                    <div
                      className="absolute left-0 right-0 border-t border-dashed border-accent/50 z-10"
                      style={{ bottom: `${Math.min(100, (goals.dailyGoal / Math.max(...chartInfo.data.map((d) => d.minutes), goals.dailyGoal)) * 120)}px` }}
                    >
                      <span className="absolute -top-3 right-0 text-[10px] text-accent bg-card px-1">Meta {goals.dailyGoal}min</span>
                    </div>

                    <div className="flex items-end justify-between gap-1 h-40 overflow-x-auto pb-2">
                      {chartInfo.data.map((item, i) => {
                        const maxVal = Math.max(...chartInfo.data.map((d) => d.minutes), goals.dailyGoal);
                        const height = maxVal > 0 ? (item.minutes / maxVal) * 120 : 0;
                        return (
                          <div key={i} className="flex-1 min-w-[24px] max-w-[50px] flex flex-col items-center gap-1 group">
                            <div className="relative w-full flex justify-center">
                              {/* Tooltip */}
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card border rounded px-2 py-1 text-xs whitespace-nowrap z-20 shadow-lg">
                                {item.fullLabel} • {item.minutes}min
                              </div>
                              <div
                                className={`w-full rounded-t-md transition-all ${item.isGoalMet ? "bg-accent" : "bg-primary/60"}`}
                                style={{ height: `${Math.max(4, height)}px` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-card rounded-xl border p-5 overflow-x-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-card-foreground">Atividade recente</h3>
                    <button
                      onClick={() => setActiveTab("sessoes")}
                      className="text-sm text-accent hover:underline"
                    >
                      Ver todas
                    </button>
                  </div>
                  {sortedSessions.length === 0 ? (
                    <EmptyState
                      icon={BookOpen}
                      title="Nenhuma sessão registrada"
                      description="Clique em 'Nova sessão' para começar."
                    />
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-2 font-medium text-muted-foreground">Data</th>
                          <th className="pb-2 font-medium text-muted-foreground">Tema</th>
                          <th className="pb-2 font-medium text-muted-foreground hidden sm:table-cell">Tipo</th>
                          <th className="pb-2 font-medium text-muted-foreground">Duração</th>
                          <th className="pb-2 font-medium text-muted-foreground hidden sm:table-cell">Resultado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedSessions.slice(0, 5).map((session) => (
                          <tr
                            key={session.id}
                            className="border-b last:border-0 cursor-pointer hover:bg-muted/50"
                            onClick={() => setSessionDetailModal(session)}
                          >
                            <td className="py-3 text-card-foreground">{formatDateBR(session.date)}</td>
                            <td className="py-3 text-card-foreground">{session.theme}</td>
                            <td className="py-3 hidden sm:table-cell"><Badge variant="muted">{session.type}</Badge></td>
                            <td className="py-3 text-muted-foreground">{session.duration}min</td>
                            <td className="py-3 hidden sm:table-cell">
                              {session.result ? <Badge>{session.result}</Badge> : "—"}
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
              <div className="space-y-4">
                <div className="bg-card rounded-xl border p-5">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h3 className="font-semibold text-card-foreground">Trilhas / Disciplinas</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input
                        type="text"
                        placeholder="Filtrar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Filtrar trilhas"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {filteredTracks.length === 0 ? (
                      <EmptyState icon={BookOpen} title="Nenhuma trilha encontrada" description="Tente outro termo." />
                    ) : (
                      filteredTracks.map((track) => (
                        <div key={track.id} className="p-4 bg-secondary/50 rounded-lg">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-[200px]">
                              <div className="flex items-center gap-3 mb-2">
                                <BookOpen className="text-primary shrink-0" size={20} />
                                <span className="font-medium text-card-foreground">{track.name}</span>
                                <Badge variant={track.status === "Concluída" ? "accent" : track.status === "Em andamento" ? "default" : "muted"}>
                                  {track.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden max-w-xs">
                                  <div className="h-full bg-accent rounded-full" style={{ width: `${track.progress}%` }} />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">{track.progress}%</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {track.skills.map((skill) => (
                                  <Badge key={skill} variant="outline">{skill}</Badge>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {track.milestones.map((m, i) => (
                                  <div
                                    key={i}
                                    className={`flex items-center gap-1 text-xs ${m.achieved ? "text-accent" : "text-muted-foreground"}`}
                                  >
                                    {m.achieved ? <CheckCircle2 size={12} /> : <Target size={12} />}
                                    {m.label}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => handleContinue(track.name)}
                              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                            >
                              Continuar
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ============ SESSÕES TAB ============ */}
            {activeTab === "sessoes" && (
              <div className="space-y-4">
                <div className="bg-card rounded-xl border p-5">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h3 className="font-semibold text-card-foreground">Histórico de Sessões</h3>
                    <button
                      onClick={openNewSessionModal}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg"
                    >
                      <Plus size={16} />
                      Nova
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-3 mb-4 p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Filter size={14} className="text-muted-foreground" />
                      <select
                        value={sessionFilters.track}
                        onChange={(e) => setSessionFilters((f) => ({ ...f, track: e.target.value }))}
                        className="px-2 py-1.5 bg-card border border-border rounded-lg text-sm"
                        aria-label="Filtrar por trilha"
                      >
                        <option value="all">Todas trilhas</option>
                        {tracks.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <select
                      value={sessionFilters.type}
                      onChange={(e) => setSessionFilters((f) => ({ ...f, type: e.target.value }))}
                      className="px-2 py-1.5 bg-card border border-border rounded-lg text-sm"
                      aria-label="Filtrar por tipo"
                    >
                      <option value="all">Todos tipos</option>
                      <option value="Estudo">Estudo</option>
                      <option value="Revisão">Revisão</option>
                      <option value="Simulado">Simulado</option>
                    </select>
                    <input
                      type="date"
                      value={sessionFilters.dateFrom}
                      onChange={(e) => setSessionFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                      className="px-2 py-1.5 bg-card border border-border rounded-lg text-sm"
                      aria-label="Data inicial"
                    />
                    <input
                      type="date"
                      value={sessionFilters.dateTo}
                      onChange={(e) => setSessionFilters((f) => ({ ...f, dateTo: e.target.value }))}
                      className="px-2 py-1.5 bg-card border border-border rounded-lg text-sm"
                      aria-label="Data final"
                    />
                    <div className="relative flex-1 min-w-[150px]">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                      <input
                        type="text"
                        placeholder="Buscar tema..."
                        value={sessionFilters.search}
                        onChange={(e) => setSessionFilters((f) => ({ ...f, search: e.target.value }))}
                        className="w-full pl-8 pr-3 py-1.5 bg-card border border-border rounded-lg text-sm"
                      />
                    </div>
                    <select
                      value={sessionFilters.sort}
                      onChange={(e) => setSessionFilters((f) => ({ ...f, sort: e.target.value as any }))}
                      className="px-2 py-1.5 bg-card border border-border rounded-lg text-sm"
                      aria-label="Ordenar por"
                    >
                      <option value="recent">Mais recente</option>
                      <option value="oldest">Mais antigo</option>
                      <option value="duration">Maior duração</option>
                    </select>
                  </div>

                  {/* Sessions List */}
                  {filteredSessions.length === 0 ? (
                    <EmptyState icon={Clock} title="Nenhuma sessão encontrada" description="Ajuste os filtros ou registre uma sessão." />
                  ) : (
                    <div className="space-y-2">
                      {filteredSessions.map((session) => {
                        const track = tracks.find((t) => t.id === session.trackId);
                        return (
                          <div
                            key={session.id}
                            className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                            onClick={() => setSessionDetailModal(session)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="font-medium text-card-foreground">{session.theme}</p>
                                <p className="text-sm text-muted-foreground">
                                  {track?.name} • {session.type} • {session.duration}min
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm text-muted-foreground">{formatDateBR(session.date)}</p>
                                {session.result && <Badge>{session.result}</Badge>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============ IA TAB ============ */}
            {activeTab === "ia" && (
              <div className="space-y-4">
                <div className="bg-card rounded-xl border p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => setAiTab("search")}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                        aiTab === "search" ? "bg-primary text-primary-foreground" : "bg-secondary"
                      }`}
                    >
                      <Search size={14} />
                      Buscar
                    </button>
                    <button
                      onClick={() => setAiTab("saved")}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                        aiTab === "saved" ? "bg-primary text-primary-foreground" : "bg-secondary"
                      }`}
                    >
                      <Bookmark size={14} />
                      Salvos ({bookmarks.length})
                    </button>
                  </div>

                  {aiTab === "search" && (
                    <>
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
                          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                        >
                          {aiLoading ? <Loader2 size={18} className="animate-spin" /> : "Buscar"}
                        </button>
                      </div>

                      {/* Quick suggestions */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {quickSuggestions.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => { setAiQuery(q); }}
                            className="px-3 py-1.5 text-xs bg-accent/10 text-accent rounded-full hover:bg-accent/20"
                          >
                            {q}
                          </button>
                        ))}
                      </div>

                      {/* Filters */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        <select
                          value={aiFilters.track}
                          onChange={(e) => setAiFilters((f) => ({ ...f, track: e.target.value }))}
                          className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm"
                        >
                          <option value="all">Todas trilhas</option>
                          {tracks.map((t) => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                          ))}
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
                        <select
                          value={aiFilters.sortBy}
                          onChange={(e) => setAiFilters((f) => ({ ...f, sortBy: e.target.value as any }))}
                          className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm"
                        >
                          <option value="relevance">Relevância</option>
                          <option value="recent">Mais recente</option>
                        </select>
                      </div>

                      {/* Search History */}
                      {searchHistory.length > 0 && !aiQuery && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                            <History size={12} />
                            Buscas recentes
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {searchHistory.slice(0, 5).map((h) => (
                              <button
                                key={h.id}
                                onClick={() => setAiQuery(h.query)}
                                className="px-2 py-1 text-xs bg-muted rounded hover:bg-secondary"
                              >
                                {h.query}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Results / Saved */}
                <div className="bg-card rounded-xl border p-5">
                  {aiTab === "search" ? (
                    <>
                      {aiStreaming ? (
                        <div className="flex items-center gap-3 py-8 justify-center">
                          <Loader2 size={20} className="animate-spin text-accent" />
                          <span className="text-sm text-muted-foreground">Gerando resposta...</span>
                        </div>
                      ) : aiLoading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
                        </div>
                      ) : aiResults.length === 0 ? (
                        <EmptyState icon={Search} title="Nenhum resultado" description="Tente outros termos ou filtros." />
                      ) : (
                        <div className="grid gap-3">
                          {aiResults.map((item) => (
                            <div key={item.id} className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h5 className="font-medium text-card-foreground mb-1">{item.title}</h5>
                                  <p className="text-sm text-muted-foreground mb-2">{item.summary}</p>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge>{item.track}</Badge>
                                    <Badge variant="outline">{item.difficulty}</Badge>
                                    {item.tags.slice(0, 2).map((tag) => (
                                      <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => toggleBookmark(item)}
                                    className="p-2 hover:bg-muted rounded-lg"
                                    aria-label={isBookmarked(item.id) ? "Remover dos salvos" : "Salvar"}
                                  >
                                    {isBookmarked(item.id) ? (
                                      <BookmarkCheck size={18} className="text-accent" />
                                    ) : (
                                      <Bookmark size={18} className="text-muted-foreground" />
                                    )}
                                  </button>
                                  <button className="px-3 py-1.5 text-sm bg-accent text-accent-foreground rounded-lg">
                                    Estudar
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {bookmarks.length === 0 ? (
                        <EmptyState icon={Bookmark} title="Nada salvo" description="Salve conteúdos para acessar depois." />
                      ) : (
                        <div className="grid gap-3">
                          {bookmarks.map((b) => (
                            <div key={b.id} className="p-4 bg-secondary/50 rounded-lg">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h5 className="font-medium text-card-foreground mb-1">{b.content.title}</h5>
                                  <p className="text-sm text-muted-foreground mb-2">{b.content.summary}</p>
                                  <div className="flex gap-2">
                                    <Badge>{b.content.track}</Badge>
                                    <Badge variant="outline">{b.content.difficulty}</Badge>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleBookmark(b.content)}
                                  className="p-2 hover:bg-muted rounded-lg"
                                  aria-label="Remover"
                                >
                                  <Trash2 size={16} className="text-muted-foreground" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
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
              ${sidebarCollapsed ? "lg:w-16" : "lg:w-72"}
              p-4 lg:p-0 overflow-y-auto
            `}
          >
            {/* Collapse toggle (desktop) */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center w-full p-2 mb-2 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg"
              aria-label={sidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {!sidebarCollapsed && (
              <>
                {/* Demo Mode */}
                {demoMode && (
                  <div className="bg-card rounded-xl border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-card-foreground">Demo Mode</span>
                      <button onClick={() => setDemoMode(false)} className="text-xs text-muted-foreground hover:text-card-foreground">
                        Ocultar
                      </button>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={resetDemo}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20"
                      >
                        <RotateCcw size={14} />
                        Resetar dados
                      </button>
                      <button
                        onClick={generateDemoDataHandler}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-accent/10 text-accent rounded-lg hover:bg-accent/20"
                      >
                        <BarChart3 size={14} />
                        Gerar 60 dias demo
                      </button>
                    </div>
                  </div>
                )}

                {/* Daily Goal */}
                <div className="bg-card rounded-xl border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-card-foreground">Meta diária</h3>
                    <button
                      onClick={() => { setTempGoals(goals); setEditingGoals(true); }}
                      className="p-1 hover:bg-muted rounded"
                      aria-label="Editar metas"
                    >
                      <Settings size={14} className="text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-primary">{goals.completed}/{goals.dailyGoal}</span>
                    <span className="text-sm text-muted-foreground">min</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      style={{ width: `${Math.min(100, (goals.completed / goals.dailyGoal) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {goals.completed >= goals.dailyGoal ? "🎉 Meta batida!" : `Faltam ${goals.dailyGoal - goals.completed}min`}
                  </p>

                  {/* Weekly Goal */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-card-foreground">Meta semanal</span>
                      <span className="text-sm text-muted-foreground">{insights.weeklyProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${Math.min(100, insights.weeklyProgress)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(insights.totalMinutes7 / 60)}h / {Math.round(goals.weeklyGoal / 60)}h
                    </p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-card rounded-xl border p-5">
                  <h3 className="font-semibold text-card-foreground mb-3">Próxima recomendação</h3>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <p className="font-medium text-card-foreground text-sm">Quiz: Derivadas e Integrais</p>
                    <p className="text-xs text-muted-foreground mt-1">15 questões • ~20 min</p>
                    <button className="mt-3 w-full py-2 text-sm font-medium bg-accent text-accent-foreground rounded-lg hover:opacity-90">
                      Iniciar
                    </button>
                  </div>
                </div>

                {/* Checklist */}
                <div className="bg-card rounded-xl border p-5">
                  <h3 className="font-semibold text-card-foreground mb-3">Checklist</h3>
                  <div className="space-y-3">
                    {checklist.map((item) => (
                      <label key={item.id} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleCheck(item.id)}
                          className="mt-0.5 w-4 h-4 rounded border-2 border-muted-foreground checked:bg-accent checked:border-accent accent-accent"
                        />
                        <span className={`text-sm ${item.checked ? "text-muted-foreground line-through" : "text-card-foreground"}`}>
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* New/Edit Session Modal */}
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
              className={`w-full px-3 py-2 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                formErrors.date ? "border-destructive" : "border-border"
              }`}
            />
            {formErrors.date && <p className="text-xs text-destructive mt-1">{formErrors.date}</p>}
          </div>

          <div>
            <label htmlFor="session-track" className="block text-sm font-medium text-card-foreground mb-1">Disciplina *</label>
            <select
              id="session-track"
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
            <label htmlFor="session-theme" className="block text-sm font-medium text-card-foreground mb-1">Tema *</label>
            <input
              id="session-theme"
              type="text"
              value={sessionForm.theme}
              onChange={(e) => setSessionForm((f) => ({ ...f, theme: e.target.value }))}
              placeholder="Ex: Álgebra Linear"
              className={`w-full px-3 py-2 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                formErrors.theme ? "border-destructive" : "border-border"
              }`}
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
                className={`w-full px-3 py-2 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  formErrors.duration ? "border-destructive" : "border-border"
                }`}
              />
              {formErrors.duration && <p className="text-xs text-destructive mt-1">{formErrors.duration}</p>}
            </div>
            <div>
              <label htmlFor="session-type" className="block text-sm font-medium text-card-foreground mb-1">Tipo</label>
              <select
                id="session-type"
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
            <label htmlFor="session-result" className="block text-sm font-medium text-card-foreground mb-1">Resultado (opcional)</label>
            <input
              id="session-result"
              type="text"
              value={sessionForm.result}
              onChange={(e) => setSessionForm((f) => ({ ...f, result: e.target.value }))}
              placeholder="Ex: Quiz 8/10"
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="session-notes" className="block text-sm font-medium text-card-foreground mb-1">Notas (opcional)</label>
            <textarea
              id="session-notes"
              value={sessionForm.notes}
              onChange={(e) => setSessionForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Anotações..."
              rows={3}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setSessionModalOpen(false); setEditingSession(null); }}
              className="flex-1 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveSession}
              className="flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              {editingSession ? "Atualizar" : "Salvar"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Session Detail Modal */}
      <Modal
        open={!!sessionDetailModal}
        onClose={() => setSessionDetailModal(null)}
        title="Detalhes da Sessão"
      >
        {sessionDetailModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Data</p>
                <p className="font-medium text-card-foreground">{formatFullDateBR(sessionDetailModal.date)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duração</p>
                <p className="font-medium text-card-foreground">{sessionDetailModal.duration} min</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tema</p>
              <p className="font-medium text-card-foreground">{sessionDetailModal.theme}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Trilha</p>
                <p className="font-medium text-card-foreground">
                  {tracks.find((t) => t.id === sessionDetailModal.trackId)?.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tipo</p>
                <Badge variant="muted">{sessionDetailModal.type}</Badge>
              </div>
            </div>
            {sessionDetailModal.result && (
              <div>
                <p className="text-xs text-muted-foreground">Resultado</p>
                <Badge>{sessionDetailModal.result}</Badge>
              </div>
            )}
            {sessionDetailModal.notes && (
              <div>
                <p className="text-xs text-muted-foreground">Notas</p>
                <p className="text-sm text-card-foreground bg-secondary/50 p-3 rounded-lg">
                  {sessionDetailModal.notes}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => openEditSessionModal(sessionDetailModal)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-secondary rounded-lg hover:bg-muted"
              >
                <Edit3 size={14} />
                Editar
              </button>
              <button
                onClick={() => duplicateSession(sessionDetailModal)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-secondary rounded-lg hover:bg-muted"
              >
                <Copy size={14} />
                Duplicar
              </button>
              <button
                onClick={() => setDeleteConfirm(sessionDetailModal)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20"
              >
                <Trash2 size={14} />
                Excluir
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteSession(deleteConfirm)}
        title="Excluir sessão?"
        message="Esta ação não pode ser desfeita. Você pode recuperar a sessão clicando em 'Desfazer' na notificação."
      />

      {/* Goals Editing Modal */}
      <Modal open={editingGoals} onClose={() => setEditingGoals(false)} title="Configurar Metas" size="sm">
        <div className="space-y-4">
          <div>
            <label htmlFor="goal-daily" className="block text-sm font-medium text-card-foreground mb-1">Meta diária (min)</label>
            <select
              id="goal-daily"
              value={tempGoals.dailyGoal}
              onChange={(e) => setTempGoals((g) => ({ ...g, dailyGoal: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg"
            >
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={60}>60 minutos</option>
              <option value={90}>90 minutos</option>
              <option value={120}>120 minutos</option>
            </select>
          </div>
          <div>
            <label htmlFor="goal-weekly" className="block text-sm font-medium text-card-foreground mb-1">Meta semanal (horas)</label>
            <select
              id="goal-weekly"
              value={tempGoals.weeklyGoal}
              onChange={(e) => setTempGoals((g) => ({ ...g, weeklyGoal: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg"
            >
              <option value={180}>3 horas</option>
              <option value={300}>5 horas</option>
              <option value={420}>7 horas</option>
              <option value={600}>10 horas</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setEditingGoals(false)} className="flex-1 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted">
              Cancelar
            </button>
            <button onClick={saveGoals} className="flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90">
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================================
// WRAPPER WITH TOAST PROVIDER
// ============================================================================

const Index = () => (
  <ToastProvider>
    <Dashboard />
  </ToastProvider>
);

export default Index;
