-- Gera as movimentações de despesa do mês corrente para toda conta fixa cujo
-- dia de vencimento é hoje. Idempotente: não duplica se já houver uma
-- transação gerada para aquela conta fixa neste mês.
create or replace function public.generate_recurring_transactions()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.transactions (
    type, person, amount, description, category_id, payment_method,
    account_id, date, recurring_bill_id, is_recurring_generated
  )
  select
    'despesa',
    rb.person,
    rb.amount,
    rb.name,
    rb.category_id,
    rb.payment_method,
    rb.account_id,
    -- Ajusta para o último dia do mês quando o dia cadastrado não existe
    -- nele (ex: dia 31 em fevereiro).
    least(
      make_date(extract(year from current_date)::int, extract(month from current_date)::int, rb.day_of_month),
      (date_trunc('month', current_date) + interval '1 month - 1 day')::date
    ),
    rb.id,
    true
  from public.recurring_bills rb
  where rb.active
    and rb.day_of_month = extract(day from current_date)::int
    and (rb.end_date is null or rb.end_date >= current_date)
    and rb.start_date <= current_date
    and not exists (
      select 1 from public.transactions t
      where t.recurring_bill_id = rb.id
        and date_trunc('month', t.date) = date_trunc('month', current_date)
    );
end;
$$;

grant execute on function public.generate_recurring_transactions() to authenticated;

-- Roda todo dia às 03:00 UTC. A checagem de "dia do vencimento = hoje"
-- dentro da função garante que só as contas certas sejam geradas.
select cron.schedule(
  'generate-recurring-transactions-daily',
  '0 3 * * *',
  $$select public.generate_recurring_transactions();$$
);
