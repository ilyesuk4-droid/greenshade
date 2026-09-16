export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      inquiries: {
        Row: {
          id: string
          created_at: string
          full_name: string
          organization_name: string | null
          phone: string
          email: string | null
          wilaya: string
          indicative_quantity: number | null
          message: string | null
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          full_name: string
          organization_name?: string | null
          phone: string
          email?: string | null
          wilaya: string
          indicative_quantity?: number | null
          message?: string | null
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          organization_name?: string | null
          phone?: string
          email?: string | null
          wilaya?: string
          indicative_quantity?: number | null
          message?: string | null
          status?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: number
          phone: string
          email: string
          facebook_url: string
          instagram_url: string
          show_inquiry_form: boolean
          logo_url: string | null
          hero_image_url: string | null
          secondary_image_url: string | null
          hero_bg_url: string | null
          cactus_produit_url: string | null
          hydrogel_separator_url: string | null
          utilisation_patch_url: string | null
          pharmacie_pro_url: string | null
        }
        Insert: {
          id?: number
          phone?: string
          email?: string
          facebook_url?: string
          instagram_url?: string
          show_inquiry_form?: boolean
          logo_url?: string | null
          hero_image_url?: string | null
          secondary_image_url?: string | null
          hero_bg_url?: string | null
          cactus_produit_url?: string | null
          hydrogel_separator_url?: string | null
          utilisation_patch_url?: string | null
          pharmacie_pro_url?: string | null
        }
        Update: {
          id?: number
          phone?: string
          email?: string
          facebook_url?: string
          instagram_url?: string
          show_inquiry_form?: boolean
          logo_url?: string | null
          hero_image_url?: string | null
          secondary_image_url?: string | null
          hero_bg_url?: string | null
          cactus_produit_url?: string | null
          hydrogel_separator_url?: string | null
          utilisation_patch_url?: string | null
          pharmacie_pro_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
