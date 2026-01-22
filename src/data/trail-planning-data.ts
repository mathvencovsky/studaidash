// ============================================================================
// TRAIL PLANNING MOCK DATA & CALCULATIONS
// ============================================================================

export interface TrailModule {
  id: string;
  title: string;
  estimatedHours: number;
  completedHours: number;
  status: "not_started" | "in_progress" | "completed";
}

export interface StudyLogEntry {
  date: string; // YYYY-MM-DD
  minutesStudied: number;
}

export interface TrailPlan {
  id: string;
  name: string;
  description: string;
  category: "certification" | "concurso" | "career" | "skill";
  icon: string;
  color: string;
  totalEstimatedHours: number;
  completedHours: number;
  targetDate: string; // YYYY-MM-DD
  startDate: string; // YYYY-MM-DD
  modules: TrailModule[];
  isActive: boolean;
}

export interface UserStudyData {
  studyLog: StudyLogEntry[];
  streak: number;
  activeTrailId: string;
}

// ============================================================================
// AVAILABLE TRAILS / PROGRAMS
// ============================================================================

export interface AvailableTrail {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: "certification" | "concurso" | "career" | "skill";
  icon: string;
  color: string;
  totalModules: number;
  totalHours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  isPopular?: boolean;
  isNew?: boolean;
}

export const AVAILABLE_TRAILS: AvailableTrail[] = [
  {
    id: "cfa-level1",
    name: "CFA Level I – Quantitative Methods",
    shortName: "CFA Level I",
    description: "Preparação completa para a certificação CFA, focando em métodos quantitativos",
    category: "certification",
    icon: "📊",
    color: "from-blue-600 to-indigo-700",
    totalModules: 7,
    totalHours: 44,
    difficulty: "advanced",
    isPopular: true,
  },
  {
    id: "bacen-analista",
    name: "Concurso BACEN – Analista",
    shortName: "BACEN Analista",
    description: "Trilha completa para o concurso do Banco Central do Brasil",
    category: "concurso",
    icon: "🏛️",
    color: "from-emerald-600 to-teal-700",
    totalModules: 12,
    totalHours: 120,
    difficulty: "advanced",
    isPopular: true,
  },
  {
    id: "data-science",
    name: "Data Science Foundations",
    shortName: "Data Science",
    description: "Fundamentos de ciência de dados: Python, estatística e machine learning",
    category: "career",
    icon: "🤖",
    color: "from-purple-600 to-pink-700",
    totalModules: 10,
    totalHours: 80,
    difficulty: "intermediate",
    isNew: true,
  },
  {
    id: "oab-1fase",
    name: "OAB – 1ª Fase",
    shortName: "OAB 1ª Fase",
    description: "Preparação intensiva para o Exame de Ordem dos Advogados",
    category: "concurso",
    icon: "⚖️",
    color: "from-amber-600 to-orange-700",
    totalModules: 17,
    totalHours: 200,
    difficulty: "intermediate",
  },
  {
    id: "pmp-cert",
    name: "PMP Certification",
    shortName: "PMP",
    description: "Project Management Professional certification prep",
    category: "certification",
    icon: "📋",
    color: "from-sky-600 to-cyan-700",
    totalModules: 8,
    totalHours: 60,
    difficulty: "intermediate",
  },
  {
    id: "aws-cloud",
    name: "AWS Cloud Practitioner",
    shortName: "AWS Cloud",
    description: "Certificação de entrada para Amazon Web Services",
    category: "certification",
    icon: "☁️",
    color: "from-orange-500 to-yellow-600",
    totalModules: 6,
    totalHours: 30,
    difficulty: "beginner",
    isNew: true,
  },
];

// ============================================================================
// MOCK DATA
// ============================================================================

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split("T")[0];

// Generate last 14 days of study log
const generateStudyLog = (): StudyLogEntry[] => {
  const log: StudyLogEntry[] = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // Simulate realistic study patterns (some days more, some less, some zero)
    const patterns = [0, 30, 45, 60, 75, 90, 45, 60, 0, 50, 70, 80, 55, 65];
    log.push({
      date: formatDate(date),
      minutesStudied: patterns[i] || 0,
    });
  }
  return log;
};

export const MOCK_STUDY_DATA: UserStudyData = {
  studyLog: generateStudyLog(),
  streak: 12,
  activeTrailId: "cfa-quant-methods",
};

// Target date: 60 days from now
const targetDate = new Date(today);
targetDate.setDate(targetDate.getDate() + 60);

// Start date: 30 days ago
const startDate = new Date(today);
startDate.setDate(startDate.getDate() - 30);

export const MOCK_TRAIL_PLAN: TrailPlan = {
  id: "cfa-quant-methods",
  name: "CFA Level I – Quantitative Methods",
  description: "Preparação completa para a certificação CFA, focando em métodos quantitativos",
  category: "certification",
  icon: "📊",
  color: "from-blue-600 to-indigo-700",
  totalEstimatedHours: 44, // Sum of all module hours
  completedHours: 18.5,
  targetDate: formatDate(targetDate),
  startDate: formatDate(startDate),
  isActive: true,
  modules: [
    {
      id: "qm-1",
      title: "Time Value of Money",
      estimatedHours: 6,
      completedHours: 6,
      status: "completed",
    },
    {
      id: "qm-2",
      title: "Organizing, Visualizing, and Describing Data",
      estimatedHours: 5,
      completedHours: 5,
      status: "completed",
    },
    {
      id: "qm-3",
      title: "Probability Concepts",
      estimatedHours: 8,
      completedHours: 6,
      status: "in_progress",
    },
    {
      id: "qm-4",
      title: "Common Probability Distributions",
      estimatedHours: 7,
      completedHours: 1.5,
      status: "in_progress",
    },
    {
      id: "qm-5",
      title: "Sampling and Estimation",
      estimatedHours: 5,
      completedHours: 0,
      status: "not_started",
    },
    {
      id: "qm-6",
      title: "Hypothesis Testing",
      estimatedHours: 7,
      completedHours: 0,
      status: "not_started",
    },
    {
      id: "qm-7",
      title: "Introduction to Linear Regression",
      estimatedHours: 6,
      completedHours: 0,
      status: "not_started",
    },
  ],
};

// ============================================================================
// CALCULATION FUNCTIONS (Deterministic)
// ============================================================================

export interface TrailCalculations {
  // Basic progress
  remainingHours: number;
  progressPercent: number;
  
  // Time calculations
  daysUntilTarget: number;
  daysSinceStart: number;
  totalPlanDays: number;
  
  // Required pace
  requiredHoursPerDay: number;
  requiredHoursPerWeek: number;
  requiredMinutesPerDay: number;
  
  // Current pace (last 7 days)
  currentWeeklyHours: number;
  currentDailyAvgMinutes: number;
  studyDaysLast7: number;
  
  // Status
  onTrack: boolean;
  paceRatio: number; // current / required (>1 = ahead, <1 = behind)
  
  // Projections
  estimatedFinishDate: Date;
  daysToFinishAtCurrentPace: number;
  
  // Recommendations
  extraMinutesNeededToday: number;
}

export function calculateTrailMetrics(
  trail: TrailPlan,
  studyData: UserStudyData
): TrailCalculations {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(trail.targetDate);
  targetDate.setHours(0, 0, 0, 0);
  
  const startDate = new Date(trail.startDate);
  startDate.setHours(0, 0, 0, 0);
  
  // Basic progress
  const remainingHours = Math.max(trail.totalEstimatedHours - trail.completedHours, 0);
  const progressPercent = trail.totalEstimatedHours > 0 
    ? Math.round((trail.completedHours / trail.totalEstimatedHours) * 100) 
    : 0;
  
  // Time calculations
  const daysUntilTarget = Math.max(
    Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
    0
  );
  const daysSinceStart = Math.max(
    Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    1
  );
  const totalPlanDays = Math.max(
    Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    1
  );
  
  // Required pace
  const requiredHoursPerDay = daysUntilTarget > 0 ? remainingHours / daysUntilTarget : remainingHours;
  const requiredHoursPerWeek = requiredHoursPerDay * 7;
  const requiredMinutesPerDay = requiredHoursPerDay * 60;
  
  // Current pace (last 7 days)
  const last7Days = studyData.studyLog.slice(-7);
  const totalMinutesLast7Days = last7Days.reduce((sum, entry) => sum + entry.minutesStudied, 0);
  const currentWeeklyHours = totalMinutesLast7Days / 60;
  const currentDailyAvgMinutes = totalMinutesLast7Days / 7;
  const studyDaysLast7 = last7Days.filter(entry => entry.minutesStudied > 0).length;
  
  // Status
  const onTrack = currentWeeklyHours >= requiredHoursPerWeek * 0.9; // 90% tolerance
  const paceRatio = requiredHoursPerWeek > 0 ? currentWeeklyHours / requiredHoursPerWeek : 1;
  
  // Projections
  const weeksToFinish = currentWeeklyHours > 0.1 
    ? remainingHours / currentWeeklyHours 
    : remainingHours / 0.1;
  const daysToFinishAtCurrentPace = Math.ceil(weeksToFinish * 7);
  
  const estimatedFinishDate = new Date(today);
  estimatedFinishDate.setDate(estimatedFinishDate.getDate() + daysToFinishAtCurrentPace);
  
  // Recommendations
  const dailyDeficit = requiredMinutesPerDay - currentDailyAvgMinutes;
  const extraMinutesNeededToday = Math.max(Math.ceil(dailyDeficit), 0);
  
  return {
    remainingHours,
    progressPercent,
    daysUntilTarget,
    daysSinceStart,
    totalPlanDays,
    requiredHoursPerDay,
    requiredHoursPerWeek,
    requiredMinutesPerDay,
    currentWeeklyHours,
    currentDailyAvgMinutes,
    studyDaysLast7,
    onTrack,
    paceRatio,
    estimatedFinishDate,
    daysToFinishAtCurrentPace,
    extraMinutesNeededToday,
  };
}

// Format helpers
export function formatHoursMinutes(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m.toString().padStart(2, "0")}`;
}

export function formatMinutesToHoursMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m.toString().padStart(2, "0")}`;
}

export function formatDateBR(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
