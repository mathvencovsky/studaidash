import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">
          Programas
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Gerencie seus programas de estudo ativos
        </p>
      </div>

      <div className="grid gap-4">
        {programs.map((program) => (
          <Card key={program.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {program.category}
                    </Badge>
                    {program.status === "in_progress" && (
                      <Badge className="bg-primary/10 text-primary text-xs">
                        Em andamento
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg truncate">
                    {program.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} />
                      {program.modules} módulos
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {program.totalHours}h total
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>{program.progress}% concluído</span>
                      <span>{program.completedHours}h / {program.totalHours}h</span>
                    </div>
                    <Progress value={program.progress} className="h-2" />
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ChevronRight size={20} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
