import { cn } from "@/lib/utils";
import { CheckSquare, Square } from "lucide-react";
import { useState } from "react";

interface ChecklistItem {
  id: string;
  label: string;
  detail?: string;
}

interface ClinicalChecklistProps {
  title: string;
  items: ChecklistItem[];
  className?: string;
}

export function ClinicalChecklist({ title, items, className }: ClinicalChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className={cn("medical-card", className)}>
      <h3 className="section-title flex items-center gap-2">
        <CheckSquare className="h-5 w-5 text-primary" />
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map(item => (
          <li
            key={item.id}
            className="flex items-start gap-3 cursor-pointer group"
            onClick={() => toggle(item.id)}
          >
            {checked.has(item.id) ? (
              <CheckSquare className="h-4 w-4 text-success mt-0.5 shrink-0" />
            ) : (
              <Square className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
            )}
            <div>
              <span className={cn("text-sm", checked.has(item.id) && "line-through text-muted-foreground")}>
                {item.label}
              </span>
              {item.detail && <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
