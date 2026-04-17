import type { FieldType, ParsedField, SectionId } from "./types";

let _id = 0;
const nextId = () => `f_${Date.now().toString(36)}_${(_id++).toString(36)}`;

/** Lista interna de manobras clássicas */
const MANOBRAS = [
  "lasègue", "lasegue", "bragard", "patrick", "faber", "murphy", "blumberg",
  "rovsing", "mcburney", "homans", "tinel", "phalen", "finkelstein", "spurling",
  "adson", "trendelenburg", "straight-leg raise", "slr", "kernig", "brudzinski",
  "giordano", "babinski", "romberg", "drawer", "lachman", "mcmurray",
];

const SECTION_PATTERNS: Array<{ id: SectionId; rx: RegExp }> = [
  { id: "hda", rx: /\b(hda|hist[óo]ria da doen[çc]a atual|history of present illness|hpi)\b/i },
  { id: "sintomas", rx: /\bsintomas associados|associated symptoms\b/i },
  { id: "revisao", rx: /\brevis[ãa]o de sistemas|review of systems|ros\b/i },
  { id: "hmp", rx: /\bhist[óo]ria (m[ée]dica )?(patol[óo]gica|pregressa)|past medical history|pmh\b/i },
  { id: "medicacoes", rx: /\bmedica[çc][õo]es( em uso)?|medications|current medications\b/i },
  { id: "alergias", rx: /\balergias?|allergies\b/i },
  { id: "familiar", rx: /\bhist[óo]ria familiar|family history\b/i },
  { id: "social", rx: /\bhist[óo]ria social|social history|h[áa]bitos\b/i },
  { id: "vitais", rx: /\bsinais vitais|vital signs|antropometr/i },
  { id: "manobras", rx: /\bmanobras|testes especiais|special tests\b/i },
  { id: "exameFisico", rx: /\bexame f[íi]sico|physical exam(ination)?\b/i },
  { id: "escalas", rx: /\bescalas|question[áa]rios|scales|questionnaires\b/i },
  { id: "laboratorio", rx: /\bexames? laboratoriais|labs?\b|laborat[óo]rio\b/i },
  { id: "imagem", rx: /\bexames? de imagem|imaging|imagem\b/i },
  { id: "laboratorio", rx: /\bexames? complementares\b/i },
];

const NUMERIC_HINTS = [
  { rx: /\bmmHg\b/i, unit: "mmHg" },
  { rx: /\bbpm\b/i, unit: "bpm" },
  { rx: /\birpm\b|\brpm\b/i, unit: "irpm" },
  { rx: /°\s?C|\bcels[íi]us\b/i, unit: "°C" },
  { rx: /\bkg\b(?!\/)/i, unit: "kg" },
  { rx: /\bcm\b/i, unit: "cm" },
  { rx: /\bkg\/m[²2]\b|\bimc\b/i, unit: "kg/m²" },
  { rx: /\bmg\/dL\b/i, unit: "mg/dL" },
  { rx: /\b%\b|porcentagem|satura[çc][ãa]o/i, unit: "%" },
  { rx: /\bescore|pontua[çc][ãa]o|score\b/i, unit: "pts" },
  { rx: /0\s?[–-]\s?10|eva\b/i, unit: "0–10" },
];

const BINARY_HINTS = /\b(presen[çc]a de|aus[êe]ncia de|h[áa] |apresenta|relato de|queixa de|nega|refere|hist[óo]ria de)\b/i;

function isManobra(line: string): boolean {
  const lower = line.toLowerCase();
  return MANOBRAS.some((m) => lower.includes(m)) || /\bsinal de\b/i.test(line);
}

function detectUnit(line: string): string | undefined {
  for (const h of NUMERIC_HINTS) if (h.rx.test(line)) return h.unit;
  return undefined;
}

function classify(line: string): { tipo: FieldType; unidade?: string; opcoes?: string[] } {
  if (isManobra(line)) {
    return { tipo: "radio", opcoes: ["Positivo", "Negativo", "Não realizado"] };
  }
  const unit = detectUnit(line);
  if (unit) return { tipo: "number", unidade: unit };
  if (/\bcaracterizar|descrever|detalhar\b/i.test(line)) {
    return { tipo: "textarea" };
  }
  if (BINARY_HINTS.test(line)) return { tipo: "checkbox" };
  // default fallback
  return { tipo: "text" };
}

/** Normaliza texto: remove markdown, bullets, numeração */
function normalize(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[*_`#>]+/g, " ")
    .replace(/\r/g, "")
    .trim();
}

function cleanLine(line: string): string {
  return line
    .replace(/^\s*([-–—•·●▪▫►◦*]+|\d+[\.)]|[a-z][\.)])\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detectSection(line: string): SectionId | null {
  for (const p of SECTION_PATTERNS) if (p.rx.test(line)) return p.id;
  return null;
}

/** Parser principal */
export function parseOpenEvidence(rawText: string): ParsedField[] {
  const text = normalize(rawText);
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);

  const fields: ParsedField[] = [];
  let current: SectionId = "hda";

  for (const rawLine of lines) {
    const sec = detectSection(rawLine);
    if (sec) {
      current = sec;
      // se a linha for apenas o cabeçalho da seção, pula
      const stripped = rawLine.replace(/[:\-–—]+$/g, "").trim();
      if (stripped.length < 60) continue;
    }
    const line = cleanLine(rawLine);
    if (line.length < 4) continue;
    if (/^[A-Z\s]{3,40}:?$/.test(line) && line.length < 50) continue; // título isolado

    const cls = classify(line);
    fields.push({
      id: nextId(),
      secao: current,
      label: line.replace(/\s*[:\-–—]\s*$/g, "").slice(0, 240),
      tipo: cls.tipo,
      unidade: cls.unidade,
      opcoes: cls.opcoes,
    });
  }

  // Garante alguns campos fixos em sinais vitais se a seção foi detectada mas vazia
  const hasVitais = fields.some((f) => f.secao === "vitais");
  if (!hasVitais && /sinais vitais|vital/i.test(text)) {
    fields.push(
      ...buildVitaisDefault(),
    );
  }
  return fields;
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
