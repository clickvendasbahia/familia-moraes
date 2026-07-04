"use server";

import { getFilteredTransactions } from "@/repositories/transactions-repository";

export type SearchResult = {
  id: string;
  description: string;
  amount: number;
  date: string;
};

export async function searchTransactionsAction(
  query: string,
): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const { items } = await getFilteredTransactions({
    search: query,
    pageSize: 5,
    sortBy: "date",
    sortDir: "desc",
  });
  return items.map((t) => ({
    id: t.id,
    description: t.description,
    amount: t.amount,
    date: t.date,
  }));
}
