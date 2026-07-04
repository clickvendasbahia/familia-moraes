import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type TransactionWithCategory =
  Database["public"]["Tables"]["transactions"]["Row"] & {
    categories: Pick<
      Database["public"]["Tables"]["categories"]["Row"],
      "name" | "group" | "icon"
    > | null;
  };

export type TransactionLite = Pick<
  Database["public"]["Tables"]["transactions"]["Row"],
  | "type"
  | "amount"
  | "date"
  | "investment_id"
  | "account_id"
  | "transfer_account_id"
>;

export async function getTransactionsBetween(
  startDate: string,
  endDate: string,
): Promise<TransactionWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, group, icon)")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });
  if (error) throw error;
  return data as TransactionWithCategory[];
}

export async function getRecentTransactions(
  limit: number,
): Promise<TransactionWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, group, icon)")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as TransactionWithCategory[];
}

/**
 * Todas as movimentações (apenas as colunas essenciais) usadas para
 * reconstruir o saldo de caixa acumulado e sua evolução histórica.
 */
export async function getAllTransactionsLite(): Promise<TransactionLite[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("type, amount, date, investment_id, account_id, transfer_account_id")
    .order("date", { ascending: true });
  if (error) throw error;
  return data;
}

export type TransactionListItem =
  Database["public"]["Tables"]["transactions"]["Row"] & {
    categories: Pick<
      Database["public"]["Tables"]["categories"]["Row"],
      "name" | "icon"
    > | null;
    subcategories: Pick<
      Database["public"]["Tables"]["subcategories"]["Row"],
      "name"
    > | null;
    account: Pick<Database["public"]["Tables"]["accounts"]["Row"], "name"> | null;
    transfer_account: Pick<
      Database["public"]["Tables"]["accounts"]["Row"],
      "name"
    > | null;
  };

export type TransactionFilters = {
  person?: string;
  type?: string;
  categoryId?: string;
  accountId?: string;
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: "date" | "amount";
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export async function getFilteredTransactions(
  filters: TransactionFilters,
): Promise<{ items: TransactionListItem[]; total: number }> {
  const supabase = await createClient();
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 25;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("transactions")
    .select(
      "*, categories(name, icon), subcategories(name), account:accounts!transactions_account_id_fkey(name), transfer_account:accounts!transactions_transfer_account_id_fkey(name)",
      { count: "exact" },
    );

  if (filters.person)
    query = query.eq(
      "person",
      filters.person as Database["public"]["Tables"]["transactions"]["Row"]["person"],
    );
  if (filters.type)
    query = query.eq(
      "type",
      filters.type as Database["public"]["Tables"]["transactions"]["Row"]["type"],
    );
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.accountId) query = query.eq("account_id", filters.accountId);
  if (filters.paymentMethod)
    query = query.eq(
      "payment_method",
      filters.paymentMethod as NonNullable<
        Database["public"]["Tables"]["transactions"]["Row"]["payment_method"]
      >,
    );
  if (filters.dateFrom) query = query.gte("date", filters.dateFrom);
  if (filters.dateTo) query = query.lte("date", filters.dateTo);
  if (filters.search) query = query.ilike("description", `%${filters.search}%`);

  const sortBy = filters.sortBy ?? "date";
  const sortDir = filters.sortDir ?? "desc";
  query = query
    .order(sortBy, { ascending: sortDir === "asc" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { items: data as unknown as TransactionListItem[], total: count ?? 0 };
}

export type TransactionInput =
  Database["public"]["Tables"]["transactions"]["Insert"];

export async function createTransaction(input: TransactionInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTransaction(
  id: string,
  input: Partial<TransactionInput>,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}

export async function getTransactionById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
