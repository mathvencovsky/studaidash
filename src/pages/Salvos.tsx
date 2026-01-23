import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, HelpCircle, Bookmark, Trash2 } from "lucide-react";

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

export default function Salvos() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">Salvos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Conteúdos favoritos.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
          <TabsTrigger value="videos">Vídeos</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <section className="border rounded-lg bg-card overflow-hidden divide-y">
            {savedItems.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <div key={item.id} className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
                  <TypeIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.module} · {item.savedAt}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 size={14} />
                  </Button>
                </div>
              );
            })}
          </section>
        </TabsContent>

        {["notes", "videos", "quizzes"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <Bookmark size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Filtrando por {tab}...</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
