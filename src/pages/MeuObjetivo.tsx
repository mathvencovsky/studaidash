import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  ArrowRight, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Map,
  BookOpen,
  PlayCircle
} from "lucide-react";
import {
  loadStudyGoals,
  saveStudyGoals,
  calculateGoalProgress,
  getTrailsForGoal,
  GOAL_CATEGORY_CONFIG,
  type StudyGoal,
} from "@/data/study-goals-data";
import { toast } from "sonner";

export default function MeuObjetivoPage() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState(() => loadStudyGoals());
  
  const activeGoal = useMemo(() => goals.find(g => g.isActive), [goals]);
  
  const goalProgress = useMemo(() => {
    if (!activeGoal) return null;
    return calculateGoalProgress(activeGoal);
  }, [activeGoal]);

  const linkedTrails = useMemo(() => {
    if (!activeGoal) return [];
    return getTrailsForGoal(activeGoal);
  }, [activeGoal]);

  const handleSetActive = useCallback((goalId: string) => {
    const updated = goals.map(g => ({ ...g, isActive: g.id === goalId }));
    setGoals(updated);
    saveStudyGoals(updated);
    toast.success("Objetivo ativado!");
  }, [goals]);

  const handleStartStudy = useCallback(() => {
    navigate("/estudar");
  }, [navigate]);

  const handleViewTrail = useCallback(() => {
    navigate("/trilha");
  }, [navigate]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Concluído" };
      case "on_track":
        return { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "No ritmo" };
      case "attention":
        return { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", label: "Atenção" };
      case "at_risk":
        return { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", label: "Em risco" };
      default:
        return { icon: Sparkles, color: "text-accent", bg: "bg-accent/10", label: "Contínuo" };
    }
  };

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A237E]">Meu Objetivo</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie seus objetivos de estudo e acompanhe seu progresso
        </p>
      </div>

      {/* Active Goal Card */}
      {activeGoal && goalProgress && (
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className={`bg-gradient-to-br ${activeGoal.color} p-6 text-white`}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl">
                {activeGoal.icon}
              </div>
              <div className="flex-1">
                <Badge className="bg-white/20 border-0 text-white mb-2">
                  {GOAL_CATEGORY_CONFIG[activeGoal.category].label}
                </Badge>
                <h2 className="text-2xl font-bold mb-1">{activeGoal.name}</h2>
                <p className="text-white/80 text-sm">{activeGoal.description}</p>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6 space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progresso geral</span>
                <span className="font-bold text-lg">{goalProgress.progressPercent}%</span>
              </div>
              <Progress value={goalProgress.progressPercent} className="h-3" />
            </div>

            {/* Status */}
            {(() => {
              const config = getStatusConfig(goalProgress.status);
              const StatusIcon = config.icon;
              return (
                <div className={`flex items-center gap-2 p-3 rounded-xl ${config.bg}`}>
                  <StatusIcon className={`w-5 h-5 ${config.color}`} />
                  <div>
                    <span className={`font-medium ${config.color}`}>{config.label}</span>
                    <p className="text-sm text-muted-foreground">{goalProgress.statusMessage}</p>
                  </div>
                </div>
              );
            })()}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <Clock className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
                <p className="text-2xl font-bold">{activeGoal.completedHours}h</p>
                <p className="text-xs text-muted-foreground">Estudado</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <Target className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
                <p className="text-2xl font-bold">{goalProgress.hoursRemaining}h</p>
                <p className="text-xs text-muted-foreground">Restante</p>
              </div>
              {goalProgress.daysRemaining !== null && (
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <Calendar className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
                  <p className="text-2xl font-bold">{goalProgress.daysRemaining}</p>
                  <p className="text-xs text-muted-foreground">Dias restantes</p>
                </div>
              )}
              {goalProgress.requiredMinutesPerDay !== null && (
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <TrendingUp className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
                  <p className="text-2xl font-bold">{goalProgress.requiredMinutesPerDay}</p>
                  <p className="text-xs text-muted-foreground">min/dia</p>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleStartStudy} className="flex-1 gap-2">
                <PlayCircle className="w-4 h-4" />
                Estudar com IA
              </Button>
              <Button onClick={handleViewTrail} variant="outline" className="flex-1 gap-2">
                <Map className="w-4 h-4" />
                Ver Trilha Completa
              </Button>
            </div>

            {/* Linked Trails */}
            {linkedTrails.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Trilhas vinculadas
                </h3>
                <div className="space-y-2">
                  {linkedTrails.map(trail => (
                    <div 
                      key={trail.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => navigate("/trilha")}
                    >
                      <span className="text-xl">{trail.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{trail.shortName}</p>
                        <p className="text-xs text-muted-foreground">{trail.totalHours}h • {trail.totalModules} módulos</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Other Goals */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Outros Objetivos</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {goals.filter(g => !g.isActive).map(goal => {
            const progress = calculateGoalProgress(goal);
            const config = GOAL_CATEGORY_CONFIG[goal.category];
            
            return (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center text-xl`}>
                      {goal.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{goal.shortName}</h3>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                        {goal.description}
                      </p>
                      <Progress value={progress.progressPercent} className="h-1.5 mb-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {progress.progressPercent}% • {progress.hoursRemaining}h restantes
                        </span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => handleSetActive(goal.id)}
                        >
                          Ativar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

