-- A FK de transactions.recurring_bill_id não tinha ON DELETE definido
-- (padrão é RESTRICT), então excluir uma conta fixa que já gerou alguma
-- movimentação falhava. O comportamento esperado é: a conta fixa some,
-- mas as movimentações já geradas continuam existindo (apenas
-- "desvinculadas" da conta fixa de origem).
alter table public.transactions
  drop constraint transactions_recurring_bill_id_fkey;

alter table public.transactions
  add constraint transactions_recurring_bill_id_fkey
  foreign key (recurring_bill_id) references public.recurring_bills (id)
  on delete set null;
