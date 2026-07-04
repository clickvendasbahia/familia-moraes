"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { ChartEmptyState } from "@/components/dashboard/charts/chart-empty-state";
import type { CategoryDistribution } from "@/services/investments-service";

const COLORS = [
  "var(--color-investment)",
  "var(--color-primary)",
  "var(--color-income)",
  "var(--color-warning)",
  "var(--color-expense)",
  "#a855f7",
  "#0ea5e9",
  "#f97316",
];

export function CategoryDistributionChart({
  data,
}: {
  data: CategoryDistribution[];
}) {
  if (data.length === 0) {
    return <ChartEmptyState message="Nenhum investimento cadastrado ainda." />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          innerRadius={56}
          outerRadius={88}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
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
