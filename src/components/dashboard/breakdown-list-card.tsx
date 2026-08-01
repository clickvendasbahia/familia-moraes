import { formatCurrency } from "@/lib/utils";

export function BreakdownListCard({
  title,
  emptyLabel,
  items,
}: {
  title: string;
  emptyLabel: string;
  items: { label: string; amount: number }[];
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="truncate pr-2">{item.label}</span>
              <span className="shrink-0 font-medium">
                {formatCurrency(item.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
