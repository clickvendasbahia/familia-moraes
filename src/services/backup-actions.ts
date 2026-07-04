"use server";

import { createClient } from "@/lib/supabase/server";

const BACKUP_TABLES = [
  "accounts",
  "categories",
  "subcategories",
  "transactions",
  "recurring_bills",
  "investments",
  "investment_valuations",
  "budgets",
  "category_budget_limits",
  "goals",
  "goal_contributions",
] as const;

export async function generateBackupAction(): Promise<Record<string, unknown>> {
  const supabase = await createClient();
  const result: Record<string, unknown> = {
    generatedAt: new Date().toISOString(),
  };

  for (const table of BACKUP_TABLES) {
    const { data, error } = await supabase.from(table).select("*");
    if (error) throw error;
    result[table] = data;
  }

  return result;
}
