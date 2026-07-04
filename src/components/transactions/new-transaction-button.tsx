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
import { TransactionForm } from "./transaction-form";
import { createTransactionAction } from "@/services/transactions-service";
import type { TransactionFormInput } from "@/lib/validations/transaction";
import type { CategoryWithSubcategories } from "@/repositories/categories-repository";

type AccountOption = { id: string; name: string };
type InvestmentOption = { id: string; name: string; categoryId: string | null };

export function NewTransactionButton({
  categories,
  accounts,
  investments,
}: {
  categories: CategoryWithSubcategories[];
  accounts: AccountOption[];
  investments: InvestmentOption[];
}) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(values: TransactionFormInput) {
    await createTransactionAction(values);
    toast.success("Movimentação registrada");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Movimentação
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Movimentação</DialogTitle>
          <DialogDescription>
            Registre uma receita, despesa, transferência ou investimento.
          </DialogDescription>
        </DialogHeader>
        <TransactionForm
          categories={categories}
          accounts={accounts}
          investments={investments}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
