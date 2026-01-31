import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Para quem é o StudAI?",
    answer: "Para qualquer pessoa que precisa estudar com consistência: concurseiros, candidatos a certificações (CFA, CPA, AWS, etc.), estudantes de medicina, direito, engenharia e profissionais em transição de carreira.",
  },
  {
    question: "Preciso pagar para começar?",
    answer: "Não. O plano gratuito permite criar uma trilha completa e usar todas as funcionalidades básicas. Você pode fazer upgrade quando sentir necessidade.",
  },
  {
    question: "Como funciona o plano de estudos?",
    answer: "Você define seu objetivo, a data da prova e sua disponibilidade semanal. O sistema calcula automaticamente quanto você precisa estudar por dia e organiza o conteúdo em um cronograma realista.",
  },
  {
    question: "Posso usar no celular?",
    answer: "Sim. A plataforma é totalmente responsiva e funciona em qualquer dispositivo. Você pode estudar no computador em casa e revisar no celular durante o transporte.",
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Sim. Usamos criptografia de ponta a ponta e nunca compartilhamos seus dados com terceiros. Você pode exportar ou excluir seus dados a qualquer momento.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim. Não há fidelidade ou multa. Se você cancelar, continua com acesso até o fim do período pago e depois volta ao plano gratuito.",
  },
  {
    question: "Como funciona o sistema de revisões?",
    answer: "Utilizamos repetição espaçada: o sistema agenda revisões nos momentos ideais para fixação do conteúdo na memória de longo prazo, baseado no seu desempenho em quizzes.",
  },
  {
    question: "Posso estudar para mais de uma prova?",
    answer: "No plano gratuito, você pode ter uma trilha ativa. No plano Pro, pode criar trilhas ilimitadas e estudar para múltiplos objetivos simultaneamente.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Perguntas frequentes
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tudo que você precisa saber para começar
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
      </div>
    </section>
  );
}
