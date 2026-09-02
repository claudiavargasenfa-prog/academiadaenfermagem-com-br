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
      admin_actions: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      admin_message_recipients: {
        Row: {
          created_at: string
          id: string
          message_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_message_recipients_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "admin_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_messages: {
        Row: {
          admin_id: string
          body: string
          created_at: string
          id: string
          is_broadcast: boolean
          title: string
        }
        Insert: {
          admin_id: string
          body: string
          created_at?: string
          id?: string
          is_broadcast?: boolean
          title: string
        }
        Update: {
          admin_id?: string
          body?: string
          created_at?: string
          id?: string
          is_broadcast?: boolean
          title?: string
        }
        Relationships: []
      }
      app_sections: {
        Row: {
          app_id: string
          created_at: string
          emoji: string | null
          id: string
          is_active: boolean
          ordem: number
          title: string
          updated_at: string
        }
        Insert: {
          app_id: string
          created_at?: string
          emoji?: string | null
          id?: string
          is_active?: boolean
          ordem?: number
          title: string
          updated_at?: string
        }
        Update: {
          app_id?: string
          created_at?: string
          emoji?: string | null
          id?: string
          is_active?: boolean
          ordem?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_sections_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
      }
      app_texts: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          updated_by: string | null
          value: string
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: string
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      apps: {
        Row: {
          bg_color: string | null
          codigo: string | null
          created_at: string
          description: string | null
          emoji: string | null
          fg_color: string | null
          id: string
          is_active: boolean
          name: string
          ordem: number
          short_name: string | null
          slug: string
          sort_mode: string
          updated_at: string
          whatsapp_group_url: string | null
        }
        Insert: {
          bg_color?: string | null
          codigo?: string | null
          created_at?: string
          description?: string | null
          emoji?: string | null
          fg_color?: string | null
          id?: string
          is_active?: boolean
          name: string
          ordem?: number
          short_name?: string | null
          slug: string
          sort_mode?: string
          updated_at?: string
          whatsapp_group_url?: string | null
        }
        Update: {
          bg_color?: string | null
          codigo?: string | null
          created_at?: string
          description?: string | null
          emoji?: string | null
          fg_color?: string | null
          id?: string
          is_active?: boolean
          name?: string
          ordem?: number
          short_name?: string | null
          slug?: string
          sort_mode?: string
          updated_at?: string
          whatsapp_group_url?: string | null
        }
        Relationships: []
      }
      diagnosticos_aede: {
        Row: {
          bloco: string
          bloco_label: string
          created_at: string
          id: string
          id_gatilho: string
          meta_mm: string | null
          ordem: number
          raciocinio_rc: string | null
          sinais_sintomas: string[]
          titulo: string
          updated_at: string
        }
        Insert: {
          bloco: string
          bloco_label: string
          created_at?: string
          id?: string
          id_gatilho: string
          meta_mm?: string | null
          ordem?: number
          raciocinio_rc?: string | null
          sinais_sintomas?: string[]
          titulo: string
          updated_at?: string
        }
        Update: {
          bloco?: string
          bloco_label?: string
          created_at?: string
          id?: string
          id_gatilho?: string
          meta_mm?: string | null
          ordem?: number
          raciocinio_rc?: string | null
          sinais_sintomas?: string[]
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      diagnosticos_condutas: {
        Row: {
          aprazamento: string | null
          conduta_cde: string
          created_at: string
          diagnostico_id: string
          horario_padrao: string | null
          id: string
          ordem: number
          updated_at: string
        }
        Insert: {
          aprazamento?: string | null
          conduta_cde: string
          created_at?: string
          diagnostico_id: string
          horario_padrao?: string | null
          id?: string
          ordem?: number
          updated_at?: string
        }
        Update: {
          aprazamento?: string | null
          conduta_cde?: string
          created_at?: string
          diagnostico_id?: string
          horario_padrao?: string | null
          id?: string
          ordem?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnosticos_condutas_diagnostico_id_fkey"
            columns: ["diagnostico_id"]
            isOneToOne: false
            referencedRelation: "diagnosticos_aede"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_acceptances: {
        Row: {
          accepted_at: string
          device_id: string | null
          doc_date: string
          doc_version: string
          id: string
          privacy_version: string
          scope: string
          terms_version: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          accepted_at?: string
          device_id?: string | null
          doc_date: string
          doc_version: string
          id?: string
          privacy_version: string
          scope?: string
          terms_version: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_at?: string
          device_id?: string | null
          doc_date?: string
          doc_version?: string
          id?: string
          privacy_version?: string
          scope?: string
          terms_version?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mini_app_placements: {
        Row: {
          app_id: string
          codigo: number | null
          created_at: string
          id: string
          mini_app_id: string
          ordem: number
          section_id: string | null
          updated_at: string
        }
        Insert: {
          app_id: string
          codigo?: number | null
          created_at?: string
          id?: string
          mini_app_id: string
          ordem?: number
          section_id?: string | null
          updated_at?: string
        }
        Update: {
          app_id?: string
          codigo?: number | null
          created_at?: string
          id?: string
          mini_app_id?: string
          ordem?: number
          section_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mini_app_placements_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mini_app_placements_mini_app_id_fkey"
            columns: ["mini_app_id"]
            isOneToOne: false
            referencedRelation: "mini_apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mini_app_placements_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "app_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      mini_app_subtopics: {
        Row: {
          audio_url: string | null
          content_md: string | null
          created_at: string
          icon: string | null
          id: string
          is_draft: boolean
          mini_app_id: string
          ordem: number
          slug: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          content_md?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_draft?: boolean
          mini_app_id: string
          ordem?: number
          slug: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          content_md?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_draft?: boolean
          mini_app_id?: string
          ordem?: number
          slug?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mini_app_subtopics_mini_app_id_fkey"
            columns: ["mini_app_id"]
            isOneToOne: false
            referencedRelation: "mini_apps"
            referencedColumns: ["id"]
          },
        ]
      }
      mini_apps: {
        Row: {
          audio_url: string | null
          badges: Json
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
          badges?: Json
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
          badges?: Json
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
      orders: {
        Row: {
          amount_cents: number
          created_at: string | null
          currency: string | null
          external_id: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          pix_copy_paste: string | null
          pix_qr_code: string | null
          plan_slug: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string | null
          currency?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          pix_copy_paste?: string | null
          pix_qr_code?: string | null
          plan_slug: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string | null
          currency?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          pix_copy_paste?: string | null
          pix_qr_code?: string | null
          plan_slug?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_webhooks: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          payload: Json
          processed: boolean | null
          provider: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          payload: Json
          processed?: boolean | null
          provider: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          payload?: Json
          processed?: boolean | null
          provider?: string
        }
        Relationships: []
      }
      pending_purchases: {
        Row: {
          consumed_at: string | null
          created_at: string
          email: string
          id: string
          next_billing_date: string | null
          order_id: string | null
          plan_slug: string
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          consumed_at?: string | null
          created_at?: string
          email: string
          id?: string
          next_billing_date?: string | null
          order_id?: string | null
          plan_slug: string
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          consumed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          next_billing_date?: string | null
          order_id?: string | null
          plan_slug?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      plan_offers: {
        Row: {
          billing_period: string
          bonus_app_included: boolean
          cakto_checkout_url: string | null
          cakto_product_id: string | null
          certificates_included: number
          created_at: string
          id: string
          is_active: boolean
          period_days: number
          perks: Json
          plan_slug: string
          price_cents: number
          report_quota: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          billing_period: string
          bonus_app_included?: boolean
          cakto_checkout_url?: string | null
          cakto_product_id?: string | null
          certificates_included?: number
          created_at?: string
          id?: string
          is_active?: boolean
          period_days: number
          perks?: Json
          plan_slug: string
          price_cents: number
          report_quota?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          billing_period?: string
          bonus_app_included?: boolean
          cakto_checkout_url?: string | null
          cakto_product_id?: string | null
          certificates_included?: number
          created_at?: string
          id?: string
          is_active?: boolean
          period_days?: number
          perks?: Json
          plan_slug?: string
          price_cents?: number
          report_quota?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          categoria: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_online: boolean | null
          last_seen_at: string | null
          meta_cr_sent_at: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_online?: boolean | null
          last_seen_at?: string | null
          meta_cr_sent_at?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_online?: boolean | null
          last_seen_at?: string | null
          meta_cr_sent_at?: string | null
          phone?: string | null
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
      simulado_attempts: {
        Row: {
          category: string | null
          created_at: string
          display_name: string
          duration_seconds: number
          id: string
          quiz_slug: string
          quiz_title: string
          score: number
          total: number
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          display_name?: string
          duration_seconds?: number
          id?: string
          quiz_slug: string
          quiz_title: string
          score: number
          total: number
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          display_name?: string
          duration_seconds?: number
          id?: string
          quiz_slug?: string
          quiz_title?: string
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      student_comments: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          is_approved: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          cakto_checkout_url: string | null
          cakto_link_migracao: string | null
          cakto_product_id: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          mp_link: string | null
          name: string
          price_cents: number
          price_novo_cents: number | null
          price_original_migracao_cents: number | null
          price_promo_migracao_cents: number | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          cakto_checkout_url?: string | null
          cakto_link_migracao?: string | null
          cakto_product_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          mp_link?: string | null
          name: string
          price_cents?: number
          price_novo_cents?: number | null
          price_original_migracao_cents?: number | null
          price_promo_migracao_cents?: number | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          cakto_checkout_url?: string | null
          cakto_link_migracao?: string | null
          cakto_product_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          mp_link?: string | null
          name?: string
          price_cents?: number
          price_novo_cents?: number | null
          price_original_migracao_cents?: number | null
          price_promo_migracao_cents?: number | null
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
      trial_fingerprints: {
        Row: {
          blocked: boolean
          created_at: string
          device_id: string | null
          email: string
          id: string
          ip: string | null
          phone_digits: string | null
          user_id: string | null
        }
        Insert: {
          blocked?: boolean
          created_at?: string
          device_id?: string | null
          email: string
          id?: string
          ip?: string | null
          phone_digits?: string | null
          user_id?: string | null
        }
        Update: {
          blocked?: boolean
          created_at?: string
          device_id?: string | null
          email?: string
          id?: string
          ip?: string | null
          phone_digits?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      user_certificates: {
        Row: {
          app_name: string | null
          app_slug: string | null
          code: string
          hours: number
          id: string
          issued_at: string
          mini_app_id: string
          mini_app_name: string
          student_name: string
          user_id: string
        }
        Insert: {
          app_name?: string | null
          app_slug?: string | null
          code: string
          hours?: number
          id?: string
          issued_at?: string
          mini_app_id: string
          mini_app_name: string
          student_name: string
          user_id: string
        }
        Update: {
          app_name?: string | null
          app_slug?: string | null
          code?: string
          hours?: number
          id?: string
          issued_at?: string
          mini_app_id?: string
          mini_app_name?: string
          student_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_certificates_mini_app_id_fkey"
            columns: ["mini_app_id"]
            isOneToOne: false
            referencedRelation: "mini_apps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedbacks: {
        Row: {
          admin_response: string | null
          category: string
          created_at: string
          id: string
          improvement_suggestion: string | null
          is_public: boolean | null
          message: string
          rating: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          category: string
          created_at?: string
          id?: string
          improvement_suggestion?: string | null
          is_public?: boolean | null
          message: string
          rating: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          category?: string
          created_at?: string
          id?: string
          improvement_suggestion?: string | null
          is_public?: boolean | null
          message?: string
          rating?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          billing_period: string
          bonus_app_slug: string | null
          certificates_allowed: number
          created_at: string
          expires_at: string
          id: string
          notes: string | null
          plan_slug: string
          report_quota: number
          started_at: string
          status: string
          updated_at: string
          user_id: string
          was_trial: boolean
        }
        Insert: {
          billing_period?: string
          bonus_app_slug?: string | null
          certificates_allowed?: number
          created_at?: string
          expires_at: string
          id?: string
          notes?: string | null
          plan_slug: string
          report_quota?: number
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
          was_trial?: boolean
        }
        Update: {
          billing_period?: string
          bonus_app_slug?: string | null
          certificates_allowed?: number
          created_at?: string
          expires_at?: string
          id?: string
          notes?: string | null
          plan_slug?: string
          report_quota?: number
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
          was_trial?: boolean
        }
        Relationships: []
      }
      vip_comments: {
        Row: {
          author_name: string
          body: string
          created_at: string
          id: string
          is_official: boolean
          post_id: string
          user_id: string
        }
        Insert: {
          author_name?: string
          body: string
          created_at?: string
          id?: string
          is_official?: boolean
          post_id: string
          user_id: string
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          is_official?: boolean
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vip_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "vip_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      vip_post_likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vip_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "vip_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      vip_posts: {
        Row: {
          author_name: string
          body: string
          category: string
          comments_count: number
          created_at: string
          id: string
          is_official: boolean
          is_pinned: boolean
          likes_count: number
          title: string
          track: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name?: string
          body: string
          category?: string
          comments_count?: number
          created_at?: string
          id?: string
          is_official?: boolean
          is_pinned?: boolean
          likes_count?: number
          title: string
          track?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string
          body?: string
          category?: string
          comments_count?: number
          created_at?: string
          id?: string
          is_official?: boolean
          is_pinned?: boolean
          likes_count?: number
          title?: string
          track?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string
          external_id: string | null
          id: string
          payload: Json
          processed_at: string | null
          provider: string
          status: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type: string
          external_id?: string | null
          id?: string
          payload: Json
          processed_at?: string | null
          provider: string
          status?: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          external_id?: string | null
          id?: string
          payload?: Json
          processed_at?: string | null
          provider?: string
          status?: string
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
      expire_finished_trials: { Args: never; Returns: number }
      get_mini_app_meta: {
        Args: { _slug: string }
        Returns: {
          cakto_checkout_url: string
          description: string
          em_breve: boolean
          gratuito: boolean
          id: string
          name: string
          price_cents: number
          price_original_cents: number
          route_path: string
          slug: string
        }[]
      }
      has_active_membership: { Args: { _user_id: string }; Returns: boolean }
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
      internal_issue_certificate: {
        Args: {
          _custom_theme: string
          _hours: number
          _mini_app_id: string
          _user_id: string
        }
        Returns: undefined
      }
      issue_certificate:
        | {
            Args: { _mini_app_id: string }
            Returns: {
              code: string
              hours: number
              issued_at: string
              mini_app_name: string
              student_name: string
            }[]
          }
        | {
            Args: {
              _custom_theme?: string
              _hours?: number
              _mini_app_id: string
            }
            Returns: {
              code: string
              hours: number
              issued_at: string
              mini_app_name: string
              student_name: string
            }[]
          }
      list_mini_apps_catalog: {
        Args: never
        Returns: {
          badges: Json
          cakto_checkout_url: string
          cakto_product_id: string
          created_at: string
          description: string
          em_breve: boolean
          gratuito: boolean
          horas_certificado: number
          icon: string
          id: string
          is_active: boolean
          kind: string
          name: string
          price_cents: number
          price_original_cents: number
          route_path: string
          slug: string
          sort_order: number
          track_academico: boolean
          track_enfermeiro: boolean
          track_tecnico: boolean
          updated_at: string
        }[]
      }
      set_bonus_app: { Args: { _bonus_slug: string }; Returns: string }
      simulado_ranking: {
        Args: { _limit?: number }
        Returns: {
          accuracy: number
          attempts: number
          display_name: string
          total_points: number
          user_id: string
        }[]
      }
      validar_certificado: {
        Args: { _code: string }
        Returns: {
          app_name: string
          code: string
          hours: number
          issued_at: string
          mini_app_name: string
          student_name: string
        }[]
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
