import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Decision } from '@/types/database'
import { toast } from 'sonner'

export function useDecisions(projectId: string | undefined) {
  return useQuery({
    queryKey: ['decisions', projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('Project ID is required')
      
      const { data, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Decision[]
    },
    enabled: !!projectId,
  })
}

export function useCreateDecision() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (decision: Omit<Decision, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('decisions')
        .insert(decision as never)
        .select()
        .single()
      
      if (error) throw error
      return data as Decision
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['decisions', data.project_id] })
      toast.success('Besluit toegevoegd')
    },
    onError: (error) => {
      toast.error(`Fout bij toevoegen besluit: ${error.message}`)
    },
  })
}

export function useUpdateDecision() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Decision> & { id: string }) => {
      const { data, error } = await supabase
        .from('decisions')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Decision
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['decisions', data.project_id] })
      toast.success('Besluit bijgewerkt')
    },
    onError: (error) => {
      toast.error(`Fout bij bijwerken besluit: ${error.message}`)
    },
  })
}

export function useDeleteDecision() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase
        .from('decisions')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return projectId
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({ queryKey: ['decisions', projectId] })
      toast.success('Besluit verwijderd')
    },
    onError: (error) => {
      toast.error(`Fout bij verwijderen besluit: ${error.message}`)
    },
  })
}
