import { InteractiveDisease, countInGroup } from "./types";

export const tab: InteractiveDisease = {
  id: "tab",
  name: "Transtorno Afetivo Bipolar (TAB)",
  shortName: "TAB",
  criteriaSetName: "DSM-5",
  groups: [
    // ── Bipolar Tipo I ──
    {
      id: "tab1-a",
      title: "Tipo I — Critério A: Episódio Maníaco",
      allRequired: true,
      note: "Humor elevado/expansivo/irritável + energia aumentada por ≥1 semana (ou hospitalização)",
      items: [
        { id: "tab1-a1", label: "Humor anormal e persistentemente elevado, expansivo ou irritável" },
        { id: "tab1-a2", label: "Aumento anormal e persistente da atividade/energia (≥1 semana ou hospitalização)" },
      ],
    },
    {
      id: "tab1-b",
      title: "Tipo I — Critério B: Sintomas de Mania (≥3, ou ≥4 se humor apenas irritável)",
      minRequired: 3,
      items: [
        { id: "tab1-b1", label: "Autoestima inflada ou grandiosidade" },
        { id: "tab1-b2", label: "Redução da necessidade de sono" },
        { id: "tab1-b3", label: "Pressão para falar (mais loquaz que o habitual)" },
        { id: "tab1-b4", label: "Fuga de ideias ou pensamentos acelerados" },
        { id: "tab1-b5", label: "Distratibilidade aumentada" },
        { id: "tab1-b6", label: "Aumento da atividade dirigida a objetivos ou agitação psicomotora" },
        { id: "tab1-b7", label: "Envolvimento excessivo em atividades com potencial para consequências dolorosas" },
      ],
    },
    {
      id: "tab1-c",
      title: "Tipo I — Critério C: Gravidade",
      allRequired: true,
      items: [
        { id: "tab1-c1", label: "Prejuízo acentuado no funcionamento, hospitalização ou características psicóticas" },
      ],
    },
    {
      id: "tab1-excl",
      title: "Tipo I — Exclusões",
      allRequired: true,
      items: [
        { id: "tab1-excl1", label: "Não atribuível a substância/condição médica" },
        { id: "tab1-excl2", label: "Não explicado por esquizofrenia ou transtorno esquizoafetivo" },
      ],
    },
    // ── Bipolar Tipo II ──
    {
      id: "tab2-hipo",
      title: "Tipo II — Episódio Hipomaníaco",
      allRequired: true,
      note: "Mesmo perfil da mania, mas ≥4 dias, sem prejuízo grave, sem hospitalização, sem psicose",
      items: [
        { id: "tab2-h1", label: "Humor elevado/expansivo/irritável + energia aumentada por ≥4 dias consecutivos" },
        { id: "tab2-h2", label: "≥3 sintomas de mania presentes (≥4 se humor apenas irritável)" },
        { id: "tab2-h3", label: "Mudança inequívoca no funcionamento, observável por outros" },
        { id: "tab2-h4", label: "Sem prejuízo grave, sem hospitalização, sem características psicóticas" },
      ],
    },
    {
      id: "tab2-dep",
      title: "Tipo II — Episódio Depressivo Maior",
      allRequired: true,
      note: "≥5 sintomas por ≥2 semanas, incluindo humor deprimido ou anedonia",
      items: [
        { id: "tab2-d1", label: "Humor deprimido ou perda de interesse/prazer (obrigatório)" },
        { id: "tab2-d2", label: "≥5 sintomas depressivos totais por ≥2 semanas" },
      ],
    },
    {
      id: "tab2-excl",
      title: "Tipo II — Exclusão de Mania",
      allRequired: true,
      items: [
        { id: "tab2-excl1", label: "Jamais houve episódio maníaco completo" },
      ],
    },
  ],
  evaluate: (checked) => {
    // Tipo I
    const t1a = checked.has("tab1-a1") && checked.has("tab1-a2");
    const t1bCount = countInGroup(checked, tab.groups[1]);
    const t1c = checked.has("tab1-c1");
    const t1excl = checked.has("tab1-excl1") && checked.has("tab1-excl2");
    const tipo1 = t1a && t1bCount >= 3 && t1c && t1excl;

    // Tipo II
    const t2hipo = checked.has("tab2-h1") && checked.has("tab2-h2") && checked.has("tab2-h3") && checked.has("tab2-h4");
    const t2dep = checked.has("tab2-d1") && checked.has("tab2-d2");
    const t2excl = checked.has("tab2-excl1");
    const tipo2 = t2hipo && t2dep && t2excl;

    const met = tipo1 || tipo2;

    let detail = "";
    if (tipo1) detail = "Critérios DSM-5 para Transtorno Bipolar Tipo I preenchidos (episódio maníaco confirmado).";
    else if (tipo2) detail = "Critérios DSM-5 para Transtorno Bipolar Tipo II preenchidos (hipomania + depressão maior, sem mania).";
    else if (t1a && t1bCount < 3) detail = `Tipo I: sintomas de mania insuficientes (${t1bCount}/3 necessários)`;
    else if (!t1a && !t2hipo) detail = "Nenhum episódio maníaco ou hipomaníaco confirmado";
    else detail = "Critérios incompletos — verifique todos os grupos";

    return {
      met,
      summary: met
        ? `✅ Critérios preenchidos — ${tipo1 ? "Bipolar Tipo I" : "Bipolar Tipo II"}`
        : "❌ Critérios NÃO preenchidos",
      detail,
    };
  },
};
