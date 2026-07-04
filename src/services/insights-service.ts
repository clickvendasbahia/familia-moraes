import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { getTransactionsBetween } from "@/repositories/transactions-repository";
import { getBudgetForMonth } from "@/repositories/budgets-repository";
import { formatCurrency, formatPercent } from "@/lib/utils";

function toDateStr(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export async function getDashboardInsights(
  referenceDate: Date = new Date(),
): Promise<string[]> {
  const monthStart = toDateStr(startOfMonth(referenceDate));
  const monthEnd = toDateStr(endOfMonth(referenceDate));
  const prevMonth = subMonths(referenceDate, 1);
  const prevStart = toDateStr(startOfMonth(prevMonth));
  const prevEnd = toDateStr(endOfMonth(prevMonth));

  const [current, previous, budget] = await Promise.all([
    getTransactionsBetween(monthStart, monthEnd),
    getTransactionsBetween(prevStart, prevEnd),
    getBudgetForMonth(monthStart),
  ]);

  let income = 0;
  let expense = 0;
  let invested = 0;
  const categorySpend = new Map<string, number>();
  for (const t of current) {
    if (t.type === "receita") income += t.amount;
    else if (t.type === "despesa") {
      expense += t.amount;
      const name = t.categories?.name ?? "Sem categoria";
      categorySpend.set(name, (categorySpend.get(name) ?? 0) + t.amount);
    } else if (t.type === "investimento") invested += t.amount;
  }

  let prevExpense = 0;
  const prevCategorySpend = new Map<string, number>();
  for (const t of previous) {
    if (t.type === "despesa") {
      prevExpense += t.amount;
      const name = t.categories?.name ?? "Sem categoria";
      prevCategorySpend.set(name, (prevCategorySpend.get(name) ?? 0) + t.amount);
    }
  }

  const insights: string[] = [];

  if (prevExpense > 0) {
    const deltaPct = ((expense - prevExpense) / prevExpense) * 100;
    if (Math.abs(deltaPct) >= 1) {
      insights.push(
        `Este mês vocês gastaram ${formatPercent(Math.abs(deltaPct))} ${
          deltaPct >= 0 ? "a mais" : "a menos"
        } que o mês anterior.`,
      );
    }
  }

  let biggestIncreaseCategory: { name: string; pct: number } | null = null;
  for (const [name, amount] of categorySpend.entries()) {
    const prevAmount = prevCategorySpend.get(name) ?? 0;
    if (prevAmount >= 50) {
      const pct = ((amount - prevAmount) / prevAmount) * 100;
      if (
        pct > 20 &&
        (!biggestIncreaseCategory || pct > biggestIncreaseCategory.pct)
      ) {
        biggestIncreaseCategory = { name, pct };
      }
    }
  }
  if (biggestIncreaseCategory) {
    insights.push(
      `Gastos em ${biggestIncreaseCategory.name} aumentaram ${formatPercent(
        biggestIncreaseCategory.pct,
      )} em relação ao mês passado.`,
    );
  }

  const savings = income - expense;
  if (income > 0 || expense > 0) {
    insights.push(
      savings >= 0
        ? `Vocês economizaram ${formatCurrency(savings)} este mês.`
        : `Vocês gastaram ${formatCurrency(Math.abs(savings))} a mais do que receberam este mês.`,
    );
  }

  if (budget?.savings_goal_amount) {
    if (savings >= budget.savings_goal_amount) {
      insights.push("Vocês bateram a meta de economia do mês! 🎉");
    } else {
      const gap = budget.savings_goal_amount - savings;
      insights.push(`Faltam ${formatCurrency(gap)} para atingir a meta de economia.`);
    }
  }

  if (budget?.investment_goal_amount) {
    const gap = budget.investment_goal_amount - invested;
    if (gap <= 0) {
      insights.push("Meta de investimento do mês batida!");
    } else {
      insights.push(
        `Faltam ${formatCurrency(gap)} para atingir a meta de investimento.`,
      );
    }
  }

  if (insights.length === 0) {
    insights.push("Ainda não há dados suficientes para gerar insights este mês.");
  }

  return insights;
}
