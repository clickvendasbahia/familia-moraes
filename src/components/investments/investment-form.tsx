"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  investmentSchema,
  type InvestmentFormInput,
} from "@/lib/validations/investment";
import { PERSON_OR_BOTH_LABELS } from "@/types/domain";
import type { CategoryWithSubcategories } from "@/repositories/categories-repository";

type InvestmentFormProps = {
  categories: CategoryWithSubcategories[];
  defaultValues?: Partial<InvestmentFormInput>;
  onSubmit: (values: InvestmentFormInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
};

export function InvestmentForm({
  categories,
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: InvestmentFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const investmentCategories = categories.filter(
    (c) => c.group === "investimento",
  );

  const form = useForm<InvestmentFormInput>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      person: "ramon",
      broker: "",
      ...defaultValues,
    },
  });

  async function handleSubmit(values: InvestmentFormInput) {
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch {
      toast.error("Não foi possível salvar o investimento");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Tesouro Selic 2029"
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="mt-1 text-xs text-expense">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="categoryId">Categoria</Label>
        <Select id="categoryId" {...form.register("categoryId")}>
          <option value="">Selecione</option>
          {investmentCategories.map((c) => (
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
          <Label htmlFor="broker">Corretora (opcional)</Label>
          <Input id="broker" placeholder="XP, Nubank..." {...form.register("broker")} />
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
