import { z } from "zod";

export const monthlyGoalsSchema = z.object({
  savingsGoalAmount: z.number().nonnegative().nullable(),
  investmentGoalAmount: z.number().nonnegative().nullable(),
});
export type MonthlyGoalsInput = z.infer<typeof monthlyGoalsSchema>;

export const categoryLimitSchema = z.object({
  categoryId: z.string().min(1, "Selecione a categoria"),
  limitAmount: z
    .number({ error: "Informe um valor" })
    .positive("Informe um valor maior que zero"),
});
export type CategoryLimitInput = z.infer<typeof categoryLimitSchema>;
