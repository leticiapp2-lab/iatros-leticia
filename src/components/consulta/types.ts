export type ConsultationType = "primeira" | "retorno";

export type ChecklistItemType = "yes_no" | "text" | "select";

export interface ChecklistItem {
  id: string;
  question: string;
  type: ChecklistItemType;
  options?: string[];
  isRedFlag?: boolean;
}

export interface ChecklistGroupData {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistAnswer {
  itemId: string;
  checked: boolean;
  value?: string;
}

export interface SummaryCategory {
  category: string;
  content: string;
}

export interface SubjectiveSummary {
  structured_summary: SummaryCategory[];
  prontuario_paragraph: string;
  red_flags_found: string[];
}

export interface EntradaData {
  consultationType: ConsultationType;
  // Primeira consulta
  sex?: string;
  age?: string;
  chiefComplaint?: string;
  duration?: string;
  // Retorno
  previousSoap?: string;
  returnUpdate?: string;
  newComplaint?: string;
  evolution?: string;
}

export type ConsultaStep = "entrada" | "subjetivo" | "objetivo" | "avaliacao" | "plano";

export interface ObjectiveSummary {
  structured_summary: SummaryCategory[];
  prontuario_paragraph: string;
  critical_findings: string[];
}

export interface ConsultaState {
  currentStep: ConsultaStep;
  entrada: EntradaData | null;
  subjetivoChecklist: ChecklistGroupData[] | null;
  subjetivoAnswers: Record<string, ChecklistAnswer>;
  subjetivoFreeText: string;
  subjetivoSummary: SubjectiveSummary | null;
  objetivoChecklist: ChecklistGroupData[] | null;
  objetivoAnswers: Record<string, ChecklistAnswer>;
  objetivoFreeText: string;
  objetivoSummary: ObjectiveSummary | null;
}
