import { InteractiveDisease, sumPointsInGroup } from "./types";
import arMaosImg from "@/assets/artrite-reumatoide-maos.png";

export const artriteReumatoide: InteractiveDisease = {
  id: "artrite-reumatoide",
  name: "Artrite Reumatoide",
  shortName: "Artrite Reumatoide",
  criteriaSetName: "ACR/EULAR 2010 — Sensibilidade 82% / Especificidade 61%",
  image: {
    src: arMaosImg,
    alt: "Articulações das mãos avaliadas na Artrite Reumatoide — 22 articulações",
    legend: [
      "IFD — Interfalangeanas distais (NÃO incluídas)",
      "IFP — Interfalangeanas proximais (10 articulações)",
      "MCF — Metacarpofalangeanas (10 articulações)",
      "Punho — 2 articulações (1 cada lado)",
      "Total: 22 articulações nas mãos",
    ],
  },
  groups: [
    {
      id: "ar-entrada",
      title: "Critério de Entrada (obrigatório)",
      allRequired: true,
      items: [
        { id: "ar-ent1", label: "≥1 articulação com sinovite clínica (edema articular ao exame físico ou imagem)" },
        { id: "ar-ent2", label: "Outras causas de artrite excluídas (cristais, reativa, doenças do tecido conjuntivo)" },
      ],
    },
    {
      id: "ar-articular",
      title: "1. Distribuição Articular (0-5 pontos)",
      note: "Selecione apenas UMA opção que melhor descreve o acometimento articular",
      items: [
        { id: "ar-art0", label: "1 articulação grande", points: 0 },
        { id: "ar-art1", label: "2-10 articulações grandes", points: 1 },
        { id: "ar-art2", label: "1-3 articulações pequenas (grandes não contadas)", points: 2 },
        { id: "ar-art3", label: "4-10 articulações pequenas (grandes não contadas)", points: 3 },
        { id: "ar-art5", label: ">10 articulações (com pelo menos 1 pequena)", points: 5 },
      ],
    },
    {
      id: "ar-sorologia",
      title: "2. Sorologia (0-3 pontos)",
      note: "Selecione apenas UMA opção",
      items: [
        { id: "ar-soro0", label: "FR negativo E ACPA negativo", points: 0 },
        { id: "ar-soro2", label: "FR baixo positivo OU ACPA baixo positivo (≤3× LSN)", points: 2 },
        { id: "ar-soro3", label: "FR alto positivo OU ACPA alto positivo (>3× LSN)", points: 3 },
      ],
    },
    {
      id: "ar-duracao",
      title: "3. Duração dos Sintomas (0-1 ponto)",
      note: "Selecione apenas UMA opção",
      items: [
        { id: "ar-dur0", label: "<6 semanas", points: 0 },
        { id: "ar-dur1", label: "≥6 semanas", points: 1 },
      ],
    },
    {
      id: "ar-fase-aguda",
      title: "4. Reagentes de Fase Aguda (0-1 ponto)",
      note: "Selecione apenas UMA opção",
      items: [
        { id: "ar-fa0", label: "PCR normal E VHS normal", points: 0 },
        { id: "ar-fa1", label: "PCR anormal OU VHS anormal", points: 1 },
      ],
    },
  ],
  evaluate: (checked) => {
    // Critério de entrada
    const entryMet = checked.has("ar-ent1") && checked.has("ar-ent2");

    // Articular: take highest selected
    const artScore = checked.has("ar-art5") ? 5
      : checked.has("ar-art3") ? 3
      : checked.has("ar-art2") ? 2
      : checked.has("ar-art1") ? 1
      : checked.has("ar-art0") ? 0
      : 0;

    // Sorologia: take highest
    const soroScore = checked.has("ar-soro3") ? 3
      : checked.has("ar-soro2") ? 2
      : checked.has("ar-soro0") ? 0
      : 0;

    // Duração
    const durScore = checked.has("ar-dur1") ? 1 : 0;

    // Fase aguda
    const faScore = checked.has("ar-fa1") ? 1 : 0;

    const totalScore = artScore + soroScore + durScore + faScore;
    const met = entryMet && totalScore >= 6;

    return {
      met,
      score: totalScore,
      maxScore: 10,
      summary: !entryMet
        ? "⚠️ Critério de entrada não preenchido"
        : met
          ? "✅ Artrite Reumatoide definida (≥6 pontos)"
          : `❌ AR improvável (${totalScore}/10 pontos)`,
      detail: !entryMet
        ? "É necessário ≥1 articulação com sinovite e exclusão de outras causas antes de aplicar a pontuação."
        : `Articular: ${artScore}/5 | Sorologia: ${soroScore}/3 | Duração: ${durScore}/1 | Fase aguda: ${faScore}/1 | Total: ${totalScore}/10 (mín. 6)`,
    };
  },
};
