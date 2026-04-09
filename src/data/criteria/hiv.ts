import { InteractiveDisease, countInGroup } from "./types";

export const hiv: InteractiveDisease = {
  id: "hiv",
  name: "HIV — Diagnóstico Sorológico",
  shortName: "HIV",
  criteriaSetName: "MS Brasil — Fluxogramas de Testagem",
  groups: [
    {
      id: "hiv-fluxo",
      title: "Algoritmo Utilizado (selecione 1)",
      note: "Escolha o fluxograma de testagem empregado",
      minRequired: 1,
      items: [
        { id: "hiv-f1", label: "Fluxograma 1 — Dois testes rápidos com sangue (TR1 + TR2, fabricantes diferentes)" },
        { id: "hiv-f2", label: "Fluxograma 2 — TR1 com fluido oral + TR2 com sangue" },
        { id: "hiv-f3", label: "Fluxograma 3 — Imunoensaio 4ª geração (IE) + Carga Viral (teste molecular)" },
      ],
    },
    {
      id: "hiv-t1",
      title: "Resultado do Teste Inicial (Triagem)",
      allRequired: true,
      items: [
        { id: "hiv-t1-r", label: "Teste inicial (TR1 ou IE) REAGENTE" },
      ],
    },
    {
      id: "hiv-t2",
      title: "Resultado do Teste Complementar (Confirmação)",
      allRequired: true,
      items: [
        { id: "hiv-t2-r", label: "Teste complementar (TR2 ou Carga Viral) REAGENTE" },
      ],
    },
    {
      id: "hiv-excl",
      title: "Exclusões / Observações",
      note: "Marque se aplicável:",
      items: [
        { id: "hiv-excl-1", label: "Resultados concordantes (ambos reagentes, sem discordância)" },
        { id: "hiv-excl-2", label: "Não se trata apenas de autoteste (confirmação por algoritmo oficial)" },
      ],
    },
  ],
  evaluate: (checked) => {
    const fluxoCount = countInGroup(checked, hiv.groups[0]);
    const t1Met = checked.has("hiv-t1-r");
    const t2Met = checked.has("hiv-t2-r");
    const concordante = checked.has("hiv-excl-1");
    const naoAutoteste = checked.has("hiv-excl-2");

    const met = fluxoCount >= 1 && t1Met && t2Met && concordante && naoAutoteste;

    return {
      met,
      summary: met
        ? "✅ Diagnóstico de infecção pelo HIV confirmado"
        : "❌ Diagnóstico NÃO confirmado",
      detail: !fluxoCount
        ? "Selecione o algoritmo de testagem utilizado"
        : !t1Met
        ? "Teste inicial (triagem) não reagente ou não realizado"
        : !t2Met
        ? "Teste complementar (confirmação) não reagente ou não realizado"
        : !concordante
        ? "Resultados discordantes — coletar nova amostra após 30 dias"
        : !naoAutoteste
        ? "Autoteste não define diagnóstico — confirmar por algoritmo oficial"
        : "Infecção pelo HIV confirmada por algoritmo sequencial com resultados concordantes.",
    };
  },
};
