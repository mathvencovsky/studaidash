import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Sparkles, Target } from "lucide-react";
import { toast } from "sonner";
import {
  TrailTimelineCard,
  TrailPaceCard,
  TrailProgressStatsCard,
  TrailConsistencyCard,
  TrailNextStepCard,
  TrailContentMap,
  EditDatesModal,
} from "@/components/trail";
import {
  loadProgramState,
  saveProgramState,
  calculateProgramMetrics,
  getLast7DaysStudyData,
  getNextPendingContent,
  formatMinutes,
  formatDateBrazil,
} from "@/data/program-data";

export default function TrailOverviewPage() {
  const navigate = useNavigate();
  const [programState, setProgramState] = useState(() => loadProgramState());
  const [editDatesOpen, setEditDatesOpen] = useState(false);

  const activeProgram = programState.programs.find(
    (p) => p.id === programState.activeProgramId
  );

  const calculations = useMemo(() => {
    if (!activeProgram) return null;
    return calculateProgramMetrics(activeProgram, programState.sessions);
  }, [activeProgram, programState.sessions]);

  const weeklyData = useMemo(() => {
    if (!activeProgram) return [];
    return getLast7DaysStudyData(activeProgram.id, programState.sessions);
  }, [activeProgram, programState.sessions]);

  const nextContent = useMemo(() => {
    if (!activeProgram) return null;
    return getNextPendingContent(activeProgram);
  }, [activeProgram]);

  const handleSaveDates = useCallback(
    (startDate: string, targetEndDate: string) => {
      if (!activeProgram) return;
      const newState = {
        ...programState,
        programs: programState.programs.map((p) =>
          p.id === activeProgram.id ? { ...p, startDate, targetEndDate } : p
        ),
      };
      setProgramState(newState);
      saveProgramState(newState);
      toast.success("Datas atualizadas com sucesso!");
    },
    [activeProgram, programState]
  );

  const handleContentClick = useCallback((contentId: string) => {
    toast.info("Abrindo conteúdo...");
    // TODO API: Navigate to content detail/study view
  }, []);

  const handleMarkComplete = useCallback(
    (contentId: string) => {
      // TODO API: Mark content as complete in backend
      toast.success("Conteúdo marcado como concluído!");
    },
    []
  );

  const handleContinue = useCallback(() => {
    navigate("/estudar");
  }, [navigate]);

  if (!activeProgram || !calculations) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Nenhuma trilha ativa encontrada</p>
      </div>
    );
  }

  const streak = programState.sessions.length > 0 ? 12 : 0; // Mock streak

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Badge variant="outline" className="text-xs">
              {activeProgram.icon} Trilha Ativa
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A237E]">
            Visão Geral da Trilha
          </h1>
          <p className="text-muted-foreground mt-1">{activeProgram.name}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Exportando...")}>
            <Download className="w-4 h-4 mr-1" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#1A237E] to-[#255FF1] text-white">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Resumo da IA</p>
            <p className="text-sm opacity-90 mt-1">
              Para concluir até {formatDateBrazil(calculations.targetEndDate)}, você precisa de{" "}
              <strong>{calculations.requiredDailyMin} min/dia</strong>. Seu ritmo atual é{" "}
              <strong>{calculations.currentDailyAvgMin} min/dia</strong>.
              {calculations.deltaDailyMin > 0
                ? ` Aumente ${calculations.deltaDailyMin} min/dia para ficar no ritmo.`
                : " Você está no ritmo certo! 🎯"}
            </p>
          </div>
        </div>
      </div>

      {/* Row 1: Timeline + Pace */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <TrailTimelineCard
            programName={activeProgram.name}
            calculations={calculations}
            onEditDates={() => setEditDatesOpen(true)}
          />
        </div>
        <div>
          <TrailPaceCard calculations={calculations} />
        </div>
      </div>

      {/* Row 2: Progress + Consistency + Next Step */}
      <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
        <TrailProgressStatsCard calculations={calculations} />
        <TrailConsistencyCard
          weeklyData={weeklyData}
          streak={streak}
          activeDays7d={calculations.activeDays7d}
        />
        <TrailNextStepCard nextContent={nextContent} onContinue={handleContinue} />
      </div>

      {/* Row 3: Content Map */}
      <TrailContentMap
        contents={activeProgram.contents}
        onContentClick={handleContentClick}
        onMarkComplete={handleMarkComplete}
      />

      {/* Edit Dates Modal */}
      <EditDatesModal
        isOpen={editDatesOpen}
        onClose={() => setEditDatesOpen(false)}
        startDate={activeProgram.startDate}
        targetEndDate={activeProgram.targetEndDate}
        onSave={handleSaveDates}
      />
    </div>
  );
}
