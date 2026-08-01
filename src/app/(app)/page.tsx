import { getDashboardData } from "@/services/dashboard-service";
import { getDashboardInsights } from "@/services/insights-service";
import { resolvePeriod } from "@/lib/period";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { InsightsPanel } from "@/components/dashboard/insights-panel";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { ComparisonCard } from "@/components/dashboard/comparison-card";
import { BreakdownListCard } from "@/components/dashboard/breakdown-list-card";
import { TopExpensesCard } from "@/components/dashboard/top-expenses-card";
import { MonthBillsCard } from "@/components/dashboard/month-bills-card";
import { IncomeExpenseChart } from "@/components/dashboard/charts/income-expense-chart";
import { CategoryChart } from "@/components/dashboard/charts/category-chart";
import { MonthlyEvolutionChart } from "@/components/dashboard/charts/monthly-evolution-chart";
import { NetWorthChart } from "@/components/dashboard/charts/net-worth-chart";
import { UpcomingBillsCard } from "@/components/dashboard/upcoming-bills-card";
import { RecentTransactionsCard } from "@/components/dashboard/recent-transactions-card";

type SearchParams = { month?: string; year?: string };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const period = resolvePeriod(params);

  const [data, insights] = await Promise.all([
    getDashboardData(period.referenceDate),
    getDashboardInsights(period.referenceDate),
  ]);

  return (
    <main className="flex-1 space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {data.month.label}
          </h1>
          <p className="text-sm text-muted-foreground">
            Visão geral das finanças da família
          </p>
        </div>
        <PeriodSelector
          year={period.year}
          month={period.month}
          label={period.label}
          isCurrentMonth={period.isCurrentMonth}
        />
      </div>

      {!data.hasTransactions && (
        <div className="rounded-card border border-dashed border-border bg-surface-muted p-4 text-sm text-muted-foreground">
          Nenhuma movimentação encontrada em {data.month.label.toLowerCase()}.
        </div>
      )}

      <InsightsPanel insights={insights} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <SummaryCard
          label="Receita Ramon"
          value={data.income.ramon}
          icon="Wallet"
          accent="income"
        />
        <SummaryCard
          label="Receita Priscila"
          value={data.income.priscila}
          icon="Wallet"
          accent="income"
        />
        <SummaryCard
          label="Receita Total"
          value={data.income.total}
          icon="TrendingUp"
          accent="income"
        />
        <SummaryCard
          label="Despesas Fixas"
          value={data.expenses.fixed}
          icon="CalendarClock"
          accent="expense"
        />
        <SummaryCard
          label="Despesas Variáveis"
          value={data.expenses.variable}
          icon="ShoppingCart"
          accent="expense"
        />
        <SummaryCard
          label="Investimentos"
          value={data.investmentsThisMonth}
          icon="TrendingUp"
          accent="investment"
        />
        <SummaryCard label="Caixa" value={data.cashBalance} icon="Wallet" />
        <SummaryCard
          label="Saldo Disponível"
          value={data.availableBalance}
          icon="Banknote"
        />
        <SummaryCard
          label="Economia do mês"
          value={data.savings.amount}
          icon="PiggyBank"
          accent="income"
          sublabel={`Taxa de economia: ${data.savings.rate.toFixed(1)}%`}
        />
        <SummaryCard
          label="Meta de economia"
          value={data.savings.goal}
          icon="Target"
          accent="warning"
          sublabel={
            data.savings.goal == null ? "Meta ainda não definida" : undefined
          }
        />
        <SummaryCard
          label="Patrimônio Total"
          value={data.netWorth}
          icon="Landmark"
          accent="investment"
        />
      </div>

      <ComparisonCard comparison={data.comparison} />

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardPanel title="Entradas e saídas do mês">
          <IncomeExpenseChart data={data.charts.incomeExpenseByDay} />
        </DashboardPanel>
        <DashboardPanel title="Despesas por categoria">
          <CategoryChart data={data.charts.categoryBreakdown} />
        </DashboardPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardPanel title="Evolução mensal">
          <MonthlyEvolutionChart data={data.charts.monthlyEvolution} />
        </DashboardPanel>
        <DashboardPanel title="Evolução do patrimônio">
          <NetWorthChart data={data.charts.netWorthEvolution} />
        </DashboardPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BreakdownListCard
          title="Ganhos por origem"
          emptyLabel="Sem receitas de Ganhos neste mês."
          items={data.incomeByOrigin.map((i) => ({ label: i.origin, amount: i.amount }))}
        />
        <BreakdownListCard
          title="Mercado por subcategoria"
          emptyLabel="Sem gastos de Mercado neste mês."
          items={data.marketBreakdown.map((m) => ({ label: m.subcategory, amount: m.amount }))}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TopExpensesCard expenses={data.topExpenses} />
        <MonthBillsCard bills={data.monthBills} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <UpcomingBillsCard bills={data.upcomingBills} />
        <RecentTransactionsCard transactions={data.recentTransactions} />
      </div>
    </main>
  );
}
