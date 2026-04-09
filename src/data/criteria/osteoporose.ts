import { InteractiveDisease, countInGroup } from "./types";

export const osteoporose: InteractiveDisease = {
  id: "osteoporose",
  name: "Osteoporose",
  shortName: "Osteoporose",
  criteriaSetName: "OMS / NOF / FRAX / ISCD",
  groups: [
    {
      id: "osteo-clin",
      title: "1. Diagnóstico Clínico — Fratura por Fragilidade",
      note: "Fratura por trauma mínimo (queda da própria altura). Se presente, já fecha diagnóstico independente da DXA.",
      items: [
        { id: "osteo-fx-col", label: "Fratura de compressão vertebral por fragilidade" },
        { id: "osteo-fx-quad", label: "Fratura de quadril (fêmur proximal) por fragilidade" },
        { id: "osteo-fx-punho", label: "Fratura de punho (rádio distal) por fragilidade" },
        { id: "osteo-fx-umero", label: "Fratura de úmero proximal por fragilidade" },
        { id: "osteo-fx-pelve", label: "Fratura de pelve por fragilidade" },
        { id: "osteo-fx-costela", label: "Fratura de costela por fragilidade" },
      ],
    },
    {
      id: "osteo-pop",
      title: "2. Perfil do Paciente",
      note: "Selecione o perfil que se aplica ao paciente.",
      items: [
        { id: "osteo-pop-pos", label: "Mulher na pós-menopausa OU Homem ≥50 anos" },
        { id: "osteo-pop-pre", label: "Mulher na pré-menopausa OU Homem <50 anos" },
        { id: "osteo-pop-dm", label: "Paciente com Diabetes Mellitus (tipo 1 ou 2)" },
      ],
    },
    {
      id: "osteo-dxa",
      title: "3. Densitometria Óssea (DXA)",
      note: "Selecione o achado densitométrico. Sítios válidos: coluna L1-L4, fêmur total, colo femoral, rádio 33%.",
      items: [
        { id: "osteo-dxa-normal", label: "T-score ≥ -1,0 (Normal)" },
        { id: "osteo-dxa-penia", label: "T-score entre -1,0 e -2,49 (Osteopenia)" },
        { id: "osteo-dxa-op", label: "T-score ≤ -2,5 (Osteoporose densitométrica)" },
        { id: "osteo-dxa-dm20", label: "T-score ≤ -2,0 em paciente diabético (corte diferenciado)" },
        { id: "osteo-zscore", label: "Z-score ≤ -2,0 (baixa massa óssea para a idade)" },
      ],
    },
    {
      id: "osteo-frax",
      title: "4. FRAX — Alto Risco de Fratura (com Osteopenia)",
      note: "Aplicável se T-score entre -1,0 e -2,49. O FRAX integra fatores clínicos + DMO do colo femoral.",
      items: [
        { id: "osteo-frax-major", label: "FRAX: risco de fratura maior osteoporótica ≥20% em 10 anos" },
        { id: "osteo-frax-hip", label: "FRAX: risco de fratura de quadril ≥3% em 10 anos" },
      ],
    },
    {
      id: "osteo-oculta",
      title: "5. Investigação Complementar",
      note: "Etapas de segurança que complementam o diagnóstico.",
      items: [
        { id: "osteo-vfa", label: "RX coluna ou VFA: fratura vertebral morfométrica identificada" },
        { id: "osteo-sec-exc", label: "Causas secundárias excluídas (Ca, P, VitD, PTH, Cr, FA, HMG, calciúria, testo)" },
        { id: "osteo-tbs", label: "TBS (Trabecular Bone Score) alterado — microarquitetura comprometida" },
      ],
    },
  ],
  evaluate: (checked) => {
    // --- 1. Fratura por fragilidade (diagnóstico clínico direto) ---
    const fxCount = countInGroup(checked, osteoporose.groups[0]);
    const hasFx = fxCount >= 1;

    // --- 2. Perfil do paciente ---
    const isPostmeno = checked.has("osteo-pop-pos");
    const isPremeno = checked.has("osteo-pop-pre");
    const isDM = checked.has("osteo-pop-dm");

    // --- 3. DXA ---
    const dxaNormal = checked.has("osteo-dxa-normal");
    const dxaPenia = checked.has("osteo-dxa-penia");
    const dxaOP = checked.has("osteo-dxa-op");
    const dxaDM20 = checked.has("osteo-dxa-dm20");
    const zscoreLow = checked.has("osteo-zscore");

    // --- 4. FRAX ---
    const fraxHigh = checked.has("osteo-frax-major") || checked.has("osteo-frax-hip");

    // --- 5. VFA ---
    const vfaFx = checked.has("osteo-vfa");

    // --- Lógica diagnóstica ---
    let met = false;
    let severity = "";
    const details: string[] = [];

    // Via 1: Fratura por fragilidade
    if (hasFx || vfaFx) {
      met = true;
      if (dxaOP) {
        severity = "Osteoporose Grave/Estabelecida";
        details.push("Fratura por fragilidade + T-score ≤ -2,5 → Osteoporose Grave.");
      } else {
        severity = "Osteoporose (diagnóstico clínico)";
        details.push("Fratura por fragilidade confirma osteoporose independentemente da DXA.");
      }
    }

    // Via 2: DXA — pós-menopausa / homens ≥50
    if (!met && isPostmeno) {
      if (dxaOP) {
        met = true;
        severity = "Osteoporose densitométrica";
        details.push("T-score ≤ -2,5 em mulher pós-menopausa ou homem ≥50 anos.");
      } else if (isDM && dxaDM20) {
        met = true;
        severity = "Osteoporose (corte para DM: T-score ≤ -2,0)";
        details.push("Paciente diabético com T-score ≤ -2,0 — risco subestimado pela DMO convencional.");
      } else if (dxaPenia && fraxHigh) {
        met = true;
        severity = "Osteoporose (Osteopenia + FRAX alto)";
        details.push("Osteopenia com FRAX elevado (≥20% fratura maior ou ≥3% quadril) → indicação de tratamento.");
      }
    }

    // Via 2b: DM sem perfil selecionado
    if (!met && isDM && dxaDM20) {
      met = true;
      severity = "Osteoporose (corte para DM: T-score ≤ -2,0)";
      details.push("Paciente diabético com T-score ≤ -2,0.");
    }

    // Via 3: Pré-menopausa / homens <50 — Z-score
    if (!met && isPremeno && zscoreLow) {
      if (hasFx || vfaFx) {
        met = true;
        severity = "Osteoporose (Z-score ≤ -2,0 + fratura)";
        details.push("Z-score ≤ -2,0 com fratura por fragilidade em paciente jovem.");
      } else {
        details.push(
          "Z-score ≤ -2,0 = 'baixa massa óssea para a idade'. Para firmar osteoporose é necessária fratura por fragilidade ou causa secundária robusta."
        );
      }
    }

    // Notas adicionais
    if (checked.has("osteo-tbs")) {
      details.push("TBS alterado sugere comprometimento da microarquitetura — útil especialmente em diabéticos.");
    }
    if (checked.has("osteo-sec-exc")) {
      details.push("Causas secundárias foram excluídas (exames laboratoriais).");
    } else if (met) {
      details.push("⚠️ Lembre-se de excluir causas secundárias (Ca, P, VitD, PTH, Cr, FA, HMG, calciúria).");
    }
    if (zscoreLow && !isPremeno) {
      details.push("Z-score ≤ -2,0 alerta para provável causa secundária de perda óssea.");
    }
    if (dxaPenia && !fraxHigh && !hasFx && !vfaFx && isPostmeno) {
      details.push("Osteopenia sem FRAX elevado: considerar monitoramento e medidas não farmacológicas.");
    }

    const totalChecked =
      fxCount +
      (dxaOP ? 1 : 0) +
      (dxaPenia ? 1 : 0) +
      (fraxHigh ? 1 : 0) +
      (zscoreLow ? 1 : 0) +
      (vfaFx ? 1 : 0);

    return {
      met,
      summary: met
        ? `✅ Diagnóstico: ${severity}`
        : "❌ Critérios diagnósticos para Osteoporose NÃO preenchidos",
      detail: details.length > 0 ? details.join("\n") : "Selecione os achados clínicos e densitométricos do paciente.",
    };
  },
};
