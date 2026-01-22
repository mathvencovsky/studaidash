import { 
  BookOpen, 
  Brain, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  Clock,
  Play,
  Sparkles,
  Circle
} from "lucide-react";
import type { DailyMission, MissionTask } from "@/types/studai";

interface DailyMissionCardProps {
  mission: DailyMission;
  onStartMission: () => void;
  onToggleTask: (taskId: string) => void;
}

const taskIcons: Record<MissionTask["type"], typeof BookOpen> = {
  reading: BookOpen,
  practice: Brain,
  summary: FileText,
  quiz: HelpCircle,
};

const taskLabels: Record<MissionTask["type"], string> = {
  reading: "Leitura",
  practice: "Prática",
  summary: "Resumo",
  quiz: "Quiz",
};

export function DailyMissionCard({ mission, onStartMission, onToggleTask }: DailyMissionCardProps) {
  const completedTasks = mission.tasks.filter(t => t.completed).length;
  const totalTasks = mission.tasks.length;
  const progress = Math.round((completedTasks / totalTasks) * 100);

  const statusConfig = {
    not_started: {
      label: "Não iniciada",
      bg: "bg-secondary",
      text: "text-muted-foreground",
    },
    in_progress: {
      label: "Em progresso",
      bg: "bg-accent/10",
      text: "text-accent",
    },
    completed: {
      label: "Concluída",
      bg: "bg-status-success",
      text: "text-status-success-text",
    },
  };

  const status = statusConfig[mission.status];

  return (
    <div className="bg-card border-2 border-accent/20 rounded-2xl overflow-hidden shadow-lg">
      {/* Header with gradient - More compact on mobile */}
      <div className="bg-gradient-to-br from-primary via-primary to-accent p-4 sm:p-5 text-primary-foreground relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          {/* Title row - Stack on very small screens */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Sparkles size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm sm:text-lg font-bold leading-tight">{mission.title}</h2>
                <p className="text-[11px] sm:text-sm opacity-80 truncate">{mission.competency}</p>
              </div>
            </div>
            <div className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shrink-0 whitespace-nowrap ${status.bg} ${status.text}`}>
              {status.label}
            </div>
          </div>

          {/* Objective - Hidden on very small screens, show abbreviated */}
          <p className="text-xs sm:text-sm opacity-90 mb-3 leading-relaxed line-clamp-2 hidden xs:block">
            {mission.objective}
          </p>

          {/* Stats row - More compact on mobile */}
          <div className="flex items-center gap-2 text-[11px] sm:text-sm">
            <div className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-lg">
              <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="font-medium">{mission.estimatedMinutes}min</span>
            </div>
            <div className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-lg">
              <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="font-medium">{completedTasks}/{totalTasks}</span>
            </div>
            {/* Progress on mobile inline */}
            <div className="flex-1 flex items-center gap-2 ml-auto">
              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/80 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold opacity-90">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Checklist - Optimized touch targets */}
      <div className="p-3 sm:p-4 space-y-2">
        {mission.tasks.map((task) => {
          const Icon = taskIcons[task.type];
          return (
            <button
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`w-full flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border transition-all duration-200 min-h-[52px] sm:min-h-[56px] touch-manipulation ${
                task.completed 
                  ? "bg-status-success/40 border-status-success-text/20" 
                  : "bg-secondary/30 border-transparent hover:bg-secondary/60 active:bg-secondary active:scale-[0.98]"
              }`}
            >
              {/* Checkbox circle - Larger touch target */}
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                task.completed 
                  ? "bg-status-success-text border-status-success-text" 
                  : "border-accent/40 bg-transparent"
              }`}>
                {task.completed ? (
                  <CheckCircle2 size={14} className="sm:w-4 sm:h-4 text-white" />
                ) : (
                  <Circle size={14} className="sm:w-4 sm:h-4 text-transparent" />
                )}
              </div>

              {/* Task icon */}
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${
                task.completed 
                  ? "bg-status-success-text/20 text-status-success-text" 
                  : "bg-accent/10 text-accent"
              }`}>
                <Icon size={14} className="sm:w-4 sm:h-4" />
              </div>

              {/* Task info */}
              <div className="flex-1 text-left min-w-0">
                <p className={`font-medium text-xs sm:text-sm leading-tight ${
                  task.completed ? "line-through text-muted-foreground" : "text-card-foreground"
                }`}>
                  {task.label}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  {task.estimatedMinutes}min • {taskLabels[task.type]}
                </p>
              </div>

              {/* Completed indicator */}
              {task.completed && (
                <CheckCircle2 size={16} className="sm:w-5 sm:h-5 text-status-success-text shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* CTA Button - Full width, proper touch size */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <button
          onClick={onStartMission}
          disabled={mission.status === "completed"}
          className="w-full py-3.5 sm:py-4 px-4 bg-accent text-accent-foreground rounded-xl font-semibold text-sm sm:text-base hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] touch-manipulation min-h-[48px]"
        >
          {mission.status === "completed" ? (
            <>
              <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
              Missão Concluída!
            </>
          ) : mission.status === "in_progress" ? (
            <>
              <Play size={18} className="sm:w-5 sm:h-5" />
              Continuar Missão
            </>
          ) : (
            <>
              <Play size={18} className="sm:w-5 sm:h-5" />
              Iniciar Missão
            </>
          )}
        </button>
      </div>
    </div>
  );
}
