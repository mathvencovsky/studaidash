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
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/8 via-card to-accent-warm/8 shadow-xl overflow-hidden relative">
          {/* Decorative elements - hidden on mobile for performance */}
          <div className="hidden sm:block absolute top-0 right-0 w-32 h-32 bg-accent-warm/10 rounded-full blur-2xl pointer-events-none" />
          <div className="hidden sm:block absolute bottom-0 left-0 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          
          <CardContent className="py-8 sm:py-10 px-5 sm:px-8 text-center relative">
            <div className="inline-flex items-center gap-1.5 bg-accent-warm/15 text-accent-warm px-3 py-1.5 rounded-full text-xs font-bold mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Comece agora
            </div>
            
            <h2 className="display-h2 text-foreground mb-3">
              Pronto para ter <HeadlineHighlight>clareza</HeadlineHighlight>?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base font-medium">
              Crie sua conta gratuita e veja seu primeiro plano do dia em minutos.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button 
                size="lg" 
                onClick={scrollToAuth}
                className="w-full text-base font-semibold min-h-[48px] bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl shadow-primary/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Começar grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-4 py-2.5 min-h-[44px] font-semibold"
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
