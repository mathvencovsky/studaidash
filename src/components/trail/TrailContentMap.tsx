import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  ChevronRight, 
  CheckCircle2, 
  PlayCircle, 
  Lock, 
  BookOpen,
  Clock,
  Filter
} from "lucide-react";
import type { ContentNode } from "@/data/program-data";
import { formatMinutes } from "@/data/program-data";

interface TrailContentMapProps {
  contents: ContentNode[];
  onContentClick: (contentId: string) => void;
  onMarkComplete: (contentId: string) => void;
}

type FilterType = "all" | "in_progress" | "not_started" | "done";

export function TrailContentMap({ 
  contents, 
  onContentClick,
  onMarkComplete 
}: TrailContentMapProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const statusConfig = {
    done: { 
      icon: CheckCircle2, 
      color: "text-green-600", 
      bg: "bg-green-50",
      label: "Concluído" 
    },
    in_progress: { 
      icon: PlayCircle, 
      color: "text-[#255FF1]", 
      bg: "bg-blue-50",
      label: "Em andamento" 
    },
    not_started: { 
      icon: BookOpen, 
      color: "text-muted-foreground", 
      bg: "bg-muted",
      label: "Não iniciado" 
    },
  };

  const filteredContents = contents.filter(c => 
    filter === "all" ? true : c.status === filter
  );

  const stats = {
    all: contents.length,
    done: contents.filter(c => c.status === "done").length,
    in_progress: contents.filter(c => c.status === "in_progress").length,
    not_started: contents.filter(c => c.status === "not_started").length,
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg font-bold text-[#1A237E] flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Mapa de Conteúdos
          </CardTitle>
          
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(["all", "in_progress", "not_started", "done"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  filter === f 
                    ? "bg-[#255FF1] text-white" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f === "all" ? "Todos" : f === "in_progress" ? "Em progresso" : f === "not_started" ? "A fazer" : "Feitos"}
                <span className="ml-1 opacity-70">({stats[f]})</span>
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Accordion type="multiple" className="space-y-2">
          {filteredContents.map((content) => {
            const config = statusConfig[content.status];
            const StatusIcon = config.icon;
            const progressPct = content.estimatedMinutes > 0
              ? Math.round((content.completedMinutes / content.estimatedMinutes) * 100)
              : 0;
            const hasChildren = content.children && content.children.length > 0;

            return (
              <AccordionItem 
                key={content.id} 
                value={content.id}
                className={`border rounded-lg overflow-hidden ${config.bg}`}
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline [&[data-state=open]>svg]:rotate-90">
                  <div className="flex items-center gap-3 flex-1">
                    <StatusIcon className={`w-5 h-5 ${config.color} shrink-0`} />
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{content.title}</span>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatMinutes(content.estimatedMinutes)}
                        </span>
                        {content.status !== "not_started" && (
                          <span className={config.color}>{progressPct}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                </AccordionTrigger>
                
                <AccordionContent className="px-4 pb-4">
                  {/* Progress bar for module */}
                  {content.status !== "not_started" && (
                    <div className="mb-3">
                      <Progress value={progressPct} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatMinutes(content.completedMinutes)} de {formatMinutes(content.estimatedMinutes)} estudados
                      </p>
                    </div>
                  )}

                  {/* Children contents */}
                  {hasChildren && (
                    <div className="space-y-2">
                      {content.children!.map((child) => {
                        const childConfig = statusConfig[child.status];
                        const ChildIcon = childConfig.icon;
                        const childPct = child.estimatedMinutes > 0
                          ? Math.round((child.completedMinutes / child.estimatedMinutes) * 100)
                          : 0;

                        return (
                          <button
                            key={child.id}
                            onClick={() => onContentClick(child.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/60 hover:bg-white border border-white/80 transition-colors text-left"
                          >
                            <ChildIcon className={`w-4 h-4 ${childConfig.color} shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{child.title}</p>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                <span>{formatMinutes(child.estimatedMinutes)}</span>
                                {child.status !== "not_started" && (
                                  <span className={childConfig.color}>{childPct}%</span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-white/50">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onContentClick(content.id)}
                      className="flex-1"
                    >
                      <PlayCircle className="w-4 h-4 mr-1" />
                      {content.status === "not_started" ? "Começar" : "Continuar"}
                    </Button>
                    {content.status !== "done" && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => onMarkComplete(content.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Marcar como concluído
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {filteredContents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum conteúdo encontrado com este filtro</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
