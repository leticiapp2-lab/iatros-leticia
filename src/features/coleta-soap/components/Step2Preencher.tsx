import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, Eraser, RefreshCw, FileText, Columns2, X, AlertTriangle, Eye, Check, CircleSlash, BookOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useColetaStore, useProgressoDetalhado } from "@/features/coleta-soap/store";
import { SECTION_META, type SectionId, type FieldType, type ParsedField } from "@/features/coleta-soap/types";
import FieldRenderer from "./FieldRenderer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TYPE_ORDER: Record<ParsedField["tipo"], number> = {
  tristate: 0,
  checkbox: 0,
  radio: 1,
  number: 2,
  text: 3,
  textarea: 4,
};

const ALL_SECTIONS = Object.entries(SECTION_META)
  .map(([id, meta]) => ({ id: id as SectionId, ...meta }))
  .sort((a, b) => a.order - b.order);

const TUTORIAL_KEY = "clinicalCompass.tutorialVisto";

export default function Step2Preencher() {
  const {
    fields, values, setValue, addManualField, removeField,
    limpar, gerarPrompt, contexto, textoOriginal, setTextoOriginal, reprocessar,
    setSectionChecked, clearSection,
  } = useColetaStore();
  const discarded = useColetaStore((s) => s.discarded);
  const lastSavedAt = useColetaStore((s) => s.lastSavedAt);
  const det = useProgressoDetalhado();

  const [openSection, setOpenSection] = useState<Record<SectionId, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ALL_SECTIONS.forEach((s, i) => (initial[s.id] = i < 3));
    return initial as Record<SectionId, boolean>;
  });
  const [twoPanel, setTwoPanel] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showDiscarded, setShowDiscarded] = useState(false);
  const [tutorialVisto, setTutorialVisto] = useState(true);
  const [savedAgo, setSavedAgo] = useState("agora");
  const raciocinioMd = useColetaStore((s) => s.raciocinioMd);
  const [showRaciocinio, setShowRaciocinio] = useState(true);
  const [raciocinioDrawer, setRaciocinioDrawer] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(TUTORIAL_KEY);
      if (!seen) {
        setTutorialVisto(false);
        localStorage.setItem(TUTORIAL_KEY, "1");
      }
    } catch {}
  }, []);

  // atualiza "salvo há X" a cada 5s
  useEffect(() => {
    const update = () => {
      if (!lastSavedAt) return setSavedAgo("—");
      const s = Math.floor((Date.now() - lastSavedAt) / 1000);
      if (s < 5) setSavedAgo("agora");
      else if (s < 60) setSavedAgo(`há ${s}s`);
      else if (s < 3600) setSavedAgo(`há ${Math.floor(s / 60)}min`);
      else setSavedAgo(`há ${Math.floor(s / 3600)}h`);
    };
    update();
    const t = setInterval(update, 5000);
    return () => clearInterval(t);
  }, [lastSavedAt]);

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

  // contagens por seção
  const sectionCounts = (secao: SectionId) => {
    const items = grouped[secao] ?? [];
    let pres = 0, aus = 0, np = 0;
    items.forEach((f) => {
      const v = values[f.id];
      if (f.tipo === "checkbox" || f.tipo === "tristate") {
        if (v?.checked === true) pres++;
        else if (v?.checked === false) aus++;
        else np++;
      } else if (f.tipo === "radio") {
        if (v?.selected === "Positivo") pres++;
        else if (v?.selected === "Negativo") aus++;
        else np++;
      } else {
        if (v?.value?.trim()) pres++;
        else np++;
      }
    });
    return { pres, aus, np };
  };

  // Achar a primeira seção com checkbox/tristate para mostrar o tutorial
  const firstCheckboxFieldId = useMemo(() => {
    for (const s of ALL_SECTIONS) {
      const items = grouped[s.id] ?? [];
      const first = items.find((f) => f.tipo === "checkbox" || f.tipo === "tristate");
      if (first) return first.id;
    }
    return null;
  }, [grouped]);

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
          {/* Barra de progresso rica */}
          <div className="border border-border rounded-xl bg-card p-3 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">
                  {det.filled} de {det.total} campos respondidos ({det.pct}%)
                </span>
                <span className="text-xs text-muted-foreground">
                  {det.secoesCompletas} de {totalSecoes} seções completas
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-[#7B2FBE] transition-all" style={{ width: `${det.pct}%` }} />
              </div>
            </div>
          </div>

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
            const counts = sectionCounts(s.id);
            const filledHere = (det.sectionsFilled.get(s.id) ?? 0);
            const totalHere = (det.sectionsTotal.get(s.id) ?? 0);
            const hasCheckbox = items.some((f) => f.tipo === "checkbox" || f.tipo === "tristate");
            return (
              <div key={s.id} className="border border-border rounded-xl bg-card overflow-hidden">
                <button
                  onClick={() => setOpenSection((p) => ({ ...p, [s.id]: !p[s.id] }))}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#7B2FBE]/5 hover:bg-[#7B2FBE]/10 transition-colors"
                >
                  <span className="font-semibold text-foreground text-sm sm:text-base flex items-center gap-2">
                    {s.title}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-card border border-border text-muted-foreground font-normal">
                      {filledHere}/{totalHere}
                    </span>
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="hidden sm:inline text-muted-foreground">
                      <span className="text-emerald-700 font-semibold">{counts.pres}</span> presentes ·{" "}
                      <span className="text-red-700 font-semibold">{counts.aus}</span> ausentes ·{" "}
                      <span>{counts.np}</span> não pesquisados
                    </span>
                    <ChevronDown
                      className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
                    />
                  </div>
                </button>
                {open && (
                  <div className="p-3 space-y-2">
                    {hasCheckbox && (
                      <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-border">
                        <button
                          onClick={() => setSectionChecked(s.id, false)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-semibold text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <CircleSlash className="h-3 w-3" />
                          Marcar todos como Ausentes
                        </button>
                        <button
                          onClick={() => setSectionChecked(s.id, true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                        >
                          <Check className="h-3 w-3" />
                          Marcar todos como Presentes
                        </button>
                        <button
                          onClick={() => clearSection(s.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
                        >
                          <Eraser className="h-3 w-3" />
                          Limpar seção
                        </button>
                      </div>
                    )}
                    {items.map((f) => (
                      <FieldRenderer
                        key={f.id}
                        field={f}
                        value={values[f.id]}
                        onChange={(patch) => setValue(f.id, patch)}
                        onRemove={() => removeField(f.id)}
                        tutorial={!tutorialVisto && f.id === firstCheckboxFieldId}
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
          <div className="text-2xl font-bold text-[#7B2FBE]">{det.pct}%</div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-[#7B2FBE] transition-all" style={{ width: `${det.pct}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {det.filled}/{det.total} campos · {det.secoesCompletas}/{totalSecoes} seções
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

      {showDiscarded && (
        <DiscardedModal items={discarded} onClose={() => setShowDiscarded(false)} />
      )}

      {/* Auto-save indicator */}
      <div className="fixed bottom-4 right-4 z-40 bg-card border border-border rounded-full shadow-md px-3 py-1.5 text-xs text-muted-foreground flex items-center gap-1.5">
        <Check className="h-3 w-3 text-emerald-600" />
        Salvo {savedAgo}
      </div>
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

function DiscardedModal({ items, onClose }: { items: string[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 grid place-items-center px-4">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-foreground">Itens descartados pelo parser</h3>
            <p className="text-xs text-muted-foreground">
              {items.length} linhas filtradas (referências, tabelas, explicações ou linhas curtas demais).
              Use "Adicionar item manual" para recuperar algum.
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 border border-border rounded-md bg-background">
          <ul className="divide-y divide-border">
            {items.map((it, i) => (
              <li key={i} className="px-3 py-2 text-xs font-mono text-muted-foreground break-words">
                {it}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-[#7B2FBE] text-white text-sm font-semibold hover:bg-[#6A28A6]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
