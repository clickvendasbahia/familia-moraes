"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCurrentBrPeriod,
  getNextPeriod,
  getPreviousPeriod,
} from "@/lib/period";

type PeriodSelectorProps = {
  year: number;
  month: number;
  label: string;
  isCurrentMonth: boolean;
};

export function PeriodSelector({
  year,
  month,
  label,
  isCurrentMonth,
}: PeriodSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goTo(nextYear: number, nextMonth: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(nextYear));
    params.set("month", String(nextMonth));
    router.push(`${pathname}?${params.toString()}`);
  }

  function handlePrev() {
    const p = getPreviousPeriod({ year, month });
    goTo(p.year, p.month);
  }

  function handleNext() {
    const p = getNextPeriod({ year, month });
    goTo(p.year, p.month);
  }

  function handleCurrentMonth() {
    const c = getCurrentBrPeriod();
    goTo(c.year, c.month);
  }

  function handleMonthInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const [y, m] = e.target.value.split("-").map(Number);
    if (y && m) goTo(y, m);
  }

  const monthInputValue = `${year}-${String(month).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex items-center justify-between gap-1 rounded-lg border border-border p-1 sm:justify-start">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handlePrev}
          title="Mês anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-0 flex-1 truncate px-1 text-center text-sm font-medium sm:min-w-[150px] sm:flex-none">
          {label}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleNext}
          title="Próximo mês"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="month"
          value={monthInputValue}
          onChange={handleMonthInputChange}
          aria-label="Selecionar mês e ano"
          className="h-9 flex-1 rounded-lg border border-border bg-surface px-2 text-sm sm:flex-none"
        />
        {!isCurrentMonth && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCurrentMonth}
            className="shrink-0"
          >
            Mês atual
          </Button>
        )}
      </div>
    </div>
  );
}
