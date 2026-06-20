export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      mini_apps: {
        Row: {
          audio_url: string | null
          cakto_checkout_url: string | null
          cakto_product_id: string | null
          content_md: string | null
          created_at: string
          description: string | null
          em_breve: boolean
          gratuito: boolean
          horas_certificado: number | null
          icon: string | null
          id: string
          is_active: boolean
          kind: string
          name: string
          price_cents: number
          price_original_cents: number | null
          route_path: string | null
          slug: string
          sort_order: number
          track_academico: boolean
          track_enfermeiro: boolean
          track_tecnico: boolean
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          cakto_checkout_url?: string | null
          cakto_product_id?: string | null
          content_md?: string | null
          created_at?: string
          description?: string | null
          em_breve?: boolean
          gratuito?: boolean
          horas_certificado?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean
          kind?: string
          name: string
          price_cents?: number
          price_original_cents?: number | null
          route_path?: string | null
          slug: string
          sort_order?: number
          track_academico?: boolean
          track_enfermeiro?: boolean
          track_tecnico?: boolean
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          cakto_checkout_url?: string | null
          cakto_product_id?: string | null
          content_md?: string | null
          created_at?: string
          description?: string | null
          em_breve?: boolean
          gratuito?: boolean
          horas_certificado?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean
          kind?: string
          name?: string
          price_cents?: number
          price_original_cents?: number | null
          route_path?: string | null
          slug?: string
          sort_order?: number
          track_academico?: boolean
          track_enfermeiro?: boolean
          track_tecnico?: boolean
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      relatorio_uses: {
        Row: {
          cakto_order_id: string | null
          created_at: string
          generated_at: string | null
          id: string
          mini_app_id: string
          opens_left: number
          total_opens: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cakto_order_id?: string | null
          created_at?: string
          generated_at?: string | null
          id?: string
          mini_app_id: string
          opens_left?: number
          total_opens?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cakto_order_id?: string | null
          created_at?: string
          generated_at?: string | null
          id?: string
          mini_app_id?: string
          opens_left?: number
          total_opens?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatorio_uses_mini_app_id_fkey"
            columns: ["mini_app_id"]
            isOneToOne: false
            referencedRelation: "mini_apps"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          cakto_checkout_url: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price_cents: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          cakto_checkout_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price_cents?: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          cakto_checkout_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price_cents?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cakto_subscription_id: string | null
          cancelled_at: string | null
          created_at: string
          current_period_end: string | null
          id: string
          mini_app_id: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cakto_subscription_id?: string | null
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          mini_app_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          cakto_subscription_id?: string | null
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          mini_app_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_mini_app_id_fkey"
            columns: ["mini_app_id"]
            isOneToOne: false
            referencedRelation: "mini_apps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_app_access: {
        Row: {
          cakto_order_id: string | null
          created_at: string
          expires_at: string
          granted_at: string
          id: string
          mini_app_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cakto_order_id?: string | null
          created_at?: string
          expires_at: string
          granted_at?: string
          id?: string
          mini_app_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cakto_order_id?: string | null
          created_at?: string
          expires_at?: string
          granted_at?: string
          id?: string
          mini_app_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_app_access_mini_app_id_fkey"
            columns: ["mini_app_id"]
            isOneToOne: false
            referencedRelation: "mini_apps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          notes: string | null
          plan_slug: string
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          notes?: string | null
          plan_slug: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          notes?: string | null
          plan_slug?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_relatorio_open: {
        Args: { _mini_app_id: string }
        Returns: number
      }
      has_app_access: {
        Args: { _mini_app_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "aluno"
      mini_app_kind: "basico" | "extra" | "relatorio"
      subscription_status: "active" | "cancelled" | "past_due" | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "aluno"],
      mini_app_kind: ["basico", "extra", "relatorio"],
      subscription_status: ["active", "cancelled", "past_due", "pending"],
    },
  },
} as const
