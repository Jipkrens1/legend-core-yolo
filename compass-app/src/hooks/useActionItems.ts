import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ActionItem } from '@/types/database'
import { toast } from 'sonner'

export function useActionItems(projectId: string | undefined) {
  return useQuery({
    queryKey: ['action-items', projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('Project ID is required')
      
      const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true })
      
      if (error) throw error
      return data as ActionItem[]
    },
    enabled: !!projectId,
  })
}

export function useCreateActionItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (item: Omit<ActionItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('action_items')
        .insert(item as never)
        .select()
        .single()
      
      if (error) throw error
      return data as ActionItem
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['action-items', data.project_id] })
      toast.success('Actie toegevoegd')
    },
    onError: (error) => {
      toast.error(`Fout bij toevoegen actie: ${error.message}`)
    },
  })
}

export function useUpdateActionItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ActionItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('action_items')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as ActionItem
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['action-items', data.project_id] })
    },
    onError: (error) => {
      toast.error(`Fout bij bijwerken actie: ${error.message}`)
    },
  })
}

export function useDeleteActionItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase
        .from('action_items')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return projectId
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({ queryKey: ['action-items', projectId] })
      toast.success('Actie verwijderd')
    },
    onError: (error) => {
      toast.error(`Fout bij verwijderen actie: ${error.message}`)
    },
  })
}

export function useReorderActionItems() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ items, projectId }: { items: { id: string; sort_order: number }[]; projectId: string }) => {
      const updates = items.map(item => 
        supabase
          .from('action_items')
          .update({ sort_order: item.sort_order } as never)
          .eq('id', item.id)
      )
      
      await Promise.all(updates)
      return projectId
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({ queryKey: ['action-items', projectId] })
    },
  })
}
