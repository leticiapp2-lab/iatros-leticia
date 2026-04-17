import { useMemo, useState } from "react";
import { ChevronDown, Plus, Eraser, RefreshCw, FileText, Columns2, X, AlertTriangle, Eye } from "lucide-react";
import { useColetaStore, useProgresso } from "@/features/coleta-soap/store";
import { SECTION_META, type SectionId, type FieldType, type ParsedField } from "@/features/coleta-soap/types";
import FieldRenderer from "./FieldRenderer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TYPE_ORDER: Record<ParsedField["tipo"], number> = {
  checkbox: 0,
  radio: 1,
  number: 2,
  text: 3,
  textarea: 4,
};

const ALL_SECTIONS = Object.entries(SECTION_META)
  .map(([id, meta]) => ({ id: id as SectionId, ...meta }))
  .sort((a, b) => a.order - b.order);

export default function Step2Preencher() {
  const {
    fields, values, setValue, addManualField, removeField,
    limpar, gerarPrompt, contexto, textoOriginal, setTextoOriginal, reprocessar,
  } = useColetaStore();
  const discarded = useColetaStore((s) => s.discarded);
  const progresso = useProgresso();

  const [openSection, setOpenSection] = useState<Record<SectionId, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ALL_SECTIONS.forEach((s, i) => (initial[s.id] = i < 3));
    return initial as Record<SectionId, boolean>;
  });
  const [twoPanel, setTwoPanel] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showDiscarded, setShowDiscarded] = useState(false);

  const grouped = useMemo(() => {
    const map: Record<SectionId, ParsedField[]> = {} as never;
    ALL_SECTIONS.forEach((s) => (map[s.id] = []));
    fields.forEach((f) => {
      (map[f.secao] ??= []).push(f);
    });
    Object.keys(map).forEach((k) => {
      map[k as SectionId].sort((a, b) => TYPE_ORDER[a.tipo] - TYPE_ORDER[b.tipo]);
    });
    return map;
  }, [fields]);

  const totalSecoes = ALL_SECTIONS.filter((s) => grouped[s.id]?.length).length;

  const handleGerar = () => {
    const vSinaisPreenchido = fields.some(
      (f) => f.secao === "vitais" && (values[f.id]?.value?.trim() ?? "").length,
    );
    if (!contexto.queixaPrincipal.trim() || !contexto.idade.trim() || !contexto.sexo) {
      toast.error("Volte à Etapa 1 e preencha idade, sexo e queixa principal.");
      return;
    }
    if (!vSinaisPreenchido) {
      toast.error("Preencha ao menos um sinal vital antes de gerar o prompt.");
      return;
    }
    gerarPrompt();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      {/* Conteúdo principal */}
      <div className={cn("space-y-3", twoPanel && "lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0")}>
        {twoPanel && (
          <div className="lg:order-1">
            <div className="border border-border rounded-xl bg-card overflow-hidden h-full flex flex-col">
              <div className="px-4 py-2.5 bg-muted border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Texto original do OpenEvidence
                </span>
                <button
                  onClick={() => { reprocessar(); toast.success("Parser reexecutado."); }}
                  className="flex items-center gap-1 text-xs text-[#7B2FBE] hover:underline"
                >
                  <RefreshCw className="h-3 w-3" /> Reprocessar
                </button>
              </div>
              <textarea
                value={textoOriginal}
                onChange={(e) => setTextoOriginal(e.target.value)}
                className="flex-1 w-full bg-card px-4 py-3 text-xs font-mono leading-relaxed outline-none resize-none min-h-[600px]"
              />
            </div>
          </div>
        )}

        <div className={cn("space-y-3", twoPanel && "lg:order-2")}>
          {fields.length > 80 && (
            <div className="flex items-start gap-3 border border-yellow-500/40 bg-yellow-500/10 rounded-xl p-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm text-foreground">
                <p className="font-semibold mb-0.5">O parser detectou {fields.length} campos.</p>
                <p className="text-muted-foreground">
                  Recomendamos revisar o texto colado — talvez haja tabelas ou referências que precisem ser removidas manualmente.
                </p>
              </div>
            </div>
          )}

          {discarded.length > 0 && (
            <button
              onClick={() => setShowDiscarded(true)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              Ver itens descartados ({discarded.length})
            </button>
          )}

          {ALL_SECTIONS.map((s) => {
            const items = grouped[s.id] ?? [];
            if (!items.length) return null;
            const open = openSection[s.id];
            return (
              <div key={s.id} className="border border-border rounded-xl bg-card overflow-hidden">
                <button
                  onClick={() => setOpenSection((p) => ({ ...p, [s.id]: !p[s.id] }))}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#7B2FBE]/5 hover:bg-[#7B2FBE]/10 transition-colors"
                >
                  <span className="font-semibold text-foreground text-sm sm:text-base">
                    {s.title}{" "}
                    <span className="text-xs text-muted-foreground font-normal">({items.length})</span>
                  </span>
                  <ChevronDown
                    className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
                  />
                </button>
                {open && (
                  <div className="p-3 space-y-2">
                    {items.map((f, idx) => (
                      <FieldRenderer
                        key={f.id}
                        field={f}
                        value={values[f.id]}
                        onChange={(patch) => setValue(f.id, patch)}
                        onRemove={() => removeField(f.id)}
                        showLegend={idx === 0 && f.tipo === "checkbox"}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {!fields.length && (
            <div className="border border-dashed border-border rounded-xl p-10 text-center text-muted-foreground">
              Nenhum campo gerado. Volte à Etapa 1 e cole a resposta do OpenEvidence.
            </div>
          )}

          <button
            onClick={handleGerar}
            disabled={!fields.length}
            className="w-full flex items-center justify-center gap-2 bg-[#E8720C] hover:bg-[#D4841A] text-white font-semibold py-4 rounded-xl text-base sm:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-4"
          >
            <FileText className="h-5 w-5" />
            Gerar Prompt SOAP
          </button>
        </div>
      </div>

      {/* Sidebar sticky */}
      <aside className="lg:sticky lg:top-4 lg:self-start space-y-3">
        <div className="border border-border rounded-xl bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Progresso
          </p>
          <div className="text-2xl font-bold text-[#7B2FBE]">{progresso}%</div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-[#7B2FBE] transition-all" style={{ width: `${progresso}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {fields.length} campos em {totalSecoes} seções
          </p>
        </div>

        <button
          onClick={() => setTwoPanel((x) => !x)}
          className="w-full flex items-center justify-center gap-2 border border-border bg-card hover:bg-muted text-foreground text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          <Columns2 className="h-4 w-4" />
          {twoPanel ? "Ocultar texto" : "Modo 2 painéis"}
        </button>

        <button
          onClick={() => setShowAdd(true)}
          className="w-full flex items-center justify-center gap-2 border border-border bg-card hover:bg-muted text-foreground text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Adicionar item manual
        </button>

        <button
          onClick={() => { reprocessar(); toast.success("Parser reexecutado."); }}
          className="w-full flex items-center justify-center gap-2 border border-border bg-card hover:bg-muted text-foreground text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Reprocessar parser
        </button>

        <button
          onClick={() => {
            if (confirm("Limpar todas as respostas preenchidas?")) {
              limpar();
              toast.success("Respostas limpas.");
            }
          }}
          className="w-full flex items-center justify-center gap-2 border border-destructive/30 bg-card hover:bg-destructive/5 text-destructive text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          <Eraser className="h-4 w-4" />
          Limpar formulário
        </button>
      </aside>

      {showAdd && (
        <AddFieldModal
          onClose={() => setShowAdd(false)}
          onAdd={(label, secao, tipo) => {
            addManualField(label, secao, tipo);
            toast.success("Campo adicionado.");
            setOpenSection((p) => ({ ...p, [secao]: true }));
          }}
        />
      )}
    </div>
  );
}

function AddFieldModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (label: string, secao: SectionId, tipo: FieldType) => void;
}) {
  const [label, setLabel] = useState("");
  const [secao, setSecao] = useState<SectionId>("hda");
  const [tipo, setTipo] = useState<FieldType>("text");

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 grid place-items-center px-4">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-foreground">Adicionar campo manual</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
              Pergunta / Item
            </label>
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                Seção
              </label>
              <select
                value={secao}
                onChange={(e) => setSecao(e.target.value as SectionId)}
                className="w-full bg-background border border-border rounded-md px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40"
              >
                {ALL_SECTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                Tipo
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as FieldType)}
                className="w-full bg-background border border-border rounded-md px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40"
              >
                <option value="checkbox">Checkbox</option>
                <option value="text">Texto curto</option>
                <option value="number">Número</option>
                <option value="radio">Radio (Pos/Neg/NR)</option>
                <option value="textarea">Texto longo</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-border text-sm font-semibold hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            disabled={!label.trim()}
            onClick={() => {
              onAdd(label.trim(), secao, tipo);
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-[#7B2FBE] text-white text-sm font-semibold hover:bg-[#6A28A6] disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
