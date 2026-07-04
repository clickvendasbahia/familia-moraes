-- Perfis de aplicação para os usuários de autenticação (Ramon e Priscila).
-- Estende `auth.users` com os dados específicos do domínio.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  person text not null check (person in ('ramon', 'priscila')),
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  unique (person)
);

comment on table public.profiles is 'Extensão de auth.users com os dados de domínio de cada usuário (Ramon/Priscila).';

-- Cria automaticamente um profile ao criar um usuário no Supabase Auth.
-- Espera que `person` e `display_name` venham em auth.users.raw_user_meta_data,
-- definidos no momento da criação do usuário (ver Etapa 3 - Autenticação).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, person, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'person', 'ramon'),
    coalesce(new.raw_user_meta_data ->> 'display_name', new.email)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
