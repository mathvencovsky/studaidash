import { Link } from "react-router-dom";
import { CheckCircle2, Shield, Lock, Mail } from "lucide-react";

const SUPPORT_EMAIL = "support@studai.app";

const audience = [
  "Concurso",
  "Certificação",
  "Faculdade",
  "Residência",
  "Transição",
  "Grupo de estudo",
];

const credibilityBullets = [
  "Plano de hoje com tarefas claras",
  "Fila de revisões para manter consistência",
  "Indicadores semanais para ajustar o ritmo",
];

export function LogoStrip() {
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
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {audience.map((item) => (
            <span
              key={item}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
            >
              {item}
            </span>
          ))}
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
            <Link to="/privacidade" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <Shield className="h-3 w-3" />
              Privacidade
            </Link>
            <Link to="/seguranca" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
              <Lock className="h-3 w-3" />
              Segurança
            </Link>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
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
