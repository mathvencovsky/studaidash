import { Link } from "react-router-dom";
import { Database, Target, Settings, Lock, ArrowRight, Mail, HelpCircle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";

const SUPPORT_EMAIL = "support@studai.app";

const trustCards = [
  {
    icon: Database,
    title: "O que coletamos",
    description: "Dados de conta e informações para organizar seus estudos, como preferências e progresso.",
  },
  {
    icon: Target,
    title: "Como usamos",
    description: "Para manter sua conta, montar seu plano e registrar progresso. Sem spam.",
  },
  {
    icon: Settings,
    title: "Seus controles",
    description: "Solicite exportação ou exclusão de dados pelo suporte a qualquer momento.",
  },
  {
    icon: Lock,
    title: "Segurança",
    description: "Criptografia em trânsito (HTTPS) e autenticação segura. Segurança é prioridade.",
  },
];

export function TrustSection() {
  return (
    <SectionWrapper id="privacidade-controle" variant="tint" tabIndex={-1}>
      <div className="text-center mb-6">
        <KickerBadge variant="primary" className="mb-2">
          <Shield className="h-3.5 w-3.5" />
          Transparência
        </KickerBadge>
        <h2 className="display-h2 text-foreground">
          Privacidade e <HeadlineHighlight variant="primary">controle</HeadlineHighlight>
        </h2>
        <p className="mt-2 text-muted-foreground max-w-lg mx-auto text-sm">
          Seus dados continuam sob seu controle.
        </p>
      </div>

      {/* Quick summary */}
      <div className="max-w-xl mx-auto mb-6">
        <Card className="border-2 border-primary/30 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <CardContent className="p-4 sm:p-5">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-warm/20 flex items-center justify-center">
                <span className="text-accent-warm text-[10px] font-bold">30s</span>
              </span>
              Resumo em 30 segundos
            </h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5 font-bold">•</span>
                <span className="font-medium">Usamos seus dados para operar a conta e registrar progresso.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5 font-bold">•</span>
                <span className="font-medium">Não vendemos dados pessoais.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5 font-bold">•</span>
                <span className="font-medium">Você pode solicitar exportação ou exclusão pelo suporte.</span>
              </li>
            </ul>

            {/* Quick questions */}
            <div className="mt-4 pt-3 border-t-2">
              <h4 className="text-[10px] font-bold text-muted-foreground mb-2 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                Perguntas rápidas
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                <a
                  href="#faq"
                  className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded min-h-[32px] flex items-center"
                >
                  Como solicitar exclusão?
                </a>
                <Link
                  to="/seguranca"
                  className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded min-h-[32px] flex items-center"
                >
                  Como reportar vulnerabilidade?
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trust cards - 1 col mobile, 2 col tablet, 4 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {trustCards.map((card) => (
          <Card key={card.title} className="bg-card border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-lg group">
            <CardHeader className="pb-2 p-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-accent/15 transition-colors">
                <card.icon className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-sm font-bold">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Links - wrap on mobile */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6">
        <Link
          to="/privacidade"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded min-h-[40px] px-2"
        >
          Política de Privacidade
          <ArrowRight className="h-3 w-3" />
        </Link>
        <Link
          to="/seguranca"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded min-h-[40px] px-2"
        >
          Segurança
          <ArrowRight className="h-3 w-3" />
        </Link>
        <Link
          to="/termos"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded min-h-[40px] px-2"
        >
          Termos de Uso
          <ArrowRight className="h-3 w-3" />
        </Link>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded min-h-[40px] px-2"
        >
          Falar com o suporte
          <Mail className="h-3 w-3" />
        </a>
      </div>
    </SectionWrapper>
  );
}
