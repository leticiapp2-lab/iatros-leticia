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
  "adson", "trendelenburg", "straight-leg raise", "slr", "kernig", "brudzinski",
  "giordano", "babinski", "romberg", "drawer", "lachman", "mcmurray",
  "thomas", "ober", "schober",
];
const MANOBRA_KEYWORDS = /\b(teste de|sinal de|manobra de)\b/i;

const ESCALAS = [
  "eva", "vas", "phq-9", "phq9", "gad-7", "gad7", "nyha", "glasgow", "moca", "mmse",
  "ham-d", "ham-a", "barthel", "karnofsky", "ecog", "oswestry", "roland-morris",
  "start back", "framingham", "cha2ds2-vasc", "has-bled", "wells", "perc", "centor",
  "qsofa", "sofa", "apache",
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
  { rx: /\b%\b|porcentagem/i, unit: "%" },
  { rx: /\b(escore|pontua[çc][ãa]o|score)\b/i, unit: "pts" },
];

/* Section detection by header */
const SECTION_PATTERNS: Array<{ id: SectionId; rx: RegExp }> = [
  { id: "revisao", rx: /\b(red[\s-]?flags?|sinais? de alerta|tuna fish|revis[ãa]o de sistemas|review of systems|ros)\b/i },
  { id: "hda", rx: /\b(hda|hist[óo]ria da doen[çc]a atual|history of present illness|hpi|caracter[íi]stica.*dor|anamnese)\b/i },
  { id: "sintomas", rx: /\bsintomas associados|associated symptoms\b/i },
  { id: "hmp", rx: /\bhist[óo]ria (m[ée]dica )?(patol[óo]gica|pregressa)|past medical history|pmh\b/i },
  { id: "medicacoes", rx: /\bmedica[çc][õo]es( em uso)?|medications|current medications\b/i },
  { id: "alergias", rx: /\balergias?|allergies\b/i },
  { id: "familiar", rx: /\bhist[óo]ria familiar|family history\b/i },
  { id: "social", rx: /\b(hist[óo]ria social|social history|h[áa]bitos|fator(es)? ocupacional|ergonomia)\b/i },
  { id: "vitais", rx: /\bsinais vitais|vital signs|antropometr/i },
  { id: "manobras", rx: /\b(manobra|teste especial|testes? provocativ|special tests)\b/i },
  { id: "exameFisico", rx: /\b(exame f[íi]sico|physical exam(ination)?|inspe[çc][ãa]o|palpa[çc][ãa]o)\b/i },
  { id: "escalas", rx: /\b(escala|question[áa]rio|scales|questionnaires|score|pontua[çc][ãa]o)\b/i },
  { id: "laboratorio", rx: /\b(exames? laboratoriais|labs?|laborat[óo]rio|exames? complementares? laboratorial)\b/i },
  { id: "imagem", rx: /\b(exames? de imagem|imaging|imagem|\brx\b|\brnm\b|\btc\b|\busg\b)\b/i },
];

/* ---------------- Pré-processamento ---------------- */

const REF_LINE_ONLY = /^\s*(\[\d+([-,\s]*\d+)*\]\s*)+$/;
const REF_INLINE = /\[\d+([-,\s]*\d+)*\]/g;
const TABLE_LINE = /^\s*\||^\s*[-=]{3,}\s*$/;
const EXPLANATORY_PREFIX = /^(importante|observa[çc][ãa]o|nota|obs|resumo|interpreta[çc][ãa]o|probabilidade pr[ée][- ]teste|no seu paciente|isso sugere|considere que|considere)\s*[:.\-]/i;
const BIB_LINE = /^\s*\d+\.\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][^?]{20,}$/;

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
  // many short words separated by 2+ spaces or tabs
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
  // Markdown header
  const headerMatch = line.match(/^#{1,6}\s+(.*)/);
  const candidate = headerMatch ? headerMatch[1] : line;
  if (!headerMatch && !isAllUpperHeader(candidate) && !/^\*\*[^*]+\*\*\s*:?$/.test(line)) {
    // Only treat as header if also short and matches a section regex
    if (candidate.length > 80) return null;
  }
  for (const p of SECTION_PATTERNS) {
    if (p.rx.test(candidate)) return p.id;
  }
  return null;
}

function splitHintFromLabel(line: string): { label: string; hint?: string } {
  // arrows
  const arrowMatch = line.match(/^(.+?)\s*(?:→|->|=>|⇒)\s*(.+)$/);
  if (arrowMatch) return { label: arrowMatch[1].trim(), hint: arrowMatch[2].trim() };
  // colon split when right side is long & explanatory
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

const CHECKBOX_STARTS = /^(voc[êe] (tem|sente|apresenta|acorda|nota|percebe|teve)|tem (hist[óo]ria|relato) de|h[áa] presen[çc]a de|apresenta|relata|queixa-se de|nega|houve|sente|percebe)\b/i;
const CHECKBOX_CONTAINS = /\b(presen[çc]a de|aus[êe]ncia de|hist[óo]ria de|relato de|quadro de|epis[óo]dio de)\b/i;

const SELECT_INTENSITY = /\b(intensidade|grau|severidade)\b/i;

const TEXTAREA_HINTS = /\b(descreva|caracterize|como é|qual\b|detalhe)\b/i;

const KNOWN_ANAMNESIS_KEYWORDS = /\b(dor|febre|tosse|n[áa]usea|v[ôo]mito|cefaleia|dispneia|fadiga|perda de peso|sudores?e|astenia|tontura|s[íi]ncope|palpita[çc][ãa]o)\b/i;

function classify(line: string): { tipo: FieldType; unidade?: string; opcoes?: string[]; min?: number; max?: number } | null {
  const lower = line.toLowerCase();

  // 2.1 CHECKBOX
  const isQuestion = /\?\s*$/.test(line);
  if (isQuestion && CHECKBOX_STARTS.test(line)) return { tipo: "checkbox" };
  if (CHECKBOX_CONTAINS.test(line)) return { tipo: "checkbox" };

  // 2.2 RADIO (manobra)
  if (MANOBRAS.some((m) => lower.includes(m)) || MANOBRA_KEYWORDS.test(line)) {
    return { tipo: "radio", opcoes: ["Positivo", "Negativo", "Não realizado"] };
  }

  // 2.3 NUMBER
  for (const v of VITAIS_KEYWORDS) {
    if (v.rx.test(line)) return { tipo: "number", unidade: v.unit };
  }
  for (const u of NUMERIC_UNIT_HINTS) {
    if (u.rx.test(line)) return { tipo: "number", unidade: u.unit };
  }
  // EVA 0-10
  if (/\b(eva|vas)\b/i.test(line) || /0\s?[–-]\s?10/.test(line)) {
    return { tipo: "number", unidade: "0–10" };
  }
  if (ESCALAS.some((e) => lower.includes(e))) {
    return { tipo: "number", unidade: "pts" };
  }

  // 2.4 SELECT (intensidade) → modelado como radio com 3 opções
  if (SELECT_INTENSITY.test(line) && !/\d/.test(line)) {
    return { tipo: "radio", opcoes: ["Leve", "Moderada", "Grave"] };
  }

  // 2.5 TEXTAREA
  if (isQuestion && TEXTAREA_HINTS.test(line)) return { tipo: "textarea" };

  // 2.6 fallback: aceita se for pergunta OU se contiver keyword conhecido de anamnese
  if (isQuestion) return { tipo: "checkbox" };
  if (KNOWN_ANAMNESIS_KEYWORDS.test(line) && line.split(/\s+/).length >= 4) {
    return { tipo: "checkbox" };
  }
  return null;
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

    // 1.1 descartes
    if (REF_LINE_ONLY.test(original)) { discarded.push(original); continue; }
    if (TABLE_LINE.test(original)) { discarded.push(original); continue; }
    if (looksLikeTableHeader(original)) { discarded.push(original); continue; }
    if (BIB_LINE.test(original)) { discarded.push(original); continue; }

    // remove inline refs
    let line = original.replace(REF_INLINE, "").trim();
    line = stripMarkdown(line);
    if (!line) { discarded.push(original); continue; }

    if (EXPLANATORY_PREFIX.test(line)) { discarded.push(original); continue; }

    // section detection (must happen before discarding short lines)
    const sec = detectSection(line);
    if (sec) {
      current = sec;
      // Pure header line (short) → não vira campo
      const stripped = line.replace(/[:\-–—]+$/g, "").trim();
      if (stripped.length < 60) continue;
    }

    // descarta linhas curtas que não são pergunta nem manobra/vital
    const wordCount = line.split(/\s+/).length;
    const isQ = /\?\s*$/.test(line);
    const isManobraOrVital = MANOBRAS.some((m) => line.toLowerCase().includes(m))
      || VITAIS_KEYWORDS.some((v) => v.rx.test(line));
    if (wordCount < 4 && !isQ && !isManobraOrVital) {
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

    const cls = classify(label);
    if (!cls) {
      discarded.push(original);
      // eslint-disable-next-line no-console
      console.debug("[coleta-soap parser] descartado por classificação:", label);
      continue;
    }

    seenLabels.add(norm);
    fields.push({
      id: nextId(),
      secao: current,
      label,
      tipo: cls.tipo,
      unidade: cls.unidade,
      opcoes: cls.opcoes,
      placeholder: hint,
    });
  }

  return { fields, discarded };
}

export function buildVitaisDefault(): ParsedField[] {
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

export function makeManualField(label: string, secao: SectionId, tipo: FieldType): ParsedField {
  return { id: nextId(), secao, label, tipo };
}
