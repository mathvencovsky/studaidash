import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Clock, CheckCircle2, Plus } from "lucide-react";

const goals = [
  {
    id: "1",
    title: "Concluir CFA Level I",
    deadline: "24/03/2026",
    progress: 42,
    status: "in_progress" as const,
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
    status: "in_progress" as const,
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
    status: "in_progress" as const,
    milestones: [],
  },
];

export default function Metas() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">
            Metas
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Defina e acompanhe seus objetivos de estudo
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus size={16} />
          Nova Meta
        </Button>
      </div>

      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target size={20} className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock size={12} />
                      Prazo: {goal.deadline}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {goal.progress}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={goal.progress} className="h-2" />
              
              {goal.milestones.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-medium text-muted-foreground">Marcos</p>
                  {goal.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle2
                        size={16}
                        className={milestone.completed ? "text-green-500" : "text-muted-foreground"}
                      />
                      <span className={milestone.completed ? "line-through text-muted-foreground" : ""}>
                        {milestone.title}
                      </span>
                      {!milestone.completed && milestone.progress > 0 && (
                        <Badge variant="outline" className="text-xs ml-auto">
                          {milestone.progress}%
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
