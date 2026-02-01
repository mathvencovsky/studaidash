import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SUPPORT_EMAIL = "support@studai.app";

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

const faqs: FAQItem[] = [
  {
    question: "Para quem é o StudAI?",
    answer:
      "Para quem precisa estudar com consistência e quer um plano claro do que fazer hoje e do que revisar depois. Funciona bem para concursos, certificações e faculdade.",
  },
  {
    question: "Como começo a usar?",
    answer:
      "Crie sua conta, escolha seu objetivo e informe quanto tempo você tem por dia. Em poucos minutos você já vê seu plano do dia e o acompanhamento da semana.",
  },
  {
    question: "Preciso pagar para usar?",
    answer:
      "Não. O plano Grátis dá acesso ao essencial para organizar e acompanhar seus estudos. O Pro estará disponível no futuro com recursos avançados.",
  },
  {
    question: "Funciona no celular?",
    answer: "Sim. O StudAI é responsivo e funciona no computador, tablet e celular.",
  },
  {
    question: "Como vocês tratam meus dados?",
    answer: (
      <>
        Usamos seus dados para operar a conta e registrar seu progresso. Não vendemos dados pessoais. 
        Você pode solicitar exclusão da conta e dados pelo suporte. Veja detalhes em{" "}
        <Link to="/privacidade" className="text-primary hover:underline">
          Privacidade
        </Link>
        .
      </>
    ),
  },
  {
    question: "Como posso excluir minha conta?",
    answer: (
      <>
        Você pode solicitar a exclusão pelo e-mail{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
          {SUPPORT_EMAIL}
        </a>
        . Nós confirmamos o pedido e orientamos os próximos passos.
      </>
    ),
  },
  {
    question: "Como funciona a revisão?",
    answer:
      "O StudAI organiza o que deve ser revisado e ajuda você a manter revisões recorrentes. A forma exata pode variar conforme seu uso e o tipo de trilha.",
  },
  {
    question: "O que muda no Pro?",
    answer: (
      <>
        O Pro está em desenvolvimento e deve incluir trilhas ilimitadas e relatórios mais detalhados. 
        Se quiser, entre na lista de espera na seção de{" "}
        <a href="#planos" className="text-primary hover:underline">
          Planos
        </a>
        .
      </>
    ),
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Perguntas frequentes
          </h2>
          <p className="mt-4 text-muted-foreground">
            Respostas diretas para dúvidas comuns
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Ainda com dúvidas? Fale com{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-primary hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
