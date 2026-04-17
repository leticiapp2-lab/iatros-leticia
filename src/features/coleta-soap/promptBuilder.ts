import type { ContextoClinico, FieldValue, ParsedField, SectionId } from "./types";
import { affirmativeSentence, capitalize, negationItem, sanitize } from "./labelUtils";

interface Args {
  contexto: ContextoClinico;
  fields: ParsedField[];
  values: Record<string, FieldValue>;
}

/** Gera frases assertivas para checkboxes de uma seção */
function checkboxesAsProse(
  fields: ParsedField[],
  values: Record<string, FieldValue>,
  secao: SectionId,
): { positivos: string[]; negativos: string[] } {
  const positivos: string[] = [];
  const negativos: string[] = [];
  fields
    .filter((f) => f.secao === secao && (f.tipo === "checkbox" || f.tipo === "tristate"))
    .forEach((f) => {
      const v = values[f.id];
      if (!v) return;
      if (v.checked === true) {
        const txt = affirmativeSentence(f.label, true) + (v.obs ? ` (${sanitize(v.obs)})` : "");
        positivos.push(txt);
      } else if (v.checked === false) {
        negativos.push(negationItem(f.label));
      }
    });
  return { positivos, negativos };
}

/** Outros tipos (radio/text/number/textarea) como linhas */
function otherFieldsAsLines(
  fields: ParsedField[],
  values: Record<string, FieldValue>,
  secao: SectionId,
): string[] {
  const out: string[] = [];
  fields
    .filter((f) => f.secao === secao && f.tipo !== "checkbox" && f.tipo !== "tristate")
    .forEach((f) => {
      const v = values[f.id];
      if (!v) return;
      if (f.tipo === "radio") {
        if (!v.selected || v.selected === "Não realizado") return;
        out.push(`${sanitize(f.label)}: ${v.selected}${v.obs ? ` (${sanitize(v.obs)})` : ""}`);
      } else if (v.value?.trim()) {
        const unit = f.unidade && f.unidade !== "0–10" ? ` ${f.unidade}` : "";
        out.push(`${sanitize(f.label)}: ${v.value.trim()}${unit}${v.obs ? ` (${sanitize(v.obs)})` : ""}`);
      }
    });
  return out;
}

function vitaisLine(fields: ParsedField[], values: Record<string, FieldValue>): string | null {
  const map: Record<string, string> = {};
  fields.filter((f) => f.secao === "vitais").forEach((f) => {
    const v = values[f.id]?.value?.trim();
    if (v) map[f.label] = `${v}${f.unidade ? ` ${f.unidade}` : ""}`;
  });
  const parts: string[] = [];
  const order = ["PA", "FC", "FR", "Temperatura", "SatO₂", "Peso", "Altura", "IMC"];
  order.forEach((k) => {
    if (map[k]) parts.push(`${k} ${map[k]}`);
  });
  Object.entries(map).forEach(([k, val]) => {
    if (!order.includes(k)) parts.push(`${k} ${val}`);
  });
  return parts.length ? parts.join(", ") : null;
}

/** Concatena lista de frases em prosa fluida com vírgulas e ponto final */
function prose(items: string[]): string {
  if (!items.length) return "";
  const cleaned = items.map((s) => sanitize(s)).filter(Boolean);
  if (!cleaned.length) return "";
  const joined = cleaned.join(", ");
  return joined.charAt(0).toUpperCase() + joined.slice(1) + ".";
}

function negacoes(neg: string[]): string {
  if (neg.length < 2) return ""; // só inclui se houver 2+
  return "Nega: " + neg.map(sanitize).join(", ") + ".";
}

export function buildSoapPrompt({ contexto, fields, values }: Args): string {
  const out: string[] = [];

  out.push("Paciente com os seguintes dados coletados:");
  out.push("");
  out.push("CONTEXTO CLÍNICO:");
  const ctxBits = [
    contexto.idade && `${contexto.idade} anos`,
    contexto.sexo,
    contexto.ocupacao,
    contexto.contexto && `atendimento em ${contexto.contexto}`,
  ].filter(Boolean) as string[];
  out.push(capitalize(ctxBits.join(", ")));
  out.push("");

  out.push("SUBJETIVO (S):");
  out.push(`Queixa principal: ${capitalize(contexto.queixaPrincipal || "(não informada)")}`);

  // HDA — prosa fluida
  const hda = checkboxesAsProse(fields, values, "hda");
  const hdaOutros = otherFieldsAsLines(fields, values, "hda");
  const hdaTodosPos = [...hda.positivos, ...hdaOutros];
  if (hdaTodosPos.length || hda.negativos.length >= 2) {
    let line = "História da doença atual: ";
    line += prose(hdaTodosPos) || "—";
    const neg = negacoes(hda.negativos);
    if (neg) line += " " + neg;
    out.push(sanitize(line));
  }

  // Sintomas — prosa fluida
  const sint = checkboxesAsProse(fields, values, "sintomas");
  const sintOutros = otherFieldsAsLines(fields, values, "sintomas");
  const sintPos = [...sint.positivos, ...sintOutros];
  if (sintPos.length || sint.negativos.length >= 2) {
    let line = "Sintomas associados: ";
    line += prose(sintPos) || "—";
    const neg = negacoes(sint.negativos);
    if (neg) line += " " + neg;
    out.push(sanitize(line));
  }

  // Revisão de Sistemas — prosa
  const ros = checkboxesAsProse(fields, values, "revisao");
  const rosOutros = otherFieldsAsLines(fields, values, "revisao");
  const rosPos = [...ros.positivos, ...rosOutros];
  if (rosPos.length || ros.negativos.length >= 2) {
    let line = "Revisão de sistemas: ";
    line += prose(rosPos) || "—";
    const neg = negacoes(ros.negativos);
    if (neg) line += " " + neg;
    out.push(sanitize(line));
  }

  // Red flags — sempre destacar (positivos como alerta, negativos como "nega")
  const rf = checkboxesAsProse(fields, values, "redflags");
  const rfOutros = otherFieldsAsLines(fields, values, "redflags");
  const rfPos = [...rf.positivos, ...rfOutros];
  if (rfPos.length || rf.negativos.length >= 2) {
    let line = "Red flags pesquisados: ";
    line += prose(rfPos) || "nenhum positivo.";
    const neg = negacoes(rf.negativos);
    if (neg) line += " " + neg;
    out.push(sanitize(line));
  }

  const hmpAll = [...checkboxesAsProse(fields, values, "hmp").positivos, ...otherFieldsAsLines(fields, values, "hmp")];
  if (hmpAll.length) out.push(`História médica pregressa: ${prose(hmpAll)}`);

  const meds = [...checkboxesAsProse(fields, values, "medicacoes").positivos, ...otherFieldsAsLines(fields, values, "medicacoes")];
  if (meds.length) out.push(`Medicações em uso: ${prose(meds)}`);

  const al = [...checkboxesAsProse(fields, values, "alergias").positivos, ...otherFieldsAsLines(fields, values, "alergias")];
  if (al.length) out.push(`Alergias: ${prose(al)}`);

  const fam = [...checkboxesAsProse(fields, values, "familiar").positivos, ...otherFieldsAsLines(fields, values, "familiar")];
  if (fam.length) out.push(`História familiar: ${prose(fam)}`);

  const soc = [...checkboxesAsProse(fields, values, "social").positivos, ...otherFieldsAsLines(fields, values, "social")];
  if (soc.length) out.push(`História social: ${prose(soc)}`);

  out.push("");
  out.push("OBJETIVO (O):");
  const v = vitaisLine(fields, values);
  if (v) out.push(`Sinais vitais: ${sanitize(v)}.`);

  const exame = [...checkboxesAsProse(fields, values, "exameFisico").positivos, ...otherFieldsAsLines(fields, values, "exameFisico")];
  if (exame.length) {
    out.push("Exame físico:");
    exame.forEach((l) => out.push(`- ${sanitize(l)}`));
  }

  const manobras = otherFieldsAsLines(fields, values, "manobras");
  if (manobras.length) {
    out.push("Manobras/testes especiais:");
    manobras.forEach((l) => out.push(`- ${sanitize(l)}`));
  }

  const lab = [...checkboxesAsProse(fields, values, "laboratorio").positivos, ...otherFieldsAsLines(fields, values, "laboratorio")];
  if (lab.length) out.push(`Exames laboratoriais trazidos: ${prose(lab)}`);

  const img = [...checkboxesAsProse(fields, values, "imagem").positivos, ...otherFieldsAsLines(fields, values, "imagem")];
  if (img.length) out.push(`Exames de imagem trazidos: ${prose(img)}`);

  const esc = otherFieldsAsLines(fields, values, "escalas");
  if (esc.length) out.push(`Questionários/escalas aplicados: ${prose(esc)}`);

  out.push("");
  out.push("Por favor, forneça:");
  out.push("");
  out.push("AVALIAÇÃO (A):");
  out.push("Lista numerada de problemas/diagnósticos identificáveis com base nos dados do S e O (não hipóteses, apenas problemas comprovados pela anamnese/exame):");
  out.push("- A1: ");
  out.push("- A2: ");
  out.push("- A3: ");
  out.push("");
  out.push("PLANO (P):");
  out.push("Para cada item da avaliação, forneça plano detalhado e numerado correspondente:");
  out.push("");
  ["P1 (correspondente a A1):", "P2 (correspondente a A2):", "P3 (correspondente a A3):"].forEach((p) => {
    out.push(p);
    out.push("- Exames complementares: ");
    out.push("- Tratamento farmacológico: ");
    out.push("- Tratamento não-farmacológico: ");
    out.push("- Orientações ao paciente: ");
    out.push("- Sinais de alerta: ");
    out.push("- Seguimento: ");
    out.push("");
  });

  return out.join("\n").trim() + "\n";
}
