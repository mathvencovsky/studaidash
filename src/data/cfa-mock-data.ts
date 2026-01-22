import type { 
  DailyMission, 
  CFAModule, 
  UserProgress, 
  Badge, 
  Quiz, 
  Simulado, 
  SmartFeedback 
} from "@/types/studai";

// ============================================================================
// CFA LEVEL I - QUANTITATIVE METHODS MOCK DATA
// ============================================================================

export const CFA_MODULES: CFAModule[] = [
  {
    id: "qm-1",
    name: "Time Value of Money",
    topic: "Quantitative Methods",
    order: 1,
    progress: 100,
    status: "completed",
    totalLessons: 8,
    completedLessons: 8,
    estimatedHours: 6,
  },
  {
    id: "qm-2",
    name: "Organizing, Visualizing, and Describing Data",
    topic: "Quantitative Methods",
    order: 2,
    progress: 100,
    status: "completed",
    totalLessons: 6,
    completedLessons: 6,
    estimatedHours: 5,
  },
  {
    id: "qm-3",
    name: "Probability Concepts",
    topic: "Quantitative Methods",
    order: 3,
    progress: 75,
    status: "active",
    totalLessons: 10,
    completedLessons: 7,
    estimatedHours: 8,
  },
  {
    id: "qm-4",
    name: "Common Probability Distributions",
    topic: "Quantitative Methods",
    order: 4,
    progress: 40,
    status: "active",
    totalLessons: 8,
    completedLessons: 3,
    estimatedHours: 7,
  },
  {
    id: "qm-5",
    name: "Sampling and Estimation",
    topic: "Quantitative Methods",
    order: 5,
    progress: 0,
    status: "locked",
    totalLessons: 6,
    completedLessons: 0,
    estimatedHours: 5,
  },
  {
    id: "qm-6",
    name: "Hypothesis Testing",
    topic: "Quantitative Methods",
    order: 6,
    progress: 0,
    status: "locked",
    totalLessons: 8,
    completedLessons: 0,
    estimatedHours: 7,
  },
  {
    id: "qm-7",
    name: "Introduction to Linear Regression",
    topic: "Quantitative Methods",
    order: 7,
    progress: 0,
    status: "locked",
    totalLessons: 6,
    completedLessons: 0,
    estimatedHours: 6,
  },
];

export const DEFAULT_BADGES: Badge[] = [
  {
    id: "first-step",
    name: "Primeiro Passo",
    description: "Complete sua primeira missão",
    icon: "🎯",
    earnedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    unlocked: true,
  },
  {
    id: "consistency-king",
    name: "Consistência é Rei",
    description: "Mantenha um streak de 7 dias",
    icon: "👑",
    earnedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    unlocked: true,
  },
  {
    id: "quant-warrior",
    name: "Quant Warrior",
    description: "Complete 5 quizzes de Quantitative Methods",
    icon: "⚔️",
    earnedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    unlocked: true,
  },
  {
    id: "time-master",
    name: "Time Master",
    description: "Complete o módulo Time Value of Money",
    icon: "⏰",
    earnedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    unlocked: true,
  },
  {
    id: "week-champion",
    name: "Campeão Semanal",
    description: "Atinja sua meta semanal",
    icon: "🏆",
    unlocked: false,
  },
  {
    id: "perfect-score",
    name: "Nota Perfeita",
    description: "Tire 100% em um quiz",
    icon: "💯",
    unlocked: false,
  },
];

export const DEFAULT_USER_PROGRESS: UserProgress = {
  xp: 2450,
  level: 8,
  streak: 12,
  totalStudyMinutes: 1840,
  badges: DEFAULT_BADGES,
  weeklyGoal: 300,
  weeklyProgress: 185,
};

export const getTodayMission = (): DailyMission => {
  const today = new Date().toISOString().split("T")[0];
  return {
    id: `mission-${today}`,
    title: "Missão do Dia",
    objective: "Dominar distribuições de probabilidade contínuas e aplicar em contextos de investimento",
    estimatedMinutes: 75,
    status: "not_started",
    moduleId: "qm-4",
    competency: "Common Probability Distributions",
    date: today,
    tasks: [
      {
        id: "task-1",
        type: "reading",
        label: "Leitura guiada: Distribuição Normal",
        completed: false,
        estimatedMinutes: 25,
      },
      {
        id: "task-2",
        type: "practice",
        label: "Prática: Cálculos com z-score",
        completed: false,
        estimatedMinutes: 20,
      },
      {
        id: "task-3",
        type: "summary",
        label: "Micro-resumo: Conceitos-chave",
        completed: false,
        estimatedMinutes: 10,
      },
      {
        id: "task-4",
        type: "quiz",
        label: "Mini-quiz: 5 questões CFA-style",
        completed: false,
        estimatedMinutes: 20,
      },
    ],
  };
};

export const CFA_QUIZZES: Quiz[] = [
  {
    id: "quiz-qm1",
    moduleId: "qm-1",
    moduleName: "Time Value of Money",
    totalQuestions: 15,
    lastScore: 87,
    lastAttemptDate: "2025-01-20",
    attempts: 2,
    status: "completed",
    type: "module",
  },
  {
    id: "quiz-qm2",
    moduleId: "qm-2",
    moduleName: "Organizing & Describing Data",
    totalQuestions: 12,
    lastScore: 92,
    lastAttemptDate: "2025-01-19",
    attempts: 1,
    status: "completed",
    type: "module",
  },
  {
    id: "quiz-qm3",
    moduleId: "qm-3",
    moduleName: "Probability Concepts",
    totalQuestions: 18,
    lastScore: 72,
    lastAttemptDate: "2025-01-21",
    attempts: 1,
    status: "in_progress",
    type: "module",
  },
  {
    id: "quiz-qm4",
    moduleId: "qm-4",
    moduleName: "Common Probability Distributions",
    totalQuestions: 15,
    attempts: 0,
    status: "not_started",
    type: "module",
  },
  {
    id: "quiz-qm5",
    moduleId: "qm-5",
    moduleName: "Sampling and Estimation",
    totalQuestions: 12,
    attempts: 0,
    status: "not_started",
    type: "module",
  },
];

export const CFA_SIMULADOS: Simulado[] = [
  {
    id: "sim-partial",
    name: "Simulado Parcial - Quant",
    type: "partial",
    description: "50 questões focadas em Quantitative Methods",
    totalQuestions: 50,
    durationMinutes: 75,
    lastScore: 68,
    lastAttemptDate: "2025-01-15",
    attempts: 1,
    readinessMessage: "Você pode melhorar! Revise probabilidade antes de tentar novamente.",
  },
  {
    id: "sim-full",
    name: "Simulado Completo CFA-Style",
    type: "full",
    description: "180 questões cobrindo todo o Level I",
    totalQuestions: 180,
    durationMinutes: 270,
    attempts: 0,
    readinessMessage: "Complete pelo menos 70% da trilha antes de tentar.",
  },
];

export const getSmartFeedback = (): SmartFeedback => {
  return {
    id: "feedback-1",
    type: "focus",
    title: "Próxima Melhor Ação",
    message: "Hoje o foco é reforçar capitalização não anual. Sua taxa de erro nesse tema está 23% acima da média. Pratique mais 3 exercícios para consolidar.",
    actionLabel: "Praticar agora",
    actionModuleId: "qm-4",
    priority: 1,
    createdAt: Date.now(),
  };
};

// Calculate overall trail progress
export const calculateTrailProgress = (modules: CFAModule[]): number => {
  const totalLessons = modules.reduce((acc, m) => acc + m.totalLessons, 0);
  const completedLessons = modules.reduce((acc, m) => acc + m.completedLessons, 0);
  return Math.round((completedLessons / totalLessons) * 100);
};

// XP needed for next level
export const getXPForNextLevel = (level: number): number => {
  return level * 500;
};

// Current level progress percentage
export const getLevelProgress = (xp: number, level: number): number => {
  const xpForCurrentLevel = (level - 1) * 500;
  const xpForNextLevel = level * 500;
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  return Math.min(100, Math.round((xpInCurrentLevel / xpNeeded) * 100));
};
