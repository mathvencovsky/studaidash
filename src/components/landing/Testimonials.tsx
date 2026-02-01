import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    <section id="depoimentos" className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Resultados que aparecem na rotina
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Experiências de quem usa o StudAI para ter clareza do que fazer hoje e manter revisões em dia.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Featured testimonial */}
          <Card className="lg:col-span-2 relative overflow-hidden">
            <CardContent className="pt-8 pb-6">
              <Quote className="absolute top-4 right-4 h-12 w-12 text-primary/10" />
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                  {featured.role}
                </span>
                <span className="text-xs text-muted-foreground">
                  {featured.highlight}
                </span>
              </div>
              
              <p className="text-xs text-muted-foreground mb-4">
                {featured.meta}
              </p>

              <p className="text-foreground mb-6 relative z-10 text-base leading-relaxed">
                {featured.quote}
              </p>

              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {featured.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground text-sm">{featured.name}</p>
                  <p className="text-xs text-muted-foreground">{featured.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secondary testimonials */}
          <div className="flex flex-col gap-6">
            {rest.map((t) => (
              <Card key={t.name} className="relative flex-1">
                <CardContent className="pt-6 pb-5">
                  <Quote className="absolute top-3 right-3 h-6 w-6 text-primary/10" />
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {t.role}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.meta}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-4 relative z-10 text-sm leading-relaxed">
                    {t.quote}
                  </p>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Depoimentos representam experiências de uso. Resultados variam conforme rotina e consistência.
        </p>
      </div>
    </section>
  );
}
