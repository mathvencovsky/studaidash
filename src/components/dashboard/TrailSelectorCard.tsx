import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Trophy
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

  const progressPercent = activeTrail.totalEstimatedHours > 0
    ? Math.round((activeTrail.completedHours / activeTrail.totalEstimatedHours) * 100)
    : 0;

  const handleSelectTrail = (trailId: string) => {
    onSelectTrail(trailId);
    setDialogOpen(false);
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-4 sm:p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="font-semibold text-sm sm:text-base text-card-foreground">Minha Trilha</span>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7 px-2 text-muted-foreground hover:text-primary">
                <Plus size={12} />
                Trocar trilha
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
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
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

        {/* Trail info - compact horizontal layout */}
        <div className="flex items-center gap-3 p-3 bg-card rounded-xl border">
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${activeTrail.color} flex items-center justify-center text-xl sm:text-2xl shrink-0`}>
            {activeTrail.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xs sm:text-sm truncate">{activeTrail.name}</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{activeTrail.description}</p>
          </div>
          <span className="text-lg sm:text-xl font-bold text-primary shrink-0">{progressPercent}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-3">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        {/* Quick stats - inline */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen size={12} />
            <span><strong className="text-card-foreground">{activeTrail.modules.length}</strong> Módulos</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock size={12} />
            <span><strong className="text-card-foreground">{Math.round(activeTrail.completedHours)}h</strong> Estudadas</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Target size={12} />
            <span><strong className="text-card-foreground">{Math.round(activeTrail.totalEstimatedHours - activeTrail.completedHours)}h</strong> Restantes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
