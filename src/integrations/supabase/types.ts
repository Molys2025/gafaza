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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      applications: {
        Row: {
          additional_contact: string | null
          applicant_details: Json | null
          availability_end: string | null
          availability_start: string | null
          completion_date: string | null
          completion_notes: string | null
          contact_preference: string | null
          contract_details: Json | null
          cover_letter: string | null
          created_at: string
          expected_salary: number | null
          id: string
          interview_date: string | null
          interview_location: string | null
          interview_notes: string | null
          is_team_application: boolean | null
          job_id: string | null
          job_seeker_id: string | null
          provider_notes: Json | null
          provider_response: string | null
          responded_at: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          team_members: Json[] | null
          team_size: number | null
          updated_at: string
          withdrawn_at: string | null
          work_rating: number | null
          worker_rating: number | null
        }
        Insert: {
          additional_contact?: string | null
          applicant_details?: Json | null
          availability_end?: string | null
          availability_start?: string | null
          completion_date?: string | null
          completion_notes?: string | null
          contact_preference?: string | null
          contract_details?: Json | null
          cover_letter?: string | null
          created_at?: string
          expected_salary?: number | null
          id?: string
          interview_date?: string | null
          interview_location?: string | null
          interview_notes?: string | null
          is_team_application?: boolean | null
          job_id?: string | null
          job_seeker_id?: string | null
          provider_notes?: Json | null
          provider_response?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          team_members?: Json[] | null
          team_size?: number | null
          updated_at?: string
          withdrawn_at?: string | null
          work_rating?: number | null
          worker_rating?: number | null
        }
        Update: {
          additional_contact?: string | null
          applicant_details?: Json | null
          availability_end?: string | null
          availability_start?: string | null
          completion_date?: string | null
          completion_notes?: string | null
          contact_preference?: string | null
          contract_details?: Json | null
          cover_letter?: string | null
          created_at?: string
          expected_salary?: number | null
          id?: string
          interview_date?: string | null
          interview_location?: string | null
          interview_notes?: string | null
          is_team_application?: boolean | null
          job_id?: string | null
          job_seeker_id?: string | null
          provider_notes?: Json | null
          provider_response?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          team_members?: Json[] | null
          team_size?: number | null
          updated_at?: string
          withdrawn_at?: string | null
          work_rating?: number | null
          worker_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "active_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_seeker_id_fkey"
            columns: ["job_seeker_id"]
            isOneToOne: false
            referencedRelation: "job_seeker_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_seeker_id_fkey"
            columns: ["job_seeker_id"]
            isOneToOne: false
            referencedRelation: "job_seekers"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          job_id: string | null
          last_message_at: string | null
          metadata: Json | null
          participant1_id: string | null
          participant2_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          job_id?: string | null
          last_message_at?: string | null
          metadata?: Json | null
          participant1_id?: string | null
          participant2_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          job_id?: string | null
          last_message_at?: string | null
          metadata?: Json | null
          participant1_id?: string | null
          participant2_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "active_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant1_id_fkey"
            columns: ["participant1_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant1_id_fkey"
            columns: ["participant1_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant2_id_fkey"
            columns: ["participant2_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant2_id_fkey"
            columns: ["participant2_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      group_invites: {
        Row: {
          created_at: string
          expires_at: string | null
          group_id: string | null
          id: string
          invitee_id: string | null
          inviter_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          group_id?: string | null
          id?: string
          invitee_id?: string | null
          inviter_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          group_id?: string | null
          id?: string
          invitee_id?: string | null
          inviter_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_invites_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "active_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invites_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invites_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "my_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invites_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invites_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invites_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invites_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string | null
          id: string
          invited_by: string | null
          is_muted: boolean | null
          joined_at: string
          last_read_message_id: string | null
          muted_until: string | null
          notification_preferences: Json | null
          role: Database["public"]["Enums"]["group_member_role"] | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          invited_by?: string | null
          is_muted?: boolean | null
          joined_at?: string
          last_read_message_id?: string | null
          muted_until?: string | null
          notification_preferences?: Json | null
          role?: Database["public"]["Enums"]["group_member_role"] | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          invited_by?: string | null
          is_muted?: boolean | null
          joined_at?: string
          last_read_message_id?: string | null
          muted_until?: string | null
          notification_preferences?: Json | null
          role?: Database["public"]["Enums"]["group_member_role"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "active_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "my_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_last_read_message_id_fkey"
            columns: ["last_read_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          avatar_url: string | null
          cover_image_url: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          group_type: Database["public"]["Enums"]["group_type"] | null
          id: string
          is_active: boolean | null
          is_private: boolean | null
          job_id: string | null
          max_members: number | null
          name: string
          region: string | null
          rules: string[] | null
          settings: Json | null
          tags: string[] | null
          updated_at: string
          work_provider_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          group_type?: Database["public"]["Enums"]["group_type"] | null
          id?: string
          is_active?: boolean | null
          is_private?: boolean | null
          job_id?: string | null
          max_members?: number | null
          name: string
          region?: string | null
          rules?: string[] | null
          settings?: Json | null
          tags?: string[] | null
          updated_at?: string
          work_provider_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          group_type?: Database["public"]["Enums"]["group_type"] | null
          id?: string
          is_active?: boolean | null
          is_private?: boolean | null
          job_id?: string | null
          max_members?: number | null
          name?: string
          region?: string | null
          rules?: string[] | null
          settings?: Json | null
          tags?: string[] | null
          updated_at?: string
          work_provider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "active_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_work_provider_id_fkey"
            columns: ["work_provider_id"]
            isOneToOne: false
            referencedRelation: "work_provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_work_provider_id_fkey"
            columns: ["work_provider_id"]
            isOneToOne: false
            referencedRelation: "work_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      job_seekers: {
        Row: {
          active_status: boolean | null
          availability_end: string | null
          availability_start: string | null
          bio: string | null
          created_at: string
          daily_rate: number | null
          experience_years: number | null
          full_name: string
          id: string
          languages: string[] | null
          last_active: string | null
          phone: string | null
          preferred_regions: string[] | null
          profile_picture: string | null
          rating: number | null
          skills: string[] | null
          total_ratings: number | null
          updated_at: string
          verified: boolean | null
          whatsapp: string | null
        }
        Insert: {
          active_status?: boolean | null
          availability_end?: string | null
          availability_start?: string | null
          bio?: string | null
          created_at?: string
          daily_rate?: number | null
          experience_years?: number | null
          full_name: string
          id: string
          languages?: string[] | null
          last_active?: string | null
          phone?: string | null
          preferred_regions?: string[] | null
          profile_picture?: string | null
          rating?: number | null
          skills?: string[] | null
          total_ratings?: number | null
          updated_at?: string
          verified?: boolean | null
          whatsapp?: string | null
        }
        Update: {
          active_status?: boolean | null
          availability_end?: string | null
          availability_start?: string | null
          bio?: string | null
          created_at?: string
          daily_rate?: number | null
          experience_years?: number | null
          full_name?: string
          id?: string
          languages?: string[] | null
          last_active?: string | null
          phone?: string | null
          preferred_regions?: string[] | null
          profile_picture?: string | null
          rating?: number | null
          skills?: string[] | null
          total_ratings?: number | null
          updated_at?: string
          verified?: boolean | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          additional_benefits: Json | null
          application_deadline: string | null
          applications_count: number | null
          city: string | null
          closed_at: string | null
          created_at: string
          description: string | null
          end_date: string
          estimated_quantity: number | null
          experience_required: number | null
          facilities: Json | null
          flexible_dates: boolean | null
          id: string
          job_type: Database["public"]["Enums"]["job_type"]
          location_address: string | null
          location_coordinates: unknown
          max_applications: number | null
          metadata: Json | null
          olive_types: string[] | null
          payment_amount: number
          payment_frequency: string | null
          payment_type: Database["public"]["Enums"]["job_payment_type"]
          property_size: number | null
          published_at: string | null
          region: string | null
          requirements: Json | null
          saved_count: number | null
          skills_required: string[] | null
          start_date: string
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          tree_count: number | null
          updated_at: string
          views_count: number | null
          work_provider_id: string | null
          workers_hired: number | null
          workers_needed: number
          working_hours: Json | null
        }
        Insert: {
          additional_benefits?: Json | null
          application_deadline?: string | null
          applications_count?: number | null
          city?: string | null
          closed_at?: string | null
          created_at?: string
          description?: string | null
          end_date: string
          estimated_quantity?: number | null
          experience_required?: number | null
          facilities?: Json | null
          flexible_dates?: boolean | null
          id?: string
          job_type: Database["public"]["Enums"]["job_type"]
          location_address?: string | null
          location_coordinates?: unknown
          max_applications?: number | null
          metadata?: Json | null
          olive_types?: string[] | null
          payment_amount: number
          payment_frequency?: string | null
          payment_type: Database["public"]["Enums"]["job_payment_type"]
          property_size?: number | null
          published_at?: string | null
          region?: string | null
          requirements?: Json | null
          saved_count?: number | null
          skills_required?: string[] | null
          start_date: string
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          tree_count?: number | null
          updated_at?: string
          views_count?: number | null
          work_provider_id?: string | null
          workers_hired?: number | null
          workers_needed: number
          working_hours?: Json | null
        }
        Update: {
          additional_benefits?: Json | null
          application_deadline?: string | null
          applications_count?: number | null
          city?: string | null
          closed_at?: string | null
          created_at?: string
          description?: string | null
          end_date?: string
          estimated_quantity?: number | null
          experience_required?: number | null
          facilities?: Json | null
          flexible_dates?: boolean | null
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          location_address?: string | null
          location_coordinates?: unknown
          max_applications?: number | null
          metadata?: Json | null
          olive_types?: string[] | null
          payment_amount?: number
          payment_frequency?: string | null
          payment_type?: Database["public"]["Enums"]["job_payment_type"]
          property_size?: number | null
          published_at?: string | null
          region?: string | null
          requirements?: Json | null
          saved_count?: number | null
          skills_required?: string[] | null
          start_date?: string
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          tree_count?: number | null
          updated_at?: string
          views_count?: number | null
          work_provider_id?: string | null
          workers_hired?: number | null
          workers_needed?: number
          working_hours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_work_provider_id_fkey"
            columns: ["work_provider_id"]
            isOneToOne: false
            referencedRelation: "work_provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_work_provider_id_fkey"
            columns: ["work_provider_id"]
            isOneToOne: false
            referencedRelation: "work_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          application_id: string | null
          content: string | null
          conversation_id: string | null
          created_at: string
          deleted_at: string | null
          delivered_at: string | null
          edit_history: Json[] | null
          group_id: string | null
          id: string
          is_edited: boolean | null
          is_system_message: boolean | null
          job_id: string | null
          location: Json | null
          media_type: string | null
          media_url: string | null
          mentions: string[] | null
          message_type: Database["public"]["Enums"]["message_type"] | null
          metadata: Json | null
          reactions: Json | null
          read_at: string | null
          receiver_id: string | null
          reply_to_id: string | null
          sender_id: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          system_message_type: string | null
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          content?: string | null
          conversation_id?: string | null
          created_at?: string
          deleted_at?: string | null
          delivered_at?: string | null
          edit_history?: Json[] | null
          group_id?: string | null
          id?: string
          is_edited?: boolean | null
          is_system_message?: boolean | null
          job_id?: string | null
          location?: Json | null
          media_type?: string | null
          media_url?: string | null
          mentions?: string[] | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          metadata?: Json | null
          reactions?: Json | null
          read_at?: string | null
          receiver_id?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          system_message_type?: string | null
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          content?: string | null
          conversation_id?: string | null
          created_at?: string
          deleted_at?: string | null
          delivered_at?: string | null
          edit_history?: Json[] | null
          group_id?: string | null
          id?: string
          is_edited?: boolean | null
          is_system_message?: boolean | null
          job_id?: string | null
          location?: Json | null
          media_type?: string | null
          media_url?: string | null
          mentions?: string[] | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          metadata?: Json | null
          reactions?: Json | null
          read_at?: string | null
          receiver_id?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          system_message_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "my_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "recent_conversations"
            referencedColumns: ["conversation_id"]
          },
          {
            foreignKeyName: "messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "active_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "my_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "active_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          email_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          email_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          email_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          data: Json
          id: string
          is_read: boolean
          link: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          data?: Json
          id?: string
          is_read?: boolean
          link?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          data?: Json
          id?: string
          is_read?: boolean
          link?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          application_id: string | null
          comment: string | null
          created_at: string
          id: string
          improvement_points: string[] | null
          is_hidden: boolean | null
          is_reported: boolean | null
          is_verified: boolean | null
          job_id: string | null
          metadata: Json | null
          positive_points: string[] | null
          rated_id: string | null
          rater_id: string | null
          rating_type: Database["public"]["Enums"]["rating_type"]
          report_reason: string | null
          response: string | null
          response_date: string | null
          scores: Json
          updated_at: string
          verification_notes: string | null
        }
        Insert: {
          application_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          improvement_points?: string[] | null
          is_hidden?: boolean | null
          is_reported?: boolean | null
          is_verified?: boolean | null
          job_id?: string | null
          metadata?: Json | null
          positive_points?: string[] | null
          rated_id?: string | null
          rater_id?: string | null
          rating_type: Database["public"]["Enums"]["rating_type"]
          report_reason?: string | null
          response?: string | null
          response_date?: string | null
          scores?: Json
          updated_at?: string
          verification_notes?: string | null
        }
        Update: {
          application_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          improvement_points?: string[] | null
          is_hidden?: boolean | null
          is_reported?: boolean | null
          is_verified?: boolean | null
          job_id?: string | null
          metadata?: Json | null
          positive_points?: string[] | null
          rated_id?: string | null
          rater_id?: string | null
          rating_type?: Database["public"]["Enums"]["rating_type"]
          report_reason?: string | null
          response?: string | null
          response_date?: string | null
          scores?: Json
          updated_at?: string
          verification_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "my_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "active_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rated_id_fkey"
            columns: ["rated_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rated_id_fkey"
            columns: ["rated_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rater_id_fkey"
            columns: ["rater_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rater_id_fkey"
            columns: ["rater_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          city: string | null
          coordinates: unknown
          created_at: string
          deleted_at: string | null
          email: string
          email_verified: boolean | null
          first_name: string | null
          id: string
          last_login: string | null
          last_name: string | null
          login_count: number | null
          metadata: Json | null
          notification_preferences: Json | null
          phone: string | null
          phone_verified: boolean | null
          postal_code: string | null
          preferred_language:
            | Database["public"]["Enums"]["user_language"]
            | null
          profile_picture: string | null
          region: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"] | null
          stripe_customer_id: string | null
          subscription_ends_at: string | null
          subscription_tier: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          coordinates?: unknown
          created_at?: string
          deleted_at?: string | null
          email: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
          login_count?: number | null
          metadata?: Json | null
          notification_preferences?: Json | null
          phone?: string | null
          phone_verified?: boolean | null
          postal_code?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["user_language"]
            | null
          profile_picture?: string | null
          region?: string | null
          role: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"] | null
          stripe_customer_id?: string | null
          subscription_ends_at?: string | null
          subscription_tier?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          coordinates?: unknown
          created_at?: string
          deleted_at?: string | null
          email?: string
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
          login_count?: number | null
          metadata?: Json | null
          notification_preferences?: Json | null
          phone?: string | null
          phone_verified?: boolean | null
          postal_code?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["user_language"]
            | null
          profile_picture?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"] | null
          stripe_customer_id?: string | null
          subscription_ends_at?: string | null
          subscription_tier?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      work_providers: {
        Row: {
          access_instructions: string | null
          average_rating: number | null
          business_name: string | null
          business_type: string | null
          created_at: string
          facilities: Json | null
          harvest_seasons: Json[] | null
          id: string
          insurance_info: Json | null
          olive_types: string[] | null
          payment_terms: string | null
          preferred_payment_methods:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          property_address: string | null
          property_coordinates: unknown
          property_size: number | null
          property_type: Database["public"]["Enums"]["property_type"] | null
          tax_id: string | null
          total_hires: number | null
          total_jobs_posted: number | null
          total_ratings: number | null
          tree_count: number | null
          typical_daily_rate: number | null
          typical_work_hours: Json | null
          updated_at: string
          verification_documents: string[] | null
          verified: boolean | null
          worker_requirements: Json | null
        }
        Insert: {
          access_instructions?: string | null
          average_rating?: number | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string
          facilities?: Json | null
          harvest_seasons?: Json[] | null
          id: string
          insurance_info?: Json | null
          olive_types?: string[] | null
          payment_terms?: string | null
          preferred_payment_methods?:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          property_address?: string | null
          property_coordinates?: unknown
          property_size?: number | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          tax_id?: string | null
          total_hires?: number | null
          total_jobs_posted?: number | null
          total_ratings?: number | null
          tree_count?: number | null
          typical_daily_rate?: number | null
          typical_work_hours?: Json | null
          updated_at?: string
          verification_documents?: string[] | null
          verified?: boolean | null
          worker_requirements?: Json | null
        }
        Update: {
          access_instructions?: string | null
          average_rating?: number | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string
          facilities?: Json | null
          harvest_seasons?: Json[] | null
          id?: string
          insurance_info?: Json | null
          olive_types?: string[] | null
          payment_terms?: string | null
          preferred_payment_methods?:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          property_address?: string | null
          property_coordinates?: unknown
          property_size?: number | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          tax_id?: string | null
          total_hires?: number | null
          total_jobs_posted?: number | null
          total_ratings?: number | null
          tree_count?: number | null
          typical_daily_rate?: number | null
          typical_work_hours?: Json | null
          updated_at?: string
          verification_documents?: string[] | null
          verified?: boolean | null
          worker_requirements?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      active_groups: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          description: string | null
          group_type: Database["public"]["Enums"]["group_type"] | null
          id: string | null
          is_member: boolean | null
          member_count: number | null
          message_count: number | null
          name: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          group_type?: Database["public"]["Enums"]["group_type"] | null
          id?: string | null
          is_member?: never
          member_count?: never
          message_count?: never
          name?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          group_type?: Database["public"]["Enums"]["group_type"] | null
          id?: string | null
          is_member?: never
          member_count?: never
          message_count?: never
          name?: string | null
        }
        Relationships: []
      }
      active_jobs: {
        Row: {
          city: string | null
          end_date: string | null
          id: string | null
          job_type: Database["public"]["Enums"]["job_type"] | null
          payment_amount: number | null
          payment_type: Database["public"]["Enums"]["job_payment_type"] | null
          region: string | null
          start_date: string | null
          title: string | null
          work_provider_name: string | null
          work_provider_rating: number | null
          workers_needed: number | null
        }
        Relationships: []
      }
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_name: string | null
          applicant_rating: number | null
          created_at: string | null
          experience_years: number | null
          id: string | null
          job_title: string | null
          status: Database["public"]["Enums"]["application_status"] | null
        }
        Relationships: []
      }
      job_seeker_profiles: {
        Row: {
          active_status: boolean | null
          daily_rate: number | null
          experience_years: number | null
          full_name: string | null
          id: string | null
          languages: string[] | null
          preferred_regions: string[] | null
          rating: number | null
          skills: string[] | null
          total_ratings: number | null
          verified: boolean | null
        }
        Insert: {
          active_status?: boolean | null
          daily_rate?: number | null
          experience_years?: number | null
          full_name?: string | null
          id?: string | null
          languages?: string[] | null
          preferred_regions?: string[] | null
          rating?: number | null
          skills?: string[] | null
          total_ratings?: number | null
          verified?: boolean | null
        }
        Update: {
          active_status?: boolean | null
          daily_rate?: number | null
          experience_years?: number | null
          full_name?: string | null
          id?: string | null
          languages?: string[] | null
          preferred_regions?: string[] | null
          rating?: number | null
          skills?: string[] | null
          total_ratings?: number | null
          verified?: boolean | null
        }
        Relationships: []
      }
      my_applications: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string | null
          job_title: string | null
          payment_amount: number | null
          payment_type: Database["public"]["Enums"]["job_payment_type"] | null
          start_date: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          work_provider_name: string | null
        }
        Relationships: []
      }
      my_groups: {
        Row: {
          description: string | null
          group_type: Database["public"]["Enums"]["group_type"] | null
          id: string | null
          last_message: string | null
          my_role: Database["public"]["Enums"]["group_member_role"] | null
          name: string | null
          unread_count: number | null
        }
        Relationships: []
      }
      public_ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string | null
          job_title: string | null
          overall_rating: string | null
          rated_name: string | null
          rating_type: Database["public"]["Enums"]["rating_type"] | null
        }
        Relationships: []
      }
      recent_conversations: {
        Row: {
          conversation_id: string | null
          job_title: string | null
          last_message: string | null
          last_message_at: string | null
          other_participant_id: string | null
          other_participant_name: string | null
          other_participant_picture: string | null
          unread_count: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          city: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          profile_picture: string | null
          region: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["user_status"] | null
        }
        Insert: {
          city?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          profile_picture?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
        }
        Update: {
          city?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          profile_picture?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
        }
        Relationships: []
      }
      user_ratings_summary: {
        Row: {
          average_rating: number | null
          avg_communication: number | null
          avg_professionalism: number | null
          avg_punctuality: number | null
          avg_quality: number | null
          avg_reliability: number | null
          rated_id: string | null
          rating_type: Database["public"]["Enums"]["rating_type"] | null
          total_ratings: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_rated_id_fkey"
            columns: ["rated_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rated_id_fkey"
            columns: ["rated_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      work_provider_profiles: {
        Row: {
          average_rating: number | null
          business_name: string | null
          city: string | null
          id: string | null
          property_size: number | null
          property_type: Database["public"]["Enums"]["property_type"] | null
          region: string | null
          total_ratings: number | null
          typical_daily_rate: number | null
          verified: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      complete_application: {
        Args: { application_id_param: string }
        Returns: undefined
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      export_my_data: { Args: never; Returns: Json }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_current_user_id: { Args: never; Returns: string }
      get_current_user_role: { Args: never; Returns: string }
      get_group_unread_count: {
        Args: { group_id_param: string; user_id_param: string }
        Returns: number
      }
      get_nearby_jobs: {
        Args: {
          coordinates: unknown
          distance_meters: number
          job_type_filter?: Database["public"]["Enums"]["job_type"]
        }
        Returns: {
          distance: number
          job_id: string
          payment_amount: number
          payment_type: Database["public"]["Enums"]["job_payment_type"]
          start_date: string
          title: string
        }[]
      }
      get_nearby_users: {
        Args: {
          distance_meters: number
          user_coordinates: unknown
          user_role?: Database["public"]["Enums"]["user_role"]
        }
        Returns: {
          distance: number
          first_name: string
          id: string
          last_name: string
        }[]
      }
      get_nearby_work_providers: {
        Args: {
          coordinates: unknown
          distance_meters: number
          min_rating?: number
        }
        Returns: {
          average_rating: number
          business_name: string
          distance: number
          id: string
          property_type: Database["public"]["Enums"]["property_type"]
        }[]
      }
      get_or_create_conversation: {
        Args: { job_id_param?: string; user1_id: string; user2_id: string }
        Returns: string
      }
      gettransactionid: { Args: never; Returns: unknown }
      is_group_admin: {
        Args: { group_id_param: string; user_id_param: string }
        Returns: boolean
      }
      is_group_member: {
        Args: { group_id_param: string; user_id_param: string }
        Returns: boolean
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      mark_message_as_read: {
        Args: { message_id_param: string }
        Returns: undefined
      }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      soft_delete_user: { Args: never; Returns: undefined }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      application_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "withdrawn"
        | "completed"
        | "cancelled"
      group_member_role: "admin" | "moderator" | "member"
      group_type: "work_team" | "region_group" | "project_group" | "general"
      job_payment_type: "hourly" | "daily" | "fixed" | "per_kg"
      job_status:
        | "draft"
        | "active"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "expired"
      job_type: "harvest" | "pruning" | "maintenance" | "transport" | "other"
      message_status: "sent" | "delivered" | "read" | "deleted"
      message_type: "text" | "image" | "document" | "location" | "system"
      payment_method: "hourly" | "daily" | "fixed" | "per_kg"
      property_type: "farm" | "grove" | "field" | "other"
      rating_category:
        | "professionalism"
        | "communication"
        | "reliability"
        | "quality"
        | "punctuality"
        | "payment"
        | "facilities"
        | "overall"
      rating_type: "work_provider" | "job_seeker" | "job"
      user_language: "fr" | "ar" | "en"
      user_role: "work_provider" | "job_seeker" | "admin"
      user_status: "active" | "inactive" | "suspended" | "pending_verification"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      application_status: [
        "pending",
        "accepted",
        "rejected",
        "withdrawn",
        "completed",
        "cancelled",
      ],
      group_member_role: ["admin", "moderator", "member"],
      group_type: ["work_team", "region_group", "project_group", "general"],
      job_payment_type: ["hourly", "daily", "fixed", "per_kg"],
      job_status: [
        "draft",
        "active",
        "in_progress",
        "completed",
        "cancelled",
        "expired",
      ],
      job_type: ["harvest", "pruning", "maintenance", "transport", "other"],
      message_status: ["sent", "delivered", "read", "deleted"],
      message_type: ["text", "image", "document", "location", "system"],
      payment_method: ["hourly", "daily", "fixed", "per_kg"],
      property_type: ["farm", "grove", "field", "other"],
      rating_category: [
        "professionalism",
        "communication",
        "reliability",
        "quality",
        "punctuality",
        "payment",
        "facilities",
        "overall",
      ],
      rating_type: ["work_provider", "job_seeker", "job"],
      user_language: ["fr", "ar", "en"],
      user_role: ["work_provider", "job_seeker", "admin"],
      user_status: ["active", "inactive", "suspended", "pending_verification"],
    },
  },
} as const
