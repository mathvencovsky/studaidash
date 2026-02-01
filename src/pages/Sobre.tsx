import { Link } from "react-router-dom";
import { ArrowLeft, Users, Target, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sobre() {
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
          <h1 className="text-lg font-semibold text-foreground">Sobre o StudAI</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Organização de estudos para quem precisa de constância
          </h2>
          <p className="text-muted-foreground text-lg">
            O StudAI nasceu de uma frustração comum: estudar sem saber se está no caminho certo, sem ver progresso claro, sem conseguir manter a constância.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Foco em resultados</h3>
            <p className="text-sm text-muted-foreground">
              Tudo na plataforma existe para ajudar você a estudar com mais eficiência e menos ansiedade.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Para estudantes reais</h3>
            <p className="text-sm text-muted-foreground">
              Concurseiros, candidatos a certificações, estudantes de graduação e profissionais em transição.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Transparência</h3>
            <p className="text-sm text-muted-foreground">
              Preços claros, sem truques. Você sempre sabe o que está pagando e o que está recebendo.
            </p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">O problema que resolvemos</h2>
            <p className="text-muted-foreground">
              Muita gente estuda muito, mas sem direção. Abre livros, assiste aulas, faz exercícios, mas não tem clareza se está evoluindo. O resultado? Ansiedade, procrastinação e desistência.
            </p>
            <p className="text-muted-foreground mt-2">
              O StudAI organiza seus estudos em trilhas personalizadas, cria planos diários realistas e mostra seu progresso real. Você sempre sabe o que fazer hoje e como está sua evolução.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Nossa abordagem</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li><strong>Simplicidade:</strong> Interface limpa, sem distrações. Foco no que importa.</li>
              <li><strong>Constância:</strong> Planos diários que se adaptam ao seu ritmo e disponibilidade.</li>
              <li><strong>Evidência:</strong> Métricas claras de progresso. Você vê sua evolução.</li>
              <li><strong>Revisão inteligente:</strong> Repetição espaçada para fixar conteúdo na memória de longo prazo.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Próximos passos</h2>
            <p className="text-muted-foreground">
              Estamos trabalhando continuamente para melhorar a plataforma. Funcionalidades como sessões de estudo com IA, relatórios avançados e integrações estão em desenvolvimento.
            </p>
            <p className="text-muted-foreground mt-2">
              Quer sugerir algo?{" "}
              <Link to="/contato" className="text-primary hover:underline">
                Entre em contato
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
