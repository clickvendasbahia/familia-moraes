-- Moraes Money v2: novas categorias/subcategorias + flag de subcategoria
-- obrigatória. Idempotente: seguro rodar mais de uma vez. Não altera nem
-- remove nenhuma categoria/subcategoria/transação existente — apenas
-- adiciona (via ON CONFLICT DO NOTHING, casando por nome, nunca por id) e
-- marca `subcategory_required = true` em categorias específicas.

alter table public.categories
  add column if not exists subcategory_required boolean not null default false;

-- Novas categorias de despesa
insert into public.categories (name, "group", icon, is_default, subcategory_required)
values
  ('MJ', 'despesa_variavel', 'Cat', false, true),
  ('Beleza', 'despesa_variavel', 'Sparkles', false, true),
  ('Ferramentas', 'despesa_variavel', 'Wrench', false, true),
  ('Shows e Festas', 'despesa_variavel', 'PartyPopper', false, true)
on conflict (name, "group") do nothing;

-- Nova categoria de receita
insert into public.categories (name, "group", icon, is_default, subcategory_required)
values ('Ganhos', 'receita', 'Banknote', false, true)
on conflict (name, "group") do nothing;

-- Mercado já existe desde a v1: passa a exigir subcategoria a partir de agora.
-- Transações antigas sem subcategoria continuam existindo normalmente
-- (subcategory_id é opcional na tabela transactions).
update public.categories
set subcategory_required = true
where name = 'Mercado' and "group" = 'despesa_variavel';

-- Subcategorias — MJ
insert into public.subcategories (category_id, name)
select c.id, x.name
from public.categories c
cross join (values ('Compra'), ('Acessórios'), ('Delivery'), ('Outros')) as x(name)
where c.name = 'MJ' and c."group" = 'despesa_variavel'
on conflict (category_id, name) do nothing;

-- Subcategorias — Beleza
insert into public.subcategories (category_id, name)
select c.id, x.name
from public.categories c
cross join (
  values ('Barbeiro'), ('Cabelo'), ('Produtos de beleza'),
         ('Higiene pessoal'), ('Estética'), ('Outros')
) as x(name)
where c.name = 'Beleza' and c."group" = 'despesa_variavel'
on conflict (category_id, name) do nothing;

-- Subcategorias — Ferramentas
insert into public.subcategories (category_id, name)
select c.id, x.name
from public.categories c
cross join (
  values ('Ferramentas de trabalho'), ('Equipamentos'), ('Manutenção'),
         ('Materiais'), ('Softwares e assinaturas'), ('Outros')
) as x(name)
where c.name = 'Ferramentas' and c."group" = 'despesa_variavel'
on conflict (category_id, name) do nothing;

-- Subcategorias — Shows e Festas
insert into public.subcategories (category_id, name)
select c.id, x.name
from public.categories c
cross join (
  values ('Ingressos'), ('Festas'), ('Bebidas e consumo'),
         ('Transporte'), ('Hospedagem'), ('Alimentação'), ('Outros')
) as x(name)
where c.name = 'Shows e Festas' and c."group" = 'despesa_variavel'
on conflict (category_id, name) do nothing;

-- Subcategorias — Ganhos (origem da receita)
insert into public.subcategories (category_id, name)
select c.id, x.name
from public.categories c
cross join (values ('Zyoner'), ('Salvador Ingressos'), ('Outros')) as x(name)
where c.name = 'Ganhos' and c."group" = 'receita'
on conflict (category_id, name) do nothing;

-- Subcategorias — Mercado (categoria já existente; apenas adiciona as novas)
insert into public.subcategories (category_id, name)
select c.id, x.name
from public.categories c
cross join (
  values ('Compra geral'), ('Hortifruti'), ('Açougue'), ('Frutas'),
         ('Bebidas'), ('Produtos de limpeza'), ('Higiene pessoal'), ('Outros')
) as x(name)
where c.name = 'Mercado' and c."group" = 'despesa_variavel'
on conflict (category_id, name) do nothing;
