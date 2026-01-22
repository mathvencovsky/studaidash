// ============================================================================
// STUDY GOALS DATA MODEL - Camada de Objetivos
// ============================================================================

import { AVAILABLE_TRAILS, type AvailableTrail } from "./trail-planning-data";

// ============================================================================
// TYPES
// ============================================================================

export type GoalCategory = "concurso" | "certification" | "career" | "continuous";

export interface StudyGoal {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: GoalCategory;
  icon: string;
  color: string;
  targetDate?: string; // YYYY-MM-DD (optional for continuous learning)
  totalEstimatedHours: number;
  completedHours: number;
  priority: number; // 1 = highest
  trailIds: string[]; // IDs of trails linked to this goal
  isActive: boolean;
  createdAt: string;
}

export interface GoalProgress {
  goalId: string;
  progressPercent: number;
  hoursRemaining: number;
  daysRemaining: number | null;
  requiredMinutesPerDay: number | null;
  currentDailyAvgMinutes: number;
  status: "on_track" | "attention" | "at_risk" | "completed" | "continuous";
  statusMessage: string;
}

// ============================================================================
// CATEGORY LABELS & ICONS
// ============================================================================

export const GOAL_CATEGORY_CONFIG: Record<GoalCategory, { label: string; icon: string; description: string }> = {
  concurso: {
    label: "Concurso Público",
    icon: "🏛️",
    description: "Preparação para concursos e exames oficiais"
  },
  certification: {
    label: "Certificação",
    icon: "📊",
    description: "Certificações profissionais reconhecidas"
  },
  career: {
    label: "Carreira",
    icon: "🚀",
    description: "Desenvolvimento de habilidades para carreira"
  },
  continuous: {
    label: "Aprendizado Contínuo",
    icon: "📚",
    description: "Aprendizado sem prazo definido"
  }
};

// ============================================================================
// MOCK STUDY GOALS
// ============================================================================

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split("T")[0];

// Target dates for different goals
const cfaDate = new Date(today);
cfaDate.setMonth(cfaDate.getMonth() + 3);

const bacenDate = new Date(today);
bacenDate.setMonth(bacenDate.getMonth() + 6);

const dataDate = new Date(today);
dataDate.setMonth(dataDate.getMonth() + 4);

export const MOCK_STUDY_GOALS: StudyGoal[] = [
  {
    id: "goal-cfa-level1",
    name: "CFA Level I Candidate",
    shortName: "CFA Level I",
    description: "Preparação completa para a certificação CFA Level I, focando em métodos quantitativos e análise financeira",
    category: "certification",
    icon: "📊",
    color: "from-blue-600 to-indigo-700",
    targetDate: formatDate(cfaDate),
    totalEstimatedHours: 300,
    completedHours: 45,
    priority: 1,
    trailIds: ["cfa-level1"],
    isActive: true,
    createdAt: formatDate(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)),
  },
  {
    id: "goal-bacen-analista",
    name: "Candidato BACEN Analista",
    shortName: "BACEN",
    description: "Preparação estratégica para o concurso do Banco Central do Brasil - Área 1",
    category: "concurso",
    icon: "🏛️",
    color: "from-emerald-600 to-teal-700",
    targetDate: formatDate(bacenDate),
    totalEstimatedHours: 600,
    completedHours: 0,
    priority: 2,
    trailIds: ["bacen-analista"],
    isActive: false,
    createdAt: formatDate(new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)),
  },
  {
    id: "goal-data-analyst",
    name: "Data Analyst Júnior",
    shortName: "Data Analyst",
    description: "Transição de carreira para área de dados com Python, SQL e ferramentas de BI",
    category: "career",
    icon: "🤖",
    color: "from-purple-600 to-pink-700",
    targetDate: formatDate(dataDate),
    totalEstimatedHours: 200,
    completedHours: 25,
    priority: 3,
    trailIds: ["data-science"],
    isActive: false,
    createdAt: formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
  },
  {
    id: "goal-english-finance",
    name: "Inglês para Mercado Financeiro",
    shortName: "English Finance",
    description: "Inglês técnico aplicado ao mercado financeiro e comunicação profissional",
    category: "continuous",
    icon: "🌍",
    color: "from-sky-500 to-cyan-600",
    targetDate: undefined, // No deadline for continuous learning
    totalEstimatedHours: 100,
    completedHours: 15,
    priority: 4,
    trailIds: [],
    isActive: false,
    createdAt: formatDate(new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000)),
  },
];

// ============================================================================
// STORAGE
// ============================================================================

const GOALS_STORAGE_KEY = "studai_study_goals";

export function loadStudyGoals(): StudyGoal[] {
  try {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.warn("Failed to load study goals from localStorage");
  }
  return MOCK_STUDY_GOALS;
}

export function saveStudyGoals(goals: StudyGoal[]): void {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch {
    console.error("Failed to save study goals");
  }
}

export function getActiveGoal(): StudyGoal | null {
  const goals = loadStudyGoals();
  return goals.find(g => g.isActive) || null;
}

export function setActiveGoal(goalId: string): void {
  const goals = loadStudyGoals();
  const updated = goals.map(g => ({
    ...g,
    isActive: g.id === goalId
  }));
  saveStudyGoals(updated);
}

// ============================================================================
// CALCULATIONS
// ============================================================================

export function calculateGoalProgress(
  goal: StudyGoal,
  currentDailyAvgMinutes: number = 60
): GoalProgress {
  const progressPercent = goal.totalEstimatedHours > 0
    ? Math.round((goal.completedHours / goal.totalEstimatedHours) * 100)
    : 0;
  
  const hoursRemaining = Math.max(0, goal.totalEstimatedHours - goal.completedHours);
  
  // For continuous learning, no deadline
  if (!goal.targetDate || goal.category === "continuous") {
    return {
      goalId: goal.id,
      progressPercent,
      hoursRemaining,
      daysRemaining: null,
      requiredMinutesPerDay: null,
      currentDailyAvgMinutes,
      status: progressPercent >= 100 ? "completed" : "continuous",
      statusMessage: progressPercent >= 100 
        ? "Objetivo concluído! 🎉" 
        : "Estudo contínuo - sem prazo definido"
    };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(goal.targetDate + "T00:00:00");
  const daysRemaining = Math.max(0, Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  const remainingMinutes = hoursRemaining * 60;
  const requiredMinutesPerDay = daysRemaining > 0 
    ? Math.ceil(remainingMinutes / daysRemaining) 
    : remainingMinutes;
  
  const delta = requiredMinutesPerDay - currentDailyAvgMinutes;
  
  let status: GoalProgress["status"];
  let statusMessage: string;
  
  if (progressPercent >= 100) {
    status = "completed";
    statusMessage = "Objetivo concluído! 🎉";
  } else if (delta <= 0) {
    status = "on_track";
    statusMessage = "Você está no ritmo certo!";
  } else if (delta <= 20) {
    status = "attention";
    statusMessage = `Aumente ${delta}min/dia para manter o prazo`;
  } else {
    status = "at_risk";
    statusMessage = `Precisa de +${delta}min/dia para cumprir o prazo`;
  }
  
  return {
    goalId: goal.id,
    progressPercent,
    hoursRemaining,
    daysRemaining,
    requiredMinutesPerDay,
    currentDailyAvgMinutes,
    status,
    statusMessage
  };
}

// ============================================================================
// HELPERS
// ============================================================================

export function getTrailsForGoal(goal: StudyGoal): AvailableTrail[] {
  return AVAILABLE_TRAILS.filter(t => goal.trailIds.includes(t.id));
}

export function formatGoalCategory(category: GoalCategory): string {
  return GOAL_CATEGORY_CONFIG[category].label;
}
