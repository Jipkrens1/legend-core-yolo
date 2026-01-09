import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useProjects, useDeleteProject } from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// Badge available for future use
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ArrowLeft,
  Users,
  Mail,
  Archive,
  Trash2,
  RefreshCw,
  Plus,
  AlertTriangle,
} from 'lucide-react'
// formatDate available for future use
import { toast } from 'sonner'
import type { InternalUser } from '@/types/database'

export function AdminPage() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Instellingen</h1>
            <p className="text-muted-foreground">
              Beheer je Compass configuratie
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Gebruikers
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="mr-2 h-4 w-4" />
              E-mail
            </TabsTrigger>
            <TabsTrigger value="archive">
              <Archive className="mr-2 h-4 w-4" />
              Archief
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4 mt-6">
            <InternalUsersSection />
          </TabsContent>

          <TabsContent value="email" className="space-y-4 mt-6">
            <EmailSettingsSection />
          </TabsContent>

          <TabsContent value="archive" className="space-y-4 mt-6">
            <ArchivedProjectsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function InternalUsersSection() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '' })
  const queryClient = useQueryClient()

  const { data: users, isLoading } = useQuery({
    queryKey: ['internal-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('internal_users')
        .select('*')
        .order('name', { ascending: true })
      if (error) throw error
      return data as InternalUser[]
    },
  })

  const createMutation = useMutation({
    mutationFn: async (user: { name: string; email: string }) => {
      const { data, error } = await supabase
        .from('internal_users')
        .insert(user as never)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-users'] })
      setShowAddDialog(false)
      setNewUser({ name: '', email: '' })
      toast.success('Gebruiker toegevoegd')
    },
    onError: (error) => {
      toast.error(`Fout: ${error.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('internal_users')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-users'] })
      toast.success('Gebruiker verwijderd')
    },
  })

  const toggleRemindersMutation = useMutation({
    mutationFn: async ({ id, receive_reminders }: { id: string; receive_reminders: boolean }) => {
      const { error } = await supabase
        .from('internal_users')
        .update({ receive_reminders } as never)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-users'] })
    },
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Interne gebruikers</CardTitle>
            <CardDescription>
              Teamleden die deadline herinneringen kunnen ontvangen
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Toevoegen
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : users && users.length > 0 ? (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`reminders-${user.id}`} className="text-sm">
                      Herinneringen
                    </Label>
                    <Switch
                      id={`reminders-${user.id}`}
                      checked={user.receive_reminders}
                      onCheckedChange={(checked) => 
                        toggleRemindersMutation.mutate({ id: user.id, receive_reminders: checked })
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(user.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Nog geen interne gebruikers
          </p>
        )}
      </CardContent>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gebruiker toevoegen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Naam</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Volledige naam"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder="naam@bedrijf.nl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Annuleren
            </Button>
            <Button
              onClick={() => createMutation.mutate(newUser)}
              disabled={!newUser.name || !newUser.email || createMutation.isPending}
            >
              Toevoegen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

interface EmailSettingsData {
  id: string
  enabled: boolean
  reminder_time: string
}

function EmailSettingsSection() {
  const queryClient = useQueryClient()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['email-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .single()
      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
      return data as EmailSettingsData | null
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<{ enabled: boolean; reminder_time: string }>) => {
      if (settings?.id) {
        const { error } = await supabase
          .from('email_settings')
          .update(updates as never)
          .eq('id', settings.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('email_settings')
          .insert({ ...updates } as never)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-settings'] })
      toast.success('Instellingen opgeslagen')
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>E-mail instellingen</CardTitle>
        <CardDescription>
          Configureer deadline herinneringen en notificaties
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Herinneringen inschakelen</p>
                <p className="text-sm text-muted-foreground">
                  Verstuur automatisch herinneringen voor deadlines
                </p>
              </div>
              <Switch
                checked={settings?.enabled ?? true}
                onCheckedChange={(enabled) => updateMutation.mutate({ enabled })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reminder_time">Verzendtijd</Label>
              <Input
                id="reminder_time"
                type="time"
                value={settings?.reminder_time ?? '09:00'}
                onChange={(e) => updateMutation.mutate({ reminder_time: e.target.value })}
                className="w-32"
              />
              <p className="text-sm text-muted-foreground">
                Tijdstip waarop herinneringen worden verstuurd
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Herinneringsmomenten</p>
              <p className="text-sm text-muted-foreground">
                Herinneringen worden verstuurd: 0, 1, 3 en 7 dagen voor de deadline
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function ArchivedProjectsSection() {
  const { data: projects, isLoading } = useProjects()
  const deleteProject = useDeleteProject()
  const queryClient = useQueryClient()
  
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const archivedProjects = projects?.filter(p => p.status === 'archived') || []

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'active' } as never)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project hersteld')
    },
  })

  const handleDelete = async (id: string) => {
    await deleteProject.mutateAsync(id)
    setDeleteConfirm(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gearchiveerde projecten</CardTitle>
        <CardDescription>
          Beheer en herstel gearchiveerde projecten
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : archivedProjects.length > 0 ? (
          <div className="space-y-3">
            {archivedProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => restoreMutation.mutate(project.id)}
                    disabled={restoreMutation.isPending}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Herstellen
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteConfirm(project.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Geen gearchiveerde projecten
          </p>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Project definitief verwijderen?
            </DialogTitle>
            <DialogDescription>
              Dit kan niet ongedaan worden gemaakt. Alle gegevens van dit project worden permanent verwijderd.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Annuleren
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleteProject.isPending}
            >
              {deleteProject.isPending ? 'Bezig...' : 'Definitief verwijderen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
