import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type InvestmentWithValue = {
  id: string;
  name: string;
  category_id: string | null;
  person: string;
  latestValue: number | null;
};

export async function getInvestmentsWithLatestValuation(): Promise<
  InvestmentWithValue[]
> {
  const supabase = await createClient();

  const { data: investments, error } = await supabase
    .from("investments")
    .select("id, name, category_id, person");
  if (error) throw error;

  const { data: valuations, error: valError } = await supabase
    .from("investment_valuations")
    .select("investment_id, current_value, date")
    .order("date", { ascending: false });
  if (valError) throw valError;

  const latestByInvestment = new Map<string, number>();
  for (const v of valuations ?? []) {
    if (!latestByInvestment.has(v.investment_id)) {
      latestByInvestment.set(v.investment_id, v.current_value);
    }
  }

  return investments.map((inv) => ({
    ...inv,
    latestValue: latestByInvestment.get(inv.id) ?? null,
  }));
}

export type InvestmentDetailed =
  Database["public"]["Tables"]["investments"]["Row"] & {
    categories: Pick<
      Database["public"]["Tables"]["categories"]["Row"],
      "name" | "icon"
    > | null;
  };

export async function getAllInvestmentsDetailed(): Promise<
  InvestmentDetailed[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("investments")
    .select("*, categories(name, icon)")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as InvestmentDetailed[];
}

export type InvestmentInput =
  Database["public"]["Tables"]["investments"]["Insert"];

export async function createInvestment(input: InvestmentInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("investments")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateInvestment(
  id: string,
  input: Partial<InvestmentInput>,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("investments")
    .update(input)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteInvestment(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("investments").delete().eq("id", id);
  if (error) throw error;
}

export async function getAllValuations(): Promise<
  Database["public"]["Tables"]["investment_valuations"]["Row"][]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("investment_valuations")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addValuation(input: {
  investment_id: string;
  date: string;
  current_value: number;
  notes: string | null;
}) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("investment_valuations")
    .upsert(input, { onConflict: "investment_id,date" });
  if (error) throw error;
}
