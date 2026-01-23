import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
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

  const currentModule = activeTrail.modules.find(m => m.status === "in_progress");
  const nextModule = activeTrail.modules.find(m => m.status === "not_started");
  const displayModule = currentModule || nextModule;

  return (
    <section className="border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Trilha ativa</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{activeTrail.name}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Trocar
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-base font-medium">Trilhas disponíveis</DialogTitle>
              </DialogHeader>
              
              <p className="text-xs text-muted-foreground -mt-2">
                Programas estruturados por objetivo.
              </p>
              
              <div className="space-y-2 mt-4">
                {availableTrails.map((trail) => {
                  const CategoryIcon = categoryIcons[trail.category];
                  const isActive = trail.id === activeTrail.id;
                  
                  return (
                    <button
                      key={trail.id}
                      onClick={() => handleSelectTrail(trail.id)}
                      className={`w-full text-left p-3 rounded-md border transition-colors ${
                        isActive 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-sm shrink-0">
                          {trail.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm text-foreground">{trail.name}</h4>
                            {isActive && (
                              <span className="text-[10px] text-primary">Ativa</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{trail.totalModules} módulos</span>
                            <span>·</span>
                            <span>{trail.totalHours}h</span>
                            <span>·</span>
                            <span>{difficultyLabels[trail.difficulty]}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Progress */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{progressPercent}%</span>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {activeTrail.modules.length} módulos
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.round(activeTrail.completedHours)}h/{Math.round(activeTrail.totalEstimatedHours)}h
          </span>
        </div>
      </div>

      {/* Next step */}
      {displayModule ? (
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                {currentModule ? "Continuar" : "Próximo"}
              </p>
              <p className="text-sm text-foreground truncate">{displayModule.title}</p>
            </div>
            <Button
              size="sm"
              variant="default"
              className="shrink-0 h-7 text-xs"
              onClick={() => navigate("/estudar")}
            >
              Iniciar sessão
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Trilha concluída</p>
        </div>
      )}
    </section>
  );
}
