import { useState } from "react";
import { Calendar, Clock, Target, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Track, addTrackToUserPlan } from "@/data/tracks-catalog-data";
import { loadStudyGoals, StudyGoal } from "@/data/study-goals-data";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AddToPlanModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddToPlanModal({ track, isOpen, onClose, onSuccess }: AddToPlanModalProps) {
  const navigate = useNavigate();
  const [goalId, setGoalId] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>("");
  const [dailyMinutes, setDailyMinutes] = useState<string>("60");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate suggested end date based on hours and daily minutes
  const calculateSuggestedDate = () => {
    if (!track || !dailyMinutes) return null;
    const totalMinutes = track.estimatedHours * 60;
    const daysNeeded = Math.ceil(totalMinutes / parseInt(dailyMinutes));
    const suggestedDate = new Date();
    suggestedDate.setDate(suggestedDate.getDate() + daysNeeded);
    return suggestedDate.toISOString().split("T")[0];
  };

  const handleSubmit = async () => {
    if (!track) return;
    
    setIsSubmitting(true);
    
    try {
      // TODO API: POST /api/user/tracks
      addTrackToUserPlan(
        track.id,
        goalId || undefined,
        targetDate || undefined,
        dailyMinutes ? parseInt(dailyMinutes) : undefined
      );
      
      toast.success(`"${track.title}" adicionada ao seu plano!`, {
        description: "Você pode começar a estudar agora com a IA.",
        action: {
          label: "Estudar agora",
          onClick: () => navigate("/estudar"),
        },
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Erro ao adicionar trilha", {
        description: "Tente novamente em alguns instantes.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedDate = calculateSuggestedDate();

  if (!track) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Adicionar ao Plano
          </DialogTitle>
          <DialogDescription>
            Configure como você quer estudar "{track.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Goal Selection */}
          <div className="space-y-2">
            <Label htmlFor="goal" className="text-sm font-medium">
              Vincular a um objetivo (opcional)
            </Label>
            <Select value={goalId} onValueChange={setGoalId}>
              <SelectTrigger id="goal">
                <SelectValue placeholder="Selecione um objetivo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem objetivo específico</SelectItem>
                {loadStudyGoals().map((goal: StudyGoal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Daily Minutes */}
          <div className="space-y-2">
            <Label htmlFor="dailyMinutes" className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Minutos por dia disponíveis
            </Label>
            <Select value={dailyMinutes} onValueChange={setDailyMinutes}>
              <SelectTrigger id="dailyMinutes">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 min/dia</SelectItem>
                <SelectItem value="45">45 min/dia</SelectItem>
                <SelectItem value="60">1 hora/dia</SelectItem>
                <SelectItem value="90">1h30/dia</SelectItem>
                <SelectItem value="120">2 horas/dia</SelectItem>
                <SelectItem value="180">3 horas/dia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Target Date */}
          <div className="space-y-2">
            <Label htmlFor="targetDate" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Data alvo (opcional)
            </Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
            {suggestedDate && !targetDate && (
              <p className="text-xs text-muted-foreground">
                Sugestão: {new Date(suggestedDate).toLocaleDateString("pt-BR")} 
                {" "}(baseado em {dailyMinutes}min/dia)
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Resumo do plano:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {track.estimatedHours} horas de conteúdo</li>
              <li>• {track.modules.length} módulos</li>
              <li>• ~{Math.ceil((track.estimatedHours * 60) / parseInt(dailyMinutes || "60"))} dias para conclusão</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            <Sparkles className="w-4 h-4" />
            {isSubmitting ? "Adicionando..." : "Adicionar ao plano"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
