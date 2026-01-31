import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Contato() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Contato</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Como podemos ajudar?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Estamos aqui para responder suas dúvidas, ouvir sugestões ou resolver problemas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Email Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                E-mail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Para dúvidas gerais, suporte técnico ou feedback.
              </p>
              {/* TODO: Substituir por e-mail real */}
              <p className="text-foreground font-medium">contato@studai.com.br</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Clock className="h-3 w-3" />
                <span>Resposta em até 48 horas úteis</span>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Para reportar vulnerabilidades ou problemas de segurança.
              </p>
              {/* TODO: Substituir por e-mail real */}
              <p className="text-foreground font-medium">security@studai.com.br</p>
              <Link 
                to="/seguranca" 
                className="text-xs text-primary hover:underline mt-2 inline-block"
              >
                Ver política de divulgação responsável
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-muted/50 rounded-lg p-6 max-w-xl mx-auto">
            <h3 className="font-medium text-foreground mb-2">Antes de entrar em contato</h3>
            <p className="text-sm text-muted-foreground">
              Confira nossa{" "}
              <Link to="/#faq" className="text-primary hover:underline">
                seção de perguntas frequentes
              </Link>{" "}
              — talvez sua dúvida já tenha sido respondida.
            </p>
          </div>
        </div>

        {/* Company Info Placeholder */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          {/* TODO: Adicionar informações da empresa quando disponíveis */}
          <p>StudAI</p>
          <p>Brasil</p>
          {/* <p>CNPJ: XX.XXX.XXX/0001-XX</p> */}
        </div>
      </main>
    </div>
  );
}
