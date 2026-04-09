import { InteractiveDisease, countInGroup } from "./types";

export const hanseniase: InteractiveDisease = {
  id: "hanseniase",
  name: "Hanseníase",
  shortName: "Hanseníase",
  criteriaSetName: "MS Brasil",
  groups: [
    {
      id: "hans-cardinal",
      title: "Sinais Cardinais (≥1 fecha diagnóstico)",
      note: "A presença de pelo menos 1 sinal cardinal confirma o diagnóstico.",
      minRequired: 1,
      items: [
        { id: "hans-c1", label: "Lesão(ões) e/ou área(s) de pele com alteração de sensibilidade (térmica, dolorosa e/ou tátil)" },
        { id: "hans-c2", label: "Espessamento de nervo periférico com alterações sensitivas, motoras e/ou autonômicas" },
        { id: "hans-c3", label: "Presença de M. leprae confirmada (baciloscopia ou biópsia de pele)" },
      ],
    },
    {
      id: "hans-exame",
      title: "Exame Clínico Dermatoneurológico",
      note: "Inspeção de pele + testes de sensibilidade + Avaliação Neurológica Simplificada (ANS).",
      items: [
        { id: "hans-mancha", label: "Manchas hipocrômicas, eritematosas ou acastanhadas" },
        { id: "hans-placa", label: "Placas ou nódulos cutâneos" },
        { id: "hans-sens-term", label: "Alteração de sensibilidade térmica (tubos de água quente/fria)" },
        { id: "hans-sens-dor", label: "Alteração de sensibilidade dolorosa (teste com agulha)" },
        { id: "hans-sens-tat", label: "Alteração de sensibilidade tátil (monofilamentos ou algodão)" },
        { id: "hans-nervo", label: "Espessamento de tronco nervoso à palpação (ulnar, radial, fibular, etc.)" },
        { id: "hans-motor", label: "Alteração de força motora (garra, mão/pé caído)" },
      ],
    },
    {
      id: "hans-lab",
      title: "Exames Subsidiários",
      note: "Baciloscopia positiva = Multibacilar. Negativa NÃO exclui hanseníase (comum em Paucibacilares).",
      items: [
        { id: "hans-bac-pos", label: "Baciloscopia positiva (raspado de linfa)" },
        { id: "hans-bac-neg", label: "Baciloscopia negativa" },
        { id: "hans-biopsia", label: "Biópsia de pele compatível com hanseníase" },
      ],
    },
    {
      id: "hans-class",
      title: "Classificação Operacional",
      note: "Selecione o número de lesões para classificação PB/MB.",
      items: [
        { id: "hans-pb", label: "Até 5 lesões cutâneas (Paucibacilar — PB)" },
        { id: "hans-mb", label: ">5 lesões cutâneas OU baciloscopia positiva (Multibacilar — MB)" },
      ],
    },
    {
      id: "hans-contato",
      title: "Investigação de Contatos",
      note: "Testes sorológicos/moleculares: uso exclusivo para contatos, NÃO para diagnóstico isolado.",
      items: [
        { id: "hans-contato-prox", label: "Contato próximo de caso confirmado de hanseníase" },
        { id: "hans-rapido", label: "Teste rápido anti-PGL-1 positivo (apenas para contatos)" },
        { id: "hans-pcr", label: "qPCR positivo (apenas para contatos)" },
      ],
    },
  ],
  evaluate: (checked) => {
    const cardinalCount = countInGroup(checked, hanseniase.groups[0]);
    const hasSensAlt = checked.has("hans-sens-term") || checked.has("hans-sens-dor") || checked.has("hans-sens-tat");
    const hasNervo = checked.has("hans-nervo") || checked.has("hans-motor");
    const bacPos = checked.has("hans-bac-pos");
    const biopsiaPos = checked.has("hans-biopsia");

    // Diagnóstico confirmado: ≥1 sinal cardinal
    if (cardinalCount >= 1) {
      const isMB = checked.has("hans-mb") || bacPos;
      const isPB = checked.has("hans-pb") && !isMB;
      const classif = isMB ? "Multibacilar (MB)" : isPB ? "Paucibacilar (PB)" : "Classificar PB/MB";

      return {
        met: true,
        summary: `✅ Hanseníase diagnosticada — ${classif}`,
        detail: bacPos
          ? "Baciloscopia positiva confirma classificação Multibacilar. Iniciar PQT-MB."
          : "Diagnóstico clínico confirmado por sinal cardinal. Iniciar poliquimioterapia (PQT).",
      };
    }

    // Achados sugestivos mas sem sinal cardinal completo
    if ((hasSensAlt || hasNervo) && !cardinalCount) {
      return {
        met: false,
        summary: "⚠️ Achados sugestivos — complementar investigação",
        detail: "Alterações sensitivas/neurais encontradas. Realizar testes de sensibilidade nas lesões e ANS completa. Considerar biópsia.",
      };
    }

    if (biopsiaPos) {
      return {
        met: true,
        summary: "✅ Hanseníase confirmada por biópsia",
        detail: "Biópsia compatível com hanseníase. Classificar e iniciar PQT.",
      };
    }

    return {
      met: false,
      summary: "❌ Critérios diagnósticos para hanseníase NÃO preenchidos",
      detail: "Necessário ≥1 sinal cardinal: alteração de sensibilidade em lesão, espessamento neural ou confirmação laboratorial.",
    };
  },
};
