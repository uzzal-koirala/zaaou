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
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          facebook_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          name: string
          role: string | null
          slug: string
          twitter_url: string | null
          updated_at: string
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          name: string
          role?: string | null
          slug: string
          twitter_url?: string | null
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          name?: string
          role?: string | null
          slug?: string
          twitter_url?: string | null
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      blog_settings: {
        Row: {
          comments_auto_approve: boolean
          comments_enabled: boolean
          created_at: string
          id: string
          notifications_enabled: boolean
          singleton: boolean
          updated_at: string
        }
        Insert: {
          comments_auto_approve?: boolean
          comments_enabled?: boolean
          created_at?: string
          id?: string
          notifications_enabled?: boolean
          singleton?: boolean
          updated_at?: string
        }
        Update: {
          comments_auto_approve?: boolean
          comments_enabled?: boolean
          created_at?: string
          id?: string
          notifications_enabled?: boolean
          singleton?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          email: string
          id: string
          name: string
          post_id: string
          status: Database["public"]["Enums"]["comment_status"]
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          email: string
          id?: string
          name: string
          post_id: string
          status?: Database["public"]["Enums"]["comment_status"]
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          post_id?: string
          status?: Database["public"]["Enums"]["comment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          apply_url: string
          created_at: string
          department: string
          description: string
          display_order: number
          id: string
          is_active: boolean
          job_type: string
          location: string
          title: string
          updated_at: string
        }
        Insert: {
          apply_url: string
          created_at?: string
          department?: string
          description: string
          display_order?: number
          id?: string
          is_active?: boolean
          job_type?: string
          location?: string
          title: string
          updated_at?: string
        }
        Update: {
          apply_url?: string
          created_at?: string
          department?: string
          description?: string
          display_order?: number
          id?: string
          is_active?: boolean
          job_type?: string
          location?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          source: string | null
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          source?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          source?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      post_views: {
        Row: {
          created_at: string
          id: string
          post_id: string
          viewed_on: string
          visitor_hash: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          viewed_on?: string
          visitor_hash: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          viewed_on?: string
          visitor_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          reading_time_minutes: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          reading_time_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          reading_time_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          cover_image_url: string | null
          created_at: string
          cuisine: string | null
          delivery_time_minutes: number | null
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          is_featured: boolean
          name: string
          phone: string | null
          price_range: string | null
          rating: number | null
          slug: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          address?: string | null
          cover_image_url?: string | null
          created_at?: string
          cuisine?: string | null
          delivery_time_minutes?: number | null
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name: string
          phone?: string | null
          price_range?: string | null
          rating?: number | null
          slug: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          address?: string | null
          cover_image_url?: string | null
          created_at?: string
          cuisine?: string | null
          delivery_time_minutes?: number | null
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name?: string
          phone?: string | null
          price_range?: string | null
          rating?: number | null
          slug?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          avatar_url: string | null
          content: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          is_featured: boolean
          name: string
          rating: number
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          content: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name: string
          rating?: number
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          content?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name?: string
          rating?: number
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      riders: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          joined_at: string
          name: string
          phone: string | null
          rating: number | null
          status: string
          total_deliveries: number
          updated_at: string
          vehicle_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          joined_at?: string
          name: string
          phone?: string | null
          rating?: number | null
          status?: string
          total_deliveries?: number
          updated_at?: string
          vehicle_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          joined_at?: string
          name?: string
          phone?: string | null
          rating?: number | null
          status?: string
          total_deliveries?: number
          updated_at?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
      site_notifications: {
        Row: {
          created_at: string
          display_order: number
          icon_url: string | null
          id: string
          is_active: boolean
          message: string
          time_ago_label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon_url?: string | null
          id?: string
          is_active?: boolean
          message: string
          time_ago_label?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon_url?: string | null
          id?: string
          is_active?: boolean
          message?: string
          time_ago_label?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_order: number
          facebook_url: string | null
          id: string
          instagram_url: string | null
          is_active: boolean
          is_featured: boolean
          linkedin_url: string | null
          name: string
          role: string
          twitter_url: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_order?: number
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          linkedin_url?: string | null
          name: string
          role: string
          twitter_url?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_order?: number
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          linkedin_url?: string | null
          name?: string
          role?: string
          twitter_url?: string | null
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_author_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_post_author: {
        Args: { _post_id: string; _user_id: string }
        Returns: boolean
      }
      slugify: { Args: { value: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "user" | "author"
      comment_status: "pending" | "approved" | "rejected"
      post_status: "draft" | "published"
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
      app_role: ["admin", "user", "author"],
      comment_status: ["pending", "approved", "rejected"],
      post_status: ["draft", "published"],
    },
  },
} as const
