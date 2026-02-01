import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Map, 
  BarChart3, 
  Brain, 
  Target, 
  Calendar, 
  RefreshCw,
  ArrowRight,
  Eye
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { type ProfileKey, isValidProfile, getStoredProfile } from "./LandingHero";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";

const features = [
  {
    icon: Map,
    title: "Trilha por objetivo",
    description: "Você informa a meta e o prazo. O sistema organiza os tópicos.",
    why: "Clareza sobre o que estudar.",
  },
  {
    icon: Brain,
    title: "Sessões guiadas",
    description: "Conteúdo estruturado por etapas com leitura e exercícios.",
    why: "Foco em execução.",
  },
  {
    icon: RefreshCw,
    title: "Revisões programadas",
    description: "O sistema agenda revisões automáticas baseadas no tempo.",
    why: "Fixação ao longo do tempo.",
  },
  {
    icon: BarChart3,
    title: "Progresso semanal",
    description: "Métricas de horas, tarefas e cobertura por semana.",
    why: "Visibilidade da evolução.",
  },
  {
    icon: Target,
    title: "Plano do dia",
    description: "Lista de tarefas diárias gerada pela sua disponibilidade.",
    why: "Saber o que fazer hoje.",
  },
  {
    icon: Calendar,
    title: "Calendário de estudos",
    description: "Visualize sessões passadas e futuras no calendário.",
    why: "Controle sobre rotina.",
  },
];

type ProfilePreview = {
  trailName: string;
  trailProgress: number;
  trailDaysLeft: number;
  trailHoursPerDay: string;
  tasks: { label: string; done: boolean }[];
  stats: { label: string; value: string }[];
  subtitle: string;
};

const profilePreviews: Record<ProfileKey, ProfilePreview> = {
  concurso: {
    trailName: "Analista BACEN",
    trailProgress: 42,
    trailDaysLeft: 98,
    trailHoursPerDay: "1.5h",
    tasks: [
      { label: "Leitura: Direito Constitucional", done: true },
      { label: "Questões: Direito Administrativo", done: false },
      { label: "Revisão: Português", done: false },
    ],
    stats: [
      { label: "Horas", value: "8h 30m" },
      { label: "Sequência", value: "12 dias" },
      { label: "Cobertura", value: "42%" },
    ],
    subtitle: "Concurso",
  },
  certificacao: {
    trailName: "CFA Level I",
    trailProgress: 55,
    trailDaysLeft: 127,
    trailHoursPerDay: "2h",
    tasks: [
      { label: "Tópico: Fixed Income Basics", done: true },
      { label: "Quiz: Equity Valuation", done: false },
      { label: "Revisão: Ethics", done: false },
    ],
    stats: [
      { label: "Horas", value: "10h 15m" },
      { label: "Sequência", value: "18 dias" },
      { label: "Cobertura", value: "55%" },
    ],
    subtitle: "Certificação",
  },
  faculdade: {
    trailName: "Engenharia 3º Período",
    trailProgress: 38,
    trailDaysLeft: 45,
    trailHoursPerDay: "1h",
    tasks: [
      { label: "Cálculo: Derivadas Parciais", done: true },
      { label: "Exercícios: Física II", done: false },
      { label: "Revisão: Álgebra Linear", done: false },
    ],
    stats: [
      { label: "Horas", value: "6h 45m" },
      { label: "Sequência", value: "7 dias" },
      { label: "Cobertura", value: "38%" },
    ],
    subtitle: "Faculdade",
  },
};

export function ProductSection() {
  const [searchParams] = useSearchParams();

  const currentProfile = useMemo((): ProfileKey => {
    const urlProfile = searchParams.get("perfil");
    if (isValidProfile(urlProfile)) return urlProfile;
    return getStoredProfile();
  }, [searchParams]);

  const preview = profilePreviews[currentProfile];

  const scrollToAuth = () => {
    const el = document.getElementById("auth-card");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      const emailInput = el.querySelector('input[type="email"]') as HTMLInputElement;
      emailInput?.focus();
    }, 150);
  };

  return (
    <SectionWrapper id="produto" variant="plain" tabIndex={-1}>
      <div className="text-center mb-8">
        <KickerBadge variant="primary" className="mb-3">
          <Eye className="h-3.5 w-3.5" />
          Prévia do produto
        </KickerBadge>
        <h2 className="display-h2 text-foreground">
          Veja seu <HeadlineHighlight variant="primary">plano em ação</HeadlineHighlight>
        </h2>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm">
          Prévia do painel para: <span className="font-bold text-foreground">{preview.subtitle}</span>.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Dashboard Preview - shown first on mobile */}
        <div className="order-1 lg:order-1">
          <div className="bg-card rounded-xl border-2 border-border shadow-xl p-4 sm:p-5 relative">
            {/* Decorative badge */}
            <div className="absolute -top-2.5 left-4">
              <span className="bg-gradient-to-r from-accent-warm to-accent-warm/80 text-accent-warm-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                Exemplo ilustrativo
              </span>
            </div>

            <div className="space-y-3 mt-2">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b-2">
                <div>
                  <p className="text-sm font-bold text-foreground">Olá, estudante.</p>
                  <p className="text-xs text-muted-foreground">Visão geral</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-primary-foreground">J</span>
                </div>
              </div>

              {/* Trail Card */}
              <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/5 to-accent/5 shadow-md">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-foreground truncate">{preview.trailName}</span>
                    <span className="text-[10px] font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full shrink-0">{preview.trailProgress}%</span>
                  </div>
                  <Progress value={preview.trailProgress} className="h-2" />
                  <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
                    {preview.trailDaysLeft} dias • {preview.trailHoursPerDay}/dia
                  </p>
                </CardContent>
              </Card>

              {/* Daily Tasks */}
              <Card className="shadow-md border-2">
                <CardContent className="p-3">
                  <p className="text-sm font-bold mb-2 text-foreground">Plano de hoje</p>
                  <div className="space-y-2">
                    {preview.tasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${task.done ? 'bg-success border-success' : 'border-muted-foreground/40'}`}>
                          {task.done && <span className="text-success-foreground text-[8px]">✓</span>}
                        </div>
                        <span className={`truncate font-medium ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {preview.stats.map((stat) => (
                  <div key={stat.label} className="text-center p-2 bg-muted/50 rounded-lg border-2 border-border">
                    <p className="text-base font-bold text-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="order-2 lg:order-2 flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-4 rounded-xl border-2 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-accent/15 transition-colors">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                <p className="text-xs text-accent-warm font-bold mt-1.5">{feature.why}</p>
              </div>
            ))}
          </div>
          
          {/* CTA */}
          <div className="mt-6 text-center">
            <Button 
              size="lg" 
              onClick={scrollToAuth} 
              className="w-full sm:w-auto text-base font-semibold min-h-[48px] bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl shadow-primary/25 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Começar grátis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
