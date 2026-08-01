import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { capitalizeFirst, getNowInSaoPaulo } from "@/lib/utils";

/**
 * Fonte única de verdade para "qual período está selecionado" em todo o
 * dashboard. Todo componente/serviço que precisa saber o mês/ano corrente
 * deve derivar de `resolvePeriod`, nunca calcular o próprio `new Date()`.
 */
export type Period = {
  year: number;
  month: number; // 1-12
  /** Primeiro dia do mês, "YYYY-MM-DD". */
  startDate: string;
  /** Último dia do mês, "YYYY-MM-DD". */
  endDate: string;
  /** Primeiro dia do mês seguinte, "YYYY-MM-DD" — limite exclusivo seguro para filtros. */
  nextMonthStart: string;
  /** Primeiro dia do mês como Date local, seguro para usar com date-fns (startOfMonth/subMonths/etc). */
  referenceDate: Date;
  label: string;
  isCurrentMonth: boolean;
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function getCurrentBrPeriod(): { year: number; month: number } {
  const now = getNowInSaoPaulo();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function getPreviousPeriod(p: { year: number; month: number }): {
  year: number;
  month: number;
} {
  return p.month === 1
    ? { year: p.year - 1, month: 12 }
    : { year: p.year, month: p.month - 1 };
}

export function getNextPeriod(p: { year: number; month: number }): {
  year: number;
  month: number;
} {
  return p.month === 12
    ? { year: p.year + 1, month: 1 }
    : { year: p.year, month: p.month + 1 };
}

/**
 * Resolve o período (mês/ano) a partir de search params da URL (`?month=7&year=2026`).
 * Se ausentes ou inválidos, cai no mês atual do Brasil — nunca no mês do
 * servidor.
 */
export function resolvePeriod(searchParams?: {
  month?: string;
  year?: string;
}): Period {
  const current = getCurrentBrPeriod();

  let year = Number(searchParams?.year);
  let month = Number(searchParams?.month);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) year = current.year;
  if (!Number.isInteger(month) || month < 1 || month > 12) month = current.month;

  const startDate = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${pad(month)}-${pad(lastDay)}`;
  const nextMonthDate = new Date(year, month, 1);
  const nextMonthStart = `${nextMonthDate.getFullYear()}-${pad(
    nextMonthDate.getMonth() + 1,
  )}-${pad(nextMonthDate.getDate())}`;

  const referenceDate = new Date(year, month - 1, 1);
  const label = capitalizeFirst(
    format(referenceDate, "MMMM 'de' yyyy", { locale: ptBR }),
  );

  return {
    year,
    month,
    startDate,
    endDate,
    nextMonthStart,
    referenceDate,
    label,
    isCurrentMonth: year === current.year && month === current.month,
  };
}
