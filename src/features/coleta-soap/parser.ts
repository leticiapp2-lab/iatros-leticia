import type { FieldType, ParsedField, SectionId } from "./types";
import { sanitize } from "./labelUtils";

let _id = 0;
const nextId = () => `f_${Date.now().toString(36)}_${(_id++).toString(36)}`;

export interface ParseResult {
  fields: ParsedField[];
  raciocinioMd: string;
  /** descartados — sempre vazio no parser estruturado, mantido para compat */
  discarded: string[];
  /** se as tags <<<COLETA>>>...<<<FIM_COLETA>>> não forem encontradas */
  formatoInvalido?: boolean;
}

const RX_COLETA = /<<<COLETA>>>([\s\S]*?)<<<FIM_COLETA>>>/i;
const RX_RACIOCINIO = /<<<RACIOCINIO>>>([\s\S]*?)<<<FIM_RACIOCINIO>>>/i;

/** Mapeia título de seção/subseção (em maiúsculas/normalizado) → SectionId */
function mapSection(h2: string, h3: string | null): SectionId {
  const main = h2.toLowerCase();
  const sub = (h3 ?? "").toLowerCase();

  if (main.includes("sinais vitais") || main.includes("antropomet")) return "vitais";

  if (main.includes("exame f")) {
    if (sub.includes("manobra")) return "manobras";
    if (sub.includes("escala")) return "escalas";
    return "exameFisico";
  }

  if (main.includes("exames complement") || main.includes("complementar")) {
    if (sub.includes("imagem")) return "imagem";
    if (sub.includes("lab")) return "laboratorio";
    return "laboratorio";
  }

  if (main.includes("anamnese") || main.includes("hist")) {
    if (sub.includes("hda") || sub.includes("doen")) return "hda";
    if (sub.includes("sintoma")) return "sintomas";
    if (sub.includes("revis") || sub.includes("sistema")) return "revisao";
    if (sub.includes("red flag") || sub.includes("alerta")) return "redflags";
    if (sub.includes("pregress") || sub.includes("m[eé]dica") || sub.includes("medica pregressa") || sub.includes("hmp")) return "hmp";
    if (sub.includes("medic")) return "medicacoes";
    if (sub.includes("alergia")) return "alergias";
    if (sub.includes("familiar")) return "familiar";
    if (sub.includes("social") || sub.includes("h[áa]bito")) return "social";
    return "hda";
  }

  // fallback por subseção isolada
  if (sub.includes("escala")) return "escalas";
  if (sub.includes("manobra")) return "manobras";
  if (sub.includes("imagem")) return "imagem";
  if (sub.includes("lab")) return "laboratorio";

  return "hda";
}

interface TagParse {
  tipo: FieldType;
  label: string;
  unidade?: string;
  min?: number;
  max?: number;
  opcoes?: string[];
}

function parseLineTag(line: string): TagParse | null {
  // - [TAG] resto
  const m = line.match(/^\s*-\s*\[(PERGUNTA|NUMERO|MANOBRA|ESCALA)\]\s*(.+)$/i);
  if (!m) return null;
  const tag = m[1].toUpperCase();
  let rest = sanitize(m[2]).replace(/[?¿]+\s*$/g, "").trim();

  // extrair "| unidade: X" / "| min: N" / "| max: N"
  let unidade: string | undefined;
  let min: number | undefined;
  let max: number | undefined;

  const parts = rest.split("|").map((p) => p.trim());
  const labelPart = parts[0];
  for (const p of parts.slice(1)) {
    const u = p.match(/^unidade\s*:\s*(.+)$/i);
    if (u) { unidade = u[1].trim(); continue; }
    const mn = p.match(/^min\s*:\s*(-?\d+(?:[.,]\d+)?)$/i);
    if (mn) { min = parseFloat(mn[1].replace(",", ".")); continue; }
    const mx = p.match(/^max\s*:\s*(-?\d+(?:[.,]\d+)?)$/i);
    if (mx) { max = parseFloat(mx[1].replace(",", ".")); continue; }
  }

  const label = labelPart.trim();
  if (!label) return null;

  switch (tag) {
    case "PERGUNTA":
      return { tipo: "tristate", label };
    case "NUMERO":
      return { tipo: "number", label, unidade };
    case "MANOBRA":
      return { tipo: "radio", label, opcoes: ["Positivo", "Negativo", "Não realizado"] };
    case "ESCALA":
      return { tipo: "number", label, unidade: unidade ?? (min !== undefined && max !== undefined ? `${min}–${max}` : undefined), min, max };
    default:
      return null;
  }
}

export function parseOpenEvidence(rawText: string): ParseResult {
  const text = (rawText ?? "").replace(/\r/g, "");

  const mColeta = text.match(RX_COLETA);
  const mRac = text.match(RX_RACIOCINIO);

  if (!mColeta) {
    return { fields: [], raciocinioMd: mRac ? mRac[1].trim() : "", discarded: [], formatoInvalido: true };
  }

  const coleta = mColeta[1];
  const raciocinioMd = mRac ? mRac[1].trim() : "";

  const lines = coleta.split(/\n/);
  const fields: ParsedField[] = [];
  const seen = new Set<string>();

  let curMain = "";
  let curSub: string | null = null;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;

    // ## main
    const h2 = line.match(/^\s*##\s+(.+?)\s*$/);
    if (h2) {
      curMain = h2[1].trim();
      curSub = null;
      continue;
    }
    // ### sub
    const h3 = line.match(/^\s*###\s+(.+?)\s*$/);
    if (h3) {
      curSub = h3[1].trim();
      continue;
    }
    // qualquer outro "#" → ignorar
    if (/^\s*#/.test(line)) continue;

    // só linhas começando com "- ["
    if (!/^\s*-\s*\[/.test(line)) continue;

    const tp = parseLineTag(line);
    if (!tp) continue;

    const secao = mapSection(curMain, curSub);
    const dedupKey = `${secao}::${tp.label.toLowerCase()}`;
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);

    fields.push({
      id: nextId(),
      secao,
      subsecao: curSub ?? undefined,
      label: tp.label,
      tipo: tp.tipo,
      unidade: tp.unidade,
      opcoes: tp.opcoes,
      min: tp.min,
      max: tp.max,
    });
  }

  return { fields, raciocinioMd, discarded: [] };
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
