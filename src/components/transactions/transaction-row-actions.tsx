"use client";

import { useState } from "react";
import { Copy, Pencil, Trash2 } from "lucide-react";
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
import { TransactionForm } from "./transaction-form";
import {
  deleteTransactionAction,
  duplicateTransactionAction,
  updateTransactionAction,
} from "@/services/transactions-service";
import type { TransactionFormInput } from "@/lib/validations/transaction";
import type { TransactionListItem } from "@/repositories/transactions-repository";
import type { CategoryWithSubcategories } from "@/repositories/categories-repository";

type AccountOption = { id: string; name: string };
type InvestmentOption = { id: string; name: string; categoryId: string | null };

export function TransactionRowActions({
  transaction,
  categories,
  accounts,
  investments,
}: {
  transaction: TransactionListItem;
  categories: CategoryWithSubcategories[];
  accounts: AccountOption[];
  investments: InvestmentOption[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleUpdate(values: TransactionFormInput) {
    await updateTransactionAction(transaction.id, values);
    toast.success("Movimentação atualizada");
    setEditOpen(false);
  }

  async function handleDuplicate() {
    setBusy(true);
    try {
      await duplicateTransactionAction(transaction.id);
      toast.success("Movimentação duplicada");
    } catch {
      toast.error("Não foi possível duplicar a movimentação");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await deleteTransactionAction(transaction.id);
      toast.success("Movimentação excluída");
      setConfirmDeleteOpen(false);
    } catch {
      toast.error("Não foi possível excluir a movimentação");
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
            <DialogTitle>Editar Movimentação</DialogTitle>
          </DialogHeader>
          <TransactionForm
            categories={categories}
            accounts={accounts}
            investments={investments}
            defaultValues={{
              type: transaction.type,
              person: transaction.person,
              amount: transaction.amount,
              description: transaction.description,
              categoryId: transaction.category_id ?? "",
              subcategoryId: transaction.subcategory_id ?? "",
              paymentMethod: transaction.payment_method ?? "",
              accountId: transaction.account_id ?? "",
              transferAccountId: transaction.transfer_account_id ?? "",
              investmentId: transaction.investment_id ?? "",
              date: transaction.date,
              notes: transaction.notes ?? "",
              attachmentUrl: transaction.attachment_url ?? "",
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditOpen(false)}
            submitLabel="Salvar alterações"
          />
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        size="icon"
        title="Duplicar"
        onClick={handleDuplicate}
        disabled={busy}
      >
        <Copy className="h-4 w-4" />
      </Button>

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
            <DialogTitle>Excluir movimentação?</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita. &quot;{transaction.description}
              &quot; será removida permanentemente.
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
