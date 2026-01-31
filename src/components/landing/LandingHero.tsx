import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "./AuthCard";

const benefits = [
  "Planos de estudo adaptativos baseados no seu ritmo",
  "Quizzes e simulados para fixar conteúdo",
  "Acompanhamento de progresso em tempo real",
];

export function LandingHero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
              Estude com consistência.
              <br />
              <span className="text-primary">Alcance seus objetivos.</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Organize seus estudos para concursos e certificações com trilhas personalizadas, 
              revisões inteligentes e métricas que mostram sua evolução real.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-8">
              <Button 
                size="lg" 
                onClick={() => scrollToSection("#auth-card")}
                className="text-base"
              >
                Começar grátis
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => scrollToSection("#como-funciona")}
                className="text-base"
              >
                Ver como funciona
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Sem cartão de crédito
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Configuração em 2 minutos
              </span>
            </div>

            <ul className="mt-8 space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3 text-left">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Auth Card */}
          <div className="flex justify-center lg:justify-end">
            <AuthCard />
          </div>
        </div>
      </div>
    </section>
  );
}
