"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GoalForm } from "./goal-form";
import { createGoalAction } from "@/services/goals-actions";
import type { GoalFormInput } from "@/lib/validations/goal";

export function NewGoalButton() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(values: GoalFormInput) {
    await createGoalAction(values);
    toast.success("Meta criada");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Meta</DialogTitle>
          <DialogDescription>
            Guardar dinheiro, comprar um carro, viajar... defina o objetivo.
          </DialogDescription>
        </DialogHeader>
        <GoalForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
