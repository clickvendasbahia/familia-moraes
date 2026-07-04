"use server";

import { revalidatePath } from "next/cache";
import {
  createGoal,
  updateGoal,
  deleteGoal,
  addContribution,
  deleteContribution,
} from "@/repositories/goals-repository";
import {
  goalSchema,
  goalContributionSchema,
  type GoalFormInput,
  type GoalContributionFormInput,
} from "@/lib/validations/goal";

function revalidateAfterChange() {
  revalidatePath("/metas");
  revalidatePath("/planejamento-financeiro");
}

export async function createGoalAction(rawInput: GoalFormInput) {
  const input = goalSchema.parse(rawInput);
  await createGoal({
    name: input.name,
    target_amount: input.targetAmount,
    target_date: input.targetDate || null,
    status: input.status,
  });
  revalidateAfterChange();
}

export async function updateGoalAction(id: string, rawInput: GoalFormInput) {
  const input = goalSchema.parse(rawInput);
  await updateGoal(id, {
    name: input.name,
    target_amount: input.targetAmount,
    target_date: input.targetDate || null,
    status: input.status,
  });
  revalidateAfterChange();
}

export async function deleteGoalAction(id: string) {
  await deleteGoal(id);
  revalidateAfterChange();
}

export async function addContributionAction(
  goalId: string,
  rawInput: GoalContributionFormInput,
) {
  const input = goalContributionSchema.parse(rawInput);
  await addContribution({
    goal_id: goalId,
    amount: input.amount,
    date: input.date,
    notes: input.notes || null,
  });
  revalidateAfterChange();
}

export async function deleteContributionAction(id: string) {
  await deleteContribution(id);
  revalidateAfterChange();
}
