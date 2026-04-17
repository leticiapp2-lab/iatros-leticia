import type { ContextoClinico, FieldValue, ParsedField, SectionId } from "./types";

interface Args {
  contexto: ContextoClinico;
  fields: ParsedField[];
  values: Record<string, FieldValue>;
}

function fieldText(f: ParsedField, v?: FieldValue): string | null {
  if (!v) return null;
  if (f.tipo === "checkbox") {
    if (v.checked === true) return f.label + (v.obs ? ` (${v.obs})` : "");
    return null;
  }
  if (f.tipo === "radio") {
    if (!v.selected || v.selected === "Não realizado") return null;
    return `${f.label}: ${v.selected}${v.obs ? ` (${v.obs})` : ""}`;
  }
  if ((f.tipo === "text" || f.tipo === "number" || f.tipo === "textarea") && v.value?.trim()) {
    const unit = f.unidade ? ` ${f.unidade}` : "";
    return `${f.label}: ${v.value.trim()}${unit}${v.obs ? ` (${v.obs})` : ""}`;
  }
  return null;
}

function negativos(fields: ParsedField[], values: Record<string, FieldValue>, secao: SectionId): string[] {
  return fields
    .filter((f) => f.secao === secao && f.tipo === "checkbox" && values[f.id]?.checked === false && values[f.id]?.obs)
    .map((f) => f.label);
}

function sectionLines(fields: ParsedField[], values: Record<string, FieldValue>, secao: SectionId): string[] {
  return fields
    .filter((f) => f.secao === secao)
    .map((f) => fieldText(f, values[f.id]))
    .filter((s): s is string => Boolean(s));
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
  // include any other vitals not in standard list
  Object.entries(map).forEach(([k, val]) => {
    if (!order.includes(k)) parts.push(`${k} ${val}`);
  });
  return parts.length ? parts.join(", ") : null;
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
  ].filter(Boolean);
  out.push(ctxBits.join(", ") + ".");
  out.push("");

  out.push("SUBJETIVO (S):");
  out.push(`Queixa principal: ${contexto.queixaPrincipal || "(não informada)"}`);

  const hdaLines = sectionLines(fields, values, "hda");
  if (hdaLines.length) out.push(`História da doença atual: ${hdaLines.join(". ")}.`);

  const sintomasPos = sectionLines(fields, values, "sintomas");
  const sintomasNeg = negativos(fields, values, "sintomas");
  if (sintomasPos.length || sintomasNeg.length) {
    let line = "Sintomas associados: ";
    line += sintomasPos.join(", ") || "—";
    if (sintomasNeg.length) line += `. Nega: ${sintomasNeg.join(", ")}`;
    out.push(line);
  }

  const hmp = sectionLines(fields, values, "hmp");
  if (hmp.length) out.push(`História médica pregressa: ${hmp.join("; ")}.`);

  const meds = sectionLines(fields, values, "medicacoes");
  if (meds.length) out.push(`Medicações em uso: ${meds.join("; ")}.`);

  const al = sectionLines(fields, values, "alergias");
  if (al.length) out.push(`Alergias: ${al.join("; ")}.`);

  const fam = sectionLines(fields, values, "familiar");
  if (fam.length) out.push(`História familiar: ${fam.join("; ")}.`);

  const soc = sectionLines(fields, values, "social");
  if (soc.length) out.push(`História social: ${soc.join("; ")}.`);

  const ros = sectionLines(fields, values, "revisao");
  if (ros.length) out.push(`Revisão de sistemas: ${ros.join("; ")}.`);

  out.push("");
  out.push("OBJETIVO (O):");
  const v = vitaisLine(fields, values);
  if (v) out.push(`Sinais vitais: ${v}.`);

  const exame = sectionLines(fields, values, "exameFisico");
  if (exame.length) {
    out.push("Exame físico:");
    exame.forEach((l) => out.push(`- ${l}`));
  }

  const manobras = sectionLines(fields, values, "manobras");
  if (manobras.length) {
    out.push("Manobras/testes especiais:");
    manobras.forEach((l) => out.push(`- ${l}`));
  }

  const lab = sectionLines(fields, values, "laboratorio");
  if (lab.length) out.push(`Exames laboratoriais trazidos: ${lab.join("; ")}.`);

  const img = sectionLines(fields, values, "imagem");
  if (img.length) out.push(`Exames de imagem trazidos: ${img.join("; ")}.`);

  const esc = sectionLines(fields, values, "escalas");
  if (esc.length) out.push(`Questionários/escalas aplicados: ${esc.join("; ")}.`);

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
