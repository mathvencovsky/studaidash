import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";

const goals = [
  {
    id: "1",
    title: "Concluir CFA Level I",
    deadline: "24/03/2026",
    progress: 42,
    milestones: [
      { id: "m1", title: "Quantitative Methods", completed: false, progress: 75 },
      { id: "m2", title: "Economics", completed: false, progress: 0 },
      { id: "m3", title: "Financial Reporting", completed: false, progress: 0 },
    ],
  },
  {
    id: "2",
    title: "Estudar 300 horas",
    deadline: "24/03/2026",
    progress: 62,
    milestones: [
      { id: "m4", title: "100 horas", completed: true, progress: 100 },
      { id: "m5", title: "200 horas", completed: false, progress: 85 },
      { id: "m6", title: "300 horas", completed: false, progress: 0 },
    ],
  },
  {
    id: "3",
    title: "Completar 50 quizzes",
    deadline: "28/02/2026",
    progress: 28,
    milestones: [],
  },
];

export default function Metas() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-foreground">Metas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Objetivos de estudo.
          </p>
        </div>
        <Button size="sm" variant="outline" className="h-8 text-xs">
          <Plus size={14} className="mr-1" />
          Nova
        </Button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <section key={goal.id} className="border rounded-lg bg-card overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">{goal.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Prazo: {goal.deadline}
                  </p>
                </div>
                <span className="text-sm font-medium text-foreground">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-1 mt-3" />
            </div>
            
            {goal.milestones.length > 0 && (
              <div className="p-4 space-y-2">
                <p className="text-xs text-muted-foreground">Marcos</p>
                {goal.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      milestone.completed 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "border-border"
                    }`}>
                      {milestone.completed && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span className={milestone.completed ? "text-muted-foreground line-through" : "text-foreground"}>
                      {milestone.title}
                    </span>
                    {!milestone.completed && milestone.progress > 0 && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        {milestone.progress}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
