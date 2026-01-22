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
      <div className="bg-gradient-to-br from-primary via-primary to-accent p-6 text-primary-foreground relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{mission.title}</h2>
                <p className="text-sm opacity-80">{mission.competency}</p>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
              {status.label}
            </div>
          </div>

          <p className="text-sm opacity-90 mb-4 leading-relaxed">
            {mission.objective}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
              <Clock size={14} />
              <span>{mission.estimatedMinutes} min</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
              <CheckCircle2 size={14} />
              <span>{completedTasks}/{totalTasks} tarefas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Checklist */}
      <div className="p-5 space-y-3">
        {mission.tasks.map((task) => {
          const Icon = taskIcons[task.type];
          return (
            <button
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group ${
                task.completed 
                  ? "bg-status-success/50 border-status-success-text/20" 
                  : "bg-secondary/50 border-transparent hover:bg-secondary hover:border-accent/20"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                task.completed 
                  ? "bg-status-success-text/20 text-status-success-text" 
                  : "bg-accent/10 text-accent group-hover:bg-accent/20"
              }`}>
                {task.completed ? <CheckCircle2 size={18} /> : <Icon size={18} />}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium text-sm ${task.completed ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                  {task.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  ~{task.estimatedMinutes} min • {taskLabels[task.type]}
                </p>
              </div>
              {task.completed && (
                <CheckCircle2 size={20} className="text-status-success-text shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-2">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {progress}% concluído
        </p>
      </div>

      {/* CTA Button */}
      <div className="p-5 pt-3">
        <button
          onClick={onStartMission}
          disabled={mission.status === "completed"}
          className="w-full py-4 px-6 bg-accent text-accent-foreground rounded-xl font-semibold text-base hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mission.status === "completed" ? (
            <>
              <CheckCircle2 size={20} />
              Missão Concluída!
            </>
          ) : mission.status === "in_progress" ? (
            <>
              <Play size={20} />
              Continuar Missão
            </>
          ) : (
            <>
              <Play size={20} />
              Iniciar Missão
            </>
          )}
        </button>
      </div>
    </div>
  );
}
