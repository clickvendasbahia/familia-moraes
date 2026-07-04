-- RLS: este sistema é de uso privado de exatamente duas pessoas (Ramon e
-- Priscila), que compartilham TODOS os dados financeiros entre si por
-- design. Por isso a regra é simples: qualquer usuário autenticado tem
-- acesso total às tabelas de domínio. A única exceção é `profiles`, onde
-- cada usuário só pode alterar o próprio registro.

alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.investments enable row level security;
alter table public.investment_valuations enable row level security;
alter table public.recurring_bills enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.category_budget_limits enable row level security;
alter table public.goals enable row level security;
alter table public.goal_contributions enable row level security;

-- profiles: todos autenticados podem ver os dois perfis; cada um só edita o próprio.
create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated using (true);

create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Demais tabelas: acesso total para qualquer usuário autenticado.
create policy "accounts_all_authenticated" on public.accounts
  for all to authenticated using (true) with check (true);

create policy "categories_all_authenticated" on public.categories
  for all to authenticated using (true) with check (true);

create policy "subcategories_all_authenticated" on public.subcategories
  for all to authenticated using (true) with check (true);

create policy "investments_all_authenticated" on public.investments
  for all to authenticated using (true) with check (true);

create policy "investment_valuations_all_authenticated" on public.investment_valuations
  for all to authenticated using (true) with check (true);

create policy "recurring_bills_all_authenticated" on public.recurring_bills
  for all to authenticated using (true) with check (true);

create policy "transactions_all_authenticated" on public.transactions
  for all to authenticated using (true) with check (true);

create policy "budgets_all_authenticated" on public.budgets
  for all to authenticated using (true) with check (true);

create policy "category_budget_limits_all_authenticated" on public.category_budget_limits
  for all to authenticated using (true) with check (true);

create policy "goals_all_authenticated" on public.goals
  for all to authenticated using (true) with check (true);

create policy "goal_contributions_all_authenticated" on public.goal_contributions
  for all to authenticated using (true) with check (true);
