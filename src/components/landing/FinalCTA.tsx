import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionWrapper, HeadlineHighlight } from "./ui";

const SUPPORT_EMAIL = "support@studai.app";

export function FinalCTA() {
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
    <SectionWrapper variant="plain" compact withNoise>
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/8 via-card to-accent-warm/8 shadow-2xl overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent-warm/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          
          <CardContent className="py-12 px-6 sm:px-12 text-center relative">
            <div className="inline-flex items-center gap-2 bg-accent-warm/15 text-accent-warm px-4 py-2 rounded-full text-sm font-bold mb-5 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Comece agora
            </div>
            
            <h2 className="display-h2 text-foreground mb-4">
              Pronto para ter <HeadlineHighlight>clareza</HeadlineHighlight> nos estudos?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg font-medium">
              Crie sua conta gratuita e veja seu primeiro plano do dia em poucos minutos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={scrollToAuth}
                className="text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Começar grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-4 py-2.5 font-semibold"
              >
                <Mail className="h-4 w-4" />
                Falar com o suporte
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
