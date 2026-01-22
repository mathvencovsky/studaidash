import { Star, Clock, Users, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Track } from "@/data/tracks-catalog-data";
import { useNavigate } from "react-router-dom";

interface TrackCardProps {
  track: Track;
  isInUserPlan?: boolean;
  onAddToPlan?: (trackId: string) => void;
}

const categoryColors: Record<string, string> = {
  "Programação": "bg-blue-500/10 text-blue-600 border-blue-200",
  "UX/UI": "bg-purple-500/10 text-purple-600 border-purple-200",
  "Inglês": "bg-green-500/10 text-green-600 border-green-200",
  "Concursos": "bg-orange-500/10 text-orange-600 border-orange-200",
  "Certificações": "bg-amber-500/10 text-amber-600 border-amber-200",
  "Carreira": "bg-teal-500/10 text-teal-600 border-teal-200",
};

const levelColors: Record<string, string> = {
  "Iniciante": "text-emerald-600",
  "Intermediário": "text-amber-600",
  "Avançado": "text-red-600",
};

const badgeConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  popular: { 
    label: "Popular", 
    icon: <TrendingUp className="w-3 h-3" />, 
    className: "bg-primary/10 text-primary border-primary/20" 
  },
  new: { 
    label: "Novo", 
    icon: <Zap className="w-3 h-3" />, 
    className: "bg-green-500/10 text-green-600 border-green-200" 
  },
  recommended: { 
    label: "Recomendado", 
    icon: <Sparkles className="w-3 h-3" />, 
    className: "bg-amber-500/10 text-amber-600 border-amber-200" 
  },
};

export function TrackCard({ track, isInUserPlan, onAddToPlan }: TrackCardProps) {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/explorar/${track.id}`);
  };
  
  const handleAddToPlan = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToPlan?.(track.id);
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30 overflow-hidden"
      onClick={handleViewDetails}
    >
      <CardContent className="p-0">
        {/* Header with category color */}
        <div className={`h-2 ${track.category === "Programação" ? "bg-blue-500" : 
          track.category === "UX/UI" ? "bg-purple-500" : 
          track.category === "Inglês" ? "bg-green-500" : 
          track.category === "Concursos" ? "bg-orange-500" : 
          track.category === "Certificações" ? "bg-amber-500" : "bg-teal-500"}`} 
        />
        
        <div className="p-5">
          {/* Badges row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="outline" className={`text-[10px] font-medium ${categoryColors[track.category]}`}>
              {track.category}
            </Badge>
            {track.badge && (
              <Badge variant="outline" className={`text-[10px] font-medium flex items-center gap-1 ${badgeConfig[track.badge].className}`}>
                {badgeConfig[track.badge].icon}
                {badgeConfig[track.badge].label}
              </Badge>
            )}
            {isInUserPlan && (
              <Badge variant="outline" className="text-[10px] font-medium bg-primary/10 text-primary border-primary/20">
                No seu plano
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {track.title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {track.summary}
          </p>

          {/* Metrics row */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{track.estimatedHours}h</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{track.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{track.reviewsCount.toLocaleString("pt-BR")}</span>
            </div>
            <span className={`font-medium ${levelColors[track.level]}`}>
              {track.level}
            </span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {track.skills.slice(0, 4).map((skill) => (
              <span 
                key={skill} 
                className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
              >
                {skill}
              </span>
            ))}
            {track.skills.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                +{track.skills.length - 4}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={handleViewDetails}
            >
              Ver detalhes
            </Button>
            {!isInUserPlan && (
              <Button 
                size="sm" 
                className="flex-1 text-xs bg-primary hover:bg-primary/90"
                onClick={handleAddToPlan}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Adicionar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
