import { formatCurrency, formatPercent } from "@/lib/utils";
import type { PeriodComparison } from "@/types/dashboard";

function DeltaLine({
  label,
  delta,
  deltaPct,
  invertColor = false,
}: {
  label: string;
  delta: number;
  deltaPct?: number | null;
  invertColor?: boolean;
}) {
  const isPositive = delta >= 0;
  const goodDirection = invertColor ? !isPositive : isPositive;
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`font-medium ${goodDirection ? "text-income" : "text-expense"}`}
      >
        {isPositive ? "+" : ""}
        {formatCurrency(delta)}{" "}
        {deltaPct !== undefined && (
          <span className="text-xs text-muted-foreground">
            (
            {deltaPct == null
              ? "sem dados no mês anterior"
              : `${isPositive ? "+" : ""}${formatPercent(deltaPct)}`}
            )
          </span>
        )}
      </p>
    </div>
  );
}

export function ComparisonCard({
  comparison,
}: {
  comparison: PeriodComparison;
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold">
        Comparação com {comparison.previousLabel}
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DeltaLine label="Receitas" delta={comparison.incomeDelta} deltaPct={comparison.incomeDeltaPct} />
        <DeltaLine
          label="Despesas"
          delta={comparison.expenseDelta}
          deltaPct={comparison.expenseDeltaPct}
          invertColor
        />
        <DeltaLine label="Saldo" delta={comparison.balanceDelta} />
      </div>
    </div>
  );
}
