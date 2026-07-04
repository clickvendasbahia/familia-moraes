import {
  getAllInvestmentsDetailed,
  getAllValuations,
} from "@/repositories/investments-repository";
import { getAllTransactionsLite } from "@/repositories/transactions-repository";

export type InvestmentRow = {
  id: string;
  name: string;
  categoryId: string | null;
  categoryName: string;
  categoryIcon: string;
  person: string;
  broker: string | null;
  contributed: number;
  currentValue: number;
  latestValuationDate: string | null;
  returnPct: number | null;
};

export type CategoryDistribution = { category: string; value: number };

export type InvestmentsOverview = {
  totalInvested: number;
  totalContributed: number;
  overallReturnPct: number | null;
  investments: InvestmentRow[];
  categoryDistribution: CategoryDistribution[];
};

export async function getInvestmentsOverview(): Promise<InvestmentsOverview> {
  const [investments, valuations, transactions] = await Promise.all([
    getAllInvestmentsDetailed(),
    getAllValuations(),
    getAllTransactionsLite(),
  ]);

  const latestValuationByInvestment = new Map<
    string,
    { value: number; date: string }
  >();
  for (const v of valuations) {
    const existing = latestValuationByInvestment.get(v.investment_id);
    if (!existing || v.date > existing.date) {
      latestValuationByInvestment.set(v.investment_id, {
        value: v.current_value,
        date: v.date,
      });
    }
  }

  const contributedByInvestment = new Map<string, number>();
  for (const t of transactions) {
    if (t.type === "investimento" && t.investment_id) {
      contributedByInvestment.set(
        t.investment_id,
        (contributedByInvestment.get(t.investment_id) ?? 0) + t.amount,
      );
    }
  }

  let totalInvested = 0;
  let totalContributed = 0;
  const categoryTotals = new Map<string, number>();

  const investmentRows: InvestmentRow[] = investments.map((inv) => {
    const contributed = contributedByInvestment.get(inv.id) ?? 0;
    const latestValuation = latestValuationByInvestment.get(inv.id);
    const currentValue = latestValuation?.value ?? contributed;
    const returnPct =
      contributed > 0 ? ((currentValue - contributed) / contributed) * 100 : null;

    totalInvested += currentValue;
    totalContributed += contributed;

    const categoryName = inv.categories?.name ?? "Sem categoria";
    categoryTotals.set(
      categoryName,
      (categoryTotals.get(categoryName) ?? 0) + currentValue,
    );

    return {
      id: inv.id,
      name: inv.name,
      categoryId: inv.category_id,
      categoryName,
      categoryIcon: inv.categories?.icon ?? "Circle",
      person: inv.person,
      broker: inv.broker,
      contributed,
      currentValue,
      latestValuationDate: latestValuation?.date ?? null,
      returnPct,
    };
  });

  const overallReturnPct =
    totalContributed > 0
      ? ((totalInvested - totalContributed) / totalContributed) * 100
      : null;

  const categoryDistribution: CategoryDistribution[] = Array.from(
    categoryTotals.entries(),
  )
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);

  return {
    totalInvested,
    totalContributed,
    overallReturnPct,
    investments: investmentRows,
    categoryDistribution,
  };
}
