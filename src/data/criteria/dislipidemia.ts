import { InteractiveDisease, countInGroup } from "./types";

export const dislipidemia: InteractiveDisease = {
  id: "dislipidemia",
  name: "Dislipidemia",
  shortName: "Dislipidemia",
  criteriaSetName: "Diretriz Brasileira de Dislipidemias",
  groups: [
    {
      id: "dlp-class",
      title: "Classificação Laboratorial (selecione os presentes)",
      note: "Qualquer 1 critério fecha diagnóstico de dislipidemia",
      items: [
        { id: "dlp-1", label: "Hipercolesterolemia isolada: LDL-c ≥160 mg/dL" },
        { id: "dlp-2", label: "Hipertrigliceridemia isolada: TG ≥150 mg/dL (jejum) ou ≥175 mg/dL (sem jejum)" },
        { id: "dlp-3", label: "Hiperlipidemia mista: LDL-c ≥160 + TG ≥150/175 mg/dL" },
        { id: "dlp-4", label: "HDL-c baixo: <40 mg/dL (homens) ou <50 mg/dL (mulheres)" },
      ],
    },
  ],
  evaluate: (checked) => {
    const count = countInGroup(checked, dislipidemia.groups[0]);
    const met = count >= 1;

    return {
      met,
      score: count,
      maxScore: 4,
      summary: met
        ? `✅ Dislipidemia diagnosticada (${count} alteração${count > 1 ? "ões" : ""})`
        : "❌ Nenhum critério laboratorial preenchido",
      detail: met
        ? "Diagnóstico laboratorial de dislipidemia confirmado. Nota: cálculo de LDL-c preferencialmente pela equação de Martin/Hopkins."
        : "Selecione ao menos 1 alteração laboratorial.",
    };
  },
};
