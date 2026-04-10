import { AlertTriangle, CheckCircle2 } from "lucide-react";
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

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden animate-fade-in">
      {/* Header with mini progress */}
      <div className="bg-[#7B2FBE]/5 border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h3
            className="text-base sm:text-lg font-semibold text-foreground"
            style={{ fontFamily: "'Francois One', sans-serif" }}
          >
            {group.title}
          </h3>
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {filled}/{total}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: progressPercent === 100 ? "#22c55e" : "#7B2FBE",
            }}
          />
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {group.items.map((item) => {
          const answer = answers[item.id];
          const checked = answer?.checked ?? false;
          const hasValue = !!answer?.value;
          const hasSelections = (answer?.selectedOptions?.length ?? 0) > 0;
          const isFilled = checked || hasValue || hasSelections;

          return (
            <div
              key={item.id}
              className={`px-4 py-3 flex flex-col gap-2 transition-all duration-300 ${
                item.isRedFlag && isFilled
                  ? "bg-destructive/5 border-l-4 border-l-destructive"
                  : isFilled
                  ? "bg-[#7B2FBE]/[0.03] border-l-4 border-l-[#7B2FBE]/40"
                  : "border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* yes_no: single checkbox */}
                {item.type === "yes_no" && (
                  <label className="relative mt-1 shrink-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => onUpdate(item.id, { checked: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                      checked
                        ? "bg-[#7B2FBE] border-[#7B2FBE] scale-110"
                        : "border-border bg-background hover:border-[#7B2FBE]/50"
                    }`}>
                      {checked && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    </div>
                  </label>
                )}

                <div className="flex-1 min-w-0">
                  <label className="text-sm sm:text-base text-foreground flex items-start gap-1.5 cursor-pointer">
                    {item.isRedFlag && (
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    )}
                    <span className={`transition-colors duration-200 ${isFilled ? "text-foreground" : "text-foreground/80"}`}>
                      {item.question}
                    </span>
                  </label>

                  {/* multi_select: grid of checkbox options */}
                  {item.type === "multi_select" && item.options && (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {item.options.map((opt) => {
                        const selected = answer?.selectedOptions?.includes(opt) ?? false;
                        return (
                          <label
                            key={opt}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 text-sm ${
                              selected
                                ? "bg-[#7B2FBE]/10 border-[#7B2FBE]/40 text-foreground"
                                : "bg-background border-border hover:border-[#7B2FBE]/30 text-foreground/80"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => {
                                const current = answer?.selectedOptions ?? [];
                                const next = selected
                                  ? current.filter((o) => o !== opt)
                                  : [...current, opt];
                                onUpdate(item.id, {
                                  selectedOptions: next,
                                  checked: next.length > 0,
                                });
                              }}
                              className="sr-only"
                            />
                            <div className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                              selected
                                ? "bg-[#7B2FBE] border-[#7B2FBE]"
                                : "border-border bg-background"
                            }`}>
                              {selected && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </div>
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* select: dropdown */}
                  {item.type === "select" && item.options && (
                    <select
                      value={answer?.value ?? ""}
                      onChange={(e) =>
                        onUpdate(item.id, { value: e.target.value, checked: !!e.target.value })
                      }
                      className="mt-2 w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 transition-all duration-200"
                    >
                      <option value="">Selecione...</option>
                      {item.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* text: input field */}
                  {item.type === "text" && (
                    <input
                      type="text"
                      value={answer?.value ?? ""}
                      onChange={(e) =>
                        onUpdate(item.id, { value: e.target.value, checked: !!e.target.value })
                      }
                      placeholder="Resposta..."
                      className="mt-2 w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 transition-all duration-200"
                    />
                  )}

                  {/* yes_no detail field when checked */}
                  {item.type === "yes_no" && checked && (
                    <div className="animate-fade-in">
                      <input
                        type="text"
                        value={answer?.value ?? ""}
                        onChange={(e) => onUpdate(item.id, { value: e.target.value })}
                        placeholder="Detalhes (opcional)..."
                        className="mt-2 w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 transition-all duration-200"
                      />
                    </div>
                  )}

                  {/* multi_select "Outro" free text when options selected */}
                  {item.type === "multi_select" && hasSelections && (
                    <input
                      type="text"
                      value={answer?.value ?? ""}
                      onChange={(e) => onUpdate(item.id, { value: e.target.value })}
                      placeholder="Outros / detalhes..."
                      className="mt-2 w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7B2FBE]/40 transition-all duration-200"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
