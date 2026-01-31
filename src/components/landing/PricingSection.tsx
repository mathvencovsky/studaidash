import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    description: "Para começar a organizar seus estudos",
    features: [
      "1 trilha ativa",
      "Plano diário básico",
      "Quizzes limitados",
      "Estatísticas essenciais",
    ],
    cta: "Começar grátis",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$ 29",
    period: "/mês",
    description: "Para quem leva os estudos a sério",
    features: [
      "Trilhas ilimitadas",
      "Planos adaptativos completos",
      "Quizzes e simulados ilimitados",
      "Métricas avançadas",
      "Revisões inteligentes",
      "Suporte prioritário",
    ],
    cta: "Começar teste grátis",
    highlighted: true,
  },
];

export function PricingSection() {
  const scrollToAuth = () => {
    const authCard = document.querySelector("#auth-card");
    if (authCard) {
      authCard.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="planos" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Planos simples e transparentes
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano que faz sentido para você. Sem surpresas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative ${plan.highlighted ? 'border-primary shadow-lg' : ''}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Mais popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
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
                  onClick={scrollToAuth}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
