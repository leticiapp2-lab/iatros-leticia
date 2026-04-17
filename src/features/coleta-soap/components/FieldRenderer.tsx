import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { FieldValue, ParsedField } from "@/features/coleta-soap/types";
import { cn } from "@/lib/utils";

interface Props {
  field: ParsedField;
  value?: FieldValue;
  onChange: (patch: Partial<FieldValue>) => void;
  onRemove?: () => void;
}

export default function FieldRenderer({ field, value, onChange, onRemove }: Props) {
  const [showObs, setShowObs] = useState(Boolean(value?.obs));
  const v = value ?? {};

  return (
    <div className="border border-border rounded-lg bg-background p-3 hover:border-[#7B2FBE]/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {field.tipo === "checkbox" && (
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(v.checked)}
                onChange={(e) => onChange({ checked: e.target.checked })}
                className="mt-0.5 h-4 w-4 accent-[#7B2FBE] cursor-pointer"
              />
              <span className="text-sm text-foreground leading-snug">{field.label}</span>
            </label>
          )}

          {field.tipo === "text" && (
            <div>
              <label className="text-sm text-foreground font-medium block mb-1.5">{field.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={v.value ?? ""}
                  onChange={(e) => onChange({ value: e.target.value })}
                  placeholder={field.placeholder}
                  className="flex-1 bg-card border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40"
                />
                {field.unidade && (
                  <span className="text-xs text-muted-foreground font-medium">{field.unidade}</span>
                )}
              </div>
            </div>
          )}

          {field.tipo === "number" && (
            <div>
              <label className="text-sm text-foreground font-medium block mb-1.5">{field.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={v.value ?? ""}
                  onChange={(e) => onChange({ value: e.target.value })}
                  className="w-32 bg-card border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40"
                />
                {field.unidade && (
                  <span className="text-xs text-muted-foreground font-medium">{field.unidade}</span>
                )}
              </div>
            </div>
          )}

          {field.tipo === "textarea" && (
            <div>
              <label className="text-sm text-foreground font-medium block mb-1.5">{field.label}</label>
              <textarea
                rows={2}
                value={v.value ?? ""}
                onChange={(e) => onChange({ value: e.target.value })}
                className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 resize-y min-h-[60px]"
              />
            </div>
          )}

          {field.tipo === "radio" && (
            <div>
              <p className="text-sm text-foreground font-medium mb-2">{field.label}</p>
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
            className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
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
        <div className="mt-2 pl-6">
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
