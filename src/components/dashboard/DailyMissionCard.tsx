import { useState } from "react";
import { 
  BookOpen, 
  Brain, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  Clock,
  Play,
  Sparkles,
  ChevronRight
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
    <div className="bg-card border-2 border-accent/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-primary via-primary to-accent p-4 sm:p-6 text-primary-foreground relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-start sm:items-center justify-between gap-2 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Sparkles size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-bold truncate">{mission.title}</h2>
                <p className="text-xs sm:text-sm opacity-80 truncate">{mission.competency}</p>
              </div>
            </div>
            <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold shrink-0 ${status.bg} ${status.text}`}>
              {status.label}
            </div>
          </div>

          <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4 leading-relaxed line-clamp-2">
            {mission.objective}
          </p>

          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
              <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
              <span>{mission.estimatedMinutes} min</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
              <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" />
              <span>{completedTasks}/{totalTasks} tarefas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Checklist */}
      <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
        {mission.tasks.map((task) => {
          const Icon = taskIcons[task.type];
          return (
            <button
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-200 group ${
                task.completed 
                  ? "bg-status-success/50 border-status-success-text/20" 
                  : "bg-secondary/50 border-transparent hover:bg-secondary hover:border-accent/20 active:scale-[0.98]"
              }`}
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                task.completed 
                  ? "bg-status-success-text/20 text-status-success-text" 
                  : "bg-accent/10 text-accent group-hover:bg-accent/20"
              }`}>
                {task.completed ? <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`font-medium text-xs sm:text-sm truncate ${task.completed ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                  {task.label}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  ~{task.estimatedMinutes} min • {taskLabels[task.type]}
                </p>
              </div>
              {task.completed && (
                <CheckCircle2 size={18} className="sm:w-5 sm:h-5 text-status-success-text shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="px-3 sm:px-5 pb-2">
        <div className="h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-1.5 sm:mt-2">
          {progress}% concluído
        </p>
      </div>

      {/* CTA Button */}
      <div className="p-3 sm:p-5 pt-2 sm:pt-3">
        <button
          onClick={onStartMission}
          disabled={mission.status === "completed"}
          className="w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-accent text-accent-foreground rounded-xl font-semibold text-sm sm:text-base hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
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
