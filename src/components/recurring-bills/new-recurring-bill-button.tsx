"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RecurringBillForm } from "./recurring-bill-form";
import { createRecurringBillAction } from "@/services/recurring-bills-service";
import type { RecurringBillFormInput } from "@/lib/validations/recurring-bill";
import type { CategoryWithSubcategories } from "@/repositories/categories-repository";

type AccountOption = { id: string; name: string };

export function NewRecurringBillButton({
  categories,
  accounts,
}: {
  categories: CategoryWithSubcategories[];
  accounts: AccountOption[];
}) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(values: RecurringBillFormInput) {
    await createRecurringBillAction(values);
    toast.success("Conta fixa cadastrada");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Conta Fixa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Conta Fixa</DialogTitle>
          <DialogDescription>
            Cadastre uma despesa recorrente. Ela é gerada automaticamente
            todo mês no dia escolhido.
          </DialogDescription>
        </DialogHeader>
        <RecurringBillForm
          categories={categories}
          accounts={accounts}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
