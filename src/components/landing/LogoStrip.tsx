import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Shield, Lock, Mail } from "lucide-react";

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
    <section className="py-12 border-y bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Clareza para estudar todos os dias
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Plano do dia, revisões e progresso semanal no mesmo lugar.
          </p>
        </div>

        {/* Audience chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {audience.map((item) => (
            <button
              key={item.key}
              type="button"
              onMouseEnter={() => setActiveAudience(item.key)}
              onMouseLeave={() => setActiveAudience(null)}
              onFocus={() => setActiveAudience(item.key)}
              onBlur={() => setActiveAudience(null)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                activeAudience === item.key
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Dynamic microcopy */}
        <div className="h-6 mb-6 text-center">
          {activeAudience && (
            <p className="text-sm text-primary animate-in fade-in duration-200">
              {audienceMicrocopy[activeAudience]}
            </p>
          )}
        </div>

        {/* Credibility + trust links */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-2">
            {credibilityBullets.map((bullet) => (
              <span key={bullet} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                {bullet}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4 text-xs text-muted-foreground">
            <Link 
              to="/privacidade" 
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              <Shield className="h-3 w-3" />
              Privacidade
            </Link>
            <Link 
              to="/seguranca" 
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              <Lock className="h-3 w-3" />
              Segurança
            </Link>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              <Mail className="h-3 w-3" />
              Suporte
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
