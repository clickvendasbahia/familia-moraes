import { getDashboardData } from "@/services/dashboard-service";
import { getDashboardInsights } from "@/services/insights-service";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { InsightsPanel } from "@/components/dashboard/insights-panel";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { IncomeExpenseChart } from "@/components/dashboard/charts/income-expense-chart";
import { CategoryChart } from "@/components/dashboard/charts/category-chart";
import { MonthlyEvolutionChart } from "@/components/dashboard/charts/monthly-evolution-chart";
import { NetWorthChart } from "@/components/dashboard/charts/net-worth-chart";
import { UpcomingBillsCard } from "@/components/dashboard/upcoming-bills-card";
import { RecentTransactionsCard } from "@/components/dashboard/recent-transactions-card";

export default async function DashboardPage() {
  const [data, insights] = await Promise.all([
    getDashboardData(),
    getDashboardInsights(),
  ]);

  return (
    <main className="flex-1 space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          {data.month.label}
        </h1>
        <p className="text-sm text-muted-foreground">
          Visão geral das finanças da família
        </p>
      </div>

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
        <UpcomingBillsCard bills={data.upcomingBills} />
        <RecentTransactionsCard transactions={data.recentTransactions} />
      </div>
    </main>
  );
}
