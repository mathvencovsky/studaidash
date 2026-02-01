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
    <SectionWrapper variant="plain" compact>
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent-warm/5 shadow-2xl overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent-warm/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <CardContent className="py-10 px-6 sm:px-10 text-center relative">
            <div className="inline-flex items-center gap-2 bg-accent-warm/10 text-accent-warm px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Comece agora
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Pronto para ter <HeadlineHighlight>clareza</HeadlineHighlight> nos estudos?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Crie sua conta gratuita e veja seu primeiro plano do dia em poucos minutos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button 
                size="lg" 
                onClick={scrollToAuth}
                className="text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Começar grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-3 py-2 font-medium"
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
