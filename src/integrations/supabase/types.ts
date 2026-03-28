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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          club_ids: string[] | null
          content: string | null
          created_at: string
          feed_id: string | null
          guid: string | null
          id: string
          image_url: string | null
          published_at: string
          slug: string
          snippet: string | null
          source: string
          source_url: string | null
          title: string
        }
        Insert: {
          club_ids?: string[] | null
          content?: string | null
          created_at?: string
          feed_id?: string | null
          guid?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          slug: string
          snippet?: string | null
          source: string
          source_url?: string | null
          title: string
        }
        Update: {
          club_ids?: string[] | null
          content?: string | null
          created_at?: string
          feed_id?: string | null
          guid?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          slug?: string
          snippet?: string | null
          source?: string
          source_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "rss_feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          city: string
          color: string
          created_at: string
          id: string
          league: string
          name: string
          season: string
          short_name: string
          updated_at: string
        }
        Insert: {
          city: string
          color: string
          created_at?: string
          id: string
          league: string
          name: string
          season?: string
          short_name: string
          updated_at?: string
        }
        Update: {
          city?: string
          color?: string
          created_at?: string
          id?: string
          league?: string
          name?: string
          season?: string
          short_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      league_standings: {
        Row: {
          club_id: string | null
          drawn: number
          goal_difference: number
          goals_against: number
          goals_for: number
          id: string
          lost: number
          played: number
          points: number
          position: number
          team: string
          updated_at: string
          won: number
        }
        Insert: {
          club_id?: string | null
          drawn?: number
          goal_difference?: number
          goals_against?: number
          goals_for?: number
          id?: string
          lost?: number
          played?: number
          points?: number
          position: number
          team: string
          updated_at?: string
          won?: number
        }
        Update: {
          club_id?: string | null
          drawn?: number
          goal_difference?: number
          goals_against?: number
          goals_for?: number
          id?: string
          lost?: number
          played?: number
          points?: number
          position?: number
          team?: string
          updated_at?: string
          won?: number
        }
        Relationships: []
      }
      rss_feeds: {
        Row: {
          club_ids: string[] | null
          created_at: string
          id: string
          is_active: boolean
          last_synced_at: string | null
          name: string
          url: string
        }
        Insert: {
          club_ids?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_synced_at?: string | null
          name: string
          url: string
        }
        Update: {
          club_ids?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_synced_at?: string | null
          name?: string
          url?: string
        }
        Relationships: []
      }
      site_stats: {
        Row: {
          id: string
          visitor_count: number
        }
        Insert: {
          id?: string
          visitor_count?: number
        }
        Update: {
          id?: string
          visitor_count?: number
        }
        Relationships: []
      }
      user_club_preferences: {
        Row: {
          club_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          club_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          club_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      video_channels: {
        Row: {
          channel_id: string
          club_ids: string[] | null
          created_at: string
          id: string
          is_active: boolean
          last_synced_at: string | null
          name: string
          title_filter: string | null
          url: string
        }
        Insert: {
          channel_id: string
          club_ids?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_synced_at?: string | null
          name: string
          title_filter?: string | null
          url: string
        }
        Update: {
          channel_id?: string
          club_ids?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_synced_at?: string | null
          name?: string
          title_filter?: string | null
          url?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          channel_id: string | null
          club_ids: string[] | null
          created_at: string
          description: string | null
          embeddable: boolean
          id: string
          published_at: string
          slug: string
          thumbnail_url: string | null
          title: string
          video_id: string
        }
        Insert: {
          channel_id?: string | null
          club_ids?: string[] | null
          created_at?: string
          description?: string | null
          embeddable?: boolean
          id?: string
          published_at?: string
          slug: string
          thumbnail_url?: string | null
          title: string
          video_id: string
        }
        Update: {
          channel_id?: string | null
          club_ids?: string[] | null
          created_at?: string
          description?: string | null
          embeddable?: boolean
          id?: string
          published_at?: string
          slug?: string
          thumbnail_url?: string | null
          title?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "video_channels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_rss_feed: {
        Args: {
          p_club_ids?: string[]
          p_is_active?: boolean
          p_name: string
          p_url: string
        }
        Returns: string
      }
      add_video_channel: {
        Args: {
          p_channel_id: string
          p_club_ids?: string[]
          p_is_active?: boolean
          p_name: string
          p_title_filter?: string
          p_url: string
        }
        Returns: string
      }
      increment_visitor_count: { Args: never; Returns: number }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
