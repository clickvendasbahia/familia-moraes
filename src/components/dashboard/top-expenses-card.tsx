import { formatCurrency, formatDate } from "@/lib/utils";
import type { TransactionWithCategory } from "@/repositories/transactions-repository";

export function TopExpensesCard({
  expenses,
}: {
  expenses: TransactionWithCategory[];
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold">Maiores gastos</h2>
      {expenses.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Sem despesas neste mês.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {expenses.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-2 py-2 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{t.description}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {t.categories?.name ?? "Sem categoria"}
                  {t.subcategories?.name ? ` · ${t.subcategories.name}` : ""} ·{" "}
                  {formatDate(t.date)}
                </p>
              </div>
              <span className="shrink-0 font-medium text-expense">
                {formatCurrency(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
