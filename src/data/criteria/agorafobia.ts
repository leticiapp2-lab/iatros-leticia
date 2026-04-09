import { InteractiveDisease, countInGroup } from "./types";

export const agorafobia: InteractiveDisease = {
  id: "agorafobia",
  name: "Agorafobia",
  shortName: "Agorafobia",
  criteriaSetName: "DSM-5",
  groups: [
    {
      id: "ago-a",
      title: "Critério A — Situações Temidas (≥2 de 5)",
      minRequired: 2,
      items: [
        { id: "ago-a1", label: "Uso de transporte público" },
        { id: "ago-a2", label: "Permanecer em espaços abertos" },
        { id: "ago-a3", label: "Permanecer em locais fechados" },
        { id: "ago-a4", label: "Ficar em fila ou multidão" },
        { id: "ago-a5", label: "Sair de casa sozinho" },
      ],
    },
    {
      id: "ago-bcd",
      title: "Critérios B, C e D",
      allRequired: true,
      items: [
        { id: "ago-b1", label: "Teme/evita situações por dificuldade de escapar ou obter auxílio" },
        { id: "ago-c1", label: "Situações provocam medo quase sempre" },
        { id: "ago-d1", label: "Situações são ativamente evitadas, exigem companhia ou são suportadas com intenso medo" },
      ],
    },
    {
      id: "ago-ef",
      title: "Critérios E e F",
      allRequired: true,
      items: [
        { id: "ago-e1", label: "Medo desproporcional ao perigo real" },
        { id: "ago-f1", label: "Persistente, geralmente ≥6 meses" },
      ],
    },
    {
      id: "ago-ghi",
      title: "Critérios G, H e I — Exclusões",
      allRequired: true,
      items: [
        { id: "ago-g1", label: "Causa sofrimento ou prejuízo funcional significativo" },
        { id: "ago-h1", label: "Se condição médica presente, o medo é claramente excessivo" },
        { id: "ago-i1", label: "Não explicado por outro transtorno mental" },
      ],
    },
  ],
  evaluate: (checked) => {
    const aCount = countInGroup(checked, agorafobia.groups[0]);
    const bcdMet = checked.has("ago-b1") && checked.has("ago-c1") && checked.has("ago-d1");
    const efMet = checked.has("ago-e1") && checked.has("ago-f1");
    const ghiMet = checked.has("ago-g1") && checked.has("ago-h1") && checked.has("ago-i1");
    const met = aCount >= 2 && bcdMet && efMet && ghiMet;
    return {
      met,
      score: aCount,
      maxScore: 5,
      summary: met
        ? `✅ Critérios DSM-5 para Agorafobia preenchidos (${aCount}/5 situações)`
        : `❌ Critérios NÃO preenchidos (${aCount}/5 situações)`,
      detail: aCount < 2 ? `Critério A: ${aCount}/5 situações (necessário ≥2)`
        : !bcdMet ? "Critérios B/C/D: cognições de escape, medo persistente ou evitação não confirmados"
        : !efMet ? "Critérios E/F: desproporcionalidade ou persistência não confirmados"
        : !ghiMet ? "Critérios G/H/I: prejuízo ou exclusões não confirmados"
        : "Todos os critérios DSM-5 para Agorafobia foram preenchidos.",
    };
  },
};
