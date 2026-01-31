import { Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "para sempre",
    description: "Para começar a organizar seus estudos",
    features: [
      "1 trilha ativa",
      "Plano diário personalizado",
      "Quizzes e revisões",
      "Métricas de progresso",
      "Suporte por e-mail",
    ],
    cta: "Começar grátis",
    highlighted: false,
    available: true,
  },
  {
    name: "Pro",
    price: "Em breve",
    period: "",
    description: "Para quem quer ir além",
    features: [
      "Trilhas ilimitadas",
      "Relatórios avançados",
      "Sessões de estudo com IA",
      "Prioridade no suporte",
      "Exportação de dados",
    ],
    cta: "Avise-me quando disponível",
    highlighted: true,
    available: false,
  },
];

export function PricingSection() {
  const scrollToAuth = () => {
    const authCard = document.querySelector("#auth-card");
    if (authCard) {
      authCard.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const emailInput = authCard.querySelector('input[type="email"]') as HTMLInputElement;
        emailInput?.focus();
      }, 500);
    }
  };

  return (
    <section id="planos" className="py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Planos simples e transparentes
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Comece grátis. Faça upgrade quando precisar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.highlighted
                  ? "border-primary shadow-lg"
                  : "border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Em breve
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground text-sm">/{plan.period}</span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={plan.available ? scrollToAuth : undefined}
                  disabled={!plan.available}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No tricks notice */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <AlertCircle className="h-4 w-4" />
            <span>Sem pegadinhas: você pode cancelar ou excluir sua conta a qualquer momento.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
