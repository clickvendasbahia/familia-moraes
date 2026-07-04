import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export async function getActiveAccounts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("archived", false);
  if (error) throw error;
  return data;
}

export async function getAllAccounts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .order("archived", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
}

export type AccountInput = Database["public"]["Tables"]["accounts"]["Insert"];

export async function createAccount(input: AccountInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("accounts").insert(input);
  if (error) throw error;
}

export async function updateAccount(
  id: string,
  input: Partial<AccountInput>,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("accounts")
    .update(input)
    .eq("id", id);
  if (error) throw error;
}

export async function setAccountArchived(id: string, archived: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("accounts")
    .update({ archived })
    .eq("id", id);
  if (error) throw error;
}
