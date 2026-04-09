import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
  completedSteps?: ConsultaStep[];
  onStepClick?: (step: ConsultaStep) => void;
}

export default function StepIndicator({ currentStep, onStepClick }: Props) {
  const currentIdx = stepOrder.indexOf(currentStep);
  const progressPercent = (currentIdx / (STEPS.length - 1)) * 100;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <Progress value={progressPercent} className="h-2 flex-1 bg-border [&>div]:bg-[#7B2FBE]" />
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {currentIdx + 1}/{STEPS.length}
        </span>
      </div>

      {/* Step pills */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 w-full overflow-x-auto py-1">
        {STEPS.map((step, i) => {
          const isActive = step.key === currentStep;
          const isCompleted = i < currentIdx;
          const isClickable = isCompleted && onStepClick;

          return (
            <div key={step.key} className="flex items-center">
              {i > 0 && (
                <div
                  className={`h-0.5 w-4 sm:w-8 mx-1 transition-all duration-500 ${
                    i <= currentIdx ? "bg-[#7B2FBE]" : "bg-border"
                  }`}
                />
              )}
              <button
                onClick={() => isClickable && onStepClick(step.key)}
                disabled={!isClickable}
                className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "bg-[#7B2FBE] text-white shadow-lg shadow-[#7B2FBE]/30 scale-105"
                    : isCompleted
                    ? "bg-[#7B2FBE]/10 text-[#7B2FBE] cursor-pointer hover:bg-[#7B2FBE]/20 hover:scale-105"
                    : "bg-muted text-muted-foreground"
                }`}
                style={{ fontFamily: "'Francois One', sans-serif" }}
              >
                {isCompleted ? (
                  <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#7B2FBE] text-white">
                    <Check className="h-3 w-3" />
                  </span>
                ) : (
                  <span>{step.icon}</span>
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
