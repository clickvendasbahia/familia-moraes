"use client";

import { useState } from "react";
import { LineChart, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InvestmentForm } from "./investment-form";
import { ValuationForm } from "./valuation-form";
import {
  addValuationAction,
  deleteInvestmentAction,
  updateInvestmentAction,
} from "@/services/investments-actions";
import type { InvestmentFormInput, ValuationFormInput } from "@/lib/validations/investment";
import type { InvestmentRow } from "@/services/investments-service";
import type { CategoryWithSubcategories } from "@/repositories/categories-repository";

export function InvestmentRowActions({
  investment,
  categoryId,
  broker,
  categories,
}: {
  investment: InvestmentRow;
  categoryId: string;
  broker: string | null;
  categories: CategoryWithSubcategories[];
}) {
  const [valuationOpen, setValuationOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleAddValuation(values: ValuationFormInput) {
    await addValuationAction(investment.id, values);
    toast.success("Valor atualizado");
    setValuationOpen(false);
  }

  async function handleUpdate(values: InvestmentFormInput) {
    await updateInvestmentAction(investment.id, values);
    toast.success("Investimento atualizado");
    setEditOpen(false);
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await deleteInvestmentAction(investment.id);
      toast.success("Investimento excluído");
      setConfirmDeleteOpen(false);
    } catch {
      toast.error("Não foi possível excluir");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Dialog open={valuationOpen} onOpenChange={setValuationOpen}>
        <Button
          variant="ghost"
          size="icon"
          title="Registrar valor atual"
          onClick={() => setValuationOpen(true)}
        >
          <LineChart className="h-4 w-4" />
        </Button>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Registrar valor atual</DialogTitle>
            <DialogDescription>
              Atualize manualmente quanto {investment.name} vale hoje.
            </DialogDescription>
          </DialogHeader>
          <ValuationForm
            onSubmit={handleAddValuation}
            onCancel={() => setValuationOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <Button
          variant="ghost"
          size="icon"
          title="Editar"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Investimento</DialogTitle>
          </DialogHeader>
          <InvestmentForm
            categories={categories}
            defaultValues={{
              name: investment.name,
              categoryId,
              person: investment.person as InvestmentFormInput["person"],
              broker: broker ?? "",
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditOpen(false)}
            submitLabel="Salvar alterações"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <Button
          variant="ghost"
          size="icon"
          title="Excluir"
          onClick={() => setConfirmDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4 text-expense" />
        </Button>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir investimento?</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita. &quot;{investment.name}&quot;
              será removido. Aportes já registrados continuam no histórico de
              movimentações.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={busy}>
              {busy ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
