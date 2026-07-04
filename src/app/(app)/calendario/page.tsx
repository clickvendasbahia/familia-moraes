import { getCalendarData } from "@/services/calendar-service";
import { formatCurrency } from "@/lib/utils";

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default async function CalendarioPage() {
  const data = await getCalendarData();

  return (
    <main className="flex-1 space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Calendário</h1>
        <p className="text-sm text-muted-foreground">{data.monthLabel}</p>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warning" /> Conta a vencer
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-expense" /> Pago
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-income" /> Recebido
        </span>
      </div>

      <div className="overflow-x-auto rounded-card border border-border bg-surface p-3">
        <div className="grid min-w-[640px] grid-cols-7 gap-2">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="px-1 text-center text-xs font-medium uppercase text-muted-foreground"
            >
              {label}
            </div>
          ))}

          {Array.from({ length: data.leadingBlanks }, (_, i) => (
            <div key={`blank-${i}`} />
          ))}

          {data.days.map((day) => {
            const hasActivity =
              day.bills.length > 0 || day.expenses.length > 0 || day.income.length > 0;
            return (
              <div
                key={day.date}
                className="min-h-[92px] rounded-lg border border-border p-2 text-xs"
              >
                <p className="font-medium">{day.day}</p>
                {hasActivity && (
                  <div className="mt-1 space-y-1">
                    {day.bills.map((b) => (
                      <p
                        key={b.id}
                        className="truncate rounded bg-warning-soft px-1 py-0.5 text-warning"
                        title={`${b.name} · ${formatCurrency(b.amount)}`}
                      >
                        {b.name}
                      </p>
                    ))}
                    {day.expenses.map((e) => (
                      <p
                        key={e.id}
                        className="truncate rounded bg-expense-soft px-1 py-0.5 text-expense"
                        title={`${e.description} · ${formatCurrency(e.amount)}`}
                      >
                        -{formatCurrency(e.amount)}
                      </p>
                    ))}
                    {day.income.map((inc) => (
                      <p
                        key={inc.id}
                        className="truncate rounded bg-income-soft px-1 py-0.5 text-income"
                        title={`${inc.description} · ${formatCurrency(inc.amount)}`}
                      >
                        +{formatCurrency(inc.amount)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
