import { startOfMonth, endOfMonth, format, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getTransactionsBetween } from "@/repositories/transactions-repository";
import { getActiveRecurringBills } from "@/repositories/recurring-bills-repository";
import { capitalizeFirst } from "@/lib/utils";

function toDateStr(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export type CalendarDay = {
  date: string;
  day: number;
  bills: { id: string; name: string; amount: number }[];
  expenses: { id: string; description: string; amount: number }[];
  income: { id: string; description: string; amount: number }[];
};

export type CalendarData = {
  monthLabel: string;
  leadingBlanks: number;
  days: CalendarDay[];
};

export async function getCalendarData(
  referenceDate: Date = new Date(),
): Promise<CalendarData> {
  const monthStart = startOfMonth(referenceDate);
  const monthEnd = endOfMonth(referenceDate);
  const daysInMonth = monthEnd.getDate();

  const [transactions, recurringBills] = await Promise.all([
    getTransactionsBetween(toDateStr(monthStart), toDateStr(monthEnd)),
    getActiveRecurringBills(),
  ]);

  const days: CalendarDay[] = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNumber = i + 1;
    const date = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      dayNumber,
    );
    return {
      date: toDateStr(date),
      day: dayNumber,
      bills: [],
      expenses: [],
      income: [],
    };
  });

  for (const bill of recurringBills) {
    const dayIndex = Math.min(bill.day_of_month, daysInMonth) - 1;
    days[dayIndex]?.bills.push({
      id: bill.id,
      name: bill.name,
      amount: bill.amount,
    });
  }

  for (const t of transactions) {
    const dayIndex = new Date(
      Number(t.date.slice(0, 4)),
      Number(t.date.slice(5, 7)) - 1,
      Number(t.date.slice(8, 10)),
    ).getDate() - 1;
    const entry = days[dayIndex];
    if (!entry) continue;
    if (t.type === "despesa") {
      entry.expenses.push({ id: t.id, description: t.description, amount: t.amount });
    } else if (t.type === "receita") {
      entry.income.push({ id: t.id, description: t.description, amount: t.amount });
    }
  }

  return {
    monthLabel: capitalizeFirst(
      format(referenceDate, "MMMM 'de' yyyy", { locale: ptBR }),
    ),
    leadingBlanks: getDay(monthStart),
    days,
  };
}
