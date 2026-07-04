"use server";

import { revalidatePath } from "next/cache";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
  type TransactionInput,
} from "@/repositories/transactions-repository";
import {
  transactionSchema,
  importTransactionSchema,
  type TransactionFormInput,
  type ImportTransactionInput,
} from "@/lib/validations/transaction";
import { quickExpenseSchema } from "@/lib/validations/quick-expense";
import type { PersonOrBoth } from "@/types/domain";

function toInsertPayload(input: TransactionFormInput): TransactionInput {
  return {
    type: input.type,
    person: input.person,
    amount: input.amount,
    description: input.description,
    category_id: input.categoryId || null,
    subcategory_id: input.subcategoryId || null,
    payment_method:
      (input.paymentMethod || null) as TransactionInput["payment_method"],
    account_id: input.accountId || null,
    transfer_account_id: input.transferAccountId || null,
    investment_id: input.investmentId || null,
    date: input.date,
    notes: input.notes || null,
    attachment_url: input.attachmentUrl || null,
  };
}

function revalidateAfterChange() {
  revalidatePath("/movimentacoes");
  revalidatePath("/investimentos");
  revalidatePath("/");
}

export async function createTransactionAction(rawInput: TransactionFormInput) {
  const input = transactionSchema.parse(rawInput);
  await createTransaction(toInsertPayload(input));
  revalidateAfterChange();
}

export async function updateTransactionAction(
  id: string,
  rawInput: TransactionFormInput,
) {
  const input = transactionSchema.parse(rawInput);
  await updateTransaction(id, toInsertPayload(input));
  revalidateAfterChange();
}

export async function deleteTransactionAction(id: string) {
  await deleteTransaction(id);
  revalidateAfterChange();
}

/**
 * Registro de gasto rápido: só valor, categoria e pessoa (spec explícita:
 * "nada mais"). Sem conta/forma de pagamento — a descrição é derivada do
 * nome da categoria.
 */
export async function createQuickExpenseAction(input: {
  amount: number;
  categoryId: string;
  categoryName: string;
  person: PersonOrBoth;
  date: string;
}) {
  const parsed = quickExpenseSchema.parse({
    amount: input.amount,
    categoryId: input.categoryId,
    person: input.person,
  });
  await createTransaction({
    type: "despesa",
    person: parsed.person,
    amount: parsed.amount,
    description: input.categoryName,
    category_id: parsed.categoryId,
    date: input.date,
  });
  revalidateAfterChange();
}

/**
 * Importação de CSV: aceita todas as linhas de uma vez (uma única chamada
 * de Server Action) e usa o schema mais permissivo, já que a planilha
 * exportada não tem todas as colunas do formulário completo.
 */
export async function importTransactionsAction(
  rows: ImportTransactionInput[],
) {
  let imported = 0;
  for (const row of rows) {
    const input = importTransactionSchema.parse(row);
    await createTransaction({
      type: input.type,
      person: input.person,
      amount: input.amount,
      description: input.description,
      date: input.date,
      category_id: input.categoryId || null,
      account_id: input.accountId || null,
    });
    imported++;
  }
  revalidateAfterChange();
  return imported;
}

export async function duplicateTransactionAction(id: string) {
  const original = await getTransactionById(id);
  await createTransaction({
    type: original.type,
    person: original.person,
    amount: original.amount,
    description: original.description,
    category_id: original.category_id,
    subcategory_id: original.subcategory_id,
    payment_method: original.payment_method,
    account_id: original.account_id,
    transfer_account_id: original.transfer_account_id,
    investment_id: original.investment_id,
    date: original.date,
    notes: original.notes,
    attachment_url: original.attachment_url,
  });
  revalidateAfterChange();
}
