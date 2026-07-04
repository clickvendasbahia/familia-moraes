import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  differenceInCalendarDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  getTransactionsBetween,
  getRecentTransactions,
  getAllTransactionsLite,
} from "@/repositories/transactions-repository";
import { getActiveAccounts } from "@/repositories/accounts-repository";
import { getInvestmentsWithLatestValuation } from "@/repositories/investments-repository";
import { getActiveRecurringBills } from "@/repositories/recurring-bills-repository";
import { getBudgetForMonth } from "@/repositories/budgets-repository";
import { capitalizeFirst, getNextDueDate, parseISODate } from "@/lib/utils";
import type { DashboardData, UpcomingBill } from "@/types/dashboard";

const MONTHS_OF_HISTORY = 6;
const UPCOMING_DAYS_WINDOW = 7;
const RECENT_TRANSACTIONS_LIMIT = 6;

function toDateStr(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export async function getDashboardData(
  referenceDate: Date = new Date(),
): Promise<DashboardData> {
  const monthStart = startOfMonth(referenceDate);
  const monthEnd = endOfMonth(referenceDate);

  const [
    monthTransactions,
    recentTransactions,
    allTransactions,
    accounts,
    investments,
    recurringBills,
    budget,
  ] = await Promise.all([
    getTransactionsBetween(toDateStr(monthStart), toDateStr(monthEnd)),
    getRecentTransactions(RECENT_TRANSACTIONS_LIMIT),
    getAllTransactionsLite(),
    getActiveAccounts(),
    getInvestmentsWithLatestValuation(),
    getActiveRecurringBills(),
    getBudgetForMonth(toDateStr(monthStart)),
  ]);

  // --- Receitas / despesas / investimentos do mês ---
  let ramonIncome = 0;
  let priscilaIncome = 0;
  let totalIncome = 0;
  let fixedExpenses = 0;
  let variableExpenses = 0;
  let investedThisMonth = 0;

  const dailyMap = new Map<string, { receita: number; despesa: number }>();
  const categoryMap = new Map<string, number>();

  for (const t of monthTransactions) {
    if (t.type === "receita") {
      totalIncome += t.amount;
      if (t.person === "ramon") ramonIncome += t.amount;
      if (t.person === "priscila") priscilaIncome += t.amount;
    } else if (t.type === "despesa") {
      if (t.categories?.group === "despesa_fixa") fixedExpenses += t.amount;
      else if (t.categories?.group === "despesa_variavel")
        variableExpenses += t.amount;

      const categoryName = t.categories?.name ?? "Sem categoria";
      categoryMap.set(
        categoryName,
        (categoryMap.get(categoryName) ?? 0) + t.amount,
      );
    } else if (t.type === "investimento") {
      investedThisMonth += t.amount;
    }

    if (t.type !== "transferencia") {
      const entry = dailyMap.get(t.date) ?? { receita: 0, despesa: 0 };
      if (t.type === "receita") entry.receita += t.amount;
      else entry.despesa += t.amount; // despesa + investimento = saída de caixa
      dailyMap.set(t.date, entry);
    }
  }

  const savingsAmount = totalIncome - fixedExpenses - variableExpenses;
  const savingsRate = totalIncome > 0 ? (savingsAmount / totalIncome) * 100 : 0;
  const availableBalance = savingsAmount - investedThisMonth;

  const incomeExpenseByDay = Array.from(dailyMap.entries())
    .map(([date, v]) => ({ date, receita: v.receita, despesa: v.despesa }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // --- Caixa acumulado (desde o início) e sua evolução mensal ---
  const initialBalanceSum = accounts.reduce(
    (sum, a) => sum + a.initial_balance,
    0,
  );

  const cashAffecting = allTransactions.filter((t) => t.type !== "transferencia");

  let cashBalance = initialBalanceSum;
  for (const t of cashAffecting) {
    cashBalance += t.type === "receita" ? t.amount : -t.amount;
  }

  // --- Investimentos: valor atual total ---
  const contributedByInvestment = new Map<string, number>();
  for (const t of allTransactions) {
    if (t.type === "investimento" && t.investment_id) {
      contributedByInvestment.set(
        t.investment_id,
        (contributedByInvestment.get(t.investment_id) ?? 0) + t.amount,
      );
    }
  }
  const totalInvestedValue = investments.reduce((sum, inv) => {
    const value = inv.latestValue ?? contributedByInvestment.get(inv.id) ?? 0;
    return sum + value;
  }, 0);

  const netWorth = cashBalance + totalInvestedValue;

  // --- Evolução mensal (últimos N meses) ---
  const monthlyEvolution: DashboardData["charts"]["monthlyEvolution"] = [];
  const netWorthEvolution: DashboardData["charts"]["netWorthEvolution"] = [];

  for (let i = MONTHS_OF_HISTORY - 1; i >= 0; i--) {
    const cutoffDate = endOfMonth(subMonths(referenceDate, i));
    const cutoffStr = toDateStr(cutoffDate);
    const monthLabel = format(cutoffDate, "MMM/yy", { locale: ptBR });

    const monthStartStr = toDateStr(startOfMonth(subMonths(referenceDate, i)));
    let monthReceita = 0;
    let monthDespesa = 0;
    let cashAtCutoff = initialBalanceSum;

    for (const t of cashAffecting) {
      if (t.date <= cutoffStr) {
        cashAtCutoff += t.type === "receita" ? t.amount : -t.amount;
      }
      if (t.date >= monthStartStr && t.date <= cutoffStr) {
        if (t.type === "receita") monthReceita += t.amount;
        else monthDespesa += t.amount;
      }
    }

    monthlyEvolution.push({
      month: monthLabel,
      receita: monthReceita,
      despesa: monthDespesa,
      saldo: monthReceita - monthDespesa,
    });

    // Não há snapshots históricos de rentabilidade de investimentos, então
    // usamos o valor investido atual como aproximação constante para os
    // meses passados — evita reconstruir uma série que não existe ainda.
    netWorthEvolution.push({
      month: monthLabel,
      value: cashAtCutoff + totalInvestedValue,
    });
  }

  // --- Contas fixas vencendo nos próximos dias ---
  const upcomingBills: UpcomingBill[] = recurringBills
    .map((bill) => {
      const dueDate = getNextDueDate(bill.day_of_month, referenceDate);
      return {
        id: bill.id,
        name: bill.name,
        amount: bill.amount,
        person: bill.person,
        dueDate: toDateStr(dueDate),
      };
    })
    .filter((b) => {
      const days = differenceInCalendarDays(
        parseISODate(b.dueDate),
        referenceDate,
      );
      return days >= 0 && days <= UPCOMING_DAYS_WINDOW;
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return {
    month: {
      start: toDateStr(monthStart),
      end: toDateStr(monthEnd),
      label: capitalizeFirst(
        format(referenceDate, "MMMM 'de' yyyy", { locale: ptBR }),
      ),
    },
    income: { ramon: ramonIncome, priscila: priscilaIncome, total: totalIncome },
    expenses: { fixed: fixedExpenses, variable: variableExpenses },
    investmentsThisMonth: investedThisMonth,
    cashBalance,
    availableBalance,
    savings: {
      amount: savingsAmount,
      rate: savingsRate,
      goal: budget?.savings_goal_amount ?? null,
    },
    totalInvestedValue,
    netWorth,
    upcomingBills,
    recentTransactions,
    charts: {
      incomeExpenseByDay,
      categoryBreakdown,
      monthlyEvolution,
      netWorthEvolution,
    },
  };
}
