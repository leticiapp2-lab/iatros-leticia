import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Step } from "@/features/coleta-soap/store";

interface Props {
  step: Step;
  onStepClick?: (s: Step) => void;
}

const steps: { n: Step; label: string }[] = [
  { n: 1, label: "Importar resposta" },
  { n: 2, label: "Preencher coleta" },
  { n: 3, label: "Prompt SOAP" },
];

export default function ColetaStepper({ step, onStepClick }: Props) {
  return (
    <ol className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 w-full">
      {steps.map((s, i) => {
        const done = step > s.n;
        const active = step === s.n;
        return (
          <li key={s.n} className="flex-1 flex items-center gap-2">
            <button
              onClick={() => onStepClick?.(s.n)}
              className={cn(
                "flex items-center gap-3 group",
                onStepClick ? "cursor-pointer" : "cursor-default",
              )}
            >
              <span
                className={cn(
                  "h-9 w-9 rounded-full grid place-items-center text-sm font-bold border-2 transition-colors",
                  active && "bg-[#7B2FBE] text-white border-[#7B2FBE]",
                  done && "bg-[#E8720C] text-white border-[#E8720C]",
                  !active && !done && "bg-card text-muted-foreground border-border",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : s.n}
              </span>
              <span
                className={cn(
                  "text-sm sm:text-base font-semibold",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span className="hidden sm:block flex-1 h-0.5 bg-border mx-3" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
