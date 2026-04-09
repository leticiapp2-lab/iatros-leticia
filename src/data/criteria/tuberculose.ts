import { InteractiveDisease, countInGroup, sumPointsInGroup } from "./types";

export const tuberculose: InteractiveDisease = {
  id: "tuberculose",
  name: "Tuberculose",
  shortName: "Tuberculose",
  criteriaSetName: "MS Brasil / OMS",
  groups: [
    {
      id: "tb-pop",
      title: "Perfil do Paciente",
      note: "Selecione o perfil e a faixa etária.",
      items: [
        { id: "tb-adulto", label: "Adulto ou adolescente (≥10 anos)" },
        { id: "tb-crianca", label: "Criança (<10 anos)" },
        { id: "tb-vuln", label: "População vulnerável (HIV, privação de liberdade, situação de rua, contato de TB)" },
      ],
    },
    {
      id: "tb-clin",
      title: "Critérios Clínicos — Adultos/Adolescentes",
      note: "Sintomático respiratório: tosse ≥3 semanas (população geral) ou qualquer tosse (vulneráveis).",
      items: [
        { id: "tb-tosse3", label: "Tosse por ≥3 semanas" },
        { id: "tb-tosse-qual", label: "Tosse de qualquer duração (em população vulnerável)" },
        { id: "tb-febre", label: "Febre vespertina" },
        { id: "tb-sudorese", label: "Sudorese noturna" },
        { id: "tb-emag", label: "Emagrecimento" },
        { id: "tb-fadiga", label: "Fadiga" },
      ],
    },
    {
      id: "tb-lab",
      title: "Exames Laboratoriais — Adultos/Adolescentes",
      note: "TRM-TB é prioritário (resultado em ~2h, 1 amostra). Cultura é padrão-ouro.",
      items: [
        { id: "tb-trm", label: "TRM-TB positivo (detectado M. tuberculosis)" },
        { id: "tb-trm-rif", label: "TRM-TB: resistência à rifampicina detectada" },
        { id: "tb-baar", label: "Baciloscopia (BAAR) positiva" },
        { id: "tb-cultura", label: "Cultura para micobactérias positiva" },
      ],
    },
    {
      id: "tb-rx",
      title: "Radiografia de Tórax",
      items: [
        { id: "tb-rx-cav", label: "Cavidades pulmonares" },
        { id: "tb-rx-nod", label: "Nódulos ou consolidações sugestivas" },
        { id: "tb-rx-outras", label: "Outras alterações sugestivas de TB" },
      ],
    },
    {
      id: "tb-ped-clin",
      title: "Escore Pediátrico — Quadro Clínico-Radiológico",
      note: "Para crianças <10 anos. Febre/tosse/emagrecimento ≥2 semanas = 15 pts. RX alterado = 15 pts.",
      items: [
        { id: "tb-ped-sx", label: "Febre ou sintomas (tosse, emagrecimento) por ≥2 semanas", points: 15 },
        { id: "tb-ped-rx", label: "Adenomegalia hilar, padrão miliar ou condensação inalterada/pior após ATB", points: 15 },
      ],
    },
    {
      id: "tb-ped-contato",
      title: "Escore Pediátrico — Contato",
      items: [
        { id: "tb-ped-cont", label: "Contato próximo com adulto com TB nos últimos 2 anos", points: 10 },
      ],
    },
    {
      id: "tb-ped-pt",
      title: "Escore Pediátrico — Prova Tuberculínica / IGRA",
      note: "Selecione apenas um.",
      items: [
        { id: "tb-ped-pt10", label: "PT ≥10 mm ou IGRA positivo", points: 10 },
        { id: "tb-ped-pt5", label: "PT entre 5 e 9 mm", points: 5 },
      ],
    },
    {
      id: "tb-ped-nutri",
      title: "Escore Pediátrico — Estado Nutricional",
      items: [
        { id: "tb-ped-desn", label: "Desnutrição grave", points: 5 },
      ],
    },
  ],
  evaluate: (checked) => {
    const isAdulto = checked.has("tb-adulto");
    const isCrianca = checked.has("tb-crianca");
    const isVuln = checked.has("tb-vuln");

    // ── ADULTO / ADOLESCENTE ──
    if (isAdulto || (!isCrianca && !isAdulto)) {
      const hasSx = checked.has("tb-tosse3") || (isVuln && checked.has("tb-tosse-qual")) ||
        checked.has("tb-febre") || checked.has("tb-sudorese") ||
        checked.has("tb-emag") || checked.has("tb-fadiga");

      const trmPos = checked.has("tb-trm");
      const baarPos = checked.has("tb-baar");
      const culturaPos = checked.has("tb-cultura");
      const labConfirm = trmPos || baarPos || culturaPos;

      const rxSug = checked.has("tb-rx-cav") || checked.has("tb-rx-nod") || checked.has("tb-rx-outras");

      if (labConfirm) {
        const rifRes = checked.has("tb-trm-rif");
        return {
          met: true,
          summary: "✅ Tuberculose confirmada laboratorialmente",
          detail: rifRes
            ? "⚠️ Resistência à rifampicina detectada — encaminhar para esquema especial."
            : trmPos
            ? "TRM-TB positivo. Iniciar tratamento."
            : culturaPos
            ? "Cultura positiva (padrão-ouro). Verificar teste de sensibilidade."
            : "Baciloscopia positiva. Solicitar cultura + TSA.",
        };
      }

      if (hasSx && rxSug) {
        return {
          met: false,
          summary: "⚠️ Suspeita clínico-radiológica de TB — aguardar confirmação laboratorial",
          detail: "Solicitar TRM-TB (prioritário), baciloscopia e/ou cultura. Não retardar tratamento se alta suspeição.",
        };
      }

      if (hasSx) {
        return {
          met: false,
          summary: "⚠️ Sintomático respiratório — investigar TB",
          detail: isVuln
            ? "Paciente vulnerável com tosse: solicitar TRM-TB e RX de tórax imediatamente."
            : "Tosse ≥3 semanas: solicitar TRM-TB, baciloscopia e RX de tórax.",
        };
      }

      return {
        met: false,
        summary: "❌ Sem critérios atuais para TB em adulto",
        detail: "Investigar se houver sintomas respiratórios ou contato com caso de TB.",
      };
    }

    // ── CRIANÇA (<10 anos) — ESCORE ──
    const pedScore =
      sumPointsInGroup(checked, tuberculose.groups[4]) +
      sumPointsInGroup(checked, tuberculose.groups[5]) +
      sumPointsInGroup(checked, tuberculose.groups[6]) +
      sumPointsInGroup(checked, tuberculose.groups[7]);

    let classification: string;
    let met = false;
    if (pedScore >= 40) {
      classification = "Diagnóstico MUITO PROVÁVEL — iniciar tratamento";
      met = true;
    } else if (pedScore >= 30) {
      classification = "Diagnóstico POSSÍVEL — iniciar tratamento a critério médico";
      met = true;
    } else {
      classification = "Diagnóstico POUCO PROVÁVEL — continuar investigação";
    }

    return {
      met,
      score: pedScore,
      summary: met
        ? `✅ TB pediátrica: ${classification} (${pedScore} pontos)`
        : `❌ ${classification} (${pedScore} pontos)`,
      detail: `Escore: ${pedScore} pontos.\n≥40 pts = muito provável | 30-35 pts = possível | ≤25 pts = pouco provável.`,
    };
  },
};
