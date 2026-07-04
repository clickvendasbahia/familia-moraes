import { Sparkles } from "lucide-react";

export function InsightsPanel({ insights }: { insights: string[] }) {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="h-4 w-4 text-primary" />
        Resumo inteligente
      </h2>
      <ul className="mt-3 space-y-2">
        {insights.map((insight) => (
          <li
            key={insight}
            className="rounded-lg bg-surface-muted px-3 py-2 text-sm"
          >
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}
