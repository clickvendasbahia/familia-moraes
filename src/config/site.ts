export const SITE_CONFIG = {
  name: "Moraes Family Money",
  shortName: "Moraes Money",
  description:
    "Painel financeiro da Família Moraes — clareza total sobre receitas, despesas, investimentos e patrimônio.",
};

export type NavItem = {
  label: string;
  href: string;
  icon: string;
};

/**
 * Itens de navegação principal. Consumido pela sidebar (Etapa 4).
 * Telas ainda não implementadas apontam para rotas que serão criadas
 * nas próximas etapas.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Movimentações", href: "/movimentacoes", icon: "ArrowLeftRight" },
  { label: "Contas Fixas", href: "/contas-fixas", icon: "CalendarClock" },
  { label: "Planejamento", href: "/planejamento", icon: "Target" },
  { label: "Caixa", href: "/caixa", icon: "Wallet" },
  { label: "Investimentos", href: "/investimentos", icon: "TrendingUp" },
  { label: "Metas", href: "/metas", icon: "Flag" },
  { label: "Planejamento Financeiro", href: "/planejamento-financeiro", icon: "Compass" },
  { label: "Relatórios", href: "/relatorios", icon: "FileBarChart" },
  { label: "Calendário", href: "/calendario", icon: "Calendar" },
];
