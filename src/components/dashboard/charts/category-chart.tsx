"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { ChartEmptyState } from "./chart-empty-state";

const COLORS = [
  "var(--color-primary)",
  "var(--color-expense)",
  "var(--color-investment)",
  "var(--color-warning)",
  "var(--color-income)",
  "#a855f7",
  "#0ea5e9",
  "#f97316",
];

type Props = {
  data: { category: string; amount: number }[];
};

const MAX_SLICES = 7;

export function CategoryChart({ data }: Props) {
  if (data.length === 0) {
    return <ChartEmptyState message="Nenhuma despesa registrada neste mês ainda." />;
  }

  const top = data.slice(0, MAX_SLICES);
  const restTotal = data
    .slice(MAX_SLICES)
    .reduce((sum, d) => sum + d.amount, 0);
  const chartData = restTotal > 0 ? [...top, { category: "Outros", amount: restTotal }] : top;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="amount"
          nameKey="category"
          innerRadius={56}
          outerRadius={88}
          paddingAngle={2}
        >
          {chartData.map((entry, index) => (
            <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v) => formatCurrency(Number(v))}
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
