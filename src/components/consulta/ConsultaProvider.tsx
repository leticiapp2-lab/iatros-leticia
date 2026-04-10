import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import type {
  ConsultaState,
  ConsultaStep,
  EntradaData,
  ChecklistGroupData,
  ChecklistAnswer,
  SubjectiveSummary,
  ObjectiveSummary,
  AssessmentData,
  PlanData,
} from "./types";

const CONSULTA_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/consulta-ai`;

interface ConsultaContextValue {
  state: ConsultaState;
  isLoading: boolean;
  submitEntrada: (data: EntradaData) => Promise<void>;
  updateAnswer: (itemId: string, answer: Partial<ChecklistAnswer>) => void;
  setSubjetivoFreeText: (text: string) => void;
  submitSubjetivo: () => Promise<void>;
  updateObjetivoAnswer: (itemId: string, answer: Partial<ChecklistAnswer>) => void;
  setObjetivoFreeText: (text: string) => void;
  generateObjetivoChecklist: () => Promise<void>;
  submitObjetivo: () => Promise<void>;
  generateAssessment: () => Promise<void>;
  generatePlan: () => Promise<void>;
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
  objetivoChecklist: null,
  objetivoAnswers: {},
  objetivoFreeText: "",
  objetivoSummary: null,
  assessmentData: null,
  planData: null,
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

  // Helper to get summary texts
  const getSubjectiveSummaryText = useCallback(() => {
    return state.subjetivoSummary?.structured_summary
      .map((s) => `${s.category}: ${s.content}`)
      .join("\n") ?? "";
  }, [state.subjetivoSummary]);

  const getObjectiveSummaryText = useCallback(() => {
    return state.objetivoSummary?.structured_summary
      .map((s) => `${s.category}: ${s.content}`)
      .join("\n") ?? "";
  }, [state.objetivoSummary]);

  const submitEntrada = useCallback(async (data: EntradaData) => {
    setIsLoading(true);
    try {
      const result: { groups: ChecklistGroupData[] } = await callConsultaAI("generate-subjective-checklist", data);
      setState((s) => ({
        ...s,
        entrada: data,
        subjetivoChecklist: result.groups,
        subjetivoAnswers: {},
        subjetivoFreeText: "",
        subjetivoSummary: null,
        objetivoChecklist: null, objetivoAnswers: {}, objetivoFreeText: "", objetivoSummary: null,
        assessmentData: null, planData: null,
        currentStep: "subjetivo",
      }));
    } catch (e: any) { toast.error(e.message); }
    finally { setIsLoading(false); }
  }, []);

  const updateAnswer = useCallback((itemId: string, partial: Partial<ChecklistAnswer>) => {
    setState((s) => ({
      ...s,
      subjetivoAnswers: {
        ...s.subjetivoAnswers,
        [itemId]: { ...(s.subjetivoAnswers[itemId] || { itemId, checked: false }), ...partial, itemId },
      },
    }));
  }, []);

  const setSubjetivoFreeText = useCallback((text: string) => {
    setState((s) => ({ ...s, subjetivoFreeText: text }));
  }, []);

  const submitSubjetivo = useCallback(async () => {
    setIsLoading(true);
    try {
      const answersWithQuestions = Object.values(state.subjetivoAnswers)
        .filter((a) => a.checked || a.value || (a.selectedOptions?.length ?? 0) > 0)
        .map((a) => {
          const item = state.subjetivoChecklist?.flatMap((g) => g.items).find((i) => i.id === a.itemId);
          return { question: item?.question, type: item?.type, checked: a.checked, value: a.value, selectedOptions: a.selectedOptions };
        });

      const result: SubjectiveSummary = await callConsultaAI("generate-subjective-summary", {
        sex: state.entrada?.sex, age: state.entrada?.age,
        chiefComplaint: state.entrada?.chiefComplaint, duration: state.entrada?.duration,
        answers: answersWithQuestions, freeText: state.subjetivoFreeText,
      });

      setState((s) => ({ ...s, subjetivoSummary: result }));
    } catch (e: any) { toast.error(e.message); }
    finally { setIsLoading(false); }
  }, [state.subjetivoAnswers, state.subjetivoChecklist, state.subjetivoFreeText, state.entrada]);

  // ── Objetivo ──

  const updateObjetivoAnswer = useCallback((itemId: string, partial: Partial<ChecklistAnswer>) => {
    setState((s) => ({
      ...s,
      objetivoAnswers: {
        ...s.objetivoAnswers,
        [itemId]: { ...(s.objetivoAnswers[itemId] || { itemId, checked: false }), ...partial, itemId },
      },
    }));
  }, []);

  const setObjetivoFreeText = useCallback((text: string) => {
    setState((s) => ({ ...s, objetivoFreeText: text }));
  }, []);

  const generateObjetivoChecklist = useCallback(async () => {
    setIsLoading(true);
    try {
      const result: { groups: ChecklistGroupData[] } = await callConsultaAI("generate-objective-checklist", {
        sex: state.entrada?.sex, age: state.entrada?.age,
        chiefComplaint: state.entrada?.chiefComplaint, duration: state.entrada?.duration,
        subjectiveSummary: getSubjectiveSummaryText(),
        redFlags: state.subjetivoSummary?.red_flags_found ?? [],
      });

      setState((s) => ({
        ...s,
        objetivoChecklist: result.groups,
        objetivoAnswers: {}, objetivoFreeText: "", objetivoSummary: null,
        assessmentData: null, planData: null,
        currentStep: "objetivo",
      }));
    } catch (e: any) { toast.error(e.message); }
    finally { setIsLoading(false); }
  }, [state.entrada, state.subjetivoSummary, getSubjectiveSummaryText]);

  const submitObjetivo = useCallback(async () => {
    setIsLoading(true);
    try {
      const answersWithQuestions = Object.values(state.objetivoAnswers)
        .filter((a) => a.checked || a.value)
        .map((a) => {
          const question = state.objetivoChecklist?.flatMap((g) => g.items).find((i) => i.id === a.itemId)?.question;
          return { question, checked: a.checked, value: a.value };
        });

      const result: ObjectiveSummary = await callConsultaAI("generate-objective-summary", {
        sex: state.entrada?.sex, age: state.entrada?.age,
        chiefComplaint: state.entrada?.chiefComplaint,
        subjectiveSummary: getSubjectiveSummaryText(),
        answers: answersWithQuestions, freeText: state.objetivoFreeText,
      });

      setState((s) => ({ ...s, objetivoSummary: result }));
    } catch (e: any) { toast.error(e.message); }
    finally { setIsLoading(false); }
  }, [state.objetivoAnswers, state.objetivoChecklist, state.objetivoFreeText, state.entrada, state.subjetivoSummary, getSubjectiveSummaryText]);

  // ── Avaliação ──

  const generateAssessment = useCallback(async () => {
    setIsLoading(true);
    try {
      const result: AssessmentData = await callConsultaAI("generate-assessment", {
        sex: state.entrada?.sex, age: state.entrada?.age,
        chiefComplaint: state.entrada?.chiefComplaint, duration: state.entrada?.duration,
        subjectiveSummary: getSubjectiveSummaryText(),
        subjectiveRedFlags: state.subjetivoSummary?.red_flags_found ?? [],
        objectiveSummary: getObjectiveSummaryText(),
        criticalFindings: state.objetivoSummary?.critical_findings ?? [],
      });

      setState((s) => ({ ...s, assessmentData: result, planData: null, currentStep: "avaliacao" }));
    } catch (e: any) { toast.error(e.message); }
    finally { setIsLoading(false); }
  }, [state.entrada, state.subjetivoSummary, state.objetivoSummary, getSubjectiveSummaryText, getObjectiveSummaryText]);

  // ── Plano ──

  const generatePlan = useCallback(async () => {
    setIsLoading(true);
    try {
      const result: PlanData = await callConsultaAI("generate-plan", {
        sex: state.entrada?.sex, age: state.entrada?.age,
        chiefComplaint: state.entrada?.chiefComplaint,
        subjectiveSummary: getSubjectiveSummaryText(),
        objectiveSummary: getObjectiveSummaryText(),
        hypotheses: state.assessmentData?.hypotheses ?? [],
        suggestedExams: state.assessmentData?.suggested_exams ?? [],
        redFlagsAssessment: state.assessmentData?.red_flags_assessment ?? [],
      });

      setState((s) => ({ ...s, planData: result, currentStep: "plano" }));
    } catch (e: any) { toast.error(e.message); }
    finally { setIsLoading(false); }
  }, [state.entrada, state.subjetivoSummary, state.objetivoSummary, state.assessmentData, getSubjectiveSummaryText, getObjectiveSummaryText]);

  const goToStep = useCallback((step: ConsultaStep) => {
    setState((s) => ({ ...s, currentStep: step }));
  }, []);

  const reset = useCallback(() => { setState(initialState); }, []);

  return (
    <ConsultaContext.Provider
      value={{
        state, isLoading,
        submitEntrada, updateAnswer, setSubjetivoFreeText, submitSubjetivo,
        updateObjetivoAnswer, setObjetivoFreeText, generateObjetivoChecklist, submitObjetivo,
        generateAssessment, generatePlan,
        goToStep, reset,
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
