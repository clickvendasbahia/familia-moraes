import Link from "next/link";
import { getAnnualReport, getMonthlyReport } from "@/services/reports-service";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ExportCsvButton } from "@/components/reports/export-csv-button";
import { PrintButton } from "@/components/reports/print-button";
import { BackupButton } from "@/components/reports/backup-button";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const period = first(params.period) === "year" ? "year" : "month";
  const year = Number(first(params.year)) || new Date().getFullYear();

  const data =
    period === "year" ? await getAnnualReport(year) : await getMonthlyReport();

  return (
    <main className="flex-1 space-y-6 p-4 md:p-6 print:p-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Relatórios</h1>
          <p className="text-sm text-muted-foreground">{data.label}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border p-1">
            <Link
              href="/relatorios?period=month"
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium",
                period === "month"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              Mensal
            </Link>
            <Link
              href={`/relatorios?period=year&year=${year}`}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium",
                period === "year"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              Anual
            </Link>
          </div>
          <ExportCsvButton
            rows={data.transactions}
            filename={`relatorio-${period === "year" ? year : "mensal"}.csv`}
          />
          <PrintButton />
          <BackupButton />
        </div>
      </div>

      <div className="hidden print:block">
        <h1 className="text-xl font-semibold">Relatório — {data.label}</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="Receita" value={data.income} icon="TrendingUp" accent="income" />
        <SummaryCard label="Despesa" value={data.expense} icon="TrendingDown" accent="expense" />
        <SummaryCard label="Investido" value={data.invested} icon="PiggyBank" accent="investment" />
        <SummaryCard
          label="Economia"
          value={data.savings}
          icon="Wallet"
          sublabel={`Taxa: ${formatPercent(data.savingsRate)}`}
        />
      </div>

      {data.comparisonPrevious && (
        <div className="rounded-card border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold">Comparação com o mês anterior</h2>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Receita</p>
              <p className="font-medium">
                {formatCurrency(data.income)}{" "}
                <span className="text-xs text-muted-foreground">
                  (mês anterior: {formatCurrency(data.comparisonPrevious.income)})
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Despesa</p>
              <p className="font-medium">
                {formatCurrency(data.expense)}{" "}
                <span className="text-xs text-muted-foreground">
                  (mês anterior: {formatCurrency(data.comparisonPrevious.expense)})
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Taxa de economia</p>
              <p className="font-medium">
                {formatPercent(data.savingsRate)}{" "}
                <span className="text-xs text-muted-foreground">
                  (mês anterior: {formatPercent(data.comparisonPrevious.savingsRate)})
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {data.monthlyBreakdown.length > 0 && (
        <div className="rounded-card border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold">Mês a mês</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Mês</th>
                  <th className="px-3 py-2 text-right font-medium">Receita</th>
                  <th className="px-3 py-2 text-right font-medium">Despesa</th>
                  <th className="px-3 py-2 text-right font-medium">Economia</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlyBreakdown.map((m) => (
                  <tr key={m.month} className="border-b border-border last:border-0">
                    <td className="px-3 py-2">{m.month}</td>
                    <td className="px-3 py-2 text-right text-income">
                      {formatCurrency(m.income)}
                    </td>
                    <td className="px-3 py-2 text-right text-expense">
                      {formatCurrency(m.expense)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      {formatCurrency(m.savings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-card border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold">Categorias que mais gastam</h2>
          {data.byCategory.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Sem despesas no período.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {data.byCategory.slice(0, 8).map((c) => (
                <li key={c.category} className="flex items-center justify-between text-sm">
                  <span>{c.category}</span>
                  <span className="font-medium">{formatCurrency(c.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-card border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold">Quem gastou mais</h2>
          {data.byPerson.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Sem despesas no período.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {data.byPerson.map((p) => (
                <li key={p.person} className="flex items-center justify-between text-sm">
                  <span>{p.person}</span>
                  <span className="font-medium">{formatCurrency(p.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-card border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold">Maior gasto</h2>
          {data.biggestExpense ? (
            <div className="mt-2">
              <p className="font-medium">{data.biggestExpense.description}</p>
              <p className="text-xs text-muted-foreground">{data.biggestExpense.category}</p>
              <p className="mt-1 text-lg font-semibold text-expense">
                {formatCurrency(data.biggestExpense.amount)}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Sem despesas no período.</p>
          )}
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold">Maior receita</h2>
          {data.biggestIncome ? (
            <div className="mt-2">
              <p className="font-medium">{data.biggestIncome.description}</p>
              <p className="text-xs text-muted-foreground">{data.biggestIncome.category}</p>
              <p className="mt-1 text-lg font-semibold text-income">
                {formatCurrency(data.biggestIncome.amount)}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Sem receitas no período.</p>
          )}
        </div>
      </div>
    </main>
  );
}
