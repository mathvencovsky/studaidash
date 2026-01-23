import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Target, DollarSign, Brain, Zap } from "lucide-react";

const roiMetrics = [
  {
    label: "Tempo Investido",
    value: "185h",
    subtext: "desde o início",
    icon: Clock,
    trend: "+12h esta semana",
  },
  {
    label: "Eficiência de Estudo",
    value: "87%",
    subtext: "acima da média",
    icon: Brain,
    trend: "+5% vs. mês passado",
  },
  {
    label: "ROI Estimado",
    value: "R$ 45k",
    subtext: "potencial salarial",
    icon: DollarSign,
    trend: "após certificação",
  },
  {
    label: "Velocidade",
    value: "1.3x",
    subtext: "vs. ritmo planejado",
    icon: Zap,
    trend: "Adiantado 2 semanas",
  },
];

const moduleEfficiency = [
  { module: "Time Value of Money", efficiency: 94, hoursSpent: 12, expected: 14 },
  { module: "Probability Concepts", efficiency: 78, hoursSpent: 18, expected: 16 },
  { module: "Organizing Data", efficiency: 88, hoursSpent: 8, expected: 10 },
  { module: "Common Distributions", efficiency: 65, hoursSpent: 6, expected: 8 },
];

export default function ROIEstudo() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground">
          ROI de Estudo
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Análise do retorno sobre seu investimento de tempo
        </p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {roiMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <metric.icon size={16} className="text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.subtext}</p>
              <Badge variant="secondary" className="text-xs mt-2">
                <TrendingUp size={10} className="mr-1" />
                {metric.trend}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Module Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target size={18} className="text-primary" />
            Eficiência por Módulo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {moduleEfficiency.map((item) => (
            <div key={item.module} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.module}</span>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={item.efficiency >= 80 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {item.efficiency}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{item.hoursSpent}h gastas</span>
                <span>•</span>
                <span>{item.expected}h esperadas</span>
                <span>•</span>
                <span className={item.hoursSpent <= item.expected ? "text-green-600" : "text-amber-600"}>
                  {item.hoursSpent <= item.expected 
                    ? `${item.expected - item.hoursSpent}h economizadas` 
                    : `${item.hoursSpent - item.expected}h extras`
                  }
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insight Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Brain size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Insight da IA</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Seu ROI está 23% acima da média de usuários com objetivos similares. 
                Continue focando em Probability Concepts para maximizar sua eficiência 
                antes do exame.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
