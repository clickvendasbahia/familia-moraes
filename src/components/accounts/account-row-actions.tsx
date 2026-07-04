"use client";

import { useState } from "react";
import { Archive, ArchiveRestore, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountForm } from "./account-form";
import {
  toggleAccountArchivedAction,
  updateAccountAction,
} from "@/services/accounts-actions";
import type { AccountFormInput } from "@/lib/validations/account";
import type { Database } from "@/types/database";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

export function AccountRowActions({ account }: { account: Account }) {
  const [editOpen, setEditOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleUpdate(values: AccountFormInput) {
    await updateAccountAction(account.id, values);
    toast.success("Conta atualizada");
    setEditOpen(false);
  }

  async function handleToggleArchived() {
    setBusy(true);
    try {
      await toggleAccountArchivedAction(account.id, !account.archived);
      toast.success(account.archived ? "Conta reativada" : "Conta arquivada");
    } catch {
      toast.error("Não foi possível atualizar a conta");
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
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar conta</DialogTitle>
          </DialogHeader>
          <AccountForm
            defaultValues={{
              name: account.name,
              type: account.type,
              initialBalance: account.initial_balance,
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
        title={account.archived ? "Reativar" : "Arquivar"}
        onClick={handleToggleArchived}
        disabled={busy}
      >
        {account.archived ? (
          <ArchiveRestore className="h-4 w-4" />
        ) : (
          <Archive className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
