import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Components
import { HeroSection } from "./HeroSection";
import { AICopilotCTA } from "./AICopilotCTA";
import { TodayPlanCard } from "./TodayPlanCard";
import { TrailExecutiveSummary } from "./TrailExecutiveSummary";
import { ProgressSection } from "./ProgressSection";
import { AssessmentsSection } from "./AssessmentsSection";
import { GamificationSection } from "./GamificationSection";
import { TrailSelectorCard } from "./TrailSelectorCard";
import { SmartFeedbackCard } from "./SmartFeedbackCard";

import type { CFAModule, Quiz, Simulado, SmartFeedback } from "@/types/studai";
import { getQuizQuestions } from "@/data/quiz-questions-data";
import { getNextAIStudyAction } from "@/data/ai-study-data";
import { useDailyPlan } from "@/hooks/use-daily-plan";
import { useXP, awardTaskXP } from "@/hooks/use-xp";
import { 
  CFA_MODULES, 
  CFA_QUIZZES, 
  CFA_SIMULADOS, 
  getSmartFeedback,
  calculateTrailProgress 
} from "@/data/cfa-mock-data";
import { 
  MOCK_TRAIL_PLAN, 
  MOCK_STUDY_DATA, 
  AVAILABLE_TRAILS,
  calculateTrailMetrics 
} from "@/data/trail-planning-data";
import { toast } from "sonner";

export function CFADashboard() {
  const navigate = useNavigate();
  
  // AI Recommendation
  const aiRecommendation = useMemo(() => getNextAIStudyAction(), []);
  
  // Daily Plan hook (centralized state)
  const { mission, toggleTask, startMission } = useDailyPlan();
  
  // Centralized XP hook
  const { progress: userProgress } = useXP();
  
  // State
  const [modules] = useState<CFAModule[]>(CFA_MODULES);
  const [quizzes] = useState<Quiz[]>(CFA_QUIZZES);
  const [simulados] = useState<Simulado[]>(CFA_SIMULADOS);
  const [feedback] = useState<SmartFeedback>(getSmartFeedback);
  const [activeTrail, setActiveTrail] = useState(MOCK_TRAIL_PLAN);

  // Calculate overall progress
  const overallProgress = useMemo(() => calculateTrailProgress(modules), [modules]);
  
  // Calculate trail planning metrics
  const trailCalculations = useMemo(() => 
    calculateTrailMetrics(MOCK_TRAIL_PLAN, MOCK_STUDY_DATA), 
    []
  );

  // Handlers
  const handleTaskClick = useCallback((task: { type: string; id: string }) => {
    startMission();

    switch (task.type) {
      case "reading":
      case "practice":
      case "summary":
        navigate("/estudar");
        break;
      case "quiz":
        navigate("/quizzes");
        break;
      default:
        navigate("/estudar");
    }
  }, [navigate, startMission]);

  const handleStartMission = useCallback(() => {
    const nextTask = mission.tasks.find(t => !t.completed);
    startMission();

    if (nextTask) {
      handleTaskClick(nextTask);
    } else {
      toast.success("Plano concluído");
    }
  }, [mission.tasks, handleTaskClick, startMission]);

  const handleToggleTask = useCallback((taskId: string) => {
    const task = mission.tasks.find(t => t.id === taskId);
    
    // Only grant XP when marking as complete (not when unchecking)
    if (task && !task.completed) {
      const { leveledUp } = awardTaskXP();
      if (leveledUp) {
        toast.success("🎉 Level Up! +25 XP");
      } else {
        toast.success("+25 XP");
      }
    }
    
    toggleTask(taskId);
  }, [mission.tasks, toggleTask]);

  const handleModuleClick = useCallback((moduleId: string) => {
    navigate("/trilha", { state: { focusModuleId: moduleId } });
  }, [navigate]);

  const handleViewAllBadges = useCallback(() => {
    navigate("/perfil");
  }, [navigate]);

  const handleStartQuiz = useCallback((quizId: string) => {
    const questions = getQuizQuestions(quizId);
    if (questions.length > 0) {
      navigate(`/quiz/${quizId}`);
    } else {
      toast.info("Em desenvolvimento");
    }
  }, [navigate]);

  const handleViewAllQuizzes = useCallback(() => {
    navigate("/quizzes");
  }, [navigate]);

  const handleStartSimulado = useCallback((simuladoId: string) => {
    const simulado = simulados.find(s => s.id === simuladoId);
    if (simulado) {
      navigate(`/quiz/${simuladoId}`, { state: { isSimulado: true, simulado } });
    }
  }, [simulados, navigate]);

  const handleFeedbackAction = useCallback(() => {
    if (feedback.actionModuleId) {
      navigate("/trilha", { state: { focusModuleId: feedback.actionModuleId } });
    } else if (feedback.type === "weakness" || feedback.type === "focus") {
      navigate("/estudar");
    } else {
      navigate("/trilha");
    }
  }, [feedback, navigate]);

  const handleSelectTrail = useCallback((trailId: string) => {
    const trail = AVAILABLE_TRAILS.find(t => t.id === trailId);
    if (trail) {
      setActiveTrail(prev => ({
        ...prev,
        id: trail.id,
        name: trail.name,
        category: trail.category,
      }));
      toast.success(`Trilha selecionada: ${trail.shortName}`);
    }
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        
        {/* 1. Hero - Minimal */}
        <HeroSection 
          userName="João"
          progressPercent={trailCalculations.progressPercent}
          daysToGoal={trailCalculations.daysUntilTarget}
        />

        {/* 2. Primary CTA - System command style */}
        <AICopilotCTA 
          recommendation={aiRecommendation}
          onStart={() => navigate("/estudar")}
        />

        {/* 3. Today's Plan */}
        <TodayPlanCard
          mission={mission}
          onStartMission={handleStartMission}
          onToggleTask={handleToggleTask}
          onTaskClick={handleTaskClick}
        />

        {/* 4. Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          
          {/* Left Column */}
          <div className="space-y-6">
            {/* Trail Status */}
            <TrailExecutiveSummary 
              trailName={activeTrail.name}
              startDate={activeTrail.startDate}
              targetDate={activeTrail.targetDate}
              calculations={trailCalculations}
              totalHours={activeTrail.totalEstimatedHours}
              completedHours={activeTrail.completedHours}
              streak={MOCK_STUDY_DATA.streak}
              onViewDetails={() => navigate("/trilha")}
            />

            {/* Trail Selector */}
            <TrailSelectorCard 
              activeTrail={activeTrail}
              availableTrails={AVAILABLE_TRAILS}
              onSelectTrail={handleSelectTrail}
            />

            {/* Gamification - below trail selector */}
            <GamificationSection
              progress={userProgress}
              onViewAllBadges={handleViewAllBadges}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Module Progress */}
            <ProgressSection
              modules={modules}
              overallProgress={overallProgress}
              onModuleClick={handleModuleClick}
            />

            {/* Assessments */}
            <AssessmentsSection
              quizzes={quizzes}
              simulados={simulados}
              onStartQuiz={handleStartQuiz}
              onStartSimulado={handleStartSimulado}
              onViewAllQuizzes={handleViewAllQuizzes}
            />
          </div>
        </div>

        {/* 5. Smart Feedback */}
        <SmartFeedbackCard
          feedback={feedback}
          onActionClick={handleFeedbackAction}
        />
      </div>
    </div>
  );
}
