import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Converte uma data "YYYY-MM-DD" em um Date à meia-noite local, em vez de
 * `new Date(string)` (que interpreta como UTC e pode voltar um dia em
 * fusos atrás de UTC, como o do Brasil).
 */
export function parseISODate(date: string): Date {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISODate(date) : date;
  return new Intl.DateTimeFormat("pt-BR").format(d);
}

/**
 * "Agora" no fuso horário America/Sao_Paulo, representado como um `Date`
 * cujos getters locais (getFullYear/getMonth/getDate/...) já refletem o
 * horário de Brasília — independente do fuso horário real do processo que
 * está rodando (em produção na Vercel, os servidores rodam em UTC). Usar
 * `new Date()` puro para decidir "o mês atual" é o bug clássico: perto da
 * meia-noite em Brasília (21h-23h59, que já é 00h-02h59 UTC do dia
 * seguinte), o servidor acha que já é outro dia/mês.
 */
export function getNowInSaoPaulo(): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);

  return new Date(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );
}

/**
 * Data de hoje no formato "YYYY-MM-DD" no fuso horário do Brasil
 * (America/Sao_Paulo), não no fuso do servidor. Evita o problema de
 * `toISOString()`/`new Date()` local do processo, que em produção roda em
 * UTC e pode "pular" para o dia seguinte perto da meia-noite em Brasília.
 */
export function getTodayISODate(): string {
  const now = getNowInSaoPaulo();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function clampToLastDayOfMonth(year: number, month: number, day: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay));
}

/**
 * Próxima data em que um "dia do mês" (ex: contas fixas, dia 31) ocorre a
 * partir de `from`. Ajusta para o último dia do mês quando ele não existe
 * (ex: dia 31 em fevereiro).
 */
export function getNextDueDate(
  dayOfMonth: number,
  from: Date = new Date(),
): Date {
  const startOfToday = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate(),
  );
  let candidate = clampToLastDayOfMonth(
    from.getFullYear(),
    from.getMonth(),
    dayOfMonth,
  );
  if (candidate < startOfToday) {
    candidate = clampToLastDayOfMonth(
      from.getFullYear(),
      from.getMonth() + 1,
      dayOfMonth,
    );
  }
  return candidate;
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);
}
