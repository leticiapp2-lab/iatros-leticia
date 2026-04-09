import { Check } from "lucide-react";
import type { ConsultaStep } from "./types";

const STEPS: { key: ConsultaStep; label: string; icon: string }[] = [
  { key: "entrada", label: "Entrada", icon: "📋" },
  { key: "subjetivo", label: "Subjetivo", icon: "🩺" },
  { key: "objetivo", label: "Objetivo", icon: "🔬" },
  { key: "avaliacao", label: "Avaliação", icon: "🧠" },
  { key: "plano", label: "Plano", icon: "📝" },
];

const stepOrder: ConsultaStep[] = ["entrada", "subjetivo", "objetivo", "avaliacao", "plano"];

interface Props {
  currentStep: ConsultaStep;
  onStepClick?: (step: ConsultaStep) => void;
}

export default function StepIndicator({ currentStep, onStepClick }: Props) {
  const currentIdx = stepOrder.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 w-full overflow-x-auto py-2">
      {STEPS.map((step, i) => {
        const isActive = step.key === currentStep;
        const isCompleted = i < currentIdx;
        const isClickable = isCompleted && onStepClick;

        return (
          <div key={step.key} className="flex items-center">
            {i > 0 && (
              <div
                className={`h-0.5 w-4 sm:w-8 mx-1 transition-colors ${
                  i <= currentIdx ? "bg-[#7B2FBE]" : "bg-border"
                }`}
              />
            )}
            <button
              onClick={() => isClickable && onStepClick(step.key)}
              disabled={!isClickable}
              className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[#7B2FBE] text-white shadow-md"
                  : isCompleted
                  ? "bg-[#7B2FBE]/10 text-[#7B2FBE] cursor-pointer hover:bg-[#7B2FBE]/20"
                  : "bg-muted text-muted-foreground"
              }`}
              style={{ fontFamily: "'Francois One', sans-serif" }}
            >
              {isCompleted ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span>{step.icon}</span>
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
