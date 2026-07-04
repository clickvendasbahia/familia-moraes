-- Contas (carteiras/bancos) usadas na tela de Caixa e no cadastro de movimentações.
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('corrente', 'poupanca', 'carteira', 'investimento', 'outro')),
  initial_balance numeric(14, 2) not null default 0,
  color text,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

-- Categorias (Receitas, Despesas Fixas, Despesas Variáveis, Investimentos).
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  "group" text not null check ("group" in ('receita', 'despesa_fixa', 'despesa_variavel', 'investimento')),
  icon text,
  is_default boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  unique (name, "group")
);

-- Subcategorias, criadas livremente pelo casal a partir de uma categoria.
create table public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (category_id, name)
);

-- Ativos de investimento (ex: "Tesouro Selic 2029", "PETR4"), referenciados
-- por movimentações do tipo `investimento`.
create table public.investments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id uuid references public.categories (id),
  person text not null check (person in ('ramon', 'priscila', 'ambos')),
  broker text,
  created_at timestamptz not null default now()
);

-- Contas fixas recorrentes (Aluguel, Internet, Energia...).
-- A geração automática mensal das despesas é feita por
-- `generate_recurring_transactions()` (ver migration de automação).
create table public.recurring_bills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  amount numeric(14, 2) not null check (amount > 0),
  category_id uuid references public.categories (id),
  person text not null check (person in ('ramon', 'priscila', 'ambos')),
  account_id uuid references public.accounts (id),
  payment_method text check (payment_method in ('dinheiro', 'pix', 'debito', 'credito', 'boleto', 'transferencia')),
  day_of_month int not null check (day_of_month between 1 and 31),
  active boolean not null default true,
  start_date date not null default current_date,
  end_date date,
  created_at timestamptz not null default now()
);

-- Movimentações: o coração do sistema (receitas, despesas, transferências e investimentos).
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('receita', 'despesa', 'transferencia', 'investimento')),
  person text not null check (person in ('ramon', 'priscila', 'ambos')),
  amount numeric(14, 2) not null check (amount > 0),
  description text not null,
  category_id uuid references public.categories (id),
  subcategory_id uuid references public.subcategories (id),
  payment_method text check (payment_method in ('dinheiro', 'pix', 'debito', 'credito', 'boleto', 'transferencia')),
  account_id uuid references public.accounts (id),
  transfer_account_id uuid references public.accounts (id),
  investment_id uuid references public.investments (id),
  date date not null,
  notes text,
  attachment_url text,
  recurring_bill_id uuid references public.recurring_bills (id),
  is_recurring_generated boolean not null default false,
  created_by uuid references auth.users (id) default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transfer_requires_destination
    check (type <> 'transferencia' or transfer_account_id is not null)
);

create trigger set_transactions_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

-- Índices para os filtros e agregações mais comuns do dashboard e relatórios.
create index idx_transactions_date on public.transactions (date desc);
create index idx_transactions_person on public.transactions (person);
create index idx_transactions_type on public.transactions (type);
create index idx_transactions_category on public.transactions (category_id);
create index idx_transactions_account on public.transactions (account_id);
create index idx_transactions_recurring_bill on public.transactions (recurring_bill_id);
create index idx_subcategories_category on public.subcategories (category_id);
create index idx_recurring_bills_active_day on public.recurring_bills (active, day_of_month);
