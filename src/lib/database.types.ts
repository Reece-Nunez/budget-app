export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category: string | null;
          planned: number | null;
          actual: number | null;
          month: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          category?: string | null;
          planned?: number | null;
          actual?: number | null;
          month?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string | null;
          planned?: number | null;
          actual?: number | null;
          month?: string | null;
          created_at?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          type: string | null;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          type?: string | null;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string | null;
          user_id?: string | null;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string | null;
          category: string;
          amount: number;
          date: string;
          inserted_at: string | null;
          isRecurring: boolean | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          category: string;
          amount: number;
          date: string;
          inserted_at?: string | null;
          isRecurring?: boolean | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          category?: string;
          amount?: number;
          date?: string;
          inserted_at?: string | null;
          isRecurring?: boolean | null;
        };
      };
      income: {
        Row: {
          id: string;
          user_id: string | null;
          source: string;
          amount: number;
          date: string;
          inserted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          source: string;
          amount: number;
          date: string;
          inserted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          source?: string;
          amount?: number;
          date?: string;
          inserted_at?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          email: string | null;
          has_paid: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          email?: string | null;
          has_paid?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string | null;
          has_paid?: boolean | null;
          created_at?: string | null;
        };
      };
      recurring_bills: {
        Row: {
          id: string;
          name: string;
          amount: number | null;
          due_day: number | null;
          category: string | null;
          user_id: string | null;
          is_active: boolean | null;
        };
        Insert: {
          id?: string;
          name: string;
          amount?: number | null;
          due_day?: number | null;
          category?: string | null;
          user_id?: string | null;
          is_active?: boolean | null;
        };
        Update: {
          id?: string;
          name?: string;
          amount?: number | null;
          due_day?: number | null;
          category?: string | null;
          user_id?: string | null;
          is_active?: boolean | null;
        };
      };
    };
    Views: object;
    Functions: object;
    Enums: object;
  };
}
