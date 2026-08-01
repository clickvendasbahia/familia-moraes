import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { PERSON_OR_BOTH_LABELS, type PersonOrBoth } from "@/types/domain";
import type { MonthBill } from "@/types/dashboard";

export function MonthBillsCard({ bills }: { bills: MonthBill[] }) {
  const pendingCount = bills.filter((b) => !b.paid).length;

  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Despesas fixas do mês</h2>
        {bills.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {pendingCount === 0 ? "Todas pagas" : `${pendingCount} pendente${pendingCount > 1 ? "s" : ""}`}
          </span>
        )}
      </div>
      {bills.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Nenhuma conta fixa cadastrada para este mês.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {bills.map((bill) => (
            <li
              key={bill.id}
              className="flex items-center justify-between gap-2 py-2 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{bill.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(bill.dueDate)} ·{" "}
                  {PERSON_OR_BOTH_LABELS[bill.person as PersonOrBoth]}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    bill.paid
                      ? "bg-income-soft text-income"
                      : "bg-warning-soft text-warning",
                  )}
                >
                  {bill.paid ? "Paga" : "Pendente"}
                </span>
                <span className="font-medium text-expense">
                  {formatCurrency(bill.amount)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
