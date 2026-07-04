-- Seed das categorias padrão do sistema (mesma lista de src/config/categories.ts).
insert into public.categories (name, "group", icon, is_default) values
  -- Receitas
  ('Salário Ramon', 'receita', 'Wallet', true),
  ('Salário Priscila', 'receita', 'Wallet', true),
  ('Freelance', 'receita', 'Laptop', true),
  ('Comissões', 'receita', 'Percent', true),
  ('13º', 'receita', 'Gift', true),
  ('Outras receitas', 'receita', 'PlusCircle', true),

  -- Despesas Fixas
  ('Aluguel', 'despesa_fixa', 'Home', true),
  ('Financiamento', 'despesa_fixa', 'Landmark', true),
  ('Internet', 'despesa_fixa', 'Wifi', true),
  ('Energia', 'despesa_fixa', 'Zap', true),
  ('Água', 'despesa_fixa', 'Droplet', true),
  ('Telefone', 'despesa_fixa', 'Phone', true),
  ('Plano de Saúde', 'despesa_fixa', 'HeartPulse', true),
  ('Seguro', 'despesa_fixa', 'Shield', true),
  ('Academia', 'despesa_fixa', 'Dumbbell', true),
  ('Streaming', 'despesa_fixa', 'Tv', true),
  ('Escola', 'despesa_fixa', 'GraduationCap', true),

  -- Despesas Variáveis
  ('Mercado', 'despesa_variavel', 'ShoppingCart', true),
  ('Padaria', 'despesa_variavel', 'Croissant', true),
  ('Farmácia', 'despesa_variavel', 'Pill', true),
  ('Combustível', 'despesa_variavel', 'Fuel', true),
  ('Uber', 'despesa_variavel', 'Car', true),
  ('Restaurante', 'despesa_variavel', 'UtensilsCrossed', true),
  ('Lazer', 'despesa_variavel', 'PartyPopper', true),
  ('Viagens', 'despesa_variavel', 'Plane', true),
  ('Roupas', 'despesa_variavel', 'Shirt', true),
  ('Presentes', 'despesa_variavel', 'Gift', true),
  ('Pets', 'despesa_variavel', 'PawPrint', true),
  ('Casa', 'despesa_variavel', 'Sofa', true),
  ('Manutenção', 'despesa_variavel', 'Wrench', true),

  -- Investimentos
  ('Reserva de Emergência', 'investimento', 'ShieldCheck', true),
  ('Tesouro', 'investimento', 'Landmark', true),
  ('CDB', 'investimento', 'PiggyBank', true),
  ('Ações', 'investimento', 'TrendingUp', true),
  ('ETF', 'investimento', 'BarChart3', true),
  ('Fundos', 'investimento', 'Building2', true),
  ('Criptomoedas', 'investimento', 'Bitcoin', true),
  ('Outros', 'investimento', 'MoreHorizontal', true);
