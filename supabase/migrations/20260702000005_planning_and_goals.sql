-- Planejamento mensal: meta de economia, meta de investimento e limites por categoria.
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  month date not null unique,
  savings_goal_amount numeric(14, 2),
  investment_goal_amount numeric(14, 2),
  created_at timestamptz not null default now()
);

comment on column public.budgets.month is 'Sempre o primeiro dia do mês de referência (ex: 2026-07-01).';

create table public.category_budget_limits (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  limit_amount numeric(14, 2) not null check (limit_amount >= 0),
  unique (budget_id, category_id)
);

-- Metas financeiras (Reserva de Emergência, Comprar Carro, Viagem, Casa...).
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  target_amount numeric(14, 2) not null check (target_amount > 0),
  icon text,
  color text,
  target_date date,
  status text not null default 'em_andamento'
    check (status in ('em_andamento', 'concluida', 'pausada')),
  created_at timestamptz not null default now()
);

-- Aportes feitos em direção a uma meta. `current_amount` da meta é sempre
-- derivado de SUM(goal_contributions.amount) — nunca armazenado, para nunca
-- ficar dessincronizado.
create table public.goal_contributions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals (id) on delete cascade,
  amount numeric(14, 2) not null check (amount > 0),
  date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create index idx_goal_contributions_goal on public.goal_contributions (goal_id);
