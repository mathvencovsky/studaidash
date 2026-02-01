import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    quote:
      "Eu abria o dia e já tinha um plano claro do que estudar. O que mais ajudou foi a fila de revisões, porque eu parava de adivinhar quando voltar no conteúdo.",
    name: "Marina C.",
    role: "Concurso",
    meta: "Rotina: 1h por dia",
    highlight: "Plano do dia pronto e revisões recorrentes",
    initials: "MC",
    color: "bg-accent-warm/20 text-accent-warm border-accent-warm/30",
  },
  {
    focus: "certificacao" as const,
    quote:
      "Para certificação eu precisava de cobertura por tópicos. Com o StudAI eu consegui enxergar o que estava faltando na semana e manter prática sem me perder no conteúdo.",
    name: "Ricardo M.",
    role: "Certificação",
    meta: "Objetivo: prova em 90 dias",
    highlight: "Cobertura semanal por tópico",
    initials: "RM",
    color: "bg-primary/20 text-primary border-primary/30",
  },
  {
    focus: "faculdade" as const,
    quote:
      "Eu misturava matérias e perdia o ritmo. Separar por disciplina e ter revisões semanais me deu previsibilidade para estudar mesmo em semanas cheias.",
    name: "Juliana A.",
    role: "Faculdade",
    meta: "Rotina: noites e fins de semana",
    highlight: "Organização por disciplina e semana",
    initials: "JA",
    color: "bg-success/20 text-success border-success/30",
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

  return (
    <SectionWrapper id="depoimentos" variant="plain">
      <div className="text-center mb-10">
        <KickerBadge variant="primary" className="mb-4">
          <MessageSquare className="h-3.5 w-3.5" />
          Experiências reais
        </KickerBadge>
        <h2 className="display-h2 text-foreground">
          Resultados que aparecem na <HeadlineHighlight variant="primary">rotina</HeadlineHighlight>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Experiências de quem usa o StudAI para ter clareza do que fazer hoje e manter revisões em dia.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Featured testimonial */}
        <Card className="lg:col-span-2 relative overflow-hidden border-2 border-primary/30 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
          <CardContent className="pt-8 pb-6">
            {/* Decorative quote */}
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-accent-warm/10 flex items-center justify-center">
              <span className="text-5xl text-accent-warm/30 font-serif">"</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 ${featured.color}`}>
                {featured.role}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">
                {featured.highlight}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground mb-4 font-semibold">
              {featured.meta}
            </p>

            <p className="text-foreground mb-6 relative z-10 text-base leading-relaxed font-medium">
              {featured.quote}
            </p>

            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/30 shadow-md">
                <AvatarFallback className="bg-primary/15 text-primary text-sm font-bold">
                  {featured.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-foreground">{featured.name}</p>
                <p className="text-xs text-muted-foreground font-medium">{featured.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Secondary testimonials */}
        <div className="flex flex-col gap-6">
          {rest.map((t) => (
            <Card key={t.name} className="relative flex-1 border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5">
              <CardContent className="pt-6 pb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border-2 ${t.color}`}>
                    {t.role}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {t.meta}
                  </span>
                </div>

                <p className="text-foreground mb-4 relative z-10 text-sm leading-relaxed font-medium">
                  {t.quote}
                </p>

                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border-2 border-border">
                    <AvatarFallback className="bg-muted text-foreground text-xs font-bold">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8 font-medium">
        Depoimentos representam experiências de uso. Resultados variam conforme rotina e consistência.
      </p>
    </SectionWrapper>
  );
}
