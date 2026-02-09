import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";
import { useI18n } from "@/i18n";

const SUPPORT_EMAIL = "support@studai.app";

type ProfileKey = "concurso" | "certificacao" | "faculdade";

function readProfileFromStorage(): ProfileKey | null {
  try {
    const v = localStorage.getItem("studai_perfil");
    if (v === "concurso" || v === "certificacao" || v === "faculdade") return v;
    return null;
  } catch { return null; }
}

export function FAQSection() {
  const { t } = useI18n();
  const [params] = useSearchParams();

  const profile: ProfileKey = useMemo(() => {
    const p = params.get("perfil");
    if (p === "concurso" || p === "certificacao" || p === "faculdade") return p;
    return readProfileFromStorage() ?? "concurso";
  }, [params]);

  type FAQItem = { question: string; answer: React.ReactNode };

  const profileFAQs: Record<ProfileKey, FAQItem> = {
    concurso: { question: t("faq.concurso.q"), answer: t("faq.concurso.a") },
    certificacao: { question: t("faq.certificacao.q"), answer: t("faq.certificacao.a") },
    faculdade: { question: t("faq.faculdade.q"), answer: t("faq.faculdade.a") },
  };

  const baseFaqs: FAQItem[] = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    {
      question: t("faq.q5"),
      answer: (<>{t("faq.a5")} <Link to="/privacidade" className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">{t("common.learnMore")}</Link>.</>),
    },
    {
      question: t("faq.q6"),
      answer: (<>
        {t("faq.q6") === "Como excluir minha conta?" ? "Solicite exclusão pelo e-mail " : "Request deletion via email "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">{SUPPORT_EMAIL}</a>.
      </>),
    },
    { question: t("faq.q7"), answer: t("faq.a7") },
    {
      question: t("faq.q8"),
      answer: (<>
        {t("faq.q8") === "O que muda no Pro?" ? "O Pro está em desenvolvimento e deve incluir trilhas ilimitadas e relatórios detalhados. " : "Pro is in development and will include unlimited trails and detailed reports. "}
        <a href="#planos" className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">{t("faq.viewPlans")}</a>.
      </>),
    },
  ];

  const faqs = useMemo(() => {
    return [profileFAQs[profile], ...baseFaqs];
  }, [profile, t]);

  return (
    <SectionWrapper id="faq" variant="tint" tabIndex={-1}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <KickerBadge variant="primary" className="mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            {t("faq.kicker")}
          </KickerBadge>
          <h2 className="display-h2 text-foreground">
            {t("faq.headline")}<HeadlineHighlight variant="primary">{t("faq.headlineHighlight")}</HeadlineHighlight>
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">{t("faq.subheadline")}</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card border-2 rounded-xl px-4 data-[state=open]:border-primary/40 data-[state=open]:shadow-md transition-all">
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
          {t("faq.stillQuestions")}{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">{SUPPORT_EMAIL}</a>
        </p>
      </div>
    </SectionWrapper>
  );
}
