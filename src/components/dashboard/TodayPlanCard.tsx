import { 
  BookOpen, 
  Brain, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  Clock,
  Play,
  ChevronRight,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DailyMission, MissionTask } from "@/types/studai";

interface TodayPlanCardProps {
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

export function TodayPlanCard({ mission, onStartMission, onToggleTask, onTaskClick }: TodayPlanCardProps) {
  const completedTasks = mission.tasks.filter(t => t.completed).length;
  const totalTasks = mission.tasks.length;
  const progress = Math.round((completedTasks / totalTasks) * 100);
  const nextTask = mission.tasks.find(t => !t.completed);

  const handleTaskAction = (task: MissionTask, e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.completed) {
      onToggleTask(task.id);
    } else if (onTaskClick) {
      onTaskClick(task);
    }
  };

  return (
    <section className="bg-card border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b bg-muted/30">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Plano de hoje</h3>
              <p className="text-xs text-muted-foreground">{mission.competency}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{mission.estimatedMinutes} min</span>
            </div>
            <p className="text-xs text-muted-foreground">{completedTasks}/{totalTasks} tarefas</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-foreground min-w-[32px]">{progress}%</span>
        </div>
      </div>

      {/* Tasks - Compact list */}
      <div className="divide-y">
        {mission.tasks.map((task) => {
          const Icon = taskIcons[task.type];
          return (
            <button
              key={task.id}
              onClick={(e) => handleTaskAction(task, e)}
              className={`w-full flex items-center gap-3 p-3 sm:p-4 transition-all ${
                task.completed 
                  ? "bg-status-success/10" 
                  : "hover:bg-muted/50"
              }`}
            >
              {/* Status Indicator */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                task.completed 
                  ? "bg-status-success-text text-white" 
                  : "border-2 border-muted-foreground/30"
              }`}>
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              {/* Task Info */}
              <div className="flex-1 text-left min-w-0">
                <p className={`text-sm font-medium ${
                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                }`}>
                  {task.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {task.estimatedMinutes}min • {taskLabels[task.type]}
                </p>
              </div>

              {/* Action */}
              {!task.completed && (
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* CTA */}
      {mission.status !== "completed" && nextTask && (
        <div className="p-4 border-t bg-muted/20">
          <Button
            onClick={onStartMission}
            className="w-full h-12 font-semibold"
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            {mission.status === "in_progress" 
              ? `Continuar: ${taskLabels[nextTask.type]}`
              : `Iniciar plano`
            }
          </Button>
        </div>
      )}

      {mission.status === "completed" && (
        <div className="p-4 border-t bg-status-success/10 text-center">
          <p className="text-sm font-medium text-status-success-text flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Plano do dia concluído! 🎉
          </p>
        </div>
      )}
    </section>
  );
}
