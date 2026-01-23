import { Progress } from "@/components/ui/progress";

const roiMetrics = [
  { label: "Tempo investido", value: "185h", sublabel: "desde o início" },
  { label: "Eficiência", value: "87%", sublabel: "acima da média" },
  { label: "ROI estimado", value: "R$ 45k", sublabel: "potencial salarial" },
  { label: "Velocidade", value: "1.3x", sublabel: "vs. planejado" },
];

const moduleEfficiency = [
  { module: "Time Value of Money", efficiency: 94, hoursSpent: 12, expected: 14 },
  { module: "Probability Concepts", efficiency: 78, hoursSpent: 18, expected: 16 },
  { module: "Organizing Data", efficiency: 88, hoursSpent: 8, expected: 10 },
  { module: "Common Distributions", efficiency: 65, hoursSpent: 6, expected: 8 },
];

export default function ROIEstudo() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">Métricas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Retorno sobre tempo investido.
        </p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {roiMetrics.map((metric) => (
          <section key={metric.label} className="border rounded-lg bg-card p-4">
            <p className="text-xl font-semibold text-foreground">{metric.value}</p>
            <p className="text-xs text-muted-foreground">{metric.sublabel}</p>
          </section>
        ))}
      </div>

      {/* Module Efficiency */}
      <section className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium text-foreground">Eficiência por módulo</h2>
        </div>
        <div className="divide-y">
          {moduleEfficiency.map((item) => (
            <div key={item.module} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">{item.module}</span>
                <span className="text-sm font-medium text-foreground">{item.efficiency}%</span>
              </div>
              <Progress value={item.efficiency} className="h-1 mb-2" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{item.hoursSpent}h gastas</span>
                <span>·</span>
                <span>{item.expected}h esperadas</span>
                <span>·</span>
                <span className={item.hoursSpent <= item.expected ? "text-foreground" : ""}>
                  {item.hoursSpent <= item.expected 
                    ? `${item.expected - item.hoursSpent}h economizadas` 
                    : `${item.hoursSpent - item.expected}h extras`
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Insight */}
      <section className="border rounded-lg bg-card p-4">
        <p className="text-xs text-muted-foreground mb-1">Observação</p>
        <p className="text-sm text-foreground">
          Eficiência 23% acima da média de usuários com objetivos similares.
        </p>
      </section>
    </div>
  );
}
