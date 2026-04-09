import { InteractiveDisease, countInGroup } from "./types";

export const tag: InteractiveDisease = {
  id: "tag",
  name: "Transtorno de Ansiedade Generalizada",
  shortName: "TAG",
  criteriaSetName: "DSM-5",
  groups: [
    {
      id: "tag-ab",
      title: "Critérios A e B — Ansiedade Excessiva",
      allRequired: true,
      items: [
        { id: "tag-req-1", label: "Ansiedade e preocupação excessivas, maioria dos dias, ≥6 meses" },
        { id: "tag-req-2", label: "Difícil de controlar a preocupação" },
      ],
    },
    {
      id: "tag-c",
      title: "Critério C — Sintomas Associados (≥3, ou ≥1 para crianças)",
      minRequired: 3,
      items: [
        { id: "tag-1", label: "Inquietação / nervos à flor da pele" },
        { id: "tag-2", label: "Fatigabilidade" },
        { id: "tag-3", label: "Dificuldade de concentração / 'dar branco'" },
        { id: "tag-4", label: "Irritabilidade" },
        { id: "tag-5", label: "Tensão muscular" },
        { id: "tag-6", label: "Perturbação do sono" },
      ],
    },
    {
      id: "tag-def",
      title: "Critérios D, E e F — Prejuízo e Exclusões",
      allRequired: true,
      items: [
        { id: "tag-func-1", label: "Causa sofrimento ou prejuízo funcional significativo" },
        { id: "tag-e1", label: "Não devida a substância ou condição médica" },
        { id: "tag-f1", label: "Não explicada por outro transtorno mental" },
      ],
    },
  ],
  evaluate: (checked) => {
    const reqMet = checked.has("tag-req-1") && checked.has("tag-req-2");
    const sxCount = countInGroup(checked, tag.groups[1]);
    const defMet = checked.has("tag-func-1") && checked.has("tag-e1") && checked.has("tag-f1");
    const met = reqMet && sxCount >= 3 && defMet;
    return {
      met,
      score: sxCount,
      maxScore: 6,
      summary: met
        ? `✅ Critérios DSM-5 para TAG preenchidos (${sxCount}/6 sintomas)`
        : `❌ Critérios NÃO preenchidos (${sxCount}/6 sintomas)`,
      detail: !reqMet
        ? "Critérios A/B: ansiedade excessiva por ≥6 meses não confirmada"
        : sxCount < 3
        ? `Critério C: ${sxCount}/6 sintomas (necessário ≥3)`
        : !defMet
        ? "Critérios D/E/F: prejuízo ou exclusões não confirmados"
        : "Todos os critérios DSM-5 para TAG foram preenchidos.",
    };
  },
};
