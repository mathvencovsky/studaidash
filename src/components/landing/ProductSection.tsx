import { 
  Map, 
  BarChart3, 
  Brain, 
  Target, 
  Calendar, 
  RefreshCw 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const features = [
  {
    icon: Map,
    title: "Trilhas personalizadas",
    description: "Monte seu roteiro de estudos com base no seu objetivo e prazo.",
    why: "Você nunca fica perdido sobre o que estudar.",
  },
  {
    icon: Brain,
    title: "Sessões de estudo guiadas",
    description: "Estude com foco usando sessões estruturadas e temporizadas.",
    why: "Menos procrastinação, mais execução.",
  },
  {
    icon: RefreshCw,
    title: "Revisões no tempo certo",
    description: "Sistema de repetição espaçada para fixar o conteúdo.",
    why: "Você retém mais, estudando menos.",
  },
  {
    icon: BarChart3,
    title: "Métricas de progresso",
    description: "Acompanhe sua evolução com dados claros e acionáveis.",
    why: "Você vê exatamente onde está e para onde vai.",
  },
  {
    icon: Target,
    title: "Metas diárias",
    description: "Planos diários que se adaptam ao seu ritmo e disponibilidade.",
    why: "Você sempre sabe o que fazer hoje.",
  },
  {
    icon: Calendar,
    title: "Calendário integrado",
    description: "Visualize sua rotina e mantenha a consistência.",
    why: "Você não perde prazos nem sessões.",
  },
];

export function ProductSection() {
  return (
    <section id="produto" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            O que o StudAI faz por você
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma para organizar, executar e acompanhar seus estudos. Tudo em um só lugar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Mock Dashboard Preview */}
          <div className="bg-card rounded-xl border shadow-lg p-6 order-2 lg:order-1">
            <div className="space-y-4">
              {/* Mock Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <p className="text-sm text-muted-foreground">Olá, estudante.</p>
                  <p className="text-xs text-muted-foreground">Visão geral do progresso</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">J</span>
                </div>
              </div>

              {/* Mock Trail Card */}
              <Card className="border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">CFA Level I</span>
                    <span className="text-xs text-muted-foreground">45% concluído</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    127 dias restantes • 2.1h/dia necessárias
                  </p>
                </CardContent>
              </Card>

              {/* Mock Daily Tasks */}
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-3">Plano de hoje</p>
                  <div className="space-y-2">
                    {["Ler: Ética e Padrões", "Quiz: Fixed Income", "Revisão: Derivatives"].map((task, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded border ${i === 0 ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`} />
                        <span className={i === 0 ? 'line-through text-muted-foreground' : ''}>{task}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mock Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Nível", value: "12" },
                  { label: "XP Total", value: "5,840" },
                  { label: "Sequência", value: "14 dias" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4 order-1 lg:order-2">
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
        </div>
      </div>
    </section>
  );
}
