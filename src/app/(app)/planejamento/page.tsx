import { getMonthlyPlanData } from "@/services/budget-service";
import { MonthlyGoalsForm } from "@/components/budgets/monthly-goals-form";
import { AddCategoryLimitButton } from "@/components/budgets/add-category-limit-button";
import { CategoryLimitItem } from "@/components/budgets/category-limit-item";

export default async function PlanejamentoPage() {
  const data = await getMonthlyPlanData();

  return (
    <main className="flex-1 space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Planejamento Mensal
        </h1>
        <p className="text-sm text-muted-foreground">{data.monthLabel}</p>
      </div>

      <div className="rounded-card border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold">Metas do mês</h2>
        <div className="mt-4">
          <MonthlyGoalsForm
            savingsGoal={data.savingsGoal}
            investmentGoal={data.investmentGoal}
            savingsAmount={data.savingsAmount}
            totalInvested={data.totalInvested}
          />
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Limite de gastos por categoria</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Você recebe um alerta visual quando uma categoria se aproxima ou
              ultrapassa o limite.
            </p>
          </div>
          <AddCategoryLimitButton
            categories={data.expenseCategories}
            existingCategoryIds={data.categoryLimits.map((l) => l.categoryId)}
          />
        </div>

        <div className="mt-4 space-y-2">
          {data.categoryLimits.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum limite definido ainda.
            </p>
          ) : (
            data.categoryLimits.map((limit) => (
              <CategoryLimitItem key={limit.id} limit={limit} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
