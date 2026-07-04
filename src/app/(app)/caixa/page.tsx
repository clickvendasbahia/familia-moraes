import { getCashFlowData } from "@/services/cash-flow-service";
import { getAllAccounts } from "@/repositories/accounts-repository";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { NewAccountButton } from "@/components/accounts/new-account-button";
import { AccountRowActions } from "@/components/accounts/account-row-actions";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { ACCOUNT_TYPE_LABELS, type AccountType } from "@/types/domain";

export default async function CaixaPage() {
  const [cashFlow, accounts] = await Promise.all([
    getCashFlowData(),
    getAllAccounts(),
  ]);

  return (
    <main className="flex-1 space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Caixa</h1>
        <p className="text-sm text-muted-foreground">{cashFlow.monthLabel}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Saldo Inicial"
          value={cashFlow.openingBalance}
          icon="Wallet"
        />
        <SummaryCard
          label="Entradas"
          value={cashFlow.income}
          icon="TrendingUp"
          accent="income"
        />
        <SummaryCard
          label="Saídas"
          value={cashFlow.expense}
          icon="TrendingDown"
          accent="expense"
        />
        <SummaryCard
          label="Saldo Final"
          value={cashFlow.closingBalance}
          icon="Landmark"
          accent="investment"
        />
      </div>

      <div className="rounded-card border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Saldo por conta</h2>
          <NewAccountButton />
        </div>
        <div className="mt-3 space-y-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={cn(
                "flex items-center justify-between rounded-lg border border-border p-3",
                account.archived && "opacity-50",
              )}
            >
              <div>
                <p className="text-sm font-medium">
                  {account.name}
                  {account.archived && (
                    <span className="ml-2 rounded-full bg-surface-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                      Arquivada
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {ACCOUNT_TYPE_LABELS[account.type as AccountType]}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {formatCurrency(
                    cashFlow.accountBalances.find((a) => a.id === account.id)
                      ?.balance ?? account.initial_balance,
                  )}
                </span>
                <AccountRowActions account={account} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold">Fluxo diário do mês</h2>
        {cashFlow.dailyFlow.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhuma movimentação neste mês ainda.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Data</th>
                  <th className="px-3 py-2 text-right font-medium">Entradas</th>
                  <th className="px-3 py-2 text-right font-medium">Saídas</th>
                  <th className="px-3 py-2 text-right font-medium">
                    Saldo acumulado
                  </th>
                </tr>
              </thead>
              <tbody>
                {cashFlow.dailyFlow.map((day) => (
                  <tr
                    key={day.date}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-3 py-2">{formatDate(day.date)}</td>
                    <td className="px-3 py-2 text-right text-income">
                      {day.income > 0 ? `+${formatCurrency(day.income)}` : "—"}
                    </td>
                    <td className="px-3 py-2 text-right text-expense">
                      {day.expense > 0
                        ? `-${formatCurrency(day.expense)}`
                        : "—"}
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      {formatCurrency(day.runningBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
