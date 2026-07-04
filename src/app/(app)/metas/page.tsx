import { getGoalsOverview } from "@/services/goals-service";
import { NewGoalButton } from "@/components/goals/new-goal-button";
import { GoalCard } from "@/components/goals/goal-card";

export default async function MetasPage() {
  const goals = await getGoalsOverview();

  return (
    <main className="flex-1 space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Metas</h1>
          <p className="text-sm text-muted-foreground">
            {goals.length === 0
              ? "Nenhuma meta cadastrada ainda"
              : `${goals.length} ${goals.length === 1 ? "meta" : "metas"}`}
          </p>
        </div>
        <NewGoalButton />
      </div>

      {goals.length === 0 ? (
        <div className="rounded-card border border-border bg-surface p-10 text-center text-sm text-muted-foreground">
          Crie sua primeira meta — reserva de emergência, viagem, carro, casa...
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </main>
  );
}
