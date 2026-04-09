import { InteractiveDisease } from "./types";

export const hipotireoidismo: InteractiveDisease = {
  id: "hipotireoidismo",
  name: "Hipotireoidismo",
  shortName: "Hipotireoidismo",
  criteriaSetName: "ATA/SBE",
  groups: [
    {
      id: "hipo-primario",
      title: "Hipotireoidismo Primário Franco",
      note: "Todos necessários para esta classificação",
      allRequired: true,
      items: [
        { id: "hipo-p1", label: "TSH elevado (frequentemente >10 mUI/L)" },
        { id: "hipo-p2", label: "T4L reduzido (abaixo do limite inferior)" },
      ],
    },
    {
      id: "hipo-sub",
      title: "Hipotireoidismo Subclínico",
      allRequired: true,
      items: [
        { id: "hipo-s1", label: "TSH persistentemente elevado" },
        { id: "hipo-s2", label: "T4L dentro da normalidade" },
      ],
    },
    {
      id: "hipo-central",
      title: "Hipotireoidismo Central (Secundário/Terciário)",
      allRequired: true,
      items: [
        { id: "hipo-c1", label: "T4L baixo ou no limite inferior" },
        { id: "hipo-c2", label: "TSH inapropriadamente baixo, normal ou levemente aumentado (5-10)" },
      ],
    },
    {
      id: "hipo-etio",
      title: "Investigação Etiológica (opcional)",
      items: [
        { id: "hipo-e1", label: "Anti-TPO positivo (Tireoidite de Hashimoto)" },
      ],
    },
    {
      id: "hipo-conf",
      title: "Confirmação",
      allRequired: true,
      items: [
        { id: "hipo-conf1", label: "Alterações confirmadas em ≥2 testes consecutivos (1-3 meses)" },
      ],
    },
  ],
  evaluate: (checked) => {
    const primarioMet = checked.has("hipo-p1") && checked.has("hipo-p2");
    const subMet = checked.has("hipo-s1") && checked.has("hipo-s2");
    const centralMet = checked.has("hipo-c1") && checked.has("hipo-c2");
    const confMet = checked.has("hipo-conf1");
    const anyType = primarioMet || subMet || centralMet;
    const met = anyType && confMet;

    let tipo = "";
    if (primarioMet) tipo = "Primário Franco";
    else if (subMet) tipo = "Subclínico";
    else if (centralMet) tipo = "Central";

    return {
      met,
      summary: met
        ? `✅ Hipotireoidismo ${tipo} diagnosticado`
        : "❌ Critérios NÃO preenchidos",
      detail: !anyType
        ? "Selecione todos os critérios de pelo menos 1 tipo (Primário, Subclínico ou Central)"
        : !confMet
        ? "Confirmação laboratorial não atendida (≥2 testes em 1-3 meses)"
        : `Diagnóstico de Hipotireoidismo ${tipo} confirmado.${checked.has("hipo-e1") ? " Etiologia: Tireoidite de Hashimoto (Anti-TPO+)." : ""}`,
    };
  },
};
