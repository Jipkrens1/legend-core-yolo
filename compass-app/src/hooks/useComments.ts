import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Comment } from '@/types/database'
import { toast } from 'sonner'

interface CommentWithAuthor extends Comment {
  user_profiles: {
    full_name: string | null
    avatar_url: string | null
  } | null
  replies?: CommentWithAuthor[]
}

export function useComments(entityType: string, entityId: string) {
  const queryClient = useQueryClient()

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', entityType, entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user_profiles(full_name, avatar_url)
        `)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: true })

      if (error) throw error
      
      // Organize into tree structure
      const commentMap = new Map<string, CommentWithAuthor>()
      const rootComments: CommentWithAuthor[] = []
      const typedData = data as CommentWithAuthor[]

      typedData.forEach((comment) => {
        commentMap.set(comment.id, { ...comment, replies: [] })
      })

      typedData.forEach((comment) => {
        const mappedComment = commentMap.get(comment.id)!
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id)
          if (parent) {
            parent.replies = parent.replies || []
            parent.replies.push(mappedComment)
          }
        } else {
          rootComments.push(mappedComment)
        }
      })

      return rootComments
    },
    enabled: !!entityType && !!entityId,
  })

  // Subscribe to real-time updates
  useQuery({
    queryKey: ['comments-subscription', entityType, entityId],
    queryFn: async () => {
      const channel = supabase
        .channel(`comments:${entityType}:${entityId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'comments',
            filter: `entity_type=eq.${entityType}`,
          },
          (payload) => {
            if ((payload.new as Comment)?.entity_id === entityId || 
                (payload.old as Comment)?.entity_id === entityId) {
              queryClient.invalidateQueries({ queryKey: ['comments', entityType, entityId] })
            }
          }
        )
        .subscribe()

      return () => supabase.removeChannel(channel)
    },
    enabled: !!entityType && !!entityId,
  })

  return { comments, isLoading }
}

export function useCreateComment() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      entityType,
      entityId,
      content,
      parentId,
    }: {
      entityType: string
      entityId: string
      content: string
      parentId?: string
    }) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          entity_type: entityType,
          entity_id: entityId,
          content,
          parent_id: parentId || null,
        } as never)
        .select(`
          *,
          user_profiles(full_name, avatar_url)
        `)
        .single()

      if (error) throw error
      return data as CommentWithAuthor
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.entity_type, data.entity_id] })
      toast.success('Reactie geplaatst')
    },
    onError: (error) => {
      toast.error(`Fout: ${error.message}`)
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, entityType, entityId }: { id: string; entityType: string; entityId: string }) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { entityType, entityId }
    },
    onSuccess: ({ entityType, entityId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', entityType, entityId] })
      toast.success('Reactie verwijderd')
    },
    onError: (error) => {
      toast.error(`Fout: ${error.message}`)
    },
  })
}
