import { z } from "zod";

export const investmentSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  categoryId: z.string().min(1, "Selecione a categoria"),
  person: z.enum(["ramon", "priscila", "ambos"]),
  broker: z.string().optional().or(z.literal("")),
});
export type InvestmentFormInput = z.infer<typeof investmentSchema>;

export const valuationSchema = z.object({
  date: z.string().min(1, "Informe a data"),
  currentValue: z
    .number({ error: "Informe um valor" })
    .nonnegative("Informe um valor válido"),
  notes: z.string().optional().or(z.literal("")),
});
export type ValuationFormInput = z.infer<typeof valuationSchema>;
