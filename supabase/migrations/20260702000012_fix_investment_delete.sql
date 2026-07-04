-- Mesmo problema já corrigido para recurring_bill_id: a FK de
-- transactions.investment_id não tinha ON DELETE definido (padrão
-- RESTRICT), o que bloquearia excluir um investimento que já teve algum
-- aporte lançado. Movimentações já criadas devem continuar existindo,
-- apenas desvinculadas do investimento removido.
alter table public.transactions
  drop constraint transactions_investment_id_fkey;

alter table public.transactions
  add constraint transactions_investment_id_fkey
  foreign key (investment_id) references public.investments (id)
  on delete set null;
