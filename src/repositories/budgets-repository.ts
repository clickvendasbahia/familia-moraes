import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export async function getBudgetForMonth(monthStart: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("month", monthStart)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertBudget(
  monthStart: string,
  values: {
    savings_goal_amount: number | null;
    investment_goal_amount: number | null;
  },
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("budgets")
    .upsert({ month: monthStart, ...values }, { onConflict: "month" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export type CategoryLimitWithCategory =
  Database["public"]["Tables"]["category_budget_limits"]["Row"] & {
    categories: Pick<
      Database["public"]["Tables"]["categories"]["Row"],
      "name" | "icon" | "group"
    > | null;
  };

export async function getCategoryLimitsForBudget(
  budgetId: string,
): Promise<CategoryLimitWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("category_budget_limits")
    .select("*, categories(name, icon, group)")
    .eq("budget_id", budgetId);
  if (error) throw error;
  return data as CategoryLimitWithCategory[];
}

export async function upsertCategoryLimit(
  budgetId: string,
  categoryId: string,
  limitAmount: number,
) {
  const supabase = await createClient();
  const { error } = await supabase.from("category_budget_limits").upsert(
    { budget_id: budgetId, category_id: categoryId, limit_amount: limitAmount },
    { onConflict: "budget_id,category_id" },
  );
  if (error) throw error;
}

export async function deleteCategoryLimit(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("category_budget_limits")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
