import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { AuditLog } from '@/types/database'

interface AuditLogWithUser extends AuditLog {
  user_profiles: {
    full_name: string | null
  } | null
}

export function useAuditLog(entityType?: string, entityId?: string, limit = 50) {
  return useQuery({
    queryKey: ['audit-log', entityType, entityId, limit],
    queryFn: async () => {
      let query = supabase
        .from('audit_log')
        .select(`
          *,
          user_profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (entityType) {
        query = query.eq('entity_type', entityType)
      }
      if (entityId) {
        query = query.eq('entity_id', entityId)
      }

      const { data, error } = await query
      if (error) throw error
      return data as AuditLogWithUser[]
    },
  })
}

export function useLogAudit() {
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({
      action,
      entityType,
      entityId,
      oldValues,
      newValues,
    }: {
      action: string
      entityType: string
      entityId: string
      oldValues?: Record<string, unknown>
      newValues?: Record<string, unknown>
    }) => {
      const { error } = await supabase
        .from('audit_log')
        .insert({
          user_id: user?.id || null,
          action,
          entity_type: entityType,
          entity_id: entityId,
          old_values: oldValues || null,
          new_values: newValues || null,
        } as never)

      if (error) throw error
    },
  })
}

// Audit log action types
export const auditActions = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  ARCHIVE: 'archive',
  RESTORE: 'restore',
  ASSIGN: 'assign',
  COMPLETE: 'complete',
  LOGIN: 'login',
  LOGOUT: 'logout',
} as const

// Format audit log entry for display
export function formatAuditEntry(entry: AuditLogWithUser): string {
  const userName = entry.user_profiles?.full_name || 'Systeem'
  const entityType = formatEntityType(entry.entity_type)
  const action = formatAction(entry.action)

  return `${userName} ${action} een ${entityType}`
}

function formatEntityType(type: string): string {
  const types: Record<string, string> = {
    project: 'project',
    action_item: 'actie',
    meeting: 'meeting',
    stakeholder: 'stakeholder',
    decision: 'besluit',
    scope_item: 'requirement',
    user: 'gebruiker',
    team: 'team',
  }
  return types[type] || type
}

function formatAction(action: string): string {
  const actions: Record<string, string> = {
    create: 'heeft aangemaakt',
    update: 'heeft bijgewerkt',
    delete: 'heeft verwijderd',
    archive: 'heeft gearchiveerd',
    restore: 'heeft hersteld',
    assign: 'heeft toegewezen',
    complete: 'heeft afgerond',
    login: 'heeft ingelogd',
    logout: 'heeft uitgelogd',
  }
  return actions[action] || action
}
