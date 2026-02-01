import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Map, 
  BarChart3, 
  Brain, 
  Target, 
  Calendar, 
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { type ProfileKey, isValidProfile, getStoredProfile } from "./LandingHero";

const features = [
  {
    icon: Map,
    title: "Trilha por objetivo",
    description: "Você informa a meta e o prazo. O sistema organiza os tópicos em ordem e distribui ao longo dos dias.",
    why: "Clareza sobre o que estudar a cada dia.",
  },
  {
    icon: Brain,
    title: "Sessões de estudo guiadas",
    description: "Conteúdo estruturado por etapas com leitura, exemplos e exercícios. Você avança no seu ritmo.",
    why: "Foco em execução, menos dispersão.",
  },
  {
    icon: RefreshCw,
    title: "Revisões programadas",
    description: "O sistema agenda revisões automáticas com base no tempo desde o último estudo.",
    why: "Ajuda a fixar o conteúdo ao longo do tempo.",
  },
  {
    icon: BarChart3,
    title: "Progresso semanal",
    description: "Métricas de horas estudadas, tarefas concluídas e cobertura de tópicos por semana.",
    why: "Visibilidade real da sua evolução.",
  },
  {
    icon: Target,
    title: "Plano do dia",
    description: "Lista de tarefas diárias gerada a partir da sua disponibilidade e do ritmo necessário.",
    why: "Você sabe exatamente o que fazer hoje.",
  },
  {
    icon: Calendar,
    title: "Calendário de estudos",
    description: "Visualize sessões passadas e futuras. Acompanhe sua constância ao longo das semanas.",
    why: "Controle sobre sua rotina.",
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
      { label: "Horas na semana", value: "8h 30min" },
      { label: "Sequência", value: "12 dias" },
      { label: "Cobertura", value: "42%" },
    ],
    subtitle: "Uma prévia do painel para quem estuda para concursos.",
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
      { label: "Horas na semana", value: "10h 15min" },
      { label: "Sequência", value: "18 dias" },
      { label: "Cobertura", value: "55%" },
    ],
    subtitle: "Uma prévia do painel para quem estuda para certificações.",
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
      { label: "Horas na semana", value: "6h 45min" },
      { label: "Sequência", value: "7 dias" },
      { label: "Cobertura", value: "38%" },
    ],
    subtitle: "Uma prévia do painel para quem organiza disciplinas da faculdade.",
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
    <section id="produto" className="py-20 bg-background" tabIndex={-1}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Veja seu plano em ação
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Prévia do painel para: <span className="font-medium text-foreground">{currentProfile === "concurso" ? "Concurso" : currentProfile === "certificacao" ? "Certificação" : "Faculdade"}</span>.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Dashboard Preview */}
          <div className="order-2 lg:order-1">
            <div className="bg-card rounded-xl border shadow-lg p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="text-sm text-muted-foreground">Olá, estudante.</p>
                    <p className="text-xs text-muted-foreground">Visão geral do progresso</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">J</span>
                  </div>
                </div>

                {/* Trail Card */}
                <Card className="border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">{preview.trailName}</span>
                      <span className="text-xs text-muted-foreground">{preview.trailProgress}% concluído</span>
                    </div>
                    <Progress value={preview.trailProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {preview.trailDaysLeft} dias restantes • {preview.trailHoursPerDay}/dia necessárias
                    </p>
                  </CardContent>
                </Card>

                {/* Daily Tasks */}
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium mb-3">Plano de hoje</p>
                    <div className="space-y-2">
                      {preview.tasks.map((task, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className={`w-4 h-4 rounded border ${task.done ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`} />
                          <span className={task.done ? 'line-through text-muted-foreground' : ''}>{task.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {preview.stats.map((stat) => (
                    <div key={stat.label} className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">Exemplo ilustrativo.</p>
          </div>

          {/* Features Grid */}
          <div className="order-1 lg:order-2 flex flex-col">
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                >
                  <feature.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <p className="text-xs text-primary/80 mt-2 font-medium">{feature.why}</p>
                </div>
              ))}
            </div>
            
            {/* CTA */}
            <div className="mt-8 text-center">
              <Button size="lg" onClick={scrollToAuth} className="text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Começar grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
