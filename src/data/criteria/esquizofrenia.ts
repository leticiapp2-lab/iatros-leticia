import { InteractiveDisease, countInGroup } from "./types";

export const esquizofrenia: InteractiveDisease = {
  id: "esquizofrenia",
  name: "Esquizofrenia",
  shortName: "Esquizofrenia",
  criteriaSetName: "DSM-5",
  groups: [
    {
      id: "esq-a",
      title: "Critério A — Sintomas (≥2, sendo ≥1 dos três primeiros obrigatório)",
      minRequired: 2,
      note: "Presentes por quantidade significativa de tempo em período de 1 mês",
      items: [
        { id: "esq-a1", label: "Delírios" },
        { id: "esq-a2", label: "Alucinações" },
        { id: "esq-a3", label: "Discurso desorganizado" },
        { id: "esq-a4", label: "Comportamento grosseiramente desorganizado ou catatônico" },
        { id: "esq-a5", label: "Sintomas negativos (expressão emocional diminuída ou avolia)" },
      ],
    },
    {
      id: "esq-bc",
      title: "Critérios B e C — Funcionamento e Duração",
      allRequired: true,
      items: [
        { id: "esq-b1", label: "Nível de funcionamento acentuadamente abaixo do nível prévio" },
        { id: "esq-c1", label: "Sinais contínuos por ≥6 meses (incluindo ≥1 mês de fase ativa do Critério A)" },
      ],
    },
    {
      id: "esq-def",
      title: "Critérios D, E e F — Exclusões",
      allRequired: true,
      items: [
        { id: "esq-d1", label: "Transtorno esquizoafetivo e transtornos de humor descartados" },
        { id: "esq-e1", label: "Não atribuível a substância ou condição médica" },
        { id: "esq-f1", label: "Se TEA prévio: delírios ou alucinações proeminentes por ≥1 mês (ou dispensado)" },
      ],
    },
  ],
  evaluate: (checked) => {
    const aCount = countInGroup(checked, esquizofrenia.groups[0]);
    const corePresent = checked.has("esq-a1") || checked.has("esq-a2") || checked.has("esq-a3");
    const aMet = aCount >= 2 && corePresent;
    const bcMet = checked.has("esq-b1") && checked.has("esq-c1");
    const defMet = checked.has("esq-d1") && checked.has("esq-e1") && checked.has("esq-f1");
    const met = aMet && bcMet && defMet;
    return {
      met,
      score: aCount,
      maxScore: 5,
      summary: met
        ? `✅ Critérios DSM-5 para Esquizofrenia preenchidos (${aCount}/5 sintomas)`
        : `❌ Critérios NÃO preenchidos (${aCount}/5 sintomas)`,
      detail: aCount < 2
        ? `Necessário ≥2 sintomas do Critério A (atual: ${aCount})`
        : !corePresent
        ? "Ao menos 1 dos 3 primeiros sintomas (delírios, alucinações, discurso desorganizado) é obrigatório"
        : !bcMet
        ? "Critérios B/C não atendidos (funcionamento ou duração ≥6 meses)"
        : !defMet
        ? "Exclusões (D/E/F) não confirmadas"
        : "Todos os critérios DSM-5 para Esquizofrenia foram preenchidos.",
    };
  },
};
