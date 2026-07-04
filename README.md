# Finanças da Família

Painel financeiro pessoal de Ramon e Priscila. Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + Supabase.

## Como rodar

```bash
npm install
cp .env.local.example .env.local   # preencha com as credenciais do seu projeto Supabase
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Arquitetura

```
src/
  app/                  Rotas (App Router). Cada tela do sistema vira uma pasta aqui.
  components/
    ui/                 Componentes de interface reutilizáveis (botões, cards, modais...)
  config/               Configuração estática do domínio (categorias padrão, navegação, metadados)
  hooks/                Hooks React reutilizáveis (ex: useTransactions, useDashboard)
  lib/
    supabase/           Clientes Supabase (browser, server, middleware de sessão)
    utils.ts            Helpers de formatação (moeda, data, percentual) e cn()
  repositories/         Camada de acesso a dados — únicas responsáveis por falar com o Supabase
  services/             Regras de negócio — orquestram repositories, fazem cálculos e validações
  types/                Tipos TypeScript (domínio + tipos gerados do banco)
```

**Fluxo de dados:** `Componente → hook → service → repository → Supabase`.
Componentes nunca chamam o Supabase diretamente; isso mantém a lógica de negócio testável e centralizada.

## Stack

- **Next.js 16** (App Router, Server Components + Server Actions)
- **React 19**
- **Tailwind CSS 4** (tokens de design via `@theme` em `globals.css`, com suporte a dark mode via classe)
- **Supabase** (Postgres, Auth, RLS)
- **TypeScript** em modo estrito
- `react-hook-form` + `zod` para formulários e validação
- `recharts` para gráficos
- `framer-motion` para animações
- `sonner` para notificações (toasts)
- `next-themes` para modo escuro
- `zustand` para estado global leve (ex: filtros ativos, usuário atual)

## Status do projeto

Construído em etapas incrementais — veja o histórico da conversa ou a lista de tarefas do projeto para o roteiro completo (schema do banco, autenticação, dashboard, movimentações, gasto rápido, contas fixas, planejamento, caixa, investimentos, metas, relatórios, calendário e extras).
