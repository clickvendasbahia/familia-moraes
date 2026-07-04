import type { TransactionWithCategory } from "@/repositories/transactions-repository";

export type UpcomingBill = {
  id: string;
  name: string;
  amount: number;
  person: string;
  dueDate: string;
};

export type DashboardData = {
  month: { start: string; end: string; label: string };
  income: { ramon: number; priscila: number; total: number };
  expenses: { fixed: number; variable: number };
  investmentsThisMonth: number;
  cashBalance: number;
  availableBalance: number;
  savings: { amount: number; rate: number; goal: number | null };
  totalInvestedValue: number;
  netWorth: number;
  upcomingBills: UpcomingBill[];
  recentTransactions: TransactionWithCategory[];
  charts: {
    incomeExpenseByDay: { date: string; receita: number; despesa: number }[];
    categoryBreakdown: { category: string; amount: number }[];
    monthlyEvolution: {
      month: string;
      receita: number;
      despesa: number;
      saldo: number;
    }[];
    netWorthEvolution: { month: string; value: number }[];
  };
};
