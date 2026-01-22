import { Flame, Star, Trophy, Zap, ChevronRight } from "lucide-react";
import type { UserProgress, Badge } from "@/types/studai";
import { getXPForNextLevel, getLevelProgress } from "@/data/cfa-mock-data";

interface GamificationCardProps {
  progress: UserProgress;
  onViewAllBadges: () => void;
}

export function GamificationCard({ progress, onViewAllBadges }: GamificationCardProps) {
  const levelProgress = getLevelProgress(progress.xp, progress.level);
  const xpForNext = getXPForNextLevel(progress.level);
  const unlockedBadges = progress.badges.filter(b => b.unlocked);
  const recentBadges = unlockedBadges.slice(0, 4);

  return (
    <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        {/* XP */}
        <div className="text-center p-2.5 sm:p-4 bg-accent/5 rounded-xl">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
            <Zap size={16} className="sm:w-5 sm:h-5 text-accent" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-card-foreground">{progress.xp.toLocaleString()}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">XP Total</p>
        </div>

        {/* Level */}
        <div className="text-center p-2.5 sm:p-4 bg-primary/5 rounded-xl">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
            <Star size={16} className="sm:w-5 sm:h-5 text-primary" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-card-foreground">Nv {progress.level}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Estudante</p>
        </div>

        {/* Streak */}
        <div className="text-center p-2.5 sm:p-4 bg-warning/10 rounded-xl">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
            <Flame size={16} className="sm:w-5 sm:h-5 text-warning" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-card-foreground">{progress.streak}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Dias</p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-xs sm:text-sm font-medium text-card-foreground">Nível {progress.level + 1}</span>
          <span className="text-[10px] sm:text-xs text-muted-foreground">{progress.xp % 500}/{xpForNext - (progress.level - 1) * 500} XP</span>
        </div>
        <div className="h-2 sm:h-2.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>

      {/* Weekly Goal */}
      <div className="bg-secondary/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-xs sm:text-sm font-medium text-card-foreground">Meta Semanal</span>
          <span className="text-xs sm:text-sm font-bold text-accent">
            {progress.weeklyProgress}/{progress.weeklyGoal} min
          </span>
        </div>
        <div className="h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent rounded-full transition-all"
            style={{ width: `${Math.min(100, (progress.weeklyProgress / progress.weeklyGoal) * 100)}%` }}
          />
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">
          {progress.weeklyGoal - progress.weeklyProgress > 0 
            ? `Faltam ${progress.weeklyGoal - progress.weeklyProgress} min`
            : "🎉 Meta atingida!"
          }
        </p>
      </div>

      {/* Badges */}
      <div>
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Trophy size={16} className="sm:w-[18px] sm:h-[18px] text-primary" />
            <span className="text-xs sm:text-sm font-semibold text-card-foreground">Conquistas</span>
          </div>
          <button 
            onClick={onViewAllBadges}
            className="text-[10px] sm:text-xs text-accent font-medium hover:underline flex items-center gap-0.5 sm:gap-1"
          >
            Ver todas
            <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {recentBadges.map((badge) => (
            <div 
              key={badge.id}
              className="flex flex-col items-center p-2 sm:p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors cursor-pointer group active:scale-95"
              title={badge.description}
            >
              <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1 group-hover:scale-110 transition-transform">
                {badge.icon}
              </span>
              <p className="text-[8px] sm:text-[10px] text-center text-muted-foreground font-medium leading-tight line-clamp-2">
                {badge.name}
              </p>
            </div>
          ))}
        </div>

        {unlockedBadges.length === 0 && (
          <div className="text-center py-3 sm:py-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Complete missões para desbloquear conquistas!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
