import { Link } from "react-router-dom";
import { ArrowLeft, Shield, AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Seguranca() {
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
          <h1 className="text-lg font-semibold text-foreground">Segurança</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Nosso compromisso com segurança</h2>
          <p className="text-muted-foreground">
            Levamos a segurança dos seus dados a sério. Esta página descreve nossas práticas de segurança e como você pode reportar vulnerabilidades.
          </p>
        </div>

        {/* Security Practices */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Proteção de dados
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Conexões criptografadas via HTTPS</p>
              <p>• Senhas armazenadas com hash seguro (nunca em texto plano)</p>
              <p>• Backups regulares em infraestrutura segura</p>
              <p>• Acesso restrito aos dados por funcionários</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Autenticação
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Autenticação segura via e-mail e senha</p>
              <p>• Confirmação de e-mail obrigatória</p>
              <p>• Sessões com expiração automática</p>
              <p>• Proteção contra ataques de força bruta</p>
            </CardContent>
          </Card>
        </div>

        {/* Responsible Disclosure */}
        <Card className="mb-12 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Divulgação Responsável (Responsible Disclosure)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Se você descobriu uma vulnerabilidade de segurança, queremos saber. Agradecemos pesquisadores de segurança que nos ajudam a manter a plataforma segura.
            </p>

            <div>
              <h3 className="font-medium text-foreground mb-2">Como reportar</h3>
              <div className="flex items-center gap-2 text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                {/* TODO: Substituir por e-mail real */}
                <span>security@studai.com.br</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Inclua detalhes suficientes para reproduzir o problema. Responderemos assim que possível.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">O que pedimos</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Não acesse dados de outros usuários</li>
                <li>Não destrua ou modifique dados</li>
                <li>Não realize ataques de negação de serviço (DoS)</li>
                <li>Não use engenharia social ou phishing</li>
                <li>Nos dê tempo razoável para corrigir antes de divulgar publicamente</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">O que oferecemos</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Confirmação de recebimento do relatório</li>
                <li>Comunicação sobre status da correção</li>
                <li>Crédito público (se desejar) após correção</li>
                <li>Não tomaremos ação legal contra pesquisadores que sigam estas diretrizes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Perguntas frequentes sobre segurança</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-1">Meus dados estão criptografados?</h3>
              <p className="text-sm text-muted-foreground">
                Sim. Todas as conexões usam HTTPS (criptografia em trânsito). Senhas são armazenadas com hash seguro.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-1">Vocês têm certificações de segurança?</h3>
              <p className="text-sm text-muted-foreground">
                Estamos em processo de implementação de práticas alinhadas com padrões de segurança. Atualizaremos esta página conforme avançarmos.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-1">O que acontece se houver um vazamento?</h3>
              <p className="text-sm text-muted-foreground">
                Caso ocorra um incidente de segurança, notificaremos usuários afetados por e-mail e tomaremos medidas para mitigar danos.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
