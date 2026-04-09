import { AlertTriangle } from "lucide-react";
import type { ChecklistGroupData, ChecklistAnswer } from "./types";

interface Props {
  group: ChecklistGroupData;
  answers: Record<string, ChecklistAnswer>;
  onUpdate: (itemId: string, partial: Partial<ChecklistAnswer>) => void;
}

export default function ChecklistGroup({ group, answers, onUpdate }: Props) {
  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="bg-[#7B2FBE]/5 border-b border-border px-4 py-3">
        <h3
          className="text-base sm:text-lg font-semibold text-foreground"
          style={{ fontFamily: "'Francois One', sans-serif" }}
        >
          {group.title}
        </h3>
      </div>

      <div className="divide-y divide-border/50">
        {group.items.map((item) => {
          const answer = answers[item.id];
          const checked = answer?.checked ?? false;

          return (
            <div
              key={item.id}
              className={`px-4 py-3 flex flex-col gap-2 transition-colors ${
                item.isRedFlag && checked ? "bg-destructive/5" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {item.type === "yes_no" ? (
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onUpdate(item.id, { checked: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-border accent-[#7B2FBE] shrink-0"
                  />
                ) : null}

                <div className="flex-1 min-w-0">
                  <label className="text-sm sm:text-base text-foreground flex items-start gap-1.5 cursor-pointer">
                    {item.isRedFlag && (
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    )}
                    <span>{item.question}</span>
                  </label>

                  {item.type === "text" && (
                    <input
                      type="text"
                      value={answer?.value ?? ""}
                      onChange={(e) =>
                        onUpdate(item.id, { value: e.target.value, checked: !!e.target.value })
                      }
                      placeholder="Resposta..."
                      className="mt-2 w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#7B2FBE]/40"
                    />
                  )}

                  {item.type === "select" && item.options && (
                    <select
                      value={answer?.value ?? ""}
                      onChange={(e) =>
                        onUpdate(item.id, { value: e.target.value, checked: !!e.target.value })
                      }
                      className="mt-2 w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#7B2FBE]/40"
                    >
                      <option value="">Selecione...</option>
                      {item.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {item.type === "yes_no" && checked && (
                    <input
                      type="text"
                      value={answer?.value ?? ""}
                      onChange={(e) => onUpdate(item.id, { value: e.target.value })}
                      placeholder="Detalhes (opcional)..."
                      className="mt-2 w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#7B2FBE]/40"
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
