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
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Minha Trilha
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <Plus size={14} />
                Trocar trilha
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                        isActive 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${trail.color} flex items-center justify-center text-2xl shrink-0`}>
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
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${activeTrail.color} flex items-center justify-center text-2xl sm:text-3xl shrink-0`}>
            {activeTrail.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base truncate">{activeTrail.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{activeTrail.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-primary shrink-0">{progressPercent}%</span>
            </div>
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t">
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{activeTrail.modules.length}</p>
            <p className="text-[10px] text-muted-foreground">Módulos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{Math.round(activeTrail.completedHours)}h</p>
            <p className="text-[10px] text-muted-foreground">Estudadas</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{Math.round(activeTrail.totalEstimatedHours - activeTrail.completedHours)}h</p>
            <p className="text-[10px] text-muted-foreground">Restantes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
