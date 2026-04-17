export type FieldType = "checkbox" | "text" | "number" | "radio" | "textarea";

export type SectionId =
  | "hda"
  | "sintomas"
  | "revisao"
  | "hmp"
  | "medicacoes"
  | "alergias"
  | "familiar"
  | "social"
  | "vitais"
  | "exameFisico"
  | "manobras"
  | "escalas"
  | "laboratorio"
  | "imagem";

export interface ParsedField {
  id: string;
  secao: SectionId;
  label: string;
  tipo: FieldType;
  unidade?: string;
  opcoes?: string[];
  placeholder?: string;
}

export interface FieldValue {
  /** for checkbox */
  checked?: boolean;
  /** for text/number/textarea */
  value?: string;
  /** for radio: 'positivo' | 'negativo' | 'nao_realizado' or other */
  selected?: string;
  /** observação livre adicional */
  obs?: string;
}

export interface ContextoClinico {
  idade: string;
  sexo: "" | "Masculino" | "Feminino" | "Outro";
  ocupacao: string;
  contexto: "" | "Ambulatório" | "Pronto-socorro" | "Enfermaria" | "Domicílio" | "Telemedicina";
  queixaPrincipal: string;
}

export interface ColetaSnapshot {
  id: string;
  createdAt: number;
  contexto: ContextoClinico;
  textoOriginal: string;
  fields: ParsedField[];
  values: Record<string, FieldValue>;
  prompt?: string;
}

export const SECTION_META: Record<SectionId, { title: string; order: number }> = {
  hda: { title: "História da Doença Atual (HDA)", order: 1 },
  sintomas: { title: "Sintomas Associados", order: 2 },
  revisao: { title: "Revisão de Sistemas", order: 3 },
  hmp: { title: "História Médica Pregressa", order: 4 },
  medicacoes: { title: "Medicações em Uso", order: 5 },
  alergias: { title: "Alergias", order: 6 },
  familiar: { title: "História Familiar", order: 7 },
  social: { title: "História Social", order: 8 },
  vitais: { title: "Sinais Vitais e Antropometria", order: 9 },
  exameFisico: { title: "Exame Físico (por sistema)", order: 10 },
  manobras: { title: "Manobras / Testes Especiais", order: 11 },
  escalas: { title: "Escalas e Questionários", order: 12 },
  laboratorio: { title: "Exames Laboratoriais", order: 13 },
  imagem: { title: "Exames de Imagem", order: 14 },
};
