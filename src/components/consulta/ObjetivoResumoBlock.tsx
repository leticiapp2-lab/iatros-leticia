import { useState } from "react";
import { Copy, Check, AlertTriangle } from "lucide-react";
import type { ObjectiveSummary } from "./types";

interface Props {
  summary: ObjectiveSummary;
}

export default function ObjetivoResumoBlock({ summary }: Props) {
  const [copiedStructured, setCopiedStructured] = useState(false);
  const [copiedParagraph, setCopiedParagraph] = useState(false);

  const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const structuredText = summary.structured_summary
    .map((s) => `${s.category}:\n${s.content}`)
    .join("\n\n");

  return (
    <div className="space-y-6" style={{ fontFamily: "'Francois One', sans-serif" }}>
      {/* Critical findings */}
      {summary.critical_findings.length > 0 && (
        <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-4">
          <h4 className="flex items-center gap-2 text-destructive font-semibold text-base mb-2">
            <AlertTriangle className="h-5 w-5" />
            Achados Críticos / Gravidade
          </h4>
          <ul className="space-y-1">
            {summary.critical_findings.map((cf, i) => (
              <li key={i} className="text-sm text-destructive/80 flex items-start gap-2">
                <span>•</span>
                <span>{cf}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Structured summary */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="bg-[#7B2FBE]/5 border-b border-border px-4 py-3 flex items-center justify-between">
          <h4 className="text-base font-semibold text-foreground">🔬 Resumo Estruturado do Exame Físico</h4>
          <button
            onClick={() => copyToClipboard(structuredText, setCopiedStructured)}
            className="flex items-center gap-1.5 text-xs text-[#7B2FBE] hover:text-[#6A28A6] transition-colors"
          >
            {copiedStructured ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedStructured ? "Copiado!" : "Copiar"}
          </button>
        </div>
        <div className="p-4 space-y-3">
          {summary.structured_summary.map((s, i) => (
            <div key={i}>
              <p className="text-sm font-semibold text-foreground">{s.category}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{s.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prontuário paragraph */}
      <div className="border-2 border-[#E8720C]/40 rounded-xl bg-[#FFF5EB] overflow-hidden">
        <div className="bg-[#E8720C]/10 border-b border-[#E8720C]/20 px-4 py-3 flex items-center justify-between">
          <h4 className="text-base font-semibold text-foreground">📝 Objetivo para Prontuário</h4>
          <button
            onClick={() => copyToClipboard(summary.prontuario_paragraph, setCopiedParagraph)}
            className="flex items-center gap-1.5 text-xs bg-[#E8720C] text-white px-3 py-1.5 rounded-md hover:bg-[#D4841A] transition-colors"
          >
            {copiedParagraph ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedParagraph ? "Copiado!" : "Copiar para prontuário"}
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {summary.prontuario_paragraph}
          </p>
        </div>
      </div>
    </div>
  );
}
