import { Flame, Star, Trophy, Zap, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { UserProgress } from "@/types/studai";
import { getXPForNextLevel, getLevelProgress } from "@/data/cfa-mock-data";

interface GamificationSectionProps {
  progress: UserProgress;
  onViewAllBadges: () => void;
}

export function GamificationSection({ progress, onViewAllBadges }: GamificationSectionProps) {
  const levelProgress = getLevelProgress(progress.xp, progress.level);
  const xpForNext = getXPForNextLevel(progress.level);
  const unlockedBadges = progress.badges.filter(b => b.unlocked);
  const recentBadges = unlockedBadges.slice(0, 3);

  return (
    <section className="bg-card border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Conquistas</h3>
            <p className="text-xs text-muted-foreground">Seu progresso de gamificação</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 divide-x border-b">
        <div className="p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-lg font-bold">{progress.xp.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-muted-foreground">XP Total</p>
        </div>
        <div className="p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-lg font-bold">Nv {progress.level}</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Nível</p>
        </div>
        <div className="p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-4 h-4 text-warning" />
            <span className="text-lg font-bold">{progress.streak}</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Dias</p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="font-medium">Próximo nível</span>
          <span className="text-muted-foreground">{progress.xp % 500}/{xpForNext - (progress.level - 1) * 500} XP</span>
        </div>
        <Progress value={levelProgress} className="h-2" />
      </div>

      {/* Badges Preview */}
      {recentBadges.length > 0 && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-foreground">Últimas conquistas</span>
            <button 
              onClick={onViewAllBadges}
              className="text-[10px] text-accent font-medium hover:underline flex items-center gap-0.5"
            >
              Ver todas
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex gap-3">
            {recentBadges.map((badge) => (
              <div 
                key={badge.id}
                className="flex flex-col items-center p-2 bg-muted/50 rounded-xl flex-1"
                title={badge.description}
              >
                <span className="text-xl mb-1">{badge.icon}</span>
                <p className="text-[9px] text-center text-muted-foreground font-medium leading-tight line-clamp-1">
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
