import { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, HelpCircle } from "lucide-react";
import { DiseaseFlowchart, FlowStep } from "@/data/flowcharts/types";

interface Props {
  flowchart: DiseaseFlowchart;
}

export default function DecisionTree({ flowchart }: Props) {
  const [history, setHistory] = useState<string[]>([flowchart.startId]);
  const currentId = history[history.length - 1];
  const stepsMap = new Map(flowchart.steps.map((s) => [s.id, s]));
  const current = stepsMap.get(currentId)!;

  const goTo = (nextId: string) => {
    setHistory((h) => [...h, nextId]);
  };

  const goBack = () => {
    if (history.length > 1) setHistory((h) => h.slice(0, -1));
  };

  const reset = () => setHistory([flowchart.startId]);

  // Build answered trail
  const answered: { step: FlowStep; answer: "yes" | "no" }[] = [];
  for (let i = 0; i < history.length - 1; i++) {
    const step = stepsMap.get(history[i])!;
    if (step.type === "question") {
      const next = history[i + 1];
      answered.push({ step, answer: next === step.yesNext ? "yes" : "no" });
    }
  }

  return (
    <div className="space-y-4">
      {/* Answered trail */}
      {answered.length > 0 && (
        <div className="space-y-2">
          {answered.map(({ step, answer }, idx) => (
            <div
              key={step.id}
              className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm opacity-70"
            >
              <span className="text-muted-foreground font-semibold shrink-0">
                {idx + 1}.
              </span>
              <span className="flex-1">{step.text.split("\n")[0]}</span>
              <span
                className={`shrink-0 font-bold text-xs px-2 py-0.5 rounded ${
                  answer === "yes"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {answer === "yes" ? "Sim" : "Não"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Current step */}
      {current.type === "question" ? (
        <div className="border-2 border-[#E8720C]/40 rounded-xl p-5 bg-[#FFF5EB] dark:bg-[#3a2a1a] space-y-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-6 w-6 text-[#E8720C] shrink-0 mt-0.5" />
            <p className="font-medium text-foreground whitespace-pre-line leading-relaxed">
              {current.text}
            </p>
          </div>
          <div className="flex gap-3 pl-9">
            <button
              onClick={() => goTo(current.yesNext!)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" /> Sim
            </button>
            <button
              onClick={() => goTo(current.noNext!)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
            >
              <XCircle className="h-4 w-4" /> Não
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`rounded-xl p-5 border-2 ${
            current.isPositive
              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
              : "border-red-400 bg-red-50 dark:bg-red-900/20"
          }`}
        >
          <div className="flex items-start gap-3">
            {current.isPositive ? (
              <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-bold text-foreground">{current.text}</p>
              {current.detail && (
                <p className="text-sm text-muted-foreground">{current.detail}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {history.length > 1 && (
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-sm font-medium text-[#E8720C] hover:underline"
          >
            <ArrowRight className="h-4 w-4 rotate-180" /> Voltar
          </button>
        )}
        {history.length > 1 && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline ml-auto"
          >
            <RotateCcw className="h-4 w-4" /> Reiniciar
          </button>
        )}
      </div>
    </div>
  );
}
