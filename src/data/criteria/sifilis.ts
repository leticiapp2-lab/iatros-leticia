import { InteractiveDisease } from "./types";

export const sifilis: InteractiveDisease = {
  id: "sifilis",
  name: "Sífilis — Diagnóstico e Monitoramento",
  shortName: "Sífilis",
  criteriaSetName: "MS Brasil — PCDT IST",
  groups: [
    {
      id: "sif-triagem",
      title: "Triagem — Teste Treponêmico",
      allRequired: true,
      items: [
        { id: "sif-tr", label: "Teste Rápido treponêmico REAGENTE (indica contato com T. pallidum)" },
      ],
    },
    {
      id: "sif-conf",
      title: "Confirmação — Teste Não Treponêmico",
      allRequired: true,
      note: "VDRL ou RPR quantitativo",
      items: [
        { id: "sif-nt", label: "Teste não treponêmico (VDRL/RPR) REAGENTE" },
      ],
    },
    {
      id: "sif-interp",
      title: "Interpretação Complementar",
      note: "Marque conforme a situação clínica:",
      items: [
        { id: "sif-tit", label: "Titulação basal estabelecida para monitoramento" },
        { id: "sif-cicatriz", label: "Afastada hipótese de cicatriz sorológica (teste não treponêmico reagente)" },
        { id: "sif-gestante", label: "Em gestante: monitoramento mensal planejado" },
      ],
    },
  ],
  evaluate: (checked) => {
    const trMet = checked.has("sif-tr");
    const ntMet = checked.has("sif-nt");
    const cicatrizAfastada = checked.has("sif-cicatriz");

    const met = trMet && ntMet && cicatrizAfastada;

    return {
      met,
      summary: met
        ? "✅ Sífilis ativa confirmada"
        : "❌ Diagnóstico de sífilis ativa NÃO confirmado",
      detail: !trMet
        ? "Teste treponêmico (Teste Rápido) não reagente ou não realizado"
        : !ntMet
        ? "Teste não treponêmico não realizado — necessário para diferenciar infecção ativa de cicatriz sorológica"
        : !cicatrizAfastada
        ? "Confirme que a hipótese de cicatriz sorológica foi afastada (VDRL/RPR reagente)"
        : "Infecção ativa confirmada. Titulação basal estabelecida para acompanhamento da resposta terapêutica.",
    };
  },
};
