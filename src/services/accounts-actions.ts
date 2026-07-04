"use server";

import { revalidatePath } from "next/cache";
import {
  createAccount,
  updateAccount,
  setAccountArchived,
} from "@/repositories/accounts-repository";
import { accountSchema, type AccountFormInput } from "@/lib/validations/account";

function revalidateAfterChange() {
  revalidatePath("/caixa");
  revalidatePath("/movimentacoes");
  revalidatePath("/contas-fixas");
  revalidatePath("/");
}

export async function createAccountAction(rawInput: AccountFormInput) {
  const input = accountSchema.parse(rawInput);
  await createAccount({
    name: input.name,
    type: input.type,
    initial_balance: input.initialBalance,
  });
  revalidateAfterChange();
}

export async function updateAccountAction(
  id: string,
  rawInput: AccountFormInput,
) {
  const input = accountSchema.parse(rawInput);
  await updateAccount(id, {
    name: input.name,
    type: input.type,
    initial_balance: input.initialBalance,
  });
  revalidateAfterChange();
}

export async function toggleAccountArchivedAction(
  id: string,
  archived: boolean,
) {
  await setAccountArchived(id, archived);
  revalidateAfterChange();
}
