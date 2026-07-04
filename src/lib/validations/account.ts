import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  type: z.enum(["corrente", "poupanca", "carteira", "investimento", "outro"]),
  initialBalance: z.number({ error: "Informe um valor" }),
});

export type AccountFormInput = z.infer<typeof accountSchema>;
