import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Para quem é o StudAI?",
    answer: "Para qualquer pessoa que precisa estudar com constância: concurseiros, candidatos a certificações (CFA, CPA, AWS, etc.), estudantes de medicina, direito, engenharia e profissionais em transição de carreira.",
  },
  {
    question: "Quanto tempo leva para começar?",
    answer: "Menos de 2 minutos. Você cria sua conta, define seu objetivo e disponibilidade, e o sistema gera seu primeiro plano de estudos automaticamente.",
  },
  {
    question: "Preciso pagar para usar?",
    answer: "Não. O plano gratuito permite criar uma trilha completa e usar todas as funcionalidades básicas. Você pode fazer upgrade quando sentir necessidade.",
  },
  {
    question: "Como vocês tratam meus dados?",
    answer: "Coletamos apenas o necessário para funcionar (e-mail, preferências de estudo, progresso). Não vendemos seus dados. Você pode exportar ou excluir tudo a qualquer momento. Veja nossa Política de Privacidade para detalhes.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim. Não há fidelidade ou multa. Você pode excluir sua conta diretamente nas configurações.",
  },
  {
    question: "Funciona no celular?",
    answer: "Sim. A plataforma é responsiva e funciona em qualquer dispositivo: computador, tablet ou celular.",
  },
  {
    question: "Como funciona o sistema de revisões?",
    answer: "Utilizamos repetição espaçada: o sistema agenda revisões nos momentos ideais para fixação do conteúdo na memória de longo prazo, baseado no seu desempenho em quizzes.",
  },
  {
    question: "O que muda no plano Pro?",
    answer: "O Pro (em breve) oferece trilhas ilimitadas, relatórios avançados, sessões de estudo com IA e prioridade no suporte. O plano gratuito já cobre a maioria das necessidades.",
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
            Respostas diretas para as dúvidas mais comuns
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
