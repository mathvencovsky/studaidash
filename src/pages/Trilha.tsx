import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock, PlayCircle, Clock, BookOpen } from "lucide-react";
import { CFA_MODULES, calculateTrailProgress } from "@/data/cfa-mock-data";

export default function Trilha() {
  const overallProgress = calculateTrailProgress(CFA_MODULES);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "active":
        return <PlayCircle className="w-5 h-5 text-primary" />;
      case "locked":
        return <Lock className="w-5 h-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Concluído</Badge>;
      case "active":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Em Progresso</Badge>;
      case "locked":
        return <Badge variant="secondary">Bloqueado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Trilha de Estudos</h1>
        <p className="text-muted-foreground mt-1">CFA Level I – Quantitative Methods</p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Progresso Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avanço na trilha</span>
              <span className="font-semibold">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {CFA_MODULES.filter(m => m.status === "completed").length} de {CFA_MODULES.length} módulos concluídos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modules List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Módulos</h2>
        {CFA_MODULES.map((module, index) => (
          <Card 
            key={module.id} 
            className={`transition-all ${module.status === "locked" ? "opacity-60" : "hover:shadow-md"}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted shrink-0">
                  {getStatusIcon(module.status)}
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium truncate">
                        {index + 1}. {module.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{module.estimatedHours}h estimadas</span>
                        <span>•</span>
                        <span>{module.totalLessons} lições</span>
                      </div>
                    </div>
                    {getStatusBadge(module.status)}
                  </div>
                  
                  {module.status !== "locked" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{module.completedLessons}/{module.totalLessons} lições</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-1.5" />
                    </div>
                  )}

                  {module.status === "active" && (
                    <Button size="sm" className="mt-2">
                      Continuar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
