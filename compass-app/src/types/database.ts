export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          client: string
          description: string | null
          status: 'active' | 'on_hold' | 'completed' | 'archived'
          owner: string | null
          project_type: string | null
          start_date: string | null
          end_date: string | null
          bcc_email: string | null
          user_id: string | null
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      client_profiles: {
        Row: {
          id: string
          project_id: string
          organization_type: string | null
          industry: string | null
          company_size: string | null
          communication_style: string | null
          decision_makers: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['client_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['client_profiles']['Insert']>
      }
      project_goals: {
        Row: {
          id: string
          project_id: string
          main_goal: string | null
          success_criteria: string | null
          must_haves: string[] | null
          nice_to_haves: string[] | null
          out_of_scope: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['project_goals']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['project_goals']['Insert']>
      }
      project_agreements: {
        Row: {
          id: string
          project_id: string
          budget: number | null
          budget_currency: string
          payment_model: string | null
          invoice_schedule: string | null
          payment_terms: string | null
          communication_channels: string[] | null
          meeting_frequency: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['project_agreements']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['project_agreements']['Insert']>
      }
      scope_items: {
        Row: {
          id: string
          project_id: string
          import_id: string | null
          requirement: string
          category: string | null
          priority: 'must' | 'should' | 'could' | 'wont' | null
          status: 'pending' | 'in_progress' | 'completed' | 'blocked' | null
          notes: string | null
          original_data: Json | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['scope_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['scope_items']['Insert']>
      }
      scope_imports: {
        Row: {
          id: string
          project_id: string
          source: string
          column_mapping: Json | null
          imported_at: string
          item_count: number
        }
        Insert: Omit<Database['public']['Tables']['scope_imports']['Row'], 'id' | 'imported_at'>
        Update: Partial<Database['public']['Tables']['scope_imports']['Insert']>
      }
      scope_changes: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          impact_time: string | null
          impact_budget: string | null
          impact_quality: string | null
          status: 'proposed' | 'approved' | 'rejected' | 'implemented'
          requested_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['scope_changes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['scope_changes']['Insert']>
      }
      scope_annotations: {
        Row: {
          id: string
          scope_item_id: string
          content: string
          author: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['scope_annotations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['scope_annotations']['Insert']>
      }
      phases: {
        Row: {
          id: string
          project_id: string
          name: string
          description: string | null
          start_date: string | null
          end_date: string | null
          status: 'planned' | 'active' | 'completed'
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['phases']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['phases']['Insert']>
      }
      milestones: {
        Row: {
          id: string
          phase_id: string
          project_id: string
          name: string
          description: string | null
          target_date: string | null
          completed_date: string | null
          status: 'pending' | 'completed' | 'missed'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['milestones']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['milestones']['Insert']>
      }
      meetings: {
        Row: {
          id: string
          project_id: string
          title: string
          date: string
          attendees: string[] | null
          agenda: string | null
          transcript: string | null
          summary: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['meetings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['meetings']['Insert']>
      }
      meeting_files: {
        Row: {
          id: string
          meeting_id: string
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['meeting_files']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['meeting_files']['Insert']>
      }
      action_items: {
        Row: {
          id: string
          project_id: string
          meeting_id: string | null
          title: string
          description: string | null
          owner: string | null
          deadline: string | null
          status: 'open' | 'in_progress' | 'completed' | 'cancelled'
          priority: 'high' | 'medium' | 'low'
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['action_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['action_items']['Insert']>
      }
      decisions: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          rationale: string | null
          status: 'proposed' | 'decided' | 'reversed'
          decided_by: string | null
          decided_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['decisions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['decisions']['Insert']>
      }
      stakeholders: {
        Row: {
          id: string
          project_id: string
          name: string
          role: string | null
          email: string | null
          phone: string | null
          organization: string | null
          notes: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['stakeholders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['stakeholders']['Insert']>
      }
      compliance_documents: {
        Row: {
          id: string
          project_id: string
          type: 'dpa' | 'sla' | 'nda' | 'dpia' | 'contract' | 'other'
          title: string
          description: string | null
          status: 'draft' | 'review' | 'signed' | 'expired'
          signed_date: string | null
          expiry_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['compliance_documents']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['compliance_documents']['Insert']>
      }
      compliance_files: {
        Row: {
          id: string
          document_id: string
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['compliance_files']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['compliance_files']['Insert']>
      }
      project_emails: {
        Row: {
          id: string
          project_id: string
          from_email: string
          from_name: string | null
          subject: string
          body_text: string | null
          body_html: string | null
          received_at: string
          message_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['project_emails']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['project_emails']['Insert']>
      }
      chat_sessions: {
        Row: {
          id: string
          project_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['chat_sessions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['chat_sessions']['Insert']>
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          sources: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['chat_messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['chat_messages']['Insert']>
      }
      internal_users: {
        Row: {
          id: string
          name: string
          email: string
          receive_reminders: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['internal_users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['internal_users']['Insert']>
      }
      email_settings: {
        Row: {
          id: string
          reminder_days: number[]
          reminder_time: string
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['email_settings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['email_settings']['Insert']>
      }
      jira_settings: {
        Row: {
          id: string
          cloud_id: string
          site_url: string
          api_token: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['jira_settings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['jira_settings']['Insert']>
      }
      jira_projects: {
        Row: {
          id: string
          jira_id: string
          key: string
          name: string
          project_type: string | null
          synced_at: string
        }
        Insert: Omit<Database['public']['Tables']['jira_projects']['Row'], 'id' | 'synced_at'>
        Update: Partial<Database['public']['Tables']['jira_projects']['Insert']>
      }
      jira_sprints: {
        Row: {
          id: string
          jira_id: number
          board_id: number
          name: string
          state: string
          start_date: string | null
          end_date: string | null
          synced_at: string
        }
        Insert: Omit<Database['public']['Tables']['jira_sprints']['Row'], 'id' | 'synced_at'>
        Update: Partial<Database['public']['Tables']['jira_sprints']['Insert']>
      }
      tempo_settings: {
        Row: {
          id: string
          api_token: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tempo_settings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tempo_settings']['Insert']>
      }
      tempo_worklogs: {
        Row: {
          id: string
          tempo_id: number
          issue_key: string
          author_account_id: string
          author_display_name: string
          time_spent_seconds: number
          started: string
          description: string | null
          synced_at: string
        }
        Insert: Omit<Database['public']['Tables']['tempo_worklogs']['Row'], 'id' | 'synced_at'>
        Update: Partial<Database['public']['Tables']['tempo_worklogs']['Insert']>
      }
      audit_log: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string
          old_values: Json | null
          new_values: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['audit_log']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['audit_log']['Insert']>
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>
      }
      teams: {
        Row: {
          id: string
          name: string
          slug: string
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['teams']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['teams']['Insert']>
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member' | 'viewer'
          joined_at: string
        }
        Insert: Omit<Database['public']['Tables']['team_members']['Row'], 'id' | 'joined_at'>
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json | null
          read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      comments: {
        Row: {
          id: string
          user_id: string
          entity_type: string
          entity_id: string
          content: string
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['comments']['Insert']>
      }
      activity_feed: {
        Row: {
          id: string
          project_id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string
          entity_name: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['activity_feed']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['activity_feed']['Insert']>
      }
      user_presence: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          status: 'online' | 'away' | 'offline'
          last_seen: string
        }
        Insert: Omit<Database['public']['Tables']['user_presence']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['user_presence']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience types
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type ClientProfile = Database['public']['Tables']['client_profiles']['Row']
export type ProjectGoals = Database['public']['Tables']['project_goals']['Row']
export type ProjectAgreements = Database['public']['Tables']['project_agreements']['Row']

export type ScopeItem = Database['public']['Tables']['scope_items']['Row']
export type ScopeChange = Database['public']['Tables']['scope_changes']['Row']
export type ScopeImport = Database['public']['Tables']['scope_imports']['Row']

export type Phase = Database['public']['Tables']['phases']['Row']
export type Milestone = Database['public']['Tables']['milestones']['Row']

export type Meeting = Database['public']['Tables']['meetings']['Row']
export type MeetingFile = Database['public']['Tables']['meeting_files']['Row']

export type ActionItem = Database['public']['Tables']['action_items']['Row']
export type Decision = Database['public']['Tables']['decisions']['Row']
export type Stakeholder = Database['public']['Tables']['stakeholders']['Row']

export type ComplianceDocument = Database['public']['Tables']['compliance_documents']['Row']
export type ComplianceFile = Database['public']['Tables']['compliance_files']['Row']

export type ProjectEmail = Database['public']['Tables']['project_emails']['Row']

export type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']

export type InternalUser = Database['public']['Tables']['internal_users']['Row']
export type EmailSettings = Database['public']['Tables']['email_settings']['Row']

export type JiraSettings = Database['public']['Tables']['jira_settings']['Row']
export type JiraProject = Database['public']['Tables']['jira_projects']['Row']
export type JiraSprint = Database['public']['Tables']['jira_sprints']['Row']

export type TempoSettings = Database['public']['Tables']['tempo_settings']['Row']
export type TempoWorklog = Database['public']['Tables']['tempo_worklogs']['Row']

export type AuditLog = Database['public']['Tables']['audit_log']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Team = Database['public']['Tables']['teams']['Row']
export type TeamMember = Database['public']['Tables']['team_members']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type ActivityFeed = Database['public']['Tables']['activity_feed']['Row']
export type UserPresence = Database['public']['Tables']['user_presence']['Row']
