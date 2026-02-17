import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Video, FileText, Headphones, Play, BookMarked, ExternalLink } from "lucide-react";
import { useContentsQuery } from "@/hooks/use-contents";
import type { Content } from "@/api/contents";

const contentTypes = [
  { id: "all", label: "Todos", icon: BookOpen },
  { id: "youtube_video", label: "Vídeos", icon: Video },
  { id: "article", label: "Leituras", icon: FileText },
  { id: "quiz", label: "Quizzes", icon: BookOpen },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "youtube_video": return Video;
    case "article": return FileText;
    case "quiz": return BookOpen;
    default: return BookOpen;
  }
};

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h${remainMins > 0 ? ` ${remainMins}min` : ""}`;
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "youtube_video": return "Vídeo";
    case "article": return "Artigo";
    case "quiz": return "Quiz";
    case "assignment": return "Exercício";
    case "lab": return "Lab";
    default: return type;
  }
};

function ContentCard({ content }: { content: Content }) {
  const TypeIcon = getTypeIcon(content.type);

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4 flex items-center gap-4">
        {content.thumbnail_url ? (
          <img
            src={content.thumbnail_url}
            alt={content.title}
            className="w-16 h-10 rounded object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <TypeIcon size={20} className="text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{content.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {getTypeLabel(content.type)}
            </Badge>
            {content.duration_in_seconds > 0 && (
              <span>{formatDuration(content.duration_in_seconds)}</span>
            )}
            {content.author && (
              <>
                <span>•</span>
                <span className="truncate">{content.author}</span>
              </>
            )}
            {content.level && (
              <>
                <span>•</span>
                <span className="capitalize">{content.level}</span>
              </>
            )}
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <a href={content.link} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Conteudos() {
  const { data: contents, isLoading } = useContentsQuery();
  const [activeTab, setActiveTab] = useState("all");

  const filtered = contents?.filter((c) =>
    activeTab === "all" ? true : c.type === activeTab
  ) ?? [];

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {contentTypes.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-1.5">
              <type.icon size={14} />
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">Nenhum conteúdo encontrado</p>
            </div>
          ) : (
            filtered.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))
          )}
        </div>
      </Tabs>
    </div>
  );
}
