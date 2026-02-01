import { Link } from "react-router-dom";
import { Database, Target, Settings, Lock, ArrowRight, Mail, HelpCircle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";

const SUPPORT_EMAIL = "support@studai.app";

const trustCards = [
  {
    icon: Database,
    title: "O que coletamos",
    description:
      "Dados de conta (como e-mail) e informações necessárias para você organizar seus estudos, como preferências e progresso nas trilhas.",
  },
  {
    icon: Target,
    title: "Como usamos",
    description:
      "Para manter sua conta funcionando, montar seu plano, registrar progresso e melhorar a experiência. Comunicações só quando necessário ou quando você optar.",
  },
  {
    icon: Settings,
    title: "Seus controles",
    description:
      "Você pode solicitar exportação ou exclusão de dados pelo suporte e ajustar preferências de notificação quando disponível.",
  },
  {
    icon: Lock,
    title: "Segurança",
    description:
      "Usamos criptografia em trânsito (HTTPS) e práticas de autenticação para proteger acesso. Segurança é um processo contínuo e evolui com o produto.",
  },
];

export function TrustSection() {
  return (
    <SectionWrapper id="privacidade-controle" variant="tint" tabIndex={-1}>
      <div className="text-center mb-8">
        <KickerBadge variant="primary" className="mb-4">
          <Shield className="h-3.5 w-3.5" />
          Transparência
        </KickerBadge>
        <h2 className="display-h2 text-foreground">
          Privacidade e <HeadlineHighlight variant="primary">controle</HeadlineHighlight>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Seus dados continuam sob seu controle. Veja como tratamos e protegemos suas informações.
        </p>
      </div>

      {/* Quick summary */}
      <div className="max-w-2xl mx-auto mb-8">
        <Card className="border-2 border-primary/30 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-accent-warm/20 flex items-center justify-center shadow-sm">
                <span className="text-accent-warm text-xs font-bold">30s</span>
              </span>
              Resumo em 30 segundos
            </h3>
            <ul className="space-y-3 text-sm text-foreground">
              <li className="flex items-start gap-3">
                <span className="text-success mt-0.5 font-bold">•</span>
                <span className="font-medium">Usamos seus dados para operar sua conta e registrar seu progresso.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success mt-0.5 font-bold">•</span>
                <span className="font-medium">Não vendemos dados pessoais.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success mt-0.5 font-bold">•</span>
                <span className="font-medium">Você pode solicitar exportação ou exclusão pelo suporte.</span>
              </li>
            </ul>

            {/* Quick questions */}
            <div className="mt-5 pt-4 border-t-2">
              <h4 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" />
                Perguntas rápidas
              </h4>
              <div className="flex flex-wrap gap-3 text-xs">
                <a
                  href="#faq"
                  className="text-primary font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Como solicitar exclusão?
                </a>
                <Link
                  to="/seguranca"
                  className="text-primary font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Como reportar vulnerabilidade?
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trust cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {trustCards.map((card) => (
          <Card key={card.title} className="bg-card border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 group">
            <CardHeader className="pb-2">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-accent/15 transition-colors shadow-sm">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base font-bold">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Links */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Link
          to="/privacidade"
          className="inline-flex items-center gap-1.5 text-sm text-primary font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        >
          Política de Privacidade
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          to="/seguranca"
          className="inline-flex items-center gap-1.5 text-sm text-primary font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        >
          Segurança
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          to="/termos"
          className="inline-flex items-center gap-1.5 text-sm text-primary font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        >
          Termos de Uso
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="inline-flex items-center gap-1.5 text-sm text-primary font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        >
          Falar com o suporte
          <Mail className="h-3.5 w-3.5" />
        </a>
      </div>
    </SectionWrapper>
  );
}
