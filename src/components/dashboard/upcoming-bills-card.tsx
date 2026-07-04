import { formatCurrency, formatDate } from "@/lib/utils";
import { PERSON_OR_BOTH_LABELS, type PersonOrBoth } from "@/types/domain";
import type { UpcomingBill } from "@/types/dashboard";

export function UpcomingBillsCard({ bills }: { bills: UpcomingBill[] }) {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold">Contas vencendo</h2>
      {bills.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Nenhuma conta vencendo nos próximos 7 dias.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {bills.map((bill) => (
            <li
              key={bill.id}
              className="flex items-center justify-between py-2 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{bill.name}</p>
                <p className="text-xs text-muted-foreground">
                  Vence em {formatDate(bill.dueDate)} ·{" "}
                  {PERSON_OR_BOTH_LABELS[bill.person as PersonOrBoth]}
                </p>
              </div>
              <span className="shrink-0 font-medium text-expense">
                {formatCurrency(bill.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
