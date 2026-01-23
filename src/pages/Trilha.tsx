import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  Clock, 
  Edit3,
  Plus,
  RotateCcw
} from "lucide-react";
import { 
  MOCK_TRAIL_PLAN, 
  MOCK_STUDY_DATA, 
  calculateTrailMetrics,
  formatHoursMinutes,
  type TrailPlan,
  type TrailModule
} from "@/data/trail-planning-data";
import { CompletionPlanCard } from "@/components/dashboard/CompletionPlanCard";
import { CurrentPaceCard } from "@/components/dashboard/CurrentPaceCard";
import { EditDatesModal } from "@/components/trail/EditDatesModal";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const STORAGE_KEY = "studai_trail_plan";

function loadTrailPlan(): TrailPlan {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as TrailPlan;
    }
  } catch (e) {
    console.error("Failed to load trail plan:", e);
  }
  return MOCK_TRAIL_PLAN;
}

function saveTrailPlan(plan: TrailPlan): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch (e) {
    console.error("Failed to save trail plan:", e);
  }
}

export default function Trilha() {
  const navigate = useNavigate();
  const [trailPlan, setTrailPlan] = useState<TrailPlan>(loadTrailPlan);
  
  const [editDatesOpen, setEditDatesOpen] = useState(false);
  const [editModuleOpen, setEditModuleOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<TrailModule | null>(null);
  const [editHoursValue, setEditHoursValue] = useState(0);
  
  useEffect(() => {
    saveTrailPlan(trailPlan);
  }, [trailPlan]);
  
  const calculations = useMemo(() => 
    calculateTrailMetrics(trailPlan, MOCK_STUDY_DATA), 
    [trailPlan]
  );

  const handleModuleClick = useCallback((moduleId: string) => {
    const module = trailPlan.modules.find(m => m.id === moduleId);
    if (module) {
      setSelectedModule(module);
      setEditHoursValue(module.completedHours);
      setEditModuleOpen(true);
    }
  }, [trailPlan.modules]);

  const handleEditTarget = useCallback(() => {
    setEditDatesOpen(true);
  }, []);
  
  const handleSaveDates = useCallback((startDate: string, targetDate: string) => {
    setTrailPlan(prev => ({
      ...prev,
      startDate,
      targetDate
    }));
    toast.success("Datas atualizadas");
  }, []);
  
  const handleUpdateModuleProgress = useCallback(() => {
    if (!selectedModule) return;
    
    const newCompletedHours = Math.min(editHoursValue, selectedModule.estimatedHours);
    const newStatus: TrailModule["status"] = 
      newCompletedHours >= selectedModule.estimatedHours 
        ? "completed" 
        : newCompletedHours > 0 
          ? "in_progress" 
          : "not_started";
    
    setTrailPlan(prev => {
      const updatedModules = prev.modules.map(m => 
        m.id === selectedModule.id 
          ? { ...m, completedHours: newCompletedHours, status: newStatus }
          : m
      );
      
      const newCompletedTotal = updatedModules.reduce((sum, m) => sum + m.completedHours, 0);
      
      return {
        ...prev,
        modules: updatedModules,
        completedHours: newCompletedTotal
      };
    });
    
    setEditModuleOpen(false);
    toast.success("Progresso atualizado");
  }, [selectedModule, editHoursValue]);
  
  const handleQuickAddHours = useCallback((moduleId: string, hoursToAdd: number) => {
    setTrailPlan(prev => {
      const updatedModules = prev.modules.map(m => {
        if (m.id !== moduleId) return m;
        
        const newHours = Math.min(m.completedHours + hoursToAdd, m.estimatedHours);
        const newStatus: TrailModule["status"] = 
          newHours >= m.estimatedHours 
            ? "completed" 
            : newHours > 0 
              ? "in_progress" 
              : "not_started";
        
        return { ...m, completedHours: newHours, status: newStatus };
      });
      
      const newCompletedTotal = updatedModules.reduce((sum, m) => sum + m.completedHours, 0);
      
      return {
        ...prev,
        modules: updatedModules,
        completedHours: newCompletedTotal
      };
    });
    
    toast.success(`+${hoursToAdd}h`);
  }, []);
  
  const handleResetProgress = useCallback(() => {
    if (confirm("Resetar progresso?")) {
      setTrailPlan(prev => ({
        ...prev,
        completedHours: 0,
        modules: prev.modules.map(m => ({
          ...m,
          completedHours: 0,
          status: "not_started" as const
        }))
      }));
      toast.success("Progresso resetado");
    }
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-medium text-foreground">Trilha</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{trailPlan.name}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleResetProgress}
          className="text-muted-foreground h-8 text-xs"
        >
          <RotateCcw size={12} className="mr-1" />
          Resetar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 border rounded-lg p-4 bg-card">
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">{calculations.progressPercent}%</p>
          <p className="text-[10px] text-muted-foreground">Concluído</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">{formatHoursMinutes(calculations.remainingHours)}</p>
          <p className="text-[10px] text-muted-foreground">Restantes</p>
        </div>
        <div className="text-center cursor-pointer" onClick={handleEditTarget}>
          <p className="text-base font-semibold text-foreground">{calculations.daysUntilTarget}</p>
          <p className="text-[10px] text-muted-foreground">Dias</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">{MOCK_STUDY_DATA.streak}</p>
          <p className="text-[10px] text-muted-foreground">Streak</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CompletionPlanCard 
            trail={trailPlan}
            calculations={calculations}
            onEditTarget={handleEditTarget}
          />
          <CurrentPaceCard 
            calculations={calculations}
            studyData={MOCK_STUDY_DATA}
          />
        </div>

        {/* Modules */}
        <section className="border rounded-lg bg-card overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-medium text-foreground">Módulos</h2>
            <span className="text-xs text-muted-foreground">
              {trailPlan.modules.filter(m => m.status === "completed").length}/{trailPlan.modules.length}
            </span>
          </div>
          <div className="divide-y">
            {trailPlan.modules.map((module) => {
              const progress = module.estimatedHours > 0 
                ? (module.completedHours / module.estimatedHours) * 100 
                : 0;
              
              return (
                <div key={module.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      module.status === "completed" 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : module.status === "in_progress"
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground"
                    }`}>
                      {module.status === "completed" ? (
                        <CheckCircle2 size={12} />
                      ) : module.status === "in_progress" ? (
                        <PlayCircle size={10} />
                      ) : (
                        <Lock size={8} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{module.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock size={10} />
                        <span>{module.completedHours}h/{module.estimatedHours}h</span>
                        <span className="ml-auto">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-1 mt-2" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 pl-8">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs flex-1"
                      onClick={() => handleQuickAddHours(module.id, 0.5)}
                      disabled={module.status === "completed"}
                    >
                      <Plus size={10} className="mr-1" />
                      30min
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs flex-1"
                      onClick={() => handleQuickAddHours(module.id, 1)}
                      disabled={module.status === "completed"}
                    >
                      <Plus size={10} className="mr-1" />
                      1h
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleModuleClick(module.id)}
                    >
                      <Edit3 size={10} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      
      <EditDatesModal
        isOpen={editDatesOpen}
        onClose={() => setEditDatesOpen(false)}
        startDate={trailPlan.startDate}
        targetEndDate={trailPlan.targetDate}
        onSave={handleSaveDates}
      />
      
      <Dialog open={editModuleOpen} onOpenChange={setEditModuleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar progresso</DialogTitle>
          </DialogHeader>
          
          {selectedModule && (
            <div className="space-y-4 py-4">
              <div>
                <p className="font-medium text-foreground">{selectedModule.title}</p>
                <p className="text-xs text-muted-foreground">
                  Total: {selectedModule.estimatedHours}h
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Horas</Label>
                  <span className="text-sm font-medium">
                    {editHoursValue.toFixed(1)}h
                  </span>
                </div>
                
                <Slider
                  value={[editHoursValue]}
                  onValueChange={([v]) => setEditHoursValue(v)}
                  max={selectedModule.estimatedHours}
                  step={0.5}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditHoursValue(0)}
                  className="flex-1 h-8 text-xs"
                >
                  Resetar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditHoursValue(selectedModule.estimatedHours)}
                  className="flex-1 h-8 text-xs"
                >
                  Completar
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModuleOpen(false)} className="h-8 text-xs">
              Cancelar
            </Button>
            <Button onClick={handleUpdateModuleProgress} className="h-8 text-xs">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
