import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Team, TeamMember } from '@/types/database'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'

interface TeamWithMembers extends Team {
  team_members: (TeamMember & {
    user_profiles: { full_name: string | null; avatar_url: string | null } | null
  })[]
}

export function useTeams() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['teams', user?.id],
    queryFn: async () => {
      if (!user) return []

      const { data, error } = await supabase
        .from('team_members')
        .select(`
          team_id,
          teams(*)
        `)
        .eq('user_id', user.id)

      if (error) throw error
      const typedData = data as { team_id: string; teams: Team | null }[]
      return typedData.map(d => d.teams).filter(Boolean) as Team[]
    },
    enabled: !!user,
  })
}

export function useTeam(teamId: string) {
  return useQuery({
    queryKey: ['teams', teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          team_members(
            *,
            user_profiles(full_name, avatar_url)
          )
        `)
        .eq('id', teamId)
        .single()

      if (error) throw error
      return data as TeamWithMembers
    },
    enabled: !!teamId,
  })
}

export function useCreateTeam() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error('Not authenticated')

      const slug = slugify(name)

      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name,
          slug,
          owner_id: user.id,
        } as never)
        .select()
        .single()

      if (teamError) throw teamError

      const createdTeam = team as Team
      
      // Add owner as member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: createdTeam.id,
          user_id: user.id,
          role: 'owner',
        } as never)

      if (memberError) throw memberError

      return createdTeam
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      toast.success('Team aangemaakt')
    },
    onError: (error) => {
      toast.error(`Fout: ${error.message}`)
    },
  })
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      teamId,
      email,
      role = 'member',
    }: {
      teamId: string
      email: string
      role?: 'admin' | 'member' | 'viewer'
    }) => {
      // Find user by email
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('email', email)
        .single()

      if (profileError || !profile) {
        throw new Error('Gebruiker niet gevonden')
      }

      const typedProfile = profile as { user_id: string }

      // Add to team
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: typedProfile.user_id,
          role,
        } as never)

      if (error) throw error
    },
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] })
      toast.success('Teamlid toegevoegd')
    },
    onError: (error) => {
      toast.error(`Fout: ${error.message}`)
    },
  })
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ teamId, userId }: { teamId: string; userId: string }) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId)

      if (error) throw error
    },
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] })
      toast.success('Teamlid verwijderd')
    },
    onError: (error) => {
      toast.error(`Fout: ${error.message}`)
    },
  })
}

export function useUpdateTeamMemberRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      teamId,
      userId,
      role,
    }: {
      teamId: string
      userId: string
      role: 'admin' | 'member' | 'viewer'
    }) => {
      const { error } = await supabase
        .from('team_members')
        .update({ role } as never)
        .eq('team_id', teamId)
        .eq('user_id', userId)

      if (error) throw error
    },
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] })
      toast.success('Rol bijgewerkt')
    },
    onError: (error) => {
      toast.error(`Fout: ${error.message}`)
    },
  })
}
