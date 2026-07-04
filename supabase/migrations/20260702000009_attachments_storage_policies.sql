-- RLS do bucket "attachments" (anexos de movimentações). Mesma regra do
-- resto do sistema: qualquer usuário autenticado tem acesso total, já que
-- os dados são 100% compartilhados entre Ramon e Priscila.
create policy "attachments_all_authenticated"
on storage.objects
for all
to authenticated
using (bucket_id = 'attachments')
with check (bucket_id = 'attachments');
