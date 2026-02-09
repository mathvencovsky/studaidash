import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageSquare, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";
import { useI18n } from "@/i18n";

type ProfileKey = "concurso" | "certificacao" | "faculdade";

function readProfileFromStorage(): ProfileKey | null {
  try {
    const v = localStorage.getItem("studai_perfil");
    if (v === "concurso" || v === "certificacao" || v === "faculdade") return v;
    return null;
  } catch { return null; }
}

export function Testimonials() {
  const { t } = useI18n();
  const [params] = useSearchParams();

  const profile: ProfileKey = useMemo(() => {
    const p = params.get("perfil");
    if (p === "concurso" || p === "certificacao" || p === "faculdade") return p;
    return readProfileFromStorage() ?? "concurso";
  }, [params]);

  const testimonials = [
    {
      focus: "concurso" as const,
      quote: t("testimonials.concurso.quote"),
      name: "Marina C.", role: t("testimonials.concurso.role"),
      context: t("testimonials.concurso.context"),
      changes: [t("testimonials.concurso.change1"), t("testimonials.concurso.change2"), t("testimonials.concurso.change3")],
      initials: "MC",
      colorClass: "bg-accent-warm/15 text-accent-warm border-accent-warm/40",
    },
    {
      focus: "certificacao" as const,
      quote: t("testimonials.certificacao.quote"),
      name: "Ricardo M.", role: t("testimonials.certificacao.role"),
      context: t("testimonials.certificacao.context"),
      changes: [t("testimonials.certificacao.change1"), t("testimonials.certificacao.change2"), t("testimonials.certificacao.change3")],
      initials: "RM",
      colorClass: "bg-primary/15 text-primary border-primary/40",
    },
    {
      focus: "faculdade" as const,
      quote: t("testimonials.faculdade.quote"),
      name: "Juliana A.", role: t("testimonials.faculdade.role"),
      context: t("testimonials.faculdade.context"),
      changes: [t("testimonials.faculdade.change1"), t("testimonials.faculdade.change2"), t("testimonials.faculdade.change3")],
      initials: "JA",
      colorClass: "bg-success/15 text-success border-success/40",
    },
  ];

  const ordered = useMemo(() => {
    const copy = [...testimonials];
    copy.sort((a, b) => (a.focus === profile ? -1 : b.focus === profile ? 1 : 0));
    return copy;
  }, [profile, t]);

  const featured = ordered[0];
  const rest = ordered.slice(1, 3);

  const handleCTAClick = () => {
    const authCard = document.getElementById("auth-card");
    if (authCard) { authCard.scrollIntoView({ behavior: "smooth" }); authCard.focus(); }
  };

  return (
    <SectionWrapper id="depoimentos" variant="plain">
      <div className="text-center mb-6">
        <KickerBadge variant="primary" className="mb-2">
          <MessageSquare className="h-3.5 w-3.5" />
          {t("testimonials.kicker")}
        </KickerBadge>
        <h2 className="display-h2 text-foreground">
          {t("testimonials.headline")}<HeadlineHighlight variant="primary">{t("testimonials.headlineHighlight")}</HeadlineHighlight>
        </h2>
        <p className="mt-2 text-muted-foreground max-w-lg mx-auto text-sm">
          {t("testimonials.subheadline")}
        </p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-card">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${featured.colorClass}`}>{featured.role}</span>
              <span className="text-xs text-muted-foreground">{featured.context}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col justify-between">
                <p className="text-foreground text-sm sm:text-base leading-relaxed font-medium mb-3">"{featured.quote}"</p>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{featured.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{featured.name}</p>
                    <p className="text-xs text-muted-foreground">{featured.role}</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2">{t("testimonials.whatChanged")}</p>
                <ul className="space-y-1.5">
                  {featured.changes.map((change, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 flex flex-col gap-3">
          {rest.map((item) => (
            <Card key={item.name} className="flex-1 border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md bg-card">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.colorClass}`}>{item.role}</span>
                  <span className="text-[10px] text-muted-foreground">{item.context}</span>
                </div>
                <p className="text-foreground text-xs sm:text-sm leading-relaxed font-medium mb-2">"{item.quote}"</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.changes.slice(0, 2).map((change, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                      {change}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 border border-border">
                    <AvatarFallback className="bg-muted text-foreground text-[10px] font-semibold">{item.initials}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-foreground text-xs">{item.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left">{t("testimonials.disclaimer")}</p>
        <Button variant="outline" size="sm" onClick={handleCTAClick} className="min-h-[40px] group">
          {t("common.startFree")}
          <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </SectionWrapper>
  );
}
