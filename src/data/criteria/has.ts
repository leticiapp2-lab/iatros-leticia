import { InteractiveDisease, countInGroup } from "./types";

export const has: InteractiveDisease = {
  id: "hipertensao",
  name: "Hipertensão Arterial Sistêmica",
  shortName: "HAS",
  criteriaSetName: "Diretrizes Brasileiras 2020",
  groups: [
    {
      id: "has-consult",
      title: "Via Consultório (qualquer 1)",
      items: [
        { id: "has-c1", label: "PA ≥140/90 mmHg em ≥2 ocasiões diferentes" },
        { id: "has-c2", label: "PA ≥180/110 mmHg + doença cardiovascular (visita única)" },
        { id: "has-c3", label: "PA ≥140/90 mmHg + lesão de órgão-alvo já estabelecida (visita única)" },
      ],
    },
    {
      id: "has-fora",
      title: "Confirmação Fora do Consultório (qualquer 1)",
      note: "MAPA ou MRPA — essenciais para descartar hipertensão do avental branco ou diagnosticar hipertensão mascarada",
      items: [
        { id: "has-f1", label: "MAPA: média 24h ≥ 130/80 mmHg" },
        { id: "has-f2", label: "MAPA: vigília (acordado) ≥ 135/85 mmHg" },
        { id: "has-f3", label: "MAPA: sono ≥ 120/70 mmHg" },
        { id: "has-f4", label: "MRPA: média ≥ 130/80 mmHg" },
      ],
    },
  ],
  evaluate: (checked) => {
    const consultCount = countInGroup(checked, has.groups[0]);
    const foraCount = countInGroup(checked, has.groups[1]);
    const met = consultCount >= 1 || foraCount >= 1;

    return {
      met,
      summary: met
        ? "✅ Critérios diagnósticos para HAS preenchidos"
        : "❌ Nenhum critério diagnóstico preenchido",
      detail: met
        ? consultCount >= 1
          ? "Diagnóstico por medida de consultório."
          : "Diagnóstico por medida fora do consultório (MAPA/MRPA)."
        : "Selecione ao menos 1 critério diagnóstico (consultório ou MAPA/MRPA).",
    };
  },
};
