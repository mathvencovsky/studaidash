import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Target, 
  ChevronRight, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles
} from "lucide-react";
import type { StudyGoal, GoalProgress } from "@/data/study-goals-data";
import { GOAL_CATEGORY_CONFIG, formatGoalCategory } from "@/data/study-goals-data";

interface GoalSelectorCardProps {
  activeGoal: StudyGoal | null;
  goals: StudyGoal[];
  goalProgress: GoalProgress | null;
  onSelectGoal: (goalId: string) => void;
}

export function GoalSelectorCard({
  activeGoal,
  goals,
  goalProgress,
  onSelectGoal,
}: GoalSelectorCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectGoal = (goalId: string) => {
    onSelectGoal(goalId);
    setIsOpen(false);
  };

  const getStatusIcon = (status: GoalProgress["status"]) => {
    switch (status) {
      case "completed":
      case "on_track":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "attention":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "at_risk":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-accent" />;
    }
  };

  const getStatusBg = (status: GoalProgress["status"]) => {
    switch (status) {
      case "completed":
      case "on_track":
        return "bg-green-50 text-green-700 border-green-200";
      case "attention":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "at_risk":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-accent/10 text-accent border-accent/20";
    }
  };

  if (!activeGoal) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="p-6 text-center">
          <Target className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground mb-4">Nenhum objetivo selecionado</p>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Escolher Objetivo</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Escolha seu Objetivo
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                {goals.map((goal) => {
                  const config = GOAL_CATEGORY_CONFIG[goal.category];
                  const progress = Math.round((goal.completedHours / goal.totalEstimatedHours) * 100);
                  
                  return (
                    <button
                      key={goal.id}
                      onClick={() => handleSelectGoal(goal.id)}
                      className="w-full p-4 rounded-xl border bg-card hover:bg-muted/50 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{goal.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm truncate">{goal.shortName}</span>
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {config.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {goal.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {goal.totalEstimatedHours}h total
                            </span>
                            {goal.targetDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(goal.targetDate).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                              </span>
                            )}
                          </div>
                          <Progress value={progress} className="h-1.5 mt-2" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  const config = GOAL_CATEGORY_CONFIG[activeGoal.category];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Meu Objetivo</CardTitle>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                Trocar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Escolha seu Objetivo
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                {goals.map((goal) => {
                  const goalConfig = GOAL_CATEGORY_CONFIG[goal.category];
                  const progress = Math.round((goal.completedHours / goal.totalEstimatedHours) * 100);
                  const isActive = goal.id === activeGoal.id;
                  
                  return (
                    <button
                      key={goal.id}
                      onClick={() => handleSelectGoal(goal.id)}
                      className={`w-full p-4 rounded-xl border transition-all text-left group ${
                        isActive 
                          ? "bg-primary/5 border-primary/30" 
                          : "bg-card hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{goal.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm truncate">{goal.shortName}</span>
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {goalConfig.label}
                            </Badge>
                            {isActive && (
                              <Badge className="text-[10px] shrink-0 bg-primary">Ativo</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {goal.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {goal.totalEstimatedHours}h total
                            </span>
                            {goal.targetDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(goal.targetDate).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                              </span>
                            )}
                          </div>
                          <Progress value={progress} className="h-1.5 mt-2" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Goal Display */}
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeGoal.color} flex items-center justify-center text-2xl shrink-0`}>
            {activeGoal.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg truncate">{activeGoal.shortName}</h3>
              <Badge variant="outline" className="text-[10px] shrink-0">
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {activeGoal.description}
            </p>
          </div>
        </div>

        {/* Progress */}
        {goalProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-semibold">{goalProgress.progressPercent}%</span>
            </div>
            <Progress value={goalProgress.progressPercent} className="h-2" />
            
            {/* Status Badge */}
            <div className={`flex items-center gap-2 p-2 rounded-lg border ${getStatusBg(goalProgress.status)}`}>
              {getStatusIcon(goalProgress.status)}
              <span className="text-xs font-medium">{goalProgress.statusMessage}</span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">Restante</span>
            </div>
            <p className="font-bold text-lg">
              {goalProgress?.hoursRemaining || 0}h
            </p>
          </div>
          {goalProgress?.daysRemaining !== null && (
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs">Prazo</span>
              </div>
              <p className="font-bold text-lg">
                {goalProgress?.daysRemaining || 0}d
              </p>
            </div>
          )}
          {goalProgress?.requiredMinutesPerDay !== null && (
            <div className="p-3 rounded-lg bg-muted/50 col-span-2">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-xs">Ritmo necessário</span>
              </div>
              <p className="font-bold text-lg">
                {goalProgress?.requiredMinutesPerDay || 0} min/dia
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
