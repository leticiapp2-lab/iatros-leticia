import { cn } from "@/lib/utils";
import { ArrowDown, ArrowRight } from "lucide-react";

interface FlowStep {
  id: string;
  title: string;
  description?: string;
  type?: "start" | "decision" | "action" | "end";
  branches?: { label: string; steps: FlowStep[] }[];
}

interface FlowchartProps {
  title: string;
  steps: FlowStep[];
  className?: string;
}

function StepNode({ step }: { step: FlowStep }) {
  const typeStyles: Record<string, string> = {
    start: "bg-primary text-primary-foreground border-primary",
    decision: "bg-warning/10 border-warning text-warning-foreground",
    action: "bg-card border-border",
    end: "bg-success/10 border-success text-foreground",
  };

  return (
    <div className={cn(
      "rounded-lg border-2 px-4 py-3 text-sm max-w-xs",
      typeStyles[step.type || "action"]
    )}>
      <p className="font-medium">{step.title}</p>
      {step.description && <p className="text-xs mt-1 opacity-80">{step.description}</p>}
    </div>
  );
}

export function Flowchart({ title, steps, className }: FlowchartProps) {
  return (
    <div className={cn("medical-card", className)}>
      <h3 className="section-title">{title}</h3>
      <div className="flex flex-col items-center gap-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center">
            <StepNode step={step} />
            {step.branches && step.branches.length > 0 && (
              <div className="flex gap-6 mt-3">
                {step.branches.map((branch, bi) => (
                  <div key={bi} className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-2">
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">{branch.label}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      {branch.steps.map((bs, bsi) => (
                        <div key={bs.id} className="flex flex-col items-center">
                          <StepNode step={bs} />
                          {bsi < branch.steps.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground my-1" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {i < steps.length - 1 && !step.branches && (
              <ArrowDown className="h-4 w-4 text-muted-foreground my-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
