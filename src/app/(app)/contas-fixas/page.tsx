import { getAllRecurringBills } from "@/repositories/recurring-bills-repository";
import { getCategoriesWithSubcategories } from "@/repositories/categories-repository";
import { getActiveAccounts } from "@/repositories/accounts-repository";
import { NewRecurringBillButton } from "@/components/recurring-bills/new-recurring-bill-button";
import { RecurringBillRowActions } from "@/components/recurring-bills/recurring-bill-row-actions";
import { ActiveToggle } from "@/components/recurring-bills/active-toggle";
import { GenerateNowButton } from "@/components/recurring-bills/generate-now-button";
import { formatCurrency, formatDate, getNextDueDate } from "@/lib/utils";
import { PERSON_OR_BOTH_LABELS, type PersonOrBoth } from "@/types/domain";

export default async function ContasFixasPage() {
  const [bills, categories, accounts] = await Promise.all([
    getAllRecurringBills(),
    getCategoriesWithSubcategories(),
    getActiveAccounts(),
  ]);

  const accountOptions = accounts.map((a) => ({ id: a.id, name: a.name }));

  return (
    <main className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Contas Fixas
          </h1>
          <p className="text-sm text-muted-foreground">
            {bills.length} contas cadastradas — geradas automaticamente todo
            mês
          </p>
        </div>
        <div className="flex gap-2">
          <GenerateNowButton />
          <NewRecurringBillButton
            categories={categories}
            accounts={accountOptions}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {bills.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Nenhuma conta fixa cadastrada ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Pessoa</th>
                  <th className="px-4 py-3 font-medium">Vencimento</th>
                  <th className="px-4 py-3 font-medium">Conta</th>
                  <th className="px-4 py-3 text-right font-medium">Valor</th>
                  <th className="px-4 py-3 font-medium">Ativa</th>
                  <th className="px-4 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr
                    key={bill.id}
                    className="border-b border-border last:border-0 hover:bg-surface-muted"
                  >
                    <td className="px-4 py-3 font-medium">{bill.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {bill.categories?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {PERSON_OR_BOTH_LABELS[bill.person as PersonOrBoth]}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Dia {bill.day_of_month}
                      {bill.active && (
                        <span className="block text-xs">
                          Próxima: {formatDate(getNextDueDate(bill.day_of_month))}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {bill.account?.name ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-expense">
                      {formatCurrency(bill.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <ActiveToggle id={bill.id} active={bill.active} />
                    </td>
                    <td className="px-4 py-3">
                      <RecurringBillRowActions
                        bill={bill}
                        categories={categories}
                        accounts={accountOptions}
                      />
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
