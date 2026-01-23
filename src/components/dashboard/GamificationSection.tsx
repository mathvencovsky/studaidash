import { ChevronRight } from "lucide-react";
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
    <section className="border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-medium text-foreground">Conquistas</h3>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 divide-x border-b">
        <div className="p-3 text-center">
          <span className="text-base font-semibold text-foreground">{progress.xp.toLocaleString()}</span>
          <p className="text-[10px] text-muted-foreground">XP</p>
        </div>
        <div className="p-3 text-center">
          <span className="text-base font-semibold text-foreground">Nv {progress.level}</span>
          <p className="text-[10px] text-muted-foreground">Nível</p>
        </div>
        <div className="p-3 text-center">
          <span className="text-base font-semibold text-foreground">{progress.streak}</span>
          <p className="text-[10px] text-muted-foreground">Dias</p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-muted-foreground">Próximo nível</span>
          <span className="text-muted-foreground">{progress.xp % 500}/{xpForNext - (progress.level - 1) * 500} XP</span>
        </div>
        <Progress value={levelProgress} className="h-1" />
      </div>

      {/* Badges Preview */}
      {recentBadges.length > 0 && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">Últimas conquistas</span>
            <button 
              onClick={onViewAllBadges}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
            >
              Ver todas
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex gap-3">
            {recentBadges.map((badge) => (
              <div 
                key={badge.id}
                className="flex flex-col items-center p-2 bg-muted/30 rounded-lg flex-1"
                title={badge.description}
              >
                <span className="text-lg mb-1">{badge.icon}</span>
                <p className="text-[9px] text-center text-muted-foreground leading-tight line-clamp-1">
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
