import { Loader2, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { useConsulta } from "./ConsultaProvider";
import ChecklistGroup from "./ChecklistGroup";
import ObjetivoResumoBlock from "./ObjetivoResumoBlock";

export default function ObjetivoStep() {
  const {
    state,
    isLoading,
    updateObjetivoAnswer,
    setObjetivoFreeText,
    submitObjetivo,
    generateAssessment,
    goToStep,
  } = useConsulta();

  const { objetivoChecklist, objetivoAnswers, objetivoFreeText, objetivoSummary } = state;

  const answeredCount = Object.values(objetivoAnswers).filter(
    (a) => a.checked || a.value
  ).length;
  const totalCount = objetivoChecklist?.reduce((sum, g) => sum + g.items.length, 0) ?? 0;

  return (
    <div className="space-y-6" style={{ fontFamily: "'Francois One', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={() => goToStep("subjetivo")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao subjetivo
        </button>
        <span className="text-sm text-muted-foreground">
          {answeredCount}/{totalCount} preenchidos
        </span>
      </div>

      {/* Checklist groups */}
      {objetivoChecklist?.map((group) => (
        <ChecklistGroup
          key={group.id}
          group={group}
          answers={objetivoAnswers}
          onUpdate={updateObjetivoAnswer}
        />
      ))}

      {/* Free text */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="bg-[#7B2FBE]/5 border-b border-border px-4 py-3">
          <h3 className="text-base font-semibold text-foreground">
            ✏️ Observações Livres do Exame Físico
          </h3>
        </div>
        <div className="p-4">
          <textarea
            value={objetivoFreeText}
            onChange={(e) => setObjetivoFreeText(e.target.value)}
            placeholder="Descreva achados adicionais do exame físico..."
            rows={4}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 resize-y min-h-[80px]"
          />
        </div>
      </div>

      {/* Generate summary */}
      {!objetivoSummary && (
        <button
          onClick={submitObjetivo}
          disabled={isLoading || answeredCount === 0}
          className="w-full flex items-center justify-center gap-2 bg-[#E8720C] hover:bg-[#D4841A] text-white font-semibold py-4 rounded-xl text-base sm:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Gerando resumo do exame físico...
            </>
          ) : (
            <>
              <FileText className="h-5 w-5" />
              Gerar Resumo do Objetivo
            </>
          )}
        </button>
      )}

      {/* Summary */}
      {objetivoSummary && <ObjetivoResumoBlock summary={objetivoSummary} />}

      {/* Advance to Avaliação */}
      {objetivoSummary && (
        <button
          onClick={() => generateAssessment()}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6A28A6] text-white font-semibold py-4 rounded-xl text-base sm:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Gerando avaliação clínica...
            </>
          ) : (
            <>
              Avançar para Avaliação
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
