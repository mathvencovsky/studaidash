import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface EditDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: string;
  targetEndDate: string;
  onSave: (startDate: string, targetEndDate: string) => void;
}

export function EditDatesModal({ 
  isOpen, 
  onClose, 
  startDate, 
  targetEndDate, 
  onSave 
}: EditDatesModalProps) {
  const [newStartDate, setNewStartDate] = useState(startDate);
  const [newTargetDate, setNewTargetDate] = useState(targetEndDate);

  const handleSave = () => {
    onSave(newStartDate, newTargetDate);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Editar Datas da Trilha
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data de Início</Label>
            <Input
              id="startDate"
              type="date"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Quando você começou ou pretende começar a trilha
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetDate">Data Alvo (Prazo)</Label>
            <Input
              id="targetDate"
              type="date"
              value={newTargetDate}
              onChange={(e) => setNewTargetDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Data da prova, deadline ou meta pessoal
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-[#255FF1] hover:bg-[#1A237E]">
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
