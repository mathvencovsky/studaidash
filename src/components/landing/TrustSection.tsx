import { Link } from "react-router-dom";
import { Database, Target, Settings, Lock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const trustCards = [
  {
    icon: Database,
    title: "O que coletamos",
    description: "E-mail para login, preferências de estudo e progresso nas trilhas. Não coletamos dados sensíveis além do necessário para o funcionamento da plataforma.",
  },
  {
    icon: Target,
    title: "Para que usamos",
    description: "Personalizar sua experiência de estudo, calcular métricas de progresso e enviar lembretes (se você optar). Nunca vendemos seus dados.",
  },
  {
    icon: Settings,
    title: "Como você controla",
    description: "Você pode exportar seus dados, excluir sua conta ou ajustar preferências de notificação a qualquer momento nas configurações.",
  },
  {
    icon: Lock,
    title: "Segurança",
    description: "Conexões criptografadas (HTTPS), autenticação segura e backups regulares. Trabalhamos continuamente para melhorar nossa segurança.",
  },
];

export function TrustSection() {
  return (
    <section id="privacidade-controle" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Privacidade e controle
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Seus dados são seus. Aqui está como tratamos eles.
          </p>
        </div>

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

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link 
            to="/privacidade" 
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Política de Privacidade
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link 
            to="/seguranca" 
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Segurança
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link 
            to="/termos" 
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Termos de Uso
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
