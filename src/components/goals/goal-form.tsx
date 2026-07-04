"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { goalSchema, type GoalFormInput } from "@/lib/validations/goal";
import { GOAL_STATUS_LABELS } from "@/types/domain";

export function GoalForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: {
  defaultValues?: Partial<GoalFormInput>;
  onSubmit: (values: GoalFormInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<GoalFormInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      targetAmount: 0,
      targetDate: "",
      status: "em_andamento",
      ...defaultValues,
    },
  });

  async function handleSubmit(values: GoalFormInput) {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch {
      toast.error("Não foi possível salvar a meta");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" placeholder="Comprar carro" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="mt-1 text-xs text-expense">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="targetAmount">Valor alvo</Label>
          <Input
            id="targetAmount"
            type="number"
            step="0.01"
            min="0"
            {...form.register("targetAmount", { valueAsNumber: true })}
          />
          {form.formState.errors.targetAmount && (
            <p className="mt-1 text-xs text-expense">
              {form.formState.errors.targetAmount.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="targetDate">Data alvo (opcional)</Label>
          <Input id="targetDate" type="date" {...form.register("targetDate")} />
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select id="status" {...form.register("status")}>
          {Object.entries(GOAL_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
