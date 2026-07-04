"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
import { RecurringBillForm } from "./recurring-bill-form";
import {
  deleteRecurringBillAction,
  updateRecurringBillAction,
} from "@/services/recurring-bills-service";
import type { RecurringBillFormInput } from "@/lib/validations/recurring-bill";
import type { RecurringBillWithCategory } from "@/repositories/recurring-bills-repository";
import type { CategoryWithSubcategories } from "@/repositories/categories-repository";

type AccountOption = { id: string; name: string };

export function RecurringBillRowActions({
  bill,
  categories,
  accounts,
}: {
  bill: RecurringBillWithCategory;
  categories: CategoryWithSubcategories[];
  accounts: AccountOption[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleUpdate(values: RecurringBillFormInput) {
    await updateRecurringBillAction(bill.id, values);
    toast.success("Conta fixa atualizada");
    setEditOpen(false);
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await deleteRecurringBillAction(bill.id);
      toast.success("Conta fixa excluída");
      setConfirmDeleteOpen(false);
    } catch {
      toast.error("Não foi possível excluir");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
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
            <DialogTitle>Editar Conta Fixa</DialogTitle>
          </DialogHeader>
          <RecurringBillForm
            categories={categories}
            accounts={accounts}
            defaultValues={{
              name: bill.name,
              amount: bill.amount,
              categoryId: bill.category_id ?? "",
              person: bill.person,
              accountId: bill.account_id ?? "",
              paymentMethod: bill.payment_method ?? "",
              dayOfMonth: bill.day_of_month,
              startDate: bill.start_date,
              endDate: bill.end_date ?? "",
              active: bill.active,
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
            <DialogTitle>Excluir conta fixa?</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita. &quot;{bill.name}&quot; não
              será mais gerada automaticamente. Movimentações já criadas não
              são removidas.
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
