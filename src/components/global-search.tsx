"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { NAV_ITEMS } from "@/config/site";
import { searchTransactionsAction, type SearchResult } from "@/services/search-actions";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
      } else {
        searchTransactionsAction(query).then(setResults);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const matchingNav = query.trim()
    ? NAV_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  function goTo(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        title="Pesquisar (Ctrl+K)"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pesquisar</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Buscar movimentações ou páginas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="mt-3 max-h-80 space-y-1 overflow-y-auto">
            {matchingNav.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => goTo(item.href)}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-muted"
              >
                {item.label}
              </button>
            ))}
            {results.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() =>
                  goTo(`/movimentacoes?q=${encodeURIComponent(r.description)}`)
                }
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-muted"
              >
                <span className="truncate">{r.description}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(r.date)} · {formatCurrency(r.amount)}
                </span>
              </button>
            ))}
            {query.trim() && matchingNav.length === 0 && results.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                Nenhum resultado.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
