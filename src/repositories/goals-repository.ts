import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Goal = Database["public"]["Tables"]["goals"]["Row"];
export type GoalInput = Database["public"]["Tables"]["goals"]["Insert"];
export type GoalContribution =
  Database["public"]["Tables"]["goal_contributions"]["Row"];

export async function getAllGoals(): Promise<Goal[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createGoal(input: GoalInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("goals").insert(input);
  if (error) throw error;
}

export async function updateGoal(id: string, input: Partial<GoalInput>) {
  const supabase = await createClient();
  const { error } = await supabase.from("goals").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteGoal(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("goals").delete().eq("id", id);
  if (error) throw error;
}

export async function getContributionsForGoal(
  goalId: string,
): Promise<GoalContribution[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("goal_contributions")
    .select("*")
    .eq("goal_id", goalId)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllContributions(): Promise<GoalContribution[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("goal_contributions")
    .select("*");
  if (error) throw error;
  return data;
}

export async function addContribution(input: {
  goal_id: string;
  amount: number;
  date: string;
  notes: string | null;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("goal_contributions").insert(input);
  if (error) throw error;
}

export async function deleteContribution(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("goal_contributions")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
