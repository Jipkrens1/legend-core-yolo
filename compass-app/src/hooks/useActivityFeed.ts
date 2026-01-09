import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { ActivityFeed } from '@/types/database'

interface ActivityWithUser extends ActivityFeed {
  user_profiles: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

export function useActivityFeed(projectId: string, limit = 20) {
  const queryClient = useQueryClient()

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activity-feed', projectId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_feed')
        .select(`
          *,
          user_profiles(full_name, avatar_url)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data as ActivityWithUser[]
    },
    enabled: !!projectId,
  })

  // Subscribe to real-time updates
  useQuery({
    queryKey: ['activity-subscription', projectId],
    queryFn: async () => {
      const channel = supabase
        .channel(`activity:${projectId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'activity_feed',
            filter: `project_id=eq.${projectId}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['activity-feed', projectId] })
          }
        )
        .subscribe()

      return () => supabase.removeChannel(channel)
    },
    enabled: !!projectId,
  })

  return { activities, isLoading }
}

export function useLogActivity() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      action,
      entityType,
      entityId,
      entityName,
      metadata,
    }: {
      projectId: string
      action: string
      entityType: string
      entityId: string
      entityName?: string
      metadata?: Record<string, unknown>
    }) => {
      const { data, error } = await supabase
        .from('activity_feed')
        .insert({
          project_id: projectId,
          user_id: user?.id || null,
          action,
          entity_type: entityType,
          entity_id: entityId,
          entity_name: entityName || null,
          metadata: metadata || null,
        } as never)
        .select()
        .single()

      if (error) throw error
      return data as ActivityFeed
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activity-feed', data.project_id] })
    },
  })
}

// Helper to format activity message
export function formatActivityMessage(activity: ActivityFeed): string {
  const entityTypes: Record<string, string> = {
    project: 'project',
    action_item: 'actie',
    meeting: 'meeting',
    stakeholder: 'stakeholder',
    decision: 'besluit',
    scope_item: 'requirement',
    comment: 'reactie',
  }

  const actions: Record<string, string> = {
    created: 'heeft aangemaakt',
    updated: 'heeft bijgewerkt',
    deleted: 'heeft verwijderd',
    completed: 'heeft afgerond',
    commented: 'heeft gereageerd op',
    assigned: 'heeft toegewezen',
    archived: 'heeft gearchiveerd',
    restored: 'heeft hersteld',
  }

  const entityType = entityTypes[activity.entity_type] || activity.entity_type
  const action = actions[activity.action] || activity.action

  if (activity.entity_name) {
    return `${action} ${entityType} "${activity.entity_name}"`
  }
  return `${action} een ${entityType}`
}
