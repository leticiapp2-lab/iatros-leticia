import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { useConsulta } from "./ConsultaProvider";
import type { ConsultationType, EntradaData } from "./types";

export default function EntradaStep() {
  const { submitEntrada, isLoading } = useConsulta();
  const [type, setType] = useState<ConsultationType>("primeira");

  // Primeira consulta
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [duration, setDuration] = useState("");

  // Retorno
  const [previousSoap, setPreviousSoap] = useState("");
  const [returnUpdate, setReturnUpdate] = useState("");
  const [newComplaint, setNewComplaint] = useState("");
  const [evolution, setEvolution] = useState("");

  const canSubmit =
    type === "primeira"
      ? sex && age && chiefComplaint && duration
      : previousSoap && returnUpdate;

  const handleSubmit = () => {
    if (!canSubmit || isLoading) return;

    const data: EntradaData =
      type === "primeira"
        ? { consultationType: type, sex, age, chiefComplaint, duration }
        : { consultationType: type, previousSoap, returnUpdate, newComplaint, evolution };

    submitEntrada(data);
  };

  const inputClass =
    "w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 transition-all";
  const labelClass = "text-sm font-semibold text-foreground mb-1.5 block";

  return (
    <div className="space-y-6" style={{ fontFamily: "'Francois One', sans-serif" }}>
      {/* Toggle */}
      <div className="flex rounded-lg overflow-hidden border-2 border-[#7B2FBE]/30">
        {(["primeira", "retorno"] as ConsultationType[]).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`flex-1 py-3 text-sm sm:text-base font-semibold transition-colors ${
              type === t
                ? "bg-[#7B2FBE] text-white"
                : "bg-card text-foreground hover:bg-muted"
            }`}
          >
            {t === "primeira" ? "🩺 Primeira Consulta" : "🔄 Consulta de Retorno"}
          </button>
        ))}
      </div>

      {type === "primeira" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Sexo</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className={inputClass}
            >
              <option value="">Selecione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Idade</label>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ex: 45 anos"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Queixa Principal</label>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="Ex: Dor torácica à esquerda"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Tempo de Evolução</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ex: 3 dias"
              className={inputClass}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>SOAP Anterior / Resumo da Consulta Anterior</label>
            <textarea
              value={previousSoap}
              onChange={(e) => setPreviousSoap(e.target.value)}
              placeholder="Cole aqui o SOAP anterior ou faça um resumo..."
              rows={5}
              className={inputClass + " min-h-[120px] resize-y"}
            />
          </div>
          <div>
            <label className={labelClass}>Atualização do Retorno</label>
            <textarea
              value={returnUpdate}
              onChange={(e) => setReturnUpdate(e.target.value)}
              placeholder="O que o paciente relata nos primeiros minutos..."
              rows={3}
              className={inputClass + " min-h-[80px] resize-y"}
            />
          </div>
          <div>
            <label className={labelClass}>Nova Queixa (se houver)</label>
            <input
              type="text"
              value={newComplaint}
              onChange={(e) => setNewComplaint(e.target.value)}
              placeholder="Opcional"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Evolução desde a última consulta</label>
            <textarea
              value={evolution}
              onChange={(e) => setEvolution(e.target.value)}
              placeholder="Melhora, piora, novos sintomas..."
              rows={2}
              className={inputClass + " min-h-[60px] resize-y"}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || isLoading}
        className="w-full flex items-center justify-center gap-2 bg-[#7B2FBE] hover:bg-[#6A28A6] text-white font-semibold py-4 rounded-xl text-base sm:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Gerando checklist...
          </>
        ) : (
          <>
            Iniciar Subjetivo
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </div>
  );
}
