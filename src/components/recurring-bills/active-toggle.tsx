"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toggleRecurringBillActiveAction } from "@/services/recurring-bills-service";

export function ActiveToggle({ id, active }: { id: string; active: boolean }) {
  const [checked, setChecked] = useState(active);
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    const next = !checked;
    setChecked(next);
    setBusy(true);
    try {
      await toggleRecurringBillActiveAction(id, next);
      toast.success(next ? "Conta fixa ativada" : "Conta fixa pausada");
    } catch {
      setChecked(!next);
      toast.error("Não foi possível atualizar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={busy}
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50",
        checked ? "bg-income" : "bg-surface-muted",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}
