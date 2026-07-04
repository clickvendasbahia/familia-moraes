"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTodayISODate } from "@/lib/utils";
import {
  goalContributionSchema,
  type GoalContributionFormInput,
} from "@/lib/validations/goal";

export function ContributionForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: GoalContributionFormInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<GoalContributionFormInput>({
    resolver: zodResolver(goalContributionSchema),
    defaultValues: { amount: 0, date: getTodayISODate(), notes: "" },
  });

  async function handleSubmit(values: GoalContributionFormInput) {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch {
      toast.error("Não foi possível registrar o aporte");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contribution-amount">Valor</Label>
          <Input
            id="contribution-amount"
            type="number"
            step="0.01"
            min="0"
            {...form.register("amount", { valueAsNumber: true })}
          />
          {form.formState.errors.amount && (
            <p className="mt-1 text-xs text-expense">
              {form.formState.errors.amount.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="contribution-date">Data</Label>
          <Input id="contribution-date" type="date" {...form.register("date")} />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : "Adicionar aporte"}
        </Button>
      </div>
    </form>
  );
}
