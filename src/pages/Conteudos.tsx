import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video, FileText, Headphones, Play, BookMarked } from "lucide-react";

const contentTypes = [
  { id: "all", label: "Todos", icon: BookOpen },
  { id: "videos", label: "Vídeos", icon: Video },
  { id: "readings", label: "Leituras", icon: FileText },
  { id: "podcasts", label: "Podcasts", icon: Headphones },
];

const contents = [
  {
    id: "1",
    title: "Introdução à Distribuição Normal",
    type: "video",
    duration: "15min",
    module: "Probability Concepts",
    completed: true,
  },
  {
    id: "2",
    title: "Cálculos com Z-Score - Teoria",
    type: "reading",
    duration: "10min",
    module: "Probability Concepts",
    completed: true,
  },
  {
    id: "3",
    title: "Aplicações Práticas de Probabilidade",
    type: "video",
    duration: "22min",
    module: "Probability Concepts",
    completed: false,
  },
  {
    id: "4",
    title: "Time Value of Money - Conceitos",
    type: "reading",
    duration: "18min",
    module: "Time Value of Money",
    completed: true,
  },
  {
    id: "5",
    title: "Podcast: Dicas para o CFA",
    type: "podcast",
    duration: "35min",
    module: "Geral",
    completed: false,
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "video": return Video;
    case "reading": return FileText;
    case "podcast": return Headphones;
    default: return BookOpen;
  }
};

export default function Conteudos() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">
          Conteúdos
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Explore todos os materiais de estudo disponíveis
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {contentTypes.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-1.5">
              <type.icon size={14} />
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {contents.map((content) => {
            const TypeIcon = getTypeIcon(content.type);
            return (
              <Card key={content.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <TypeIcon size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{content.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{content.duration}</span>
                      <span>•</span>
                      <span>{content.module}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {content.completed && (
                      <Badge variant="secondary" className="text-xs">
                        Concluído
                      </Badge>
                    )}
                    <Button size="sm" variant={content.completed ? "outline" : "default"}>
                      {content.completed ? <BookMarked size={16} /> : <Play size={16} />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {["videos", "readings", "podcasts"].map((type) => (
          <TabsContent key={type} value={type} className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <p>Filtrando por {type}...</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
