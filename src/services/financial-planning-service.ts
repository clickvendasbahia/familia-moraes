import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  differenceInCalendarMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  getAllTransactionsLite,
  getTransactionsBetween,
} from "@/repositories/transactions-repository";
import { getActiveAccounts } from "@/repositories/accounts-repository";
import { getActiveRecurringBills } from "@/repositories/recurring-bills-repository";
import { getInvestmentsOverview } from "@/services/investments-service";
import { getGoalsOverview, type GoalWithProgress } from "@/services/goals-service";
import { capitalizeFirst, parseISODate } from "@/lib/utils";

const HISTORY_MONTHS_FOR_AVERAGE = 3;
const MAX_NET_WORTH_HISTORY_MONTHS = 36;

function toDateStr(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export type FinancialPlanningData = {
  monthLabel: string;
  requiredIncomeThisMonth: number;
  incomeReceivedThisMonth: number;
  incomeGapThisMonth: number;
  fixedExpensesTotal: number;
  investedThisMonth: number;
  investedPctOfIncome: number | null;
  emergencyFundMonthsCovered: number | null;
  netWorthHistory: { month: string; value: number }[];
  goals: GoalWithProgress[];
};

export async function getFinancialPlanningData(
  referenceDate: Date = new Date(),
): Promise<FinancialPlanningData> {
  const monthStart = toDateStr(startOfMonth(referenceDate));
  const monthEnd = toDateStr(endOfMonth(referenceDate));

  const [monthTransactions, allTransactions, accounts, recurringBills, investmentsOverview, goals] =
    await Promise.all([
      getTransactionsBetween(monthStart, monthEnd),
      getAllTransactionsLite(),
      getActiveAccounts(),
      getActiveRecurringBills(),
      getInvestmentsOverview(),
      getGoalsOverview(),
    ]);

  let incomeThisMonth = 0;
  let investedThisMonth = 0;
  for (const t of monthTransactions) {
    if (t.type === "receita") incomeThisMonth += t.amount;
    else if (t.type === "investimento") investedThisMonth += t.amount;
  }

  const fixedExpensesTotal = recurringBills.reduce((sum, b) => sum + b.amount, 0);

  const monthlyExpenseTotals = new Map<string, number>();
  for (const t of allTransactions) {
    if (t.type !== "despesa") continue;
    const key = t.date.slice(0, 7);
    monthlyExpenseTotals.set(key, (monthlyExpenseTotals.get(key) ?? 0) + t.amount);
  }

  const historyValues: number[] = [];
  for (let i = 1; i <= HISTORY_MONTHS_FOR_AVERAGE; i++) {
    const key = format(subMonths(referenceDate, i), "yyyy-MM");
    const value = monthlyExpenseTotals.get(key);
    if (value) historyValues.push(value);
  }
  const averageMonthlyExpense =
    historyValues.length > 0
      ? historyValues.reduce((a, b) => a + b, 0) / historyValues.length
      : null;

  const requiredIncomeThisMonth = averageMonthlyExpense ?? fixedExpensesTotal;
  const incomeGapThisMonth = requiredIncomeThisMonth - incomeThisMonth;

  const investedPctOfIncome =
    incomeThisMonth > 0 ? (investedThisMonth / incomeThisMonth) * 100 : null;

  const reserveCategory = investmentsOverview.categoryDistribution.find(
    (c) => c.category === "Reserva de Emergência",
  );
  const reserveTotal = reserveCategory?.value ?? 0;
  const baselineExpense = averageMonthlyExpense ?? fixedExpensesTotal;
  const emergencyFundMonthsCovered =
    baselineExpense > 0 ? reserveTotal / baselineExpense : null;

  const initialBalanceSum = accounts.reduce((sum, a) => sum + a.initial_balance, 0);
  const cashAffecting = allTransactions.filter((t) => t.type !== "transferencia");

  let earliestDate = monthStart;
  for (const t of cashAffecting) {
    if (t.date < earliestDate) earliestDate = t.date;
  }
  const earliestMonth = startOfMonth(parseISODate(earliestDate));
  const monthsSpan = Math.max(
    0,
    differenceInCalendarMonths(startOfMonth(referenceDate), earliestMonth),
  );
  const totalMonths = Math.min(monthsSpan + 1, MAX_NET_WORTH_HISTORY_MONTHS);

  const netWorthHistory: { month: string; value: number }[] = [];
  for (let i = totalMonths - 1; i >= 0; i--) {
    const cutoffDate = endOfMonth(subMonths(referenceDate, i));
    const cutoffStr = toDateStr(cutoffDate);
    let balance = initialBalanceSum;
    for (const t of cashAffecting) {
      if (t.date <= cutoffStr) {
        balance += t.type === "receita" ? t.amount : -t.amount;
      }
    }
    netWorthHistory.push({
      month: capitalizeFirst(format(cutoffDate, "MMM/yy", { locale: ptBR })),
      value: balance + investmentsOverview.totalInvested,
    });
  }

  return {
    monthLabel: capitalizeFirst(
      format(referenceDate, "MMMM 'de' yyyy", { locale: ptBR }),
    ),
    requiredIncomeThisMonth,
    incomeReceivedThisMonth: incomeThisMonth,
    incomeGapThisMonth,
    fixedExpensesTotal,
    investedThisMonth,
    investedPctOfIncome,
    emergencyFundMonthsCovered,
    netWorthHistory,
    goals,
  };
}
