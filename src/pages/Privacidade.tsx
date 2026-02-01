import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacidade() {
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
          <h1 className="text-lg font-semibold text-foreground">Política de Privacidade</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Quick Summary */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              Resumo em 30 segundos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• <strong>O que coletamos:</strong> E-mail, preferências de estudo, progresso nas trilhas.</p>
            <p>• <strong>Para que usamos:</strong> Personalizar sua experiência e enviar lembretes (se você permitir).</p>
            <p>• <strong>Nunca fazemos:</strong> Vendemos seus dados ou compartilhamos com terceiros para marketing.</p>
            <p>• <strong>Você controla:</strong> Pode exportar, corrigir ou excluir seus dados a qualquer momento.</p>
          </CardContent>
        </Card>

        {/* Full Policy */}
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground text-sm mb-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Quem somos</h2>
            <p className="text-muted-foreground">
              O StudAI é uma plataforma de organização de estudos. Esta política explica como coletamos, usamos e protegemos suas informações.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Dados que coletamos</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-medium text-foreground">Dados de cadastro</h3>
                <p>E-mail e senha (criptografada) para autenticação.</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Dados de uso</h3>
                <p>Progresso nas trilhas, resultados de quizzes, preferências de estudo, metas e configurações.</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Dados técnicos</h3>
                <p>Informações do dispositivo e navegador para garantir funcionamento adequado.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Como usamos seus dados</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Personalizar sua experiência de estudo</li>
              <li>Calcular métricas de progresso e revisões</li>
              <li>Enviar lembretes e notificações (se você optar)</li>
              <li>Melhorar a plataforma com base em uso agregado (não identificável)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Compartilhamento de dados</h2>
            <p className="text-muted-foreground">
              <strong>Não vendemos seus dados.</strong> Podemos compartilhar apenas com:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2 mt-2">
              <li>Provedores de infraestrutura (hospedagem, banco de dados) necessários para operar o serviço</li>
              <li>Autoridades legais, quando exigido por lei</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Seus direitos (LGPD)</h2>
            <p className="text-muted-foreground mb-2">
              Você tem direito a:
            </p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li><strong>Acesso:</strong> Saber quais dados temos sobre você</li>
              <li><strong>Correção:</strong> Corrigir dados incorretos</li>
              <li><strong>Exclusão:</strong> Solicitar a exclusão da sua conta e dados</li>
              <li><strong>Portabilidade:</strong> Exportar seus dados</li>
              <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Para exercer esses direitos, acesse as Configurações da sua conta ou entre em contato pelo e-mail abaixo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Retenção de dados</h2>
            <p className="text-muted-foreground">
              Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão da conta, os dados são removidos em até 30 dias, exceto quando a lei exigir retenção por período maior.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Cookies</h2>
            <p className="text-muted-foreground">
              Usamos cookies essenciais para autenticação e funcionamento da plataforma. Não usamos cookies de rastreamento para publicidade.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Alterações nesta política</h2>
            <p className="text-muted-foreground">
              Podemos atualizar esta política periodicamente. Alterações significativas serão comunicadas por e-mail ou aviso na plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Contato</h2>
            <p className="text-muted-foreground">
              Dúvidas sobre privacidade? Entre em contato:
            </p>
            <p className="text-foreground mt-2">
              <strong>E-mail:</strong>{" "}
              <a href="mailto:support@studai.app" className="text-primary hover:underline">
                support@studai.app
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
