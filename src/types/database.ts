/**
 * Tipos gerados manualmente a partir das migrations em `supabase/migrations`.
 * Mantenha em sincronia sempre que o schema mudar (idealmente via
 * `supabase gen types typescript` quando o CLI estiver linkado ao projeto).
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

import type { PaymentMethod, Person, PersonOrBoth, TransactionType } from "./domain";
import type { AccentColor } from "@/config/theme-colors";

type CategoryGroup =
  | "receita"
  | "despesa_fixa"
  | "despesa_variavel"
  | "investimento";
type AccountType = "corrente" | "poupanca" | "carteira" | "investimento" | "outro";
type GoalStatus = "em_andamento" | "concluida" | "pausada";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          person: Person;
          display_name: string;
          avatar_url: string | null;
          accent_color: AccentColor;
          created_at: string;
        };
        Insert: {
          id: string;
          person: Person;
          display_name: string;
          avatar_url?: string | null;
          accent_color?: AccentColor;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      accounts: {
        Row: {
          id: string;
          name: string;
          type: AccountType;
          initial_balance: number;
          color: string | null;
          archived: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: AccountType;
          initial_balance?: number;
          color?: string | null;
          archived?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["accounts"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          group: CategoryGroup;
          icon: string | null;
          is_default: boolean;
          archived: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          group: CategoryGroup;
          icon?: string | null;
          is_default?: boolean;
          archived?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      subcategories: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subcategories"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      investments: {
        Row: {
          id: string;
          name: string;
          category_id: string | null;
          person: PersonOrBoth;
          broker: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id?: string | null;
          person: PersonOrBoth;
          broker?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["investments"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "investments_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      investment_valuations: {
        Row: {
          id: string;
          investment_id: string;
          date: string;
          current_value: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          investment_id: string;
          date: string;
          current_value: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["investment_valuations"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "investment_valuations_investment_id_fkey";
            columns: ["investment_id"];
            referencedRelation: "investments";
            referencedColumns: ["id"];
          },
        ];
      };
      recurring_bills: {
        Row: {
          id: string;
          name: string;
          amount: number;
          category_id: string | null;
          person: PersonOrBoth;
          account_id: string | null;
          payment_method: PaymentMethod | null;
          day_of_month: number;
          active: boolean;
          start_date: string;
          end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          amount: number;
          category_id?: string | null;
          person: PersonOrBoth;
          account_id?: string | null;
          payment_method?: PaymentMethod | null;
          day_of_month: number;
          active?: boolean;
          start_date?: string;
          end_date?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["recurring_bills"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "recurring_bills_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recurring_bills_account_id_fkey";
            columns: ["account_id"];
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          id: string;
          type: TransactionType;
          person: PersonOrBoth;
          amount: number;
          description: string;
          category_id: string | null;
          subcategory_id: string | null;
          payment_method: PaymentMethod | null;
          account_id: string | null;
          transfer_account_id: string | null;
          investment_id: string | null;
          date: string;
          notes: string | null;
          attachment_url: string | null;
          recurring_bill_id: string | null;
          is_recurring_generated: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: TransactionType;
          person: PersonOrBoth;
          amount: number;
          description: string;
          category_id?: string | null;
          subcategory_id?: string | null;
          payment_method?: PaymentMethod | null;
          account_id?: string | null;
          transfer_account_id?: string | null;
          investment_id?: string | null;
          date: string;
          notes?: string | null;
          attachment_url?: string | null;
          recurring_bill_id?: string | null;
          is_recurring_generated?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_subcategory_id_fkey";
            columns: ["subcategory_id"];
            referencedRelation: "subcategories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_account_id_fkey";
            columns: ["account_id"];
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_transfer_account_id_fkey";
            columns: ["transfer_account_id"];
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_investment_id_fkey";
            columns: ["investment_id"];
            referencedRelation: "investments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_recurring_bill_id_fkey";
            columns: ["recurring_bill_id"];
            referencedRelation: "recurring_bills";
            referencedColumns: ["id"];
          },
        ];
      };
      budgets: {
        Row: {
          id: string;
          month: string;
          savings_goal_amount: number | null;
          investment_goal_amount: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          month: string;
          savings_goal_amount?: number | null;
          investment_goal_amount?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["budgets"]["Insert"]>;
        Relationships: [];
      };
      category_budget_limits: {
        Row: {
          id: string;
          budget_id: string;
          category_id: string;
          limit_amount: number;
        };
        Insert: {
          id?: string;
          budget_id: string;
          category_id: string;
          limit_amount: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["category_budget_limits"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "category_budget_limits_budget_id_fkey";
            columns: ["budget_id"];
            referencedRelation: "budgets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "category_budget_limits_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      goals: {
        Row: {
          id: string;
          name: string;
          target_amount: number;
          icon: string | null;
          color: string | null;
          target_date: string | null;
          status: GoalStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          target_amount: number;
          icon?: string | null;
          color?: string | null;
          target_date?: string | null;
          status?: GoalStatus;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["goals"]["Insert"]>;
        Relationships: [];
      };
      goal_contributions: {
        Row: {
          id: string;
          goal_id: string;
          amount: number;
          date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          goal_id: string;
          amount: number;
          date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["goal_contributions"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "goal_contributions_goal_id_fkey";
            columns: ["goal_id"];
            referencedRelation: "goals";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      generate_recurring_transactions: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
