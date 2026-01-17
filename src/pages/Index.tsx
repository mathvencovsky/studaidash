import { useState, useEffect, useCallback, useRef, createContext, useContext, useMemo } from "react";
import {
  Search, Flame, Clock, CheckCircle2, Target, BookOpen, Menu, X,
  Plus, TrendingUp, Award, Zap, Calendar, Filter,
  Sparkles, RotateCcw, Loader2, ChevronLeft, ChevronRight, Edit3,
  Trash2, Bookmark, BookmarkCheck, History, Play, Brain,
  Settings, BarChart3, Trophy, Shield, ArrowUpRight, ArrowDownRight,
  LayoutDashboard, GraduationCap, FolderOpen, CalendarDays, ListChecks,
  RefreshCw, Bot, Star, ChevronDown, FileText, MoreVertical,
  Home, User, LogOut, HelpCircle, Download, Briefcase, TrendingUp as TrendUp,
  Lightbulb, MessageSquare, Layers, BookMarked, RotateCw
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
                {toast.type === "error" && <X size={16} className="text-destructive" />}
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
// TYPES - Professional Learning Platform
// ============================================================================

type ViewId = "dashboard" | "programas" | "conteudos" | "ia" | "sessoes" | "calendario" | "metas" | "revisoes" | "salvos" | "relatorios" | "roi" | "engajamento" | "trilha" | "config";

type AreaId = "concursos" | "certificacoes" | "tech" | "negocios" | "idiomas" | "fundamentos" | "cognitivo";

interface Area {
  id: AreaId;
  name: string;
  icon: any;
  description: string;
}

interface Program {
  id: number;
  name: string;
  areaId: AreaId;
  description: string;
  duration: string;
  progress: number;
  status: "Em andamento" | "Concluído" | "A iniciar";
  competencies: string[];
  prerequisites: string[];
  enrolledAt?: number;
  // MVP+ fields for trail overview
  startDate?: string; // YYYY-MM-DD - user-defined start date
  targetEndDate?: string; // YYYY-MM-DD - deadline (e.g., exam date)
  defaultDailyCapacityMin?: number; // available min/day (e.g., 90)
}

// TODO API: ContentNode for structured trail content
interface ContentNode {
  id: string;
  title: string;
  competency: string;
  estimatedMinutes: number;
  status: "not_started" | "in_progress" | "done";
  completedMinutes: number; // 0..estimatedMinutes
  order: number;
  children?: ContentNode[]; // optional (module -> lessons)
}

// TODO API: TrailData for persisting trail-specific data
interface TrailData {
  programId: number;
  contents: ContentNode[];
  lastUpdated: number;
}

interface Competency {
  id: number;
  name: string;
  programId: number;
  progress: number;
  sessions: number;
}

interface Session {
  id: string;
  date: string;
  createdAt: number;
  topic: string;
  programId: number;
  competencyId?: number;
  contentId?: string; // TODO API: Link session to specific ContentNode
  duration: number;
  type: "Conceitual" | "Exercícios" | "Simulado" | "Revisão" | "Projeto";
  result: string;
  notes: string;
  tags: string[];
}

interface ContentItem {
  id: number;
  title: string;
  summary: string;
  area: 
    | "Concursos Públicos"
    | "Certificações Profissionais"
    | "Tecnologia & Dados"
    | "Negócios & Finanças";
  program: string;
  competency: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  estimatedMinutes: number;
  tags: string[];
}

interface Goals {
  dailyGoal: number;
  weeklyGoal: number;
  completed: number;
  activeProgramId: number | null;
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

interface ReviewItem {
  id: string;
  contentId: number;
  topic: string;
  programId: number;
  nextReview: string;
  interval: number; // D+1, D+3, D+7, D+14, D+30
  completedReviews: number;
}

interface NavItem {
  id: ViewId;
  label: string;
  icon: any;
  section: "aprender" | "progresso" | "analytics" | "ferramentas";
  badgeCount?: number;
}

// ============================================================================
// TRAIL CALCULATION UTILITIES (Exact formulas from spec)
// ============================================================================

// Parse date string to Date object with time at 00:00 local
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

// Get today's date with time at 00:00 local
function getTodayLocal(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

// Calculate difference in days between two dates
function diffDays(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 86400000);
}

// Add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Clamp value between min and max
function clamp(min: number, value: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Format date to YYYY-MM-DD
function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Trail calculation types
interface TrailCalculations {
  // Totals
  totalEstimatedMinutes: number;
  totalCompletedMinutes: number;
  remainingMinutes: number;
  
  // Dates
  startDate: Date;
  targetEndDate: Date;
  today: Date;
  
  // Duration
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  timelineProgressPct: number;
  
  // Rhythm (7-day rolling)
  studiedMinutes7d: number;
  activeDays7d: number;
  currentDailyAvgMin: number;
  
  // Required rhythm
  requiredDailyMin: number;
  
  // Projection
  projectedDaysToFinish: number | null;
  projectedEndDate: Date | null;
  
  // Gap
  deltaDailyMin: number;
  status: "on_track" | "attention" | "at_risk";
  
  // Content stats
  totalContents: number;
  completedContents: number;
}

function calculateTrailMetrics(
  program: Program,
  sessions: Session[],
  trailContents: ContentNode[]
): TrailCalculations {
  const today = getTodayLocal();
  
  // Default dates if not set
  const startDate = program.startDate 
    ? parseLocalDate(program.startDate)
    : program.enrolledAt 
      ? new Date(program.enrolledAt)
      : addDays(today, -90);
  
  // Parse duration for target end if not set
  let targetEndDate: Date;
  if (program.targetEndDate) {
    targetEndDate = parseLocalDate(program.targetEndDate);
  } else {
    const durationMatch = program.duration.match(/(\d+)\s*(mês|meses|semanas?)/i);
    let durationDays = 180;
    if (durationMatch) {
      const num = parseInt(durationMatch[1]);
      durationDays = durationMatch[2].includes("semana") ? num * 7 : num * 30;
    }
    targetEndDate = addDays(startDate, durationDays);
  }
  
  // Calculate totals from trail contents
  const calculateNodeMinutes = (node: ContentNode): { estimated: number; completed: number } => {
    let estimated = node.estimatedMinutes;
    let completed = node.completedMinutes;
    if (node.children) {
      node.children.forEach(child => {
        const childMins = calculateNodeMinutes(child);
        estimated += childMins.estimated;
        completed += childMins.completed;
      });
    }
    return { estimated, completed };
  };
  
  let totalEstimatedMinutes = 0;
  let totalCompletedMinutes = 0;
  let completedContents = 0;
  
  trailContents.forEach(node => {
    const mins = calculateNodeMinutes(node);
    totalEstimatedMinutes += mins.estimated;
    totalCompletedMinutes += mins.completed;
    if (node.status === "done") completedContents++;
  });
  
  // If no trail contents, use sessions for completed minutes
  if (trailContents.length === 0) {
    const programSessions = sessions.filter(s => s.programId === program.id);
    totalCompletedMinutes = programSessions.reduce((acc, s) => acc + s.duration, 0);
    // Estimate total based on program progress
    if (program.progress > 0) {
      totalEstimatedMinutes = Math.round(totalCompletedMinutes / (program.progress / 100));
    } else {
      totalEstimatedMinutes = totalCompletedMinutes + 1000; // Default estimate
    }
  }
  
  const remainingMinutes = Math.max(0, totalEstimatedMinutes - totalCompletedMinutes);
  
  // Duration calculations
  const totalDays = Math.max(1, diffDays(targetEndDate, startDate) + 1);
  const elapsedDays = clamp(0, diffDays(today, startDate) + 1, totalDays);
  const remainingDays = Math.max(0, totalDays - elapsedDays);
  const timelineProgressPct = Math.round((elapsedDays / totalDays) * 100);
  
  // 7-day rolling average
  const window7d: string[] = [];
  for (let i = 6; i >= 0; i--) {
    window7d.push(formatDateISO(addDays(today, -i)));
  }
  
  const programSessions7d = sessions.filter(
    s => s.programId === program.id && window7d.includes(s.date)
  );
  const studiedMinutes7d = programSessions7d.reduce((acc, s) => acc + s.duration, 0);
  const activeDays7d = new Set(programSessions7d.map(s => s.date)).size;
  const currentDailyAvgMin = Math.round(studiedMinutes7d / 7);
  
  // Required rhythm
  const requiredDailyMin = remainingDays > 0 
    ? Math.ceil(remainingMinutes / remainingDays) 
    : remainingMinutes;
  
  // Projection
  let projectedDaysToFinish: number | null = null;
  let projectedEndDate: Date | null = null;
  if (currentDailyAvgMin > 0) {
    projectedDaysToFinish = Math.ceil(remainingMinutes / currentDailyAvgMin);
    projectedEndDate = addDays(today, projectedDaysToFinish);
  }
  
  // Gap and status
  const deltaDailyMin = requiredDailyMin - currentDailyAvgMin;
  let status: "on_track" | "attention" | "at_risk" = "on_track";
  if (remainingMinutes > 0) {
    if (deltaDailyMin > 15) {
      status = "at_risk";
    } else if (deltaDailyMin > 0) {
      status = "attention";
    }
  }
  
  return {
    totalEstimatedMinutes,
    totalCompletedMinutes,
    remainingMinutes,
    startDate,
    targetEndDate,
    today,
    totalDays,
    elapsedDays,
    remainingDays,
    timelineProgressPct,
    studiedMinutes7d,
    activeDays7d,
    currentDailyAvgMin,
    requiredDailyMin,
    projectedDaysToFinish,
    projectedEndDate,
    deltaDailyMin,
    status,
    totalContents: trailContents.length,
    completedContents,
  };
}

// ============================================================================
// AREAS (Top-level taxonomy)
// ============================================================================

const AREAS: Area[] = [
  { id: "concursos", name: "Concursos Públicos", icon: Shield, description: "Prepare-se para concursos federais, estaduais e municipais" },
  { id: "certificacoes", name: "Certificações", icon: Award, description: "CFA, PMP, AWS, Azure e mais" },
  { id: "tech", name: "Tecnologia & Dados", icon: Layers, description: "Programação, Data Science, Machine Learning" },
  { id: "negocios", name: "Negócios & Finanças", icon: Briefcase, description: "Finanças, Gestão, Contabilidade" },
  { id: "idiomas", name: "Idiomas", icon: MessageSquare, description: "Inglês, Espanhol e outros idiomas" },
  { id: "fundamentos", name: "Fundamentos", icon: BookOpen, description: "Matemática, Estatística, Lógica" },
  { id: "cognitivo", name: "Habilidades Cognitivas", icon: Lightbulb, description: "Raciocínio, pensamento crítico, resolução de problemas" },
];

// ============================================================================
// PROGRAMS (Professional Learning Paths)
// ============================================================================

const defaultPrograms: Program[] = [
  // Concursos - with MVP+ trail fields
  { 
    id: 1, name: "Analista BACEN", areaId: "concursos", 
    description: "Preparação completa para Analista do Banco Central", 
    duration: "12 meses", progress: 45, status: "Em andamento", 
    competencies: ["Economia", "Direito Administrativo", "Matemática Financeira", "Contabilidade"], 
    prerequisites: [], 
    enrolledAt: Date.now() - 90 * 86400000,
    startDate: formatDateISO(addDays(getTodayLocal(), -90)),
    targetEndDate: formatDateISO(addDays(getTodayLocal(), 180)),
    defaultDailyCapacityMin: 90
  },
  { id: 2, name: "Auditor Fiscal - Receita Federal", areaId: "concursos", description: "Programa de estudos para Auditor-Fiscal da RFB", duration: "18 meses", progress: 0, status: "A iniciar", competencies: ["Direito Tributário", "Contabilidade Avançada", "Legislação Aduaneira"], prerequisites: [] },
  
  // Certificações - with MVP+ trail fields
  { 
    id: 3, name: "CFA Level I", areaId: "certificacoes", 
    description: "Chartered Financial Analyst - Nível 1", 
    duration: "6 meses", progress: 62, status: "Em andamento", 
    competencies: ["Ethics", "Quantitative Methods", "Economics", "Financial Reporting", "Corporate Finance", "Equity", "Fixed Income", "Derivatives", "Portfolio Management"], 
    prerequisites: [], 
    enrolledAt: Date.now() - 120 * 86400000,
    startDate: formatDateISO(addDays(getTodayLocal(), -120)),
    targetEndDate: formatDateISO(addDays(getTodayLocal(), 60)),
    defaultDailyCapacityMin: 60
  },
  { id: 4, name: "AWS Cloud Practitioner", areaId: "certificacoes", description: "Fundamentos de cloud computing na AWS", duration: "2 meses", progress: 100, status: "Concluído", competencies: ["Cloud Concepts", "Security", "Technology", "Billing"], prerequisites: [] },
  { id: 5, name: "PMP Certification", areaId: "certificacoes", description: "Project Management Professional", duration: "4 meses", progress: 28, status: "Em andamento", competencies: ["Iniciação", "Planejamento", "Execução", "Monitoramento", "Encerramento"], prerequisites: [] },
  
  // Tech - with MVP+ trail fields
  { 
    id: 6, name: "Data Analyst", areaId: "tech", 
    description: "Formação completa em Análise de Dados", 
    duration: "6 meses", progress: 35, status: "Em andamento", 
    competencies: ["SQL", "Python", "Estatística", "Visualização", "Machine Learning Básico"], 
    prerequisites: [], 
    enrolledAt: Date.now() - 60 * 86400000,
    startDate: formatDateISO(addDays(getTodayLocal(), -60)),
    targetEndDate: formatDateISO(addDays(getTodayLocal(), 120)),
    defaultDailyCapacityMin: 75
  },
  { id: 7, name: "Engenheiro de Software", areaId: "tech", description: "Do básico ao avançado em engenharia de software", duration: "12 meses", progress: 0, status: "A iniciar", competencies: ["Algoritmos", "Estruturas de Dados", "System Design", "DevOps"], prerequisites: [] },
  { id: 8, name: "Transição para Tech", areaId: "tech", description: "Programa para quem está migrando de carreira", duration: "8 meses", progress: 15, status: "Em andamento", competencies: ["Lógica de Programação", "Python Básico", "Git", "SQL", "HTML/CSS"], prerequisites: [] },
  
  // Negócios
  { id: 9, name: "Finanças Corporativas", areaId: "negocios", description: "Valuation, análise financeira e decisões de investimento", duration: "4 meses", progress: 0, status: "A iniciar", competencies: ["Valuation", "Análise de Demonstrações", "Custo de Capital"], prerequisites: [] },
  
  // Idiomas
  { id: 10, name: "Inglês Profissional", areaId: "idiomas", description: "Inglês para ambiente corporativo e certificações internacionais", duration: "6 meses", progress: 40, status: "Em andamento", competencies: ["Business English", "Technical Writing", "Presentations", "Negotiations"], prerequisites: [] },
];

// ============================================================================
// SESSIONS (Professional Study Sessions)
// ============================================================================

const defaultSessions: Session[] = [
  { id: "1", date: "2025-01-17", createdAt: Date.now(), topic: "Ethics and Standards", programId: 3, duration: 45, type: "Conceitual", result: "Quiz 9/10", notes: "", tags: ["cfa", "ethics"] },
  { id: "2", date: "2025-01-16", createdAt: Date.now() - 86400000, topic: "SQL Avançado - Joins", programId: 6, duration: 60, type: "Exercícios", result: "", notes: "", tags: ["sql", "data"] },
  { id: "3", date: "2025-01-15", createdAt: Date.now() - 172800000, topic: "Economia Brasileira", programId: 1, duration: 40, type: "Conceitual", result: "", notes: "", tags: ["economia", "bacen"] },
  { id: "4", date: "2025-01-14", createdAt: Date.now() - 259200000, topic: "Quantitative Methods", programId: 3, duration: 55, type: "Simulado", result: "Quiz 7/10", notes: "", tags: ["cfa", "quant"] },
  { id: "5", date: "2025-01-13", createdAt: Date.now() - 345600000, topic: "Python - Pandas", programId: 6, duration: 50, type: "Projeto", result: "", notes: "", tags: ["python", "pandas"] },
  { id: "6", date: "2025-01-12", createdAt: Date.now() - 432000000, topic: "Business Writing", programId: 10, duration: 30, type: "Exercícios", result: "", notes: "", tags: ["english", "writing"] },
  { id: "7", date: "2025-01-10", createdAt: Date.now() - 604800000, topic: "Financial Reporting", programId: 3, duration: 45, type: "Revisão", result: "Quiz 8/10", notes: "", tags: ["cfa", "fra"] },
];

// ============================================================================
// CONTENT DATABASE (Professional Content - Objetivo-oriented)
// ============================================================================

const contentDatabase: ContentItem[] = [
  // ================= CFA =================
  {
    id: 1,
    title: "Ethical and Professional Standards",
    summary: "Fundamentos éticos exigidos pelo CFA Institute, com estudos de caso.",
    area: "Certificações Profissionais",
    program: "CFA Level I",
    competency: "Ethics",
    difficulty: "Intermediário",
    estimatedMinutes: 45,
    tags: ["cfa", "ethics", "finance"]
  },
  {
    id: 2,
    title: "Quantitative Methods: Time Value of Money",
    summary: "Conceitos de valor do dinheiro no tempo aplicados a finanças.",
    area: "Certificações Profissionais",
    program: "CFA Level I",
    competency: "Quantitative Methods",
    difficulty: "Avançado",
    estimatedMinutes: 60,
    tags: ["cfa", "quantitative", "tvom"]
  },
  {
    id: 3,
    title: "Financial Reporting and Analysis",
    summary: "Análise de demonstrações financeiras e métricas-chave.",
    area: "Certificações Profissionais",
    program: "CFA Level I",
    competency: "Financial Reporting",
    difficulty: "Avançado",
    estimatedMinutes: 90,
    tags: ["cfa", "fra", "accounting"]
  },
  {
    id: 4,
    title: "Equity Valuation: DCF Models",
    summary: "Avaliação de empresas usando fluxo de caixa descontado.",
    area: "Certificações Profissionais",
    program: "CFA Level I",
    competency: "Equity",
    difficulty: "Avançado",
    estimatedMinutes: 75,
    tags: ["cfa", "equity", "valuation", "dcf"]
  },

  // ================= CONCURSOS =================
  {
    id: 5,
    title: "Sistema Financeiro Nacional",
    summary: "Estrutura e funcionamento do SFN para concursos do BACEN.",
    area: "Concursos Públicos",
    program: "BACEN",
    competency: "Economia",
    difficulty: "Intermediário",
    estimatedMinutes: 40,
    tags: ["bacen", "economia", "sfn"]
  },
  {
    id: 6,
    title: "Política Monetária e Cambial",
    summary: "Instrumentos de política monetária utilizados pelo Banco Central.",
    area: "Concursos Públicos",
    program: "BACEN",
    competency: "Economia",
    difficulty: "Avançado",
    estimatedMinutes: 55,
    tags: ["bacen", "economia", "política monetária"]
  },
  {
    id: 7,
    title: "Raciocínio Lógico Matemático",
    summary: "Técnicas de lógica aplicadas a provas objetivas.",
    area: "Concursos Públicos",
    program: "Carreiras Fiscais",
    competency: "Lógica",
    difficulty: "Iniciante",
    estimatedMinutes: 30,
    tags: ["logica", "concursos", "raciocinio"]
  },
  {
    id: 8,
    title: "Direito Tributário: Princípios",
    summary: "Princípios constitucionais tributários para Auditor-Fiscal.",
    area: "Concursos Públicos",
    program: "Receita Federal",
    competency: "Direito Tributário",
    difficulty: "Intermediário",
    estimatedMinutes: 50,
    tags: ["receita", "tributário", "direito"]
  },

  // ================= TECH / DATA =================
  {
    id: 9,
    title: "SQL para Análise de Dados",
    summary: "Consultas SQL aplicadas a análise de dados reais.",
    area: "Tecnologia & Dados",
    program: "Data Analyst",
    competency: "SQL",
    difficulty: "Intermediário",
    estimatedMinutes: 50,
    tags: ["sql", "data", "analytics"]
  },
  {
    id: 10,
    title: "Python para Data Analysis",
    summary: "Manipulação de dados com pandas e numpy.",
    area: "Tecnologia & Dados",
    program: "Data Analyst",
    competency: "Python",
    difficulty: "Intermediário",
    estimatedMinutes: 60,
    tags: ["python", "data", "pandas"]
  },
  {
    id: 11,
    title: "Estatística Descritiva e Inferencial",
    summary: "Fundamentos estatísticos para análise de dados.",
    area: "Tecnologia & Dados",
    program: "Data Analyst",
    competency: "Estatística",
    difficulty: "Intermediário",
    estimatedMinutes: 45,
    tags: ["estatística", "data", "análise"]
  },
  {
    id: 12,
    title: "Visualização de Dados com Python",
    summary: "Criação de gráficos e dashboards com Matplotlib e Seaborn.",
    area: "Tecnologia & Dados",
    program: "Data Analyst",
    competency: "Visualização",
    difficulty: "Iniciante",
    estimatedMinutes: 40,
    tags: ["python", "viz", "seaborn", "matplotlib"]
  },
  {
    id: 13,
    title: "Introdução ao Machine Learning",
    summary: "Conceitos básicos de aprendizado de máquina supervisionado.",
    area: "Tecnologia & Dados",
    program: "Data Analyst",
    competency: "Machine Learning Básico",
    difficulty: "Avançado",
    estimatedMinutes: 90,
    tags: ["ml", "data", "scikit-learn"]
  },
  {
    id: 14,
    title: "Git e Controle de Versão",
    summary: "Fundamentos de versionamento de código com Git e GitHub.",
    area: "Tecnologia & Dados",
    program: "Transição para Tech",
    competency: "Git",
    difficulty: "Iniciante",
    estimatedMinutes: 35,
    tags: ["git", "github", "devops"]
  },
  {
    id: 15,
    title: "Lógica de Programação",
    summary: "Fundamentos de algoritmos e pensamento computacional.",
    area: "Tecnologia & Dados",
    program: "Transição para Tech",
    competency: "Lógica de Programação",
    difficulty: "Iniciante",
    estimatedMinutes: 40,
    tags: ["logica", "algoritmos", "programação"]
  },

  // ================= BUSINESS =================
  {
    id: 16,
    title: "Valuation: Fluxo de Caixa Descontado",
    summary: "Avaliação de empresas utilizando DCF.",
    area: "Negócios & Finanças",
    program: "Investment Analyst",
    competency: "Valuation",
    difficulty: "Avançado",
    estimatedMinutes: 70,
    tags: ["valuation", "finance", "dcf"]
  },
  {
    id: 17,
    title: "Análise de Demonstrações Financeiras",
    summary: "Interpretação de balanço, DRE e fluxo de caixa.",
    area: "Negócios & Finanças",
    program: "Investment Analyst",
    competency: "Análise Financeira",
    difficulty: "Intermediário",
    estimatedMinutes: 55,
    tags: ["contabilidade", "finance", "análise"]
  },
  {
    id: 18,
    title: "PMBOK: Áreas de Conhecimento",
    summary: "As 10 áreas de conhecimento do gerenciamento de projetos.",
    area: "Negócios & Finanças",
    program: "PMP Certification",
    competency: "Planejamento",
    difficulty: "Iniciante",
    estimatedMinutes: 60,
    tags: ["pmp", "pmbok", "gestão"]
  },
  {
    id: 19,
    title: "Gestão de Riscos em Projetos",
    summary: "Identificação, análise e resposta a riscos.",
    area: "Negócios & Finanças",
    program: "PMP Certification",
    competency: "Monitoramento",
    difficulty: "Intermediário",
    estimatedMinutes: 45,
    tags: ["pmp", "risco", "gestão"]
  },
];

// ============================================================================
// DEMO PERSONAS (for demos, onboarding, and investor pitches)
// ============================================================================

interface DemoPersona {
  id: string;
  name: string;
  age: number;
  goal: string;
  profile: string;
  activeProgram: string;
  activeProgramId: number;
  weeklyGoalMinutes: number;
  studyFocus: string[];
  painPoints: string[];
  narrative: string;
  avatar: string;
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "bacen",
    name: "Lucas Almeida",
    age: 27,
    goal: "Aprovação no concurso do BACEN",
    profile: "Concursos Públicos",
    activeProgram: "BACEN",
    activeProgramId: 1,
    weeklyGoalMinutes: 600,
    studyFocus: ["Economia", "Sistema Financeiro", "Raciocínio Lógico"],
    painPoints: [
      "Dificuldade em manter constância",
      "Muitos conteúdos dispersos",
      "Pouco feedback de progresso"
    ],
    narrative: "O Lucas usa o StudAI para transformar um edital complexo em um plano semanal executável.",
    avatar: "LA"
  },
  {
    id: "data",
    name: "Mariana Costa",
    age: 29,
    goal: "Primeira vaga como Data Analyst",
    profile: "Transição de Carreira",
    activeProgram: "Data Analyst",
    activeProgramId: 6,
    weeklyGoalMinutes: 480,
    studyFocus: ["SQL", "Python", "Estatística"],
    painPoints: [
      "Não sabe o que estudar primeiro",
      "Quer comprovar progresso",
      "Quer estudar com foco em empregabilidade"
    ],
    narrative: "A Mariana usa o StudAI como um roadmap guiado para entrar em dados, com recomendações baseadas em objetivos reais.",
    avatar: "MC"
  },
  {
    id: "cfa",
    name: "Rafael Santos",
    age: 31,
    goal: "Aprovação no CFA Level I",
    profile: "Certificações Profissionais",
    activeProgram: "CFA Level I",
    activeProgramId: 3,
    weeklyGoalMinutes: 420,
    studyFocus: ["Ethics", "Financial Reporting", "Quantitative Methods"],
    painPoints: [
      "Conteúdo extenso em inglês",
      "Precisa conciliar com trabalho",
      "Quer acompanhar progresso por tópico"
    ],
    narrative: "O Rafael usa o StudAI para organizar seu estudo do CFA em blocos semanais, com revisões espaçadas.",
    avatar: "RS"
  }
];

// ============================================================================
// GOALS (Professional Goals)
// ============================================================================

const defaultGoals: Goals = {
  dailyGoal: 60,
  weeklyGoal: 300,
  completed: 35,
  activeProgramId: 3,
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

// ============================================================================
// NAVIGATION CONFIG (Grouped by context)
// ============================================================================

const NAV_SECTIONS = [
  { id: "aprender", label: "Aprender" },
  { id: "progresso", label: "Progresso" },
  { id: "analytics", label: "Analytics" },
  { id: "ferramentas", label: "Ferramentas" },
] as const;

const createNavItems = (bookmarkCount: number, planCount: number, reviewCount: number): NavItem[] => [
  // Aprender
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "aprender" },
  { id: "trilha", label: "Visão da Trilha", icon: Layers, section: "aprender" },
  { id: "programas", label: "Programas", icon: GraduationCap, section: "aprender" },
  { id: "conteudos", label: "Conteúdos", icon: FolderOpen, section: "aprender" },
  { id: "ia", label: "Assistente IA", icon: Bot, section: "aprender" },
  
  // Progresso
  { id: "sessoes", label: "Sessões", icon: Clock, section: "progresso" },
  { id: "calendario", label: "Calendário", icon: CalendarDays, section: "progresso" },
  { id: "metas", label: "Metas", icon: Target, section: "progresso", badgeCount: planCount > 0 ? planCount : undefined },
  { id: "revisoes", label: "Revisões", icon: RotateCw, section: "progresso", badgeCount: reviewCount > 0 ? reviewCount : undefined },
  
  // Analytics (Investor-focused)
  { id: "relatorios", label: "Relatórios", icon: BarChart3, section: "analytics" },
  { id: "roi", label: "ROI de Estudo", icon: TrendUp, section: "analytics" },
  { id: "engajamento", label: "Engajamento", icon: Zap, section: "analytics" },
  
  // Ferramentas
  { id: "salvos", label: "Salvos", icon: Star, section: "ferramentas", badgeCount: bookmarkCount > 0 ? bookmarkCount : undefined },
  { id: "config", label: "Configurações", icon: Settings, section: "ferramentas" },
];

const BOTTOM_NAV_ITEMS: { id: ViewId; icon: any; label: string }[] = [
  { id: "dashboard", icon: Home, label: "Início" },
  { id: "programas", icon: GraduationCap, label: "Programas" },
  { id: "sessoes", icon: Clock, label: "Sessões" },
  { id: "ia", icon: Bot, label: "IA" },
];

// ============================================================================
// STORAGE HELPERS
// ============================================================================

const STORAGE_KEYS = {
  sessions: "studai_sessions_v2",
  programs: "studai_programs_v3", // Updated for new fields
  goals: "studai_goals_v2",
  streak: "studai_streak",
  searchHistory: "studai_search_history",
  bookmarks: "studai_bookmarks_v2",
  sidebarCollapsed: "studai_sidebar_collapsed",
  planItems: "studai_plan_items_v2",
  calendarMonth: "studai_calendar_month",
  chartRange: "studai_chart_range",
  reviews: "studai_reviews",
  trailData: "studai_trail_data", // TODO API: Trail content data
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

function parseQuizResult(result: string): { correct: number; total: number } | null {
  if (!result) return null;
  const match = result.match(/(\d+)\s*\/\s*(\d+)/);
  if (match) {
    return { correct: parseInt(match[1]), total: parseInt(match[2]) };
  }
  return null;
}

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function estimateCompletion(progress: number, enrolledDays: number): string {
  if (progress === 0 || enrolledDays === 0) return "—";
  const rate = progress / enrolledDays;
  const remaining = (100 - progress) / rate;
  if (remaining < 7) return "< 1 semana";
  if (remaining < 30) return `~${Math.ceil(remaining / 7)} semanas`;
  return `~${Math.ceil(remaining / 30)} meses`;
}

// ============================================================================
// GLOBAL SEARCH
// ============================================================================

interface SearchResult {
  type: "program" | "session" | "content";
  id: number | string;
  title: string;
  subtitle: string;
  viewId: ViewId;
}

function globalSearch(query: string, programs: Program[], sessions: Session[], contents: ContentItem[]): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];
  
  (programs || []).forEach((p) => {
    if (p.name.toLowerCase().includes(q) || (p.competencies || []).some((c) => c.toLowerCase().includes(q))) {
      results.push({ type: "program", id: p.id, title: p.name, subtitle: `${p.progress}% concluído`, viewId: "programas" });
    }
  });
  
  (sessions || []).slice(0, 20).forEach((s) => {
    if (s.topic.toLowerCase().includes(q) || (s.tags || []).some((t) => t.includes(q))) {
      results.push({ type: "session", id: s.id, title: s.topic, subtitle: `${formatDateBR(s.date)} • ${s.duration}min`, viewId: "sessoes" });
    }
  });
  
  contents.forEach((c) => {
    if (c.title.toLowerCase().includes(q) || c.tags.some((t) => t.includes(q))) {
      results.push({ type: "content", id: c.id, title: c.title, subtitle: c.program || c.competency, viewId: "conteudos" });
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

const StatCard = ({ icon, value, label, sublabel, trend, accent }: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
  trend?: { value: number; positive: boolean };
  accent?: boolean;
}) => (
  <div className={`rounded-2xl border p-5 hover:shadow-md transition-shadow ${accent ? "bg-primary text-primary-foreground" : "bg-card"}`}>
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent ? "bg-white/20" : "bg-accent/10"}`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${accent ? "bg-white/20" : trend.positive ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
          {trend.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend.value)}%
        </div>
      )}
    </div>
    <p className={`text-2xl font-bold mb-1 ${accent ? "" : "text-card-foreground"}`}>{value}</p>
    <p className={`text-sm font-medium ${accent ? "opacity-90" : "text-card-foreground"}`}>{label}</p>
    <p className={`text-xs ${accent ? "opacity-75" : "text-muted-foreground"}`}>{sublabel}</p>
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

const ProgressRing = ({ progress, size = 80, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-accent transition-all duration-500"
      />
    </svg>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

const Dashboard = () => {
  const { addToast } = useToast();

  // Persisted state
  const [sessions, setSessions] = usePersistedState<Session[]>(STORAGE_KEYS.sessions, defaultSessions);
  const [programs, setPrograms] = usePersistedState<Program[]>(STORAGE_KEYS.programs, defaultPrograms);
  const [goals, setGoals] = usePersistedState<Goals>(STORAGE_KEYS.goals, defaultGoals);
  const [streak, setStreak] = usePersistedState<number>(STORAGE_KEYS.streak, 12);
  const [bookmarks, setBookmarks] = usePersistedState<BookmarkedContent[]>(STORAGE_KEYS.bookmarks, []);
  const [sidebarCollapsed, setSidebarCollapsed] = usePersistedState<boolean>(STORAGE_KEYS.sidebarCollapsed, false);
  const [planItems, setPlanItems] = usePersistedState<PlanItem[]>(STORAGE_KEYS.planItems, []);
  const [searchHistory, setSearchHistory] = usePersistedState<SavedSearch[]>(STORAGE_KEYS.searchHistory, []);
  const [reviews, setReviews] = usePersistedState<ReviewItem[]>(STORAGE_KEYS.reviews, []);
  const [calendarMonth, setCalendarMonth] = usePersistedState<string>(STORAGE_KEYS.calendarMonth, 
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  );
  const [chartRange, setChartRange] = usePersistedState<number>(STORAGE_KEYS.chartRange, 7);
  const [trailData, setTrailData] = usePersistedState<TrailData[]>(STORAGE_KEYS.trailData, []);

  // UI state
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<AreaId | "all">("all");
  const [selectedPersona, setSelectedPersona] = useState<DemoPersona | null>(null);
  
  // Trail modals
  const [editDatesModalOpen, setEditDatesModalOpen] = useState(false);
  const [editDatesForm, setEditDatesForm] = useState({ startDate: "", targetEndDate: "" });
  const [expandedCompetencies, setExpandedCompetencies] = useState<Set<string>>(new Set());

  // Global search
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const globalSearchRef = useRef<HTMLDivElement>(null);

  // Session modal
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessionForm, setSessionForm] = useState({
    programId: "", topic: "", duration: "", type: "Conceitual" as Session["type"], result: "", notes: "", date: new Date().toISOString().split("T")[0], tags: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteConfirmSession, setDeleteConfirmSession] = useState<Session | null>(null);

  // Calendar selected day
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string | null>(null);

  // AI search
  const [aiQuery, setAiQuery] = useState("");
  const [aiResults, setAiResults] = useState<ContentItem[]>([]);
  const [aiFilters, setAiFilters] = useState({ programId: "all", level: "all" });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState<"search" | "recommend">("search");

  // Content filters
  const [contentFilters, setContentFilters] = useState({ programId: "all", level: "all", search: "" });

  // Session filters
  const [sessionFilters, setSessionFilters] = useState({ programId: "all", type: "all", search: "" });

  // Sorted sessions
  const sortedSessions = useMemo(() => sortSessions(sessions || []), [sessions]);

  // Active program
  const activeProgram = useMemo(() => {
    if (!goals?.activeProgramId) return null;
    return (programs || []).find((p) => p.id === goals.activeProgramId) || null;
  }, [goals, programs]);

  // Pending reviews count
  const pendingReviewsCount = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return (reviews || []).filter((r) => r.nextReview <= today).length;
  }, [reviews]);

  // Nav items with badge counts
  const navItems = useMemo(() => 
    createNavItems((bookmarks || []).length, (planItems || []).filter((p) => !p.completed).length, pendingReviewsCount),
    [bookmarks, planItems, pendingReviewsCount]
  );

  // Global search results
  const searchResults = useMemo(() => 
    globalSearch(globalSearchQuery, programs || [], sortedSessions || [], contentDatabase),
    [globalSearchQuery, programs, sortedSessions]
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

  const maxChartValue = Math.max(...chartData.map((d) => d.minutes), goals?.dailyGoal || 60);

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

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    let results = sortedSessions;
    if (sessionFilters.programId !== "all") {
      results = results.filter((s) => s.programId === parseInt(sessionFilters.programId));
    }
    if (sessionFilters.type !== "all") {
      results = results.filter((s) => s.type === sessionFilters.type);
    }
    if (sessionFilters.search.trim()) {
      const q = sessionFilters.search.toLowerCase();
      results = results.filter((s) => s.topic.toLowerCase().includes(q) || (s.tags || []).some((t) => t.includes(q)));
    }
    return results;
  }, [sortedSessions, sessionFilters]);

  // Filtered content
  const filteredContent = useMemo(() => {
    let results = contentDatabase;
    if (contentFilters.programId !== "all") {
      results = results.filter((c) => c.program === contentFilters.programId);
    }
    if (contentFilters.level !== "all") {
      results = results.filter((c) => c.difficulty === contentFilters.level);
    }
    if (contentFilters.search.trim()) {
      const q = contentFilters.search.toLowerCase();
      results = results.filter((c) => c.title.toLowerCase().includes(q) || c.tags.some((t) => t.includes(q)));
    }
    return results;
  }, [contentFilters]);

  // Filtered programs
  const filteredPrograms = useMemo(() => {
    if (selectedAreaFilter === "all") return programs || [];
    return (programs || []).filter((p) => p.areaId === selectedAreaFilter);
  }, [programs, selectedAreaFilter]);

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
    setPrograms(defaultPrograms);
    setGoals(defaultGoals);
    setStreak(12);
    setBookmarks([]);
    setPlanItems([]);
    setReviews([]);
    setSelectedPersona(null);
    addToast({ message: "Dados restaurados", type: "success" });
  };

  const generateDemoDataForPersona = (persona: DemoPersona) => {
    const random = seededRandom(42);
    const newSessions: Session[] = [];
    
    // Topics based on persona's study focus
    const topicsMap: Record<string, string[]> = {
      bacen: ["Política Monetária", "Sistema Financeiro Nacional", "Economia Brasileira", "Raciocínio Lógico", "Matemática Financeira", "Direito Administrativo"],
      data: ["SQL Avançado - Joins", "Python Pandas", "Estatística Descritiva", "Visualização de Dados", "Machine Learning Intro", "Git & GitHub"],
      cfa: ["Ethics & Standards", "Quantitative Methods", "Financial Reporting", "Corporate Finance", "Equity Valuation", "Fixed Income", "Derivatives"]
    };
    
    const topics = topicsMap[persona.id] || topicsMap.cfa;
    const types: Session["type"][] = ["Conceitual", "Exercícios", "Simulado", "Revisão", "Projeto"];
    
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
            topic: topics[Math.floor(random() * topics.length)],
            programId: persona.activeProgramId,
            duration: Math.floor(random() * 60) + 15,
            type: types[Math.floor(random() * types.length)],
            result: random() > 0.5 ? `Quiz ${Math.floor(random() * 4) + 6}/10` : "",
            notes: "",
            tags: persona.studyFocus.map(s => s.toLowerCase().replace(/\s/g, "-")),
          });
        }
      }
    }
    
    // Update goals based on persona
    const newGoals: Goals = {
      ...defaultGoals,
      weeklyGoal: persona.weeklyGoalMinutes,
      dailyGoal: Math.round(persona.weeklyGoalMinutes / 5),
      activeProgramId: persona.activeProgramId,
      weeklyPlan: defaultGoals.weeklyPlan.map((day, i) => ({
        ...day,
        target: i < 5 ? Math.round(persona.weeklyGoalMinutes / 5) : i === 5 ? 30 : 0,
        completed: random() > 0.4 ? Math.floor(random() * day.target) + Math.floor(day.target * 0.5) : 0
      }))
    };
    
    // Update active program progress
    const updatedPrograms = (programs || defaultPrograms).map(p => 
      p.id === persona.activeProgramId 
        ? { ...p, progress: Math.floor(random() * 30) + 35, status: "Em andamento" as const, enrolledAt: Date.now() - 90 * 86400000 }
        : p
    );
    
    setSessions(sortSessions(newSessions));
    setGoals(newGoals);
    setPrograms(updatedPrograms);
    setStreak(Math.floor(random() * 20) + 5);
    setSelectedPersona(persona);
    addToast({ message: `Dados de ${persona.name} gerados`, type: "success" });
  };

  const generateDemoData = () => {
    // Default to first persona if none selected
    generateDemoDataForPersona(DEMO_PERSONAS[0]);
  };

  const openNewSessionModal = (prefilledDate?: string) => {
    setEditingSession(null);
    setSessionForm({
      programId: goals?.activeProgramId?.toString() || "", topic: "", duration: "", type: "Conceitual", result: "", notes: "",
      date: prefilledDate || new Date().toISOString().split("T")[0], tags: "",
    });
    setFormErrors({});
    setSessionModalOpen(true);
  };

  const openEditSessionModal = (session: Session) => {
    setEditingSession(session);
    setSessionForm({
      programId: session.programId.toString(),
      topic: session.topic,
      duration: session.duration.toString(),
      type: session.type,
      result: session.result,
      notes: session.notes,
      date: session.date,
      tags: (session.tags || []).join(", "),
    });
    setFormErrors({});
    setSessionModalOpen(true);
  };

  const validateSessionForm = () => {
    const errors: Record<string, string> = {};
    if (!sessionForm.programId) errors.programId = "Selecione um programa";
    if (!sessionForm.topic.trim()) errors.topic = "Digite o tópico";
    if (!sessionForm.duration || parseInt(sessionForm.duration) < 1) errors.duration = "Duração inválida";
    if (!sessionForm.date) errors.date = "Selecione a data";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveSession = () => {
    if (!validateSessionForm()) return;

    const programId = parseInt(sessionForm.programId);
    const duration = parseInt(sessionForm.duration);
    const today = new Date().toISOString().split("T")[0];
    const tags = sessionForm.tags.split(",").map((t) => t.trim().toLowerCase()).filter((t) => t);

    if (editingSession) {
      setSessions((prev) => sortSessions((prev || []).map((s) => s.id === editingSession.id ? { ...s, ...sessionForm, programId, duration, tags } : s)));
      addToast({ message: "Sessão atualizada", type: "success" });
    } else {
      const newSession: Session = {
        id: Date.now().toString(), date: sessionForm.date, createdAt: Date.now(),
        topic: sessionForm.topic, programId, duration, type: sessionForm.type, result: sessionForm.result, notes: sessionForm.notes, tags,
      };
      setSessions((prev) => sortSessions([newSession, ...(prev || [])]));
      
      // Update program progress
      setPrograms((prev) => (prev || []).map((p) => {
        if (p.id === programId) {
          const newProgress = Math.min(100, p.progress + 1);
          return { ...p, progress: newProgress, status: newProgress === 100 ? "Concluído" : "Em andamento" };
        }
        return p;
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

  const addToReview = (content: ContentItem) => {
    const exists = (reviews || []).find((r) => r.contentId === content.id);
    if (exists) {
      addToast({ message: "Já está nas revisões", type: "info" });
      return;
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setReviews((prev) => [...(prev || []), {
      id: Date.now().toString(),
      contentId: content.id,
      topic: content.title,
      programId: 0, // Legacy field - using content.program now
      nextReview: tomorrow.toISOString().split("T")[0],
      interval: 1,
      completedReviews: 0,
    }]);
    addToast({ message: "Adicionado às revisões", type: "success" });
  };

  const completeReview = (reviewId: string) => {
    setReviews((prev) => (prev || []).map((r) => {
      if (r.id === reviewId) {
        const intervals = [1, 3, 7, 14, 30];
        const nextIntervalIndex = Math.min(r.completedReviews + 1, intervals.length - 1);
        const nextInterval = intervals[nextIntervalIndex];
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + nextInterval);
        return {
          ...r,
          nextReview: nextDate.toISOString().split("T")[0],
          interval: nextInterval,
          completedReviews: r.completedReviews + 1,
        };
      }
      return r;
    }));
    addToast({ message: "Revisão concluída", type: "success" });
  };

  const removePlanItem = (id: string) => {
    setPlanItems((prev) => (prev || []).filter((p) => p.id !== id));
  };

  const togglePlanComplete = (id: string) => {
    setPlanItems((prev) => (prev || []).map((p) => p.id === id ? { ...p, completed: !p.completed } : p));
  };

  const setActiveProgram = (programId: number) => {
    setGoals((prev) => ({ ...prev, activeProgramId: programId }));
    addToast({ message: "Programa ativo atualizado", type: "success" });
  };

  const isBookmarked = (id: number) => (bookmarks || []).some((b) => b.id === id);
  const isInPlan = (id: number) => (planItems || []).some((p) => p.contentId === id);
  const isInReview = (id: number) => (reviews || []).some((r) => r.contentId === id);

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
    if (aiFilters.programId !== "all") {
      results = results.filter((c) => c.program === aiFilters.programId);
    }
    if (aiFilters.level !== "all") {
      results = results.filter((c) => c.difficulty === aiFilters.level);
    }
    setAiResults(results);
    setAiLoading(false);
  }, [aiQuery, aiFilters]);

  // Get AI recommendations
  const getAiRecommendations = useCallback(() => {
    if (!activeProgram) return [];
    return contentDatabase.filter((c) => c.program === activeProgram.name).slice(0, 5);
  }, [activeProgram]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
            <Brain size={24} className="text-white" />
          </div>
          <Loader2 size={24} className="animate-spin text-accent mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-card border-r z-40 hidden lg:flex flex-col transition-all duration-200
          ${sidebarCollapsed ? "w-[72px]" : "w-64"}
        `}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <Brain size={20} className="text-white" />
            </div>
            {!sidebarCollapsed && <span className="font-bold text-lg text-card-foreground">StudAI</span>}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-muted rounded-lg shrink-0"
            aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
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
                        ${isActive ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-card-foreground hover:bg-muted"}
                      `}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full" />
                      )}
                      <item.icon size={20} className="shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badgeCount && <Badge variant="count">{item.badgeCount}</Badge>}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {userData.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{userData.name}</p>
                <p className="text-xs text-muted-foreground">{userData.plan}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

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
                        w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all relative
                        ${isActive ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-card-foreground hover:bg-muted"}
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full" />
                      )}
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
                placeholder="Buscar programas, sessões, conteúdos..."
                value={globalSearchQuery}
                onChange={(e) => { setGlobalSearchQuery(e.target.value); setGlobalSearchOpen(true); }}
                onFocus={() => setGlobalSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              {/* Search Dropdown */}
              {globalSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-xl shadow-lg overflow-hidden z-50">
                  {["program", "session", "content"].map((type) => {
                    const typeResults = searchResults.filter((r) => r.type === type);
                    if (typeResults.length === 0) return null;
                    return (
                      <div key={type}>
                        <p className="px-4 py-2 text-[11px] font-semibold uppercase text-muted-foreground bg-muted/50">
                          {type === "program" ? "Programas" : type === "session" ? "Sessões" : "Conteúdos"}
                        </p>
                        {typeResults.map((result) => (
                          <button
                            key={`${result.type}-${result.id}`}
                            onClick={() => handleGlobalSearchSelect(result)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted text-left transition-colors"
                          >
                            {result.type === "program" && <GraduationCap size={16} className="text-muted-foreground" />}
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

              {/* Active Program Card */}
              {activeProgram && (
                <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-sm opacity-80 mb-1">Programa ativo</p>
                      <h2 className="text-xl font-bold mb-2">{activeProgram.name}</h2>
                      <p className="text-sm opacity-90 mb-4">{activeProgram.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5">
                          <TrendUp size={16} />
                          {activeProgram.progress}% concluído
                        </span>
                        {activeProgram.enrolledAt && (
                          <span className="opacity-75">
                            Conclusão estimada: {estimateCompletion(activeProgram.progress, Math.floor((Date.now() - activeProgram.enrolledAt) / 86400000))}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <ProgressRing progress={activeProgram.progress} size={100} strokeWidth={8} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{activeProgram.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  icon={<Flame size={20} className="text-accent" />} 
                  value={`${streak}`} 
                  label="Dias consecutivos" 
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
                  icon={<Award size={20} className="text-accent" />} 
                  value={(programs || []).filter((p) => p.status === "Concluído").length.toString()} 
                  label="Programas concluídos" 
                  sublabel={`de ${(programs || []).length}`} 
                />
                <StatCard 
                  icon={<RotateCw size={20} className="text-primary" />} 
                  value={pendingReviewsCount.toString()} 
                  label="Revisões pendentes" 
                  sublabel="para hoje" 
                />
              </div>

              {/* Chart + Quick Links */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-card border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <h2 className="font-semibold text-card-foreground">Tempo investido</h2>
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
                        { icon: GraduationCap, label: "Ver programas", onClick: () => navigate("programas") },
                        { icon: Bot, label: "Perguntar à IA", onClick: () => navigate("ia") },
                        { icon: RotateCw, label: "Iniciar revisão", onClick: () => navigate("revisoes") },
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
                    description="Comece registrando sua primeira sessão"
                    action={{ label: "Iniciar sessão", onClick: () => openNewSessionModal() }}
                  />
                ) : (
                  <div className="space-y-2">
                    {(sortedSessions || []).slice(0, 5).map((s) => {
                      const program = (programs || []).find((p) => p.id === s.programId);
                      return (
                        <div key={s.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <BookOpen size={18} className="text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-card-foreground truncate">{s.topic}</p>
                            <p className="text-xs text-muted-foreground">{program?.name} • {s.duration}min • {s.type}</p>
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

          {/* ====== PROGRAMAS VIEW ====== */}
          {activeView === "programas" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Programas</h1>
                <p className="text-muted-foreground">Trilhas de aprendizado orientadas a objetivos</p>
              </div>

              {/* Area filters */}
              <div className="flex flex-wrap gap-2 p-4 bg-card border rounded-2xl">
                <button
                  onClick={() => setSelectedAreaFilter("all")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${selectedAreaFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
                >
                  Todos
                </button>
                {AREAS.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => setSelectedAreaFilter(area.id)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${selectedAreaFilter === area.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
                  >
                    <area.icon size={16} />
                    {area.name}
                  </button>
                ))}
              </div>
              
              <div className="space-y-4">
                {filteredPrograms.length === 0 ? (
                  <EmptyState icon={GraduationCap} title="Nenhum programa encontrado" description="Ajuste os filtros de área" />
                ) : (
                  filteredPrograms.map((program) => {
                    const area = AREAS.find((a) => a.id === program.areaId);
                    const isActive = goals?.activeProgramId === program.id;
                    return (
                      <div key={program.id} className={`bg-card border rounded-2xl p-5 hover:shadow-md transition-shadow ${isActive ? "ring-2 ring-accent" : ""}`}>
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-2">
                              {area && (
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <area.icon size={14} />
                                  {area.name}
                                </span>
                              )}
                              {isActive && <Badge variant="accent">Ativo</Badge>}
                            </div>
                            <h3 className="text-lg font-semibold text-card-foreground mb-1">{program.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{program.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="outline">{program.duration}</Badge>
                              <Badge variant={program.status === "Concluído" ? "accent" : "muted"}>{program.status}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(program.competencies || []).slice(0, 4).map((comp) => (
                                <span key={comp} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{comp}</span>
                              ))}
                              {(program.competencies || []).length > 4 && (
                                <span className="text-xs text-muted-foreground">+{program.competencies.length - 4}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-card-foreground">{program.progress}%</p>
                              <p className="text-xs text-muted-foreground">concluído</p>
                            </div>
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-accent rounded-full" style={{ width: `${program.progress}%` }} />
                            </div>
                            {!isActive && program.status !== "Concluído" && (
                              <button
                                onClick={() => setActiveProgram(program.id)}
                                className="px-3 py-2 text-sm font-medium bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
                              >
                                Definir como ativo
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ====== SESSÕES VIEW ====== */}
          {activeView === "sessoes" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">Sessões</h1>
                  <p className="text-muted-foreground">Histórico de atividades</p>
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
                    placeholder="Buscar por tópico ou tag..."
                    value={sessionFilters.search}
                    onChange={(e) => setSessionFilters((f) => ({ ...f, search: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2.5 bg-secondary border-0 rounded-xl text-sm"
                  />
                </div>
                <select
                  value={sessionFilters.programId}
                  onChange={(e) => setSessionFilters((f) => ({ ...f, programId: e.target.value }))}
                  className="px-3 py-2.5 bg-secondary border-0 rounded-xl text-sm"
                >
                  <option value="all">Todos programas</option>
                  {(programs || []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select
                  value={sessionFilters.type}
                  onChange={(e) => setSessionFilters((f) => ({ ...f, type: e.target.value }))}
                  className="px-3 py-2.5 bg-secondary border-0 rounded-xl text-sm"
                >
                  <option value="all">Tipo</option>
                  <option value="Conceitual">Conceitual</option>
                  <option value="Exercícios">Exercícios</option>
                  <option value="Simulado">Simulado</option>
                  <option value="Revisão">Revisão</option>
                  <option value="Projeto">Projeto</option>
                </select>
              </div>

              {/* Sessions List */}
              {filteredSessions.length === 0 ? (
                <EmptyState 
                  icon={Clock} 
                  title="Nenhuma sessão encontrada" 
                  description="Ajuste os filtros ou registre sua primeira sessão"
                  action={{ label: "Nova sessão", onClick: () => openNewSessionModal() }}
                />
              ) : (
                <div className="space-y-3">
                  {filteredSessions.map((session) => {
                    const program = (programs || []).find((p) => p.id === session.programId);
                    return (
                      <div key={session.id} className="bg-card border rounded-2xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                            {session.type === "Simulado" && <Trophy size={20} className="text-accent" />}
                            {session.type === "Revisão" && <RotateCw size={20} className="text-accent" />}
                            {session.type === "Projeto" && <Layers size={20} className="text-accent" />}
                            {(session.type === "Conceitual" || session.type === "Exercícios") && <BookOpen size={20} className="text-accent" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-card-foreground">{session.topic}</h3>
                                <p className="text-sm text-muted-foreground">{program?.name || "Programa desconhecido"}</p>
                              </div>
                              <Dropdown
                                trigger={
                                  <button className="p-2 hover:bg-muted rounded-lg" aria-label="Ações">
                                    <MoreVertical size={16} className="text-muted-foreground" />
                                  </button>
                                }
                              >
                                <DropdownItem icon={Edit3} label="Editar" onClick={() => openEditSessionModal(session)} />
                                <DropdownItem icon={Trash2} label="Excluir" onClick={() => setDeleteConfirmSession(session)} danger />
                              </Dropdown>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                              <span className="text-sm text-muted-foreground">{formatFullDateBR(session.date)}</span>
                              <span className="text-sm font-medium text-card-foreground">{session.duration}min</span>
                              <Badge variant="outline">{session.type}</Badge>
                              {session.result && <Badge>{session.result}</Badge>}
                            </div>
                            {(session.tags || []).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {session.tags.map((tag) => (
                                  <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ====== CALENDARIO VIEW ====== */}
          {activeView === "calendario" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Calendário</h1>
                <p className="text-muted-foreground">Visualize sua consistência</p>
              </div>

              <div className="bg-card border rounded-2xl p-5">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => {
                      const d = new Date(calendarYear, calendarMonthNum - 2, 1);
                      setCalendarMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
                    }}
                    className="p-2 hover:bg-muted rounded-lg"
                    aria-label="Mês anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="font-semibold text-card-foreground">
                    {new Date(calendarYear, calendarMonthNum - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                  </h2>
                  <button
                    onClick={() => {
                      const d = new Date(calendarYear, calendarMonthNum, 1);
                      setCalendarMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
                    }}
                    className="p-2 hover:bg-muted rounded-lg"
                    aria-label="Próximo mês"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">{day}</div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, i) => {
                    const dateStr = date.toISOString().split("T")[0];
                    const isCurrentMonth = date.getMonth() === calendarMonthNum - 1;
                    const isToday = dateStr === new Date().toISOString().split("T")[0];
                    const daySessions = sessionsByDate.get(dateStr) || [];
                    const dayMinutes = daySessions.reduce((a, s) => a + s.duration, 0);
                    const isSelected = selectedCalendarDay === dateStr;

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedCalendarDay(isSelected ? null : dateStr)}
                        className={`
                          aspect-square p-1 rounded-lg text-sm transition-colors relative
                          ${isCurrentMonth ? "text-card-foreground" : "text-muted-foreground/50"}
                          ${isToday ? "ring-2 ring-accent" : ""}
                          ${isSelected ? "bg-accent/20" : "hover:bg-muted"}
                          ${daySessions.length > 0 ? "font-medium" : ""}
                        `}
                      >
                        <span className="block">{date.getDate()}</span>
                        {daySessions.length > 0 && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected day sessions */}
              {selectedCalendarDay && (
                <div className="bg-card border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-card-foreground">
                      {new Date(selectedCalendarDay + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
                    </h3>
                    <button
                      onClick={() => openNewSessionModal(selectedCalendarDay)}
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      + Nova sessão
                    </button>
                  </div>
                  {(sessionsByDate.get(selectedCalendarDay) || []).length === 0 ? (
                    <p className="text-muted-foreground text-sm">Nenhuma sessão neste dia</p>
                  ) : (
                    <div className="space-y-2">
                      {(sessionsByDate.get(selectedCalendarDay) || []).map((s) => {
                        const program = (programs || []).find((p) => p.id === s.programId);
                        return (
                          <div key={s.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-card-foreground truncate">{s.topic}</p>
                              <p className="text-xs text-muted-foreground">{program?.name} • {s.type}</p>
                            </div>
                            <span className="text-sm font-medium text-card-foreground">{s.duration}min</span>
                          </div>
                        );
                      })}
                      <p className="text-sm text-muted-foreground mt-2">
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
                <h1 className="text-2xl font-bold text-card-foreground">Metas</h1>
                <p className="text-muted-foreground">Configure suas metas de aprendizado</p>
              </div>

              {/* Goals settings */}
              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Configurações</h2>
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
                    action={{ label: "Ver conteúdos", onClick: () => navigate("conteudos") }}
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
                            <p className="text-xs text-muted-foreground">{content.program}</p>
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

          {/* ====== REVISOES VIEW ====== */}
          {activeView === "revisoes" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Revisões</h1>
                <p className="text-muted-foreground">Spaced repetition para fixação</p>
              </div>

              {/* Pending reviews */}
              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Para hoje ({pendingReviewsCount})</h2>
                {pendingReviewsCount === 0 ? (
                  <EmptyState 
                    icon={RotateCw} 
                    title="Nenhuma revisão pendente" 
                    description="Adicione conteúdos às revisões para começar"
                    action={{ label: "Ver conteúdos", onClick: () => navigate("conteudos") }}
                  />
                ) : (
                  <div className="space-y-3">
                    {(reviews || [])
                      .filter((r) => r.nextReview <= new Date().toISOString().split("T")[0])
                      .map((review) => {
                        const program = (programs || []).find((p) => p.id === review.programId);
                        return (
                          <div key={review.id} className="flex items-center gap-4 p-4 bg-accent/5 rounded-xl">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                              <RotateCw size={18} className="text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-card-foreground truncate">{review.topic}</p>
                              <p className="text-xs text-muted-foreground">{program?.name} • Revisão #{review.completedReviews + 1}</p>
                            </div>
                            <button
                              onClick={() => completeReview(review.id)}
                              className="px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-lg hover:opacity-90"
                            >
                              Concluir
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Upcoming reviews */}
              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Próximas revisões</h2>
                {(reviews || []).filter((r) => r.nextReview > new Date().toISOString().split("T")[0]).length === 0 ? (
                  <p className="text-muted-foreground text-sm">Nenhuma revisão agendada</p>
                ) : (
                  <div className="space-y-2">
                    {(reviews || [])
                      .filter((r) => r.nextReview > new Date().toISOString().split("T")[0])
                      .sort((a, b) => a.nextReview.localeCompare(b.nextReview))
                      .slice(0, 10)
                      .map((review) => {
                        const program = (programs || []).find((p) => p.id === review.programId);
                        return (
                          <div key={review.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-card-foreground truncate">{review.topic}</p>
                              <p className="text-xs text-muted-foreground">{program?.name}</p>
                            </div>
                            <span className="text-sm text-muted-foreground">{formatDateBR(review.nextReview)}</span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====== CONTEÚDOS VIEW ====== */}
          {activeView === "conteudos" && (
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
                  value={contentFilters.programId}
                  onChange={(e) => setContentFilters((f) => ({ ...f, programId: e.target.value }))}
                  className="px-3 py-2.5 bg-secondary border-0 rounded-xl text-sm"
                >
                  <option value="all">Todos programas</option>
                  {(programs || []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select
                  value={contentFilters.level}
                  onChange={(e) => setContentFilters((f) => ({ ...f, level: e.target.value }))}
                  className="px-3 py-2.5 bg-secondary border-0 rounded-xl text-sm"
                >
                  <option value="all">Nível</option>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>

              {/* Content List */}
              {filteredContent.length === 0 ? (
                <EmptyState icon={FolderOpen} title="Nenhum conteúdo encontrado" description="Ajuste os filtros de busca" />
              ) : (
                <div className="grid gap-4">
                  {filteredContent.map((content) => {
                    return (
                      <div key={content.id} className="bg-card border rounded-2xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                            <FileText size={20} className="text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-card-foreground mb-1">{content.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{content.summary}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge>{content.program}</Badge>
                              <Badge variant="outline">{content.difficulty}</Badge>
                              <Badge variant="muted">{content.estimatedMinutes}min</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => addToPlan(content)}
                              disabled={isInPlan(content.id)}
                              className="px-3 py-2 text-sm font-medium bg-secondary rounded-xl disabled:opacity-50 hover:bg-muted transition-colors"
                            >
                              {isInPlan(content.id) ? "No plano" : "+ Plano"}
                            </button>
                            <button
                              onClick={() => addToReview(content)}
                              disabled={isInReview(content.id)}
                              className="p-2 hover:bg-muted rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
                              aria-label="Adicionar às revisões"
                              title="Adicionar às revisões"
                            >
                              <RotateCw size={18} className={isInReview(content.id) ? "text-accent" : "text-muted-foreground"} />
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
                    );
                  })}
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
                  Assistente de Aprendizado
                </h1>
                <p className="text-muted-foreground mt-1">Pergunte qualquer coisa ou receba recomendações</p>
              </div>

              {/* Mode toggle */}
              <div className="flex gap-2 p-1 bg-muted rounded-xl w-fit">
                <button
                  onClick={() => setAiMode("search")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${aiMode === "search" ? "bg-card shadow-sm text-card-foreground" : "text-muted-foreground"}`}
                >
                  <Search size={16} className="inline mr-2" />
                  Buscar
                </button>
                <button
                  onClick={() => setAiMode("recommend")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${aiMode === "recommend" ? "bg-card shadow-sm text-card-foreground" : "text-muted-foreground"}`}
                >
                  <Lightbulb size={16} className="inline mr-2" />
                  Recomendações
                </button>
              </div>

              {aiMode === "search" ? (
                <>
                  {/* Search */}
                  <div className="bg-card border rounded-2xl p-5">
                    <div className="flex gap-2 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                          type="text"
                          placeholder="O que estudar para o CFA? Como migrar para Data?"
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
                        value={aiFilters.programId}
                        onChange={(e) => setAiFilters((f) => ({ ...f, programId: e.target.value }))}
                        className="px-3 py-2 bg-secondary border-0 rounded-xl text-sm"
                      >
                        <option value="all">Todos programas</option>
                        {(programs || []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <select
                        value={aiFilters.level}
                        onChange={(e) => setAiFilters((f) => ({ ...f, level: e.target.value }))}
                        className="px-3 py-2 bg-secondary border-0 rounded-xl text-sm"
                      >
                        <option value="all">Nível</option>
                        <option value="Iniciante">Iniciante</option>
                        <option value="Intermediário">Intermediário</option>
                        <option value="Avançado">Avançado</option>
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
                        {aiResults.map((content) => {
                          return (
                            <div key={content.id} className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-card-foreground mb-1">{content.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{content.summary}</p>
                                <div className="flex gap-2">
                                  <Badge>{content.program}</Badge>
                                  <Badge variant="outline">{content.difficulty}</Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => addToPlan(content)}
                                  className="p-2 hover:bg-card rounded-xl"
                                  aria-label="Adicionar ao plano"
                                  title="Adicionar ao plano"
                                >
                                  <Plus size={18} className="text-muted-foreground" />
                                </button>
                                <button 
                                  onClick={() => toggleBookmark(content)} 
                                  className="p-2 hover:bg-card rounded-xl"
                                  aria-label={isBookmarked(content.id) ? "Remover dos salvos" : "Salvar"}
                                >
                                  {isBookmarked(content.id) ? <BookmarkCheck size={18} className="text-accent" /> : <Bookmark size={18} className="text-muted-foreground" />}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Recommendations */}
                  <div className="bg-card border rounded-2xl p-5">
                    <h2 className="font-semibold text-card-foreground mb-4">
                      {activeProgram ? `Recomendado para ${activeProgram.name}` : "Recomendações"}
                    </h2>
                    {!activeProgram ? (
                      <EmptyState 
                        icon={GraduationCap} 
                        title="Nenhum programa ativo" 
                        description="Defina um programa ativo para receber recomendações"
                        action={{ label: "Ver programas", onClick: () => navigate("programas") }}
                      />
                    ) : (
                      <div className="space-y-3">
                        {getAiRecommendations().map((content) => (
                          <div key={content.id} className="flex items-start gap-4 p-4 bg-accent/5 rounded-xl">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                              <Lightbulb size={18} className="text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-card-foreground mb-1">{content.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{content.summary}</p>
                              <div className="flex gap-2">
                                <Badge variant="outline">{content.difficulty}</Badge>
                                <Badge variant="muted">{content.estimatedMinutes}min</Badge>
                              </div>
                            </div>
                            <button
                              onClick={() => addToPlan(content)}
                              disabled={isInPlan(content.id)}
                              className="px-3 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-lg disabled:opacity-50"
                            >
                              {isInPlan(content.id) ? "No plano" : "Estudar"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick questions */}
                  <div className="bg-card border rounded-2xl p-5">
                    <h2 className="font-semibold text-card-foreground mb-4">Perguntas frequentes</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        "O que estudar hoje?",
                        "Quais competências me faltam?",
                        "Como melhorar meu desempenho?",
                        "Revisar tópicos difíceis",
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => { setAiQuery(q); setAiMode("search"); }}
                          className="p-4 text-left bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                        >
                          <p className="font-medium text-card-foreground">{q}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
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
                  action={{ label: "Explorar conteúdos", onClick: () => navigate("conteudos") }}
                />
              ) : (
                <div className="grid gap-4">
                  {(bookmarks || []).map((b) => {
                    return (
                      <div key={b.id} className="bg-card border rounded-2xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                            <FileText size={20} className="text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-card-foreground mb-1">{b.content.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{b.content.summary}</p>
                            <div className="flex gap-2">
                              <Badge>{b.content.program}</Badge>
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
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ====== TRILHA VIEW (Trail Overview - PMF Ready) ====== */}
          {activeView === "trilha" && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {!activeProgram ? (
                <EmptyState 
                  icon={GraduationCap} 
                  title="Nenhum programa ativo" 
                  description="Defina um programa ativo para ver a visão geral da sua trilha de estudos"
                  action={{ label: "Ver programas", onClick: () => navigate("programas") }}
                />
              ) : (
                <>
                  {/* Use exact trail calculations */}
                  {(() => {
                    // TODO API: Fetch trail contents from backend
                    const currentTrailData = trailData.find(t => t.programId === activeProgram.id);
                    const trailContents: ContentNode[] = currentTrailData?.contents || [];
                    
                    // Generate mock trail contents if empty
                    const generateMockContents = (): ContentNode[] => {
                      const programContents = contentDatabase.filter(c => c.program === activeProgram.name);
                      const contentsByCompetency: Record<string, ContentItem[]> = {};
                      
                      activeProgram.competencies.forEach(comp => {
                        const items = programContents.filter(c => c.competency === comp);
                        if (items.length === 0) {
                          // Generate mock content
                          contentsByCompetency[comp] = [{
                            id: Math.random() * 10000,
                            title: `Introdução a ${comp}`,
                            summary: `Fundamentos de ${comp}`,
                            area: "Certificações Profissionais",
                            program: activeProgram.name,
                            competency: comp,
                            difficulty: "Intermediário",
                            estimatedMinutes: 45,
                            tags: []
                          }];
                        } else {
                          contentsByCompetency[comp] = items;
                        }
                      });
                      
                      return activeProgram.competencies.map((comp, idx) => {
                        const items = contentsByCompetency[comp] || [];
                        const totalMins = items.reduce((acc, i) => acc + i.estimatedMinutes, 0) || 60;
                        const progressRatio = activeProgram.progress / 100;
                        const isCompleted = idx < Math.floor(activeProgram.competencies.length * progressRatio);
                        const isInProgress = idx === Math.floor(activeProgram.competencies.length * progressRatio);
                        
                        return {
                          id: `comp_${idx}`,
                          title: comp,
                          competency: comp,
                          estimatedMinutes: totalMins,
                          status: isCompleted ? "done" : isInProgress ? "in_progress" : "not_started",
                          completedMinutes: isCompleted ? totalMins : isInProgress ? Math.round(totalMins * 0.5) : 0,
                          order: idx,
                          children: items.map((item, itemIdx) => ({
                            id: `content_${item.id}`,
                            title: item.title,
                            competency: comp,
                            estimatedMinutes: item.estimatedMinutes,
                            status: isCompleted ? "done" : (isInProgress && itemIdx === 0) ? "in_progress" : "not_started",
                            completedMinutes: isCompleted ? item.estimatedMinutes : 0,
                            order: itemIdx,
                          }))
                        } as ContentNode;
                      });
                    };
                    
                    const contents = trailContents.length > 0 ? trailContents : generateMockContents();
                    const metrics = calculateTrailMetrics(activeProgram, sessions || [], contents);
                    
                    // 7-day consistency data
                    const last7Days: { date: string; minutes: number; active: boolean }[] = [];
                    for (let i = 6; i >= 0; i--) {
                      const d = addDays(metrics.today, -i);
                      const dateStr = formatDateISO(d);
                      const dayMins = (sessions || [])
                        .filter(s => s.date === dateStr && s.programId === activeProgram.id)
                        .reduce((acc, s) => acc + s.duration, 0);
                      last7Days.push({ date: dateStr, minutes: dayMins, active: dayMins > 0 });
                    }
                    
                    // Next pending content
                    const nextContent = contents.find(c => c.status !== "done");
                    
                    // Status colors
                    const statusColors = {
                      on_track: { bg: "bg-green-100", text: "text-green-700", label: "No ritmo" },
                      attention: { bg: "bg-amber-100", text: "text-amber-700", label: "Atenção" },
                      at_risk: { bg: "bg-red-100", text: "text-red-700", label: "Risco" }
                    };
                    const statusConfig = statusColors[metrics.status];

                    return (
                      <>
                        {/* Row 1: Header with title + dates + actions */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h1 className="text-2xl font-bold text-primary">{activeProgram.name}</h1>
                            <p className="text-muted-foreground flex items-center gap-2 flex-wrap">
                              <span>{metrics.startDate.toLocaleDateString("pt-BR")}</span>
                              <span className="text-accent">→</span>
                              <span className="font-medium">{metrics.targetEndDate.toLocaleDateString("pt-BR")}</span>
                              <span className="text-xs bg-muted px-2 py-0.5 rounded">({metrics.totalDays} dias)</span>
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditDatesForm({
                                  startDate: activeProgram.startDate || formatDateISO(metrics.startDate),
                                  targetEndDate: activeProgram.targetEndDate || formatDateISO(metrics.targetEndDate)
                                });
                                setEditDatesModalOpen(true);
                              }}
                              className="px-4 py-2 text-sm font-medium border rounded-xl hover:bg-muted transition-colors flex items-center gap-2"
                            >
                              <Edit3 size={16} />
                              <span className="hidden sm:inline">Editar prazo</span>
                            </button>
                            <button
                              onClick={() => addToast({ message: "Exportação em desenvolvimento", type: "info" })}
                              className="px-4 py-2 text-sm font-medium border rounded-xl hover:bg-muted transition-colors flex items-center gap-2"
                            >
                              <Download size={16} />
                              <span className="hidden sm:inline">Exportar</span>
                            </button>
                          </div>
                        </div>

                        {/* Row 2: Timeline (8 cols) + Rhythm (4 cols) */}
                        <div className="grid lg:grid-cols-12 gap-4">
                          {/* Timeline Card - span 8 */}
                          <div className="lg:col-span-8 bg-card border rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-5">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Calendar size={20} className="text-primary" />
                              </div>
                              <div>
                                <h2 className="font-semibold text-card-foreground">Linha do Tempo</h2>
                                <p className="text-sm text-muted-foreground">
                                  {metrics.elapsedDays} de {metrics.totalDays} dias • {metrics.remainingDays} restantes
                                </p>
                              </div>
                            </div>

                            {/* Desktop: Horizontal Timeline */}
                            <div className="hidden md:block">
                              <div className="flex items-center justify-between mb-3 text-sm">
                                <div className="text-left">
                                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Início</p>
                                  <p className="font-medium text-card-foreground">{metrics.startDate.toLocaleDateString("pt-BR")}</p>
                                </div>
                                <div className="text-center px-4">
                                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                    {metrics.status === "on_track" && <CheckCircle2 size={12} />}
                                    {metrics.status === "attention" && <Flame size={12} />}
                                    {metrics.status === "at_risk" && <ArrowDownRight size={12} />}
                                    {statusConfig.label}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Prazo</p>
                                  <p className="font-medium text-card-foreground">{metrics.targetEndDate.toLocaleDateString("pt-BR")}</p>
                                </div>
                              </div>
                              
                              <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                                  style={{ width: `${metrics.timelineProgressPct}%` }}
                                />
                                <div 
                                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-accent rounded-full shadow-md transition-all duration-500 flex items-center justify-center"
                                  style={{ left: `calc(${metrics.timelineProgressPct}% - 10px)` }}
                                >
                                  <div className="w-2 h-2 bg-accent rounded-full" />
                                </div>
                              </div>
                              
                              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                <span>0%</span>
                                <span className="font-medium text-primary">{metrics.timelineProgressPct}% do tempo decorrido</span>
                                <span>100%</span>
                              </div>

                              {/* Projection line */}
                              {metrics.projectedEndDate && (
                                <div className="mt-4 pt-4 border-t border-dashed">
                                  <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-card-foreground">Projeção:</span>{" "}
                                    {metrics.projectedEndDate <= metrics.targetEndDate ? (
                                      <span className="text-green-600">
                                        Conclusão em {metrics.projectedEndDate.toLocaleDateString("pt-BR")} (dentro do prazo)
                                      </span>
                                    ) : (
                                      <span className="text-amber-600">
                                        Conclusão em {metrics.projectedEndDate.toLocaleDateString("pt-BR")} ({diffDays(metrics.projectedEndDate, metrics.targetEndDate)} dias após o prazo)
                                      </span>
                                    )}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Mobile: Vertical Timeline */}
                            <div className="md:hidden space-y-4">
                              <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-4 h-4 rounded-full bg-primary" />
                                  <div className="w-0.5 h-16 bg-gradient-to-b from-primary to-accent" />
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase">Início</p>
                                  <p className="font-medium text-card-foreground">{metrics.startDate.toLocaleDateString("pt-BR")}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-4 h-4 rounded-full bg-accent border-2 border-white shadow" />
                                  <div className="w-0.5 h-16 bg-muted" />
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase">Hoje</p>
                                  <p className="font-medium text-accent">{metrics.timelineProgressPct}% • {metrics.elapsedDays} dias</p>
                                  <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                    {statusConfig.label}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-start gap-4">
                                <div className="w-4 h-4 rounded-full bg-muted" />
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase">Prazo</p>
                                  <p className="font-medium text-card-foreground">{metrics.targetEndDate.toLocaleDateString("pt-BR")}</p>
                                  <p className="text-sm text-muted-foreground">{metrics.remainingDays} dias restantes</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Rhythm Card - span 4 */}
                          <div className="lg:col-span-4 bg-card border rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-5">
                              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <TrendingUp size={20} className="text-accent" />
                              </div>
                              <div>
                                <h2 className="font-semibold text-card-foreground">Ritmo</h2>
                                <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {/* Required (large) */}
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Necessário</p>
                                <p className="text-3xl font-bold text-primary">{metrics.requiredDailyMin}<span className="text-lg font-normal text-muted-foreground"> min/dia</span></p>
                              </div>
                              
                              {/* Current (smaller) */}
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Atual</p>
                                <p className="text-xl font-semibold text-card-foreground">{metrics.currentDailyAvgMin}<span className="text-sm font-normal text-muted-foreground"> min/dia</span></p>
                              </div>

                              {/* Status badge */}
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                {metrics.status === "on_track" && <CheckCircle2 size={16} />}
                                {metrics.status === "attention" && <Flame size={16} />}
                                {metrics.status === "at_risk" && <ArrowDownRight size={16} />}
                                {statusConfig.label}
                              </div>

                              {/* Gap message */}
                              {metrics.deltaDailyMin > 0 && (
                                <p className="text-sm text-muted-foreground">
                                  Ajuste necessário: <span className="font-medium text-amber-600">+{metrics.deltaDailyMin} min/dia</span>
                                </p>
                              )}
                              {metrics.deltaDailyMin < 0 && (
                                <p className="text-sm text-green-600">
                                  Você está {Math.abs(metrics.deltaDailyMin)} min/dia acima do necessário! 🎉
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Row 3: Progress + Consistency + Next Step */}
                        <div className="grid md:grid-cols-3 gap-4">
                          {/* Progress Card */}
                          <div className="bg-card border rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Target size={20} className="text-accent" />
                              </div>
                              <h2 className="font-semibold text-card-foreground">Progresso</h2>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Estudado</span>
                                <span className="font-medium text-card-foreground">
                                  {Math.floor(metrics.totalCompletedMinutes / 60)}h {metrics.totalCompletedMinutes % 60}min
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Restante</span>
                                <span className="font-medium text-card-foreground">
                                  {Math.floor(metrics.remainingMinutes / 60)}h {metrics.remainingMinutes % 60}min
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-accent rounded-full transition-all"
                                  style={{ width: `${activeProgram.progress}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Conteúdos: {metrics.completedContents}/{metrics.totalContents}</span>
                                <span className="font-medium text-accent">{activeProgram.progress}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Consistency Card */}
                          <div className="bg-card border rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Flame size={20} className="text-accent" />
                              </div>
                              <h2 className="font-semibold text-card-foreground">Consistência</h2>
                            </div>
                            <div className="space-y-3">
                              <p className="text-2xl font-bold text-card-foreground">
                                {metrics.activeDays7d}/7 <span className="text-sm font-normal text-muted-foreground">dias ativos</span>
                              </p>
                              <div className="flex gap-1">
                                {last7Days.map((day, i) => (
                                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div 
                                      className={`w-full h-8 rounded ${day.active ? "bg-accent" : "bg-muted"} transition-colors`}
                                      title={`${formatDateBR(day.date)}: ${day.minutes}min`}
                                    />
                                    <span className="text-[10px] text-muted-foreground">
                                      {["D", "S", "T", "Q", "Q", "S", "S"][(new Date(day.date + "T12:00:00")).getDay()]}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Total: {metrics.studiedMinutes7d} min na semana
                              </p>
                            </div>
                          </div>

                          {/* Next Step Card */}
                          <div className="bg-card border rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Play size={20} className="text-accent" />
                              </div>
                              <h2 className="font-semibold text-card-foreground">Próximo Passo</h2>
                            </div>
                            {nextContent ? (
                              <div className="space-y-3">
                                <div>
                                  <p className="font-medium text-card-foreground">{nextContent.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {nextContent.estimatedMinutes - nextContent.completedMinutes} min restantes
                                  </p>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-accent rounded-full"
                                    style={{ width: `${(nextContent.completedMinutes / nextContent.estimatedMinutes) * 100}%` }}
                                  />
                                </div>
                                <button
                                  onClick={() => openNewSessionModal()}
                                  className="w-full py-2.5 text-sm font-medium bg-accent text-accent-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                >
                                  <Play size={16} />
                                  Continuar
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-4 text-center">
                                <Trophy size={32} className="text-accent mb-2" />
                                <p className="font-medium text-card-foreground">Trilha concluída!</p>
                                <p className="text-sm text-muted-foreground">Parabéns pelo esforço</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Row 4: Content Map (8 cols) + Reviews (4 cols) */}
                        <div className="grid lg:grid-cols-12 gap-4">
                          {/* Content Map - span 8 */}
                          <div className="lg:col-span-8 bg-card border rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                  <Layers size={20} className="text-primary" />
                                </div>
                                <div>
                                  <h2 className="font-semibold text-card-foreground">Mapa de Conteúdos</h2>
                                  <p className="text-sm text-muted-foreground">{contents.length} competências</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {contents.map((node, idx) => {
                                const percent = node.estimatedMinutes > 0 
                                  ? Math.round((node.completedMinutes / node.estimatedMinutes) * 100) 
                                  : 0;
                                const remainingMins = node.estimatedMinutes - node.completedMinutes;
                                const isExpanded = expandedCompetencies.has(node.id);
                                
                                const nodeStatusConfig = {
                                  done: { label: "Concluído", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
                                  in_progress: { label: "Em andamento", color: "bg-accent/10 text-accent", icon: Play },
                                  not_started: { label: "A iniciar", color: "bg-muted text-muted-foreground", icon: Clock }
                                };
                                const config = nodeStatusConfig[node.status];
                                const StatusIcon = config.icon;

                                return (
                                  <div key={node.id} className="border rounded-xl overflow-hidden">
                                    <button
                                      onClick={() => {
                                        const newSet = new Set(expandedCompetencies);
                                        if (isExpanded) {
                                          newSet.delete(node.id);
                                        } else {
                                          newSet.add(node.id);
                                        }
                                        setExpandedCompetencies(newSet);
                                      }}
                                      className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
                                    >
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                                        <StatusIcon size={16} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                          <p className="font-medium text-card-foreground truncate">{node.title}</p>
                                          <div className="flex items-center gap-2 shrink-0 ml-2">
                                            <span className="text-xs text-muted-foreground">{remainingMins}min</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                                              {percent}%
                                            </span>
                                          </div>
                                        </div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full rounded-full transition-all ${node.status === "done" ? "bg-green-500" : "bg-accent"}`}
                                            style={{ width: `${percent}%` }}
                                          />
                                        </div>
                                      </div>
                                      <ChevronDown 
                                        size={20} 
                                        className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                      />
                                    </button>
                                    
                                    {/* Expandable children */}
                                    {isExpanded && node.children && node.children.length > 0 && (
                                      <div className="border-t bg-muted/20 p-3 space-y-2">
                                        {node.children.map((child, childIdx) => {
                                          const childPercent = child.estimatedMinutes > 0 
                                            ? Math.round((child.completedMinutes / child.estimatedMinutes) * 100) 
                                            : 0;
                                          const childConfig = nodeStatusConfig[child.status];
                                          const ChildIcon = childConfig.icon;
                                          
                                          return (
                                            <div key={child.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-card transition-colors">
                                              <div className={`w-6 h-6 rounded flex items-center justify-center ${childConfig.color}`}>
                                                <ChildIcon size={12} />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <p className="text-sm text-card-foreground truncate">{child.title}</p>
                                              </div>
                                              <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-xs text-muted-foreground">{child.estimatedMinutes}min</span>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${childConfig.color}`}>
                                                  {childPercent}%
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Reviews & Checkpoints - span 4 */}
                          <div className="lg:col-span-4 space-y-4">
                            {/* Reviews Card */}
                            <div className="bg-card border rounded-2xl p-5">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                  <RotateCw size={20} className="text-accent" />
                                </div>
                                <h2 className="font-semibold text-card-foreground">Revisões</h2>
                              </div>
                              {pendingReviewsCount > 0 ? (
                                <div className="space-y-3">
                                  <p className="text-sm text-muted-foreground">
                                    <span className="text-accent font-medium">{pendingReviewsCount}</span> revisões pendentes
                                  </p>
                                  <button
                                    onClick={() => navigate("revisoes")}
                                    className="w-full py-2 text-sm font-medium border rounded-xl hover:bg-muted transition-colors"
                                  >
                                    Ver revisões
                                  </button>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">Nenhuma revisão pendente</p>
                              )}
                            </div>

                            {/* Checkpoints Card */}
                            <div className="bg-card border rounded-2xl p-5">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                  <Award size={20} className="text-primary" />
                                </div>
                                <h2 className="font-semibold text-card-foreground">Checkpoints</h2>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                                    <FileText size={12} className="text-accent" />
                                  </div>
                                  <span className="text-muted-foreground">Próximo simulado</span>
                                  <span className="ml-auto font-medium text-card-foreground">Em 7 dias</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                                    <Target size={12} className="text-accent" />
                                  </div>
                                  <span className="text-muted-foreground">Meta semanal</span>
                                  <span className="ml-auto font-medium text-card-foreground">{Math.round((metrics.studiedMinutes7d / (goals?.weeklyGoal || 300)) * 100)}%</span>
                                </div>
                              </div>
                              <button
                                onClick={() => addToast({ message: "Geração de plano em desenvolvimento", type: "info" })}
                                className="w-full mt-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                              >
                                Gerar plano semanal
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Smart Projection Banner */}
                        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                              <Sparkles size={24} />
                            </div>
                            <div className="flex-1">
                              <h2 className="font-semibold text-lg mb-2">Projeção Inteligente</h2>
                              {metrics.projectedDaysToFinish !== null && metrics.currentDailyAvgMin > 0 ? (
                                <div className="space-y-2">
                                  {metrics.projectedDaysToFinish <= metrics.remainingDays ? (
                                    <p className="text-white/95">
                                      ✅ Mantendo o ritmo atual de <strong>{metrics.currentDailyAvgMin} min/dia</strong>, você conclui esta trilha em <strong>{metrics.projectedDaysToFinish} dias</strong> — {diffDays(metrics.targetEndDate, metrics.today) - metrics.projectedDaysToFinish} dias antes do prazo!
                                    </p>
                                  ) : (
                                    <>
                                      <p className="text-white/95">
                                        ⚠️ Com o ritmo atual de <strong>{metrics.currentDailyAvgMin} min/dia</strong>, você concluirá em <strong>{metrics.projectedDaysToFinish} dias</strong> — {metrics.projectedDaysToFinish - metrics.remainingDays} dias após o prazo.
                                      </p>
                                      <p className="text-white/80 text-sm">
                                        💡 Para concluir no prazo, aumente seu ritmo para <strong>{metrics.requiredDailyMin} min/dia</strong> (+{metrics.deltaDailyMin} min/dia).
                                      </p>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <p className="text-white/90">
                                  📊 Registre sessões de estudo para ver sua projeção personalizada. Quanto mais dados, mais precisa a previsão.
                                </p>
                              )}
                              <p className="text-xs text-white/50 mt-3">
                                * Projeção recalculada automaticamente a cada nova sessão
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}

              {/* Edit Dates Modal */}
              <Modal
                open={editDatesModalOpen}
                onClose={() => setEditDatesModalOpen(false)}
                title="Editar Datas da Trilha"
                size="sm"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">Data de Início</label>
                    <input
                      type="date"
                      value={editDatesForm.startDate}
                      onChange={(e) => setEditDatesForm(f => ({ ...f, startDate: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-secondary border-0 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">Data de Término (Prazo)</label>
                    <input
                      type="date"
                      value={editDatesForm.targetEndDate}
                      onChange={(e) => setEditDatesForm(f => ({ ...f, targetEndDate: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-secondary border-0 rounded-xl"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Ex: data da prova ou deadline do objetivo</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setEditDatesModalOpen(false)} 
                      className="flex-1 px-4 py-3 text-sm font-medium border rounded-xl hover:bg-muted transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={() => {
                        // TODO API: Save dates to backend
                        if (activeProgram) {
                          setPrograms(prev => (prev || []).map(p => 
                            p.id === activeProgram.id 
                              ? { ...p, startDate: editDatesForm.startDate, targetEndDate: editDatesForm.targetEndDate }
                              : p
                          ));
                          addToast({ message: "Datas atualizadas", type: "success" });
                          setEditDatesModalOpen(false);
                        }
                      }}
                      className="flex-1 px-4 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </Modal>
            </div>
          )}

          {/* ====== RELATORIOS VIEW (Investor-Ready) ====== */}
          {activeView === "relatorios" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Relatórios</h1>
                <p className="text-muted-foreground">Métricas de aprendizado e progresso</p>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {(() => {
                  const last30Sessions = (sessions || []).filter(s => {
                    const sessionDate = new Date(s.date);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return sessionDate >= thirtyDaysAgo;
                  });
                  const totalMinutes30 = last30Sessions.reduce((acc, s) => acc + s.duration, 0);
                  const uniqueDays30 = new Set(last30Sessions.map(s => s.date)).size;
                  const consistency30 = Math.round((uniqueDays30 / 30) * 100);
                  const activePrograms = (programs || []).filter(p => p.status === "Em andamento").length;
                  const completedPrograms = (programs || []).filter(p => p.status === "Concluído").length;
                  const completionRate = programs?.length ? Math.round((completedPrograms / programs.length) * 100) : 0;
                  
                  return (
                    <>
                      <div className="bg-card border rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Clock size={20} className="text-accent" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-card-foreground">{Math.round(totalMinutes30 / 60)}h {totalMinutes30 % 60}min</p>
                        <p className="text-sm text-muted-foreground">Tempo investido (30 dias)</p>
                      </div>
                      
                      <div className="bg-card border rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Flame size={20} className="text-accent" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-card-foreground">{consistency30}%</p>
                        <p className="text-sm text-muted-foreground">Consistência mensal</p>
                      </div>
                      
                      <div className="bg-card border rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <GraduationCap size={20} className="text-accent" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-card-foreground">{activePrograms}</p>
                        <p className="text-sm text-muted-foreground">Programas ativos</p>
                      </div>
                      
                      <div className="bg-card border rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Trophy size={20} className="text-accent" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-card-foreground">{completionRate}%</p>
                        <p className="text-sm text-muted-foreground">Taxa de conclusão</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Charts Section */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Weekly Minutes Chart */}
                <div className="bg-card border rounded-2xl p-5">
                  <h2 className="font-semibold text-card-foreground mb-4">Minutos por semana</h2>
                  {(() => {
                    const weeks: { label: string; minutes: number }[] = [];
                    for (let w = 0; w < 8; w++) {
                      const weekStart = new Date();
                      weekStart.setDate(weekStart.getDate() - (w * 7 + weekStart.getDay()));
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekEnd.getDate() + 6);
                      const weekSessions = (sessions || []).filter(s => {
                        const d = new Date(s.date);
                        return d >= weekStart && d <= weekEnd;
                      });
                      const total = weekSessions.reduce((acc, s) => acc + s.duration, 0);
                      weeks.unshift({
                        label: `Sem ${8 - w}`,
                        minutes: total
                      });
                    }
                    const maxMinutes = Math.max(...weeks.map(w => w.minutes), 1);
                    return (
                      <div className="space-y-3">
                        {weeks.map((week, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-12">{week.label}</span>
                            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                                style={{ width: `${(week.minutes / maxMinutes) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-12 text-right">{week.minutes}min</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Sessions by Type */}
                <div className="bg-card border rounded-2xl p-5">
                  <h2 className="font-semibold text-card-foreground mb-4">Sessões por tipo</h2>
                  {(() => {
                    const typeCount: Record<string, number> = {};
                    (sessions || []).forEach(s => {
                      typeCount[s.type] = (typeCount[s.type] || 0) + 1;
                    });
                    const types = Object.entries(typeCount).sort((a, b) => b[1] - a[1]);
                    const total = types.reduce((acc, [, count]) => acc + count, 0) || 1;
                    const colors = ["bg-accent", "bg-primary", "bg-accent/70", "bg-primary/70", "bg-accent/50"];
                    
                    return (
                      <div className="space-y-4">
                        <div className="flex h-4 rounded-full overflow-hidden">
                          {types.map(([type, count], i) => (
                            <div 
                              key={type}
                              className={`${colors[i % colors.length]} transition-all`}
                              style={{ width: `${(count / total) * 100}%` }}
                              title={`${type}: ${count}`}
                            />
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {types.map(([type, count], i) => (
                            <div key={type} className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`} />
                              <span className="text-sm text-muted-foreground">{type}</span>
                              <span className="text-sm font-medium ml-auto">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Insight Card */}
              <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles size={20} />
                  <span className="font-semibold">Insight StudAI</span>
                </div>
                <p className="text-lg font-medium opacity-95">
                  "Usuários ativos estudam em média 4,2x mais após 30 dias de uso consistente."
                </p>
                <p className="text-sm opacity-75 mt-2">Baseado em dados agregados da plataforma</p>
              </div>
            </div>
          )}

          {/* ====== ROI VIEW (Investor-Ready) ====== */}
          {activeView === "roi" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">ROI de Estudo</h1>
                <p className="text-muted-foreground">Retorno sobre o tempo investido em aprendizado</p>
              </div>

              {/* ROI Metrics */}
              <div className="grid lg:grid-cols-3 gap-4">
                {(() => {
                  const totalMinutes = (sessions || []).reduce((acc, s) => acc + s.duration, 0);
                  const avgProgress = activeProgram?.progress || 0;
                  const enrolledDays = activeProgram?.enrolledAt 
                    ? Math.floor((Date.now() - activeProgram.enrolledAt) / 86400000)
                    : 30;
                  const progressPerHour = totalMinutes > 0 ? ((avgProgress / (totalMinutes / 60)) * 100).toFixed(1) : 0;
                  const estimatedCostPerCompetency = Math.round(totalMinutes / (activeProgram?.competencies?.length || 5));
                  
                  // Estimate completion
                  const daysToComplete = avgProgress > 0 && enrolledDays > 0
                    ? Math.round(((100 - avgProgress) / avgProgress) * enrolledDays)
                    : 0;
                  const weeksToComplete = Math.ceil(daysToComplete / 7);
                  
                  return (
                    <>
                      <div className="bg-card border rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <TrendUp size={20} className="text-accent" />
                          </div>
                          <h3 className="font-medium text-card-foreground">Eficiência</h3>
                        </div>
                        <p className="text-3xl font-bold text-card-foreground">{progressPerHour}%</p>
                        <p className="text-sm text-muted-foreground">Progresso por hora de estudo</p>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                          <ArrowUpRight size={14} className="text-accent" />
                          <span className="text-accent font-medium">+12% vs média</span>
                        </div>
                      </div>
                      
                      <div className="bg-card border rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Award size={20} className="text-accent" />
                          </div>
                          <h3 className="font-medium text-card-foreground">Custo por Competência</h3>
                        </div>
                        <p className="text-3xl font-bold text-card-foreground">{estimatedCostPerCompetency}min</p>
                        <p className="text-sm text-muted-foreground">Tempo médio por competência</p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock size={14} />
                          <span>~{Math.round(estimatedCostPerCompetency / 60)}h por tópico</span>
                        </div>
                      </div>
                      
                      <div className="bg-card border rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Target size={20} className="text-accent" />
                          </div>
                          <h3 className="font-medium text-card-foreground">Projeção</h3>
                        </div>
                        <p className="text-3xl font-bold text-card-foreground">{weeksToComplete} sem</p>
                        <p className="text-sm text-muted-foreground">Para conclusão do programa</p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar size={14} />
                          <span>~{daysToComplete} dias restantes</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Progress vs Time Chart */}
              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Tempo investido vs Progresso</h2>
                {activeProgram ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Progresso atual</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                              style={{ width: `${activeProgram.progress}%` }}
                            />
                          </div>
                          <span className="text-lg font-bold text-card-foreground">{activeProgram.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Meta de conclusão</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-muted-foreground/30 rounded-full" style={{ width: "100%" }} />
                          </div>
                          <span className="text-lg font-bold text-muted-foreground">100%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                      <div className="flex items-start gap-3">
                        <Lightbulb size={20} className="text-accent mt-0.5" />
                        <div>
                          <p className="font-medium text-card-foreground">
                            Com o ritmo atual, você conclui o {activeProgram.name} em aproximadamente{" "}
                            <span className="text-accent font-bold">
                              {(() => {
                                const enrolledDays = activeProgram.enrolledAt 
                                  ? Math.floor((Date.now() - activeProgram.enrolledAt) / 86400000)
                                  : 30;
                                const daysToComplete = activeProgram.progress > 0
                                  ? Math.round(((100 - activeProgram.progress) / activeProgram.progress) * enrolledDays)
                                  : 0;
                                return Math.ceil(daysToComplete / 7);
                              })()} semanas
                            </span>.
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Aumente a consistência para reduzir o tempo estimado.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState 
                    icon={GraduationCap} 
                    title="Nenhum programa ativo" 
                    description="Selecione um programa para ver métricas de ROI"
                    action={{ label: "Ver programas", onClick: () => navigate("programas") }}
                  />
                )}
              </div>

              {/* Competencies ROI */}
              {activeProgram && (
                <div className="bg-card border rounded-2xl p-5">
                  <h2 className="font-semibold text-card-foreground mb-4">ROI por Competência</h2>
                  <div className="grid gap-3">
                    {(activeProgram.competencies || []).slice(0, 6).map((comp, i) => {
                      const mockProgress = Math.floor(Math.random() * 40) + 30;
                      const mockHours = Math.floor(Math.random() * 8) + 2;
                      return (
                        <div key={comp} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-card-foreground text-sm">{comp}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-accent rounded-full"
                                  style={{ width: `${mockProgress}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{mockProgress}%</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-card-foreground">{mockHours}h</p>
                            <p className="text-xs text-muted-foreground">investidas</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ====== ENGAJAMENTO VIEW (Investor-Ready) ====== */}
          {activeView === "engajamento" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Engajamento</h1>
                <p className="text-muted-foreground">Métricas de uso e retenção da plataforma</p>
              </div>

              {/* Engagement Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card border rounded-2xl p-5">
                  <p className="text-sm text-muted-foreground mb-1">DAU / WAU</p>
                  <p className="text-3xl font-bold text-card-foreground">73%</p>
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    <ArrowUpRight size={12} className="text-accent" />
                    <span className="text-accent font-medium">+8%</span>
                    <span className="text-muted-foreground">vs semana anterior</span>
                  </div>
                </div>
                
                <div className="bg-card border rounded-2xl p-5">
                  <p className="text-sm text-muted-foreground mb-1">Sessões / Usuário</p>
                  <p className="text-3xl font-bold text-card-foreground">4.2</p>
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    <ArrowUpRight size={12} className="text-accent" />
                    <span className="text-accent font-medium">+0.5</span>
                    <span className="text-muted-foreground">média semanal</span>
                  </div>
                </div>
                
                <div className="bg-card border rounded-2xl p-5">
                  <p className="text-sm text-muted-foreground mb-1">Retenção D7</p>
                  <p className="text-3xl font-bold text-card-foreground">68%</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <span>Benchmark: 40-50%</span>
                  </div>
                </div>
                
                <div className="bg-card border rounded-2xl p-5">
                  <p className="text-sm text-muted-foreground mb-1">Retenção D30</p>
                  <p className="text-3xl font-bold text-card-foreground">42%</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <span>Benchmark: 20-30%</span>
                  </div>
                </div>
              </div>

              {/* AI Usage */}
              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Uso da IA</h2>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-accent/5 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <Bot size={24} className="text-accent" />
                    </div>
                    <p className="text-3xl font-bold text-card-foreground">78%</p>
                    <p className="text-sm text-muted-foreground">Usuários que usam IA</p>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <MessageSquare size={24} className="text-accent" />
                    </div>
                    <p className="text-3xl font-bold text-card-foreground">12.4</p>
                    <p className="text-sm text-muted-foreground">Consultas / usuário / mês</p>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <Bookmark size={24} className="text-accent" />
                    </div>
                    <p className="text-3xl font-bold text-card-foreground">3.8</p>
                    <p className="text-sm text-muted-foreground">Conteúdos salvos / usuário</p>
                  </div>
                </div>
              </div>

              {/* Weekly Heatmap */}
              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Heatmap de atividade semanal</h2>
                {(() => {
                  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
                  const dayCounts: Record<number, number> = {};
                  (sessions || []).forEach(s => {
                    const day = new Date(s.date).getDay();
                    dayCounts[day] = (dayCounts[day] || 0) + s.duration;
                  });
                  const maxCount = Math.max(...Object.values(dayCounts), 1);
                  
                  return (
                    <div className="grid grid-cols-7 gap-2">
                      {dayNames.map((name, i) => {
                        const count = dayCounts[i] || 0;
                        const intensity = count / maxCount;
                        return (
                          <div key={name} className="text-center">
                            <p className="text-xs text-muted-foreground mb-2">{name}</p>
                            <div 
                              className="h-16 rounded-lg transition-all flex items-center justify-center"
                              style={{ 
                                backgroundColor: `hsl(222 89% 55% / ${0.1 + intensity * 0.7})`,
                              }}
                            >
                              <span className="text-sm font-medium" style={{ color: intensity > 0.5 ? "white" : "hsl(222 89% 55%)" }}>
                                {count}min
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Dias mais escuros indicam maior tempo de estudo
                </p>
              </div>

              {/* Feature Adoption */}
              <div className="bg-card border rounded-2xl p-5">
                <h2 className="font-semibold text-card-foreground mb-4">Adoção de funcionalidades</h2>
                <div className="space-y-4">
                  {[
                    { name: "Sessões de estudo", adoption: 95 },
                    { name: "Assistente IA", adoption: 78 },
                    { name: "Calendário", adoption: 65 },
                    { name: "Metas semanais", adoption: 58 },
                    { name: "Revisões espaçadas", adoption: 42 },
                    { name: "Conteúdos salvos", adoption: 38 },
                  ].map((feature) => (
                    <div key={feature.name} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-36">{feature.name}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          style={{ width: `${feature.adoption}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{feature.adoption}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insight */}
              <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <TrendUp size={20} />
                  <span className="font-semibold">Destaque</span>
                </div>
                <p className="text-lg font-medium opacity-95">
                  Usuários que usam a IA têm 2.3x mais retenção D30 que usuários que não usam.
                </p>
                <p className="text-sm opacity-75 mt-2">A IA é o principal driver de engajamento.</p>
              </div>
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
                <h2 className="font-semibold text-card-foreground mb-2">Demo Personas</h2>
                <p className="text-sm text-muted-foreground mb-4">Selecione uma persona para gerar dados realistas de demonstração</p>
                
                <div className="grid gap-4 mb-6">
                  {DEMO_PERSONAS.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => generateDemoDataForPersona(persona)}
                      className={`text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                        selectedPersona?.id === persona.id 
                          ? "border-accent bg-accent/5" 
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {persona.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-card-foreground">{persona.name}</h3>
                            <span className="text-xs text-muted-foreground">{persona.age} anos</span>
                          </div>
                          <p className="text-sm font-medium text-accent mb-1">{persona.goal}</p>
                          <p className="text-xs text-muted-foreground mb-2">{persona.profile} • {persona.activeProgram}</p>
                          <p className="text-xs text-muted-foreground italic">"{persona.narrative}"</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {persona.studyFocus.map((focus) => (
                              <span key={focus} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{focus}</span>
                            ))}
                          </div>
                        </div>
                        {selectedPersona?.id === persona.id && (
                          <Badge variant="accent">Ativo</Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-3">Ou restaure para os dados padrão</p>
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
            <label htmlFor="session-program" className="block text-sm font-medium text-card-foreground mb-2">Programa</label>
            <select
              id="session-program"
              value={sessionForm.programId}
              onChange={(e) => setSessionForm((f) => ({ ...f, programId: e.target.value }))}
              className={`w-full px-3 py-2.5 bg-secondary border-0 rounded-xl ${formErrors.programId ? "ring-2 ring-destructive" : ""}`}
            >
              <option value="">Selecione...</option>
              {(programs || []).filter((p) => p.status !== "A iniciar" || p.id === goals?.activeProgramId).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {formErrors.programId && <p className="text-xs text-destructive mt-1">{formErrors.programId}</p>}
          </div>

          <div>
            <label htmlFor="session-topic" className="block text-sm font-medium text-card-foreground mb-2">Tópico</label>
            <input
              id="session-topic"
              type="text"
              value={sessionForm.topic}
              onChange={(e) => setSessionForm((f) => ({ ...f, topic: e.target.value }))}
              placeholder="Ex: Ethics & Standards, SQL Joins"
              className={`w-full px-3 py-2.5 bg-secondary border-0 rounded-xl ${formErrors.topic ? "ring-2 ring-destructive" : ""}`}
            />
            {formErrors.topic && <p className="text-xs text-destructive mt-1">{formErrors.topic}</p>}
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
                <option value="Conceitual">Conceitual</option>
                <option value="Exercícios">Exercícios</option>
                <option value="Simulado">Simulado</option>
                <option value="Revisão">Revisão</option>
                <option value="Projeto">Projeto</option>
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
            <label htmlFor="session-tags" className="block text-sm font-medium text-card-foreground mb-2">Tags (opcional)</label>
            <input
              id="session-tags"
              type="text"
              value={sessionForm.tags}
              onChange={(e) => setSessionForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="Ex: cfa, ethics, valuation"
              className="w-full px-3 py-2.5 bg-secondary border-0 rounded-xl"
            />
            <p className="text-xs text-muted-foreground mt-1">Separe por vírgulas</p>
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
            Tem certeza que deseja excluir a sessão "{deleteConfirmSession?.topic}"? Esta ação pode ser desfeita.
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
