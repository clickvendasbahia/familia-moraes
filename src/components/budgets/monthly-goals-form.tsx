"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import {
  monthlyGoalsSchema,
  type MonthlyGoalsInput,
} from "@/lib/validations/budget";
import { saveMonthlyGoalsAction } from "@/services/budget-actions";

function progressPercent(current: number, goal: number | null): number {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

export function MonthlyGoalsForm({
  savingsGoal,
  investmentGoal,
  savingsAmount,
  totalInvested,
}: {
  savingsGoal: number | null;
  investmentGoal: number | null;
  savingsAmount: number;
  totalInvested: number;
}) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<MonthlyGoalsInput>({
    resolver: zodResolver(monthlyGoalsSchema),
    defaultValues: {
      savingsGoalAmount: savingsGoal,
      investmentGoalAmount: investmentGoal,
    },
  });

  async function handleSubmit(values: MonthlyGoalsInput) {
    setSubmitting(true);
    try {
      await saveMonthlyGoalsAction(values);
      toast.success("Metas do mês salvas");
    } catch {
      toast.error("Não foi possível salvar as metas");
    } finally {
      setSubmitting(false);
    }
  }

  const savingsPct = progressPercent(savingsAmount, savingsGoal);
  const investmentPct = progressPercent(totalInvested, investmentGoal);

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="savingsGoalAmount">Meta de economia</Label>
          <Input
            id="savingsGoalAmount"
            type="number"
            step="0.01"
            min="0"
            {...form.register("savingsGoalAmount", {
              setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
            })}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Economizado este mês: {formatCurrency(savingsAmount)}
            {savingsGoal != null && ` de ${formatCurrency(savingsGoal)}`}
          </p>
          {savingsGoal != null && (
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-income transition-all"
                style={{ width: `${savingsPct}%` }}
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="investmentGoalAmount">Meta de investimento</Label>
          <Input
            id="investmentGoalAmount"
            type="number"
            step="0.01"
            min="0"
            {...form.register("investmentGoalAmount", {
              setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
            })}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Investido este mês: {formatCurrency(totalInvested)}
            {investmentGoal != null && ` de ${formatCurrency(investmentGoal)}`}
          </p>
          {investmentGoal != null && (
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-investment transition-all"
                style={{ width: `${investmentPct}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Salvando..." : "Salvar metas"}
      </Button>
    </form>
  );
}
