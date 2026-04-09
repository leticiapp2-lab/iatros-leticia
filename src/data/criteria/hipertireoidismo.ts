import { InteractiveDisease } from "./types";

export const hipertireoidismo: InteractiveDisease = {
  id: "hipertireoidismo",
  name: "Hipertireoidismo",
  shortName: "Hipertireoidismo",
  criteriaSetName: "ATA/SBE",
  groups: [
    {
      id: "hiper-primario",
      title: "Hipertireoidismo Primário Franco",
      note: "Todos necessários para esta classificação",
      allRequired: true,
      items: [
        { id: "hiper-p1", label: "TSH suprimido (<0,05 ou <0,01 mU/L)" },
        { id: "hiper-p2", label: "T4L e/ou T3 elevados" },
      ],
    },
    {
      id: "hiper-sub",
      title: "Hipertireoidismo Subclínico",
      allRequired: true,
      items: [
        { id: "hiper-s1", label: "TSH baixo (suprimido)" },
        { id: "hiper-s2", label: "T4L e T3 normais" },
      ],
    },
    {
      id: "hiper-central",
      title: "Hipertireoidismo Central (Mediado por TSH — raro)",
      allRequired: true,
      items: [
        { id: "hiper-c1", label: "T4L e T3 elevados" },
        { id: "hiper-c2", label: "TSH paradoxalmente normal ou alto (adenoma hipofisário)" },
      ],
    },
    {
      id: "hiper-etio",
      title: "Investigação Etiológica (opcional)",
      items: [
        { id: "hiper-e1", label: "TRAb/TSI positivo (Doença de Graves)" },
        { id: "hiper-e2", label: "Cintilografia: captação aumentada (produção autônoma)" },
        { id: "hiper-e3", label: "Cintilografia: captação baixa (tireoidite destrutiva)" },
      ],
    },
    {
      id: "hiper-conf",
      title: "Confirmação",
      allRequired: true,
      items: [
        { id: "hiper-conf1", label: "Exames repetidos em 1-3 meses para confirmação" },
      ],
    },
  ],
  evaluate: (checked) => {
    const primarioMet = checked.has("hiper-p1") && checked.has("hiper-p2");
    const subMet = checked.has("hiper-s1") && checked.has("hiper-s2");
    const centralMet = checked.has("hiper-c1") && checked.has("hiper-c2");
    const confMet = checked.has("hiper-conf1");
    const anyType = primarioMet || subMet || centralMet;
    const met = anyType && confMet;

    let tipo = "";
    if (primarioMet) tipo = "Primário Franco";
    else if (subMet) tipo = "Subclínico";
    else if (centralMet) tipo = "Central";

    let etiologia = "";
    if (checked.has("hiper-e1")) etiologia = " Etiologia: Doença de Graves (TRAb+).";
    else if (checked.has("hiper-e2")) etiologia = " Etiologia: produção autônoma (BMT/adenoma tóxico).";
    else if (checked.has("hiper-e3")) etiologia = " Etiologia: tireoidite destrutiva.";

    return {
      met,
      summary: met
        ? `✅ Hipertireoidismo ${tipo} diagnosticado`
        : "❌ Critérios NÃO preenchidos",
      detail: !anyType
        ? "Selecione todos os critérios de pelo menos 1 tipo (Primário, Subclínico ou Central)"
        : !confMet
        ? "Confirmação laboratorial não atendida (repetir em 1-3 meses)"
        : `Diagnóstico de Hipertireoidismo ${tipo} confirmado.${etiologia}`,
    };
  },
};
