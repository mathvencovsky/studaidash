import { Link } from "react-router-dom";
import { Database, Target, Settings, Lock, ArrowRight, Mail, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <section id="privacidade-controle" className="py-20 bg-muted/30" tabIndex={-1}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Privacidade e controle
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Seus dados continuam sob seu controle. Veja como tratamos e protegemos suas informações.
          </p>
        </div>

        {/* Quick summary */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Resumo em 30 segundos
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Usamos seus dados para operar sua conta e registrar seu progresso.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Não vendemos dados pessoais.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Você pode solicitar exportação ou exclusão pelo suporte.
              </li>
            </ul>

            {/* Quick questions */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                Perguntas rápidas
              </h4>
              <div className="flex flex-wrap gap-3 text-xs">
                <a
                  href="#faq"
                  className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Como solicitar exclusão?
                </a>
                <Link
                  to="/seguranca"
                  className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Como reportar vulnerabilidade?
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Trust cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustCards.map((card) => (
            <Card key={card.title} className="bg-card">
              <CardHeader className="pb-2">
                <card.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-base">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link
            to="/privacidade"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Política de Privacidade
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            to="/seguranca"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Segurança
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            to="/termos"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Termos de Uso
            <ArrowRight className="h-3 w-3" />
          </Link>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Falar com o suporte
            <Mail className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
