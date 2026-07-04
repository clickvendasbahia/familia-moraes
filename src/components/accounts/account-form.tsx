"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { accountSchema, type AccountFormInput } from "@/lib/validations/account";
import { ACCOUNT_TYPE_LABELS } from "@/types/domain";

type AccountFormProps = {
  defaultValues?: Partial<AccountFormInput>;
  onSubmit: (values: AccountFormInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
};

export function AccountForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: AccountFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<AccountFormInput>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "corrente",
      initialBalance: 0,
      ...defaultValues,
    },
  });

  async function handleSubmit(values: AccountFormInput) {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch {
      toast.error("Não foi possível salvar a conta");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" placeholder="Nubank" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="mt-1 text-xs text-expense">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Select id="type" {...form.register("type")}>
            {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="initialBalance">Saldo inicial</Label>
          <Input
            id="initialBalance"
            type="number"
            step="0.01"
            {...form.register("initialBalance", { valueAsNumber: true })}
          />
          {form.formState.errors.initialBalance && (
            <p className="mt-1 text-xs text-expense">
              {form.formState.errors.initialBalance.message}
            </p>
          )}
        </div>
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
