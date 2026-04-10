import { AlertTriangle, Check } from "lucide-react";
import type { ChecklistGroupData, ChecklistAnswer } from "./types";

interface Props {
  group: ChecklistGroupData;
  answers: Record<string, ChecklistAnswer>;
  onUpdate: (itemId: string, partial: Partial<ChecklistAnswer>) => void;
}

export default function ChecklistGroup({ group, answers, onUpdate }: Props) {
  return (
    <div className="animate-fade-in">
      {group.items.map((item, idx) => {
        const answer = answers[item.id];
        const checked = answer?.checked ?? false;
        const hasSelections = (answer?.selectedOptions?.length ?? 0) > 0;

        // Show group title on the first item row
        const isFirst = idx === 0;

        return (
          <div key={item.id}>
            {/* Main row */}
            <div className="border-b border-border/60">
              <div className="flex items-start min-h-[52px]">
                {/* Group title column */}
                <div className="w-[140px] sm:w-[180px] shrink-0 py-3 px-3">
                  {isFirst && (
                    <span
                      className="text-sm font-bold text-foreground leading-tight"
                      style={{ fontFamily: "'Francois One', sans-serif" }}
                    >
                      {group.title}
                    </span>
                  )}
                </div>

                {/* Checkbox + label column */}
                <div className="flex-1 min-w-0">
                  {item.type === "yes_no" ? (
                    <label className="flex items-center gap-3 py-3 pr-3 cursor-pointer select-none hover:bg-accent/20 transition-colors active:bg-accent/40 -ml-1 pl-1 rounded-r">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onUpdate(item.id, { checked: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                        checked
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/40 bg-background"
                      }`}>
                        {checked && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
                      </div>
                      <span className={`text-sm leading-snug flex items-center gap-1.5 ${
                        checked ? "text-foreground" : "text-foreground/80"
                      }`}>
                        {item.isRedFlag && <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                        {item.question}
                      </span>
                    </label>
                  ) : item.type === "multi_select" && item.options ? (
                    <div className="py-3 pr-3">
                      <span className="text-sm text-foreground/80 flex items-center gap-1.5 mb-2">
                        {item.isRedFlag && <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                        {item.question}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.options.map((opt) => {
                          const selected = answer?.selectedOptions?.includes(opt) ?? false;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                const current = answer?.selectedOptions ?? [];
                                const next = selected
                                  ? current.filter((o) => o !== opt)
                                  : [...current, opt];
                                onUpdate(item.id, { selectedOptions: next, checked: next.length > 0 });
                              }}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded border text-xs font-medium transition-all select-none active:scale-95 ${
                                selected
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "bg-background border-border text-foreground/70 hover:border-primary/40"
                              }`}
                            >
                              {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : item.type === "select" && item.options ? (
                    <div className="py-3 pr-3">
                      <span className="text-sm text-foreground/80 mb-1.5 block">{item.question}</span>
                      <select
                        value={answer?.value ?? ""}
                        onChange={(e) => onUpdate(item.id, { value: e.target.value, checked: !!e.target.value })}
                        className="w-full bg-background border border-border rounded px-2.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                      >
                        <option value="">Selecione...</option>
                        {item.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="py-3 pr-3">
                      <span className="text-sm text-foreground/80 mb-1.5 block">{item.question}</span>
                      <input
                        type="text"
                        value={answer?.value ?? ""}
                        onChange={(e) => onUpdate(item.id, { value: e.target.value, checked: !!e.target.value })}
                        placeholder="Resposta..."
                        className="w-full bg-background border border-border rounded px-2.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Detail input when yes_no is checked */}
              {item.type === "yes_no" && checked && (
                <div className="pb-2.5 pr-3 pl-[140px] sm:pl-[180px] animate-fade-in">
                  <input
                    type="text"
                    value={answer?.value ?? ""}
                    onChange={(e) => onUpdate(item.id, { value: e.target.value })}
                    placeholder="Detalhes (opcional)..."
                    className="w-full bg-background border border-border rounded px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring transition-all ml-7"
                    style={{ maxWidth: "calc(100% - 1.75rem)" }}
                  />
                </div>
              )}

              {/* Free text for multi_select */}
              {item.type === "multi_select" && hasSelections && (
                <div className="pb-2.5 pr-3 pl-[140px] sm:pl-[180px] animate-fade-in">
                  <input
                    type="text"
                    value={answer?.value ?? ""}
                    onChange={(e) => onUpdate(item.id, { value: e.target.value })}
                    placeholder="Outros / detalhes..."
                    className="w-full bg-background border border-border rounded px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
