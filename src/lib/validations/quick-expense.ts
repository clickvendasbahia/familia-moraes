import { z } from "zod";

export const quickExpenseSchema = z.object({
  amount: z
    .number({ error: "Informe um valor" })
    .positive("Informe um valor maior que zero"),
  categoryId: z.string().min(1, "Selecione a categoria"),
  subcategoryId: z.string().optional().or(z.literal("")),
  person: z.enum(["ramon", "priscila", "ambos"]),
});

export type QuickExpenseInput = z.infer<typeof quickExpenseSchema>;
