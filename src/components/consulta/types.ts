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
  sex?: string;
  age?: string;
  chiefComplaint?: string;
  duration?: string;
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

// ── Avaliação ──

export interface DiagnosticHypothesis {
  rank: number;
  diagnosis: string;
  probability: "alta" | "moderada" | "baixa";
  reasoning: string;
  criteria?: string;
  key_findings_for?: string[];
  key_findings_against?: string[];
}

export interface SuggestedExam {
  exam: string;
  justification: string;
  priority: "urgente" | "importante" | "complementar";
}

export interface ClinicalCalculator {
  name: string;
  purpose: string;
  relevance?: string;
}

export interface AssessmentData {
  hypotheses: DiagnosticHypothesis[];
  suggested_exams: SuggestedExam[];
  calculators?: ClinicalCalculator[];
  differential_summary: string;
  red_flags_assessment?: string[];
}

// ── Plano ──

export interface PlanExam {
  exam: string;
  justification?: string;
}

export interface TherapeuticMeasure {
  measure: string;
  details: string;
  type: "medicamentosa" | "nao_medicamentosa" | "procedimento";
}

export interface Referral {
  specialty: string;
  reason: string;
  urgency: "urgente" | "prioritario" | "eletivo";
}

export interface FollowUp {
  return_interval: string;
  criteria_return_earlier?: string[];
  monitoring_parameters?: string[];
}

export interface PlanData {
  exams_to_request?: PlanExam[];
  therapeutic_measures: TherapeuticMeasure[];
  patient_orientations: string[];
  follow_up: FollowUp;
  referrals?: Referral[];
  prontuario_paragraph: string;
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
  assessmentData: AssessmentData | null;
  planData: PlanData | null;
}
