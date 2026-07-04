import { getIcon } from "@/lib/icons";
import { cn, formatCurrency } from "@/lib/utils";

type Accent = "default" | "income" | "expense" | "investment" | "warning";

const ACCENT_CLASSES: Record<Accent, string> = {
  default: "bg-surface-muted text-foreground",
  income: "bg-income-soft text-income",
  expense: "bg-expense-soft text-expense",
  investment: "bg-investment-soft text-investment",
  warning: "bg-warning-soft text-warning",
};

type SummaryCardProps = {
  label: string;
  value: number | null;
  icon: string;
  accent?: Accent;
  sublabel?: string;
};

export function SummaryCard({
  label,
  value,
  icon,
  accent = "default",
  sublabel,
}: SummaryCardProps) {
  const Icon = getIcon(icon);

  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            ACCENT_CLASSES[accent],
          )}
        >
          {/* getIcon seleciona um componente já existente do lucide-react (não cria um novo a cada render) */}
          {/* eslint-disable-next-line react-hooks/static-components */}
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">
        {value == null ? "—" : formatCurrency(value)}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
      )}
    </div>
  );
}
