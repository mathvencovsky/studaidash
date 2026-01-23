import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ChevronRight } from "lucide-react";

const programs = [
  {
    id: "cfa-l1",
    name: "CFA Level I - Quantitative Methods",
    category: "Certificação",
    progress: 42,
    totalHours: 44,
    completedHours: 18.5,
    modules: 7,
    status: "in_progress" as const,
  },
  {
    id: "python-ds",
    name: "Python para Data Science",
    category: "Programação",
    progress: 15,
    totalHours: 30,
    completedHours: 4.5,
    modules: 8,
    status: "not_started" as const,
  },
  {
    id: "english-b2",
    name: "Inglês para Negócios - B2",
    category: "Idiomas",
    progress: 0,
    totalHours: 40,
    completedHours: 0,
    modules: 12,
    status: "not_started" as const,
  },
];

export default function Programas() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">Programas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Trilhas ativas.
        </p>
      </div>

      <div className="space-y-4">
        {programs.map((program) => (
          <section key={program.id} className="border rounded-lg bg-card overflow-hidden hover:border-primary/30 transition-colors">
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{program.category}</span>
                    {program.status === "in_progress" && (
                      <span className="text-xs text-primary">Em andamento</span>
                    )}
                  </div>
                  <h3 className="font-medium text-foreground truncate">
                    {program.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} />
                      {program.modules} módulos
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {program.totalHours}h
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                  <ChevronRight size={16} />
                </Button>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{program.progress}%</span>
                  <span className="text-muted-foreground">{program.completedHours}h/{program.totalHours}h</span>
                </div>
                <Progress value={program.progress} className="h-1" />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
