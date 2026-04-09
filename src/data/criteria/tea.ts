import { InteractiveDisease, countInGroup } from "./types";

export const tea: InteractiveDisease = {
  id: "tea",
  name: "Transtorno do Espectro Autista (TEA)",
  shortName: "TEA",
  criteriaSetName: "DSM-5",
  groups: [
    {
      id: "tea-a",
      title: "Critério A — Déficits na Comunicação/Interação Social (todos obrigatórios)",
      allRequired: true,
      items: [
        { id: "tea-a1", label: "Déficits na reciprocidade socioemocional" },
        { id: "tea-a2", label: "Déficits nos comportamentos comunicativos não verbais" },
        { id: "tea-a3", label: "Déficits para desenvolver, manter e compreender relacionamentos" },
      ],
    },
    {
      id: "tea-b",
      title: "Critério B — Padrões Restritos/Repetitivos (≥2 de 4)",
      minRequired: 2,
      items: [
        { id: "tea-b1", label: "Movimentos motores, uso de objetos ou fala estereotipados/repetitivos" },
        { id: "tea-b2", label: "Insistência nas mesmas coisas, adesão inflexível a rotinas" },
        { id: "tea-b3", label: "Interesses fixos e altamente restritos (anormais em intensidade/foco)" },
        { id: "tea-b4", label: "Hiper/hiporreatividade sensorial ou interesse incomum por aspectos sensoriais" },
      ],
    },
    {
      id: "tea-cd",
      title: "Critérios C e D — Temporalidade e Prejuízo",
      allRequired: true,
      items: [
        { id: "tea-c1", label: "Sintomas presentes precocemente no período do desenvolvimento" },
        { id: "tea-d1", label: "Causam prejuízo clinicamente significativo no funcionamento atual" },
      ],
    },
    {
      id: "tea-e",
      title: "Critério E — Exclusão",
      allRequired: true,
      items: [
        { id: "tea-e1", label: "Não explicado por deficiência intelectual ou atraso global do desenvolvimento" },
      ],
    },
  ],
  evaluate: (checked) => {
    const aMet = checked.has("tea-a1") && checked.has("tea-a2") && checked.has("tea-a3");
    const bCount = countInGroup(checked, tea.groups[1]);
    const cdMet = checked.has("tea-c1") && checked.has("tea-d1");
    const eMet = checked.has("tea-e1");
    const met = aMet && bCount >= 2 && cdMet && eMet;
    return {
      met,
      summary: met ? "✅ Critérios DSM-5 para TEA preenchidos" : "❌ Critérios NÃO preenchidos",
      detail: !aMet
        ? "Critério A incompleto — todos os 3 déficits na comunicação/interação são obrigatórios"
        : bCount < 2
        ? `Critério B: ${bCount}/4 padrões restritos/repetitivos (necessário ≥2)`
        : !cdMet
        ? "Critérios C/D: temporalidade ou prejuízo funcional não confirmados"
        : !eMet
        ? "Critério E: exclusão não confirmada"
        : "Todos os critérios DSM-5 para TEA foram preenchidos.",
    };
  },
};
