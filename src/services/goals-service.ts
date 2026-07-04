import {
  getAllGoals,
  getAllContributions,
} from "@/repositories/goals-repository";

const ICON_KEYWORDS: { keywords: string[]; icon: string }[] = [
  { keywords: ["carro", "moto", "veículo", "veiculo"], icon: "Car" },
  { keywords: ["casa", "apartamento", "imóvel", "imovel"], icon: "Home" },
  { keywords: ["viagem", "viajar", "férias", "ferias"], icon: "Plane" },
  { keywords: ["reserva", "emergência", "emergencia"], icon: "ShieldCheck" },
  { keywords: ["casamento"], icon: "Heart" },
  { keywords: ["estudo", "faculdade", "curso"], icon: "GraduationCap" },
];

export function guessGoalIcon(name: string): string {
  const normalized = name.toLowerCase();
  for (const entry of ICON_KEYWORDS) {
    if (entry.keywords.some((k) => normalized.includes(k))) return entry.icon;
  }
  return "Flag";
}

export type GoalWithProgress = {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  progressPct: number;
  targetDate: string | null;
  status: string;
  monthlyContributionAvg: number;
  estimatedMonthsRemaining: number | null;
};

export async function getGoalsOverview(): Promise<GoalWithProgress[]> {
  const [goals, contributions] = await Promise.all([
    getAllGoals(),
    getAllContributions(),
  ]);

  const contributionsByGoal = new Map<
    string,
    { total: number; monthTotals: Map<string, number> }
  >();
  for (const c of contributions) {
    const entry = contributionsByGoal.get(c.goal_id) ?? {
      total: 0,
      monthTotals: new Map<string, number>(),
    };
    entry.total += c.amount;
    const monthKey = c.date.slice(0, 7);
    entry.monthTotals.set(
      monthKey,
      (entry.monthTotals.get(monthKey) ?? 0) + c.amount,
    );
    contributionsByGoal.set(c.goal_id, entry);
  }

  return goals.map((g) => {
    const entry = contributionsByGoal.get(g.id);
    const currentAmount = entry?.total ?? 0;
    const progressPct =
      g.target_amount > 0
        ? Math.min(100, (currentAmount / g.target_amount) * 100)
        : 0;

    const monthsWithContribution = entry?.monthTotals.size ?? 0;
    const monthlyContributionAvg =
      monthsWithContribution > 0 ? currentAmount / monthsWithContribution : 0;

    const remaining = g.target_amount - currentAmount;
    const estimatedMonthsRemaining =
      remaining <= 0
        ? 0
        : monthlyContributionAvg > 0
          ? Math.ceil(remaining / monthlyContributionAvg)
          : null;

    return {
      id: g.id,
      name: g.name,
      icon: g.icon ?? guessGoalIcon(g.name),
      targetAmount: g.target_amount,
      currentAmount,
      progressPct,
      targetDate: g.target_date,
      status: g.status,
      monthlyContributionAvg,
      estimatedMonthsRemaining,
    };
  });
}
