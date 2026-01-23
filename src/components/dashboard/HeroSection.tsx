import { Sparkles, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  userName: string;
  progressPercent: number;
  daysToGoal?: number;
}

export function HeroSection({ userName, progressPercent, daysToGoal }: HeroSectionProps) {
  return (
    <section className="relative">
      {/* Main Hero Content */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Olá, {userName}! 👋
          </h1>
        </div>
        
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
          Seu <span className="font-medium text-foreground">copiloto de estudos</span> está pronto. 
          A IA organiza seu plano, define o ritmo ideal e te guia até o objetivo.
        </p>
      </div>

      {/* Progress Indicator - Investor-friendly */}
      {progressPercent > 0 && (
        <div className="mt-4 flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span>
              Você está <span className="font-semibold text-accent">{progressPercent}%</span> mais perto do objetivo
            </span>
          </div>
          {daysToGoal && daysToGoal > 0 && (
            <span className="text-muted-foreground/60 hidden sm:inline">
              • Previsão: {daysToGoal} dias restantes
            </span>
          )}
        </div>
      )}
    </section>
  );
}
