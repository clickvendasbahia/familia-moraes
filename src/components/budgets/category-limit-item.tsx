import { getIcon } from "@/lib/icons";
import { cn, formatCurrency } from "@/lib/utils";
import { RemoveCategoryLimitButton } from "./remove-category-limit-button";
import type { CategoryLimitProgress } from "@/services/budget-service";

export function CategoryLimitItem({ limit }: { limit: CategoryLimitProgress }) {
  const Icon = getIcon(limit.categoryIcon);
  const pct =
    limit.limitAmount > 0
      ? Math.round((limit.spentAmount / limit.limitAmount) * 100)
      : 0;
  const isOver = pct >= 100;
  const isNear = pct >= 80 && pct < 100;
  const barColor = isOver ? "bg-expense" : isNear ? "bg-warning" : "bg-primary";

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          {/* getIcon seleciona um componente já existente do lucide-react (não cria um novo a cada render) */}
          {/* eslint-disable-next-line react-hooks/static-components */}
          <Icon className="h-4 w-4 text-muted-foreground" />
          {limit.categoryName}
          {isOver && (
            <span className="rounded-full bg-expense-soft px-2 py-0.5 text-xs font-medium text-expense">
              Limite ultrapassado
            </span>
          )}
          {isNear && (
            <span className="rounded-full bg-warning-soft px-2 py-0.5 text-xs font-medium text-warning">
              Quase no limite
            </span>
          )}
        </div>
        <RemoveCategoryLimitButton id={limit.id} />
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {formatCurrency(limit.spentAmount)} de {formatCurrency(limit.limitAmount)} (
        {pct}%)
      </p>
    </div>
  );
}
