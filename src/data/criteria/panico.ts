import { InteractiveDisease, countInGroup } from "./types";

export const panico: InteractiveDisease = {
  id: "panico",
  name: "Transtorno de Pânico",
  shortName: "Pânico",
  criteriaSetName: "DSM-5",
  groups: [
    {
      id: "pan-a",
      title: "Critério A — Sintomas do Ataque de Pânico (≥4 de 13)",
      minRequired: 4,
      note: "Surto abrupto de medo/desconforto intenso que alcança pico em minutos",
      items: [
        { id: "pan-1", label: "Palpitações, coração acelerado" },
        { id: "pan-2", label: "Sudorese" },
        { id: "pan-3", label: "Tremores ou abalos" },
        { id: "pan-4", label: "Sensações de falta de ar ou sufocamento" },
        { id: "pan-5", label: "Sensações de asfixia" },
        { id: "pan-6", label: "Dor ou desconforto torácico" },
        { id: "pan-7", label: "Náusea ou desconforto abdominal" },
        { id: "pan-8", label: "Sensação de tontura, instabilidade ou desmaio" },
        { id: "pan-9", label: "Calafrios ou ondas de calor" },
        { id: "pan-10", label: "Parestesias (formigamento/dormência)" },
        { id: "pan-11", label: "Desrealização ou despersonalização" },
        { id: "pan-12", label: "Medo de perder o controle ou 'enlouquecer'" },
        { id: "pan-13", label: "Medo de morrer" },
      ],
    },
    {
      id: "pan-req",
      title: "Ataques Recorrentes e Inesperados",
      allRequired: true,
      items: [
        { id: "pan-req1", label: "Ataques de pânico recorrentes e inesperados" },
      ],
    },
    {
      id: "pan-b",
      title: "Critério B — Consequências (≥1 por ≥1 mês)",
      minRequired: 1,
      items: [
        { id: "pan-b1", label: "Preocupação persistente sobre ter novos ataques ou suas consequências" },
        { id: "pan-b2", label: "Mudança desadaptativa significativa no comportamento relacionada aos ataques" },
      ],
    },
    {
      id: "pan-cd",
      title: "Critérios C e D — Exclusões",
      allRequired: true,
      items: [
        { id: "pan-c1", label: "Não devida a substância ou condição médica" },
        { id: "pan-d1", label: "Não explicada por outro transtorno mental" },
      ],
    },
  ],
  evaluate: (checked) => {
    const sxCount = countInGroup(checked, panico.groups[0]);
    const recurrent = checked.has("pan-req1");
    const bCount = countInGroup(checked, panico.groups[2]);
    const cdMet = checked.has("pan-c1") && checked.has("pan-d1");
    const met = sxCount >= 4 && recurrent && bCount >= 1 && cdMet;
    return {
      met,
      score: sxCount,
      maxScore: 13,
      summary: met
        ? `✅ Critérios DSM-5 para Transtorno de Pânico preenchidos (${sxCount}/13 sintomas)`
        : `❌ Critérios NÃO preenchidos (${sxCount}/13 sintomas)`,
      detail: sxCount < 4
        ? `Necessário ≥4 sintomas durante o ataque (atual: ${sxCount})`
        : !recurrent
        ? "Ataques recorrentes e inesperados não confirmados"
        : bCount < 1
        ? "Critério B: consequências pós-ataque não confirmadas"
        : !cdMet
        ? "Exclusões (C/D) não confirmadas"
        : "Todos os critérios DSM-5 para Transtorno de Pânico foram preenchidos.",
    };
  },
};
