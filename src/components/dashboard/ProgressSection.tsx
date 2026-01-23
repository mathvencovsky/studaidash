import { ChevronRight, Check } from "lucide-react";
import type { CFAModule } from "@/types/studai";

interface ProgressSectionProps {
  modules: CFAModule[];
  overallProgress: number;
  onModuleClick: (moduleId: string) => void;
}

export function ProgressSection({ modules, overallProgress, onModuleClick }: ProgressSectionProps) {
  const displayModules = modules.slice(0, 5);
  const remainingCount = modules.length - 5;

  return (
    <section className="border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground">Módulos</h3>
          <span className="text-xs text-muted-foreground">{overallProgress}% concluído</span>
        </div>

        {/* Overall Progress */}
        <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Module List */}
      <div className="divide-y">
        {displayModules.map((module) => {
          const isLocked = module.status === "locked";
          const isCompleted = module.status === "completed";
          
          return (
            <button
              key={module.id}
              onClick={() => !isLocked && onModuleClick(module.id)}
              disabled={isLocked}
              className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                isLocked 
                  ? "opacity-40 cursor-not-allowed" 
                  : "hover:bg-muted/50"
              }`}
            >
              {/* Status */}
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                isCompleted 
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border"
              }`}>
                {isCompleted && <Check className="w-2.5 h-2.5" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{module.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 max-w-[80px] h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary/50 rounded-full"
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
