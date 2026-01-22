// ============================================================================
// PROGRAM DATA MODEL - Visão Geral da Trilha
// ============================================================================

// ============================================================================
// TYPES
// ============================================================================

export interface ContentNode {
  id: string;
  title: string;
  competency: string;
  estimatedMinutes: number;
  completedMinutes: number;
  status: "not_started" | "in_progress" | "done";
  order: number;
  children?: ContentNode[];
}

export interface Program {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  startDate: string; // YYYY-MM-DD
  targetEndDate: string; // YYYY-MM-DD
  defaultDailyCapacityMin: number;
  contents: ContentNode[];
}

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  duration: number; // minutes
  programId: string;
  contentId?: string;
  type: "study" | "review" | "quiz" | "simulado";
  result?: number; // score 0-100
  notes?: string;
}

export interface ProgramState {
  activeProgramId: string;
  programs: Program[];
  sessions: StudySession[];
}

// ============================================================================
// CALCULATION TYPES
// ============================================================================

export interface ProgramCalculations {
  // Totals
  totalEstimatedMinutes: number;
  totalCompletedMinutes: number;
  remainingMinutes: number;
  totalContents: number;
  completedContents: number;
  
  // Dates
  startDate: Date;
  targetEndDate: Date;
  today: Date;
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  timelineProgressPct: number;
  
  // Pace
  studiedMinutes7d: number;
  activeDays7d: number;
  currentDailyAvgMin: number;
  requiredDailyMin: number;
  deltaDailyMin: number;
  
  // Projections
  projectedDaysToFinish: number | null;
  projectedEndDate: Date | null;
  
  // Status
  status: "on_track" | "attention" | "at_risk" | "completed";
  statusMessage: string;
}

export interface WeeklyStudyData {
  date: string;
  minutes: number;
  dayOfWeek: number;
}

// ============================================================================
// STORAGE
// ============================================================================

const STORAGE_KEY = "studai_program_state";

export function loadProgramState(): ProgramState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.warn("Failed to load program state from localStorage");
  }
  
  // Return default mock data
  return getDefaultProgramState();
}

export function saveProgramState(state: ProgramState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error("Failed to save program state");
  }
}

export function updateProgram(programId: string, updates: Partial<Program>): void {
  const state = loadProgramState();
  const idx = state.programs.findIndex(p => p.id === programId);
  if (idx !== -1) {
    state.programs[idx] = { ...state.programs[idx], ...updates };
    saveProgramState(state);
  }
}

export function updateContentNode(
  programId: string, 
  contentId: string, 
  updates: Partial<ContentNode>
): void {
  const state = loadProgramState();
  const program = state.programs.find(p => p.id === programId);
  if (!program) return;
  
  const updateNode = (nodes: ContentNode[]): boolean => {
    for (const node of nodes) {
      if (node.id === contentId) {
        Object.assign(node, updates);
        return true;
      }
      if (node.children && updateNode(node.children)) {
        return true;
      }
    }
    return false;
  };
  
  updateNode(program.contents);
  saveProgramState(state);
}

export function addSession(session: StudySession): void {
  const state = loadProgramState();
  state.sessions.push(session);
  saveProgramState(state);
}

// ============================================================================
// CALCULATION FUNCTIONS (EXACT FORMULAS)
// ============================================================================

function parseDate(dateStr: string): Date {
  const d = new Date(dateStr + "T00:00:00");
  d.setHours(0, 0, 0, 0);
  return d;
}

function diffDays(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 86400000);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Recursive sum for ContentNode tree
function sumContentMinutes(nodes: ContentNode[]): { estimated: number; completed: number; total: number; done: number } {
  let estimated = 0;
  let completed = 0;
  let total = 0;
  let done = 0;
  
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      const childStats = sumContentMinutes(node.children);
      estimated += childStats.estimated;
      completed += childStats.completed;
      total += childStats.total;
      done += childStats.done;
    } else {
      estimated += node.estimatedMinutes;
      completed += node.completedMinutes;
      total += 1;
      if (node.status === "done") done += 1;
    }
  }
  
  return { estimated, completed, total, done };
}

export function calculateProgramMetrics(
  program: Program,
  sessions: StudySession[]
): ProgramCalculations {
  // 1. Totals
  const contentStats = sumContentMinutes(program.contents);
  const totalEstimatedMinutes = contentStats.estimated;
  const totalCompletedMinutes = contentStats.completed;
  const remainingMinutes = Math.max(0, totalEstimatedMinutes - totalCompletedMinutes);
  const totalContents = contentStats.total;
  const completedContents = contentStats.done;
  
  // 2. Dates (always local, no timezone drift)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = parseDate(program.startDate);
  const targetEndDate = parseDate(program.targetEndDate);
  
  // 3. Duration calculations
  const totalDays = Math.max(1, diffDays(targetEndDate, startDate) + 1);
  const elapsedDays = clamp(diffDays(today, startDate) + 1, 0, totalDays);
  const remainingDays = Math.max(0, totalDays - elapsedDays);
  
  // 4. Timeline progress
  const timelineProgressPct = Math.round((elapsedDays / totalDays) * 100);
  
  // 5. Current pace (7-day moving average)
  const programSessions = sessions.filter(s => s.programId === program.id);
  const last7Days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    last7Days.push(formatDateISO(addDays(today, -i)));
  }
  
  const sessionsIn7d = programSessions.filter(s => last7Days.includes(s.date));
  const studiedMinutes7d = sessionsIn7d.reduce((sum, s) => sum + s.duration, 0);
  const activeDays7d = new Set(sessionsIn7d.map(s => s.date)).size;
  const currentDailyAvgMin = Math.round(studiedMinutes7d / 7);
  
  // 6. Required pace
  const requiredDailyMin = remainingDays > 0 
    ? Math.ceil(remainingMinutes / remainingDays)
    : remainingMinutes;
  
  // 7. Projections
  let projectedDaysToFinish: number | null = null;
  let projectedEndDate: Date | null = null;
  
  if (currentDailyAvgMin > 0) {
    projectedDaysToFinish = Math.ceil(remainingMinutes / currentDailyAvgMin);
    projectedEndDate = addDays(today, projectedDaysToFinish);
  }
  
  // 8. Gap
  const deltaDailyMin = requiredDailyMin - currentDailyAvgMin;
  
  // 9. Status
  let status: ProgramCalculations["status"];
  let statusMessage: string;
  
  if (remainingMinutes === 0) {
    status = "completed";
    statusMessage = "Trilha concluída! 🎉";
  } else if (deltaDailyMin <= 0) {
    status = "on_track";
    statusMessage = "Você está no ritmo certo!";
  } else if (deltaDailyMin <= 15) {
    status = "attention";
    statusMessage = `Aumente ${deltaDailyMin}min/dia para manter o prazo`;
  } else {
    status = "at_risk";
    statusMessage = `Precisa de +${deltaDailyMin}min/dia para cumprir o prazo`;
  }
  
  return {
    totalEstimatedMinutes,
    totalCompletedMinutes,
    remainingMinutes,
    totalContents,
    completedContents,
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
    deltaDailyMin,
    projectedDaysToFinish,
    projectedEndDate,
    status,
    statusMessage,
  };
}

export function getLast7DaysStudyData(
  programId: string,
  sessions: StudySession[]
): WeeklyStudyData[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const result: WeeklyStudyData[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = addDays(today, -i);
    const dateStr = formatDateISO(date);
    const dayMinutes = sessions
      .filter(s => s.programId === programId && s.date === dateStr)
      .reduce((sum, s) => sum + s.duration, 0);
    
    result.push({
      date: dateStr,
      minutes: dayMinutes,
      dayOfWeek: date.getDay(),
    });
  }
  
  return result;
}

export function getNextPendingContent(program: Program): ContentNode | null {
  const findNext = (nodes: ContentNode[]): ContentNode | null => {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        const child = findNext(node.children);
        if (child) return child;
      } else if (node.status !== "done") {
        return node;
      }
    }
    return null;
  };
  
  return findNext(program.contents);
}

// ============================================================================
// FORMAT HELPERS
// ============================================================================

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function formatDateBrazil(date: Date | string): string {
  const d = typeof date === "string" ? parseDate(date) : date;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? parseDate(date) : date;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

// ============================================================================
// MOCK DATA
// ============================================================================

function getDefaultProgramState(): ProgramState {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 30);
  
  const targetEndDate = new Date(today);
  targetEndDate.setDate(targetEndDate.getDate() + 60);
  
  const mockProgram: Program = {
    id: "cfa-quant-methods",
    name: "CFA Level I – Quantitative Methods",
    description: "Preparação completa para a certificação CFA, focando em métodos quantitativos",
    icon: "📊",
    color: "from-blue-600 to-indigo-700",
    startDate: formatDateISO(startDate),
    targetEndDate: formatDateISO(targetEndDate),
    defaultDailyCapacityMin: 90,
    contents: [
      {
        id: "qm-1",
        title: "Time Value of Money",
        competency: "Quantitative Methods",
        estimatedMinutes: 360, // 6h
        completedMinutes: 360,
        status: "done",
        order: 1,
        children: [
          { id: "qm-1-1", title: "Introdução ao TVM", competency: "TVM", estimatedMinutes: 60, completedMinutes: 60, status: "done", order: 1 },
          { id: "qm-1-2", title: "Juros Simples vs Compostos", competency: "TVM", estimatedMinutes: 90, completedMinutes: 90, status: "done", order: 2 },
          { id: "qm-1-3", title: "Valor Futuro e Presente", competency: "TVM", estimatedMinutes: 120, completedMinutes: 120, status: "done", order: 3 },
          { id: "qm-1-4", title: "Anuidades e Perpetuidades", competency: "TVM", estimatedMinutes: 90, completedMinutes: 90, status: "done", order: 4 },
        ],
      },
      {
        id: "qm-2",
        title: "Organizing, Visualizing, and Describing Data",
        competency: "Quantitative Methods",
        estimatedMinutes: 300, // 5h
        completedMinutes: 300,
        status: "done",
        order: 2,
        children: [
          { id: "qm-2-1", title: "Tipos de Dados", competency: "Data", estimatedMinutes: 60, completedMinutes: 60, status: "done", order: 1 },
          { id: "qm-2-2", title: "Medidas de Tendência Central", competency: "Data", estimatedMinutes: 90, completedMinutes: 90, status: "done", order: 2 },
          { id: "qm-2-3", title: "Medidas de Dispersão", competency: "Data", estimatedMinutes: 90, completedMinutes: 90, status: "done", order: 3 },
          { id: "qm-2-4", title: "Visualização de Dados", competency: "Data", estimatedMinutes: 60, completedMinutes: 60, status: "done", order: 4 },
        ],
      },
      {
        id: "qm-3",
        title: "Probability Concepts",
        competency: "Quantitative Methods",
        estimatedMinutes: 480, // 8h
        completedMinutes: 360, // 6h done
        status: "in_progress",
        order: 3,
        children: [
          { id: "qm-3-1", title: "Conceitos Básicos", competency: "Probability", estimatedMinutes: 90, completedMinutes: 90, status: "done", order: 1 },
          { id: "qm-3-2", title: "Probabilidade Condicional", competency: "Probability", estimatedMinutes: 120, completedMinutes: 120, status: "done", order: 2 },
          { id: "qm-3-3", title: "Teorema de Bayes", competency: "Probability", estimatedMinutes: 150, completedMinutes: 150, status: "done", order: 3 },
          { id: "qm-3-4", title: "Valor Esperado e Variância", competency: "Probability", estimatedMinutes: 120, completedMinutes: 0, status: "in_progress", order: 4 },
        ],
      },
      {
        id: "qm-4",
        title: "Common Probability Distributions",
        competency: "Quantitative Methods",
        estimatedMinutes: 420, // 7h
        completedMinutes: 90,
        status: "in_progress",
        order: 4,
        children: [
          { id: "qm-4-1", title: "Distribuição Binomial", competency: "Distributions", estimatedMinutes: 90, completedMinutes: 90, status: "done", order: 1 },
          { id: "qm-4-2", title: "Distribuição Normal", competency: "Distributions", estimatedMinutes: 120, completedMinutes: 0, status: "not_started", order: 2 },
          { id: "qm-4-3", title: "Z-Score e Padronização", competency: "Distributions", estimatedMinutes: 90, completedMinutes: 0, status: "not_started", order: 3 },
          { id: "qm-4-4", title: "Distribuição Lognormal", competency: "Distributions", estimatedMinutes: 120, completedMinutes: 0, status: "not_started", order: 4 },
        ],
      },
      {
        id: "qm-5",
        title: "Sampling and Estimation",
        competency: "Quantitative Methods",
        estimatedMinutes: 300, // 5h
        completedMinutes: 0,
        status: "not_started",
        order: 5,
        children: [
          { id: "qm-5-1", title: "Tipos de Amostragem", competency: "Sampling", estimatedMinutes: 60, completedMinutes: 0, status: "not_started", order: 1 },
          { id: "qm-5-2", title: "Teorema do Limite Central", competency: "Sampling", estimatedMinutes: 90, completedMinutes: 0, status: "not_started", order: 2 },
          { id: "qm-5-3", title: "Intervalos de Confiança", competency: "Sampling", estimatedMinutes: 90, completedMinutes: 0, status: "not_started", order: 3 },
          { id: "qm-5-4", title: "Distribuição t de Student", competency: "Sampling", estimatedMinutes: 60, completedMinutes: 0, status: "not_started", order: 4 },
        ],
      },
      {
        id: "qm-6",
        title: "Hypothesis Testing",
        competency: "Quantitative Methods",
        estimatedMinutes: 420, // 7h
        completedMinutes: 0,
        status: "not_started",
        order: 6,
        children: [
          { id: "qm-6-1", title: "Estrutura de Testes", competency: "Hypothesis", estimatedMinutes: 90, completedMinutes: 0, status: "not_started", order: 1 },
          { id: "qm-6-2", title: "Erros Tipo I e II", competency: "Hypothesis", estimatedMinutes: 90, completedMinutes: 0, status: "not_started", order: 2 },
          { id: "qm-6-3", title: "Testes para Média", competency: "Hypothesis", estimatedMinutes: 120, completedMinutes: 0, status: "not_started", order: 3 },
          { id: "qm-6-4", title: "P-valor e Decisões", competency: "Hypothesis", estimatedMinutes: 120, completedMinutes: 0, status: "not_started", order: 4 },
        ],
      },
      {
        id: "qm-7",
        title: "Introduction to Linear Regression",
        competency: "Quantitative Methods",
        estimatedMinutes: 360, // 6h
        completedMinutes: 0,
        status: "not_started",
        order: 7,
        children: [
          { id: "qm-7-1", title: "Conceitos de Regressão", competency: "Regression", estimatedMinutes: 90, completedMinutes: 0, status: "not_started", order: 1 },
          { id: "qm-7-2", title: "Mínimos Quadrados (OLS)", competency: "Regression", estimatedMinutes: 90, completedMinutes: 0, status: "not_started", order: 2 },
          { id: "qm-7-3", title: "R² e ANOVA", competency: "Regression", estimatedMinutes: 90, completedMinutes: 0, status: "not_started", order: 3 },
          { id: "qm-7-4", title: "Premissas e Diagnóstico", competency: "Regression", estimatedMinutes: 90, completedMinutes: 0, status: "not_started", order: 4 },
        ],
      },
    ],
  };
  
  // Generate realistic session history (last 30 days)
  const sessions: StudySession[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDateISO(date);
    
    // Realistic study pattern (skip some days, vary duration)
    const shouldStudy = Math.random() > 0.25; // 75% chance
    if (shouldStudy) {
      const sessionCount = Math.random() > 0.7 ? 2 : 1;
      for (let j = 0; j < sessionCount; j++) {
        sessions.push({
          id: `session-${i}-${j}`,
          date: dateStr,
          duration: Math.floor(Math.random() * 60) + 30, // 30-90 min
          programId: "cfa-quant-methods",
          type: Math.random() > 0.8 ? "review" : "study",
        });
      }
    }
  }
  
  return {
    activeProgramId: "cfa-quant-methods",
    programs: [mockProgram],
    sessions,
  };
}
