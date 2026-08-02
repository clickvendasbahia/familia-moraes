"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTodayISODate } from "@/lib/utils";
import {
  quickExpenseSchema,
  type QuickExpenseInput,
} from "@/lib/validations/quick-expense";
import { createQuickExpenseAction } from "@/services/transactions-service";
import { PERSON_OR_BOTH_LABELS } from "@/types/domain";
import type { CategoryWithSubcategories } from "@/repositories/categories-repository";

const EXPENSE_GROUPS = new Set(["despesa_fixa", "despesa_variavel"]);

export function QuickExpenseButton({
  categories,
}: {
  categories: CategoryWithSubcategories[];
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const expenseCategories = categories.filter((c) =>
    EXPENSE_GROUPS.has(c.group),
  );

  const form = useForm<QuickExpenseInput>({
    resolver: zodResolver(quickExpenseSchema),
    defaultValues: { amount: 0, categoryId: "", subcategoryId: "", person: "ramon" },
  });

  const categoryId = form.watch("categoryId");
  const subcategoryId = form.watch("subcategoryId");
  const selectedCategory = expenseCategories.find((c) => c.id === categoryId);

  useEffect(() => {
    form.setValue("subcategoryId", "");
    // Só precisa reagir à troca de categoria.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  useEffect(() => {
    if (subcategoryId) form.clearErrors("subcategoryId");
    // Só precisa reagir à escolha de uma subcategoria válida.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subcategoryId]);

  async function onSubmit(values: QuickExpenseInput) {
    if (selectedCategory?.subcategory_required && !values.subcategoryId) {
      form.setError("subcategoryId", { message: "Selecione a subcategoria" });
      return;
    }

    setSubmitting(true);
    try {
      await createQuickExpenseAction({
        amount: values.amount,
        categoryId: values.categoryId,
        categoryName: selectedCategory?.name ?? "Gasto rápido",
        subcategoryId: values.subcategoryId || undefined,
        person: values.person,
        date: getTodayISODate(),
      });
      toast.success("Gasto registrado");
      form.reset({ amount: 0, categoryId: "", subcategoryId: "", person: values.person });
      setOpen(false);
    } catch {
      toast.error("Não foi possível registrar o gasto");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        size="icon"
        title="Gasto rápido"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-30 h-14 w-14 rounded-full shadow-lg md:bottom-6 md:right-6 print:hidden"
      >
        <Zap className="h-6 w-6" />
      </Button>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Gasto rápido</DialogTitle>
          <DialogDescription>
            Registre em segundos, direto do celular.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="quick-amount">Valor</Label>
            <Input
              id="quick-amount"
              type="number"
              step="0.01"
              min="0"
              autoFocus
              className="h-14 text-2xl font-semibold"
              {...form.register("amount", { valueAsNumber: true })}
            />
            {form.formState.errors.amount && (
              <p className="mt-1 text-xs text-expense">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="quick-category">Categoria</Label>
            <Select id="quick-category" {...form.register("categoryId")}>
              <option value="">Selecione</option>
              {expenseCategories.map((c) => (
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
          {!!selectedCategory?.subcategories.length && (
            <div>
              <Label htmlFor="quick-subcategory">
                Subcategoria
                {selectedCategory?.subcategory_required && " *"}
              </Label>
              <Select id="quick-subcategory" {...form.register("subcategoryId")}>
                <option value="">
                  {selectedCategory?.subcategory_required ? "Selecione" : "Nenhuma"}
                </option>
                {selectedCategory?.subcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
              {form.formState.errors.subcategoryId && (
                <p className="mt-1 text-xs text-expense">
                  {form.formState.errors.subcategoryId.message}
                </p>
              )}
            </div>
          )}
          <div>
            <Label htmlFor="quick-person">Pessoa</Label>
            <Select id="quick-person" {...form.register("person")}>
              {Object.entries(PERSON_OR_BOTH_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={submitting}
          >
            {submitting ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
