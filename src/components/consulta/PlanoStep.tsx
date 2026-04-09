import { useState } from "react";
import { ArrowLeft, Copy, Check, AlertTriangle, Pill, Heart, CalendarCheck, Stethoscope } from "lucide-react";
import { useConsulta } from "./ConsultaProvider";

function UrgencyBadge({ urgency }: { urgency: string }) {
  const styles: Record<string, string> = {
    urgente: "bg-red-100 text-red-800 border-red-300",
    prioritario: "bg-orange-100 text-orange-800 border-orange-300",
    eletivo: "bg-blue-100 text-blue-800 border-blue-300",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${styles[urgency] || "bg-muted text-muted-foreground"}`}>
      {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
    </span>
  );
}

function MeasureIcon({ type }: { type: string }) {
  switch (type) {
    case "medicamentosa": return <Pill className="h-4 w-4 text-blue-600 shrink-0" />;
    case "nao_medicamentosa": return <Heart className="h-4 w-4 text-green-600 shrink-0" />;
    case "procedimento": return <Stethoscope className="h-4 w-4 text-purple-600 shrink-0" />;
    default: return null;
  }
}

export default function PlanoStep() {
  const { state, goToStep } = useConsulta();
  const { planData } = state;

  const [copiedParagraph, setCopiedParagraph] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);

  if (!planData) return null;

  const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build full SOAP text for copy
  const fullSOAP = [
    `SUBJETIVO:\n${state.subjetivoSummary?.prontuario_paragraph || ""}`,
    `\nOBJETIVO:\n${state.objetivoSummary?.prontuario_paragraph || ""}`,
    `\nAVALIAÇÃO:\n${state.assessmentData?.differential_summary || ""}`,
    `\nPLANO:\n${planData.prontuario_paragraph}`,
  ].join("\n");

  return (
    <div className="space-y-6" style={{ fontFamily: "'Francois One', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={() => goToStep("avaliacao")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à avaliação
        </button>
      </div>

      {/* Exams to request */}
      {planData.exams_to_request && planData.exams_to_request.length > 0 && (
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="bg-[#7B2FBE]/5 border-b border-border px-4 py-3">
            <h3 className="text-base font-semibold text-foreground">🔬 Exames a Solicitar</h3>
          </div>
          <div className="p-4 space-y-2">
            {planData.exams_to_request.map((e, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#7B2FBE] font-bold text-sm">•</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{e.exam}</p>
                  {e.justification && <p className="text-xs text-muted-foreground">{e.justification}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Therapeutic measures */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="bg-[#7B2FBE]/5 border-b border-border px-4 py-3">
          <h3 className="text-base font-semibold text-foreground">💊 Medidas Terapêuticas</h3>
        </div>
        <div className="p-4 space-y-3">
          {planData.therapeutic_measures.map((m, i) => (
            <div key={i} className="flex items-start gap-3 bg-muted/20 rounded-lg p-3">
              <MeasureIcon type={m.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{m.measure}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.details}</p>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 inline-block">
                  {m.type === "medicamentosa" ? "Medicamentosa" : m.type === "nao_medicamentosa" ? "Não-medicamentosa" : "Procedimento"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient orientations */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
          <h3 className="text-base font-semibold text-foreground">📢 Orientações ao Paciente</h3>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {planData.patient_orientations.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-green-600 font-bold shrink-0">✓</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Follow-up */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="bg-[#7B2FBE]/5 border-b border-border px-4 py-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <CalendarCheck className="h-4 w-4 text-[#7B2FBE]" />
            Seguimento
          </h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="bg-[#7B2FBE]/5 rounded-lg p-3">
            <p className="text-sm font-semibold text-[#7B2FBE]">Retorno em: {planData.follow_up.return_interval}</p>
          </div>

          {planData.follow_up.criteria_return_earlier && planData.follow_up.criteria_return_earlier.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-destructive mb-1 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                Retornar antes se:
              </p>
              <ul className="space-y-1">
                {planData.follow_up.criteria_return_earlier.map((c, i) => (
                  <li key={i} className="text-sm text-destructive/80 flex items-start gap-2">
                    <span>•</span><span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {planData.follow_up.monitoring_parameters && planData.follow_up.monitoring_parameters.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Parâmetros de monitorização:</p>
              <ul className="space-y-1">
                {planData.follow_up.monitoring_parameters.map((p, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span>📊</span><span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Referrals */}
      {planData.referrals && planData.referrals.length > 0 && (
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="bg-[#7B2FBE]/5 border-b border-border px-4 py-3">
            <h3 className="text-base font-semibold text-foreground">🏥 Encaminhamentos</h3>
          </div>
          <div className="p-4 space-y-3">
            {planData.referrals.map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <UrgencyBadge urgency={r.urgency} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{r.specialty}</p>
                  <p className="text-xs text-muted-foreground">{r.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan prontuário paragraph */}
      <div className="border-2 border-[#E8720C]/40 rounded-xl bg-[#FFF5EB] overflow-hidden">
        <div className="bg-[#E8720C]/10 border-b border-[#E8720C]/20 px-4 py-3 flex items-center justify-between">
          <h4 className="text-base font-semibold text-foreground">📝 Plano para Prontuário</h4>
          <button
            onClick={() => copyToClipboard(planData.prontuario_paragraph, setCopiedParagraph)}
            className="flex items-center gap-1.5 text-xs bg-[#E8720C] text-white px-3 py-1.5 rounded-md hover:bg-[#D4841A] transition-colors"
          >
            {copiedParagraph ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedParagraph ? "Copiado!" : "Copiar para prontuário"}
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {planData.prontuario_paragraph}
          </p>
        </div>
      </div>

      {/* Copy full SOAP */}
      <button
        onClick={() => copyToClipboard(fullSOAP, setCopiedFull)}
        className="w-full flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6A28A6] text-white font-semibold py-4 rounded-xl text-base sm:text-lg transition-colors shadow-md"
      >
        {copiedFull ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        {copiedFull ? "SOAP Completo Copiado!" : "Copiar SOAP Completo para Prontuário"}
      </button>
    </div>
  );
}
