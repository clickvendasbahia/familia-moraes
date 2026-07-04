"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { importTransactionsAction } from "@/services/transactions-service";
import type { ImportTransactionInput } from "@/lib/validations/transaction";
import type { CategoryWithSubcategories } from "@/repositories/categories-repository";

type AccountOption = { id: string; name: string };

const PERSON_LABEL_TO_VALUE: Record<string, "ramon" | "priscila" | "ambos"> = {
  Ramon: "ramon",
  Priscila: "priscila",
  Ambos: "ambos",
};

const TRANSACTION_TYPES = new Set([
  "receita",
  "despesa",
  "transferencia",
  "investimento",
]);

/** Parser simples de CSV (vírgula + aspas), compatível com o próprio export do sistema. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (field !== "" || row.length > 0) {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      }
      if (char === "\r" && text[i + 1] === "\n") i++;
    } else {
      field += char;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1);
}

function parseBrDate(value: string): string {
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
}

function parseBrNumber(value: string): number {
  return Number(value.replace(/\./g, "").replace(",", "."));
}

export function ImportCsvButton({
  categories,
  accounts,
}: {
  categories: CategoryWithSubcategories[];
  accounts: AccountOption[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const withoutBom = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
      const rows = parseCsv(withoutBom);
      const [header, ...dataRows] = rows;
      if (!header || header[0] !== "Data") {
        toast.error(
          "Formato não reconhecido. Use um CSV exportado pela tela de Relatórios.",
        );
        return;
      }

      const defaultAccountId = accounts[0]?.id ?? "";
      const parsedRows: ImportTransactionInput[] = [];
      for (const row of dataRows) {
        const [dateStr, description, categoryName, personLabel, type, amountStr] =
          row;
        if (!dateStr || !TRANSACTION_TYPES.has(type)) continue;
        const category = categories.find((c) => c.name === categoryName);
        parsedRows.push({
          type: type as ImportTransactionInput["type"],
          person: PERSON_LABEL_TO_VALUE[personLabel] ?? "ramon",
          amount: parseBrNumber(amountStr),
          description,
          date: parseBrDate(dateStr),
          categoryId: category?.id ?? "",
          accountId: defaultAccountId,
        });
      }

      if (parsedRows.length === 0) {
        toast.error("Nenhuma linha válida encontrada no arquivo.");
        return;
      }

      const imported = await importTransactionsAction(parsedRows);
      toast.success(`${imported} movimentações importadas`);
    } catch {
      toast.error("Não foi possível importar o arquivo");
    } finally {
      setImporting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFile}
      />
      <Button
        variant="secondary"
        size="sm"
        className="gap-1.5"
        disabled={importing}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-3.5 w-3.5" />
        {importing ? "Importando..." : "Importar CSV"}
      </Button>
    </>
  );
}
