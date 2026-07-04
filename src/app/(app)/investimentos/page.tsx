import { getInvestmentsOverview } from "@/services/investments-service";
import { getCategoriesWithSubcategories } from "@/repositories/categories-repository";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { CategoryDistributionChart } from "@/components/investments/category-distribution-chart";
import { NewInvestmentButton } from "@/components/investments/new-investment-button";
import { InvestmentRowActions } from "@/components/investments/investment-row-actions";
import { getIcon } from "@/lib/icons";
import { cn, formatCurrency, formatDate, formatPercent } from "@/lib/utils";
import { PERSON_OR_BOTH_LABELS, type PersonOrBoth } from "@/types/domain";

export default async function InvestimentosPage() {
  const [overview, categories] = await Promise.all([
    getInvestmentsOverview(),
    getCategoriesWithSubcategories(),
  ]);

  return (
    <main className="flex-1 space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Investimentos
          </h1>
          <p className="text-sm text-muted-foreground">
            {overview.investments.length}{" "}
            {overview.investments.length === 1
              ? "ativo cadastrado"
              : "ativos cadastrados"}
          </p>
        </div>
        <NewInvestmentButton categories={categories} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <SummaryCard
          label="Total Investido"
          value={overview.totalInvested}
          icon="TrendingUp"
          accent="investment"
        />
        <SummaryCard
          label="Total Aportado"
          value={overview.totalContributed}
          icon="PiggyBank"
        />
        <SummaryCard
          label="Rentabilidade"
          value={null}
          icon="Percent"
          accent={
            overview.overallReturnPct != null && overview.overallReturnPct < 0
              ? "expense"
              : "income"
          }
          sublabel={
            overview.overallReturnPct != null
              ? formatPercent(overview.overallReturnPct)
              : "Sem aportes ainda"
          }
        />
      </div>

      <DashboardPanel title="Distribuição por categoria">
        <CategoryDistributionChart data={overview.categoryDistribution} />
      </DashboardPanel>

      <div className="rounded-card border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold">Seus ativos</h2>
        {overview.investments.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhum investimento cadastrado ainda.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Ativo</th>
                  <th className="px-3 py-2 font-medium">Pessoa</th>
                  <th className="px-3 py-2 text-right font-medium">Aportado</th>
                  <th className="px-3 py-2 text-right font-medium">
                    Valor Atual
                  </th>
                  <th className="px-3 py-2 text-right font-medium">
                    Rentabilidade
                  </th>
                  <th className="px-3 py-2 font-medium">Atualizado em</th>
                  <th className="px-3 py-2 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {overview.investments.map((inv) => {
                  const Icon = getIcon(inv.categoryIcon);
                  return (
                    <tr
                      key={inv.id}
                      className="border-b border-border last:border-0 hover:bg-surface-muted"
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2 font-medium">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {inv.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {inv.categoryName}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {PERSON_OR_BOTH_LABELS[inv.person as PersonOrBoth]}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {formatCurrency(inv.contributed)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        {formatCurrency(inv.currentValue)}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-2 text-right font-medium",
                          inv.returnPct == null
                            ? "text-muted-foreground"
                            : inv.returnPct >= 0
                              ? "text-income"
                              : "text-expense",
                        )}
                      >
                        {inv.returnPct != null ? formatPercent(inv.returnPct) : "—"}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {inv.latestValuationDate
                          ? formatDate(inv.latestValuationDate)
                          : "—"}
                      </td>
                      <td className="px-3 py-2">
                        <InvestmentRowActions
                          investment={inv}
                          categoryId={inv.categoryId ?? ""}
                          broker={inv.broker}
                          categories={categories}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
