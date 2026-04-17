import { useState } from "react";
import { Check, X as XIcon, Info, Pencil, Trash2 } from "lucide-react";
import type { FieldValue, ParsedField } from "@/features/coleta-soap/types";
import { cn } from "@/lib/utils";

interface Props {
  field: ParsedField;
  value?: FieldValue;
  onChange: (patch: Partial<FieldValue>) => void;
  onRemove?: () => void;
  showLegend?: boolean;
}

/** Tristate: undefined → true (presente) → false (ausente) → undefined */
function nextTristate(curr: boolean | undefined): boolean | undefined {
  if (curr === undefined) return true;
  if (curr === true) return false;
  return undefined;
}

export default function FieldRenderer({ field, value, onChange, onRemove, showLegend }: Props) {
  const [showObs, setShowObs] = useState(Boolean(value?.obs));
  const [hintExpanded, setHintExpanded] = useState(false);
  const v = value ?? {};
  const hint = field.placeholder;
  const hintLong = (hint?.length ?? 0) > 120;
  const hintShown = hint && (hintExpanded || !hintLong) ? hint : hint?.slice(0, 120) + "…";

  return (
    <div className="border border-border rounded-lg bg-background p-3 hover:border-[#7B2FBE]/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {field.tipo === "checkbox" && (
            <div>
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => onChange({ checked: nextTristate(v.checked) })}
                  className={cn(
                    "mt-0.5 h-5 w-5 rounded border-2 grid place-items-center transition-colors shrink-0",
                    v.checked === true && "bg-emerald-500 border-emerald-500 text-white",
                    v.checked === false && "bg-red-500 border-red-500 text-white",
                    v.checked === undefined && "bg-card border-border hover:border-[#7B2FBE]/60",
                  )}
                  aria-label={
                    v.checked === true ? "Marcado como presente" :
                    v.checked === false ? "Marcado como ausente" : "Não marcado"
                  }
                >
                  {v.checked === true && <Check className="h-3.5 w-3.5" />}
                  {v.checked === false && <XIcon className="h-3.5 w-3.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug font-semibold line-clamp-2">{field.label}</p>
                  {hint && (
                    <p className="text-xs text-muted-foreground mt-0.5">
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
                </div>
                {hint && (
                  <span title={hint} className="shrink-0 text-muted-foreground">
                    <Info className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              {showLegend && (
                <p className="text-[10px] text-muted-foreground mt-1.5 ml-7">
                  Clique: vazio → <span className="text-emerald-600 font-medium">presente</span> → <span className="text-red-600 font-medium">ausente</span>
                </p>
              )}
            </div>
          )}

          {(field.tipo === "text" || field.tipo === "number" || field.tipo === "textarea") && (
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <label className="text-sm text-foreground font-semibold line-clamp-2 flex-1">{field.label}</label>
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
                <div className="flex items-center gap-2">
                  <input
                    type={field.tipo === "number" ? "number" : "text"}
                    value={v.value ?? ""}
                    onChange={(e) => onChange({ value: e.target.value })}
                    min={field.unidade === "0–10" ? 0 : undefined}
                    max={field.unidade === "0–10" ? 10 : undefined}
                    className={cn(
                      "bg-card border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40",
                      field.tipo === "number" ? "w-32" : "flex-1",
                    )}
                  />
                  {field.unidade && (
                    <span className="text-xs text-muted-foreground font-medium">{field.unidade}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {field.tipo === "radio" && (
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm text-foreground font-semibold line-clamp-2 flex-1">{field.label}</p>
                {hint && (
                  <span title={hint} className="shrink-0 text-muted-foreground mt-0.5">
                    <Info className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              {hint && <p className="text-xs text-muted-foreground mb-2">{hintShown}</p>}
              <div className="flex flex-wrap gap-2">
                {(field.opcoes ?? ["Positivo", "Negativo", "Não realizado"]).map((opt) => (
                  <label
                    key={opt}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium cursor-pointer transition-colors",
                      v.selected === opt
                        ? "bg-[#7B2FBE] border-[#7B2FBE] text-white"
                        : "bg-card border-border text-foreground hover:border-[#7B2FBE]/40",
                    )}
                  >
                    <input
                      type="radio"
                      name={field.id}
                      checked={v.selected === opt}
                      onChange={() => onChange({ selected: opt })}
                      className="sr-only"
                    />
                    {opt}
                  </label>
                ))}
              </div>
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
        <div className="mt-2 pl-7">
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
