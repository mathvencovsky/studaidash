import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  Clock, 
  BookOpen, 
  Target, 
  TrendingUp,
  Calendar,
  Edit3,
  Plus,
  Minus,
  RotateCcw
} from "lucide-react";
import { 
  MOCK_TRAIL_PLAN, 
  MOCK_STUDY_DATA, 
  calculateTrailMetrics,
  formatHoursMinutes,
  formatDateBR,
  type TrailPlan,
  type UserStudyData,
  type TrailModule
} from "@/data/trail-planning-data";
import { CompletionPlanCard } from "@/components/dashboard/CompletionPlanCard";
import { CurrentPaceCard } from "@/components/dashboard/CurrentPaceCard";
import { ModulesProgressCard } from "@/components/dashboard/ModulesProgressCard";
import { EditDatesModal } from "@/components/trail/EditDatesModal";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

// Storage key
const STORAGE_KEY = "studai_trail_plan";

// Helper to load from localStorage
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

// Helper to save to localStorage
function saveTrailPlan(plan: TrailPlan): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch (e) {
    console.error("Failed to save trail plan:", e);
  }
}

export default function Trilha() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [trailPlan, setTrailPlan] = useState<TrailPlan>(loadTrailPlan);
  
  // Modal states
  const [editDatesOpen, setEditDatesOpen] = useState(false);
  const [editModuleOpen, setEditModuleOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<TrailModule | null>(null);
  const [editHoursValue, setEditHoursValue] = useState(0);
  
  // Persist changes
  useEffect(() => {
    saveTrailPlan(trailPlan);
  }, [trailPlan]);
  
  // Calculate metrics using the trail planning data
  const calculations = useMemo(() => 
    calculateTrailMetrics(trailPlan, MOCK_STUDY_DATA), 
    [trailPlan]
  );

  // Handle module click - open edit modal
  const handleModuleClick = useCallback((moduleId: string) => {
    const module = trailPlan.modules.find(m => m.id === moduleId);
    if (module) {
      setSelectedModule(module);
      setEditHoursValue(module.completedHours);
      setEditModuleOpen(true);
    }
  }, [trailPlan.modules]);

  // Handle edit target date
  const handleEditTarget = useCallback(() => {
    setEditDatesOpen(true);
  }, []);
  
  // Save dates
  const handleSaveDates = useCallback((startDate: string, targetDate: string) => {
    setTrailPlan(prev => ({
      ...prev,
      startDate,
      targetDate
    }));
    toast.success("Datas atualizadas com sucesso!");
  }, []);
  
  // Update module progress
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
    toast.success(`Progresso de "${selectedModule.title}" atualizado!`);
  }, [selectedModule, editHoursValue]);
  
  // Quick add hours to a module
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
    
    toast.success(`+${hoursToAdd}h registradas!`);
  }, []);
  
  // Reset trail progress
  const handleResetProgress = useCallback(() => {
    if (confirm("Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita.")) {
      setTrailPlan(prev => ({
        ...prev,
        completedHours: 0,
        modules: prev.modules.map(m => ({
          ...m,
          completedHours: 0,
          status: "not_started" as const
        }))
      }));
      toast.success("Progresso resetado!");
    }
  }, []);

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Trilha de Estudos</h1>
          <p className="text-muted-foreground mt-1">{trailPlan.name}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResetProgress}
          className="text-muted-foreground hover:text-destructive"
        >
          <RotateCcw size={14} className="mr-1" />
          Resetar
        </Button>
      </div>

      {/* Quick Stats Row - Horizontal scroll on mobile */}
      <div className="flex gap-2 sm:grid sm:grid-cols-4 sm:gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <Card className="min-w-[100px] flex-shrink-0 sm:min-w-0 sm:flex-shrink">
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-primary">{calculations.progressPercent}%</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">Concluído</p>
          </CardContent>
        </Card>
        <Card className="min-w-[100px] flex-shrink-0 sm:min-w-0 sm:flex-shrink">
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold whitespace-nowrap">{formatHoursMinutes(calculations.remainingHours)}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">Restantes</p>
          </CardContent>
        </Card>
        <Card 
          className="min-w-[100px] flex-shrink-0 sm:min-w-0 sm:flex-shrink cursor-pointer hover:border-primary/50 transition-colors"
          onClick={handleEditTarget}
        >
          <CardContent className="p-3 sm:p-4 text-center relative">
            <Edit3 size={12} className="absolute top-2 right-2 text-muted-foreground" />
            <p className="text-xl sm:text-2xl font-bold">{calculations.daysUntilTarget}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">Dias p/ meta</p>
          </CardContent>
        </Card>
        <Card className="min-w-[100px] flex-shrink-0 sm:min-w-0 sm:flex-shrink">
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold">{MOCK_STUDY_DATA.streak}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">Dias de streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Completion Plan Card */}
          <CompletionPlanCard 
            trail={trailPlan}
            calculations={calculations}
            onEditTarget={handleEditTarget}
            loading={loading}
          />

          {/* Current Pace Card */}
          <CurrentPaceCard 
            calculations={calculations}
            studyData={MOCK_STUDY_DATA}
            loading={loading}
          />
        </div>

        {/* Right Column - Modules */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  Módulos da Trilha
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {trailPlan.modules.filter(m => m.status === "completed").length}/{trailPlan.modules.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {trailPlan.modules.map((module) => {
                const progress = module.estimatedHours > 0 
                  ? (module.completedHours / module.estimatedHours) * 100 
                  : 0;
                
                return (
                  <div 
                    key={module.id}
                    className="p-3 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Status Icon */}
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        module.status === "completed" 
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30" 
                          : module.status === "in_progress"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {module.status === "completed" ? (
                          <CheckCircle2 size={14} />
                        ) : module.status === "in_progress" ? (
                          <PlayCircle size={14} />
                        ) : (
                          <Lock size={12} />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{module.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock size={12} />
                          <span>{module.completedHours}h / {module.estimatedHours}h</span>
                          <span className="ml-auto font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5 mt-2" />
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs flex-1"
                        onClick={() => handleQuickAddHours(module.id, 0.5)}
                        disabled={module.status === "completed"}
                      >
                        <Plus size={12} className="mr-1" />
                        30min
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs flex-1"
                        onClick={() => handleQuickAddHours(module.id, 1)}
                        disabled={module.status === "completed"}
                      >
                        <Plus size={12} className="mr-1" />
                        1h
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleModuleClick(module.id)}
                      >
                        <Edit3 size={12} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Edit Dates Modal */}
      <EditDatesModal
        isOpen={editDatesOpen}
        onClose={() => setEditDatesOpen(false)}
        startDate={trailPlan.startDate}
        targetEndDate={trailPlan.targetDate}
        onSave={handleSaveDates}
      />
      
      {/* Edit Module Progress Modal */}
      <Dialog open={editModuleOpen} onOpenChange={setEditModuleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" />
              Editar Progresso
            </DialogTitle>
          </DialogHeader>
          
          {selectedModule && (
            <div className="space-y-4 py-4">
              <div>
                <p className="font-medium">{selectedModule.title}</p>
                <p className="text-sm text-muted-foreground">
                  Total estimado: {selectedModule.estimatedHours}h
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Horas completadas</Label>
                  <span className="font-mono text-lg font-bold">
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
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>0h</span>
                  <span>{selectedModule.estimatedHours}h</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditHoursValue(0)}
                  className="flex-1"
                >
                  Resetar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditHoursValue(selectedModule.estimatedHours)}
                  className="flex-1"
                >
                  Completar
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModuleOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateModuleProgress}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
