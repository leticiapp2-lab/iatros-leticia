import { InteractiveDisease, countInGroup } from "./types";

export const tept: InteractiveDisease = {
  id: "tept",
  name: "Transtorno de Estresse Pós-Traumático (TEPT)",
  shortName: "TEPT",
  criteriaSetName: "DSM-5",
  groups: [
    {
      id: "tept-a",
      title: "Critério A — Exposição ao Trauma (≥1)",
      minRequired: 1,
      items: [
        { id: "tept-a1", label: "Vivenciou diretamente o evento traumático" },
        { id: "tept-a2", label: "Testemunhou pessoalmente o evento ocorrendo com outros" },
        { id: "tept-a3", label: "Soube que o evento ocorreu com familiar/amigo próximo" },
        { id: "tept-a4", label: "Exposição repetida a detalhes aversivos do evento (ex.: socorristas)" },
      ],
    },
    {
      id: "tept-b",
      title: "Critério B — Sintomas Intrusivos (≥1)",
      minRequired: 1,
      items: [
        { id: "tept-b1", label: "Lembranças intrusivas angustiantes e recorrentes" },
        { id: "tept-b2", label: "Sonhos angustiantes recorrentes relacionados ao evento" },
        { id: "tept-b3", label: "Reações dissociativas (flashbacks)" },
        { id: "tept-b4", label: "Sofrimento psicológico intenso ante lembretes do trauma" },
        { id: "tept-b5", label: "Reações fisiológicas intensas a sinais que lembrem o evento" },
      ],
    },
    {
      id: "tept-c",
      title: "Critério C — Evitação (≥1)",
      minRequired: 1,
      items: [
        { id: "tept-c1", label: "Esforços para evitar recordações, pensamentos ou sentimentos internos" },
        { id: "tept-c2", label: "Esforços para evitar lembranças externas (pessoas, lugares, conversas)" },
      ],
    },
    {
      id: "tept-d",
      title: "Critério D — Alterações em Cognições e Humor (≥2)",
      minRequired: 2,
      items: [
        { id: "tept-d1", label: "Amnésia dissociativa de aspectos do evento" },
        { id: "tept-d2", label: "Crenças negativas exageradas sobre si, outros ou o mundo" },
        { id: "tept-d3", label: "Cognições distorcidas de culpa sobre causa/consequência do evento" },
        { id: "tept-d4", label: "Estado emocional negativo persistente (medo, horror, raiva, culpa)" },
        { id: "tept-d5", label: "Interesse/participação diminuída em atividades significativas" },
        { id: "tept-d6", label: "Sentimentos de alienação/distanciamento em relação aos outros" },
        { id: "tept-d7", label: "Incapacidade de sentir emoções positivas" },
      ],
    },
    {
      id: "tept-e",
      title: "Critério E — Excitação e Reatividade (≥2)",
      minRequired: 2,
      items: [
        { id: "tept-e1", label: "Comportamento irritadiço ou explosões de raiva" },
        { id: "tept-e2", label: "Comportamento imprudente ou autodestrutivo" },
        { id: "tept-e3", label: "Hipervigilância" },
        { id: "tept-e4", label: "Resposta de sobressalto exagerada" },
        { id: "tept-e5", label: "Problemas de concentração" },
        { id: "tept-e6", label: "Perturbação do sono" },
      ],
    },
    {
      id: "tept-fgh",
      title: "Critérios F, G e H",
      allRequired: true,
      items: [
        { id: "tept-f1", label: "Perturbação dura mais de 1 mês" },
        { id: "tept-g1", label: "Causa sofrimento clínico ou prejuízo funcional significativo" },
        { id: "tept-h1", label: "Não atribuível a substância ou condição médica" },
      ],
    },
  ],
  evaluate: (checked) => {
    const aCount = countInGroup(checked, tept.groups[0]);
    const bCount = countInGroup(checked, tept.groups[1]);
    const cCount = countInGroup(checked, tept.groups[2]);
    const dCount = countInGroup(checked, tept.groups[3]);
    const eCount = countInGroup(checked, tept.groups[4]);
    const fghMet = checked.has("tept-f1") && checked.has("tept-g1") && checked.has("tept-h1");
    const met = aCount >= 1 && bCount >= 1 && cCount >= 1 && dCount >= 2 && eCount >= 2 && fghMet;
    return {
      met,
      summary: met
        ? "✅ Critérios DSM-5 para TEPT preenchidos"
        : "❌ Critérios NÃO preenchidos",
      detail: aCount < 1 ? "Critério A: exposição ao trauma não confirmada"
        : bCount < 1 ? "Critério B: nenhum sintoma intrusivo selecionado (necessário ≥1)"
        : cCount < 1 ? "Critério C: nenhuma evitação selecionada (necessário ≥1)"
        : dCount < 2 ? `Critério D: ${dCount}/7 alterações cognitivas/humor (necessário ≥2)`
        : eCount < 2 ? `Critério E: ${eCount}/6 alterações de excitação (necessário ≥2)`
        : !fghMet ? "Critérios F/G/H: duração, prejuízo ou exclusões não confirmados"
        : "Todos os critérios DSM-5 para TEPT foram preenchidos.",
    };
  },
};
