import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Project, ProjectInsert, ProjectUpdate } from '@/types/database'
import { toast } from 'sonner'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })
      
      if (error) throw error
      return data as Project[]
    },
  })
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      if (!id) throw new Error('Project ID is required')
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as Project
    },
    enabled: !!id,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (project: ProjectInsert) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(project as never)
        .select()
        .single()
      
      if (error) throw error
      return data as Project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project aangemaakt')
    },
    onError: (error) => {
      toast.error(`Fout bij aanmaken project: ${error.message}`)
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: ProjectUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Project
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', data.id] })
      toast.success('Project bijgewerkt')
    },
    onError: (error) => {
      toast.error(`Fout bij bijwerken project: ${error.message}`)
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project verwijderd')
    },
    onError: (error) => {
      toast.error(`Fout bij verwijderen project: ${error.message}`)
    },
  })
}

export function useArchiveProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('projects')
        .update({ status: 'archived' } as never)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Project
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', data.id] })
      toast.success('Project gearchiveerd')
    },
    onError: (error) => {
      toast.error(`Fout bij archiveren project: ${error.message}`)
    },
  })
}
