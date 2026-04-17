/**
 * Conversão de pergunta em 2ª pessoa → label afirmativo em 3ª pessoa
 * E geração de frase assertiva para o prompt SOAP final.
 */

/** Sanitização leve usada em qualquer texto que vai para o prompt final */
export function sanitize(text: string): string {
  return text
    .replace(/\?/g, "")
    .replace(/\[\s*[A-Za-z]*\+?\s*\d+([-,.\s]*\d+)*\s*\]/g, "") // [LR+ 28], [2-3]
    .replace(/\[\d+([-,\s]*\d+)*\](?:\[\d+\])*/g, "") // [1-3][2]
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .trim();
}

/** Capitaliza início e garante ponto final */
export function capitalize(s: string): string {
  const t = sanitize(s);
  if (!t) return t;
  const cap = t.charAt(0).toUpperCase() + t.slice(1);
  return /[.!?]$/.test(cap) ? cap : cap + ".";
}

/** Converte label-pergunta em label afirmativo em 3ª pessoa */
export function toAffirmativeLabel(raw: string): string {
  let s = sanitize(raw).replace(/\.$/, "").trim();
  if (!s) return s;

  // Aspas
  s = s.replace(/^["'`]+/, "").replace(/["'`]+$/, "").trim();

  const replacements: Array<[RegExp, string]> = [
    [/^você\s+tem\s+/i, "Tem "],
    [/^você\s+sente\s+/i, "Sente "],
    [/^você\s+apresenta\s+/i, "Apresenta "],
    [/^você\s+acorda\s+/i, "Acorda "],
    [/^você\s+nota\s+/i, "Nota "],
    [/^você\s+percebe\s+/i, "Percebe "],
    [/^você\s+teve\s+/i, "Teve "],
    [/^você\s+trabalha\s+/i, "Trabalha "],
    [/^você\s+consegue\s+/i, "Consegue "],
    [/^você\s+está\s+/i, "Está "],
    [/^você\s+esta\s+/i, "Está "],
    [/^você\s+acredita\s+/i, "Acredita "],
    [/^você\s+/i, ""],
    [/^a\s+dor\s+/i, "Dor "],
    [/^a\s+rigidez\s+/i, "Rigidez "],
    [/^há\s+/i, "Há "],
    [/^tem\s+história\s+de\s+/i, "História de "],
    [/^tem\s+relato\s+de\s+/i, "Relato de "],
    [/^como\s+está\s+/i, "Avaliar "],
    [/^quantas\s+vezes\s+/i, "Frequência: "],
  ];
  for (const [rx, rep] of replacements) {
    if (rx.test(s)) {
      s = s.replace(rx, rep);
      break;
    }
  }

  // remove ? finais
  s = s.replace(/\?+\s*$/g, "").trim();
  // capitaliza primeira letra
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return s;
}

/**
 * Converte label afirmativo + estado (presente/ausente) em frase clínica fluida.
 * Retorna texto em minúsculas pronto para concatenar dentro de uma frase.
 */
export function affirmativeSentence(label: string, presente: boolean): string {
  const clean = sanitize(label).replace(/\.$/, "").trim();
  if (!clean) return "";
  const lower = clean.charAt(0).toLowerCase() + clean.slice(1);

  if (presente) {
    // padrões já naturais em afirmativa
    if (/^(tem|teve|há|sente|apresenta|relata|nota|percebe|refere|queixa)/i.test(lower)) {
      return lower;
    }
    if (/^dor\s+/i.test(lower)) return lower;
    if (/^rigidez\s+/i.test(lower)) return lower;
    if (/^acorda\s+/i.test(lower)) return "refere " + lower;
    if (/^piora\s+/i.test(lower) || /^melhora\s+/i.test(lower)) return lower;
    if (/^história\s+de\s+/i.test(lower) || /^relato\s+de\s+/i.test(lower)) return lower;
    return "refere " + lower;
  }

  // Ausente / negação
  if (/^(tem|teve)\s+/i.test(lower)) return "nega " + lower.replace(/^(tem|teve)\s+/i, "");
  if (/^há\s+/i.test(lower)) return "nega " + lower.replace(/^há\s+/i, "");
  if (/^sente\s+/i.test(lower)) return "nega " + lower.replace(/^sente\s+/i, "");
  if (/^apresenta\s+/i.test(lower)) return "sem " + lower.replace(/^apresenta\s+/i, "");
  if (/^relata\s+/i.test(lower)) return "nega " + lower.replace(/^relata\s+/i, "");
  if (/^acorda\s+/i.test(lower)) return "nega despertar noturno";
  if (/^dor\s+piora\s+/i.test(lower)) return "nega " + lower;
  if (/^piora\s+/i.test(lower)) return "nega " + lower;
  if (/^melhora\s+/i.test(lower)) return "nega " + lower;
  if (/^história\s+de\s+/i.test(lower)) return "nega " + lower;
  if (/^relato\s+de\s+/i.test(lower)) return "nega " + lower;
  return "nega " + lower;
}

/** Versão curta usada em "Nega: X, Y, Z" — tira prefixos verbais */
export function negationItem(label: string): string {
  const clean = sanitize(label).replace(/\.$/, "").trim();
  const lower = clean.charAt(0).toLowerCase() + clean.slice(1);
  return lower
    .replace(/^(tem|teve|há|sente|apresenta|relata|refere|nota|percebe|acorda)\s+/i, "")
    .replace(/^(história|relato|quadro|episódio)\s+de\s+/i, "")
    .trim();
}
