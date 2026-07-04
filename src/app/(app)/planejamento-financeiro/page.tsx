import Link from "next/link";
import { getFinancialPlanningData } from "@/services/financial-planning-service";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { NetWorthChart } from "@/components/dashboard/charts/net-worth-chart";
import { getIcon } from "@/lib/icons";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

export default async function PlanejamentoFinanceiroPage() {
  const data = await getFinancialPlanningData();

  const gapIsPositive = data.incomeGapThisMonth > 0;

  return (
    <main className="flex-1 space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Planejamento Financeiro
        </h1>
        <p className="text-sm text-muted-foreground">{data.monthLabel}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label={gapIsPositive ? "Falta ganhar este mês" : "Meta do mês já coberta"}
          value={Math.abs(data.incomeGapThisMonth)}
          icon="Target"
          accent={gapIsPositive ? "warning" : "income"}
          sublabel={`Estimativa de gasto: ${formatCurrency(data.requiredIncomeThisMonth)}`}
        />
        <SummaryCard
          label="Recebido este mês"
          value={data.incomeReceivedThisMonth}
          icon="Wallet"
          accent="income"
        />
        <SummaryCard
          label="% da renda investida"
          value={null}
          icon="Percent"
          accent="investment"
          sublabel={
            data.investedPctOfIncome != null
              ? formatPercent(data.investedPctOfIncome)
              : "Sem receita este mês"
          }
        />
        <SummaryCard
          label="Reserva de emergência"
          value={null}
          icon="ShieldCheck"
          sublabel={
            data.emergencyFundMonthsCovered != null
              ? `Cobre ~${data.emergencyFundMonthsCovered.toFixed(1)} meses de gastos`
              : "Sem dados suficientes ainda"
          }
        />
      </div>

      <DashboardPanel title="Evolução patrimonial desde o início">
        <NetWorthChart data={data.netWorthHistory} />
      </DashboardPanel>

      <div className="rounded-card border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Tempo estimado para cada meta</h2>
          <Link
            href="/metas"
            className="text-xs font-medium text-primary hover:underline"
          >
            Gerenciar metas
          </Link>
        </div>
        {data.goals.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhuma meta cadastrada ainda.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {data.goals.map((goal) => {
              const Icon = getIcon(goal.icon);
              const remaining = goal.targetAmount - goal.currentAmount;
              return (
                <div
                  key={goal.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{goal.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {remaining > 0
                          ? `Faltam ${formatCurrency(remaining)}`
                          : "Meta atingida"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      goal.estimatedMonthsRemaining == null
                        ? "text-muted-foreground"
                        : "text-primary",
                    )}
                  >
                    {goal.estimatedMonthsRemaining == null
                      ? "Sem ritmo definido"
                      : goal.estimatedMonthsRemaining === 0
                        ? "Concluída"
                        : `~${goal.estimatedMonthsRemaining} ${goal.estimatedMonthsRemaining === 1 ? "mês" : "meses"}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
