-- Cor de destaque (accent color) escolhida individualmente por cada usuário.
alter table public.profiles
  add column accent_color text not null default 'roxo'
  check (accent_color in ('roxo', 'preto_rosa', 'azul', 'verde', 'laranja', 'grafite'));
