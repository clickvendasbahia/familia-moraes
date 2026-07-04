import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getTransactionsBetween } from "@/repositories/transactions-repository";
import { capitalizeFirst } from "@/lib/utils";
import { PERSON_OR_BOTH_LABELS, type PersonOrBoth } from "@/types/domain";

function toDateStr(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export type ReportTransactionRow = {
  date: string;
  description: string;
  category: string;
  person: string;
  type: string;
  amount: number;
};

export type ReportData = {
  label: string;
  income: number;
  expense: number;
  invested: number;
  savings: number;
  savingsRate: number;
  byCategory: { category: string; amount: number }[];
  byPerson: { person: string; amount: number }[];
  biggestExpense: ReportTransactionRow | null;
  biggestIncome: ReportTransactionRow | null;
  monthlyBreakdown: { month: string; income: number; expense: number; savings: number }[];
  comparisonPrevious: { income: number; expense: number; savingsRate: number } | null;
  transactions: ReportTransactionRow[];
};

function toReportRow(t: Awaited<ReturnType<typeof getTransactionsBetween>>[number]): ReportTransactionRow {
  return {
    date: t.date,
    description: t.description,
    category: t.categories?.name ?? "Sem categoria",
    person: PERSON_OR_BOTH_LABELS[t.person as PersonOrBoth] ?? t.person,
    type: t.type,
    amount: t.amount,
  };
}

function summarize(rows: ReportTransactionRow[]) {
  let income = 0;
  let expense = 0;
  let invested = 0;
  const byCategory = new Map<string, number>();
  const byPerson = new Map<string, number>();
  let biggestExpense: ReportTransactionRow | null = null;
  let biggestIncome: ReportTransactionRow | null = null;

  for (const row of rows) {
    if (row.type === "receita") {
      income += row.amount;
      if (!biggestIncome || row.amount > biggestIncome.amount) biggestIncome = row;
    } else if (row.type === "despesa") {
      expense += row.amount;
      byCategory.set(row.category, (byCategory.get(row.category) ?? 0) + row.amount);
      byPerson.set(row.person, (byPerson.get(row.person) ?? 0) + row.amount);
      if (!biggestExpense || row.amount > biggestExpense.amount) biggestExpense = row;
    } else if (row.type === "investimento") {
      invested += row.amount;
    }
  }

  const savings = income - expense;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  return {
    income,
    expense,
    invested,
    savings,
    savingsRate,
    byCategory: Array.from(byCategory.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount),
    byPerson: Array.from(byPerson.entries())
      .map(([person, amount]) => ({ person, amount }))
      .sort((a, b) => b.amount - a.amount),
    biggestExpense,
    biggestIncome,
  };
}

export async function getMonthlyReport(referenceDate: Date = new Date()): Promise<ReportData> {
  const monthStart = toDateStr(startOfMonth(referenceDate));
  const monthEnd = toDateStr(endOfMonth(referenceDate));
  const prevMonth = subMonths(referenceDate, 1);
  const prevStart = toDateStr(startOfMonth(prevMonth));
  const prevEnd = toDateStr(endOfMonth(prevMonth));

  const [current, previous] = await Promise.all([
    getTransactionsBetween(monthStart, monthEnd),
    getTransactionsBetween(prevStart, prevEnd),
  ]);

  const currentRows = current.map(toReportRow);
  const previousRows = previous.map(toReportRow);
  const summary = summarize(currentRows);
  const previousSummary = summarize(previousRows);

  return {
    label: capitalizeFirst(format(referenceDate, "MMMM 'de' yyyy", { locale: ptBR })),
    ...summary,
    monthlyBreakdown: [],
    comparisonPrevious: {
      income: previousSummary.income,
      expense: previousSummary.expense,
      savingsRate: previousSummary.savingsRate,
    },
    transactions: currentRows,
  };
}

export async function getAnnualReport(year: number = new Date().getFullYear()): Promise<ReportData> {
  const yearStart = toDateStr(startOfYear(new Date(year, 0, 1)));
  const yearEnd = toDateStr(endOfYear(new Date(year, 0, 1)));

  const transactions = await getTransactionsBetween(yearStart, yearEnd);
  const rows = transactions.map(toReportRow);
  const summary = summarize(rows);

  const monthlyMap = new Map<string, { income: number; expense: number }>();
  for (const row of rows) {
    const key = row.date.slice(0, 7);
    const entry = monthlyMap.get(key) ?? { income: 0, expense: 0 };
    if (row.type === "receita") entry.income += row.amount;
    else if (row.type === "despesa") entry.expense += row.amount;
    monthlyMap.set(key, entry);
  }

  const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(year, i, 1);
    const key = format(monthDate, "yyyy-MM");
    const entry = monthlyMap.get(key) ?? { income: 0, expense: 0 };
    return {
      month: capitalizeFirst(format(monthDate, "MMM", { locale: ptBR })),
      income: entry.income,
      expense: entry.expense,
      savings: entry.income - entry.expense,
    };
  });

  return {
    label: String(year),
    ...summary,
    monthlyBreakdown,
    comparisonPrevious: null,
    transactions: rows,
  };
}
