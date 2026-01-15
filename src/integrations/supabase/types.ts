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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      achievement_comments: {
        Row: {
          achievement_id: string
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_comments_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement_dislikes: {
        Row: {
          achievement_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_dislikes_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement_likes: {
        Row: {
          achievement_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_likes_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement_media: {
        Row: {
          achievement_id: string
          created_at: string | null
          duration: number | null
          file_name: string | null
          file_size: number | null
          id: string
          media_type: string
          media_url: string
          order_index: number
          thumbnail_url: string | null
        }
        Insert: {
          achievement_id: string
          created_at?: string | null
          duration?: number | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          media_type: string
          media_url: string
          order_index?: number
          thumbnail_url?: string | null
        }
        Update: {
          achievement_id?: string
          created_at?: string | null
          duration?: number | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          media_type?: string
          media_url?: string
          order_index?: number
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievement_media_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement_views: {
        Row: {
          achievement_id: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          achievement_id: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          achievement_id?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievement_views_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      alumni_event_attendees: {
        Row: {
          created_at: string
          event_id: string
          id: string
          rsvp_status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          rsvp_status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          rsvp_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumni_event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "alumni_events"
            referencedColumns: ["id"]
          },
        ]
      }
      alumni_events: {
        Row: {
          created_at: string
          created_by: string
          description: string
          event_date: string
          event_type: string
          id: string
          image_url: string | null
          location: string | null
          title: string
          university_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          event_date: string
          event_type: string
          id?: string
          image_url?: string | null
          location?: string | null
          title: string
          university_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          event_date?: string
          event_type?: string
          id?: string
          image_url?: string | null
          location?: string | null
          title?: string
          university_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumni_events_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities_old"
            referencedColumns: ["id"]
          },
        ]
      }
      alumni_profiles: {
        Row: {
          bio: string | null
          created_at: string
          current_company: string | null
          current_position: string | null
          email: string
          full_name: string
          graduation_class_id: string | null
          graduation_year: number | null
          id: string
          industry: string | null
          linkedin_url: string | null
          mentoring_available: boolean
          skills: string[] | null
          university_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          email: string
          full_name: string
          graduation_class_id?: string | null
          graduation_year?: number | null
          id?: string
          industry?: string | null
          linkedin_url?: string | null
          mentoring_available?: boolean
          skills?: string[] | null
          university_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          email?: string
          full_name?: string
          graduation_class_id?: string | null
          graduation_year?: number | null
          id?: string
          industry?: string | null
          linkedin_url?: string | null
          mentoring_available?: boolean
          skills?: string[] | null
          university_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumni_profiles_graduation_class_id_fkey"
            columns: ["graduation_class_id"]
            isOneToOne: false
            referencedRelation: "classes_old"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alumni_profiles_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities_old"
            referencedColumns: ["id"]
          },
        ]
      }
      alumni_success_stories: {
        Row: {
          achievement_type: string
          alumni_id: string
          created_at: string
          featured: boolean
          id: string
          story: string
          title: string
          updated_at: string
        }
        Insert: {
          achievement_type: string
          alumni_id: string
          created_at?: string
          featured?: boolean
          id?: string
          story: string
          title: string
          updated_at?: string
        }
        Update: {
          achievement_type?: string
          alumni_id?: string
          created_at?: string
          featured?: boolean
          id?: string
          story?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          media_type: string | null
          media_url: string | null
          title: string
          university_id: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          title: string
          university_id: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          title?: string
          university_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities_old"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          admission_number: string
          approved_at: string | null
          approved_by: string | null
          class_id: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admission_number: string
          approved_at?: string | null
          approved_by?: string | null
          class_id: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admission_number?: string
          approved_at?: string | null
          approved_by?: string | null
          class_id?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes_old"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_completions: {
        Row: {
          assignment_id: string
          completed_at: string
          id: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          completed_at?: string
          id?: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          completed_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_completions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          class_id: string | null
          class_unit_id: string | null
          created_at: string
          created_by: string
          deadline: string | null
          description: string | null
          file_url: string | null
          id: string
          link_url: string | null
          title: string
          unit_id: string
        }
        Insert: {
          class_id?: string | null
          class_unit_id?: string | null
          created_at?: string
          created_by: string
          deadline?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          link_url?: string | null
          title: string
          unit_id: string
        }
        Update: {
          class_id?: string | null
          class_unit_id?: string | null
          created_at?: string
          created_by?: string
          deadline?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          link_url?: string | null
          title?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_assignments_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_assignments_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "legacy_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_assignments_class_unit"
            columns: ["class_unit_id"]
            isOneToOne: false
            referencedRelation: "class_units"
            referencedColumns: ["id"]
          },
        ]
      }
      class_chat_messages: {
        Row: {
          class_id: string | null
          created_at: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          message: string | null
          message_type: string | null
          reply_to_id: string | null
          sender_id: string | null
          updated_at: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          message?: string | null
          message_type?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          message?: string | null
          message_type?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_chat_messages_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_chat_messages_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "legacy_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_chat_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "class_chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      class_chatrooms: {
        Row: {
          class_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          class_id: string
          created_at?: string | null
          id?: string
        }
        Update: {
          class_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_chatrooms_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: true
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_chatrooms_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: true
            referencedRelation: "legacy_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_join_requests: {
        Row: {
          class_id: string
          id: string
          processed_at: string | null
          processed_by: string | null
          rejection_reason: string | null
          request_message: string | null
          requested_at: string | null
          requester_email: string
          requester_name: string
          status: string | null
          user_id: string
        }
        Insert: {
          class_id: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          rejection_reason?: string | null
          request_message?: string | null
          requested_at?: string | null
          requester_email: string
          requester_name: string
          status?: string | null
          user_id: string
        }
        Update: {
          class_id?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          rejection_reason?: string | null
          request_message?: string | null
          requested_at?: string | null
          requester_email?: string
          requester_name?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_join_requests_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_join_requests_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "legacy_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_members: {
        Row: {
          class_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          class_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          class_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_members_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_members_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "legacy_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_messages: {
        Row: {
          chatroom_id: string
          created_at: string | null
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          media_url: string | null
          message: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chatroom_id: string
          created_at?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          media_url?: string | null
          message?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          chatroom_id?: string
          created_at?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          media_url?: string | null
          message?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_messages_chatroom_id_fkey"
            columns: ["chatroom_id"]
            isOneToOne: false
            referencedRelation: "class_chatrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      class_units: {
        Row: {
          class_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_index: number
          unit_order: number | null
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_index?: number
          unit_order?: number | null
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          unit_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_units_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_units_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "legacy_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          class_code: string | null
          code_created_at: string | null
          code_expires: boolean | null
          code_expires_at: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          is_searchable: boolean | null
          name: string
          share_code: string | null
          updated_at: string | null
        }
        Insert: {
          class_code?: string | null
          code_created_at?: string | null
          code_expires?: boolean | null
          code_expires_at?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          is_searchable?: boolean | null
          name: string
          share_code?: string | null
          updated_at?: string | null
        }
        Update: {
          class_code?: string | null
          code_created_at?: string | null
          code_expires?: boolean | null
          code_expires_at?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          is_searchable?: boolean | null
          name?: string
          share_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      classes_old: {
        Row: {
          course_group: string
          course_name: string
          course_year: number
          created_at: string
          graduation_date: string | null
          graduation_year: number | null
          id: string
          is_graduated: boolean
          semester: number
          university_id: string
          updated_at: string
        }
        Insert: {
          course_group: string
          course_name: string
          course_year: number
          created_at?: string
          graduation_date?: string | null
          graduation_year?: number | null
          id?: string
          is_graduated?: boolean
          semester: number
          university_id: string
          updated_at?: string
        }
        Update: {
          course_group?: string
          course_name?: string
          course_year?: number
          created_at?: string
          graduation_date?: string | null
          graduation_year?: number | null
          id?: string
          is_graduated?: boolean
          semester?: number
          university_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities_old"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          commented_by: string
          content: string
          created_at: string
          id: string
          upload_id: string
        }
        Insert: {
          commented_by: string
          content: string
          created_at?: string
          id?: string
          upload_id: string
        }
        Update: {
          commented_by?: string
          content?: string
          created_at?: string
          id?: string
          upload_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      concerns: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          id: string
          message: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          message: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          message?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      countries_old: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          university_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          university_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          university_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_visits: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown
          page_path: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string
          visit_date: string
          visit_duration: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id: string
          visit_date?: string
          visit_duration?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string
          visit_date?: string
          visit_duration?: number | null
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          event_date: string
          id: string
          location: string | null
          title: string
          unit_id: string
          venue: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          title: string
          unit_id: string
          venue?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          title?: string
          unit_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          application_deadline: string | null
          application_url: string | null
          benefits: string | null
          company: string
          contact_email: string | null
          created_at: string
          created_by: string
          description: string
          id: string
          job_type: string
          location: string
          requirements: string
          salary_range: string | null
          target_countries: string[] | null
          title: string
          university_id: string | null
          visibility: string
        }
        Insert: {
          application_deadline?: string | null
          application_url?: string | null
          benefits?: string | null
          company: string
          contact_email?: string | null
          created_at?: string
          created_by: string
          description: string
          id?: string
          job_type: string
          location: string
          requirements: string
          salary_range?: string | null
          target_countries?: string[] | null
          title: string
          university_id?: string | null
          visibility?: string
        }
        Update: {
          application_deadline?: string | null
          application_url?: string | null
          benefits?: string | null
          company?: string
          contact_email?: string | null
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          job_type?: string
          location?: string
          requirements?: string
          salary_range?: string | null
          target_countries?: string[] | null
          title?: string
          university_id?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_created_by_profiles_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "job_postings_created_by_profiles_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "wall_of_fame_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "job_postings_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities_old"
            referencedColumns: ["id"]
          },
        ]
      }
      message_likes: {
        Row: {
          created_at: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_likes_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_likes_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "message_likes_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wall_of_fame_mv"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          delivery_status: string | null
          id: string
          likes_count: number
          media_duration: number | null
          media_filename: string | null
          media_size: number | null
          media_thumbnail: string | null
          media_url: string | null
          message_type: string
          reply_to_message_id: string | null
          university_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          delivery_status?: string | null
          id?: string
          likes_count?: number
          media_duration?: number | null
          media_filename?: string | null
          media_size?: number | null
          media_thumbnail?: string | null
          media_url?: string | null
          message_type?: string
          reply_to_message_id?: string | null
          university_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          delivery_status?: string | null
          id?: string
          likes_count?: number
          media_duration?: number | null
          media_filename?: string | null
          media_size?: number | null
          media_thumbnail?: string | null
          media_url?: string | null
          message_type?: string
          reply_to_message_id?: string | null
          university_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_reply_to_message_id_fkey"
            columns: ["reply_to_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wall_of_fame_mv"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          admission_number: string | null
          bio: string | null
          character_id: string | null
          class_id: string | null
          country_id: string | null
          course_id: string | null
          created_at: string
          created_from_application: boolean | null
          email: string
          follower_count: number | null
          following_count: number | null
          full_name: string
          id: string
          last_login: string | null
          points: number
          privacy_level: string | null
          profile_completed: boolean | null
          profile_picture_url: string | null
          rank: Database["public"]["Enums"]["user_rank"]
          role: Database["public"]["Enums"]["user_role"]
          semester: string | null
          student_status: string | null
          university_id: string | null
          updated_at: string
          user_id: string | null
          video_count: number | null
          year: string | null
        }
        Insert: {
          admission_number?: string | null
          bio?: string | null
          character_id?: string | null
          class_id?: string | null
          country_id?: string | null
          course_id?: string | null
          created_at?: string
          created_from_application?: boolean | null
          email: string
          follower_count?: number | null
          following_count?: number | null
          full_name: string
          id?: string
          last_login?: string | null
          points?: number
          privacy_level?: string | null
          profile_completed?: boolean | null
          profile_picture_url?: string | null
          rank?: Database["public"]["Enums"]["user_rank"]
          role?: Database["public"]["Enums"]["user_role"]
          semester?: string | null
          student_status?: string | null
          university_id?: string | null
          updated_at?: string
          user_id?: string | null
          video_count?: number | null
          year?: string | null
        }
        Update: {
          admission_number?: string | null
          bio?: string | null
          character_id?: string | null
          class_id?: string | null
          country_id?: string | null
          course_id?: string | null
          created_at?: string
          created_from_application?: boolean | null
          email?: string
          follower_count?: number | null
          following_count?: number | null
          full_name?: string
          id?: string
          last_login?: string | null
          points?: number
          privacy_level?: string | null
          profile_completed?: boolean | null
          profile_picture_url?: string | null
          rank?: Database["public"]["Enums"]["user_rank"]
          role?: Database["public"]["Enums"]["user_role"]
          semester?: string | null
          student_status?: string | null
          university_id?: string | null
          updated_at?: string
          user_id?: string | null
          video_count?: number | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_country"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_course"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profiles_university"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes_old"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      public_events: {
        Row: {
          created_at: string
          created_by: string
          description: string
          event_date: string | null
          id: string
          image_url: string | null
          location: string | null
          target_countries: string[] | null
          title: string
          university_id: string | null
          visibility: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          target_countries?: string[] | null
          title: string
          university_id?: string | null
          visibility?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          target_countries?: string[] | null
          title?: string
          university_id?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_events_created_by_profiles_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "public_events_created_by_profiles_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "wall_of_fame_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "public_events_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities_old"
            referencedColumns: ["id"]
          },
        ]
      }
      student_alumni_interactions: {
        Row: {
          alumni_id: string
          created_at: string
          id: string
          interaction_type: string
          message: string
          responded_at: string | null
          status: string
          student_id: string
        }
        Insert: {
          alumni_id: string
          created_at?: string
          id?: string
          interaction_type: string
          message: string
          responded_at?: string | null
          status?: string
          student_id: string
        }
        Update: {
          alumni_id?: string
          created_at?: string
          id?: string
          interaction_type?: string
          message?: string
          responded_at?: string | null
          status?: string
          student_id?: string
        }
        Relationships: []
      }
      units: {
        Row: {
          class_id: string
          class_unit_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          class_id: string
          class_unit_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          class_id?: string
          class_unit_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes_old"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_class_unit_id_fkey"
            columns: ["class_unit_id"]
            isOneToOne: false
            referencedRelation: "class_units"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          country_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          country_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          country_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "universities_country_id_fkey1"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      universities_old: {
        Row: {
          country_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          country_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          country_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "universities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries_old"
            referencedColumns: ["id"]
          },
        ]
      }
      upload_reactions: {
        Row: {
          created_at: string
          id: string
          reaction_type: string
          upload_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reaction_type: string
          upload_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reaction_type?: string
          upload_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "upload_reactions_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      uploads: {
        Row: {
          class_id: string | null
          class_unit_id: string | null
          created_at: string
          description: string | null
          dislikes_count: number
          file_type: string | null
          file_url: string | null
          id: string
          likes_count: number
          link_url: string | null
          title: string
          unit_id: string
          upload_type: string
          uploaded_by: string
        }
        Insert: {
          class_id?: string | null
          class_unit_id?: string | null
          created_at?: string
          description?: string | null
          dislikes_count?: number
          file_type?: string | null
          file_url?: string | null
          id?: string
          likes_count?: number
          link_url?: string | null
          title: string
          unit_id: string
          upload_type: string
          uploaded_by: string
        }
        Update: {
          class_id?: string | null
          class_unit_id?: string | null
          created_at?: string
          description?: string | null
          dislikes_count?: number
          file_type?: string | null
          file_url?: string | null
          id?: string
          likes_count?: number
          link_url?: string | null
          title?: string
          unit_id?: string
          upload_type?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_uploads_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_uploads_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "legacy_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_uploads_class_unit"
            columns: ["class_unit_id"]
            isOneToOne: false
            referencedRelation: "class_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploads_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploads_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "legacy_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploads_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      user_hidden_units: {
        Row: {
          hidden_at: string | null
          id: string
          unit_id: string
          user_id: string
        }
        Insert: {
          hidden_at?: string | null
          id?: string
          unit_id: string
          user_id: string
        }
        Update: {
          hidden_at?: string | null
          id?: string
          unit_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_hidden_units_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "class_units"
            referencedColumns: ["id"]
          },
        ]
      }
      video_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_likes: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_views: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_views_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string | null
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_applications_view: {
        Row: {
          admission_number: string | null
          approved_at: string | null
          class_id: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          rejected_at: string | null
          rejection_reason: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admission_number?: string | null
          approved_at?: string | null
          class_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admission_number?: string | null
          approved_at?: string | null
          class_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes_old"
            referencedColumns: ["id"]
          },
        ]
      }
      legacy_classes: {
        Row: {
          course_group: string | null
          course_name: string | null
          course_year: number | null
          created_at: string | null
          creator_id: string | null
          id: string | null
          semester: string | null
          university_id: string | null
          updated_at: string | null
        }
        Insert: {
          course_group?: never
          course_name?: string | null
          course_year?: never
          created_at?: string | null
          creator_id?: string | null
          id?: string | null
          semester?: never
          university_id?: never
          updated_at?: string | null
        }
        Update: {
          course_group?: never
          course_name?: string | null
          course_year?: never
          created_at?: string | null
          creator_id?: string | null
          id?: string | null
          semester?: never
          university_id?: never
          updated_at?: string | null
        }
        Relationships: []
      }
      wall_of_fame_mv: {
        Row: {
          class_description: string | null
          class_id: string | null
          class_name: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          points: number | null
          profile_picture_url: string | null
          rank: Database["public"]["Enums"]["user_rank"] | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes_old"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      add_class_member: {
        Args: { p_class_id: string; p_role?: string; p_user_id: string }
        Returns: string
      }
      approve_class_join_request:
        | { Args: { p_request_id: string }; Returns: boolean }
        | {
            Args: { p_processed_by: string; p_request_id: string }
            Returns: boolean
          }
      approve_join_request: {
        Args: { p_approver_id: string; p_request_id: string }
        Returns: boolean
      }
      check_existing_class_access: {
        Args: { class_uuid: string; user_uuid: string }
        Returns: {
          application_status: string
          has_application: boolean
          has_profile: boolean
          profile_role: string
        }[]
      }
      check_user_disliked_achievement: {
        Args: { achievement_id_param: string; user_id_param: string }
        Returns: boolean
      }
      cleanup_old_profile_pictures: { Args: never; Returns: undefined }
      create_join_request: {
        Args: {
          p_class_id: string
          p_request_message?: string
          p_requester_email: string
          p_requester_name: string
          p_user_id: string
        }
        Returns: string
      }
      generate_class_code: { Args: never; Returns: string }
      generate_class_share_code: { Args: never; Returns: string }
      generate_secure_class_code: { Args: never; Returns: string }
      get_achievement_comments: {
        Args: {
          p_achievement_id: string
          p_limit_count?: number
          p_offset_count?: number
        }
        Returns: {
          achievement_id: string
          author_name: string
          author_picture: string
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }[]
      }
      get_achievement_counts: {
        Args: { achievement_id_param: string }
        Returns: {
          comments_count: number
          dislikes_count: number
          likes_count: number
          media_count: number
          views_count: number
        }[]
      }
      get_achievement_counts_simple: {
        Args: { achievement_id_param: string }
        Returns: {
          comments_count: number
          dislikes_count: number
          likes_count: number
          media_count: number
          views_count: number
        }[]
      }
      get_achievement_dislikes_count: {
        Args: { achievement_id_param: string }
        Returns: number
      }
      get_achievement_media: {
        Args: { p_achievement_id: string }
        Returns: {
          achievement_id: string
          created_at: string
          duration: number
          file_name: string
          file_size: number
          id: string
          media_type: string
          media_url: string
          order_index: number
          thumbnail_url: string
        }[]
      }
      get_achievement_with_counts: {
        Args: { achievement_id_param: string; user_id_param?: string }
        Returns: {
          author_email: string
          author_name: string
          author_picture: string
          comments_count: number
          country_name: string
          course_group: string
          course_name: string
          course_year: number
          created_at: string
          description: string
          dislikes_count: number
          id: string
          likes_count: number
          media_count: number
          semester: number
          title: string
          university_name: string
          updated_at: string
          user_disliked: boolean
          user_id: string
          user_liked: boolean
          views_count: number
        }[]
      }
      get_achievement_with_details: {
        Args: { p_achievement_id: string }
        Returns: {
          author_email: string
          author_name: string
          author_picture: string
          comments_count: number
          country_name: string
          course_group: string
          course_name: string
          course_year: number
          created_at: string
          description: string
          id: string
          likes_count: number
          media_count: number
          semester: number
          title: string
          university_name: string
          updated_at: string
          user_id: string
          user_liked: boolean
          views_count: number
        }[]
      }
      get_all_achievements_with_counts: {
        Args: { user_id_param?: string }
        Returns: {
          author_email: string
          author_name: string
          author_picture: string
          comments_count: number
          country_name: string
          course_group: string
          course_name: string
          course_year: number
          created_at: string
          description: string
          dislikes_count: number
          id: string
          likes_count: number
          media_count: number
          semester: number
          title: string
          university_name: string
          updated_at: string
          user_disliked: boolean
          user_id: string
          user_liked: boolean
          views_count: number
        }[]
      }
      get_all_achievements_with_counts_final: {
        Args: { user_id_param?: string }
        Returns: {
          author_email: string
          author_name: string
          author_picture: string
          comments_count: number
          country_name: string
          course_group: string
          course_name: string
          course_year: number
          created_at: string
          description: string
          dislikes_count: number
          id: string
          likes_count: number
          media_count: number
          semester: number
          title: string
          university_name: string
          updated_at: string
          user_disliked: boolean
          user_id: string
          user_liked: boolean
          views_count: number
        }[]
      }
      get_all_achievements_with_counts_simple: {
        Args: { user_id_param?: string }
        Returns: {
          author_email: string
          author_name: string
          author_picture: string
          comments_count: number
          country_name: string
          course_group: string
          course_name: string
          course_year: number
          created_at: string
          description: string
          dislikes_count: number
          id: string
          likes_count: number
          media_count: number
          semester: number
          title: string
          university_name: string
          updated_at: string
          user_disliked: boolean
          user_id: string
          user_liked: boolean
          views_count: number
        }[]
      }
      get_all_achievements_with_counts_ultra_simple: {
        Args: { user_id_param?: string }
        Returns: {
          author_email: string
          author_name: string
          author_picture: string
          comments_count: number
          country_name: string
          course_group: string
          course_name: string
          course_year: number
          created_at: string
          description: string
          dislikes_count: number
          id: string
          likes_count: number
          media_count: number
          semester: number
          title: string
          university_name: string
          updated_at: string
          user_disliked: boolean
          user_id: string
          user_liked: boolean
          views_count: number
        }[]
      }
      get_all_achievements_with_details: {
        Args: { p_limit_count?: number; p_offset_count?: number }
        Returns: {
          author_email: string
          author_name: string
          author_picture: string
          comments_count: number
          country_name: string
          course_group: string
          course_name: string
          course_year: number
          created_at: string
          description: string
          id: string
          likes_count: number
          media_count: number
          semester: number
          title: string
          university_name: string
          updated_at: string
          user_id: string
          user_liked: boolean
          views_count: number
        }[]
      }
      get_analytics_data: {
        Args: { p_period?: string }
        Returns: {
          avg_session_duration: number
          period_end: string
          period_start: string
          total_visits: number
          unique_users: number
        }[]
      }
      get_available_countries: {
        Args: never
        Returns: {
          country_id: string
          country_name: string
        }[]
      }
      get_chat_message_with_profile: {
        Args: { message_id: string }
        Returns: {
          class_id: string
          created_at: string
          file_name: string
          file_url: string
          id: string
          message: string
          message_type: string
          sender_avatar: string
          sender_id: string
          sender_name: string
        }[]
      }
      get_class_chat_messages: {
        Args: { class_uuid: string; limit_count?: number }
        Returns: {
          class_id: string
          created_at: string
          file_name: string
          file_url: string
          id: string
          message: string
          message_type: string
          sender_avatar: string
          sender_id: string
          sender_name: string
        }[]
      }
      get_class_join_request_count: {
        Args: { p_class_id: string }
        Returns: number
      }
      get_class_join_requests: {
        Args: { p_class_id: string }
        Returns: {
          id: string
          request_message: string
          requested_at: string
          requester_email: string
          requester_name: string
          status: string
          user_id: string
        }[]
      }
      get_class_members: {
        Args: { p_class_id: string }
        Returns: {
          email: string
          full_name: string
          id: string
          joined_at: string
          profile_picture_url: string
          role: string
          user_id: string
        }[]
      }
      get_conversation_participants: {
        Args: { user_id_param: string }
        Returns: {
          last_message: string
          last_message_time: string
          participant_avatar: string
          participant_email: string
          participant_id: string
          participant_name: string
          unread_count: number
        }[]
      }
      get_daily_analytics: {
        Args: { p_days?: number }
        Returns: {
          avg_session_duration: number
          day_date: string
          unique_users_count: number
          visits_count: number
        }[]
      }
      get_hourly_analytics: {
        Args: { p_hours?: number }
        Returns: {
          hour_start: string
          unique_users_count: number
          visits_count: number
        }[]
      }
      get_profile_picture_url: {
        Args: { user_id_param: string }
        Returns: string
      }
      get_user_achievement_status: {
        Args: { achievement_id_param: string; user_id_param: string }
        Returns: {
          user_disliked: boolean
          user_liked: boolean
        }[]
      }
      get_user_achievements_with_details: {
        Args: {
          p_limit_count?: number
          p_offset_count?: number
          p_user_uuid: string
        }
        Returns: {
          author_email: string
          author_name: string
          author_picture: string
          comments_count: number
          country_name: string
          course_group: string
          course_name: string
          course_year: number
          created_at: string
          description: string
          id: string
          likes_count: number
          media_count: number
          semester: number
          title: string
          university_name: string
          updated_at: string
          user_id: string
          user_liked: boolean
          views_count: number
        }[]
      }
      get_user_join_requests: {
        Args: { p_user_id: string }
        Returns: {
          class_description: string
          class_id: string
          class_name: string
          id: string
          rejection_reason: string
          requested_at: string
          status: string
        }[]
      }
      get_user_university_id: {
        Args: { user_id_param: string }
        Returns: string
      }
      graduate_class: { Args: { class_id_param: string }; Returns: undefined }
      is_admin: { Args: { user_uuid?: string }; Returns: boolean }
      is_class_code_valid: { Args: { code: string }; Returns: boolean }
      is_class_member: {
        Args: { p_class_id: string; p_user_id: string }
        Returns: boolean
      }
      refresh_wall_of_fame: { Args: never; Returns: undefined }
      regenerate_class_code: {
        Args: {
          p_class_id: string
          p_creator_id: string
          p_expires?: boolean
          p_expires_in_hours?: number
        }
        Returns: string
      }
      reject_class_join_request: {
        Args: {
          p_processed_by: string
          p_rejection_reason?: string
          p_request_id: string
        }
        Returns: boolean
      }
      reject_join_request: {
        Args: { p_approver_id: string; p_reason?: string; p_request_id: string }
        Returns: boolean
      }
      track_daily_visit: { Args: { p_user_id: string }; Returns: undefined }
      track_page_visit: {
        Args: {
          p_page_path?: string
          p_referrer?: string
          p_session_id?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: undefined
      }
      transfer_class_creator: {
        Args: {
          p_class_id: string
          p_current_creator_id: string
          p_new_creator_email: string
        }
        Returns: boolean
      }
      transfer_class_creator_role: {
        Args: {
          p_class_id: string
          p_current_creator_id: string
          p_new_creator_email: string
        }
        Returns: boolean
      }
      update_user_points: {
        Args: { points_change: number; user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      user_rank: "bronze" | "silver" | "gold" | "platinum" | "diamond"
      user_role: "student" | "lecturer" | "admin" | "super_admin"
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
      user_rank: ["bronze", "silver", "gold", "platinum", "diamond"],
      user_role: ["student", "lecturer", "admin", "super_admin"],
    },
  },
} as const
