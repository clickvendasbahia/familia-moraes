"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn, getTodayISODate } from "@/lib/utils";
import { uploadAttachment } from "@/lib/upload-attachment";
import {
  transactionSchema,
  type TransactionFormInput,
} from "@/lib/validations/transaction";
import {
  PAYMENT_METHOD_LABELS,
  PERSON_OR_BOTH_LABELS,
  TRANSACTION_TYPE_LABELS,
  type TransactionType,
} from "@/types/domain";
import type { CategoryWithSubcategories } from "@/repositories/categories-repository";

type AccountOption = { id: string; name: string };
type InvestmentOption = { id: string; name: string; categoryId: string | null };

type TransactionFormProps = {
  categories: CategoryWithSubcategories[];
  accounts: AccountOption[];
  investments: InvestmentOption[];
  defaultValues?: Partial<TransactionFormInput>;
  onSubmit: (values: TransactionFormInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
};

const EXPENSE_GROUPS = new Set(["despesa_fixa", "despesa_variavel"]);

const TRANSACTION_TYPES = Object.keys(
  TRANSACTION_TYPE_LABELS,
) as TransactionType[];

export function TransactionForm({
  categories,
  accounts,
  investments,
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: TransactionFormProps) {
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<TransactionFormInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "despesa",
      person: "ramon",
      amount: 0,
      description: "",
      categoryId: "",
      subcategoryId: "",
      paymentMethod: "",
      accountId: "",
      transferAccountId: "",
      investmentId: "",
      date: getTodayISODate(),
      notes: "",
      ...defaultValues,
    },
  });

  const type = form.watch("type");
  const categoryId = form.watch("categoryId");
  const investmentIdRegister = form.register("investmentId");

  const filteredCategories = categories.filter((c) => {
    if (type === "receita") return c.group === "receita";
    if (type === "despesa") return EXPENSE_GROUPS.has(c.group);
    if (type === "investimento") return c.group === "investimento";
    return false;
  });

  const selectedCategory = categories.find((c) => c.id === categoryId);

  useEffect(() => {
    if (categoryId && !filteredCategories.some((c) => c.id === categoryId)) {
      form.setValue("categoryId", "");
      form.setValue("subcategoryId", "");
    }
    // Só precisa reagir à troca de tipo, não a toda mudança de categoryId/filteredCategories.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  async function handleSubmit(values: TransactionFormInput) {
    setSubmitting(true);
    try {
      let attachmentUrl = values.attachmentUrl;
      if (attachmentFile) {
        attachmentUrl = await uploadAttachment(attachmentFile);
      }
      await onSubmit({ ...values, attachmentUrl });
    } catch {
      toast.error("Não foi possível salvar a movimentação");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div>
        <Label>Tipo</Label>
        <div className="grid grid-cols-4 gap-2">
          {TRANSACTION_TYPES.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => form.setValue("type", key)}
              className={cn(
                "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                type === key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-surface-muted",
              )}
            >
              {TRANSACTION_TYPE_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="person">Pessoa</Label>
          <Select id="person" {...form.register("person")}>
            {Object.entries(PERSON_OR_BOTH_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="amount">Valor</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            {...form.register("amount", { valueAsNumber: true })}
          />
          {form.formState.errors.amount && (
            <p className="mt-1 text-xs text-expense">
              {form.formState.errors.amount.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" {...form.register("description")} />
        {form.formState.errors.description && (
          <p className="mt-1 text-xs text-expense">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      {type === "investimento" ? (
        <div>
          <Label htmlFor="investmentId">Ativo</Label>
          <Select
            id="investmentId"
            {...investmentIdRegister}
            onChange={(e) => {
              investmentIdRegister.onChange(e);
              const investment = investments.find((i) => i.id === e.target.value);
              form.setValue("categoryId", investment?.categoryId ?? "");
            }}
          >
            <option value="">Selecione</option>
            {investments.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </Select>
          {investments.length === 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              Cadastre um ativo na tela de Investimentos para vincular este
              aporte a ele.
            </p>
          )}
        </div>
      ) : (
        type !== "transferencia" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoryId">Categoria</Label>
              <Select id="categoryId" {...form.register("categoryId")}>
                <option value="">Selecione</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              {form.formState.errors.categoryId && (
                <p className="mt-1 text-xs text-expense">
                  {form.formState.errors.categoryId.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="subcategoryId">Subcategoria</Label>
              <Select
                id="subcategoryId"
                disabled={!selectedCategory?.subcategories.length}
                {...form.register("subcategoryId")}
              >
                <option value="">Nenhuma</option>
                {selectedCategory?.subcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="paymentMethod">Forma de pagamento</Label>
          <Select id="paymentMethod" {...form.register("paymentMethod")}>
            <option value="">Nenhuma</option>
            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="date">Data</Label>
          <Input id="date" type="date" {...form.register("date")} />
          {form.formState.errors.date && (
            <p className="mt-1 text-xs text-expense">
              {form.formState.errors.date.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="accountId">
            {type === "transferencia" ? "Conta de origem" : "Conta"}
          </Label>
          <Select id="accountId" {...form.register("accountId")}>
            <option value="">Selecione</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
          {form.formState.errors.accountId && (
            <p className="mt-1 text-xs text-expense">
              {form.formState.errors.accountId.message}
            </p>
          )}
        </div>
        {type === "transferencia" && (
          <div>
            <Label htmlFor="transferAccountId">Conta de destino</Label>
            <Select id="transferAccountId" {...form.register("transferAccountId")}>
              <option value="">Selecione</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
            {form.formState.errors.transferAccountId && (
              <p className="mt-1 text-xs text-expense">
                {form.formState.errors.transferAccountId.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" {...form.register("notes")} />
      </div>

      <div>
        <Label htmlFor="attachment">Anexo (opcional)</Label>
        <label className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 text-sm text-muted-foreground hover:bg-surface-muted">
          <Paperclip className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {attachmentFile ? attachmentFile.name : "Selecionar arquivo"}
          </span>
          <input
            id="attachment"
            type="file"
            className="hidden"
            onChange={(e) => setAttachmentFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
