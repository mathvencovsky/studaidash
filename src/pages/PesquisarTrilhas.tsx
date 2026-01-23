import { useState, useEffect, useMemo } from "react";
import { Search, Sparkles, Clock, ArrowRight, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  loadTracksCatalog, 
  isTrackInUserPlan,
  type Track 
} from "@/data/tracks-catalog-data";
import { AddToPlanModal } from "@/components/explore";
import { useNavigate } from "react-router-dom";

// Simulated AI search function
function aiSearchTracks(query: string, tracks: Track[]): { tracks: Track[]; aiSummary: string } {
  if (!query.trim()) {
    return { tracks: [], aiSummary: "" };
  }

  const queryLower = query.toLowerCase();
  
  // Keyword mapping for semantic understanding
  const keywordMap: Record<string, string[]> = {
    "programação": ["frontend", "backend", "fullstack", "react", "node", "python", "Programação"],
    "frontend": ["react", "javascript", "typescript", "html", "css", "web"],
    "backend": ["node", "api", "server", "database", "express"],
    "dados": ["data", "analytics", "python", "pandas", "numpy", "análise"],
    "design": ["ux", "ui", "figma", "product", "UX/UI"],
    "inglês": ["english", "idiomas", "business", "tech", "Inglês"],
    "concurso": ["bacen", "receita", "fiscal", "federal", "Concursos"],
    "certificação": ["cfa", "aws", "pmp", "Certificações"],
    "carreira": ["gestão", "liderança", "Carreira"],
    "finanças": ["cfa", "investimentos", "economics", "finance"],
    "iniciante": ["básico", "zero", "começar", "Iniciante"],
    "avançado": ["senior", "expert", "Avançado"],
  };

  // Find related keywords
  const expandedTerms = new Set<string>();
  expandedTerms.add(queryLower);
  
  Object.entries(keywordMap).forEach(([key, values]) => {
    if (queryLower.includes(key) || values.some(v => queryLower.includes(v.toLowerCase()))) {
      values.forEach(v => expandedTerms.add(v.toLowerCase()));
      expandedTerms.add(key);
    }
  });

  // Score and filter tracks
  const scoredTracks = tracks.map(track => {
    let score = 0;
    const searchableText = [
      track.title,
      track.summary,
      track.category,
      track.level,
      ...track.tags,
      ...track.skills
    ].join(" ").toLowerCase();

    expandedTerms.forEach(term => {
      if (searchableText.includes(term)) {
        score += term === queryLower ? 10 : 3;
      }
    });

    // Boost popular and recommended
    if (track.badge === "popular") score += 2;
    if (track.badge === "recommended") score += 1;
    
    return { track, score };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const results = scoredTracks.slice(0, 6).map(item => item.track);

  // Generate AI summary
  let aiSummary = "";
  if (results.length > 0) {
    const categories = [...new Set(results.map(t => t.category))];
    const levels = [...new Set(results.map(t => t.level))];
    const totalHours = results.reduce((sum, t) => sum + t.estimatedHours, 0);
    
    aiSummary = `Encontrados ${results.length} resultados em ${categories.join(", ")}. `;
    aiSummary += `Níveis disponíveis: ${levels.join(", ")}. `;
    aiSummary += `Carga total estimada: ${totalHours}h.`;
  } else {
    aiSummary = "Nenhuma trilha corresponde à sua busca. Tente termos como 'programação', 'dados', 'inglês' ou 'concurso'.";
  }

  return { tracks: results, aiSummary };
}

export default function PesquisarTrilhas() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userTrackIds, setUserTrackIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const catalog = loadTracksCatalog();
    setTracks(catalog);
    
    // Load user tracks
    const ids = new Set<string>();
    catalog.forEach(t => {
      if (isTrackInUserPlan(t.id)) {
        ids.add(t.id);
      }
    });
    setUserTrackIds(ids);
  }, []);

  const { tracks: results, aiSummary } = useMemo(() => {
    if (!query.trim()) return { tracks: [], aiSummary: "" };
    return aiSearchTracks(query, tracks);
  }, [query, tracks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  const handleAddToPlan = (track: Track) => {
    setSelectedTrack(track);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTrack(null);
  };

  const handleModalSuccess = () => {
    // Refresh user tracks
    const ids = new Set<string>();
    tracks.forEach(t => {
      if (isTrackInUserPlan(t.id)) {
        ids.add(t.id);
      }
    });
    setUserTrackIds(ids);
  };

  // Example queries
  const exampleQueries = [
    "Quero aprender programação frontend",
    "Trilhas para iniciantes em dados",
    "Preparação para concurso federal",
    "Inglês para trabalho remoto",
    "Certificação em finanças",
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-medium text-foreground">Pesquisar trilhas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Descreva seu objetivo e encontre trilhas relevantes.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Ex: Quero aprender React para trabalhar como frontend..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-24 h-11 text-base"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8"
            disabled={!query.trim() || isSearching}
          >
            {isSearching ? "Buscando..." : "Buscar"}
          </Button>
        </div>
      </form>

      {/* Example Queries */}
      {!query && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Sugestões</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, i) => (
              <button
                key={i}
                onClick={() => setQuery(example)}
                className="text-sm px-3 py-1.5 rounded-md border bg-card hover:bg-muted transition-colors text-left"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Summary */}
      {query && aiSummary && (
        <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
          <Sparkles className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">{aiSummary}</p>
        </div>
      )}

      {/* Results */}
      {query && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Resultados
          </p>
          <div className="space-y-2">
            {results.map((track) => {
              const isInPlan = userTrackIds.has(track.id);
              return (
                <div
                  key={track.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-foreground">{track.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {track.level}
                      </Badge>
                      {track.badge === "popular" && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {track.summary}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {track.estimatedHours}h
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {track.modules.length} módulos
                      </span>
                      <span>{track.category}</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col gap-2">
                    {isInPlan ? (
                      <Badge variant="secondary" className="text-xs">No plano</Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToPlan(track)}
                        className="text-xs h-8"
                      >
                        Adicionar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/explorar/${track.id}`)}
                      className="text-xs h-8"
                    >
                      Ver <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state when searching */}
      {query && results.length === 0 && !isSearching && (
        <div className="text-center py-12 border rounded-lg bg-card">
          <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Nenhuma trilha encontrada.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tente termos mais específicos ou explore todas as trilhas.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => navigate("/explorar")}
          >
            Ver todas as trilhas
          </Button>
        </div>
      )}

      {/* Link to full catalog */}
      {!query && (
        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-between text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/explorar")}
          >
            <span>Ver catálogo completo</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      <AddToPlanModal
        track={selectedTrack}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
