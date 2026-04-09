import { useState, useCallback } from "react";
import { Check, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  InteractiveDisease,
  CriteriaGroup,
  EvaluationResult,
} from "@/data/interactiveCriteria";

function GroupBlock({
  group,
  checked,
  onToggle,
}: {
  group: CriteriaGroup;
  checked: Set<string>;
  onToggle: (id: string) => void;
}) {
  const checkedCount = group.items.filter((i) => checked.has(i.id)).length;
  const total = group.items.length;
  const hasPoints = group.items.some((i) => i.points !== undefined && i.points > 0);

  let statusColor = "text-muted-foreground";
  if (group.minRequired && checkedCount >= group.minRequired) statusColor = "text-green-600";
  else if (group.allRequired && checkedCount === total) statusColor = "text-green-600";
  else if (checkedCount > 0) statusColor = "text-amber-600";

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <h4
          className="text-sm font-semibold"
          style={{ fontFamily: "'Francois One', sans-serif", color: "#4A2800" }}
        >
          {group.title}
        </h4>
        <span className={`text-xs font-medium ${statusColor}`}>
          {checkedCount}/{total}
        </span>
      </div>

      {group.note && (
        <p className="text-xs mb-2 italic" style={{ color: "#545454" }}>{group.note}</p>
      )}

      <div className="space-y-2">
        {group.items.map((item) => (
          <label
            key={item.id}
            className={`flex items-start gap-3 p-2.5 rounded-lg border-2 cursor-pointer transition-all ${
              checked.has(item.id)
                ? "border-[#E8720C] bg-[#E8720C]/10"
                : "border-transparent bg-white/60 hover:bg-white/80"
            }`}
          >
            <Checkbox
              checked={checked.has(item.id)}
              onCheckedChange={() => onToggle(item.id)}
              className="mt-0.5 border-[#E8720C] data-[state=checked]:bg-[#E8720C] data-[state=checked]:border-[#E8720C]"
            />
            <span className="text-sm flex-1" style={{ color: "#545454" }}>{item.label}</span>
            {hasPoints && item.points !== undefined && item.points > 0 && (
              <span className="text-xs font-bold text-[#E8720C] bg-[#E8720C]/10 px-1.5 py-0.5 rounded shrink-0">
                {item.points} pts
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function ResultBanner({ result }: { result: EvaluationResult }) {
  return (
    <div
      className={`rounded-xl p-4 border-2 transition-all ${
        result.met
          ? "bg-green-50 border-green-300"
          : "bg-amber-50 border-amber-300"
      }`}
    >
      <p
        className={`text-base font-bold ${
          result.met ? "text-green-800" : "text-amber-800"
        }`}
        style={{ fontFamily: "'Francois One', sans-serif" }}
      >
        {result.summary}
      </p>
      {result.detail && (
        <p
          className={`text-sm mt-1 ${
            result.met ? "text-green-700" : "text-amber-700"
          }`}
        >
          {result.detail}
        </p>
      )}
      {result.score !== undefined && result.maxScore && (
        <div className="mt-3">
          <div className="h-2.5 rounded-full bg-white/70 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                result.met ? "bg-green-500" : "bg-amber-500"
              }`}
              style={{
                width: `${Math.min(100, (result.score / result.maxScore) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function InteractiveCriteriaCard({
  disease,
}: {
  disease: InteractiveDisease;
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const reset = useCallback(() => setChecked(new Set()), []);

  const result = disease.evaluate(checked);
  const hasAnyChecked = checked.size > 0;

  return (
    <div className="border-2 border-[#E8720C] rounded-xl bg-[#FFF5EB] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E8720C] to-[#F59E0B] px-4 sm:px-6 py-3 flex items-center justify-between">
        <div>
          <h2
            className="text-lg sm:text-xl font-bold text-white"
            style={{ fontFamily: "'Francois One', sans-serif" }}
          >
            {disease.name}
          </h2>
          <span className="text-xs text-white/80 font-medium">
            {disease.criteriaSetName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasAnyChecked && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Limpar
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/80 hover:text-white transition-colors"
          >
            {collapsed ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronUp className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 sm:p-6 space-y-2" style={{ fontFamily: "'Lato', sans-serif", color: "#545454" }}>
          {/* Groups */}
          {disease.groups.map((group) => (
            <GroupBlock
              key={group.id}
              group={group}
              checked={checked}
              onToggle={toggle}
            />
          ))}

          {/* Result */}
          <ResultBanner result={result} />
        </div>
      )}
    </div>
  );
}
