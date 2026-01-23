import { ChevronRight, Lock, CheckCircle2, Circle, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { CFAModule } from "@/types/studai";

interface ProgressSectionProps {
  modules: CFAModule[];
  overallProgress: number;
  onModuleClick: (moduleId: string) => void;
}

const statusIcons = {
  locked: Lock,
  active: Circle,
  completed: CheckCircle2,
};

const statusColors = {
  locked: "text-muted-foreground/50",
  active: "text-primary",
  completed: "text-status-success-text",
};

export function ProgressSection({ modules, overallProgress, onModuleClick }: ProgressSectionProps) {
  // Show only first 5 modules in summary
  const displayModules = modules.slice(0, 5);
  const remainingCount = modules.length - 5;

  return (
    <section className="bg-card border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Progresso por Módulos</h3>
              <p className="text-xs text-muted-foreground">{modules.length} módulos • {overallProgress}% completo</p>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-4">
          <Progress value={overallProgress} className="h-2" />
        </div>
      </div>

      {/* Module List */}
      <div className="divide-y">
        {displayModules.map((module) => {
          const StatusIcon = statusIcons[module.status];
          const isLocked = module.status === "locked";
          
          return (
            <button
              key={module.id}
              onClick={() => !isLocked && onModuleClick(module.id)}
              disabled={isLocked}
              className={`w-full flex items-center gap-3 p-3 sm:p-4 transition-all text-left ${
                isLocked 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-muted/50"
              }`}
            >
              <StatusIcon className={`w-5 h-5 shrink-0 ${statusColors[module.status]}`} />
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{module.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 max-w-[120px] h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{module.progress}%</span>
                </div>
              </div>

              {!isLocked && (
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Show More */}
      {remainingCount > 0 && (
        <div className="p-3 border-t text-center">
          <span className="text-xs text-muted-foreground">
            +{remainingCount} módulos
          </span>
        </div>
      )}
    </section>
  );
}
