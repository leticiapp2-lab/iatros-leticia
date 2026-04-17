import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ColetaSnapshot, ContextoClinico, FieldValue, ParsedField, SectionId } from "./types";
import { buildVitaisDefault, makeManualField, parseOpenEvidence } from "./parser";
import { buildSoapPrompt } from "./promptBuilder";

export type Step = 1 | 2 | 3;

interface ColetaState {
  step: Step;
  contexto: ContextoClinico;
  textoOriginal: string;
  fields: ParsedField[];
  values: Record<string, FieldValue>;
  prompt: string;
  history: ColetaSnapshot[];
  discarded: string[];
  lastSavedAt: number;

  setStep: (s: Step) => void;
  setContexto: (patch: Partial<ContextoClinico>) => void;
  setTextoOriginal: (t: string) => void;
  processarTexto: () => void;
  reprocessar: () => void;
  setValue: (id: string, patch: Partial<FieldValue>) => void;
  setSectionChecked: (secao: SectionId, checked: boolean | undefined) => void;
  clearSection: (secao: SectionId) => void;
  addManualField: (label: string, secao: SectionId, tipo: ParsedField["tipo"]) => void;
  removeField: (id: string) => void;
  limpar: () => void;
  gerarPrompt: () => string;
  novaColeta: () => void;
  salvarESnova: () => void;
  loadHistory: (id: string) => void;
}

const emptyContexto: ContextoClinico = {
  idade: "",
  sexo: "",
  ocupacao: "",
  contexto: "",
  queixaPrincipal: "",
};

const PERSIST_KEY = "clinicalCompass.coletaAtual";

function snapshotFrom(state: Pick<ColetaState, "contexto" | "textoOriginal" | "fields" | "values" | "prompt">): ColetaSnapshot {
  return {
    id: `c_${Date.now().toString(36)}`,
    createdAt: Date.now(),
    contexto: state.contexto,
    textoOriginal: state.textoOriginal,
    fields: state.fields,
    values: state.values,
    prompt: state.prompt,
  };
}

export const useColetaStore = create<ColetaState>()(
  persist(
    (set, get) => ({
      step: 1,
      contexto: emptyContexto,
      textoOriginal: "",
      fields: [],
      values: {},
      prompt: "",
      history: [],
      discarded: [],
      lastSavedAt: 0,

      setStep: (s) => set({ step: s }),
      setContexto: (patch) => set({ contexto: { ...get().contexto, ...patch }, lastSavedAt: Date.now() }),
      setTextoOriginal: (t) => set({ textoOriginal: t, lastSavedAt: Date.now() }),

      processarTexto: () => {
        const { fields, discarded } = parseOpenEvidence(get().textoOriginal);
        const hasVitais = fields.some((f) => f.secao === "vitais");
        const all = hasVitais ? fields : [...fields, ...buildVitaisDefault()];
        set({ fields: all, values: {}, step: 2, discarded, lastSavedAt: Date.now() });
      },

      reprocessar: () => {
        const { fields, discarded } = parseOpenEvidence(get().textoOriginal);
        const hasVitais = fields.some((f) => f.secao === "vitais");
        const all = hasVitais ? fields : [...fields, ...buildVitaisDefault()];
        const oldValues = get().values;
        const oldFields = get().fields;
        const labelMap = new Map(oldFields.map((f) => [f.label.toLowerCase() + "|" + f.secao, oldValues[f.id]]));
        const newValues: Record<string, FieldValue> = {};
        all.forEach((f) => {
          const v = labelMap.get(f.label.toLowerCase() + "|" + f.secao);
          if (v) newValues[f.id] = v;
        });
        set({ fields: all, values: newValues, discarded, lastSavedAt: Date.now() });
      },

      setValue: (id, patch) =>
        set({
          values: { ...get().values, [id]: { ...get().values[id], ...patch } },
          lastSavedAt: Date.now(),
        }),

      setSectionChecked: (secao, checked) => {
        const { fields, values } = get();
        const next = { ...values };
        fields
          .filter((f) => f.secao === secao && f.tipo === "checkbox")
          .forEach((f) => {
            next[f.id] = { ...next[f.id], checked };
          });
        set({ values: next, lastSavedAt: Date.now() });
      },

      clearSection: (secao) => {
        const { fields, values } = get();
        const next = { ...values };
        fields
          .filter((f) => f.secao === secao)
          .forEach((f) => {
            delete next[f.id];
          });
        set({ values: next, lastSavedAt: Date.now() });
      },

      addManualField: (label, secao, tipo) =>
        set({ fields: [...get().fields, makeManualField(label, secao, tipo)], lastSavedAt: Date.now() }),

      removeField: (id) => {
        const { [id]: _, ...rest } = get().values;
        set({ fields: get().fields.filter((f) => f.id !== id), values: rest, lastSavedAt: Date.now() });
      },

      limpar: () => set({ values: {}, lastSavedAt: Date.now() }),

      gerarPrompt: () => {
        const { contexto, fields, values } = get();
        const prompt = buildSoapPrompt({ contexto, fields, values });
        const snap = snapshotFrom({ ...get(), prompt });
        const history = [snap, ...get().history].slice(0, 10);
        set({ prompt, step: 3, history, lastSavedAt: Date.now() });
        return prompt;
      },

      novaColeta: () => {
        try {
          // Apaga state persistido para garantir reset completo
          const raw = localStorage.getItem(PERSIST_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            // preserva histórico
            const preservedHistory = parsed?.state?.history ?? get().history;
            set({
              step: 1,
              contexto: emptyContexto,
              textoOriginal: "",
              fields: [],
              values: {},
              prompt: "",
              discarded: [],
              history: preservedHistory,
              lastSavedAt: Date.now(),
            });
            return;
          }
        } catch {
          // ignore
        }
        set({
          step: 1,
          contexto: emptyContexto,
          textoOriginal: "",
          fields: [],
          values: {},
          prompt: "",
          discarded: [],
          lastSavedAt: Date.now(),
        });
      },

      salvarESnova: () => {
        const { contexto, fields, values, textoOriginal, prompt, history } = get();
        // só salva se houver algum dado significativo
        const hasData = textoOriginal.trim() || fields.length || contexto.queixaPrincipal.trim();
        let nextHistory = history;
        if (hasData) {
          const snap = snapshotFrom({ contexto, textoOriginal, fields, values, prompt });
          nextHistory = [snap, ...history].slice(0, 10);
        }
        set({
          step: 1,
          contexto: emptyContexto,
          textoOriginal: "",
          fields: [],
          values: {},
          prompt: "",
          discarded: [],
          history: nextHistory,
          lastSavedAt: Date.now(),
        });
      },

      loadHistory: (id) => {
        const snap = get().history.find((s) => s.id === id);
        if (!snap) return;
        set({
          step: 3,
          contexto: snap.contexto,
          textoOriginal: snap.textoOriginal,
          fields: snap.fields,
          values: snap.values,
          prompt: snap.prompt ?? buildSoapPrompt({ contexto: snap.contexto, fields: snap.fields, values: snap.values }),
          lastSavedAt: Date.now(),
        });
      },
    }),
    {
      name: PERSIST_KEY,
      partialize: (s) => ({
        step: s.step,
        contexto: s.contexto,
        textoOriginal: s.textoOriginal,
        fields: s.fields,
        values: s.values,
        prompt: s.prompt,
        history: s.history,
        discarded: s.discarded,
      }),
    },
  ),
);

export function useProgresso(): number {
  const fields = useColetaStore((s) => s.fields);
  const values = useColetaStore((s) => s.values);
  if (!fields.length) return 0;
  const filled = fields.filter((f) => {
    const v = values[f.id];
    if (!v) return false;
    if (f.tipo === "checkbox") return v.checked !== undefined;
    if (f.tipo === "radio") return Boolean(v.selected);
    return Boolean(v.value?.trim());
  }).length;
  return Math.round((filled / fields.length) * 100);
}

export function useProgressoDetalhado() {
  const fields = useColetaStore((s) => s.fields);
  const values = useColetaStore((s) => s.values);
  const total = fields.length;
  let filled = 0;
  const sectionsTotal = new Map<SectionId, number>();
  const sectionsFilled = new Map<SectionId, number>();
  fields.forEach((f) => {
    sectionsTotal.set(f.secao, (sectionsTotal.get(f.secao) ?? 0) + 1);
    const v = values[f.id];
    let isFilled = false;
    if (v) {
      if (f.tipo === "checkbox") isFilled = v.checked !== undefined;
      else if (f.tipo === "radio") isFilled = Boolean(v.selected);
      else isFilled = Boolean(v.value?.trim());
    }
    if (isFilled) {
      filled++;
      sectionsFilled.set(f.secao, (sectionsFilled.get(f.secao) ?? 0) + 1);
    }
  });
  let secoesCompletas = 0;
  sectionsTotal.forEach((tot, sec) => {
    if ((sectionsFilled.get(sec) ?? 0) === tot && tot > 0) secoesCompletas++;
  });
  return {
    total,
    filled,
    pct: total ? Math.round((filled / total) * 100) : 0,
    secoesCompletas,
    sectionsFilled,
    sectionsTotal,
  };
}
