import { 
  BookOpen, 
  Brain, 
  FileText, 
  HelpCircle, 
  Check,
  ChevronRight
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

  const getStatusLabel = () => {
    if (mission.status === "completed") return "Concluído";
    if (mission.status === "in_progress") return "Em andamento";
    return "Não iniciado";
  };

  return (
    <section className="border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Plano de hoje</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tarefas para manter o ritmo.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">{getStatusLabel()}</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{completedTasks}/{totalTasks}</span>
        </div>
      </div>

      {/* Tasks */}
      <div className="divide-y">
        {mission.tasks.map((task) => {
          return (
            <button
              key={task.id}
              onClick={(e) => handleTaskAction(task, e)}
              className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                task.completed 
                  ? "bg-muted/20" 
                  : "hover:bg-muted/50"
              }`}
            >
              {/* Checkbox */}
              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                task.completed 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "border-border"
              }`}>
                {task.completed && <Check className="w-2.5 h-2.5" />}
              </div>

              {/* Task Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${
                  task.completed ? "text-muted-foreground line-through" : "text-foreground"
                }`}>
                  {task.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {task.estimatedMinutes} min · {taskLabels[task.type]}
                </p>
              </div>

              {/* Arrow for pending tasks */}
              {!task.completed && (
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* CTA */}
      {mission.status !== "completed" && nextTask && (
        <div className="p-3 border-t">
          <Button
            onClick={onStartMission}
            className="w-full"
            variant="default"
          >
            {mission.status === "in_progress" ? "Continuar" : "Iniciar plano"}
          </Button>
        </div>
      )}

      {mission.status === "completed" && (
        <div className="p-3 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Concluído
          </p>
        </div>
      )}
    </section>
  );
}
