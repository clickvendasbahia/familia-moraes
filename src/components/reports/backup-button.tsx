"use client";

import { useState } from "react";
import { DatabaseBackup } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { generateBackupAction } from "@/services/backup-actions";
import { getTodayISODate } from "@/lib/utils";

export function BackupButton() {
  const [loading, setLoading] = useState(false);

  async function handleBackup() {
    setLoading(true);
    try {
      const data = await generateBackupAction();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `backup-familia-moraes-${getTodayISODate()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Backup gerado");
    } catch {
      toast.error("Não foi possível gerar o backup");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      className="gap-1.5"
      onClick={handleBackup}
      disabled={loading}
    >
      <DatabaseBackup className="h-3.5 w-3.5" />
      {loading ? "Gerando..." : "Backup completo"}
    </Button>
  );
}
