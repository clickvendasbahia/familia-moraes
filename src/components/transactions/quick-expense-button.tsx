"use client";

import { useState } from "react";
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
    defaultValues: { amount: 0, categoryId: "", person: "ramon" },
  });

  async function onSubmit(values: QuickExpenseInput) {
    const category = expenseCategories.find((c) => c.id === values.categoryId);
    setSubmitting(true);
    try {
      await createQuickExpenseAction({
        amount: values.amount,
        categoryId: values.categoryId,
        categoryName: category?.name ?? "Gasto rápido",
        person: values.person,
        date: getTodayISODate(),
      });
      toast.success("Gasto registrado");
      form.reset({ amount: 0, categoryId: "", person: values.person });
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
