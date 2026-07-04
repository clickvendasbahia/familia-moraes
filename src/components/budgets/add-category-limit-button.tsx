"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addCategoryLimitAction } from "@/services/budget-actions";
import type { CategoryWithSubcategories } from "@/repositories/categories-repository";

export function AddCategoryLimitButton({
  categories,
  existingCategoryIds,
}: {
  categories: CategoryWithSubcategories[];
  existingCategoryIds: string[];
}) {
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const availableCategories = categories.filter(
    (c) => !existingCategoryIds.includes(c.id),
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!categoryId || !amount) return;
    setSubmitting(true);
    try {
      await addCategoryLimitAction({
        categoryId,
        limitAmount: Number(amount),
      });
      toast.success("Limite adicionado");
      setCategoryId("");
      setAmount("");
      setOpen(false);
    } catch {
      toast.error("Não foi possível adicionar o limite");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Adicionar limite
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Novo limite de categoria</DialogTitle>
          <DialogDescription>
            Defina um teto de gasto mensal para uma categoria.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="limit-category">Categoria</Label>
            <Select
              id="limit-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Selecione</option>
              {availableCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="limit-amount">Limite mensal</Label>
            <Input
              id="limit-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting || !categoryId || !amount}>
              {submitting ? "Salvando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
