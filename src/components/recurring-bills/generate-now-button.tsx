"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { generateRecurringTransactionsNowAction } from "@/services/recurring-bills-service";

export function GenerateNowButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await generateRecurringTransactionsNowAction();
      toast.success(
        "Verificação concluída — contas do dia foram geradas (se ainda não existiam este mês).",
      );
    } catch {
      toast.error("Não foi possível gerar as movimentações agora");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="secondary" onClick={handleClick} disabled={loading}>
      <RefreshCw className="h-4 w-4" />
      {loading ? "Gerando..." : "Gerar agora"}
    </Button>
  );
}
