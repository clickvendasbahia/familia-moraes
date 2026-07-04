import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type CategoryWithSubcategories =
  Database["public"]["Tables"]["categories"]["Row"] & {
    subcategories: Database["public"]["Tables"]["subcategories"]["Row"][];
  };

export async function getCategoriesWithSubcategories(): Promise<
  CategoryWithSubcategories[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*, subcategories(*)")
    .eq("archived", false)
    .order("name", { ascending: true });
  if (error) throw error;
  return data as CategoryWithSubcategories[];
}
