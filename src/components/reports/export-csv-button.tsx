"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { ReportTransactionRow } from "@/services/reports-service";

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function ExportCsvButton({
  rows,
  filename,
}: {
  rows: ReportTransactionRow[];
  filename: string;
}) {
  function handleExport() {
    const header = ["Data", "Descrição", "Categoria", "Pessoa", "Tipo", "Valor"];
    const lines = [header.join(",")];
    for (const row of rows) {
      lines.push(
        [
          formatDate(row.date),
          escapeCsvField(row.description),
          escapeCsvField(row.category),
          row.person,
          row.type,
          escapeCsvField(row.amount.toFixed(2).replace(".", ",")),
        ].join(","),
      );
    }
    const csv = "﻿" + lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="secondary" size="sm" className="gap-1.5" onClick={handleExport}>
      <Download className="h-3.5 w-3.5" />
      Exportar CSV
    </Button>
  );
}
