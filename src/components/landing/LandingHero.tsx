import { CheckCircle2, ArrowRight, Shield, Eye, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "./AuthCard";

const beforeAfter = {
  before: [
    "Estudo sem constância",
    "Sem clareza do que revisar",
    "Progresso invisível",
  ],
  after: [
    "Rotina guiada por dia",
    "Revisão no tempo certo",
    "Evolução visível por semana",
  ],
};

const trustItems = [
  {
    icon: Shield,
    text: "Seus dados sob seu controle",
  },
  {
    icon: Eye,
    text: "Transparência de planos",
  },
  {
    icon: Headphones,
    text: "Suporte por e-mail",
  },
];

export function LandingHero() {
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    window.requestAnimationFrame(() => {
      setTimeout(() => el.focus?.(), 150);
    });
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Estude com constância.
              <br />
              <span className="text-primary">Veja seu progresso real.</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Plataforma de estudos para quem precisa de rotina organizada, revisões no tempo certo e métricas claras de evolução — seja para concursos, certificações ou transições de carreira.
            </p>

            {/* Before → After Block */}
            <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Antes</p>
                {beforeAfter.before.map((item, index) => (
                  <p key={index} className="text-sm text-muted-foreground/70 line-through">
                    {item}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-primary uppercase tracking-wide">Depois</p>
                {beforeAfter.after.map((item, index) => (
                  <p key={index} className="text-sm text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-8">
              <Button 
                size="lg" 
                onClick={() => scrollToId("auth-card")}
                className="text-base"
              >
                Começar grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => scrollToId("como-funciona")}
                className="text-base"
              >
                Ver como funciona
              </Button>
            </div>

            {/* Trust Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mt-6">
              {trustItems.map((item, index) => (
                <span key={index} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <item.icon className="h-4 w-4 text-primary/70" />
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Auth Card */}
          <div className="flex justify-center lg:justify-end">
            <div id="auth-card" tabIndex={-1} className="outline-none">
              <AuthCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
