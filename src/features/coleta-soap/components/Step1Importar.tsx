import { useColetaStore } from "@/features/coleta-soap/store";
import { toast } from "sonner";
import { TEMPLATE_PROMPT_OPENEVIDENCE } from "@/lib/templates";
import { ClipboardCopy } from "lucide-react";

export default function Step1Importar() {
  const {
    contexto, setContexto, textoOriginal, setTextoOriginal, processarTexto,
    formatoInvalido,
  } = useColetaStore();

  const canProcess =
    contexto.idade.trim() &&
    contexto.sexo &&
    contexto.contexto &&
    contexto.queixaPrincipal.trim() &&
    textoOriginal.trim().length > 30;

  const handleProcess = () => {
    if (!canProcess) {
      toast.error("Preencha contexto, queixa principal e cole a resposta do OpenEvidence.");
      return;
    }
    const r = processarTexto();
    if (!r.ok) {
      toast.error("Formato inválido. Use o prompt-modelo (botão acima da caixa de texto).");
      return;
    }
    toast.success("Formulário gerado a partir do texto.");
  };

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(TEMPLATE_PROMPT_OPENEVIDENCE);
      toast.success("Prompt-modelo copiado. Cole no OpenEvidence para começar.");
    } catch {
      toast.error("Não foi possível copiar. Selecione e copie manualmente.");
    }
  };

  const inputCls =
    "w-full bg-card border border-border rounded-lg px-3 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40";
  const labelCls = "text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className={labelCls}>Idade</label>
          <input
            type="number"
            min={0}
            value={contexto.idade}
            onChange={(e) => setContexto({ idade: e.target.value })}
            placeholder="Ex: 54"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Sexo</label>
          <select
            value={contexto.sexo}
            onChange={(e) => setContexto({ sexo: e.target.value as never })}
            className={inputCls}
          >
            <option value="">Selecione…</option>
            <option>Masculino</option>
            <option>Feminino</option>
            <option>Outro</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Ocupação</label>
          <input
            type="text"
            value={contexto.ocupacao}
            onChange={(e) => setContexto({ ocupacao: e.target.value })}
            placeholder="Ex: Professora"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Contexto de atendimento</label>
          <select
            value={contexto.contexto}
            onChange={(e) => setContexto({ contexto: e.target.value as never })}
            className={inputCls}
          >
            <option value="">Selecione…</option>
            <option>Ambulatório</option>
            <option>Pronto-socorro</option>
            <option>Enfermaria</option>
            <option>Domicílio</option>
            <option>Telemedicina</option>
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <label className={labelCls}>Queixa Principal</label>
          <input
            type="text"
            value={contexto.queixaPrincipal}
            onChange={(e) => setContexto({ queixaPrincipal: e.target.value })}
            placeholder="Ex: dispepsia há 3 semanas"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
          <label className={labelCls + " mb-0"}>Resposta completa do OpenEvidence</label>
          <button
            type="button"
            onClick={handleCopyTemplate}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#7B2FBE] border border-[#7B2FBE]/30 hover:bg-[#7B2FBE]/10 transition-colors rounded-md px-3 py-1.5"
          >
            <ClipboardCopy className="h-3.5 w-3.5" />
            📋 Copiar prompt-modelo para o OpenEvidence
          </button>
        </div>
        <textarea
          value={textoOriginal}
          onChange={(e) => setTextoOriginal(e.target.value)}
          rows={18}
          placeholder="Cole aqui a resposta do OpenEvidence começando com <<<COLETA>>> e terminando com <<<FIM_RACIOCINIO>>>…"
          className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 resize-y min-h-[300px] font-mono leading-relaxed"
        />
        {formatoInvalido && (
          <p className="mt-2 text-xs text-destructive">
            O texto colado não está no formato esperado. Use o novo prompt-modelo (botão acima)
            ao iniciar sua conversa no OpenEvidence — a resposta precisa conter
            <code className="mx-1 px-1 bg-muted rounded">&lt;&lt;&lt;COLETA&gt;&gt;&gt;</code>
            e <code className="mx-1 px-1 bg-muted rounded">&lt;&lt;&lt;FIM_COLETA&gt;&gt;&gt;</code>.
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleProcess}
          disabled={!canProcess}
          className="bg-[#7B2FBE] hover:bg-[#6A28A6] text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          Processar e gerar formulário →
        </button>
      </div>
    </div>
  );
}
