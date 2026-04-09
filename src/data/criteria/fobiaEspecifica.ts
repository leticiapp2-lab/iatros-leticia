import { InteractiveDisease } from "./types";

export const fobiaEspecifica: InteractiveDisease = {
  id: "fobia-especifica",
  name: "Fobias Específicas",
  shortName: "Fobia Específica",
  criteriaSetName: "DSM-5",
  groups: [
    {
      id: "fob-ab",
      title: "Critérios A e B",
      allRequired: true,
      items: [
        { id: "fob-a1", label: "Medo ou ansiedade acentuados acerca de objeto/situação específica" },
        { id: "fob-b1", label: "O objeto/situação quase invariavelmente provoca resposta imediata de medo/ansiedade" },
      ],
    },
    {
      id: "fob-cde",
      title: "Critérios C, D e E",
      allRequired: true,
      items: [
        { id: "fob-c1", label: "O objeto é ativamente evitado ou suportado com intensa ansiedade" },
        { id: "fob-d1", label: "O medo é desproporcional ao perigo real (considerando contexto sociocultural)" },
        { id: "fob-e1", label: "Medo/evitação persistente, geralmente ≥6 meses" },
      ],
    },
    {
      id: "fob-fg",
      title: "Critérios F e G — Exclusões",
      allRequired: true,
      items: [
        { id: "fob-f1", label: "Causa prejuízo ou sofrimento clinicamente significativo" },
        { id: "fob-g1", label: "Não explicado por outro transtorno mental" },
      ],
    },
  ],
  evaluate: (checked) => {
    const abMet = checked.has("fob-a1") && checked.has("fob-b1");
    const cdeMet = checked.has("fob-c1") && checked.has("fob-d1") && checked.has("fob-e1");
    const fgMet = checked.has("fob-f1") && checked.has("fob-g1");
    const met = abMet && cdeMet && fgMet;
    return {
      met,
      summary: met ? "✅ Critérios DSM-5 para Fobia Específica preenchidos" : "❌ Critérios NÃO preenchidos",
      detail: !abMet ? "Critérios A/B: medo acentuado e resposta imediata não confirmados"
        : !cdeMet ? "Critérios C/D/E: evitação, desproporcionalidade ou persistência não confirmados"
        : !fgMet ? "Critérios F/G: prejuízo funcional ou exclusões não confirmados"
        : "Todos os critérios DSM-5 para Fobia Específica foram preenchidos.",
    };
  },
};
