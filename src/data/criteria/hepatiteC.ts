import { InteractiveDisease, countInGroup } from "./types";

export const hepatiteC: InteractiveDisease = {
  id: "hepatite-c",
  name: "Hepatite C (HCV)",
  shortName: "Hepatite C",
  criteriaSetName: "MS Brasil — PCDT Hepatites Virais",
  groups: [
    {
      id: "hcv-triagem",
      title: "Triagem — Marcador Imunológico",
      allRequired: true,
      items: [
        { id: "hcv-anti", label: "Anti-HCV REAGENTE (Teste Rápido ou ensaio laboratorial)" },
      ],
    },
    {
      id: "hcv-conf",
      title: "Confirmação — Biologia Molecular",
      allRequired: true,
      items: [
        { id: "hcv-rna", label: "HCV-RNA (Carga Viral) DETECTÁVEL — confirma infecção ativa" },
      ],
    },
    {
      id: "hcv-fase",
      title: "Classificação Temporal (selecione se aplicável)",
      note: "Diferenciar entre infecção aguda e crônica:",
      items: [
        { id: "hcv-aguda-1", label: "Soroconversão recente documentada (anti-HCV negativo → positivo em 90 dias)" },
        { id: "hcv-aguda-2", label: "HCV-RNA detectável com anti-HCV NÃO reagente nos primeiros 90 dias" },
        { id: "hcv-cronica", label: "Anti-HCV reagente + HCV-RNA detectável há >6 meses (Hepatite C crônica)" },
      ],
    },
    {
      id: "hcv-especial",
      title: "Populações Especiais",
      note: "Diagnóstico direto por HCV-RNA quando anticorpos podem ser falhos:",
      items: [
        { id: "hcv-esp-1", label: "Paciente dialítico, imunossuprimido ou fase muito precoce" },
        { id: "hcv-esp-2", label: "Diagnóstico baseado diretamente na detecção do HCV-RNA" },
      ],
    },
  ],
  evaluate: (checked) => {
    const antiMet = checked.has("hcv-anti");
    const rnaMet = checked.has("hcv-rna");
    const especial = checked.has("hcv-esp-1") && checked.has("hcv-esp-2");

    // Standard pathway or special population pathway
    const met = (antiMet && rnaMet) || (especial && rnaMet);

    // Determine phase
    const aguda = checked.has("hcv-aguda-1") || checked.has("hcv-aguda-2");
    const cronica = checked.has("hcv-cronica");

    let phase = "";
    if (met && aguda) phase = " — Hepatite C Aguda";
    else if (met && cronica) phase = " — Hepatite C Crônica";

    return {
      met,
      summary: met
        ? `✅ Infecção ativa pelo HCV confirmada${phase}`
        : "❌ Infecção ativa pelo HCV NÃO confirmada",
      detail: !rnaMet && !antiMet && !especial
        ? "Realize o teste de triagem (anti-HCV) como primeiro passo"
        : antiMet && !rnaMet
        ? "Anti-HCV reagente não diferencia infecção ativa de curada — solicitar HCV-RNA (Carga Viral)"
        : !antiMet && !especial
        ? "Anti-HCV não reagente. Em populações especiais (dialíticos/imunossuprimidos), considerar HCV-RNA direto"
        : met && !aguda && !cronica
        ? "Infecção ativa confirmada. Classifique como aguda ou crônica para orientar conduta."
        : met
        ? `Infecção ativa confirmada${phase}. Encaminhar para avaliação de tratamento antiviral.`
        : "Critérios insuficientes para confirmação diagnóstica.",
    };
  },
};
