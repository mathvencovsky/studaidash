interface HeroSectionProps {
  userName: string;
  progressPercent: number;
  daysToGoal?: number;
}

export function HeroSection({ userName, progressPercent, daysToGoal }: HeroSectionProps) {
  return (
    <section className="pb-1">
      <h1 className="text-lg font-medium text-foreground">
        Olá, {userName}.
      </h1>
      <p className="text-sm text-muted-foreground mt-0.5">
        Visão geral do seu progresso.
      </p>
    </section>
  );
}
