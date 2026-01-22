import { CheckCircle2, Lock, Play, ChevronRight } from "lucide-react";
import type { CFAModule } from "@/types/studai";

interface TrailProgressCardProps {
  modules: CFAModule[];
  overallProgress: number;
  onModuleClick: (moduleId: string) => void;
}

export function TrailProgressCard({ modules, overallProgress, onModuleClick }: TrailProgressCardProps) {
  const statusIcons = {
    locked: Lock,
    active: Play,
    completed: CheckCircle2,
  };

  const statusColors = {
    locked: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-transparent",
    },
    active: {
      bg: "bg-accent/10",
      text: "text-accent",
      border: "border-accent/30",
    },
    completed: {
      bg: "bg-status-success",
      text: "text-status-success-text",
      border: "border-status-success-text/20",
    },
  };

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            CFA Level I – Quantitative Methods
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {modules.filter(m => m.status === "completed").length} de {modules.length} módulos concluídos
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">{overallProgress}%</p>
          <p className="text-xs text-muted-foreground">progresso geral</p>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-2">
        {modules.map((module) => {
          const Icon = statusIcons[module.status];
          const colors = statusColors[module.status];
          const isClickable = module.status !== "locked";

          return (
            <button
              key={module.id}
              onClick={() => isClickable && onModuleClick(module.id)}
              disabled={!isClickable}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
                isClickable 
                  ? `hover:bg-secondary/50 ${colors.border}` 
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              {/* Status Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors.bg} ${colors.text}`}>
                <Icon size={18} />
              </div>

              {/* Module Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-medium text-sm truncate ${
                    module.status === "locked" ? "text-muted-foreground" : "text-card-foreground"
                  }`}>
                    {module.name}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {module.completedLessons}/{module.totalLessons} aulas
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    ~{module.estimatedHours}h
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3 shrink-0">
                {module.status !== "locked" && (
                  <div className="w-16">
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          module.status === "completed" ? "bg-status-success-text" : "bg-accent"
                        }`}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                    <p className={`text-[10px] text-right mt-0.5 ${
                      module.status === "completed" ? "text-status-success-text" : "text-muted-foreground"
                    }`}>
                      {module.progress}%
                    </p>
                  </div>
                )}
                {isClickable && (
                  <ChevronRight size={18} className="text-muted-foreground" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
