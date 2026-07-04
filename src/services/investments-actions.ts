"use server";

import { revalidatePath } from "next/cache";
import {
  createInvestment,
  updateInvestment,
  deleteInvestment,
  addValuation,
  type InvestmentInput,
} from "@/repositories/investments-repository";
import {
  investmentSchema,
  valuationSchema,
  type InvestmentFormInput,
  type ValuationFormInput,
} from "@/lib/validations/investment";

function revalidateAfterChange() {
  revalidatePath("/investimentos");
  revalidatePath("/");
}

function toInsertPayload(input: InvestmentFormInput): InvestmentInput {
  return {
    name: input.name,
    category_id: input.categoryId,
    person: input.person,
    broker: input.broker || null,
  };
}

export async function createInvestmentAction(rawInput: InvestmentFormInput) {
  const input = investmentSchema.parse(rawInput);
  await createInvestment(toInsertPayload(input));
  revalidateAfterChange();
}

export async function updateInvestmentAction(
  id: string,
  rawInput: InvestmentFormInput,
) {
  const input = investmentSchema.parse(rawInput);
  await updateInvestment(id, toInsertPayload(input));
  revalidateAfterChange();
}

export async function deleteInvestmentAction(id: string) {
  await deleteInvestment(id);
  revalidateAfterChange();
}

export async function addValuationAction(
  investmentId: string,
  rawInput: ValuationFormInput,
) {
  const input = valuationSchema.parse(rawInput);
  await addValuation({
    investment_id: investmentId,
    date: input.date,
    current_value: input.currentValue,
    notes: input.notes || null,
  });
  revalidateAfterChange();
}
