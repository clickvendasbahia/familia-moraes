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
import { InvestmentForm } from "./investment-form";
import { createInvestmentAction } from "@/services/investments-actions";
import type { InvestmentFormInput } from "@/lib/validations/investment";
import type { CategoryWithSubcategories } from "@/repositories/categories-repository";

export function NewInvestmentButton({
  categories,
}: {
  categories: CategoryWithSubcategories[];
}) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(values: InvestmentFormInput) {
    await createInvestmentAction(values);
    toast.success("Investimento cadastrado");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Investimento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Investimento</DialogTitle>
          <DialogDescription>
            Cadastre um ativo (Tesouro, CDB, Ações...) para acompanhar
            aportes e rentabilidade.
          </DialogDescription>
        </DialogHeader>
        <InvestmentForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
