import { InteractiveDisease, countInGroup } from "./types";

export const tdah: InteractiveDisease = {
  id: "tdah",
  name: "Transtorno de Déficit de Atenção/Hiperatividade (TDAH)",
  shortName: "TDAH",
  criteriaSetName: "DSM-5",
  groups: [
    {
      id: "tdah-a1",
      title: "Critério A1 — Desatenção (≥6 sintomas, ou ≥5 se ≥17 anos)",
      note: "Persistindo por ≥6 meses, com impacto negativo nas atividades",
      minRequired: 5,
      items: [
        { id: "tdah-d1", label: "Não presta atenção em detalhes / comete erros por descuido" },
        { id: "tdah-d2", label: "Dificuldade em manter atenção em tarefas ou atividades lúdicas" },
        { id: "tdah-d3", label: "Parece não escutar quando lhe dirigem a palavra" },
        { id: "tdah-d4", label: "Não segue instruções e não termina tarefas" },
        { id: "tdah-d5", label: "Dificuldade para organizar tarefas e atividades" },
        { id: "tdah-d6", label: "Evita tarefas que exigem esforço mental prolongado" },
        { id: "tdah-d7", label: "Perde coisas necessárias para tarefas e atividades" },
        { id: "tdah-d8", label: "Facilmente distraído por estímulos alheios" },
        { id: "tdah-d9", label: "Esquecido em atividades diárias" },
      ],
    },
    {
      id: "tdah-a2",
      title: "Critério A2 — Hiperatividade/Impulsividade (≥6 sintomas, ou ≥5 se ≥17 anos)",
      note: "Persistindo por ≥6 meses",
      minRequired: 5,
      items: [
        { id: "tdah-h1", label: "Remexe mãos ou pés ou se contorce na cadeira" },
        { id: "tdah-h2", label: "Levanta da cadeira em situações em que se espera que permaneça sentado" },
        { id: "tdah-h3", label: "Corre ou escala em situações inapropriadas" },
        { id: "tdah-h4", label: "Incapaz de brincar ou se envolver em atividades de lazer calmamente" },
        { id: "tdah-h5", label: "Frequentemente 'a mil' ou age como se estivesse 'com o motor ligado'" },
        { id: "tdah-h6", label: "Fala em demasia" },
        { id: "tdah-h7", label: "Responde antes de a pergunta ser concluída" },
        { id: "tdah-h8", label: "Dificuldade em esperar a sua vez" },
        { id: "tdah-h9", label: "Interrompe ou se intromete (conversas, jogos, atividades)" },
      ],
    },
    {
      id: "tdah-bcd",
      title: "Critérios B, C e D",
      allRequired: true,
      items: [
        { id: "tdah-b1", label: "Vários sintomas presentes antes dos 12 anos de idade" },
        { id: "tdah-c1", label: "Sintomas presentes em ≥2 ambientes (casa, escola, trabalho)" },
        { id: "tdah-d-func", label: "Evidências de interferência no funcionamento social/acadêmico/profissional" },
      ],
    },
    {
      id: "tdah-e",
      title: "Critério E — Exclusão",
      allRequired: true,
      items: [
        { id: "tdah-e1", label: "Não ocorrem exclusivamente durante esquizofrenia ou outro transtorno psicótico" },
        { id: "tdah-e2", label: "Não explicados por outro transtorno mental" },
      ],
    },
  ],
  evaluate: (checked) => {
    const desatCount = countInGroup(checked, tdah.groups[0]);
    const hiperCount = countInGroup(checked, tdah.groups[1]);
    const bcdMet = checked.has("tdah-b1") && checked.has("tdah-c1") && checked.has("tdah-d-func");
    const eMet = checked.has("tdah-e1") && checked.has("tdah-e2");
    const desatMet = desatCount >= 5;
    const hiperMet = hiperCount >= 5;
    const met = (desatMet || hiperMet) && bcdMet && eMet;

    let apresentacao = "";
    if (desatMet && hiperMet) apresentacao = "Apresentação combinada";
    else if (desatMet) apresentacao = "Apresentação predominantemente desatenta";
    else if (hiperMet) apresentacao = "Apresentação predominantemente hiperativa-impulsiva";

    return {
      met,
      summary: met
        ? `✅ Critérios DSM-5 para TDAH preenchidos — ${apresentacao}`
        : `❌ Critérios NÃO preenchidos (Desat: ${desatCount}/5, Hiper: ${hiperCount}/5)`,
      detail: !desatMet && !hiperMet
        ? `Necessário ≥5 sintomas em pelo menos um domínio (Desatenção: ${desatCount}, Hiperatividade: ${hiperCount})`
        : !bcdMet
        ? "Critérios B/C/D não atendidos (idade de início, ambientes, prejuízo funcional)"
        : !eMet
        ? "Exclusões não confirmadas"
        : `Todos os critérios DSM-5 para TDAH foram preenchidos. ${apresentacao}.`,
    };
  },
};
