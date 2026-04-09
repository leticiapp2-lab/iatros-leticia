export type {
  CriteriaItem,
  CriteriaGroup,
  EvaluationResult,
  InteractiveDisease,
  DiseaseImage,
  LegendItem,
} from "./criteria/types";
export { countInGroup, sumPointsInGroup } from "./criteria/types";

import { InteractiveDisease, countInGroup, sumPointsInGroup } from "./criteria/types";
import { has } from "./criteria/has";
import { dislipidemia } from "./criteria/dislipidemia";
import { drc } from "./criteria/drc";
import { hipotireoidismo } from "./criteria/hipotireoidismo";
import { hipertireoidismo } from "./criteria/hipertireoidismo";
import { osteoporose } from "./criteria/osteoporose";
import { tuberculose } from "./criteria/tuberculose";
import { hanseniase } from "./criteria/hanseniase";
import { tab } from "./criteria/tab";
import { tea } from "./criteria/tea";
import { tdah } from "./criteria/tdah";
import { esquizofrenia } from "./criteria/esquizofrenia";
import { panico } from "./criteria/panico";
import { tept } from "./criteria/tept";
import { toc } from "./criteria/toc";
import { tag } from "./criteria/tag";
import { fobiaEspecifica } from "./criteria/fobiaEspecifica";
import { agorafobia } from "./criteria/agorafobia";
import { hiv } from "./criteria/hiv";
import { sifilis } from "./criteria/sifilis";
import { hepatiteC } from "./criteria/hepatiteC";

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

import fibromalgiaBodyMap from "@/assets/fibromialgia-body-map.png";

/* ═══ FIBROMIALGIA — ACR 2016 (Revisão 2010/2011) ═══ */
const fibroACR: InteractiveDisease = {
  id: "fibromialgia-acr",
  name: "Fibromialgia — ACR 2016",
  shortName: "Fibromialgia (ACR 2016)",
  criteriaSetName: "ACR 2016 (Revisão 2010/2011) — Sensibilidade 86% / Especificidade 90%",
  groups: [
    {
      id: "acr-regioes",
      title: "1. Dor generalizada (≥4 de 5 regiões)",
      note: "Marque as regiões com dor",
      minRequired: 4,
      items: [
        { id: "acr-r1", label: "Ombro/braço esquerdo" },
        { id: "acr-r2", label: "Ombro/braço direito" },
        { id: "acr-r3", label: "Pescoço/costas" },
        { id: "acr-r4", label: "Quadril/perna esquerda" },
        { id: "acr-r5", label: "Quadril/perna direita" },
      ],
    },
    {
      id: "acr-duracao",
      title: "2. Duração dos sintomas",
      allRequired: true,
      items: [
        { id: "acr-dur", label: "Sintomas presentes por ≥3 meses" },
      ],
    },
    {
      id: "acr-wpi",
      title: "3a. Índice de Dor Generalizada — WPI (0-19)",
      note: "Áreas com dor na última semana (1 ponto cada)",
      items: [
        { id: "wpi-1", label: "Mandíbula esquerda", points: 1 },
        { id: "wpi-2", label: "Mandíbula direita", points: 1 },
        { id: "wpi-3", label: "Ombro esquerdo", points: 1 },
        { id: "wpi-4", label: "Ombro direito", points: 1 },
        { id: "wpi-5", label: "Braço superior esquerdo", points: 1 },
        { id: "wpi-6", label: "Braço superior direito", points: 1 },
        { id: "wpi-7", label: "Braço inferior esquerdo", points: 1 },
        { id: "wpi-8", label: "Braço inferior direito", points: 1 },
        { id: "wpi-9", label: "Quadril/nádegas esquerdo", points: 1 },
        { id: "wpi-10", label: "Quadril/nádegas direito", points: 1 },
        { id: "wpi-11", label: "Coxa esquerda", points: 1 },
        { id: "wpi-12", label: "Coxa direita", points: 1 },
        { id: "wpi-13", label: "Perna inferior esquerda", points: 1 },
        { id: "wpi-14", label: "Perna inferior direita", points: 1 },
        { id: "wpi-15", label: "Pescoço", points: 1 },
        { id: "wpi-16", label: "Costas superiores", points: 1 },
        { id: "wpi-17", label: "Costas inferiores", points: 1 },
        { id: "wpi-18", label: "Tórax", points: 1 },
        { id: "wpi-19", label: "Abdome", points: 1 },
      ],
    },
    {
      id: "acr-sss1",
      title: "3b. Escala de Gravidade de Sintomas — SSS Parte 1",
      note: "Pontue cada sintoma: 0=sem problema, 1=leve, 2=moderado, 3=grave",
      items: [
        { id: "sss-fadiga-1", label: "Fadiga — leve/intermitente", points: 1 },
        { id: "sss-fadiga-2", label: "Fadiga — moderada", points: 2 },
        { id: "sss-fadiga-3", label: "Fadiga — grave/incapacitante", points: 3 },
        { id: "sss-sono-1", label: "Acordar sem descanso — leve", points: 1 },
        { id: "sss-sono-2", label: "Acordar sem descanso — moderado", points: 2 },
        { id: "sss-sono-3", label: "Acordar sem descanso — grave", points: 3 },
        { id: "sss-cog-1", label: "Sintomas cognitivos — leves", points: 1 },
        { id: "sss-cog-2", label: "Sintomas cognitivos — moderados", points: 2 },
        { id: "sss-cog-3", label: "Sintomas cognitivos — graves", points: 3 },
      ],
    },
    {
      id: "acr-sss2",
      title: "3b. SSS Parte 2 — Sintomas associados (1 pt cada)",
      items: [
        { id: "sss-cefaleia", label: "Cefaleia", points: 1 },
        { id: "sss-abdome", label: "Dor ou cólicas abdominais inferiores", points: 1 },
        { id: "sss-depressao", label: "Depressão", points: 1 },
      ],
    },
  ],
  evaluate: (checked) => {
    // 1. Regiões ≥4/5
    const regiaoCount = countInGroup(checked, fibroACR.groups[0]);
    const hasRegioes = regiaoCount >= 4;

    // 2. Duração
    const hasDuracao = checked.has("acr-dur");

    // 3. WPI
    const wpi = sumPointsInGroup(checked, fibroACR.groups[2]);

    // SSS part 1: take highest selected per symptom (fadiga, sono, cog)
    const fadigaScore = checked.has("sss-fadiga-3") ? 3 : checked.has("sss-fadiga-2") ? 2 : checked.has("sss-fadiga-1") ? 1 : 0;
    const sonoScore = checked.has("sss-sono-3") ? 3 : checked.has("sss-sono-2") ? 2 : checked.has("sss-sono-1") ? 1 : 0;
    const cogScore = checked.has("sss-cog-3") ? 3 : checked.has("sss-cog-2") ? 2 : checked.has("sss-cog-1") ? 1 : 0;
    const sss2 = sumPointsInGroup(checked, fibroACR.groups[4]);
    const sss = fadigaScore + sonoScore + cogScore + sss2;

    // Critério 3: (WPI≥7 E SSS≥5) OU (WPI 4-6 E SSS≥9)
    const hasScores = (wpi >= 7 && sss >= 5) || (wpi >= 4 && wpi <= 6 && sss >= 9);

    const met = hasRegioes && hasDuracao && hasScores;

    return {
      met,
      summary: met
        ? "✅ Critérios ACR 2016 preenchidos"
        : "❌ Critérios ACR 2016 NÃO preenchidos",
      detail: `Regiões: ${regiaoCount}/5 (mín. 4) | Duração ≥3m: ${hasDuracao ? "Sim" : "Não"} | WPI: ${wpi}/19 | SSS: ${sss}/12 | ${hasScores ? "Pontuação atendida" : "WPI≥7 + SSS≥5 ou WPI 4-6 + SSS≥9 necessário"}`,
      score: wpi + sss,
      maxScore: 31,
    };
  },
};

/* ═══ FIBROMIALGIA — AAPT 2019 ═══ */
const fibroAAPT: InteractiveDisease = {
  id: "fibromialgia-aapt",
  name: "Fibromialgia — AAPT 2019",
  shortName: "Fibromialgia (AAPT 2019)",
  criteriaSetName: "AAPT/APS 2019",
  image: {
    src: fibromalgiaBodyMap,
    alt: "Mapa corporal dos 9 sítios de dor para fibromialgia",
    interactiveLegend: [
      { id: "site-1", label: "1 — Cabeça" },
      { id: "site-2", label: "2 — Braço esquerdo" },
      { id: "site-3", label: "3 — Braço direito" },
      { id: "site-4", label: "4 — Costas superior" },
      { id: "site-5", label: "5 — Costas inferior" },
      { id: "site-6", label: "6 — Peitoral" },
      { id: "site-7", label: "7 — Abdômen" },
      { id: "site-8", label: "8 — Perna direita" },
      { id: "site-9", label: "9 — Perna esquerda" },
    ],
  },
  groups: [
    {
      id: "aapt-crit",
      title: "Critérios AAPT/APS",
      allRequired: true,
      items: [
        { id: "aapt-2", label: "Problemas moderados a graves de sono OU fadiga" },
        { id: "aapt-3", label: "Sintomas presentes por ≥3 meses" },
      ],
    },
  ],
  evaluate: (checked) => {
    const siteIds = ["site-1","site-2","site-3","site-4","site-5","site-6","site-7","site-8","site-9"];
    const siteCount = siteIds.filter(id => checked.has(id)).length;
    const hasSites = siteCount >= 6;
    const critCount = countInGroup(checked, fibroAAPT.groups[0]);
    const met = hasSites && critCount === 2;
    const total = (hasSites ? 1 : 0) + critCount;
    return {
      met,
      score: total,
      maxScore: 3,
      summary: met
        ? "✅ Critérios AAPT/APS 2019 preenchidos"
        : `❌ Critérios NÃO preenchidos (${total}/3)`,
      detail: met
        ? "Todos os critérios AAPT/APS 2019 para fibromialgia preenchidos."
        : `Sítios de dor: ${siteCount}/9 (mín. 6). Critérios clínicos: ${critCount}/2.`,
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
  tab,
  esquizofrenia,
  tdah,
  tea,
  panico,
  tept,
  toc,
  fobiaEspecifica,
  agorafobia,
  les,
  enxaquecaSemAura,
  ibs,
  pcos,
  oaJoelho,
  fibroACR,
  fibroAAPT,
  diabetesT2,
  has,
  dislipidemia,
  drc,
  hipotireoidismo,
  hipertireoidismo,
  osteoporose,
  tuberculose,
  hanseniase,
  hiv,
  sifilis,
  hepatiteC,
];
