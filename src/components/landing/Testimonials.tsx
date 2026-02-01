import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageSquare, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";

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

const testimonials = [
  {
    focus: "concurso" as const,
    quote: "Eu abria o dia e já tinha um plano claro do que estudar. Parei de adivinhar quando voltar no conteúdo.",
    name: "Marina C.",
    role: "Concurso",
    context: "Rotina: 1h por dia",
    changes: [
      "Plano de hoje pronto ao abrir",
      "Fila de revisões recorrentes",
      "Progresso semanal visível"
    ],
    initials: "MC",
    colorClass: "bg-accent-warm/15 text-accent-warm border-accent-warm/40",
  },
  {
    focus: "certificacao" as const,
    quote: "Consegui enxergar o que estava faltando na semana e manter prática sem me perder.",
    name: "Ricardo M.",
    role: "Certificação",
    context: "Objetivo: prova em 90 dias",
    changes: [
      "Cobertura semanal por tópico",
      "Prática direcionada por peso",
      "Countdown até a prova"
    ],
    initials: "RM",
    colorClass: "bg-primary/15 text-primary border-primary/40",
  },
  {
    focus: "faculdade" as const,
    quote: "Separar por disciplina e ter revisões semanais me deu previsibilidade em semanas cheias.",
    name: "Juliana A.",
    role: "Faculdade",
    context: "Rotina: noites e fins de semana",
    changes: [
      "Organização por disciplina",
      "Revisões semanais automáticas",
      "Visão clara de pendências"
    ],
    initials: "JA",
    colorClass: "bg-success/15 text-success border-success/40",
  },
];

export function Testimonials() {
  const [params] = useSearchParams();

  const profile: ProfileKey = useMemo(() => {
    const p = params.get("perfil");
    if (p === "concurso" || p === "certificacao" || p === "faculdade") return p;
    return readProfileFromStorage() ?? "concurso";
  }, [params]);

  const ordered = useMemo(() => {
    const copy = [...testimonials];
    copy.sort((a, b) => (a.focus === profile ? -1 : b.focus === profile ? 1 : 0));
    return copy;
  }, [profile]);

  const featured = ordered[0];
  const rest = ordered.slice(1, 3);

  const handleCTAClick = () => {
    const authCard = document.getElementById("auth-card");
    if (authCard) {
      authCard.scrollIntoView({ behavior: "smooth" });
      authCard.focus();
    }
  };

  return (
    <SectionWrapper id="depoimentos" variant="plain">
      <div className="text-center mb-6">
        <KickerBadge variant="primary" className="mb-2">
          <MessageSquare className="h-3.5 w-3.5" />
          Exemplos de uso
        </KickerBadge>
        <h2 className="display-h2 text-foreground">
          Resultados na <HeadlineHighlight variant="primary">rotina</HeadlineHighlight>
        </h2>
        <p className="mt-2 text-muted-foreground max-w-lg mx-auto text-sm">
          Como usuários organizam seus estudos com o StudAI.
        </p>
      </div>

      {/* Mobile: stack cards, Desktop: grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4">
        {/* Featured testimonial - split layout */}
        <Card className="lg:col-span-3 border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-card">
          <CardContent className="p-4 sm:p-5">
            {/* Header with tag and context */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${featured.colorClass}`}>
                {featured.role}
              </span>
              <span className="text-xs text-muted-foreground">
                {featured.context}
              </span>
            </div>

            {/* Split layout: quote + changes */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Column A: Quote + Author */}
              <div className="flex flex-col justify-between">
                <p className="text-foreground text-sm sm:text-base leading-relaxed font-medium mb-3">
                  "{featured.quote}"
                </p>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {featured.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{featured.name}</p>
                    <p className="text-xs text-muted-foreground">{featured.role}</p>
                  </div>
                </div>
              </div>

              {/* Column B: What changed */}
              <div className="bg-muted/50 rounded-lg p-3 border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2">
                  O que mudou
                </p>
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

        {/* Secondary testimonials */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {rest.map((t) => (
            <Card 
              key={t.name} 
              className="flex-1 border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md bg-card"
            >
              <CardContent className="p-3 sm:p-4">
                {/* Tag + context */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.colorClass}`}>
                    {t.role}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {t.context}
                  </span>
                </div>

                {/* Main quote */}
                <p className="text-foreground text-xs sm:text-sm leading-relaxed font-medium mb-2">
                  "{t.quote}"
                </p>

                {/* Compact changes */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {t.changes.slice(0, 2).map((change, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                      {change}
                    </span>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 border border-border">
                    <AvatarFallback className="bg-muted text-foreground text-[10px] font-semibold">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-foreground text-xs">{t.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer with disclaimer + CTA */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left">
          Exemplos ilustrativos. Resultados variam conforme rotina e consistência.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCTAClick}
          className="min-h-[40px] group"
        >
          Começar grátis
          <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </SectionWrapper>
  );
}
