"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";
import { ChartEmptyState } from "./chart-empty-state";

type Props = {
  data: { date: string; receita: number; despesa: number }[];
};

export function IncomeExpenseChart({ data }: Props) {
  if (data.length === 0) {
    return <ChartEmptyState message="Nenhuma movimentação neste mês ainda." />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="date"
          tickFormatter={(d: string) => d.slice(8, 10)}
          tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
          tickFormatter={(v: number) => formatCompactCurrency(v)}
          width={64}
        />
        <Tooltip
          formatter={(v) => formatCurrency(Number(v))}
          labelFormatter={(d) => `Dia ${String(d).slice(8, 10)}`}
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Bar dataKey="receita" name="Entradas" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="despesa" name="Saídas" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
