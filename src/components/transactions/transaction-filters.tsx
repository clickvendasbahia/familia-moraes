"use client";

import { type FormEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  PAYMENT_METHOD_LABELS,
  PERSON_OR_BOTH_LABELS,
  TRANSACTION_TYPE_LABELS,
} from "@/types/domain";
import type { CategoryWithSubcategories } from "@/repositories/categories-repository";

type AccountOption = { id: string; name: string };

export function TransactionFilters({
  categories,
  accounts,
}: {
  categories: CategoryWithSubcategories[];
  accounts: AccountOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    updateParam("q", search);
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4 md:flex-row md:flex-wrap md:items-center">
      <form
        onSubmit={handleSearchSubmit}
        className="relative min-w-[180px] flex-1"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por descrição..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <Select
        className="md:w-40"
        value={searchParams.get("type") ?? ""}
        onChange={(e) => updateParam("type", e.target.value)}
      >
        <option value="">Todos os tipos</option>
        {Object.entries(TRANSACTION_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <Select
        className="md:w-40"
        value={searchParams.get("person") ?? ""}
        onChange={(e) => updateParam("person", e.target.value)}
      >
        <option value="">Todas as pessoas</option>
        {Object.entries(PERSON_OR_BOTH_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <Select
        className="md:w-44"
        value={searchParams.get("category") ?? ""}
        onChange={(e) => updateParam("category", e.target.value)}
      >
        <option value="">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select
        className="md:w-40"
        value={searchParams.get("account") ?? ""}
        onChange={(e) => updateParam("account", e.target.value)}
      >
        <option value="">Todas as contas</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </Select>

      <Select
        className="md:w-40"
        value={searchParams.get("payment_method") ?? ""}
        onChange={(e) => updateParam("payment_method", e.target.value)}
      >
        <option value="">Todas as formas</option>
        {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <Input
        type="date"
        className="md:w-36"
        value={searchParams.get("from") ?? ""}
        onChange={(e) => updateParam("from", e.target.value)}
      />
      <Input
        type="date"
        className="md:w-36"
        value={searchParams.get("to") ?? ""}
        onChange={(e) => updateParam("to", e.target.value)}
      />
    </div>
  );
}
