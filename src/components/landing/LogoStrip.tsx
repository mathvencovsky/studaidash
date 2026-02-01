import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Shield, Lock, Mail, Zap } from "lucide-react";
import { SectionWrapper, KickerBadge } from "./ui";

const SUPPORT_EMAIL = "support@studai.app";

type AudienceKey = "concurso" | "certificacao" | "faculdade" | "residencia" | "transicao" | "grupo";

const audience: { key: AudienceKey; label: string }[] = [
  { key: "concurso", label: "Concurso" },
  { key: "certificacao", label: "Certificação" },
  { key: "faculdade", label: "Faculdade" },
  { key: "residencia", label: "Residência" },
  { key: "transicao", label: "Transição" },
  { key: "grupo", label: "Grupo de estudo" },
];

const audienceMicrocopy: Record<AudienceKey, string> = {
  concurso: "Foco em constância e revisão.",
  certificacao: "Cobertura por tópico e prática.",
  faculdade: "Disciplinas organizadas e revisões semanais.",
  residencia: "Organização para alto volume de conteúdo.",
  transicao: "Clareza para aprender novas áreas.",
  grupo: "Acompanhamento compartilhado de progresso.",
};

const credibilityBullets = [
  "Plano de hoje com tarefas claras",
  "Fila de revisões para manter consistência",
  "Indicadores semanais para ajustar o ritmo",
];

export function LogoStrip() {
  const [activeAudience, setActiveAudience] = useState<AudienceKey | null>(null);

  return (
    <SectionWrapper variant="split" compact>
      {/* Header */}
      <div className="text-center mb-6">
        <KickerBadge variant="primary" className="mb-3">
          <Zap className="h-3.5 w-3.5" />
          Prova de valor
        </KickerBadge>
        <h2 className="display-h3 text-foreground">
          Clareza para estudar todos os dias
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
          Plano do dia, revisões e progresso semanal no mesmo lugar.
        </p>
      </div>

      {/* Audience chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {audience.map((item) => (
          <button
            key={item.key}
            type="button"
            onMouseEnter={() => setActiveAudience(item.key)}
            onMouseLeave={() => setActiveAudience(null)}
            onFocus={() => setActiveAudience(item.key)}
            onBlur={() => setActiveAudience(null)}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              activeAudience === item.key
                ? "border-accent-warm bg-accent-warm/10 text-accent-warm shadow-md transform -translate-y-0.5"
                : "border-border bg-card text-foreground hover:border-accent-warm/50 hover:bg-accent-warm/5"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Dynamic microcopy */}
      <div className="h-7 mb-5 text-center">
        {activeAudience && (
          <p className="text-sm font-semibold text-accent-warm animate-in fade-in duration-200">
            {audienceMicrocopy[activeAudience]}
          </p>
        )}
      </div>

      {/* Credibility + trust links */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-2">
          {credibilityBullets.map((bullet) => (
            <span key={bullet} className="flex items-center gap-2.5 text-sm text-foreground font-medium">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
              {bullet}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4 text-xs text-muted-foreground">
          <Link 
            to="/privacidade" 
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded font-semibold"
          >
            <Shield className="h-3.5 w-3.5" />
            Privacidade
          </Link>
          <Link 
            to="/seguranca" 
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded font-semibold"
          >
            <Lock className="h-3.5 w-3.5" />
            Segurança
          </Link>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded font-semibold"
          >
            <Mail className="h-3.5 w-3.5" />
            Suporte
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
