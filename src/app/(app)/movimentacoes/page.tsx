import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";
import { getFilteredTransactions } from "@/repositories/transactions-repository";
import { getCategoriesWithSubcategories } from "@/repositories/categories-repository";
import { getActiveAccounts } from "@/repositories/accounts-repository";
import { getInvestmentsWithLatestValuation } from "@/repositories/investments-repository";
import { NewTransactionButton } from "@/components/transactions/new-transaction-button";
import { ImportCsvButton } from "@/components/transactions/import-csv-button";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionRowActions } from "@/components/transactions/transaction-row-actions";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { PERSON_OR_BOTH_LABELS, type PersonOrBoth } from "@/types/domain";

const PAGE_SIZE = 25;

const TYPE_COLOR: Record<string, string> = {
  receita: "text-income",
  despesa: "text-expense",
  investimento: "text-investment",
  transferencia: "text-muted-foreground",
};
const TYPE_SIGN: Record<string, string> = {
  receita: "+",
  despesa: "-",
  investimento: "-",
  transferencia: "",
};

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function MovimentacoesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(first(params.page)) || 1);
  const sortBy = first(params.sort) === "amount" ? "amount" : "date";
  const sortDir = first(params.dir) === "asc" ? "asc" : "desc";

  const [{ items, total }, categories, accounts, investments] =
    await Promise.all([
      getFilteredTransactions({
        person: first(params.person) || undefined,
        type: first(params.type) || undefined,
        categoryId: first(params.category) || undefined,
        accountId: first(params.account) || undefined,
        paymentMethod: first(params.payment_method) || undefined,
        dateFrom: first(params.from) || undefined,
        dateTo: first(params.to) || undefined,
        search: first(params.q) || undefined,
        sortBy,
        sortDir,
        page,
        pageSize: PAGE_SIZE,
      }),
      getCategoriesWithSubcategories(),
      getActiveAccounts(),
      getInvestmentsWithLatestValuation(),
    ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const accountOptions = accounts.map((a) => ({ id: a.id, name: a.name }));
  const investmentOptions = investments.map((i) => ({
    id: i.id,
    name: i.name,
    categoryId: i.category_id,
  }));

  const flatSearchParams = new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) => {
      if (value == null) return [];
      const values = Array.isArray(value) ? value : [value];
      return values.map((v): [string, string] => [key, v]);
    }),
  );

  function sortHref(column: "date" | "amount") {
    const next = new URLSearchParams(flatSearchParams);
    const nextDir = sortBy === column && sortDir === "asc" ? "desc" : "asc";
    next.set("sort", column);
    next.set("dir", nextDir);
    return `/movimentacoes?${next.toString()}`;
  }

  function pageHref(p: number) {
    const next = new URLSearchParams(flatSearchParams);
    next.set("page", String(p));
    return `/movimentacoes?${next.toString()}`;
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Movimentações
          </h1>
          <p className="text-sm text-muted-foreground">
            {total} movimentações encontradas
          </p>
        </div>
        <div className="flex gap-2">
          <ImportCsvButton categories={categories} accounts={accountOptions} />
          <NewTransactionButton
            categories={categories}
            accounts={accountOptions}
            investments={investmentOptions}
          />
        </div>
      </div>

      <TransactionFilters categories={categories} accounts={accountOptions} />

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {items.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Nenhuma movimentação encontrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3 font-medium">
                    <Link
                      href={sortHref("date")}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      Data
                      {sortBy === "date" &&
                        (sortDir === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        ))}
                    </Link>
                  </th>
                  <th className="px-4 py-3 font-medium">Descrição</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Pessoa</th>
                  <th className="px-4 py-3 font-medium">Conta</th>
                  <th className="px-4 py-3 text-right font-medium">
                    <Link
                      href={sortHref("amount")}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      Valor
                      {sortBy === "amount" &&
                        (sortDir === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        ))}
                    </Link>
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border last:border-0 hover:bg-surface-muted"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-[220px] truncate font-medium">
                        {t.description}
                      </div>
                      {t.notes && (
                        <div className="max-w-[220px] truncate text-xs text-muted-foreground">
                          {t.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {t.categories?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {PERSON_OR_BOTH_LABELS[t.person as PersonOrBoth]}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {t.type === "transferencia"
                        ? `${t.account?.name ?? "—"} → ${t.transfer_account?.name ?? "—"}`
                        : (t.account?.name ?? "—")}
                    </td>
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-3 text-right font-medium",
                        TYPE_COLOR[t.type],
                      )}
                    >
                      {TYPE_SIGN[t.type]}
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <TransactionRowActions
                        transaction={t}
                        categories={categories}
                        accounts={accountOptions}
                        investments={investmentOptions}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
          <span>
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Link
              href={pageHref(Math.max(1, page - 1))}
              className={cn(
                "rounded-lg border border-border px-3 py-1.5",
                page <= 1 && "pointer-events-none opacity-50",
              )}
            >
              Anterior
            </Link>
            <Link
              href={pageHref(page + 1)}
              className={cn(
                "rounded-lg border border-border px-3 py-1.5",
                page >= totalPages && "pointer-events-none opacity-50",
              )}
            >
              Próxima
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
