import { InteractiveDisease, countInGroup } from "./types";

export const toc: InteractiveDisease = {
  id: "toc",
  name: "Transtorno Obsessivo-Compulsivo (TOC)",
  shortName: "TOC",
  criteriaSetName: "DSM-5",
  groups: [
    {
      id: "toc-a",
      title: "Critério A — Obsessões e/ou Compulsões (≥1)",
      minRequired: 1,
      items: [
        { id: "toc-a1", label: "Obsessões: pensamentos/impulsos/imagens recorrentes, intrusivos e indesejados" },
        { id: "toc-a2", label: "Compulsões: comportamentos/atos mentais repetitivos em resposta a obsessões ou regras rígidas" },
      ],
    },
    {
      id: "toc-b",
      title: "Critério B — Impacto",
      allRequired: true,
      items: [
        { id: "toc-b1", label: "Tomam tempo (>1h/dia) OU causam sofrimento/prejuízo significativo" },
      ],
    },
    {
      id: "toc-cd",
      title: "Critérios C e D — Exclusões",
      allRequired: true,
      items: [
        { id: "toc-c1", label: "Não devidos a substância ou condição médica" },
        { id: "toc-d1", label: "Não explicados por outro transtorno mental" },
      ],
    },
  ],
  evaluate: (checked) => {
    const aCount = countInGroup(checked, toc.groups[0]);
    const bMet = checked.has("toc-b1");
    const cdMet = checked.has("toc-c1") && checked.has("toc-d1");
    const met = aCount >= 1 && bMet && cdMet;
    return {
      met,
      summary: met ? "✅ Critérios DSM-5 para TOC preenchidos" : "❌ Critérios NÃO preenchidos",
      detail: aCount < 1
        ? "Critério A: nenhuma obsessão ou compulsão identificada"
        : !bMet
        ? "Critério B: impacto funcional não confirmado (>1h/dia ou prejuízo significativo)"
        : !cdMet
        ? "Exclusões (C/D) não confirmadas"
        : "Todos os critérios DSM-5 para TOC foram preenchidos.",
    };
  },
};
