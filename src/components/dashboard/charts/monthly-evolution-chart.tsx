"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";

type Props = {
  data: { month: string; receita: number; despesa: number; saldo: number }[];
};

export function MonthlyEvolutionChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
          tickFormatter={(v: number) => formatCompactCurrency(v)}
          width={64}
        />
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
        <Bar dataKey="receita" name="Receitas" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="despesa" name="Despesas" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
        <Line type="monotone" dataKey="saldo" name="Saldo" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
