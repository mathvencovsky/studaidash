import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, FileText, Video, HelpCircle, Trash2 } from "lucide-react";

const savedItems = [
  {
    id: "1",
    title: "Fórmula do Z-Score",
    type: "note",
    module: "Probability Concepts",
    savedAt: "2 dias atrás",
  },
  {
    id: "2",
    title: "Vídeo: NPV vs IRR",
    type: "video",
    module: "Time Value of Money",
    savedAt: "4 dias atrás",
  },
  {
    id: "3",
    title: "Quiz: Distribuições",
    type: "quiz",
    module: "Probability Concepts",
    savedAt: "1 semana atrás",
  },
  {
    id: "4",
    title: "Resumo: Tipos de Média",
    type: "note",
    module: "Organizing Data",
    savedAt: "1 semana atrás",
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "note": return FileText;
    case "video": return Video;
    case "quiz": return HelpCircle;
    default: return Bookmark;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "note": return "Nota";
    case "video": return "Vídeo";
    case "quiz": return "Quiz";
    default: return type;
  }
};

export default function Salvos() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">
          Salvos
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Seus conteúdos favoritos e anotações importantes
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
          <TabsTrigger value="videos">Vídeos</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {savedItems.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <Card key={item.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <TypeIcon size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(item.type)}
                      </Badge>
                      <span>•</span>
                      <span>{item.module}</span>
                      <span>•</span>
                      <span>{item.savedAt}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {["notes", "videos", "quizzes"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <Bookmark size={40} className="mx-auto mb-2 opacity-50" />
              <p>Filtrando por {tab}...</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {savedItems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bookmark size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">Nenhum item salvo</h3>
            <p className="text-sm text-muted-foreground">
              Salve conteúdos importantes durante seus estudos para acessá-los rapidamente aqui.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
