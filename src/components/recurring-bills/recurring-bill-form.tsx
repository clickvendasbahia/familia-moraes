"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { getTodayISODate } from "@/lib/utils";
import {
  recurringBillSchema,
  type RecurringBillFormInput,
} from "@/lib/validations/recurring-bill";
import {
  PAYMENT_METHOD_LABELS,
  PERSON_OR_BOTH_LABELS,
} from "@/types/domain";
import type { CategoryWithSubcategories } from "@/repositories/categories-repository";

type AccountOption = { id: string; name: string };

type RecurringBillFormProps = {
  categories: CategoryWithSubcategories[];
  accounts: AccountOption[];
  defaultValues?: Partial<RecurringBillFormInput>;
  onSubmit: (values: RecurringBillFormInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
};

export function RecurringBillForm({
  categories,
  accounts,
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: RecurringBillFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const fixedExpenseCategories = categories.filter(
    (c) => c.group === "despesa_fixa",
  );

  const form = useForm<RecurringBillFormInput>({
    resolver: zodResolver(recurringBillSchema),
    defaultValues: {
      name: "",
      amount: 0,
      categoryId: "",
      person: "ramon",
      accountId: "",
      paymentMethod: "",
      dayOfMonth: 5,
      startDate: getTodayISODate(),
      endDate: "",
      active: true,
      ...defaultValues,
    },
  });

  async function handleSubmit(values: RecurringBillFormInput) {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch {
      toast.error("Não foi possível salvar a conta fixa");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" placeholder="Aluguel" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="mt-1 text-xs text-expense">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Valor</Label>
          <Input
            id="amount"
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
          <Label htmlFor="dayOfMonth">Todo dia</Label>
          <Input
            id="dayOfMonth"
            type="number"
            min="1"
            max="31"
            {...form.register("dayOfMonth", { valueAsNumber: true })}
          />
          {form.formState.errors.dayOfMonth && (
            <p className="mt-1 text-xs text-expense">
              {form.formState.errors.dayOfMonth.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="categoryId">Categoria</Label>
        <Select id="categoryId" {...form.register("categoryId")}>
          <option value="">Selecione</option>
          {fixedExpenseCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        {form.formState.errors.categoryId && (
          <p className="mt-1 text-xs text-expense">
            {form.formState.errors.categoryId.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="person">Pessoa</Label>
          <Select id="person" {...form.register("person")}>
            {Object.entries(PERSON_OR_BOTH_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="accountId">Conta</Label>
          <Select id="accountId" {...form.register("accountId")}>
            <option value="">Selecione</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="paymentMethod">Forma de pagamento</Label>
        <Select id="paymentMethod" {...form.register("paymentMethod")}>
          <option value="">Nenhuma</option>
          {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Início</Label>
          <Input id="startDate" type="date" {...form.register("startDate")} />
          {form.formState.errors.startDate && (
            <p className="mt-1 text-xs text-expense">
              {form.formState.errors.startDate.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="endDate">Término (opcional)</Label>
          <Input id="endDate" type="date" {...form.register("endDate")} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4" {...form.register("active")} />
        Ativa (gera movimentações automaticamente)
      </label>

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
