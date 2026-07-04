"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getTodayISODate } from "@/lib/utils";
import {
  valuationSchema,
  type ValuationFormInput,
} from "@/lib/validations/investment";

export function ValuationForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (values: ValuationFormInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ValuationFormInput>({
    resolver: zodResolver(valuationSchema),
    defaultValues: {
      date: getTodayISODate(),
      currentValue: 0,
      notes: "",
    },
  });

  async function handleSubmit(values: ValuationFormInput) {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch {
      toast.error("Não foi possível registrar o valor");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="valuation-date">Data</Label>
          <Input id="valuation-date" type="date" {...form.register("date")} />
        </div>
        <div>
          <Label htmlFor="valuation-value">Valor atual</Label>
          <Input
            id="valuation-value"
            type="number"
            step="0.01"
            min="0"
            {...form.register("currentValue", { valueAsNumber: true })}
          />
          {form.formState.errors.currentValue && (
            <p className="mt-1 text-xs text-expense">
              {form.formState.errors.currentValue.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="valuation-notes">Observações (opcional)</Label>
        <Textarea id="valuation-notes" {...form.register("notes")} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : "Registrar"}
        </Button>
      </div>
    </form>
  );
}
