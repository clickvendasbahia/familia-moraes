import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export async function getActiveRecurringBills() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recurring_bills")
    .select("id, name, amount, person, day_of_month")
    .eq("active", true);
  if (error) throw error;
  return data;
}

export type RecurringBillWithCategory =
  Database["public"]["Tables"]["recurring_bills"]["Row"] & {
    categories: Pick<
      Database["public"]["Tables"]["categories"]["Row"],
      "name" | "icon"
    > | null;
    account: Pick<Database["public"]["Tables"]["accounts"]["Row"], "name"> | null;
  };

export async function getAllRecurringBills(): Promise<
  RecurringBillWithCategory[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recurring_bills")
    .select(
      "*, categories(name, icon), account:accounts!recurring_bills_account_id_fkey(name)",
    )
    .order("day_of_month", { ascending: true });
  if (error) throw error;
  return data as RecurringBillWithCategory[];
}

export type RecurringBillInput =
  Database["public"]["Tables"]["recurring_bills"]["Insert"];

export async function createRecurringBill(input: RecurringBillInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("recurring_bills").insert(input);
  if (error) throw error;
}

export async function updateRecurringBill(
  id: string,
  input: Partial<RecurringBillInput>,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recurring_bills")
    .update(input)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteRecurringBill(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recurring_bills")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function generateRecurringTransactionsNow() {
  const supabase = await createClient();
  const { error } = await supabase.rpc("generate_recurring_transactions");
  if (error) throw error;
}
