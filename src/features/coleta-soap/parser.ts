import type { FieldType, ParsedField, SectionId } from "./types";

let _id = 0;
const nextId = () => `f_${Date.now().toString(36)}_${(_id++).toString(36)}`;

export interface ParseResult {
  fields: ParsedField[];
  discarded: string[];
}

/* ---------------- Listas de referência ---------------- */

const MANOBRAS = [
  "lasègue", "lasegue", "bragard", "patrick", "faber", "fadir", "murphy", "blumberg",
  "rovsing", "mcburney", "homans", "tinel", "phalen", "finkelstein", "spurling",
  "adson", "trendelenburg", "straight-leg raise", "straight leg raise", "slr", "kernig", "brudzinski",
  "giordano", "babinski", "romberg", "drawer", "lachman", "mcmurray",
  "thomas", "ober", "schober", "gaenslen",
];
const MANOBRA_KEYWORDS = /\b(teste de|sinal de|manobra de)\b/i;

/** Escalas conhecidas com min/max/unidade */
const ESCALAS_CONHECIDAS: Array<{ rx: RegExp; nome: string; min?: number; max?: number; unidade: string }> = [
  { rx: /\b(eva|vas|escala visual anal[óo]gica)\b/i, nome: "EVA (dor)", min: 0, max: 10, unidade: "0–10" },
  { rx: /\bphq[-\s]?9\b/i, nome: "PHQ-9", min: 0, max: 27, unidade: "pts" },
  { rx: /\bgad[-\s]?7\b/i, nome: "GAD-7", min: 0, max: 21, unidade: "pts" },
  { rx: /\bnyha\b/i, nome: "NYHA", min: 1, max: 4, unidade: "classe" },
  { rx: /\bglasgow\b/i, nome: "Glasgow", min: 3, max: 15, unidade: "pts" },
  { rx: /\bmoca\b/i, nome: "MoCA", min: 0, max: 30, unidade: "pts" },
  { rx: /\bmmse\b/i, nome: "MMSE", min: 0, max: 30, unidade: "pts" },
  { rx: /\boswestry|odi\b/i, nome: "Oswestry (ODI)", min: 0, max: 100, unidade: "%" },
  { rx: /\broland[-\s]?morris\b/i, nome: "Roland-Morris", min: 0, max: 24, unidade: "pts" },
  { rx: /\bstart back\b/i, nome: "STarT Back", min: 0, max: 9, unidade: "pts" },
  { rx: /\bcha2ds2[-\s]?vasc\b/i, nome: "CHA₂DS₂-VASc", min: 0, max: 9, unidade: "pts" },
  { rx: /\bhas[-\s]?bled\b/i, nome: "HAS-BLED", min: 0, max: 9, unidade: "pts" },
  { rx: /\bwells\b/i, nome: "Wells", unidade: "pts" },
  { rx: /\bqsofa\b/i, nome: "qSOFA", min: 0, max: 3, unidade: "pts" },
  { rx: /\bsofa\b/i, nome: "SOFA", min: 0, max: 24, unidade: "pts" },
  { rx: /\bapache\b/i, nome: "APACHE II", unidade: "pts" },
  { rx: /\bham[-\s]?d\b/i, nome: "HAM-D", unidade: "pts" },
  { rx: /\bham[-\s]?a\b/i, nome: "HAM-A", unidade: "pts" },
  { rx: /\bbarthel\b/i, nome: "Barthel", min: 0, max: 100, unidade: "pts" },
  { rx: /\bkarnofsky\b/i, nome: "Karnofsky", min: 0, max: 100, unidade: "%" },
  { rx: /\becog\b/i, nome: "ECOG", min: 0, max: 5, unidade: "pts" },
  { rx: /\bframingham\b/i, nome: "Framingham", unidade: "%" },
  { rx: /\bperc\b/i, nome: "PERC", unidade: "pts" },
  { rx: /\bcentor\b/i, nome: "Centor", min: 0, max: 4, unidade: "pts" },
];

const VITAIS_KEYWORDS = [
  { rx: /\b(pa|press[ãa]o arterial)\b/i, label: "PA", unit: "mmHg" },
  { rx: /\b(fc|frequ[êe]ncia card[íi]aca)\b/i, label: "FC", unit: "bpm" },
  { rx: /\b(fr|frequ[êe]ncia respirat[óo]ria)\b/i, label: "FR", unit: "irpm" },
  { rx: /\b(temp(eratura)?)\b/i, label: "Temperatura", unit: "°C" },
  { rx: /\b(sato2|satura[çc][ãa]o)\b/i, label: "SatO₂", unit: "%" },
  { rx: /\bpeso\b/i, label: "Peso", unit: "kg" },
  { rx: /\baltura\b/i, label: "Altura", unit: "cm" },
  { rx: /\bimc\b/i, label: "IMC", unit: "kg/m²" },
  { rx: /\bglicemia\b/i, label: "Glicemia", unit: "mg/dL" },
  { rx: /\bhemoglobina\b/i, label: "Hemoglobina", unit: "g/dL" },
  { rx: /\bcreatinina\b/i, label: "Creatinina", unit: "mg/dL" },
];

/** Linha agregada de vitais: "PA mmHg, FC bpm, FR irpm, Temp °C, SatO2 %, Peso kg, Altura cm, IMC kg/m²" */
const VITAIS_AGGREGATED_RX = /(\bpa\b.{0,8}mmhg).{0,80}(\bfc\b.{0,8}bpm)/i;

const NUMERIC_UNIT_HINTS = [
  { rx: /\bmmHg\b/i, unit: "mmHg" },
  { rx: /\bbpm\b/i, unit: "bpm" },
  { rx: /\birpm\b|\brpm\b/i, unit: "irpm" },
  { rx: /°\s?C/i, unit: "°C" },
  { rx: /\bkg\/m[²2]\b/i, unit: "kg/m²" },
  { rx: /\bkg\b(?!\/)/i, unit: "kg" },
  { rx: /\bcm\b/i, unit: "cm" },
  { rx: /\bmg\/dL\b/i, unit: "mg/dL" },
  { rx: /\bg\/dL\b/i, unit: "g/dL" },
];

/** Itens de laboratório/exame complementar conhecidos (viram checkbox "solicitar") */
const LAB_KNOWN = /\b(vhs|pcr|hemograma|hla[-\s]?b27|t4|tsh|na|k|ureia|creatinina|glicemia|hba1c|colesterol|tgo|tgp|inr|bilirrubina|amilase|lipase|sumario de urina|urina i|coombs|ferritina|tf|sat tf|vit ?d|vit ?b12|ldh)\b/i;
const IMG_KNOWN = /\b(radiografia|raio[-\s]?x|\brx\b|tomografia|\btc\b|resson[âa]ncia|\brnm\b|\brm\b|ultrassom|\busg\b|cintilografia|densitometria|ecocardiograma|endoscopia|colonoscopia)\b/i;

/* Section detection by header */
const SECTION_PATTERNS: Array<{ id: SectionId; rx: RegExp }> = [
  { id: "manobras", rx: /\b(manobra|teste especial|testes? provocativ|special tests|testes? neurol[óo]gicos)\b/i },
  { id: "revisao", rx: /\b(red[\s-]?flags?|sinais? de alerta|tuna fish|revis[ãa]o de sistemas|review of systems|ros|yellow flags?|fatores ocupacion|fatores ergon|caracter[íi]sticas? da dor|irradia[çc][ãa]o|sintomas radiculares|espondiloartrite)\b/i },
  { id: "hda", rx: /\b(hda|hist[óo]ria da doen[çc]a atual|history of present illness|hpi|anamnese)\b/i },
  { id: "sintomas", rx: /\bsintomas associados|associated symptoms\b/i },
  { id: "hmp", rx: /\bhist[óo]ria (m[ée]dica )?(patol[óo]gica|pregressa)|past medical history|pmh\b/i },
  { id: "medicacoes", rx: /\bmedica[çc][õo]es( em uso)?|medications|current medications\b/i },
  { id: "alergias", rx: /\balergias?|allergies\b/i },
  { id: "familiar", rx: /\bhist[óo]ria familiar|family history\b/i },
  { id: "social", rx: /\b(hist[óo]ria social|social history|h[áa]bitos)\b/i },
  { id: "vitais", rx: /\bsinais vitais|vital signs|antropometr/i },
  { id: "exameFisico", rx: /\b(exame f[íi]sico|physical exam(ination)?|inspe[çc][ãa]o|palpa[çc][ãa]o|amplitude de movimento)\b/i },
  { id: "escalas", rx: /\b(escala|question[áa]rio|scales|questionnaires|score|pontua[çc][ãa]o|ferramentas de avalia[çc][ãa]o)\b/i },
  { id: "laboratorio", rx: /\b(exames? laboratoriais|labs?|laborat[óo]rio)\b/i },
  { id: "imagem", rx: /\b(exames? de imagem|imaging|imagem)\b/i },
];

/* ---------------- Pré-processamento ---------------- */

const REF_LINE_ONLY = /^\s*(\[\d+([-,\s]*\d+)*\]\s*)+$/;
const REF_INLINE = /\[\d+([-,\s]*\d+)*\]/g;
const TABLE_LINE = /^\s*\||^\s*[-=]{3,}\s*$/;
const EXPLANATORY_PREFIX = /^(importante|observa[çc][ãa]o|nota|obs|resumo|interpreta[çc][ãa]o|probabilidade pr[ée][- ]teste|no seu paciente|isso sugere|considere que|considere|por que n[ãa]o perder|quando investigar|prevalencia|preval[êe]ncia|conduta|crit[ée]rios cl[íi]nicos sugestivos|atraso diagn[óo]stico|pico de incid[êe]ncia|comum em|raz[ãa]o|risco|n[ãa]o indicado|indica[çc][õo]es|gatilhos|exemplo|armadilha|mitiga[çc][ãa]o|checklist|tratamento|n[ãa]o[- ]farmacol[óo]gico|farmacol[óo]gico|sinais de alerta para encaminhamento|emerg[êe]ncia cir[úu]rgica|urgente|eletivo|sequ[êe]ncia de exame|t[íi]tulo|table\s+\d|figure\s+\d|used under license|am fam physician|n engl j med)\b\s*[:.\-]?/i;
const BIB_LINE = /^\s*\d+\.\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][^?]{20,}$/;

/** Headers numerados/alfabéticos: "1. ANAMNESE", "A. Características", "C. Red flags...", "F. Yellow flags..." */
const ENUM_HEADER = /^\s*(?:\d+\.|[A-Z]\.)\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/;

/** Linhas-monstro de tabela colada sem espaços (ex: "Red FlagCondição SuspeitaLikelihood Ratio...") */
function isMashedTableLine(line: string): boolean {
  // Detecta CamelCase agressivo: 3+ ocorrências de [a-zçãéí][A-Z] sem espaço
  const camelHits = (line.match(/[a-zçãéíóúâêôõ][A-ZÁÉÍÓÚÂÊÔÃÕÇ]/g) || []).length;
  if (camelHits >= 3) return true;
  // Ou linha muito longa (>200) com múltiplos "[N-N]" embutidos
  const refCount = (line.match(/\[\d+/g) || []).length;
  if (line.length > 180 && refCount >= 3) return true;
  return false;
}

/** Frases introdutórias / títulos de subseção sem ":" */
const INTRO_PHRASE = /^(perguntas?\s+(para|essenciais|espec[íi]ficas)|sequ[êe]ncia de|caracter[íi]sticas? da dor|irradia[çc][ãa]o|red flags?|yellow flags?|fatores ocupacion|fatores ergon|inspe[çc][ãa]o|palpa[çc][ãa]o|testes? neurol[óo]gicos|amplitude de movimento|sensibilidade na linha m[ée]dia|exames? complementares?)\b.{0,80}$/i;

function normalize(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\r/g, "")
    .trim();
}

function stripMarkdown(line: string): string {
  return line
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*([-–—•·●▪▫►◦*]+|\d+[\.)]|[a-z][\.)])\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeTableHeader(line: string): boolean {
  if (/\t/.test(line)) return true;
  const cols = line.split(/\s{2,}/).filter(Boolean);
  if (cols.length >= 4 && cols.every((c) => c.split(/\s+/).length <= 4)) return true;
  return false;
}

function isAllUpperHeader(line: string): boolean {
  const letters = line.replace(/[^A-Za-zÁÉÍÓÚÂÊÔÃÕÇáéíóúâêôãõç]/g, "");
  if (letters.length < 3) return false;
  return letters === letters.toUpperCase() && line.length < 60;
}

function detectSection(line: string): SectionId | null {
  const headerMatch = line.match(/^#{1,6}\s+(.*)/);
  const candidate = headerMatch ? headerMatch[1] : line;
  if (!headerMatch && !isAllUpperHeader(candidate) && !/^\*\*[^*]+\*\*\s*:?$/.test(line) && !ENUM_HEADER.test(line)) {
    if (candidate.length > 80) return null;
  }
  for (const p of SECTION_PATTERNS) {
    if (p.rx.test(candidate)) return p.id;
  }
  return null;
}

function splitHintFromLabel(line: string): { label: string; hint?: string } {
  const arrowMatch = line.match(/^(.+?)\s*(?:→|->|=>|⇒)\s*(.+)$/);
  if (arrowMatch) return { label: arrowMatch[1].trim(), hint: arrowMatch[2].trim() };
  const colonIdx = line.indexOf(":");
  if (colonIdx > 0 && colonIdx < line.length - 1) {
    const left = line.slice(0, colonIdx).trim();
    const right = line.slice(colonIdx + 1).trim();
    const rightWords = right.split(/\s+/).length;
    if (rightWords > 8 && left.length > 3 && left.length < 80) {
      return { label: left, hint: right };
    }
  }
  return { label: line };
}

function stripQuotes(s: string): string {
  return s.replace(/^["“”'`]+/, "").replace(/["“”'`]+$/, "").trim();
}

/* ---------------- Classificação ---------------- */

const CHECKBOX_STARTS = /^(voc[êe] (tem|sente|apresenta|acorda|nota|percebe|teve|trabalha|consegue|est[áa]|acredita)|tem (hist[óo]ria|relato) de|h[áa] presen[çc]a de|apresenta|relata|queixa-se de|nega|houve|sente|percebe|a dor|a rigidez|como est[áa]|quantas vezes)\b/i;
const CHECKBOX_CONTAINS = /\b(presen[çc]a de|aus[êe]ncia de|hist[óo]ria de|relato de|quadro de|epis[óo]dio de)\b/i;

const SELECT_INTENSITY = /\b(intensidade|grau|severidade)\b/i;

const TEXTAREA_HINTS = /\b(descreva|caracterize|como é|qual\b|detalhe)\b/i;

const KNOWN_ANAMNESIS_KEYWORDS = /\b(dor|febre|tosse|n[áa]usea|v[ôo]mito|cefaleia|dispneia|fadiga|perda de peso|sudores?e|astenia|tontura|s[íi]ncope|palpita[çc][ãa]o|espasmo|rigidez)\b/i;

interface Classification {
  tipo: FieldType;
  unidade?: string;
  opcoes?: string[];
  min?: number;
  max?: number;
  /** Override de label quando a classificação reconhece um item canônico */
  labelOverride?: string;
}

function classify(line: string, secao: SectionId): Classification | null {
  const lower = line.toLowerCase();

  // 0. Manobras (radio) — prioridade alta
  if (MANOBRAS.some((m) => lower.includes(m)) || MANOBRA_KEYWORDS.test(line)) {
    return { tipo: "radio", opcoes: ["Positivo", "Negativo", "Não realizado"] };
  }

  // 1. Escalas conhecidas → number com min/max
  for (const e of ESCALAS_CONHECIDAS) {
    if (e.rx.test(line)) {
      return { tipo: "number", unidade: e.unidade, min: e.min, max: e.max, labelOverride: e.nome };
    }
  }

  // 2. Vitais por palavra-chave
  for (const v of VITAIS_KEYWORDS) {
    if (v.rx.test(line) && line.split(/\s+/).length < 8) {
      return { tipo: "number", unidade: v.unit, labelOverride: v.label };
    }
  }

  // 3. Lab/Imagem conhecidos → checkbox "solicitado/positivo"
  if (secao === "laboratorio" || LAB_KNOWN.test(line)) {
    if (line.split(/\s+/).length < 12) {
      return { tipo: "checkbox" };
    }
  }
  if (secao === "imagem" || IMG_KNOWN.test(line)) {
    if (line.split(/\s+/).length < 14) {
      return { tipo: "checkbox" };
    }
  }

  // 4. CHECKBOX (sim/não)
  const isQuestion = /\?\s*$/.test(line);
  if (isQuestion && CHECKBOX_STARTS.test(line)) return { tipo: "checkbox" };
  if (CHECKBOX_CONTAINS.test(line)) return { tipo: "checkbox" };

  // 5. SELECT → radio com 3 opções
  if (SELECT_INTENSITY.test(line) && !/\d/.test(line)) {
    return { tipo: "radio", opcoes: ["Leve", "Moderada", "Grave"] };
  }

  // 6. NUMBER por unidade explícita
  for (const u of NUMERIC_UNIT_HINTS) {
    if (u.rx.test(line) && line.split(/\s+/).length < 10) {
      return { tipo: "number", unidade: u.unit };
    }
  }

  // 7. TEXTAREA
  if (isQuestion && TEXTAREA_HINTS.test(line)) return { tipo: "textarea" };

  // 8. Pergunta solta → checkbox
  if (isQuestion) return { tipo: "checkbox" };

  // 9. Achados de exame físico (sem pergunta) na seção exameFisico → checkbox
  if (secao === "exameFisico" && line.split(/\s+/).length >= 3 && line.split(/\s+/).length <= 20) {
    return { tipo: "checkbox" };
  }

  // 10. Fallback por keyword conhecido
  if (KNOWN_ANAMNESIS_KEYWORDS.test(line) && line.split(/\s+/).length >= 4 && line.split(/\s+/).length <= 18) {
    return { tipo: "checkbox" };
  }

  return null;
}

/* ---------------- Expansão de linha agregada de vitais ---------------- */

function expandAggregatedVitais(): ParsedField[] {
  return [
    { id: nextId(), secao: "vitais", label: "PA", tipo: "text", unidade: "mmHg", placeholder: "120/80" },
    { id: nextId(), secao: "vitais", label: "FC", tipo: "number", unidade: "bpm" },
    { id: nextId(), secao: "vitais", label: "FR", tipo: "number", unidade: "irpm" },
    { id: nextId(), secao: "vitais", label: "Temperatura", tipo: "number", unidade: "°C" },
    { id: nextId(), secao: "vitais", label: "SatO₂", tipo: "number", unidade: "%" },
    { id: nextId(), secao: "vitais", label: "Peso", tipo: "number", unidade: "kg" },
    { id: nextId(), secao: "vitais", label: "Altura", tipo: "number", unidade: "cm" },
    { id: nextId(), secao: "vitais", label: "IMC", tipo: "number", unidade: "kg/m²" },
  ];
}

/* ---------------- Parser principal ---------------- */

export function parseOpenEvidence(rawText: string): ParseResult {
  const text = normalize(rawText);
  const rawLines = text.split(/\n+/).map((l) => l.trim());
  const fields: ParsedField[] = [];
  const discarded: string[] = [];
  const seenLabels = new Set<string>();
  let current: SectionId = "hda";

  for (const original of rawLines) {
    if (!original) continue;

    // 1.1 descartes estruturais
    if (REF_LINE_ONLY.test(original)) { discarded.push(original); continue; }
    if (TABLE_LINE.test(original)) { discarded.push(original); continue; }
    if (looksLikeTableHeader(original)) { discarded.push(original); continue; }
    if (BIB_LINE.test(original)) { discarded.push(original); continue; }
    if (isMashedTableLine(original)) { discarded.push(original); continue; }

    // remove inline refs
    let line = original.replace(REF_INLINE, "").trim();
    line = stripMarkdown(line);
    if (!line) { discarded.push(original); continue; }

    if (EXPLANATORY_PREFIX.test(line)) { discarded.push(original); continue; }

    // section detection ANTES de descartes de tamanho
    const sec = detectSection(line);
    if (sec) {
      current = sec;
      const stripped = line.replace(/[:\-–—]+$/g, "").trim();
      // Headers curtos ou enumerados (ex: "C. Red flags...") nunca viram campo
      if (stripped.length < 80 || ENUM_HEADER.test(stripped)) {
        discarded.push(original);
        continue;
      }
    }

    // Linha agregada de sinais vitais → expandir em 8 campos
    if (VITAIS_AGGREGATED_RX.test(line)) {
      const expanded = expandAggregatedVitais();
      for (const f of expanded) {
        const k = f.label.toLowerCase();
        if (!seenLabels.has(k)) {
          seenLabels.add(k);
          fields.push(f);
        }
      }
      continue;
    }

    // Frase introdutória / título de subseção
    if (INTRO_PHRASE.test(line) && !/\?\s*$/.test(line)) {
      discarded.push(original);
      continue;
    }

    // Header enumerado puro ("A. Características...", "1. ANAMNESE...")
    if (ENUM_HEADER.test(line)) {
      discarded.push(original);
      continue;
    }

    // descarta linhas curtas que não são pergunta nem manobra/vital
    const wordCount = line.split(/\s+/).length;
    const isQ = /\?\s*$/.test(line);
    const lowerL = line.toLowerCase();
    const isManobraOrVital = MANOBRAS.some((m) => lowerL.includes(m))
      || VITAIS_KEYWORDS.some((v) => v.rx.test(line))
      || LAB_KNOWN.test(line) || IMG_KNOWN.test(line)
      || ESCALAS_CONHECIDAS.some((e) => e.rx.test(line));
    if (wordCount < 3 && !isQ && !isManobraOrVital) {
      discarded.push(original);
      continue;
    }

    // título isolado em maiúsculas
    if (isAllUpperHeader(line) && wordCount < 8) { discarded.push(original); continue; }

    // 1.2 split hint
    const { label: rawLabel, hint } = splitHintFromLabel(line);
    let label = stripQuotes(rawLabel).replace(/\s*[:\-–—]\s*$/g, "").trim();
    if (label.length < 4) { discarded.push(original); continue; }
    if (label.length > 240) label = label.slice(0, 240);

    // 1.3 dedup
    const norm = label.toLowerCase().replace(/[^a-z0-9çáéíóúâêôãõ ]/gi, "").replace(/\s+/g, " ").trim();
    if (seenLabels.has(norm)) { discarded.push(original); continue; }

    const cls = classify(label, current);
    if (!cls) {
      discarded.push(original);
      // eslint-disable-next-line no-console
      console.debug("[coleta-soap parser] descartado por classificação:", label);
      continue;
    }

    const finalLabel = cls.labelOverride ?? label;
    const finalNorm = finalLabel.toLowerCase().replace(/[^a-z0-9çáéíóúâêôãõ ]/gi, "").replace(/\s+/g, " ").trim();
    if (seenLabels.has(finalNorm)) { discarded.push(original); continue; }

    // Roteamento por seção: se classificou como número de escala mas current é "escalas"
    let secaoFinal = current;
    if (cls.labelOverride && ESCALAS_CONHECIDAS.some((e) => e.nome === cls.labelOverride)) {
      secaoFinal = "escalas";
    }
    if (cls.labelOverride && VITAIS_KEYWORDS.some((v) => v.label === cls.labelOverride)) {
      secaoFinal = "vitais";
    }
    if (cls.tipo === "radio" && cls.opcoes?.[0] === "Positivo" && current === "exameFisico") {
      secaoFinal = "manobras";
    }

    seenLabels.add(finalNorm);
    fields.push({
      id: nextId(),
      secao: secaoFinal,
      label: finalLabel,
      tipo: cls.tipo,
      unidade: cls.unidade,
      opcoes: cls.opcoes,
      placeholder: hint,
    });
  }

  return { fields, discarded };
}

export function buildVitaisDefault(): ParsedField[] {
  return expandAggregatedVitais();
}

export function makeManualField(label: string, secao: SectionId, tipo: FieldType): ParsedField {
  return { id: nextId(), secao, label, tipo };
}
