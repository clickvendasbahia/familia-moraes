import { z } from "zod";

export const goalSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  targetAmount: z
    .number({ error: "Informe um valor" })
    .positive("Informe um valor maior que zero"),
  targetDate: z.string().optional().or(z.literal("")),
  status: z.enum(["em_andamento", "concluida", "pausada"]),
});
export type GoalFormInput = z.infer<typeof goalSchema>;

export const goalContributionSchema = z.object({
  amount: z
    .number({ error: "Informe um valor" })
    .positive("Informe um valor maior que zero"),
  date: z.string().min(1, "Informe a data"),
  notes: z.string().optional().or(z.literal("")),
});
export type GoalContributionFormInput = z.infer<typeof goalContributionSchema>;
