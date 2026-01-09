import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Stakeholder } from '@/types/database'
import { toast } from 'sonner'

export function useStakeholders(projectId: string | undefined) {
  return useQuery({
    queryKey: ['stakeholders', projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('Project ID is required')
      
      const { data, error } = await supabase
        .from('stakeholders')
        .select('*')
        .eq('project_id', projectId)
        .order('is_primary', { ascending: false })
        .order('name', { ascending: true })
      
      if (error) throw error
      return data as Stakeholder[]
    },
    enabled: !!projectId,
  })
}

export function useCreateStakeholder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (stakeholder: Omit<Stakeholder, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('stakeholders')
        .insert(stakeholder as never)
        .select()
        .single()
      
      if (error) throw error
      return data as Stakeholder
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stakeholders', data.project_id] })
      toast.success('Stakeholder toegevoegd')
    },
    onError: (error) => {
      toast.error(`Fout bij toevoegen stakeholder: ${error.message}`)
    },
  })
}

export function useUpdateStakeholder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Stakeholder> & { id: string }) => {
      const { data, error } = await supabase
        .from('stakeholders')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Stakeholder
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stakeholders', data.project_id] })
      toast.success('Stakeholder bijgewerkt')
    },
    onError: (error) => {
      toast.error(`Fout bij bijwerken stakeholder: ${error.message}`)
    },
  })
}

export function useDeleteStakeholder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase
        .from('stakeholders')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return projectId
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({ queryKey: ['stakeholders', projectId] })
      toast.success('Stakeholder verwijderd')
    },
    onError: (error) => {
      toast.error(`Fout bij verwijderen stakeholder: ${error.message}`)
    },
  })
}
