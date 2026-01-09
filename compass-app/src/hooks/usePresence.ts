import { useEffect, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { UserPresence } from '@/types/database'

export function usePresence(projectId?: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Update user presence
  const updatePresence = useCallback(async (status: 'online' | 'away' | 'offline') => {
    if (!user) return

    const { error } = await supabase
      .from('user_presence')
      .upsert({
        user_id: user.id,
        project_id: projectId || null,
        status,
        last_seen: new Date().toISOString(),
      } as never, {
        onConflict: 'user_id',
      })

    if (error) console.error('Error updating presence:', error)
  }, [user, projectId])

  // Set up presence tracking
  useEffect(() => {
    if (!user) return

    // Set online when component mounts
    updatePresence('online')

    // Set up visibility change listener
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence('away')
      } else {
        updatePresence('online')
      }
    }

    // Set up before unload listener
    const handleBeforeUnload = () => {
      updatePresence('offline')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Heartbeat every 30 seconds
    const heartbeat = setInterval(() => {
      updatePresence(document.hidden ? 'away' : 'online')
    }, 30000)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      clearInterval(heartbeat)
      updatePresence('offline')
    }
  }, [user, updatePresence])

  // Subscribe to presence changes for the project
  useEffect(() => {
    if (!projectId) return

    const channel = supabase
      .channel(`presence:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['presence', projectId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, queryClient])

  return { updatePresence }
}

export function useProjectPresence(projectId: string) {
  return useQuery({
    queryKey: ['presence', projectId],
    queryFn: async () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      
      const { data, error } = await supabase
        .from('user_presence')
        .select(`
          *,
          user_profiles(full_name, avatar_url)
        `)
        .eq('project_id', projectId)
        .gte('last_seen', fiveMinutesAgo)
        .neq('status', 'offline')

      if (error) throw error
      return data as (UserPresence & { user_profiles: { full_name: string; avatar_url: string } | null })[]
    },
    enabled: !!projectId,
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}
