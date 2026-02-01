import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <section className="py-10 md:py-12 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-primary/20 bg-card">
          <CardContent className="py-8 px-6 sm:px-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Pronto para organizar seus estudos?
            </h2>
            <p className="text-muted-foreground mb-5 max-w-md mx-auto">
              Crie sua conta gratuita e veja seu primeiro plano do dia em poucos minutos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button 
                size="lg" 
                onClick={scrollToAuth}
                className="text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Começar grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              >
                <Mail className="h-4 w-4" />
                Falar com o suporte
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
