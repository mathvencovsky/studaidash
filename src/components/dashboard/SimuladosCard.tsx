import { FileText, Clock, Play, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Simulado } from "@/types/studai";

interface SimuladosCardProps {
  simulados: Simulado[];
  onStartSimulado: (simuladoId: string) => void;
}

export function SimuladosCard({ simulados, onStartSimulado }: SimuladosCardProps) {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Simulados</h2>
          <p className="text-xs text-muted-foreground">Teste seus conhecimentos em condições reais</p>
        </div>
      </div>

      {/* Simulados List */}
      <div className="space-y-4">
        {simulados.map((simulado) => {
          const hasAttempt = simulado.attempts > 0;
          const isPartial = simulado.type === "partial";

          return (
            <div 
              key={simulado.id}
              className={`p-5 rounded-xl border-2 transition-all ${
                isPartial 
                  ? "bg-accent/5 border-accent/20 hover:border-accent/40" 
                  : "bg-primary/5 border-primary/20 hover:border-primary/40"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-card-foreground">{simulado.name}</h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      isPartial ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                    }`}>
                      {isPartial ? "Parcial" : "Completo"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{simulado.description}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <FileText size={14} />
                  <span>{simulado.totalQuestions} questões</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock size={14} />
                  <span>{Math.floor(simulado.durationMinutes / 60)}h{simulado.durationMinutes % 60 > 0 ? ` ${simulado.durationMinutes % 60}min` : ""}</span>
                </div>
                {hasAttempt && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className={simulado.lastScore! >= 70 ? "text-status-success-text" : "text-warning"} />
                    <span className={`font-semibold ${simulado.lastScore! >= 70 ? "text-status-success-text" : "text-warning"}`}>
                      {simulado.lastScore}%
                    </span>
                  </div>
                )}
              </div>

              {/* Readiness Message */}
              {simulado.readinessMessage && (
                <div className={`flex items-start gap-2 p-3 rounded-lg mb-4 ${
                  hasAttempt ? "bg-accent/10" : "bg-warning/10"
                }`}>
                  <AlertCircle size={16} className={hasAttempt ? "text-accent shrink-0 mt-0.5" : "text-warning shrink-0 mt-0.5"} />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {simulado.readinessMessage}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => onStartSimulado(simulado.id)}
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 ${
                  isPartial 
                    ? "bg-accent text-accent-foreground" 
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {hasAttempt ? (
                  <>
                    <RotateCcw size={16} />
                    Tentar Novamente
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Fazer Simulado
                  </>
                )}
              </button>

              {hasAttempt && simulado.lastAttemptDate && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Última tentativa: {new Date(simulado.lastAttemptDate).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
