import { startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAllTransactionsLite } from "@/repositories/transactions-repository";
import { getAllAccounts } from "@/repositories/accounts-repository";
import { capitalizeFirst } from "@/lib/utils";

function toDateStr(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export type DailyFlow = {
  date: string;
  income: number;
  expense: number;
  runningBalance: number;
};

export type AccountBalance = {
  id: string;
  name: string;
  type: string;
  balance: number;
  archived: boolean;
};

export type CashFlowData = {
  monthLabel: string;
  openingBalance: number;
  income: number;
  expense: number;
  closingBalance: number;
  dailyFlow: DailyFlow[];
  accountBalances: AccountBalance[];
};

export async function getCashFlowData(
  referenceDate: Date = new Date(),
): Promise<CashFlowData> {
  const monthStart = toDateStr(startOfMonth(referenceDate));
  const monthEnd = toDateStr(endOfMonth(referenceDate));

  const [accounts, transactions] = await Promise.all([
    getAllAccounts(),
    getAllTransactionsLite(),
  ]);

  const initialBalanceSum = accounts.reduce(
    (sum, a) => sum + a.initial_balance,
    0,
  );

  const balanceByAccount = new Map<string, number>();
  for (const a of accounts) balanceByAccount.set(a.id, a.initial_balance);

  let openingBalance = initialBalanceSum;
  let monthIncome = 0;
  let monthExpense = 0;
  const dailyMap = new Map<string, { income: number; expense: number }>();

  for (const t of transactions) {
    if (t.type === "transferencia") {
      if (t.account_id) {
        balanceByAccount.set(
          t.account_id,
          (balanceByAccount.get(t.account_id) ?? 0) - t.amount,
        );
      }
      if (t.transfer_account_id) {
        balanceByAccount.set(
          t.transfer_account_id,
          (balanceByAccount.get(t.transfer_account_id) ?? 0) + t.amount,
        );
      }
      continue; // transferências entre contas próprias não afetam o caixa agregado
    }

    const delta = t.type === "receita" ? t.amount : -t.amount;
    if (t.account_id) {
      balanceByAccount.set(
        t.account_id,
        (balanceByAccount.get(t.account_id) ?? 0) + delta,
      );
    }

    if (t.date < monthStart) {
      openingBalance += delta;
    } else if (t.date <= monthEnd) {
      if (t.type === "receita") monthIncome += t.amount;
      else monthExpense += t.amount;

      const entry = dailyMap.get(t.date) ?? { income: 0, expense: 0 };
      if (t.type === "receita") entry.income += t.amount;
      else entry.expense += t.amount;
      dailyMap.set(t.date, entry);
    }
  }

  let running = openingBalance;
  const dailyFlow: DailyFlow[] = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => {
      running += v.income - v.expense;
      return { date, income: v.income, expense: v.expense, runningBalance: running };
    });

  const accountBalances: AccountBalance[] = accounts.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    balance: balanceByAccount.get(a.id) ?? a.initial_balance,
    archived: a.archived,
  }));

  return {
    monthLabel: capitalizeFirst(
      format(referenceDate, "MMMM 'de' yyyy", { locale: ptBR }),
    ),
    openingBalance,
    income: monthIncome,
    expense: monthExpense,
    closingBalance: openingBalance + monthIncome - monthExpense,
    dailyFlow,
    accountBalances,
  };
}
