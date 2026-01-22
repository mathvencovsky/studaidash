import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock, PlayCircle, Clock, BookOpen, Target, TrendingUp } from "lucide-react";
import { 
  MOCK_TRAIL_PLAN, 
  MOCK_STUDY_DATA, 
  calculateTrailMetrics,
  formatHoursMinutes,
  formatDateBR
} from "@/data/trail-planning-data";
import { CompletionPlanCard } from "@/components/dashboard/CompletionPlanCard";
import { CurrentPaceCard } from "@/components/dashboard/CurrentPaceCard";
import { ModulesProgressCard } from "@/components/dashboard/ModulesProgressCard";

export default function Trilha() {
  const [loading, setLoading] = useState(false);
  
  // Calculate metrics using the trail planning data
  const calculations = useMemo(() => 
    calculateTrailMetrics(MOCK_TRAIL_PLAN, MOCK_STUDY_DATA), 
    []
  );

  const handleModuleClick = (moduleId: string) => {
    // TODO API: Navigate to module detail
    console.log("Module clicked:", moduleId);
  };

  const handleEditTarget = () => {
    // TODO: Open date picker modal
    console.log("Edit target date");
  };

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Trilha de Estudos</h1>
        <p className="text-muted-foreground mt-1">{MOCK_TRAIL_PLAN.name}</p>
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
        <Card className="min-w-[100px] flex-shrink-0 sm:min-w-0 sm:flex-shrink">
          <CardContent className="p-3 sm:p-4 text-center">
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
            trail={MOCK_TRAIL_PLAN}
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
        <div>
          <ModulesProgressCard 
            trail={MOCK_TRAIL_PLAN}
            onModuleClick={handleModuleClick}
            loading={loading}
            showAll={true}
          />
        </div>
      </div>
    </div>
  );
}
