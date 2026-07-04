"use server";

import { revalidatePath } from "next/cache";
import {
  getBudgetForMonth,
  upsertBudget,
  upsertCategoryLimit,
  deleteCategoryLimit,
} from "@/repositories/budgets-repository";
import {
  monthlyGoalsSchema,
  categoryLimitSchema,
  type MonthlyGoalsInput,
  type CategoryLimitInput,
} from "@/lib/validations/budget";
import { currentMonthStart } from "@/services/budget-service";

function revalidateAfterChange() {
  revalidatePath("/planejamento");
  revalidatePath("/");
}

export async function saveMonthlyGoalsAction(rawInput: MonthlyGoalsInput) {
  const input = monthlyGoalsSchema.parse(rawInput);
  await upsertBudget(currentMonthStart(), {
    savings_goal_amount: input.savingsGoalAmount,
    investment_goal_amount: input.investmentGoalAmount,
  });
  revalidateAfterChange();
}

export async function addCategoryLimitAction(rawInput: CategoryLimitInput) {
  const input = categoryLimitSchema.parse(rawInput);
  const monthStart = currentMonthStart();

  let budget = await getBudgetForMonth(monthStart);
  if (!budget) {
    budget = await upsertBudget(monthStart, {
      savings_goal_amount: null,
      investment_goal_amount: null,
    });
  }

  await upsertCategoryLimit(budget.id, input.categoryId, input.limitAmount);
  revalidateAfterChange();
}

export async function removeCategoryLimitAction(id: string) {
  await deleteCategoryLimit(id);
  revalidateAfterChange();
}
