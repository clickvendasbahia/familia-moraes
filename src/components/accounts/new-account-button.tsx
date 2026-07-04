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
import { AccountForm } from "./account-form";
import { createAccountAction } from "@/services/accounts-actions";
import type { AccountFormInput } from "@/lib/validations/account";

export function NewAccountButton() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(values: AccountFormInput) {
    await createAccountAction(values);
    toast.success("Conta cadastrada");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Nova conta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Nova conta</DialogTitle>
          <DialogDescription>
            Um banco, carteira ou qualquer lugar onde vocês guardam dinheiro.
          </DialogDescription>
        </DialogHeader>
        <AccountForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
