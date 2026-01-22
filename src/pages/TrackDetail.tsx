import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  Target,
  GraduationCap,
  Play,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { loadTracksCatalog, isTrackInUserPlan, type Track } from "@/data/tracks-catalog-data";
import { AddToPlanModal } from "@/components/explore/AddToPlanModal";

const categoryColors: Record<string, string> = {
  "Programação": "bg-blue-500",
  "UX/UI": "bg-purple-500",
  "Inglês": "bg-green-500",
  "Concursos": "bg-orange-500",
  "Certificações": "bg-amber-500",
  "Carreira": "bg-teal-500",
};

const levelColors: Record<string, string> = {
  "Iniciante": "text-emerald-600 bg-emerald-50",
  "Intermediário": "text-amber-600 bg-amber-50",
  "Avançado": "text-red-600 bg-red-50",
};

export default function TrackDetail() {
  const { trackId } = useParams<{ trackId: string }>();
  const navigate = useNavigate();
  const [track, setTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInPlan, setIsInPlan] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // TODO API: GET /api/tracks/:trackId
    const loadTrack = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const catalog = loadTracksCatalog();
      const found = catalog.find(t => t.id === trackId);
      setTrack(found || null);
      
      if (found) {
        setIsInPlan(isTrackInUserPlan(found.id));
      }
      
      setIsLoading(false);
    };
    
    loadTrack();
  }, [trackId]);

  const handleStudyWithAI = () => {
    // TODO: Pass track context to AI session
    navigate("/estudar");
  };

  const handleModalSuccess = () => {
    setIsInPlan(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <div className="bg-gradient-to-br from-[#1A237E] to-[#255FF1] h-48" />
        <div className="container mx-auto px-4 -mt-24">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Trilha não encontrada</h2>
          <p className="text-muted-foreground mb-4">
            A trilha que você procura não existe ou foi removida.
          </p>
          <Button onClick={() => navigate("/explorar")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao catálogo
          </Button>
        </div>
      </div>
    );
  }

  const totalModuleHours = track.modules.reduce((acc, m) => acc + m.estimatedHours, 0);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Hero */}
      <div className={`bg-gradient-to-br from-[#1A237E] to-[#255FF1] text-white`}>
        <div className="container mx-auto px-4 py-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10 -ml-2 mb-4"
            onClick={() => navigate("/explorar")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-white/20 text-white border-0">
                  {track.category}
                </Badge>
                <Badge className={`border-0 ${levelColors[track.level]}`}>
                  {track.level}
                </Badge>
                {track.badge && (
                  <Badge className="bg-amber-400 text-amber-900 border-0">
                    {track.badge === "popular" ? "Popular" : track.badge === "new" ? "Novo" : "Recomendado"}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold mb-3">{track.title}</h1>
              
              {/* Summary */}
              <p className="text-white/80 text-base md:text-lg mb-4">{track.summary}</p>

              {/* Metrics */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{track.estimatedHours} horas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{track.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{track.reviewsCount.toLocaleString("pt-BR")} alunos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>{track.modules.length} módulos</span>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <Card className="w-full md:w-80 shrink-0 shadow-xl">
              <CardContent className="p-5 space-y-4">
                {isInPlan ? (
                  <>
                    <div className="flex items-center gap-2 text-primary">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">No seu plano</span>
                    </div>
                    <Button 
                      className="w-full gap-2" 
                      size="lg"
                      onClick={handleStudyWithAI}
                    >
                      <Play className="w-4 h-4" />
                      Continuar estudando
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      className="w-full gap-2" 
                      size="lg"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Target className="w-4 h-4" />
                      Adicionar ao meu plano
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2" 
                      size="lg"
                      onClick={handleStudyWithAI}
                    >
                      <Sparkles className="w-4 h-4" />
                      Estudar com IA agora
                    </Button>
                  </>
                )}
                
                {track.instructor && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Instrutor</p>
                    <p className="text-sm font-medium">{track.instructor}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  O que você vai aprender
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {track.skills.map((skill, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Modules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Estrutura do Curso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {track.modules.map((module, index) => {
                  const progressPercent = (module.estimatedHours / totalModuleHours) * 100;
                  
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{module.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {module.estimatedHours}h • {module.topics.length} tópicos
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {module.topics.map((topic, i) => (
                          <span 
                            key={i}
                            className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Target Audience */}
            {track.targetAudience && track.targetAudience.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Para quem é essa trilha
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {track.targetAudience.map((audience, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        {audience}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Prerequisites */}
            {track.prerequisites && track.prerequisites.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    Pré-requisitos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {track.prerequisites.map((prereq, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground">•</span>
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {track.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add to Plan Modal */}
      <AddToPlanModal
        track={track}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
