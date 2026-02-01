import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Termos() {
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
          <h1 className="text-lg font-semibold text-foreground">Termos de Uso</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-muted-foreground text-sm mb-6">
          Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </p>

        <div className="prose prose-sm max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Aceitação dos termos</h2>
            <p className="text-muted-foreground">
              Ao criar uma conta ou usar o StudAI, você concorda com estes Termos de Uso. Se não concordar, não use a plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">2. O que é o StudAI</h2>
            <p className="text-muted-foreground">
              O StudAI é uma plataforma de organização de estudos que oferece trilhas personalizadas, planos diários, quizzes, revisões e métricas de progresso. O serviço é oferecido "como está" e pode ser atualizado a qualquer momento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Sua conta</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Você é responsável por manter a segurança da sua senha</li>
              <li>Você é responsável por todas as atividades na sua conta</li>
              <li>Você deve fornecer informações verdadeiras no cadastro</li>
              <li>Você deve ter pelo menos 13 anos para usar o serviço</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Uso aceitável</h2>
            <p className="text-muted-foreground mb-2">Você concorda em NÃO:</p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Violar leis ou regulamentos aplicáveis</li>
              <li>Compartilhar conteúdo ilegal, ofensivo ou prejudicial</li>
              <li>Tentar acessar contas de outros usuários</li>
              <li>Usar automação, bots ou scripts sem autorização</li>
              <li>Sobrecarregar a infraestrutura do serviço</li>
              <li>Revender ou sublicenciar o acesso ao serviço</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Propriedade intelectual</h2>
            <p className="text-muted-foreground">
              O StudAI, incluindo código, design, textos e funcionalidades, é de nossa propriedade ou licenciado para nós. Você não pode copiar, modificar ou distribuir partes do serviço sem autorização.
            </p>
            <p className="text-muted-foreground mt-2">
              O conteúdo que você cria (notas, configurações, progresso) permanece seu. Você nos concede licença para armazenar e processar esse conteúdo para fornecer o serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Planos e pagamentos</h2>
            <p className="text-muted-foreground">
              O plano gratuito está disponível sem custo. Planos pagos (quando disponíveis) serão cobrados conforme descrito no momento da contratação. Você pode cancelar a qualquer momento sem multa.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Limitação de responsabilidade</h2>
            <p className="text-muted-foreground">
              O StudAI é uma ferramenta de organização de estudos. Não garantimos resultados específicos em provas, concursos ou certificações. O sucesso depende do seu esforço e outros fatores externos.
            </p>
            <p className="text-muted-foreground mt-2">
              Na máxima extensão permitida por lei, não nos responsabilizamos por danos indiretos, incidentais ou consequentes decorrentes do uso do serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Encerramento</h2>
            <p className="text-muted-foreground">
              Você pode encerrar sua conta a qualquer momento nas Configurações. Podemos suspender ou encerrar contas que violem estes termos, com aviso prévio quando possível.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Alterações nos termos</h2>
            <p className="text-muted-foreground">
              Podemos atualizar estes termos. Alterações significativas serão comunicadas por e-mail ou aviso na plataforma. O uso continuado após alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Legislação aplicável</h2>
            <p className="text-muted-foreground">
              Estes termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida no foro da comarca de São Paulo, SP.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">11. Contato</h2>
            <p className="text-muted-foreground">
              Dúvidas sobre estes termos? Entre em contato:
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
