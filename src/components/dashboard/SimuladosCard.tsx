import { FileText, Clock, Play, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Simulado } from "@/types/studai";

interface SimuladosCardProps {
  simulados: Simulado[];
  onStartSimulado: (simuladoId: string) => void;
}

export function SimuladosCard({ simulados, onStartSimulado }: SimuladosCardProps) {
  return (
    <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText size={18} className="sm:w-5 sm:h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-card-foreground">Simulados</h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Teste em condições reais</p>
        </div>
      </div>

      {/* Simulados List */}
      <div className="space-y-3 sm:space-y-4">
        {simulados.map((simulado) => {
          const hasAttempt = simulado.attempts > 0;
          const isPartial = simulado.type === "partial";

          return (
            <div 
              key={simulado.id}
              className={`p-3.5 sm:p-5 rounded-xl border-2 transition-all ${
                isPartial 
                  ? "bg-accent/5 border-accent/20 hover:border-accent/40" 
                  : "bg-primary/5 border-primary/20 hover:border-primary/40"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                    <h3 className="font-semibold text-sm sm:text-base text-card-foreground">{simulado.name}</h3>
                    <span className={`text-[8px] sm:text-[10px] font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 ${
                      isPartial ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                    }`}>
                      {isPartial ? "Parcial" : "Completo"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{simulado.description}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-[10px] sm:text-sm">
                <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
                  <FileText size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>{simulado.totalQuestions} questões</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
                  <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>{Math.floor(simulado.durationMinutes / 60)}h{simulado.durationMinutes % 60 > 0 ? ` ${simulado.durationMinutes % 60}min` : ""}</span>
                </div>
                {hasAttempt && (
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <CheckCircle2 size={12} className={`sm:w-3.5 sm:h-3.5 ${simulado.lastScore! >= 70 ? "text-status-success-text" : "text-warning"}`} />
                    <span className={`font-semibold ${simulado.lastScore! >= 70 ? "text-status-success-text" : "text-warning"}`}>
                      {simulado.lastScore}%
                    </span>
                  </div>
                )}
              </div>

              {/* Readiness Message - hidden on very small screens */}
              {simulado.readinessMessage && (
                <div className={`hidden sm:flex items-start gap-2 p-2.5 sm:p-3 rounded-lg mb-3 sm:mb-4 ${
                  hasAttempt ? "bg-accent/10" : "bg-warning/10"
                }`}>
                  <AlertCircle size={14} className={`sm:w-4 sm:h-4 shrink-0 mt-0.5 ${hasAttempt ? "text-accent" : "text-warning"}`} />
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                    {simulado.readinessMessage}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => onStartSimulado(simulado.id)}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] ${
                  isPartial 
                    ? "bg-accent text-accent-foreground" 
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {hasAttempt ? (
                  <>
                    <RotateCcw size={14} className="sm:w-4 sm:h-4" />
                    Tentar Novamente
                  </>
                ) : (
                  <>
                    <Play size={14} className="sm:w-4 sm:h-4" />
                    Fazer Simulado
                  </>
                )}
              </button>

              {hasAttempt && simulado.lastAttemptDate && (
                <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-1.5 sm:mt-2">
                  Última: {new Date(simulado.lastAttemptDate).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
