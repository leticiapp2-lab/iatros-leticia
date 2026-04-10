import { useState, useEffect } from "react";
import { AlertTriangle, Check, ChevronDown, ChevronRight } from "lucide-react";
import type { ChecklistGroupData, ChecklistAnswer } from "./types";

interface Props {
  group: ChecklistGroupData;
  answers: Record<string, ChecklistAnswer>;
  onUpdate: (itemId: string, partial: Partial<ChecklistAnswer>) => void;
}

export default function ChecklistGroup({ group, answers, onUpdate }: Props) {
  const total = group.items.length;
  const filled = group.items.filter((item) => {
    const a = answers[item.id];
    if (item.type === "multi_select") return (a?.selectedOptions?.length ?? 0) > 0;
    return a?.checked || !!a?.value;
  }).length;
  const progressPercent = total > 0 ? (filled / total) * 100 : 0;
  const isComplete = filled === total && total > 0;

  const [isOpen, setIsOpen] = useState(true);

  // Auto-collapse when complete
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setIsOpen(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  return (
    <div className={`border rounded-xl bg-card overflow-hidden animate-fade-in transition-all duration-300 ${
      isComplete ? "border-green-300 dark:border-green-700" : "border-border"
    }`}>
      {/* Clickable header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full bg-[#7B2FBE]/5 border-b border-border px-4 py-3.5 text-left hover:bg-[#7B2FBE]/10 transition-colors"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 transition-transform" />
            )}
            <h3
              className="text-base sm:text-lg font-semibold text-foreground truncate"
              style={{ fontFamily: "'Francois One', sans-serif" }}
            >
              {group.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isComplete && (
              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isComplete
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-muted text-muted-foreground"
            }`}>
              {filled}/{total}
            </span>
          </div>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: isComplete ? "#22c55e" : "#7B2FBE",
            }}
          />
        </div>
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="divide-y divide-border/40 animate-fade-in">
          {group.items.map((item) => {
            const answer = answers[item.id];
            const checked = answer?.checked ?? false;
            const hasValue = !!answer?.value;
            const hasSelections = (answer?.selectedOptions?.length ?? 0) > 0;
            const isFilled = checked || hasValue || hasSelections;

            return (
              <div
                key={item.id}
                className={`transition-all duration-200 ${
                  item.isRedFlag && isFilled
                    ? "bg-destructive/5 border-l-4 border-l-destructive"
                    : isFilled
                    ? "bg-[#7B2FBE]/[0.03] border-l-4 border-l-[#7B2FBE]/40"
                    : "border-l-4 border-l-transparent"
                }`}
              >
                {/* yes_no: entire row is clickable */}
                {item.type === "yes_no" ? (
                  <label className="flex items-start gap-3 px-4 py-3.5 cursor-pointer hover:bg-accent/30 transition-colors active:bg-accent/50 select-none">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => onUpdate(item.id, { checked: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`mt-0.5 h-6 w-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                      checked
                        ? "bg-[#7B2FBE] border-[#7B2FBE] shadow-md shadow-[#7B2FBE]/25"
                        : "border-border bg-background hover:border-[#7B2FBE]/50"
                    }`}>
                      {checked && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm sm:text-base flex items-start gap-1.5 leading-snug ${
                        isFilled ? "text-foreground font-medium" : "text-foreground/80"
                      }`}>
                        {item.isRedFlag && (
                          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        )}
                        {item.question}
                      </span>
                    </div>
                  </label>
                ) : (
                  <div className="px-4 py-3.5">
                    <div className="flex items-start gap-1.5 text-sm sm:text-base text-foreground/80 mb-2 leading-snug">
                      {item.isRedFlag && (
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      )}
                      <span>{item.question}</span>
                    </div>
                  </div>
                )}

                {/* Detail input for yes_no when checked */}
                {item.type === "yes_no" && checked && (
                  <div className="px-4 pb-3 -mt-1 animate-fade-in">
                    <input
                      type="text"
                      value={answer?.value ?? ""}
                      onChange={(e) => onUpdate(item.id, { value: e.target.value })}
                      placeholder="Detalhes (opcional)..."
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 transition-all ml-9"
                      style={{ maxWidth: "calc(100% - 2.25rem)" }}
                    />
                  </div>
                )}

                {/* multi_select: chip-style options */}
                {item.type === "multi_select" && item.options && (
                  <div className="px-4 pb-3 -mt-1">
                    <div className="flex flex-wrap gap-2">
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
                              onUpdate(item.id, {
                                selectedOptions: next,
                                checked: next.length > 0,
                              });
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium transition-all duration-200 active:scale-95 select-none ${
                              selected
                                ? "bg-[#7B2FBE] border-[#7B2FBE] text-white shadow-md shadow-[#7B2FBE]/20"
                                : "bg-background border-border text-foreground/70 hover:border-[#7B2FBE]/40 hover:text-foreground"
                            }`}
                          >
                            {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {/* Free text for multi_select */}
                    {hasSelections && (
                      <input
                        type="text"
                        value={answer?.value ?? ""}
                        onChange={(e) => onUpdate(item.id, { value: e.target.value })}
                        placeholder="Outros / detalhes..."
                        className="mt-2 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 transition-all"
                      />
                    )}
                  </div>
                )}

                {/* select: dropdown */}
                {item.type === "select" && item.options && (
                  <div className="px-4 pb-3 -mt-1">
                    <select
                      value={answer?.value ?? ""}
                      onChange={(e) =>
                        onUpdate(item.id, { value: e.target.value, checked: !!e.target.value })
                      }
                      className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 transition-all"
                    >
                      <option value="">Selecione...</option>
                      {item.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* text: input */}
                {item.type === "text" && (
                  <div className="px-4 pb-3 -mt-1">
                    <input
                      type="text"
                      value={answer?.value ?? ""}
                      onChange={(e) =>
                        onUpdate(item.id, { value: e.target.value, checked: !!e.target.value })
                      }
                      placeholder="Resposta..."
                      className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 transition-all"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
