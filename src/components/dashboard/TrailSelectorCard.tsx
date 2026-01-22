import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  Plus, 
  Sparkles, 
  Clock, 
  BookOpen,
  GraduationCap,
  Briefcase,
  Target,
  Trophy,
  Play
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AvailableTrail, TrailPlan } from "@/data/trail-planning-data";

interface TrailSelectorCardProps {
  activeTrail: TrailPlan;
  availableTrails: AvailableTrail[];
  onSelectTrail: (trailId: string) => void;
}

const categoryIcons = {
  certification: GraduationCap,
  concurso: Trophy,
  career: Briefcase,
  skill: Target,
};

const categoryLabels = {
  certification: "Certificação",
  concurso: "Concurso",
  career: "Carreira",
  skill: "Habilidade",
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-700",
};

const difficultyLabels = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

export function TrailSelectorCard({ 
  activeTrail, 
  availableTrails,
  onSelectTrail 
}: TrailSelectorCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const progressPercent = activeTrail.totalEstimatedHours > 0
    ? Math.round((activeTrail.completedHours / activeTrail.totalEstimatedHours) * 100)
    : 0;

  const handleSelectTrail = (trailId: string) => {
    onSelectTrail(trailId);
    setDialogOpen(false);
  };

  // Find current module in progress
  const currentModule = activeTrail.modules.find(m => m.status === "in_progress");
  const nextModule = activeTrail.modules.find(m => m.status === "not_started");
  const displayModule = currentModule || nextModule;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-card-foreground">Minha Trilha</span>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7 px-2 text-muted-foreground hover:text-primary">
                <Plus size={12} />
                Trocar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Escolha sua Trilha de Estudos
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-3 mt-4">
                {availableTrails.map((trail) => {
                  const CategoryIcon = categoryIcons[trail.category];
                  const isActive = trail.id === activeTrail.id;
                  
                  return (
                    <button
                      key={trail.id}
                      onClick={() => handleSelectTrail(trail.id)}
                      className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all hover:shadow-md touch-manipulation active:scale-[0.99] ${
                        isActive 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${trail.color} flex items-center justify-center text-xl sm:text-2xl shrink-0`}>
                          {trail.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm">{trail.name}</h3>
                            {trail.isPopular && (
                              <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700">
                                Popular
                              </Badge>
                            )}
                            {trail.isNew && (
                              <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700">
                                Novo
                              </Badge>
                            )}
                            {isActive && (
                              <Badge className="text-[10px]">
                                Ativa
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {trail.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <CategoryIcon size={12} />
                              {categoryLabels[trail.category]}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen size={12} />
                              {trail.totalModules} módulos
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {trail.totalHours}h
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${difficultyColors[trail.difficulty]}`}>
                              {difficultyLabels[trail.difficulty]}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-muted-foreground shrink-0 mt-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Trail info - compact */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeTrail.color} flex items-center justify-center text-2xl shrink-0`}>
            {activeTrail.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate">{activeTrail.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{activeTrail.description}</p>
          </div>
          <span className="text-xl font-bold text-primary shrink-0">{progressPercent}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-3">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        {/* Quick stats - inline */}
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen size={11} />
            <strong className="text-card-foreground">{activeTrail.modules.length}</strong> Módulos
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            <strong className="text-card-foreground">{Math.round(activeTrail.completedHours)}h</strong> Estudadas
          </span>
          <span className="flex items-center gap-1">
            <Target size={11} />
            <strong className="text-card-foreground">{Math.round(activeTrail.totalEstimatedHours - activeTrail.completedHours)}h</strong> Restantes
          </span>
        </div>

        {/* Next step section - compact (no stretching) */}
        {displayModule ? (
          <div className="mt-3 p-3 rounded-lg bg-muted/40">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                  {currentModule ? "Continuar estudando" : "Próximo módulo"}
                </p>
                <p className="text-sm font-medium truncate">{displayModule.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentModule
                    ? `${Math.round((displayModule.completedHours / displayModule.estimatedHours) * 100)}% concluído`
                    : `${displayModule.estimatedHours}h estimadas`}
                </p>
              </div>
              <Button
                size="sm"
                className="shrink-0 h-8 text-xs"
                onClick={() => navigate("/estudar")}
              >
                Estudar
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-3 p-3 rounded-lg bg-muted/40 text-center">
            <p className="text-sm text-muted-foreground">🎉 Trilha concluída!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
