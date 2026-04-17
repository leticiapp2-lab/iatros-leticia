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

  setStep: (s: Step) => void;
  setContexto: (patch: Partial<ContextoClinico>) => void;
  setTextoOriginal: (t: string) => void;
  processarTexto: () => void;
  reprocessar: () => void;
  setValue: (id: string, patch: Partial<FieldValue>) => void;
  addManualField: (label: string, secao: SectionId, tipo: ParsedField["tipo"]) => void;
  removeField: (id: string) => void;
  limpar: () => void;
  gerarPrompt: () => string;
  novaColeta: () => void;
  loadHistory: (id: string) => void;
}

const emptyContexto: ContextoClinico = {
  idade: "",
  sexo: "",
  ocupacao: "",
  contexto: "",
  queixaPrincipal: "",
};

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

      setStep: (s) => set({ step: s }),
      setContexto: (patch) => set({ contexto: { ...get().contexto, ...patch } }),
      setTextoOriginal: (t) => set({ textoOriginal: t }),

      processarTexto: () => {
        const { fields, discarded } = parseOpenEvidence(get().textoOriginal);
        const hasVitais = fields.some((f) => f.secao === "vitais");
        const all = hasVitais ? fields : [...fields, ...buildVitaisDefault()];
        set({ fields: all, values: {}, step: 2, discarded });
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
        set({ fields: all, values: newValues, discarded });
      },

      setValue: (id, patch) =>
        set({ values: { ...get().values, [id]: { ...get().values[id], ...patch } } }),

      addManualField: (label, secao, tipo) =>
        set({ fields: [...get().fields, makeManualField(label, secao, tipo)] }),

      removeField: (id) => {
        const { [id]: _, ...rest } = get().values;
        set({ fields: get().fields.filter((f) => f.id !== id), values: rest });
      },

      limpar: () => set({ values: {} }),

      gerarPrompt: () => {
        const { contexto, fields, values } = get();
        const prompt = buildSoapPrompt({ contexto, fields, values });
        // salva no histórico
        const snap: ColetaSnapshot = {
          id: `c_${Date.now().toString(36)}`,
          createdAt: Date.now(),
          contexto,
          textoOriginal: get().textoOriginal,
          fields,
          values,
          prompt,
        };
        const history = [snap, ...get().history].slice(0, 10);
        set({ prompt, step: 3, history });
        return prompt;
      },

      novaColeta: () =>
        set({
          step: 1,
          contexto: emptyContexto,
          textoOriginal: "",
          fields: [],
          values: {},
          prompt: "",
          discarded: [],
        }),

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
        });
      },
    }),
    {
      name: "clinicalCompass.coletaAtual",
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
