import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import type {
  ConsultaState,
  ConsultaStep,
  EntradaData,
  ChecklistGroupData,
  ChecklistAnswer,
  SubjectiveSummary,
} from "./types";

const CONSULTA_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/consulta-ai`;

interface ConsultaContextValue {
  state: ConsultaState;
  isLoading: boolean;
  submitEntrada: (data: EntradaData) => Promise<void>;
  updateAnswer: (itemId: string, answer: Partial<ChecklistAnswer>) => void;
  setSubjetivoFreeText: (text: string) => void;
  submitSubjetivo: () => Promise<void>;
  goToStep: (step: ConsultaStep) => void;
  reset: () => void;
}

const initialState: ConsultaState = {
  currentStep: "entrada",
  entrada: null,
  subjetivoChecklist: null,
  subjetivoAnswers: {},
  subjetivoFreeText: "",
  subjetivoSummary: null,
};

const ConsultaContext = createContext<ConsultaContextValue | null>(null);

async function callConsultaAI(action: string, data: any) {
  const resp = await fetch(CONSULTA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ action, data }),
  });

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
    if (resp.status === 429) throw new Error("Limite de requisições excedido. Aguarde alguns instantes.");
    if (resp.status === 402) throw new Error("Créditos insuficientes para o serviço de IA.");
    throw new Error(body.error || "Erro ao processar requisição.");
  }

  return resp.json();
}

export function ConsultaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConsultaState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const submitEntrada = useCallback(async (data: EntradaData) => {
    setIsLoading(true);
    try {
      const result: { groups: ChecklistGroupData[] } = await callConsultaAI(
        "generate-subjective-checklist",
        data
      );
      setState((s) => ({
        ...s,
        entrada: data,
        subjetivoChecklist: result.groups,
        subjetivoAnswers: {},
        subjetivoFreeText: "",
        subjetivoSummary: null,
        currentStep: "subjetivo",
      }));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAnswer = useCallback((itemId: string, partial: Partial<ChecklistAnswer>) => {
    setState((s) => ({
      ...s,
      subjetivoAnswers: {
        ...s.subjetivoAnswers,
        [itemId]: {
          ...(s.subjetivoAnswers[itemId] || { itemId, checked: false }),
          ...partial,
          itemId,
        },
      },
    }));
  }, []);

  const setSubjetivoFreeText = useCallback((text: string) => {
    setState((s) => ({ ...s, subjetivoFreeText: text }));
  }, []);

  const submitSubjetivo = useCallback(async () => {
    setIsLoading(true);
    try {
      // Build answers with question text for context
      const answersWithQuestions = Object.values(state.subjetivoAnswers)
        .filter((a) => a.checked || a.value)
        .map((a) => {
          const question = state.subjetivoChecklist
            ?.flatMap((g) => g.items)
            .find((i) => i.id === a.itemId)?.question;
          return { question, checked: a.checked, value: a.value };
        });

      const result: SubjectiveSummary = await callConsultaAI("generate-subjective-summary", {
        sex: state.entrada?.sex,
        age: state.entrada?.age,
        chiefComplaint: state.entrada?.chiefComplaint,
        duration: state.entrada?.duration,
        answers: answersWithQuestions,
        freeText: state.subjetivoFreeText,
      });

      setState((s) => ({ ...s, subjetivoSummary: result }));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [state.subjetivoAnswers, state.subjetivoChecklist, state.subjetivoFreeText, state.entrada]);

  const goToStep = useCallback((step: ConsultaStep) => {
    setState((s) => ({ ...s, currentStep: step }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <ConsultaContext.Provider
      value={{
        state,
        isLoading,
        submitEntrada,
        updateAnswer,
        setSubjetivoFreeText,
        submitSubjetivo,
        goToStep,
        reset,
      }}
    >
      {children}
    </ConsultaContext.Provider>
  );
}

export function useConsulta() {
  const ctx = useContext(ConsultaContext);
  if (!ctx) throw new Error("useConsulta must be used within ConsultaProvider");
  return ctx;
}
