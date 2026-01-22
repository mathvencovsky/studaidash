import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  CheckCircle2, 
  PlayCircle, 
  Lock,
  Clock,
  ChevronRight
} from "lucide-react";
import type { TrailModule, TrailPlan } from "@/data/trail-planning-data";
import { formatHoursMinutes } from "@/data/trail-planning-data";

interface ModulesProgressCardProps {
  trail: TrailPlan;
  onModuleClick?: (moduleId: string) => void;
  loading?: boolean;
  showAll?: boolean;
}

export function ModulesProgressCard({ 
  trail, 
  onModuleClick,
  loading = false,
  showAll = false
}: ModulesProgressCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Módulos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusConfig = (status: TrailModule["status"]) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle2,
          label: "Concluído",
          color: "text-green-600",
          bg: "bg-green-50",
          badgeBg: "bg-green-100 text-green-700"
        };
      case "in_progress":
        return {
          icon: PlayCircle,
          label: "Em progresso",
          color: "text-primary",
          bg: "bg-primary/5",
          badgeBg: "bg-primary/10 text-primary"
        };
      case "not_started":
        return {
          icon: Lock,
          label: "Não iniciado",
          color: "text-muted-foreground",
          bg: "bg-muted/50",
          badgeBg: "bg-muted text-muted-foreground"
        };
    }
  };

  const getModuleProgress = (module: TrailModule) => {
    if (module.estimatedHours === 0) return 0;
    return Math.round((module.completedHours / module.estimatedHours) * 100);
  };

  const completedModules = trail.modules.filter(m => m.status === "completed").length;
  const displayModules = showAll ? trail.modules : trail.modules.slice(0, 4);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Módulos da Trilha
          </CardTitle>
          <Badge variant="secondary">
            {completedModules}/{trail.modules.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayModules.map((module, index) => {
          const config = getStatusConfig(module.status);
          const StatusIcon = config.icon;
          const progress = getModuleProgress(module);

          return (
            <button
              key={module.id}
              onClick={() => onModuleClick?.(module.id)}
              className={`w-full p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                module.status === "in_progress" 
                  ? "border-primary/30 bg-primary/5" 
                  : "border-border hover:border-primary/20"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${config.bg} shrink-0`}>
                  <StatusIcon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {index + 1}. {module.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatHoursMinutes(module.estimatedHours)}</span>
                        {module.status !== "not_started" && (
                          <>
                            <span>•</span>
                            <span>{formatHoursMinutes(module.completedHours)} feitas</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={config.badgeBg} variant="secondary">
                        {module.status === "not_started" ? config.label : `${progress}%`}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  {module.status !== "not_started" && (
                    <Progress value={progress} className="h-1.5" />
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {!showAll && trail.modules.length > 4 && (
          <p className="text-sm text-center text-muted-foreground pt-2">
            +{trail.modules.length - 4} módulos
          </p>
        )}
      </CardContent>
    </Card>
  );
}
