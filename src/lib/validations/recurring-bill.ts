import { z } from "zod";

export const recurringBillSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  amount: z
    .number({ error: "Informe um valor" })
    .positive("Informe um valor maior que zero"),
  categoryId: z.string().min(1, "Selecione a categoria"),
  person: z.enum(["ramon", "priscila", "ambos"]),
  accountId: z.string().optional().or(z.literal("")),
  paymentMethod: z
    .enum(["dinheiro", "pix", "debito", "credito", "boleto", "transferencia"])
    .optional()
    .or(z.literal("")),
  dayOfMonth: z
    .number({ error: "Informe o dia do vencimento" })
    .int()
    .min(1, "Entre 1 e 31")
    .max(31, "Entre 1 e 31"),
  startDate: z.string().min(1, "Informe a data de início"),
  endDate: z.string().optional().or(z.literal("")),
  active: z.boolean(),
});

export type RecurringBillFormInput = z.infer<typeof recurringBillSchema>;
