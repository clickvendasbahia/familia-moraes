"use server";

import { revalidatePath } from "next/cache";
import {
  createRecurringBill,
  updateRecurringBill,
  deleteRecurringBill,
  generateRecurringTransactionsNow,
  type RecurringBillInput,
} from "@/repositories/recurring-bills-repository";
import {
  recurringBillSchema,
  type RecurringBillFormInput,
} from "@/lib/validations/recurring-bill";

function toInsertPayload(input: RecurringBillFormInput): RecurringBillInput {
  return {
    name: input.name,
    amount: input.amount,
    category_id: input.categoryId || null,
    person: input.person,
    account_id: input.accountId || null,
    payment_method:
      (input.paymentMethod || null) as RecurringBillInput["payment_method"],
    day_of_month: input.dayOfMonth,
    start_date: input.startDate,
    end_date: input.endDate || null,
    active: input.active,
  };
}

function revalidateAfterChange() {
  revalidatePath("/contas-fixas");
  revalidatePath("/");
}

export async function createRecurringBillAction(
  rawInput: RecurringBillFormInput,
) {
  const input = recurringBillSchema.parse(rawInput);
  await createRecurringBill(toInsertPayload(input));
  revalidateAfterChange();
}

export async function updateRecurringBillAction(
  id: string,
  rawInput: RecurringBillFormInput,
) {
  const input = recurringBillSchema.parse(rawInput);
  await updateRecurringBill(id, toInsertPayload(input));
  revalidateAfterChange();
}

export async function deleteRecurringBillAction(id: string) {
  await deleteRecurringBill(id);
  revalidateAfterChange();
}

export async function toggleRecurringBillActiveAction(
  id: string,
  active: boolean,
) {
  await updateRecurringBill(id, { active });
  revalidateAfterChange();
}

export async function generateRecurringTransactionsNowAction() {
  await generateRecurringTransactionsNow();
  revalidateAfterChange();
}
