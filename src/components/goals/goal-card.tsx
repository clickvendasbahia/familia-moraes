"use client";

import { useState } from "react";
import { Pencil, PiggyBank, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoalForm } from "./goal-form";
import { ContributionForm } from "./contribution-form";
import {
  addContributionAction,
  deleteGoalAction,
  updateGoalAction,
} from "@/services/goals-actions";
import { getIcon } from "@/lib/icons";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { GOAL_STATUS_LABELS, type GoalStatus } from "@/types/domain";
import type { GoalFormInput, GoalContributionFormInput } from "@/lib/validations/goal";
import type { GoalWithProgress } from "@/services/goals-service";

export function GoalCard({ goal }: { goal: GoalWithProgress }) {
  const [contributeOpen, setContributeOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const Icon = getIcon(goal.icon);
  const isComplete = goal.progressPct >= 100;

  async function handleContribute(values: GoalContributionFormInput) {
    await addContributionAction(goal.id, values);
    toast.success("Aporte registrado");
    setContributeOpen(false);
  }

  async function handleUpdate(values: GoalFormInput) {
    await updateGoalAction(goal.id, values);
    toast.success("Meta atualizada");
    setEditOpen(false);
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await deleteGoalAction(goal.id);
      toast.success("Meta excluída");
      setConfirmDeleteOpen(false);
    } catch {
      toast.error("Não foi possível excluir a meta");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {/* getIcon seleciona um componente já existente do lucide-react (não cria um novo a cada render) */}
            {/* eslint-disable-next-line react-hooks/static-components */}
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="font-medium">{goal.name}</p>
            <p className="text-xs text-muted-foreground">
              {GOAL_STATUS_LABELS[goal.status as GoalStatus]}
              {goal.targetDate && ` · até ${formatDate(goal.targetDate)}`}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isComplete ? "bg-income" : "bg-primary",
          )}
          style={{ width: `${Math.min(100, goal.progressPct)}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)} (
        {Math.round(goal.progressPct)}%)
      </p>
      {!isComplete && (
        <p className="mt-0.5 text-xs text-muted-foreground">
          {goal.estimatedMonthsRemaining == null
            ? "Sem ritmo de aportes definido ainda"
            : goal.estimatedMonthsRemaining === 0
              ? "Meta atingida!"
              : `No ritmo atual, faltam ~${goal.estimatedMonthsRemaining} ${goal.estimatedMonthsRemaining === 1 ? "mês" : "meses"}`}
        </p>
      )}

      <div className="mt-3 flex items-center justify-end gap-1">
        <Dialog open={contributeOpen} onOpenChange={setContributeOpen}>
          <Button
            variant="secondary"
            size="sm"
            className="mr-auto gap-1.5"
            onClick={() => setContributeOpen(true)}
          >
            <PiggyBank className="h-3.5 w-3.5" />
            Aportar
          </Button>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Novo aporte — {goal.name}</DialogTitle>
              <DialogDescription>
                Registre quanto vocês guardaram para essa meta.
              </DialogDescription>
            </DialogHeader>
            <ContributionForm
              onSubmit={handleContribute}
              onCancel={() => setContributeOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <Button
            variant="ghost"
            size="icon"
            title="Editar"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Meta</DialogTitle>
            </DialogHeader>
            <GoalForm
              defaultValues={{
                name: goal.name,
                targetAmount: goal.targetAmount,
                targetDate: goal.targetDate ?? "",
                status: goal.status as GoalStatus,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditOpen(false)}
              submitLabel="Salvar alterações"
            />
          </DialogContent>
        </Dialog>

        <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <Button
            variant="ghost"
            size="icon"
            title="Excluir"
            onClick={() => setConfirmDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4 text-expense" />
          </Button>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Excluir meta?</DialogTitle>
              <DialogDescription>
                Essa ação não pode ser desfeita. &quot;{goal.name}&quot; e seu
                histórico de aportes serão removidos.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setConfirmDeleteOpen(false)}
              >
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={busy}>
                {busy ? "Excluindo..." : "Excluir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
