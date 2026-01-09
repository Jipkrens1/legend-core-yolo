import { useState } from 'react'
import { useStakeholders, useCreateStakeholder, useDeleteStakeholder } from '@/hooks/useStakeholders'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// Badge available for future use
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { 
  Plus, 
  Users,
  Mail,
  Phone,
  Building,
  Star,
  MoreHorizontal,
  Trash2,
} from 'lucide-react'
import { getInitials } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ProjectStakeholdersTabProps {
  projectId: string
}

export function ProjectStakeholdersTab({ projectId }: ProjectStakeholdersTabProps) {
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [newStakeholder, setNewStakeholder] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    organization: '',
    is_primary: false,
  })

  const { data: stakeholders, isLoading } = useStakeholders(projectId)
  const createMutation = useCreateStakeholder()
  const deleteMutation = useDeleteStakeholder()

  const handleCreate = async () => {
    if (!newStakeholder.name.trim()) return

    await createMutation.mutateAsync({
      project_id: projectId,
      name: newStakeholder.name,
      role: newStakeholder.role || null,
      email: newStakeholder.email || null,
      phone: newStakeholder.phone || null,
      organization: newStakeholder.organization || null,
      notes: null,
      is_primary: newStakeholder.is_primary,
    })

    setNewStakeholder({
      name: '',
      role: '',
      email: '',
      phone: '',
      organization: '',
      is_primary: false,
    })
    setShowNewDialog(false)
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync({ id, projectId })
  }

  // Separate primary and other stakeholders
  const primaryStakeholders = stakeholders?.filter(s => s.is_primary) || []
  const otherStakeholders = stakeholders?.filter(s => !s.is_primary) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-lg font-semibold">Stakeholders</h2>
          <p className="text-sm text-muted-foreground">
            {stakeholders?.length || 0} stakeholders
          </p>
        </div>
        <Button onClick={() => setShowNewDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Stakeholder toevoegen
        </Button>
      </div>

      {/* Stakeholders List */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : stakeholders && stakeholders.length > 0 ? (
        <div className="space-y-6">
          {/* Primary Contacts */}
          {primaryStakeholders.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Primaire contacten
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {primaryStakeholders.map((stakeholder) => (
                  <StakeholderCard
                    key={stakeholder.id}
                    stakeholder={stakeholder}
                    onDelete={() => handleDelete(stakeholder.id)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Other Stakeholders */}
          {otherStakeholders.length > 0 && (
            <div>
              {primaryStakeholders.length > 0 && (
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Overige stakeholders
                </h3>
              )}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {otherStakeholders.map((stakeholder) => (
                  <StakeholderCard
                    key={stakeholder.id}
                    stakeholder={stakeholder}
                    onDelete={() => handleDelete(stakeholder.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              Nog geen stakeholders toegevoegd
            </p>
            <Button onClick={() => setShowNewDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Eerste stakeholder toevoegen
            </Button>
          </CardContent>
        </Card>
      )}

      {/* New Stakeholder Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stakeholder toevoegen</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Naam *</Label>
              <Input
                id="name"
                placeholder="Volledige naam"
                value={newStakeholder.name}
                onChange={(e) => setNewStakeholder(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Input
                id="role"
                placeholder="Bijv. Product Owner"
                value={newStakeholder.role}
                onChange={(e) => setNewStakeholder(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="naam@bedrijf.nl"
                  value={newStakeholder.email}
                  onChange={(e) => setNewStakeholder(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefoon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+31 6 12345678"
                  value={newStakeholder.phone}
                  onChange={(e) => setNewStakeholder(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organization">Organisatie</Label>
              <Input
                id="organization"
                placeholder="Bedrijfsnaam"
                value={newStakeholder.organization}
                onChange={(e) => setNewStakeholder(prev => ({ ...prev, organization: e.target.value }))}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_primary"
                checked={newStakeholder.is_primary}
                onChange={(e) => setNewStakeholder(prev => ({ ...prev, is_primary: e.target.checked }))}
                className="rounded border-input"
              />
              <Label htmlFor="is_primary" className="font-normal cursor-pointer">
                Primair contact
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Annuleren
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!newStakeholder.name.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? 'Bezig...' : 'Toevoegen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface StakeholderCardProps {
  stakeholder: {
    id: string
    name: string
    role: string | null
    email: string | null
    phone: string | null
    organization: string | null
    is_primary: boolean
  }
  onDelete: () => void
}

function StakeholderCard({ stakeholder, onDelete }: StakeholderCardProps) {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{getInitials(stakeholder.name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{stakeholder.name}</p>
              {stakeholder.is_primary && (
                <Star className="h-4 w-4 text-yellow-500 shrink-0" />
              )}
            </div>
            
            {stakeholder.role && (
              <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
            )}
            
            <div className="flex flex-col gap-1 mt-2">
              {stakeholder.email && (
                <a 
                  href={`mailto:${stakeholder.email}`}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Mail className="h-3 w-3" />
                  {stakeholder.email}
                </a>
              )}
              {stakeholder.phone && (
                <a 
                  href={`tel:${stakeholder.phone}`}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  {stakeholder.phone}
                </a>
              )}
              {stakeholder.organization && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {stakeholder.organization}
                </span>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Verwijderen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
