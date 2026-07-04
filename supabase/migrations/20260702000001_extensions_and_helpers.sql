-- Extensões e funções utilitárias compartilhadas por todo o schema.

create extension if not exists pg_cron with schema extensions;

-- Mantém `updated_at` sempre atualizado em qualquer tabela que use este trigger.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
