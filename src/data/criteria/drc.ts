import { InteractiveDisease, countInGroup } from "./types";

export const drc: InteractiveDisease = {
  id: "drc",
  name: "Doença Renal Crônica",
  shortName: "DRC",
  criteriaSetName: "KDIGO 2024",
  groups: [
    {
      id: "drc-func",
      title: "Critério de Perda de Função",
      items: [
        { id: "drc-f1", label: "TFGe <60 mL/min/1,73m² por ≥3 meses (CKD-EPI)" },
      ],
    },
    {
      id: "drc-dano",
      title: "Critério de Marcador de Dano Renal (se TFGe ≥60)",
      note: "Ao menos 1 marcador persistente por >3 meses",
      items: [
        { id: "drc-d1", label: "Albuminúria ≥30 mg/24h ou RAC ≥30 mg/g" },
        { id: "drc-d2", label: "Hematúria glomerular (cilindros hemáticos/dismorfismo)" },
        { id: "drc-d3", label: "Anormalidades estruturais em imagem (policísticos, hidronefrose)" },
        { id: "drc-d4", label: "Alterações tubulares eletrolíticas" },
        { id: "drc-d5", label: "Alterações histológicas (biópsia)" },
        { id: "drc-d6", label: "Histórico de transplante renal" },
      ],
    },
    {
      id: "drc-conf",
      title: "Confirmação",
      allRequired: true,
      items: [
        { id: "drc-conf1", label: "Testes confirmados em ≥2 de 3 amostras em 3-6 meses" },
      ],
    },
  ],
  evaluate: (checked) => {
    const funcMet = checked.has("drc-f1");
    const danoCount = countInGroup(checked, drc.groups[1]);
    const confMet = checked.has("drc-conf1");
    const met = (funcMet || danoCount >= 1) && confMet;

    return {
      met,
      summary: met
        ? "✅ Critérios diagnósticos para DRC preenchidos"
        : "❌ Critérios NÃO preenchidos",
      detail: !confMet
        ? "Confirmação laboratorial não atendida (≥2 de 3 amostras em 3-6 meses)"
        : !funcMet && danoCount < 1
        ? "Necessário TFGe <60 ou ao menos 1 marcador de dano renal"
        : funcMet
        ? "DRC diagnosticada por perda de função (TFGe <60)."
        : `DRC diagnosticada por marcador(es) de dano renal (${danoCount} presente${danoCount > 1 ? "s" : ""}).`,
    };
  },
};
