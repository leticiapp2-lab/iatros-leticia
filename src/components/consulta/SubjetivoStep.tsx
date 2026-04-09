import { Loader2, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { useConsulta } from "./ConsultaProvider";
import ChecklistGroup from "./ChecklistGroup";
import ResumoBlock from "./ResumoBlock";

export default function SubjetivoStep() {
  const {
    state,
    isLoading,
    updateAnswer,
    setSubjetivoFreeText,
    submitSubjetivo,
    generateObjetivoChecklist,
    goToStep,
  } = useConsulta();

  const { subjetivoChecklist, subjetivoAnswers, subjetivoFreeText, subjetivoSummary } = state;

  const answeredCount = Object.values(subjetivoAnswers).filter(
    (a) => a.checked || a.value
  ).length;
  const totalCount = subjetivoChecklist?.reduce((sum, g) => sum + g.items.length, 0) ?? 0;

  return (
    <div className="space-y-6" style={{ fontFamily: "'Francois One', sans-serif" }}>
      {/* Header info */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={() => goToStep("entrada")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à entrada
        </button>
        <span className="text-sm text-muted-foreground">
          {answeredCount}/{totalCount} preenchidos
        </span>
      </div>

      {/* Checklist groups */}
      {subjetivoChecklist?.map((group) => (
        <ChecklistGroup
          key={group.id}
          group={group}
          answers={subjetivoAnswers}
          onUpdate={updateAnswer}
        />
      ))}

      {/* Free text */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="bg-[#7B2FBE]/5 border-b border-border px-4 py-3">
          <h3 className="text-base font-semibold text-foreground">
            ✏️ Observações Livres
          </h3>
        </div>
        <div className="p-4">
          <textarea
            value={subjetivoFreeText}
            onChange={(e) => setSubjetivoFreeText(e.target.value)}
            placeholder="Acrescente informações adicionais relevantes à anamnese..."
            rows={4}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 resize-y min-h-[80px]"
          />
        </div>
      </div>

      {/* Generate summary button */}
      {!subjetivoSummary && (
        <button
          onClick={submitSubjetivo}
          disabled={isLoading || answeredCount === 0}
          className="w-full flex items-center justify-center gap-2 bg-[#E8720C] hover:bg-[#D4841A] text-white font-semibold py-4 rounded-xl text-base sm:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Gerando resumo...
            </>
          ) : (
            <>
              <FileText className="h-5 w-5" />
              Gerar Resumo do Subjetivo
            </>
          )}
        </button>
      )}

      {/* Summary */}
      {subjetivoSummary && <ResumoBlock summary={subjetivoSummary} />}

      {/* Advance to Objetivo */}
      {subjetivoSummary && (
        <button
          onClick={() => generateObjetivoChecklist()}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6A28A6] text-white font-semibold py-4 rounded-xl text-base sm:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Gerando checklist do exame físico...
            </>
          ) : (
            <>
              Avançar para Objetivo
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
