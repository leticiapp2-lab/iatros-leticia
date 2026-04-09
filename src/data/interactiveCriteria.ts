export type {
  CriteriaItem,
  CriteriaGroup,
  EvaluationResult,
  InteractiveDisease,
} from "./criteria/types";
export { countInGroup, sumPointsInGroup } from "./criteria/types";

import { InteractiveDisease, countInGroup, sumPointsInGroup } from "./criteria/types";
import { has } from "./criteria/has";
import { dislipidemia } from "./criteria/dislipidemia";
import { drc } from "./criteria/drc";
import { hipotireoidismo } from "./criteria/hipotireoidismo";
import { hipertireoidismo } from "./criteria/hipertireoidismo";
import { osteoporose } from "./criteria/osteoporose";

// ── Original diseases (inline for backward compat) ──

const depressao: InteractiveDisease = {
  id: "depressao",
  name: "Depressão (Transtorno Depressivo Maior)",
  shortName: "Depressão",
  criteriaSetName: "DSM-5",
  groups: [
    {
      id: "dep-core",
      title: "Sintomas Nucleares (≥1 obrigatório)",
      note: "Pelo menos 1 destes deve estar presente",
      minRequired: 1,
      items: [
        { id: "dep-1", label: "Humor deprimido a maioria dos dias" },
        { id: "dep-2", label: "Anedonia (perda de interesse/prazer)" },
      ],
    },
    {
      id: "dep-add",
      title: "Sintomas Adicionais",
      note: "Total (nucleares + adicionais) deve ser ≥5",
      items: [
        { id: "dep-3", label: "Alteração significativa de peso/apetite" },
        { id: "dep-4", label: "Insônia ou hipersônia" },
        { id: "dep-5", label: "Agitação ou retardo psicomotor" },
        { id: "dep-6", label: "Fadiga/perda de energia" },
        { id: "dep-7", label: "Sentimentos de inutilidade/culpa excessiva" },
        { id: "dep-8", label: "Concentração reduzida/dificuldade de decisão" },
        { id: "dep-9", label: "Pensamentos recorrentes de morte/suicídio" },
      ],
    },
    {
      id: "dep-time",
      title: "Critério Temporal",
      allRequired: true,
      items: [
        { id: "dep-time-1", label: "Sintomas presentes por ≥2 semanas" },
      ],
    },
    {
      id: "dep-excl",
      title: "Exclusões (devem estar ausentes)",
      note: "Marque se AUSENTE (não atribuível a):",
      allRequired: true,
      items: [
        { id: "dep-excl-1", label: "Não atribuído a substância/condição médica" },
        { id: "dep-excl-2", label: "Não explicado por transtorno psicótico" },
      ],
    },
  ],
  evaluate: (checked) => {
    const coreCount = countInGroup(checked, depressao.groups[0]);
    const addCount = countInGroup(checked, depressao.groups[1]);
    const totalSymptoms = coreCount + addCount;
    const timeMet = checked.has("dep-time-1");
    const exclMet = checked.has("dep-excl-1") && checked.has("dep-excl-2");
    const met = coreCount >= 1 && totalSymptoms >= 5 && timeMet && exclMet;
    return {
      met,
      score: totalSymptoms,
      maxScore: 9,
      summary: met
        ? `✅ Critérios preenchidos (${totalSymptoms}/9 sintomas)`
        : `❌ Critérios NÃO preenchidos (${totalSymptoms}/9 sintomas)`,
      detail: !timeMet
        ? "Critério temporal não atendido (≥2 semanas)"
        : coreCount < 1
        ? "Necessário ≥1 sintoma nuclear (humor deprimido ou anedonia)"
        : totalSymptoms < 5
        ? `Necessário ≥5 sintomas totais (atual: ${totalSymptoms})`
        : !exclMet
        ? "Exclusões não confirmadas"
        : "Todos os critérios DSM-5 para TDM foram preenchidos.",
    };
  },
};

const tag: InteractiveDisease = {
  id: "tag",
  name: "Transtorno de Ansiedade Generalizada",
  shortName: "TAG",
  criteriaSetName: "DSM-5",
  groups: [
    {
      id: "tag-req",
      title: "Requisitos Obrigatórios",
      allRequired: true,
      items: [
        { id: "tag-req-1", label: "Preocupação excessiva, maioria dos dias, >6 meses" },
        { id: "tag-req-2", label: "Difícil de controlar a preocupação" },
      ],
    },
    {
      id: "tag-sx",
      title: "Sintomas Associados (≥3 necessários)",
      minRequired: 3,
      items: [
        { id: "tag-1", label: "Inquietação/agitação" },
        { id: "tag-2", label: "Fadiga fácil" },
        { id: "tag-3", label: "Dificuldade de concentração" },
        { id: "tag-4", label: "Irritabilidade" },
        { id: "tag-5", label: "Tensão muscular" },
        { id: "tag-6", label: "Perturbação do sono" },
      ],
    },
    {
      id: "tag-func",
      title: "Impacto Funcional",
      allRequired: true,
      items: [
        { id: "tag-func-1", label: "Causa sofrimento clinicamente significativo" },
      ],
    },
  ],
  evaluate: (checked) => {
    const reqMet = checked.has("tag-req-1") && checked.has("tag-req-2");
    const sxCount = countInGroup(checked, tag.groups[1]);
    const funcMet = checked.has("tag-func-1");
    const met = reqMet && sxCount >= 3 && funcMet;
    return {
      met,
      score: sxCount,
      maxScore: 6,
      summary: met
        ? `✅ Critérios preenchidos (${sxCount}/6 sintomas)`
        : `❌ Critérios NÃO preenchidos (${sxCount}/6 sintomas)`,
      detail: !reqMet
        ? "Requisitos obrigatórios não atendidos"
        : sxCount < 3
        ? `Necessário ≥3 sintomas associados (atual: ${sxCount})`
        : !funcMet
        ? "Impacto funcional não confirmado"
        : "Todos os critérios DSM-5 para TAG foram preenchidos.",
    };
  },
};

const les: InteractiveDisease = {
  id: "les",
  name: "Lupus Eritematoso Sistêmico",
  shortName: "LES",
  criteriaSetName: "EULAR/ACR 2019",
  groups: [
    {
      id: "les-entry",
      title: "Critério de Entrada (obrigatório)",
      allRequired: true,
      items: [
        { id: "les-ana", label: "ANA ≥1:80 (imunofluorescência indireta)", points: 0 },
      ],
    },
    {
      id: "les-clin",
      title: "Critérios Clínicos",
      note: "Selecione todos os presentes. Pontuação total ≥10 fecha diagnóstico.",
      items: [
        { id: "les-c1", label: "Febre", points: 2 },
        { id: "les-c2", label: "Leucopenia", points: 4 },
        { id: "les-c3", label: "Trombocitopenia", points: 4 },
        { id: "les-c4", label: "Anemia hemolítica autoimune", points: 4 },
        { id: "les-c5", label: "Delirium", points: 2 },
        { id: "les-c6", label: "Psicose", points: 3 },
        { id: "les-c7", label: "Convulsão", points: 5 },
        { id: "les-c8", label: "Lúpus cutâneo agudo", points: 6 },
        { id: "les-c9", label: "Lúpus cutâneo subagudo/discóide", points: 4 },
        { id: "les-c10", label: "Úlceras orais", points: 2 },
        { id: "les-c11", label: "Alopecia não cicatricial", points: 2 },
        { id: "les-c12", label: "Derrame pleural/pericárdico", points: 5 },
        { id: "les-c13", label: "Pericardite aguda", points: 6 },
        { id: "les-c14", label: "Envolvimento articular", points: 6 },
        { id: "les-c15", label: "Proteinúria >0,5g/24h", points: 4 },
        { id: "les-c16", label: "Nefrite lúpica classe II ou V", points: 8 },
        { id: "les-c17", label: "Nefrite lúpica classe III ou IV", points: 10 },
      ],
    },
    {
      id: "les-imm",
      title: "Critérios Imunológicos",
      items: [
        { id: "les-i1", label: "Anticorpos antifosfolípides", points: 2 },
        { id: "les-i2", label: "C3 OU C4 baixo", points: 3 },
        { id: "les-i3", label: "C3 E C4 baixos", points: 4 },
        { id: "les-i4", label: "Anti-dsDNA", points: 6 },
        { id: "les-i5", label: "Anti-Smith", points: 6 },
      ],
    },
  ],
  evaluate: (checked) => {
    const anaMet = checked.has("les-ana");
    const clinScore = sumPointsInGroup(checked, les.groups[1]);
    const immScore = sumPointsInGroup(checked, les.groups[2]);
    const totalScore = clinScore + immScore;
    const met = anaMet && totalScore >= 10;
    return {
      met,
      score: totalScore,
      summary: met
        ? `✅ Diagnóstico de LES (${totalScore} pontos ≥10)`
        : `❌ Critérios NÃO preenchidos (${totalScore} pontos)`,
      detail: !anaMet
        ? "Critério de entrada (ANA ≥1:80) não atendido"
        : totalScore < 10
        ? `Pontuação insuficiente: ${totalScore}/10 necessários`
        : `Pontuação total: ${totalScore} pontos. Diagnóstico de LES preenchido (sensibilidade 96,1%, especificidade 93,4%).`,
    };
  },
};

const enxaquecaSemAura: InteractiveDisease = {
  id: "enxaqueca-sem-aura",
  name: "Enxaqueca sem Aura",
  shortName: "Enxaqueca s/ Aura",
  criteriaSetName: "ICHD-3",
  groups: [
    {
      id: "enx-a",
      title: "Critério A",
      allRequired: true,
      items: [
        { id: "enx-a1", label: "Pelo menos 5 crises preenchendo critérios B-D" },
      ],
    },
    {
      id: "enx-b",
      title: "Critério B — Duração",
      allRequired: true,
      items: [
        { id: "enx-b1", label: "Cefaleia durando 4-72 horas (sem tratamento eficaz)" },
      ],
    },
    {
      id: "enx-c",
      title: "Critério C — Características (≥2 de 4)",
      minRequired: 2,
      items: [
        { id: "enx-c1", label: "Localização unilateral" },
        { id: "enx-c2", label: "Qualidade pulsátil" },
        { id: "enx-c3", label: "Intensidade moderada a severa" },
        { id: "enx-c4", label: "Piora com atividade física de rotina" },
      ],
    },
    {
      id: "enx-d",
      title: "Critério D — Sintomas Associados (≥1 de 2)",
      minRequired: 1,
      items: [
        { id: "enx-d1", label: "Náusea e/ou vômito" },
        { id: "enx-d2", label: "Fotofobia E fonofobia" },
      ],
    },
    {
      id: "enx-e",
      title: "Critério E — Exclusão",
      allRequired: true,
      items: [
        { id: "enx-e1", label: "Não melhor explicada por outro diagnóstico" },
      ],
    },
  ],
  evaluate: (checked) => {
    const aMet = checked.has("enx-a1");
    const bMet = checked.has("enx-b1");
    const cCount = countInGroup(checked, enxaquecaSemAura.groups[2]);
    const dCount = countInGroup(checked, enxaquecaSemAura.groups[3]);
    const eMet = checked.has("enx-e1");
    const met = aMet && bMet && cCount >= 2 && dCount >= 1 && eMet;
    return {
      met,
      summary: met
        ? "✅ Critérios ICHD-3 para Enxaqueca sem Aura preenchidos"
        : "❌ Critérios NÃO preenchidos",
      detail: !aMet
        ? "Critério A não atendido (≥5 crises)"
        : !bMet
        ? "Critério B não atendido (duração 4-72h)"
        : cCount < 2
        ? `Critério C: ${cCount}/4 características (necessário ≥2)`
        : dCount < 1
        ? "Critério D: nenhum sintoma associado selecionado (necessário ≥1)"
        : !eMet
        ? "Critério E: exclusão não confirmada"
        : "Todos os critérios ICHD-3 foram preenchidos.",
    };
  },
};

const ibs: InteractiveDisease = {
  id: "ibs",
  name: "Síndrome do Intestino Irritável",
  shortName: "SII",
  criteriaSetName: "Roma IV",
  groups: [
    {
      id: "ibs-req",
      title: "Requisito Obrigatório",
      allRequired: true,
      items: [
        { id: "ibs-req-1", label: "Dor abdominal recorrente, ≥1 dia/semana nos últimos 3 meses" },
      ],
    },
    {
      id: "ibs-assoc",
      title: "Associação com Defecação (≥2 de 3)",
      minRequired: 2,
      items: [
        { id: "ibs-1", label: "Relacionada à defecação" },
        { id: "ibs-2", label: "Mudança na frequência das fezes" },
        { id: "ibs-3", label: "Mudança na forma/aparência das fezes" },
      ],
    },
  ],
  evaluate: (checked) => {
    const reqMet = checked.has("ibs-req-1");
    const assocCount = countInGroup(checked, ibs.groups[1]);
    const met = reqMet && assocCount >= 2;
    return {
      met,
      score: assocCount,
      maxScore: 3,
      summary: met
        ? `✅ Critérios Roma IV preenchidos (${assocCount}/3)`
        : `❌ Critérios NÃO preenchidos (${assocCount}/3)`,
      detail: !reqMet
        ? "Dor abdominal recorrente não confirmada"
        : assocCount < 2
        ? `Necessário ≥2 associações com defecação (atual: ${assocCount})`
        : "Critérios Roma IV para SII preenchidos.",
    };
  },
};

const pcos: InteractiveDisease = {
  id: "pcos",
  name: "Síndrome dos Ovários Policísticos",
  shortName: "PCOS",
  criteriaSetName: "Rotterdam 2003",
  groups: [
    {
      id: "pcos-crit",
      title: "Critérios de Rotterdam (≥2 de 3)",
      minRequired: 2,
      items: [
        { id: "pcos-1", label: "Hiperandrogenismo (clínico ou bioquímico)" },
        { id: "pcos-2", label: "Disfunção ovariana (oligo/anovulação ou morfologia policística)" },
        { id: "pcos-3", label: "Exclusão de causas secundárias confirmada" },
      ],
    },
  ],
  evaluate: (checked) => {
    const count = countInGroup(checked, pcos.groups[0]);
    const met = count >= 2;
    return {
      met,
      score: count,
      maxScore: 3,
      summary: met
        ? `✅ Critérios Rotterdam preenchidos (${count}/3)`
        : `❌ Critérios NÃO preenchidos (${count}/3)`,
      detail: met
        ? "≥2 critérios de Rotterdam preenchidos."
        : `Necessário ≥2 critérios (atual: ${count})`,
    };
  },
};

const oaJoelho: InteractiveDisease = {
  id: "osteoartrite-joelho",
  name: "Osteoartrite — Joelho",
  shortName: "OA Joelho",
  criteriaSetName: "ACR",
  groups: [
    {
      id: "oa-req",
      title: "Requisito Obrigatório",
      allRequired: true,
      items: [
        { id: "oa-req-1", label: "Dor no joelho na maioria dos dias" },
      ],
    },
    {
      id: "oa-crit",
      title: "Critérios Adicionais (≥3 de 4)",
      minRequired: 3,
      items: [
        { id: "oa-1", label: "Idade >55 anos" },
        { id: "oa-2", label: "Rigidez matutina <30 minutos" },
        { id: "oa-3", label: "Crepitação" },
        { id: "oa-4", label: "Sensibilidade óssea / osteófitos" },
      ],
    },
  ],
  evaluate: (checked) => {
    const reqMet = checked.has("oa-req-1");
    const critCount = countInGroup(checked, oaJoelho.groups[1]);
    const met = reqMet && critCount >= 3;
    return {
      met,
      score: critCount,
      maxScore: 4,
      summary: met
        ? `✅ Critérios ACR preenchidos (${critCount}/4)`
        : `❌ Critérios NÃO preenchidos (${critCount}/4)`,
      detail: !reqMet
        ? "Dor no joelho não confirmada"
        : critCount < 3
        ? `Necessário ≥3 critérios adicionais (atual: ${critCount})`
        : "Critérios ACR para OA de joelho preenchidos.",
    };
  },
};

const fibromialgia: InteractiveDisease = {
  id: "fibromialgia",
  name: "Fibromialgia",
  shortName: "Fibromialgia",
  criteriaSetName: "AAPT/APS 2019",
  groups: [
    {
      id: "fibro-crit",
      title: "Critérios AAPT/APS",
      allRequired: true,
      items: [
        { id: "fibro-1", label: "Dor em ≥6 de 9 sítios corporais possíveis" },
        { id: "fibro-2", label: "Problemas moderados a severos de sono OU fadiga" },
        { id: "fibro-3", label: "Sintomas presentes por ≥3 meses" },
      ],
    },
  ],
  evaluate: (checked) => {
    const count = countInGroup(checked, fibromialgia.groups[0]);
    const met = count === 3;
    return {
      met,
      score: count,
      maxScore: 3,
      summary: met
        ? "✅ Critérios AAPT/APS preenchidos"
        : `❌ Critérios NÃO preenchidos (${count}/3)`,
      detail: met
        ? "Todos os critérios AAPT/APS 2019 para fibromialgia preenchidos."
        : `Necessário todos os 3 critérios (atual: ${count})`,
    };
  },
};

const diabetesT2: InteractiveDisease = {
  id: "diabetes-tipo-2",
  name: "Diabetes Tipo 2",
  shortName: "Diabetes T2",
  criteriaSetName: "ADA",
  groups: [
    {
      id: "dm-symp",
      title: "Via Sintomática (qualquer 1)",
      items: [
        { id: "dm-s1", label: "Glicose plasmática aleatória ≥200 mg/dL + sintomas clássicos" },
      ],
    },
    {
      id: "dm-lab",
      title: "Via Laboratorial (qualquer 1, confirmar em dia subsequente)",
      items: [
        { id: "dm-l1", label: "Glicose de jejum ≥126 mg/dL (jejum ≥8h)" },
        { id: "dm-l2", label: "OGTT: glicose 2h ≥200 mg/dL (após 75g)" },
        { id: "dm-l3", label: "HbA1c ≥6,5%" },
      ],
    },
  ],
  evaluate: (checked) => {
    const sympCount = countInGroup(checked, diabetesT2.groups[0]);
    const labCount = countInGroup(checked, diabetesT2.groups[1]);
    const met = sympCount >= 1 || labCount >= 1;
    return {
      met,
      summary: met
        ? "✅ Critérios diagnósticos para DM2 preenchidos"
        : "❌ Nenhum critério diagnóstico preenchido",
      detail: met
        ? sympCount >= 1
          ? "Diagnóstico por via sintomática (glicose aleatória + sintomas)."
          : "Diagnóstico por via laboratorial. Confirmar em dia subsequente se assintomático."
        : "Selecione ao menos 1 critério diagnóstico.",
    };
  },
};

export const interactiveDiseases: InteractiveDisease[] = [
  depressao,
  tag,
  les,
  enxaquecaSemAura,
  ibs,
  pcos,
  oaJoelho,
  fibromialgia,
  diabetesT2,
  has,
  dislipidemia,
  drc,
  hipotireoidismo,
  hipertireoidismo,
  osteoporose,
];
