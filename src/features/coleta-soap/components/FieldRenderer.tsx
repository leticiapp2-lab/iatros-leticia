import { useEffect, useRef, useState } from "react";
import { Check, X as XIcon, Minus, Info, Pencil, Trash2 } from "lucide-react";
import type { FieldValue, ParsedField } from "@/features/coleta-soap/types";
import { cn } from "@/lib/utils";

interface Props {
  field: ParsedField;
  value?: FieldValue;
  onChange: (patch: Partial<FieldValue>) => void;
  onRemove?: () => void;
  /** mostra popover de tutorial no primeiro toggle */
  tutorial?: boolean;
}

/** Faixas de referência para vitais e escalas comuns */
const REF_RANGES: Record<string, { hint: string; isAbnormal?: (v: number) => boolean }> = {
  PA: { hint: "normal <130/80" },
  FC: { hint: "60–100 bpm", isAbnormal: (v) => v < 50 || v > 110 },
  FR: { hint: "12–20 irpm", isAbnormal: (v) => v < 10 || v > 24 },
  Temperatura: { hint: "36–37,8 °C", isAbnormal: (v) => v < 35 || v >= 37.8 },
  "SatO₂": { hint: "≥95%", isAbnormal: (v) => v < 95 },
  IMC: { hint: "18,5–24,9", isAbnormal: (v) => v < 18.5 || v >= 30 },
  Glicemia: { hint: "70–99 mg/dL (jejum)", isAbnormal: (v) => v < 70 || v >= 126 },
  Hemoglobina: { hint: "12–17 g/dL", isAbnormal: (v) => v < 12 || v > 18 },
  Creatinina: { hint: "0,6–1,3 mg/dL", isAbnormal: (v) => v > 1.3 },
  "EVA (dor)": { hint: "0–10", isAbnormal: (v) => v >= 7 },
};

function parsePAAbnormal(value: string): boolean {
  const m = value.match(/^\s*(\d{2,3})\s*[\/\-x]\s*(\d{2,3})\s*$/);
  if (!m) return false;
  const sis = parseInt(m[1]);
  const dias = parseInt(m[2]);
  return sis >= 140 || sis < 90 || dias >= 90 || dias < 60;
}

export default function FieldRenderer({ field, value, onChange, onRemove, tutorial }: Props) {
  const [showObs, setShowObs] = useState(Boolean(value?.obs));
  const [hintExpanded, setHintExpanded] = useState(false);
  const [showTutorial, setShowTutorial] = useState(tutorial);
  const containerRef = useRef<HTMLDivElement>(null);
  const v = value ?? {};
  const hint = field.placeholder;
  const hintLong = (hint?.length ?? 0) > 120;
  const hintShown = hint && (hintExpanded || !hintLong) ? hint : hint?.slice(0, 120) + "…";

  useEffect(() => {
    if (!showTutorial) return;
    const t = setTimeout(() => setShowTutorial(false), 6000);
    return () => clearTimeout(t);
  }, [showTutorial]);

  const isCheckLike = field.tipo === "checkbox" || field.tipo === "tristate";

  // Atalhos de teclado quando o container tem foco
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isCheckLike) {
      if (e.key === "1" || e.key.toLowerCase() === "s") {
        e.preventDefault();
        onChange({ checked: true });
      } else if (e.key === "0" || e.key.toLowerCase() === "n") {
        e.preventDefault();
        onChange({ checked: false });
      } else if (e.key === "." || e.key === "Delete") {
        e.preventDefault();
        onChange({ checked: undefined });
      }
    } else if (field.tipo === "radio") {
      const opcoes = field.opcoes ?? ["Positivo", "Negativo", "Não realizado"];
      if (e.key === "1" || e.key.toLowerCase() === "s") {
        e.preventDefault();
        onChange({ selected: opcoes[0] });
      } else if (e.key === "0" || e.key.toLowerCase() === "n") {
        e.preventDefault();
        onChange({ selected: opcoes[1] });
      } else if (e.key === "." || e.key === "Delete") {
        e.preventDefault();
        onChange({ selected: opcoes[2] ?? undefined });
      }
    }
  };

  const renderTristate = () => {
    const states: Array<{ key: "ausente" | "nao" | "presente"; label: string; icon: React.ReactNode; checked?: boolean }> = [
      { key: "ausente", label: "Ausente", icon: <XIcon className="h-3.5 w-3.5" />, checked: v.checked === false },
      { key: "nao", label: "Não pesquisado", icon: <Minus className="h-3.5 w-3.5" />, checked: v.checked === undefined },
      { key: "presente", label: "Presente", icon: <Check className="h-3.5 w-3.5" />, checked: v.checked === true },
    ];
    return (
      <div className="inline-flex rounded-md border border-border bg-card overflow-hidden shadow-sm" role="group">
        {states.map((s, i) => {
          const isOn = s.checked;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => {
                if (s.key === "presente") onChange({ checked: true });
                else if (s.key === "ausente") onChange({ checked: false });
                else onChange({ checked: undefined });
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 min-h-[40px] text-xs font-semibold transition-colors",
                i > 0 && "border-l border-border",
                !isOn && "text-muted-foreground hover:bg-muted",
                isOn && s.key === "presente" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
                isOn && s.key === "ausente" && "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
                isOn && s.key === "nao" && "bg-muted text-foreground",
              )}
              aria-pressed={isOn}
              aria-label={s.label}
            >
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderRadioTristate = () => {
    const opcoes = field.opcoes ?? ["Positivo", "Negativo", "Não realizado"];
    const isPosNeg = opcoes[0] === "Positivo";
    return (
      <div className="inline-flex rounded-md border border-border bg-card overflow-hidden shadow-sm flex-wrap" role="group">
        {opcoes.map((opt, i) => {
          const isOn = v.selected === opt;
          const tone = isPosNeg
            ? (opt === "Positivo" ? "presente" : opt === "Negativo" ? "ausente" : "nao")
            : "nao";
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange({ selected: opt })}
              className={cn(
                "px-3 min-h-[40px] text-xs font-semibold transition-colors",
                i > 0 && "border-l border-border",
                !isOn && "text-muted-foreground hover:bg-muted",
                isOn && tone === "presente" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
                isOn && tone === "ausente" && "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
                isOn && tone === "nao" && "bg-[#7B2FBE]/15 text-[#7B2FBE]",
              )}
              aria-pressed={isOn}
            >
              {opt}
            </button>
          );
        })}
      </div>
    );
  };

  const renderNumberInput = () => {
    const ref = REF_RANGES[field.label];
    const raw = v.value ?? "";
    let abnormal = false;
    if (raw) {
      if (field.label === "PA") abnormal = parsePAAbnormal(raw);
      else if (ref?.isAbnormal) {
        const num = parseFloat(raw.replace(",", "."));
        if (!isNaN(num)) abnormal = ref.isAbnormal(num);
      }
    }
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type={field.label === "PA" ? "text" : field.tipo === "number" ? "number" : "text"}
          value={raw}
          onChange={(e) => onChange({ value: e.target.value })}
          min={field.unidade === "0–10" ? 0 : undefined}
          max={field.unidade === "0–10" ? 10 : undefined}
          placeholder={field.label === "PA" ? "120/80" : undefined}
          className={cn(
            "border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 transition-colors",
            field.tipo === "number" || field.label === "PA" ? "w-28" : "flex-1",
            abnormal
              ? "bg-yellow-50 border-yellow-400 text-yellow-900 dark:bg-yellow-950/30 dark:border-yellow-700 dark:text-yellow-200"
              : "bg-card border-border",
          )}
        />
        {field.unidade && (
          <span className="text-xs text-muted-foreground font-medium">{field.unidade}</span>
        )}
        {ref?.hint && (
          <span className="text-[11px] text-muted-foreground italic">{ref.hint}</span>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      tabIndex={isCheckLike || field.tipo === "radio" ? 0 : -1}
      onKeyDown={handleKeyDown}
      className="relative border border-border rounded-lg bg-background p-3 hover:border-[#7B2FBE]/40 focus-within:border-[#7B2FBE]/60 focus-within:ring-2 focus-within:ring-[#7B2FBE]/20 outline-none transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {isCheckLike && (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-foreground leading-snug font-semibold flex-1">{field.label}</p>
                {hint && (
                  <span title={hint} className="shrink-0 text-muted-foreground mt-0.5">
                    <Info className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              {hint && (
                <p className="text-xs text-muted-foreground">
                  {hintShown}
                  {hintLong && (
                    <button
                      onClick={() => setHintExpanded((x) => !x)}
                      className="ml-1 text-[#7B2FBE] hover:underline"
                    >
                      {hintExpanded ? "ver menos" : "ver mais"}
                    </button>
                  )}
                </p>
              )}
              {renderTristate()}
              {showTutorial && (
                <div className="absolute -bottom-2 left-3 translate-y-full z-10 bg-foreground text-background text-xs rounded-md px-3 py-2 shadow-lg max-w-xs">
                  <p className="font-semibold mb-0.5">Dica rápida</p>
                  <p>Clique ✓ para Presente, ✗ para Ausente. Use as teclas <strong>1</strong>, <strong>0</strong> e <strong>.</strong> para agilizar.</p>
                  <span className="absolute -top-1.5 left-6 w-3 h-3 bg-foreground rotate-45" />
                </div>
              )}
            </div>
          )}

          {(field.tipo === "text" || field.tipo === "number" || field.tipo === "textarea") && (
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <label className="text-sm text-foreground font-semibold flex-1">{field.label}</label>
                {hint && (
                  <span title={hint} className="shrink-0 text-muted-foreground mt-0.5">
                    <Info className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              {hint && (
                <p className="text-xs text-muted-foreground mb-1.5">
                  {hintShown}
                  {hintLong && (
                    <button onClick={() => setHintExpanded((x) => !x)} className="ml-1 text-[#7B2FBE] hover:underline">
                      {hintExpanded ? "ver menos" : "ver mais"}
                    </button>
                  )}
                </p>
              )}
              {field.tipo === "textarea" ? (
                <textarea
                  rows={2}
                  value={v.value ?? ""}
                  onChange={(e) => onChange({ value: e.target.value })}
                  className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 resize-y min-h-[60px]"
                />
              ) : (
                renderNumberInput()
              )}
            </div>
          )}

          {field.tipo === "radio" && (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-foreground font-semibold flex-1">{field.label}</p>
                {hint && (
                  <span title={hint} className="shrink-0 text-muted-foreground mt-0.5">
                    <Info className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              {hint && <p className="text-xs text-muted-foreground">{hintShown}</p>}
              {renderRadioTristate()}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowObs((x) => !x)}
            title="Adicionar observação"
            className={cn(
              "h-7 w-7 grid place-items-center rounded-md transition-colors",
              showObs ? "bg-[#7B2FBE]/10 text-[#7B2FBE]" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              title="Remover campo"
              className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {showObs && (
        <div className="mt-2">
          <input
            type="text"
            value={v.obs ?? ""}
            onChange={(e) => onChange({ obs: e.target.value })}
            placeholder="Observação livre…"
            className="w-full bg-card border border-border rounded-md px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#7B2FBE]/40"
          />
        </div>
      )}
    </div>
  );
}
