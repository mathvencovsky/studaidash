interface HeroSectionProps {
  userName: string;
  progressPercent: number;
  daysToGoal?: number;
}

export function HeroSection({ userName, progressPercent, daysToGoal }: HeroSectionProps) {
  return (
    <section className="pb-2">
      <h1 className="text-lg sm:text-xl font-semibold text-foreground">
        Olá, {userName}
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        {progressPercent}% concluído
        {daysToGoal && daysToGoal > 0 && (
          <span className="text-muted-foreground/70"> · {daysToGoal} dias restantes</span>
        )}
      </p>
    </section>
  );
}
