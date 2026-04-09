export interface FlowStep {
  id: string;
  type: "question" | "conclusion";
  text: string;
  /** Next step id when the user clicks "Sim" */
  yesNext?: string;
  /** Next step id when the user clicks "Não" */
  noNext?: string;
  /** For conclusions only */
  isPositive?: boolean;
  detail?: string;
}

export interface DiseaseFlowchart {
  diseaseId: string;
  name: string;
  shortName: string;
  steps: FlowStep[];
  startId: string;
  mermaid: string;
}
