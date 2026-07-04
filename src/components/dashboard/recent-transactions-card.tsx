import { getIcon } from "@/lib/icons";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TransactionWithCategory } from "@/repositories/transactions-repository";

const TYPE_COLOR: Record<string, string> = {
  receita: "text-income",
  despesa: "text-expense",
  investimento: "text-investment",
  transferencia: "text-muted-foreground",
};

const TYPE_SIGN: Record<string, string> = {
  receita: "+",
  despesa: "-",
  investimento: "-",
  transferencia: "",
};

export function RecentTransactionsCard({
  transactions,
}: {
  transactions: TransactionWithCategory[];
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold">Últimas movimentações</h2>
      {transactions.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Nenhuma movimentação registrada ainda.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {transactions.map((t) => {
            const Icon = getIcon(t.categories?.icon ?? "Circle");
            return (
              <li key={t.id} className="flex items-center gap-3 py-2 text-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{t.description}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatDate(t.date)} · {t.categories?.name ?? "Sem categoria"}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-medium ${TYPE_COLOR[t.type]}`}
                >
                  {TYPE_SIGN[t.type]}
                  {formatCurrency(t.amount)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
