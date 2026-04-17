import { Copy, Download, ArrowLeft, RotateCcw, FileText } from "lucide-react";
import { useColetaStore } from "@/features/coleta-soap/store";
import { toast } from "sonner";

export default function Step3Prompt() {
  const { prompt, setStep, novaColeta, contexto, fields, values } = useColetaStore();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success("Prompt copiado para a área de transferência.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([prompt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coleta-soap-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNova = () => {
    if (confirm("Iniciar nova coleta? Os dados atuais serão limpos.")) {
      novaColeta();
      toast.success("Pronto para nova coleta.");
    }
  };

  // resumo simples: contar checkboxes positivos por seção, valores numéricos preenchidos
  const positivos = fields
    .filter((f) => f.tipo === "checkbox" && values[f.id]?.checked === true)
    .map((f) => f.label);
  const numericos = fields
    .filter((f) => f.tipo === "number" && values[f.id]?.value?.trim())
    .slice(0, 6);
  const manobrasPos = fields
    .filter((f) => f.tipo === "radio" && values[f.id]?.selected === "Positivo")
    .map((f) => f.label);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-[#7B2FBE] hover:bg-[#6A28A6] text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <Copy className="h-4 w-4" /> Copiar prompt
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 border border-border bg-card hover:bg-muted text-foreground font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <Download className="h-4 w-4" /> Baixar .txt
        </button>
        <button
          onClick={() => setStep(2)}
          className="flex items-center gap-2 border border-border bg-card hover:bg-muted text-foreground font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar e editar
        </button>
        <button
          onClick={handleNova}
          className="flex items-center gap-2 border border-destructive/30 bg-card hover:bg-destructive/5 text-destructive font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Nova coleta
        </button>
      </div>

      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="px-4 py-2.5 bg-muted border-b border-border flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#7B2FBE]" />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Prompt SOAP — colar de volta no OpenEvidence
          </span>
        </div>
        <pre className="px-4 py-4 text-xs sm:text-sm font-mono leading-relaxed text-foreground whitespace-pre-wrap break-words max-h-[60vh] overflow-auto">
          {prompt}
        </pre>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Pré-visualização da coleta
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SummaryCard title="Contexto">
            <p>
              {contexto.idade} anos, {contexto.sexo}
              {contexto.ocupacao && `, ${contexto.ocupacao}`}
            </p>
            <p className="text-muted-foreground text-xs mt-1">{contexto.contexto}</p>
            <p className="mt-2 text-xs">
              <strong>QP:</strong> {contexto.queixaPrincipal}
            </p>
          </SummaryCard>
          <SummaryCard title={`Achados positivos (${positivos.length})`}>
            {positivos.length ? (
              <ul className="space-y-1 text-xs">
                {positivos.slice(0, 6).map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
                {positivos.length > 6 && (
                  <li className="text-muted-foreground">… +{positivos.length - 6}</li>
                )}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">Nenhum.</p>
            )}
          </SummaryCard>
          <SummaryCard title={`Mensuráveis & Manobras+ (${numericos.length + manobrasPos.length})`}>
            <ul className="space-y-1 text-xs">
              {numericos.map((f) => (
                <li key={f.id}>
                  <strong>{f.label}:</strong> {values[f.id]?.value} {f.unidade}
                </li>
              ))}
              {manobrasPos.map((m, i) => (
                <li key={`m${i}`}>• {m} <span className="text-[#E8720C] font-semibold">(+)</span></li>
              ))}
              {!numericos.length && !manobrasPos.length && (
                <li className="text-muted-foreground">Nenhum.</li>
              )}
            </ul>
          </SummaryCard>
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          Esta é apenas uma pré-visualização dos dados coletados — a Avaliação e o Plano serão
          preenchidos pelo OpenEvidence ao receber o prompt acima.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-lg bg-card p-3">
      <p className="text-xs font-semibold text-[#7B2FBE] uppercase tracking-wide mb-2">{title}</p>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}
