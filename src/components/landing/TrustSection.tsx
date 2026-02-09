import { Link } from "react-router-dom";
import { Database, Target, Settings, Lock, ArrowRight, Mail, HelpCircle, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";
import { useI18n } from "@/i18n";

const SUPPORT_EMAIL = "support@studai.app";

export function TrustSection() {
  const { t } = useI18n();

  const trustCards = [
    { icon: Database, title: t("trust.card1.title"), description: t("trust.card1.desc") },
    { icon: Target, title: t("trust.card2.title"), description: t("trust.card2.desc") },
    { icon: Settings, title: t("trust.card3.title"), description: t("trust.card3.desc") },
    { icon: Lock, title: t("trust.card4.title"), description: t("trust.card4.desc") },
  ];

  return (
    <SectionWrapper id="privacidade-controle" variant="tint" tabIndex={-1}>
      <div className="text-center mb-6">
        <KickerBadge variant="primary" className="mb-2">
          <Shield className="h-3.5 w-3.5" />
          {t("trust.kicker")}
        </KickerBadge>
        <h2 className="display-h2 text-foreground">
          {t("trust.headline")}<HeadlineHighlight variant="primary">{t("trust.headlineHighlight")}</HeadlineHighlight>
        </h2>
        <p className="mt-2 text-muted-foreground max-w-lg mx-auto text-sm">
          {t("trust.subheadline")}
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-6">
        <Card className="border-2 border-primary/30 shadow-lg bg-gradient-to-br from-card via-card to-primary/5">
          <CardContent className="p-4 sm:p-5">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-warm/20 flex items-center justify-center">
                <span className="text-accent-warm text-[10px] font-bold">30s</span>
              </span>
              {t("trust.summary30s")}
            </h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5 font-bold">•</span>
                <span className="font-medium">{t("trust.bullet1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5 font-bold">•</span>
                <span className="font-medium">{t("trust.bullet2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5 font-bold">•</span>
                <span className="font-medium">{t("trust.bullet3")}</span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t-2">
              <h4 className="text-[10px] font-bold text-muted-foreground mb-2 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                {t("trust.quickQuestions")}
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                <a href="#faq" className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded min-h-[32px] flex items-center">
                  {t("trust.howToDelete")}
                </a>
                <Link to="/seguranca" className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded min-h-[32px] flex items-center">
                  {t("trust.howToReport")}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {trustCards.map((card) => (
          <Card key={card.title} className="bg-card border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-lg group">
            <CardHeader className="pb-2 p-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-accent/15 transition-colors">
                <card.icon className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-sm font-bold">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6">
        <Link to="/privacidade" className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded min-h-[40px] px-2">
          {t("trust.privacyPolicy")}
          <ArrowRight className="h-3 w-3" />
        </Link>
        <Link to="/seguranca" className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded min-h-[40px] px-2">
          {t("common.security")}
          <ArrowRight className="h-3 w-3" />
        </Link>
        <Link to="/termos" className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded min-h-[40px] px-2">
          {t("trust.termsOfUse")}
          <ArrowRight className="h-3 w-3" />
        </Link>
        <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded min-h-[40px] px-2">
          {t("trust.talkToSupport")}
          <Mail className="h-3 w-3" />
        </a>
      </div>
    </SectionWrapper>
  );
}
