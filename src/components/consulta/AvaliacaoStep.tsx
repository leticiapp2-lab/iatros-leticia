import { useState } from "react";
import { Loader2, ArrowLeft, ArrowRight, Copy, Check, AlertTriangle, FlaskConical, Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { useConsulta } from "./ConsultaProvider";
import type { DiagnosticHypothesis } from "./types";

function ProbabilityBadge({ probability }: { probability: DiagnosticHypothesis["probability"] }) {
  const styles = {
    alta: "bg-green-100 text-green-800 border-green-300",
    moderada: "bg-yellow-100 text-yellow-800 border-yellow-300",
    baixa: "bg-red-100 text-red-800 border-red-300",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${styles[probability]}`}>
      {probability.charAt(0).toUpperCase() + probability.slice(1)}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    urgente: "bg-red-100 text-red-800 border-red-300",
    importante: "bg-orange-100 text-orange-800 border-orange-300",
    complementar: "bg-blue-100 text-blue-800 border-blue-300",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${styles[priority] || "bg-muted text-muted-foreground"}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

export default function AvaliacaoStep() {
  const { state, isLoading, generatePlan, goToStep } = useConsulta();
  const { assessmentData } = state;

  const [copiedParagraph, setCopiedParagraph] = useState(false);
  const [expandedHypothesis, setExpandedHypothesis] = useState<number | null>(0);

  if (!assessmentData) return null;

  const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Francois One', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={() => goToStep("objetivo")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao objetivo
        </button>
      </div>

      {/* Red flags assessment */}
      {assessmentData.red_flags_assessment && assessmentData.red_flags_assessment.length > 0 && (
        <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-4 animate-fade-in">
          <h4 className="flex items-center gap-2 text-destructive font-semibold text-base mb-2">
            <AlertTriangle className="h-5 w-5" />
            ⚠️ Alertas de Gravidade
          </h4>
          <ul className="space-y-1">
            {assessmentData.red_flags_assessment.map((rf, i) => (
              <li key={i} className="text-sm text-destructive/80 flex items-start gap-2">
                <span>•</span><span>{rf}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Diagnostic Hypotheses */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="bg-[#7B2FBE]/5 border-b border-border px-4 py-3">
          <h3 className="text-base font-semibold text-foreground">🧠 Hipóteses Diagnósticas</h3>
        </div>
        <div className="divide-y divide-border">
          {assessmentData.hypotheses.map((h, i) => {
            const isExpanded = expandedHypothesis === i;
            return (
              <div key={i} className="transition-colors hover:bg-muted/30">
                <button
                  onClick={() => setExpandedHypothesis(isExpanded ? null : i)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg font-bold text-[#7B2FBE] shrink-0">#{h.rank}</span>
                    <span className="text-sm font-semibold text-foreground truncate">{h.diagnosis}</span>
                    <ProbabilityBadge probability={h.probability} />
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 animate-fade-in">
                    <p className="text-sm text-muted-foreground">{h.reasoning}</p>
                    {h.criteria && (
                      <div className="bg-[#7B2FBE]/5 rounded-lg p-3">
                        <p className="text-xs font-semibold text-[#7B2FBE] mb-1">Critérios Diagnósticos</p>
                        <p className="text-sm text-foreground">{h.criteria}</p>
                      </div>
                    )}
                    {h.key_findings_for && h.key_findings_for.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-green-700 mb-1">✅ A favor</p>
                        <ul className="text-sm text-muted-foreground space-y-0.5">
                          {h.key_findings_for.map((f, j) => <li key={j}>• {f}</li>)}
                        </ul>
                      </div>
                    )}
                    {h.key_findings_against && h.key_findings_against.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-red-700 mb-1">❌ Contra</p>
                        <ul className="text-sm text-muted-foreground space-y-0.5">
                          {h.key_findings_against.map((f, j) => <li key={j}>• {f}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Exams */}
      {assessmentData.suggested_exams && assessmentData.suggested_exams.length > 0 && (
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="bg-[#7B2FBE]/5 border-b border-border px-4 py-3">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <FlaskConical className="h-4 w-4 text-[#7B2FBE]" />
              Exames Complementares Sugeridos
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {assessmentData.suggested_exams.map((e, i) => (
              <div key={i} className="flex items-start gap-3">
                <PriorityBadge priority={e.priority} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{e.exam}</p>
                  <p className="text-xs text-muted-foreground">{e.justification}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calculators */}
      {assessmentData.calculators && assessmentData.calculators.length > 0 && (
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="bg-[#7B2FBE]/5 border-b border-border px-4 py-3">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Calculator className="h-4 w-4 text-[#7B2FBE]" />
              Calculadoras / Escores Recomendados
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {assessmentData.calculators.map((c, i) => (
              <div key={i} className="bg-muted/30 rounded-lg p-3">
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.purpose}</p>
                {c.relevance && <p className="text-xs text-[#7B2FBE] mt-1">{c.relevance}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Differential summary / prontuário */}
      <div className="border-2 border-[#E8720C]/40 rounded-xl bg-[#FFF5EB] overflow-hidden">
        <div className="bg-[#E8720C]/10 border-b border-[#E8720C]/20 px-4 py-3 flex items-center justify-between">
          <h4 className="text-base font-semibold text-foreground">📝 Avaliação para Prontuário</h4>
          <button
            onClick={() => copyToClipboard(assessmentData.differential_summary, setCopiedParagraph)}
            className="flex items-center gap-1.5 text-xs bg-[#E8720C] text-white px-3 py-1.5 rounded-md hover:bg-[#D4841A] transition-colors"
          >
            {copiedParagraph ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedParagraph ? "Copiado!" : "Copiar para prontuário"}
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {assessmentData.differential_summary}
          </p>
        </div>
      </div>

      {/* Advance to Plano */}
      <button
        onClick={() => generatePlan()}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6A28A6] text-white font-semibold py-4 rounded-xl text-base sm:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Gerando plano terapêutico...
          </>
        ) : (
          <>
            Avançar para Plano
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </div>
  );
}
