import { 
  BookOpen, 
  Brain, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  Clock,
  Play,
  Sparkles,
  Circle,
  ChevronRight
} from "lucide-react";
import type { DailyMission, MissionTask } from "@/types/studai";

interface DailyMissionCardProps {
  mission: DailyMission;
  onStartMission: () => void;
  onToggleTask: (taskId: string) => void;
  onTaskClick?: (task: MissionTask) => void;
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

export function DailyMissionCard({ mission, onStartMission, onToggleTask, onTaskClick }: DailyMissionCardProps) {
  const completedTasks = mission.tasks.filter(t => t.completed).length;
  const totalTasks = mission.tasks.length;
  const progress = Math.round((completedTasks / totalTasks) * 100);

  // Find the first incomplete task
  const nextTask = mission.tasks.find(t => !t.completed);

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

  const handleTaskAction = (task: MissionTask, e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.completed) {
      // If completed, just toggle (uncheck)
      onToggleTask(task.id);
    } else if (onTaskClick) {
      // If not completed, navigate to study content
      onTaskClick(task);
    }
  };

  const handleMarkComplete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleTask(taskId);
  };

  return (
    <div className="bg-card border-2 border-accent/20 rounded-2xl overflow-hidden shadow-lg w-full">
      {/* Header with gradient - More compact on mobile */}
      <div className="bg-gradient-to-br from-primary via-primary to-accent p-3 sm:p-5 text-primary-foreground relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          {/* Title row - Wrap status badge on small screens */}
          <div className="flex flex-wrap items-start justify-between gap-1.5 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Sparkles size={14} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-[13px] sm:text-lg font-bold leading-tight">{mission.title}</h2>
                <p className="text-[10px] sm:text-sm opacity-80 truncate max-w-[180px] sm:max-w-none">{mission.competency}</p>
              </div>
            </div>
            <div className={`px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold shrink-0 ${status.bg} ${status.text}`}>
              {status.label}
            </div>
          </div>

          {/* Stats row - More compact on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm flex-wrap">
            <div className="flex items-center gap-1 bg-white/15 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
              <Clock size={10} className="sm:w-3.5 sm:h-3.5" />
              <span className="font-medium">{mission.estimatedMinutes}min</span>
            </div>
            <div className="flex items-center gap-1 bg-white/15 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
              <CheckCircle2 size={10} className="sm:w-3.5 sm:h-3.5" />
              <span className="font-medium">{completedTasks}/{totalTasks}</span>
            </div>
            {/* Progress on mobile inline */}
            <div className="flex-1 flex items-center gap-1.5 sm:gap-2 min-w-[60px]">
              <div className="flex-1 h-1 sm:h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/80 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold opacity-90">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Checklist - Optimized touch targets */}
      <div className="p-3 sm:p-4 space-y-2">
        {mission.tasks.map((task) => {
          const Icon = taskIcons[task.type];
          return (
            <div
              key={task.id}
              className={`w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl border transition-all duration-200 min-h-[52px] sm:min-h-[56px] ${
                task.completed 
                  ? "bg-status-success/40 border-status-success-text/20" 
                  : "bg-secondary/30 border-transparent hover:bg-secondary/60"
              }`}
            >
              {/* Checkbox button */}
              <button
                onClick={(e) => handleMarkComplete(task.id, e)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all touch-manipulation active:scale-95 ${
                  task.completed 
                    ? "bg-status-success-text border-status-success-text" 
                    : "border-accent/40 bg-transparent hover:border-accent hover:bg-accent/10"
                }`}
                title={task.completed ? "Desmarcar" : "Marcar como concluído"}
              >
                {task.completed ? (
                  <CheckCircle2 size={14} className="sm:w-4 sm:h-4 text-white" />
                ) : (
                  <Circle size={14} className="sm:w-4 sm:h-4 text-accent/40" />
                )}
              </button>

              {/* Task content - clickable to start studying */}
              <button
                onClick={(e) => handleTaskAction(task, e)}
                disabled={task.completed}
                className={`flex-1 flex items-center gap-2 sm:gap-3 text-left min-w-0 touch-manipulation ${
                  !task.completed ? "hover:opacity-80 active:scale-[0.99]" : ""
                }`}
              >
                {/* Task icon */}
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  task.completed 
                    ? "bg-status-success-text/20 text-status-success-text" 
                    : "bg-accent/10 text-accent"
                }`}>
                  <Icon size={14} className="sm:w-4 sm:h-4" />
                </div>

                {/* Task info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-xs sm:text-sm leading-tight ${
                    task.completed ? "line-through text-muted-foreground" : "text-card-foreground"
                  }`}>
                    {task.label}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    {task.estimatedMinutes}min • {taskLabels[task.type]}
                  </p>
                </div>

                {/* Action indicator */}
                {!task.completed && (
                  <ChevronRight size={16} className="sm:w-5 sm:h-5 text-accent shrink-0" />
                )}
              </button>

              {/* Completed indicator */}
              {task.completed && (
                <CheckCircle2 size={16} className="sm:w-5 sm:h-5 text-status-success-text shrink-0" />
              )}
            </div>
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
              {nextTask ? `Continuar: ${taskLabels[nextTask.type]}` : "Continuar Missão"}
            </>
          ) : (
            <>
              <Play size={18} className="sm:w-5 sm:h-5" />
              {nextTask ? `Iniciar: ${taskLabels[nextTask.type]}` : "Iniciar Missão"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
