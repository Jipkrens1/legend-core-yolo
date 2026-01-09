import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Notification } from '@/types/database'
import { toast } from 'sonner'

export function useNotifications() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data as Notification[]
    },
    enabled: !!user,
  })

  // Subscribe to new notifications
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const notification = payload.new as Notification
          queryClient.invalidateQueries({ queryKey: ['notifications', user.id] })
          
          // Show toast for new notifications
          toast(notification.title, {
            description: notification.message,
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, queryClient])

  const unreadCount = notifications?.filter(n => !n.read).length || 0

  return { notifications, isLoading, unreadCount }
}

export function useMarkNotificationRead() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true } as never)
        .eq('id', notificationId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!user) return

      const { error } = await supabase
        .from('notifications')
        .update({ read: true } as never)
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
    },
  })
}

export function useCreateNotification() {
  return useMutation({
    mutationFn: async ({
      userId,
      type,
      title,
      message,
      data,
    }: {
      userId: string
      type: string
      title: string
      message: string
      data?: Record<string, unknown>
    }) => {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data: data || null,
          read: false,
        } as never)

      if (error) throw error
    },
  })
}

// Notification type helpers
export const notificationTypes = {
  ACTION_DUE: 'action_due',
  ACTION_ASSIGNED: 'action_assigned',
  MEETING_REMINDER: 'meeting_reminder',
  COMMENT_REPLY: 'comment_reply',
  MENTION: 'mention',
  PROJECT_UPDATE: 'project_update',
  DECISION_MADE: 'decision_made',
  SCOPE_CHANGE: 'scope_change',
} as const

export function getNotificationIcon(type: string) {
  switch (type) {
    case notificationTypes.ACTION_DUE:
      return 'clock'
    case notificationTypes.ACTION_ASSIGNED:
      return 'user-plus'
    case notificationTypes.MEETING_REMINDER:
      return 'calendar'
    case notificationTypes.COMMENT_REPLY:
      return 'message-square'
    case notificationTypes.MENTION:
      return 'at-sign'
    case notificationTypes.PROJECT_UPDATE:
      return 'folder'
    case notificationTypes.DECISION_MADE:
      return 'check-circle'
    case notificationTypes.SCOPE_CHANGE:
      return 'git-branch'
    default:
      return 'bell'
  }
}
