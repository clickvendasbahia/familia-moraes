import { startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getTransactionsBetween } from "@/repositories/transactions-repository";
import {
  getBudgetForMonth,
  getCategoryLimitsForBudget,
} from "@/repositories/budgets-repository";
import { getCategoriesWithSubcategories } from "@/repositories/categories-repository";
import { capitalizeFirst } from "@/lib/utils";

export function currentMonthStart(): string {
  return format(startOfMonth(new Date()), "yyyy-MM-dd");
}

export type CategoryLimitProgress = {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  limitAmount: number;
  spentAmount: number;
};

export type MonthlyPlanData = {
  monthLabel: string;
  savingsGoal: number | null;
  investmentGoal: number | null;
  savingsAmount: number;
  totalInvested: number;
  categoryLimits: CategoryLimitProgress[];
  expenseCategories: Awaited<
    ReturnType<typeof getCategoriesWithSubcategories>
  >;
};

export async function getMonthlyPlanData(): Promise<MonthlyPlanData> {
  const monthStart = currentMonthStart();
  const monthEnd = format(endOfMonth(new Date()), "yyyy-MM-dd");

  const [budget, transactions, categories] = await Promise.all([
    getBudgetForMonth(monthStart),
    getTransactionsBetween(monthStart, monthEnd),
    getCategoriesWithSubcategories(),
  ]);

  let totalIncome = 0;
  let totalExpenses = 0;
  let totalInvested = 0;
  const spentByCategory = new Map<string, number>();

  for (const t of transactions) {
    if (t.type === "receita") {
      totalIncome += t.amount;
    } else if (t.type === "despesa") {
      totalExpenses += t.amount;
      if (t.category_id) {
        spentByCategory.set(
          t.category_id,
          (spentByCategory.get(t.category_id) ?? 0) + t.amount,
        );
      }
    } else if (t.type === "investimento") {
      totalInvested += t.amount;
    }
  }

  const categoryLimits = budget
    ? await getCategoryLimitsForBudget(budget.id)
    : [];

  const limitsWithProgress: CategoryLimitProgress[] = categoryLimits.map(
    (limit) => ({
      id: limit.id,
      categoryId: limit.category_id,
      categoryName: limit.categories?.name ?? "—",
      categoryIcon: limit.categories?.icon ?? "Circle",
      limitAmount: limit.limit_amount,
      spentAmount: spentByCategory.get(limit.category_id) ?? 0,
    }),
  );

  const expenseCategories = categories.filter(
    (c) => c.group === "despesa_fixa" || c.group === "despesa_variavel",
  );

  return {
    monthLabel: capitalizeFirst(
      format(new Date(), "MMMM 'de' yyyy", { locale: ptBR }),
    ),
    savingsGoal: budget?.savings_goal_amount ?? null,
    investmentGoal: budget?.investment_goal_amount ?? null,
    savingsAmount: totalIncome - totalExpenses,
    totalInvested,
    categoryLimits: limitsWithProgress,
    expenseCategories,
  };
}
