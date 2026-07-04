"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { removeCategoryLimitAction } from "@/services/budget-actions";

export function RemoveCategoryLimitButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      await removeCategoryLimitAction(id);
      toast.success("Limite removido");
    } catch {
      toast.error("Não foi possível remover o limite");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      title="Remover limite"
      className="text-muted-foreground transition-colors hover:text-expense disabled:opacity-50"
    >
      <X className="h-4 w-4" />
    </button>
  );
}
