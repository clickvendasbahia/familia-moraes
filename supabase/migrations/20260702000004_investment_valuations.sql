-- Snapshots manuais do valor atual de cada investimento, usados para calcular
-- rentabilidade e a evolução patrimonial na tela de Investimentos.
create table public.investment_valuations (
  id uuid primary key default gen_random_uuid(),
  investment_id uuid not null references public.investments (id) on delete cascade,
  date date not null,
  current_value numeric(14, 2) not null check (current_value >= 0),
  notes text,
  created_at timestamptz not null default now(),
  unique (investment_id, date)
);

create index idx_investment_valuations_investment_date
  on public.investment_valuations (investment_id, date desc);
