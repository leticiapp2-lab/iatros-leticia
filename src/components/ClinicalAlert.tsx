import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle2, ShieldAlert } from "lucide-react";

type AlertVariant = "danger" | "warning" | "success" | "info";

const icons: Record<AlertVariant, React.ReactNode> = {
  danger: <ShieldAlert className="h-5 w-5 text-destructive shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning shrink-0" />,
  success: <CheckCircle2 className="h-5 w-5 text-success shrink-0" />,
  info: <Info className="h-5 w-5 text-primary shrink-0" />,
};

interface ClinicalAlertProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function ClinicalAlert({ variant, title, children, className }: ClinicalAlertProps) {
  return (
    <div className={cn(`alert-box-${variant}`, className)}>
      <div className="flex gap-3">
        {icons[variant]}
        <div className="min-w-0">
          {title && <p className="font-semibold text-sm mb-1">{title}</p>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
