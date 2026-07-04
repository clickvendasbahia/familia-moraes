import { z } from "zod";

export const transactionSchema = z
  .object({
    type: z.enum(["receita", "despesa", "transferencia", "investimento"]),
    person: z.enum(["ramon", "priscila", "ambos"]),
    amount: z
      .number({ error: "Informe um valor" })
      .positive("Informe um valor maior que zero"),
    description: z.string().min(1, "Informe uma descrição"),
    categoryId: z.string().optional().or(z.literal("")),
    subcategoryId: z.string().optional().or(z.literal("")),
    paymentMethod: z
      .enum(["dinheiro", "pix", "debito", "credito", "boleto", "transferencia"])
      .optional()
      .or(z.literal("")),
    accountId: z.string().optional().or(z.literal("")),
    transferAccountId: z.string().optional().or(z.literal("")),
    investmentId: z.string().optional().or(z.literal("")),
    date: z.string().min(1, "Informe a data"),
    notes: z.string().optional(),
    attachmentUrl: z.string().optional(),
  })
  .refine((data) => data.type !== "transferencia" || !!data.transferAccountId, {
    message: "Selecione a conta de destino",
    path: ["transferAccountId"],
  })
  .refine((data) => data.type === "transferencia" || !!data.accountId, {
    message: "Selecione a conta",
    path: ["accountId"],
  })
  .refine((data) => data.type === "transferencia" || !!data.categoryId, {
    message: "Selecione a categoria",
    path: ["categoryId"],
  });

export type TransactionFormInput = z.infer<typeof transactionSchema>;

/**
 * Schema mais permissivo usado na importação de CSV: dados importados podem
 * vir sem categoria/conta (a planilha exportada não inclui todas as
 * colunas do formulário completo).
 */
export const importTransactionSchema = z.object({
  type: z.enum(["receita", "despesa", "transferencia", "investimento"]),
  person: z.enum(["ramon", "priscila", "ambos"]),
  amount: z.number().positive("Informe um valor maior que zero"),
  description: z.string().min(1, "Informe uma descrição"),
  date: z.string().min(1, "Informe a data"),
  categoryId: z.string().optional().or(z.literal("")),
  accountId: z.string().optional().or(z.literal("")),
});
export type ImportTransactionInput = z.infer<typeof importTransactionSchema>;
