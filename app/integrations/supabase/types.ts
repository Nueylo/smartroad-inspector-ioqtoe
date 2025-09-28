
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          user_type: 'citizen' | 'approved' | 'admin'
          weight: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          user_type?: 'citizen' | 'approved' | 'admin'
          weight?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          user_type?: 'citizen' | 'approved' | 'admin'
          weight?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          organization: string | null
          phone: string | null
          last_login: string | null
          role: 'citizen' | 'delegate' | 'supervisor' | 'ministry'
          weight: number
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          name: string
          organization?: string | null
          phone?: string | null
          last_login?: string | null
          role?: 'citizen' | 'delegate' | 'supervisor' | 'ministry'
          weight?: number
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          organization?: string | null
          phone?: string | null
          last_login?: string | null
          role?: 'citizen' | 'delegate' | 'supervisor' | 'ministry'
          weight?: number
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      defect_reports: {
        Row: {
          id: string
          latitude: number
          longitude: number
          location: unknown | null
          road_id: string | null
          road_name: string | null
          address: string | null
          dimensions: {
            depth: number
            width: number
            length: number
            surface: number
          }
          contours: string | null
          photos: string[] | null
          reported_by: string
          user_weight: number
          total_score: number
          priority: 'low' | 'medium' | 'high' | 'critical'
          status: 'reported' | 'validated' | 'in_progress' | 'repaired'
          type: 'hole' | 'crack' | 'erosion' | 'other'
          description: string | null
          weather_conditions: string | null
          traffic_impact: string | null
          estimated_repair_cost: number | null
          repair_deadline: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          latitude: number
          longitude: number
          location?: unknown | null
          road_id?: string | null
          road_name?: string | null
          address?: string | null
          dimensions?: {
            depth: number
            width: number
            length: number
            surface: number
          }
          contours?: string | null
          photos?: string[] | null
          reported_by: string
          user_weight?: number
          total_score?: number
          priority?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'reported' | 'validated' | 'in_progress' | 'repaired'
          type?: 'hole' | 'crack' | 'erosion' | 'other'
          description?: string | null
          weather_conditions?: string | null
          traffic_impact?: string | null
          estimated_repair_cost?: number | null
          repair_deadline?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          latitude?: number
          longitude?: number
          location?: unknown | null
          road_id?: string | null
          road_name?: string | null
          address?: string | null
          dimensions?: {
            depth: number
            width: number
            length: number
            surface: number
          }
          contours?: string | null
          photos?: string[] | null
          reported_by?: string
          user_weight?: number
          total_score?: number
          priority?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'reported' | 'validated' | 'in_progress' | 'repaired'
          type?: 'hole' | 'crack' | 'erosion' | 'other'
          description?: string | null
          weather_conditions?: string | null
          traffic_impact?: string | null
          estimated_repair_cost?: number | null
          repair_deadline?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "defect_reports_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      defect_validations: {
        Row: {
          id: string
          defect_id: string
          validated_by: string
          validated_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          defect_id: string
          validated_by: string
          validated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          defect_id?: string
          validated_by?: string
          validated_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "defect_validations_defect_id_fkey"
            columns: ["defect_id"]
            isOneToOne: false
            referencedRelation: "defect_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defect_validations_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      validations: {
        Row: {
          id: string
          report_id: string
          user_id: string
          user_weight: number
          validation_type: string | null
          photos: string[] | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          report_id: string
          user_id: string
          user_weight?: number
          validation_type?: string | null
          photos?: string[] | null
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          report_id?: string
          user_id?: string
          user_weight?: number
          validation_type?: string | null
          photos?: string[] | null
          notes?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "validations_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "defect_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      defect_priority: 'low' | 'medium' | 'high' | 'critical'
      defect_status: 'reported' | 'validated' | 'in_progress' | 'repaired'
      defect_type: 'hole' | 'crack' | 'erosion' | 'other'
      user_role: 'citizen' | 'delegate' | 'supervisor' | 'ministry'
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

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
