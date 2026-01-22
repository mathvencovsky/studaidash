// ============================================================================
// STUDAI TYPES - CFA Level I Dashboard
// ============================================================================

export interface DailyMission {
  id: string;
  title: string;
  objective: string;
  estimatedMinutes: number;
  status: "not_started" | "in_progress" | "completed";
  tasks: MissionTask[];
  moduleId: string;
  competency: string;
  date: string; // YYYY-MM-DD
}

export interface MissionTask {
  id: string;
  type: "reading" | "practice" | "summary" | "quiz";
  label: string;
  completed: boolean;
  estimatedMinutes: number;
}

export interface CFAModule {
  id: string;
  name: string;
  topic: string; // e.g., "Quantitative Methods"
  order: number;
  progress: number; // 0-100
  status: "locked" | "active" | "completed";
  totalLessons: number;
  completedLessons: number;
  estimatedHours: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  totalStudyMinutes: number;
  badges: Badge[];
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: number;
  unlocked: boolean;
}

export interface Quiz {
  id: string;
  moduleId: string;
  moduleName: string;
  totalQuestions: number;
  lastScore?: number;
  lastAttemptDate?: string;
  attempts: number;
  status: "not_started" | "in_progress" | "completed";
  type: "module" | "practice" | "cfa_style";
}

export interface Simulado {
  id: string;
  name: string;
  type: "partial" | "full";
  description: string;
  totalQuestions: number;
  durationMinutes: number;
  lastScore?: number;
  lastAttemptDate?: string;
  attempts: number;
  readinessMessage?: string;
}

export interface SmartFeedback {
  id: string;
  type: "focus" | "weakness" | "suggestion" | "celebration";
  title: string;
  message: string;
  actionLabel?: string;
  actionModuleId?: string;
  priority: number;
  createdAt: number;
}

export interface StudySession {
  id: string;
  date: string;
  duration: number;
  moduleId: string;
  type: "reading" | "practice" | "quiz" | "simulado";
  xpEarned: number;
}
