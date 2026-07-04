export type Person = "ramon" | "priscila";
export type PersonOrBoth = Person | "ambos";

export type TransactionType =
  | "receita"
  | "despesa"
  | "transferencia"
  | "investimento";

export type CategoryGroup =
  | "receita"
  | "despesa_fixa"
  | "despesa_variavel"
  | "investimento";

export type PaymentMethod =
  | "dinheiro"
  | "pix"
  | "debito"
  | "credito"
  | "boleto"
  | "transferencia";

export const PERSON_LABELS: Record<Person, string> = {
  ramon: "Ramon",
  priscila: "Priscila",
};

export const PERSON_OR_BOTH_LABELS: Record<PersonOrBoth, string> = {
  ramon: "Ramon",
  priscila: "Priscila",
  ambos: "Ambos",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  receita: "Receita",
  despesa: "Despesa",
  transferencia: "Transferência",
  investimento: "Investimento",
};

export const CATEGORY_GROUP_LABELS: Record<CategoryGroup, string> = {
  receita: "Receitas",
  despesa_fixa: "Despesas Fixas",
  despesa_variavel: "Despesas Variáveis",
  investimento: "Investimentos",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  debito: "Débito",
  credito: "Crédito",
  boleto: "Boleto",
  transferencia: "Transferência",
};

export type AccountType =
  | "corrente"
  | "poupanca"
  | "carteira"
  | "investimento"
  | "outro";

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  corrente: "Conta Corrente",
  poupanca: "Poupança",
  carteira: "Carteira",
  investimento: "Investimento",
  outro: "Outro",
};

export type GoalStatus = "em_andamento" | "concluida" | "pausada";

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  em_andamento: "Em andamento",
  concluida: "Concluída",
  pausada: "Pausada",
};
