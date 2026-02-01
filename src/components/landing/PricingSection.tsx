import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Clock, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ProfileKey, isValidProfile, getStoredProfile } from "./LandingHero";

const SUPPORT_EMAIL = "support@studai.app";

function profileLabel(p: ProfileKey): string {
  if (p === "certificacao") return "Certificação";
  if (p === "faculdade") return "Faculdade";
  return "Concurso";
}

const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    tagline: "Para organizar e manter consistência",
    description: "Comece com o essencial. Sem cartão e sem compromisso.",
    features: [
      "1 trilha ativa",
      "Plano do dia com tarefas claras",
      "Revisões e prática",
      "Progresso semanal",
      "Suporte por e-mail",
    ],
    cta: "Começar agora",
    highlighted: true,
    status: "available" as const,
  },
  {
    name: "Pro",
    price: "Em breve",
    tagline: "Para quem quer mais controle e profundidade",
    description: "Entre na lista de espera e receba novidades quando estiver disponível.",
    features: [
      "Trilhas ilimitadas",
      "Relatórios avançados",
      "Sessões de estudo assistidas",
      "Prioridade no suporte",
      "Exportação de dados",
    ],
    cta: "Entrar na lista de espera",
    highlighted: false,
    status: "waitlist" as const,
  },
];

export function PricingSection() {
  const [searchParams] = useSearchParams();

  const profile = useMemo((): ProfileKey => {
    const urlProfile = searchParams.get("perfil");
    if (isValidProfile(urlProfile)) return urlProfile;
    return getStoredProfile();
  }, [searchParams]);

  const scrollToAuth = () => {
    const el = document.getElementById("auth-card");
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    window.requestAnimationFrame(() => {
      setTimeout(() => {
        const emailInput = el.querySelector('input[type="email"]') as HTMLInputElement | null;
        emailInput?.focus();
      }, 150);
    });
  };

  const joinWaitlist = () => {
    const label = profileLabel(profile);
    const subject = encodeURIComponent(`Lista de espera StudAI Pro (${label})`);
    const body = encodeURIComponent(
      `Olá, gostaria de entrar na lista de espera do StudAI Pro.\n\nPerfil: ${label}\nE-mail: \n\nObrigado.`
    );

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="planos" className="py-12 md:py-16 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Planos simples e claros
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Comece no Grátis. Entre na lista do Pro para receber novidades.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.highlighted
                  ? "border-primary shadow-lg"
                  : "border-border"
              }`}
            >
              {plan.status === "waitlist" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-muted text-muted-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Em breve
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.tagline}</p>

                <div className="pt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.status === "available" && (
                    <p className="text-xs text-muted-foreground mt-1">Grátis para sempre</p>
                  )}
                </div>
                <CardDescription className="pt-2">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      {plan.status === "waitlist" ? (
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={plan.status === "available" ? scrollToAuth : joinWaitlist}
                >
                  {plan.status === "waitlist" && <Mail className="mr-2 h-4 w-4" />}
                  {plan.cta}
                </Button>

                {plan.status === "waitlist" && (
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Sem spam. Você recebe apenas atualizações sobre disponibilidade.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust notice */}
        <div className="mt-8 text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <AlertCircle className="h-4 w-4" />
            <span>Você pode solicitar a exclusão da sua conta a qualquer momento pelo suporte.</span>
          </div>

          <p className="text-xs text-muted-foreground">
            <Mail className="h-3 w-3 inline mr-1" />
            Dúvidas sobre planos? Fale com{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
