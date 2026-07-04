import type { CategoryGroup } from "@/types/domain";

export type DefaultCategory = {
  name: string;
  group: CategoryGroup;
  icon: string;
  subcategories?: string[];
};

/**
 * Categorias padrão usadas para popular o banco (seed) na criação de um
 * novo household e como fallback de exibição no front-end.
 * Nomes de ícone referenciam o pacote `lucide-react`.
 */
export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // Receitas
  { name: "Salário Ramon", group: "receita", icon: "Wallet" },
  { name: "Salário Priscila", group: "receita", icon: "Wallet" },
  { name: "Freelance", group: "receita", icon: "Laptop" },
  { name: "Comissões", group: "receita", icon: "Percent" },
  { name: "13º", group: "receita", icon: "Gift" },
  { name: "Outras receitas", group: "receita", icon: "PlusCircle" },

  // Despesas Fixas
  { name: "Aluguel", group: "despesa_fixa", icon: "Home" },
  { name: "Financiamento", group: "despesa_fixa", icon: "Landmark" },
  { name: "Internet", group: "despesa_fixa", icon: "Wifi" },
  { name: "Energia", group: "despesa_fixa", icon: "Zap" },
  { name: "Água", group: "despesa_fixa", icon: "Droplet" },
  { name: "Telefone", group: "despesa_fixa", icon: "Phone" },
  { name: "Plano de Saúde", group: "despesa_fixa", icon: "HeartPulse" },
  { name: "Seguro", group: "despesa_fixa", icon: "Shield" },
  { name: "Academia", group: "despesa_fixa", icon: "Dumbbell" },
  { name: "Streaming", group: "despesa_fixa", icon: "Tv" },
  { name: "Escola", group: "despesa_fixa", icon: "GraduationCap" },

  // Despesas Variáveis
  { name: "Mercado", group: "despesa_variavel", icon: "ShoppingCart" },
  { name: "Padaria", group: "despesa_variavel", icon: "Croissant" },
  { name: "Farmácia", group: "despesa_variavel", icon: "Pill" },
  { name: "Combustível", group: "despesa_variavel", icon: "Fuel" },
  { name: "Uber", group: "despesa_variavel", icon: "Car" },
  { name: "Restaurante", group: "despesa_variavel", icon: "UtensilsCrossed" },
  { name: "Lazer", group: "despesa_variavel", icon: "PartyPopper" },
  { name: "Viagens", group: "despesa_variavel", icon: "Plane" },
  { name: "Roupas", group: "despesa_variavel", icon: "Shirt" },
  { name: "Presentes", group: "despesa_variavel", icon: "Gift" },
  { name: "Pets", group: "despesa_variavel", icon: "PawPrint" },
  { name: "Casa", group: "despesa_variavel", icon: "Sofa" },
  { name: "Manutenção", group: "despesa_variavel", icon: "Wrench" },

  // Investimentos
  {
    name: "Reserva de Emergência",
    group: "investimento",
    icon: "ShieldCheck",
  },
  { name: "Tesouro", group: "investimento", icon: "Landmark" },
  { name: "CDB", group: "investimento", icon: "PiggyBank" },
  { name: "Ações", group: "investimento", icon: "TrendingUp" },
  { name: "ETF", group: "investimento", icon: "BarChart3" },
  { name: "Fundos", group: "investimento", icon: "Building2" },
  { name: "Criptomoedas", group: "investimento", icon: "Bitcoin" },
  { name: "Outros", group: "investimento", icon: "MoreHorizontal" },
];
