import { useColetaStore } from "@/features/coleta-soap/store";
import { toast } from "sonner";

export default function Step1Importar() {
  const { contexto, setContexto, textoOriginal, setTextoOriginal, processarTexto } =
    useColetaStore();

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
    processarTexto();
    toast.success("Formulário gerado a partir do texto.");
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
        <label className={labelCls}>Resposta completa do OpenEvidence</label>
        <textarea
          value={textoOriginal}
          onChange={(e) => setTextoOriginal(e.target.value)}
          rows={18}
          placeholder="Cole aqui a resposta completa do OpenEvidence contendo perguntas sugeridas, escalas, exames físicos e complementares…"
          className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 resize-y min-h-[300px] font-mono leading-relaxed"
        />
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
