import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Clock, AlertCircle, Mail, CreditCard, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ProfileKey, isValidProfile, getStoredProfile } from "./LandingHero";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";

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
    description: "Comece com o essencial. Sem cartão.",
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
    tagline: "Mais controle e profundidade",
    description: "Entre na lista de espera para novidades.",
    features: [
      "Trilhas ilimitadas",
      "Relatórios avançados",
      "Sessões assistidas",
      "Prioridade no suporte",
      "Exportação de dados",
    ],
    cta: "Entrar na lista",
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
    <SectionWrapper id="planos" variant="plain">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <KickerBadge variant="warm" className="mb-3">
            <CreditCard className="h-3.5 w-3.5" />
            Planos
          </KickerBadge>
          <h2 className="display-h2 text-foreground">
            Planos <HeadlineHighlight>simples e claros</HeadlineHighlight>
          </h2>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto text-sm">
            Comece no Grátis. Entre na lista do Pro para receber novidades.
          </p>
        </div>

        {/* Plans grid - 1 col mobile, 2 col tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                plan.highlighted
                  ? "border-primary shadow-xl bg-gradient-to-br from-card via-card to-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-accent-warm to-accent-warm/80 text-accent-warm-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Recomendado
                  </span>
                </div>
              )}

              {plan.status === "waitlist" && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="bg-muted text-muted-foreground text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border-2">
                    <Clock className="h-3 w-3" />
                    Em breve
                  </span>
                </div>
              )}

              <CardHeader className="pt-6 pb-2 px-4">
                <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                <p className="text-xs text-muted-foreground font-semibold">{plan.tagline}</p>

                <div className="pt-2">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  {plan.status === "available" && (
                    <p className="text-[10px] text-success font-bold mt-1">Grátis para sempre</p>
                  )}
                </div>
                <CardDescription className="pt-1 text-xs font-medium">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="px-4 pb-4">
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs">
                      {plan.status === "waitlist" ? (
                        <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <Check className="h-3.5 w-3.5 text-success shrink-0" />
                      )}
                      <span className="text-foreground font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full font-semibold min-h-[44px] ${plan.highlighted ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg' : ''}`}
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={plan.status === "available" ? scrollToAuth : joinWaitlist}
                >
                  {plan.status === "waitlist" && <Mail className="mr-1.5 h-3.5 w-3.5" />}
                  {plan.cta}
                </Button>

                {plan.status === "waitlist" && (
                  <p className="text-[10px] text-muted-foreground text-center mt-2 font-medium">
                    Sem spam. Apenas atualizações.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust notice */}
        <div className="mt-6 text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs text-foreground bg-muted/60 px-4 py-2.5 rounded-full border-2 font-medium">
            <AlertCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>Exclusão de conta disponível a qualquer momento.</span>
          </div>

          <p className="text-[10px] text-muted-foreground font-medium">
            Dúvidas?{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary font-bold hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
