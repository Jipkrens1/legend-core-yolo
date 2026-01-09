import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Meeting, MeetingFile } from '@/types/database'
import { toast } from 'sonner'

export function useMeetings(projectId: string | undefined) {
  return useQuery({
    queryKey: ['meetings', projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('Project ID is required')
      
      const { data, error } = await supabase
        .from('meetings')
        .select('*, meeting_files(*)')
        .eq('project_id', projectId)
        .order('date', { ascending: false })
      
      if (error) throw error
      return data as (Meeting & { meeting_files: MeetingFile[] })[]
    },
    enabled: !!projectId,
  })
}

export function useMeeting(id: string | undefined) {
  return useQuery({
    queryKey: ['meetings', 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error('Meeting ID is required')
      
      const { data, error } = await supabase
        .from('meetings')
        .select('*, meeting_files(*)')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as Meeting & { meeting_files: MeetingFile[] }
    },
    enabled: !!id,
  })
}

export function useCreateMeeting() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('meetings')
        .insert(meeting as never)
        .select()
        .single()
      
      if (error) throw error
      return data as Meeting
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meetings', data.project_id] })
      toast.success('Meeting toegevoegd')
    },
    onError: (error) => {
      toast.error(`Fout bij toevoegen meeting: ${error.message}`)
    },
  })
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Meeting> & { id: string }) => {
      const { data, error } = await supabase
        .from('meetings')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Meeting
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meetings', data.project_id] })
      queryClient.invalidateQueries({ queryKey: ['meetings', 'detail', data.id] })
      toast.success('Meeting bijgewerkt')
    },
    onError: (error) => {
      toast.error(`Fout bij bijwerken meeting: ${error.message}`)
    },
  })
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return projectId
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({ queryKey: ['meetings', projectId] })
      toast.success('Meeting verwijderd')
    },
    onError: (error) => {
      toast.error(`Fout bij verwijderen meeting: ${error.message}`)
    },
  })
}
