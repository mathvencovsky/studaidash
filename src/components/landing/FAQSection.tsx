import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";

const SUPPORT_EMAIL = "support@studai.app";

type ProfileKey = "concurso" | "certificacao" | "faculdade";

function readProfileFromStorage(): ProfileKey | null {
  try {
    const v = localStorage.getItem("studai_perfil");
    if (v === "concurso" || v === "certificacao" || v === "faculdade") return v;
    return null;
  } catch {
    return null;
  }
}

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

const profileFAQs: Record<ProfileKey, FAQItem> = {
  concurso: {
    question: "Isso funciona para concursos?",
    answer:
      "Sim. O StudAI ajuda a organizar leituras, questões e revisões diárias para quem estuda para concursos.",
  },
  certificacao: {
    question: "Isso funciona para certificações?",
    answer:
      "Sim. O StudAI organiza tópicos, quizzes e revisões para certificações. Você acompanha a cobertura por tema.",
  },
  faculdade: {
    question: "Isso funciona para faculdade?",
    answer:
      "Sim. O StudAI ajuda a separar disciplinas, exercícios e revisões semanais para manter tudo em dia.",
  },
};

const baseFaqs: FAQItem[] = [
  {
    question: "Para quem é o StudAI?",
    answer:
      "Para quem precisa estudar com consistência e quer um plano claro do que fazer hoje e do que revisar depois.",
  },
  {
    question: "Como começo a usar?",
    answer:
      "Crie sua conta, escolha seu objetivo e informe quanto tempo tem por dia. Em minutos você vê seu plano.",
  },
  {
    question: "Preciso pagar para usar?",
    answer:
      "Não. O plano Grátis dá acesso ao essencial. O Pro estará disponível no futuro com recursos avançados.",
  },
  {
    question: "Funciona no celular?",
    answer: "Sim. O StudAI é responsivo e funciona no computador, tablet e celular.",
  },
  {
    question: "Como vocês tratam meus dados?",
    answer: (
      <>
        Usamos seus dados para operar a conta e registrar progresso. Não vendemos dados pessoais.{" "}
        <Link to="/privacidade" className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
          Ver mais
        </Link>
        .
      </>
    ),
  },
  {
    question: "Como excluir minha conta?",
    answer: (
      <>
        Solicite exclusão pelo e-mail{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
          {SUPPORT_EMAIL}
        </a>
        .
      </>
    ),
  },
  {
    question: "Como funciona a revisão?",
    answer:
      "O StudAI organiza o que deve ser revisado e ajuda a manter revisões recorrentes baseadas no tempo.",
  },
  {
    question: "O que muda no Pro?",
    answer: (
      <>
        O Pro está em desenvolvimento e deve incluir trilhas ilimitadas e relatórios detalhados.{" "}
        <a href="#planos" className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
          Ver planos
        </a>
        .
      </>
    ),
  },
];

export function FAQSection() {
  const [params] = useSearchParams();

  const profile: ProfileKey = useMemo(() => {
    const p = params.get("perfil");
    if (p === "concurso" || p === "certificacao" || p === "faculdade") return p;
    return readProfileFromStorage() ?? "concurso";
  }, [params]);

  const faqs = useMemo(() => {
    const profileQuestion = profileFAQs[profile];
    return [profileQuestion, ...baseFaqs];
  }, [profile]);

  return (
    <SectionWrapper id="faq" variant="tint" tabIndex={-1}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <KickerBadge variant="primary" className="mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            Dúvidas
          </KickerBadge>
          <h2 className="display-h2 text-foreground">
            Perguntas <HeadlineHighlight variant="primary">frequentes</HeadlineHighlight>
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Respostas diretas para dúvidas comuns
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card border-2 rounded-xl px-4 data-[state=open]:border-primary/40 data-[state=open]:shadow-md transition-all"
            >
              <AccordionTrigger className="text-left font-bold text-foreground text-sm hover:no-underline py-4 min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed font-medium">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="text-center text-xs text-muted-foreground mt-6 font-medium">
          Ainda com dúvidas?{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </SectionWrapper>
  );
}
