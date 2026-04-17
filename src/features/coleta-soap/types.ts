export type FieldType = "checkbox" | "tristate" | "text" | "number" | "radio" | "textarea";

export type SectionId =
  | "hda"
  | "sintomas"
  | "revisao"
  | "redflags"
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
  /** subseção textual livre (ex.: "Exame Neurológico") preservada do parser estruturado */
  subsecao?: string;
  label: string;
  tipo: FieldType;
  unidade?: string;
  opcoes?: string[];
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface FieldValue {
  /** for checkbox/tristate */
  checked?: boolean;
  /** for text/number/textarea */
  value?: string;
  /** for radio: 'Positivo' | 'Negativo' | 'Não realizado' or other */
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
  redflags: { title: "Red Flags", order: 4 },
  hmp: { title: "História Médica Pregressa", order: 5 },
  medicacoes: { title: "Medicações em Uso", order: 6 },
  alergias: { title: "Alergias", order: 7 },
  familiar: { title: "História Familiar", order: 8 },
  social: { title: "História Social", order: 9 },
  vitais: { title: "Sinais Vitais e Antropometria", order: 10 },
  exameFisico: { title: "Exame Físico", order: 11 },
  manobras: { title: "Manobras / Testes Especiais", order: 12 },
  escalas: { title: "Escalas e Questionários", order: 13 },
  laboratorio: { title: "Exames Laboratoriais", order: 14 },
  imagem: { title: "Exames de Imagem", order: 15 },
};
